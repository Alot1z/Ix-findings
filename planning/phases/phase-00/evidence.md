# Phase 00 — Evidence

| ID | Item | Class | Detail |
|---|---|---|---|
| E-013 | Ix `view.ts` source inspection | A | `server.listen(PORT)` — no host → binds `::`/`0.0.0.0` |
| E-019 | git divergence numbers | A (git) | `rev-list --left-right --count`: main 10 behind; fork 5 behind; remap 1 ahead/0 behind |
| E-021 | worktree map | A (git) | `git worktree list`: primary + `<IX_REMAP_WORKTREE>` linked |
| E-020 | GitHub visibility probes | B (network) | `gh repo view`/GraphQL/`git ls-remote` → system-compass 404; org listing shows ix-compass-dist only |
| — | Working-tree inventory | A | 18 files uncommitted on `feat/ix-agent-skill` (6 M, 5 D, 7 ?) |
