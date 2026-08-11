import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { baselineLiveState } from "./freshness-gate.mjs";
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

// Degraded mode: when the live API is unavailable, the gate falls back to the
// captured baseline (knowledge/live-github-state.json) and must still pass
// when the canonical graph is consistent with that capture.
const tempRoot = mkdtempSync(join(tmpdir(), "freshness-gate-test-"));
try {
  mkdirSync(join(tempRoot, "knowledge"), { recursive: true });
  writeFileSync(join(tempRoot, "knowledge", "live-github-state.json"), JSON.stringify({
    captured_at: "2026-08-11T00:00:00Z",
    source: "test",
    upstream: { repository: "ix-infrastructure/Ix", default_branch: "main", head_sha: "abc123" },
    open_issues: [{ number: 219 }],
    open_pull_requests: [{ number: 393 }],
  }));
  const baseline = baselineLiveState(tempRoot);
  assert.equal(baseline.repository, "ix-infrastructure/Ix");
  assert.equal(baseline.head, "abc123");
  assert.deepEqual([...baseline.openPRs], [393]);
  assert.deepEqual([...baseline.openIssues], [219]);
  const degradedFresh = compareFreshness(canonical, baseline, snapshot);
  assert.equal(degradedFresh.gate, "PASS");
  assert.equal(degradedFresh.stale_count, 0);
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

// Superseded-commit staleness: a manifest-era commit marked CURRENT while the
// live capture records a newer head for the same branch must fail the gate.
const liveForSuperseded = {
  repository: "ix-infrastructure/Ix",
  defaultBranch: "main",
  head: "abc123",
  openPRs: new Set([393]),
  openIssues: new Set([219]),
  fetchedAt: "fixture",
};
const supersededBase = {
  ...canonical,
  phaseManifestCommits: [{ sha: "old1", branch: "feat/ix-remap-hardening" }],
  liveCapturePRs: [{ number: 393, head_ref: "feat/ix-remap-hardening", head_sha: "newhead" }],
};
const unreconciled = compareFreshness({ ...supersededBase, commitEntityStatus: new Map([["COMMIT-old1", "CURRENT"]]) }, liveForSuperseded, snapshot);
assert.equal(unreconciled.gate, "STALE");
assert.ok(unreconciled.checks.some(check => check.id === "superseded-commit:old1" && !check.ok));

const reconciled = compareFreshness({ ...supersededBase, commitEntityStatus: new Map([["COMMIT-old1", "HISTORICAL"]]) }, liveForSuperseded, snapshot);
assert.equal(reconciled.gate, "PASS");
assert.equal(reconciled.stale_count, 0);

// Tolerant branch match: the manifest record names the branch with a suffix,
// and the live capture must still supersede it.
const tolerant = compareFreshness({
  ...supersededBase,
  phaseManifestCommits: [{ sha: "old2", branch: "feat/ix-remap-hardening (fork, pushed)" }],
  commitEntityStatus: new Map([["COMMIT-old2", "CURRENT"]]),
}, liveForSuperseded, snapshot);
assert.equal(tolerant.gate, "STALE");
assert.ok(tolerant.checks.some(check => check.id === "superseded-commit:old2" && !check.ok));

// No live PR for the branch: no superseded-commit check is emitted.
const unrelated = compareFreshness({
  ...canonical,
  phaseManifestCommits: [{ sha: "abc", branch: "some/unrelated-branch" }],
  commitEntityStatus: new Map([["COMMIT-abc", "CURRENT"]]),
}, liveForSuperseded, snapshot);
assert.equal(unrelated.gate, "PASS");
assert.equal(unrelated.stale_count, 0);

console.log("freshness-gate tests passed: fresh state passes; head, PR, and issue drift fail closed; degraded baseline fallback passes; superseded-commit staleness fails closed");
