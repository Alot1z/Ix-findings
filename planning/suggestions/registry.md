# AI-Agent Suggestion Registry

Every meaningful recommendation made by any phase/agent, with final disposition.
Dispositions: ACCEPTED · REJECTED · DEFERRED · SUPERSEDED · BLOCKED ·
PARTIALLY ACCEPTED. Rejected and dangerous suggestions are recorded as
carefully as accepted ones. Machine-readable: `registry.json`.

## Accepted (implemented or committed to)

| ID | Suggestion | Phase | Evidence | Repo | Disposition | Reason / related finding |
|---|---|---|---|---|---|---|
| S-001 | Use a dedicated Git worktree for the remap work | 00 | E-021 | Ix | ACCEPTED | isolation from the 18-file overhaul (D-002) |
| S-002 | Base the remap branch on `origin/main`, not stale local/fork main | 01 | E-019 | Ix | ACCEPTED | clean PR base (D-001) |
| S-003 | Export `serverScript()` from view.ts for testing | 02 | E-014 | Ix | ACCEPTED | enables generated-server tests |
| S-004 | `IX_VIEW_MAP_MAIN` env seam for stub CLI in tests | 02 | E-014, E-015 | Ix | ACCEPTED | integration tests without a real install |
| S-005 | Four-tier evidence classification (A/B/C/D) | 02 | methodology | Ix-findings | ACCEPTED | credibility; prevents overclaiming (D-003) |
| S-006 | Keep Compass changes separate from Ix changes (two repos, two PRs) | 03/10 | E-008, E-020 | ALL | ACCEPTED | different repos/owners/reviews |
| S-007 | F-key = keyboard exposure only; no CameraStore, no duplicate fit math | 05/06 | E-005…E-007, E-010 | system-compass | ACCEPTED | real camera state exists; 0 key already fits (D-005) |
| S-008 | Delayed-data is a separate concern from F-key | 07 | E-009 | system-compass | ACCEPTED | different root cause/review scope (D-006) |
| S-009 | Ix-findings as a standalone evidence repo | 08 | — | Ix-findings | ACCEPTED | self-contained ledger (D-008) |
| S-010 | PR packet for #376 | 11 | E-017 | Ix | ACCEPTED | packet ready |
| S-011 | Keep the improved compass-patch as a local stopgap with documented expiry | plan D4 | E-025 | Ix (local) | ACCEPTED (local-only) | not welcome in the Ix repo; expires when Compass ships F-fit (D-013) |
| S-012 | Parse Origin with `new URL()`, not regex (template-literal pipeline) | 02 | E-014 | Ix | ACCEPTED | regex backslashes would be eaten by script regeneration |

## Deferred (not yet acted on — P1/P2)

| ID | Suggestion | Phase | Evidence | Repo | Disposition | Reason |
|---|---|---|---|---|---|---|
| S-013 | Fix #376 (stamp dist version / identity compare) | 03/11 | E-017 | Ix | DEFERRED | awaiting authorization + maintainer direction (F-008) |
| S-014 | Fix #371 (register or delete patches) | 04 | E-018 | Ix | DEFERRED | separate priority from remap (F-009) |
| S-015 | Commit Ix-findings | 09 | — | Ix-findings | DEFERRED | held for final review (this phase) |
| S-016 | Sync fork main after remap push | 01/12 | E-019 | Ix | DEFERRED | depends on remap push (authorization) |
| S-017 | Re-verify zoom multiplier (×1.1 vs ×1.25) | 07 | E-011 | system-compass | DEFERRED | low priority; needs source or dedicated experiment (F-013) |
| S-018 | Reproduce delayed-data via Playwright automation | 07 | E-009 | system-compass | DEFERRED | source-blocked; manual A/B already deterministic |
| S-019 | Investigate system-compass #58/#59 | 05 | E-008 | system-compass | DEFERRED | source-blocked; release notes only |
| S-020 | No-map hint chip with feature-detect on `/__ix/remap` | plan D3 | E-014 | system-compass | DEFERRED | after Ix endpoint PR merges; hide chip when endpoint absent (D-012) |

## Rejected / Superseded

| ID | Suggestion | Phase | Evidence | Repo | Disposition | Reason |
|---|---|---|---|---|---|---|
| S-021 | Create a `CameraStore` abstraction for Compass | historical port | E-010 | system-compass | REJECTED | real camera state exists — would duplicate architecture |
| S-022 | DOM zoom patch (`style.zoom`, timers) for Compass | historical port | E-010 | system-compass | REJECTED | fragile; fights React-driven state; native camera exists |
| S-023 | Combine F-key + delayed-data in one PR | 07 | E-009 | system-compass | REJECTED | different causes, different reviews |
| S-024 | Mix Compass UI changes into the Ix PR | 03 | E-014 | mixed | REJECTED | separate repos, separate PRs |
| S-025 | Stash the Ix overhaul to free the main worktree | 01 | E-019 | Ix | REJECTED | unsafe; dedicated worktree used instead (D-002) |
| S-026 | Base/compare remap against fork/main | 01 | E-019 | Ix | REJECTED | fork stale (5 behind); origin/main is canonical |
| S-027 | Manually modify ix-compass-dist artifacts | 08 | E-001…E-004 | ix-compass-dist | REJECTED | distribution channel; artifacts built from system-compass (D-007) |
| S-028 | Push fork/main without first syncing | 01 | E-019 | Ix | REJECTED | would publish a stale fork; defer to post-remap (S-016) |
| S-032 | Add mount auto-frame to the F-key PR | 06 | E-008 | system-compass | SUPERSEDED | #57 already refits on mount (v0.3.0) |
| S-033 | Add drill-in/out reframe to the F-key PR | 06 | E-008 | system-compass | SUPERSEDED | #57 keyed refit covers drill (v0.3.0) |

## Dangerous / incorrect (recorded for audit)

| ID | Suggestion | Phase | Why dangerous | Disposition |
|---|---|---|---|---|
| S-029 | `git reset --hard` on the primary worktree | 04 (considered) | would destroy the 13-file uncommitted overhaul | REJECTED — explicitly blocked |
| S-030 | Bind the remap server to `0.0.0.0` | 02 (considered) | exposes a shell-exec endpoint to the network | REJECTED — loopback only (F-010) |
| S-031 | Pass the claim to the doubt-driven reviewer | 04 (considered) | biases the reviewer toward agreement | REJECTED — adversarial framing required |

## Cross-cutting audit notes

- **Nothing here would have weakened security that was accepted** — S-030 was
  the only security-relevant candidate and it was rejected.
- **PR-scope suggestions** (S-006, S-023, S-024) were all enforced: the remap
  diff contains zero Compass UI changes and vice versa.
- **Fabrication-adjacent suggestions**: none were accepted; the F-key PR is a
  spec, not a fake implementation (D-009, phase-06 gate).
