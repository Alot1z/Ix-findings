# Phase 00 — Findings

| ID | Finding | Class | Status |
|---|---|---|---|
| F-010 (part) | `server.listen(PORT)` with no host binds `0.0.0.0` in Ix view.ts (P0) | A | FIXED in remap branch (later) |
| F-011 (part) | `is_windows()` misroutes WSL to PowerShell; `node_ok` dead | A | FIXED in remap branch (later) |
| — | Local `main` 10 commits behind `origin/main` | A (git) | RESOLVED phase-01 |
| — | Fork `main` 5 behind `origin/main` | A (git) | NOT SYNCED (D-009) |
| — | Remap branch based on `origin/main` `c4f8fea`, not stale local main | A (git) | VERIFIED — correctly positioned |
| — | Fork `feat/ix-agent-skill` @ `0c9087c` is 1 commit ahead of local `b038c46` (cleanup commit) | A (git) | OPEN — reconciliation needed |
| — | `system-compass` private (404), no local checkout | B (network) | BLOCKER (permanent) |
| — | `ix-compass-dist` is a distribution channel (README only) | A | VERIFIED |

## Contradictions found (reconciled)

1. "main behind 10 but remap based on main" → remap is based on **origin/main** — no problem.
2. "b038c46 is latest on feat/ix-agent-skill" → fork has `0c9087c` (cleanup) ahead.
3. "Ix-findings might be a repo" → it was not Git-initialized at audit time.
4. "ix-compass-dist might contain source" → README + release assets only.
