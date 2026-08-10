# Phase 0 — Full Local/GitHub State Audit

**Generated**: 2026-08-10
**Scope**: Ix / Compass ecosystem only
**Paths sanitized**: Yes — `<IX_REPO>`, `<IX_REMAP>`, `<COMPASS_DIST_REPO>`, `<IX_FINDINGS>` used

---

## 1. Repository Inventory

| # | Directory | Exists | Git Repo | Type | Primary Remote |
|---|-----------|--------|----------|------|---------------|
| 1 | `<IX_REPO>` | ✓ | ✓ | Primary worktree (shared `.git`) | `origin` = ix-infrastructure/Ix |
| 2 | `<IX_REMAP>` | ✓ | ✓ | Linked worktree (same repo as #1) | same as #1 |
| 3 | `<COMPASS_DIST_REPO>` | ✓ | ✓ | Standalone clone | `origin` = ix-infrastructure/ix-compass-dist |
| 4 | `<IX_FINDINGS>` | ✓ | ✗ | Non-Git directory (investigation workspace) | — |
| 5 | system-compass (any path) | ✗ | — | — | — |

**system-compass**: No local checkout exists anywhere under `<REPO_ROOT>`. The GitHub repository (https://github.com/ix-infrastructure/system-compass) returns 404 — it is private.

---

## 2. Fork / Upstream Map

### ix-infrastructure/Ix

```
                    ix-infrastructure/Ix  (origin)
                    main: c4f8fea (HEAD)
                         │
                         │ 5 commits ahead
                         ▼
                    Alot1z/Ix  (fork)
                    main: 0437abf
                         │
                         │ 5 commits ahead
                         ▼
                    LOCAL main: 01308e6  ← STALE (10 behind origin)
```

**Fork sync status**: fork/main is 5 commits behind origin/main and 5 commits ahead of local main.

**Remote configuration**:
- `origin` → https://github.com/ix-infrastructure/Ix (upstream)
- `fork` → https://github.com/Alot1z/Ix (user fork)

### ix-infrastructure/ix-compass-dist

```
                    ix-infrastructure/ix-compass-dist  (origin)
                    main: 396426b (HEAD)
                         │
                         │ in sync (same commit)
                         ▼
                    LOCAL main: 396426b
```

No fork. Single remote. Clean.

---

## 3. Worktree Map

### Shared Repository: ix-infrastructure/Ix

```
E:/E-github-repos/Ix/.git  ← shared git directory
    │
    ├── E:/E-github-repos/Ix         → feat/ix-agent-skill  @ b038c46  [primary]
    └── E:/E-github-repos/Ix/.git/worktrees/Ix-remap
         └── E:/E-github-repos/Ix-remap  → feat/ix-remap-hardening  @ c021b52  [linked]
```

### Standalone Repository: ix-infrastructure/ix-compass-dist

```
E:/E-github-repos/ix-compass-dist/.git  ← standalone git directory
    └── E:/E-github-repos/ix-compass-dist  → main  @ 396426b  [primary]
```

No additional worktrees.

---

## 4. Branch Map

### Ix (shared repo)

| Branch | Worktree | Commit | Tracking | Ahead/Behind vs origin/main | Status |
|--------|----------|--------|----------|-----------------------------|--------|
| `main` | (none) | `01308e6` | `origin/main` | **10 behind** | STALE — needs sync |
| `feat/ix-agent-skill` | `<IX_REPO>` | `b038c46` | (none) | 10 behind, 1 ahead | UNCOMMITTED OVERHAUL |
| `feat/ix-remap-hardening` | `<IX_REMAP>` | `c021b52` | `origin/main` | 0 behind, 1 ahead | CLEAN, PR-ready |
| `freebuff/first-…216fcb07` | (none) | `01308e6` | (none) | — | Freebuff auto-branch |
| `freebuff/first-…3167fb4d` | (none) | `01308e6` | (none) | — | Freebuff auto-branch |

### ix-compass-dist

| Branch | Worktree | Commit | Tracking | Status |
|--------|----------|--------|----------|--------|
| `main` | `<COMPASS_DIST_REPO>` | `396426b` | `origin/main` | CLEAN |

---

## 5. Divergence Map (Commit-Level Detail)

### Ix main chain (most recent first)

```
c4f8fea  origin/main  ← chore(deps-dev): bump dev-dependencies (#369)
f2803e8               ← chore(deps): bump actions group (#370)
e6a1d7f               ← refactor(stale): drop stale client (#363)
2157158               ← feat(skill): ship ix agent skill (#368)
9b70bd9               ← brew: update formula for v0.9.1 (#367)
--- fork/main @ 0437abf ---
0437abf  fork/main    ← fix(upgrade): pair tar binary (#366)
dcc0962               ← fix(release): stamp bundled compass (#365)
3c49cc2               ← fix(cli): stop drawing progress frames (#359)
87cd9c0               ← fix(view): report visualizer port (#358)
ebeee6c               ← fix(status): keep staleness scoped (#356)
--- local main @ 01308e6 ---
01308e6  local main   ← fix(ingest): stop DEP0151 warnings (#348)
4258d9f               ← fix(map): fail loudly on patch failures (#347)
0b4caf9               ← fix(windows): install Compass (#346)
47b11f7               ← fix(release): stop make_latest (#343)
04d23b1               ← fix(upgrade): compare prerelease (#344)
```

### feat/ix-agent-skill chain

```
b038c46  LOCAL feat/ix-agent-skill  ← feat(skill): ship ix agent skill with Compass patch, API docs, and upstream port
01308e6                              ← fix(ingest): stop DEP0151 (#348)
...

0c9087c  FORK feat/ix-agent-skill   ← fix(skill): scope PR to skill and docs; drop Compass monkey-patch
b038c46                              ← feat(skill): ship ix agent skill...
01308e6                              ← fix(ingest): stop DEP0151 (#348)
```

**CRITICAL FINDING**: The fork has an ADDITIONAL commit (`0c9087c`) on `feat/ix-agent-skill` that the local branch does NOT have. The fork commit message says "scope the PR to the skill and docs; drop the Compass monkey-patch." This means someone (or another agent) pushed a clean-up commit to the fork that the local worktree hasn't pulled.

### feat/ix-remap-hardening chain

```
c021b52  feat/ix-remap-hardening  ← feat(view): real /__ix/remap endpoint with loopback guard; fix WSL bootstrap
c4f8fea  origin/main              ← chore(deps-dev): bump dev-dependencies (#369)
f2803e8                           ← chore(deps): bump actions group (#370)
e6a1d7f                           ← refactor(stale): drop stale client (#363)
2157158                           ← feat(skill): ship ix agent skill (#368)
9b70bd9                           ← brew: update formula (#367)
0437abf                           ← fix(upgrade): pair tar binary (#366)
...
```

The remap branch is based on origin/main (`c4f8fea`), not the stale local main. It is correctly positioned for a clean PR.

---

## 6. Local Change Map

### Ix Primary Worktree (`feat/ix-agent-skill`)

**Uncommitted changes — DO NOT DISCARD:**

| Status | File | Nature |
|--------|------|--------|
| M (unstaged) | `CLAUDE.md` | Minor edit (+3/-1) |
| M (unstaged) | `docs/api/README.md` | Minor edit (+5/-1) |
| M (unstaged) | `skills/ix/scripts/bootstrap.ps1` | Minor edit (+2/-1) |
| M (unstaged) | `skills/ix/scripts/bootstrap.sh` | Significant edit (+29/-??) |
| M (unstaged) | `skills/ix/scripts/compass-patch/apply.sh` | Significant edit (+39/-??) |
| M (unstaged) | `skills/ix/scripts/compass-patch/fit-view.js` | Significant edit (+25/-??) |
| D (unstaged) | `upstream/compass-fit-view/README.md` | Deleted (107 lines) |
| D (unstaged) | `upstream/compass-fit-view/src/FitViewHint.tsx` | Deleted (323 lines) |
| D (unstaged) | `upstream/compass-fit-view/src/KeyboardHelp.tsx` | Deleted (26 lines) |
| D (unstaged) | `upstream/compass-fit-view/src/camera.ts` | Deleted (145 lines) |
| D (unstaged) | `upstream/compass-fit-view/src/useCameraFit.ts` | Deleted (122 lines) |
| ?? (untracked) | `skills/ix/scripts/compass-patch/README.md` | New file |
| ?? (untracked) | `tasks/` (5 files) | Plan/todo/investigation notes |

**Total diff**: 83 insertions, 743 deletions across 11 files.
**Nature**: Removing the upstream Compass fit-view port, consolidating into compass-patch, adding investigation task tracking.

**This is the fork's `0c9087c` equivalent work but done locally and uncommitted.** The fork already has a cleaner version of this.

### Ix-remap Worktree (`feat/ix-remap-hardening`)

**CLEAN** — no uncommitted changes, no staged changes, no untracked files.

### ix-compass-dist

**Untracked only:**
- `compass-0.3.0.tar.gz` (610 KB) — downloaded release artifact
- `compass-0.3.0.tar.gz.sha256` — SHA256 verification file
- `compass-0.3.0/` — extracted artifact directory

Working tree otherwise clean.

---

## 7. GitHub Relationship Map

### ix-infrastructure/Ix

| Property | Value |
|----------|-------|
| GitHub URL | https://github.com/ix-infrastructure/Ix |
| Visibility | Public |
| Default branch | `main` |
| Fork owner | Alot1z (https://github.com/Alot1z/Ix) |
| Local fork/main | `0437abf` (5 behind origin/main) |
| Open issues | 11 (verified via page scrape) |
| Open PRs | 8 (verified via page scrape) |

**Known maintainers/contributors:**

| Username | Role | Evidence |
|----------|------|----------|
| **KageBinary** | Collaborator | Open PRs: #373, #372, #362, #352; issues: #371, #376; released Compass v0.3.0 |
| **Hiro-Chiba** | Contributor | Open PRs: #382, #380, #378, #375; issues: #381, #379, #374 |
| **TannerTorrey3** | (historic) | Released Compass v0.1.0–v0.2.0 |
| **RMA1313** | Community | Issues: #351, #350, #349 |
| **tept-creator** | Community | Issue: #383 |

### ix-infrastructure/ix-compass-dist

| Property | Value |
|----------|-------|
| GitHub URL | https://github.com/ix-infrastructure/ix-compass-dist |
| Visibility | Public |
| Description | "Distribution channel for Ix System Compass releases" |
| Purpose | Release artifacts published by system-compass CI |
| Contents | README.md only (no source code) |
| Tags | v0.1.0, v0.1.1, v0.2.0, v0.3.0 |
| Stars | 2 |
| Forks | 0 |

### ix-infrastructure/system-compass

| Property | Value |
|----------|-------|
| GitHub URL | https://github.com/ix-infrastructure/system-compass |
| Visibility | **PRIVATE** (404) |
| Local checkout | **None** |
| Source access | **UNAVAILABLE** |

---

## 8. Blockers

| # | Blocker | Severity | Resolution |
|---|---------|----------|------------|
| 1 | Ix `main` 10 commits behind origin/main | **HIGH** | `git fetch origin && git checkout main && git merge origin/main` (fast-forward) |
| 2 | `feat/ix-agent-skill` fork has newer commit (`0c9087c`) not in local | **HIGH** | Need to decide: pull fork commit or keep local overhaul |
| 3 | `feat/ix-agent-skill` local has uncommitted overhaul | **HIGH** | Must not be discarded; commit or stash before any branch switch |
| 4 | system-compass source unavailable | **PERMANENT** | Cannot implement F-key or investigate delayed-data root cause |
| 5 | No push/PR authorization | **GATE** | User must explicitly authorize before any remote action |
| 6 | Ix-findings is not a Git repository | **MEDIUM** | Decision needed: initialize as repo? Connect to GitHub? |

---

## 9. Contradictions Discovered

| # | What Was Assumed | What Was Found |
|---|-----------------|----------------|
| 1 | "main is behind by 10 commits but feat/ix-remap-hardening is based on main" | Remap branch is based on `origin/main` (`c4f8fea`), NOT local main. It's correctly positioned. |
| 2 | "feat/ix-agent-skill b038c46 is the latest" | Fork has `0c9087c` which is 1 commit newer on the same branch — a clean-up that drops the Compass monkey-patch |
| 3 | "Ix-findings might be a repo" | It is not initialized as a Git repository |
| 4 | "ix-compass-dist might contain source" | Contains only README.md + downloaded release artifacts; purely a distribution channel |
| 5 | "The overhaul deletes compass-fit-view code" | Confirmed — 743 lines deleted from upstream/compass-fit-view/, changes folded into compass-patch/ |

---

## 10. Recommended Next Actions

### Immediate (safe, local)

1. **Sync local main**: `git checkout main && git merge origin/main` (fast-forward, no conflicts expected)
2. **Pull fork commits**: `git fetch fork && git log fork/feat/ix-agent-skill..feat/ix-agent-skill` to understand the gap
3. **Preserve overhaul**: Either commit the uncommitted changes on feat/ix-agent-skill, or stash them with a descriptive name
4. **Reconcile feat/ix-agent-skill**: Decide whether to rebase on the fork's `0c9087c` or keep local changes

### Before Any Push

5. **Decide on Ix-findings**: Initialize as Git repo? Connect to a new GitHub repository?
6. **Resolve feat/ix-agent-skill vs fork divergence** before any push
7. **Re-verify remap branch** after main sync (merge-base may shift if main fast-forwards)

### Requires Authorization

8. Push `feat/ix-remap-hardening` to fork
9. Open PR from fork to ix-infrastructure/Ix
10. Tag @KageBinary as reviewer
