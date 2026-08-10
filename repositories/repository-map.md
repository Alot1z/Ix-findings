# Ix / Compass — Repository Architecture Map

**Date:** 2026-08-10  
**Last Verified:** Phase 8 audit

## 1. Repository Inventory

| # | Repository | Type | Visibility | Local Path | Local Branch | Local HEAD |
|---|-----------|------|------------|------------|-------------|------------|
| 1 | `ix-infrastructure/Ix` | **Source** (upstream) | Public | `<IX_REPO>` | `feat/ix-agent-skill` | `b038c46` |
| 2 | `Alot1z/Ix` | **Fork** of #1 | Public | (same as #1, remote `fork`) | — | `0437abf` (fork/main) |
| 3 | `ix-infrastructure/ix-compass-dist` | **Distribution** | Public | `<COMPASS_DIST_REPO>` | `main` | `396426b` |
| 4 | `ix-infrastructure/system-compass` | **Source** (private) | **Private** | **None** | — | `7f98724` (per v0.3.0) |
| 5 | `Ix-findings` | **Investigation** | **No GitHub repo** | `<IX_FINDINGS>` | — | — |

## 2. Detailed Repository Profiles

### 2.1 ix-infrastructure/Ix (Upstream Source)

| Property | Value |
|----------|-------|
| **Role** | Primary source repository for the Ix CLI |
| **Visibility** | Public |
| **Default branch** | `main` |
| **Upstream** | Self (canonical) |
| **Forks** | `Alot1z/Ix` (user fork), others |
| **Local remotes** | `origin` = `ix-infrastructure/Ix`, `fork` = `Alot1z/Ix` |
| **Local main** | `c4f8fea` (synced to origin/main in Phase 1) |
| **Fork main** | `0437abf` (5 commits behind origin/main) |
| **Active branches** | `feat/ix-agent-skill` (uncommitted overhaul), `feat/ix-remap-hardening` (worktree) |
| **Worktrees** | `<IX_REPO>` (primary), `<IX_REMAP_WORKTREE>` (remap) |
| **Open issues** | 8 (371, 374, 376, 379, 381 + linked) |
| **Open PRs** | 8 (352, 362, 372, 373, 375, 378, 380, 382) |
| **Maintainers** | KageBinary (Collaborator), Hiro-Chiba (Contributor), josephismikhail (code owner) |

### 2.2 Alot1z/Ix (User Fork)

| Property | Value |
|----------|-------|
| **Role** | User fork for development and PR submission |
| **Visibility** | Public |
| **Default branch** | `main` |
| **Upstream** | `ix-infrastructure/Ix` |
| **Fork status** | 5 commits behind upstream/main |
| **Sync method** | Manual — `git fetch origin && git push fork` |
| **Feature branches** | 19 (active development branches) |
| **Note** | `feat/ix-agent-skill` on fork is at `0c9087c` (1 ahead of local `b038c46`) |

### 2.3 ix-infrastructure/ix-compass-dist (Distribution Channel)

| Property | Value |
|----------|-------|
| **Role** | Release distribution channel for Compass artifacts |
| **Visibility** | Public |
| **Default branch** | `main` |
| **Origin** | Self (not a fork) |
| **Content** | `README.md` only in the repository; `.tar.gz` binaries as GitHub Release assets |
| **CI/CD** | None — no `.github/workflows/` directory |
| **Update model** | **Manual** — releases created manually by maintainers |
| **Tags** | `v0.1.0`, `v0.1.1`, `v0.2.0`, `v0.3.0` (all point to `396426b`) |
| **Local** | `main` @ `396426b`, clean |
| **Releasers** | TannerTorrey3 (v0.1.0–v0.2.0), KageBinary (v0.3.0) |
| **DO NOT** | Manually modify generated artifacts. Releases are created via GitHub Releases UI, uploading `.tar.gz` built from system-compass. |

### 2.4 ix-infrastructure/system-compass (Private Source)

| Property | Value |
|----------|-------|
| **Role** | Source repository for the Compass UI application |
| **Visibility** | **Private** — 404 for unauthorized users |
| **Local checkout** | **None** |
| **Access** | Blocked — requires PAT with `Contents:read` |
| **v0.3.0 source rev** | `main` @ `7f98724` (from v0.3.0 release body) |
| **Build tool** | Rolldown (chunked output) |
| **Issues** | #57 (fit latch), #58, #59 (referenced in v0.3.0 notes) |
| **Related CI** | COMPASS_TOKEN in Ix `.github/workflows/release.yml` builds from this repo |
| **Impact** | All Compass PRs (#57, F-key, delayed-data) are blocked until source access |

### 2.5 Ix-findings (Investigation Workspace)

| Property | Value |
|----------|-------|
| **Role** | Central evidence and investigation workspace |
| **Visibility** | Local only |
| **Git repository** | **No** — never initialized |
| **GitHub repo** | **Does not exist** — 404 for `Alot1z/Ix-findings` |
| **Upstream** | None |
| **Contents** | 40 files across 12 directories (evidence, PR packets, investigation reports) |
| **Next step** | Initialize as local Git repo → optionally create GitHub repo |

## 3. Repository Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     SOURCE REPOSITORIES                      │
│                                                              │
│  ┌──────────────────────┐    ┌─────────────────────────────┐ │
│  │ ix-infrastructure/Ix │    │ ix-infrastructure/          │ │
│  │ (Public)             │    │ system-compass (Private)    │ │
│  │                      │    │                             │ │
│  │ Ix CLI source        │    │ Compass UI source           │ │
│  │ • CLI commands       │    │ • React app                 │ │
│  │ • Core ingestion     │    │ • Rolldown build            │ │
│  │ • GitHub API         │    │ • Keyboard/Fit/Camera       │ │
│  │ • Release CI         │    │ • system-compass #57-59     │ │
│  └────────┬─────────────┘    └──────────┬──────────────────┘ │
│           │                             │                     │
│           │ fork                        │ build               │
│           ▼                             │                     │
│  ┌──────────────────────┐               │                     │
│  │ Alot1z/Ix (Fork)     │               │                     │
│  │ • feat/ix-agent-skill│               │                     │
│  │ • feat/ix-remap-     │               │                     │
│  │   hardening           │               │                     │
│  └──────────────────────┘               │                     │
└─────────────────────────────────────────┼─────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  DISTRIBUTION CHANNEL                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ix-infrastructure/ix-compass-dist (Public)           │   │
│  │                                                      │   │
│  │ README.md only in repo                               │   │
│  │ compass-*.tar.gz as GitHub Release assets            │   │
│  │ • v0.1.0 (2026-03-28, TannerTorrey3)                │   │
│  │ • v0.1.1 (2026-03-29, TannerTorrey3)                │   │
│  │ • v0.2.0 (2026-06-08, TannerTorrey3)                │   │
│  │ • v0.3.0 (2026-08-09, KageBinary)                   │   │
│  │                                                      │   │
│  │ No CI — releases created manually                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                          │
                                          │ ix upgrade fetches from here
                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      USER INSTALL                            │
│                                                              │
│  ~/.ix/cli/compass/                                         │
│  ├── index.html                                             │
│  ├── assets/                                                │
│  └── .version    ← Stamped with Ix version (PR #365)       │
│                    or dist version (after ix upgrade)        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                INVESTIGATION WORKSPACE                       │
│                                                              │
│  Ix-findings/ (Local only, no GitHub repo)                  │
│  ├── README.md                                              │
│  ├── comparisons/    ← Phase 5 historical matrix            │
│  ├── findings/       ← Phase 4 security audit               │
│  ├── github/         ← Issue/PR/maintainer context          │
│  ├── manifests/      ← SHA256, investigation index          │
│  ├── pr-packets/     ← 3 PR packets (remap, F-key, delayed) │
│  ├── repositories/   ← This file                            │
│  ├── security/       ← Security findings                    │
│  └── state/          ← Phase reports (0,1,2,6)             │
└─────────────────────────────────────────────────────────────┘
```

## 4. Data Flow: Compass from Source to User

```
system-compass (private source)
    │
    │ npm run build (Rolldown)
    ▼
compass-0.X.0.tar.gz (build artifact)
    │
    │ Uploaded manually to GitHub Releases
    ▼
ix-compass-dist releases (public distribution)
    │
    │ ix upgrade fetches latest release
    ▼
~/.ix/cli/compass/ (user install)
    │
    │ ix view starts server
    ▼
http://127.0.0.1:PORT/ (visualizer)
    │
    │ POST /__ix/remap (after remap PR)
    ▼
ix map . runs in workspace cwd
```

## 5. Authorization & Ownership

### GitHub Identities

| GitHub User | Role | Repositories |
|-------------|------|-------------|
| **KageBinary** | Ix Collaborator | ix-infrastructure/Ix, ix-infrastructure/ix-compass-dist, ix-infrastructure/system-compass |
| **Hiro-Chiba** | Ix Contributor | ix-infrastructure/Ix |
| **TannerTorrey3** | Historic releaser | ix-infrastructure/ix-compass-dist (v0.1.0–v0.2.0) |
| **josephismikhail** | Code owner | ix-infrastructure/Ix |
| **Alot1z** | Fork owner | Alot1z/Ix |

### Access Matrix

| Repository | Read | Clone | Push | Admin |
|-----------|------|-------|------|-------|
| ix-infrastructure/Ix | Public | ✓ | ✗ | ✗ |
| Alot1z/Ix | Public | ✓ | ✓ (fork owner) | ✓ (fork owner) |
| ix-infrastructure/ix-compass-dist | Public | ✓ | ✗ | ✗ |
| ix-infrastructure/system-compass | Private | ✗ (404) | ✗ | ✗ |
| Ix-findings | N/A | N/A | N/A | N/A |

## 6. Synchronization Model

### Ix: Fork → Upstream

```
Development flow:
  Alot1z/Ix feature branch
      → Open PR against ix-infrastructure/Ix main
      → Merge by maintainer (KageBinary, josephismikhail)

Sync flow:
  ix-infrastructure/Ix main
      → git fetch origin main
      → git push fork main
```

**Current state:** Fork main is 5 behind origin/main. Local main is synced. Fork needs push.

### ix-compass-dist: Manual Release

```
Release flow:
  1. Build system-compass (private CI in Ix release.yml, or manual)
  2. Upload compass-*.tar.gz as GitHub Release asset
  3. Tags created alongside release

No automatic sync — fully manual.
```

### Ix-findings: Pending Initialization

```
Options:
  A. Create as standalone GitHub repo under Alot1z/Ix-findings
  B. Keep local-only (no GitHub)
  C. Create under ix-infrastructure/Ix-findings (requires org access)

Recommendation: Option A — init local Git repo → push to Alot1z/Ix-findings.
No upstream dependency. Self-contained investigation record.
```

## 7. Key Constraints

### DO NOT

| Action | Reason |
|--------|--------|
| Manually modify ix-compass-dist artifacts | Distribution channel — artifacts are built from system-compass |
| Push to ix-infrastructure/Ix | No write access |
| Force-push to any fork branch | Risk of losing work |
| Create GitHub repo without authorization | Per instructions, local-first until authorized |
| Mix Compass UI changes with Ix CLI changes | Separate repos, separate PRs |

### Preserve

| Asset | Protection |
|-------|-----------|
| Ix uncommitted overhaul | Must not be reset, stashed, or committed into remap PR |
| Ix-remap worktree | Clean, PR-ready, 656 tests passing |
| Ix-findings evidence | All investigation records preserved |

## 8. Branch Map

### Ix (shared remote — origin + fork)

```
origin/main ──────────────────── c4f8fea (synced)
    │
    ├── feat/ix-remap-hardening ─ c021b52 (PR-ready, NOT pushed)
    │
    └── feat/ix-agent-skill ──── b038c46 (uncommitted overhaul)

fork/main ────────────────────── 0437abf (5 behind origin/main)
    │
    └── feat/ix-agent-skill ──── 0c9087c (1 ahead of local b038c46)
```

### ix-compass-dist (single remote)

```
origin/main ──────────────────── 396426b
    │
    ├── tag: v0.1.0
    ├── tag: v0.1.1
    ├── tag: v0.2.0
    └── tag: v0.3.0
```

## 9. Worktree Map

```
<SANITIZED_ROOT>\
├── <IX_REPO>/                    Primary worktree (Ix repo)
│   Branch: feat/ix-agent-skill
│   HEAD:   b038c46
│   State:  18 uncommitted files (overhaul, preserved)
│
├── <IX_REMAP_WORKTREE>/              Git worktree (same Ix repo)
│   Branch: feat/ix-remap-hardening
│   HEAD:   c021b52
│   State:  Clean, PR-ready
│
├── ix-compass-dist/       Standalone repo (not a worktree)
│   Branch: main
│   HEAD:   396426b
│   State:  Clean
│
└── Ix-findings/           Not a Git repo (investigation workspace)
```

---

*All relationships verified by direct inspection of local repositories and
GitHub API. No claims fabricated.*
