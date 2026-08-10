# Security Audit (final)

Date: 2026-08-10 · Re-verified during PHASE FINAL.

## 1. Endpoint: `/__ix/remap` (Ix remap branch `c021b52`) — VERIFIED

| Check | Mechanism | Line | Test |
|---|---|---|---|
| Loopback bind | `server.listen(PORT, "127.0.0.1")` | view.ts ~260 | template check in test setup |
| Host: localhost / 127.0.0.1 | `host === "localhost" \|\| host === "127.0.0.1"` | ~185 | ✅ |
| Host: bracketed IPv6 | `host.startsWith("[")` branch → `[::1]` | ~184–185 | ✅ accepts IPv6 |
| Origin absent → allowed | `let loopbackOrigin = !origin` | ~189 | ✅ curl-style POST |
| Origin loopback hostname | `u.hostname` check (http/https) | ~192–193 | ✅ same-origin |
| Origin non-loopback → 403 | `if (!loopbackOrigin)` | ~196 | ✅ CSRF / non-loopback |
| Origin malformed → 403 | `catch { loopbackOrigin = false }` | ~194–195 | ✅ |
| Origin parsed via URL API | `new URL(origin)` | ~191 | ✅ template-literal safe |
| Client-disconnect reap | `res.on("close")` + `writableEnded` | ~210 | ✅ code review |
| Test seam | `process.env.IX_VIEW_MAP_MAIN` | ~198 | non-prod only |

Pre-fix P0 (E-013): `server.listen(PORT)` → `::`/`0.0.0.0` — **fixed**.

## 2. Ix repository posture — STRONG (SOURCE)

gitleaks (push+PR) · Trivy · OpenSSF Scorecard (weekly) · dependency review ·
SHA-pinned actions · hardened runners · 0600 atomic config writes · debug
redaction.

## 3. Open items

| Sev | Item | Status |
|---|---|---|
| P2 | `url.parse()` / DEP0169 in generated server code | follow-up |
| P2 | `localhost` advertised vs `127.0.0.1` bind | follow-up |
| P3 | stale visualizer bundle after `ix upgrade` | watch |
| P3 | token format validation | hardening idea |
| P3 | curl|sh without hash pin | hardening idea |

## 4. Compass artifact analysis (no source access)

- CSS-zoomed content-sized canvas — no injection vector observed (B).
- Keyboard guard chain intact (enabled gate, INPUT/TEXTAREA guard) — no
  keylogger surface (B).
- No secrets/credentials/tokens in bundles (B).

## 5. Verification matrix (this phase)

| Check | Result |
|---|---|
| Secret scan (planning + all Ix-findings md/json) | ✅ none |
| Personal-path scan | ✅ none (sanitized) |
| Test suite (remap branch) | ✅ 656/2, tsc 0, eslint clean |
| Guard matrix | ✅ 10/10 |
| Nothing pushed/opened/merged/released | ✅ D-009 |
