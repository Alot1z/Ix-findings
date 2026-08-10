# PR Packet — Ix #376 Version Series Mismatch

- **Proposed title:** fix(release): stamp compass with dist version, not Ix version
- **Repository:** ix-infrastructure/Ix
- **Target branch:** main
- **Source branch:** fix/compass-version-stamp-series
- **Base:** origin/main @ c4f8fea
- **Remote status:** NOT pushed, NOT opened

---

## Summary

The bundled Compass is stamped with the Ix release version (`compass/.version = "0.9.1"`),
but `ix-compass-dist` releases use their own version series (`v0.3.0`). `isNewer`
compares them directly, so the staleness check is only correct because Ix version
numbers currently happen to be larger. When ix-compass-dist tags anything above the
running Ix version, `isNewer` returns true and `ix upgrade` replaces a correct,
newer bundled Compass with the dist build.

## Problem

PR #365 stamped `compass/.version` with the Ix version as a "monotonic stand-in."
This was the right immediate fix for the v0.9.0 missing-stamp regression, but it
feeds two different numbering schemes into one `isNewer`:

| Source | Value | Series |
|--------|-------|--------|
| `compassLatest` (from ix-compass-dist API) | `"0.3.0"` | dist release series |
| `compassCurrent` (from `compass/.version`) | `"0.9.1"` | Ix release series |

`isNewer("0.3.0", "0.9.1")` → false — correct by accident.

`isNewer("1.0.0", "0.9.1")` → true — would incorrectly replace the bundled compass
with an older dist build. Same regression as v0.9.0 (#365/#366), different cause.

## Evidence

- **Class A** (source-proven): All code paths verified by direct inspection
  - `.github/workflows/release.yml`: `printf '%s' "$VERSION" > "$STAGING/compass/.version"`
  - `ix-cli/src/cli/commands/upgrade.ts:678`: `isNewer(cache.compassLatest, compassCurrent)`
  - `ix-cli/src/cli/commands/upgrade.ts:690`: `fetchLatestRelease(COMPASS_DIST_REPO)` for `compassLatest`
  - `ix-cli/src/cli/commands/upgrade.ts:193`: `getInstalledCompassVersion()` reads `.version`
- See: `github/issues/376/README.md` for full investigation

## Implementation

### Change 1: stamp with dist version in release.yml

In `.github/workflows/release.yml`, change the stamp from the Ix version to the
latest ix-compass-dist release tag:

```bash
# BEFORE (PR #365):
printf '%s' "$VERSION" > "$STAGING/compass/.version"

# AFTER:
# Fetch the latest ix-compass-dist tag at release time
COMPASS_DIST_VERSION=$(curl -fsSL https://api.github.com/repos/ix-infrastructure/ix-compass-dist/releases/latest | jq -r '.tag_name' | sed 's/^v//')
if [ -n "$COMPASS_DIST_VERSION" ] && [ "$COMPASS_DIST_VERSION" != "null" ]; then
  printf '%s' "$COMPASS_DIST_VERSION" > "$STAGING/compass/.version"
else
  # Fallback: stamp with Ix version (current behavior)
  printf '%s' "$VERSION" > "$STAGING/compass/.version"
fi
```

The fallback ensures the release doesn't fail if the GitHub API is unreachable.
The stamp being present at all is what matters (per #365).

### Change 2 (alternative, simpler): stamp with the known dist version

If the Compass build job already knows which dist version it corresponds to
(v0.3.0 was built from system-compass @ 7f98724), hardcode that mapping.
Simpler, no runtime API call. But requires updating the mapping when new
dist releases are cut.

### Files changed

| File | Change | Lines |
|------|--------|-------|
| `.github/workflows/release.yml` | Change stamp from `$VERSION` to dist version | ~5 |
| `ix-cli/src/cli/commands/upgrade.ts` | No change needed | 0 |

`isNewer` already works correctly when both sides use the same version series.
The only change needed is what goes into `compass/.version`.

### What does NOT change

- `isNewer` logic — already correct for same-series comparison
- `getInstalledCompassVersion` — already correct
- `writeCache` — already correct
- `ix upgrade` flow — already correct when series match
- The repair path (`0.0.0` → re-download) — untouched

## Tests

| # | Test | Expected |
|---|------|----------|
| 1 | Release with ix-compass-dist v0.3.0 available | `.version` = `"0.3.0"` |
| 2 | `isNewer("0.3.0", "0.3.0")` | false (same version, no upgrade) |
| 3 | `isNewer("0.4.0", "0.3.0")` | true (genuinely newer dist) |
| 4 | `isNewer("0.3.0", "0.4.0")` | false (bundled is newer) |
| 5 | Release with API unavailable | `.version` = Ix version (fallback) |
| 6 | Existing install (Ix-version stamp) → `ix upgrade` | Still works (stamp present, `isNewer` compares same-series) |

Note: test 6 — installs with the old Ix-version stamp will have `.version = "0.9.1"`.
After upgrade writes the dist version, subsequent comparisons use the same series.
This is a one-time transition that resolves itself on the next upgrade.

## Security Considerations

- No change to the upgrade security model
- No new dependency (jq is available on all GitHub runners)
- API call is to public ix-compass-dist releases endpoint — no auth required
- Fallback preserves current behavior if API is unreachable

## Compatibility

- **Backward compatible:** Existing installs with Ix-version stamp still work
- **Forward compatible:** New installs get dist-version stamp
- **No breaking change:** `isNewer` works correctly with both series as long as
  they're internally consistent

## Historical Context

- **PR #365** (KageBinary, merged): Added compass stamp with Ix version
- **PR #366** (KageBinary, merged): Fixed Windows tar extraction
- **Issue #376** (KageBinary, open): Identified the version-series mismatch
- **PR #344** (Joseph Mikhail, merged): Fixed `isNewer` prerelease comparison —
  any #376 fix must preserve this

## Related

- Fixes: #376
- References: #365, #366, #344
- See: `github/issues/376/README.md` for full investigation

## Reviewer Notes

- @KageBinary authored #365 (the stamp) and #376 (this issue) — primary domain expert
- @josephismikhail — code owner review (standard for all Ix PRs)
- The fix is minimal: one line change in release.yml
- The `upgrade.ts` code is already correct — it's the input that's wrong
- Consider whether to also update `install.sh`/`install.ps1` which also write `.version`

## Known Limitations

1. **One-time transition:** Installs with the old Ix-version stamp will have a
   one-cycle mismatch before `ix upgrade` writes the dist version
2. **API dependency:** If GitHub API is down at release time, falls back to Ix
   version (current behavior)
3. **Dist version mapping:** If a new dist release is cut after the Ix release but
   from the same system-compass commit, the stamp will be newer than reality
