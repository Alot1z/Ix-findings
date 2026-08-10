# Phase 04 — Findings (security & history)

| # | Severity | Finding | Repo | Status |
|---|---|---|---|---|
| P0 | CRITICAL | `server.listen(PORT)` no host → binds 0.0.0.0 (shell-exec endpoint exposure surface) | Ix | **FIXED** in `feat/ix-remap-hardening` (E-014) |
| P2 | OPEN | `url.parse()` / DEP0169 deprecation in generated server code | Ix | separate follow-up |
| P2 | OPEN | `localhost` advertised while binding `127.0.0.1` | Ix | separate follow-up |
| P3 | WATCH | potential stale visualizer bundle after `ix upgrade` | Ix | needs reproduction |
| P3 | MINOR | GitHub token format not validated (`auth.ts`) | Ix | hardening idea |
| P3 | MINOR | bootstrap `curl | sh` without hash pin | Ix | hardening idea |
| P3 | MINOR | compass-patch reference may be stale | Ix | watch |

**Posture:** STRONG — gitleaks (full-history, push+PR), Trivy, OpenSSF Scorecard
(weekly), dependency review (blocks high), actions pinned to SHAs,
step-security hardened runners, 0600 atomic config writes, debug redaction.
**Secrets scan:** zero hardcoded tokens/keys/passwords.
**Historical catalogue:** 8 open issues + 6 open PRs classified; Hiro-Chiba's
#374/#379/#381 → #375/#380/#382 fix pairs noted.
