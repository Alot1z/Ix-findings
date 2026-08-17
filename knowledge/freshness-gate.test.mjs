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

// Fork-branch fallback: a branch with no open PR (e.g. feat/ix-agent-skill) is
// superseded by the captured fork branch head; CURRENT entity fails, HISTORICAL passes.
const liveForForkSuperseded = { ...liveForSuperseded };
const forkSupersededBase = {
  ...canonical,
  phaseManifestCommits: [{ sha: "old3", branch: "feat/ix-agent-skill", repo: "Alot1z/Ix" }],
  liveCapturePRs: [],
  liveCaptureForkBranches: { "Alot1z/Ix": { main: "abc123", "feat/ix-agent-skill": "newagenthead" } },
};
const forkUnreconciled = compareFreshness({ ...forkSupersededBase, commitEntityStatus: new Map([["COMMIT-old3", "CURRENT"]]) }, liveForForkSuperseded, snapshot);
assert.equal(forkUnreconciled.gate, "STALE");
assert.ok(forkUnreconciled.checks.some(check => check.id === "superseded-commit:old3" && !check.ok));

const forkReconciled = compareFreshness({ ...forkSupersededBase, commitEntityStatus: new Map([["COMMIT-old3", "HISTORICAL"]]) }, liveForForkSuperseded, snapshot);
assert.equal(forkReconciled.gate, "PASS");
assert.equal(forkReconciled.stale_count, 0);

// Repo guard: an upstream main snapshot (repo ix-infrastructure/Ix, branch main)
// must never match the fork's main head, even when fork branches are captured.
const mainGuard = compareFreshness({
  ...canonical,
  phaseManifestCommits: [{ sha: "upmain", branch: "main", repo: "ix-infrastructure/Ix" }],
  liveCapturePRs: [],
  liveCaptureForkBranches: { "Alot1z/Ix": { main: "newmain", "feat/ix-agent-skill": "newagenthead" } },
  commitEntityStatus: new Map([["COMMIT-upmain", "CURRENT"]]),
}, liveForForkSuperseded, snapshot);
assert.equal(mainGuard.gate, "PASS");
assert.equal(mainGuard.stale_count, 0);

// Purged-SHA hygiene: a physically purged commit must never appear in a
// live/current position — live entity metadata, non-HISTORICAL relationships,
// live capture heads/file refs, or a non-HISTORICAL COMMIT entity. Labeled
// provenance (historical_sha, HISTORICAL status, HISTORICAL relationships) is
// deliberately exempt.
const purgeLive = { ...liveForSuperseded };
const purgeDirtyBase = {
  ...canonical,
  purgedShas: ["deadbeef", "deadbeef0123456789"],
  entities: [
    { canonical_id: "COMMIT-deadbeef", entity_type: "COMMIT", status: "CURRENT", metadata: { sha: "deadbeef" }, human_summary: "ok", deep_summary: "" },
  ],
  relationships: [
    { relationship_id: "REL-PURGED", from: "PR-1", to: "COMMIT-deadbeef", type: "CHANGED_BY", status: "CURRENT" },
  ],
  liveCaptureImplementations: [{ id: "impl-x", files: [{ path: "x.ts", commit: "deadbeef" }] }],
  liveCapturePRs: [{ number: 1, head_sha: "deadbeef" }],
  liveCaptureForkBranches: { "Alot1z/Ix": { "feat/x": "deadbeef" } },
};
const purgeDirty = compareFreshness(purgeDirtyBase, purgeLive, snapshot);
assert.equal(purgeDirty.gate, "STALE");
assert.ok(purgeDirty.checks.some(check => check.id.startsWith("purged-sha:") && !check.ok));

// Every exemption holds at once: provenance keys, HISTORICAL entity status,
// HISTORICAL relationship, and no live-capture references → PASS.
const purgeClean = compareFreshness({
  ...canonical,
  purgedShas: ["deadbeef"],
  entities: [
    { canonical_id: "COMMIT-deadbeef", entity_type: "COMMIT", status: "HISTORICAL", metadata: { historical_sha: "deadbeef", superseded_at: "2026-08-11" }, human_summary: "removed commit deadbeef (historical)", deep_summary: "" },
  ],
  relationships: [
    { relationship_id: "REL-1", from: "PR-1", to: "COMMIT-deadbeef", type: "CHANGED_BY", status: "HISTORICAL" },
  ],
  liveCaptureImplementations: [],
  liveCapturePRs: [],
  liveCaptureForkBranches: {},
}, purgeLive, snapshot);
assert.equal(purgeClean.gate, "PASS");
assert.equal(purgeClean.stale_count, 0);

// A purged SHA in a live entity's summary (non-provenance position) fails.
const purgeSummary = compareFreshness({
  ...purgeDirtyBase,
  entities: [{ canonical_id: "FINDING-X", entity_type: "FINDING", status: "CURRENT", metadata: {}, human_summary: "introduced in deadbeef", deep_summary: "" }],
}, purgeLive, snapshot);
assert.equal(purgeSummary.gate, "STALE");
assert.ok(purgeSummary.checks.some(check => check.id === "purged-sha:entity:FINDING-X:summary" && !check.ok));

// No purged SHAs configured → the audit is inert (no checks emitted).
const noPurge = compareFreshness({ ...purgeDirtyBase, purgedShas: [] }, purgeLive, snapshot);
assert.equal(noPurge.gate, "PASS");
assert.equal(noPurge.checks.some(check => check.id.startsWith("purged-sha:")), false);

// Manifest live_baseline staleness: the manifest-era record (baselineHead)
// must not silently pass publication freshness checks when it no longer
// matches the live head — even when the graph's canonical head is current.
// This is the class that previously blocked publication when
// knowledge/manifest.json recorded fef671c while live upstream was 043bc68.
const liveFresh = {
  repository: "ix-infrastructure/Ix",
  defaultBranch: "main",
  head: "abc123",
  openPRs: new Set([393]),
  openIssues: new Set([219]),
  fetchedAt: "fixture",
};
const manifestStale = compareFreshness({ ...canonical, canonicalHead: "abc123", baselineHead: "fef671c" }, liveFresh, snapshot);
assert.equal(manifestStale.gate, "STALE");
assert.ok(manifestStale.checks.some(check => check.id === "manifest-head" && !check.ok));
assert.ok(manifestStale.checks.some(check => check.id === "canonical-head" && check.ok));

const manifestFresh = compareFreshness({ ...canonical, canonicalHead: "abc123", baselineHead: "abc123" }, liveFresh, snapshot);
assert.equal(manifestFresh.gate, "PASS");
assert.equal(manifestFresh.stale_count, 0);

// Degraded mode (live API unavailable): a stale manifest baseline must also
// fail closed against a stale captured baseline (manifest-head check).
const captureStale = {
  repository: "ix-infrastructure/Ix",
  defaultBranch: "main",
  head: "def456",
  openPRs: new Set([393, 395]),
  openIssues: new Set([219, 349]),
  fetchedAt: "fixture",
};
const manifestStaleDegraded = compareFreshness({ ...canonical, canonicalHead: "abc123", baselineHead: "fef671c" }, captureStale, snapshot);
assert.equal(manifestStaleDegraded.gate, "STALE");
assert.ok(manifestStaleDegraded.checks.some(check => check.id === "manifest-head" && !check.ok));

console.log("freshness-gate tests passed: fresh state passes; head, PR, and issue drift fail closed; degraded baseline fallback passes; superseded-commit staleness fails closed (open-PR and fork-branch heads); upstream-main repo guard holds; purged-SHA hygiene fails closed (live metadata, summaries, CURRENT relationships, live capture heads/file refs, non-HISTORICAL COMMIT entities) with provenance/HISTORICAL exemptions and inert-when-unconfigured");
