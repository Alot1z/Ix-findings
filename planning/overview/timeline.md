# Investigation Timeline

Reconciled chronology. **Date note:** `manifests/artifact-sha256.json`
`release_date` values (2026-08-07/08) contradict the release timeline
(2026-03-28 / 03-29 / 06-08) corroborated by `comparisons/releases/timeline.md`,
`repositories/repository-map.md` and `manifests/investigation-index.json`; the
March/June dates are used here (see `final/verification.md` R-01).

## Compass release history

| Date | Event | Repo | Evidence |
|---|---|---|---|
| 2026-03-28 | Compass v0.1.0 released (TannerTorrey3) | ix-compass-dist | E-001 |
| 2026-03-29 | Compass v0.1.1 released (hotfix; several byte-identical chunks) | ix-compass-dist | E-002 |
| 2026-06-08 | Compass v0.2.0 released | ix-compass-dist | E-003 |
| 2026-08-09 | Compass v0.3.0 released (KageBinary) — #57 refit, bounded layout, aggregation; "exists to stop a downgrade" | ix-compass-dist | E-004, E-008 |

## Ix history relevant to the investigation

| Date | Event | Evidence |
|---|---|---|
| ~2026-08-09 | Ix v0.9.0/v0.9.1 release; PRs #365 (compass .version stamp) + #366 (tar pairing) merged | E-017 |
| 2026-08-09/10 | PR #368 (ix agent skill + HTTP API docs) merged → `2157158`; review by KageBinary redirected fit-view work to system-compass | E-020 |
| 2026-08-10 | Issues #371 (patches dead) and #376 (version-series mismatch) opened by KageBinary | E-017, E-018 |
| 2026-08-10 | `main` merged up to `c4f8fea` (deps #369/#370, refactor #363) | E-019 |

## Investigation phases (all 2026-08-10 unless noted)

| # | Event | Evidence / Output |
|---|---|---|
| 00 | Initial state audit; 18-file overhaul discovered; fork 5 behind; system-compass 404 | `../state/phase-0-audit.md` |
| 01 | Local main synced via `git branch -f` (no checkout); 18 files preserved | `../state/phase-1-sync-report.md` |
| 02 | Remap finalized: real /__ix/remap + guard matrix; 656 tests | `../state/phase-2-remap-report.md` |
| 03 | #376 source analysis | `../github/issues/376/README.md` |
| 04 | Security + historical audit; P0 bind found/fixed; posture STRONG | `../findings/phase-4-audit.md` |
| 05 | Compass archaeology: artifacts recovered + SHA256-verified + behavioral diff | `../comparisons/*` |
| 05 (later) | v0.1.0/v0.1.1 recovered; 4-way byte comparison; `tasks/compass-historical-reconstruction.md` | E-001…E-008 |
| 06 | F-key source-access gate: BLOCKED; spec finalized | `../state/phase-6-f-key-gate.md` |
| 07 | Delayed-data A/B (60 s proxy): blank on v0.2.0×1 + v0.3.0×2; fast path correct; rollup timing; zoom ×1.25 anomaly | `../comparisons/camera-fit/delayed-data-investigation.md` |
| 08 | Repository architecture audit (5 repos) | `../repositories/repository-map.md` |
| 09 | Ix-findings built as evidence ledger | `../README.md`, `../manifests/*` |
| 10 | GitHub/maintainer context reconciled | `../github/maintainer-context.md` |
| 11 | 4 PR packets generated | `../pr-packets/*` |
| 12 | Fresh publication gate (remap) — READY | `../state/phase-12-publication-gate.md` |
| 13 | (pending) push + open PR — **requires authorization** | — |
| final | Master audit, reconciliation, knowledge graph, wiki, master report | this `planning/` layer |

## Prior work folded into phase-00/05 context (before the ledger existed)

| Date | Event |
|---|---|
| 2026-08-10 | F-key PoC on patched v0.3.0 bundle (:8095, real backend) — F ≡ 0 target byte-identically |
| 2026-08-10 | `tasks/compass-f-key-source-equivalent.md` (PR material) + `tasks/plan.md`/`todo.md` written |
| 2026-08-10 | Ix PR 2 (remap) prepared in `<IX_REMAP_WORKTREE>` @ `c021b52` |

## Key chain: finding → PR

```
F-010 (remap) → c021b52 → PR packet → phase-13 push/PR (authorization)
F-008 (#376)  → packet → separate PR (authorization + maintainer direction)
F-001..005 (F-key) → spec → system-compass PR (source access)
F-006/007 (delayed-data) → investigation packet → system-compass issue/PR (source access)
```
