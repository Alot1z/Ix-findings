# Phase 00 — Initial State Audit

| Field | Value |
|---|---|
| Phase | 00 |
| Purpose | Establish exact current state of every repository, worktree, branch, remote, and fork |
| Date/time | 2026-08-10 |
| Category | DISCOVERY |
| Inputs | Local clones at `<IX_REPO>`, `<IX_REMAP_WORKTREE>`, `<COMPASS_DIST_REPO>`; GitHub API/page |
| Repositories involved | ix-infrastructure/Ix, Alot1z/Ix (fork refs), ix-compass-dist, system-compass (probe), Ix-findings |
| Artifacts involved | none (read-only) |
| Work performed | git topology dump (remotes, branches, worktrees, ahead/behind), working-tree inventory, GitHub visibility probes (`gh`/page/`git ls-remote`), contradiction hunt |
| Findings | F-009 (patches dead) contextualised; fork divergence; system-compass private; ix-compass-dist is distribution-only |
| Evidence | E-013, E-019, E-020, E-021 |
| Changes | None (read-only audit) |
| Tests | None (audit) |
| Suggestions | S-001 (dedicated remap worktree), S-002 (base on origin/main), S-025 (do NOT stash overhaul), S-026 (do NOT base on fork/main) |
| Decisions | D-002 (dedicated worktree), D-009 (no push w/o authorization) |
| Unresolved questions | What to do with fork's extra commit `0c9087c` on feat/ix-agent-skill; whether the 18-file overhaul should be committed |
| Outputs | `../../state/phase-0-audit.md` |
| Next-phase dependencies | phase-01 (sync) |

**Key discoveries:** local `main` 10 behind `origin/main`; fork `main` 5 behind;
remap branch already correctly based on `origin/main` (`c4f8fea`); the fork has
a cleanup commit (`0c9087c`) the local worktree lacks; `system-compass` 404s;
`ix-compass-dist` contains only README + release assets.
