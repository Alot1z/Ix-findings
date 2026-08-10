# Master Evidence Registry

Canonical IDs `E-###`. Every finding references its supporting evidence here,
giving the chain: Finding → Evidence → Observation/Reproduction → Conclusion.
Machine-readable: `registry.json`. Evidence types: artifact · source · runtime ·
browser · git · github · test · reproduction · release note · review comment ·
document.

## Artifacts (SHA256-verified Compass releases)

| ID | Item | Class | Type | Detail | Supports |
|---|---|---|---|---|---|
| E-001 | compass-0.1.0.tar.gz | B | artifact | SHA256 `19bc427d0eca77b2…`; Rolldown, 13 chunks; released 2026-03-28 | F-001…F-005 |
| E-002 | compass-0.1.1.tar.gz | B | artifact | SHA256 `74e56488c5daf970…`; hotfix; several chunks byte-identical to v0.1.0 | F-001…F-005 |
| E-003 | compass-0.2.0.tar.gz | B | artifact | SHA256 `863583084c91719f…`; released 2026-06-08; one-shot fit latch present | F-001…F-005 |
| E-004 | compass-0.3.0.tar.gz | B | artifact | SHA256 `7ed6cc82fe58b3ad…`; built from system-compass `main @ 7f98724`; keyed refit effect present | F-001…F-005, F-006 |

## Extraction / analysis results

| ID | Item | Class | Type | Detail | Supports |
|---|---|---|---|---|---|
| E-005 | keyboard switch byte-identity | B | artifact | identical switch + guards across all 4; F/f zero matches in every chunk | F-001, F-002 |
| E-006 | KeyboardHelp extraction | B | artifact | `KeyboardHelp-KnF66B2h.js` (1,784 B): 8 entries, no F; byte-identical across releases | F-003 |
| E-007 | fit-constants extraction | B | artifact | 1200, 700, 56, 1.25, 112, 36, 2.5, 1.1, 96 + contain + snap invariant | F-004 |
| E-023 | source-maps scan | B | artifact | no `.map` files shipped in any release | methodology note |

## GitHub / release notes

| ID | Item | Class | Type | Detail | Supports |
|---|---|---|---|---|---|
| E-008 | v0.3.0 release notes (KageBinary, 2026-08-09) | A | release note | #57/#58/#59; "exists to stop a downgrade"; aggregation 1,471→33; bounded layout; searchable roll-ups; breadcrumb collapse | F-005, F-006, F-007 |
| E-017 | #376 source analysis | A | source | `upgrade.ts` (isNewer, getInstalledCompassVersion, writeCache), `release.yml` stamping, PR #365/#366/#344 history | F-008 |
| E-018 | #371 source analysis | A | source | `patches.ts:6` export; absent from `oss.ts`; in `PRO_COMMANDS` | F-009 |
| E-020 | GitHub maintainer context | A | github | identities/roles (API + last-30-commit history); issue→PR→maintainer map; tagging guidance | methodology, PR planning |

## Source (Ix)

| ID | Item | Class | Type | Detail | Supports |
|---|---|---|---|---|---|
| E-013 | `view.ts` pre-fix bind | A | source | `server.listen(PORT)` no host → binds `::`/`0.0.0.0` (P0) | F-010 (motivation), security audit |
| E-014 | remap diff `c021b52` | A | source/git | 4 files, +250/−11: view.ts endpoint + guard, tests, bootstrap.sh WSL/node_ok, docs | F-010, F-011, F-012 |
| E-024 | `bootstrap.sh` is_windows()/node_ok | A | source | WSL misrouting + dead variable (merged main) | F-011, F-012 |

## Runtime / reproduction

| ID | Item | Class | Type | Detail | Supports |
|---|---|---|---|---|---|
| E-009 | delayed-data A/B runs | B | reproduction | A v0.2.0 0.439@(39,315) 0 cards; B v0.3.0 0.441@(39,388) 0 cards; B2 repeat 0 cards; C fast 0.129@(39,254) visible; `map_rev` constant | F-006 |
| E-010 | F-key PoC (patched v0.3.0) | B | runtime | F ≡ 0 target byte-identical; INPUT guard holds; ⌘K/Esc unchanged; zero console errors | F-001…F-005 (feature safety) |
| E-011 | zoom-contract live checks | B | runtime | ×1.1 in / ×0.9 out / 2.5 cap / floor = fit; ×1.25 button anomaly | F-004, F-013 |
| E-012 | rollup timing A/B | B | runtime | fast 9+1 vs delayed 15, no aggregate; same map_rev | F-007 |
| E-022 | placeholder-fit instability | B | runtime | 0.439 vs 0.441 across runs | F-006 (context) |

## Tests

| ID | Item | Class | Type | Detail | Supports |
|---|---|---|---|---|---|
| E-015 | guard-matrix tests | B | test | 10 scenarios, `ix-cli/test/view-server.test.ts` (real server, real child) | F-010 |
| E-016 | suite runs (fresh) | B | test | vitest 656/2 (51 files), tsc 0, eslint clean — re-run at phases 02 & 12 | F-010, gate |

## Git / topology

| ID | Item | Class | Type | Detail | Supports |
|---|---|---|---|---|---|
| E-019 | git divergence numbers | A | git | main 0/0; fork 5 behind; remap 1 ahead/0 behind; refs `c4f8fea`/`0437abf`/`c021b52`/`b038c46`/`396426b` | git maps |
| E-021 | worktree map | A | git | primary `<IX_REPO>` + linked `<IX_REMAP_WORKTREE>`; standalone `<COMPASS_DIST_REPO>` | git maps |

## Documents / reconstruction

| ID | Item | Class | Type | Detail | Supports |
|---|---|---|---|---|---|
| E-025 | F-key source-equivalent spec | C | document | `tasks/compass-f-key-source-equivalent.md` (in Ix repo tasks/, 2026-08-10): PR material derived from artifact + PoC + review | F-001…F-005 (PR spec) |
