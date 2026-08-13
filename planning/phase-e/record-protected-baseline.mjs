import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const run = (command, args) => execFileSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const status = run("git", ["status", "--porcelain=v1"]);
const branch = run("git", ["branch", "--show-current"]);
const head = run("git", ["rev-parse", "HEAD"]);
const worktrees = run("git", ["worktree", "list", "--porcelain"]);
const baseline = {
  schema_version: "phase-e.protected-work-baseline.v1",
  captured_at: new Date().toISOString(),
  repository: "Ix-findings",
  root: root.replaceAll("\\", "/"),
  branch,
  head,
  dirty: status.length > 0,
  changed_file_count: status ? status.split("\n").length : 0,
  changed_files_sha256_input: status,
  worktrees,
  external_mutations_allowed: 0,
};
mkdirSync(resolve(root, "planning/phase-e"), { recursive: true });
writeFileSync(resolve(root, "planning/phase-e/PROTECTED-WORK-BASELINE.json"), JSON.stringify(baseline, null, 2) + "\n");
console.log(JSON.stringify({ repository: baseline.repository, branch, head, dirty: baseline.dirty, changed_file_count: baseline.changed_file_count, external_mutations_allowed: 0 }, null, 2));
