# Phase 1 — Unknown Register

| # | Unknown | Why Unknown | Resolution Path | Blocking? | Target Phase |
|---|---------|-------------|-----------------|-----------|--------------|
| U-001 | system-compass source code | Private repo, HTTP 404 | Request access from KageBinary (D-014) | YES — 7 findings | Post-access |
| U-002 | system-compass internal architecture | No source access | Same as U-001 | YES — F-key, delayed-data, zoom | Post-access |
| U-003 | Freebuff Forge upstream divergence | Not measured — no fetch/log comparison | `git fetch upstream && git log upstream/main..HEAD` | NO | Phase 2 |
| U-004 | F-008 reproducibility on c4f8fea | Not tested in Phase 1 | Run ix upgrade test on clean test worktree | NO | Phase 2 |
| U-005 | F-009 reproducibility on c4f8fea | Not tested in Phase 1 | Test patches command on clean test worktree | NO | Phase 2 |
| U-006 | Freebuff Desktop (Electron) app | Not found in freebuff-forge monorepo | Inspect Orca/Desktop Commander as separate project | NO | Phase 2 |
| U-007 | PR #376 vs Issue #376 | GitHub API returns 404 for PR, no issue query done | Query issues endpoint for #376 | NO | Phase 2 |
| U-008 | PR #371 vs Issue #371 | GitHub API returns 404 for PR, no issue query done | Query issues endpoint for #371 | NO | Phase 2 |
| U-009 | Freebuff-mod repository remote | Not inspected | Check git remote -v | NO | Phase 2 |
| U-010 | Freebuff-configs repository remote | Not inspected | Check git remote -v | NO | Phase 2 |
