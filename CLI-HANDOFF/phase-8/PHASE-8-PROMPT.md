━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 8 — FORK-BASED `ix mcp` SUBCOMMAND: EVIDENCE-DERIVED BUILD (Issue #219)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STATUS
NOT YET EXECUTED (derived from live reconciliation on 2026-08-11, NOT from the roadmap)

MISSION

Build a production-grade `ix mcp` subcommand on the user's fork — ix runs as a
local MCP server (stdio, JSON-RPC 2.0) exposing a curated read + write tool set
so MCP-aware AI clients (Claude Code, Cursor, OpenCode, MCP inspectors) invoke
ix directly. Design → implement → register → test → document → commit → push
to `Alot1z/Ix:feat/ix-mcp`; complete PR body prepared but NOT submitted to any
`ix-infrastructure/*` repository.

WHY THIS PHASE EXISTS (evidence, not roadmap)

- Issue #219 ("Add ix mcp subcommand…", josephismikhail, maintainer) — OPEN,
  0 comments, untouched since 2026-05-26. Verified: ZERO MCP code in
  `ix-infrastructure/Ix` today (source scan of `ix-cli/src`, `skills/`,
  `docs/`). The request is real, current, and unimplemented.
- The fork analysis (2026-08-11): `Alot1z/Ix` has 24 branches; only `main`
  (`5488741`) and `feat/ix-remap-hardening` (`1497596` = PR #393 head) are
  live; `feat/ix-mcp` does NOT exist. Nothing upstream independently
  implemented MCP. No new regression supersedes this.
- Registration surface risk is documented and solved: F-009 (dead
  `patches` command) taught the rule — register in `oss.ts`, never shadow in
  `PRO_COMMANDS`; upstream commit `89ca55e` (from #390) added a regression test
  pinning exactly that discipline. Our phase must add the same guard for `mcp`.
- `--format llm` exists for the five read commands (PR #372, merged) — reuse.
- Fork-only constraint (user, standing): NO PRs/commits to
  `ix-infrastructure/*`; writes ONLY to `Alot1z/Ix`, `Alot1z/system-compass`
  (404 — not in scope), `Alot1z/Ix-findings`.

CURRENT VERIFIED STATE (2026-08-11, API + source verified in THIS reconciliation)

| Item | Verified value |
|---|---|
| Upstream main | `1292375548fb8f4431ac5afc34c68fe2573434d1` — NO new commits since Phase 7 (#392 is latest) |
| Open PRs | #395 (KageBinary, test IX_HOME space), #393 (ours, remap), #388 (bot brew) — no new PRs |
| PR #393 | OPEN, MERGEABLE, 14/14 CI green, BLOCKED only on REVIEW_REQUIRED — **no reviews/comments yet** |
| Open issues | #219 (this phase), #385/#349 (fixed on main, awaiting reporter), #383 (fixed in ix-codex-plugin) |
| Closed issues | 371/376/377/374/381/379/351/350/308 all `completed` — no won't-fix, no regression reintroduced |
| Fork main | `5488741` (behind upstream; sync BLOCKED by PAT `workflow` scope) |
| Fork live branches | `main`, `feat/ix-remap-hardening`; 22 historical branches (merged upstream equivalents — no action) |
| Commit `89ca55e` | `test(cli): pin that oss.ts registers patches…` — regression guard for F-009 fix (#390) |
| #219 | state open, 0 comments, updated 2026-05-26 — untouched since opening |
| Protected | `E:/E-github-repos/Ix` `feat/ix-agent-skill` @ `b038c46` (14 dirty); `ix-compass-dist` @ `396426b` (3 dirty) |
| Suite baseline | 730 passed / 2 skipped (remap base); tsc clean; eslint clean |

INPUTS (consume in order; missing/invalid → STOP and report)

1. `CLI-HANDOFF/phase-7/PHASE-7-REPORT.md` (STATUS: COMPLETE)
2. `CLI-HANDOFF/phase-7/PHASE-8-IMPLEMENTATION-INPUT.md`
3. `github/issues/219/README.md`
4. `CLI-HANDOFF/PHASE-LADDER.md` (roadmap = planning constraint only)
5. `planning/findings/registry.json` + `planning/evidence/registry.json`
6. `CLI-HANDOFF/PR-MATRIX.md`, `CLI-HANDOFF/STALE-CLAIMS.md`
7. Live fork source: `ix-cli/src/cli/register/oss.ts`, `commands/*.ts`
   (map/status/explain/trace/impact/search/rank/remap), `index.ts`, the
   `--format llm` implementation, `test/view-server.test.ts` (F-010 seams),
   `skills/ix/`
8. The current MCP specification — verify LIVE via `/deepwiki` `/context7`
   `/find-docs` `/web-reader`; never implement protocol details from memory.

PREVIOUS-PHASE RECONCILIATION (Phase 7 → Phase 8)

- ACTUALLY_EXECUTED: ledger reconciliation committed (`91f38cf`); issue docs
  written; phase prompts authored (8–13); Phase 8 regenerated here.
- ACTUALLY_VERIFIED: #390/#391 merged; #371/#376 closed; PR #393 healthy; no
  new upstream activity since; #219 untouched and still open.
- BLOCKED: fork-main sync (token scope; remedy `gh auth refresh -s workflow`
  or UI Sync fork) — NOT a hard dependency.
- DEFERRED: CAND-006, CAND-019 (folded in), compass thread (Phase 10),
  hardening (Phase 9).
- SUPERSEDED: PACK-371, CONTRIB-376 — do not resurrect.

SCOPE

Design doc (`planning/ix/ix-mcp.md`); `ix-cli/src/cli/mcp/` (protocol, tools,
adapters, server); curated read×6 + write×1 tools; `oss.ts` registration +
F-009 regression guard; `--format llm` reuse; unit + stdio integration tests +
full-suite regression; docs (`docs/api/README.md`, `CLAUDE.md`, `skills/ix/`);
commit + push `feat/ix-mcp`; PR packet (NOT submitted); `PHASE-8-REPORT.md` +
`PHASE-9-IMPLEMENTATION-INPUT.md`.

NON-SCOPE

Upstream PR/issue/comment (PROHIBITED); hardening/adversarial/real-client work
(Phase 9 — prep input only); Compass (Phase 10); #385/#349/#383 (fixed
upstream); fork-main sync (blocked, user action); protected worktrees;
network-bound servers (stdio only); new runtime deps unless unavoidable.

EXECUTION RULES (full ruleset — non-abbreviated)

1. SOURCE-DRIVEN DEVELOPMENT — implement only from live source, live git,
   GitHub API, registries, test results, explicit provenance. Never from
   memory of code or the MCP spec.
2. VERIFICATION-BEFORE-COMPLETION — a tool is DONE only when its unit test +
   integration round-trip pass and are recorded with evidence. No evidence →
   no claim.
3. DOUBT-DRIVEN DEVELOPMENT — contradictions are investigation targets. Live
   state outranks this baseline; if they disagree → STOP, record, reconcile.
4. SEQUENTIAL REASONING — every non-trivial decision is chained
   (decompose → options → evidence → decision → consequences).
5. EVIDENCE HIERARCHY — GitHub API > git history > source > tests > registries
   > prose. Never treat one source as sufficient when the claim needs several.
6. GIT SAFETY — no force, no history rewrite, no `git add -A`, explicit
   staging, before/after state capture on every mutation, dedicated clean
   worktrees for runs, never stage foreign untracked state (e.g. `.freebuff/`).
7. PROTECTED WORKTREES — `Ix b038c46/14` and `ix-compass-dist 396426b/3` are
   NEVER touched. Verify live before any mutation.
8. SECURITY — no shell interpolation of tool args; stdio binds nothing; no
   credential access beyond the underlying commands; disclosure test.
9. PRIVACY / SECRETS — fork and ledger are PUBLIC. Never commit credentials,
   tokens, cookies, private URLs, local drive paths, personal data, env
   values, hidden metadata. Allowlist-first publication; UNKNOWN is never
   public.
10. GITHUB MUTATION AUTHORIZATION — fork push AUTHORIZED; PR/issue/comment/
    maintainer contact PROHIBITED; upstream mutation PROHIBITED forever.
11. FORK/UPSTREAM SEPARATION — implement on the fork; upstream is a read-only
    reference. Never push a fork branch that rewrites upstream history.
12. KNOWLEDGE-LEDGER PROVENANCE — every new finding (F-NNN), evidence (E-NNN),
    candidate (CAND-NNN), decision (D-NNN) gets id + source + evidence + date;
    never reuse IDs; never upgrade evidence class by repetition.
13. AI-SLOP DETECTION — every claim in the phase's outputs must pass: is it
    specific? source-backed? non-duplicated? non-generic? measured (if
    numeric)? threat-modeled (if security)? reproduced (if user-impact)?
14. MULTI-AGENT REVIEW — the differentiated review plan in MULTI-AGENT REVIEW
    PLAN below is mandatory; disagreements are recorded as DISPUTEs, not
    resolved by force.
15. TEST METHODOLOGY — tests correspond to changed functionality; every
    validation-matrix row has a recorded result; no ceremonial tests.
16. FAILURE RECOVERY — failures are reported (FAILED/BLOCKED + reason +
    evidence + recovery), never hidden in a success summary; partial success
    ≠ COMPLETE.
17. GENERATED-ARTIFACT VALIDATION — never hand-edit generated files; re-run
    the generator and record hashes/deltas.
18. PHASE TRANSITION — this phase's report is the only valid handoff; the next
    phase is derived from THIS report + live state, not from the ladder.

AUTHORITY MODEL

| Action | State |
|---|---|
| Local design / implementation / tests / docs | AUTHORIZED |
| Commit + push `Alot1z/Ix:feat/ix-mcp` | **AUTHORIZED** |
| Ledger commit/push (`Alot1z/Ix-findings`) | AUTHORIZED (standing) |
| PR creation / issue / comment / maintainer contact | **PROHIBITED** (packet prepared only) |
| Fork-main sync | BLOCKED (user token action) |
| Protected worktrees | PROHIBITED |
| Upstream mutation | PROHIBITED forever |

PROTECTED WORK

- `E:/E-github-repos/Ix` — `feat/ix-agent-skill` @ `b038c46`, 14 dirty. NEVER modify.
- `E:/E-github-repos/ix-compass-dist` — `main` @ `396426b`, 3 dirty. NEVER modify.
- `E:/E-github-repos/Ix-remap` — `1497596` (PR #393 head); backup refs `backup-c021b52`, `backup-a05e740`.
- Upstream `ix-infrastructure/Ix` — read-only forever.
- Verify these SHAs live in STEP 0; record before/after.

KNOWN BLOCKERS

1. Fork-main sync — PAT `workflow` scope (remedy: `gh auth refresh -s workflow`
   or UI Sync fork). Not blocking: branch off `5488741`, record the base.
2. `Alot1z/system-compass` — 404. Not in scope.
3. MCP spec drift — mitigate by pinning the verified spec version in the
   design doc.

CURRENT FINDINGS (revalidated this reconciliation)

| ID | Claim | Class | State | Evidence |
|---|---|---|---|---|
| F-001 | keyboard invariant ×4 releases | B | CONFIRMED / ACTIVE | byte-diff of 4 tarballs |
| F-002 | F/f unbound ×4 releases | B | CONFIRMED / ACTIVE | zero grep matches |
| F-003 | KeyboardHelp byte-identical, no F | B | VERIFIED / ACTIVE | extracted bundle |
| F-004 | fit-math constants invariant | B | VERIFIED / ACTIVE | 9 constants extracted |
| F-005 | #57 latch→keyed refit v0.3.0 | A+B | CONFIRMED / ACTIVE | release notes + bundle diff |
| F-006 | delayed-data blank | B+C | REPRODUCED_LIVE / BLOCKED | 3× A/B runs |
| F-007 | rollup timing-dependent | B | OBSERVED / BLOCKED | A/B run |
| F-008 | #376 version-series mismatch | A | **RESOLVED_UPSTREAM** | #391 merged; issue closed; fix cites our scenario |
| F-009 | #371 patches dead/unregistered | A | **RESOLVED_UPSTREAM** | #390 merged; regression guard `89ca55e` |
| F-010 | loopback-hardened /__ix/remap | A | **PR_OPEN (#393)** | 10 guard tests; suite green; awaiting review |
| F-011 | WSL bootstrap fix | A | IN_PR_393 | diff in #393 |
| F-012 | dead node_ok removal | A | IN_PR_393 | diff in #393 |
| F-013 | zoom ×1.25 vs ×1.1 | D | OPEN (needs experiment) | single runtime observation |

FINDINGS INVALIDATED

None. No finding was disproven by this reconciliation. F-008/F-009 are
RESOLVED (not invalidated). No AI-slop findings exist in the registry.

FINDINGS RESOLVED

F-008 (upstream #391), F-009 (upstream #390, pinned by `89ca55e`).

NEW FINDINGS

None discovered in this reconciliation. The phase must still run its own
discovery pass (TODOs/FIXMEs/dead code/command inconsistencies) per the
AI-slop rules — every candidate requires evidence; a TODO is not a finding.

CANDIDATE UNIVERSE (regenerated 2026-08-11)

| ID | Title | State | Priority | Evidence |
|---|---|---|---|---|
| #219 | `ix mcp` subcommand | ACTIONABLE | **P0** | maintainer request, 0 comments, zero code |
| CAND-019 | Ix docs scope (mcp + remap docs) | folded into #219 | P1 | docs/api gaps |
| #385 | upgrade-Windows verification harness | evidence-only | P2 | fix-on-main claim |
| #349 | installer-spaces verification harness | evidence-only | P2 | fix-on-main claim (#352) |
| CAND-006 | Playwright delayed-data repro | optional | P3 | F-006 |
| F-013 | zoom experiment | artifact-level | P3 | Class D |
| F-key/delayed | Compass source-gated | BLOCKED | — | 404/no access |
| Fork-main sync | maintenance | BLOCKED | — | token scope |

PRIORITY MATRIX — see CANDIDATE UNIVERSE. P0 = #219 (this phase). P2/P3 items
feed Phase 11. Compass feeds Phase 10. Nothing else is unblocked.

DEPENDENCY GRAPH

Phase 7 (COMPLETE) → live-state verified → #219 actionable → Phase 8 build →
Phase 9 (hardening, consumes Phase 8 input) → Phase 10/11 (compass/ecosystem,
independent) → Phase 12 (packaging) → Phase 13 (close-out).

IMPLEMENTATION PLAN

STEP 0 — PRE-FLIGHT (read-only; record `PHASE-8-LIVE-BASELINE.json` +
`PHASE-8-AUTHORIZATION-STATE.json`)
1. Re-verify every SHA/branch/issue/PR in CURRENT VERIFIED STATE (GitHub API
   + local git). Record deltas if any.
2. Verify protected worktrees' before-state (HEAD + dirty counts + changed
   files).
3. Verify `ix mcp` absent, `--format llm` present (grep + `ix --help`).
4. Read `oss.ts` + `PRO_COMMANDS` (the F-009 surface).
5. Read the real command modules and identify the **adapter seam**: which
   exported functions each command handler calls (e.g. `runMap(...)`,
   `explain(...)`, or the underlying service) — adapters must call these, NOT
   the commander `program` object. Record the seam per command in
   `TOOL-REGISTRY.json`.

STEP 1 — SKILL ACTIVATION PROTOCOL (MANDATORY, UNLIMITED RE-INVOCATION)
Run the full thinking chain with NO LIMIT on re-invocation — before every tool
call, between every decision, after every milestone:
- START: `/tractatus-thinking` → `/sequential-thinking` → `/deepwiki` +
  `/context7` + `/find-docs` (verify MCP spec: stdio framing, initialize,
  protocolVersion, capabilities, notifications, ping, tools/list, tools/call,
  error semantics).
- BETWEEN: `/doubt-driven-development` before every non-trivial decision;
  `/debug-thinking` on failure; `/context-engineering` on drift;
  `/stop-slop` before any prose.
- DESIGN GATES (diverge → converge → doubt): `/interview-me` →
  `/brainstorming` → `/idea-refine` → `/7-scared-circle-clarity` →
  `/doubt-driven-development`. Gates: transport, tool list, error model,
  concurrency, output contract.
- AFTER: `/verification-before-completion` → `/code-review-and-quality` per
  commit.

FULL SKILL INVENTORY (all 88 — rescanned 2026-08-11, 0 spec issues; /
prefixes — embed in context; use per task, record actual usage):
thinking: /tractatus-thinking /sequential-thinking /doubt-driven-development /debug-thinking /debugging-and-error-recovery /context-engineering
research: /research /deepwiki /context7 /find-docs /web-reader /source-driven-development /gitingest /using-git-worktrees
planning: /brainstorming /spec-driven-development /writing-plans /planning-and-task-breakdown /idea-refine /workspace-memory /interview-me /7-scared-circle-clarity
build: /incremental-implementation /api-and-interface-design /system-connector /tdd /test-driven-development /autonomous-implementation-pattern /cli-anything /browser-to-api /mcp-builder /improve-codebase-architecture
docs: /documentation-writer /readme-skill /stop-slop /documentation-and-adrs /api-docs-skill
review: /code-review-and-quality /verification-before-completion /code-simplification /code-review-graph /knip
frontend: /frontend-ui-engineering /frontend-design /browser-testing-with-devtools /webapp-testing
ops: /ci-cd-and-automation /shipping-and-launch /observability-and-instrumentation /security-and-hardening /performance-optimization
intelligence: /ix /understand /graphify
git: /git-workflow-and-versioning /using-git-worktrees /github-actions-docs
other: /prompt-optimizer /skill-creator /skill-router /using-agent-skills /agent-token-optimizer /algorithmic-art /canvas-design /deprecation-and-migration /desktop-commander-guide /favicon /find-skills /forge /gepeto /internal-comms /javascript-regex-literal-escaping-fix /orca-cli /orca-per-workspace-env /orchestration /pdf /pinokio /playwright-cli /pptx /story-quality /theme-factory /docx /computer-use /agent-browser /github-stars-manager /artifacts-builder /qwen-mm-plugins /qwen-mm-plugins-api /qwen-mm-plugins-core

STEP 2 — DESIGN GATE A: TRANSPORT & PROTOCOL
1. Pin the current MCP stdio framing and lifecycle from live spec sources
   (record URLs + version). Decide newline-delimited JSON vs legacy framing;
   record the rejected alternative.
2. Brainstorm framing edge cases (partial lines, backpressure, EOF mid-frame,
   oversized messages); record decisions.

STEP 3 — DESIGN GATE B: TOOL REGISTRY
1. From the STEP-0 seam discovery, map each command → exported function →
   flags → JSON-Schema args. Baseline: read `map|status`, `explain`, `trace`,
   `impact`, `search`, `rank`; write `remap`.
2. Interview the surface (what would a model call?) → brainstorm → converge.
   Justify any addition/removal from the baseline.
3. Record `TOOL-REGISTRY.json`: tool, command, seam function, flags, schema,
   description (written for an LLM caller), success/failure contract, test.

STEP 4 — DESIGN GATE C: OUTPUT, ERRORS, CONCURRENCY, SHUTDOWN
1. Output: reuse `--format llm`/JSON; `isError` payload; truncation limits.
2. Errors: CLI failures → MCP error codes; unknown tool; invalid args;
   internal error.
3. Concurrency: single-flight vs parallel; cancellation (request id → child
   kill); max in-flight; timeouts (mandatory — no hangs).
4. Shutdown: EOF, SIGINT, SIGTERM; exit 0 on clean shutdown; no zombies.

STEP 5 — IMPLEMENT (TDD, incremental slices, commit per slice)
1. `ix-cli/src/cli/mcp/protocol.ts` → tests first.
2. `ix-cli/src/cli/mcp/tools.ts` (registry + schemas) → tests first.
3. `ix-cli/src/cli/mcp/adapters/*.ts` (per-command adapters via the seam) →
   tests first.
4. `ix-cli/src/cli/mcp/server.ts` (stdio loop, JSON-RPC dispatch) → tests first.
5. `ix-cli/src/cli/commands/mcp.ts` (`registerMcpCommand`) — F-009 pattern.
6. `oss.ts` registration + **F-009 regression guard test** (import present,
   registered, absent from `PRO_COMMANDS`; mirror upstream `89ca55e`'s style).
7. Test seams: `createMcpServer(tools, io)` injectable (F-010
   `IX_VIEW_MAP_MAIN` analog).

STEP 6 — TESTS (full matrix; record `TEST-RESULTS.json`)
1. Unit: schemas, arg validation, error mapping, truncation, protocol
   messages (initialize/tools/list/tools/call/ping/unknown-method/malformed).
2. Integration: spawn built CLI; real stdio session; every tool incl.
   failure paths; EOF mid-call; no zombie after `remap`.
3. Regression: full suite, `tsc --noEmit`, eslint; record before/after counts.
4. Discovery pass: grep the fork for TODOs/FIXMEs/dead registrations/command
   inconsistencies introduced by this change — record or fix (fix via commits
   on the fork).

STEP 7 — DOCS
1. `docs/api/README.md` — `ix mcp` section (protocol, tools, config snippets
   for Claude Code `.mcp.json` / Cursor / OpenCode with placeholders, security
   posture).
2. `CLAUDE.md` — command-table row + agent guidance.
3. `skills/ix/SKILL.md` — "prefer `ix mcp` where available" cross-reference.
4. `/stop-slop` pass.

STEP 8 — MULTI-AGENT REVIEW (record `AGENT-REVIEW.json`)
Run the differentiated review plan below against the full diff. Fix
CONFIRMED defects with new commits + regression tests. Record DISPUTEs.

STEP 9 — FORK PUSH (authorized)
1. Final review pass; push `feat/ix-mcp` → `Alot1z/Ix`; API-verify (HEAD,
   message, diff stat). Record `EXTERNAL-ACTION-LOG.json`.
2. Push rejection → record exact error; no force; no partial pushes; report.

STEP 10 — PR PACKET (prepare, do NOT submit)
`pr-packets/ix-mcp/README.md`: title (`feat(mcp): add ix mcp subcommand
exposing a local MCP server (#219)`), motivation, design decisions, tool
table, security posture, test evidence, reviewer notes (josephismikhail
authored #219; cross-ref #372, F-009 + `89ca55e`, F-010), and the exact
one-line submission command (user go-ahead required).

STEP 11 — KNOWLEDGE BASE + LEDGER (update where evidence warrants)
1. Only genuine new findings/evidence/candidates get registry entries with
   provenance; mark obsolete ones explicitly (never silently delete).
2. Add dated correction banners to `planning/final/EXECUTIVE-SUMMARY.md` and
   `MASTER-REPORT.md` (their "nothing pushed / no PR opened" claims are
   OUTDATED by Phase 6/7 — they remain historical, not authoritative).
3. Write `PHASE-8-REPORT.md` + `PHASE-9-IMPLEMENTATION-INPUT.md`; commit +
   push ledger (standing authorization).

TEST PLAN (validation matrix — every row recorded, or explain why N/A)

| Layer | Required validation |
|---|---|
| Syntax/type | `tsc --noEmit` clean (whole `ix-cli`) |
| Unit | per-module vitest (protocol, tools, adapters) |
| Integration | stdio JSON-RPC session (real process, injected IO) |
| Build | project build/package step |
| Runtime smoke | `ix mcp` boots; initialize → tools/list; one tools/call |
| Protocol | full message matrix incl. malformed/oversized |
| Security | no-shell grep; disclosure test (workspace fixture with fake secret + private path); args never reach shell |
| Privacy | secret scan on diff; no paths/tokens in docs snippets |
| Git | diff/status/HEAD verification before/after every mutation |
| Knowledge | JSON validity; registry consistency; no stale statuses |
| Artifact | generated docs render; config snippets parse |

SECURITY PLAN

- stdio-only; document no network binding (F-010 discipline analog).
- Tool args validated against schemas; NEVER interpolated into a shell;
  `remap` may spawn a child with a FIXED command and validated args (same
  pattern as F-010's map spawn — reuse its reaping/timeout code if
  extractable).
- Disclosure test: tool responses never echo fake-secret fixture content.
- No credential access beyond underlying commands; trust model documented
  ("the MCP client has the same power as the user at the terminal").

GITHUB PLAN

- Read-only: upstream, PR #393, issues (verify in STEP 0 and again before
  close-out; record deltas).
- Mutating: fork branch push only (authorized); ledger push (authorized).
- No PR, no comment, no review request, no maintainer contact.

MULTI-AGENT REVIEW PLAN (differentiated; mandatory; record `AGENT-REVIEW.json`)

| Role | Mission | Focus on |
|---|---|---|
| A — Skeptical Archaeologist | Assume the analysis is wrong; find contradictions/stale assumptions | spec framing choice; seam correctness; stale SHAs |
| B — Principal Engineer | Is the architecture sound? | adapter seam vs commander; module boundaries; error model |
| C — Security Engineer | Attack the implementation | shell injection, disclosure, trust boundary, resource limits |
| D — Test Engineer | Can every claim be reproduced? | missing tests; flaky protocol tests; timeout discipline |
| E — Git/GitHub Maintainer | Branch ancestry, push safety, mergeability | fork base `5488741`; PR #393 untouched; no force |
| F — Product/UX | Is this actually useful? | tool set usefulness; descriptions for LLM callers |
| G — Documentation/Knowledge | Internal consistency | docs ↔ CLI; registry ↔ report; ledger coherence |
| H — Adversarial Reviewer | Disprove the entire plan | "would upstream reject this?", "is #219 already solved elsewhere?", "is the spec about to change?" |

Each agent outputs: CONFIRMED / DISPUTED / MISSING_EVIDENCE / BAD_ASSUMPTION /
RECOMMENDATION / BLOCKER. Disagreements → DISPUTE-ID record (question, both
positions, evidence, missing evidence, decision, confidence); a dispute may
become a reproduction candidate. Pre-seeded dispute from the design review:
"should `remap` be exposed as a write tool at all?" (Product: it is the only
graph-mutating action a model needs; Security: it is heavy — resolution:
expose with explicit description, single-flight, cancellation, timeout).

KNOWLEDGE-BASE UPDATE PLAN

- Registries updated ONLY on genuine new entities (provenance required).
- Outdated summary docs get dated banners (historical, not rewritten).
- `STALE-CLAIMS.md` extended if this phase discovers discrepancies.
- Counts derive from source data; never adjusted to match old claims.

FAILURE / RECOVERY PLAN

- Registration error → F-009 lesson; regression guard catches it.
- Test hang → kill child, tighten timeouts; never ship a hang.
- Fork push guard → record exact rejection; no force; no partial pushes.
- Upstream moves mid-phase → stay on pinned base; record divergence; do not
  rebase mid-phase.
- Spec ambiguity → verify live, record reference, never guess.
- Partial failure → FAILED/BLOCKED + reason + evidence + recovery; partial
  success ≠ COMPLETE.

EXTERNAL AUTHORIZATION GATES

| Gate | State |
|---|---|
| Fork branch push | AUTHORIZED |
| Ledger commit/push | AUTHORIZED (standing) |
| PR creation | PROHIBITED (prepare only) |
| Issue/comment/maintainer contact | PROHIBITED |
| Upstream mutation | PROHIBITED forever |

EXPECTED DELIVERABLES

Markdown: `planning/ix/ix-mcp.md`; `pr-packets/ix-mcp/README.md` (NOT
submitted); `CLI-HANDOFF/phase-8/PHASE-8-REPORT.md`;
`CLI-HANDOFF/phase-8/PHASE-9-IMPLEMENTATION-INPUT.md`.
JSON: `PHASE-8-LIVE-BASELINE.json`, `PHASE-8-AUTHORIZATION-STATE.json`,
`TOOL-REGISTRY.json`, `TEST-RESULTS.json`, `EXTERNAL-ACTION-LOG.json`,
`AGENT-REVIEW.json`, `KNOWLEDGE-RECONCILIATION.json`, `FINDING-REVALIDATION.json`.
Code: `ix-cli/src/cli/mcp/*`, `commands/mcp.ts`, `oss.ts` change, tests, docs.
Fork: `feat/ix-mcp` pushed + API-verified.

INTEGRITY CHECKS

□ Phase 7 report consumed □ live baseline re-verified (no unexplained deltas)
□ design doc with spec references □ adapter seam identified per command
□ all tools functional over real stdio □ full JSON-RPC session verified
□ arg validation on every tool □ registered + regression guard (mirrors
`89ca55e`) □ full suite green □ docs updated □ multi-agent review recorded
□ fork branch pushed + API-verified □ PR body complete, NOT submitted
□ all JSON artifacts parse □ secret scan clean □ protected work untouched
(before/after) □ zero upstream mutations □ outdated summary docs banner'd
□ `PHASE-9-IMPLEMENTATION-INPUT.md` produced

SUCCESS CRITERIA

A working `ix mcp` on `Alot1z/Ix:feat/ix-mcp` that a fresh MCP client can
connect to and use for map/explain/trace/impact/search/rank/remap; every claim
reproducible from recorded evidence; the ledger consistent; the fork-only
constraint never violated; PR #393 and all protected work untouched.

NEXT-PHASE HANDOFF (PHASE-9-IMPLEMENTATION-INPUT.md must contain)

Built tool set + schemas; edge cases found; adversarial test matrix for Phase 9
(malformed framing, resource exhaustion, concurrency, lifecycle abuse);
real-client E2E plan (Claude Code / Cursor / OpenCode / MCP inspector);
cross-platform matrix (WSL per F-011, native Windows per #383/PATHEXT, macOS);
perf methodology; current PR-packet state; any new findings/disputes.

COMPLETION REPORT FORMAT (PHASE-8-REPORT.md)

STATUS · ACTUALLY CHANGED · ACTUALLY VERIFIED · NOT CHANGED · PROTECTED ·
BLOCKED · AUTHORIZATION REQUIRED · FINDINGS RESOLVED · FINDINGS INVALIDATED ·
FINDINGS STILL ACTIVE · NEW FINDINGS · AI-SLOP/INVALID ANALYSIS DISCOVERED ·
ISSUES RECONCILED · PRS RECONCILED · COMMITS RECONCILED · FORK STATE ·
UPSTREAM STATE · TEST RESULTS · SECURITY RESULTS · KNOWLEDGE GRAPH STATE ·
EVIDENCE STATE · CANDIDATE STATE · EXTERNAL ACTIONS · REMAINING WORK ·
NEXT PHASE INPUT.

No evidence → no claim. No authorization → no external mutation. No verified
completion → no phase transition.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END PHASE 8
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
