import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const out = resolve(root, "planning/phase-d");
const read = file => JSON.parse(readFileSync(resolve(root, file), "utf8"));
const sha256 = value => createHash("sha256").update(value).digest("hex");
const args = process.argv.slice(2);
const arg = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : null; };
const eventPath = arg("--event-file");
const statePath = resolve(out, "SYNC-STATE.json");
const receiptPath = resolve(out, "SYNC-RECEIPT.json");
const entities = read("knowledge/entities.json");
const relationships = read("knowledge/relationships.json");
const design = read("planning/phase-c/INCREMENTAL-SYNC-DESIGN.json");
const delta = read("planning/phase-c/FRESHNESS-DELTA.json");
const priorState = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : { watermark: null, source_cursors: {} };

const representative = delta.affected_entities.find(item => item.kind === "PULL_REQUEST" && item.current_head) || delta.affected_entities.find(item => item.kind === "UPSTREAM_HEAD") || { entity_id: "PR-393", kind: "PULL_REQUEST", previous_head: null, current_head: "a6a47267af21a49d6942ee6e07e18d1d0a82517b", status: "CURRENT" };
const event = eventPath ? read(eventPath) : {
  event_id: `phase-d-representative-${sha256(JSON.stringify(representative)).slice(0, 12)}`,
  source: "Phase-C FRESHNESS-DELTA.json",
  event_type: representative.kind === "PULL_REQUEST" ? "changed_pr_head" : "new_commit",
  observed_at: delta.generated_at,
  cursor: delta.live?.upstream_head || representative.current || null,
  object: representative,
};
const fullSha = value => typeof value === "string" && /^[0-9a-f]{40}$/i.test(value);
const entityIds = new Set(entities.map(entity => entity.canonical_id));
const changed = new Set();
const affectedRelationships = new Set();
const projections = new Set(["freshness", "graph", "search", "llm"]);
const add = value => { if (value) changed.add(value); };
const object = event.object || event;
const eventType = event.event_type || event.type || "unknown";
if (eventType === "changed_pr_head") {
  add(object.entity_id || (object.number ? `PR-${object.number}` : null));
  if (object.previous_head) add(`COMMIT-${object.previous_head}`);
  if (object.current_head) add(`COMMIT-${object.current_head}`);
  for (const file of object.changed_files || []) add(typeof file === "string" ? file : file.entity_id || null);
  affectedRelationships.add("HEADS_AT"); affectedRelationships.add("HEAD_MOVED_TO"); affectedRelationships.add("CHANGES");
  projections.add("entity"); projections.add("routes");
} else if (eventType === "new_commit") {
  add(object.entity_id || (object.sha ? `COMMIT-${object.sha}` : null));
  if (object.branch) add(`BRANCH-${object.repository || "unknown"}:${object.branch}`);
  for (const file of object.files || []) add(typeof file === "string" ? file : file.entity_id || null);
  affectedRelationships.add("PARENT"); affectedRelationships.add("CHANGES"); affectedRelationships.add("CO_CHANGED_WITH");
  projections.add("entity"); projections.add("routes");
} else if (eventType === "new_issue" || eventType === "closed_issue") {
  add(object.entity_id || (object.number ? `ISSUE-${object.number}` : null));
  if (object.author) add(`PERSON-${object.author}`);
  affectedRelationships.add("AUTHORED"); affectedRelationships.add("FOUND_IN"); affectedRelationships.add("STATE_TRANSITION");
  projections.add("entity"); projections.add("routes"); projections.add("sitemap");
} else if (eventType === "new_pr") {
  add(object.entity_id || (object.number ? `PR-${object.number}` : null));
  if (object.author) add(`PERSON-${object.author}`);
  if (object.head_sha) add(`COMMIT-${object.head_sha}`);
  affectedRelationships.add("AUTHORED"); affectedRelationships.add("HEADS_AT"); affectedRelationships.add("RESPONDS_TO");
  projections.add("entity"); projections.add("routes"); projections.add("sitemap");
} else if (eventType === "new_comment" || eventType === "new_review") {
  add(object.entity_id || (object.id ? `${eventType === "new_review" ? "REVIEW" : "COMMENT"}-${object.id}` : null));
  add(object.parent_entity_id || null); add(object.author ? `PERSON-${object.author}` : null);
  affectedRelationships.add(eventType === "new_review" ? "HAS_REVIEW" : "COMMENTED_ON"); affectedRelationships.add("AUTHORED");
  projections.add("entity");
} else {
  throw new Error(`Unsupported event type: ${eventType}`);
}
const unknownIds = [...changed].filter(id => !entityIds.has(id) && !/^FILE:|^BRANCH:/.test(id));
const validation = {
  deterministic_event_id: Boolean(event.event_id),
  source_cursor_present: Boolean(event.cursor),
  all_commit_ids_full_sha: [...changed].filter(id => id.startsWith("COMMIT-")).every(id => fullSha(id.slice(7))),
  no_unknown_entity_ids: unknownIds.length === 0,
  unknown_entity_ids: unknownIds,
  canonical_entity_count: entities.length,
  canonical_relationship_count: relationships.length,
  design_schema: design.schema_version,
};
const status = Object.values(validation).includes(false) ? "FAILED" : "PASS";
const now = new Date().toISOString();
const receipt = {
  schema_version: "phase-d.sync-receipt.v1",
  receipt_id: `SYNC-${sha256(JSON.stringify({ event, changed: [...changed] })).slice(0, 16)}`,
  status,
  mode: "LOCAL_MANUAL_DETERMINISTIC_DRY_RUN",
  source_event: event,
  watermark_before: priorState.watermark,
  watermark_after: event.observed_at || now,
  source_cursor_before: priorState.source_cursors?.[event.source || "unknown"] || null,
  source_cursor_after: event.cursor || null,
  changed_objects: [event.object || event],
  affected_entity_ids: [...changed].sort(),
  affected_relationship_types: [...affectedRelationships].sort(),
  rebuild_scope: { projections: [...projections].sort(), full_rebuild: false, reason: "Only event-affected entities and relationship types are selected." },
  validation,
  started_at: now,
  completed_at: now,
  failure: status === "FAILED" ? { code: "VALIDATION_FAILED", details: validation } : null,
};
const nextState = {
  schema_version: "phase-d.sync-state.v1",
  watermark: receipt.watermark_after,
  source_cursors: { ...(priorState.source_cursors || {}), [event.source || "unknown"]: receipt.source_cursor_after },
  last_receipt_id: receipt.receipt_id,
  last_status: status,
  updated_at: now,
};
writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n");
writeFileSync(statePath, JSON.stringify(nextState, null, 2) + "\n");
writeFileSync(resolve(out, "INCREMENTAL-SYNC-IMPLEMENTATION.json"), JSON.stringify({
  schema_version: "phase-d.incremental-sync-implementation.v1",
  implementation: "planning/phase-d/incremental-sync.mjs",
  mode: "LOCAL_MANUAL_DETERMINISTIC_DRY_RUN",
  supports: ["watermark", "source cursor", "changed objects", "affected entities", "affected relationships", "rebuild scope", "validation result", "sync timestamp", "failure state"],
  representative_event: event.event_type,
  receipt: "planning/phase-d/SYNC-RECEIPT.json",
  state: "planning/phase-d/SYNC-STATE.json",
  validation: receipt.validation,
  no_webhooks: true,
  no_hooks: true,
  no_external_mutation: true,
}, null, 2) + "\n");
console.log(JSON.stringify({ receipt: receipt.receipt_id, status, event_type: eventType, affected_entity_count: changed.size, projections: [...projections].sort(), validation }, null, 2));
