# Execution Report — Ix MCP Enrichment + Agent Context (2-PR Program)

Generated: 2026-08-14 · Executed per `C:\tmp\ix-findings-tmp\new-plan#2.md` via parasite-skill routing

## 1. Applicable repository rules

- `AGENTS.md` in **Ix / Ix-remap / Ix-mcp / Ix-test / Ix-findings** (identical copies read on disk):
  - No attribution footers ever (no `Generated with`, `Co-Authored-By`, `AI:` lines).
  - GitHub write policy: no upstream pushes; no GitHub writes without explicit per-action authorization; PR/issue comments are technical navigation only.
  - Verification before claims: run the repo's own checks; never fabricate filenames/symbols/commits.
- **Conflicts/adaptations:** the plan explicitly authorized pushing to `Alot1z/Ix-remap` and opening the two PRs (not merging/approving/commenting). That satisfies the write-policy authorization. Ix-findings was left uncommitted (its generated tree is a prior-phase dirty state; no push without separate authorization).

## 2. Ix-remap synchronization

- Fork: `Alot1z/Ix-remap` (parent `ix-infrastructure/Ix`); `fork` remote corrected from the dead `Alot1z/Ix.git` to `Alot1z/Ix-remap.git`.
- Upstream `main` = `ab823e34`; both feature branches are based on it.
- Branches pushed and current:
  - `feat/ix-mcp-enrichment` @ `8e348d8` (3 commits)
  - `feat/ix-agent-context` @ `e22d233` (4 commits)

## 3. Ix-findings synchronization

- HEAD `309329a` (pages + machine corpus). Large uncommitted generated tree from prior phases preserved untouched.
- Refreshed read-only capture (token `githubfixed-new.token`) → mirror `237` records (was 189) → canonical graph `3654` entities / `13570` relationships → public projection `3899` routes.
- **`validate-public.mjs`: VALIDATION PASSED** (freshness gate green, no dead internal links, no secrets, routes complete).

## 4. Historical MCP work (5 commits)

All five SHAs verified live on `Alot1z/Ix-remap` (HTTP 200) and mirrored/entity-paged in Ix-findings:
`74b848c8`, `0d99ae0f`, `869b64df`, `36c7c7ec`, `1a5b0b93` → `/entities/commit-<sha>` routes. They are NOT in upstream main (verified via `merge-base --is-ancestor`); upstream implemented MCP independently via #397→#400→#401. Both PRs link them neutrally ("Earlier MCP implementation and hardening work in the Alot1z/Ix-remap development fork").

## 5. PR 1 — MCP enrichment (PR #422)

- Branch `feat/ix-mcp-enrichment` @ `8e348d8`, 3 commits, +308/−6, 4 files.
- **Tool annotations** (`readOnlyHint`/`destructiveHint`/`idempotentHint`/`openWorldHint`/`title`) via a type-checked lookup keyed by `IX_MCP_TOOL_NAMES` — adding a tool without classification fails the build.
- **Structured output** (`outputSchema` + `structuredContent`) for `ix_map`, `ix_ingest`, `ix_smells`; Pro tools intentionally unchanged (unverifiable shapes in private `@ix/pro`).
- Docs: `docs/mcp-plugin-consolidation.md` extended.
- Tests: `mcp-annotations.test.ts`, `mcp-structured-output.test.ts`; full suite **864 pass**, typecheck + lint clean.
- Architecture unchanged: argv isolation, orphan bookkeeping, scope-cache invalidation, single-flight locks, output caps, Pro gating all retained from #400/#401.

## 6. PR 2 — Agent context (PR #423)

- Branch `feat/ix-agent-context` @ `e22d233`, 4 commits, +1089, 8 files.
- `ix context <target>`: deterministic bounded bundle composing the existing resolver, fact collector, `/v1/context` (claims/decisions/conflicts/intents), and provenance API. Explicit truncation metadata; freshness classification; `text|json|llm` + `--out`; `--as-of-rev`.
- Resumable investigation state: `--save/--resume/--diff` under `~/.ix/investigations` (schema `ix-investigation/1`, sanitized ids, refuses malformed state).
- `ix_context` MCP tool with bounded budget params.
- Tests: `context.test.ts` (4), `context-investigation.test.ts` (4), `mcp.test.ts` (15); full suite **866 pass**, lint/typecheck clean.

## 7. Ix-findings evidence system

- Canonical sources + generated artifacts regenerated (entities/relationships/mirror/live-state/wiki/public).
- PR 397/400/401 mirrored with deep pages (`/prs/397|400|401/{conversation,files,commits,timeline,analysis,relationships,...}`).
- Historical commits as entity pages; MCP section pages (`/mcp`, `/mcp/implementation`, `/mcp/security`, `/mcp/tests`).
- Base-path: relative asset refs; GitHub Pages JSON-LD absolute URLs; link validation passes.

## 8. External research transformation

- Freebuff-style patterns (dynamic tool discovery, capability isolation, structured result preservation, deterministic context compaction) translated to Ix-native: annotations + structuredContent + deterministic tier ranking. No copied code/structure.
- DeepSeek-Harness-style patterns (stable tool identity, atomic generation swap, deterministic cleanup) translated to: type-checked tool catalog + versioned investigation schema. No runtime dependency or repository coupling.

## 9. Regression validation (#400/#401 classes)

- The merged upstream hardening (#400/#401) is preserved; PR 1 extends without re-architecting. Targeted tests (`mcp-runner.test.ts`, 23 tests) continue to cover timeout leakage, orphan lifecycle, exitCode contamination, scope-cache invalidation, single-flight lock ownership — all green in the full suite.

## 10. Deterministic context validation

- `context.test.ts` proves identical-input determinism (timestamp excluded), tier ordering with id tiebreak, budget enforcement with truncation counts, staleness classification.
- `context-investigation.test.ts` proves save/resume round-trip, refusal of malformed state, deterministic deltas, freshness change surfacing.

## 11. Full validation

- PR 1: `npm test` 864 pass · typecheck clean · lint 0 errors.
- PR 2: `npm test` 866 pass · typecheck clean · lint 0 errors.
- Ix-findings: `validate-public.mjs` PASSED; live smoke via local server (index/pr397/commit-74b848c8/mcp all 200).

## 12. P2 follow-ups

- Pro-tool structured schemas once `@ix/pro` shapes can be verified.
- GraphQL review-thread state for PRs 397/400/401 (currently UNKNOWN for those).
- Ix-findings Pages deployment of the new PR/commit deep pages (local build validated; push requires authorization).
- Investigation-state expiry/GC for `~/.ix/investigations`.
- MCP `task` semantics evaluation for long-running tools.

## 13. PR links

- PR 422: https://github.com/ix-infrastructure/Ix/pull/422 (MCP) — mergeable, CI queued.
- PR 423: https://github.com/ix-infrastructure/Ix/pull/423 (Agent context) — mergeable, CI queued.

## 14. Verification summary

All checks green: identity (Alot1z noreply), no secrets in diffs, no upstream mutation, no attribution footers, live links verified, PRs open and mergeable.
