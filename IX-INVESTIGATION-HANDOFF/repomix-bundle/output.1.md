This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: .git, node_modules, **/repomix-bundle, **/repomix-output*, *.lock, *.log
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Files

## File: BRANCH-MATRIX.md
````markdown
# BRANCH-MATRIX.md — All Branches Across All Repos

> Every branch referenced in the investigation, with SHA, relationship, and status.
> ALL values: DESKTOP-OBSERVED — REVALIDATE WITH CLI.

---

## Ix — Local Branches

| Branch | SHA | Base | Ahead/Behind | Worktree | Purpose |
|---|---|---|---|---|---|
| `main` | `c4f8fea` | `origin/main` | synchronized | (not checked out) | Upstream main |
| `feat/ix-agent-skill` | `b038c46` | diverged from main | N/A | `E:\E-github-repos\Ix` | User's ongoing overhaul (13 uncommitted changes) |
| `feat/ix-remap-hardening` | `c021b52` | `origin/main` | ahead 1 | `E:\E-github-repos\Ix-remap` | PR-ready remap hardening |

---

## Ix — Origin Remote (ix-infrastructure/Ix) — Key Branches

| Branch | SHA | Purpose |
|---|---|---|
| `origin/main` | `c4f8fea` | Upstream main (DEP0169 + dev-deps bump) |
| `origin/pr-368-head` | `0c9087c` | PR #368 merged head |
| `origin/fix/view-reports-running-port` | `c5357aa` | View port reporting fix |
| `origin/fix/view-port-mismatch-warning` | `95d76b9` | View port mismatch warning |
| `origin/fix/windows-short-temp-path` | `a52f275` | Windows TEMP path fix |
| `origin/fix/windows-tar-cygpath-pairing` | `f434f9d` | Windows tar pairing fix |
| `origin/fix/installer-ghcr-denied-diagnostics` | `14eb350` | Installer diagnostics |
| `origin/fix/stamp-bundled-compass-version` | `83c4308` | Compass stamp fix |
| `origin/fix/release-prerelease-handling` | `77e8a5e` | Release handling |
| `origin/fix/progress-frames-non-tty` | `decd85e` | Progress frames fix |
| `origin/feat/llm-format-coverage` | `86f3684` | LLM format coverage |
| `origin/chore/brew-update-v0.9.1` | `23fdc9a` | Brew formula update |
| `origin/chore/raise-node-floor-to-22` | `0bc722d` | Node version floor |

---

## Ix — Fork Remote (Alot1z/Ix) — Key Branches

| Branch | SHA | vs origin/main | Purpose |
|---|---|---|---|
| `fork/main` | `0437abf` | 5 behind | Fork main — NEEDS SYNC |
| `fork/feat/ix-agent-skill` | `0c9087c` | PR #368 head | PR submission (monkey-patch stripped) |
| `fork/chore/brew-update-v0.9.1` | `23fdc9a` | — | Brew update |
| `fork/chore/raise-node-floor-to-22` | `0bc722d` | — | Node floor |
| `fork/fix/view-reports-running-port` | `c5357aa` | — | View port fix |
| `fork/fix/view-port-mismatch-warning` | `72c0b85` | — | Port mismatch |
| `fork/fix/installer-docker-autoinstall-noop` | `4475d24` | — | Docker installer |
| `fork/fix/windows-short-temp-path` | `e3b591c` | — | TEMP path |
| `fork/fix/windows-tar-cygpath-pairing` | `f434f9d` | — | Tar pairing |
| `fork/fix/release-prerelease-handling` | `77e8a5e` | — | Release |
| `fork/feat/remote-runner-and-create-client` | `f4259b7` | — | Remote runner (Pro) |

---

## Ix — Agent-Skill Branch Divergence

```
LOCAL: feat/ix-agent-skill @ b038c46  (13 uncommitted changes, full Compass patch)
                               ↑
                         DIVERGED — different content, same base concept
                               ↓
FORK:  fork/feat/ix-agent-skill @ 0c9087c  (PR #368 head, monkey-patch stripped)
```

---

## ix-compass-dist

| Branch | SHA | Status |
|---|---|---|
| `main` | `396426b` | Clean + untracked v0.3.0 artifacts |

---

## Ix-findings

| Branch | SHA | Status |
|---|---|---|
| `master` | N/A (no commits) | 0 commits, 28 untracked entries |

---

## system-compass

| Branch | Status |
|---|---|
| UNKNOWN | PATH UNKNOWN — private repo, no local clone |
````

## File: CLI-READING-PLAN.md
````markdown
# CLI-READING-PLAN.md — Ordered Reading Plan for Freebuff CLI

> Designed to build understanding incrementally — from overview → structure → detail → graph.
> STOP if you encounter a contradiction and report it.

---

## Phase 1 — Orientation (5 minutes)

Read these in order:

1. `IX-INVESTIGATION-HANDOFF/README.md` — what this handoff contains
2. `IX-INVESTIGATION-HANDOFF/REPOSITORIES.md` — every repository with URLs
3. `IX-INVESTIGATION-HANDOFF/PATHS.md` — exact filesystem paths
4. `IX-INVESTIGATION-HANDOFF/GIT-STATE.md` — current Git state

**After phase 1, you should know:**
- What repos exist, where they're cloned, what forks exist
- What branch is active, what worktrees exist
- What must NOT be touched (feat/ix-agent-skill, ix-compass-dist)

---

## Phase 2 — Investigation Context (10 minutes)

Read in order:

1. `planning/final/EXECUTIVE-SUMMARY.md` — the big picture
2. `IX-INVESTIGATION-HANDOFF/FINDINGS.md` — all 13 findings with evidence
3. `IX-INVESTIGATION-HANDOFF/DECISIONS.md` — all 14 decisions
4. `IX-INVESTIGATION-HANDOFF/PR-MATRIX.md` — PR/issue relationships
5. `planning/final/MASTER-REPORT.md` — full investigation report

**After phase 2, you should know:**
- What was verified, what was proven, what remains uncertain
- What decisions were made and why
- What PRs/commits/findings/evidence connect how

---

## Phase 3 — Live Git Verification (15 minutes)

Without modifying anything:

1. cd to `E:\E-github-repos\Ix`
2. Run: `git status -sb`, `git branch -vva`, `git worktree list`
3. Compare every value against `GIT-STATE.md` and `BRANCH-MATRIX.md`
4. Record ALL discrepancies — even minor (different ahead/behind counts, different untracked files)
5. cd to `E:\E-github-repos\Ix-remap` — verify clean state, test count
6. cd to `E:\E-github-repos\Ix-findings` — verify 0 commits, 28 untracked
7. cd to `E:\E-github-repos\ix-compass-dist` — verify clean + untracked artifacts

**Output:** a validation report showing every verified claim and every discrepancy.

---

## Phase 4 — Registry Verification (15 minutes)

1. Parse `planning/findings/registry.json` — verify 13 entries, F-001…F-013
2. Parse `planning/evidence/registry.json` — verify 25 entries, E-001…E-025
3. Parse `planning/decisions/registry.json` — verify 14 entries, D-001…D-014
4. Parse `planning/suggestions/registry.json` — verify 33 entries, S-001…S-033
5. Parse `planning/maps/investigation-map.json` — verify node/edge counts
6. Cross-check the counts against `README.md`, `FINDINGS.md`, `EVIDENCE.md`
7. Verify every Finding → Evidence → Source chain in the registry is intact

**Output:** a registry integrity report.

---

## Phase 5 — Deep File Audit (variable)

Read these supporting files:

1. `planning/overview/*.md` (7 files) — investigation overview layer
2. `planning/compass/*.md` (7 files) — Compass knowledge base
3. `planning/ix/*.md` (4 files) — Ix knowledge base
4. `planning/git/*.md` (5 files) — Git knowledge base
5. `planning/github/*.md` (6 files) — GitHub context
6. `planning/security/*.md` (2 files) — Security + privacy
7. All per-phase READMEs — `planning/phases/phase-*/README.md` (15 files)
8. PR packets — `pr-packets/*/README.md` (4 files)
9. `planning/pr-planning/*.md` (5 files)

Cross-reference every claim against the registries.

---

## Phase 6 — Interactive Wiki Verification

1. Open `planning/wiki/index-standalone.html` in a browser
2. Verify:
   - Investigation Map loads with all nodes
   - All 12 views switch correctly
   - Search returns findings
   - Detail drawer shows evidence/suggestions
   - Timeline filters work
   - No console errors
3. Report any rendering bugs

---

## Phase 7 — Repository Deep Scan

For each accessible repository (`Ix`, `Ix-remap`, `ix-compass-dist`):

1. List all branches (local + remote) — compare to handoff
2. Inspect key commits (diffs for remap branch, PR history)
3. Run `tsc --noEmit` and `npm test` (or equivalent) — verify suite state
4. Build a file inventory of source directories
5. Extract symbol relationships (functions, classes, imports)
6. Map PRs to commits to files to findings

Do NOT modify any file, branch, or worktree.

---

## Phase 8 — Graph Expansion

See `GRAPH-AUDIT.md` for the full specification. Key steps:

1. For each MISSING category, build nodes + edges
2. Follow the schema in `GRAPH-AUDIT.md`
3. Update `planning/maps/investigation-map.json`
4. Run `cd planning/wiki && node build-data.mjs`
5. Rebuild `index-standalone.html` (inline CSS + data.js + wiki.js)
6. Update workspace preview copy

---

## Phase 9 — Public Data Enrichment

Using the URLs in `PUBLIC-REFERENCES.md`:

1. Fetch public PR metadata (titles, authors, merge status, labels)
2. Fetch public commit metadata (messages, files changed)
3. Fetch release notes from ix-compass-dist
4. Cross-reference against findings and evidence registries
5. Flag any new finding-worthy observations

Do NOT attempt to access system-compass (private repository).

---

## Phase 10 — Final Integrity Audit

1. Run the full discrepancy scan from `STALE-CLAIMS.md`
2. Every claim in the handoff must match live state
3. Every finding must have intact evidence chain
4. Every decision must be internally consistent
5. Generate final validation report
6. Update `STALE-CLAIMS.md` with any new discrepancies found

---

## Phase 11 — Output Generation

1. Generate updated `manifest.json` (repos, paths, branches, findings, decisions, graph)
2. Generate provenance report (what came from where)
3. Generate consistency report (cross-registry integrity)
4. Generate master report update (if any change warrants it)
5. Save everything to `IX-INVESTIGATION-HANDOFF/` and `planning/final/`
````

## File: DECISIONS.md
````markdown
# DECISIONS.md — Decision Registry (D-001…D-014)

> Authoritative: `../planning/decisions/registry.json`

---

## Decided (D-001…D-009)

| ID | Decision | Phase | Consequence |
|---|---|---|---|
| D-001 | Remap based on origin/main | 01 | Clean PR base — not contaminated by fork history |
| D-002 | Dedicated worktree for remap | 01 | 18-file overhaul isolated from agent-skill work |
| D-003 | Evidence classification A/B/C/D | 04 | No overclaiming — every statement tagged |
| D-004 | Release notes = Class A (behavior) | 05 | #57/#376 claims grounded in published release notes |
| D-005 | F-key = keyboard exposure only | 06 | Smallest change — zero conflict with existing bindings |
| D-006 | Delayed-data separate from F-key | 06 | Two packets — not combined |
| D-007 | ix-compass-dist never modified | 08 | Distribution channel safe |
| D-008 | Ix-findings standalone ledger | 09 | Evidence separate from code |
| D-009 | No remote action without authorization | 12 | Nothing pushed, opened, merged, or released |

---

## Open — Maintainer/User Decisions (D-010…D-014)

| ID | Question | Recommended | Evidence | Status |
|---|---|---|---|---|
| D-010 | Where to prep the Compass port | Standalone prep repo | D-007, S-002 | **AWAITING** |
| D-011 | Compass PR scope | F key + help + hint chip only | F-001..F-005, S-001 | **AWAITING** |
| D-012 | No-map chip timing | Defer + feature-detect after remap | S-020 | **AWAITING** |
| D-013 | Stopgap patch fate | Keep local + document expiry | S-017, D-007 | **AWAITING** |
| D-014 | system-compass access path | Ask KageBinary in #368 | PR #368 context | **AWAITING** |

---

## Decision Alternatives Recorded

For each decision, the registry (`../planning/decisions/registry.json`) records:
- Options considered
- Chosen option
- Rejected alternatives
- Reason for rejection
- Related evidence
- Related findings

---

## CLI Verification

1. Verify all 14 decisions are internally consistent
2. Check no decision contradicts any finding
3. Flag any decision that was made on incomplete evidence
4. D-010…D-014 are user-facing — do NOT change them
````

## File: EVIDENCE.md
````markdown
# EVIDENCE.md — Evidence Registry Summary (E-001…E-025)

> Authoritative: `../planning/evidence/registry.json`
> Classes: A=source, B=artifact/runtime, C=reconstruction, D=inference

---

## Evidence Inventory

| ID | Description | Class | Source | Repo |
|---|---|---|---|---|
| E-001 | compass-0.1.0 artifact | B | Downloaded release | ix-compass-dist |
| E-002 | compass-0.1.1 artifact | B | Downloaded release | ix-compass-dist |
| E-003 | compass-0.2.0 artifact | B | Downloaded release | ix-compass-dist |
| E-004 | compass-0.3.0 artifact | B | Downloaded release | ix-compass-dist |
| E-005 | keyboard byte-identity across 4 releases | B | Byte diff of extracted handlers | system-compass |
| E-006 | KeyboardHelp extraction & comparison | B | Extracted from 4 artifacts | system-compass |
| E-007 | fit constants extraction & comparison | B | Extracted from 4 artifacts | system-compass |
| E-008 | v0.3.0 release notes (#57, #58, #59) | A | GitHub release | ix-compass-dist |
| E-009 | delayed-data A/B runs (3× reproduction) | B | Live runtime probe | system-compass |
| E-010 | F-key PoC (runtime inject) | B | Runtime test | system-compass |
| E-011 | zoom contract checks (×1.25 vs ×1.1) | B | Runtime measurement | system-compass |
| E-012 | rollup timing A/B comparison | B | Runtime timing probe | system-compass |
| E-013 | view.ts pre-fix bind (0.0.0.0) | A | Source code | ix-infrastructure/Ix |
| E-014 | remap diff (c021b52) | A | Git diff | ix-infrastructure/Ix |
| E-015 | guard-matrix tests + 656 suite | A | Test output | ix-infrastructure/Ix |
| E-016 | test suite runs (656/2, tsc, eslint) | A | Test infrastructure | ix-infrastructure/Ix |
| E-017 | #376 source analysis | A | Source code analysis | ix-infrastructure/Ix |
| E-018 | #371 source analysis | A | Source code analysis | ix-infrastructure/Ix |
| E-019 | git divergence numbers (fork vs upstream) | A | Git output | ix-infrastructure/Ix |
| E-020 | GitHub maintainer context | A | GitHub API / git log | ix-infrastructure/Ix |
| E-021 | worktree map | A | git worktree list | ix-infrastructure/Ix |
| E-022 | placeholder-fit instability | B | Runtime observation | system-compass |
| E-023 | no source maps in compiled bundle | B | Artifact inspection | ix-compass-dist |
| E-024 | bootstrap.sh WSL/node_ok fix context | A | Source code | ix-infrastructure/Ix |
| E-025 | F-key source-equivalent spec | C | Reconstruction | system-compass |

---

## Evidence Classification Summary

| Class | Count | Meaning |
|---|---|---|
| A | 13 | Source-proven (code, git, test output, GitHub API) |
| B | 11 | Artifact/runtime (observed behavior, byte diffs, probes) |
| C | 1 | Reconstruction (synthesized from observations) |
| D | 0 | Inference (no standalone D-class evidence items) |

---

## Evidence-to-Finding Mapping

See `FINDINGS.md` for the full trace.
````

## File: FILE-MANIFEST.md
````markdown
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
| Stake claims | `IX-INVESTIGATION-HANDOFF/STALE-CLAIMS.md` | — | Known discrepancies |

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
````

## File: FINDINGS.md
````markdown
# FINDINGS.md — Complete Finding Registry (F-001…F-013)

> Authoritative count: **13 findings**.
> Source: `../planning/findings/registry.json` (canonical).
> Evidence class: A=source, B=artifact/runtime, C=reconstruction, D=inference.

---

| ID | Title | Class | Repo | Severity | Status | Evidence |
|---|---|---|---|---|---|---|
| **F-001** | Keyboard handler invariant across 4 releases | B | system-compass | — | REPRODUCED | E-005, E-006 |
| **F-002** | F/f genuinely unbound in all releases | B | system-compass | — | REPRODUCED | E-005, E-006, E-007 |
| **F-003** | KeyboardHelp byte-identical, no F entry | B | system-compass | — | VERIFIED | E-005, E-007 |
| **F-004** | Fit math + constants invariant | B | system-compass | — | VERIFIED | E-005, E-007 |
| **F-005** | #57 one-shot fit latch → keyed refit (v0.2.0 → v0.3.0) | A+ | system-compass | — | CONFIRMED | E-008 (release notes) |
| **F-006** | Delayed-data blank persists on v0.3.0 | B+ | system-compass | P1 | REPRODUCED_LIVE | E-009, E-012 |
| **F-007** | Region-rollup aggregate formation timing-dependent | B | system-compass | P2 | OBSERVED | E-009, E-012 |
| **F-008** | Version-series mismatch in `ix upgrade` (#376) | A | ix-infrastructure/Ix | P1 | OPEN | E-017 |
| **F-009** | `patches` command dead/unregistered (#371) | A | ix-infrastructure/Ix | P2 | OPEN | E-018 |
| **F-010** | Loopback-hardened /__ix/remap endpoint (IMPLEMENTED) | A | ix-infrastructure/Ix | — | PR_READY | E-014, E-015, E-016 |
| **F-011** | WSL bootstrap fix | A | ix-infrastructure/Ix | — | IN_REMAP_PR | E-014, E-015 |
| **F-012** | Dead node_ok removal | A | ix-infrastructure/Ix | — | IN_REMAP_PR | E-014, E-015 |
| **F-013** | Zoom-in multiplier discrepancy (×1.25 observed vs ×1.1 in constants) | D | system-compass | P3 | OPEN | E-011 |

---

## Finding-to-Evidence Trace

```
F-001 ─── E-005, E-006                    (keyboard byte-identity)
F-002 ─── E-005, E-006, E-007             (F/f unbound)
F-003 ─── E-005, E-007                    (KeyboardHelp)
F-004 ─── E-005, E-007                    (fit math)
F-005 ─── E-008                           (release notes, Class A)
F-006 ─── E-009, E-012                    (delayed-data A/B runs)
F-007 ─── E-009, E-012                    (rollup timing A/B)
F-008 ─── E-017                           (#376 source analysis)
F-009 ─── E-018                           (#371 source analysis)
F-010 ─── E-014, E-015, E-016             (remap diff, tests, suite)
F-011 ─── E-014, E-015                    (WSL fix in remap branch)
F-012 ─── E-014, E-015                    (dead code removal)
F-013 ─── E-011                           (zoom anomaly)
```

---

## Finding-to-Phase Trace

```
F-001..F-004  → phase-05 (Compass artifact reconstruction)
F-005          → phase-05 (release-note analysis, Class A)
F-006, F-007   → phase-07 (delayed-data deep probe)
F-008, F-009   → phase-03 (#376 analysis), phase-04 (security audit)
F-010..F-012   → phase-02 (remap finalization)
F-013          → phase-05 (zoom contract anomalies)
```

---

## Finding-to-Repo Trace

```
ix-infrastructure/Ix:
  F-008, F-009, F-010, F-011, F-012

system-compass (source-constrained):
  F-001, F-002, F-003, F-004, F-005, F-006, F-007, F-013
```

---

## CLI Verification Required

For every finding:

1. Re-read the evidence files (E-001…E-025 from registry)
2. Cross-check the finding title/status against live repo state
3. Flag any finding whose evidence chain is incomplete
4. Do NOT change finding IDs or titles — add new findings as F-014+

**Current status assessment (from Desktop audit):**
- All F-001…F-013 have supporting evidence in E-001…E-025
- F-005 has Class A evidence (release notes as behavioral source)
- F-001…F-004 and F-006, F-007 are Class B (artifact/runtime — verified but not from source)
- F-013 is Class D (inference — unverified zoom anomaly)
- No fabricated findings detected
````

## File: FREEBUFF-CLI-PROMPT.md
````markdown
# FREEBUFF CLI INVESTIGATION PROMPT

You are Freebuff CLI, receiving a completed Desktop investigation handoff for the
**Ix / Compass investigation**.

---

## YOUR JOB

You are NOT the Desktop agent that performed the original investigation.
You are a fresh CLI agent receiving a complete handoff.

Your task: perform a **read-only, evidence-first deep investigation** of the Ix
and Compass repositories, validating every claim, expanding the knowledge graph,
and producing an updated canonical record.

---

## WHAT YOU ARE INVESTIGATING

The Ix project (ix-infrastructure/Ix) is a browser-based mapping/visualization
tool. A compiled distribution of its map UI ships as "Compass"
(ix-infrastructure/ix-compass-dist); the Compass SOURCE lives in a separate,
**private** repository (ix-infrastructure/system-compass) to which you do NOT
have access.

A previous feature thread (Ix PR #368) produced a Compass fit-view prototype
(F-key keyboard shortcut). The maintainer (KageBinary) redirected the work:
the feature belongs in system-compass, not Ix. An autonomous multi-phase
Desktop investigation then audited, verified, and consolidated everything
across 13 findings, 25 evidence items, 33 AI-agent suggestions, and 14
decisions — all of which you must now independently revalidate.

---

## HANDOFF LOCATION

The complete handoff is at:

```
E:\E-github-repos\Ix-findings\IX-INVESTIGATION-HANDOFF\
```

Start by reading the handoff files in this order:

1. `README.md` — handoff index and summary
2. `REPOSITORIES.md` — every repository, URL, and fork relationship
3. `PATHS.md` — exact local filesystem paths for everything
4. `GIT-STATE.md` — current Git state (branches, SHAs, worktrees)
5. `BRANCH-MATRIX.md` — all branches across all repos
6. `PR-MATRIX.md` — every PR and issue referenced
7. `FINDINGS.md` — all 13 findings with evidence links
8. `DECISIONS.md` — all 14 decisions (9 decided, 5 open)
9. `GRAPH-AUDIT.md` — what the existing graph contains and is missing
10. `STALE-CLAIMS.md` — known discrepancies to watch for
11. `FILE-MANIFEST.md` — complete file inventory with reading priorities
12. `CLI-READING-PLAN.md` — ordered 11-phase reading/audit plan

---

## CANONICAL INVESTIGATION LAYER

The authoritative registries are at:

```
E:\E-github-repos\Ix-findings\planning\
```

Key files:
- `findings/registry.json` — 13 findings (F-001…F-013)
- `evidence/registry.json` — 25 evidence items (E-001…E-025)
- `decisions/registry.json` — 14 decisions (D-001…D-014)
- `suggestions/registry.json` — 33 AI-agent suggestions (S-001…S-033)
- `maps/investigation-map.json` — graph model (108 nodes, 75 edges)

The MARKDOWN files in the handoff are DERIVATIVE summaries.
The JSON registries are CANONICAL.
When they conflict, trust the JSON registries.

---

## REPOSITORIES TO INSPECT

| Repository | Local Path | Access |
|---|---|---|
| ix-infrastructure/Ix | `E:\E-github-repos\Ix` | Full read |
| Ix remap worktree | `E:\E-github-repos\Ix-remap` | Full read |
| ix-compass-dist | `E:\E-github-repos\ix-compass-dist` | Full read |
| Ix-findings | `E:\E-github-repos\Ix-findings` | Full read (this is the investigation ledger) |
| Alot1z/Ix (fork) | `fork` remote on Ix | Fetch + read |
| system-compass | NONE | PRIVATE — DO NOT ATTEMPT |

---

## YOUR EXECUTION PLAN

Follow `CLI-READING-PLAN.md` — it describes 11 phases from orientation through
final output generation. In summary:

### Phase 1: Orientation
Read the four core handoff files to understand repo layout and Git state.

### Phase 2: Investigation Context
Read the executive summary, findings, decisions, and PR matrix.

### Phase 3: Live Git Verification
Without modifying ANYTHING, verify every Git claim against live state.
Record all discrepancies.

### Phase 4: Registry Verification
Parse all four registry JSONs. Verify counts. Cross-check.

### Phase 5: Deep File Audit
Read all supporting files (compass KB, Ix KB, git KB, GitHub KB, security,
phases, PR packets, PR planning). Cross-reference every claim.

### Phase 6: Interactive Wiki Verification
Open the standalone wiki in a browser and verify all 12 views render
correctly, search works, detail drawer works.

### Phase 7: Repository Deep Scan
For each accessible repo: list branches, inspect key commits, run
`tsc --noEmit` and tests, build file inventory, extract symbol relationships,
map PRs → commits → files → findings.

### Phase 8: Graph Expansion
For each MISSING category in the graph (files, symbols, tests, APIs,
dependencies, builds, worktrees, code-to-finding edges), build nodes
and edges. Update the graph JSON. Regenerate the wiki.

### Phase 9: Public Data Enrichment
Fetch public PR metadata, commit metadata, and release notes.
Cross-reference against findings.

### Phase 10: Final Integrity Audit
Run full discrepancy scan. Every claim must match live state.

### Phase 11: Output Generation
Generate updated manifest, provenance report, consistency report,
and master report update.

---

## ABSOLUTE SAFETY CONTRACT

### YOU MUST NOT:

- `git reset --hard`
- `git clean`
- `git checkout` with `-f` or `--force`
- Discard, stash-pop, or overwrite any local changes
- Modify, stage, or commit anything in `feat/ix-agent-skill` worktree
- Push, force-push, or mutate ANY remote
- Create, merge, or comment on PRs or issues on GitHub
- Contact maintainers (KageBinary, josephismikhail, Hiro-Chiba, anyone)
- Request access to system-compass
- Modify `ix-compass-dist` files
- Delete any branch or worktree
- Overwrite the Ix-findings untracked content
- Reset Ix-findings (no commits to lose anyway)

### YOU MAY:

- Read all files, inspect Git state, `git log`, `git diff`, `git show`
- `git fetch` (read-only remote metadata)
- Run `tsc --noEmit`, `npm test`, `npm run build --dry-run`
- Generate reports, graph data, registry updates
- Write new files in `E:\E-github-repos\Ix-findings\planning\`
- Update `IX-INVESTIGATION-HANDOFF/` files
- Run `node build-data.mjs` in `planning/wiki/`
- Regenerate `index-standalone.html`
- Run safe build/test commands in the Ix repo

### WORKTREE PROTECTION

The `feat/ix-agent-skill` branch has **13 uncommitted changes** in the
primary worktree (`E:\E-github-repos\Ix`). This is the user's WORK.

DO NOT:
- Switch branches in the primary worktree
- Stage or commit these changes without explicit user instruction
- Reset, clean, or otherwise modify the worktree

This worktree is SACROSANCT.

---

## GRAPH EXPANSION SPECIFICATION

The current graph (108 nodes, 75 edges) only covers:
- Phases, repositories, branches, commits, findings, evidence, issues,
  PRs, decisions, suggestions, people

You must expand it to also cover:
- **Files** — key source files in Ix and ix-compass-dist
- **Symbols** — functions, classes, variables relevant to findings
- **Tests** — test files and their relationships
- **APIs** — endpoints (/__ix/remap, /__ix/status, view routes)
- **Dependencies** — inter-repo and intra-repo dependencies
- **Builds** — CI pipeline, build artifacts
- **Worktrees** — each worktree as a node with branch edges
- **Releases** — artifact versions as nodes with content edges

For each new node type, establish edges to existing nodes:
- File → MODIFIES → Commit
- File → DEFINES → Symbol
- Symbol → IMPLEMENTS → Finding
- Test → TESTED_BY → File
- API → TARGETS → Endpoint
- Finding → AFFECTS → File

---

## EVIDENCE CHAIN INTEGRITY

For every finding (F-001…F-013), verify the chain:

```
Finding → Evidence → Source → Repository → Branch → Commit → File
```

Flag any finding where:
- Evidence is Class D (inference) without stronger supporting evidence
- The evidence source file cannot be found
- The evidence-to-finding edge has no link in the registry
- Reproduction is not documented

---

## FINAL OUTPUT SPECIFICATION

At minimum, produce:

1. `manifest.json` (updated) — repos, paths, branches, findings, decisions, graph
2. Provenance report — what evidence came from where, with certainty scores
3. Consistency report — cross-registry integrity check
4. Discrepancy report — any new stale claims found, any claims disproven
5. Updated `STALE-CLAIMS.md` — add new entries as S-XXX format
6. Updated `planning/maps/investigation-map.json` — expanded graph
7. Regenerated `planning/wiki/data/data.js` + `index-standalone.html`
8. Final summary — what changed, what was confirmed, what remains uncertain

---

## CURRENT STATE (DO NOT ALTER)

From the Desktop final audit (2026-08-10), verified live:

```
Ix active branch:           feat/ix-agent-skill @ b038c46
Ix main:                    c4f8fea (synchronized with origin/main)
Ix remap worktree:          feat/ix-remap-hardening @ c021b52 (ahead 1, clean)
Ix fork main (Alot1z/Ix):   0437abf (5 behind origin/main)
Ix fork agent-skill:        0c9087c (PR #368 head, patch stripped)
Ix uncommitted changes:     13 files (11M + 5D + 3??)
ix-compass-dist:            main @ 396426b (clean + untracked artifacts)
Ix-findings:                master, 0 commits, 28 untracked entries

system-compass:             NO LOCAL CLONE — PRIVATE REPO

PR CREATED:      NO
PR MERGED:       NO
ISSUE CREATED:   NO
MAINTAINER CONTACT: NO
ACCESS REQUESTED: NO
REMOTE PUSH:     NO
```

The user's decisions on D-010…D-014 (refer to `DECISIONS.md`) are:
- D-010: Standalone prep repo for Compass work
- D-011: F + help + hint chip only
- D-012: Defer no-map chip
- D-013: Keep stopgap local only
- D-014: Ask KageBinary in #368 (NOT via PAT request)

These ARE user decisions — do NOT override them.

---

## BEGIN

Start with Phase 1. Read `IX-INVESTIGATION-HANDOFF/README.md` first.
Then proceed through the phases in order.

Do not skip validation steps.
Do not assume Desktop observations are still current.
Every claim must be rechecked against live Git state.
````

## File: GIT-STATE.md
````markdown
# GIT-STATE.md — Verified Git State (2026-08-10)

> ALL values are DESKTOP-OBSERVED. Freebuff CLI MUST REVALIDATE independently.
> No destructive operations authorized. Preserve uncommitted work.

---

## Ix — Primary Worktree (E:\E-github-repos\Ix)

| Property | Value | Status |
|---|---|---|
| Active branch | `feat/ix-agent-skill` | DESKTOP-OBSERVED |
| HEAD commit | `b038c46` | DESKTOP-OBSERVED |
| HEAD message | `feat(skill): ship the ix agent skill with Compass patch, API docs, and upstream port` | DESKTOP-OBSERVED |
| Tracking branch | NONE (not tracking any remote) | DESKTOP-OBSERVED |
| `main` branch | `c4f8fea` | DESKTOP-OBSERVED |
| `main` tracking | `origin/main` @ `c4f8fea` (synchronized) | DESKTOP-OBSERVED |
| `feat/ix-remap-hardening` | `c021b52` | DESKTOP-OBSERVED |
| `feat/ix-remap-hardening` base | `origin/main` — ahead by 1 commit | DESKTOP-OBSERVED |
| Origin remote | `origin` → https://github.com/ix-infrastructure/Ix | DESKTOP-OBSERVED |
| Fork remote | `fork` → https://github.com/Alot1z/Ix | DESKTOP-OBSERVED |

### Working Tree Changes (feat/ix-agent-skill)

**MODIFIED (11 files):**
```
 M CLAUDE.md
 M docs/api/README.md
 M skills/ix/scripts/bootstrap.ps1
 M skills/ix/scripts/bootstrap.sh
 M skills/ix/scripts/compass-patch/apply.sh
 M skills/ix/scripts/compass-patch/fit-view.js
```

**DELETED (2 files):**
```
 D upstream/compass-fit-view/README.md
 D upstream/compass-fit-view/src/FitViewHint.tsx
 D upstream/compass-fit-view/src/KeyboardHelp.tsx
 D upstream/compass-fit-view/src/camera.ts
 D upstream/compass-fit-view/src/useCameraFit.ts
```

**UNTRACKED (3 entries):**
```
 ?? .wiki-preview-tmp/
 ?? skills/ix/scripts/compass-patch/README.md
 ?? tasks/
```

**Total: 13 uncommitted changes (11M + 5D + 3??)**

> CRITICAL: These changes represent the user's ongoing `feat/ix-agent-skill` overhaul.
> DO NOT reset, clean, checkout, stash-pop, or otherwise modify the worktree.
> This IS the user's work. It STAYS.

### Freebuff-managed branches

```
  freebuff/first-i-have-clone-this-repo-till-https-github-com-216fcb07-946c-4935-a58e-d922499ba85d
  freebuff/first-i-have-clone-this-repo-till-https-github-com-3167fb4d-7780-475f-8401-5c169d6fec1c
```

---

## Ix — Remap Worktree (E:\E-github-repos\Ix-remap)

| Property | Value | Status |
|---|---|---|
| Active branch | `feat/ix-remap-hardening` | DESKTOP-OBSERVED |
| HEAD commit | `c021b52` | DESKTOP-OBSERVED |
| HEAD message | `feat(view): real /__ix/remap endpoint with loopback guard; fix WSL bootstrap` | DESKTOP-OBSERVED |
| Base | `origin/main` | DESKTOP-OBSERVED |
| Ahead/behind | ahead 1 | DESKTOP-OBSERVED |
| Working tree | CLEAN | DESKTOP-OBSERVED |
| Tests | 656 passing, tsc + eslint clean | DESKTOP-OBSERVED |

---

## Ix — Fork Remote State (Alot1z/Ix)

| Branch | Remote SHA | vs origin/main | Status |
|---|---|---|---|
| `fork/main` | `0437abf` | 5 commits BEHIND `c4f8fea` | DESKTOP-OBSERVED |
| `fork/feat/ix-agent-skill` | `0c9087c` | PR #368 head (monkey-patch stripped) | DESKTOP-OBSERVED |
| `fork/feat/ix-remap-hardening` | NONE | NOT pushed | DESKTOP-OBSERVED |

> The local `feat/ix-agent-skill` (`b038c46`) includes the full Compass patch.
> The fork version (`0c9087c`) was the PR #368 submission — patch was stripped per maintainer direction.
> These are DIFFERENT branches, not divergent versions of the same thing.

### Fork vs Upstream (origin/main) Divergence

```
fork/main  @ 0437abf
    ↓
origin/main @ c4f8fea  (+5 commits)
```

---

## Ix — Branch Listing (all, including remotes)

**Local branches:**
```
  feat/ix-agent-skill          b038c46
  feat/ix-remap-hardening       c021b52  (worktree: E:\E-github-repos\Ix-remap)
  main                          c4f8fea
```

**Remote branches (origin — ix-infrastructure/Ix):**
- `origin/main` → `c4f8fea`
- `origin/pr-368-head` → `0c9087c`
- Plus 20+ additional branches (see `git branch -r`)

**Remote branches (fork — Alot1z/Ix):**
- `fork/main` → `0437abf`
- `fork/feat/ix-agent-skill` → `0c9087c`
- Plus 10+ additional branches

---

## ix-compass-dist (E:\E-github-repos\ix-compass-dist)

| Property | Value | Status |
|---|---|---|
| Branch | `main` | DESKTOP-OBSERVED |
| HEAD | `396426b` | DESKTOP-OBSERVED |
| Working tree | Clean + untracked v0.3.0 artifacts | DESKTOP-OBSERVED |

---

## Ix-findings (E:\E-github-repos\Ix-findings)

| Property | Value | Status |
|---|---|---|
| Branch | `master` | DESKTOP-OBSERVED |
| Commits | 0 (nothing committed) | DESKTOP-OBSERVED |
| Staged | 0 files | DESKTOP-OBSERVED |
| Tracked | 0 files | DESKTOP-OBSERVED |
| Untracked | 28 entries (13 dirs of content) | DESKTOP-OBSERVED |
| Remotes | NONE | DESKTOP-OBSERVED |

---

## system-compass

| Property | Value |
|---|---|
| Local clone | NONE |
| Access | PRIVATE — returns 404 |
| Status | PATH UNKNOWN — MUST BE DISCOVERED BY CLI (if access ever granted) |
````

## File: GRAPH-AUDIT.md
````markdown
# GRAPH-AUDIT.md — Investigation Graph Audit

> DESKTOP-OBSERVED — REVALIDATE.
> Graph source: `../planning/maps/investigation-map.json` (108 nodes, 75 edges).
> Generated at: `../planning/wiki/data/data.js` (110 KB).
> Visualized in: `../planning/wiki/index-standalone.html` (159 KB standalone).

---

## Current Graph State

| Property | Value | Status |
|---|---|---|
| Total nodes | 108 | DESKTOP-OBSERVED |
| Total edges | 75 | DESKTOP-OBSERVED |
| Node types | 10 (Phase, Repository, Finding, Evidence, Issue, PR, Packet, Commit, Decision, Suggestion, Person) | DESKTOP-OBSERVED |
| SVG rendering nodes | 111 (108 + 3 label/legend elements) | DESKTOP-OBSERVED |
| Console errors | 0 | DESKTOP-OBSERVED |
| Views | 12 (Map, Timeline, Repos, Phase Explorer, Findings, Evidence, Compass History, PR/Issue Map, AI Suggestions, Decisions, Security, About/Privacy) | DESKTOP-OBSERVED |
| Search | Working (token-based) | DESKTOP-OBSERVED |
| Detail drawer | Working (evidence links, suggestions, recommendations) | DESKTOP-OBSERVED |
| SVG rendering | createElementNS + viewBox — correct namespace | DESKTOP-OBSERVED |

---

## What the Graph CURRENTLY Contains

| Category | Status | Notes |
|---|---|---|
| Phases (phase-00…FINAL) | PRESENT | 14 phase nodes |
| Repositories (5 repos) | PRESENT | Ix upstream, fork, ix-compass-dist, system-compass, Ix-findings |
| Branches (major) | PRESENT | main, feat/ix-remap-hardening, feat/ix-agent-skill, fork/main |
| Commits (key) | PRESENT | c021b52, 2157158, dcc0962, b038c46, c4f8fea, 0437abf, 0c9087c, 396426b |
| Findings (F-001…F-013) | PRESENT | All 13 findings as nodes with evidence edges |
| Evidence (E-001…E-025) | PRESENT | 25 evidence nodes with classification |
| Issues (Ix #, system-compass #) | PRESENT | #57, #58, #59, #365, #366, #368, #371, #374, #376 |
| PR Packets | PRESENT | 4 packets (remap, F-key, delayed-data, #376) |
| Decisions (D-001…D-014) | PRESENT | 14 decisions (9 closed, 5 open) |
| Suggestions (S-001…S-033) | PRESENT | 33 AI-agent suggestions with dispositions |
| People | PARTIAL | Only major contributors: KageBinary, josephismikhail, Hiro-Chiba, TannerTorrey3, Alot1z |

---

## What the Graph is MISSING

| Category | Status | What to add |
|---|---|---|
| Files (source) | MISSING | No file-level nodes — add key files from each repo |
| Symbols | MISSING | No function/class/variable-level nodes |
| Tests | MISSING | Test relationships not represented |
| APIs | MISSING | No API endpoint nodes (e.g., /__ix/remap, /__ix/status) |
| Dependencies | MISSING | No dependency graph between repos |
| Builds | MISSING | No CI/build pipeline nodes |
| Artifacts (all versions) | PARTIAL | Only v0.3.0 artifacts; add v0.1.0, v0.1.1, v0.2.0 |
| Releases | PARTIAL | Release relationships exist in timeline but not in main graph |
| Reverse-engineering observations | MISSING | No binary/static analysis observations |
| Worktree relationships | MISSING | Worktrees not represented as nodes |
| Fork relationships (detailed) | PARTIAL | Fork edge exists but no per-branch divergence detail |
| PR-to-commit mapping | PARTIAL | Some PR→commit edges missing |
| Issue-to-code mapping | MISSING | No edges from issues to specific code locations |
| Code-to-finding mapping | MISSING | No edges from code files/symbols to findings |

---

## CLI Expansion Instruction

**DO NOT merely regenerate the current graph.**

Instead:

> EXPAND THE GRAPH INTO A COMPLETE REPOSITORY / CODE / GIT / PR / FINDING / EVIDENCE / ARTIFACT INVESTIGATION GRAPH.

For each MISSING category above:
1. Build the corresponding nodes
2. Establish edges to existing nodes
3. Generate updated `../planning/maps/investigation-map.json`
4. Rebuild `../planning/wiki/data/data.js` (run `build-data.mjs`)
5. Rebuild `../planning/wiki/index-standalone.html` (inline CSS + data.js + wiki.js)

---

## Graph Schema Refresher

Required node types for full graph:
```
Repository, Fork, Branch, Worktree, Commit, Directory, File, Symbol,
Test, API, Dependency, PR, Issue, Finding, Evidence, Decision, Phase,
Build, Artifact, Release, ReverseEngineeringObservation, ExternalReference
```

Required edge types:
```
FORK_OF, HAS_BRANCH, HAS_WORKTREE, CONTAINS_COMMIT, PARENT_OF,
MODIFIES, DEFINES, IMPORTS, IMPLEMENTS, TESTED_BY, TARGETS, HEADS,
CHANGES, SUPPORTED_BY, AFFECTS, OBSERVED_IN, RELATES_TO,
DERIVED_FROM, BUILT_FROM, CORRESPONDS_TO
```
````

## File: manifest.json
````json
{
  "version": "2.0.0",
  "generated": "2026-08-10T14:00:00Z",
  "source": "Desktop investigation final audit",
  "status": "READ-ONLY - no external actions authorized",
  "repositories": [
    {
      "repo_id": "ix-infrastructure/Ix",
      "owner": "ix-infrastructure",
      "name": "Ix",
      "url": "https://github.com/ix-infrastructure/Ix",
      "role": "upstream",
      "local_path": "E:\\E-github-repos\\Ix",
      "remote_name": "origin",
      "default_branch": "main",
      "head_sha": "c4f8fea"
    },
    {
      "repo_id": "Alot1z/Ix",
      "owner": "Alot1z",
      "name": "Ix",
      "url": "https://github.com/Alot1z/Ix",
      "role": "fork",
      "fork_of": "ix-infrastructure/Ix",
      "local_remote_name": "fork",
      "head_sha": "0437abf",
      "sync_status": "5 commits behind upstream"
    },
    {
      "repo_id": "ix-infrastructure/ix-compass-dist",
      "owner": "ix-infrastructure",
      "name": "ix-compass-dist",
      "url": "https://github.com/ix-infrastructure/ix-compass-dist",
      "role": "distribution",
      "local_path": "E:\\E-github-repos\\ix-compass-dist",
      "head_sha": "396426b",
      "note": "Distribution channel - DO NOT MODIFY"
    },
    {
      "repo_id": "ix-infrastructure/system-compass",
      "owner": "ix-infrastructure",
      "name": "system-compass",
      "url": "https://github.com/ix-infrastructure/system-compass",
      "role": "source",
      "access": "PRIVATE",
      "local_path": null,
      "note": "NO LOCAL CLONE"
    },
    {
      "repo_id": "Ix-findings",
      "owner": "local",
      "name": "Ix-findings",
      "role": "investigation-ledger",
      "local_path": "E:\\E-github-repos\\Ix-findings",
      "commits": 0,
      "untracked": 28,
      "note": "0 commits - all files untracked"
    }
  ],
  "local_paths": {
    "Ix_primary": "E:\\E-github-repos\\Ix",
    "Ix_remap": "E:\\E-github-repos\\Ix-remap",
    "ix_compass_dist": "E:\\E-github-repos\\ix-compass-dist",
    "Ix_findings": "E:\\E-github-repos\\Ix-findings",
    "handoff": "E:\\E-github-repos\\Ix-findings\\IX-INVESTIGATION-HANDOFF",
    "planning": "E:\\E-github-repos\\Ix-findings\\planning",
    "wiki_standalone": "E:\\E-github-repos\\Ix-findings\\planning\\wiki\\index-standalone.html"
  },
  "branches": [
    {
      "branch": "main",
      "repo": "ix-infrastructure/Ix",
      "sha": "c4f8fea",
      "sync": "synchronized"
    },
    {
      "branch": "feat/ix-agent-skill",
      "repo": "ix-infrastructure/Ix",
      "sha": "b038c46",
      "worktree": "Ix_primary",
      "dirty": 13
    },
    {
      "branch": "feat/ix-remap-hardening",
      "repo": "ix-infrastructure/Ix",
      "sha": "c021b52",
      "worktree": "Ix_remap",
      "ahead": 1
    },
    {
      "branch": "fork/main",
      "repo": "Alot1z/Ix",
      "sha": "0437abf",
      "behind_upstream": 5
    },
    {
      "branch": "fork/feat/ix-agent-skill",
      "repo": "Alot1z/Ix",
      "sha": "0c9087c",
      "note": "PR #368 head"
    },
    {
      "branch": "main",
      "repo": "ix-compass-dist",
      "sha": "396426b"
    },
    {
      "branch": "master",
      "repo": "Ix-findings",
      "sha": null,
      "commits": 0
    }
  ],
  "commits": [
    {
      "sha": "c4f8fea",
      "repo": "ix-infrastructure/Ix",
      "branch": "main",
      "msg": "chore(deps-dev): bump dev-dependencies (#369)"
    },
    {
      "sha": "c021b52",
      "repo": "ix-infrastructure/Ix",
      "branch": "feat/ix-remap-hardening",
      "msg": "feat(view): real /__ix/remap endpoint with loopback guard; fix WSL bootstrap"
    },
    {
      "sha": "b038c46",
      "repo": "ix-infrastructure/Ix",
      "branch": "feat/ix-agent-skill",
      "msg": "feat(skill): ship agent skill with Compass patch"
    },
    {
      "sha": "0437abf",
      "repo": "Alot1z/Ix",
      "branch": "fork/main",
      "msg": "fix(upgrade): pair tar binary (#366)"
    },
    {
      "sha": "0c9087c",
      "repo": "Alot1z/Ix",
      "branch": "fork/feat/ix-agent-skill",
      "msg": "fix(skill): drop Compass monkey-patch"
    },
    {
      "sha": "396426b",
      "repo": "ix-compass-dist",
      "branch": "main",
      "msg": "distribution commit"
    },
    {
      "sha": "dcc0962",
      "repo": "ix-infrastructure/Ix",
      "pr": "#365",
      "msg": "Compass stamp"
    },
    {
      "sha": "2157158",
      "repo": "ix-infrastructure/Ix",
      "pr": "#368",
      "msg": "PR #368 merge"
    }
  ],
  "pull_requests": [
    {
      "number": 358,
      "url": "https://github.com/ix-infrastructure/Ix/pull/358",
      "state": "MERGED"
    },
    {
      "number": 362,
      "url": "https://github.com/ix-infrastructure/Ix/pull/362",
      "state": "MERGED"
    },
    {
      "number": 365,
      "url": "https://github.com/ix-infrastructure/Ix/pull/365",
      "sha": "dcc0962",
      "state": "MERGED"
    },
    {
      "number": 366,
      "url": "https://github.com/ix-infrastructure/Ix/pull/366",
      "state": "MERGED"
    },
    {
      "number": 368,
      "url": "https://github.com/ix-infrastructure/Ix/pull/368",
      "sha": "2157158",
      "fork_sha": "0c9087c",
      "state": "MERGED"
    }
  ],
  "issues": [
    {
      "number": 371,
      "url": "https://github.com/ix-infrastructure/Ix/issues/371",
      "finding": "F-009"
    },
    {
      "number": 376,
      "url": "https://github.com/ix-infrastructure/Ix/issues/376",
      "finding": "F-008"
    },
    {
      "number": 57,
      "url": "https://github.com/ix-infrastructure/system-compass/issues/57",
      "repo": "system-compass",
      "access": "PRIVATE",
      "finding": "F-005"
    }
  ],
  "findings": {
    "count": 13,
    "ids": [
      "F-001",
      "F-002",
      "F-003",
      "F-004",
      "F-005",
      "F-006",
      "F-007",
      "F-008",
      "F-009",
      "F-010",
      "F-011",
      "F-012",
      "F-013"
    ]
  },
  "evidence": {
    "count": 25,
    "ids": [
      "E-001",
      "E-002",
      "E-003",
      "E-004",
      "E-005",
      "E-006",
      "E-007",
      "E-008",
      "E-009",
      "E-010",
      "E-011",
      "E-012",
      "E-013",
      "E-014",
      "E-015",
      "E-016",
      "E-017",
      "E-018",
      "E-019",
      "E-020",
      "E-021",
      "E-022",
      "E-023",
      "E-024",
      "E-025"
    ]
  },
  "decisions": {
    "count": 14,
    "decided": [],
    "open": []
  },
  "graph": {
    "nodes": 108,
    "edges": 75,
    "status": "PARTIAL - see GRAPH-AUDIT.md"
  },
  "execution_constraints": {
    "NO_remote_push": true,
    "NO_pr_create": true,
    "NO_pr_merge": true,
    "NO_maintainer_contact": true,
    "PRESERVE_agent_skill_worktree": true,
    "MAY_read": true,
    "MAY_inspect": true,
    "MAY_test": true,
    "MAY_expand_graph": true
  },
  "external_actions_performed": {
    "pr_created": "NO",
    "pr_merged": "NO",
    "issue_created": "NO",
    "maintainer_contact": "NO",
    "access_requested": "NO",
    "remote_push": "NO"
  }
}
````

## File: PATHS.md
````markdown
# PATHS.md — Exact Local Filesystem Paths

> Every path relevant to the investigation.
> Format: `E:\...` (Windows absolute, as verified 2026-08-10).
> All paths revalidated during final audit — not copied from prior reports.

---

## Repository Roots

| Repository | Absolute Path |
|---|---|
| ix-infrastructure/Ix (primary worktree) | `E:\E-github-repos\Ix` |
| Ix remap worktree | `E:\E-github-repos\Ix-remap` |
| ix-compass-dist | `E:\E-github-repos\ix-compass-dist` |
| Ix-findings (investigation ledger) | `E:\E-github-repos\Ix-findings` |
| system-compass | NONE — no local clone |

---

## Ix Worktrees

| Worktree | Path | Branch | HEAD |
|---|---|---|---|
| Primary | `E:\E-github-repos\Ix` | `feat/ix-agent-skill` | `b038c46` |
| Remap | `E:\E-github-repos\Ix-remap` | `feat/ix-remap-hardening` | `c021b52` |

---

## Ix-findings Directory Map

Root: `E:\E-github-repos\Ix-findings\`

| Directory | Purpose | Files |
|---|---|---|
| `./artifacts/` | Downloaded Compass release bundles (v0.3.0) | 20 |
| `./comparisons/` | Cross-version comparison notes | 5 |
| `./decisions/` | Decision log | 1 |
| `./findings/` | Phase-4 audit findings | 1 |
| `./github/` | GitHub context (issues, maintainers, PRs) | 5 |
| `./manifests/` | Machine-readable indexes | 3 |
| `./planning/` | **Canonical investigation layer** | 118 |
| `./pr-packets/` | PR preparation packets (4 PRs) | 4 |
| `./reports/` | Legacy reports | 2 |
| `./repositories/` | Repository map | 1 |
| `./security/` | Security findings | 1 |
| `./state/` | Phase state files | 5 |
| `./IX-INVESTIGATION-HANDOFF/` | **This handoff** | (being written) |

---

## Planning Layer (Canonical)

Root: `E:\E-github-repos\Ix-findings\planning\`

| Subdirectory | Purpose |
|---|---|
| `compass/` | Compass knowledge base (keyboard, fit, lifecycle, delayed-data, historical matrix) |
| `decisions/` | Decision registry (D-001…D-014) |
| `evidence/` | Evidence registry + per-category indexes (source, runtime, artifacts, GitHub, reproduction) |
| `final/` | Master reports (MASTER-REPORT, EXECUTIVE-SUMMARY, NEXT-ACTIONS, REMAINING-BLOCKERS, verification, AI-BRIEFING-PROMPT) |
| `findings/` | Finding registry (F-001…F-013) with cross-cuts |
| `git/` | Git knowledge base (branches, worktrees, commits, forks, synchronization) |
| `github/` | GitHub knowledge base (issues, PRs, comments, releases, maintainers, references) |
| `ix/` | Ix knowledge base (remap, security, #376, architecture) |
| `maps/` | Machine-readable graph models (investigation, evidence, finding, decision, dependency, timeline, repository, phases) |
| `overview/` | Investigation overview layer |
| `phases/` | Per-phase archives (phase-00 through phase-13 + phase-final) |
| `pr-planning/` | PR recommendation matrix (5 planned PRs) |
| `repositories/` | Per-repository knowledge base |
| `security/` | Security + privacy audit |
| `suggestions/` | AI-agent suggestion registry (S-001…S-033) |
| `wiki/` | Interactive HTML investigation wiki + build scripts |

---

## Key Individual Files

| File | Path | Purpose |
|---|---|---|
| Findings registry | `E:\E-github-repos\Ix-findings\planning\findings\registry.json` | Authoritative F-001…F-013 |
| Evidence registry | `E:\E-github-repos\Ix-findings\planning\evidence\registry.json` | Authoritative E-001…E-025 |
| Decisions registry | `E:\E-github-repos\Ix-findings\planning\decisions\registry.json` | Authoritative D-001…D-014 |
| Suggestions registry | `E:\E-github-repos\Ix-findings\planning\suggestions\registry.json` | Authoritative S-001…S-033 |
| Investigation graph | `E:\E-github-repos\Ix-findings\planning\maps\investigation-map.json` | 108 nodes, 75 edges |
| Phases map | `E:\E-github-repos\Ix-findings\planning\maps\phases.json` | Phase summaries |
| Master report | `E:\E-github-repos\Ix-findings\planning\final\MASTER-REPORT.md` | Full investigation report |
| Executive summary | `E:\E-github-repos\Ix-findings\planning\final\EXECUTIVE-SUMMARY.md` | 2-page summary |
| Next actions | `E:\E-github-repos\Ix-findings\planning\final\NEXT-ACTIONS.md` | Prioritized action matrix |
| Remaining blockers | `E:\E-github-repos\Ix-findings\planning\final\REMAINING-BLOCKERS.md` | What's stuck |
| Wiki (standalone) | `E:\E-github-repos\Ix-findings\planning\wiki\index-standalone.html` | Self-contained interactive wiki |
| Wiki (multi-file) | `E:\E-github-repos\Ix-findings\planning\wiki\index.html` | Wiki requiring assets/ + data/ |
| Wiki data | `E:\E-github-repos\Ix-findings\planning\wiki\data\data.js` | Generated graph data (110 KB) |
| PR packet: remap | `E:\E-github-repos\Ix-findings\pr-packets\ix-remap-hardening\README.md` | Remap PR spec |
| PR packet: F-key | `E:\E-github-repos\Ix-findings\pr-packets\compass-f-key\README.md` | F-key PR spec |
| PR packet: delayed-data | `E:\E-github-repos\Ix-findings\pr-packets\compass-delayed-data\README.md` | Delayed-data investigation |
| PR packet: #376 | `E:\E-github-repos\Ix-findings\pr-packets\ix-376-version-mismatch\README.md` | #376 fix spec |
| Ix-findings .gitignore | `E:\E-github-repos\Ix-findings\.gitignore` | Untracked, 199 bytes |

---

## Preview / Temp Paths

| Path | Purpose |
|---|---|
| `E:\E-github-repos\Ix\.wiki-preview-tmp\index.html` | Workspace copy of standalone wiki (for Preview tab) |
| `E:\E-github-repos\Ix\.freebuff\run.md` | Preview run doc (ix view server + wiki preview mode) |
| `E:\E-github-repos\Ix\.freebuff\preview-29e929ce-2ab4-4fed-bab0-3a77a1d195d8.log` | Current session log (unused for HTML preview) |

---

## Paths NOT AVAILABLE

| Resource | Reason |
|---|---|
| system-compass local clone | No source access — private repo, 404 |
| ix-compass-dist source relations | Distribution repo only — no build pipeline visible |
| GitHub API tokens / PATs | Not present — no remote operations authorized |
````

## File: PR-MATRIX.md
````markdown
# PR-MATRIX.md — All PR and Issue References

> Every PR and issue referenced in the investigation, with URLs, authors,
> SHAs, and relationship to findings/decisions/commits.
> Sources: `../planning/github/`, `manifests/investigation-index.json`,
> live git state (2026-08-10).

---

## Pull Requests (ix-infrastructure/Ix)

| PR # | Title | URL | Author | Head SHA | Base | State | Related Finding |
|---|---|---|---|---|---|---|---|
| #358 | View port reporting | https://github.com/ix-infrastructure/Ix/pull/358 | Hiro-Chiba | — | main | MERGED | F-010 (remap) |
| #362 | View -p warning | https://github.com/ix-infrastructure/Ix/pull/362 | Hiro-Chiba | — | main | MERGED | F-010 |
| #365 | Compass stamp | https://github.com/ix-infrastructure/Ix/pull/365 | KageBinary | `dcc0962` | main | MERGED | — |
| #366 | Tar pairing | https://github.com/ix-infrastructure/Ix/pull/366 | KageBinary | — | main | MERGED | — |
| **#368** | Agent skill + HTTP API docs | https://github.com/ix-infrastructure/Ix/pull/368 | Alot1z | `2157158` | main | MERGED | F-001..F-007, F-010, D-014 |
| #372 | --format llm | https://github.com/ix-infrastructure/Ix/pull/372 | — | — | — | — | — |

---

## Issues Referenced

| Issue # | Repository | Title | URL | Related Finding |
|---|---|---|---|---|
| #57 | system-compass | Fit latch → keyed refit (v0.2.0 → v0.3.0) | PRIVATE | F-005 |
| #58 | system-compass | (referenced in v0.3.0 release notes) | PRIVATE | — |
| #59 | system-compass | (referenced in v0.3.0 release notes) | PRIVATE | — |
| #194 | ix-infrastructure/Ix | Brew formula update | https://github.com/ix-infrastructure/Ix/issues/194 | — |
| #347 | ix-infrastructure/Ix | Map: fail loudly on patch commit failure | https://github.com/ix-infrastructure/Ix/issues/347 | — |
| #348 | ix-infrastructure/Ix | Ingest: stop DEP0151 warnings | https://github.com/ix-infrastructure/Ix/issues/348 | — |
| #369 | ix-infrastructure/Ix | Bump dev-dependencies | https://github.com/ix-infrastructure/Ix/issues/369 | — |
| **#371** | ix-infrastructure/Ix | `patches` command dead/unregistered | https://github.com/ix-infrastructure/Ix/issues/371 | F-009 |
| **#374** | ix-infrastructure/Ix | Cross-batch calls | https://github.com/ix-infrastructure/Ix/issues/374 | — |
| **#376** | ix-infrastructure/Ix | Version-series mismatch in `ix upgrade` | https://github.com/ix-infrastructure/Ix/issues/376 | F-008 |

---

## PR-to-Finding Mapping

| Finding | PRs/Issues | Relationship |
|---|---|---|
| F-001..F-005 | #368, #57 | Compass F-key feature surfaced in #368; redirected to system-compass by maintainer |
| F-005 | #57 | #57 already covers V3 refit; F-key must NOT re-add auto-frame |
| F-006, F-007 | — | Delayed-data: separate concern, separate issue |
| F-008 | #376 | Latent `ix upgrade` version-series mismatch |
| F-009 | #371 | `patches` command dead/unregistered |
| F-010..F-012 | #358, #362, #368 | Remap hardening: loopback binding, WSL fix, dead-code removal |
| F-013 | — | Zoom ×1.25 vs ×1.1 anomaly — open investigation |

---

## PR-to-Commit Mapping

| PR | Commit(s) | Notes |
|---|---|---|
| #365 | `dcc0962` | Compass stamp |
| #368 | `2157158` (merged), `0c9087c` (fork head after monkey-patch strip) | Agent skill + docs |
| #348 | `01308e6` | DEP0151 fix |
| #347 | `4258d9f` | Patch fail fix |

---

## PR Recommendation Matrix (from `../planning/pr-planning/`)

| Target | PR/Issue | Recommendation | Evidence | Blockers |
|---|---|---|---|---|
| Ix remap | NEW PR | Push `feat/ix-remap-hardening` → open PR | F-010..F-012, E-014..E-016 | Push/PR authorization (D-009) |
| Ix #376 | NEW PR | Fix version-series mismatch (Option A) | F-008, E-017 | Maintainer direction |
| Ix #371 | NEW ISSUE/PR | OSS vs Pro decision | F-009, E-018 | Maintainer decision |
| Compass F-key | NEW PR | F + help + hint chip only (against system-compass source) | F-001..F-005 | Source access (D-014) |
| Compass delayed-data | NEW ISSUE/PR | Reproducible blank with delayed data | F-006, F-007 | Source access, maintainer scoping |
| ix-compass-dist | NO ACTION | Distribution channel — never modify | D-007 | — |
````

## File: PUBLIC-REFERENCES.md
````markdown
# PUBLIC-REFERENCES.md — Complete URL Inventory

> Every public URL referenced in the investigation.
> Extracted from `../planning/github/references.md` and live state.
> All URLs verified as of 2026-08-10 (public repos confirmed accessible).

---

## GitHub Repositories

| Repository | URL | Access |
|---|---|---|
| ix-infrastructure/Ix (upstream) | https://github.com/ix-infrastructure/Ix | PUBLIC |
| Alot1z/Ix (fork) | https://github.com/Alot1z/Ix | PUBLIC |
| ix-infrastructure/ix-compass-dist | https://github.com/ix-infrastructure/ix-compass-dist | PUBLIC |
| ix-infrastructure/system-compass | https://github.com/ix-infrastructure/system-compass | **PRIVATE (404)** |

---

## Pull Requests

| PR # | URL |
|---|---|
| #358 (View port reporting) | https://github.com/ix-infrastructure/Ix/pull/358 |
| #362 (View -p warning) | https://github.com/ix-infrastructure/Ix/pull/362 |
| #365 (Compass stamp) | https://github.com/ix-infrastructure/Ix/pull/365 |
| #366 (Tar pairing) | https://github.com/ix-infrastructure/Ix/pull/366 |
| #368 (Agent skill + docs) | https://github.com/ix-infrastructure/Ix/pull/368 |
| #372 (--format llm) | https://github.com/ix-infrastructure/Ix/pull/372 |

---

## Issues

| Issue # | URL |
|---|---|
| #194 (Brew formula) | https://github.com/ix-infrastructure/Ix/issues/194 |
| #347 (Map patch failure) | https://github.com/ix-infrastructure/Ix/issues/347 |
| #348 (DEP0151 warnings) | https://github.com/ix-infrastructure/Ix/issues/348 |
| #369 (Dev-deps bump) | https://github.com/ix-infrastructure/Ix/issues/369 |
| #371 (patches command dead) | https://github.com/ix-infrastructure/Ix/issues/371 |
| #374 (Cross-batch calls) | https://github.com/ix-infrastructure/Ix/issues/374 |
| #376 (Version-series mismatch) | https://github.com/ix-infrastructure/Ix/issues/376 |
| #57 (Compass — PRIVATE) | https://github.com/ix-infrastructure/system-compass/issues/57 |
| #58 (Compass — PRIVATE) | https://github.com/ix-infrastructure/system-compass/issues/58 |
| #59 (Compass — PRIVATE) | https://github.com/ix-infrastructure/system-compass/issues/59 |

---

## Commits (Public)

| SHA | URL |
|---|---|
| `c4f8fea` | https://github.com/ix-infrastructure/Ix/commit/c4f8fea |
| `01308e6` | https://github.com/ix-infrastructure/Ix/commit/01308e6 |
| `0437abf` | https://github.com/ix-infrastructure/Ix/commit/0437abf |
| `0c9087c` | https://github.com/ix-infrastructure/Ix/commit/0c9087c |
| `dcc0962` | https://github.com/ix-infrastructure/Ix/commit/dcc0962 |
| `396426b` | https://github.com/ix-infrastructure/ix-compass-dist/commit/396426b |

---

## Releases

| Release | URL |
|---|---|
| v0.3.0 | https://github.com/ix-infrastructure/ix-compass-dist/releases/tag/v0.3.0 |
| v0.2.0 | https://github.com/ix-infrastructure/ix-compass-dist/releases/tag/v0.2.0 |
| v0.1.1 | https://github.com/ix-infrastructure/ix-compass-dist/releases/tag/v0.1.1 |
| v0.1.0 | https://github.com/ix-infrastructure/ix-compass-dist/releases/tag/v0.1.0 |

---

## Documentation / External

| Resource | URL |
|---|---|
| Ix installer (Windows) | https://ix-infra.com/install.ps1 |
| Ix installer (macOS/Linux) | https://ix-infra.com/install.sh |
| ix-infra.com | https://ix-infra.com |

---

## Branches (public, on ix-infrastructure/Ix)

| Branch | URL |
|---|---|
| `main` | https://github.com/ix-infrastructure/Ix/tree/main |
| `fix/view-reports-running-port` | https://github.com/ix-infrastructure/Ix/tree/fix/view-reports-running-port |
| `fix/windows-tar-cygpath-pairing` | https://github.com/ix-infrastructure/Ix/tree/fix/windows-tar-cygpath-pairing |
````

## File: README.md
````markdown
# IX / Compass Investigation — Freebuff CLI Handoff

**Generated:** 2026-08-10 (from verified Desktop workspace state)
**Status:** READ-ONLY investigation package — no external actions authorized
**Parent:** `../planning/` — canonical investigation layer (this handoff is a derivative index)

---

## What This Is

A self-contained handoff package for Freebuff CLI. Every repository, path, branch,
commit, PR, finding, decision, and evidence is recorded with exact paths and URLs.

Freebuff CLI can read this directory and immediately know:
- What to investigate
- Where everything lives on disk
- What has already been established
- What has NOT been established
- Which files to read (with priority tiers)
- Which repositories to inspect
- What must remain untouched

---

## Handoff Files

| File | Purpose | Critical? |
|---|---|---|
| `README.md` | This index | Entry point |
| `REPOSITORIES.md` | Every repository: owner, URL, local path, fork relationship | YES |
| `PATHS.md` | Exact local filesystem paths for every repo/worktree/dir | YES |
| `GIT-STATE.md` | Current verified Git state (branches, SHAs, ahead/behind) | YES |
| `BRANCH-MATRIX.md` | All branches across all repos with SHAs and relationships | YES |
| `PR-MATRIX.md` | Every PR/issue referenced, with URLs, authors, SHAs | YES |
| `FINDINGS.md` | F-001 through F-013 with evidence links, status, repo | YES |
| `EVIDENCE.md` | E-001 through E-025 with classification, source, repo | — |
| `DECISIONS.md` | D-001 through D-014 with options, outcome, status | — |
| `GRAPH-AUDIT.md` | What the existing graph contains, what it's missing | — |
| `PUBLIC-REFERENCES.md` | Every public URL discovered | — |
| `STALE-CLAIMS.md` | Known discrepancies found during final audit | — |
| `FILE-MANIFEST.md` | Complete file inventory with reading priorities | YES |
| `CLI-READING-PLAN.md` | Ordered reading plan for CLI (MUST → SHOULD → OPTIONAL) | YES |
| `FREEBUFF-CLI-PROMPT.md` | The main investigation prompt for Freebuff CLI | YES |
| `manifest.json` | Machine-readable: repos, paths, branches, findings, decisions, constraints | YES |

---

## Quick Summary

| Metric | Count |
|---|---|
| Repositories discovered | 5 (3 accessible, 2 reference-only) |
| Local repositories | 3 (Ix, Ix-remap worktree, Ix-findings) |
| Branches across all repos | 30+ |
| Worktrees | 2 |
| PRs referenced | 12 |
| Issues referenced | 8 |
| Findings (F-001…F-013) | 13 |
| Evidence items (E-001…E-025) | 25 |
| AI-agent suggestions (S-001…S-033) | 33 |
| Decisions (D-001…D-014) | 14 |
| Graph nodes | 108 |
| Graph edges | 75 |
| Files in investigation ledger | 118 |

---

## External Actions: NONE

```
PR CREATED:      NO
PR MERGED:       NO
PR COMMENTED:    NO
ISSUE CREATED:   NO
MAINTAINER CONTACT: NO
ACCESS REQUESTED: NO
REMOTE PUSH:     NO
REMOTE MUTATION: NO
```

---

## CLI Safety Contract

Freebuff CLI, upon receiving this handoff:

**MUST NOT:**
- `git reset --hard`, `git clean`, destructive checkout
- Discard local changes or uncommitted work
- Push, force-push, or mutate any remote
- Create/merge/comment on PRs or issues
- Contact maintainers or request access
- Modify `feat/ix-agent-skill` working-tree changes
- Modify `ix-compass-dist`

**MAY:**
- Read all files, fetch public metadata, inspect Git state
- Build, test, run `tsc --noEmit`, `npm test`
- Generate reports, graph data, registry updates
- Write new local files in `planning/` or `IX-INVESTIGATION-HANDOFF/`

---

## Data Canonical Source

The authoritative source for all findings, evidence, decisions, and suggestions
is `../planning/`. The registries are:

- `../planning/findings/registry.json` — F-001 through F-013
- `../planning/evidence/registry.json` — E-001 through E-025
- `../planning/suggestions/registry.json` — S-001 through S-033
- `../planning/decisions/registry.json` — D-001 through D-014
- `../planning/maps/*.json` — Graph models (investigation, evidence, finding, decision, dependency, timeline, repository maps)

**This handoff file is derivative — do not treat it as more authoritative than the registries.**
````

## File: REPOSITORIES.md
````markdown
# REPOSITORIES.md — Complete Repository Inventory

> All repositories referenced in the Ix / Compass investigation.
> Sources: `manifests/investigation-index.json`, live Git state (2026-08-10),
> `../planning/repositories/*.md`, `../planning/github/references.md`

---

## Repository Index

### 1. ix-infrastructure/Ix (UPSTREAM)

| Field | Value |
|---|---|
| Owner | ix-infrastructure |
| Name | Ix |
| URL | https://github.com/ix-infrastructure/Ix |
| Purpose | Primary Ix CLI repository — the main project |
| Local clone | `E:\E-github-repos\Ix` |
| Git root | `E:\E-github-repos\Ix\.git` |
| Local remote name | `origin` |
| Local remote URL | https://github.com/ix-infrastructure/Ix |
| Default branch | `main` |
| PRs discovered | #358, #362, #365, #366, #368, #371, #374, #376 |
| Issues discovered | #57 (Compass), #58, #59, #194, #347, #348, #369 |

### 2. Alot1z/Ix (FORK)

| Field | Value |
|---|---|
| Owner | Alot1z |
| Name | Ix |
| URL | https://github.com/Alot1z/Ix |
| Purpose | User's fork of ix-infrastructure/Ix |
| Local remote name | `fork` |
| Local remote URL | https://github.com/Alot1z/Ix |
| Default branch | `main` |
| Fork relationship | Fork of ix-infrastructure/Ix |
| Sync status | fork/main (`0437abf`) is 5 commits behind origin/main (`c4f8fea`) |
| PR submitted | PR #368 head = `0c9087c` (fork/feat/ix-agent-skill) |

### 3. ix-infrastructure/ix-compass-dist (DISTRIBUTION)

| Field | Value |
|---|---|
| Owner | ix-infrastructure |
| Name | ix-compass-dist |
| URL | https://github.com/ix-infrastructure/ix-compass-dist |
| Purpose | Compiled Compass UI distribution (NOT source) |
| Local clone | `E:\E-github-repos\ix-compass-dist` |
| Local remote name | `origin` |
| Default branch | `main` |
| HEAD | `396426b` |
| Working tree | Clean + untracked v0.3.0 research artifacts |
| Releases | v0.1.0, v0.1.1, v0.2.0, v0.3.0 |
| **IMPORTANT** | This is a DISTRIBUTION channel — DO NOT modify or PR to it |

### 4. ix-infrastructure/system-compass (SOURCE — PRIVATE)

| Field | Value |
|---|---|
| Owner | ix-infrastructure |
| Name | system-compass |
| URL | https://github.com/ix-infrastructure/system-compass |
| Purpose | Compass UI SOURCE repository |
| Access | PRIVATE — returns 404 for unauthorized users |
| Local clone | NONE |
| Issues referenced | #57 (fit refit), #58, #59 |
| Status | ACCESS BLOCKED — requires maintainer grant |

### 5. Ix-findings (INVESTIGATION LEDGER)

| Field | Value |
|---|---|
| Owner | Local only (no GitHub remote) |
| Name | Ix-findings |
| Local path | `E:\E-github-repos\Ix-findings` |
| Git root | `E:\E-github-repos\Ix-findings\.git` |
| Branch | `master` |
| Commits | 0 (NOTHING committed) |
| Staged | 0 files |
| Tracked | 0 files |
| Untracked | 28 entries (13 directories) |
| Remotes | NONE |
| Purpose | Investigation ledger, findings, evidence, planning, wiki |

---

## Repository Relationships

```
ix-infrastructure/Ix (upstream)
    ├── FORK OF → Alot1z/Ix
    │   ├── feat/ix-agent-skill → PR #368
    │   └── main → 5 behind upstream
    │
    └── RELATED TO → ix-infrastructure/ix-compass-dist
    │   └── Compass UI shipped via `ix upgrade`
    │
    └── RELATED TO → ix-infrastructure/system-compass (PRIVATE)
        └── Compass UI SOURCE

Ix-findings (standalone ledger)
    └── REFERENCES all above
    └── NOT a fork — independent investigation record
```

---

## Remotes Verified (as of 2026-08-10)

From `E:\E-github-repos\Ix`:

```
origin  https://github.com/ix-infrastructure/Ix  (fetch + push)
fork    https://github.com/Alot1z/Ix              (fetch + push)
```

From `E:\E-github-repos\Ix-findings`:

```
(none — no remotes configured)
```

From `E:\E-github-repos\ix-compass-dist`:

```
origin  https://github.com/ix-infrastructure/ix-compass-dist  (fetch + push)
```
````

## File: STALE-CLAIMS.md
````markdown
# STALE-CLAIMS.md — Known Discrepancies & Stale Claims

> Identified during final audit (2026-08-10).
> Each discrepancy mapped to the file(s) where it appears.
> Distinguish: CURRENT vs HISTORICAL vs STALE vs DERIVED vs UNKNOWN.

---

## Resolved Discrepancies (fixed in final audit)

| # | Claim | File(s) | Authoritative Value | Status |
|---|---|---|---|---|
| 1 | "12 findings" | `planning/overview/investigation-overview.md`, `planning/overview/phase-overview.md`, `planning/phases/phase-09/README.md`, `planning/maps/phases.json` | **13 findings** (F-001…F-013, per `registry.json`) | FIXED |
| 2 | "9 decisions" | `planning/overview/phase-overview.md` | **14 decisions** (D-001…D-014, per `decisions/registry.json`) | FIXED |
| 3 | "12 tracked findings" | `planning/phases/phase-09/README.md` | **0 tracked** — Ix-findings has zero commits | FIXED |
| 4 | "12 findings registered with IXF-IDs" | `planning/maps/phases.json`, `planning/wiki/data/data.js` | **13** findings registered | FIXED |
| 5 | MASTER-REPORT "no commits" (vague) | `planning/final/MASTER-REPORT.md` | "no commits, 28 untracked entries" | FIXED |
| 6 | Stale wiki data ("12 findings") | `planning/wiki/data/data.js`, `planning/wiki/index-standalone.html`, workspace preview copy | Regenerated from fixed source | FIXED |

---

## Verified-Accurate Claims (audited live)

| Claim | Source | Verified State |
|---|---|---|
| Ix-findings: 0 commits, 28 untracked entries | Live `git status -sb` | CORRECT |
| Ix main: synchronized with origin/main @ c4f8fea | Live `git branch -vva` | CORRECT |
| Fork/main: 5 behind origin/main @ 0437abf | Live git comparison | CORRECT |
| feat/ix-agent-skill: 13 uncommitted changes | Live `git status -sb` | CORRECT |
| feat/ix-remap-hardening: ahead 1, based on origin/main, clean | Live `git status -sb` | CORRECT |
| ix-compass-dist: clean + untracked artifacts | Live `git status` | CORRECT |

---

## Historical Snapshots (not corrected — they reflect their era)

| File | Content | Why Preserved |
|---|---|---|
| `planning/wiki/repomix-bundle/output.1.md` | Contains "12 findings registered" (stale) | Historical derivative — records state at bundle time |
| `state/phase-0-audit.md` through `state/phase-12-publication-gate.md` | Phase state files from earlier investigation stages | Historical records — not authoritative |
| `reports/master-report.md`, `reports/phase-summaries.md` | Legacy reports (superseded by `planning/final/`) | Historical reference |
| `manifests/investigation-index.json` | Investigation index from earlier phase | Valid for that phase; superseded by planning layer |

---

## Rules for CLI

1. **Do NOT mass-replace historical files** — distinguish between stale claims in CURRENT reports (which are bugs) and stale data in HISTORICAL snapshots (which are provenance).
2. **Revalidate every count** — finding count, decision count, evidence count, node count, edge count.
3. **Report new discrepancies** — if CLI finds a claim that doesn't match live state, record it as a NEW stale-claim entry (S-XXX format) and flag it.
4. **The registries (`registry.json` files) are authoritative** — not the markdown summaries or the wiki data or the historical snapshots.
````
