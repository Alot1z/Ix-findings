import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const read = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const mirror = read("knowledge/external-github-mirror.json");
const diff = read("planning/phase-j/MIRROR-DIFF-FULL.json");
const graphql = read("planning/phase-e/GRAPHQL-REVIEW-THREADS.json");
const now = new Date().toISOString();
const run = (cmd, args) => { try { return execFileSync(cmd, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } };

const affectedEntityIds = [...new Set(diff.changes.flatMap(change => change.affected?.entity_ids || []))].sort();
const affectedRoutes = [...new Set(diff.changes.flatMap(change => change.affected?.routes || []))].sort();
const affectedLlmRecords = [...new Set(diff.changes.flatMap(change => change.affected?.llm_records || []))].sort();
const pr393Changes = diff.changes.filter(change => change.source_object.includes("393"));

const receipt = {
  schema_version: "phase-j.sync-receipt.v1",
  source: "GITHUB",
  generated_at: now,
  snapshot_before: diff.snapshot_before,
  snapshot_after: diff.snapshot_after,
  watermark: mirror.synchronization?.watermark || null,
  cursor: mirror.synchronization?.cursor || null,
  objects_added: diff.changes.filter(change => change.change_classes.includes("NEW") || change.change_classes.includes("COMMIT_ADDED") || change.change_classes.includes("COMMENT_ADDED") || change.change_classes.includes("REVIEW_ADDED")).length,
  objects_updated: diff.changes.filter(change => change.change_classes.some(kind => ["STATE_CHANGED", "BODY_CHANGED", "TITLE_CHANGED", "PR_HEAD_CHANGED", "PR_BASE_CHANGED", "FILE_CHANGED", "UPDATED", "BRANCH_MOVED", "RELEASE_CHANGED", "THREAD_UNRESOLVED"].includes(kind))).length,
  objects_removed: diff.changes.filter(change => change.change_classes.includes("REMOVED_FROM_SOURCE")).length,
  state_changes: diff.class_counts.STATE_CHANGED || 0,
  comments_added: diff.class_counts.COMMENT_ADDED || 0,
  reviews_added: diff.class_counts.REVIEW_ADDED || 0,
  pr_heads_changed: diff.class_counts.PR_HEAD_CHANGED || 0,
  commits_added: diff.class_counts.COMMIT_ADDED || 0,
  threads_unresolved: diff.class_counts.THREAD_UNRESOLVED || 0,
  changed_objects: diff.changed_count,
  unchanged_objects: diff.unchanged_count,
  affected_entities: affectedEntityIds,
  affected_relationships: [...new Set(diff.changes.flatMap(change => change.affected?.relationship_types || []))].sort(),
  affected_routes: affectedRoutes,
  affected_llm_records: affectedLlmRecords,
  review_thread_state: mirror.policy.review_threads,
  pr393: {
    source_object: "github:pull_request:ix-infrastructure/Ix#393",
    change_classes: [...new Set(pr393Changes.flatMap(change => change.change_classes))].sort(),
    previous_head: pr393Changes[0]?.previous?.snapshot?.head?.sha || null,
    current_head: pr393Changes[0]?.current?.snapshot?.head?.sha || null,
    current_state: pr393Changes[0]?.current?.snapshot?.state || null,
    current_merged: pr393Changes[0]?.current?.snapshot?.merged ?? null,
    merged_at: pr393Changes[0]?.current?.snapshot?.merged_at || null,
    review_threads: pr393Changes[0]?.current?.snapshot?.review_threads?.length ?? null,
    commits: pr393Changes[0]?.current?.snapshot?.commits?.map(commit => commit.sha) || [],
    files: pr393Changes[0]?.current?.snapshot?.changed_files?.map(file => file.filename) || [],
    source_authority: "GITHUB",
    temporal_status: "HISTORICAL_HEAD_SUPERSEDED_BY_CURRENT_MERGE",
  },
  full_rebuild: false,
  validation: "PENDING_PHASE_J_VALIDATION",
  external_mutations: 0,
  head: run("git", ["rev-parse", "HEAD"]),
};
writeFileSync(resolve(root, "planning/phase-j/SYNC-RECEIPT.json"), JSON.stringify(receipt, null, 2) + "\n");
console.log(JSON.stringify({ source: receipt.source, snapshot_before: receipt.snapshot_before, snapshot_after: receipt.snapshot_after, changed: diff.changed_count, unchanged: diff.unchanged_count, affected_entities: affectedEntityIds.length, affected_routes: affectedRoutes.length, review_thread_state: receipt.review_thread_state, pr393_classes: receipt.pr393.change_classes, external_mutations: 0 }, null, 2));
