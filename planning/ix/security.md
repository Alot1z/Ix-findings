# Ix — Security Model

## Endpoint security (remap) — see `remap.md` and `../security/audit.md`

Loopback bind + Host/Origin double guard + client-disconnect reaping + test
seam. 10-test guard matrix; verified line-by-line at phase-12.

## Repository posture (SOURCE — phase-04 audit, E-020)

- gitleaks: full-history scan on push + PR
- Trivy: vulnerability + misconfig scanning
- OpenSSF Scorecard: weekly, public
- Dependency review: blocks high severity
- Actions pinned to SHAs; step-security hardened runners
- Atomic config writes with 0600 permissions
- Debug output redaction in errors.ts

## Open security-related items

| Severity | Item | Status |
|---|---|---|
| P0 | `server.listen(PORT)` → 0.0.0.0 bind | FIXED in remap branch |
| P2 | `url.parse()` / DEP0169 deprecation in generated server code | open follow-up |
| P2 | `localhost` advertised while binding `127.0.0.1` | open follow-up |
| P3 | stale visualizer bundle after `ix upgrade` | watch (needs reproduction) |
| P3 | token format validation in auth.ts | hardening idea |
| P3 | bootstrap `curl \| sh` without hash pin | hardening idea |

## Threat model notes (INFERENCE — conservative)

- `/__ix/remap` shells out with the user's full privileges → loopback-only is
  the correct containment; cross-site + DNS-rebinding are the realistic attack
  vectors and are both denied (403).
- The `0.0.0.0` pre-fix state would have exposed a shell-exec endpoint to any
  LAN client — this is why the P0 was treated as critical.
- No secrets exist in the codebase (phase-04 scan), and the investigation
  material is clean (final scan, `../security/privacy.md`).
