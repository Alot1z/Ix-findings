# Phase B — Ix-Context Capability Enhancements Campaign

**Opened:** 2026-08-17 (Europe/Berlin)
**Scope:** only existing Ix-context capabilities (ix context, ix context --resume,
ix context --diff, ix context --save, ix context --out, ix context --as-of-rev,
MCP ix_context). No core-ingestion work. No new bugs invented.

**Closed prior phase:** 2026-08-17 — see
`planning/campaigns/ix-context-pr423-pr455/PHASE-A-COMPLETE.md` (commit `d01416c5`).

**Inventoried evidence inventory (read-only):**

```text
ix-cli/src/cli/commands/context.ts             844 lines
ix-cli/src/cli/context-bundle-schema.ts       36 lines (contextBundleSchema)
ix-cli/src/mcp/server.ts                      ix_context registered at line 49,
                                              tool defined at line 403,
                                              outputSchema dispatch at line 530
ix-cli/src/cli/__tests__/context.test.ts                  9 tests
ix-cli/src/cli/__tests__/context-investigation.test.ts  11 tests
ix-cli/src/cli/__tests__/context-pick-validation.test.ts (? tests — read in Phase B)
ix-cli/src/cli/__tests__/mcp.test.ts           ix_context coverage (read in Phase B)
```

**Existing CLI surface:**

```text
ix context                                    default — fresh build
ix context --resume <id>                      render saved state
ix context --diff <id>                        render diff against fresh build
ix context --save <id>                        persist state
ix context --out <path>                       write JSON bundle to file
ix context --as-of-rev <n>                    historical context
ix context --max-{entities,relationships,evidence,chars} <n>
ix context --format {text,json,llm}
ix context --kind / --path / --pick / --depth  resolution filters
```

**Investigated capability audit table:**

| Capability | Current behavior | Strength | Limitation | Evidence |
| ---------- | ---------------- | -------- | ---------- | -------- |
| `--diff --format llm` | `renderInvestigationDiff` only branches on `format === "json"`. llm falls through to text-section render. | -- | ASYMMETRIC vs `--resume --format llm` (which calls `renderBundle` with a proper llm branch) | ix-cli/src/cli/commands/context.ts L457+ and L768+ |
| Effective-budgets on bundle | bundle carries `budgets` (asked) + `truncation` (cut). No `effective` field. | -- | Agent cannot determine which slice of the available context was actually returned; "asked 200 kept 50" is derivable only via two tables | ix-cli/src/cli/commands/context.ts bundle shape ~L600 |
| Investigation listing | `--resume <id>` accepts id; no enumeration. | -- | Agent cannot discover saved investigations without reading ~/.ix directly | registerContextCommand (commands/context.ts L115+) |
| Cheap `--inspect <id>` | only `--resume <id>` — renders full bundle, possibly truncated but heavy | -- | No metadata-only path for cheap inspection | renderSavedInvestigation L399+ |
| Diff classification | added / removed only | clean | No "stale-flipped but still-present" classification | diffInvestigations L409+ |
| `--diff --max-entities` | silently ignored on `--diff` path | -- | Flag is accepted but buildFreshBundle(target,opts,savedBudgets) drops it. Prior campaign recorded this as "by-design". Re-test hypothesis is needed. | command handler L144-157 + buildFreshBundle L245+ |

**Decision matrix (initial):**

| Candidate | Evidence | Value | Complexity | Compatibility | Performance | Upstream suitability | Decision |
| --------- | -------- | ----- | ---------- | ------------- | ----------- | -------------------- | -------- |
| A. `--format llm` parity for `--diff` | confirmed via code inspection | medium (CLIs must work the same shape across resume/diff) | very low | none | none | yes — clean parity fix | IMPLEMENT (Phase B-1) |
| B. `effectiveBudgets` field on bundle | derived from existing budgets/truncation | medium-high (agent-readable consumed-budget delta) | low | additive only | none | yes | DEFER to Phase B-2 if B-1 lands clean |
| C. Cheap `--inspect <id>` | new command surface | medium | medium | additive only | none | yes | DEFER to Phase B-3 |
| D. `--diff --max-*` honor-overrides hypothesis | requires fresh reproduction; prior campaign declared by-design | re-test | low | would change precedence | none | depends on reproducible defect | RESEARCH ONLY (fresh repro required before decision) |
| E. Stale-flipped classification in diff | annotated gap | medium | low | additive | none | yes | DEFER (lower priority) |

**Out of scope (do NOT touch):**

```text
F-022 (PHP/core-ingestion): separate campaign
extractJsExportPublicNames: separate campaign
build-at-SHA tooling: rejected previously
Real backend validation harness: deferred
```

**Per-candidate implementation rules:**

1. Isolated branch off current upstream `main` (8be5f110).
2. One coherent commit per candidate.
3. Target tests + full suite + typecheck + lint.
4. Adversarial review.
5. Update this campaign record after each commit.

**Routing:**

- Each commit is local on the fork branch.
- Upstream contribution is NOT attempted without explicit authorization.
- PR #423 is closed; do not comment.
- PR #455 (open, head 084faae) already owns read-side validation and is NOT a candidate for parity additions; do not use it as a destination for unrelated new work.

---

## Phase B-1: `--format llm` parity for `--diff`

**Status:** implemented in fork
**Branch:** `feat/diff-format-llm-parity`
**Plan:**
1. Add an `llm` branch to `renderInvestigationDiff` that emits `key=value` lines describing the diff.
2. Add tests in `context-investigation.test.ts`: llm format with a known invocation; matching expected lines.
3. Adversarial: a diff with no changes, an empty diff, and a multi-section diff.

**Outcome:** recorded below after implementation.

---

## Phase B-2: `effectiveBudgets` field

**Status:** deferred

---

## Phase B-3: `--inspect <id>` command

**Status:** deferred

---
