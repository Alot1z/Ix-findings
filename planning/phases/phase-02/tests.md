# Phase 02 — Tests

| Suite | Result |
|---|---|
| Vitest (full) | **656 passed, 2 skipped** (51 files) |
| TypeScript `--noEmit` | 0 errors |
| ESLint (changed files) | clean |
| Guard matrix (view-server.test.ts) | 10/10 scenarios |

## Guard matrix scenarios (E-015)

1. cross-site Origin (`https://evil.example`) → 403
2. DNS-rebinding Host (`attacker.example`) → 403 (raw `http.request` bypasses undici Host protection)
3. malformed Origin (`not-a-url`) → 403
4. non-loopback Origin (`http://10.0.0.5:8080`) → 403
5. no Origin (curl-style) → 200, map runs (side-effect file verified)
6. same-origin loopback → 200
7. bracketed IPv6 Host (`[::1]`) → 200
8. map command failure → 500 with error string
9. GET `/` → 200 SPA fallback
10. GET `/__ix/remap` → SPA fallback (not an endpoint)

Test infra: real server + real child process (no mocks); stub CLI via
`IX_VIEW_MAP_MAIN` + `STUB_EXIT`; template-literal integrity asserted
(`server.listen(PORT, "127.0.0.1"` present in generated script).
