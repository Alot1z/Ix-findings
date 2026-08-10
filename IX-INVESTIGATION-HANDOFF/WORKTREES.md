# WORKTREES.md — Complete Worktree Inventory

> **Generated:** 2026-08-10 (Freebuff CLI Master Execution Phase)
> **Source:** Live `git worktree list` + filesystem verification
> All SHAs are DESKTOP-OBSERVED.

---

## Worktree A — Primary Development (feat/ix-agent-skill)

| Property | Value |
|---|---|
| Path | `E:\E-github-repos\Ix` |
| Repository | ix-infrastructure/Ix |
| Branch | `feat/ix-agent-skill` |
| HEAD | `b038c46117c26e17ff7f3dc8edd4c4f5083f79f6` |
| Tracking | NONE |
| Dirty files | **14** (6 modified + 5 deleted + 3 untracked) |
| Purpose | User's ongoing agent-skill overhaul with Compass patch |
| Status | **ACTIVE** — PRESERVE ALL UNCOMMITTED WORK |

### Modified (6):
```
 M CLAUDE.md
 M docs/api/README.md
 M skills/ix/scripts/bootstrap.ps1
 M skills/ix/scripts/bootstrap.sh
 M skills/ix/scripts/compass-patch/apply.sh
 M skills/ix/scripts/compass-patch/fit-view.js
```

### Deleted (5):
```
 D upstream/compass-fit-view/README.md
 D upstream/compass-fit-view/src/FitViewHint.tsx
 D upstream/compass-fit-view/src/KeyboardHelp.tsx
 D upstream/compass-fit-view/src/camera.ts
 D upstream/compass-fit-view/src/useCameraFit.ts
```

### Untracked (3):
```
 ?? .wiki-preview-tmp/
 ?? skills/ix/scripts/compass-patch/README.md
 ?? tasks/
```

---

## Worktree B — Remap Hardening (feat/ix-remap-hardening)

| Property | Value |
|---|---|
| Path | `E:\E-github-repos\Ix-remap` |
| Repository | ix-infrastructure/Ix |
| Branch | `feat/ix-remap-hardening` |
| HEAD | `c021b52358d019378620195eaf1b76c94dcd43c1` |
| Base | `origin/main` |
| Ahead | **1 commit** |
| Dirty | **0 files (CLEAN)** |
| Purpose | PR-ready remap hardening (loopback guard + WSL fix + dead code removal) |
| Status | **PR-READY** — not yet pushed to fork |

### Files changed (+251/-10):
```
 docs/api/README.md              |  16 +++-
 ix-cli/src/cli/commands/view.ts |  58 ++++++++++++-
 ix-cli/test/view-server.test.ts | 178 ++++++++++++++++++++++++++++++++++++++++
 skills/ix/scripts/bootstrap.sh  |   9 +-
```

---

## Worktree C — Clean Test (origin/main)

| Property | Value |
|---|---|
| Path | `E:\E-github-repos\Ix-test` |
| Repository | ix-infrastructure/Ix |
| Branch | (detached HEAD) |
| HEAD | `c4f8fea3916c87e83167bdfaaee945159f64ad0f` |
| Base | `origin/main` |
| Dirty | **0 files (CLEAN)** |
| Dependencies | Installed (ix-cli: 169 pkgs, core-ingestion: all tree-sitter) |
| Purpose | Clean upstream test environment |
| Status | **READY** — tests passing |

### Test Results (fresh, 2026-08-10):
```
Vitest:  49 passed, 1 skipped (50 files)
Tests:   646 passed, 2 skipped (648 total)
Smoke:   parser smoke test passed
TSC:     clean (no errors)
ESLint:  0 errors, 38 warnings
```

---

## Worktree D — system-compass (DOES NOT EXIST)

| Property | Value |
|---|---|
| Path | NONE |
| Fork | NONE — `Alot1z/system-compass` returns 404 |
| Upstream | NONE — `ix-infrastructure/system-compass` returns 404 (private) |
| Status | **BLOCKED** — requires fork creation + source access (D-014) |

---

## Other Repositories (not worktrees)

### ix-compass-dist

| Property | Value |
|---|---|
| Path | `E:\E-github-repos\ix-compass-dist` |
| Branch | `main` |
| HEAD | `396426b2a08e689a969f30489aa76dedea325c28` |
| Dirty | Clean + untracked v0.3.0 tarball + extraction |
| Tags | v0.1.0, v0.1.1, v0.2.0, v0.3.0 |
| Purpose | Distribution channel — DO NOT MODIFY |
| Status | **READ-ONLY** |

### Ix-findings

| Property | Value |
|---|---|
| Path | `E:\E-github-repos\Ix-findings` |
| Branch | `master` |
| Commits | **0** |
| Untracked | **165 files** (17 top-level directories) |
| Remotes | NONE |
| Purpose | Investigation ledger |
| Status | **ACTIVE** — all files untracked |

---

## Worktree Operations Log

| Date | Operation | Result |
|---|---|---|
| 2026-08-10 | Created `Ix-test` from `origin/main` (`c4f8fea`) | Success — detached HEAD |
| 2026-08-10 | `npm ci` in `Ix-test/ix-cli` | Success — 169 packages |
| 2026-08-10 | `npm ci` in `Ix-test/core-ingestion` | Success — all tree-sitter deps |
| 2026-08-10 | `npm test` in `Ix-test/ix-cli` | Success — 646/648 passed |
| 2026-08-10 | `npx tsc --noEmit` in `Ix-test/ix-cli` | Success — clean |
| 2026-08-10 | `npx eslint src` in `Ix-test/ix-cli` | Success — 0 errors |

---

## Safety Rules

- **Worktree A** (primary): NEVER reset, clean, or checkout-over. 14 uncommitted changes are user's active work.
- **Worktree B** (remap): Clean, PR-ready. Safe to push to fork when authorized.
- **Worktree C** (test): Disposable. Can be recreated from origin/main at any time.
- **Worktree D** (system-compass): Does not exist. Must be created from scratch.
- **ix-compass-dist**: NEVER modify. Distribution channel only.
- **Ix-findings**: No commits yet. SAFE to commit at any time.
