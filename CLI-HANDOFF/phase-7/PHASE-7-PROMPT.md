# PHASE 7 — POST-CONTRIBUTION STEWARDSHIP & FINAL RECONCILIATION

## STATUS
READY TO EXECUTE

## PURPOSE

Verify and steward the submitted work (remap PR #393), reconcile the knowledge
ledger with the post-Phase-6 upstream reality (including the two supersession
PRs now merged), catalogue the remaining open issues, and finalize the
Ix-findings ledger — **without any upstream mutation and without creating any
upstream PRs**.

Standing constraint (user, 2026-08-11): **NO PRs and NO commits to any
`ix-infrastructure/*` repository. External writes are permitted ONLY to:**

1. `Alot1z/Ix` (the user's fork)
2. `Alot1z/system-compass` (the user's fork — NOTE: does not exist yet; private
   upstream makes it unforkable; do not fabricate it)
3. `Alot1z/Ix-findings` (the ledger, already pushed)

## AUTHORITATIVE INPUTS

- `CLI-HANDOFF/phase-6/PHASE-6-REPORT.md`
- `CLI-HANDOFF/phase-6/PHASE-7-IMPLEMENTATION-INPUT.md`
- `CLI-HANDOFF/phase-6/*.json` (authorization, live baseline, execution results)
- `state/phase-7-upstream-reconciliation-2026-08-11.md`
- `CLI-HANDOFF/PR-MATRIX.md`, `CLI-HANDOFF/STALE-CLAIMS.md` (S-042+)
- `planning/findings/registry.json` + `registry.md`
- `github/issues/*` (371, 374, 376, 379, 381 + new: 385, 383, 349, 219)

## CURRENT VERIFIED BASELINE (2026-08-11, API-verified)

| Item | State |
|---|---|
| PR #393 (remap, ours) | OPEN, `MERGEABLE`, 14/14 CI green, `BLOCKED` only on `REVIEW_REQUIRED` — no action needed from us |
| PR #390 (patches, F-009) | **MERGED** (2026-08-11 03:17Z) — issue #371 CLOSED as completed |
| PR #391 (version series, F-008) | **MERGED** (2026-08-11 04:36Z) — issue #376 CLOSED as completed |
| PR #392 (stage under IX_HOME) | MERGED — upstream main now `1292375` |
| Fork `Alot1z/Ix` main | `5488741` — **behind upstream `1292375`; sync attempted and BLOCKED by PAT workflow-scope guard** |
| Fork remap branch | `1497596` (matches local, API-verified) |
| Open issues | #385 (fixed on main, awaiting reporter confirm) · #383 (fixed in ix-codex-plugin) · #349 (fixed on main #352, awaiting verify run) · **#219 (`ix mcp`, OPEN — the actionable item)** |
| `Alot1z/system-compass` | **404 — does not exist** (cannot fork private upstream without access) |
| Ix protected worktree | `b038c46` / 14 dirty — MUST stay untouched |
| ix-compass-dist | `396426b` / 3 dirty — MUST stay untouched |
| Ix-findings | `master` @ `9b4859c`, pushed; uncommitted reconciliation edits pending commit |

## NEXT-PHASE OBJECTIVES

1. Verify PR #393 health read-only (CI, mergeable state). No action unless red.
2. Confirm #390/#391 merged + #371/#376 closed; mark F-008/F-009 RESOLVED_UPSTREAM
   in every living registry (registry.json/registry.md, findings-index.json,
   README, FINDINGS.md, by-*.md, PR-MATRIX, STALE-CLAIMS S-042+).
3. Attempt fork-main sync ONLY via verified fast-forward (ancestor check) and
   the sanctioned `gh repo sync` path. If blocked by the PAT workflow-scope
   guard, record BLOCKED with the exact remedy — do not force, do not use
   partial workarounds, do not push a reduced commit set.
4. Catalogue the four open issues (#385, #383, #349, #219) into
   `github/issues/<n>/README.md` with Class A/B evidence and verified fix
   state. Investigate #219 (`ix mcp`) as the sole actionable item and hand it
   to Phase 8.
5. Commit + push the ledger to `Alot1z/Ix-findings` (Pages workflow
   auto-redeploys on master push — authorized).
6. Produce `PHASE-7-REPORT.md` and `PHASE-8-IMPLEMENTATION-INPUT.md`.
7. Write the standing Phase 8/9/10 prompts (fork-only constraint encoded).

## AUTHORIZATION MODEL

| Action | State |
|---|---|
| LOCAL read/inspect/test | AUTHORIZED (read-only first) |
| Ix-findings commit + push | **AUTHORIZED** (user explicitly listed Ix-findings) |
| Fork `Alot1z/Ix` main sync (fast-forward) | AUTHORIZED in principle ("commits to my forked Ix") but currently BLOCKED by PAT `workflow` scope; remedy: `gh auth refresh -s workflow` or GitHub UI "Sync fork" |
| New PRs to `ix-infrastructure/*` | **PROHIBITED** (standing constraint) |
| Comments/issues/maintainer contact upstream | **PROHIBITED** |
| Mutate protected worktrees | **PROHIBITED** |
| Create `Alot1z/system-compass` | IMPOSSIBLE until upstream grants access (do not fabricate) |
| Merge anything | PROHIBITED |

## PROTECTED WORK

- `E:/E-github-repos/Ix` — `feat/ix-agent-skill` @ `b038c46`, 14 dirty. NEVER modify.
- `E:/E-github-repos/ix-compass-dist` — `main` @ `396426b`, 3 dirty. NEVER modify.
- `E:/E-github-repos/Ix-remap` — `1497596`, pushed; backup refs preserved.
- Upstream `ix-infrastructure/Ix` — read-only forever.

## IMPLEMENTATION PLAN

1. Live re-verify: PR #393 state, #390/#391 merged_at, #371/#376 closed_at,
   open-issue list, upstream/fork SHAs, Alot1z repo inventory.
2. Attempt fork-main sync (ancestor check → `gh repo sync`); record result.
3. Write the four issue docs; update living registries; update STALE-CLAIMS
   with any new discrepancy rows.
4. Create `CLI-HANDOFF/phase-7/` (prompt, report, Phase 8 input) and
   `CLI-HANDOFF/phase-8/…phase-10/` prompt files.
5. Commit (Phase 7 style message) + push to `Alot1z/Ix-findings`.

## VALIDATION PLAN

- JSON validity on every edited registry (python -m json.tool).
- API re-verification of every claimed remote state (no local-only claims for
  remote facts).
- Secret scan on new files (no tokens, no local paths).
- Protected-worktree before/after comparison.
- `git status` review before commit (only intended files staged).

## SECURITY / PRIVACY

- No credentials/tokens/paths in any committed artifact.
- No private URLs, no internal-only data.
- The ledger is PUBLIC — treat everything written as publishable.

## TOOLS / SKILLS

Apply: `verification-before-completion`, `doubt-driven-development`,
`source-driven-development`, `sequential-thinking`, `git-workflow-and-versioning`,
`stop-slop`. Re-run the thinking cadence between milestones.

## DELIVERABLES

- `github/issues/{385,383,349,219}/README.md`
- `CLI-HANDOFF/phase-7/PHASE-7-PROMPT.md`, `PHASE-7-REPORT.md`,
  `PHASE-8-IMPLEMENTATION-INPUT.md`
- `CLI-HANDOFF/phase-8/PHASE-8-PROMPT.md`
- `CLI-HANDOFF/phase-9/PHASE-9-PROMPT.md`
- `CLI-HANDOFF/phase-10/PHASE-10-PROMPT.md`
- Updated registries + STALE-CLAIMS
- One Ix-findings commit, pushed

## COMPLETION CRITERIA

□ PR #393 re-verified □ supersessions recorded □ fork-sync outcome recorded
□ four issue docs written □ registries consistent (JSON valid) □ ledger
committed + pushed □ protected work unchanged □ Phase 8 input produced
□ zero upstream mutations □ zero new upstream PRs

## FAILURE / RECOVERY

- Fork sync blocked → record BLOCKED + remedy; do not force; do not partially sync.
- Push rejected → inspect exact error, never retry blindly; workflow-scope
  guard is expected and recorded.
- Registry conflicts → trust the machine-readable registries over prose.

## PHASE 8 HANDOFF

`PHASE-8-IMPLEMENTATION-INPUT.md` must specify: `ix mcp` (#219) design scope,
tool-candidate list (read: map/explain/trace/impact/search/rank; write:
remap), registration surface (`oss.ts` — F-009 lesson), `--format llm` reuse,
stdio transport, tests, fork branch `feat/ix-mcp`, and the prepared (not
submitted) PR body.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END PHASE 7
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
