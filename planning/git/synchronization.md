# Git — Synchronization State

## What is synced

| Ref | State |
|---|---|
| local `main` | = `origin/main` @ `c4f8fea` (0 ahead / 0 behind) — synced phase-01 |
| remap branch | based on `origin/main` @ `c4f8fea` (+1 commit `c021b52`) — correct base, no rebase needed |
| ix-compass-dist | = origin @ `396426b` — in sync |

## What is deliberately NOT synced

| Ref | State | Why |
|---|---|---|
| `fork/main` | 5 behind origin/main | D-009; sync deferred until remap push (S-016) |
| fork `feat/ix-agent-skill` | `0c9087c` ahead of local | open reconciliation question (phase-00) — do not force-push either side |
| local `feat/ix-agent-skill` | 13 uncommitted files | preserved as-is; never reset/stash-over (S-025) |

## How the sync was done (phase-01)

`git branch -f main origin/main` — a pointer update with **no checkout**, so the
uncommitted overhaul on `feat/ix-agent-skill` was never at risk. Verified after:
remap branch still `c021b52`, merge-base unchanged.

## Recommended sync sequence (when authorized — NEXT-ACTIONS)

1. Push `feat/ix-remap-hardening` → fork (`git push fork feat/ix-remap-hardening`).
2. Open PR fork → upstream (target `main`).
3. After PR activity settles: `git push fork main` (fast-forward `0437abf` → `c4f8fea`).
4. Decide the `0c9087c` vs local-overhaul reconciliation **before** any push of
   `feat/ix-agent-skill`.
