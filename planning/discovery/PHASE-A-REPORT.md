# Phase A — Canonical Snapshot Reconciliation and Identity Baseline

Status: **RECONCILED_WORKTREE_PENDING_COMMIT**

Generated: **2026-08-11** (day precision; the existing builder hard-codes this date)

## Authoritative worktree snapshot

- Entities: **570**
- Relationships: **1008**
- Raw-source metric: **346**
- Public entities: **570**
- Public graph: **570 entities / 1008 relationships**
- Public routes: **584**
- Source revision: **1292375548fb8f4431ac5afc34c68fe2573434d1**

The `knowledge/manifest.json` count of **549/931** is stale metadata. The committed graph is **569/1007**. The current generated graph and derived projections are **570/1008**. The worktree delta is one source entity (`SRC-cfa3eba511fc`) and one `PART_OF` relationship (`REL-c8497482887e`) for `planning/wiki/assets/entity-view.js`.

The current 570/1008 output is selected as authoritative for this Phase-A snapshot. It is still **uncommitted** because the checkout contains protected dirty changes; no existing work was staged, overwritten, cleaned, or committed.

## GitHub identity

The supplied token was used only for read-only identity verification. It authenticates as **Alot1z** (numeric ID `16801672`). GitHub currently resolves the legacy `Alot1z/Ix` name to the canonical fork **Alot1z/Ix-remap**. Historical commits are not rewritten in Phase A.

## Repository and local identity

See the machine-readable manifests beside this report. Exact absolute paths are stored only in `PATH-MANIFEST.json` and the internal link manifest. Public manifests contain URLs only.

| Repository | Role | Local paths |
|---|---|---|
| `ix-infrastructure/Ix` | upstream | `Ix`, `Ix-mcp`, `Ix-remap`, `Ix-test` via verified remotes/worktrees |
| `Alot1z/Ix-remap` | user fork | `Ix`, `Ix-mcp`, `Ix-remap`, `Ix-test` |
| `Alot1z/Ix-findings` | knowledge ledger | `Ix-findings` |
| `ix-infrastructure/ix-compass-dist` | distribution | `ix-compass-dist` |

## Dirty/divergence safety findings

- `Ix-findings`: 617 dirty paths; `master` is `0 ahead / 0 behind` its upstream.
- `Ix-remap`: 2 untracked paths (`cd`, `git`); `feat/ix-remap-hardening` is `1 ahead / 4 behind` its configured upstream.
- `Ix`: 18 dirty paths on `feat/ix-agent-skill`; no configured upstream for the current branch.
- `Ix-mcp`: clean local status on `feat/ix-mcp`.
- `Ix-test`: clean detached worktree.
- `ix-compass-dist`: 3 untracked distribution artifacts; `main` is `0 ahead / 0 behind`.

These dirty states are preserved and must be reviewed before any commit or remote operation.

## Link and freshness status

- Repository identity/API checks: verified.
- Broken repository links found in the Phase-A checks: none.
- Complete production HTTP audit: not re-run in this Phase-A pass.
- `system-compass`: `UNKNOWN / ACCESS BLOCKED`.
- Public artifacts remain derived snapshots, not live GitHub truth.
- Live freshness gate: **STALE**, 6 checks; live upstream `fa6ad7b0ff52734685ff7425b08ec240837751fa` differs from canonical `1292375548fb8f4431ac5afc34c68fe2573434d1`; publication is blocked.

## Account versus commit authorship

GitHub authentication and Git commit identity are separate. The token identifies the account used for API/push authorization. It does not rewrite historical commits. Current `Ix-findings` history uses author/committer name `Alot1z` with the placeholder email `your-github-email@example.com`; `Ix-remap` contains many upstream authors plus 16 commits with that placeholder identity. Rewriting all historical commits would change SHAs and require explicit, separately approved history-rewrite and force-push operations.

## Next phase

Stop after Phase A. Phase B may begin only after this report, the 570/1008 selection, the dirty-worktree boundaries, and the separate commit-identity policy are explicitly reviewed.
