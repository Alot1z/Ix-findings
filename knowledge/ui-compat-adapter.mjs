// Read-only compatibility projection from knowledge/ into the existing explorer contract.
// The explorer keeps its current UI, views, and interactions; only this data seam changes.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const readJson = path => JSON.parse(readFileSync(path, "utf8"));
const unique = values => [...new Set((values || []).filter(Boolean))];

const TYPE_MAP = {
  SOURCE: "file",
  REPOSITORY: "repository",
  BRANCH: "branch",
  COMMIT: "commit",
  PULL_REQUEST: "pr",
  ISSUE: "issue",
  FINDING: "finding",
  EVIDENCE: "evidence",
  SUGGESTION: "suggestion",
  DECISION: "decision",
  PHASE: "phase",
  CANDIDATE: "contribution",
  IMPLEMENTATION: "artifact",
  PR_PACKET: "pr_packet",
  CONTRADICTION: "artifact",
};

function relatedIds(entity, entities, type) {
  const ids = new Set(entity.related_entities || []);
  return [...ids].filter(id => entities.get(id)?.entity_type === type);
}

function repositoryFields(entity) {
  const [owner, ...rest] = String(entity.canonical_name || "").split("/");
  return {
    repo_id: entity.canonical_name,
    owner,
    name: rest.join("/") || owner,
    role: entity.metadata?.role,
    url: entity.metadata?.url,
    visibility: entity.metadata?.visibility,
    access: entity.metadata?.access,
    default_branch: entity.metadata?.default_branch,
    note: entity.deep_summary,
  };
}

function nodeFor(entity) {
  const metadata = entity.metadata || {};
  const node = {
    id: entity.canonical_id,
    type: TYPE_MAP[entity.entity_type] || "artifact",
    title: entity.canonical_name,
    status: entity.status,
  };
  for (const key of ["category", "phase", "repository", "number", "url", "author", "commit", "merged_at", "disposition", "evidence_refs", "source_mirror_id", "source_type", "source_repository", "source_url", "source_api_url", "source_is_authoritative", "analysis_layer"]) {
    if (metadata[key] !== undefined) node[key] = metadata[key];
  }
  if (entity.entity_type === "FINDING") {
    node.class = metadata.evidence_class;
    node.repo = metadata.repository;
  }
  if (entity.entity_type === "REPOSITORY") Object.assign(node, repositoryFields(entity));
  return node;
}

function findingFor(entity, entities) {
  const m = entity.metadata || {};
  return {
    id: entity.canonical_id,
    ixf_id: entity.aliases?.find(alias => alias.startsWith("IXF-")),
    title: entity.canonical_name,
    evidence_class: m.evidence_class || "UNKNOWN",
    status: m.legacy_status || entity.status,
    registry_status: m.legacy_status || entity.status,
    confidence: entity.confidence,
    severity: m.severity,
    repository: m.repository,
    subsystem: m.subsystem,
    affected_versions: m.affected_versions || [],
    reproduction: m.reproduction || entity.deep_summary,
    evidence_refs: entity.evidence_ids || [],
    related_issues: m.legacy_related_issues || relatedIds(entity, entities, "ISSUE").map(id => `#${entities.get(id).metadata?.number ?? id}`),
    related_prs: m.legacy_related_prs || relatedIds(entity, entities, "PULL_REQUEST").map(id => `#${entities.get(id).metadata?.number ?? id}`),
    related_suggestions: relatedIds(entity, entities, "SUGGESTION"),
    recommendation: entity.deep_summary,
    summary: entity.human_summary,
  };
}

function evidenceFor(entity) {
  const m = entity.metadata || {};
  return {
    id: entity.canonical_id,
    title: entity.canonical_name,
    class: m.evidence_class || "UNKNOWN",
    kind: m.kind || "unknown",
    type: m.kind || "unknown",
    phase: m.phase,
    repository: m.repository,
    detail: entity.deep_summary,
    supports: m.supports || [],
  };
}

function suggestionFor(entity) {
  const m = entity.metadata || {};
  return {
    id: entity.canonical_id,
    text: entity.canonical_name,
    phase: m.phase,
    repository: m.repository,
    disposition: m.disposition || entity.status,
    reason: m.reason || entity.deep_summary,
    related_findings: m.related_findings || [],
    evidence_refs: entity.evidence_ids || [],
  };
}

function decisionFor(entity) {
  const m = entity.metadata || {};
  return {
    id: entity.canonical_id,
    title: entity.canonical_name,
    status: entity.status === "OPEN" ? "OPEN" : `DECIDED${entity.status === "CURRENT" ? "" : ` (${entity.status})`}`,
    date: m.date,
    context: m.problem,
    problem: m.problem,
    chosen: m.chosen,
    rationale: m.reason,
    reason: m.reason,
    related_findings: m.related_findings || [],
    related_suggestions: m.related_suggestions || [],
  };
}

function phaseFor(entity) {
  const m = entity.metadata || {};
  return {
    ...m,
    id: entity.canonical_id,
    number: m.number,
    title: m.title || entity.canonical_name,
    category: m.category,
    status: m.status || entity.status,
    objective: m.objective,
    key_findings: m.key_findings || [],
  };
}

function contributionFor(entity) {
  const m = entity.metadata || {};
  return {
    id: entity.canonical_id,
    repo: m.repository || m.repo,
    branch: m.branch,
    sha: m.head || m.sha,
    status: entity.status,
    stateDetail: entity.status,
    title: entity.canonical_name,
    files: m.files,
    tests: m.tests,
    packet: m.packet || m.path,
    blocker: m.blocker,
    nextAction: m.action || m.next_safe_action,
    findings: entity.evidence_ids || [],
  };
}

function compactTestResults(tests, sourceRevision, generated) {
  const manifestTest = tests.find(test => test.test_id === "TEST-MANIFEST") || tests[0];
  return {
    date: generated,
    repository: manifestTest?.repository || "ix-infrastructure/Ix",
    sha: sourceRevision,
    tests: manifestTest?.result || "CANONICAL TEST RECORDS AVAILABLE",
    vitest: manifestTest?.result || "CANONICAL TEST RECORDS AVAILABLE",
    smoke: "SEE CANONICAL TEST RECORDS",
    tsc: "SEE CANONICAL TEST RECORDS",
    eslint: "SEE CANONICAL TEST RECORDS",
  };
}

export function createLegacyUiData(root) {
  const knowledge = join(root, "knowledge");
  const entitiesArray = readJson(join(knowledge, "entities.json"));
  const relationshipsArray = readJson(join(knowledge, "relationships.json"));
  const manifest = readJson(join(knowledge, "manifest.json"));
  const timelines = readJson(join(knowledge, "timelines.json"));
  const tests = readJson(join(knowledge, "tests.json"));
  const sections = readJson(join(knowledge, "sections.json"));
  const externalMirror = readJson(join(knowledge, "external-github-mirror.json"));
  const entities = new Map(entitiesArray.map(entity => [entity.canonical_id, entity]));
  const byType = type => entitiesArray.filter(entity => entity.entity_type === type);
  const generated = manifest.generated_at || "UNKNOWN";
  const sourceRevision = manifest.live_baseline?.upstream_head || "unknown";
  const graph = {
    nodes: entitiesArray.map(nodeFor),
    edges: relationshipsArray.map(relationship => ({
      source: relationship.from,
      target: relationship.to,
      relationship: relationship.type,
      confidence: relationship.confidence,
    })),
  };
  const contributions = [
    ...byType("CANDIDATE").map(entity => contributionFor(entity)),
    ...byType("IMPLEMENTATION").map(entity => contributionFor(entity)),
  ];
  const data = {
    meta: {
      title: "IX Compass — Knowledge Explorer",
      generated,
      sourceRevision,
      phase: "EXECUTION",
      entityCounts: {
        repositories: byType("REPOSITORY").length,
        branches: byType("BRANCH").length,
        worktrees: 0,
        commits: byType("COMMIT").length,
        releases: 0,
        files: byType("SOURCE").length,
        symbols: 0,
        apis: 0,
        tests: tests.length,
        findings: byType("FINDING").length,
        evidence: byType("EVIDENCE").length,
        decisions: byType("DECISION").length,
        suggestions: byType("SUGGESTION").length,
        prs: byType("PULL_REQUEST").length,
        issues: byType("ISSUE").length,
        contributions: contributions.length,
        graphNodes: graph.nodes.length,
        graphEdges: graph.edges.length,
        staleClaims: 0,
      },
      dataFreshness: {
        canonical: generated,
        sourceRevision,
        systemCompass: "BLOCKED — no source access",
      },
      adapter: "knowledge/ui-compat-adapter.mjs",
    },
    findings: byType("FINDING").map(entity => findingFor(entity, entities)),
    evidence: byType("EVIDENCE").map(evidenceFor),
    suggestions: byType("SUGGESTION").map(suggestionFor),
    decisions: byType("DECISION").map(decisionFor),
    phases: byType("PHASE").map(phaseFor),
    timeline: timelines,
    graph,
    externalMirror,
    repos: byType("REPOSITORY").map(repositoryFields),
    branches: byType("BRANCH").map(entity => ({ ...entity.metadata, branch: entity.metadata?.branch, repo: entity.metadata?.repo, sha: entity.metadata?.sha, note: entity.deep_summary })),
    commits: byType("COMMIT").map(entity => ({ ...entity.metadata, sha: entity.metadata?.sha || entity.canonical_name, msg: entity.metadata?.msg || entity.human_summary })),
    worktrees: {},
    pullRequests: byType("PULL_REQUEST").map(entity => ({ ...entity.metadata, number: entity.metadata?.number, state: entity.status, url: entity.metadata?.url, sha: entity.metadata?.sha })),
    issues: byType("ISSUE").map(entity => ({ ...entity.metadata, number: entity.metadata?.number, state: entity.status, url: entity.metadata?.url, access: entity.metadata?.access })),
    testResults: compactTestResults(tests, sourceRevision, generated),
    contributions,
    staleClaims: [],
    sections: sections.sections || [],
    issueSections: sections.issue_sections || [],
    issuesIndex: sections.issues || [],
    sectionMeta: { captured_at: sections.captured_at, source: sections.source, commit_messages: sections.commit_messages || {} },
    sysCompass: {
      access: "PRIVATE — source unavailable",
      findings: byType("FINDING").filter(entity => entity.metadata?.repository === "system-compass").map(entity => entity.canonical_id),
      fkey: { status: "SPEC READY", specFile: "pr-packets/compass-f-key/README.md", estimatedLines: 93, filesToChange: 4, tests: 15 },
      fitView: { status: "REDIRECTED — belongs in system-compass", autoFrameExcluded: "Existing Compass behavior retained" },
      blocker: "No source access — cannot inspect, implement, or test",
    },
    manifest: {
      generated,
      repositories: dataRepositoriesByType(byType("REPOSITORY")),
      live_baseline: manifest.live_baseline,
      test_results: { tests: compactTestResults(tests, sourceRevision, generated).tests, sha: sourceRevision, date: generated },
    },
  };
  return data;
}

function dataRepositoriesByType(repositories) {
  return repositories.map(repositoryFields);
}

function dataTestResults(testResults) {
  return { tests: testResults.tests, sha: testResults.sha, date: testResults.date };
}

export function adaptCanonicalGraph(root) {
  const data = createLegacyUiData(root);
  return { meta: data.meta, nodes: data.graph.nodes, edges: data.graph.edges };
}
