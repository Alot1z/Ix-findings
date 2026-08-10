# GitHub — Releases

## ix-compass-dist

| Tag | Date | Released by | SHA256 (prefix) | Source rev | Purpose |
|---|---|---|---|---|---|
| v0.1.0 | 2026-03-28 | TannerTorrey3 | 19bc427d0eca77b2 | unknown | initial |
| v0.1.1 | 2026-03-29 | TannerTorrey3 | 74e56488c5daf970 | unknown | hotfix |
| v0.2.0 | 2026-06-08 | TannerTorrey3 | 863583084c91719f | unknown | zoom-out floor etc. |
| v0.3.0 | 2026-08-09 | KageBinary | 7ed6cc82fe58b3ad | system-compass main @ 7f98724 | **stop a downgrade**; #57/#58/#59; aggregation; bounded layout; search; breadcrumbs |

All four tags point at commit `396426b` (README-only repo); the binaries are
GitHub **Release assets**, not repo content. Releases are created manually —
ix-compass-dist has no CI.

## Ix

- v0.9.0 shipped a compass bundle with **no `.version` stamp** → `ix upgrade`
  silently downgraded to dist v0.2.0 (the bug v0.9.1 + #365/#366 fixed).
- v0.9.1 verified: `compass/.version = 0.9.1` (Ix series) — the #376 hazard (F-008).

## Release-data reconciliation (R-01)

`manifests/artifact-sha256.json` lists release dates 2026-08-07/08 for
v0.1.0/v0.1.1/v0.2.0; the release timeline above (corroborated by three
documents) is authoritative. See `../final/verification.md`.
