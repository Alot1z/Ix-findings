# Next Actions — Prioritized Matrix

> All actions are local-safety-reviewed. Any action requiring authorization is
> marked. "Safe to execute now?" = no authorization or destructive risk.

## NOW (local, safe, no authorization)

| # | Action | Repo | Reason | Evidence | Owner/Reviewer |
|---|---|---|---|---|---|
| 1 | Decide D-011…D-014 (Compass PR scope, chip, stopgap, access path) | all | unblocks the Compass thread | findings F-001…F-007 | user |
| 2 | Decide D-010 (port prep location) | system-compass prep | unblocks port build-out | D-010 | user |
| 3 | Commit the Ix-findings ledger (incl. this planning layer) | Ix-findings | durable record; S-015 | — | user |
| 4 | Optionally create `Alot1z/Ix-findings` GitHub repo | Ix-findings | shareable ledger | D-008 | user (authorization) |

## NEXT (safe to prepare now; execute on authorization)

| # | Action | Repo | Reason | Evidence | Safe now? | Authorization? |
|---|---|---|---|---|---|---|
| 5 | Push `feat/ix-remap-hardening` → fork | Alot1z/Ix | PR-ready branch | E-014…E-016 | no | **YES** (D-009) |
| 6 | Open remap PR → upstream main; request code-owner review; mention KageBinary | ix-infrastructure/Ix | deliver F-010/F-011/F-012 | packet | no | **YES** |
| 7 | After remap: sync fork/main (`git push fork main`) | Alot1z/Ix | S-016 | E-019 | no | **YES** |
| 8 | Prepare + open #376 fix PR (Option A) | ix-infrastructure/Ix | F-008 | E-017 | no | **YES** + maintainer direction |
| 9 | Raise #371 decision (OSS vs Pro) | ix-infrastructure/Ix | F-009 | E-018 | no | **YES** + maintainer direction |

## BLOCKED (source access)

| # | Action | Repo | Reason | Evidence | Blocker | Owner/Reviewer |
|---|---|---|---|---|---|---|
| 10 | Implement F-key PR from spec | system-compass | F-001…F-005 | E-005…E-008, E-010, E-025 | source access (D-014) | KageBinary |
| 11 | File + fix delayed-data (F-006/F-007) | system-compass | reproducible blank | E-009, E-012 | source access | KageBinary |

## OPTIONAL (worth doing when time allows)

| # | Action | Reason | Evidence |
|---|---|---|---|
| 12 | Re-verify zoom ×1.1 vs ×1.25 with a dedicated experiment | F-013 | E-011 |
| 13 | Add no-map chip with feature-detect after remap merges | S-020, D-012 | E-014 |
| 14 | Follow-up: DEP0169 + localhost-advertising (P2 security) | hardening | security audit |
| 15 | Investigate system-compass #58/#59 | completeness | E-008 |

## DO NOT DO

| Action | Why |
|---|---|
| `git reset --hard` / force-push any fork branch | destroys the 13-file overhaul / risks work (S-029) |
| Push anything without explicit authorization | D-009 |
| Modify ix-compass-dist artifacts | distribution channel (D-007) |
| Fabricate system-compass source or PR numbers | integrity rule |
| Share `<IX_REPO>/tasks/*.md` unsanitized | contains drive paths (privacy) |
| Mix Compass UI changes into the Ix PR | S-006/S-024 |