# GIT-STATE.md — Verified Git State (2026-08-10)

> ⚠️ **RE-VERIFIED 2026-08-11 (local + GitHub API).** The snapshot below is
> preserved as history; the values marked **CURRENT** supersede it:
>
> - **Ix-remap worktree** — `feat/ix-remap-hardening` now @ `1497596` (was
>   `c021b52`), ahead 1, clean, **PUSHED**; **PR #393 open** (2026-08-11).
> - **Fork (Alot1z/Ix)** — `fork/feat/ix-remap-hardening` pushed @ `1497596`
>   (was NONE); `fork/main` @ `5488741`, **behind upstream** (upstream main
>   `1292375`) — re-sync pending. `fork/feat/ix-agent-skill` `0c9087c` (PR #368
>   head, merged).
> - **Ix primary** — `feat/ix-agent-skill` @ `b038c46`, uncommitted overhaul
>   unchanged (6M + 5D + 3??); local `main` `c4f8fea` now **12 behind**
>   `origin/main`.
> - **Ix-findings** — `master` has commits now (HEAD `9b4859c` 2026-08-11),
>   pushed to `Alot1z/Ix-findings` (public).
> - Upstream merged since snapshot: #389 (security), **#390 (patches, F-009)**,
>   **#391 (version series, F-008)**, #392 (IX_HOME staging), #386, #384, #394.
>
> Full record: `../state/phase-7-upstream-reconciliation-2026-08-11.md`.

> ALL values below are DESKTOP-OBSERVED (2026-08-10). Freebuff CLI MUST REVALIDATE independently.
> No destructive operations authorized. Preserve uncommitted work.

---

## Ix — Primary Worktree (E:\E-github-repos\Ix)

| Property | Value | Status |
|---|---|---|
| Active branch | `feat/ix-agent-skill` | DESKTOP-OBSERVED |
| HEAD commit | `b038c46` | DESKTOP-OBSERVED |
| HEAD message | `feat(skill): ship the ix agent skill with Compass patch, API docs, and upstream port` | DESKTOP-OBSERVED |
| Tracking branch | NONE (not tracking any remote) | DESKTOP-OBSERVED |
| `main` branch | `c4f8fea` | DESKTOP-OBSERVED |
| `main` tracking | `origin/main` @ `c4f8fea` (synchronized) | DESKTOP-OBSERVED |
| `feat/ix-remap-hardening` | `c021b52` | DESKTOP-OBSERVED |
| `feat/ix-remap-hardening` base | `origin/main` — ahead by 1 commit | DESKTOP-OBSERVED |
| Origin remote | `origin` → https://github.com/ix-infrastructure/Ix | DESKTOP-OBSERVED |
| Fork remote | `fork` → https://github.com/Alot1z/Ix | DESKTOP-OBSERVED |

### Working Tree Changes (feat/ix-agent-skill)

**MODIFIED (6 files):**
```
 M CLAUDE.md
 M docs/api/README.md
 M skills/ix/scripts/bootstrap.ps1
 M skills/ix/scripts/bootstrap.sh
 M skills/ix/scripts/compass-patch/apply.sh
 M skills/ix/scripts/compass-patch/fit-view.js
```

**DELETED (5 files):**
```
 D upstream/compass-fit-view/README.md
 D upstream/compass-fit-view/src/FitViewHint.tsx
 D upstream/compass-fit-view/src/KeyboardHelp.tsx
 D upstream/compass-fit-view/src/camera.ts
 D upstream/compass-fit-view/src/useCameraFit.ts
```

**UNTRACKED (3 entries):**
```
 ?? .wiki-preview-tmp/
 ?? skills/ix/scripts/compass-patch/README.md
 ?? tasks/
```

**Total: 14 uncommitted changes (6M + 5D + 3??)**

> CRITICAL: These changes represent the user's ongoing `feat/ix-agent-skill` overhaul.
> DO NOT reset, clean, checkout, stash-pop, or otherwise modify the worktree.
> This IS the user's work. It STAYS.

### Freebuff-managed branches

```
  cli/first-i-have-clone-this-repo-till-https-github-com-216fcb07-946c-4935-a58e-d922499ba85d
  cli/first-i-have-clone-this-repo-till-https-github-com-3167fb4d-7780-475f-8401-5c169d6fec1c
```

---

## Ix — Remap Worktree (E:\E-github-repos\Ix-remap)

| Property | Value | Status |
|---|---|---|
| Active branch | `feat/ix-remap-hardening` | DESKTOP-OBSERVED |
| HEAD commit | `c021b52` | DESKTOP-OBSERVED |
| HEAD message | `feat(view): real /__ix/remap endpoint with loopback guard; fix WSL bootstrap` | DESKTOP-OBSERVED |
| Base | `origin/main` | DESKTOP-OBSERVED |
| Ahead/behind | ahead 1 | DESKTOP-OBSERVED |
| Working tree | CLEAN | DESKTOP-OBSERVED |
| Tests | 656 passing, tsc + eslint clean | DESKTOP-OBSERVED |

---

## Ix — Fork Remote State (Alot1z/Ix)

| Branch | Remote SHA | vs origin/main | Status |
|---|---|---|---|
| `fork/main` | `c4f8fea` | SYNCHRONIZED (2026-08-10) | DESKTOP-OBSERVED |
| `fork/feat/ix-agent-skill` | `0c9087c` | PR #368 head (monkey-patch stripped) | DESKTOP-OBSERVED |
| `fork/feat/ix-remap-hardening` | NONE | NOT pushed | DESKTOP-OBSERVED |

> The local `feat/ix-agent-skill` (`b038c46`) includes the full Compass patch.
> The fork version (`0c9087c`) was the PR #368 submission — patch was stripped per maintainer direction.
> These are DIFFERENT branches, not divergent versions of the same thing.

### Fork vs Upstream (origin/main) Divergence

```
fork/main  @ c4f8fea (synced ~2026-08-10)
origin/main @ c4f8fea (synchronized)
```

---

## Ix — Branch Listing (all, including remotes)

**Local branches:**
```
  feat/ix-agent-skill          b038c46
  feat/ix-remap-hardening       c021b52  (worktree: E:\E-github-repos\Ix-remap)
  main                          c4f8fea
```

**Remote branches (origin — ix-infrastructure/Ix):**
- `origin/main` → `c4f8fea`
- `origin/pr-368-head` → `0c9087c`
- Plus 20+ additional branches (see `git branch -r`)

**Remote branches (fork — Alot1z/Ix):**
- `fork/main` → `0437abf`
- `fork/feat/ix-agent-skill` → `0c9087c`
- Plus 10+ additional branches

---

## ix-compass-dist (E:\E-github-repos\ix-compass-dist)

| Property | Value | Status |
|---|---|---|
| Branch | `main` | DESKTOP-OBSERVED |
| HEAD | `396426b` | DESKTOP-OBSERVED |
| Working tree | Clean + untracked v0.3.0 artifacts | DESKTOP-OBSERVED |

---

## Ix-findings (E:\E-github-repos\Ix-findings)

| Property | Value | Status |
|---|---|---|
| Branch | `master` | DESKTOP-OBSERVED |
| Remote | `origin` → https://github.com/Alot1z/Ix-findings | DESKTOP-OBSERVED |
| HEAD commit | `daff6f9` (initial) | DESKTOP-OBSERVED 2026-08-10 |
| Files committed | 171 files, 34,563 insertions | DESKTOP-OBSERVED |
| Status | Clean, up to date with origin/master | DESKTOP-OBSERVED |
| GitHub URL | https://github.com/Alot1z/Ix-findings | VERIFIED |

---

## system-compass

| Property | Value |
|---|---|
| Local clone | NONE |
| Access | PRIVATE — returns 404 |
| Status | PATH UNKNOWN — MUST BE DISCOVERED BY CLI (if access ever granted) |
