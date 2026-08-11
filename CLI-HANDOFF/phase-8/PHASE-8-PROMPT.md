# PHASE 8 — FORK-BASED `ix mcp` FEATURE IMPLEMENTATION (Issue #219)

## STATUS
READY TO EXECUTE — complete independent phase (supersedes the earlier short draft)

## ROLE

You are executing **Phase 8** of the autonomous Ix / Compass engineering
ladder. This is a **build phase with a hard external boundary**: everything is
implemented, tested, and committed **on the user's fork**; nothing is submitted
upstream.

The deliverable is a production-grade **`ix mcp` subcommand** — the feature
josephismikhail (maintainer) requested in issue **#219**: run ix as a local
MCP server exposing a curated read + write tool set so MCP-aware AI clients
(Claude Code, Cursor, OpenCode, …) invoke ix directly instead of shelling out.

Standing constraint (user, 2026-08-11): **NO PRs and NO commits to any
`ix-infrastructure/*` repository. External writes ONLY to `Alot1z/Ix`,
`Alot1z/system-compass` (nonexistent — skip), `Alot1z/Ix-findings`.**

---

# 0. AUTHORITATIVE INPUTS (consume in order)

- `CLI-HANDOFF/phase-7/PHASE-8-IMPLEMENTATION-INPUT.md` — the handoff
- `github/issues/219/README.md` — the requirement + verified facts
- `CLI-HANDOFF/PHASE-LADDER.md` — where this phase sits
- Source (live, on the fork):
  - `ix-cli/src/cli/register/oss.ts` + `registerProStubs` (registration surface)
  - `ix-cli/src/cli/commands/{map,explain,trace,impact,search,rank,remap,upgrade,view}.ts`
  - `ix-cli/src/cli/llm.ts` (or wherever `--format llm` is implemented — PR #372)
  - `ix-cli/src/cli/commands/patches.ts` (F-009 dead-code lesson)
  - `ix-cli/test/*.test.ts` (existing test conventions, esp. `view-server.test.ts` from F-010)
  - `skills/ix/SKILL.md` + `scripts/bootstrap.*` (the shipped agent skill this supersedes)
- Registry truth: `planning/findings/registry.json` (F-008…F-012 contexts),
  `CLI-HANDOFF/PR-MATRIX.md`, `planning/evidence/registry.json`

---

# 1. CURRENT VERIFIED BASELINE (2026-08-11)

| Item | State |
|---|---|
| `ix mcp` | **Does not exist.** Zero `mcp` references in `ix-cli/src`, `skills/`, `docs/` (source scan, Phase 7). |
| Registration | `oss.ts` registers OSS commands; `PRO_COMMANDS` are Pro-stubbed. F-009 lesson: an unregistered command is invisible; a command in `PRO_COMMANDS` is shadowed by a stub for OSS users. `ix mcp` must be OSS-registered and NOT in `PRO_COMMANDS`. |
| Output convention | The five read commands implement `--format llm` (PR #372). Tool responses should reuse it. |
| CLI main entry | `ix-cli/src/cli/index.ts` → commander; commands export `register*Command(program)` (F-009: `registerPatchesCommand` pattern). |
| Loopback discipline | F-010 established: explicit bind, Host+Origin checks for any network surface. MCP stdio binds nothing — document this as the security posture. |
| Fork base | `Alot1z/Ix` main `5488741` (upstream `1292375`; sync BLOCKED by PAT workflow-scope guard — record base honestly, branch off `5488741` unless the user syncs first). |
| Protected | Ix `b038c46/14` dirty (NEVER touch); ix-compass-dist `396426b/3` (NEVER touch); remap `1497596` = PR #393 head (preserve). |
| Suite | 730 passed / 2 skipped on the remap base; `tsc --noEmit` clean; eslint clean (Phase 6 verification). |

---

# 2. UNIVERSAL SAFETY / PRIVACY / TOOL / SKILL RULES (mandatory, entire phase)

## SOURCE-DRIVEN DEVELOPMENT
Never implement from assumptions, stale reports, or commit-message summaries.
Prefer: live source, live git state, GitHub API state, authoritative
registries, test results, explicit provenance. When in doubt about MCP spec
details, verify against the official specification (`/deepwiki` `/context7`
`/find-docs`) rather than guessing framing or lifecycle details.

## VERIFICATION BEFORE COMPLETION
Never claim a feature works because the code compiles. For every tool:
implement → unit test → integration test → real JSON-RPC round-trip → record
evidence → only then COMPLETE.

## DOUBT-DRIVEN DEVELOPMENT
Treat contradictions as investigation targets. If live state disagrees with
this baseline (e.g., upstream moved, fork state changed), STOP, record the
discrepancy, reconcile, continue.

## NO FABRICATION
Never invent: tool names that do not exist, command flags, PR numbers, test
results, benchmark numbers, client behavior, MCP capabilities, authorization.

## PRIVACY
The fork is PUBLIC. Never commit: credentials, tokens, cookies, session data,
local drive paths, private URLs, personal information, environment values,
internal-only data. Use the allowlist model (PUBLIC_SAFE / PUBLIC_AFTER_
SANITIZATION / PRIVATE / UNKNOWN_REQUIRES_AUTHORIZATION); UNKNOWN is never
published.

## TOOL SAFETY
Read-only inspection first. Branch rewriting, force push, remote mutation,
PR creation require explicit gate authorization. Never bypass a guard; never
use an alternate mechanism to circumvent an authorization boundary.

## SKILLS — FULL INVENTORY (all 85, / prefixes — apply per task)

**thinking:** /tractatus-thinking /sequential-thinking /doubt-driven-development
/debug-thinking /context-engineering
**research:** /research /deepwiki /context7 /find-docs /web-reader
/source-driven-development /gitingest /using-git-worktrees
**planning:** /brainstorming /spec-driven-development /writing-plans
/planning-and-task-breakdown /idea-refine /workspace-memory
**build:** /incremental-implementation /api-and-interface-design
/system-connector /tdd /test-driven-development /autonomous-implementation-pattern
/cli-anything /browser-to-api /mcp-builder
**docs:** /documentation-writer /readme-skill /stop-slop
/documentation-and-adrs /api-docs-skill
**review:** /code-review-and-quality /verification-before-completion
/code-simplification /code-review-graph
**frontend:** /frontend-ui-engineering /frontend-design
/browser-testing-with-devtools /webapp-testing
**ops:** /ci-cd-and-automation /shipping-and-launch
/observability-and-instrumentation /security-and-hardening
**intelligence:** /ix /understand /knip /graphify /improve-codebase-architecture
**git:** /git-workflow-and-versioning
**other:** /prompt-optimizer /artifact-builder /skill-creator /skill-router
/agent-token-optimizer /7-scared-circle-clarity /algorithmic-art /canvas-design
/deprecation-and-migration /desktop-commander-guide /favicon /find-skills /forge
/gepeto /github-actions-docs /internal-comms /interview-me
/javascript-regex-literal-escaping-fix
/orca-cli /orca-per-workspace-env /orchestration /pdf /performance-optimization
/pinokio /pptx /story-quality /theme-factory /docx /computer-use
/agent-browser /workspace-memory

**Phase 8 emphasis:** `/api-and-interface-design` `/tdd`
`/incremental-implementation` `/source-driven-development`
`/verification-before-completion` `/doubt-driven-development`
`/mcp-builder` `/sequential-thinking` `/stop-slop`

Do not claim a skill was used unless it actually was. Re-invoke the thinking
skills START (decompose) / BETWEEN decisions / AFTER each milestone.

---

# 3. PHASE OBJECTIVES

1. **Design** the MCP surface (doc first): transport framing, capability
   negotiation, tool list, arg schemas, error model, shutdown semantics.
2. **Implement** `ix mcp` on the fork: server module, tool adapters over the
   real command implementations, registration in `oss.ts`, `--format llm`
   output reuse, CLI plumbing (`ix mcp` with sensible flags).
3. **Test**: unit (schemas, adapters, arg validation) + integration (real
   stdio JSON-RPC session: initialize → tools/list → tools/call × all tools →
   exit) + full existing suite still green.
4. **Document**: `docs/api/README.md`, `CLAUDE.md` command table, `skills/ix/`
   cross-reference; design/decisions in `planning/ix/ix-mcp.md`.
5. **Fork deliverable**: commit to `feat/ix-mcp`, push to `Alot1z/Ix`,
   API-verify the branch.
6. **PR packet**: complete body (title, motivation, diff summary, test
   evidence, reviewer notes, cross-refs #219 / PR #372 / F-009) in
   `pr-packets/ix-mcp/README.md` — **NOT submitted**.
7. **Ledger**: update manifest/registries; write `PHASE-8-REPORT.md` and
   `PHASE-9-IMPLEMENTATION-INPUT.md`; commit to `Alot1z/Ix-findings`.

---

# 4. AUTHORIZATION MODEL

| Action | State |
|---|---|
| Local design, implementation, tests | AUTHORIZED |
| Commit + push `Alot1z/Ix` fork branch | **AUTHORIZED** |
| PR to `ix-infrastructure/Ix` | **PROHIBITED** (packet prepared only) |
| Comments/issues/maintainer contact | PROHIBITED |
| Touch protected worktrees | PROHIBITED |
| Rebase onto a synced fork main | Only if the user syncs first; otherwise branch off `5488741` and record |
| Any upstream mutation | PROHIBITED forever |

---

# 5. PROTECTED WORK

- `E:/E-github-repos/Ix` — `feat/ix-agent-skill` @ `b038c46`, 14 dirty. NEVER modify.
- `E:/E-github-repos/ix-compass-dist` — `main` @ `396426b`, 3 dirty. NEVER modify.
- `E:/E-github-repos/Ix-remap` — `1497596` (PR #393 head). Preserve; backup refs `backup-c021b52`, `backup-a05e740`.
- Upstream `ix-infrastructure/Ix` — read-only forever.

---

# 6. IMPLEMENTATION PLAN (ordered)

## 6.1 Design (`planning/ix/ix-mcp.md`) — do NOT skip

1. **Transport** — stdio, JSON-RPC 2.0 per the current MCP specification.
   Verify framing (newline-delimited JSON vs Content-Length legacy) against the
   official spec with `/deepwiki` `/context7`; record the decision and the
   spec reference. Support `initialize` (protocolVersion + capabilities),
   `tools/list`, `tools/call`, `ping`, notifications (`notifications/
   initialized`), clean shutdown on EOF/SIGINT.
2. **Tool registry** — curated, mapped 1:1 to real commands (verify flags
   against live source; do NOT invent flags):
   - Read: `map` (or `status`), `explain`, `trace`, `impact`, `search`, `rank`
   - Write: `remap` (rebuild code map)
   - Each tool: `name`, `description`, `inputSchema` (JSON Schema from the
     command's real options), and an adapter that invokes the command's
     *implementation* (import the module, not a shell subprocess — except where
     the command itself is a child process by design, like `remap` running
     `ix map .`).
3. **Output** — reuse `--format llm`/JSON rendering; map CLI errors to MCP
   error codes; truncation policy for large payloads; `isError` semantics.
4. **Concurrency** — one tool call at a time vs parallel; max in-flight;
   cancellation (request id → child kill) where feasible; no hangs.
5. **Security posture** — stdio binds no network; document that this is the
   same least-privilege discipline as F-010's loopback binding. No
   credential access beyond what the CLI commands themselves use. Arguments
   validated against schemas; no argument ever reaches a shell.

## 6.2 Implementation (on the fork, `feat/ix-mcp` off `5488741`)

1. `ix-cli/src/cli/mcp/` — `server.ts` (JSON-RPC loop), `tools.ts` (registry +
   schemas), `adapters/*.ts` (per-command adapters), `protocol.ts` (types).
2. `ix-cli/src/cli/commands/mcp.ts` — `registerMcpCommand(program)` following
   the F-009 pattern; flags: `--port` reserved? NO — stdio only; consider
   `--json` for debugging; keep minimal.
3. `oss.ts` — register `mcp`; NOT in `PRO_COMMANDS`. Verify with a grep that
   no stub shadows it (F-009 regression guard).
4. Test seams — export the server builder (`createMcpServer(tools, io)`) so
   tests inject a fake stdin/stdout (analog of `IX_VIEW_MAP_MAIN` from F-010).
5. Docs — `docs/api/README.md` (new section: `ix mcp` protocol + tools table),
   `CLAUDE.md` (command table row + agent guidance), `skills/ix/SKILL.md`
   (cross-reference: prefer `ix mcp` over shelling out where available).

## 6.3 Tests

- **Unit** — schema validity (every tool schema compiles and matches the
  command's real flags), arg validation, error mapping, output truncation,
  protocol messages (initialize/tools/list/tools/call/ping/unknown-method).
- **Integration** — spawn the built CLI; drive a real stdio session; assert
  JSON-RPC request/response pairs for every tool (incl. failure path);
  assert clean exit on EOF; assert no zombie children after `remap` call.
- **Regression** — full suite (`npm test` in `ix-cli/`), `tsc --noEmit`,
  eslint on changed files. Record before/after counts (expect 730 + new).

## 6.4 Fork push + PR packet

1. Commit on `feat/ix-mcp` (clean message, no personal paths).
2. Push to `Alot1z/Ix`; verify via GitHub API (branch HEAD, commit message,
   diff stat).
3. Write `pr-packets/ix-mcp/README.md` — full PR body: title
   (`feat(mcp): add ix mcp subcommand exposing a local MCP server (#219)`),
   motivation, design decisions, tool table, security posture, test evidence,
   reviewer notes (josephismikhail authored #219; cross-ref #372 `--format
   llm`, F-009 registration discipline, F-010 loopback discipline).
4. **DO NOT submit.**

---

# 7. VALIDATION PLAN (matrix)

| Area | Checks |
|---|---|
| Protocol | initialize/tools/list/tools/call/ping round-trips; unknown-method error; malformed JSON handled; oversized message rejected |
| Tools | every tool: happy path, arg-validation failure, command failure → MCP error, `isError` payload |
| Lifecycle | EOF mid-call, SIGINT, double initialize, notifications, shutdown exit code 0 |
| Regression | full vitest suite, tsc, eslint, no new deps beyond the MCP spec minimum (prefer zero-dependency protocol implementation) |
| Fork | API-verified branch HEAD; diff contains only intended files |
| Security | secret scan on diff; no shell interpolation of tool args; no paths |
| Docs | `docs/api/README.md` renders; `CLAUDE.md` table consistent with actual CLI |

# 8. SECURITY / PRIVACY

- stdio-only; document no network binding.
- Tool args validated; never interpolated into a shell.
- No secrets/tokens/paths in any committed artifact; fork is public.

# 9. DELIVERABLES

- `planning/ix/ix-mcp.md` (design + decisions + spec references)
- `ix-cli/src/cli/mcp/*` + `ix-cli/src/cli/commands/mcp.ts` + `oss.ts` change + tests + docs
- `pr-packets/ix-mcp/README.md` (PR body — NOT submitted)
- `CLI-HANDOFF/phase-8/PHASE-8-REPORT.md` + `PHASE-9-IMPLEMENTATION-INPUT.md`
- Fork branch `feat/ix-mcp` pushed + API-verified
- Ledger commit pushed to `Alot1z/Ix-findings`

# 10. COMPLETION CRITERIA

□ design doc written with spec references □ all tools functional over real
stdio □ full JSON-RPC session verified □ arg validation on every tool
□ registration in `oss.ts`, no Pro-stub shadow (grep) □ full suite green
□ docs updated □ fork branch pushed + API-verified □ PR body complete, not
submitted □ ledger in sync □ protected work untouched □ zero upstream
mutations □ `PHASE-9-IMPLEMENTATION-INPUT.md` produced

# 11. FAILURE / RECOVERY

- **Registration mistake** → F-009 lesson: verify import in `oss.ts`, verify
  absent from `PRO_COMMANDS`, verify `ix mcp` resolves (smoke).
- **Stdio hangs in tests** → strict timeouts on every test; kill child in
  teardown; never let the suite hang.
- **Fork push guard** → record the exact rejection (workflow-scope guard
  expected); do not force; do not reduce the commit set; report.
- **Upstream advanced** → do NOT rebase onto a moving base mid-phase; record,
  finish on the pinned base, note the divergence in the report.

# 12. PHASE 9 HANDOFF

`PHASE-9-IMPLEMENTATION-INPUT.md` must specify: the built tool set + schemas,
known edge cases found during Phase 8, the adversarial/security test matrix to
run in Phase 9, the real-client E2E plan (Claude Code / Cursor / OpenCode
config snippets), the cross-platform matrix (WSL from F-011, native Windows
from #383/PATHEXT lesson, macOS), and the PR packet state.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END PHASE 8
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
