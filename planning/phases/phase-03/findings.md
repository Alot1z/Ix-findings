# Phase 03 — Findings (#376)

**F-008 — Version-series mismatch in the Compass upgrade check (Class A).**

| Claim | Source |
|---|---|
| `compass/.version` stamped with Ix version | `release.yml` (PR #365): `printf '%s' "$VERSION" > "$STAGING/compass/.version"` |
| `compassLatest` fetched from ix-compass-dist | `upgrade.ts` `fetchLatestRelease(COMPASS_DIST_REPO)` |
| `compassCurrent` read from `.version` | `upgrade.ts` `getInstalledCompassVersion()` |
| comparison via `isNewer` | `upgrade.ts` `isNewer(cache.compassLatest, compassCurrent)` |
| after upgrade, `.version` stamped with dist version | `upgrade.ts` `writeFileSync(COMPASS_VERSION_FILE, compassLatest)` |

**Failure scenario (documented, not reproduced — deterministic):** publish
ix-compass-dist v0.9.2 → `ix upgrade` on v0.9.1 install → `isNewer("0.9.2",
"0.9.1")` true → bundled compass (newer, from main) replaced by older dist build.

**Recommended fix direction:** Option A (stamp with the dist/compass version at
release time) — simplest, keeps `isNewer` same-series. Requires maintainer
(KageBinary) direction since he authored #365/#376. Separate PR from remap.
