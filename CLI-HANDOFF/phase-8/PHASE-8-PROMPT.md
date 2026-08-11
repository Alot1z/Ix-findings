# PHASE 8 — FORK-BASED `ix mcp` IMPLEMENTATION (Issue #219)

## STATUS
READY TO EXECUTE (after Phase 7 completes)

## PURPOSE

Implement issue **#219 — `ix mcp` subcommand** (maintainer josephismikhail's
open enhancement: expose ix as a local MCP server with a curated read+write
tool set) **entirely on the fork**, with local test verification and a fully
prepared PR body that is **NOT submitted** to upstream.

Standing constraint (user, 2026-08-11): **NO PRs and NO commits to
`ix-infrastructure/*`. External writes ONLY to `Alot1z/Ix`,
`Alot1z/system-compass` (nonexistent — skip), `Alot1z/Ix-findings`.**

## AUTHORITATIVE INPUTS

- `CLI-HANDOFF/phase-7/PHASE-8-IMPLEMENTATION-INPUT.md`
- `github/issues/219/README.md`
- `ix-cli/src/cli/register/oss.ts` + `registerProStubs` (F-009 registration
  lesson: new command MUST be registered; do NOT let it land in PRO_COMMANDS
  without intent)
- `ix-cli/src/cli/commands/*.ts` (map/explain/trace/impact/search/rank + remap)
- `--format llm` implementation (PR #372) for output reuse
- `skills/ix/` (the shipped agent skill — the MCP server supersedes its
  shell-invocation pattern)

## CURRENT VERIFIED BASELINE

- Ix has **zero** MCP code (source scan verified).
- The `ix-codex-plugin` repo ships a separate Python MCP server (plugin-side);
  #219 asks for a native CLI subcommand — distinct.
- MCP spec: Model Context Protocol, stdio transport, JSON-RPC 2.0.
- Fork `Alot1z/Ix` main: sync state per Phase 7 (if the workflow-scope guard
  still blocks sync, branch `feat/ix-mcp` off the latest synced fork main and
  record the base honestly).
- Protected worktrees unchanged (Ix `b038c46/14`, ix-compass-dist `396426b/3`).

## NEXT-PHASE OBJECTIVES

1. Design the MCP surface: stdio transport; tool list (curated read: map,
   explain, trace, impact, search, rank; write: remap); per-tool argument
   schema mapped from CLI flags; `--format llm` output reuse; error mapping.
2. Implement `ix mcp` in `ix-cli/src/cli/commands/mcp.ts` + register in
   `oss.ts`; add `--format llm`-compatible output; document in
   `docs/api/README.md` and `CLAUDE.md`.
3. Test: unit tests for schema/tool mapping; integration test that boots the
   stdio server and completes a JSON-RPC session (initialize → tools/list →
   tools/call → exit); full suite + tsc + eslint.
4. Commit to fork branch `feat/ix-mcp` on `Alot1z/Ix` (authorized).
5. Prepare the PR body (title/body/diff summary/test evidence) in
   `pr-packets/ix-mcp/README.md` — **do NOT submit**.
6. Keep the ledger in sync (manifest, data.js regeneration via the Pages
   workflow on push).

## AUTHORIZATION MODEL

| Action | State |
|---|---|
| Local implementation + tests | AUTHORIZED |
| Commit to `Alot1z/Ix` fork branch | **AUTHORIZED** |
| PR to `ix-infrastructure/Ix` | **PROHIBITED** (body prepared only) |
| Comments on #219 upstream | PROHIBITED without further instruction |
| Touch protected worktrees | PROHIBITED |

## PROTECTED WORK

Same as Phase 7 (Ix `b038c46/14`, ix-compass-dist `396426b/3`). The fork's
remap branch `1497596` must not be disturbed (PR #393 head).

## IMPLEMENTATION PLAN

1. Create `feat/ix-mcp` off fork main (or the honest latest base).
2. Design doc first (`planning/ix/ix-mcp.md`): tools, schemas, auth model
   (loopback-only — reuse the F-010 loopback discipline where the server
   binds), error contract.
3. Implement + register + document.
4. Tests (unit + stdio integration).
5. Commit to fork; push; verify via API.
6. Write `pr-packets/ix-mcp/README.md` (PR body ready, not submitted).
7. Ledger update + `PHASE-8-REPORT.md` + `PHASE-9-IMPLEMENTATION-INPUT.md`.

## VALIDATION PLAN

- Full vitest suite (expect ~730+ new MCP tests), `tsc --noEmit`, eslint.
- Stdio JSON-RPC smoke: real `initialize`/`tools/list`/`tools/call` round-trip.
- Secret scan + privacy scan on the diff.
- API-verify fork branch HEAD after push.
- Protected-worktree before/after.

## SECURITY / PRIVACY

- The MCP server must be loopback-safe (no remote binding), validate tool
  arguments, and never expose credentials/config beyond what the CLI itself
  would.
- No personal paths in any committed artifact.

## TOOLS / SKILLS

`tdd`, `api-and-interface-design`, `incremental-implementation`,
`verification-before-completion`, `doubt-driven-development`,
`source-driven-development`, `git-workflow-and-versioning`, `ix` (map the
fork to trace callers of the registration surface).

## DELIVERABLES

- `ix-cli/src/cli/commands/mcp.ts` + tests + `oss.ts` registration + docs
- `planning/ix/ix-mcp.md` (design + decisions)
- `pr-packets/ix-mcp/README.md` (PR body — NOT submitted)
- `CLI-HANDOFF/phase-8/PHASE-8-REPORT.md` + `PHASE-9-IMPLEMENTATION-INPUT.md`
- Fork branch `feat/ix-mcp` pushed

## COMPLETION CRITERIA

□ MCP server functional (stdio, JSON-RPC) □ tools/list + tools/call verified
□ full suite green □ docs updated □ fork branch pushed + API-verified
□ PR body prepared, not submitted □ ledger in sync □ protected work untouched

## FAILURE / RECOVERY

- Registration mistake → follow F-009 lesson (verify `oss.ts` import + no
  PRO_COMMANDS shadowing).
- Stdio server hangs in tests → strict timeouts; never kill the suite.
- Fork push guard → record, do not force, do not reduce the commit set.

## PHASE 9 HANDOFF

`PHASE-9-IMPLEMENTATION-INPUT.md` must specify the Compass fork readiness
(F-key spec per `pr-packets/compass-f-key/README.md`, delayed-data packet) and
the exact blocker (access). Until `Alot1z/system-compass` can exist, Phase 9
is a readiness + spec-consolidation phase, not an implementation phase.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END PHASE 8
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
