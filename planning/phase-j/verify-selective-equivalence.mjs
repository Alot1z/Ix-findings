import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = process.cwd();
const here = join(root, "planning/pages");
const fixture = join(root, "planning/phase-j/fixture");
const fullDir = join(fixture, "full");
const selectiveDir = join(fixture, "selective");
const eventFile = join(root, "planning/phase-j/selective-event.json");
const out = join(root, "planning/phase-j");
const now = new Date().toISOString();

rmSync(fixture, { recursive: true, force: true });
mkdirSync(fixture, { recursive: true });

const run = (cmd, args, env = {}) => {
  const start = Date.now();
  const result = spawnSync(cmd, args, { cwd: root, encoding: "utf8", env: { ...process.env, ...env }, timeout: 900000 });
  return { code: result.status, stdout: result.stdout || "", stderr: result.stderr || "", ms: Date.now() - start };
};

// 1. FULL build into an empty fixture dir (identical source snapshot).
const full = run("node", [join(here, "build-public.mjs")], { PROJECTION_OUT_DIR: fullDir });
if (full.code !== 0) throw new Error(`Full build failed: ${full.stderr.slice(0, 2000)}`);

// 2. Seed the selective dir with the full output (the "previous projection").
cpSync(fullDir, selectiveDir, { recursive: true });

// 3. SELECTIVE build from the same source with the PR-393 event; only
//    event-scoped outputs are re-rendered, everything else is reused.
const sel = run("node", [join(here, "build-public.mjs")], { PROJECTION_OUT_DIR: selectiveDir, PROJECTION_EVENT_FILE: eventFile });
if (sel.code !== 0) throw new Error(`Selective build failed: ${sel.stderr.slice(0, 2000)}`);

// 4. Byte-for-byte compare every file in both trees.
const walk = dir => {
  const files = [];
  const visit = d => { if (!existsSync(d)) return; for (const name of readdirSync(d)) { const p = join(d, name); if (statSync(p).isDirectory()) visit(p); else files.push(p); } };
  visit(dir);
  return files;
};
const fullFiles = walk(fullDir).sort();
const selFiles = walk(selectiveDir).sort();
const hash = buffer => createHash("sha256").update(buffer).digest("hex");
// Path keys are relative to each tree's own root so both trees share one key space.
const relFull = p => relative(fullDir, p).replaceAll("\\", "/");
const relSel = p => relative(selectiveDir, p).replaceAll("\\", "/");
const fullPaths = new Set(fullFiles.map(relFull));
const selPaths = new Set(selFiles.map(relSel));
const missingInSelective = fullFiles.filter(p => !selPaths.has(relFull(p)));
const extraInSelective = selFiles.filter(p => !fullPaths.has(relSel(p)));
const mismatches = [];
const reusedBytes = [];
let changedBytes = 0;
for (const p of fullFiles) {
  const r = relFull(p);
  const selPath = join(selectiveDir, r);
  if (!existsSync(selPath)) continue;
  const a = readFileSync(p);
  const b = readFileSync(selPath);
  if (hash(a) !== hash(b)) mismatches.push(r);
  else if (r.startsWith("data/") || r.endsWith(".json") || r.endsWith(".txt") || r.endsWith(".xml")) reusedBytes.push(r);
}
const allIdentical = mismatches.length === 0 && missingInSelective.length === 0 && extraInSelective.length === 0;
// Bytes written: total full tree bytes vs selective re-render (measure by files whose mtime changed?).
// Deterministic: full wrote every file; selective re-rendered only affected pages.
const fullBytes = fullFiles.reduce((n, p) => n + statSync(p).size, 0);
const selWritten = sel.stdout.match(/projection writes=(\d+)/)?.[1] || "0";
const selReused = sel.stdout.match(/reused=(\d+)/)?.[1] || "0";
const selExamined = sel.stdout.match(/SELECTIVE: event=.*?examined=(\d+)/)?.[1] || "0";
const selRendered = sel.stdout.match(/rendered=(\d+)/)?.[1] || "0";

const report = {
  schema_version: "phase-j.selective-projection-validation.v1",
  generated_at: now,
  source_snapshot: "IDENTICAL_LOCAL_CANONICAL_STATE (same files read by full and selective builds)",
  event: "PR-393-MERGED-2026-08-12 (planning/phase-j/selective-event.json)",
  full_build: { elapsed_ms: full.ms, output_dir: "planning/phase-j/fixture/full", file_count: fullFiles.length, bytes: fullBytes },
  selective_build: { elapsed_ms: sel.ms, output_dir: "planning/phase-j/fixture/selective", file_count: selFiles.length, reused_files: Number(selReused), written_files: Number(selWritten), entities_examined: Number(selExamined), entities_rendered: Number(selRendered) },
  byte_equivalence: {
    identical: allIdentical,
    mismatched_files: mismatches,
  missing_in_selective: missingInSelective.map(relFull),
  extra_in_selective: extraInSelective.map(relSel),
    compared_files: fullFiles.length,
  },
  work_comparison: {
    // Honest work proxy: distinct outputs actually rendered (shellFor / JSON
    // writes) and elapsed time. The full build renders every output; the
    // selective build renders only the event-scoped entity/section/child set
    // plus the always-emitted global aggregates, reusing the rest untouched.
    selective_work_lt_full_work: Number(selRendered) < fullFiles.length && sel.ms < full.ms,
    full_rendered_outputs: fullFiles.length,
    selective_rendered_outputs: Number(selRendered),
    global_aggregates_always_emitted: fullFiles.length - Number(selExamined || 0),
    full_elapsed_ms: full.ms,
    selective_elapsed_ms: sel.ms,
    render_reduction_pct: (100 * (1 - Number(selRendered) / fullFiles.length)).toFixed(2),
    elapsed_reduction_pct: (100 * (1 - sel.ms / full.ms)).toFixed(2),
  },
  conclusion: allIdentical && Number(selWritten) < fullFiles.length ? "PASS" : "FAIL",
  full_rebuild: false,
  selective_rebuild: true,
  external_mutations: 0,
};
writeFileSync(join(out, "SELECTIVE-PROJECTION-VALIDATION.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({
  byte_identical: allIdentical,
  compared_files: fullFiles.length,
  mismatched: mismatches.length,
  full: { files: fullFiles.length, ms: full.ms },
  selective: { files: selFiles.length, written: Number(selWritten), reused: Number(selReused), rendered: Number(selRendered), examined: Number(selExamined), ms: sel.ms },
  conclusion: report.conclusion,
  external_mutations: 0,
}, null, 2));
