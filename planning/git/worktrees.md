# Git — Worktrees

```
<IX_REPO>/.git                    ← shared git dir (ix-infrastructure/Ix)
    ├── <IX_REPO>                 → feat/ix-agent-skill  @ b038c46   [primary; 13 uncommitted files]
    └── <IX_REPO>/.git/worktrees/Ix-remap
         └── <IX_REMAP_WORKTREE>  → feat/ix-remap-hardening @ c021b52 [linked; clean, PR-ready]

<COMPASS_DIST_REPO>/.git          ← standalone (ix-compass-dist)
    └── <COMPASS_DIST_REPO>       → main @ 396426b                    [clean + untracked v0.3.0 artifacts]
```

## Rules honoured

- The remap worktree exists solely for isolation (D-002) — it is why the
  18-file overhaul was never stashed or risked (S-025 rejected).
- No worktree was created, deleted, or reset during the final phase.
- No other worktrees exist under `<IX_REPO>`.
