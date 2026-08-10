# Compass Release Timeline & Evidence Map

## Release History

| Release | Date | Released By | Source Rev | Artifact SHA256 |
|---------|------|-------------|------------|-----------------|
| v0.1.0 | 2026-03-28 | TannerTorrey3 | unknown | `19bc427d0eca77b2…` |
| v0.1.1 | 2026-03-29 | TannerTorrey3 | unknown | `74e56488c5daf970…` |
| v0.2.0 | 2026-06-08 | TannerTorrey3 | unknown | `863583084c91719f…` |
| v0.3.0 | 2026-08-09 | KageBinary | system-compass main @ 7f98724 | `7ed6cc82fe58b3ad…` |

## Release Cadence

- **v0.1.0 → v0.1.1:** 1 day (hotfix)
- **v0.1.1 → v0.2.0:** ~71 days (major update)
- **v0.2.0 → v0.3.0:** ~62 days (major update, #57/#58/#59)

## Evidence Class Map

| Evidence | Class | Source |
|----------|-------|--------|
| Keyboard handler invariant (all 4) | B | Byte comparison of extracted JS |
| KeyboardHelp invariant (all 4) | B | Byte comparison of KeyboardHelp chunk |
| F/f unbound (all 4) | B | Zero grep matches in any version |
| Fit math constants (all 4) | B | Constant extraction from JS bundles |
| Zoom contract (all 4) | B | Live behavior + constant patterns |
| One-shot fit latch (v0.1.0–v0.2.0) | A | v0.3.0 release notes confirm |
| Keyed refit effect (v0.3.0) | A | v0.3.0 release notes |
| Delayed-data blank | B | Reproduced v0.2.0 × 1, v0.3.0 × 2 |
| Region rollup timing | B | Observed fast vs delayed runs |
| Root aggregation 1,471→33 | A | v0.3.0 release notes |
| Bounded layout (gravity + repulsion cutoff) | A | v0.3.0 release notes |
| Breadcrumb collapse (6+) | A | v0.3.0 release notes |
| Search reaches rolled-up regions | A | v0.3.0 release notes |

## v0.3.0 Release Notes (Full, Class A Evidence)

> **Built from ix-infrastructure/system-compass main @ 7f98724.**
>
> This release exists to stop a downgrade. Ix v0.9.0 bundles a compass built from
> the same source, but the bundled copy carries no .version stamp, so ix upgrade
> reads the installed version as none and tries to "update" it from this repo.
> With v0.2.0 (2026-06-08) as the latest here, that replaced the fixed map with
> a two-month-old build. Anyone who already hit it is repaired by upgrading again.
>
> **What changed since v0.2.0:**
>
> - The root view is readable. 1,471 root regions aggregate to 33, with the long
>   tail folded into a roll-up that drills in recursively. Fit zoom 0.0044 → 0.184:
>   a 300px node now draws 55px wide instead of 1.3px.
> - Layout is bounded. Fruchterman-Reingold gained gravity toward the centroid and
>   a repulsion cutoff, so edgeless nodes stop drifting. Layout time 15.3s → under
>   90ms.
> - The viewport re-fits when the canvas changes. The fit used to run once against
>   the 1200×700 placeholder and latch, so the map rendered blank until something
>   else re-centred it.
> - Search reaches rolled-up regions. Navigating to a region folded into a roll-up
>   now produces a drill stack whose view actually draws it.
> - The breadcrumb collapses past six crumbs instead of running off the side of
>   the screen.
>
> **system-compass #57, #58, #59.**

## Change Classification

| Change | v0.1.0 | v0.1.1 | v0.2.0 | v0.3.0 |
|--------|--------|--------|--------|--------|
| Initial release | ✓ | — | — | — |
| Hotfix | — | ✓ | — | — |
| One-shot fit latch | ✓ | ✓ | ✓ | ✗ |
| Keyed refit effect | ✗ | ✗ | ✗ | ✓ |
| Region rollup | ✗ | ✗ | ✗ | ✓ |
| Bounded layout | ✗ | ✗ | ✗ | ✓ |
| Breadcrumb collapse | ✗ | ✗ | ✗ | ✓ |
| Search rolled-up regions | ✗ | ✗ | ✗ | ✓ |

## Artifact Chunk Architecture

All four releases share the same Rolldown chunk pattern:

```
assets/
├── index-*.js              ← Main app bundle (~91KB v0.3.0)
├── react-vendor-*.js       ← React (~178KB)
├── motion-*.js             ← Framer Motion (~125KB)
├── radix-*.js              ← Radix UI (~90KB)
├── KeyboardHelp-*.js       ← Keyboard help component (~1.8KB)
├── CommandBar-*.js         ← Command palette (~16KB)
├── query-*.js              ← TanStack Query (~24KB)
├── icons-*.js              ← Icon library (~18KB)
├── EntityDetailPanel-*.js  ← Entity detail panel (~24KB)
├── TimelineScrubber-*.js   ← Timeline (~2KB)
├── vendor-*.js             ← Other vendor (~109KB)
├── rolldown-runtime-*.js   ← Rolldown runtime (~0.9KB)
└── index-*.css             ← Styles
```

v0.1.0 and v0.1.1 share several byte-identical chunks (same hash in filename).
