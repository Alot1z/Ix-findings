import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const out = join(root, "planning/phase-j");
const read = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const entities = read("knowledge/entities.json");
const relationships = read("knowledge/relationships.json");
const symbols = read("planning/phase-f/SYMBOL-INDEX.json").symbols || [];
const reports = read("planning/phase-f/REPORT-INDEX.json").reports || [];
const mirror = read("knowledge/external-github-mirror.json");
const state = read("planning/CURRENT-STATE.json");
const phaseIndex = read("planning/PHASE-INDEX.json");
const phaseRecords = Array.isArray(phaseIndex) ? phaseIndex : (phaseIndex.phases || Object.values(phaseIndex));
const query = process.argv.slice(2).filter(arg => arg !== "--query").join(" ").trim() || "What is the current project state?";
const started = Date.now();
const entityById = new Map(entities.map(entity => [entity.canonical_id, entity]));
const relationshipsFor = id => relationships.filter(rel => rel.from === id || rel.to === id).slice(0, 80).map(rel => ({ type: rel.type, from: rel.from, to: rel.to, status: rel.status, confidence: rel.confidence }));
const sourceRecordsFor = number => mirror.records.filter(record => record.source?.number === number);
const bytes = value => Buffer.byteLength(JSON.stringify(value));
const tokenEstimate = value => Math.ceil(bytes(value) / 4);
const excerpt = (path, start, radius = 8) => {
  const absolute = resolve(root, path);
  if (!existsSync(absolute)) return { status: "UNKNOWN", path, lines: [] };
  const lines = readFileSync(absolute, "utf8").split(/\r?\n/);
  const from = Math.max(1, start - radius);
  const to = Math.min(lines.length, start + radius);
  return { status: "VERIFIED_LOCAL_SOURCE", path, start_line: from, end_line: to, lines: lines.slice(from - 1, to).map((text, index) => ({ line: from + index, text })) };
};
const sourcesOpened = new Set();
const pack = { schema_version: "phase-j.context-pack.v1", query, generated_at: new Date().toISOString(), index_version: "phase-i.search-index.v1", evidence: "DETERMINISTIC_INDEX_RETRIEVAL" };
const recordSource = (...paths) => paths.filter(Boolean).forEach(path => sourcesOpened.add(String(path)));
const finish = (packBody) => {
  pack.source_files = [...sourcesOpened].sort();
  pack.source_record_count = 0;
  pack.bytes = bytes(packBody);
  pack.token_estimate = tokenEstimate(packBody);
  pack.latency_ms = Date.now() - started;
  pack.retrieval_method = "CURRENT-STATE + PHASE-INDEX + TARGETED INDEX + EXCERPT; no full-repository scan";
  pack.external_mutations = 0;
  mkdirSync(out, { recursive: true });
  const payload = { ...pack, body: packBody };
  writeFileSync(join(out, "LAST-CONTEXT-PACK.json"), JSON.stringify(payload, null, 2) + "\n");
  console.log(JSON.stringify({ pack_type: packBody.pack_type, query, bytes: payload.bytes, token_estimate: payload.token_estimate, source_files: payload.source_files.length, latency_ms: payload.latency_ms, external_mutations: 0 }, null, 2));
  process.exit(0);
};

// 1. Current project state
if (/current (project |system )?state|what is the (current )?state/i.test(query) && !/changed|historical|unknown|phase/i.test(query)) {
  recordSource("planning/CURRENT-STATE.json", "planning/PHASE-INDEX.json");
  const currentPhase = phaseRecords.find(record => record.phase === `phase-${String(state.current_phase).toLowerCase()}`) || {};
  const latest = phaseRecords.filter(record => record.status && record.status !== "UNKNOWN").sort((a, b) => String(a.phase).localeCompare(String(b.phase))).at(-1);
  finish({ pack_type: "CURRENT_STATE", current_phase: state.current_phase, current_status: state.current_status, current_commit: state.current_commit, canonical_entities: state.current_graph_entity_count, canonical_relationships: state.current_graph_relationship_count, routes: state.current_route_count, mirror_snapshot: state.current_mirror_version, validation: state.current_validation_status, blockers: state.current_blockers || [], unknowns: state.current_unknowns || [], next_phase: state.next_phase, latest_phase: latest ? { phase: latest.phase, status: latest.status, reports: latest.reports } : null });
}

// 2-4. What changed in Phase E/F/I (generic phase query)
const phaseMatch = query.match(/changed in phase\s*[-#]?\s*([a-z0-9]+)/i) || query.match(/phase\s*[-#]?\s*([a-z0-9]+)/i);
if (phaseMatch && /changed in phase|what happened in phase/i.test(query)) {
  const phase = `phase-${phaseMatch[1].toLowerCase()}`;
  const record = phaseRecords.find(item => item.phase === phase) || {};
  const report = reports.find(item => item.phase === phase || item.path.toLowerCase().includes(`/phase-${phaseMatch[1].toLowerCase()}/`));
  recordSource("planning/PHASE-INDEX.json", "planning/phase-f/REPORT-INDEX.json", report?.path, record.validation_path || record.reports?.[0]);
  const summary = record.status ? {
    phase: record.phase, status: record.status, reports: record.reports || [], artifacts: (record.artifacts || []).slice(0, 20), blockers: record.blockers || [], unknowns: record.unknowns || [], files_changed: (record.files_changed || []).slice(0, 20),
  } : { phase, status: "NOT_INDEXED_IN_PHASE-INDEX", report: report ? { report_id: report.report_id, path: report.path, status: report.status } : null };
  finish({ pack_type: "PHASE", query, phase, summary });
}

// 11. What route represents this entity (checked before PR/issue so an entity
// id such as IMPL-REMAP-PR393 resolves to its route, not to a pull request)
const entityIdMatch = query.match(/(?:route represents|what route|route for)\s+([A-Za-z0-9-]+)/i);
if (entityIdMatch) {
  const id = String(entityIdMatch[1]).toUpperCase();
  recordSource("knowledge/entities.json", "planning/pages/public/routes.json");
  const entity = entityById.get(id);
  const routes = read("planning/pages/public/routes.json").items || [];
  const route = routes.find(item => String(item.title || "").includes(id) || String(item.path || "").includes(id.toLowerCase())) || routes.find(item => item.path === `/entities/${id.toLowerCase()}`);
  finish({ pack_type: "ENTITY_ROUTE", entity_id: id, entity: entity ? { name: entity.canonical_name, type: entity.entity_type } : null, route: route ? { path: route.path, kind: route.kind, url: route.url || null } : { path: `/entities/${id.toLowerCase()}`, kind: "derived", url: null } });
}

// 5. What is PR #393 (word-boundary guarded so IMPL-REMAP-PR393 never matches)
const prMatch = query.match(/(?:^|[^A-Za-z0-9])(?:pr|pull request)\s*#?\s*(\d+)/i);
if (prMatch) {
  const number = Number(prMatch[1]);
  const id = `PR-${number}`;
  const entity = entityById.get(id);
  const source = sourceRecordsFor(number);
  recordSource("knowledge/external-github-mirror.json", "knowledge/entities.json", "knowledge/relationships.json");
  const current = source.find(record => record.source?.type === "github_pull_request")?.snapshot || {};
  finish({ pack_type: "PULL_REQUEST", source_authority: "GITHUB", source_status: source.length ? "CAPTURED" : "NOT_CAPTURED_IN_CURRENT_MIRROR", github: current.state ? { number, state: current.state, merged: current.merged, draft: current.draft, head_sha: current.head?.sha, base_ref: current.base?.ref, title: current.title, merged_at: current.merged_at, commits: (current.commits || []).map(c => c.sha).slice(0, 10), changed_files: (current.changed_files || []).map(f => f.filename).slice(0, 20), review_threads: (current.review_threads || []).map(t => ({ id: t.id, path: t.path, line: t.line, is_resolved: t.is_resolved, replies: (t.comments || []).length })), source_url: source[0]?.source?.url } : { number, state: "UNKNOWN", note: "not captured" }, ix_findings_analysis: entity ? { id, status: entity.status, name: entity.canonical_name, summary: entity.human_summary, evidence_ids: entity.evidence_ids, relationships: relationshipsFor(id).slice(0, 30) } : { status: "UNKNOWN", note: "No canonical entity; no analysis fabricated." }, temporal_status: entity?.status === "OPEN" ? "CURRENT" : entity?.status === "RESOLVED" ? "HISTORICAL_MERGED" : entity?.status || "UNKNOWN" });
}

// 12. What report documents this finding (checked before generic finding so
// the report-specific query returns the report index, not the finding body)
const reportFindingMatch = query.match(/report documents (?:this )?(finding|entity)?\s*([A-Za-z0-9-]+)/i) || query.match(/(?:report|docs) (?:for|documents) ([A-Za-z0-9-]+)/i);
if (reportFindingMatch) {
  const id = String(reportFindingMatch[2] || reportFindingMatch[1]).toUpperCase();
  recordSource("planning/phase-f/REPORT-INDEX.json");
  const matching = reports.filter(report => JSON.stringify(report).toLowerCase().includes(id.toLowerCase())).map(report => ({ report_id: report.report_id, path: report.path, title: report.title, phase: report.phase, status: report.status }));
  finish({ pack_type: "REPORT_FOR_OBJECT", object: id, reports: matching.slice(0, 20), unknown: matching.length ? [] : [`No indexed report references ${id}.`] });
}

// 6. What implements finding F-009
const findingMatch = query.match(/finding\s*[-#]?\s*([A-Za-z0-9-]+)/i) || query.match(/(f-\d+)/i);
if (findingMatch) {
  const id = String(findingMatch[1]).toUpperCase().replace(/^FINDING[#-]?/, "F-");
  const entity = entityById.get(id);
  recordSource("knowledge/entities.json", "knowledge/relationships.json");
  const implementations = relationships.filter(rel => rel.to === id && ["IMPLEMENTS", "DOCUMENTS", "RELATED_TO_PR", "RELATED_TO_ISSUE", "SUPPORTED_BY"].includes(rel.type)).map(rel => ({ type: rel.type, from: rel.from, to: rel.to }));
  const evidence = entity?.evidence_ids || [];
  const evidenceEntities = evidence.map(evidenceId => entityById.get(evidenceId)).filter(Boolean).map(item => ({ id: item.canonical_id, name: item.canonical_name, detail: item.deep_summary }));
  finish({ pack_type: "FINDING", finding_id: id, entity: entity ? { id, name: entity.canonical_name, status: entity.status, summary: entity.human_summary, deep_summary: entity.deep_summary } : null, implementations, evidence_entities: evidenceEntities, unknown: entity ? [] : [`No canonical finding entity ${id} was found.`] });
}

// 7. What files changed in the latest phase
if (/files changed in the latest phase|latest phase/i.test(query)) {
  const latest = phaseRecords.filter(record => record.status && record.status !== "UNKNOWN" && (record.files_changed || []).length).sort((a, b) => String(a.phase).localeCompare(String(b.phase))).at(-1);
  recordSource("planning/PHASE-INDEX.json");
  finish({ pack_type: "LATEST_PHASE_FILES", phase: latest?.phase, status: latest?.status, files_changed: (latest?.files_changed || []).slice(0, 50), files_added: (latest?.files_added || []).slice(0, 50), artifacts: (latest?.artifacts || []).slice(0, 20) });
}

// 8. What is currently unknown
if (/currently unknown|what is unknown/i.test(query)) {
  recordSource("planning/CURRENT-STATE.json", "planning/PHASE-INDEX.json");
  const phaseUnknowns = phaseRecords.flatMap(record => (record.unknowns || []).map(text => ({ phase: record.phase, text })));
  finish({ pack_type: "UNKNOWNS", current_unknowns: state.current_unknowns || [], phase_unknowns: phaseUnknowns.slice(0, 40) });
}

// 9. What is historical
if (/what is historical|historical\b/i.test(query) && !/why is pr/i.test(query)) {
  recordSource("knowledge/entities.json");
  const historical = entities.filter(entity => entity.status === "HISTORICAL" || entity.status === "RESOLVED").slice(0, 60).map(entity => ({ id: entity.canonical_id, type: entity.entity_type, name: entity.canonical_name, status: entity.status }));
  finish({ pack_type: "HISTORICAL", count: historical.length, entities: historical });
}

// 10. What external GitHub objects changed
if (/external github objects changed|github objects changed/i.test(query)) {
  const diff = existsSync(join(root, "planning/phase-j/MIRROR-DIFF-FULL.json")) ? read("planning/phase-j/MIRROR-DIFF-FULL.json") : read("planning/phase-j/MIRROR-DIFF.json");
  recordSource("planning/phase-j/MIRROR-DIFF-FULL.json");
  finish({ pack_type: "GITHUB_CHANGES", snapshot_before: diff.snapshot_before, snapshot_after: diff.snapshot_after, changed: diff.changed_count, unchanged: diff.unchanged_count, class_counts: diff.class_counts, changes: diff.changes.slice(0, 30).map(change => ({ object: change.source_object, classes: change.change_classes, previous: change.previous?.snapshot?.head?.sha || change.previous?.snapshot?.state || null, current: change.current?.snapshot?.head?.sha || change.current?.snapshot?.state || null })), external_mutations: diff.external_mutations });
}

// 13. Which commit changed this file
const fileCommitMatch = query.match(/commit changed (?:this )?file\s*([^\s]+)/i) || query.match(/(?:which|what) commit (?:changed|modified) ([^\s]+)/i);
if (fileCommitMatch) {
  const file = fileCommitMatch[1].replace(/^["']|["']$/g, "");
  recordSource("planning/phase-f/SYMBOL-INDEX.json", "knowledge/entities.json");
  const symbol = symbols.find(item => item.path === file) || symbols.find(item => item.path?.endsWith(file));
  const fileEntities = entities.filter(entity => entity.entity_type === "FILE" && (entity.canonical_name?.includes(file) || entity.metadata?.path === file));
  const commits = fileEntities.flatMap(entity => relationships.filter(rel => rel.to === entity.canonical_id || rel.from === entity.canonical_id).filter(rel => rel.type === "CHANGED" || rel.type === "CHANGES").map(rel => ({ rel_type: rel.type, other: rel.to === entity.canonical_id ? rel.from : rel.to, commit: entityById.get(rel.to === entity.canonical_id ? rel.from : rel.to) })));
  finish({ pack_type: "FILE_COMMIT", file, symbol: symbol ? { symbol_id: symbol.symbol_id, name: symbol.name, type: symbol.type, start_line: symbol.start_line, end_line: symbol.end_line, path: symbol.path } : null, commits: commits.map(item => ({ rel_type: item.rel_type, id: item.commit?.canonical_id, status: item.commit?.status, summary: item.commit?.human_summary })).slice(0, 20), unknown: symbol ? [] : [`No exact symbol/file record for ${file}; commit attribution UNKNOWN.`] });
}

// 14. What is the current upstream head
if (/current upstream head|upstream head/i.test(query)) {
  recordSource("knowledge/live-github-state.json", "knowledge/manifest.json");
  const live = read("knowledge/live-github-state.json");
  const manifest = read("knowledge/manifest.json");
  finish({ pack_type: "UPSTREAM_HEAD", repository: "ix-infrastructure/Ix", default_branch: live.upstream?.default_branch || "main", head_sha: live.upstream?.head_sha, head_sha_short: (live.upstream?.head_sha || "").slice(0, 12), captured_at: live.captured_at, open_prs: (live.open_pull_requests || []).map(pr => pr.number), open_issues: (live.open_issues || []).map(issue => issue.number), source: "knowledge/live-github-state.json (read-only GitHub capture)" });
}

// 15. Which phase introduced this artifact
const artifactMatch = query.match(/phase introduced (?:this )?(artifact)?\s*([^\s]+)/i) || query.match(/which phase introduced ([^\s]+)/i);
if (artifactMatch) {
  const artifact = artifactMatch[2] || artifactMatch[1];
  recordSource("planning/PHASE-INDEX.json");
  const matching = phaseRecords.filter(record => (record.artifacts || []).some(path => String(path).includes(artifact)) || (record.reports || []).some(path => String(path).includes(artifact))).map(record => ({ phase: record.phase, status: record.status, artifacts: (record.artifacts || []).filter(path => String(path).includes(artifact)).concat((record.reports || []).filter(path => String(path).includes(artifact))) }));
  finish({ pack_type: "ARTIFACT_PHASE", artifact, phases: matching, unknown: matching.length ? [] : [`No phase record references ${artifact}.`] });
}

// Fallback: symbol query (Phase H behavior preserved)
{
  const symbolQuery = query.match(/(?:function|class|symbol)\s+([A-Za-z_$][\w$]*)/i)?.[1] || query.trim();
  const matches = symbols.filter(symbol => symbol.name === symbolQuery).slice(0, 10);
  recordSource("planning/phase-f/SYMBOL-INDEX.json");
  finish({ pack_type: "SYMBOL", symbol_query: symbolQuery, matches: matches.map(symbol => ({ ...symbol, excerpt: excerpt(symbol.path, symbol.start_line) })), unknowns: matches.length ? matches.filter(symbol => symbol.end_line === "UNKNOWN").map(symbol => `End line for ${symbol.symbol_id} is UNKNOWN.`) : [`No exact symbol match for ${symbolQuery}; no inferred match returned.`] });
}
