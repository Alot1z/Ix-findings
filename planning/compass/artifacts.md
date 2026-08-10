# Compass — Artifacts

| Artifact | SHA256 (prefix) | Date | Build | Source maps | Source rev |
|---|---|---|---|---|---|
| compass-0.1.0.tar.gz | 19bc427d0eca77b2 | 2026-03-28 | Rolldown, 13 chunks | none | UNKNOWN |
| compass-0.1.1.tar.gz | 74e56488c5daf970 | 2026-03-29 | Rolldown, 13 chunks | none | UNKNOWN |
| compass-0.2.0.tar.gz | 863583084c91719f | 2026-06-08 | Rolldown, 13 chunks | none | UNKNOWN |
| compass-0.3.0.tar.gz | 7ed6cc82fe58b3ad | 2026-08-09 | Rolldown, 13 chunks | none | main @ 7f98724 (SOURCE — release body) |

Provenance: hashes = ARTIFACT (SHA256-verified against published `.sha256`);
build/chunks = ARTIFACT; dates = RECONSTRUCTION (see R-01 reconciliation).

## Chunk architecture (ARTIFACT — identical across releases)

`index-*` (main, ~91 KB) · `react-vendor-*` · `motion-*` (Framer Motion) ·
`radix-*` · `KeyboardHelp-*` (~1.8 KB) · `CommandBar-*` (~16 KB) · `query-*`
(TanStack Query) · `icons-*` · `EntityDetailPanel-*` · `TimelineScrubber-*` ·
`vendor-*` · `rolldown-runtime-*` (v0.3.0) · `index-*.css`.

## What artifacts can and cannot prove

**Can prove:** behavior surface, constants, byte-identity, presence/absence of
bindings, build tool, absence of source maps — all B-class evidence.

**Cannot prove:** source file names, line anchors, identifiers, architecture —
minified names (`Cn`, `Sn`, `Zt`, `Ie`, `J`, `k`) are descriptive labels only,
never source names (INFERENCE).

## Local copies

- Extracted copy of v0.3.0: `<IX_FINDINGS>/artifacts/v0.3.0/` (gitignored).
- Tarball + `.sha256`: `<COMPASS_DIST_REPO>/` (untracked).
- v0.1.0/v0.1.1 recovered into a temp research dir during the deep-dive; the
  tarballs themselves are not stored in Ix-findings (reproducible).
