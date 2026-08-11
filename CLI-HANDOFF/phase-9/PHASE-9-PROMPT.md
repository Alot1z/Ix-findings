# PHASE 9 — COMPASS FORK READINESS & F-KEY/DELAYED-DATA CONSOLIDATION

## STATUS
READY TO EXECUTE — expected outcome BLOCKED or READINESS_ONLY (honest per access)

## PURPOSE

Consolidate the Compass thread (F-001…F-007, F-013) into a drop-in
implementation package for the day `Alot1z/system-compass` can exist, and
**immediately create that fork if access is granted** — while committing
**nothing upstream** and never fabricating source access.

Standing constraint (user, 2026-08-11): **NO PRs and NO commits to
`ix-infrastructure/*`. External writes ONLY to `Alot1z/Ix`,
`Alot1z/system-compass` (fork does not exist — if access is granted, create it
and commit only there), `Alot1z/Ix-findings`.**

## AUTHORITATIVE INPUTS

- `pr-packets/compass-f-key/README.md` (complete implementation spec:
  2-line keyboard entry + KeyboardHelp entry, fit math reuse, what NOT to do)
- `pr-packets/compass-delayed-data/README.md` (investigation packet)
- `planning/compass/*` (reconstruction, historical matrix, lifecycle)
- `comparisons/*` (keyboard, camera-fit, releases timeline)
- `state/phase-6-f-key-gate.md` (the access gate)
- `github/issues/383/README.md` (ecosystem split — system-compass source stays
  private; the F-key belongs there, not in Ix)

## CURRENT VERIFIED BASELINE

- `Alot1z/system-compass`: **404 (does not exist)**; `ix-infrastructure/
  system-compass`: private; v0.3.0 source rev known (`7f98724`) from release
  notes only.
- ix-compass-dist: still v0.3.0 (2026-08-11 verified) — artifact analysis
  current.
- F-001…F-005 CONFIRMED/VERIFIED/REPRODUCED (Class A/B artifact evidence);
  F-006 REPRODUCED_LIVE; F-007 OBSERVED; F-013 Class D (low confidence).
- The release pipeline (#391) now records the system-compass source SHA per
  bundle — a future access grant can be verified against those SHAs.

## NEXT-PHASE OBJECTIVES

1. **Readiness consolidation**: verify the F-key spec is complete and
   unambiguous (2 code lines + KeyboardHelp entry + 15-point test plan);
   refresh the delayed-data packet against the latest v0.3.0 bundle if the
   bundle changed (it has not).
2. **Fork attempt**: attempt to create `Alot1z/system-compass` ONLY if access
   has been granted (API or explicit user confirmation). Never attempt access
   escalation. If 404 persists → record BLOCKED with the exact gate (D-014:
   source access from KageBinary / PAT Contents:read / fork grant).
3. If the fork exists: implement F-key per spec on a fork branch, run the
   specified test plan against the real source, commit to the fork only.
4. Prepare (not submit) a PR body for the Compass f-key change against
   `ix-infrastructure/system-compass`.
5. Re-verify F-013 (zoom ×1.25 vs ×1.1) with a dedicated experiment ONLY if
   source access exists; otherwise leave Class D.

## AUTHORIZATION MODEL

| Action | State |
|---|---|
| Read-only spec consolidation | AUTHORIZED |
| Create `Alot1z/system-compass` | ONLY if access granted (otherwise IMPOSSIBLE) |
| Commit to `Alot1z/system-compass` fork | AUTHORIZED once it exists |
| PR to `ix-infrastructure/system-compass` | **PROHIBITED** (body prepared only) |
| Any upstream contact / access request | **PROHIBITED** (standing rule: present public data, never request) |

## PROTECTED WORK

- Ix `b038c46/14` — untouched.
- ix-compass-dist `396426b/3` — untouched (distribution channel, D-007).
- PR #393 remap branch + `feat/ix-mcp` — untouched.

## IMPLEMENTATION PLAN

1. Re-read the F-key spec + delayed-data packet; gap-check against v0.3.0
   artifacts (unchanged bundle → no re-extraction needed).
2. Try fork creation (gated on access); record exact result.
3. If fork exists: branch `feat/f-key-fit-view`, implement, test per the
   15-point plan, commit, push.
4. Write/refresh `pr-packets/compass-f-key/README.md` PR-body section.
5. `PHASE-9-REPORT.md` + `PHASE-10-IMPLEMENTATION-INPUT.md`.

## VALIDATION PLAN

- Spec completeness checklist (from the F-key packet).
- If implemented: the 15-point test plan + full Compass build.
- If blocked: no false claims — status = BLOCKED, evidence = API 404.

## SECURITY / PRIVACY

- No private source content may be quoted beyond release-note facts.
- No access tokens, no paths, no fabrications.

## TOOLS / SKILLS

`verification-before-completion`, `doubt-driven-development`,
`spec-driven-development`, `source-driven-development` (strictly),
`documentation-writer` (spec consolidation).

## DELIVERABLES

- Updated `pr-packets/compass-f-key/README.md` (drop-in ready)
- `CLI-HANDOFF/phase-9/PHASE-9-REPORT.md` (status: READINESS_ONLY or BLOCKED
  unless access exists)
- `CLI-HANDOFF/phase-9/PHASE-10-IMPLEMENTATION-INPUT.md`
- (Conditional) `Alot1z/system-compass` fork branch

## COMPLETION CRITERIA

□ Spec verified complete □ fork attempt recorded with evidence □ no access
escalation □ no fabrication □ (if access) implementation + tests done □ ledger
in sync

## FAILURE / RECOVERY

- Access blocked → record, keep packets warm, do not attempt workarounds.
- If access appears mid-phase → STOP, re-read the gate doc, proceed only with
  user confirmation.

## PHASE 10 HANDOFF

`PHASE-10-IMPLEMENTATION-INPUT.md` must list every prepared-but-unsubmitted
contribution (remap #393 already open; ix-mcp; compass f-key), their PR bodies,
and the exact user instruction needed to submit any of them.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END PHASE 9
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
