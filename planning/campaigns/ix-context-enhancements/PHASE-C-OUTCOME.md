# Phase C - Finalize Contributions & Resolve B-4

Phase C of the Ix-context campaign completes the contribution queue
established by Phase A (F-023 / #455) and Phase B (B-1 LLM-format for
`--diff`, B-2 `ix context --list`, B-3 effective-budgets
rejected-by-design, B-4 budget precedence unproven). It also adds
F-024 with the smallest evidence-backed UX fix.

## Phase C contribution ledger at completion

| ID     | Title                                                 | Fork branch                                      | Fork HEAD          | Destination                       | Status                                |
| ------ | ----------------------------------------------------- | ------------------------------------------------ | ------------------ | --------------------------------- | ------------------------------------- |
| F-023  | Read-side bundle schema validation                    | `feat/audit-read-side-investigation-validation`  | `76134e22`         | PR #455 (canonical, OPEN)         | Confirmed fix, awaiting #455 merge    |
| B-1    | `--format llm` for `--diff`                           | `feat/diff-format-llm-parity`                    | `6363612`          | NEW PR (small, independent)        | Ready, awaits push authorization      |
| B-2    | `ix context --list`                                   | `feat/context-list-investigations`               | `ea26d93`          | NEW PR (medium, independent)       | Ready, awaits push authorization      |
| F-024  | Budget transparency on `--diff` (B-4)                 | `feat/context-diff-budget-transparency`          | `58aea40`          | NEW PR (small, independent)         | Confirmed UX gap, fix committed       |

## B-4 - confirmed, classified B (silent-ignore UX gap), fixed

B-4 was the only outstanding Phase B technical question. Phase C
reproduced it on a real backend:

- Static reproduction: `buildFreshBundle(target, optsTrimmed, saved.bundle.budgets)` is unconditional on `--diff`.
- Live reproduction: saved with max-evidence=25, then `--diff
  --max-evidence 1` produced an empty `added.evidence`/`removed.evidence`.
- Converse: saved with max-evidence=2, then `--diff --max-evidence 25` also produced empty evidence diff (because saved-wins for the fresh side).

Classification: B - UX / silent-ignore bug. CLI accepts `--max-*` flags on
`--diff` and silently discards them on the fresh side. Implementing a
behaviour change is out of scope for an evidence-backed fix; the minimal
safe fix surfaces the precedence as data.

Fix (`58aea40`): `budgets: { saved, requested?, effective, note }` field
on `ix-investigation-diff/1` (additive only); drop commander defaults on
`--max-*` so `parseRequestedBudgets` can distinguish absent flags from
explicit ones (defaults still applied via `clampInt`); render a
four-line budgets block in text/llm; tests covering every observable
surface.

Tests: 978/978 pass; typecheck clean; lint clean.

## Repository final state at 2026-08-17

- Fork `Alot1z/Ix-remap` `feat/context-diff-budget-transparency` ahead of `origin/main` by 1 commit.
- Fork `Alot1z/Ix-remap` `feat/audit-read-side-investigation-validation` ahead of `origin/main` by 1 commit (Phase A).
- Fork `Alot1z/Ix-remap` `feat/diff-format-llm-parity` ahead of `origin/main` by 1 commit (Phase B).
- Fork `Alot1z/Ix-remap` `feat/context-list-investigations` ahead of `origin/main` by 1 commit (Phase B).
- Findings `Alot1z/Ix-findings` `master` ahead of `origin/master` by 5 commits (F-023 evidence, Phase-A completion, Phase-B open, Phase-B outcome, F-024 evidence).

## Upstream action gate

UPSTREAM ACTION AUTHORIZED: NO.

No upstream push, no upstream comment, no upstream PR opened, no
upstream rebase. All work is committed locally and routed to the
correct destination when (and only when) authorization arrives.

## PR routing table (final)

| Change                              | PR # | Status         | New PR required? | Why                                                                                       |
| ----------------------------------- | ---- | -------------- | ---------------- | ----------------------------------------------------------------------------------------- |
| F-023 read-side validation          | #455 | OPEN (head 084faae) | NO | Same production fix; 76134e22 mirrors it with one extra regression test.                  |
| B-1 LLM format for --diff           | n/a  | Not proposed   | YES (small)      | Independent feature touching one renderer.                                                |
| B-2 `ix context --list`             | n/a  | Not proposed   | YES              | Independent capability with its own discoverability story.                                |
| F-024 budget transparency (B-4)     | n/a  | Not proposed   | YES (small)      | Independent UX fix adding a single field per the campaign's documented UX-gap framework.  |

## Provenance firewall preserved

- Original #423 commits: Alot1z (7) + KageBinary (2) - historical, never re-attributed.
- #455 production fix: josephismikhail - never represented as Alot1z work.
- F-023 fork implementation: Alot1z (76134e22) - labelled in registry as fork-local.
- B-1 / B-2 / F-024 fork implementations: Alot1z - labelled as fork-local or
  "ready for upstream PR".

## Stop condition reached

The contribution queue is clean. No Phase D started - the campaign
explicitly stops here per the user's mission brief.
