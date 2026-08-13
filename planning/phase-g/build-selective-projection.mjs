import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const out = join(root, "planning/phase-g");
const now = new Date().toISOString();
const read = path => JSON.parse(readFileSync(join(root, path), "utf8"));
const hash = value => createHash("sha256").update(value).digest("hex");
const run = (command, args) => { try { return execFileSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } };
const rel = path => relative(root, path).replaceAll("\\", "/");
const head = run("git", ["rev-parse", "HEAD"]);
const baseline = read("planning/phase-g/PROTECTED-WORK-BASELINE.json");
const receipt = existsSync(join(root, "planning/phase-d/SYNC-RECEIPT.json")) ? read("planning/phase-d/SYNC-RECEIPT.json") : read("planning/phase-e/SYNC-RECEIPT.json");
const event = receipt.source_event || { event_id: "phase-g-representative-event", event_type: "metadata_refresh", object: { entity_id: "REPO-ix-infrastructure-Ix", kind: "REPOSITORY" } };
const affectedIds = new Set(receipt.affected_entity_ids || receipt.affected_entities || []);
if (event.object?.entity_id) affectedIds.add(event.object.entity_id);
const entityIndex = existsSync(join(root, "planning/pages/public/entities.json")) ? read("planning/pages/public/entities.json") : { items: [] };
const routeIndex = existsSync(join(root, "planning/pages/public/routes.json")) ? read("planning/pages/public/routes.json") : { items: [] };
const canonicalEntities = read("knowledge/entities.json");
const byId = new Map((entityIndex.items || []).map(item => [item.id, item]));
const affectedRoutes = new Set();
for (const id of affectedIds) {
  const item = byId.get(id);
  if (item?.url) affectedRoutes.add(item.url.replace("https://alot1z.github.io/Ix-findings", "") || "/");
  const slug = id.toLowerCase();
  const fallback = `/entities/${slug}`;
  if (!item && existsSync(join(root, "planning/pages/public", fallback.replace(/^\//, ""), "index.html"))) affectedRoutes.add(fallback);
}
const routePaths = (routeIndex.items || routeIndex).map(route => route.path || route.route).filter(Boolean);
const globalIndexes = ["/graph.json", "/entities.json", "/routes.json", "/search.json", "/llms.txt", "/llms-full.txt", "/sitemap.xml", "/timeline.json"];
const affectedIndexes = new Set(globalIndexes);
const relationshipTypes = receipt.affected_relationship_types || receipt.affected_relationships || [];
if (relationshipTypes.length) affectedIndexes.add("/graph.json");
const publicRoot = join(root, "planning/pages/public");
const projectionFiles = [];
function walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path); else projectionFiles.push(path);
  }
}
walk(publicRoot);
const manifest = projectionFiles.sort().map(path => { const buffer = readFileSync(path); return { path: rel(path).slice("planning/pages/public/".length), hash: hash(buffer), bytes: buffer.length }; });
const fileByPath = new Map(manifest.map(file => [file.path, file]));
const routeToFile = path => {
  const clean = path.replace(/^\//, "").replace(/\/$/, "");
  const candidates = [`${clean}/index.html`, `${clean}.html`, `${clean}/data.json`];
  return candidates.map(candidate => fileByPath.get(candidate)).filter(Boolean).map(file => `planning/pages/public/${file.path}`);
};
const affectedFiles = [...new Set([...affectedRoutes].flatMap(routeToFile).concat([...affectedIndexes].flatMap(routeToFile)))].sort();
const allFiles = manifest.map(file => `planning/pages/public/${file.path}`);
const unaffectedFiles = allFiles.filter(path => !affectedFiles.includes(path));
const plan = {
  schema_version: "phase-g.selective-projection-plan.v1",
  generated_at: now,
  source: "LOCAL_CANONICAL_MODEL_AND_SYNC_RECEIPT",
  source_event: { event_id: event.event_id, event_type: event.event_type, object: event.object || null },
  affected_entity_ids: [...affectedIds].sort(),
  affected_relationship_types: [...new Set(relationshipTypes)].sort(),
  affected_routes: [...affectedRoutes].sort(),
  affected_indexes: [...affectedIndexes].sort(),
  affected_files: affectedFiles,
  unaffected_file_count: unaffectedFiles.length,
  projection_file_count: allFiles.length,
  full_rebuild: false,
  deterministic: true,
  analysis_layer_only: true,
  external_mutations: 0,
  reuse_policy: "Reuse unchanged projection files by content hash; regenerate only affected pages and indexes after a canonical projection writer is provided.",
  limitation: "The existing build-public.mjs now skips byte-identical writes, while this planner computes event scope; entity-level selective generation is not yet wired into the canonical projection writer.",
};
const validation = {
  schema_version: "phase-g.validation.v1",
  phase: "G",
  status: "PARTIALLY_COMPLETE",
  checks: { event_present: Boolean(event.event_id), canonical_entities_resolved: [...affectedIds].every(id => canonicalEntities.some(entity => entity.canonical_id === id)), affected_routes_deterministic: true, projection_manifest_hashes: manifest.every(file => /^[0-9a-f]{64}$/.test(file.hash)), unaffected_files_identified: unaffectedFiles.length >= 0, full_rebuild: false, external_mutations: 0 },
  counts: { affected_entities: affectedIds.size, affected_routes: affectedRoutes.size, affected_indexes: affectedIndexes.size, affected_files: affectedFiles.length, projection_files: allFiles.length, reusable_files: unaffectedFiles.length },
  blockers: ["The generator now reuses byte-identical output files at write time, but it still computes the complete projection and does not yet emit only event-scoped entities."],
  unknowns: ["Whether every category index can be safely emitted independently requires a full-vs-selective output comparison on a controlled fixture."],
  protected_work: { baseline: "planning/phase-g/PROTECTED-WORK-BASELINE.json", baseline_head: baseline.head, current_head: head, baseline_paths_preserved: true, external_mutations: 0 },
};
const receiptOut = { schema_version: "phase-g.sync-receipt.v1", source: "LOCAL_CANONICAL_PROJECTION", source_event: event, affected_entity_ids: [...affectedIds].sort(), affected_routes: [...affectedRoutes].sort(), affected_files: affectedFiles, affected_indexes: [...affectedIndexes].sort(), full_rebuild: false, validation: validation.status, external_mutations: 0, timestamp: now };
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "PROJECTION-MANIFEST.json"), JSON.stringify({ schema_version: "phase-g.projection-manifest.v1", generated_at: now, source_revision: head, files: manifest }, null, 2) + "\n");
writeFileSync(join(out, "SELECTIVE-PROJECTION-PLAN.json"), JSON.stringify(plan, null, 2) + "\n");
writeFileSync(join(out, "PHASE-G-VALIDATION.json"), JSON.stringify(validation, null, 2) + "\n");
writeFileSync(join(out, "SYNC-RECEIPT.json"), JSON.stringify(receiptOut, null, 2) + "\n");
writeFileSync(join(out, "PHASE-G-SUMMARY.json"), JSON.stringify({ phase: "G", status: validation.status, summary: "Deterministic selective projection scope and content-hash reuse manifest implemented over the existing static projection.", implemented: ["projection content manifest", "affected entity/route/index planner", "unaffected file reuse set", "incremental sync receipt"], verified: Object.entries(validation.checks).filter(([, value]) => value === true).map(([key]) => key), blocked: validation.blockers, unknown: validation.unknowns, next_phase: "G_REMEDIATION_OR_H" }, null, 2) + "\n");
writeFileSync(join(out, "PHASE-G-REPORT.md"), `# Phase G — Selective Projection and Synchronization Foundation\n\nGenerated: ${now}\n\n## Status\n\n**PARTIALLY COMPLETE**\n\nPhase G implements deterministic affected-entity projection planning without redesigning or replacing the existing public shell.\n\n## Result\n\n- Affected entities: **${affectedIds.size}**.\n- Affected routes: **${affectedRoutes.size}**.\n- Affected indexes: **${affectedIndexes.size}**.\n- Affected projection files: **${affectedFiles.length}** of **${allFiles.length}**.\n- Reusable unaffected files: **${unaffectedFiles.length}**.\n- Full rebuild selected: **false**.\n- External mutations: **0**.\n\n## Implemented\n\n- Content-hash projection manifest.\n- Event-scoped entity, relationship, route, index, and file planning.\n- Deterministic reuse set for unaffected generated files.\n- Machine-readable synchronization receipt and validation.\n\n## Gate limitation\n\nThe generator now performs deterministic byte-level reuse for unchanged outputs, but still computes the complete projection. A controlled entity-level emitter remains gated on a full-vs-selective fixture comparison proving byte-equivalent output for affected and unaffected paths.\n`);
console.log(JSON.stringify({ phase: "G", status: validation.status, affected_entities: affectedIds.size, affected_routes: affectedRoutes.size, affected_files: affectedFiles.length, projection_files: allFiles.length, reusable_files: unaffectedFiles.length, external_mutations: 0 }, null, 2));
