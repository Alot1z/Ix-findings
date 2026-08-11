# Phase 7 — Upstream Reconciliation Audit (2026-08-11)

**Date:** 2026-08-11
**Trigger:** User requested a re-analysis of current + past issues and an audit
of the findings/plans — "is any of it actually good now, or just AI slop?"
**Method:** GitHub API (`gh`) re-verification of every tracked issue/PR against
live repo state, cross-checked with local git state (Ix, Ix-remap, Ix-test,
ix-compass-dist, Ix-findings).
**Status of this file:** living record of the 2026-08-11 reconciliation. It does
not rewrite historical phase snapshots (per ledger rule 1).

---

## Verdict

**The investigation was not slop. It was high-quality analysis that the
maintainers independently confirmed and acted on within ~24 hours.** The ledger
is stale on *statuses* (frozen 2026-08-10), not on *substance*. This file
records what changed upstream and the status corrections applied to the living
layer (`planning/findings/registry.md`, `manifests/findings-index.json`,
`README.md`, `planning/final/NEXT-ACTIONS.md`, `CLI-HANDOFF/PR-MATRIX.md`,
`CLI-HANDOFF/STALE-CLAIMS.md` S-042+).

## Evidence that the work was real (not slop)

| Ledger item | Ledger status (2026-08-10) | Upstream action (verified 2026-08-11) | Why this is validation |
|---|---|---|---|
| F-008 / Ix#376 | OPEN, no fix | **PR #391 (KageBinary) MERGED** — `release.yml` now stamps `compass/.version` with `$VERSION+release.<sha>`; the CLI skips the version comparison entirely for release bundles | The #391 comments describe the exact failure scenario from this investigation ("the first dist tag above the running Ix version would have replaced this newer bundle with an older dist build — Ix#376"). The shipped fix is a superset of the ledger's Option C (identity marker), better than Option A. |
| F-009 / Ix#371 | OPEN | **PR #390 (KageBinary) MERGED** — `patches` registered in `oss.ts`, removed from `PRO_COMMANDS` | This is exactly the ledger's Option 1 (OSS path). Issue closed as completed 2026-08-11T03:17Z. |
| F-010/F-011/F-012 | PR_READY, not pushed / IN_REMAP_PR | **PR #393 (Alot1z) OPEN** — 4 files +251/−10, 14/14 CI checks green, `mergeable: MERGEABLE`, blocked only on `REVIEW_REQUIRED` | PR head = local `feat/ix-remap-hardening` @ `1497596`. The branch was pushed and the PR opened on 2026-08-11 with user authorization (packet Phase 6). |
| PR #368 (agent skill) | in-flight | **MERGED** by KageBinary 2026-08-10T03:58Z — 12 files +2,482, head `2157158` | The origin of the whole investigation shipped. |

## Other upstream fixes (previously catalogued as open — now merged)

| Issue | Fixed by | Author | Merged |
|---|---|---|---|
| #374 cross-batch JS/TS calls | #375 | Hiro-Chiba | ✓ |
| #377 stale graph entities | #378 | Hiro-Chiba | ✓ |
| #379 `--kind` ambiguity | #380 | Hiro-Chiba | ✓ |
| #381 PHP receiver types | #382 | Hiro-Chiba | ✓ |
| view fs-race + 2 lockfile CVEs (security) | #389 | josephismikhail | ✓ |
| upgrade staging under `IX_HOME` not TEMP | #392 | KageBinary | ✓ |
| `ix.cmd` self-diagnosis (Windows) | #386 | KageBinary | ✓ |
| `goals` Pro stub | #384 | KageBinary | ✓ |
| release v0.9.2 | #387 | — | ✓ |
| CodeQL advanced setup | #394 | — | ✓ |
| `--format llm` for the five faked commands | #372 | KageBinary | ✓ |

> Note on #389: it closes a file-system race in `view.ts` + `ingest-baseline.ts`
> (CodeQL `js/file-system-race`) plus lockfile CVEs. It does **not** overlap the
> remap PR's hunks (verified: disjoint), and it does **not** add the loopback
> bind — the remap PR's `127.0.0.1` binding and Origin/Host guard remain
> distinct contributions. The ledger's open security follow-ups (P2 DEP0169 +
> localhost-advertising) were **not** covered by #389.

## Currently open (2026-08-11, API-verified)

| Item | Type | Author | Notes |
|---|---|---|---|
| **#393** remap hardening | PR | Alot1z | our PR — needs maintainer review; merge blocked on `REVIEW_REQUIRED` |
| #395 test: IX_HOME with a space | PR | KageBinary | pairs with #392's staging change; related to #349 |
| #388 brew formula v0.9.2 | PR | github-actions[bot] | bot PR for release 0.9.2 |
| #385 `ix upgrade` breaks Windows CLI 0.8.1→0.9.1 | issue | RMA1313 | KageBinary: forward path complete on main (#386/#392); issue still open, awaiting reporter confirmation |
| #383 Codex hooks + CLI subprocess fail on native Windows | issue | tept-creator | open; two independent causes per report |
| #349 Windows installer — path with spaces | issue | RMA1313 | #352 fixed the 8.3 short-TEMP variant; the spaces-in-profile case remains open |
| #219 add `ix mcp` subcommand | issue | josephismikhail | maintainer feature request; natural fit with the ix agent skill (#368) and the skill-router MCP work |

## What this means for the ledger

1. **F-008 and F-009 are resolved upstream** — statuses corrected to
   RESOLVED_UPSTREAM with fix PR references; their analysis sections are
   retained as validated history (the fix commits cite the same reasoning).
2. **F-010/F-011/F-012 are in an open PR** — statuses corrected to PR_OPEN /
   IN_PR_393; the branch reference updated `c021b52` → `1497596`.
3. **Authorization gates in README.md** — remap: pushed ✅, PR opened ✅ (#393).
4. **Compass findings (F-001…F-007, F-013)** — unchanged: ix-compass-dist still
   at v0.3.0 (verified), source still private/404, so artifact-level analysis
   remains the current evidence. #391's own comment corroborates the ledger's
   Compass version-series observation ("system-compass's package.json version…
   read 0.2.0 while dist was on v0.3.0").
5. **Newly tracked items** — #385, #383, #349, #219, PR #395, PR #388, release
   v0.9.2. None are assigned findings (not investigated); they are catalogued.

## Remaining maintenance (see NEXT-ACTIONS update)

- Sync `fork/main` to upstream main (still behind — was `5488741` vs upstream
  `1292375` on 2026-08-11).
- Local `Ix` main is behind 12 commits; `feat/ix-agent-skill` still carries the
  6M+5D+3?? uncommitted Compass-patch overhaul (preserved, never pushed).
- Re-check P2 security follow-ups (DEP0169, localhost-advertising) — #389 did
  not address them.

*All statuses above verified live via GitHub API on 2026-08-11. No claims
fabricated.*
