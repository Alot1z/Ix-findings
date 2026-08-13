# Execution Report — Ix MCP Enrichment + Agent Context (2-PR Program)

Generated: 2026-08-14 · Executed per `C:\tmp\ix-findings-tmp\new-plan#2.md` via parasite-skill routing

## 1. Repository Rules

- `AGENTS.md` read in **Ix / Ix-remap / Ix-findings** (identical policy text on disk):
  - No attribution footers ever (no `Generated with`, `Co-Authored-By`, `AI:` lines).
  - GitHub write policy: no upstream pushes; no GitHub writes without explicit per-action authorization; PR/issue comments are technical navigation only.
  - Verification before claims: run the repo's own checks; never fabricate filenames/symbols/commits.
- **Authorization boundaries:**
  - The plan explicitly authorizes: push to `Alot1z/Ix-remap`, open/maintain PR 422 and PR 423 against `ix-infrastructure/Ix`, update PR descriptions. No merge/approve/close/react/comment.
  - Ix-findings publication is a SEPARATE authorization boundary. The user explicitly authorized the Ix-findings deployment (commit regenerated evidence site on `master`, push to origin, re-verify URLs). This was executed as the only Ix-findings GitHub write.
- **Local-only policy:** no `AGENTS.md` changes were made anywhere; nothing local/policy entered either PR.

## 2. Verification Before Writes

- Verified live state of both PRs before any write (metadata, body, commits, files, reviews, review threads, CI, CodeQL annotations).
- Re-read every target file in the worktrees before editing (`context.ts`, `server.ts`, tests, docs).
- Re-verified fork remotes (`origin` = upstream Ix, `fork` = `Alot1z/Ix-remap`); no dead `Alot1z/Ix` remote used.
- No file was modified without reading its current contents; no stale patch applied.

## 3. Fork Synchronization

- Upstream `main` = `ab823e34`; fork feature branches based on it (verified via `merge-base` and PR base SHA).
- Branches pushed to `Alot1z/Ix-remap` and current:
  - `feat/ix-mcp-enrichment` @ `45af1cb2` (4 commits)
  - `feat/ix-agent-context` @ `0c4c89fc` (7 commits)
- Historical MCP work preserved (see §6). No destructive reset, no branch deletion, no force-push over unrelated work.
- Local `AGENTS.md` remains local only.

## 4. Live PR 422 State

- **URL:** https://github.com/ix-infrastructure/Ix/pull/422
- **Title:** `feat(mcp): enrich Ix MCP tools with structured outputs, semantic annotations, and stronger agent interoperability`
- **State:** open · **mergeable:** true (`mergeable_state: blocked` = upstream CI pending, not a conflict)
- **Base:** `main` @ `ab823e34` · **Head:** `feat/ix-mcp-enrichment` @ `45af1cb2` · **4 commits, +320/−6, 4 files**
  - `838e7a3` feat(mcp): annotate MCP tools with semantic hints
  - `978a093` feat(mcp): expose structured output for JSON-backed tools
  - `8e348d8` docs(mcp): document structured results and tool annotations
  - `45af1cb` feat(mcp): advertise a truthful title annotation for every tool
- **Files:** `docs/mcp-plugin-consolidation.md`, `src/mcp/server.ts`, `__tests__/mcp-annotations.test.ts`, `__tests__/mcp-structured-output.test.ts`
- **Reviews/threads:** none (0 reviews, 0 issue comments, 0 review threads).
- **CI:** `CI Passed` success · `CodeQL` success · `CodeQL (javascript-typescript)` success · `Lint & Typecheck` success · all platforms green.
- **Implementation:** type-checked annotation table keyed by `IX_MCP_TOOL_NAMES` (adding a tool without classification is a type error); every tool carries a truthful non-empty `title`; structured `outputSchema` + `structuredContent` for `ix_map`/`ix_ingest`/`ix_smells`; Pro tools (`ix_briefing`/`ix_decisions`/`ix_decide`) intentionally unchanged (private `@ix/pro` shapes unverifiable here).
- **Validation:** full suite **865 tests pass** (locally re-run), typecheck clean, lint 0 errors.

## 5. Live PR 423 State

- **URL:** https://github.com/ix-infrastructure/Ix/pull/423
- **Title:** `feat(agent): unify Ix context, provenance, and investigation workflows for agents`
- **State:** open · **mergeable:** true (`mergeable_state: blocked` = upstream CI pending)
- **Base:** `main` @ `ab823e34` · **Head:** `feat/ix-agent-context` @ `0c4c89fc` · **7 commits, +1444/−3, 9 files**
  - `99b8940` feat(context): deterministic bounded context bundles via `ix context`
  - `815afea` feat(context): expose ix_context over MCP and support JSON export
  - `aa3b4ea` docs(agent): document the ix context command in skills
  - `e22d233` feat(context): resumable investigation state with deltas
  - `c8ec21e` fix(context): harden ix context correctness and MCP contract
  - `b1decee` fix(context): remove TOCTOU race in --out write and guard EISDIR check
  - `0c4c89f` fix(context): resolve CodeQL findings on bundle persistence paths
- **Files:** `commands/context.ts` (+795), `context-bundle-schema.ts` (+40, new shared zod contract), `mcp/server.ts` (+76/−3), `register/oss.ts`, tests (`context.test.ts`, `context-investigation.test.ts`, `mcp.test.ts`), `skills/ix/SKILL.md`, `skills/ix/references/commands.md`
- **Reviews:** 4 automated CodeQL-bot comments (historical scans; latest scan on head `0c4c89f` clean). No human reviews.
- **CodeQL:** on the current head, `CodeQL (javascript-typescript)` = **completed success, 0 annotations**; `CodeQL` success; `CI Passed` success; `Lint & Typecheck` success.
- **Remediation (commit `0c4c89f`):** the two findings on the PR's own code were real — a fs-race **failure** (`--out` check-then-write TOCTOU) and two "network data written to file" warnings. Fixed with atomic temp+rename writes (matching the existing `config.ts` writer) and schema validation of the network-derived bundle against the shared versioned `ix-context-bundle/1` zod schema before every write (`--out` and investigation persistence). Prior suppression comments (wrong rule id) removed. The 3 `api.ts` "file data in outbound request" warnings are pre-existing on upstream `main` and not introduced by this PR.
- **Validation:** full suite **875 tests pass** (locally re-run), typecheck clean, lint 0 errors.

## 6. Historical MCP (5 SHAs)

All five verified live on `Alot1z/Ix-remap` (HTTP 200), author Alot1z, NOT in upstream `main`, mirrored and entity-paged in Ix-findings (`/entities/commit-<sha>`), and linked neutrally in both PR bodies:

| SHA | Ix-findings entity URL |
| --- | --- |
| 74b848c83a0d547069660615dddcf1ea0ad0749c | https://alot1z.github.io/Ix-findings/entities/commit-74b848c83a0d547069660615dddcf1ea0ad0749c |
| 0d99ae0f1866367c3fbc9bbcc16f0add2dd4dd57 | https://alot1z.github.io/Ix-findings/entities/commit-0d99ae0f1866367c3fbc9bbcc16f0add2dd4dd57 |
| 869b64df3357a8370c4c85c9a1fa2b553b899e24 | https://alot1z.github.io/Ix-findings/entities/commit-869b64df3357a8370c4c85c9a1fa2b553b899e24 |
| 36c7c7eccd8068d48df4f61394b42a3ffa62483c | https://alot1z.github.io/Ix-findings/entities/commit-36c7c7eccd8068d48df4f61394b42a3ffa62483c |
| 1a5b0b93c9e8871610370c0f36212be8f6cf6980 | https://alot1z.github.io/Ix-findings/entities/commit-1a5b0b93c9e8871610370c0f36212be8f6cf6980 |

Wording used (both PRs): "Earlier MCP implementation and hardening work in the `Alot1z/Ix-remap` development fork:" — no ranking, no "superseded", no judgment. Neutral navigation to the upstream lineage (#397, #400, #401) without tagging individuals.

## 7. PR 1 — Technical Report

- Annotations: `readOnlyHint`/`destructiveHint`/`idempotentHint`/`openWorldHint`/`title`, type-checked via the catalog-keyed table; read-only tools are idempotent, mutating tools destructive/non-idempotent, `ix_ingest` open-world.
- Structured output: `outputSchema` + `structuredContent` for the three JSON-backed OSS tools, shapes verified against actual emitters; SDK validates at runtime.
- SDK: official `@modelcontextprotocol/sdk` (1.30.0 verified); no custom protocol layer.
- Lifecycle/security preserved: argv isolation (`--flag=value`, `--`), orphan bookkeeping, scope-cache invalidation, single-flight locks, output caps, Pro gating — unchanged from #400/#401.
- Tests: annotation classification + title truthfulness + structured-output contract; full suite 865 green.
- Docs: `docs/mcp-plugin-consolidation.md` extended.
- Exact diff: +320/−6 across 4 files (see §4).

## 8. PR 2 — Technical Report

- Command semantics: `ix context [target]` — target optional so `--resume <id>` / `--diff <id>` work without one; normal path still requires a target.
- Deterministic context: stable tier ranking with id tiebreaker; claims/decisions/conflicts/intents ordered deterministically; identical input ⇒ identical output apart from declared `generatedAt`.
- Budgets: `--max-entities`/`--max-relationships`/`--max-evidence`/`--max-chars` with explicit truncation metadata; `maxChars` enforced against the exact serialized evidence size.
- Provenance/freshness: provenance API fields preserved; freshness classification never presents revision-specific evidence as current.
- Investigation: versioned `ix-investigation/1` under `~/.ix/investigations`; injective id encoding (no collisions, no traversal); save/resume/diff; saved revision+depth preserved for `--diff` unless overridden; malformed/unknown-schema files refused.
- Security: `--out` refuses directories; both write paths schema-validate then atomic-write (CodeQL findings resolved, see §5).
- MCP: `ix_context` with budgets incl. `max_chars`, `structuredContent` + stable shared `outputSchema`; unparseable output is an MCP error; CLI/MCP contract parity tested.
- Reference-derived: deterministic context selection / bounded bundles (Freebuff-style), schema-validated persistence (DeepSeek-Harness-style construct-validate-publish) — implemented Ix-natively over existing primitives, no new engine.
- Exact diff: +1444/−3 across 9 files (see §5).

## 9. Ix-findings Canonical Model

- Mirror: **237** GitHub records (was 189) — added upstream PRs **#397/#400/#401** and the **5 historical fork commits**, captured read-only from the live API.
- Canonical graph: **3,654 entities / 13,570 relationships** (recomputed; prior baseline 3,614/13,535 — delta recorded, not silently overwritten).
- All PRs reconciled to fresh live state (RESOLVED/merged, no stale OPEN baselines); freshness gate passes.

## 10. Ix-findings Site Rework

- Canonical data → generator → public projection (generated HTML is never canonical).
- Public routes: **3,899**; base path `/Ix-findings/` centralized; global sidebar contract applied on all page depths (no reduced `../` navigation).
- New live sections: `/mcp`, `/mcp/implementation`, `/mcp/security`, `/mcp/tests`; PR pages `/prs/397|400|401|422|423/…` (conversation, comments, reviews, files, commits, timeline, analysis, relationships); entity pages for all 5 historical commits.
- Machine corpus (`llms.txt`, `llms-full.txt`, graph.json, entities.json, search.json, routes.json, sitemap.xml) regenerated from canonical data.

## 11. Sidebar Validation

- Verified the global nav contract is served on representative routes including `/`, `/mcp/`, `/mcp/implementation/`, `/prs/397/…`, `/entities/commit-…/` (sidebar present, complete, canonical links, no depth-sensitive globals). Live spot-check of deep pages returns 200.

## 12. Public Validation

- `node planning/pages/validate-public.mjs` → **VALIDATION PASSED** (freshness gate green, no dead internal links, no secrets, routes complete).
- Route count 3,899; entity count 3,654; relationship count 13,570; graph/search consistent.
- Live deployment: Ix-findings `master` pushed (explicit authorization) → GitHub Pages redeployed (`c0a38607`, success). **Every URL cited in both PR bodies verified live (HTTP 200)** including `/prs/422/analysis`, `/prs/423/analysis`, `/prs/397/conversation`, the five `/entities/commit-…` pages, and the `/mcp` section.

## 13. Historical Evidence

- Five commit URLs: see §6 (all live, all linked in both PRs).
- PR/issue lineage: #219 (tracking) → historical fork work → #397 → #400 → #401 → PR #422 / PR #423; upstream PRs captured as first-class entities with `/prs/` pages.
- Revision-pinned: commit pages are SHA-pinned; freshness classification distinguishes current vs historical.

## 14. Freebuff Research

Adopted (transformed, not copied): **deterministic bounded context construction** and **structured tool results**.
- Source mechanism: context gathering → relevant files → bounded context; structured result preservation across stages.
- Corresponding Ix problem: agents stitched disconnected graph results by hand; MCP returned only text.
- Invariant: identical input ⇒ identical bounded bundle; structured results preserved end-to-end.
- Ix-native implementation: `ix context` bundle composing existing resolver/facts/context/provenance; `outputSchema`+`structuredContent` (PR 1) and shared zod contract (PR 2).
- Tests: determinism, tier ordering, budget/truncation, structuredContent contract. Validation: full suites green.
- Maintenance assessment: no new engine; small, composable additions over existing primitives. No runtime dependency on Freebuff.

## 15. DeepSeek Harness Research

Adopted (transformed, not copied): **construct → validate → publish** state discipline and **contract probes**.
- Source mechanism: reproducible probes; explicit contracts; state preservation across generations.
- Corresponding Ix problem: network-derived bundles written to disk unvalidated; MCP/CLI contract drift risk.
- Invariant: never expose or persist half-validated state; one versioned contract for CLI and MCP.
- Ix-native implementation: shared `ix-context-bundle/1` zod schema used as both the MCP output schema and the pre-write validation gate; atomic writes so a partial file is never visible.
- Tests: malformed-bundle refusal; structuredContent round-trip; unparseable-output error. Validation: CodeQL clean, suites green.
- Maintenance assessment: one schema module, two consumers; no runtime dependency on DeepSeek Harness.

## 16. P2 Follow-ups

- Ix-findings: deeper `/context` and `/provenance` topical pages (currently entity-level only); sidebar/active-state snapshot test across all 3,899 routes.
- PR 2: MCP `--kind`/`--path`/`--pick` exposure for `ix_context` if agent demand justifies it; investigation export to a portable bundle file (currently `--out` covers bundle, not investigation state).
- PR 1: interop probes against the official Python/Go MCP clients on Windows; performance measurement of subprocess vs in-process execution if MCP latency becomes a concern.
- The 3 pre-existing `api.ts` "file data in outbound request" warnings on upstream `main` are outside both PRs' scope.

## 17. Authorization-Sensitive State

- **Completed (authorized):** push to `Alot1z/Ix-remap` (both branches); open/maintain PR 422 and PR 423; update PR titles/bodies; commit + push Ix-findings `master` (explicit per-action authorization); all local implementation, testing, and validation.
- **Not done (per plan constraints):** no merge, no approve, no close, no reactions, no PR/issue comments, no upstream pushes, no modification of upstream branches.
- **Deferred (needs separate authorization, not requested):** nothing currently outstanding on Ix-findings; future publication of any new generated content would again require explicit per-action authorization.
- **Blocked:** none. Ix runtime backend verification remains environment-dependent (Docker) but does not affect these PRs' static validation.

---

Final status: both PRs open and mergeable with green CI/CodeQL; all PR-cited URLs verified live; Ix-findings deployed and validated; historical work preserved; no unauthorized GitHub writes.
