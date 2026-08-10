# Git — Branches (verified 2026-08-10)

## ix-infrastructure/Ix (shared repo)

| Branch | HEAD | Base | Tracking | vs origin/main | Worktree | Status |
|---|---|---|---|---|---|---|
| `main` | `c4f8fea` | — | origin/main | 0/0 | (none) | synced |
| `feat/ix-agent-skill` | `b038c46` | `01308e6` | — | 10 behind, 1 ahead | `<IX_REPO>` | 13 uncommitted files (overhaul) |
| `feat/ix-remap-hardening` | `c021b52` | `c4f8fea` | origin/main | 1 ahead, 0 behind | `<IX_REMAP_WORKTREE>` | clean, PR-ready, NOT pushed |
| `freebuff/first-…216fcb07` | `01308e6` | — | — | 10 behind | (none) | Freebuff auto-branch |
| `freebuff/first-…3167fb4d` | `01308e6` | — | — | 10 behind | (none) | Freebuff auto-branch |

## Alot1z/Ix (fork, remote refs)

| Branch | HEAD | vs origin/main | Note |
|---|---|---|---|
| `fork/main` | `0437abf` | 5 behind, 0 ahead | NOT pushed (D-009); sync deferred (S-016) |
| `fork/feat/ix-agent-skill` | `0c9087c` | 1 ahead of local `b038c46` | cleanup commit not pulled locally |

## ix-compass-dist

| Branch | HEAD | Status |
|---|---|---|
| `main` | `396426b` | clean; tags v0.1.0–v0.3.0 all on this commit |

## Branch lifecycle notes

- `feat/ix-remap-hardening` was based on `origin/main` from the start (D-001) —
  no rebase has been needed; merge-base still `c4f8fea` (phase-12 verified).
- The fork's `0c9087c` ("scope the PR to the skill and docs; drop the Compass
  monkey-patch") is the remote twin of the local uncommitted overhaul — the
  reconciliation question from phase-00 remains open.
