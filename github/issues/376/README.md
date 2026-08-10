# Issue #376 — Version-Series Mismatch in Compass Upgrade Check

**URL:** https://github.com/ix-infrastructure/Ix/issues/376  
**Title:** ix upgrade compares two unrelated version series to decide if Compass is stale  
**Author:** KageBinary (Collaborator)  
**Opened:** 2026-08-10  
**Status:** Open  
**Labels:** None  
**Assignee:** None  
**Linked PRs:** None  
**Comments:** 0

## 1. Issue Body (Verbatim)

> The bundled Compass is stamped with the Ix version; ix-compass-dist releases
> use their own series. isNewer compares them directly, so the check is only
> accidentally correct.
>
> Verified on the shipped v0.9.1 linux tarball:
> `compass/.version = 0.9.1` — the Ix version, not a compass version
>
> And the latest ix-compass-dist release is v0.3.0 (2026-08-09).
>
> `upgrade.ts` does `isNewer(compassLatest, compassCurrent)` —
> `isNewer("0.3.0", "0.9.1")` → false, so nothing happens and `ix view` keeps
> the correct bundled build. That is the right outcome, but only because Ix's
> numbers currently happen to be larger.
>
> The moment ix-compass-dist tags anything above the running Ix version —
> v1.0.0, or just v0.9.2 — `isNewer` returns true and `ix upgrade` replaces a
> correct, newer bundled Compass with the dist build. That is the same failure
> v0.9.1 just fixed (#365/#366), reached by a different route.
>
> Options:
> 1. Stamp the bundle with the compass version the release was built from
>    (v0.3.0 was built from system-compass@7f98724), so both sides of the
>    comparison are the same series.
> 2. Stamp the source commit and compare identity rather than order — the
>    question is really "is the installed bundle the one this CLI shipped
>    with", not "is it numerically older".
>
> Either way, `getInstalledCompassVersion` and `writeCache(compassLatest)`
> should not be feeding two different numbering schemes into one isNewer.

## 2. Evidence Classification: Class A (Source-Proven)

All claims verified by direct source inspection:

| Claim | Source | Evidence |
|-------|--------|----------|
| Bundled compass `.version` = Ix version | `release.yml` (PR #365) | `printf '%s' "$VERSION" > "$STAGING/compass/.version"` |
| `compassLatest` from ix-compass-dist | `upgrade.ts:690,746` | `fetchLatestRelease(COMPASS_DIST_REPO)` where `COMPASS_DIST_REPO = "ix-compass-dist"` |
| `compassCurrent` from `.version` file | `upgrade.ts:193-195` | `getInstalledCompassVersion()` reads `COMPASS_VERSION_FILE` |
| Comparison via `isNewer` | `upgrade.ts:678,698,1030` | `isNewer(cache.compassLatest, compassCurrent)` |
| After upgrade, `.version` stamped with dist version | `upgrade.ts:1071` | `writeFileSync(COMPASS_VERSION_FILE, compassLatest)` |
| `isNewer` is semver comparison | `upgrade.ts:141-182` | Full semver precedence implementation |

## 3. Causal Chain

```
Release (PR #365) stamps compass/.version = "0.9.1" (Ix version)
    +
ix-compass-dist latest release = "0.3.0" (dist series)
    =
isNewer("0.3.0", "0.9.1") → false
    ↓
No upgrade triggered — correct outcome by accident
```

**Failure scenario:**

```
Release stamps compass/.version = "0.9.1"
    +
ix-compass-dist releases v1.0.0
    =
isNewer("1.0.0", "0.9.1") → TRUE
    ↓
ix upgrade replaces bundled compass (from main @ release time)
with ix-compass-dist v1.0.0 (older build)
    ↓
Same regression as v0.9.0 bug (#365/#366), different cause
```

## 4. Code Map

### Stamping (release time — PR #365)

File: `.github/workflows/release.yml`

```bash
# The Ix version rather than a compass version: the bundle is built from
# compass main at release time, so it is always at least as new as any
# ix-compass-dist release cut before it...
printf '%s' "$VERSION" > "$STAGING/compass/.version"
```

`$VERSION` = Ix release version (e.g., `0.9.1`), extracted from tag `v0.9.1`.

### Reading (upgrade time)

File: `ix-cli/src/cli/commands/upgrade.ts`

```typescript
const COMPASS_DIST_REPO = "ix-compass-dist";
const COMPASS_VERSION_FILE = join(COMPASS_DIR, ".version");

function getInstalledCompassVersion(): string {
  if (!existsSync(join(COMPASS_DIR, "index.html"))) return "0.0.0";
  return getTrackedVersion(COMPASS_VERSION_FILE);
}

// compassLatest from ix-compass-dist (dist series: "0.3.0")
// compassCurrent from .version (Ix series: "0.9.1")
const hasCompassUpdate =
  cache.compassLatest && isNewer(cache.compassLatest, compassCurrent);
```

### Stamping after upgrade

```typescript
// After successful upgrade from ix-compass-dist, stamps with dist version
writeFileSync(COMPASS_VERSION_FILE, compassLatest);
```

### `isNewer` (semver comparison)

```typescript
export function isNewer(latest: string, current: string): boolean {
  const [lNums, lPre] = splitVersion(latest);
  const [cNums, cPre] = splitVersion(current);
  // ... semver numeric comparison, pre-release handling
}
```

## 5. Historical Context

### Timeline

1. **v0.9.0 released** — bundled compass has no `.version` stamp. `getInstalledCompassVersion()` returns `"0.0.0"`. `isNewer("0.2.0", "0.0.0")` → true. Upgrade silently replaces bundled compass with older ix-compass-dist build.

2. **PR #365** (2026-08-09, KageBinary) — fixes the missing stamp by writing `"$VERSION"` (Ix version) to `compass/.version` during release packaging. Rationale: "the Ix version is a monotonic stand-in" since the bundle is always at least as new as any prior dist release.

3. **PR #366** (2026-08-09, KageBinary) — fixes Windows tar path mismatch that masked the bug on Windows.

4. **Issue #376** (2026-08-10, KageBinary) — recognizes the version-series mismatch between Ix version stamps and ix-compass-dist version numbers. Files as open issue with two proposed solutions.

### PR #365 author's explicit rationale (from merge commit):

> "The Ix version rather than a compass version: the bundle is built from
> compass main at release time, so it is always at least as new as any
> ix-compass-dist release cut before it, which makes the Ix version a
> monotonic stand-in. A genuine dist release published later at a higher
> number is still offered."

This rationale was correct at the time — `isNewer` does work as a monotonic stand-in when ix-compass-dist releases are always numerically lower. But it's a time-bomb: once ix-compass-dist tags a version numerically higher than the running Ix version, the logic inverts.

### PR #365 already noted the eventual risk:

> "install.sh writes this same file after extracting, using the dist release
> number. Either value suppresses the spurious update; the stamp being
> present at all is what matters."

This acknowledges that two different numbering schemes populate the same file. The fix (#365) was a pragmatic immediate mitigation; #376 is the architectural follow-up.

## 6. Proposed Fix Options (from issue body)

### Option A: Stamp with compass version

Stamp `compass/.version` with the ix-compass-dist version the bundled compass corresponds to (e.g., "0.3.0" for the dist release built from the same system-compass commit). Now both sides of `isNewer` use the same series.

**Pros:** Simple. `isNewer` works correctly for all future comparisons.  
**Cons:** The bundled compass is newer than any dist release (built from main), so its stamp would be a version that doesn't exist as a dist release yet. The stamp is a fiction — it says "0.3.0" but the code is main@7f98724.

### Option B: Identity comparison

Instead of comparing version numbers, compare identifiers — stamp the source commit (`compass/.version = "7f98724"`) and compare identity. The question changes from "is the dist release newer?" to "is the installed bundle the one this CLI shipped with?"

**Pros:** Correct by construction — never compares unrelated numbering schemes.  
**Cons:** Changes the semantics of the upgrade check. What about users who installed via `install.sh` with a dist version? Their `.version` would contain the dist version, not a commit hash.

### Option C: Two fields

Stamp both the Ix version AND the compass commit. Compare commit identity for the "is this what we shipped?" check and use dist versions only when a dist release is genuinely newer.

**Pros:** Most robust.  
**Cons:** Larger change. Requires migration for existing installs.

## 7. Relationship to Remap Work

**Not directly related.** The remap PR (`feat/ix-remap-hardening`) changes `view.ts` (the visualizer server), not `upgrade.ts` (the upgrade system). They touch different subsystems:

| Concern | Remap PR | Issue #376 |
|---------|----------|------------|
| File | `ix-cli/src/cli/commands/view.ts` | `ix-cli/src/cli/commands/upgrade.ts` |
| System | Visualizer server / endpoint | Version cache & upgrade logic |
| Guard | Loopback binding, Host/Origin | Version series comparison |

**Indirect relationship:** A broken upgrade (#376 scenario) could replace the bundled compass with an older version, potentially undoing fixes delivered through any future PR. But the remap code itself is unaffected — it runs as part of the CLI, not the Compass bundle.

**Recommendation:** Keep #376 as a separate PR. If both are prepared concurrently, the remap PR should note that it assumes a correctly-stamped compass bundle (which #365 ensures today; #376 hardens for the future).

## 8. Current Status

| Attribute | Value |
|-----------|-------|
| Open/Closed | **Open** |
| Has fix PR | No |
| Assigned | None |
| Priority | Not labeled |
| Blocked by | Nothing |
| Blocks | Nothing |
| Evidence class | Class A (source-proven) |

## 9. Recommended Action

- **Do NOT include in the remap PR** — separate subsystem, different file, different concern
- **Prepare a focused fix PR** — minimal change to `upgrade.ts` and/or `release.yml`
- **Coordinate with KageBinary** — issue author and #365/#366 author; likely has a preferred direction
- **Consider Option A (stamp with compass version)** as the simplest correct fix:
  1. In `release.yml`: read the latest ix-compass-dist tag at release time, stamp `.version` with that tag
  2. In `upgrade.ts`: no change needed — `isNewer` already works correctly when both sides use the same series
  3. In `install.sh`/`install.ps1`: already stamp with dist version — consistent

## 10. Reproduction

Not attempted — the logic is deterministic from source. The failure scenario (what happens when ix-compass-dist version > Ix version) is a logical consequence of the code, not a runtime condition that requires reproduction.

To actually trigger the bug today: publish ix-compass-dist v0.9.2, then run `ix upgrade` on a v0.9.1 install. `isNewer("0.9.2", "0.9.1")` → true; upgrade replaces the bundled compass with the older dist build.

---

*All code references verified by direct source inspection. No claims fabricated.*
