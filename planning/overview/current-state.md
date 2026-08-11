# Current State (verified 2026-08-10, final phase)

> ⚠️ **SUPERSEDED IN PART (2026-08-11).** This snapshot is from 2026-08-10 and
> predates the remap push/PR and the upstream fixes. For the current picture
> see `../state/phase-7-upstream-reconciliation-2026-08-11.md`. Key deltas:
> remap branch is now `1497596` and PR **#393 is open** (was "ready, not
> pushed"); F-008/F-009 resolved upstream (#391/#390 merged); fork/main needs
> re-sync (behind upstream since v0.9.2); local Ix `main` behind 12. The
> snapshot below is preserved as a historical record.

Live re-verification performed during PHASE FINAL — not carried over from older
reports. Commands: `git remote -v`, `git rev-parse`, `git rev-list --left-right --count`,
`git status --porcelain`, `git worktree list`.

## Repositories

| Repo | Local | Branch | HEAD | Working tree | Remote |
|---|---|---|---|---|---|
| ix-infrastructure/Ix | `<IX_REPO>` (primary worktree) | `feat/ix-agent-skill` | `b038c46` | 13 modified/deleted/untracked files (overhaul, **preserved**) | origin (upstream) + fork (Alot1z/Ix) |
| ix-infrastructure/Ix | `<IX_REMAP_WORKTREE>` (linked worktree) | `feat/ix-remap-hardening` | `c021b52` | Clean | same |
| ix-infrastructure/Ix | `<IX_REPO>` | `main` | `c4f8fea` | — (branch pointer only) | origin |
| Alot1z/Ix | remote ref `fork/*` | `fork/main` | `0437abf` | — | fork |
| ix-infrastructure/ix-compass-dist | `<COMPASS_DIST_REPO>` | `main` | `396426b` | Clean + untracked v0.3.0 tarball/dir | origin |
| ix-infrastructure/system-compass | none | — | — | — | **PRIVATE (404)** |
| Ix-findings | `<IX_FINDINGS>` | `master` | no commits yet | all files untracked | none |

## Branch divergence (live numbers)

| Comparison | Ahead | Behind |
|---|---|---|
| local `main` vs `origin/main` | 0 | 0 |
| `fork/main` vs `origin/main` | 0 | **5** |
| `feat/ix-remap-hardening` vs `origin/main` | **1** | 0 |

Fork's `feat/ix-agent-skill` (`0c9087c`) is 1 commit ahead of local `b038c46` —
a cleanup commit ("scope the PR to the skill and docs; drop the Compass
monkey-patch") that exists on the fork but was never pulled locally.

## Worktrees

```
<IX_REPO>/.git (shared)  →  <IX_REPO>        → feat/ix-agent-skill @ b038c46  [13 uncommitted files]
                        → <IX_REMAP_WORKTREE> → feat/ix-remap-hardening @ c021b52 [clean, PR-ready]
<COMPASS_DIST_REPO>/.git → <COMPASS_DIST_REPO> → main @ 396426b [clean + untracked v0.3.0 artifacts]
```

## PR/issue readiness

| Item | Ready | Blocked by |
|---|---|---|
| Remap PR (branch `feat/ix-remap-hardening`) | ✅ branch+tests+docs | Authorization (D-009) |
| #376 fix packet | ✅ packet | Authorization + maintainer direction |
| #371 decision packet | ✅ packet | Maintainer decision (OSS vs Pro) |
| Compass F-key PR | ⚠️ full spec | system-compass source access |
| Compass delayed-data | ⚠️ investigation | system-compass source access |

## What is deliberately NOT done

- Nothing pushed; no PRs opened; no reviews requested; nothing merged/released.
- `fork/main` not pushed (stays 5 behind) — sync deferred until remap push (D-009).
- The 13 uncommitted overhaul files on `feat/ix-agent-skill` are untouched.
- `ix-compass-dist` artifacts untouched.
- No attempt to fabricate access to `system-compass`.
