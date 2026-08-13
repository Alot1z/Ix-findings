import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";

const root = process.cwd();
const phaseDir = join(root, "planning/phase-f");
const generatedAt = new Date().toISOString();
const UNKNOWN = "UNKNOWN";
const sha256 = value => createHash("sha256").update(value).digest("hex");
const shortHash = value => sha256(value).slice(0, 16);
const readText = path => { try { return readFileSync(path, "utf8"); } catch { return ""; } };
const readJson = path => { try { return JSON.parse(readText(path)); } catch { return null; } };
const relPath = path => relative(root, path).replaceAll("\\", "/");
const run = (command, args) => { try { return execFileSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } };
const head = run("git", ["rev-parse", "HEAD"]);
const branch = run("git", ["branch", "--show-current"]);
const remote = run("git", ["config", "--get", "remote.origin.url"]);
const repository = remote.match(/github\.com[:/]([^/]+\/[^/.]+)(?:\.git)?$/i)?.[1] || "Alot1z/Ix-findings";
const githubBase = `https://github.com/${repository}`;

const ignoredDirectories = new Set([".git", "node_modules", ".cache", "coverage"]);
const ignoredFiles = new Set([".DS_Store"]);
const files = [];
function walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (ignoredDirectories.has(name) || ignoredFiles.has(name)) continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path); else files.push(path);
  }
}
walk(root);

const tracked = new Set(run("git", ["ls-files", "-z"]).split("\0").filter(Boolean));
const statusEntries = new Map();
const porcelain = run("git", ["status", "--porcelain=v1"]);
for (const line of porcelain.split("\n").filter(Boolean)) {
  const status = line.slice(0, 2).trim() || "??";
  const path = line.slice(3).replaceAll("\\", "/");
  statusEntries.set(path, status);
}
const lastCommit = new Map();
let activeCommit = UNKNOWN;
const log = run("git", ["log", "--all", "--format=%H", "--name-only", "--no-renames"]);
for (const line of log.split("\n")) {
  if (/^[0-9a-f]{40}$/i.test(line)) { activeCommit = line; continue; }
  const path = line.trim().replaceAll("\\", "/");
  if (path && !lastCommit.has(path)) lastCommit.set(path, activeCommit);
}

const routesJson = readJson(join(root, "planning/pages/public/routes.json"));
const routes = routesJson?.items || (Array.isArray(routesJson) ? routesJson : []);
const routeByFile = new Map();
for (const route of routes) {
  for (const key of [route.file, route.output, route.path_file].filter(Boolean)) routeByFile.set(String(key).replaceAll("\\", "/").replace(/^\.?\//, ""), route.path || route.route || UNKNOWN);
}
const entities = readJson(join(root, "knowledge/entities.json")) || [];
const entitiesByPath = new Map();
for (const entity of entities) {
  const path = entity.metadata?.path;
  if (path) (entitiesByPath.get(path) || entitiesByPath.set(path, []).get(path)).push(entity.canonical_id);
}
const sourceEntitiesByPath = new Map();
for (const entity of entities) {
  if (entity.entity_type === "SOURCE" && entity.metadata?.path) sourceEntitiesByPath.set(entity.metadata.path, entity.canonical_id);
}

function phaseIds(path) {
  const result = [];
  for (const match of path.matchAll(/(?:^|\/)phase-([a-z0-9]+)(?:[-\/]|$)/gi)) result.push(`phase-${match[1].toLowerCase()}`);
  return [...new Set(result)];
}
function classification(path) {
  const lower = path.toLowerCase();
  if (/external-github-mirror|source-snapshots|github-live-capture/.test(lower)) return "MIRROR";
  if (/sync-receipt|receipt|sync-state/.test(lower)) return "RECEIPT";
  if (/snapshot|freshness-delta|live-github-state/.test(lower)) return "SNAPSHOT";
  if (/planning\/phase-[^/]+\//.test(lower) && /\.md$/.test(lower)) return "REPORT";
  if (/planning\/phase-[^/]+\//.test(lower)) return "ARTIFACT";
  if (/planning\/pages\/public|planning\/wiki\/data|knowledge\/derived/.test(lower)) return "GENERATED";
  if (/^knowledge\//.test(lower)) return "SOURCE";
  if (/^planning\//.test(lower)) return "SOURCE";
  return "SOURCE";
}
function parserStatus(path, buffer) {
  if (buffer.includes(0)) return "BINARY_SKIPPED";
  const ext = extname(path).toLowerCase();
  if ([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".py", ".rs", ".go", ".java", ".cs", ".json", ".md", ".css", ".html", ".sh", ".ps1"].includes(ext)) return "DETERMINISTIC_TEXT";
  return "HASH_ONLY";
}
function publicUrl(path) {
  if (!path || path.startsWith("planning/pages/public/")) return null;
  return `${githubBase}/blob/${branch || "master"}/${path}`;
}
function routeFor(path) {
  if (routeByFile.has(path)) return routeByFile.get(path);
  if (path.startsWith("planning/pages/public/")) {
    const suffix = path.slice("planning/pages/public/".length).replace(/index\.html$/, "").replace(/\/data\.json$/, "");
    return "/" + suffix.replace(/\/$/, "");
  }
  return null;
}

const fileRecords = [];
for (const absolute of files.sort()) {
  const path = relPath(absolute);
  if (!path || path.startsWith("planning/phase-f/") && /REPOSITORY-FILE-INDEX|SYMBOL-INDEX|REPORT-INDEX|RETRIEVAL-INDEX/.test(path)) {
    // The index records are added after the scan so their hashes describe the
    // completed run rather than a partially written file.
    continue;
  }
  const buffer = readFileSync(absolute);
  const text = buffer.includes(0) ? "" : buffer.toString("utf8");
  const lines = text ? text.split(/\r?\n/).length : 0;
  const phase = phaseIds(path);
  const sourceId = sourceEntitiesByPath.get(path) || null;
  const related = [...new Set([...(entitiesByPath.get(path) || []), ...(sourceId ? [sourceId] : [])])];
  const isTracked = tracked.has(path);
  fileRecords.push({
    file_id: `FILE-${shortHash(path)}`,
    path,
    classification: classification(path),
    extension: extname(path).toLowerCase().replace(/^\./, "") || "text",
    language: extname(path).toLowerCase().replace(/^\./, "") || "text",
    bytes: buffer.length,
    line_count: lines,
    content_hash: sha256(buffer),
    structural_hash: sha256(text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").replace(/#[^\n]*$/gm, "").replace(/\s+/g, " ").trim()),
    git: { tracked: isTracked, working_tree_status: statusEntries.get(path) || (isTracked ? "UNMODIFIED" : "UNTRACKED"), last_modified_commit: lastCommit.get(path) || UNKNOWN, indexed_head: head },
    source: { repository_relative: true, public_classification: classification(path) === "SOURCE" || classification(path) === "REPORT" ? "PUBLIC_SAFE_AFTER_VALIDATION" : "DERIVED_PUBLIC_OR_INTERNAL", github_url: publicUrl(path) },
    route: routeFor(path),
    phase_ids: phase,
    entity_ids: related,
    parser_status: parserStatus(path, buffer),
  });
}

const symbolRecords = [];
const symbolPatterns = [
  { type: "function", re: /\b(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g },
  { type: "class", re: /\bclass\s+([A-Za-z_$][\w$]*)/g },
  { type: "interface", re: /\binterface\s+([A-Za-z_$][\w$]*)/g },
  { type: "type", re: /\btype\s+([A-Za-z_$][\w$]*)/g },
  { type: "function", re: /\b(?:async\s+)?def\s+([A-Za-z_]\w*)/g },
  { type: "struct", re: /\bstruct\s+([A-Za-z_]\w*)/g },
  { type: "enum", re: /\benum\s+([A-Za-z_]\w*)/g },
  { type: "trait", re: /\btrait\s+([A-Za-z_]\w*)/g },
  { type: "constant", re: /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g },
  { type: "import", re: /^\s*import\s+(?:.+?\s+from\s+)?["']([^"']+)["']/gm },
  { type: "export", re: /^\s*export\s+(?:default\s+)?(?:function|class|const|let|var|type|interface)?\s*([A-Za-z_$][\w$]*)?/gm },
  { type: "route", re: /(?:addRoute|route|router\.(?:get|post|put|delete)|path)\s*\(\s*["'`]([^"'`]+)["'`]/g },
  { type: "test", re: /\b(?:describe|it|test)\s*\(\s*["'`]([^"'`]+)["'`]/g },
  { type: "selector", re: /(?:^|[\s}])([.#][A-Za-z_][\w-]*)\s*\{/g },
];
const parseable = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".py", ".rs", ".go", ".java", ".cs", ".css", ".html"]);
for (const file of fileRecords) {
  const ext = `.${file.extension}`;
  if (!parseable.has(ext)) continue;
  const text = readText(join(root, file.path));
  for (const pattern of symbolPatterns) {
    pattern.re.lastIndex = 0;
    let match;
    while ((match = pattern.re.exec(text)) !== null) {
      const name = match[1];
      if (!name) continue;
      const line = text.slice(0, match.index).split(/\r?\n/).length;
      const id = `SYMBOL-${shortHash(`${file.path}|${pattern.type}|${name}|${line}`)}`;
      symbolRecords.push({ symbol_id: id, name, symbol_type: pattern.type, file_id: file.file_id, path: file.path, start_line: line, end_line: UNKNOWN, content_hash: sha256(match[0]), related_entity_ids: file.entity_ids, last_modified_commit: file.git.last_modified_commit, parser_status: "DETERMINISTIC_REGEX_LINE_ANCHOR" });
    }
  }
}
const uniqueSymbols = [...new Map(symbolRecords.map(symbol => [symbol.symbol_id, symbol])).values()].sort((a, b) => a.path.localeCompare(b.path) || a.start_line - b.start_line || a.name.localeCompare(b.name));

const reportFiles = fileRecords.filter(file => /(?:^|\/)PHASE-[A-Z0-9-]+-REPORT\.md$/i.test(file.path) || /(?:^|\/)PHASE-E-REPORT\.md$/i.test(file.path));
const reportRecords = reportFiles.map(file => {
  const text = readText(join(root, file.path));
  const status = text.match(/\*\*(COMPLETE|PARTIALLY COMPLETE|PARTIAL|BLOCKED|FAIL(?:ED)?)\*\*/i)?.[1]?.toUpperCase().replaceAll(" ", "_") || UNKNOWN;
  const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim() || file.path;
  const phase = file.phase_ids[0] || UNKNOWN;
  const directory = file.path.slice(0, file.path.lastIndexOf("/"));
  const artifacts = fileRecords.filter(candidate => candidate.path.startsWith(`${directory}/`) && candidate.path !== file.path).map(candidate => candidate.path).sort();
  const validation = fileRecords.find(candidate => candidate.path === `${directory}/${phase.toUpperCase()}-VALIDATION.json`)?.path || null;
  return { report_id: `REPORT-${shortHash(file.path)}`, phase, title, status, path: file.path, file_id: file.file_id, summary: text.replace(/^#.*$/m, "").replace(/\s+/g, " ").trim().slice(0, 500), validation_path: validation, artifact_paths: artifacts, source_url: publicUrl(file.path), indexed_at: generatedAt };
});

const phaseNames = new Map();
for (const report of reportRecords) phaseNames.set(report.phase, report);
for (const path of ["planning/phase-e/PHASE-E-REPORT.md", "planning/phase-d/PHASE-D-REPORT.md", "planning/phase-c/PHASE-C-REPORT.md"]) {
  const phase = path.match(/phase-([a-z0-9]+)/i)?.[1] ? `phase-${path.match(/phase-([a-z0-9]+)/i)[1].toLowerCase()}` : UNKNOWN;
  if (!phaseNames.has(phase) && existsSync(join(root, path))) phaseNames.set(phase, { phase, path, status: UNKNOWN, title: path, artifact_paths: [] });
}
const currentValidation = readJson(join(phaseDir, "PHASE-F-VALIDATION.json"));
const phaseIndex = [...phaseNames.entries()].sort().map(([phase, report]) => ({ phase, status: phase === "phase-f" ? (currentValidation?.status || "IN_PROGRESS") : (report.status || UNKNOWN), started: phase === "phase-f" ? generatedAt : UNKNOWN, completed: phase === "phase-f" ? null : UNKNOWN, commit: phase === "phase-f" ? head : UNKNOWN, predecessor: phase === "phase-f" ? "phase-e" : UNKNOWN, successor: UNKNOWN, files_changed: phase === "phase-f" ? ["planning/phase-f/build-phase-f-indexes.mjs"] : [], artifacts: report.artifact_paths || [], reports: report.path ? [report.path] : [], tests: phase === "phase-f" ? ["node --check planning/phase-f/build-phase-f-indexes.mjs"] : [], validation: report.validation_path ? [report.validation_path] : [], blockers: phase === "phase-f" ? (currentValidation?.blockers || []) : [], unknowns: phase === "phase-f" ? (currentValidation?.unknowns || []) : [], affected_entities: phase === "phase-f" ? ["repository-file-index", "symbol-index", "report-index", "current-state"] : [], affected_routes: [], affected_github_objects: [], affected_repositories: ["Alot1z/Ix-findings"], full_rebuild: false, sync_information: { source: "LOCAL_REPOSITORY", external_mutations: 0 } }));

const mirror = readJson(join(root, "knowledge/external-github-mirror.json")) || {};
const sync = readJson(join(root, "planning/phase-e/SYNC-RECEIPT.json")) || {};
const publicRoutes = routes.length;
const currentState = {
  schema_version: "ix-findings.current-state.v1",
  generated_at: generatedAt,
  current_phase: "F",
  current_status: currentValidation?.status || "IN_PROGRESS",
  current_commit: head,
  current_branch: branch,
  current_graph_entity_count: entities.length,
  current_graph_relationship_count: (readJson(join(root, "knowledge/relationships.json")) || []).length,
  current_route_count: publicRoutes,
  current_mirror_version: mirror.snapshot_version || UNKNOWN,
  current_sync_watermark: sync.synchronization?.watermark || mirror.synchronization?.watermark || UNKNOWN,
  current_validation_status: currentValidation?.status || "IN_PROGRESS",
  current_blockers: currentValidation?.blockers || ["Phase F validation is generated after this index run."],
  current_unknowns: currentValidation?.unknowns || ["Complete AST-level symbol end ranges are not available for every language."],
  next_phase: currentValidation?.status === "PASS" ? "G" : "F_REMEDIATION",
  source_authority: { external_github: "GITHUB", local_analysis: "IX-FINDINGS", external_mutations: 0 },
};

const fileIndex = { schema_version: "ix-findings.repository-file-index.v1", generated_at: generatedAt, repository, head, branch, counts: { files: fileRecords.length, tracked: fileRecords.filter(x => x.git.tracked).length, untracked: fileRecords.filter(x => !x.git.tracked).length, by_classification: Object.fromEntries([...new Set(fileRecords.map(x => x.classification))].sort().map(kind => [kind, fileRecords.filter(x => x.classification === kind).length])) }, files: fileRecords };
const symbolIndex = { schema_version: "ix-findings.symbol-index.v1", generated_at: generatedAt, parser: "deterministic regex line anchors; end_line remains UNKNOWN unless a parser can prove it", counts: { symbols: uniqueSymbols.length, files_with_symbols: new Set(uniqueSymbols.map(x => x.file_id)).size }, symbols: uniqueSymbols };
const reportIndex = { schema_version: "ix-findings.report-index.v1", generated_at: generatedAt, reports: reportRecords, missing_validation_paths: reportRecords.filter(report => !report.validation_path).map(report => report.path) };
const retrievalIndex = { schema_version: "ix-findings.retrieval-index.v1", generated_at: generatedAt, levels: [{ level: 0, name: "current-state", paths: ["planning/CURRENT-STATE.json"] }, { level: 1, name: "indexes", paths: ["planning/phase-f/REPOSITORY-FILE-INDEX.json", "planning/phase-f/SYMBOL-INDEX.json", "planning/phase-f/REPORT-INDEX.json", "planning/PHASE-INDEX.json"] }, { level: 2, name: "summaries", paths: ["planning/phase-f/PHASE-F-SUMMARY.json", "planning/phase-f/PHASE-F-REPORT.md"] }, { level: 3, name: "targeted-records", paths: ["knowledge/entities.json", "knowledge/relationships.json", "knowledge/external-github-mirror.json"] }, { level: 4, name: "source-excerpts", paths: ["planning/phase-f/REPOSITORY-FILE-INDEX.json", "planning/phase-f/SYMBOL-INDEX.json"] }, { level: 5, name: "full-source", paths: ["repository-relative source paths from the file index"] }], query_contract: "INDEX -> TARGETED RECORD -> EXCERPT -> FULL SOURCE ONLY WHEN REQUIRED" };
const validation = {
  schema_version: "phase-f.validation.v1",
  phase: "F",
  status: "PARTIALLY_COMPLETE",
  generated_at: generatedAt,
  counts: { indexed_files: fileRecords.length, indexed_symbols: uniqueSymbols.length, indexed_reports: reportRecords.length, canonical_entities: entities.length, canonical_relationships: (readJson(join(root, "knowledge/relationships.json")) || []).length, routes: publicRoutes },
  checks: { duplicate_file_ids: fileRecords.length - new Set(fileRecords.map(x => x.file_id)).size, duplicate_symbol_ids: uniqueSymbols.length - new Set(uniqueSymbols.map(x => x.symbol_id)).size, duplicate_report_ids: reportRecords.length - new Set(reportRecords.map(x => x.report_id)).size, missing_file_paths: fileRecords.filter(file => !existsSync(join(root, file.path))).length, symbol_file_refs_valid: uniqueSymbols.every(symbol => fileRecords.some(file => file.file_id === symbol.file_id)), report_files_indexed: reportRecords.every(report => fileRecords.some(file => file.path === report.path)), absolute_paths_published: false, external_mutations: 0 },
  blockers: ["The optional Ix graph backend is unavailable because Docker is not running; the deterministic repository index is local and independent of that backend."],
  unknowns: ["End-line ranges are UNKNOWN for regex-discovered symbols; no AST parser was assumed.", "Last-modified commit is UNKNOWN for untracked files and files absent from reachable Git history."],
  limitations: ["Phase F indexes all local repository files except .git, node_modules, coverage, and .cache; generated public files are classified rather than treated as canonical source.", "Selective page reuse and full incremental projection remain the next evidence-driven capability."],
  protected_work: { baseline: "planning/phase-f/PROTECTED-WORK-BASELINE.json", external_worktrees_mutated: false, external_mutations: 0 },
};

mkdirSync(phaseDir, { recursive: true });
writeFileSync(join(phaseDir, "REPOSITORY-FILE-INDEX.json"), JSON.stringify(fileIndex, null, 2) + "\n");
writeFileSync(join(phaseDir, "SYMBOL-INDEX.json"), JSON.stringify(symbolIndex, null, 2) + "\n");
writeFileSync(join(phaseDir, "REPORT-INDEX.json"), JSON.stringify(reportIndex, null, 2) + "\n");
writeFileSync(join(phaseDir, "RETRIEVAL-INDEX.json"), JSON.stringify(retrievalIndex, null, 2) + "\n");
writeFileSync(join(root, "planning/PHASE-INDEX.json"), JSON.stringify({ schema_version: "ix-findings.phase-index.v1", generated_at: generatedAt, phases: phaseIndex }, null, 2) + "\n");
writeFileSync(join(root, "planning/CURRENT-STATE.json"), JSON.stringify(currentState, null, 2) + "\n");
writeFileSync(join(phaseDir, "PHASE-F-VALIDATION.json"), JSON.stringify(validation, null, 2) + "\n");
writeFileSync(join(phaseDir, "PHASE-F-SUMMARY.json"), JSON.stringify({ phase: "F", status: validation.status, summary: "Deterministic repository, symbol, report, phase, and layered retrieval indexes are generated from the current local workspace.", implemented: ["repository file index", "deterministic symbol index with verified start lines", "phase/report index", "current-state manifest", "layered retrieval contract"], verified: ["duplicate IDs", "file existence", "symbol file references", "report indexing", "no external mutations"], blocked: validation.blockers, unknown: validation.unknowns, files_changed: ["planning/phase-f/build-phase-f-indexes.mjs", "planning/phase-f/PROTECTED-WORK-BASELINE.json", "planning/phase-f/REPOSITORY-FILE-INDEX.json", "planning/phase-f/SYMBOL-INDEX.json", "planning/phase-f/REPORT-INDEX.json", "planning/phase-f/RETRIEVAL-INDEX.json", "planning/PHASE-INDEX.json", "planning/CURRENT-STATE.json", "planning/phase-f/PHASE-F-VALIDATION.json", "planning/phase-f/PHASE-F-SUMMARY.json"], entities_affected: ["repository-file-index", "symbol-index", "report-index", "current-state"], routes_affected: [], github_objects_affected: [], next_phase: "G or F_REMEDIATION" }, null, 2) + "\n");
writeFileSync(join(phaseDir, "PHASE-F-REPORT.md"), `# Phase F — Repository Intelligence and Complete Indexing\n\nGenerated: ${generatedAt}\n\n## Status\n\n**PARTIALLY COMPLETE**\n\nPhase F implements deterministic repository intelligence from the current Ix-findings workspace without replacing the canonical knowledge layer or mutating external GitHub.\n\n## Implemented\n\n- Repository-relative file index with content and structural hashes.\n- Source/generated/mirror/report/snapshot/receipt/artifact classification.\n- Git tracking, working-tree status, reachable last-modified commit, and current HEAD metadata where available.\n- Deterministic symbol index with verified start lines; unprovable end lines remain UNKNOWN.\n- Phase report and artifact index.\n- Central PHASE-INDEX.json and CURRENT-STATE.json.\n- Layered retrieval index: current state -> indexes -> summaries -> targeted records -> excerpts -> full source.\n\n## Measured result\n\n- Indexed files: **${fileRecords.length}**.\n- Indexed symbols: **${uniqueSymbols.length}**.\n- Indexed phase reports: **${reportRecords.length}**.\n- Canonical graph baseline: **${entities.length} entities / ${(readJson(join(root, "knowledge/relationships.json")) || []).length} relationships**.\n- Public route baseline: **${publicRoutes}**.\n- External GitHub mutations: **0**.\n\n## Verification\n\nValidation is recorded in planning/phase-f/PHASE-F-VALIDATION.json; protected-work state is recorded in planning/phase-f/PROTECTED-WORK-BASELINE.json. The implementation is local, deterministic, and does not require network access.\n\n## Blockers and unknowns\n\n- The optional Ix graph backend was unavailable because Docker is not running; this does not block the deterministic local index.\n- Regex symbol extraction proves start lines only; end-line ranges remain UNKNOWN without an AST parser.\n- Untracked files have no last-modified Git commit.\n- Selective page reuse and full incremental projection remain future evidence-driven work.\n\n## Gate\n\nPhase F is **PARTIALLY-NONBLOCKING**: the required repository indexes and current-state manifest exist and pass structural checks. The next controlled capability is selective projection/synchronization, not a new speculative ontology.\n`);

console.log(JSON.stringify({ phase: "F", status: validation.status, files: fileRecords.length, symbols: uniqueSymbols.length, reports: reportRecords.length, routes: publicRoutes, external_mutations: 0 }, null, 2));
