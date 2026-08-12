// verify-live.mjs — production smoke test for the deployed Ix-findings site.
// Hits the LIVE GitHub Pages URLs (not localhost) and verifies every required
// route class returns HTTP 200 with expected content. Run after deploy:
//   node planning/pages/verify-live.mjs [base-url]
// Exit code 0 = all checks passed; 1 = any check failed.
const BASE = (process.argv[2] || "https://alot1z.github.io/Ix-findings").replace(/\/+$/, "");

let failures = 0;
const fail = (msg) => { console.log("FAIL:", msg); failures++; };
const ok = (msg) => console.log("ok:", msg);

async function get(pathname, { allowRedirect = true } = {}) {
  const res = await fetch(BASE + pathname, { redirect: allowRedirect ? "follow" : "manual" });
  return { status: res.status, text: await res.text() };
}

// Route classes to verify (spec §53). Category paths are derived from the
// VIEW_PAGES list in build-public.mjs plus the files/issues/entities pages.
const CATEGORY_PATHS = [
  "/findings/", "/evidence/", "/repositories/", "/commits/", "/prs/", "/issues/",
  "/timeline/", "/phases/", "/decisions/", "/suggestions/", "/files/", "/map/",
  "/contributions/", "/entities/",
];
const DEEP_PATHS = [
  "/mcp/", "/mcp/implementation/", "/mcp/implementation/stdio/",
  "/prs/393/", "/prs/393/remap/", "/issues/219/",
];
const LLM_ENDPOINTS = ["/llms.txt", "/llms-full.txt", "/graph.json", "/sitemap.xml", "/robots.txt"];
const INDEXES = [
  "/entities.json", "/findings.json", "/evidence.json", "/repositories.json", "/files.json",
  "/commits.json", "/issues.json", "/pull-requests.json", "/phases.json", "/suggestions.json",
  "/decisions.json", "/timeline.json", "/sections.json", "/search.json", "/routes.json",
];

const checks = [];
const expect = (pathname, fn, label) => checks.push({ pathname, fn, label });

expect("/", (r) => r.status === 200 && r.text.includes("Knowledge Explorer") && r.text.includes("KNOWLEDGE CATEGORIES"), "root renders explorer + categories");
for (const p of CATEGORY_PATHS) expect(p, (r) => r.status === 200, "category " + p);
for (const p of DEEP_PATHS) expect(p, (r) => r.status === 200, "deep page " + p);
for (const p of LLM_ENDPOINTS) expect(p, (r) => r.status === 200, "llm endpoint " + p);
for (const p of INDEXES) expect(p, (r) => r.status === 200 && (() => { try { JSON.parse(r.text); return true; } catch { return false; } })(), "json index " + p);
expect("/entities/f-009/data.json", (r) => r.status === 200 && (() => { try { const j = JSON.parse(r.text); return j.id && j.url; } catch { return false; } })(), "entity data.json");
expect("/llms.txt", (r) => !/TODO|TBD|<URL>|<entity>/.test(r.text), "llms.txt placeholder-free");
expect("/llms-full.txt", (r) => r.text.includes("ENTITY") && r.text.includes("ID: "), "llms-full.txt structured corpus");
expect("/graph.json", (r) => { try { const j = JSON.parse(r.text); return (j.entities || j.nodes || []).length > 0; } catch { return false; } }, "graph.json non-empty");
expect("/sitemap.xml", (r) => r.text.includes("<url>") && r.text.includes(BASE), "sitemap has urls");

for (const c of checks) {
  try {
    const r = await get(c.pathname);
    if (c.fn(r)) ok(c.label + " → " + r.status);
    else fail(c.label + " → " + r.status + " (content check)");
  } catch (e) {
    fail(c.label + " → request error: " + e.message);
  }
}

console.log(failures === 0 ? `\nVERIFY-LIVE PASSED — ${checks.length} checks against ${BASE}` : `\nVERIFY-LIVE FAILED with ${failures} issue(s)`);
process.exit(failures === 0 ? 0 : 1);
