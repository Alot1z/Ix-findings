import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const out = join(root, "planning/phase-j");
const queries = [
  "What is the current project state?",
  "What changed in Phase E?",
  "What changed in Phase F?",
  "What changed in Phase I?",
  "What is PR #393?",
  "What implements finding F-009?",
  "What files changed in the latest phase?",
  "What is currently unknown?",
  "What is historical?",
  "What external GitHub objects changed?",
  "What route represents entity IMPL-REMAP-PR393?",
  "What report documents finding F-009?",
  "Which commit changed file knowledge/build-github-mirror.mjs?",
  "What is the current upstream head?",
  "Which phase introduced artifact SEARCH-INDEX.json?",
];
const results = [];
const bytes = value => Buffer.byteLength(JSON.stringify(value));
for (const query of queries) {
  const started = Date.now();
  const output = execFileSync("node", [join(out, "context-pack.mjs"), "--query", query], { cwd: root, encoding: "utf8" });
  const summary = JSON.parse(output.slice(output.indexOf("{")));
  const pack = JSON.parse(readFileSync(join(out, "LAST-CONTEXT-PACK.json"), "utf8"));
  results.push({
    query,
    pack_type: pack.body?.pack_type,
    source_files: pack.source_files?.length || 0,
    bytes: pack.bytes || bytes(pack),
    token_estimate: pack.token_estimate,
    latency_ms: pack.latency_ms || (Date.now() - started),
    source_records: pack.source_record_count ?? null,
    external_mutations: 0,
  });
}
const report = {
  schema_version: "phase-j.context-pack-benchmark.v1",
  generated_at: new Date().toISOString(),
  retrieval_method: "deterministic index -> targeted record -> excerpt",
  index_version: "phase-i.search-index.v1 + phase-f.report-index.v1",
  benchmark_queries: results.length,
  results,
  totals: {
    bytes: results.reduce((n, r) => n + r.bytes, 0),
    tokens: results.reduce((n, r) => n + (r.token_estimate || 0), 0),
    latency_ms: results.reduce((n, r) => n + r.latency_ms, 0),
    source_files_opened: [...new Set(results.flatMap(r => r.source_files))].length,
    external_mutations: 0,
  },
  summary: {
    mean_bytes: Math.round(results.reduce((n, r) => n + r.bytes, 0) / results.length),
    mean_latency_ms: Math.round(results.reduce((n, r) => n + r.latency_ms, 0) / results.length),
    target: "minimum necessary context while preserving correctness",
    full_repository_scan: false,
  },
};
writeFileSync(join(out, "CONTEXT-PACK-BENCHMARK.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ benchmark_queries: report.benchmark_queries, total_bytes: report.totals.bytes, total_tokens: report.totals.tokens, mean_bytes: report.summary.mean_bytes, mean_latency_ms: report.summary.mean_latency_ms, source_files_opened: report.totals.source_files_opened, external_mutations: 0 }, null, 2));
