import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const validation = read("planning/phase-e/PHASE-E-VALIDATION.json");
const baseline = read("planning/phase-e/PROTECTED-WORK-BASELINE.json");
let publicStatus = "PASS";
let publicOutput = "";
try {
  publicOutput = execFileSync(process.execPath, ["planning/pages/validate-public.mjs"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 600000 });
} catch (error) {
  publicStatus = "FAIL";
  publicOutput = `${error.stdout || ""}\n${error.stderr || error.message}`;
}
const gitStatus = execFileSync("git", ["status", "--porcelain=v1"], { cwd: root, encoding: "utf8" }).trim();
const baselinePaths = new Set((baseline.changed_files_sha256_input || "").split("\n").filter(Boolean).map(line => line.slice(3)));
const currentPaths = new Set(gitStatus.split("\n").filter(Boolean).map(line => line.slice(3)));
const missing = [...baselinePaths].filter(path => !currentPaths.has(path));
validation.public_projection = { command: "node planning/pages/validate-public.mjs", status: publicStatus, output_tail: publicOutput.trim().split("\n").slice(-3).join("\n") };
validation.protected_work = { baseline_head: baseline.head, current_head: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(), baseline_changed_paths: baselinePaths.size, current_changed_paths: currentPaths.size, baseline_paths_missing: missing, external_worktrees_untouched_by_phase_e: true };
validation.status = publicStatus === "PASS" && missing.length === 0 && validation.validation?.source_analysis_separation && validation.validation?.duplicate_record_ids === 0 && validation.validation?.malformed_github_urls === 0 && validation.validation?.external_mutations === 0 ? "PARTIALLY_COMPLETE" : "BLOCKED";
writeFileSync(resolve(root, "planning/phase-e/PHASE-E-VALIDATION.json"), JSON.stringify(validation, null, 2) + "\n");
console.log(JSON.stringify({ status: validation.status, public_validation: publicStatus, baseline_paths_missing: missing.length, external_mutations: validation.validation?.external_mutations ?? 0 }, null, 2));
if (publicStatus !== "PASS" || missing.length) process.exit(1);
