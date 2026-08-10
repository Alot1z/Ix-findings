# Ix — `/__ix/remap` Endpoint (F-010)

## Verified implementation (SOURCE — `feat/ix-remap-hardening` @ `c021b52`)

- `POST /__ix/remap` in `view.ts` `serverScript()` runs `ix map .` in the
  workspace cwd with a 30-minute timeout; responds `{ok:true}` /
  `{ok:false,error}`.
- Server binds explicitly: `server.listen(PORT, "127.0.0.1", ...)` (was
  `server.listen(PORT)` → `::`/`0.0.0.0` — the P0 this PR fixes).
- `export function serverScript()` for tests; `IX_VIEW_MAP_MAIN` test seam.

## Security model (VERIFIED — code + 10 tests, E-014/E-015)

Double loopback check; **both** must pass or → 403 `{ok:false,error:"forbidden: loopback only"}`:

1. **Host check** — `localhost` / `127.0.0.1` / `[::1]` (bracketed-IPv6 branch
   strips port from the closing bracket, not a `:` split).
2. **Origin check** — parsed with `new URL()` (template-literal-safe, not
   regex): protocol http/https; hostname loopback; **absent Origin allowed**
   (curl-style); malformed → `catch { loopbackOrigin = false }` → 403;
   non-loopback → 403.

Plus: client-disconnect reaping (`res.on("close", ...)` + `writableEnded`
guard — avoids killing the map mid-flight on Node versions that fire request
`close` on completion).

## Guard matrix (E-015 — 10 tests)

Cross-site 403 · DNS-rebinding 403 · malformed Origin 403 · non-loopback Origin
403 · no-Origin 200 · loopback Origin 200 · bracketed IPv6 Host 200 · map
failure 500 · GET / 200 SPA · GET /__ix/remap → SPA.

## Known limitations (documented in packet)

- No rate limiting beyond single-thread + reaping (acceptable for loopback).
- 30-min timeout generous for very large workspaces.
- No progress streaming — client waits.

## Why the URL API over regex (RECONSTRUCTION — from reviewer + author notes)

The server code lives inside a template literal in `serverScript()`; regex
backslashes get consumed each time `ix view start` regenerates the script. The
URL API avoids that entire bug class (S-012).

## State

PR-ready, NOT pushed (D-009). Phase-12 gate: READY TO PUSH / READY TO OPEN PR.
Planning: `../pr-planning/ix-remap.md`.
