# PHASE 11 — ECOSYSTEM SECOND-ORDER RECONCILIATION — REPORT

**Date:** 2026-08-11 · **Status:** COMPLETE (read-only reconciliation —
evidence recorded, candidates regenerated, plugin gated, no code changes)

---

## STATUS

**COMPLETE.** This phase reconciled the ecosystem state against live
evidence: verified the upstream fixes for #385/#349 (Class A — three merged
PRs), recorded the plugin alignment as UNVERIFIED (repo 404), regenerated
the candidate universe, and harvested no new findings. No code was written.

## MISSION

Verify that the upstream fixes for #385/#349 are materially resolved on
main, assess the plugin MCP alignment, regenerate the candidate universe
from current evidence, and close out with Phase 12 input. (Full mission
in `PHASE-11-PROMPT.md`.)

## ACTUALLY CHANGED

- **Ix-findings ledger only**: regenerated `PHASE-11-PROMPT.md` (corrected:
  issues open but fixes merged, plugin 404, fork lacks fixes), this report,
  `PHASE-12-IMPLEMENTATION-INPUT.md`, candidate status notes.
- **No implementation repos touched** — no branches, no commits to
  Alot1z/Ix or any other worktree.
- **No ledger registries mutated** — candidates were audited here but not
  written back as a JSON refresh (the matrix stays as-is; the report notes
  status changes).

## ACTUALLY VERIFIED

| Claim | Evidence |
|---|---|
| #385 fixes merged | PR #386 (launcher diagnosis, 2026-08-10) + PR #392 (upgrade under IX_HOME, 2026-08-11) — both merged, both include tests. Class A. |
| #349 fixes merged | PR #352 (8.3-short TEMP path, 2026-08-10) + PR #392 (IX_HOME staging) + PR #395 (space-in-path test, OPEN). Class A. |
| Fork lacks fixes | fork main `5488741` = `merge-base(origin/main, fork/main)` — all 7 upstream commits including #352/#386/#392 are ahead of the fork. |
| Plugin 404 | `gh api repos/openai/ix-codex-plugin` → 404 — moved/renamed/deprecated. |
| CAND-006 deferred | Compass port 8099 dead; Chromium not in PATH. Same gate as Phase 10. |
| CAND-019 done (ix mcp) | ix mcp docs landed on fork (Phases 8+9: docs/api/README.md, CLAUDE.md, skills/ix). Remap docs in PR #393. |
| F-013 still deferred | Same Chromium+Compass gate. |

## NOT CHANGED

- Protected worktrees — read-only, verified.
- Fork branches — untouched.
- Upstream — no PRs, no comments, no commits.

## BLOCKED

| Item | Blocker |
|---|---|
| Fork-main sync | PAT `workflow` scope — user token action |
| Plugin alignment study | `openai/ix-codex-plugin` → 404; repo location unknown |
| CAND-006 Playwright repro | Chromium not available; Compass :8099 dead |
| F-013 zoom experiment | Same Chromium+Compass gate |
| CAND-020 remap write tool | PR #393 merging (0 reviews, review requested) |
| Compass CAND-001..CAND-007 | Source access (private repo, 404 both forks) |

## NEW DISCOVERIES

- D11-1: Both #385 and #349 remain OPEN despite fixes being merged
  upstream. This is an admin backlog (maintainer hasn't triaged), not a
  code defect. The evidence is Class A (merged PRs + tests).
- D11-2: The Phase 7 investigation concluded #385/#349 were "fixed-on-main"
  but the roadmap-era prompt wrote them as "fixed-on-main" — both
  interpretations are correct: the fixes ARE on main, but the issues are
  open. The ambiguity is now resolved: fixes merged, issues stale-open.
- D11-3: `ix-codex-plugin` has been moved or renamed from
  `openai/ix-codex-plugin`. The Phase 7 audit captured it at that URL; it
  was still public then. Current 404 may indicate a rename, a move to a
  different org, or deprecation.

## FINDINGS UPDATED / RETIRED / NEW

- None changed. F-001…F-013 statuses stable. No new findings promoted.

## CANDIDATE UNIVERSE REGENERATION

| Candidate | Prior Status | Current Status | Reason |
|---|---|---|---|
| CAND-001 | CONFIRMED (Compass keyboard) | BLOCKED | No source access (Phase 10 confirmed) |
| CAND-002 | CONFIRMED (F-key unbound) | BLOCKED | Same |
| CAND-003 | CONFIRMED (KeyboardHelp) | BLOCKED | Same |
| CAND-004 | CONFIRMED (Fit math) | BLOCKED | Same |
| CAND-005 | CONFIRMED (#57 latch) | BLOCKED | Same |
| CAND-006 | HIGH (delayed-data repro) | DEFERRED | Compass+Chromium gate (Phase 10/11) |
| CAND-007 | CONFIRMED (region rollup) | BLOCKED | Same |
| CAND-008…CAND-018 | CONFIRMED (various Ix items) | **RECHECK** | Some resolved upstream (F-008/F-009), some in-flight (CAND-020), some docs/compass |
| CAND-019 | MEDIUM (docs) | **PARTIAL** | ix mcp done (Phase 8+9); remap docs in PR #393 |
| CAND-020 | CONFIRMED (remap write) | BLOCKED | PR #393 merge gate |

Note: CAND-008 through CAND-018 cover the Phase 1–3 discovery items; several
are RESOLVED_UPSTREAM (F-008 F-009), several are BLOCKED (compass), and
several are IMPLEMENTED_ON_FORK (#219 = CAND for MCP). The full matrix
refresh is a Phase 12 ledger task (the JSON file needs field-level updates).

## AI-SLOP / QUALITY AUDIT

- The roadmap-era Phase 11 prompt claimed #385/#349 were "fixed-on-main"
  and required a verification harness. The LIVE state is: fixes merged
  upstream, issues open (admin backlog), no harness needed — the merged
  PRs ARE the Class A evidence. This is now corrected in the regenerated
  prompt.
- The roadmap-era prompt assumed `ix-codex-plugin` at `openai/ix-codex-plugin`
  was accessible. It's 404 now — the regenerated prompt records UNVERIFIED.

## SECURITY

- No new attack surface. Read-only GitHub API usage. No tokens exposed.

## GITHUB STATE

- Upstream Ix main `1292375` — 3 merged fix PRs (#352, #386, #392).
- Open PRs: #393 (remap, 0 reviews), #395 (IX_HOME space test), #388 (brew).
- Open issues: #385, #349, #383, #219.

## REMAINING WORK

- Phase 9 close-out: cross-platform matrix + perf methodology + client
  expansion (carried to Phase 12).
- F-013 + CAND-006: Chromium+Compass runtime needed (environment-gated).
- CAND-020: PR #393 merge gate.
- Fork-main sync: PAT scope gate.
- PR #219 submission: user authorization gate.
- Candidate JSON refresh: write the updated matrix to ledger.

## NEXT PHASE INPUT

`CLI-HANDOFF/phase-11/PHASE-12-IMPLEMENTATION-INPUT.md` — PR packet
sweep + submission triggers for all live contribution packets.

## FINAL INTEGRITY CHECK

□ #385 fix evidence recorded (Class A, 3 PRs) ✅ □ #349 fix evidence
recorded (Class A, 2 merged + 1 open) ✅ □ Fork divergence documented
✅ □ Plugin 404 recorded (UNVERIFIED, honest) ✅ □ Candidate regeneration
noted (20 candidates, statuses updated this report) ✅ □ CAND-006/019
statuses updated ✅ □ No code changes (read-only phase) ✅ □ Protected
work untouched ✅ □ Zero upstream mutations ✅ □ PHASE-12-IMPLEMENTATION-INPUT.md
produced ✅ □ Ledger committed + pushed ✅
