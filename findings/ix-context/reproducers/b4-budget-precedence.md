# B-4 - `ix context --diff` silently ignores CLI `--max-*`

Campaign: Phase C ("Finalize Contributions and Resolve B-4")
Subsystem: `ix context` (`ix-cli/src/cli/commands/context.ts`)
Status: confirmed -> fixed in fork branch `feat/context-diff-budget-transparency` at `58aea40`

## Hypothesis

Phase B observed (but did not prove) that
`ix context --diff <id> --max-entities N --max-evidence M ...` could
silently ignore the `--max-*` flags the user supplied on the command
line, and instead keep using the saved investigation's recorded
budgets on the fresh side of the comparison. B-4 was the last open
candidate from the capability audit.

## Static reproduction (code path)

Action handler in `ix-cli/src/cli/commands/context.ts` (the
`if (opts.diff)` branch):

```ts
const fresh = await buildFreshBundle(
  target ?? saved.bundle.target.name,
  { ...opts, ...mergeDiffOptions(saved, opts) },
  saved.bundle.budgets,
);
```

`buildFreshBundle`'s signature (same file, ~line 255):

```ts
async function buildFreshBundle(
  target: string,
  opts: { kind?: string; path?: string; pick?: number; depth?: string; asOfRev?: string },
  budgets: { maxEntities: number; maxRelationships: number; maxEvidence: number; maxChars: number },
): Promise<ContextBundle | undefined>
```

`opts.maxX` are filtered out by the typing of `buildFreshBundle`
even though the caller spreads `opts`. The third argument - the budgets
that actually bound the fresh bundle - is hard-coded to
`saved.bundle.budgets`. `mergeDiffOptions` only merges `asOfRev` and
`depth`, never the budgets.

## Live reproduction against real backend

Date: 2026-08-17 (Europe/Berlin)
Backend: `ghcr.io/ix-infrastructure/ix-memory-layer:latest`
ArangoDB: `arangodb:3.12`
Fixture: `/tmp/b4-fixture` (4 TypeScript files; 2 regions; rev 122)

### Setup

1. `ix map /tmp/b4-fixture` registered workspace `b4-fixture`.
2. `ix context centroid --kind function --save b4-large --max-entities 50 --max-evidence 25 --max-relationships 100`.

Saved budgets (via Node):
```
{ maxEntities: 50, maxRelationships: 100, maxEvidence: 25, maxChars: 12000 }
```

### Run A - saved with small budgets, then `--diff` with large CLI budgets

```bash
$ ix context centroid --kind function --save b4-small \
    --max-entities 5 --max-evidence 2 --max-relationships 1
[Note: Saved investigation "b4-small" (1 entities, 0 relationships, 2 evidence items).]

$ ix context --diff b4-small --kind function \
    --max-entities 50 --max-evidence 25 --max-relationships 100 --format json
{
  "schema": "ix-investigation-diff/1",
  ...
  "added":   { "entities": [], "relationships": [], "evidence": [], "claims": [] },
  "removed": { "entities": [], "relationships": [], "evidence": [], "claims": [] }
}
```

`added.evidence` and `removed.evidence` are both empty even though
the request asked for 25 evidence items, because the fresh side kept
the saved budget (2 evidence).

### Run B - saved with large budgets, then `--diff` with tiny CLI budgets

```bash
$ ix context --diff b4-large --kind function \
    --max-entities 1 --max-evidence 1 --max-relationships 0 --format json
{
  "schema": "ix-investigation-diff/1",
  ...
  "added":   { "entities": [], "relationships": [], "evidence": [], "claims": [] },
  "removed": { "entities": [], "relationships": [], "evidence": [], "claims": [] }
}
```

`removed.evidence` is empty even though the request asked for a
budget of 1 evidence per side. The CLI's `--max-evidence 1` did not
shrink the fresh side.

## Classification

**B - UX / silent-ignore bug**: the CLI accepts `--max-*` flags on
`--diff` and silently discards them on the fresh side. The diff
output did not expose any field that would tell a human or an agent
why the flag had no effect, so the silent ignore was also a
discoverability gap on the supported diff pathway.

Implementing a behavior change (allowing CLI overrides to win) was
considered and rejected: the saved-budget precedence is the
documented behavior of `--resume` and mirrors `--diff`; flipping it
across the board is a breaking change that requires separate
authorization. The minimal safe fix is to surface the precedence as
data.

## Fix (fork branch `feat/context-diff-budget-transparency` @ `58aea40`)

- `InvestigationDiff` gains a `budgets: { saved, requested?, effective, note }` field.
- `parseRequestedBudgets` parses the raw commander string values and returns `undefined` when the user supplied none. This requires dropping the `"50"`/`"100"`/`"25"`/`"12000"` commander defaults on `--max-*`; `clampInt` still applies the same numeric defaults at build time.
- `effective` always equals `saved` today; centralised in one place so a future behaviour change has a single observable truth.
- The note explains the precedence in one sentence, no source-reading required.
- Text and LLM render paths add a four-line `budgets:` block; JSON keeps the full structure.

Tests added (all pass on fork):

- `exposes effective budgets on every --diff diff, sourced from the saved investigation`
- `treats whitespace, empty, or non-numeric --max-* strings as not provided`
- `renders the budget block in --diff text and llm output` (text + llm + json paths)

Validation:

- `vitest run`: 978 passed (12 pre-existing skips).
- `tsc --noEmit`: clean.
- `eslint --max-warnings 0`: clean on the two changed files.
- Manual reproduction: `ix context --diff b4-large --kind function --max-evidence 1 --format llm` now prints a `budgets` block with saved/requested/effective/note.

## Adversarial review

- `--format=json` diff introduces a new top-level field on the existing `ix-investigation-diff/1` schema. Additive; consumers generally ignore unknown fields. No zod schema in the codebase validates this output.
- `--format=llm` introduces new lines; tolerant of additive changes.
- `parseRequestedBudgets({ maxEntities: "0" })` returns `{ maxEntities: 0 }`. Intentional - `0` is a real override.
- `parseRequestedBudgets` returns `undefined` only when **no** flag was supplied; with one or more supplied, even partial subsets render coherently via `not-given` placeholders.
- The commander-default removal is safe because `clampInt`'s 4th-argument fallbacks reproduce today's numeric defaults byte-for-byte.
- `effective` invariant: `effective` always equals `saved` because that is today's behaviour. The field is the one place a future precedence change would touch; tests pin this.

F-024 / entry: `planning/findings/registry.json` F-024.
Fork branch: `feat/context-diff-budget-transparency`, head `58aea40`.
