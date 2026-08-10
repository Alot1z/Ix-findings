# Phase 02 — Remap Finalization

| Field | Value |
|---|---|
| Phase | 02 |
| Purpose | Prepare `feat/ix-remap-hardening` @ `c021b52` as a clean, focused, reviewable PR candidate |
| Date/time | 2026-08-10 |
| Category | IMPLEMENTATION |
| Inputs | phase-01 synced main; reviewer (KageBinary) guidance from #368; tested `apply.sh` origin-guard logic |
| Repositories involved | ix-infrastructure/Ix (worktree `<IX_REMAP_WORKTREE>`) |
| Artifacts involved | none |
| Work performed | real `/__ix/remap` endpoint in `view.ts` `serverScript()`; loopback bind + Host/Origin guard (URL API, IPv6 bracketed, client-disconnect reap, `IX_VIEW_MAP_MAIN` seam); WSL `is_windows()` fix; `node_ok` removal; docs; 10-test guard matrix |
| Findings | F-010 (P0 bind fixed), F-011 (WSL fix), F-012 (node_ok removal) |
| Evidence | E-014, E-015, E-016 |
| Changes | 4 files: `view.ts` +55/−3, `view-server.test.ts` +178, `bootstrap.sh` +4/−5, `docs/api/README.md` +13/−3 (net +239/+250) |
| Tests | vitest 656 pass / 2 skip; tsc --noEmit 0 errors; eslint clean; guard matrix 10/10 |
| Suggestions | S-003 (export serverScript — ACCEPTED), S-004 (IX_VIEW_MAP_MAIN seam — ACCEPTED), S-012 (URL API not regex — ACCEPTED), S-030 (0.0.0.0 bind — REJECTED/dangerous) |
| Decisions | D-003 (evidence classification applied) |
| Unresolved questions | rate limiting (accepted limitation); 30-min map timeout |
| Outputs | `../../state/phase-2-remap-report.md`, `../../pr-packets/ix-remap-hardening/README.md` |
| Next-phase dependencies | phase-12 (fresh gate) → phase-13 (authorization) |

**Security model:** double loopback check (Host + Origin), 403 on any failure;
origin parsed with `new URL()` (template-literal-safe); client disconnect reaps
the child `ix map` process; server binds explicitly to `127.0.0.1`.
