import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
const root = process.cwd();
const run = (cmd, args) => { try { return execFileSync(cmd, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } };
const status = run("git", ["status", "--short", "--untracked-files=all"]);
const baseline = {
  schema_version: "phase-j.protected-work-baseline.v1",
  recorded_at: new Date().toISOString(),
  repository: "Alot1z/Ix-findings",
  branch: run("git", ["branch", "--show-current"]),
  head: run("git", ["rev-parse", "HEAD"]),
  dirty: Boolean(status),
  changed_file_count: status ? status.split("\n").filter(Boolean).length : 0,
  changed_paths: status ? status.split("\n").filter(Boolean) : [],
  worktrees: run("git", ["worktree", "list"]).split("\n").filter(Boolean),
};
writeFileSync(join(root, "planning/phase-j/PROTECTED-WORK-BASELINE.json"), JSON.stringify(baseline, null, 2) + "\n");
console.log(JSON.stringify({ branch: baseline.branch, head: baseline.head, dirty: baseline.dirty, changed_file_count: baseline.changed_file_count }, null, 2));
