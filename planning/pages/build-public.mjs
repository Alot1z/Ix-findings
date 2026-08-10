// Builds the PUBLIC static projection of the knowledge explorer (CAND-008, local prep).
// Run from workspace root: node planning/pages/build-public.mjs
// Output: planning/pages/public/ — a sanitized, self-contained site for a LATER
// explicitly authorized deployment phase. This script never deploys, never pushes,
// and never enables GitHub Pages.
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const planning = join(root, "planning");
const handoff = join(root, "CLI-HANDOFF");
const wiki = join(planning, "wiki");
const outDir = join(here, "public");

const readJ = (p) => JSON.parse(readFileSync(p, "utf8"));
const allowlist = readJ(join(here, "public-data-allowlist.json"));

// ── Load canonical sources (same as build-data.mjs) ──
const findings = readJ(join(planning, "findings/registry.json")).findings;
const evidence = readJ(join(planning, "evidence/registry.json")).evidence;
const suggestions = readJ(join(planning, "suggestions/registry.json")).suggestions;
const decisions = readJ(join(planning, "decisions/registry.json")).decisions;
const phases = readJ(join(planning, "maps/phases.json")).phases;
const timeline = readJ(join(planning, "maps/timeline-map.json")).events;
const graph = readJ(join(planning, "maps/investigation-map.json"));
const manifest = readJ(join(handoff, "manifest.json"));
const repos = manifest.repositories || [];
const branches = manifest.branches || [];
const commits = manifest.commits || [];
const pullRequests = manifest.pull_requests || [];
const issues = manifest.issues || [];
const worktrees = manifest.worktrees || {};
const testResults = manifest.test_results || {};

// Contribution states come from the canonical Phase 3 record.
let contributions = [];
try { contributions = readJ(join(handoff, "phase-3/CONTRIBUTION-READINESS.json")).contributions || []; }
catch { /* fall back to empty */ }

// ── Allowlist field picker ──
const pick = (obj, fields, idLabel) => {
  const out = {};
  for (const f of fields) {
    if (obj && obj[f] !== undefined) {
      let v = obj[f];
      // Redact local paths and secret-like strings anywhere in published values.
      if (typeof v === "string") v = redact(v);
      out[f] = v;
    }
  }
  return out;
};

const redact = (s) => {
  let r = s;
  // Full local-path strip (drive letter + optional UNC) — replace whole token.
  r = r.replace(/[A-Za-z]:\\[^\s"']*/g, "[local-path]");
  r = r.replace(/\\\\[^\\\s"']*\\/g, "[local-path]"); // \\server\\share\...
  for (const pat of allowlist.globalExcludes) {
    if (r.includes(pat)) r = r.split(pat).join("[redacted]");
  }
  return r;
};

const col = (name, rows, allowedFields) => {
  const spec = allowlist.collections[name] || {};
  if (spec.allowed === false) return [];
  const fields = allowedFields || spec.allowedFields || [];
  return (rows || []).map(r => pick(r, fields, name));
};

// ── Build sanitized projection ──
const PRIVATE_URL_RE = /system-compass/;

const data = {
  meta: {
    title: "Ix / Compass Investigation — Knowledge Wiki",
    snapshotLabel: allowlist.labeling.siteLabel,
    generated: manifest.generated ? manifest.generated.slice(0, 10) : "unknown",
    sourceRevision: (() => { try { return manifest.branches?.find(b => b.repo === "Ix-findings")?.sha || "unknown"; } catch { return "unknown"; } })(),
    phase: "EXECUTION",
    entityCounts: {
      repositories: repos.length,
      branches: branches.length,
      worktrees: Object.keys(worktrees).length,
      commits: commits.length,
      findings: findings.length,
      evidence: evidence.length,
      decisions: decisions.length,
      suggestions: suggestions.length,
      prs: pullRequests.length,
      issues: issues.length,
      contributions: contributions.length,
      graphNodes: graph.nodes.length,
      graphEdges: graph.edges.length
    },
    dataFreshness: {
      findings: "2026-08-10",
      evidence: "2026-08-10",
      tests: testResults.tests ? `${testResults.tests} @ ${testResults.sha || "c4f8fea"}` : "unknown"
    },
    published: { note: "Sanitized public projection — internal fields (local paths, worktrees, raw manifest) excluded by allowlist." }
  },
  findings: col("findings", findings),
  evidence: col("evidence", evidence),
  suggestions: col("suggestions", suggestions),
  decisions: col("decisions", decisions),
  phases: col("phases", phases),
  timeline: col("timeline", timeline),
  graph: (() => {
    // Nodes: strip private system-compass URLs instead of dropping the node
    // (the repo/issue is a documented public fact; only the URL is private).
    const nodes = (graph.nodes || [])
      .filter(n => n.type !== "worktree") // worktree nodes carry local filesystem paths — excluded
      .map(n => pick(n, allowlist.collections.graph.nodes.allowedFields))
      .map(n => {
        if (n.url && PRIVATE_URL_RE.test(n.url)) n.url = null;
        return n;
      });
    const ids = new Set(nodes.map(n => n.id));
    // Edges: keep only edges whose endpoints are published (no dangling refs).
    const edges = (graph.edges || []).map(e => pick(e, allowlist.collections.graph.edges.allowedFields))
      .filter(e => ids.has(e.source) && ids.has(e.target));
    return { nodes, edges };
  })(),
  repos: col("repositories", repos),
  branches: col("branches", branches),
  commits: col("commits", commits),
  worktrees: [], // EXCLUDED: local filesystem paths
  pullRequests: col("pullRequests", pullRequests),
  issues: col("issues", issues).map(i => PRIVATE_URL_RE.test(i.url || "") ? { ...i, url: null, access: "PRIVATE" } : i),
  testResults: pick(testResults, allowlist.collections.testResults.allowedFields),
  contributions: col("contributions", contributions),
  staleClaims: [], // populated from STALE-CLAIMS.md below
  // Deliberate public status marker (not derived — the raw sysCompass narrative
  // is internal and must never be published).
  sysCompass: { access: "PRIVATE", published: false, note: "Source inaccessible; findings F-001..F-007/F-013 documented at public level only." },
  manifest: undefined // raw manifest NEVER published
};

// Stale claims from STALE-CLAIMS.md (public prose — IDs + short descriptions only).
try {
  const sc = readFileSync(join(handoff, "STALE-CLAIMS.md"), "utf8");
  const re = /\|\s*\*\*?(S-\d+)\*\*?\s*\|([^|]*)/g; let m;
  const claims = [];
  while ((m = re.exec(sc)) !== null) {
    claims.push({ id: m[1], description: redact(m[2].trim().slice(0, 120)) });
  }
  data.staleClaims = claims;
} catch { /* keep empty */ }

delete data.manifest;

// ── Write public/ site ──
mkdirSync(join(outDir, "data"), { recursive: true });
mkdirSync(join(outDir, "assets"), { recursive: true });

const js = `// GENERATED by planning/pages/build-public.mjs — sanitized public projection.
// Do not edit by hand. Internal/private fields are excluded per public-data-allowlist.json.
window.IX_DATA = ${JSON.stringify(data, null, 2)};`;
writeFileSync(join(outDir, "data/data.js"), js, "utf8");

// Copy the explorer shell + assets (relative paths preserved for GitHub Pages sub-path).
if (existsSync(join(wiki, "index.html"))) cpSync(join(wiki, "index.html"), join(outDir, "index.html"));
if (existsSync(join(wiki, "assets/wiki.css"))) cpSync(join(wiki, "assets/wiki.css"), join(outDir, "assets/wiki.css"));
if (existsSync(join(wiki, "assets/wiki.js"))) cpSync(join(wiki, "assets/wiki.js"), join(outDir, "assets/wiki.js"));

console.log("Wrote planning/pages/public/ (graph " + data.graph.nodes.length + "/" + data.graph.edges.length +
  ", findings " + data.findings.length + ", evidence " + data.evidence.length + ", " + js.length + " bytes data)");
console.log("PUBLIC PROJECTION BUILT — NOT DEPLOYED. Pages workflow is prepared but disabled.");
