# Phase Overview

High-level map of the complete investigation. Machine-readable: `../maps/phases.json`.
Detailed archives: `../phases/phase-NN/`.

| Phase | Category | Objective | Main repo | Key findings | Key evidence | Changes | Suggestions | Decisions | Deps | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| 00 | DISCOVERY | Initial state audit | Ix | 18-file uncommitted overhaul; fork 5 behind; remap correctly based on origin/main; system-compass private; ix-compass-dist = distribution | E-013, E-019, E-021, E-020 | none (read-only) | S-001, S-002, S-025, S-026 | D-002 | — | COMPLETE |
| 01 | SYNCHRONIZATION | Sync fork/local without losing work | Ix | local main 01308e6→c4f8fea via `git branch -f`; 18 files preserved; fork NOT pushed | E-019 | local `main` pointer fast-forward | S-002, S-016, S-028 | D-001, D-002, D-009 | phase-00 | COMPLETE |
| 02 | IMPLEMENTATION | Finalize remap PR candidate | Ix | real /__ix/remap + loopback guard; WSL fix; node_ok removal; 656 tests | E-014, E-015, E-016 | view.ts, view-server.test.ts, bootstrap.sh, docs/api/README.md (+250/−11) | S-003, S-004, S-005, S-012, S-030 | D-003 | phase-01 | COMPLETE |
| 03 | RESEARCH | Ix #376 from source | Ix | two version series feed one isNewer; correct by accident; breaks when dist > Ix | E-017 | none (analysis) | S-013 | D-004 | phase-01 | COMPLETE |
| 04 | AUDIT | Full security + historical audit | Ix | security posture STRONG; P0 bind (fixed in remap); P2/P3 minors; 8 issues catalogued; remap zero-overlap | E-013, E-020 | none | S-014, S-029, S-031 | D-003 | phase-03 | COMPLETE |
| 05 | RESEARCH | Compass historical reconstruction | system-compass (artifacts) | keyboard/help/fit invariant 4 releases; F never bound; #57 latch→refit | E-001…E-008, E-010, E-011, E-023 | none (analysis) | S-007, S-021, S-022 | D-003, D-004, D-005 | phase-04 | COMPLETE |
| 06 | VERIFICATION | F-key source-access gate | system-compass | source still unavailable; spec finalized | E-004, E-008 | none | S-007, S-032, S-033 | D-005 | phase-05 | COMPLETE (BLOCKED on source) |
| 07 | REPRODUCTION | Delayed-data deep probe | system-compass (runtime) | blank persists on v0.3.0; rollup timing; zoom button ×1.25 vs ×1.1 | E-009, E-011, E-012, E-022 | none (runtime only) | S-008, S-017, S-018 | D-006 | phase-05 | COMPLETE |
| 08 | AUDIT | Repository architecture | ALL | 5-repo map; dist manual no-CI; Ix-findings not a repo yet | E-019, E-020 | none | S-009, S-027 | D-007, D-008 | phase-00 | COMPLETE |
| 09 | AUDIT | Build Ix-findings ledger | Ix-findings | git init; 13 findings; 14 decisions; structure | E-016 | Ix-findings scaffold | S-005, S-015 | D-003, D-008 | phase-08 | COMPLETE |
| 10 | GITHUB | Maintainer/reviewer context | ALL | KageBinary collaborator; josephismikhail code owner; Hiro-Chiba contributor; tagging guidance | E-020 | none | S-006 | — | phase-04 | COMPLETE |
| 11 | PR PREPARATION | PR packets | ALL | 4 packets: remap (ready), F-key (spec), delayed-data (investigation), #376 (ready) | E-008…E-017 | packets under ../pr-packets/ | S-010, S-013, S-020 | D-006, D-009 | phase-10 | COMPLETE |
| 12 | VERIFICATION | Fresh publication gate | Ix | READY TO PUSH: YES; READY TO OPEN PR: YES; blockers none | E-014…E-016 | none (fresh re-run) | S-016 | D-009 | phase-11 | COMPLETE |
| 13 | PR PREPARATION | (PENDING) push + open PR | Ix | — | — | — | — | D-009 | phase-12 | **BLOCKED — authorization** |
| final | AUDIT | Master audit + wiki + reports | ALL | reconciliations (dates, IDs, zoom); knowledge graph; wiki; master report | E-001…E-025 | this `planning/` layer | all re-registered | D-001…D-014 | all | COMPLETE |

## Phase family summary

- **Discovery/sync** (00–01): ground truth + safe sync.
- **Implementation/verification** (02, 12): the only real code change
  (remap branch) + fresh gate.
- **Research/analysis** (03, 04, 05, 07): #376, security, Compass history,
  delayed-data.
- **Gates** (06): source access verdict.
- **Ecosystem** (08, 09, 10): repos, ledger, GitHub.
- **Preparation** (11, 13): packets; push/PR pending authorization.
- **Final** (this phase): consolidation + knowledge system.
