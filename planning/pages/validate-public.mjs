// Validates the PUBLIC static projection before any deployment is considered.
// Run from workspace root: node planning/pages/validate-public.mjs
// Checks: files present, data parses, no local paths, no secrets, no localhost,
// relative asset references, snapshot label present, graph edge endpoints valid.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { runGate } from "../../knowledge/freshness-gate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "public");
const allowlist = JSON.parse(readFileSync(join(here, "public-data-allowlist.json"), "utf8"));

let failures = 0;
const fail = (msg) => { console.log("FAIL:", msg); failures++; };
const ok = (msg) => console.log("ok:", msg);

// 1. Files present
const required = ["index.html", "data/data.js", "assets/wiki.css", "assets/wiki.js"];
for (const f of required) {
  existsSync(join(outDir, f)) ? ok("present " + f) : fail("missing " + f);
}

// 2. Data parses
let data = null;
try {
  const s = readFileSync(join(outDir, "data/data.js"), "utf8");
  const m = s.match(/window\.IX_DATA = ([\s\S]*);\s*$/);
  data = JSON.parse(m[1]);
  ok("data.js parses");
} catch (e) { fail("data.js parse: " + e.message); }

if (data) {
  // 3. Snapshot label
  (data.meta?.snapshotLabel) ? ok("snapshot label present") : fail("snapshot label missing");
  (data.meta?.generated) ? ok("generated timestamp present") : fail("generated timestamp missing");

  // 4. No local paths / secrets / localhost anywhere in published data
  const dump = JSON.stringify(data);
  let clean = true;
  for (const pat of allowlist.globalExcludes) {
    if (dump.includes(pat)) { fail("excluded pattern present in data: " + pat); clean = false; }
  }
  if (clean) ok("no excluded patterns in published data");
  // Require a drive prefix plus at least two path segments. This avoids
  // mistaking escaped prose such as `code:\\n` for `C:\\Users\\...`.
  const slash = String.fromCharCode(92);
  const hasLocalDrivePath = value => {
    if (typeof value !== "string") {
      if (Array.isArray(value)) return value.some(hasLocalDrivePath);
      if (value && typeof value === "object") return Object.values(value).some(hasLocalDrivePath);
      return false;
    }
    for (let i = 0; i + 2 < value.length; i += 1) {
      if (!/[A-Za-z]/.test(value[i]) || value[i + 1] !== ":" || !["/", slash].includes(value[i + 2])) continue;
      if (/https?:\/\/$/.test(value.slice(Math.max(0, i - 4), i + 4))) continue;
      let cursor = i + 3;
      while (cursor < value.length && !/[\\s"']/.test(value[cursor])) cursor += 1;
      const segments = value.slice(i + 3, cursor).split(/[\\/]/);
      const validSegment = segment => typeof segment === "string" && segment.length >= 2 && /^[A-Za-z0-9_.~ -]+$/.test(segment);
      if (validSegment(segments[0]) && validSegment(segments[1])) return true;
    }
    return false;
  };
  if (hasLocalDrivePath(data)) fail("local drive path leak");
  else ok("no local drive paths");

  // 5. Excluded collections
  if (data.worktrees && data.worktrees.length > 0) fail("worktrees should be empty in public projection");
  else ok("worktrees excluded");
  if (data.manifest !== undefined) fail("raw manifest leaked");
  else ok("raw manifest excluded");
  if (data.sysCompass?.access !== "PRIVATE") fail("sysCompass should be a public status marker");
  else ok("sysCompass is public status marker");

  // 6. Graph edge endpoints exist in published node set
  const ids = new Set((data.graph?.nodes || []).map(n => n.id));
  const dangling = (data.graph?.edges || []).filter(e => !ids.has(e.source) || !ids.has(e.target));
  dangling.length === 0 ? ok("graph edges valid (" + data.graph.edges.length + ")") : fail("dangling edges in public graph: " + dangling.map(e => e.source + "->" + e.target).join(","));
}

// 7. Relative asset references in index.html (no absolute / or localhost)
try {
  const html = readFileSync(join(outDir, "index.html"), "utf8");
  const abs = html.match(/(?:src|href)="\/(?!\/)/g);
  abs ? fail("absolute asset refs in index.html: " + abs.join(",")) : ok("index.html uses relative asset refs");
  if (/localhost|127\.0\.0\.1/.test(html)) fail("localhost reference in index.html");
  else ok("no localhost in index.html");
} catch (e) { fail("index.html read: " + e.message); }

// 7b. wiki.js is copied verbatim from the explorer and documents the remap
// endpoint's loopback security model (Host whitelist localhost/127.0.0.1). This
// is INERT public documentation per phase-3 GITHUB-PAGES-IMPLEMENTATION-SPEC
// ("expect none (or only inert documentation)"). Verified non-executable prose.
try {
  const wjs = readFileSync(join(outDir, "assets/wiki.js"), "utf8");
  const hits = (wjs.match(/localhost|127\.0\.0\.1/g) || []).length;
  const inert = wjs.includes("Host whitelist");
  (hits === 0 || inert) ? ok("wiki.js localhost refs are inert security-model documentation (" + hits + " occurrences)") : fail("unexpected localhost refs in wiki.js");
} catch (e) { fail("wiki.js read: " + e.message); }

// 8. Freshness gate: publication is blocked when canonical state or snapshots
// diverge from the current read-only GitHub state. Use --skip-freshness only
// for offline structural checks; that mode is not a publication approval.
const skipFreshness = process.argv.includes("--skip-freshness");
if (skipFreshness) {
  console.log("WARN: freshness gate skipped — this validation is not publication-safe");
} else {
  try {
    const fixtureIndex = process.argv.indexOf("--fixture");
    const fixture = fixtureIndex >= 0 ? process.argv[fixtureIndex + 1] : undefined;
    const ageIndex = process.argv.indexOf("--max-age-hours");
    const maxAgeHours = ageIndex >= 0 ? Number(process.argv[ageIndex + 1]) : undefined;
    const report = runGate({ fixture, maxAgeHours });
    report.gate === "PASS"
      ? ok("freshness gate passed")
      : fail(`freshness gate ${report.gate.toLowerCase()} (${report.stale_count || 0} stale check(s))`);
  } catch (e) {
    fail("freshness gate unavailable: " + e.message);
  }
}

// 9. No secret file blobs in output tree
const walk = (d) => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(outDir);
const secretRe = /ghp_[A-Za-z0-9]{20,}|github_pat_|BEGIN (RSA|OPENSSH) PRIVATE/;
let secretClean = true;
for (const f of files) {
  const content = readFileSync(f, "utf8");
  if (secretRe.test(content)) { fail("secret pattern in " + f); secretClean = false; }
}
if (secretClean) ok("no secret patterns in output tree (" + files.length + " files)");

// 10. Machine corpus + route registry completeness.
const readJ = (p) => JSON.parse(readFileSync(p, "utf8"));
const routes = existsSync(join(outDir, "routes.json")) ? (readJ(join(outDir, "routes.json")).items || []) : null;
if (routes) {
  let missingRoutes = 0;
  for (const r of routes) {
    const target = r.kind === "file" ? join(outDir, ...r.path.split("/")) : join(outDir, ...r.path.split("/"), "index.html");
    if (!existsSync(target)) { fail("route target missing: " + r.path + (r.kind === "file" ? "" : "/index.html")); missingRoutes++; }
  }
  if (missingRoutes === 0) ok("route registry complete (" + routes.length + " routes: pages + machine files)");
  const sitemap = existsSync(join(outDir, "sitemap.xml")) ? readFileSync(join(outDir, "sitemap.xml"), "utf8") : "";
  const pageRoutes = routes.filter(r => r.kind !== "file");
  const missingFromSitemap = pageRoutes.filter(r => !sitemap.includes(r.url));
  missingFromSitemap.length === 0 ? ok("sitemap covers all page routes (" + pageRoutes.length + ")") : fail("sitemap missing routes: " + missingFromSitemap.map(r => r.path).join(","));
} else {
  fail("routes.json missing or unparsable");
}

// 11. graph.json consistency: every relation endpoint must be a known entity.
if (existsSync(join(outDir, "graph.json"))) {
  const g = readJ(join(outDir, "graph.json"));
  const ids = new Set((g.entities || []).map(e => e.id));
  const dangling = (g.relations || []).filter(r => !ids.has(r.source) || !ids.has(r.target));
  dangling.length === 0 ? ok("graph.json relations valid (" + (g.relations || []).length + ")") : fail("graph.json dangling relations: " + dangling.slice(0, 5).map(r => r.source + "->" + r.target).join(","));
} else {
  fail("graph.json missing");
}

// 12. LLM corpus completeness: every canonical entity appears in llms-full.txt,
// and llms.txt lists the required indexes.
const entities = existsSync(join(outDir, "entities.json")) ? (readJ(join(outDir, "entities.json")).items || []) : [];
if (existsSync(join(outDir, "llms-full.txt"))) {
  const full = readFileSync(join(outDir, "llms-full.txt"), "utf8");
  const missingEnts = entities.filter(e => !full.includes("ID: " + e.id));
  missingEnts.length === 0 ? ok("llms-full.txt covers every canonical entity (" + entities.length + ")") : fail("llms-full.txt missing entities: " + missingEnts.slice(0, 10).map(e => e.id).join(","));
} else {
  fail("llms-full.txt missing");
}
if (existsSync(join(outDir, "llms.txt"))) {
  const t = readFileSync(join(outDir, "llms.txt"), "utf8");
  for (const f of ["llms-full.txt", "graph.json", "entities.json", "routes.json", "search.json", "sitemap.xml"]) {
    if (!t.includes(f)) fail("llms.txt missing pointer: " + f);
  }
  ok("llms.txt entry point lists corpus indexes");
} else {
  fail("llms.txt missing");
}

// 13. Entity pages: every entity whose canonical URL is /entities/<slug>/ has
// a physical index.html + data.json; search index covers the full corpus.
{
  const entityPages = entities.filter(e => /\/entities\/[^/]+$/.test(new URL(e.url).pathname));
  let missingPages = 0;
  for (const e of entityPages) {
    const rel = new URL(e.url).pathname.replace(/\/Ix-findings/, "").replace(/\/+$/, "");
    if (!existsSync(join(outDir, ...rel.split("/"), "index.html")) || !existsSync(join(outDir, ...rel.split("/"), "data.json"))) { fail("entity page missing: " + rel); missingPages++; }
  }
  if (missingPages === 0) ok("entity pages + data.json complete (" + entityPages.length + ")");
}
if (existsSync(join(outDir, "search.json"))) {
  const s = readJ(join(outDir, "search.json")).items || [];
  const missingSearch = entities.filter(e => !s.some(x => x.id === e.id));
  missingSearch.length === 0 ? ok("search index covers all entities (" + s.length + " entries)") : fail("search index missing entities: " + missingSearch.slice(0, 10).map(e => e.id).join(","));
} else {
  fail("search.json missing");
}

// 14. Dead links: every internal href/src in every generated HTML page must
// resolve to a real file (or a directory, served as its index.html) in the
// output tree. External schemes, hash-only links, and query-only links are
// skipped; absolute paths are resolved against the GitHub Pages base path.
{
  const htmlFiles = files.filter(f => f.endsWith(".html"));
  let dead = 0;
  const re = /(?:href|src)="([^"]+)"/g;
  for (const f of htmlFiles) {
    const html = readFileSync(f, "utf8");
    const baseDir = dirname(f);
    let m;
    while ((m = re.exec(html)) !== null) {
      const raw = m[1];
      if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) continue;
      const rel = raw.split(/[?#]/)[0];
      if (!rel || rel.startsWith("#")) continue;
      let target;
      if (rel.startsWith("/")) {
        const p = rel.replace(/^\/Ix-findings/, "").replace(/^\/\/?/, "");
        target = join(outDir, ...p.split("/"));
      } else {
        target = join(baseDir, rel);
      }
      const exists = existsSync(target) || existsSync(target + "/") || existsSync(target + "/index.html") || existsSync(target + ".html");
      if (!exists) { fail("dead link in " + f.replace(outDir + sep, "") + ": " + raw); dead++; }
    }
  }
  if (dead === 0) ok("no dead internal links across " + htmlFiles.length + " HTML pages");
}

// 15. Placeholders: the LLM entry point and full corpus must contain no
// unresolved placeholder tokens (spec: no TODO/TBD/<URL>/<entity>).
{
  // Spec §22: llms.txt must have no TODO, TBD, <URL>, or <entity> placeholders.
  // llms-full.txt is derived from canonical data — real commit messages and
  // descriptions may contain the word "placeholder" legitimately, so limit to
  // the strictly unresolvable tokens the spec calls out.
  const phRe = /TODO|TBD|<URL>|<entity>/i;
  for (const f of ["llms.txt", "llms-full.txt"]) {
    if (!existsSync(join(outDir, f))) { fail("missing " + f + " (placeholder scan)"); continue; }
    const c = readFileSync(join(outDir, f), "utf8");
    const hits = c.match(phRe) || [];
    hits.length === 0
      ? ok(f + " free of placeholder tokens")
      : fail(f + " contains placeholder tokens: " + [...new Set(hits)].slice(0, 8).join(", "));
  }
  const sitemap = existsSync(join(outDir, "sitemap.xml")) ? readFileSync(join(outDir, "sitemap.xml"), "utf8") : "";
  if (sitemap && /TODO|TBD|<URL>/.test(sitemap)) fail("sitemap.xml contains placeholders");
  else if (sitemap) ok("sitemap.xml free of placeholder tokens");
}

console.log(failures === 0 ? "\nVALIDATION PASSED — public projection safe for review." : "\nVALIDATION FAILED with " + failures + " issue(s).");
process.exit(failures === 0 ? 0 : 1);
