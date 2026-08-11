## Summary

Implements #219: `ix mcp` runs a local MCP (Model Context Protocol) server
over stdio, exposing the ix code-graph commands as tools for MCP-aware AI
clients (Claude Code, Cursor, OpenCode, MCP Inspector).

```json
{
  "mcpServers": {
    "ix": { "command": "ix", "args": ["mcp", "--stdio"] }
  }
}
```

## What's included

- `ix mcp --stdio` (default) + `ix mcp --list-tools`.
- **Dual-era protocol**: MCP 2026-07-28 (stateless, per-request `_meta`,
  `server/discover`, `-32022` version errors) and the legacy 2025-06-18
  initialize handshake — modern and classic clients both work.
- **Eight read-only tools**: `ix_map`, `ix_status`, `ix_explain`, `ix_trace`,
  `ix_impact`, `ix_search`, `ix_rank`, `ix_read` — each reuses the command's
  `--format llm` output.
- **Argument safety**: per-tool JSON schemas (`additionalProperties: false`),
  whitelisted flags, spawned with the no-shell execFile pattern, hard timeout,
  output cap, and kill on `notifications/cancelled` or client disconnect.
- **Registration discipline**: registered in `oss.ts`, absent from
  `PRO_COMMANDS`, with a regression test (same guard as #390's `89ca55e`).
- Docs: `docs/api/README.md`, `CLAUDE.md`, `skills/ix/SKILL.md`.

## Deliberately not included

A `remap` write tool — `/__ix/remap` does not exist on `main` yet (see open
PR #393); it is a follow-up once that lands. The MCP surface is read-only for
now; the client holds the same power as the user at the terminal.

## Testing

- 39 new tests: protocol/validation units, dual-era session (initialize,
  discover, tools/list, tools/call, ping, malformed input, unknown method,
  version gate, cancellation, EOF), registration guard, real-process stdio
  integration, real-process timeout kill.
- Full suite: 735 passed / 2 skipped. `tsc --noEmit` clean, eslint clean.
