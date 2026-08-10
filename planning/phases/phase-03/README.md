# Phase 03 — Issue #376 Investigation

| Field | Value |
|---|---|
| Phase | 03 |
| Purpose | Investigate Ix #376 (version-series mismatch in `ix upgrade`) from source |
| Date/time | 2026-08-10 |
| Category | RESEARCH |
| Inputs | merged main (`c4f8fea`); issue body by KageBinary |
| Repositories involved | ix-infrastructure/Ix |
| Artifacts involved | shipped v0.9.1 linux tarball (compass/.version = 0.9.1) |
| Work performed | source analysis of `upgrade.ts` (isNewer, getInstalledCompassVersion, writeCache), `release.yml` stamping, PR #365/#366/#344 history |
| Findings | F-008 (#376): two version series feed one `isNewer`; correct only by accident; breaks when ix-compass-dist version > Ix version |
| Evidence | E-017 |
| Changes | none (analysis + packet) |
| Tests | none (deterministic logic from source; failure path documented) |
| Suggestions | S-013 (fix #376 — DEFERRED, authorization) |
| Decisions | D-004 (release notes / source as Class A) |
| Unresolved questions | preferred fix option (A stamp dist version / B identity / C two fields) — maintainer direction needed |
| Outputs | `../../github/issues/376/README.md`, `../../pr-packets/ix-376-version-mismatch/README.md` |
| Next-phase dependencies | phase-04 (audit) |

**Causal chain:** PR #365 stamps `compass/.version` with the **Ix** version →
`isNewer(compassLatest, compassCurrent)` compares dist series ("0.3.0") to Ix
series ("0.9.1") → currently false (correct by accident) → breaks the moment
ix-compass-dist tags above the running Ix version (v0.9.2/v1.0.0) → same
downgrade regression v0.9.1 fixed, via a different route.
