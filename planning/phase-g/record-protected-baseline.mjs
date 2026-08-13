import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const root = process.cwd();
const run = (command, args) => execFileSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const status = run("git", ["status", "--porcelain=v1"]);
const changedFiles = status ? status.split("\n").map(line => line.slice(3)).filter(Boolean) : [];
mkdirSync(resolve(root, "planning/phase-g"), { recursive: true });
writeFileSync(resolve(root, "planning/phase-g/PROTECTED-WORK-BASELINE.json"), JSON.stringify({ schema_version: "phase-g.protected-work-baseline.v1", captured_at: new Date().toISOString(), repository: "Ix-findings", branch: run("git", ["branch", "--show-current"]), head: run("git", ["rev-parse", "HEAD"]), dirty: changedFiles.length > 0, changed_file_count: changedFiles.length, changed_files: changedFiles, external_mutations_allowed: 0 }, null, 2) + "\n");
