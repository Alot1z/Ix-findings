# Phase A — Completion Record

## Status

```text
FORENSIC CAMPAIGN (PR #423 / PR #455 / F-023): PHASE A COMPLETE
```

This record closes Phase A of the campaign. Phase B (new evidence-backed
enhancement campaign) starts in a separate record.

## Live state at capture

Captured: 2026-08-17 (Europe/Berlin)

```text
Upstream/main                           : 8be5f110a5a072767e04dc108e79c539d1bab0f9
PR #423 merge                           : 85152eb9895ebe7a9062f2067cd582da3b6eeb1a
PR #455 head (live, fetched 2026-08-17) : 084faae83245774db3fdaebfc7361c50281a55e7
PR #455 base (live)                     : 4a88a654de10efdd88335f7966b5553a41cd7ded
PR #455 status                          : OPEN (canonical destination)
F-023                                   : confirmed (high), complaint (PR exists, not yet merged)

fork (Alot1z/Ix-remap)
  branch                                : feat/audit-read-side-investigation-validation
  HEAD                                  : 76134e22e0ecec1d0af1203e845f31c4b78f22c7
  ahead of upstream/main                : 1
  working tree                          : clean (only .code-index/ untracked — Ix self-cache)
  diff vs upstream/main                 : ix-cli/src/cli/commands/context.ts (+16/-0) +
                                          ix-cli/src/cli/__tests__/context-investigation.test.ts (+71/-0)
  production-logic vs PR #455           : byte-identical (loadInvestigation safeParse block)
  additional regression coverage        : one extra test — "refuses to resume a bundle with a
                                          missing required target field" — defense-in-depth
                                          against the shape the --diff path re-resolves.

findings (Alot1z/Ix-findings)
  branch                                : master
  HEAD                                  : c0ffb81c6ce60b1b2ca8d49c3dd01d0821965dd5
  ahead of origin/master                : 1
  working tree                          : clean
  evidence contents                     : present, intact, byte-stable since capture
```

## Verification record

```text
Ix-remap targeted tests           : 20/20 pass (ix-cli/src/cli/__tests__/context.test.ts +
                                                 ix-cli/src/cli/__tests__/context-investigation.test.ts)
Ix-remap full suite               : 978/978 pass (recorded in previous campaign turn)
Ix-remap typecheck (npm run typecheck) : clean
Ix-remap eslint on changed files   : clean
F-023 reducer corpus               : 5/9 fail on origin/main, 9/9 pass on fork 76134e22
                                    (transcripts preserved under
                                    findings/ix-context/reproducers/ci-output/)
```

## Contribution ledger

| Change | SHA | Repo | Branch | Destination | Action | Status |
| ------ | --- | ---- | ------ | ----------- | ------ | ------ |
| Read-side persisted-bundle validation fix (+ 1 extra regression test) | 76134e22e0ecec1d0af1203e845f31c4b78f22c7 | Alot1z/Ix-remap | feat/audit-read-side-investigation-validation | upstream PR #455 (origin/fix/validate-saved-investigation @ 084faae — same production fix, additional regression test) | NOT PUSHED; awaiting upstream-authorization gate | prepared |
| F-023 evidence + architecture + corpus + campaign record | c0ffb81c6ce60b1b2ca8d49c3dd01d0821965dd5 | Alot1z/Ix-findings | master | findings only — historical record of the #423/#455 audit | committed locally; not pushed to origin; not yet routed | prepared |

## Upstream action

```text
Upstream modified   : NO
Upstream pushed     : NO
PR created          : NO
PR updated          : NO
Comment posted      : NO
```

`UPSTREAM ACTION AUTHORIZED: NO` (no explicit authorization granted this turn).

## Historical PR handling

```text
PR #423 (CLOSED, merge 85152eb):
  Referenced historically: YES
  Commented on: NO
  Reopened: NO
  Modified: NO
  Used as destination: NO

PR #455 (OPEN, head 084faae, base 4a88a65):
  Treated as canonical upstream destination: YES
  New duplicate PR created: NO
  Branch force-pushed or hijacked: NO
  Comment posted: NO
```

## Forks not pushed (rationale)

- Forking `Alot1z/Ix-remap` to its own remote is mechanical and unrelated to upstream contribution. The fork is left local-only — pushing to the user's own fork does not change what is sent upstream and can be done at any time without committing to an upstream contribution.
- `Alot1z/Ix-findings` is similarly local-only and untouched on its remote.
- The `feat/audit-read-side-investigation-validation` branch contains a forward-port of #455 plus one new regression test. Without explicit upstream authorization, the safe action is to (a) keep the work cleanly committed locally, (b) record its provenance here, and (c) wait for an explicit "contribute upstream" instruction before any push, PR creation, or comment.

## What Phase A intentionally did NOT do

- No new comments on PR #423 (closed).
- No new comments on PR #455 (open but unrequested).
- No new commits beyond the audit-evidence commit already on `Alot1z/Ix-findings` (`c0ffb81c6`) and the audit-fix commit already on `Alot1z/Ix-remap` (`76134e22`).
- No megamerge of upstream or fork history.
- No rewriting of historical attribution.

## What Phase B begins next

Forensic campaign closed.

Separate engineering enhancement campaign begins, scoped narrowly to:

- existing Ix-context capabilities (ix context + investigation state + MCP ix_context);
- evidence-backed improvements only;
- no new bugs invented;
- no new findings imagined;
- per-change destination triage (existing open PR > legitimate new PR > fork-only > reject);
- never comments on closed PRs;
- never duplicates #455.

A new campaign record is opened in a sibling file:

`planning/campaigns/ix-context-enhancements/CAMPAIGN.md`
