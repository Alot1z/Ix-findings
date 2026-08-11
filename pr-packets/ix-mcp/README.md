# PR PACKET — `feat(mcp): add ix mcp subcommand exposing the code graph as MCP tools`

**Status: PREPARED-ONLY — NOT SUBMITTED.** Submission is gated on explicit
user authorization (standing rule: no upstream PRs without the user's word).
When authorized, the exact submission command is at the bottom.

**Fork branch:** `Alot1z/Ix:feat/ix-mcp` @ `863b3fd513656253536fd398aed62b30526e7ef1`
**Base:** fork main `5488741` (v0.9.2) — matches upstream main for this change's
files; upstream `1292375` has no conflicting changes to the touched paths.
**Commits:** 3 (feat `36c7c7e`, docs `73860aa`, fix `863b3fd`) — 19 files, +1936/−0.

## Proposed title

`feat(mcp): add ix mcp subcommand exposing the code graph as MCP tools (#219)`

## Motivation

Issue #219 (josephismikhail, maintainer, open since 2026-05-26, 0 comments)
requests a local MCP server so MCP-aware AI clients call ix directly instead
of shelling out. This implements exactly that on the fork: `ix mcp --stdio`
exposes the code-graph commands as tools over stdio with no network surface.

## What changed

- **New `ix mcp` subcommand** (`ix-cli/src/cli/commands/mcp.ts`, registered in
  `register/oss.ts`) — `--stdio` server (default) and `--list-tools`.
- **Dual-era MCP server** (`ix-cli/src/cli/mcp/`): speaks MCP **2026-07-28**
  (stateless, per-request `_meta`, `server/discover`, `UnsupportedProtocolVersion`
  `-32022`) and the **2025-06-18** legacy initialize handshake, per the spec's
  compatibility matrix — same binary works with modern and classic clients.
- **Eight read-only tools**: `ix_map`, `ix_status`, `ix_explain`, `ix_trace`,
  `ix_impact`, `ix_search`, `ix_rank`, `ix_read` — each bound to the matching
  `ix` command and reusing its `--format llm` records.
- **Arg safety**: per-tool JSON schemas with `additionalProperties: false`;
  whitelisted flags only; executed via the F-010 `execFile` pattern (no shell,
  hard timeout, `maxBuffer` cap, kill on `notifications/cancelled` and on EOF).
- **F-009 registration discipline**: registered in `registerOssCommands`,
  absent from `PRO_COMMANDS`, with a regression test mirroring upstream's
  `89ca55e` guard (a Pro stub can never shadow it).
- **Docs**: `docs/api/README.md` MCP section + `.mcp.json` snippet,
  `CLAUDE.md` routing section, `skills/ix/SKILL.md` cross-reference.

## Deliberate non-goal (documented in the design doc)

The `remap` write tool is **not** included: `/__ix/remap` does not exist on the
base this branch is cut from (the hardening PR #393 adds it). Inventing a tool
that shells out to a nonexistent command would violate the no-fabrication rule.
It is a follow-up candidate once #393 merges (CAND-020).

## Test evidence

- 39 new MCP tests, all green: protocol/validation units, in-memory dual-era
  session (initialize, discover, tools/list, tools/call, ping, malformed JSON,
  unknown method, `-32022` version gate, cancellation, EOF abort), registration
  guard, real-process stdio integration session, real-process timeout kill.
- Full suite: **735 passed / 2 skipped** (+ parser smoke) — no regressions.
- `tsc --noEmit` clean, `eslint src` 0 errors, production build clean.

## Reviewer notes

- #219 author: josephismikhail. Related: #372 (`--format llm`), F-009 +
  `89ca55e` (registration guard), F-010 (loopback/exec discipline, PR #393).
- Security posture: tools are read-only queries; the MCP client holds the same
  power as the user at the terminal (documented trust model); no shell, no
  network binding, output caps, timeout + cancellation on every call.

## Submission gate (user authorization required)

```bash
gh pr create --repo ix-infrastructure/Ix --title "feat(mcp): add ix mcp subcommand exposing the code graph as MCP tools (#219)" --body-file pr-packets/ix-mcp/PR-BODY.md --head Alot1z:feat/ix-mcp --base main
```

`PR-BODY.md` (same content as this packet, trimmed for GitHub) is in this
directory. Do not run the command without explicit user authorization.
