# Next Actions — Prioritized Matrix

> All actions are local-safety-reviewed. Any action requiring authorization is
> marked. "Safe to execute now?" = no authorization or destructive risk.
>
> **Updated 2026-08-11 (upstream reconciliation):** items 5/6 are DONE (PR #393
> open, CI green); items 8/9 were done upstream by the maintainers (#391, #390
> merged). See `state/phase-7-upstream-reconciliation-2026-08-11.md`.

## NOW (local, safe, no authorization)

| # | Action | Repo | Reason | Evidence | Owner/Reviewer |
|---|---|---|---|---|---|
| 1 | Decide D-011…D-014 (Compass PR scope, chip, stopgap, access path) | all | unblocks the Compass thread | findings F-001…F-007 | user |
| 2 | Decide D-010 (port prep location) | system-compass prep | unblocks port build-out | D-010 | user |
| 3 | Commit the latest ledger updates (2026-08-11 reconciliation) | Ix-findings | durable record; S-015 | — | user |
| 4 | (done — `Alot1z/Ix-findings` exists, origin/master tracked) | Ix-findings | shareable ledger | D-008 | ✅ done |

## NEXT (safe to prepare now; execute on authorization)

| # | Action | Repo | Reason | Evidence | Safe now? | Authorization? |
|---|---|---|---|---|---|---|
| 5 | ~~Push `feat/ix-remap-hardening` → fork~~ | Alot1z/Ix | ✅ DONE — pushed @ `1497596` 2026-08-11 | E-014…E-016 | — | done |
| 6 | ~~Open remap PR → upstream main~~ | ix-infrastructure/Ix | ✅ DONE — **#393 open**, 14/14 CI green, blocked on review only | packet | — | done |
| 7 | After remap merges: sync fork/main (`git push fork main`) | Alot1z/Ix | still behind upstream (`5488741` vs `1292375`) — re-fetch + sync | E-019 | no | **YES** |
| 8 | ~~Prepare + open #376 fix PR (Option A)~~ | ix-infrastructure/Ix | ✅ DONE UPSTREAM — **#391 merged** (marker-based skip; supersedes Option A) | E-017 | — | done by KageBinary |
| 9 | ~~Raise #371 decision (OSS vs Pro)~~ | ix-infrastructure/Ix | ✅ DONE UPSTREAM — **#390 merged**, OSS path chosen, #371 closed | E-018 | — | done by KageBinary |

## BLOCKED (source access)

| # | Action | Repo | Reason | Evidence | Blocker | Owner/Reviewer |
|---|---|---|---|---|---|---|
| 10 | Implement F-key PR from spec | system-compass | F-001…F-005 | E-005…E-008, E-010, E-025 | source access (D-014) | KageBinary |
| 11 | File + fix delayed-data (F-006/F-007) | system-compass | reproducible blank | E-009, E-012 | source access | KageBinary |

## NEWLY TRACKED (catalogued 2026-08-11 — not investigated)

| # | Item | Type | Notes |
|---|---|---|---|
| 16 | **#385** `ix upgrade` breaks Windows CLI 0.8.1→0.9.1 | issue (RMA1313) | KageBinary: forward path complete on main (#386/#392); awaiting reporter confirm |
| 17 | **#383** Codex hooks + CLI subprocess fail on native Windows | issue (tept-creator) | open; two independent causes per report |
| 18 | **#349** Windows installer — path with spaces | issue (RMA1313) | #352 fixed 8.3 short-TEMP variant only; spaces case open (#395 tests IX_HOME space) |
| 19 | **#219** add `ix mcp` subcommand | issue (josephismikhail) | **IMPLEMENTED on fork** `feat/ix-mcp` @ `863b3fd` (Phase 8, 2026-08-11); PR packet at `pr-packets/ix-mcp/` — submission gated on user authorization |
| 21 | **CAND-020** — `ix_mcp` remap write tool | follow-up | add once PR #393 merges (`/__ix/remap` on main); tracked in `planning/ix/ix-mcp.md` |
| 20 | **#388** brew formula v0.9.2 (bot PR) + release v0.9.2 (#387) | PR/release | tracking only |

## OPTIONAL (worth doing when time allows)

| # | Action | Reason | Evidence |
|---|---|---|---|
| 12 | Re-verify zoom ×1.1 vs ×1.25 with a dedicated experiment | F-013 | E-011 |
| 13 | Add no-map chip with feature-detect after remap merges | S-020, D-012 | E-014 |
| 14 | Follow-up: DEP0169 + localhost-advertising (P2 security) — **not** covered by #389 | hardening | security audit |
| 15 | Investigate system-compass #58/#59 | completeness | E-008 |

## DO NOT DO

| Action | Why |
|---|---|
| `git reset --hard` / force-push any fork branch | destroys the 13-file overhaul / risks work (S-029) |
| Push anything without explicit authorization | D-009 |
| Modify ix-compass-dist artifacts | distribution channel (D-007) |
| Fabricate system-compass source or PR numbers | integrity rule |
| Share `<IX_REPO>/tasks/*.md` unsanitized | contains drive paths (privacy) |
| Mix Compass UI changes into the Ix PR | S-006/S-024 |