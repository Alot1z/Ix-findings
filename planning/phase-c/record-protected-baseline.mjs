import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const run = (cwd, args) => execFileSync("git", args, { cwd, encoding: "utf8" });
const status = cwd => {
  const porcelain = run(cwd, ["status", "--porcelain=v1"]);
  const lines = porcelain.split(/\r?\n/).filter(Boolean);
  return {
    branch: run(cwd, ["branch", "--show-current"]).trim(),
    head: run(cwd, ["rev-parse", "HEAD"]).trim(),
    status_sha256: createHash("sha256").update(porcelain).digest("hex"),
    changed_paths: lines.map(line => line.slice(3)),
    changed_path_count: lines.length,
    untracked_path_count: lines.filter(line => line.startsWith("??")).length,
  };
};
const repos = [
  ["Ix-findings", root],
  ["Ix-remap", "E:/E-github-repos/Ix-remap"],
  ["Ix", "E:/E-github-repos/Ix"],
  ["Ix-mcp", "E:/E-github-repos/Ix-mcp"],
  ["Ix-test", "E:/E-github-repos/Ix-test"],
  ["ix-compass-dist", "E:/E-github-repos/ix-compass-dist"],
];
const worktrees = Object.fromEntries(repos.filter(([, path]) => existsSync(path)).map(([name, path]) => [name, { path, ...status(path) }]));
const baseline = {
  phase: "C",
  captured_at: new Date().toISOString(),
  scope: "Protected-work baseline before Phase-C mutations; existing dirty work is not owned by this phase.",
  root: worktrees["Ix-findings"],
  worktrees,
  mutation_policy: {
    no_reset: true,
    no_clean: true,
    no_stash: true,
    no_overwrite_of_preexisting_paths: true,
    external_github_mutations: 0,
  },
};
mkdirSync(resolve(root, "planning/phase-c"), { recursive: true });
writeFileSync(resolve(root, "planning/phase-c/PROTECTED-WORK-BASELINE.json"), JSON.stringify(baseline, null, 2) + "\n");
console.log(JSON.stringify({ captured_at: baseline.captured_at, root_paths: baseline.root.changed_path_count, worktrees: Object.keys(worktrees) }, null, 2));
