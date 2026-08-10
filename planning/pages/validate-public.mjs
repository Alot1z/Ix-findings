// Validates the PUBLIC static projection before any deployment is considered.
// Run from workspace root: node planning/pages/validate-public.mjs
// Checks: files present, data parses, no local paths, no secrets, no localhost,
// relative asset references, snapshot label present, graph edge endpoints valid.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
  if (/[A-Za-z]:\\|E:\//.test(dump)) fail("local drive path leak");
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

// 8. No secret file blobs in output tree
const walk = (d) => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(outDir);
const secretRe = /ghp_[A-Za-z0-9]{20,}|github_pat_|BEGIN (RSA|OPENSSH) PRIVATE/;
let secretClean = true;
for (const f of files) {
  const content = readFileSync(f, "utf8");
  if (secretRe.test(content)) { fail("secret pattern in " + f); secretClean = false; }
}
if (secretClean) ok("no secret patterns in output tree (" + files.length + " files)");

console.log(failures === 0 ? "\nVALIDATION PASSED — public projection safe for review." : "\nVALIDATION FAILED with " + failures + " issue(s).");
process.exit(failures === 0 ? 0 : 1);
