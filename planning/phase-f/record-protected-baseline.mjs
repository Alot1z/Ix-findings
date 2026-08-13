import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const run = (command, args) => execFileSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const status = run("git", ["status", "--porcelain=v1"]);
const changedFiles = status ? status.split("\n").map(line => line.slice(3)).filter(Boolean) : [];
const baseline = {
  schema_version: "phase-f.protected-work-baseline.v1",
  captured_at: new Date().toISOString(),
  repository: "Ix-findings",
  branch: run("git", ["branch", "--show-current"]),
  head: run("git", ["rev-parse", "HEAD"]),
  dirty: changedFiles.length > 0,
  changed_file_count: changedFiles.length,
  changed_files: changedFiles,
  worktrees: run("git", ["worktree", "list", "--porcelain"]),
  external_mutations_allowed: 0,
  note: "Pre-existing dirty work is protected by path-presence comparison; this phase does not reset, clean, stash, or overwrite unrelated paths."
};
mkdirSync(resolve(root, "planning/phase-f"), { recursive: true });
writeFileSync(resolve(root, "planning/phase-f/PROTECTED-WORK-BASELINE.json"), JSON.stringify(baseline, null, 2) + "\n");
console.log(JSON.stringify({ repository: baseline.repository, branch: baseline.branch, head: baseline.head, dirty: baseline.dirty, changed_file_count: baseline.changed_file_count, external_mutations_allowed: 0 }, null, 2));
