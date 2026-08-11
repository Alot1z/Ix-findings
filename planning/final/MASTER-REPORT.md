# MASTER REPORT — Ix / Compass / Ix-findings Investigation

**Date:** 2026-08-11 · **Ladder:** Phase 0–12 executed, Phase 13 terminal.
**Location:** This document is the consolidated master report. Detailed
evidence: `CLI-HANDOFF/phase-*/`. Interactive explorer: `wiki/index.html`.

---

## Executive Summary

A comprehensive investigation of the Ix ecosystem (Ix CLI, Compass, and the
shared code graph) was conducted across 13 phases. Thirteen findings were
registered (F-001…F-013), spanning keyboard invariants, fit-math constants,
installation/upgrade bugs, and a protocol-level MCP surface. Two findings
were resolved upstream (F-008/F-009). Three are in an open upstream PR
(F-010…F-012 via PR #393). Seven are blocked on Compass source access. One
is deferred (F-013, needs browser). A production-grade `ix mcp` subcommand
was built on the fork, hardened, and real-client verified — the largest
implementation deliverable. Four contribution PR packets are prepared but
**none have been submitted** — submission is explicitly user-gated.

---

## Phase Ladder Summary

| Phase | Title | Status |
|---|---|---|
| 0 | Existing-state reconciliation | COMPLETE — baseline established |
| 1 | Tooling, skill, architecture archaeology | COMPLETE — inventory built |
| 2 | Knowledge, evidence, cross-project reconciliation | COMPLETE — graph constructed |
| 3 | Engineering opportunity, bug, enhancement analysis | COMPLETE — 20 candidates |
| 4 | Controlled implementation foundation | COMPLETE — graph repair, packets |
| 5 | Authorization-gated contribution | COMPLETE — rebase, fork sync, supersessions |
| 6 | Controlled external contribution | COMPLETE — PR #393 authored |
| 7 | Post-contribution stewardship | COMPLETE — reconciliation, findings audit |
| 8 | `ix mcp` fork implementation (#219) | COMPLETE — built, tested, pushed |
| 9 | `ix mcp` hardening + real-client E2E | PARTIAL — hardening done, Codex E2E done; platform/perf remain |
| 10 | Compass fork readiness | BLOCKED/READINESS_COMPLETE — spec audited, fork 404 |
| 11 | Ecosystem second-order reconciliation | COMPLETE — #385/#349 fix evidence, candidates regenerated |
| 12 | Contribution packaging + pre-submission gate | COMPLETE — review green, inventory created |

---

## Findings Ledger

| Finding | Subject | Evidence Class | Status |
|---|---|---|---|
| F-001 | Keyboard handler invariant across 4 releases | B (artifact) | CONFIRMED (Compass) |
| F-002 | F/f genuinely unbound in all releases | B | CONFIRMED (Compass) |
| F-003 | KeyboardHelp byte-identical, no F entry | B | CONFIRMED (Compass) |
| F-004 | Fit math + constants invariant | B | CONFIRMED (Compass) |
| F-005 | #57 one-shot fit latch → keyed refit | A+B (source + artifact) | CONFIRMED (Compass) |
| F-006 | Delayed-data blank persists on v0.3.0 | B+C | REPRODUCED_LIVE (Compass) |
| F-007 | Region-rollup timing-dependent | B | OBSERVED (Compass) |
| F-008 | Version-series mismatch in ix upgrade | A | **RESOLVED_UPSTREAM** (PR #391) |
| F-009 | patches command dead/unregistered | A | **RESOLVED_UPSTREAM** (PR #390) |
| F-010 | Loopback-hardened /__ix/remap endpoint | A | **IN PR #393** |
| F-011 | WSL bootstrap fix | A | **IN PR #393** |
| F-012 | Dead node_ok removal | A | **IN PR #393** |
| F-013 | Zoom-in multiplier discrepancy (×1.25 vs ×1.1) | D (inference) | **OPEN/DEFERRED** — needs browser |

---

## Contributions

| # | Contribution | Status | Where |
|---|---|---|---|
| 1 | **ix mcp subcommand** (#219) | PREPARED on fork | `Alot1z/Ix:feat/ix-mcp` @ `66fa5f5` (5 commits, 749/2 tests) |
| 2 | **ix remap + WSL fix** (PR #393) | OPEN upstream | `ix-infrastructure/Ix` PR, awaiting review |
| 3 | **compass F-key fit view** | BLOCKED | Spec complete; no source access |
| 4 | **compass delayed-data fix** | BLOCKED | Investigation complete; no source access |

**Submission triggers** — see `CLI-HANDOFF/phase-12/CONTRIBUTION-INVENTORY.md`.

---

## Resolved Upstream (not our contributions)

| Issue | Resolution | PR |
|---|---|---|
| #376 version mismatch | Fixed on main | PR #391 |
| #371 patches dead code | Fixed on main | PR #390 |
| #385 upgrade breaks wrapper | Fixed on main (issues still open — admin backlog) | PRs #386, #392 |
| #349 installer space-in-path | Fixed on main (issues still open — admin backlog) | PRs #352, #392 |

---

## Blockers

| Blocker | Impact | Path |
|---|---|---|
| Compass source access | Blocks F-key + delayed-data PRs, F-001…F-007 resolution | Wait for upstream publishing or access grant |
| Fork-main sync | Fork lacks latest upstream fixes (#385/#349) | PAT `workflow` scope — `gh auth refresh -s workflow` |
| F-013 zoom experiment | Finding remains Class D | Install Chromium + run Compass v0.3.0 |
| PR #393 review | Remap contribution pending | Awaiting josephismikhail's review |

---

## What the user should do

1. **Submit ix mcp PR** — run the trigger in `CONTRIBUTION-INVENTORY.md`.
2. **Monitor PR #393** — implement review changes on `feat/ix-remap-hardening` if requested.
3. **Sync the fork** — `gh auth refresh -s workflow` then retry fork-main sync.
4. **If Compass source becomes available** — create the fork, push branches per packet specs, submit F-key + delayed-data PRs.
5. **Carry forward** — Phase 9 remaining items (cross-platform, perf), F-013/CAND-006 (Chromium+Compass).

---

## Appendix

- **Evidence index:** `planning/evidence/registry.json`
- **Findings details:** `planning/findings/registry.json`
- **Decisions log:** `planning/decisions/registry.json`
- **PR matrix:** `CLI-HANDOFF/PR-MATRIX.md`
- **Ladder roadmap:** `CLI-HANDOFF/PHASE-LADDER.md`
- **Contribution inventory:** `CLI-HANDOFF/phase-12/CONTRIBUTION-INVENTORY.md`
- **Final close-out:** `CLI-HANDOFF/phase-13/FINAL-CLOSE-OUT.md`
- **Explorer:** `https://alot1z.github.io/Ix-findings/`

---

*End of master report. The ladder is closed. No Phase 14.*
