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
const BASE_URL = "https://alot1z.github.io" + BASE_PATH;
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
if (existsSync(join(wiki, "assets/entity-view.js"))) cpSync(join(wiki, "assets/entity-view.js"), join(outDir, "assets/entity-view.js"));

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
function shellFor(path, { entityId } = {}) {
  const segments = path.split("/").filter(Boolean).length;
  const rel = segments > 0 ? "../".repeat(segments) : "";
  const title = "Ix / Compass Investigation — Knowledge Wiki";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="Ix / Compass investigation knowledge graph — ${path}.">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: title, url: BASE_URL + path, description: "Ix / Compass investigation knowledge graph — " + path + "." })}</script>
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
      <div class="nav-group-label">LLM / Corpus</div>
      <a class="nav-item" href="${rel}llms.txt">llms.txt — entry point</a>
      <a class="nav-item" href="${rel}llms-full.txt">llms-full.txt — full corpus</a>
      <a class="nav-item" href="${rel}graph.json">graph.json</a>
      <a class="nav-item" href="${rel}entities.json">entities.json</a>
      <a class="nav-item" href="${rel}search.json">search.json</a>
      <a class="nav-item" href="${rel}routes.json">routes.json</a>
      <a class="nav-item" href="${rel}sitemap.xml">sitemap.xml</a>
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
${entityId ? `<script>window.IX_ENTITY = ${JSON.stringify(entityId)};</script>
<script src="${rel}assets/entity-view.js"></script>` : ""}
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

// ═══════════════════════════════════════════════════════════════════════════
// Machine-readable corpus, route registry, and canonical entity pages.
// Every artifact below is derived from the same sanitized `data` object, so
// the website, graph export, LLM corpus, and indexes cannot diverge.
// ═══════════════════════════════════════════════════════════════════════════
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const slugify = id => String(id || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "entity";

// Canonical URL map for every addressable entity id.
const canonicalUrl = new Map();
for (const s of data.sections || []) canonicalUrl.set(s.id, s.graph_path.replace(/\/+$/, ""));
for (const s of data.issueSections || []) canonicalUrl.set(`ISSUE-${s.issue}`, s.graph_path.replace(/\/+$/, ""));
for (const s of data.sections || []) {
  const m = String(s.graph_path || "").match(/^\/prs\/(\d+)/);
  if (m) canonicalUrl.set(`PR-${m[1]}`, s.graph_path.replace(/\/+$/, ""));
}
canonicalUrl.set("issues", "/issues");
const entityUrl = id => canonicalUrl.get(id) || `/entities/${slugify(id)}`;

// Route registry: every physical page + every machine file.
const routes = [];
const addRoute = (path, kind, title) => routes.push({ path, kind, title, url: BASE_URL + path });
addRoute("/", "home", "Ix-findings knowledge base");
for (const s of data.sections || []) addRoute(s.graph_path.replace(/\/+$/, ""), "section", s.title);
for (const s of data.issueSections || []) addRoute(s.graph_path.replace(/\/+$/, ""), "issue", s.issue_title || `Issue #${s.issue}`);
addRoute("/issues", "index", "Open issues");
addRoute("/entities", "index", "Entity index");

// File index from every section's and issue's verified file refs.
const fileMap = new Map();
for (const s of [...(data.sections || []), ...(data.issueSections || [])]) {
  for (const f of s.file_refs || []) {
    if (!f || !f.path) continue;
    const repo = f.repository || s.repository || "";
    const key = `${repo}/${f.commit || ""}/${f.path}`;
    if (fileMap.has(key)) continue;
    const range = f.start_line ? `#L${f.start_line}${f.end_line && f.end_line !== f.start_line ? `-L${f.end_line}` : ""}` : "";
    fileMap.set(key, { path: f.path, repository: repo, commit: f.commit || "", symbol: f.symbol || "", start_line: f.start_line, end_line: f.end_line, url: f.url || `https://github.com/${repo}/blob/${f.commit || "main"}/${f.path}${range}` });
  }
}
const filesIndex = [...fileMap.values()];

const graphNodes = data.graph?.nodes || [];
const graphEdges = data.graph?.edges || [];
const nodeById = new Map(graphNodes.map(n => [n.id, n]));
const sectionIds = new Set(data.sections.map(s => s.id));
const servedIds = new Set([
  ...sectionIds,
  ...data.issueSections.map(s => `ISSUE-${s.issue}`),
  ...data.sections.map(s => String(s.graph_path || "").match(/^\/prs\/(\d+)/)?.[1]).filter(Boolean).map(n => `PR-${n}`),
]);

// Complete entity index with canonical URLs.
const entitiesIndex = [];
for (const n of graphNodes) entitiesIndex.push({ id: n.id, type: n.type, title: n.title, status: n.status || "", url: BASE_URL + entityUrl(n.id) });
for (const s of data.sections || []) if (!entitiesIndex.some(e => e.id === s.id)) entitiesIndex.push({ id: s.id, type: "section", title: s.title, status: s.status || "", url: BASE_URL + entityUrl(s.id) });
for (const s of data.issueSections || []) { const id = `ISSUE-${s.issue}`; if (!entitiesIndex.some(e => e.id === id)) entitiesIndex.push({ id, type: "issue", title: s.issue_title || `Issue #${s.issue}`, status: s.state || "", url: BASE_URL + entityUrl(id) }); }
entitiesIndex.sort((a, b) => a.id.localeCompare(b.id));

const writeJsonFile = (name, value) => writeFileSync(join(outDir, name), JSON.stringify(value, null, 2) + "\n", "utf8");

// ── Canonical entity pages + per-entity data.json ──
const entityPagesWritten = [];
for (const n of graphNodes) {
  if (servedIds.has(n.id)) continue;
  const path = entityUrl(n.id);
  addRoute(path, n.type || "entity", n.title || n.id);
  const relationships = graphEdges.filter(e => e.source === n.id || e.target === n.id).map(e => {
    const other = e.source === n.id ? e.target : e.source;
    const otherNode = nodeById.get(other);
    return { direction: e.source === n.id ? "out" : "in", relationship: e.relationship, other, other_type: otherNode?.type || "", other_title: otherNode?.title || other, other_url: BASE_URL + entityUrl(other) };
  });
  const entityData = { id: n.id, type: n.type, title: n.title, status: n.status || "", url: BASE_URL + path, summary: n, relationships };
  const entityDir = join(outDir, ...path.split("/"));
  mkdirSync(entityDir, { recursive: true });
  writeFileSync(join(entityDir, "data.json"), JSON.stringify(entityData, null, 2) + "\n", "utf8");
  writeFileSync(join(entityDir, "index.html"), shellFor(path, { entityId: n.id }), "utf8");
  entityPagesWritten.push(n.id);
}

// Entity index page (physical listing of every canonical entity).
{
  const rows = entitiesIndex.map(e => `<li><a href="${esc(e.url.replace(BASE_URL, "")).replace(/^\//, "")}/">${esc(e.title)}</a> <span class="faint">(${esc(e.type)}${e.status ? " · " + esc(e.status) : ""})</span></li>`).join("\n");
  const idxHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Entity index — Ix / Compass Investigation</title>
<meta name="description" content="Index of every canonical entity in the Ix / Compass investigation knowledge base.">
<link rel="stylesheet" href="../assets/wiki.css">
</head>
<body>
<div id="app">
  <main id="view">
    <div class="breadcrumb"><span class="crumb">IX Compass</span><span class="sep"> / </span><span class="crumb active">Entity index</span></div>
    <section id="content" class="content">
      <h1>Entity index</h1>
      <p class="lede">Every canonical entity in the Ix / Compass investigation knowledge base — ${entitiesIndex.length} entities. Each links to a stable canonical page and machine-readable data.json.</p>
      <ul>${rows}</ul>
    </section>
  </main>
</div>
</body>
</html>\n`;
  mkdirSync(join(outDir, "entities"), { recursive: true });
  writeFileSync(join(outDir, "entities", "index.html"), idxHtml, "utf8");
}

// ── JSON indexes ──
const meta = { generated: base.meta.generated, sourceRevision: base.meta.sourceRevision, count: 0 };
const indexed = (name, items) => writeJsonFile(name, { meta: { ...meta, count: items.length }, items });
indexed("entities.json", entitiesIndex);
indexed("findings.json", data.findings || []);
indexed("evidence.json", data.evidence || []);
indexed("repositories.json", data.repos || []);
indexed("files.json", filesIndex);
indexed("commits.json", data.commits || []);
indexed("issues.json", data.issues || []);
indexed("pull-requests.json", data.pullRequests || []);
indexed("phases.json", data.phases || []);
indexed("suggestions.json", data.suggestions || []);
indexed("decisions.json", data.decisions || []);
indexed("timeline.json", data.timeline || []);
indexed("sections.json", data.sections || []);
indexed("routes.json", routes);

// graph.json — canonical graph export.
writeJsonFile("graph.json", { version: "1", generated: base.meta.generated, source_revision: base.meta.sourceRevision, base_url: BASE_URL, entities: entitiesIndex.map(({ id, type, title, status, url }) => ({ id, type, title, status, url })), relations: graphEdges.map(e => ({ source: e.source, target: e.target, relationship: e.relationship })) });

// search.json — tokenized search index over the full corpus.
{
  const searchIndex = [];
  const seen = new Set();
  const push = (id, type, title, status, text, relPath) => {
    if (seen.has(id)) return; seen.add(id);
    searchIndex.push({ id, type, title, status: status || "", url: BASE_URL + relPath, terms: `${id} ${title} ${type} ${status || ""} ${text || ""}`.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 1) });
  };
  for (const e of entitiesIndex) push(e.id, e.type, e.title, e.status, e.title, e.url.replace(BASE_URL, ""));
  for (const f of data.findings || []) push(f.id, "finding", f.title, f.status, `${f.summary || ""} ${f.recommendation || ""}`, entityUrl(f.id));
  for (const e of data.evidence || []) push(e.id, "evidence", e.title, e.class, e.detail, entityUrl(e.id));
  for (const d of data.decisions || []) push(d.id, "decision", d.title, d.status, `${d.context || ""} ${d.rationale || ""}`, entityUrl(d.id));
  for (const s of data.suggestions || []) push(s.id, "suggestion", s.text, s.disposition, s.reason, entityUrl(s.id));
  for (const f of filesIndex) push(`FILE:${f.repository}:${f.path}`, "file", f.path, "", f.symbol, f.url);
  writeJsonFile("search.json", { meta: { ...meta, count: searchIndex.length }, items: searchIndex });
}

// ── sitemap.xml + robots.txt ──
{
  const pageRoutes = routes.filter(r => r.kind !== "file");
  const urlset = pageRoutes.map(r => `  <url><loc>${esc(r.url)}</loc><lastmod>${esc(String(base.meta.generated).slice(0, 10))}</lastmod></url>`).join("\n");
  writeFileSync(join(outDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`, "utf8");
  writeFileSync(join(outDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`, "utf8");
}

// ── llms.txt — LLM entry point ──
{
  const corpusFiles = ["llms.txt", "llms-full.txt", "sitemap.xml", "robots.txt", "graph.json", "entities.json", "findings.json", "evidence.json", "repositories.json", "files.json", "commits.json", "issues.json", "pull-requests.json", "phases.json", "suggestions.json", "decisions.json", "timeline.json", "sections.json", "routes.json", "search.json"];
  const lines = [
    "> Ix-findings — investigation knowledge base for the Ix / Compass ecosystem",
    "",
    "Ix-findings is a canonical, machine-readable knowledge graph of an independent investigation into the ix-infrastructure/Ix CLI and its ecosystem: findings, evidence, issues, pull requests, commits, repositories, phases, and implementation artifacts.",
    "",
    "One canonical model powers every representation (website, graph, LLM corpus). Stable URLs are deterministic: sections, issues, and PRs use /mcp, /issues/219, /prs/393 style paths; all other entities use /entities/<id> pages with /entities/<id>/data.json machine files.",
    "",
    "Start here:",
    `- ${BASE_URL}/llms-full.txt — complete structured corpus (every entity, relationships, provenance)`,
    `- ${BASE_URL}/graph.json — canonical graph export (entities + relations)`,
    `- ${BASE_URL}/entities.json — every entity with its canonical URL`,
    `- ${BASE_URL}/routes.json — every generated route (pages + machine files)`,
    `- ${BASE_URL}/search.json — tokenized search index`,
    `- ${BASE_URL}/sitemap.xml — all canonical pages`,
    "",
    "Entity indexes:",
  ].concat(corpusFiles.map(f => f === "llms.txt" ? null : `- ${BASE_URL}/${f}`).filter(Boolean), [
    "",
    "Traversal: start at llms-full.txt or graph.json, resolve any entity id to its canonical URL, and follow relationships (finding → evidence → file → commit → PR → issue) as machine-readable links.",
    "",
  ]);
  writeFileSync(join(outDir, "llms.txt"), lines.join("\n"), "utf8");
}

// ── llms-full.txt — complete structured corpus ──
{
  const blocks = [];
  const block = fields => blocks.push("## ENTITY\n" + Object.entries(fields).filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => `${k}: ${String(v).replace(/\n+/g, " | ")}`).join("\n") + "\n");
  const relText = id => graphEdges.filter(e => e.source === id || e.target === id).map(e => (e.source === id ? "out" : "in") + ` ${e.relationship} ${e.source === id ? e.target : e.source}`).join("; ") || "none";
  blocks.push(`# Ix-findings — complete LLM corpus\n\nCanonical knowledge graph of the Ix / Compass investigation. Generated ${base.meta.generated} from revision ${base.meta.sourceRevision}. Base: ${BASE_URL}. Machine indexes: graph.json, entities.json, routes.json, search.json.\n`);
  for (const s of data.sections || []) block({
    ID: s.id, TYPE: "section", TITLE: s.title, STATUS: s.status || "", URL: BASE_URL + s.graph_path.replace(/\/+$/, ""),
    GRAPH_PATH: s.graph_path, REPOSITORY: s.repository || "", PRS: (s.pr_refs || []).join(", "), ISSUES: (s.issue_refs || []).join(", "),
    COMMITS: (s.commit_refs || []).join(", "), FILES: (s.file_refs || []).map(f => `${f.path}${f.symbol ? " (" + f.symbol + ")" : ""}`).join("; "),
    TESTS: (s.test_refs || []).map(t => t.name || t.file).join("; "), EVIDENCE: (s.evidence || []).join("; "), SECURITY: (s.security || []).join("; "), FINDINGS: (s.finding_refs || []).join(", "),
    RELATIONSHIPS: relText(s.id),
  });
  for (const s of data.issueSections || []) block({
    ID: `ISSUE-${s.issue}`, TYPE: "issue", TITLE: s.issue_title || `Issue #${s.issue}`, STATUS: s.state || "open", URL: BASE_URL + s.graph_path.replace(/\/+$/, ""),
    AUTHOR: s.user || "", LABELS: (s.labels || []).join(", "), PRS: (s.pr_refs || []).join(", "), COMMITS: (s.commit_refs || []).join(", "),
    FILES: (s.file_refs || []).map(f => `${f.path}${f.symbol ? " (" + f.symbol + ")" : ""}`).join("; "), FINDINGS: (s.finding_refs || []).join(", "),
    RELATED_SECTIONS: (s.related_sections || []).join(", "), RELATIONSHIPS: relText(`ISSUE-${s.issue}`),
  });
  for (const p of data.pullRequests || []) block({ ID: `PR-${p.number}`, TYPE: "pr", TITLE: p.title || p.url, STATUS: p.state || "", URL: BASE_URL + (canonicalUrl.get(`PR-${p.number}`) ? canonicalUrl.get(`PR-${p.number}`) + "/" : `/entities/pr-${p.number}/`), SHA: p.sha || p.fork_sha || "", NOTE: p.note || "", RELATIONSHIPS: relText(`PR-${p.number}`) });
  for (const f of data.findings || []) block({ ID: f.id, TYPE: "finding", TITLE: f.title, STATUS: f.status || "", URL: BASE_URL + entityUrl(f.id) + "/", EVIDENCE_CLASS: f.evidence_class, CONFIDENCE: f.confidence || "", REPOSITORY: f.repository || "", SUMMARY: f.summary || "", RECOMMENDATION: f.recommendation || "", EVIDENCE: (f.evidence_refs || []).join(", "), RELATED_ISSUES: (f.related_issues || []).join(", "), RELATED_PRS: (f.related_prs || []).join(", "), RELATIONSHIPS: relText(f.id) });
  for (const e of data.evidence || []) block({ ID: e.id, TYPE: "evidence", TITLE: e.title, STATUS: e.class || "", URL: BASE_URL + entityUrl(e.id) + "/", CLASS: e.class, KIND: e.kind, PHASE: e.phase || "", REPOSITORY: e.repository || "", DETAIL: e.detail || "", SUPPORTS: (e.supports || []).join(", "), RELATIONSHIPS: relText(e.id) });
  for (const d of data.decisions || []) block({ ID: d.id, TYPE: "decision", TITLE: d.title, STATUS: d.status || "", URL: BASE_URL + entityUrl(d.id) + "/", CONTEXT: d.context || "", CHOSEN: d.chosen || "", RATIONALE: d.rationale || "", RELATIONSHIPS: relText(d.id) });
  for (const s of data.suggestions || []) block({ ID: s.id, TYPE: "suggestion", TITLE: s.text, STATUS: s.disposition || "", URL: BASE_URL + entityUrl(s.id) + "/", REASON: s.reason || "", RELATED_FINDINGS: (s.related_findings || []).join(", "), RELATIONSHIPS: relText(s.id) });
  for (const p of data.phases || []) block({ ID: p.id, TYPE: "phase", TITLE: `${p.number} — ${p.title}`, STATUS: p.status || "", URL: BASE_URL + entityUrl(p.id) + "/", SUMMARY: p.summary || "", RELATIONSHIPS: relText(p.id) });
  for (const r of data.repos || []) block({ ID: r.repo_id ? `REPO-${String(r.repo_id).replaceAll("/", "-")}` : r.name, TYPE: "repository", TITLE: r.repo_id || r.name, STATUS: r.role || r.access || "", URL: BASE_URL + entityUrl(r.repo_id ? `REPO-${String(r.repo_id).replaceAll("/", "-")}` : r.name) + "/", URL_GITHUB: r.url || "", NOTE: r.note || "" });
  for (const c of data.commits || []) if (c.sha) block({ ID: `COMMIT-${c.sha}`, TYPE: "commit", TITLE: c.msg || c.sha || "", STATUS: "", URL: BASE_URL + entityUrl(`COMMIT-${c.sha}`) + "/", REPOSITORY: c.repo || "", BRANCH: c.branch || "", PR: c.pr || "" });
  for (const f of filesIndex) block({ ID: `FILE:${f.repository}:${f.path}`, TYPE: "file", TITLE: f.path, STATUS: "", URL: f.url, REPOSITORY: f.repository, COMMIT: f.commit, SYMBOL: f.symbol || "" });
  for (const t of data.timeline || []) block({ ID: t.id || t.title, TYPE: "timeline", TITLE: t.title, STATUS: t.type || "", DATE: t.date || "", URL: BASE_URL + "/" });
  // Branches have hash-based canonical ids not derivable from branch data;
  // they are emitted with correct ids/urls by the graph-entity pass below.
  // Remaining graph entities not covered above (deterministic order).
  const covered = new Set([...data.sections.map(s => s.id), ...data.issueSections.map(s => `ISSUE-${s.issue}`), ...data.pullRequests.map(p => `PR-${p.number}`), ...data.findings.map(f => f.id), ...data.evidence.map(e => e.id), ...data.decisions.map(d => d.id), ...data.suggestions.map(s => s.id), ...data.phases.map(p => p.id), ...data.repos.map(r => `REPO-${String(r.repo_id || r.name).replaceAll("/", "-")}`)]);
  for (const n of graphNodes) {
    if (covered.has(n.id)) continue;
    block({ ID: n.id, TYPE: n.type, TITLE: n.title, STATUS: n.status || "", URL: BASE_URL + entityUrl(n.id) + "/", REPOSITORY: n.repository || "", PHASE: n.phase || "", NUMBER: n.number ?? "", RELATIONSHIPS: relText(n.id) });
  }
  writeFileSync(join(outDir, "llms-full.txt"), blocks.join("\n"), "utf8");
}

console.log(`Wrote planning/pages/public/ (graph ${data.graph.nodes.length}/${data.graph.edges.length}, findings ${data.findings.length}, evidence ${data.evidence.length}, ${js.length} bytes data)`);
console.log(`Wrote corpus: ${routes.length} routes, ${entitiesIndex.length} entities indexed, ${entityPagesWritten.length} entity pages + data.json, llms.txt/llms-full.txt, sitemap.xml, robots.txt, graph.json, ${19} JSON indexes`);
console.log("PUBLIC PROJECTION BUILT — NOT DEPLOYED. Pages workflow remains disabled.");
