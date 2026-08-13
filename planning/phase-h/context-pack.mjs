import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const out = join(root, "planning/phase-h");
const read = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const entities = read("knowledge/entities.json");
const relationships = read("knowledge/relationships.json");
const symbols = read("planning/phase-f/SYMBOL-INDEX.json").symbols || [];
const reports = read("planning/phase-f/REPORT-INDEX.json").reports || [];
const mirror = read("knowledge/external-github-mirror.json");
const query = process.argv.slice(2).filter(arg => arg !== "--query").join(" ").trim() || "What is the current state?";
const entityById = new Map(entities.map(entity => [entity.canonical_id, entity]));
const relationshipsFor = id => relationships.filter(rel => rel.from === id || rel.to === id).slice(0, 80).map(rel => ({ type: rel.type, from: rel.from, to: rel.to, status: rel.status, confidence: rel.confidence, provenance_status: rel.provenance_status }));
const sourceRecordsFor = number => mirror.records.filter(record => record.source?.number === number);
const excerpt = (path, start, radius = 8) => {
  const absolute = resolve(root, path);
  if (!existsSync(absolute)) return { status: "UNKNOWN", path, lines: [] };
  const lines = readFileSync(absolute, "utf8").split(/\r?\n/);
  const from = Math.max(1, start - radius);
  const to = Math.min(lines.length, start + radius);
  return { status: "VERIFIED_LOCAL_SOURCE", path, start_line: from, end_line: to, lines: lines.slice(from - 1, to).map((text, index) => ({ line: from + index, text })) };
};
let pack;
const phaseMatch = query.match(/phase\s*[-#]?\s*([a-z0-9]+)/i);
const prMatch = query.match(/(?:pr|pull request)\s*#?\s*(\d+)/i);
if (phaseMatch) {
  const phase = `phase-${phaseMatch[1].toLowerCase()}`;
  const matching = reports.filter(report => report.phase === phase || report.path.toLowerCase().includes(`/phase-${phaseMatch[1].toLowerCase()}/`));
  const state = read("planning/CURRENT-STATE.json");
  pack = { pack_type: "PHASE", query, evidence: "DERIVED_FROM_LOCAL_INDEXES", phase, current_state: { current_phase: state.current_phase, current_status: state.current_status, next_phase: state.next_phase }, reports: matching.map(report => ({ report_id: report.report_id, title: report.title, status: report.status, path: report.path, validation_path: report.validation_path, summary: report.summary })), affected_entities: matching.flatMap(report => report.artifact_paths || []).slice(0, 100), unknowns: state.current_unknowns || [], blockers: state.current_blockers || [] };
} else if (prMatch) {
  const number = Number(prMatch[1]);
  const id = `PR-${number}`;
  const entity = entityById.get(id);
  const source = sourceRecordsFor(number);
  pack = { pack_type: "PULL_REQUEST", query, source_authority: "GITHUB", source_status: source.length ? "CAPTURED" : "NOT_CAPTURED_IN_CURRENT_MIRROR", source_records: source.map(record => ({ id: record.id, source: record.source, snapshot: record.snapshot, freshness: record.freshness })), ix_findings_analysis: entity ? { id, type: entity.entity_type, name: entity.canonical_name, status: entity.status, summary: entity.human_summary, deep_summary: entity.deep_summary, evidence_ids: entity.evidence_ids, source_refs: entity.source_refs, relationships: relationshipsFor(id) } : { status: "UNKNOWN", note: "No canonical Ix-findings entity was found; no analysis was fabricated." }, unknowns: source.length ? [] : ["The current mirror does not contain this PR; authoritative GitHub source must be fetched before asserting its current state."] };
} else {
  const symbolQuery = query.match(/(?:function|class|symbol)\s+([A-Za-z_$][\w$]*)/i)?.[1] || query.trim();
  const matches = symbols.filter(symbol => symbol.name === symbolQuery).slice(0, 10);
  pack = { pack_type: "SYMBOL", query, evidence: "DETERMINISTIC_SYMBOL_INDEX", symbol_query: symbolQuery, matches: matches.map(symbol => ({ ...symbol, excerpt: excerpt(symbol.path, symbol.start_line) })), unknowns: matches.length ? matches.filter(symbol => symbol.end_line === "UNKNOWN").map(symbol => `End line for ${symbol.symbol_id} is UNKNOWN.`) : ["No exact symbol match was found; no inferred match was returned."] };
}
pack.generated_at = new Date().toISOString();
pack.retrieval_contract = "INDEX -> TARGETED RECORD -> EXCERPT -> FULL SOURCE ONLY WHEN REQUIRED";
pack.external_mutations = 0;
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "LAST-CONTEXT-PACK.json"), JSON.stringify(pack, null, 2) + "\n");
console.log(JSON.stringify({ pack_type: pack.pack_type, query, source_status: pack.source_status, matches: pack.matches?.length, reports: pack.reports?.length, external_mutations: 0 }, null, 2));
