# REPOSITORIES.md — Complete Repository Inventory

> All repositories referenced in the Ix / Compass investigation.
> Sources: `manifests/investigation-index.json`, live Git state (2026-08-10),
> `../planning/repositories/*.md`, `../planning/github/references.md`

---

## Repository Index

### 1. ix-infrastructure/Ix (UPSTREAM)

| Field | Value |
|---|---|
| Owner | ix-infrastructure |
| Name | Ix |
| URL | https://github.com/ix-infrastructure/Ix |
| Purpose | Primary Ix CLI repository — the main project |
| Local clone | `E:\E-github-repos\Ix` |
| Git root | `E:\E-github-repos\Ix\.git` |
| Local remote name | `origin` |
| Local remote URL | https://github.com/ix-infrastructure/Ix |
| Default branch | `main` |
| PRs discovered | #358, #362, #365, #366, #368, #371, #374, #376 |
| Issues discovered | #57 (Compass), #58, #59, #194, #347, #348, #369 |

### 2. Alot1z/Ix (FORK)

| Field | Value |
|---|---|
| Owner | Alot1z |
| Name | Ix |
| URL | https://github.com/Alot1z/Ix |
| Purpose | User's fork of ix-infrastructure/Ix |
| Local remote name | `fork` |
| Local remote URL | https://github.com/Alot1z/Ix |
| Default branch | `main` |
| Fork relationship | Fork of ix-infrastructure/Ix |
| Sync status | fork/main (`0437abf`) is 5 commits behind origin/main (`c4f8fea`) |
| PR submitted | PR #368 head = `0c9087c` (fork/feat/ix-agent-skill) |

### 3. ix-infrastructure/ix-compass-dist (DISTRIBUTION)

| Field | Value |
|---|---|
| Owner | ix-infrastructure |
| Name | ix-compass-dist |
| URL | https://github.com/ix-infrastructure/ix-compass-dist |
| Purpose | Compiled Compass UI distribution (NOT source) |
| Local clone | `E:\E-github-repos\ix-compass-dist` |
| Local remote name | `origin` |
| Default branch | `main` |
| HEAD | `396426b` |
| Working tree | Clean + untracked v0.3.0 research artifacts |
| Releases | v0.1.0, v0.1.1, v0.2.0, v0.3.0 |
| **IMPORTANT** | This is a DISTRIBUTION channel — DO NOT modify or PR to it |

### 4. ix-infrastructure/system-compass (SOURCE — PRIVATE)

| Field | Value |
|---|---|
| Owner | ix-infrastructure |
| Name | system-compass |
| URL | https://github.com/ix-infrastructure/system-compass |
| Purpose | Compass UI SOURCE repository |
| Access | PRIVATE — returns 404 for unauthorized users |
| Local clone | NONE |
| Issues referenced | #57 (fit refit), #58, #59 |
| Status | ACCESS BLOCKED — requires maintainer grant |

### 5. Ix-findings (INVESTIGATION LEDGER — NOW PUBLISHED)

| Field | Value |
|---|---|
| Owner | Alot1z |
| Name | Ix-findings |
| URL | https://github.com/Alot1z/Ix-findings |
| Local path | `E:\E-github-repos\Ix-findings` |
| Git root | `E:\E-github-repos\Ix-findings\.git` |
| Branch | `master` |
| Remote | `origin` → https://github.com/Alot1z/Ix-findings.git |
| HEAD commit | `daff6f9` (initial commit) |
| Files | 171 files, 34,563 insertions |
| Status | Published 2026-08-10 — clean, synced |
| Purpose | Investigation ledger, findings, evidence, planning, wiki, execution reports |

---

## Repository Relationships

```
ix-infrastructure/Ix (upstream)
    ├── FORK OF → Alot1z/Ix
    │   ├── feat/ix-agent-skill → PR #368
    │   └── main → 5 behind upstream
    │
    └── RELATED TO → ix-infrastructure/ix-compass-dist
    │   └── Compass UI shipped via `ix upgrade`
    │
    └── RELATED TO → ix-infrastructure/system-compass (PRIVATE)
        └── Compass UI SOURCE

Ix-findings (standalone ledger)
    └── REFERENCES all above
    └── NOT a fork — independent investigation record
```

---

## Remotes Verified (as of 2026-08-10)

From `E:\E-github-repos\Ix`:

```
origin  https://github.com/ix-infrastructure/Ix  (fetch + push)
fork    https://github.com/Alot1z/Ix              (fetch + push)
```

From `E:\E-github-repos\Ix-findings`:

```
(none — no remotes configured)
```

From `E:\E-github-repos\ix-compass-dist`:

```
origin  https://github.com/ix-infrastructure/ix-compass-dist  (fetch + push)
```
