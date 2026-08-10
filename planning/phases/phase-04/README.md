# Phase 04 — Full Security & Historical Audit

| Field | Value |
|---|---|
| Phase | 04 |
| Purpose | Broad security + historical audit of the Ix repository |
| Date/time | 2026-08-10 |
| Category | AUDIT |
| Inputs | phase-03; merged main; GitHub open issues/PRs |
| Repositories involved | ix-infrastructure/Ix |
| Artifacts involved | none |
| Work performed | CI/security posture review (gitleaks, Trivy, Scorecard, dependency review, pinned actions, hardened runners, atomic config writes, debug redaction); secrets scan; issue/PR catalogue; remap zero-overlap check |
| Findings | Security posture STRONG; P0 bind (fixed in remap); P2 url.parse/DEP0169; P2 localhost-vs-127.0.0.1 advertising; P3 token format validation; P3 curl-pipe-no-hash; P3 stale compass-patch reference |
| Evidence | E-013, E-020 |
| Changes | none |
| Tests | none (audit) |
| Suggestions | S-014 (fix #371 — DEFERRED), S-029 (reset --hard — REJECTED/dangerous), S-031 (biased review — REJECTED) |
| Decisions | D-003 |
| Unresolved questions | whether `ix reset` global warning needs an issue |
| Outputs | `../../findings/phase-4-audit.md`, `../../security/findings.md`, `../../github/maintainer-context.md` |
| Next-phase dependencies | phase-05 (Compass archaeology), phase-10 (GitHub context) |

**Remap clearance:** zero overlap between the remap diff and all 8 open issues /
6 open PRs at the time.
