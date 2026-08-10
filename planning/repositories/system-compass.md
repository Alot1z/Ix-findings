# Repository — ix-infrastructure/system-compass

| Property | Value |
|---|---|
| Identity | `ix-infrastructure/system-compass` (source for the Compass UI) |
| Visibility | **PRIVATE** — 404 for unauthorized users |
| Local checkout | **none** |
| Clone access | denied (auth required) |
| Source revision (v0.3.0) | `main @ 7f98724` (per release body) |
| Build tool | Rolldown (chunked output, no source maps) |
| Known issues | #57 (fit latch — fixed in v0.3.0), #58, #59 (referenced, details unknown) |
| Related CI | COMPASS_TOKEN in Ix `release.yml` builds from this repo |
| Purpose | React app: keyboard, camera/fit, region rollup, rendering, theme |

## Why it matters

It is the **only** source for the Compass UI. All Compass-side PR work —
F-key (F-001…F-005), delayed-data (F-006/F-007) — is blocked on access
(phase-06 gate). Nothing about its internals is claimed beyond what release
notes (Class A), artifacts (Class B), and reconstructions (Class C/D) support.

## Access path (D-014, OPEN)

- Recommended: request from KageBinary (offered review: "If you open it against
  system-compass I will review it there") in the merged #368 thread.
- Alternative: user-provided URL/fork grant/PAT with `Contents:read`.

## Related
- `../compass/reconstruction.md` · `../ix/architecture.md`
- Findings F-001…F-007, F-013 · PR planning `../pr-planning/compass-f-key.md`,
  `../pr-planning/compass-delayed-data.md`
