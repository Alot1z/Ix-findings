# Phase 02 — Change Inventory (remap branch `c021b52`)

| File | Δ | Purpose |
|---|---|---|
| `ix-cli/src/cli/commands/view.ts` | +55/−3 | Real `POST /__ix/remap` (runs `ix map .`, 30-min timeout), loopback Host/Origin guard, IPv6 bracketed handling, client-disconnect reaping, `IX_VIEW_MAP_MAIN` seam, `export function serverScript()`, `server.listen(PORT, "127.0.0.1")` |
| `ix-cli/test/view-server.test.ts` | +178 | 10-test guard matrix: cross-site 403, DNS-rebinding 403, malformed Origin 403, non-loopback Origin 403, no-Origin allowed, loopback Origin allowed, bracketed IPv6 Host, map failure 500, SPA fallback 200, GET /__ix/remap → SPA |
| `skills/ix/scripts/bootstrap.sh` | +4/−5 | `is_windows()` no longer treats `WSL_DISTRO_NAME` as Windows; remove dead `node_ok` |
| `docs/api/README.md` | +13/−3 | Document real endpoint + security model |

**Not changed:** Compass UI, delayed-data, F-key, `feat/ix-agent-skill` uncommitted
work, upgrade.ts, config.ts, release.yml, ix-compass-dist.

**Guard matrix** (verified in code + tests): see `../../security/audit.md`.
