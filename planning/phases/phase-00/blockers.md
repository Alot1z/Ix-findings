# Phase 00 — Blockers

| # | Blocker | Severity | Resolution |
|---|---|---|---|
| 1 | Local `main` 10 behind origin/main | HIGH | phase-01 `git branch -f main origin/main` |
| 2 | Fork `feat/ix-agent-skill` has `0c9087c` not in local | HIGH | Decide merge strategy (open) |
| 3 | 18-file uncommitted overhaul | HIGH | Preserve; never reset/stash-over (D-002, S-025) |
| 4 | system-compass source unavailable | PERMANENT | Cannot implement F-key / investigate root cause |
| 5 | No push/PR authorization | GATE | D-009 |
| 6 | Ix-findings not a Git repo | MEDIUM | phase-09 init |
