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
