import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const current = read("knowledge/external-github-mirror.json");
const manifest = read("planning/phase-j/SNAPSHOT-MANIFEST.json");
const previousEntry = [...(manifest.snapshots || [])].reverse().find(item => item.snapshot_version === current.previous_snapshot_version);
const previous = previousEntry && existsSync(resolve(root, previousEntry.file)) ? read(previousEntry.file) : { records: [], generated_at: null };
const byId = records => new Map((records || []).map(record => [record.id, record]));
const before = byId(previous.records);
const after = byId(current.records);
const stable = value => {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().filter(key => !["review_thread_capture"].includes(key)).map(key => [key, stable(value[key])]));
};
const common = (oldValue, newValue) => {
  if (Array.isArray(oldValue) && Array.isArray(newValue)) return oldValue.map((value, index) => common(value, newValue[index]));
  if (oldValue && newValue && typeof oldValue === "object" && typeof newValue === "object" && !Array.isArray(oldValue) && !Array.isArray(newValue)) {
    return Object.fromEntries(Object.keys(oldValue).filter(key => Object.prototype.hasOwnProperty.call(newValue, key)).map(key => [key, common(oldValue[key], newValue[key])]));
  }
  return newValue;
};
const sourceSnapshot = (oldRecord, newRecord) => stable({ source: common(oldRecord.source, newRecord.source), snapshot: common(oldRecord.snapshot, newRecord.snapshot) });
const sourceEqual = (a, b) => JSON.stringify(sourceSnapshot(a, b)) === JSON.stringify(sourceSnapshot(b, a));
const schemaAddedFields = (oldValue, newValue, path = "") => {
  const fields = [];
  if (oldValue && newValue && typeof oldValue === "object" && typeof newValue === "object" && !Array.isArray(oldValue) && !Array.isArray(newValue)) {
    for (const key of Object.keys(newValue)) {
      const next = path ? `${path}.${key}` : key;
      if (!Object.prototype.hasOwnProperty.call(oldValue, key)) fields.push(next);
      else fields.push(...schemaAddedFields(oldValue[key], newValue[key], next));
    }
  } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    for (let index = 0; index < newValue.length; index += 1) fields.push(...schemaAddedFields(oldValue[index], newValue[index], `${path}[${index}]`));
  }
  return fields;
};
const changedFields = (a, b, path = "") => {
  const fields = [];
  if (JSON.stringify(stable(a)) === JSON.stringify(stable(b))) return fields;
  if (Array.isArray(a) || Array.isArray(b)) { fields.push(path || "snapshot"); return fields; }
  if (!a || !b || typeof a !== "object" || typeof b !== "object") { fields.push(path || "snapshot"); return fields; }
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)]).values()) {
    const next = path ? `${path}.${key}` : key;
    if (JSON.stringify(stable(a[key])) !== JSON.stringify(stable(b[key]))) {
      if (a[key] && b[key] && typeof a[key] === "object" && typeof b[key] === "object" && !Array.isArray(a[key]) && !Array.isArray(b[key])) fields.push(...changedFields(a[key], b[key], next));
      else fields.push(next);
    }
  }
  return [...new Set(fields)];
};
const canonical = record => record?.analysis?.canonical_entity_id || null;
const parentRoute = record => {
  const id = canonical(record) || "";
  let match = id.match(/^ISSUE-(\d+)$/); if (match) return `/issues/${match[1]}`;
  match = id.match(/^PR-(\d+)$/); if (match) return `/prs/${match[1]}`;
  const parent = record?.analysis?.parent_external_id || "";
  match = parent.match(/#(\d+)$/);
  if (parent.includes("pull_request") && match) return `/prs/${match[1]}`;
  if (parent.includes("issue") && match) return `/issues/${match[1]}`;
  return null;
};
const relationshipsFor = record => {
  const type = record.source?.type || "";
  if (type === "github_repository") return ["BRANCHES", "RELEASES"];
  if (type === "github_issue") return ["CURRENT_STATE_OF", "COMMENTS", "RESPONDS_TO"];
  if (type.includes("comment")) return ["COMMENTED_ON", "DISCUSSES"];
  if (type === "github_pull_request") return ["HEADS_AT", "CHANGED_BY", "DISCUSSED_BY", "REVIEWED_BY"];
  if (type === "github_review") return ["HAS_REVIEW", "REVIEWED_BY"];
  if (type === "github_review_thread") return ["CONTAINS", "DISCUSSES"];
  if (type === "github_commit") return ["PARENT", "CHANGES"];
  if (type === "github_file") return ["CHANGED"];
  return [];
};
const specificClasses = (oldRecord, newRecord, fields) => {
  const classes = [];
  const type = newRecord?.source?.type || oldRecord?.source?.type || "";
  const oldSnapshot = oldRecord?.snapshot || {};
  const newSnapshot = newRecord?.snapshot || {};
  if (oldSnapshot.state !== newSnapshot.state || oldSnapshot.merged !== newSnapshot.merged || oldSnapshot.draft !== newSnapshot.draft) classes.push("STATE_CHANGED");
  if (oldSnapshot.title !== newSnapshot.title) classes.push("TITLE_CHANGED");
  if (oldSnapshot.body !== newSnapshot.body) classes.push("BODY_CHANGED");
  if (type === "github_pull_request") {
    if (oldSnapshot.head?.sha !== newSnapshot.head?.sha || oldSnapshot.head?.ref !== newSnapshot.head?.ref) classes.push("PR_HEAD_CHANGED");
    if (oldSnapshot.base?.sha !== newSnapshot.base?.sha || oldSnapshot.base?.ref !== newSnapshot.base?.ref) classes.push("PR_BASE_CHANGED");
  }
  if (type === "github_repository") {
    if (JSON.stringify(stable(oldSnapshot.branches)) !== JSON.stringify(stable(newSnapshot.branches))) classes.push("BRANCH_MOVED");
    if (JSON.stringify(stable(oldSnapshot.releases)) !== JSON.stringify(stable(newSnapshot.releases))) classes.push("RELEASE_CHANGED");
  }
  if (type === "github_review_thread" && oldSnapshot.is_resolved !== newSnapshot.is_resolved) classes.push(newSnapshot.is_resolved ? "THREAD_RESOLVED" : "THREAD_UNRESOLVED");
  if (type === "github_issue_comment" || type === "github_pr_comment" || type === "github_review_comment") classes.push(oldRecord ? "COMMENT_UPDATED" : "COMMENT_ADDED");
  if (type === "github_review") classes.push(oldRecord ? "REVIEW_UPDATED" : "REVIEW_ADDED");
  if (type === "github_commit" && !oldRecord) classes.push("COMMIT_ADDED");
  if (type === "github_file") classes.push("FILE_CHANGED");
  if (type === "github_pull_request" && JSON.stringify(oldSnapshot.changed_files) !== JSON.stringify(newSnapshot.changed_files)) classes.push("FILE_CHANGED");
  if (!classes.length && oldRecord && newRecord) classes.push(type === "github_repository" && fields.length === 0 ? "SCHEMA_ENRICHED" : "UPDATED");
  return [...new Set(classes)];
};
const changes = [];
let unchanged = 0;
for (const [id, record] of after) {
  const old = before.get(id);
  if (!old) {
    const classes = specificClasses(null, record, []);
    changes.push({ change_id: `${id}:NEW`, change_classes: classes.length ? classes : ["NEW"], source_object: id, source_authority: "GITHUB", previous: null, current: record, changed_fields: Object.keys(record.snapshot || {}).sort(), affected: { entity_ids: [canonical(record)].filter(Boolean), relationship_types: relationshipsFor(record), routes: [parentRoute(record)].filter(Boolean), llm_records: [canonical(record)].filter(Boolean) }, analysis_affected: true });
  } else if (sourceEqual(old, record)) {
    unchanged += 1;
  } else {
    const fields = changedFields(common(old.snapshot, record.snapshot), common(record.snapshot, old.snapshot));
    const classes = specificClasses(old, record, fields);
    changes.push({ change_id: `${id}:${classes.join("+") || "UPDATED"}`, change_classes: classes.length ? classes : ["UPDATED"], source_object: id, source_authority: "GITHUB", previous: { source: old.source, snapshot: old.snapshot, freshness: old.freshness }, current: { source: record.source, snapshot: record.snapshot, freshness: record.freshness }, changed_fields: fields, schema_added_fields: [...schemaAddedFields(old.source, record.source, "source"), ...schemaAddedFields(old.snapshot, record.snapshot)], affected: { entity_ids: [...new Set([canonical(old), canonical(record)].filter(Boolean))], relationship_types: relationshipsFor(record), routes: [parentRoute(record)].filter(Boolean), llm_records: [...new Set([canonical(old), canonical(record)].filter(Boolean))] }, analysis_affected: !classes.includes("SCHEMA_ENRICHED") });
  }
}
for (const [id, record] of before) if (!after.has(id)) changes.push({ change_id: `${id}:REMOVED_FROM_SOURCE`, change_classes: ["REMOVED_FROM_SOURCE"], source_object: id, source_authority: "GITHUB", previous: record, current: null, changed_fields: [], affected: { entity_ids: [canonical(record)].filter(Boolean), relationship_types: relationshipsFor(record), routes: [parentRoute(record)].filter(Boolean), llm_records: [canonical(record)].filter(Boolean) }, analysis_affected: true });
const classCounts = {};
for (const change of changes) for (const kind of change.change_classes) classCounts[kind] = (classCounts[kind] || 0) + 1;
const report = {
  schema_version: "phase-j.mirror-diff.v1",
  generated_at: new Date().toISOString(),
  source_authority: "GITHUB",
  snapshot_before: previous.generated_at || current.previous_snapshot_version,
  snapshot_after: current.snapshot_version || current.generated_at,
  previous_snapshot_file: previousEntry?.file || null,
  changed_count: changes.length,
  unchanged_count: unchanged,
  schema_enrichment_count: [...after].filter(([id, record]) => before.has(id) && schemaAddedFields(before.get(id).snapshot, record.snapshot).length > 0).length,
  class_counts: classCounts,
  changes,
  external_mutations: 0,
  policy: { source_wins_for_external_state: true, analysis_is_separate: true, no_guessing: true },
};
writeFileSync(resolve(root, "planning/phase-j/MIRROR-DIFF.json"), JSON.stringify(report, null, 2) + "\n");
const lines = [`# Phase J Mirror Diff`, ``, `Generated: ${report.generated_at}`, ``, `Source authority: **GITHUB**`, ``, `Before: ${report.snapshot_before || "UNKNOWN"}`, `After: ${report.snapshot_after || "UNKNOWN"}`, ``, `Changed objects: **${report.changed_count}**`, `Unchanged objects: **${report.unchanged_count}**`, ``, `## Change classes`, ``];
for (const [kind, count] of Object.entries(classCounts).sort()) lines.push(`- ${kind}: ${count}`);
lines.push("", "## Changed objects", "");
for (const change of changes) {
  const currentState = change.current?.snapshot?.state || change.current?.snapshot?.head?.sha || "UNKNOWN";
  const previousState = change.previous?.snapshot?.state || change.previous?.snapshot?.head?.sha || "UNKNOWN";
  lines.push(`### ${change.source_object}`, `- Change: ${change.change_classes.join(", ")}`, `- Previous: ${previousState}`, `- Current: ${currentState}`, `- Fields: ${change.changed_fields.join(", ") || "none"}`, `- Affected entities: ${change.affected.entity_ids.join(", ") || "none"}`, `- Affected routes: ${change.affected.routes.join(", ") || "none"}`, `- Analysis affected: ${change.analysis_affected ? "TRUE" : "FALSE"}`, "");
}
writeFileSync(resolve(root, "planning/phase-j/MIRROR-DIFF.md"), lines.join("\n") + "\n");
console.log(JSON.stringify({ before: report.snapshot_before, after: report.snapshot_after, changed: report.changed_count, unchanged: report.unchanged_count, class_counts: report.class_counts, external_mutations: 0 }, null, 2));
