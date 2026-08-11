import assert from "node:assert/strict";
import { compareFreshness } from "./freshness-gate.mjs";

const canonical = {
  repository: "ix-infrastructure/Ix",
  defaultBranch: "main",
  canonicalHead: "abc123",
  baselineHead: "abc123",
  baselineOpenPRs: new Set([393]),
  baselineOpenIssues: new Set([219]),
  canonicalOpenPRs: new Set([393]),
  canonicalOpenIssues: new Set([219]),
  knownPRs: new Map([[393, {}]]),
  knownIssues: new Map([[219, {}]]),
  snapshots: [],
};
const snapshot = [{ dataset: "fixture/data.js", generated_at: "2099-01-01", source_revision: "abc123", parse_error: null }];

const fresh = compareFreshness(canonical, {
  repository: "ix-infrastructure/Ix",
  defaultBranch: "main",
  head: "abc123",
  openPRs: new Set([393]),
  openIssues: new Set([219]),
  fetchedAt: "fixture",
}, snapshot);
assert.equal(fresh.gate, "PASS");
assert.equal(fresh.stale_count, 0);

const stale = compareFreshness(canonical, {
  repository: "ix-infrastructure/Ix",
  defaultBranch: "main",
  head: "def456",
  openPRs: new Set([393, 395]),
  openIssues: new Set([219, 349]),
  fetchedAt: "fixture",
}, snapshot);
assert.equal(stale.gate, "STALE");
assert.ok(stale.checks.some(check => check.id === "canonical-head" && !check.ok));
assert.ok(stale.checks.some(check => check.id === "graph-pr-coverage" && !check.ok));
assert.ok(stale.checks.some(check => check.id === "graph-issue-coverage" && !check.ok));

console.log("freshness-gate tests passed: fresh state passes; head, PR, and issue drift fail closed");
