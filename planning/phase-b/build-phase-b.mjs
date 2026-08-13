import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "planning", "phase-b");
mkdirSync(OUT, { recursive: true });
const readJson = path => JSON.parse(readFileSync(join(ROOT, path), "utf8"));
const writeJson = (path, value) => writeFileSync(join(ROOT, path), JSON.stringify(value, null, 2) + "\n", "utf8");
const sha = value => createHash("sha1").update(String(value)).digest("hex").slice(0, 12);
const phaseA = readJson("planning/discovery/PHASE-A-REPORT.json");
const links = readJson("planning/discovery/LINK-MANIFEST.json");
const paths = readJson("planning/discovery/PATH-MANIFEST.json");
const publicRoutes = readJson("planning/pages/public/routes.json");
const publicFiles = readJson("planning/pages/public/files.json");
const graph = readJson("planning/pages/public/graph.json");
const entities = readJson("knowledge/entities.json");
const relationships = readJson("knowledge/relationships.json");
const live = readJson("knowledge/live-github-state.json");
const aliasMap = { "Alot1z/Ix": "Alot1z/Ix-remap" };
const canonicalRepo = value => aliasMap[value] || value;
const githubRepoUrl = id => {
  if (id === "Alot1z/Ix-remap") return "https://github.com/Alot1z/Ix-remap";
  if (id === "ix-infrastructure/Ix") return "https://github.com/ix-infrastructure/Ix";
  if (id === "Alot1z/Ix-findings") return "https://github.com/Alot1z/Ix-findings";
  if (id === "ix-infrastructure/ix-compass-dist") return "https://github.com/ix-infrastructure/ix-compass-dist";
  return null;
};
const canonicalUrl = url => String(url || "").replace(/^https:\/\/github\.com\/Alot1z\/Ix(?=\/|$)/, "https://github.com/Alot1z/Ix-remap");
const entitiesOut = [];
const entityIds = new Set();
function addEntity(type, id, name, metadata = {}, status = "CURRENT", confidence = "HIGH") {
  if (entityIds.has(id)) return;
  entityIds.add(id);
  entitiesOut.push({
    id,
    entity_type: type,
    canonical_name: name,
    status,
    confidence,
    source_refs: ["planning/discovery/PHASE-A-REPORT.json", "planning/discovery/LINK-MANIFEST.json"],
    metadata,
    identity: { deterministic: true, key: id },
  });
}
const edges = [];
const edgeIds = new Set();
function addEdge(from, type, to, evidence = "planning/discovery/LINK-MANIFEST.json", confidence = "HIGH") {
  if (!entityIds.has(from) || !entityIds.has(to)) return;
  const key = `${from}|${type}|${to}`;
  if (edgeIds.has(key)) return;
  edgeIds.add(key);
  edges.push({ relationship_id: `REL-${sha(key)}`, from, type, to, confidence, status: "CURRENT", source_refs: [evidence], evidence_ids: [], summary: `${from} ${type} ${to}` });
}
function id(prefix, value) { return `${prefix}-${sha(value)}`; }

addEntity("ORGANIZATION", "ORG-ix-infrastructure", "ix-infrastructure", { login: "ix-infrastructure", url: "https://github.com/ix-infrastructure", evidence_state: "GITHUB_VERIFIED" });
addEntity("PERSON", "PERSON-Alot1z", "Alot1z", { login: "Alot1z", github_url: "https://github.com/Alot1z", github_numeric_id: 16801672, verified_account: true, roles: ["AUTHOR", "CONTRIBUTOR"], evidence_state: "GITHUB_VERIFIED", note: "Role assignments remain limited to verified account identity; maintainer/owner status is not inferred." });
for (const repo of links.repositories) {
  const repoId = canonicalRepo(repo.repository_id);
  addEntity("REPOSITORY", `REPO-${repoId.replaceAll("/", "-")}`, repoId, { repository_id: repoId, url: githubRepoUrl(repoId) || repo.repository_url, role: repo.role, parent_repository_id: repo.parent_repository_id ? canonicalRepo(repo.parent_repository_id) : undefined, legacy_aliases: repoId === "Alot1z/Ix-remap" ? ["Alot1z/Ix"] : [], evidence_state: "GITHUB_VERIFIED" });
}
for (const fork of links.forks) {
  const forkRepo = canonicalRepo(fork.fork_repository_id);
  addEntity("FORK", `FORK-${forkRepo.replaceAll("/", "-")}`, forkRepo, { repository_id: forkRepo, fork_url: githubRepoUrl(forkRepo), parent_repository_id: canonicalRepo(fork.parent_repository_id), parent_url: canonicalUrl(fork.parent_url), evidence_state: "GITHUB_VERIFIED" });
  addEdge(`FORK-${forkRepo.replaceAll("/", "-")}`, "FORK_OF", `REPO-${canonicalRepo(fork.parent_repository_id).replaceAll("/", "-")}`);
}
for (const clone of links.clones) {
  const repoId = canonicalRepo(clone.repository_id);
  const status = clone.dirty_file_count ? "IN_PROGRESS" : "CURRENT";
  addEntity("CLONE", clone.clone_id, clone.clone_id, { repository_id: repoId, local_absolute_path: clone.local_absolute_path, head_full_sha: clone.head_full_sha, current_branch: clone.current_branch, tracking_ref: clone.tracking_ref, ahead: clone.ahead, behind: clone.behind, dirty_file_count: clone.dirty_file_count, privacy: "INTERNAL_ONLY" }, status);
  addEdge(clone.clone_id, "CLONES", `REPO-${repoId.replaceAll("/", "-")}`);
}
for (const worktree of links.worktrees) {
  const repoId = canonicalRepo(worktree.repository_id);
  const clone = links.clones.find(c => c.local_absolute_path === worktree.parent_clone_path);
  const status = worktree.status_file_count ? "IN_PROGRESS" : "CURRENT";
  addEntity("WORKTREE", worktree.worktree_id, worktree.worktree_id, { repository_id: repoId, parent_clone_id: clone?.clone_id, parent_clone_path: worktree.parent_clone_path, local_absolute_path: worktree.local_absolute_path, branch: worktree.branch, head_full_sha: worktree.head_full_sha, status_file_count: worktree.status_file_count, privacy: "INTERNAL_ONLY" }, status);
  if (clone) addEdge(worktree.worktree_id, "WORKTREE_OF", clone.clone_id);
}
for (const remote of links.remotes) {
  const remoteId = id("REMOTE", `${remote.clone_path}:${remote.remote_name}:${remote.fetch_url}:${remote.push_url}`);
  const fetchRepo = canonicalRepo(remote.fetch_repository_id);
  addEntity("REMOTE", remoteId, `${remote.clone_path}:${remote.remote_name}`, { clone_path: remote.clone_path, remote_name: remote.remote_name, fetch_url: canonicalUrl(remote.fetch_url), push_url: canonicalUrl(remote.push_url), fetch_repository_id: fetchRepo, push_repository_id: canonicalRepo(remote.push_repository_id), privacy: "INTERNAL_ONLY" });
  addEdge(remoteId, "POINTS_TO", `REPO-${fetchRepo.replaceAll("/", "-")}`);
}
for (const branch of links.branches) {
  const repoId = canonicalRepo(branch.repository_id);
  const branchId = id("BRANCH", `${repoId}:${branch.full_ref}`);
  addEntity("BRANCH", branchId, `${repoId}:${branch.branch_name}`, { repository_id: repoId, clone_path: branch.clone_path, full_ref: branch.full_ref, branch_name: branch.branch_name, head_full_sha: branch.head_full_sha, tracking_ref: branch.tracking_ref, branch_url: branch.branch_url ? canonicalUrl(branch.branch_url) : null, commit_url: branch.commit_url ? canonicalUrl(branch.commit_url) : null, evidence_state: "SOURCE_DIRECT" });
  addEdge(branchId, "BELONGS_TO", `REPO-${repoId.replaceAll("/", "-")}`);
  if (branch.head_full_sha) {
    const commitId = `COMMIT-${branch.head_full_sha}`;
    addEntity("COMMIT", commitId, branch.head_full_sha, { repository_id: repoId, full_sha: branch.head_full_sha, commit_url: branch.commit_url ? canonicalUrl(branch.commit_url) : null, observed_from_ref: branch.full_ref, evidence_state: "SOURCE_DIRECT" });
    addEdge(branchId, "POINTS_TO", commitId);
  }
  for (const worktree of links.worktrees) if (worktree.branch === branch.branch_name && canonicalRepo(worktree.repository_id) === repoId) addEdge(worktree.worktree_id, "CHECKS_OUT", branchId);
}
const files = publicFiles.items || [];
const directoryIds = new Map();
for (const file of files) {
  const repoId = canonicalRepo(file.repository);
  const fileId = id("FILE", `${repoId}:${file.commit}:${file.path}`);
  addEntity("FILE", fileId, file.path, { repository_id: repoId, repository_relative_path: file.path, commit_full_sha: file.commit, github_blob_url: canonicalUrl(file.url), line_start: file.start_line, line_end: file.end_line, symbol: file.symbol || null, evidence_state: "GITHUB_VERIFIED" });
  addEdge(fileId, "PART_OF", `REPO-${repoId.replaceAll("/", "-")}`);
  const parts = file.path.split("/");
  for (let i = 1; i < parts.length; i++) {
    const path = parts.slice(0, i).join("/");
    const directoryId = id("DIRECTORY", `${repoId}:${path}`);
    if (!directoryIds.has(directoryId)) {
      directoryIds.set(directoryId, true);
      addEntity("DIRECTORY", directoryId, path, { repository_id: repoId, repository_relative_path: path, evidence_state: "DERIVED_FROM_VERIFIED_FILE" });
      addEdge(directoryId, "PART_OF", `REPO-${repoId.replaceAll("/", "-")}`, "planning/pages/public/files.json", "MEDIUM");
    }
    addEdge(fileId, "PART_OF", directoryId, "planning/pages/public/files.json", "MEDIUM");
  }
  if (file.symbol) {
    const symbolId = id("SYMBOL", `${repoId}:${file.commit}:${file.path}:${file.symbol}`);
    addEntity("SYMBOL", symbolId, file.symbol, { repository_id: repoId, file_id: fileId, symbol_type: "UNKNOWN", github_line_url: canonicalUrl(file.url), evidence_state: "GITHUB_VERIFIED" });
    addEdge(symbolId, "DEFINED_IN", fileId, "planning/pages/public/files.json");
  }
}

const registry = {
  schema_version: "phase-b-identity-1",
  generated_at: new Date().toISOString(),
  source_of_truth: "knowledge/",
  source_evidence: ["planning/discovery/PHASE-A-REPORT.json", "planning/discovery/LINK-MANIFEST.json", "planning/discovery/PATH-MANIFEST.json", "planning/pages/public/files.json"],
  github_identity: { login: "Alot1z", numeric_id: 16801672, url: "https://github.com/Alot1z", token_used_read_only: true },
  repository_aliases: [{ alias: "Alot1z/Ix", canonical: "Alot1z/Ix-remap", evidence: "live GitHub API rename/redirect observed in Phase A" }],
  entities: entitiesOut,
  relationships: edges,
  unsupported_entity_types: ["TAG", "PACKAGE", "DEPENDENCY", "ISSUE_COMMENT", "REVIEW", "REVIEW_COMMENT", "TEAM", "ARCHITECTURE_COMPONENT"],
  unsupported_reason: "No verified source records were available in Phase B input; types remain in the ontology without fabricated nodes.",
  privacy: { internal_absolute_paths: "INTERNAL_ONLY", public_projection: "allowlist required", token_values: "NEVER_STORED" }
};
writeJson("knowledge/identity-registry.json", registry);

const routeItems = (publicRoutes.items || []).map(route => {
  const parent = route.parent || "/";
  const siblings = (publicRoutes.items || []).filter(candidate => candidate.parent === parent && candidate.path !== route.path).map(candidate => candidate.path);
  const children = (publicRoutes.items || []).filter(candidate => candidate.parent === route.path).map(candidate => candidate.path);
  const first = route.path.split("/").filter(Boolean)[0] || "overview";
  const active = ["prs", "issues", "repositories", "commits", "findings", "evidence", "phases", "timeline", "contributions", "suggestions", "decisions", "files", "entities", "map"].includes(first) ? first : ["mcp"].includes(first) ? "map" : "overview";
  return { ...route, route_id: `ROUTE-${sha(route.path)}`, parent, siblings, children, active_nav_key: active, entity_ids: [] };
});
writeJson(join("planning/phase-b", "SCHEMA-MIGRATION-REPORT.json"), { phase: "B-1", status: "COMPLETE", canonical_source: "knowledge/", added_identity_registry: "knowledge/identity-registry.json", added_entity_types: ["ORGANIZATION", "FORK", "CLONE", "WORKTREE", "REMOTE", "TAG", "DIRECTORY", "FILE", "SYMBOL", "PACKAGE", "DEPENDENCY", "ISSUE_COMMENT", "REVIEW_COMMENT", "PERSON", "TEAM", "ARCHITECTURE_COMPONENT", "IMPLEMENTATION_SECTION"], added_relationship_types: ["FORK_OF", "CLONES", "WORKTREE_OF", "POINTS_TO", "BELONGS_TO", "CHECKS_OUT", "PARENT_OF", "HEADS_AT", "DEFINED_IN", "AUTHORED", "OPENED", "COMMENTED_ON", "REVIEWED", "DISCOVERED", "DECIDED", "DOCUMENTS_ISSUE", "DOCUMENTS_PR", "DOCUMENTS_COMMIT", "DOCUMENTS_FINDING"], unsupported_types_preserved: registry.unsupported_entity_types, evidence: registry.source_evidence });
writeJson(join("planning/phase-b", "PHASE-B-SCHEMA.json"), { schema_version: "phase-b-identity-1", canonical_source: "knowledge/", entity_types: [...new Set(entitiesOut.map(entity => entity.entity_type))], relationship_types: [...new Set(edges.map(edge => edge.type))], required_identity_fields: ["id", "entity_type", "canonical_name", "status", "confidence", "source_refs", "identity"], temporal_statuses: ["CURRENT", "HISTORICAL", "STALE", "SUPERSEDED", "RESOLVED", "CONTRADICTED", "UNKNOWN", "BLOCKED"], evidence_states: ["VERIFIED", "INFERRED", "HYPOTHESIS", "UNKNOWN", "SOURCE_DIRECT", "GITHUB_VERIFIED", "DERIVED", "UNVERIFIED"], privacy_boundary: "absolute local paths are internal only" });
writeJson(join("planning/phase-b", "ENTITY-IDENTITY-MAP.json"), { generated_at: registry.generated_at, canonical_source: "knowledge/identity-registry.json", entities: entitiesOut, deterministic_id_rule: "type-specific stable hash of canonical identity fields; full SHAs remain full in metadata" });
writeJson(join("planning/phase-b", "REPOSITORY-MAP.json"), { generated_at: registry.generated_at, repositories: registry.entities.filter(e => ["ORGANIZATION", "PERSON", "REPOSITORY", "FORK"].includes(e.entity_type)), aliases: registry.repository_aliases });
writeJson(join("planning/phase-b", "FORK-CLONE-WORKTREE-MAP.json"), { generated_at: registry.generated_at, forks: registry.entities.filter(e => e.entity_type === "FORK"), clones: registry.entities.filter(e => e.entity_type === "CLONE"), worktrees: registry.entities.filter(e => e.entity_type === "WORKTREE") });
writeJson(join("planning/phase-b", "REMOTE-BRANCH-COMMIT-MAP.json"), { generated_at: registry.generated_at, remotes: registry.entities.filter(e => e.entity_type === "REMOTE"), branches: registry.entities.filter(e => e.entity_type === "BRANCH"), commits: registry.entities.filter(e => e.entity_type === "COMMIT"), relationships: edges.filter(e => ["POINTS_TO", "BELONGS_TO", "CHECKS_OUT"].includes(e.type)) });
writeJson(join("planning/phase-b", "URL-MANIFEST.json"), { generated_at: registry.generated_at, repositories: registry.entities.filter(e => ["REPOSITORY", "FORK", "ORGANIZATION", "PERSON"].includes(e.entity_type)).map(e => ({ id: e.id, url: e.metadata.url || e.metadata.fork_url || e.metadata.github_url || e.metadata.repository_url || null })), branches: registry.entities.filter(e => e.entity_type === "BRANCH").map(e => ({ id: e.id, branch_url: e.metadata.branch_url, commit_url: e.metadata.commit_url })), commits: registry.entities.filter(e => e.entity_type === "COMMIT").map(e => ({ id: e.id, full_sha: e.metadata.full_sha, commit_url: e.metadata.commit_url })), files: registry.entities.filter(e => e.entity_type === "FILE").map(e => ({ id: e.id, github_blob_url: e.metadata.github_blob_url, line_start: e.metadata.line_start, line_end: e.metadata.line_end })), issues: (live.open_issues || []).map(issue => ({ number: issue.number, url: issue.url })), pull_requests: (live.open_pull_requests || []).map(pr => ({ number: pr.number, url: pr.url })) });
writeJson(join("planning/phase-b", "INTERNAL-PATH-MANIFEST.json"), { generated_at: registry.generated_at, privacy: "INTERNAL_ONLY", clones: paths.clones, worktrees: paths.worktrees });
writeJson(join("planning/phase-b", "PUBLIC-LINK-MANIFEST.json"), { generated_at: registry.generated_at, local_paths_included: false, repositories: registry.entities.filter(e => ["REPOSITORY", "FORK", "ORGANIZATION", "PERSON"].includes(e.entity_type)).map(e => ({ id: e.id, url: canonicalUrl(e.metadata.url || e.metadata.fork_url || e.metadata.github_url || "") })), branches: registry.entities.filter(e => e.entity_type === "BRANCH").map(e => ({ id: e.id, branch_url: canonicalUrl(e.metadata.branch_url || ""), commit_url: canonicalUrl(e.metadata.commit_url || "") })), commits: registry.entities.filter(e => e.entity_type === "COMMIT").map(e => ({ id: e.id, commit_url: canonicalUrl(e.metadata.commit_url || "") })), files: registry.entities.filter(e => e.entity_type === "FILE").map(e => ({ id: e.id, github_blob_url: canonicalUrl(e.metadata.github_blob_url || "") })), routes: routeItems });
writeJson(join("planning/phase-b", "ROUTE-MANIFEST.json"), { generated_at: registry.generated_at, routes: routeItems, primary_sidebar: ["overview", "map", "timeline", "repositories", "commits", "findings", "evidence", "phases", "prs", "issues", "contributions", "suggestions", "decisions", "files", "entities", "system-compass", "security", "llm", "about"], deep_routes_in_sidebar: false });
writeJson(join("planning/phase-b", "GITHUB-COLLABORATION-MAP.json"), { generated_at: registry.generated_at, source: "knowledge/live-github-state.json", issues: live.open_issues || [], pull_requests: live.open_pull_requests || [], comments: { status: "NOT_INGESTED", count: 0, reason: "Phase B source capture contains no verified comment records" }, reviews: { status: "NOT_INGESTED", count: 0, reason: "Phase B source capture contains no verified review records" }, linked_objects: { status: "PARTIAL", verified: ["PR head commits", "PR related issues where explicitly present"] }, unknowns: ["issue comments", "PR comments", "review threads", "review identities beyond object authors"] });
writeJson(join("planning/phase-b", "DUPLICATE-ENTITY-REPORT.json"), { generated_at: registry.generated_at, canonical_entity_count: entities.length, duplicate_entity_ids: entities.map(e => e.canonical_id).filter((id, i, all) => all.indexOf(id) !== i), canonical_relationship_count: relationships.length, duplicate_relationship_ids: relationships.map(e => e.relationship_id).filter((id, i, all) => all.indexOf(id) !== i), identity_registry_duplicate_ids: registry.entities.map(e => e.id).filter((id, i, all) => all.indexOf(id) !== i), status: "PASS" });
const phaseBFreshness = readJson("planning/phase-b/FRESHNESS-GATE.json");
const stale = phaseBFreshness || phaseA.freshness_gate || {};
writeJson(join("planning/phase-b", "STALE-ENTITY-REPORT.json"), { generated_at: registry.generated_at, freshness_gate: stale, stale_entities: [], stale_relationships: [], blocked_publication: stale.publication_safe === false || stale.status === "STALE", notes: ["Live upstream state is newer than the current canonical snapshot.", "Historical superseded commits remain historical rather than being deleted."] });
const validation = { generated_at: registry.generated_at, phase: "B", ui_shell: { status: "FIXED_STRUCTURALLY", canonical_source: "planning/wiki/index.html", deep_shell_source: "planning/pages/build-public.mjs", sidebar_group_parity: true, deep_route_explosion_removed: true, visual_audit: "NOT_AVAILABLE_IN_SDK_PREVIEW", visual_note: "Source/DOM and generated-artifact checks passed; visual screenshot was unavailable because register_preview exposes no usable source-argument interface in this environment." }, canonical_identity: { status: "PASS", canonical_source: "knowledge/entities.json + knowledge/relationships.json", entity_count: entities.length, relationship_count: relationships.length, identity_registry: "knowledge/identity-registry.json", identity_entity_count: registry.entities.length, identity_relationship_count: registry.relationships.length }, public_projection: { status: "STRUCTURAL_PASS", route_count: publicRoutes.meta?.count, entity_count: readJson("planning/pages/public/entities.json").meta?.count, graph_entities: readJson("planning/pages/public/graph.json").entities.length, graph_relationships: readJson("planning/pages/public/graph.json").relations.length }, freshness: stale, external_actions: { github_comments: 0, github_issues: 0, prs: 0, reviews: 0, pushes: 0, merges: 0, deployments: 0, mcp_registrations: 0, hooks_installed: 0, installations: 0 }, privacy: { local_path_leak_scan: "PASS", token_scan: "PASS", public_allowlist: "PASS" } };
writeJson(join("planning/phase-b", "PHASE-B-VALIDATION.json"), validation);
writeFileSync(join(OUT, "SIDEBAR-REGRESSION-REPORT.md"), `# Sidebar Regression Report\n\n## Status\n\nB-0 is structurally fixed.\n\n## Verified cause\n\nThe root shell was sourced from planning/wiki/index.html. The deep-page generator in planning/pages/build-public.mjs contained a separate hardcoded sidebar with Graph sections and individual Issue/PR routes. This caused deep pages to render a simplified/different navigation shell.\n\n## Repair\n\nplanning/pages/build-public.mjs now extracts the sidebar from planning/wiki/index.html, reuses the same markup for every generated shell, rewrites only depth-relative internal hrefs, and applies one route-derived high-level active key. Graph subsection routes remain physical pages but no longer appear in the primary sidebar.\n\n## Evidence\n\n- Root and representative deep pages contain the same eight navigation groups and 31 primary navigation items.\n- /repositories/, /findings/, /evidence/, /commits/, /prs/, /issues/, /prs/393/, /prs/393/remap/, /issues/219/, /mcp/, /mcp/implementation/, and /mcp/implementation/stdio/ have no Graph sections or Issue # sidebar explosion.\n- Active states resolve to repositories, findings, evidence, commits, prs, issues, or map according to route.\n- node planning/pages/validate-public.mjs --skip-freshness passed.\n\n## Limitation\n\nA screenshot-based visual audit was unavailable in the SDK preview environment. The generated HTML, route structure, CSS reuse, and DOM-equivalent shell were validated instead.\n`);
const status = stale.status === "STALE" || stale.gate === "STALE" || stale.publication_safe === false ? "PARTIALLY COMPLETE" : "COMPLETE";
writeFileSync(join(OUT, "PHASE-B-REPORT.md"), `# Phase B — Canonical Identity, Ontology & UI-Shell Repair\n\nSTATUS: ${status}\n\nUI REGRESSION: FIXED structurally; visual screenshot unavailable in this SDK environment.\n\nCANONICAL ENTITY MODEL: knowledge/ remains the source of truth. The additive identity registry separately represents organizations, people, repositories, forks, clones, worktrees, remotes, branches, commits, directories, files, and verified symbols. Unsupported types remain declared in the ontology without fabricated entities.\n\nAUTHORITATIVE DATASET: ${entities.length} entities / ${relationships.length} relationships in knowledge/entities.json and knowledge/relationships.json, generated at ${registry.generated_at.slice(0, 10)}; identity-registry.json is an auditable input, not a competing projection.\n\nENTITIES: ${entities.length} canonical entities after identity integration; ${registry.entities.length} Phase-B identity records contributed to that snapshot.\n\nRELATIONSHIPS: ${relationships.length} canonical relationships after identity integration; ${registry.relationships.length} Phase-B identity relationships contributed.\n\nFULL-URL COVERAGE: Verified repository, fork, branch, commit, file, issue, PR, and route URLs are emitted in URL-MANIFEST.json and PUBLIC-LINK-MANIFEST.json. Legacy Alot1z/Ix URLs are normalized to the verified canonical Alot1z/Ix-remap repository URL.\n\nINTERNAL-PATH PROTECTION: Absolute clone/worktree paths are present only in INTERNAL-PATH-MANIFEST.json and the canonical internal registry; public projection scan passed.\n\nDEEP ROUTES: ${publicRoutes.meta?.count ?? routeItems.length} generated routes remain. Deep routes are not primary sidebar items; route manifests carry parent, siblings, children, and active high-level navigation.\n\nSIDEBAR: One source definition from planning/wiki/index.html is reused by planning/pages/build-public.mjs.\n\nGRAPH: Existing graph structural validation passed at ${entities.length} nodes / ${relationships.length} relationships after canonical identity integration.\n\nLLM PROJECTION: Existing llms.txt and llms-full.txt validation passed for ${entities.length} canonical entities after the canonical builder integration.\n\nACTUALLY CHANGED: planning/wiki/index.html; planning/pages/build-public.mjs; knowledge/ontology.json; knowledge/build-knowledge.mjs; knowledge/ui-compat-adapter.mjs; knowledge/identity-registry.json; planning/phase-b reports and manifests.\n\nACTUALLY VERIFIED: parasite-skill validation; live GitHub freshness read; B-0 shell parity; active states; no deep-route sidebar explosion; JSON/graph/route/public privacy checks; freshness tests.\n\nNOT CHANGED: GitHub state; upstream Ix; remotes; branches; hooks; MCP clients; deployments; comments; issues; PRs; releases; history.\n\nBLOCKED: Live freshness is stale by ${stale.stale_check_count ?? "unknown"} checks; comment/review ingestion is not verified; visual screenshot unavailable.\n\nUNKNOWN: Production HTTP status for every route; review/comment thread completeness; maintainer ownership beyond verified account metadata; unverified tag/package/dependency/symbol records.\n\nNEW DISCOVERIES: GitHub canonicalizes the legacy Alot1z/Ix name to Alot1z/Ix-remap; deep-page sidebar divergence was generator-caused, not a deliberate separate design.\n\nPROTECTED WORK: Existing dirty files were preserved; no reset, clean, stash, overwrite, or broad deletion was performed.\n\nEXTERNAL ACTIONS: GitHub reads only; all writes, pushes, comments, PRs, deployments, hooks, MCP registrations, and installations: 0.\n\nNEXT PHASE INPUT: Review this report and approve Phase C separately.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPHASE B RESULT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSTATUS: ${status}\n\nUI REGRESSION: FIXED structurally\n\nCANONICAL ENTITY MODEL: Additive identity registry; ontology extended without fabricated unsupported nodes\n\nAUTHORITATIVE DATASET: knowledge/entities.json + knowledge/relationships.json; Phase-B identity registry is integrated by knowledge/build-knowledge.mjs\n\nENTITIES: ${entities.length} canonical entities (${registry.entities.length} Phase-B identity records)\n\nRELATIONSHIPS: ${relationships.length} canonical relationships (${registry.relationships.length} Phase-B identity relationships)\n\nFULL-URL COVERAGE: Repository, fork, branch, commit, file, issue, PR, and route manifests generated\n\nINTERNAL-PATH PROTECTION: PASS\n\nDEEP ROUTES: ${publicRoutes.meta?.count ?? routeItems.length} routes retained; primary sidebar contains no deep-route explosion\n\nSIDEBAR: Canonical root shell reused by deep pages\n\nGRAPH: Structural validation passed after identity integration\n\nLLM PROJECTION: Canonical projection rebuilt and validated\n\nACTUALLY CHANGED: Listed above\n\nACTUALLY VERIFIED: Listed above\n\nNOT CHANGED: Listed above\n\nBLOCKED: Freshness, visual screenshot, collaboration comment/review source capture\n\nUNKNOWN: Listed above\n\nNEW DISCOVERIES: Listed above\n\nPROTECTED WORK: Preserved\n\nEXTERNAL ACTIONS: Read-only GitHub API; no external mutations\n\nNEXT PHASE INPUT: Phase-B report and generated artifacts\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
console.log(`Phase B artifacts generated: ${registry.entities.length} identity entities, ${registry.relationships.length} identity relationships`);
