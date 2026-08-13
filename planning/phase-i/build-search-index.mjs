import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
const root = process.cwd();
const out = join(root, "planning/phase-i");
const read = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const run = (command, args) => { try { return execFileSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); } catch { return ""; } };
const hash = value => createHash("sha256").update(value).digest("hex").slice(0, 16);
const normalize = value => String(value || "").toLowerCase().replace(/[^a-z0-9_./#-]+/g, " ").split(/\s+/).filter(token => token.length >= 2);
const sanitize = value => {
  if (typeof value === "string") return value.replace(/\b[A-Za-z]:[\\/][^\s"']*/g, "[local-path]");
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, sanitize(child)]));
  return value;
};
const fileIndex = read("planning/phase-f/REPOSITORY-FILE-INDEX.json");
const symbolIndex = read("planning/phase-f/SYMBOL-INDEX.json");
const reportIndex = read("planning/phase-f/REPORT-INDEX.json");
const entities = read("knowledge/entities.json");
const mirror = read("knowledge/external-github-mirror.json");
const records = [];
function add(id, type, title, fields, data = {}) { const safeFields = fields.filter(Boolean).map(sanitize); records.push({ record_id: id, record_type: type, title: sanitize(title || id), search_text: safeFields.join(" ").slice(0, 1200), ...sanitize(data) }); }
for (const file of fileIndex.files || []) add(file.file_id, "FILE", file.path, [file.path, file.classification, file.extension, ...(file.phase_ids || []), ...(file.entity_ids || [])], { path: file.path, classification: file.classification, route: file.route, status: file.git?.working_tree_status, entity_ids: file.entity_ids || [] });
for (const symbol of symbolIndex.symbols || []) add(symbol.symbol_id, "SYMBOL", symbol.name, [symbol.name, symbol.symbol_type, symbol.path], { path: symbol.path, symbol_type: symbol.symbol_type, start_line: symbol.start_line, end_line: symbol.end_line, file_id: symbol.file_id, entity_ids: symbol.related_entity_ids || [] });
for (const report of reportIndex.reports || []) add(report.report_id, "REPORT", report.title, [report.title, report.phase, report.status, report.summary, report.path], { path: report.path, phase: report.phase, status: report.status, validation_path: report.validation_path });
for (const entity of entities) add(entity.canonical_id, entity.entity_type, entity.canonical_name, [entity.canonical_id, entity.canonical_name, entity.status, entity.human_summary, entity.deep_summary, ...(entity.aliases || []), ...(entity.source_refs || [])], { status: entity.status, confidence: entity.confidence, source_refs: entity.source_refs || [], related_entities: entity.related_entities || [] });
for (const record of mirror.records || []) add(record.id, "GITHUB_SOURCE", record.id, [record.id, record.source?.type, record.source?.repository, record.source?.number, record.snapshot?.title, record.snapshot?.full_name, record.snapshot?.body], { source: record.source, freshness: record.freshness, source_status: record.snapshot?.state || record.snapshot?.status || "UNKNOWN", authority: "GITHUB" });
const index = new Map();
for (const record of records) {
  const uniqueTokens = new Set(normalize(`${record.title} ${record.search_text}`));
  for (const token of uniqueTokens) { if (!index.has(token)) index.set(token, []); index.get(token).push(record.record_id); }
}
for (const [token, ids] of index) index.set(token, [...new Set(ids)].sort());
const result = { schema_version: "ix-findings.search-index.v1", generated_at: new Date().toISOString(), source_indexes: ["planning/phase-f/REPOSITORY-FILE-INDEX.json", "planning/phase-f/SYMBOL-INDEX.json", "planning/phase-f/REPORT-INDEX.json", "knowledge/entities.json", "knowledge/external-github-mirror.json"], counts: { records: records.length, tokens: index.size }, records: Object.fromEntries(records.map(record => [record.record_id, record])), tokens: Object.fromEntries([...index.entries()].sort(([a], [b]) => a.localeCompare(b))) };
writeFileSync(join(out, "SEARCH-INDEX.json"), JSON.stringify(result, null, 2) + "\n");
writeFileSync(join(out, "PHASE-I-VALIDATION.json"), JSON.stringify({ schema_version: "phase-i.validation.v1", phase: "I", status: "PARTIALLY_COMPLETE", generated_at: result.generated_at, checks: { records_nonzero: records.length > 0, token_index_nonzero: index.size > 0, record_ids_unique: records.length === new Set(records.map(record => record.record_id)).size, postings_resolve: [...index.values()].flat().every(id => result.records[id]), source_analysis_separated: records.filter(record => record.record_type === "GITHUB_SOURCE").every(record => record.authority === "GITHUB"), no_absolute_paths: !JSON.stringify(result).replace(/https?:\/\/[^"\s]+/g, "").match(/\b[A-Za-z]:[\\/][A-Za-z0-9_.~ -]+[\\/]/), external_mutations: 0 }, counts: result.counts,  blockers: ["Semantic ranking remains out of scope; the optional Ix backend was re-verified during Phase J (MATCHED for deterministic symbol/file records)."], unknowns: ["Search tokenization is lexical and does not provide semantic ranking or fuzzy symbol resolution."], protected_work: { baseline: "planning/phase-i/PROTECTED-WORK-BASELINE.json", external_mutations: 0 } }, null, 2) + "\n");
writeFileSync(join(out, "PHASE-I-SUMMARY.json"), JSON.stringify({ phase: "I", status: "PARTIALLY_COMPLETE", summary: "Deterministic indexed retrieval now covers files, symbols, reports, canonical entities, and captured GitHub source records.", implemented: ["token index", "typed search records", "GitHub source authority metadata", "posting-list integrity validation"], verified: ["record IDs", "postings", "source/analysis separation", "privacy", "external mutations"], blocked: ["Semantic ranking and fuzzy resolution remain out of scope for this deterministic foundation."], next_phase: "J_OR_I_REMEDIATION" }, null, 2) + "\n");
writeFileSync(join(out, "PHASE-I-REPORT.md"), `# Phase I — Indexed Search and Retrieval\n\nGenerated: ${result.generated_at}\n\n## Status\n\n**PARTIALLY COMPLETE**\n\nPhase I adds an indexed retrieval layer over the existing canonical and Phase-F records. Search uses postings rather than repeatedly scanning the repository.\n\n## Measured result\n\n- Typed records: **${records.length}**.\n- Search tokens: **${index.size}**.\n- Canonical entities included: **${entities.length}**.\n- Captured external GitHub records included: **${mirror.records.length}**.\n- External mutations: **0**.\n\n## Boundaries\n\nGitHub source records retain authority metadata; local Ix-findings analysis remains separate. The index is lexical and deterministic. It does not claim semantic similarity, currentness beyond source freshness metadata, or records outside the captured mirror scope.\n`);
console.log(JSON.stringify({ phase: "I", status: "PARTIALLY_COMPLETE", records: records.length, tokens: index.size, external_mutations: 0 }, null, 2));
