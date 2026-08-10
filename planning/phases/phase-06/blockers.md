# Phase 06 — Blockers (F-key)

| Check | Result |
|---|---|
| Local checkout | ❌ none |
| GitHub visibility | ❌ private (404) |
| Git clone access | ❌ denied (auth required) |
| Release build token (COMPASS_TOKEN) | ❓ exists in Ix CI, not available locally |
| v0.3.0 source rev | ✅ known: `main @ 7f98724` |

**Resolution path:** PAT with `Contents:read` on system-compass, or a fork
grant, or the real repo URL from KageBinary (plan.md D5 / S-034). Until then,
the PR packet remains the deliverable.
