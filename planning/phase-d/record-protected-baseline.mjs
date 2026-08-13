import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const out = resolve(root, "planning/phase-d");
mkdirSync(out, { recursive: true });
const repos = {
  "Ix-findings": "E:/E-github-repos/Ix-findings",
  "Ix-remap": "E:/E-github-repos/Ix-remap",
  Ix: "E:/E-github-repos/Ix",
  "Ix-mcp": "E:/E-github-repos/Ix-mcp",
  "Ix-test": "E:/E-github-repos/Ix-test",
  "ix-compass-dist": "E:/E-github-repos/ix-compass-dist",
};
const run = (args, cwd) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
const sha256 = value => createHash("sha256").update(value).digest("hex");
const worktrees = {};
for (const [name, path] of Object.entries(repos)) {
  try {
    const status = run(["status", "--porcelain=v1"], path);
    worktrees[name] = {
      path_internal: path,
      branch: run(["branch", "--show-current"], path),
      head: run(["rev-parse", "HEAD"], path),
      changed_path_count: status ? status.split(/\r?\n/).length : 0,
      status_sha256: sha256(status),
    };
  } catch (error) {
    worktrees[name] = { path_internal: path, status: "UNAVAILABLE", error: error.message };
  }
}
const rootStatus = run(["status", "--porcelain=v1"], root);
const baseline = {
  schema_version: "phase-d.protected-work-baseline.v1",
  captured_at: new Date().toISOString(),
  policy: "Existing dirty work is protected; no reset, clean, stash, overwrite, or history rewrite.",
  root: {
    repository: "Ix-findings",
    path_internal: root,
    branch: run(["branch", "--show-current"], root),
    head: run(["rev-parse", "HEAD"], root),
    changed_path_count: rootStatus ? rootStatus.split(/\r?\n/).length : 0,
    status_sha256: sha256(rootStatus),
  },
  worktrees,
};
writeFileSync(resolve(out, "PROTECTED-WORK-BASELINE.json"), JSON.stringify(baseline, null, 2) + "\n");
console.log(JSON.stringify({ file: "planning/phase-d/PROTECTED-WORK-BASELINE.json", root_paths: baseline.root.changed_path_count, worktrees: Object.keys(worktrees).length }, null, 2));
