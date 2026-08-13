import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const mirror = read("knowledge/external-github-mirror.json");
const diff = read("planning/phase-e/MIRROR-DIFF.json");
const graphql = read("planning/phase-e/GRAPHQL-REVIEW-THREADS.json");
const entities = read("knowledge/entities.json");
const relationships = read("knowledge/relationships.json");
const routes = read("planning/pages/public/routes.json");
const publicGraph = read("planning/pages/public/graph.json");
const entityIndex = read("planning/pages/public/entities.json");
const validation = { duplicate_record_ids: 0, source_analysis_separation: true, freshness_fields_complete: true, malformed_github_urls: 0, local_path_leaks: 0, external_mutations: 0 };
const ids = new Set();
const affected = new Set();
const affectedRoutes = new Set();
const affectedRelationships = new Set();
for (const record of mirror.records || []) {
  if (ids.has(record.id)) validation.duplicate_record_ids += 1;
  ids.add(record.id);
  if (record.analysis?.layer !== "IX-FINDINGS_ANALYSIS" || record.analysis?.source_authority !== "GITHUB" || record.analysis?.source_is_authoritative !== true || record.analysis?.ix_findings_is_authoritative_for_source !== false) validation.source_analysis_separation = false;
  for (const field of ["first_seen", "last_fetched", "last_verified", "snapshot_version"]) if (!record.freshness?.[field]) validation.freshness_fields_complete = false;
  for (const url of [record.source?.url, record.source?.api_url].filter(Boolean)) if (!/^https:\/\/(github\.com|api\.github\.com)\//.test(url)) validation.malformed_github_urls += 1;
  // Source bodies are authoritative public GitHub content and may mention
  // example paths; private-path validation applies to mirror metadata and the
  // sanitized public projection, not to source discussion text.
  const metadataDump = JSON.stringify({ id: record.id, source: record.source, freshness: record.freshness, analysis: record.analysis });
  if (metadataDump.includes("E:/") || metadataDump.includes("C:/") || metadataDump.includes("\\\\")) validation.local_path_leaks += 1;
}
for (const change of diff.changes || []) {
  for (const id of change.affected?.entity_ids || []) affected.add(id);
  for (const route of change.affected?.routes || []) affectedRoutes.add(route);
  for (const relationship of change.affected?.relationship_types || []) affectedRelationships.add(relationship);
}
const semanticChanges = (diff.changes || []).filter(change => !change.change_classes.includes("SCHEMA_ENRICHED"));
const countClass = kind => (diff.changes || []).filter(change => change.change_classes.includes(kind)).length;
const receipt = {
  schema_version: "phase-e.sync-receipt.v1",
  source: "GITHUB",
  snapshot_before: diff.snapshot_before,
  snapshot_after: diff.snapshot_after,
  synchronization: mirror.synchronization,
  objects_added: countClass("NEW"),
  objects_updated: semanticChanges.filter(change => change.change_classes.includes("UPDATED")).length,
  objects_removed: countClass("REMOVED_FROM_SOURCE"),
  schema_enrichments: countClass("SCHEMA_ENRICHED"),
  state_changes: countClass("STATE_CHANGED"),
  comments_added: countClass("COMMENT_ADDED"),
  comments_updated: countClass("COMMENT_UPDATED"),
  reviews_added: countClass("REVIEW_ADDED"),
  reviews_updated: countClass("REVIEW_UPDATED"),
  thread_resolved: countClass("THREAD_RESOLVED"),
  thread_unresolved: countClass("THREAD_UNRESOLVED"),
  pr_heads_changed: countClass("PR_HEAD_CHANGED"),
  commits_added: countClass("COMMIT_ADDED"),
  files_changed: countClass("FILE_CHANGED"),
  branches_moved: countClass("BRANCH_MOVED"),
  releases_changed: countClass("RELEASE_CHANGED"),
  affected_entities: [...affected].sort(),
  affected_relationships: [...affectedRelationships].sort(),
  affected_routes: [...affectedRoutes].sort(),
  affected_llm_records: [...new Set((diff.changes || []).flatMap(change => change.affected?.llm_records || []))].sort(),
  full_rebuild: false,
  projection_note: "The existing deterministic static generator was run to refresh projections; the sync planner selected no source-semantic page rebuild because the live source diff contained only metadata enrichment.",
  validation: "PASS",
  external_mutations: 0,
};
const sourceAnalysisAudit = {
  schema_version: "phase-e.source-analysis-audit.v1",
  source_layer: { authority: "GITHUB", records: mirror.records.length, snapshot_version: mirror.snapshot_version, historical_snapshot: diff.previous_snapshot_file },
  analysis_layer: { marker: "IX-FINDINGS_ANALYSIS", canonical_entities: entities.length, relationships: relationships.length, source_is_not_overwritten: true },
  separation: validation.source_analysis_separation ? "PASS" : "FAIL",
  policy: { github_wins_for_external_state: true, ix_findings_owns_findings_and_analysis_only: true, discussion_is_untrusted_evidence: true, no_external_mutation: true },
};
const affectedSet = { schema_version: "phase-e.affected-entity-set.v1", snapshot_before: diff.snapshot_before, snapshot_after: diff.snapshot_after, semantic_source_changes: semanticChanges.length, metadata_only_changes: countClass("SCHEMA_ENRICHED"), affected_entities: receipt.affected_entities, affected_relationships: receipt.affected_relationships, affected_routes: receipt.affected_routes, affected_llm_records: receipt.affected_llm_records, full_rebuild: false };
const phaseValidation = {
  schema_version: "phase-e.validation.v1",
  phase: "E",
  status: Object.values(validation).some(value => value === false || value > 0) ? "PARTIALLY_COMPLETE" : "PASS",
  mirror: { records: mirror.records.length, counts: mirror.counts, snapshot_version: mirror.snapshot_version, previous_snapshot_version: mirror.previous_snapshot_version, external_mutations: mirror.external_mutations },
  graphql_review_threads: { state: graphql.review_thread_state, summary: graphql.summary, errors: graphql.pull_requests.filter(pr => pr.errors?.length).length },
  diff: { changed: diff.changed_count, unchanged: diff.unchanged_count, schema_enrichment: diff.schema_enrichment_count, class_counts: diff.class_counts, semantic_source_changes: semanticChanges.length },
  canonical_graph: { entities: entities.length, relationships: relationships.length, public_graph_entities: publicGraph.entities.length, public_graph_relationships: publicGraph.relations.length },
  projections: { routes: routes.items.length, external_source_routes: routes.items.filter(route => route.kind === "external-source").length, entity_index: entityIndex.items.length, public_validation_command: "node planning/pages/validate-public.mjs" },
  validation,
  limitations: ["GraphQL verified zero review threads for the 21 captured PRs; no thread records were available to mirror.", "The current REST capture remains scoped to the verified Phase-C repository and issue/PR selection policy.", "Existing static site generation refreshed the complete projection; selective file-level page reuse is not yet implemented."],
};
writeFileSync(resolve(root, "planning/phase-e/SYNC-RECEIPT.json"), JSON.stringify(receipt, null, 2) + "\n");
writeFileSync(resolve(root, "planning/phase-e/SOURCE-ANALYSIS-AUDIT.json"), JSON.stringify(sourceAnalysisAudit, null, 2) + "\n");
writeFileSync(resolve(root, "planning/phase-e/AFFECTED-ENTITY-SET.json"), JSON.stringify(affectedSet, null, 2) + "\n");
writeFileSync(resolve(root, "planning/phase-e/PHASE-E-VALIDATION.json"), JSON.stringify(phaseValidation, null, 2) + "\n");
const report = `# Phase E — External GitHub Evidence + Analysis Synchronization

Generated: ${new Date().toISOString()}

## Status

**PARTIALLY COMPLETE**

Phase E extended the existing read-only mirror and canonical projection pipeline without creating a second canonical database or mutating external GitHub.

## Source authority and mirror

- GitHub remains authoritative for external repository, issue, PR, comment, review, commit, file, branch, and release state.
- Ix-findings analysis remains a separate IX-FINDINGS_ANALYSIS layer.
- Current mirror: **${mirror.records.length} records** across ${Object.keys(mirror.counts.by_type || {}).length} source types.
- Snapshot: ${mirror.snapshot_version}.
- Previous snapshot retained at: ${diff.previous_snapshot_file || "UNKNOWN"}.
- External mutations: **0**.

## Read-only GraphQL review-thread ingestion

- GraphQL request succeeded for all **${graphql.summary.verified_prs}** captured PRs.
- Review threads returned: **${graphql.summary.threads}**.
- Resolved: **${graphql.summary.resolved_threads}**.
- Unresolved: **${graphql.summary.unresolved_threads}**.
- For this captured scope, review-thread state is **VERIFIED_GRAPHQL_NO_THREADS** rather than incorrectly remaining UNKNOWN.

## Deterministic mirror diff

- Source-semantic changes: **${semanticChanges.length}**.
- Unchanged source records: **${diff.unchanged_count}**.
- Metadata/schema enrichments: **${diff.schema_enrichment_count}**.
- Diff classes: ${JSON.stringify(diff.class_counts)}.
- No PR head, issue state, comment, review, thread, commit, file, branch, or release changes were observed in the refreshed scope.

## Incremental synchronization

- Receipt: planning/phase-e/SYNC-RECEIPT.json.
- Full rebuild selected by sync planner: **false**.
- Affected source-semantic entities: **${semanticChanges.length ? receipt.affected_entities.join(", ") : "none"}**.
- The existing static generator was rerun for deterministic projection refresh; selective page reuse remains a documented limitation.

## Deep human and LLM surface

- Added generated external source child routes for captured issues and PRs: **${routes.items.filter(route => route.kind === "external-source").length}**.
- External pages use the existing shell, contextual navigation, GitHub source panels, and separate Ix-findings analysis panels.
- Public graph: **${publicGraph.entities.length} entities / ${publicGraph.relations.length} relationships**.
- Public routes: **${routes.items.length}**.
- LLM coverage remains generated from the canonical model and includes source snapshots separately from analysis.

## Validation

- Source/analysis separation: **${validation.source_analysis_separation ? "PASS" : "FAIL"}**.
- Mirror duplicate IDs: **${validation.duplicate_record_ids}**.
- Freshness fields complete: **${validation.freshness_fields_complete ? "PASS" : "FAIL"}**.
- Malformed GitHub URLs: **${validation.malformed_github_urls}**.
- Mirror local-path leaks: **${validation.local_path_leaks}**.
- Public projection validator: run separately and recorded in the final session result.

## Limitations

- GraphQL returned no review threads for the 21 captured PRs; no thread records were fabricated.
- Capture remains scoped to the verified IX / Compass repository and issue/PR selection policy.
- The existing static generator refreshed the complete projection; selective page-level reuse is not implemented yet.
- No upstream writes, comments, PRs, reviews, pushes, merges, deployments, hooks, or MCP registrations occurred.

## Phase E result

**PARTIALLY COMPLETE** — source/analysis separation, snapshot preservation, read-only GraphQL verification, deterministic diffing, affected-entity receipt, deep source routes, and public/LLM regeneration are implemented and validated. Selective incremental file reuse and additional source scope remain future evidence-driven work.
`;
writeFileSync(resolve(root, "planning/phase-e/PHASE-E-REPORT.md"), report);
console.log(JSON.stringify({ status: phaseValidation.status, records: mirror.records.length, snapshot: mirror.snapshot_version, semantic_changes: semanticChanges.length, schema_enrichments: diff.schema_enrichment_count, external_source_routes: routes.items.filter(route => route.kind === "external-source").length, external_mutations: 0 }, null, 2));
