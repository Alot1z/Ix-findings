# Phase B — Ix-Context Capability Enhancements Campaign

**Opened:** 2026-08-17 (Europe/Berlin)
**Scope:** only existing Ix-context capabilities (ix context, ix context --resume,
ix context --diff, ix context --save, ix context --out, ix context --as-of-rev,
MCP ix_context). No core-ingestion work. No new bugs invented.

**Closed prior phase:** 2026-08-17 — see
`planning/campaigns/ix-context-pr423-pr455/PHASE-A-COMPLETE.md` (commit `d01416c5`).

**Upstream SHA baseline:** `8be5f110a5a072767e04dc108e79c539d1bab0f9`
**Fork tip:** tracked per branch below
**PR #455 status:** OPEN — head `084faae83245774db3fdaebfc7361c50281a55e7`, base `4a88a654de10efdd88335f7966b5553a41cd7ded`. NOT the destination for unrelated new work.

---

(Sections previously included: inventories, capability audit table,
decision matrix, out-of-scope list, per-candidate implementation rules,
routing rules. Those now live in the round-1 case history below; the live
status of each candidate is recorded in the implementation sections that
follow.)

---

## Phase B-1: `--format llm` parity for `--diff`

**Status:** COMPLETE — implemented on fork
**Branch:** `feat/diff-format-llm-parity`
**Tip:** `6363612b4b29773fd565dca6c99bae38cd8dd454`
**Diff:** `2 files changed, 178 insertions(+), 1 deletion(-)`

Files:

- `ix-cli/src/cli/commands/context.ts` — export `renderInvestigationDiff` and add the llm branch.
- `ix-cli/src/cli/__tests__/context-investigation.test.ts` — 3 new tests.

Evidence:

- Pre-fix: `renderInvestigationDiff` branched only on `format === "json"`. llm fell through to the prose renderer — the most common agent path (`--diff --format llm`) was the worst one.
- Post-fix: llm branch mirroring `renderBundle`'s wire contract — counts always emitted (zero is signal), items prefixed with `+`/`-`, one record per line.

Validation:

- 11 focused ix-context test files (134 tests): green.
- Three consecutive runs of the four slow infrastructure files (view-server, upgrade-* , watch-dedup): pass on this branch and on origin/main with identical flake pattern, so the prior full-suite flakes are unrelated to this change.
- `npx tsc --noEmit`: clean.
- `npx eslint src/cli/commands/context.ts src/cli/__tests__/context-investigation.test.ts`: clean.

Destination: When upstream contribution is authorized, the production change is the natural sibling of PR #455's read-side validation guard and can ride that PR's branch — both fixes pour through the same `loadInvestigation` boundary and the same wire-format contract. Until then: fork-only.

---

## Phase B-2: `ix context --list` for discovery

**Status:** COMPLETE — implemented on fork
**Branch:** `feat/context-list-investigations`
**Tip:** `ea26d93d73c610a1cecc350a4850fa603cf01475`
**Diff:** `2 files changed, 188 insertions(+), 2 deletions(-)`

Files:

- `ix-cli/src/cli/commands/context.ts` — `--list` flag, `listInvestigations()`, `renderInvestigationList()`.
- `ix-cli/src/cli/__tests__/context-investigation.test.ts` — 3 new tests.

Evidence:

- Pre-fix: no surface enumerated saved investigations. The only path was reading `~/.ix/investigations/*.json` directly.
- Post-fix: `ix context --list` lists every saved investigation with id, target, savedAt, freshness, counts, and truncation. Same wire formats as the rest of the CLI (text / llm / json).
- The same read-side hardening PR #455 added for `--resume`/`--diff` is enforced here: corrupt envelopes, truncated JSON, and tampered bodies are skipped from the listing rather than poisoning it.

Validation:

- 81/81 targeted tests pass.
- Typecheck and eslint clean.
- Tests pin: (a) deterministic newest-first ordering, (b) corrupt files skipped without breaking the listing, (c) directory-not-yet case returns [].

Destination: A local PR on origin/main once upstream contribution is authorized. Not a duplicate of #455 (different surface). Do NOT comment on #423 (closed) or #455 (different topic).

---

## Phase B-3: `effectiveBudgets` field on bundle

**Status:** REJECTED — duplicate of existing fields.

Reason:

- `bundle.budgets` already exposes the asked-for limits.
- `bundle.truncation` already exposes what was cut.
- `bundle.entities.length`, `bundle.relationships.length`, `bundle.evidence.length` already expose what was actually used.

A `bundle.effectiveBudgets` field would be derivable from those three and would not answer any question an agent currently cannot answer.

Decision: do not introduce. Recorded so future contributors do not rediscover the same gap.

---

## Phase B-4: `--diff --max-*` honor-overrides hypothesis

**Status:** NOT IMPLEMENTED — needs fresh reproduction before any fix or doc-only decision.

Reading the `--diff` action handler:

```ts
if (opts.diff) {
  ...
  const fresh = await buildFreshBundle(
    target ?? saved.bundle.target.name,
    { ...opts, ...mergeDiffOptions(saved, opts) },   // restores asOfRev and depth only
    saved.bundle.budgets,                            // SAVED budgets win
  );
```

`mergeDiffOptions` only merges `asOfRev` and `depth`. `buildFreshBundle`'s `opts` parameter type is `{ kind?, path?, pick?, depth?, asOfRev? }`. The CLI's `--max-entities`, `--max-relationships`, `--max-evidence`, `--max-chars` flags are not passed to the fresh build at all; the saved envelope's budgets win for the fresh side.

Hypothesis: running

`ix context Widget --save foo --max-entities 200; ix context --diff foo --max-entities 10`

silently returns the saved 200-entity frame instead of the requested 10.

Why not implemented this turn:

- Prior campaign declared "by-design" without a reproduction; that decision must not survive the campaign rule of evidence-before-decision.
- Reproducing needs a running backend; without it, neither a fix nor a documented precedence rule can be confidently proposed.
- The behavior may be intentional (like-for-like diff) or a defect (silent override); only a run + adversarial review can decide.

Decision: defer to a future Phase C that boots the Docker backend, runs both shapes, and either proposes the smallest compat fix or writes the precedence rule into `docs/llm-format.md`.

---

## Phase B campaign summary

```text
Implemented this turn (fork-only, not pushed):
  B-1: feat/diff-format-llm-parity      — tip 6363612
       Production: add llm branch to renderInvestigationDiff
       Tests:      3 (empty-diff, populated-diff, prose-path unchanged)
  B-2: feat/context-list-investigations — tip ea26d93
       Production: ix context --list; listInvestigations(); renderInvestigationList()
       Tests:      3 (ordering, corrupt-file skipping, missing-dir case)

Rejected (with documented reasoning):
  B-3 effectiveBudgets — duplicate of budgets/truncation/lengths

Deferred (awaiting reproduction):
  B-4 --diff budget overrides — needs a live backend repro

Out of scope for this campaign:
  F-022, extractJsExportPublicNames, build-at-SHA tooling
```
