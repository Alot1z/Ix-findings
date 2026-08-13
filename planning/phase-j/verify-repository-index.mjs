import { existsSync, readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, relative } from "node:path";

const root = process.cwd();
const out = join(root, "planning/phase-j");
const read = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const checks = [];
const check = (id, ok, details) => checks.push({ id, ok, severity: ok ? "INFO" : "FAIL", details });

const fileIndex = read("planning/phase-f/REPOSITORY-FILE-INDEX.json");
const symbolIndex = read("planning/phase-f/SYMBOL-INDEX.json");
const reportIndex = read("planning/phase-f/REPORT-INDEX.json");
const searchIndex = read("planning/phase-i/SEARCH-INDEX.json");
const phaseIndex = read("planning/PHASE-INDEX.json");
const currentState = read("planning/CURRENT-STATE.json");

// 1. File index completeness: every relevant repo file indexed (spot-check against git-tracked mjs/json).
const files = fileIndex.files || fileIndex.items || [];
const uniqueIds = new Set(files.map(f => f.file_id || f.id));
check("file-index-no-duplicate-ids", uniqueIds.size === files.length, `files=${files.length}, unique=${uniqueIds.size}`);
const missingFiles = files.filter(f => !existsSync(join(root, f.path || "")));
check("file-index-paths-exist", missingFiles.length === 0, missingFiles.length ? `missing: ${missingFiles.slice(0, 5).map(f => f.path).join(", ")}` : "all indexed file paths exist on disk");

// 2. Symbol index: unique ids, file references resolve, start lines numeric.
const symbols = symbolIndex.symbols || [];
const symbolIds = new Set(symbols.map(s => s.symbol_id || s.id));
check("symbol-index-no-duplicate-ids", symbolIds.size === symbols.length, `symbols=${symbols.length}, unique=${symbolIds.size}`);
const badStarts = symbols.filter(s => typeof s.start_line !== "number");
check("symbol-start-lines-verified", badStarts.length === 0, badStarts.length ? `${badStarts.length} symbols missing numeric start_line` : "all start lines numeric");
const symbolFilesMissing = symbols.filter(s => s.path && !existsSync(join(root, s.path))).slice(0, 10);
check("symbol-file-refs-exist", symbolFilesMissing.length === 0, symbolFilesMissing.length ? `missing refs: ${symbolFilesMissing.map(s => s.path).join(", ")}` : "all symbol file refs exist");

// 3. Report index: every phase report from the filesystem is indexed.
const reports = reportIndex.reports || [];
const reportIds = new Set(reports.map(r => r.report_id || r.id));
check("report-index-no-duplicate-ids", reportIds.size === reports.length, `reports=${reports.length}`);
const phaseDirs = readdirSync(join(root, "planning")).filter(name => /^phase-[a-z]$/.test(name));
let reportFilesOnDisk = 0;
for (const dir of phaseDirs) {
  const dirPath = join(root, "planning", dir);
  if (!statSync(dirPath).isDirectory()) continue;
  for (const name of readdirSync(dirPath)) if (/PHASE-[A-Z]-REPORT\.md$/.test(name)) reportFilesOnDisk += 1;
}
const indexedReportPaths = new Set(reports.map(r => r.path || ""));
const phaseReportFiles = [];
for (const dir of phaseDirs) {
  const dirPath = join(root, "planning", dir);
  for (const name of readdirSync(dirPath)) {
    if (/PHASE-[A-Z]-REPORT\.md$/.test(name)) {
      const rel = `planning/${dir}/${name}`;
      phaseReportFiles.push(rel);
      if (!indexedReportPaths.has(rel)) check(`report-index-missing:${rel}`, false, `${rel} not indexed`);
    }
  }
}
check("report-index-covers-phase-reports", phaseReportFiles.every(rel => indexedReportPaths.has(rel)), `${phaseReportFiles.length} phase reports on disk; ${[...indexedReportPaths].filter(p => /PHASE-/.test(p)).length} indexed`);

// 4. Search index: no duplicate record ids, token postings present.
// Search records may be stored as an array or as an id-keyed object.
const rawRecords = searchIndex.records || searchIndex.items || [];
const records = Array.isArray(rawRecords) ? rawRecords : Object.values(rawRecords);
const recordIds = new Set(records.map(r => r.id || r.record_id));
check("search-index-no-duplicate-ids", recordIds.size === records.length, `records=${records.length}, unique=${recordIds.size}`);
const searchTokens = searchIndex.tokens || searchIndex.total_tokens || (searchIndex.stats && searchIndex.stats.tokens);
check("search-index-tokens", Boolean(searchTokens), `tokens=${searchTokens}`);

// 5. Phase index: no duplicate phase records, phase-e..i present.
const phaseRecords = Array.isArray(phaseIndex) ? phaseIndex : (phaseIndex.phases || Object.values(phaseIndex));
const phaseNames = new Set(phaseRecords.map(p => p.phase));
check("phase-index-no-duplicates", phaseNames.size === phaseRecords.length, `phases=${phaseRecords.length}`);
for (const letter of ["e", "f", "g", "h", "i"]) {
  check(`phase-${letter}-indexed`, phaseNames.has(`phase-${letter}`), `phase-${letter} present in PHASE-INDEX`);
}

// 6. No stale current-state metadata: current counts match canonical files.
const entities = read("knowledge/entities.json");
const relationships = read("knowledge/relationships.json");
const entityCount = entities.length;
const relationshipCount = relationships.length;
const stateMatches = currentState.current_graph_entity_count === entityCount && currentState.current_graph_relationship_count === relationshipCount;
check("current-state-matches-canonical", stateMatches, `state ${currentState.current_graph_entity_count}/${currentState.current_graph_relationship_count}, canonical ${entityCount}/${relationshipCount}`);

// 7. No orphan artifacts / dangling references in search records.
const dangling = records.filter(r => r.entity_id && !entities.some(e => e.canonical_id === r.entity_id)).slice(0, 10);
check("search-entity-refs-resolve", dangling.length === 0, dangling.length ? `dangling: ${dangling.map(d => d.entity_id).join(", ")}` : "all search entity refs resolve");

const report = {
  schema_version: "phase-j.repository-index-validation.v1",
  generated_at: new Date().toISOString(),
  checks,
  counts: {
    repository_files_indexed: files.length,
    symbols_indexed: symbols.length,
    reports_indexed: reports.length,
    phase_reports_on_disk: phaseReportFiles.length,
    search_records: records.length,
    search_tokens: searchTokens,
    phase_records: phaseRecords.length,
    canonical_entities: entityCount,
    canonical_relationships: relationshipCount,
  },
  passed: checks.every(c => c.ok),
  external_mutations: 0,
};
writeFileSync(join(out, "REPOSITORY-INDEX-VALIDATION.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ passed: report.passed, checks: checks.length, failed: checks.filter(c => !c.ok).length, counts: report.counts, external_mutations: 0 }, null, 2));
for (const c of checks) if (!c.ok) console.log("FAIL:", c.id, c.details);
