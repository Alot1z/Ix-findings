# FILE-MANIFEST.md — Complete File Inventory with Reading Priorities

> All files in Ix-findings (118 in `planning/`, 28 entries total).
> Priority: MUST → SHOULD → GENERATED → HISTORICAL → OPTIONAL.
> Relative paths from `E:\E-github-repos\Ix-findings\`.

---

## MUST READ (essential to understanding the investigation)

| File | Path | Size | Why |
|---|---|---|---|
| README | `README.md` | 7 KB | Investigation overview |
| MASTER-REPORT | `planning/final/MASTER-REPORT.md` | 10 KB | Complete investigation report |
| EXECUTIVE-SUMMARY | `planning/final/EXECUTIVE-SUMMARY.md` | 2 KB | 2-page summary |
| NEXT-ACTIONS | `planning/final/NEXT-ACTIONS.md` | 3 KB | Prioritized action matrix |
| REMAINING-BLOCKERS | `planning/final/REMAINING-BLOCKERS.md` | 2 KB | What's stuck |
| FINAL-DECISIONS | `planning/final/FINAL-DECISIONS.md` | 1.5 KB | Decided + open decisions |
| findings registry | `planning/findings/registry.json` | 11 KB | Authoritative F-001…F-013 |
| evidence registry | `planning/evidence/registry.json` | 7 KB | Authoritative E-001…E-025 |
| decisions registry | `planning/decisions/registry.json` | 7 KB | Authoritative D-001…D-014 |
| suggestions registry | `planning/suggestions/registry.json` | 9 KB | Authoritative S-001…S-033 |
| investigation map | `planning/maps/investigation-map.json` | 19 KB | Graph model (108 nodes, 75 edges) |
| phases map | `planning/maps/phases.json` | 10 KB | Phase summaries |
| investigation overview | `planning/overview/investigation-overview.md` | 4 KB | High-level narrative |
| phase overview | `planning/overview/phase-overview.md` | 4 KB | Phase-by-phase table |
| current state | `planning/overview/current-state.md` | 3 KB | Repository + branch snapshot |
| remap PR packet | `pr-packets/ix-remap-hardening/README.md` | 8 KB | Remap PR spec |
| F-key PR packet | `pr-packets/compass-f-key/README.md` | 9 KB | F-key PR spec |
| repository map | `planning/repositories/Ix.md` | 2 KB | Ix upstream repo details |
| Ix-findings repo | `planning/repositories/Ix-findings.md` | 1.3 KB | Ledger repo state |

---

## SHOULD READ (supporting context)

| File | Path | Size | Why |
|---|---|---|---|
| Compass KB | `planning/compass/*.md` (7 files) | ~13 KB | Keyboard, fit, lifecycle, delayed-data, reconstruction |
| Ix KB | `planning/ix/*.md` (4 files) | ~7 KB | Remap, security, #376, architecture |
| Git KB | `planning/git/*.md` (5 files) | ~6 KB | Branches, worktrees, commits, forks, sync |
| GitHub KB | `planning/github/*.md` (6 files) | ~8 KB | Issues, PRs, maintainers, releases, comments, references |
| Security | `planning/security/*.md` (2 files) | ~5 KB | Security + privacy audits |
| PR packets | `pr-packets/compass-delayed-data/README.md` | 6 KB | Delayed-data investigation |
| PR packet #376 | `pr-packets/ix-376-version-mismatch/README.md` | 6.5 KB | #376 fix spec |
| Per-phase READMEs | `planning/phases/phase-*/README.md` (15 files) | ~20 KB | Phase-by-phase details |
| PR planning | `planning/pr-planning/*.md` (5 files) | ~7 KB | PR recommendation matrix |
| Stake claims | `CLI-HANDOFF/STALE-CLAIMS.md` | — | Known discrepancies |

---

## GENERATED DATA (parse but don't treat as source of truth)

| File | Path | Size | Notes |
|---|---|---|---|
| Wiki data | `planning/wiki/data/data.js` | 111 KB | Generated from registries — re-validate |
| Wiki standalone | `planning/wiki/index-standalone.html` | 159 KB | Self-contained interactive wiki |
| Evidence map | `planning/maps/evidence-map.json` | 5 KB | Generated graph fragment |
| Finding map | `planning/maps/finding-map.json` | 4 KB | Generated graph fragment |
| Decision map | `planning/maps/decision-map.json` | 4 KB | Generated graph fragment |
| Dependency map | `planning/maps/dependency-map.json` | 4 KB | Generated graph fragment |
| Timeline map | `planning/maps/timeline-map.json` | 3 KB | Generated graph fragment |
| Repository map JSON | `planning/maps/repository-map.json` | 3 KB | Generated graph fragment |
| Manifest indexes | `manifests/*.json` (3 files) | ~16 KB | Phase-era indexes |

---

## HISTORICAL (provenance only — not authoritative)

| File | Path | Notes |
|---|---|---|
| Phase state files | `state/phase-*.md` (5 files) | Records from earlier investigation phases |
| Legacy reports | `reports/master-report.md`, `reports/phase-summaries.md` | Superseded by planning/final/ |
| Comparisons | `comparisons/*.md` (5 files) | Phase-5 reconstruction notes |
| GitHub issues | `github/issues/*/README.md` (3 files) | Per-issue investigation notes |
| Repo map (legacy) | `repositories/repository-map.md` | Superseded by planning/repositories/ + planning/git/ |
| Security (legacy) | `security/findings.md` | Superseded by planning/security/ |
| Phase-4 finding | `findings/phase-4-audit.md` | Phase-era finding — superseded by registry |
| Decision log (legacy) | `decisions/log.md` | Superseded by planning/decisions/ |
| V1 graph (legacy) | `planning/maps/legacy/investigation-map-v1.json` | Previous graph version |

---

## OPTIONAL (inspect only when relevant)

| File | Path | Notes |
|---|---|---|
| Repomix bundle | `planning/wiki/repomix-bundle/output.1.md` | 313 KB — full workspace bundle at generation time |
| Build script | `planning/wiki/build-data.mjs` | 2 KB — data.js generator |
| Wiki assets | `planning/wiki/assets/wiki.css` (10 KB), `wiki.js` (31 KB) | Wiki UI/application code |
| Multi-file wiki | `planning/wiki/index.html` | 2.7 KB — shell that loads assets/data as separate files |
| Artifacts | `artifacts/v0.3.0/compass-0.3.0/**` (20 files) | Downloaded Compass v0.3.0 bundle — 1.4 MB |
| Platform-specific notes | `planning/evidence/artifacts/index.md`, `runtime/index.md`, `source/index.md`, `github/index.md`, `reproduction/index.md` | Evidence sub-indexes |
| Findings cross-cuts | `planning/findings/by-*.md` (4 files) | Finding indexes sliced by class/repo/severity/status |
| Suggestions by disposition | `planning/suggestions/accepted.md`, `rejected.md`, `deferred.md`, `superseded.md` | Suggestion disposition summaries |
| Preview temp | `E:\E-github-repos\Ix\.wiki-preview-tmp\index.html` | Workspace copy of standalone wiki |
| .gitignore | `.gitignore` | 199 bytes |
