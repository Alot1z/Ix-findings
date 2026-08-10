# BRANCH-MATRIX.md — All Branches Across All Repos

> Every branch referenced in the investigation, with SHA, relationship, and status.
> ALL values: DESKTOP-OBSERVED — REVALIDATE WITH CLI.

---

## Ix — Local Branches

| Branch | SHA | Base | Ahead/Behind | Worktree | Purpose |
|---|---|---|---|---|---|
| `main` | `c4f8fea` | `origin/main` | synchronized | (not checked out) | Upstream main |
| `feat/ix-agent-skill` | `b038c46` | diverged from main | N/A | `E:\E-github-repos\Ix` | User's ongoing overhaul (13 uncommitted changes) |
| `feat/ix-remap-hardening` | `c021b52` | `origin/main` | ahead 1 | `E:\E-github-repos\Ix-remap` | PR-ready remap hardening |

---

## Ix — Origin Remote (ix-infrastructure/Ix) — Key Branches

| Branch | SHA | Purpose |
|---|---|---|
| `origin/main` | `c4f8fea` | Upstream main (DEP0169 + dev-deps bump) |
| `origin/pr-368-head` | `0c9087c` | PR #368 merged head |
| `origin/fix/view-reports-running-port` | `c5357aa` | View port reporting fix |
| `origin/fix/view-port-mismatch-warning` | `95d76b9` | View port mismatch warning |
| `origin/fix/windows-short-temp-path` | `a52f275` | Windows TEMP path fix |
| `origin/fix/windows-tar-cygpath-pairing` | `f434f9d` | Windows tar pairing fix |
| `origin/fix/installer-ghcr-denied-diagnostics` | `14eb350` | Installer diagnostics |
| `origin/fix/stamp-bundled-compass-version` | `83c4308` | Compass stamp fix |
| `origin/fix/release-prerelease-handling` | `77e8a5e` | Release handling |
| `origin/fix/progress-frames-non-tty` | `decd85e` | Progress frames fix |
| `origin/feat/llm-format-coverage` | `86f3684` | LLM format coverage |
| `origin/chore/brew-update-v0.9.1` | `23fdc9a` | Brew formula update |
| `origin/chore/raise-node-floor-to-22` | `0bc722d` | Node version floor |

---

## Ix — Fork Remote (Alot1z/Ix) — Key Branches

| Branch | SHA | vs origin/main | Purpose |
|---|---|---|---|
| `fork/main` | `0437abf` | 5 behind | Fork main — NEEDS SYNC |
| `fork/feat/ix-agent-skill` | `0c9087c` | PR #368 head | PR submission (monkey-patch stripped) |
| `fork/chore/brew-update-v0.9.1` | `23fdc9a` | — | Brew update |
| `fork/chore/raise-node-floor-to-22` | `0bc722d` | — | Node floor |
| `fork/fix/view-reports-running-port` | `c5357aa` | — | View port fix |
| `fork/fix/view-port-mismatch-warning` | `72c0b85` | — | Port mismatch |
| `fork/fix/installer-docker-autoinstall-noop` | `4475d24` | — | Docker installer |
| `fork/fix/windows-short-temp-path` | `e3b591c` | — | TEMP path |
| `fork/fix/windows-tar-cygpath-pairing` | `f434f9d` | — | Tar pairing |
| `fork/fix/release-prerelease-handling` | `77e8a5e` | — | Release |
| `fork/feat/remote-runner-and-create-client` | `f4259b7` | — | Remote runner (Pro) |

---

## Ix — Agent-Skill Branch Divergence

```
LOCAL: feat/ix-agent-skill @ b038c46  (13 uncommitted changes, full Compass patch)
                               ↑
                         DIVERGED — different content, same base concept
                               ↓
FORK:  fork/feat/ix-agent-skill @ 0c9087c  (PR #368 head, monkey-patch stripped)
```

---

## ix-compass-dist

| Branch | SHA | Status |
|---|---|---|
| `main` | `396426b` | Clean + untracked v0.3.0 artifacts |

---

## Ix-findings

| Branch | SHA | Status |
|---|---|---|
| `master` | N/A (no commits) | 0 commits, 28 untracked entries |

---

## system-compass

| Branch | Status |
|---|---|
| UNKNOWN | PATH UNKNOWN — private repo, no local clone |
