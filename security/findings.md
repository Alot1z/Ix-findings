# Security Findings — Ix / Compass Investigation

**Date:** 2026-08-10

## Ix — `/__ix/remap` endpoint

### Guard matrix (all verified via view-server tests)

| Scenario | Expected | Test | Status |
|---|---|---|---|
| Cross-site Origin (`https://evil.com`) | 403 | `remap rejects cross-site Origin` | ✅ Pass |
| DNS-rebinding Host (`evil.com`) | 403 | `remap rejects non-local Host header` | ✅ Pass |
| Malformed Origin (`not-a-url`) | 403 | `remap rejects malformed Origin` | ✅ Pass |
| Non-loopback Origin (`http://192.168.1.1:8080`) | 403 | `remap rejects non-loopback Origin` | ✅ Pass |
| No Origin (curl, local tooling) | Allowed | `remap allows no Origin` | ✅ Pass |
| Loopback IPv4 Origin (`http://127.0.0.1:8080`) | Allowed | `remap allows loopback Origin` | ✅ Pass |
| Bracketed IPv6 rebinding Host | 403 | `remap rejects bracketed-IPv6 non-local Host` | ✅ Pass |
| Bind address | `127.0.0.1` | `server binds loopback only` | ✅ Pass |
| SPA fallback | 200 | `server serves SPA fallback` | ✅ Pass |

### Findings

| # | Severity | Finding | Status |
|---|---|---|---|
| P0 | FIXED | `server.listen(PORT)` with no host binds `0.0.0.0` | Fixed in `feat/ix-remap-hardening` |
| P2 | OPEN | `url.parse()` / DEP0169 deprecation in generated server code | Separate follow-up |
| P2 | OPEN | `localhost` advertised while binding `127.0.0.1` | Separate follow-up |
| P3 | WATCH | Potential stale visualizer bundle after `ix upgrade` | Needs reproduction |

## Compass — artifact analysis

No source-level security findings possible without source access. The artifact-level analysis found:

- CSS-zoomed canvas element (content-sized) — no injection vector observed
- Keyboard guard chain intact (enabled gate, INPUT/TEXTAREA guard) — no keylogger risk
- No secrets, credentials, or tokens in bundle analysis

## Privacy

- No personal filesystem paths in any committed or published material
- All reports use neutral placeholders (`<IX_REPO>`, `<ARTIFACT_DIR>`, `<IX_FINDINGS>`)
- No credentials scanned in any task directory
- `.freebuff/` app runtime files untouched and unexamined
