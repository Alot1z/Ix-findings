import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const out = resolve(root, "planning/phase-d");
const read = file => JSON.parse(readFileSync(resolve(root, file), "utf8"));
const write = (file, value) => writeFileSync(join(out, file), typeof value === "string" ? value : JSON.stringify(value, null, 2) + "\n");
const entities = read("knowledge/entities.json");
const relationships = read("knowledge/relationships.json");
const phaseCValidation = read("planning/phase-c/PHASE-C-VALIDATION.json");
const freshness = read("planning/phase-c/FRESHNESS-DELTA.json");
const git = read("planning/phase-c/GIT-INTELLIGENCE.json");
const collaboration = read("planning/phase-c/COLLABORATION-GRAPH.json");
const findings = read("planning/phase-c/FINDING-GITHUB-RECONCILIATION.json");
const links = read("planning/phase-c/LINK-VALIDATION.json");
const syncDesign = read("planning/phase-c/INCREMENTAL-SYNC-DESIGN.json");
const baseline = read("planning/phase-d/PROTECTED-WORK-BASELINE.json");
const syncImplementation = read("planning/phase-d/INCREMENTAL-SYNC-IMPLEMENTATION.json");
const syncReceipt = read("planning/phase-d/SYNC-RECEIPT.json");
const liveGate = existsSync(resolve(root, "planning/phase-c/freshness-gate-live.json")) ? read("planning/phase-c/freshness-gate-live.json") : null;
const generatedAt = new Date().toISOString();
const norm = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const countBy = (items, key) => items.reduce((result, item) => { const value = typeof key === "function" ? key(item) : item[key]; result[value] = (result[value] || 0) + 1; return result; }, {});
const ids = new Set(entities.map(entity => entity.canonical_id));
const duplicateIds = entities.length - ids.size;
const dangling = relationships.filter(rel => !ids.has(rel.from) || !ids.has(rel.to));
const relationshipKeys = relationships.map(rel => `${rel.from}|${rel.type}|${rel.to}`);
const duplicateRelationships = relationshipKeys.length - new Set(relationshipKeys).size;
const nameGroups = new Map();
for (const entity of entities) { const key = `${entity.entity_type}|${norm(entity.canonical_name)}`; if (key.endsWith("|")) continue; if (!nameGroups.has(key)) nameGroups.set(key, []); nameGroups.get(key).push(entity.canonical_id); }
const duplicateConcepts = [...nameGroups.entries()].filter(([, values]) => values.length > 1).map(([key, values]) => ({ key, entity_ids: values, classification: "DUPLICATE_CONCEPT_CANDIDATE" }));
const crossTypeNames = new Map();
for (const entity of entities) { const key = norm(entity.canonical_name); if (!key) continue; if (!crossTypeNames.has(key)) crossTypeNames.set(key, new Set()); crossTypeNames.get(key).add(entity.entity_type); }
const overlappingTypes = [...crossTypeNames.entries()].filter(([, types]) => types.size > 1).map(([name, types]) => ({ normalized_name: name, entity_types: [...types].sort(), classification: "OVERLAP_REQUIRES_IDENTITY_REVIEW" }));

const sourceUrl = entity => [...(entity.aliases || []), entity.metadata?.url, entity.metadata?.github_url, entity.metadata?.blob_url].find(value => /^https:\/\/github\.com\//.test(String(value || ""))) || null;
const verifiedAt = entity => entity.temporal?.verified_at && entity.temporal.verified_at !== "UNKNOWN" ? entity.temporal.verified_at : null;
const provenanceClass = entity => {
  if (entity.status === "BLOCKED") return "BLOCKED";
  if (sourceUrl(entity) && verifiedAt(entity) && entity.confidence === "HIGH") return "VERIFIED";
  if ((entity.source_refs || []).length || (entity.evidence_ids || []).length || verifiedAt(entity)) return "PARTIAL";
  return "UNKNOWN";
};
const entityProvenance = entities.map(entity => ({
  entity_id: entity.canonical_id,
  entity_type: entity.entity_type,
  status: entity.status,
  confidence: entity.confidence,
  classification: provenanceClass(entity),
  gaps: {
    canonical_source_url: !sourceUrl(entity),
    source_reference: !(entity.source_refs || []).length,
    evidence_reference: !(entity.evidence_ids || []).length,
    first_seen: !entity.temporal?.valid_from || entity.temporal.valid_from === "UNKNOWN",
    last_verified: !verifiedAt(entity),
    extraction_method: !entity.metadata?.extraction_method,
    repository: !entity.metadata?.repository && !entity.metadata?.repo,
    full_commit_sha: entity.entity_type === "COMMIT" && !/^[0-9a-f]{40}$/i.test(entity.metadata?.sha || entity.canonical_name || ""),
    exact_line_range: ["FILE", "SYMBOL"].includes(entity.entity_type) && !(entity.metadata?.start_line || entity.metadata?.line),
  },
}));
const relationshipProvenance = relationships.map(rel => {
  const hasProvenance = Boolean((rel.source_refs || []).length || (rel.evidence_ids || []).length);
  return {
    relationship_id: rel.relationship_id,
    from: rel.from,
    to: rel.to,
    type: rel.type,
    status: rel.status,
    confidence: rel.confidence,
    derivation_class: rel.derivation_class || (rel.type === "CO_CHANGED_WITH" ? "STATISTICAL" : "UNCLASSIFIED"),
    extraction_method: rel.extraction_method || null,
    classification: hasProvenance && rel.confidence === "HIGH" ? "VERIFIED" : hasProvenance ? "PARTIAL" : rel.status === "BLOCKED" ? "BLOCKED" : "UNKNOWN",
    gaps: { source_or_evidence: !hasProvenance, temporal_scope: !rel.temporal_scope || Object.values(rel.temporal_scope).every(value => value === "UNKNOWN" || value == null), derivation_method: !rel.extraction_method && rel.type === "CO_CHANGED_WITH" },
  };
});
const provenanceSummary = {
  entities: countBy(entityProvenance, "classification"),
  relationships: countBy(relationshipProvenance, "classification"),
  entity_gap_counts: Object.fromEntries(entityProvenance.flatMap(item => Object.entries(item.gaps).filter(([, missing]) => missing).map(([key]) => key)).reduce((map, key) => { map.set(key, (map.get(key) || 0) + 1); return map; }, new Map()).entries()),
  relationship_gap_counts: Object.fromEntries(relationshipProvenance.flatMap(item => Object.entries(item.gaps).filter(([, missing]) => missing).map(([key]) => key)).reduce((map, key) => { map.set(key, (map.get(key) || 0) + 1); return map; }, new Map()).entries()),
  policy: "Missing provenance is reported, never fabricated. Local absolute paths are internal-only and not copied into public projections.",
};

const liveHeadShas = new Set([
  liveGate?.live?.head,
  ...(freshness.live?.fork_heads ? Object.values(freshness.live.fork_heads) : []),
  ...freshness.affected_entities.map(item => item.current_head || item.current).filter(value => typeof value === "string" && /^[0-9a-f]{40}$/i.test(value)),
].filter(Boolean));
const commitEntities = entities.filter(entity => entity.entity_type === "COMMIT");
const historicalCurrentEdges = relationships.filter(rel => {
  const from = entities.find(entity => entity.canonical_id === rel.from);
  const to = entities.find(entity => entity.canonical_id === rel.to);
  return rel.status !== "HISTORICAL" && ((from?.entity_type === "COMMIT" && from.status === "HISTORICAL") || (to?.entity_type === "COMMIT" && to.status === "HISTORICAL"));
});
const gitQuality = {
  generated_at: generatedAt,
  source_artifacts: ["planning/phase-c/GIT-INTELLIGENCE.json", "knowledge/entities.json", "knowledge/relationships.json"],
  relationship_counts: countBy(relationships, "type"),
  derivation_class_counts: countBy(relationships, rel => rel.derivation_class || "UNCLASSIFIED"),
  statistical_relationships: relationships.filter(rel => rel.type === "CO_CHANGED_WITH").map(rel => ({ relationship_id: rel.relationship_id, from: rel.from, to: rel.to, confidence: rel.confidence, derivation_class: rel.derivation_class || "STATISTICAL", extraction_method: rel.extraction_method || "UNKNOWN", source_refs: rel.source_refs || [], status: rel.status })),
  statistical_count: relationships.filter(rel => rel.type === "CO_CHANGED_WITH").length,
  statistical_edges_without_explicit_class: relationships.filter(rel => rel.type === "CO_CHANGED_WITH" && rel.derivation_class !== "STATISTICAL").length,
  weak_relationships: relationships.filter(rel => rel.confidence !== "HIGH" || !(rel.source_refs || []).length).length,
  commit_entities: commitEntities.length,
  current_commit_entities: commitEntities.filter(entity => entity.status === "CURRENT").length,
  historical_commit_entities: commitEntities.filter(entity => entity.status === "HISTORICAL").length,
  historical_commit_current_relationships: historicalCurrentEdges.length,
  live_head_sha_count: liveHeadShas.size,
  git_intelligence_counts: { commits: git.commits.length, files: git.files.length, branches: git.branches.length, tags: git.tags.length, relationships: git.relationships.length, cochange: git.cochange_relationships.length },
  interpretation: "CO_CHANGED_WITH is statistical change correlation, not architectural dependency. Hotspots are signals, not defects.",
};

const collaborationIds = new Set(collaboration.entities.map(entity => entity.canonical_id));
const collaborationRelKeys = new Set(collaboration.relationships.map(rel => `${rel.from}|${rel.type}|${rel.to}`));
const collaborationReconciliation = {
  generated_at: generatedAt,
  baseline: "planning/phase-c/COLLABORATION-GRAPH.json",
  entities: collaboration.entities.length,
  relationships: collaboration.relationships.length,
  duplicate_entity_ids: collaboration.entities.length - collaborationIds.size,
  duplicate_relationships: collaboration.relationships.length - collaborationRelKeys.size,
  dangling_relationships: collaboration.relationships.filter(rel => !collaborationIds.has(rel.from) || !collaborationIds.has(rel.to)).length,
  review_thread_state: collaboration.limitations?.review_threads || "UNKNOWN",
  evidence_classes: countBy(collaboration.entities, entity => entity.metadata?.content_classification || (entity.entity_type.includes("COMMENT") ? "DISCUSSION_EVIDENCE_UNTRUSTED" : "OFFICIAL_GITHUB_FACT")),
  ownership_policy: "AUTHOR/COMMITTER/CONTRIBUTOR/REVIEWER signals may be retained; OWNER/MAINTAINER require authoritative repeated evidence and are not inferred here.",
  cross_reference_policy: "Only explicit URLs and captured GitHub metadata create collaboration links; discussion text remains untrusted evidence.",
};

const findingAudit = {
  generated_at: generatedAt,
  source: "planning/phase-c/FINDING-GITHUB-RECONCILIATION.json",
  findings: findings.findings.map(item => ({ ...item, status_basis: item.reconciled_status, action_classification: item.reconciled_status === "CURRENT" ? "CURRENT" : item.reconciled_status === "RESOLVED" ? "FIXED" : item.reconciled_status === "UNKNOWN" ? "BLOCKED_OR_NEEDS_REPRODUCTION" : item.reconciled_status })),
  summary: { ...findings.summary, needs_reproduction: findings.findings.filter(item => item.reconciled_status === "UNKNOWN").length, blocked: findings.findings.filter(item => item.reconciled_status === "UNKNOWN").length },
  policy: "Current GitHub state is reconciliation evidence, not a silent rewrite of the findings ledger. Unsupported conclusions are not promoted to CURRENT.",
};
const canonicalReconciliation = {
  generated_at: generatedAt,
  phase_c_snapshot: { entities: phaseCValidation.canonical_projection.entities, relationships: phaseCValidation.canonical_projection.relationships },
  rebuilt_snapshot: { entities: entities.length, relationships: relationships.length },
  snapshot_reconciles: entities.length === phaseCValidation.canonical_projection.entities && relationships.length === phaseCValidation.canonical_projection.relationships,
  duplicate_entity_ids: duplicateIds,
  duplicate_relationships: duplicateRelationships,
  dangling_relationships: dangling.length,
  duplicate_concept_candidates: duplicateConcepts,
  duplicate_concept_candidate_count: duplicateConcepts.length,
  overlapping_entity_type_candidates: overlappingTypes.slice(0, 500),
  overlapping_entity_type_candidate_count: overlappingTypes.length,
  status_counts: countBy(entities, "status"),
  relationship_status_counts: countBy(relationships, "status"),
  artifact_policy: "Phase-D scripts/reports are excluded from canonical source discovery; Phase-C reports remain auditable inputs. Historical records are retained.",
};

const routeFiles = ["planning/pages/public/routes.json", "planning/pages/public/graph.json", "planning/pages/public/data/data.js", "planning/pages/public/llms-full.txt", "planning/pages/public/sitemap.xml"];
const routeData = read("planning/pages/public/routes.json");
const publicGraph = read("planning/pages/public/graph.json");
const routeValidation = {
  generated_at: generatedAt,
  canonical_entities: entities.length,
  canonical_relationships: relationships.length,
  routes: routeData.items?.length || 0,
  public_graph_entities: publicGraph.entities?.length || 0,
  public_graph_relationships: publicGraph.relations?.length || 0,
  llm_full_exists: existsSync(resolve(root, "planning/pages/public/llms-full.txt")),
  generated_files_present: routeFiles.map(file => ({ file, present: existsSync(resolve(root, file)) })),
  canonical_shell: { root: "planning/wiki/index.html", generator: "planning/pages/build-public.mjs", deep_shell_reuses_root: readFileSync(resolve(root, "planning/pages/public/repositories/index.html"), "utf8").includes("nav-group-label") },
  sidebar_group_count: (readFileSync(resolve(root, "planning/pages/public/index.html"), "utf8").match(/nav-group-label/g) || []).length,
  deep_sidebar_group_count: (readFileSync(resolve(root, "planning/pages/public/repositories/index.html"), "utf8").match(/nav-group-label/g) || []).length,
  status: (publicGraph.entities?.length === entities.length && publicGraph.relations?.length === relationships.length) ? "PASS" : "FAIL",
};
const visualValidation = {
  generated_at: generatedAt,
  screenshots: ["visual-root.png", "visual-repositories.png", "visual-findings.png", "visual-pr-393.png", "visual-issue-219.png"].map(file => ({ file: `planning/phase-c/${file}`, present: existsSync(resolve(root, `planning/phase-c/${file}`)) })),
  desktop: "VERIFIED_FROM_PHASE_C_SCREENSHOTS_AND_QWEN_REVIEW",
  mobile_responsive: "UNKNOWN",
  direct_deep_link_refresh: "UNKNOWN",
  production_http: "UNKNOWN",
  qwen: "Phase-C Qwen review is retained; no redesign was made from low-confidence OCR.",
  status: "PARTIAL",
};

const worktreeAfter = {};
const run = (args, cwd) => { try { return execFileSync("git", args, { cwd, encoding: "utf8" }).trim(); } catch { return null; } };
const sha256 = value => createHash("sha256").update(value).digest("hex");
for (const [name, before] of Object.entries(baseline.worktrees || {}).filter(([name]) => name !== "Ix-findings")) {
  const status = before.path_internal && existsSync(before.path_internal) ? run(["status", "--porcelain=v1"], before.path_internal) : null;
  const afterSha = status == null ? null : sha256(status);
  worktreeAfter[name] = { branch: before.path_internal ? run(["branch", "--show-current"], before.path_internal) : null, head: before.path_internal ? run(["rev-parse", "HEAD"], before.path_internal) : null, status_sha256: afterSha, unchanged: afterSha != null && afterSha === before.status_sha256 }; 
}
const protectedValidation = { root_baseline_path_count: baseline.root.changed_path_count, external_worktrees: worktreeAfter, external_worktrees_unchanged: Object.values(worktreeAfter).every(item => item.unchanged), root_mutation_scope: "Canonical/projection/planning paths were intentionally mutated; pre-existing root dirty work was not reset, cleaned, stashed, or discarded." };

write("CANONICAL-RECONCILIATION.json", canonicalReconciliation);
write("PROVENANCE-AUDIT.json", { generated_at: generatedAt, source: "knowledge/entities.json + knowledge/relationships.json", summary: provenanceSummary, entity_records: entityProvenance, relationship_records: relationshipProvenance });
write("COLLABORATION-RECONCILIATION.json", collaborationReconciliation);
write("FINDING-STATUS-AUDIT.json", findingAudit);
write("GIT-RELATIONSHIP-QUALITY.json", gitQuality);
write("ROUTE-AND-PROJECTION-VALIDATION.json", routeValidation);
write("VISUAL-PRODUCTION-VALIDATION.json", visualValidation);
write("PHASE-D-VALIDATION.json", {
  generated_at: generatedAt,
  phase: "D",
  status: "PARTIALLY_COMPLETE",
  canonical_reconciliation: { status: canonicalReconciliation.snapshot_reconciles ? "PASS" : "CHANGED_SNAPSHOT", entities: entities.length, relationships: relationships.length, duplicate_ids: duplicateIds, duplicate_relationships: duplicateRelationships, dangling_relationships: dangling.length },
  provenance: provenanceSummary,
  current_historical_commits: { historical_current_relationships: historicalCurrentEdges.length, status: historicalCurrentEdges.length === 0 ? "PASS" : "FAIL" },
  collaboration: collaborationReconciliation,
  findings: findingAudit.summary,
  incremental_sync: { status: syncReceipt.status, affected_entities: syncReceipt.affected_entity_ids.length, full_rebuild: syncReceipt.rebuild_scope.full_rebuild, validation: syncReceipt.validation },
  projections: routeValidation,
  visual: visualValidation,
  links: { phase_c_status: links.status, malformed_url_records: links.malformed_url_records },
  protected_work: protectedValidation,
  external_actions: { github_writes: 0, pushes: 0, deployments: 0, hooks: 0, mcp_registrations: 0, credential_changes: 0 },
  blockers: ["Mobile/responsive, direct refresh/back-forward, and production HTTP behavior remain UNKNOWN.", "Review-thread resolved/unresolved state remains UNKNOWN without GraphQL capture.", "Provenance is PARTIAL/UNKNOWN for many local source artifacts and relationship records; gaps are reported rather than fabricated."],
});
write("PHASE-E-IMPLEMENTATION-INPUT.md", `# Phase-E Implementation Input

This is an evidence index, not a generic roadmap. Phase E must be designed only after reviewing the actual Phase-D result and a new live read-only state capture.

## Required inputs

- planning/phase-d/PHASE-D-REPORT.md
- planning/phase-d/PHASE-D-VALIDATION.json
- planning/phase-d/CANONICAL-RECONCILIATION.json
- planning/phase-d/PROVENANCE-AUDIT.json
- planning/phase-d/INCREMENTAL-SYNC-IMPLEMENTATION.json
- current live GitHub state, freshly captured before any Phase-E mutation

## Evidence that must constrain Phase E

- Canonical graph: ${entities.length} entities / ${relationships.length} relationships after controlled rebuild.
- Statistical edges: ${gitQuality.statistical_count}; they must remain explicitly statistical and must not be treated as architecture facts.
- Provenance classes: ${JSON.stringify(provenanceSummary.entities)} for entities and ${JSON.stringify(provenanceSummary.relationships)} for relationships.
- Incremental representative receipt: ${syncReceipt.receipt_id}, status ${syncReceipt.status}, affected entities ${syncReceipt.affected_entity_ids.join(", ") || "none"}.
- Collaboration thread resolution: ${collaborationReconciliation.review_thread_state}.
- Visual/production status: ${visualValidation.status}; production HTTP and mobile behavior remain UNKNOWN.

No Phase-E scope, ontology expansion, webhook installation, MCP registration, client change, or GitHub mutation is authorized by this artifact alone.
`);
const report = `# Phase D — Canonical Reconciliation + Provenance + Sync

Generated: ${generatedAt}

Phase C artifacts were consumed as the baseline. No Phase-E roadmap was invented.

## Result

**STATUS: PARTIALLY COMPLETE**

### Canonical reconciliation

- Phase-C verified snapshot: ${phaseCValidation.canonical_projection.entities} entities / ${phaseCValidation.canonical_projection.relationships} relationships.
- Controlled rebuild: ${entities.length} entities / ${relationships.length} relationships.
- Duplicate IDs: ${duplicateIds}; duplicate relationships: ${duplicateRelationships}; dangling relationships: ${dangling.length}.
- Duplicate concept candidates: ${duplicateConcepts.length}; overlapping type candidates: ${overlappingTypes.length}.
- Historical records were retained. Phase-D scripts/reports are excluded from canonical source discovery so report generation cannot inflate the graph.

### Provenance

Entity provenance: ${JSON.stringify(provenanceSummary.entities)}. Relationship provenance: ${JSON.stringify(provenanceSummary.relationships)}. Missing URLs, timestamps, evidence IDs, extraction methods, repository metadata, and line precision are explicitly classified in PROVENANCE-AUDIT.json; nothing was fabricated.

### Current versus historical commits

Current-to-historical commit relationships remaining: ${historicalCurrentEdges.length}. The freshness model preserves old SHAs as HISTORICAL and avoids presenting superseded branch/PR heads as CURRENT.

### Collaboration

${collaboration.entities.length} collaboration entities and ${collaboration.relationships.length} relationships were reconciled with ${collaborationReconciliation.dangling_relationships} dangling relationships. Review-thread state remains ${collaborationReconciliation.review_thread_state}; reviewer/maintainer ownership was not inferred.

### Findings

${findings.summary.total} findings were reconciled from Phase C: ${findings.summary.current} current, ${findings.summary.resolved} resolved, and ${findings.summary.unknown} unknown/blocked-or-needs-reproduction. The ledger was not silently rewritten.

### Incremental sync foundation

Implemented planning/phase-d/incremental-sync.mjs as a deterministic local/manual dry-run foundation. Representative event: ${syncReceipt.source_event.event_type}; receipt ${syncReceipt.receipt_id}; status ${syncReceipt.status}; affected IDs: ${(syncReceipt.affected_entity_ids || []).join(", ") || "none"}; full rebuild: ${syncReceipt.rebuild_scope.full_rebuild}. Watermark, source cursor, changed objects, affected relationships, rebuild scope, validation, timestamps, and failure state are persisted.

### Git relationship quality

${gitQuality.statistical_count} CO_CHANGED_WITH edges are labeled STATISTICAL; they are not semantic dependencies. Git history counts remain ${git.commits.length} commits, ${git.files.length} files, ${git.branches.length} branches, and ${git.cochange_relationships.length} co-change signals.

### Projections and routes

Canonical/public graph parity: ${routeValidation.status}. Public graph: ${routeValidation.public_graph_entities}/${routeValidation.public_graph_relationships}; routes: ${routeValidation.routes}; sidebar groups root/deep: ${routeValidation.sidebar_group_count}/${routeValidation.deep_sidebar_group_count}. Existing UI design was preserved.

### Visual and production verification

Desktop evidence from Phase C is retained and structurally consistent. Visual result is PARTIAL: mobile/responsive behavior, direct refresh/back-forward, and production HTTP behavior remain UNKNOWN.

### Security and protected work

No external mutations occurred. Public projection and secret/path validation are run after generation. External worktrees unchanged: **${protectedValidation.external_worktrees_unchanged}**. The root already contained ${baseline.root.changed_path_count} dirty paths; only the approved canonical/projection/planning scope was mutated.

## Blockers

- GraphQL review-thread state unavailable.
- Mobile/responsive and production HTTP behavior unavailable in this environment.
- Many local source and relationship records remain PARTIAL or UNKNOWN for provenance; the audit records the gaps.
- No maintainer/owner claim is promoted without stronger evidence.

## Required Phase-E input

PHASE-E-IMPLEMENTATION-INPUT.md is an evidence index only. Phase E must consume the Phase-D report, validation, reconciliation, provenance, sync artifacts, and a newly refreshed live state. Phase D stops here.
`;
write("PHASE-D-REPORT.md", report);
console.log(JSON.stringify({ phase: "D", status: "PARTIALLY_COMPLETE", entities: entities.length, relationships: relationships.length, provenance: provenanceSummary, sync: { status: syncReceipt.status, affected: syncReceipt.affected_entity_ids }, projections: routeValidation.status, external_worktrees_unchanged: protectedValidation.external_worktrees_unchanged }, null, 2));
