// Builds the PUBLIC static projection of the canonical knowledge explorer.
// Run from workspace root: node planning/pages/build-public.mjs
// This script never deploys, pushes, or enables GitHub Pages.
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createLegacyUiData } from "../../knowledge/ui-compat-adapter.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const wiki = join(root, "planning/wiki");
const outDir = join(here, "public");
const readJ = path => JSON.parse(readFileSync(path, "utf8"));
const allowlist = readJ(join(here, "public-data-allowlist.json"));
const base = createLegacyUiData(root);
const { findings, evidence, suggestions, decisions, phases, timeline, graph, repos, branches, commits, pullRequests, issues, testResults, contributions, sections, issueSections, issuesIndex, sectionMeta } = base;

// ── Allowlist field picker ──
const redact = s => {
  let r = s;
  r = r.replace(/[A-Za-z]:\\[^\s"']*/g, "[local-path]");
  r = r.replace(/\\\\[^\\\s"']*\\/g, "[local-path]");
  for (const pat of allowlist.globalExcludes) {
    if (r.includes(pat)) r = r.split(pat).join("[redacted]");
  }
  return r;
};
const pick = (obj, fields) => {
  const out = {};
  for (const field of fields) {
    if (obj && obj[field] !== undefined) {
      let value = obj[field];
      if (typeof value === "string") value = redact(value);
      out[field] = value;
    }
  }
  return out;
};
const col = (name, rows, allowedFields) => {
  const spec = allowlist.collections[name] || {};
  if (spec.allowed === false) return [];
  return (rows || []).map(row => pick(row, allowedFields || spec.allowedFields || []));
};

const PRIVATE_URL_RE = /system-compass/;
const repoName = (() => { try { return require("child_process").execSync("git config --get remote.origin.url", { cwd: root }).toString().trim().match(/([^/:]+)\.git$/)?.[1] || "Ix-findings"; } catch { return "Ix-findings"; } })();
const BASE_PATH = "/" + repoName;
const publicGraph = (() => {
  const nodes = (graph.nodes || [])
    .filter(node => node.type !== "worktree")
    .map(node => pick(node, allowlist.collections.graph.nodes.allowedFields))
    .map(node => {
      if (node.url && PRIVATE_URL_RE.test(node.url)) node.url = null;
      return node;
    });
  const ids = new Set(nodes.map(node => node.id));
  const edges = (graph.edges || [])
    .map(edge => pick(edge, allowlist.collections.graph.edges.allowedFields))
    .filter(edge => ids.has(edge.source) && ids.has(edge.target));
  return { nodes, edges };
})();

const data = {
  meta: {
    title: "Ix / Compass Investigation — Knowledge Wiki",
    snapshotLabel: allowlist.labeling.siteLabel,
    generated: base.meta.generated,
    sourceRevision: base.meta.sourceRevision,
    phase: "EXECUTION",
    entityCounts: {
      repositories: repos.length,
      branches: branches.length,
      worktrees: 0,
      commits: commits.length,
      findings: findings.length,
      evidence: evidence.length,
      decisions: decisions.length,
      suggestions: suggestions.length,
      prs: pullRequests.length,
      issues: issues.length,
      contributions: contributions.length,
      graphNodes: publicGraph.nodes.length,
      graphEdges: publicGraph.edges.length,
    },
    dataFreshness: {
      canonical: base.meta.generated,
      sourceRevision: base.meta.sourceRevision,
      tests: testResults.tests || "unknown",
    },
    published: { note: "Sanitized public projection — internal fields and local paths excluded by allowlist." },
  },
  findings: col("findings", findings),
  evidence: col("evidence", evidence),
  suggestions: col("suggestions", suggestions),
  decisions: col("decisions", decisions),
  phases: col("phases", phases),
  timeline: col("timeline", timeline),
  graph: publicGraph,
  repos: col("repositories", repos),
  branches: col("branches", branches),
  commits: col("commits", commits),
  worktrees: [],
  pullRequests: col("pullRequests", pullRequests),
  issues: col("issues", issues).map(issue => PRIVATE_URL_RE.test(issue.url || "") ? { ...issue, url: null, access: "PRIVATE" } : issue),
  testResults: pick(testResults, allowlist.collections.testResults.allowedFields),
  contributions: col("contributions", contributions),
  sections: sections || [],
  issueSections: issueSections || [],
  issuesIndex: issuesIndex || [],
  sectionMeta: sectionMeta || {},
  staleClaims: [],
  sysCompass: { access: "PRIVATE", published: false, note: "Source inaccessible; findings retained at public status level only." },
};

// Preserve the existing public stale-claim surface without reading private manifest data.
try {
  const source = readFileSync(join(root, "CLI-HANDOFF/STALE-CLAIMS.md"), "utf8");
  const re = /\|\s*\*\*?(S-\d+)\*\*?\s*\|([^|]*)/g;
  let match;
  while ((match = re.exec(source)) !== null) {
    data.staleClaims.push({ id: match[1], description: redact(match[2].trim().slice(0, 120)) });
  }
} catch { /* optional historical source */ }

mkdirSync(join(outDir, "data"), { recursive: true });
mkdirSync(join(outDir, "assets"), { recursive: true });
const js = `// GENERATED by planning/pages/build-public.mjs through knowledge/ui-compat-adapter.mjs — sanitized projection.
// Do not edit by hand. Internal/private fields are excluded per public-data-allowlist.json.
window.IX_DATA = ${JSON.stringify(data, null, 2)};`;
writeFileSync(join(outDir, "data/data.js"), js, "utf8");

if (existsSync(join(wiki, "index.html"))) cpSync(join(wiki, "index.html"), join(outDir, "index.html"));
if (existsSync(join(wiki, "assets/wiki.css"))) cpSync(join(wiki, "assets/wiki.css"), join(outDir, "assets/wiki.css"));
if (existsSync(join(wiki, "assets/wiki.js"))) cpSync(join(wiki, "assets/wiki.js"), join(outDir, "assets/wiki.js"));
if (existsSync(join(wiki, "assets/sections.js"))) cpSync(join(wiki, "assets/sections.js"), join(outDir, "assets/sections.js"));

// Deep-link SPA fallback: GitHub Pages serves 404.html for any unknown path,
// so arbitrary-depth graph routes (/mcp/implementation/stdio/protocol, /prs/393/security)
// load the app and re-route through the hash router. Base path is repo-aware.
const appHtml = readFileSync(join(outDir, "index.html"), "utf8");
const deepLinkHtml = appHtml
  .replace(/<title>[^<]*<\/title>/, `<title>Ix / Compass Investigation — Knowledge Wiki</title>`)
  .replace(/<script src="data\/data\.js"><\/script>/, `<script>window.IX_BASE = ${JSON.stringify(BASE_PATH)};(function(){var p=location.pathname;var b=${JSON.stringify(BASE_PATH)};var rest=b&&p.indexOf(b)===0?p.slice(b.length):p;rest=rest.replace(/^\\/+/, "");if(rest&&rest.indexOf("#")!==0){location.replace(b+"/#"+(rest.split("?")[0].replace(/\\/$/, "")));}})();</script><script src="data/data.js"></script>`);
writeFileSync(join(outDir, "404.html"), deepLinkHtml, "utf8");

// ── Static sub-pages ──
// Each graph section and issue gets a physical index.html so GitHub Pages serves
// real path URLs (/mcp/implementation, /issues/219) with no redirect. Asset
// references are depth-relative; sections.js renders the marked section directly.
function shellFor(path) {
  const segments = path.split("/").filter(Boolean).length;
  const rel = segments > 0 ? "../".repeat(segments) : "";
  const title = "Ix / Compass Investigation — Knowledge Wiki";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="Ix / Compass investigation knowledge graph — section ${path}.">
<link rel="stylesheet" href="${rel}assets/wiki.css">
</head>
<body>
<div id="app">
  <header id="topbar">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-title">IX / COMPASS</span>
      <span class="brand-sub">investigation knowledge base</span>
    </div>
    <div class="search-wrap">
      <input id="search" type="search" placeholder="Search findings, repos, commits, PRs, symbols, SHAs…" autocomplete="off" spellcheck="false">
    </div>
    <div class="topbar-right">
      <span id="phase-badge" class="badge">EXECUTION</span>
    </div>
  </header>
  <div id="layout">
    <nav id="sidebar" aria-label="Views">
      <div class="nav-group-label">Explore</div>
      <a class="nav-item" href="${rel}">✳ Overview</a>
      <a class="nav-item" href="${rel}#/map">⌗ Investigation Map</a>
      <a class="nav-item" href="${rel}#/findings">✦ Findings</a>
      <a class="nav-item" href="${rel}#/prs">⇄ Pull Requests</a>
      <a class="nav-item" href="${rel}#/issues">⚠ Issues</a>
      <a class="nav-item" href="${rel}#/contributions">⚡ Contributions</a>
      <div class="nav-group-label">Graph sections</div>
      ${(data.sections || []).map(s => `<a class="nav-item" href="${rel}${s.graph_path.slice(1)}">${s.graph_path}</a>`).join("\n      ")}
      <div class="nav-group-label">Issues</div>
      ${(data.issuesIndex || []).map(i => `<a class="nav-item" href="${rel}issues/${i.number}">Issue #${i.number}</a>`).join("\n      ")}
    </nav>
    <main id="view">
      <div id="breadcrumb" class="breadcrumb"></div>
      <section id="content" class="content"></section>
    </main>
  </div>
  <aside id="drawer" class="drawer" aria-label="Detail">
    <div class="drawer-head">
      <span id="drawer-title">Detail</span>
      <button id="drawer-close" aria-label="Close">×</button>
    </div>
    <div id="drawer-body" class="drawer-body"></div>
  </aside>
</div>
<script>window.IX_SECTION = ${JSON.stringify(path)};</script>
<script src="${rel}data/data.js"></script>
<script src="${rel}assets/wiki.js"></script>
<script src="${rel}assets/sections.js"></script>
</body>
</html>
`;
}
const writePage = (path) => {
  const target = join(outDir, ...path.replace(/^\//, "").split("/"), "index.html");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, shellFor(path), "utf8");
};
const sectionPaths = (data.sections || []).map(s => s.graph_path);
const issuePaths = (data.issueSections || []).map(s => s.graph_path);
const indexPaths = new Set([...sectionPaths, ...issuePaths]);
for (const path of indexPaths) writePage(path);
if ((data.issuesIndex || []).length) writeFileSync(join(outDir, "issues", "index.html"), shellFor("/issues"), "utf8");
console.log("Wrote static sub-pages: " + indexPaths.size + " sections + " + ((data.issuesIndex || []).length ? "issues/" : "") + " (" + [...indexPaths].join(", ") + ")");

console.log(`Wrote planning/pages/public/ (graph ${data.graph.nodes.length}/${data.graph.edges.length}, findings ${data.findings.length}, evidence ${data.evidence.length}, ${js.length} bytes data)`);
console.log("PUBLIC PROJECTION BUILT — NOT DEPLOYED. Pages workflow remains disabled.");
