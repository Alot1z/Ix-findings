# `ix mcp` — Design Record (Phase 8, 2026-08-11)

Status: IMPLEMENTED on `Alot1z/Ix:feat/ix-mcp` @ `863b3fd` (pushed, PR packet
prepared-not-submitted). Implements issue #219.

## Pinned protocol references (verified live, 2026-08-11)

The current MCP spec is the **2026-07-28** revision (a major "stateless"
revision; the previous stable was 2025-06-18):

- Transports/stdio: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports
  — UTF-8, newline-delimited JSON-RPC over stdio; one message per line.
- Versioning/compat: https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning
  — modern (per-request `_meta`, `server/discover`) vs legacy (initialize
  handshake ≤ 2025-11-25); **dual-era** is the spec-recommended server design;
  unsupported version → error `-32022` with `data.supported`.
- Tools: https://modelcontextprotocol.io/specification/2026-07-28/server/tools
  — `tools/list`/`tools/call` results carry `resultType: "complete"`; tools
  declare `capabilities.tools.listChanged`; deterministic tool order.
- Companion analysis: "MCP 2026-07-28 Goes Stateless" (mcpjam, 2026-07-31) —
  server identity travels in response `_meta.io.modelcontextprotocol/serverInfo`.

## Decisions

| # | Decision | Rationale |
|---|---|---|
| D8-1 | Dual-era server: modern (2026-07-28) + legacy (2025-06-18 initialize) | One binary serves current clients (per-request `_meta`) and classic clients (Claude Code/Cursor today are legacy-era) per the spec's compatibility matrix. |
| D8-2 | Tools spawn the CLI via `execFile` (F-010 pattern), not internal function calls | The command modules expose only commander `register*` functions with inline `.action()` closures — no reusable `run*` seams exist. The codebase's own established pattern for invoking a command from another context is spawning the CLI (`view.ts` remap handler). Internal refactor of 8 command modules would be a much larger, riskier change. |
| D8-3 | Tool output = the command's `--format llm` records | Token-minimal, LLM-oriented, already implemented on all eight commands (#372). |
| D8-4 | Whitelisted flags only, `additionalProperties: false` schemas | A client cannot smuggle arbitrary flags into the spawned process; validated args reach `execFile` as argv, never a shell. |
| D8-5 | Sequential request processing; notifications bypass the queue | Every tool call spawns a child; pipelining would pile up unbounded children. Notifications (notably `notifications/cancelled`) must bypass the queue or a cancel could never reach an in-flight call (deadlock — found and fixed during review). |
| D8-6 | Kill on disconnect (EOF) + drop responses after close | Client gone → abort in-flight children and exit promptly; no EPIPE crash. Mirrors F-010's `res.destroyed` guard. |
| D8-7 | `ix_read` added beyond the phase baseline | Raw source is the single highest-value tool for an LLM caller; `ix read --format llm` already exists. Design gate B permits justified additions. |
| D8-8 | Tool names `ix_`-prefixed | Spec's collision guidance for aggregating clients (a generic `search`/`rank` collides with other servers). |
| D8-9 | **`remap` write tool NOT implemented** | `/__ix/remap` does not exist on the base (`5488741`); the hardening PR #393 adds it. A tool shelling out to a nonexistent command would be fabrication. Deferred as CAND-020 (once #393 merges). |
| D8-10 | Default per-tool timeouts: map 300s, others 120s, overridable via `IX_MCP_<CMD>_TIMEOUT_MS` | Bounds resource use without breaking long maps; env override mirrors the CLI's `IX_MAP_DEADLINE_MS` pattern. |

## Architecture

```
ix mcp (commands/mcp.ts, registered in oss.ts)
  └─ runStdioMcpServer (mcp/stdio-main.ts)
       └─ McpServer (mcp/server.ts)        — dual-era JSON-RPC dispatch, framing, queue, cancellation, EOF
            ├─ tools (mcp/tools.ts)        — registry, schemas, validateArgs, buildArgv, timeouts
            └─ ToolExecutor (mcp/cli-executor.ts) — spawns node <cli-main> <cmd> … --format llm
                                                     with timeout, maxBuffer, abort → kill
```

Files: `src/cli/mcp/{protocol,tools,types,cli-executor,server,stdio-main}.ts`,
`src/cli/commands/mcp.ts`, `register/oss.ts` (+test seam `IX_MCP_CLI_MAIN`,
the F-010 `IX_VIEW_MAP_MAIN` analog).

## Deviations from the Phase 8 prompt baseline (recorded, all evidence-backed)

1. **Adapter seam** (prompt assumed exported command functions): none exist;
   the codebase's proven seam is spawning the CLI. Prompt STEP 0 required
   discovering the real seam — this was the discovery.
2. **write×1 → write×0** (prompt assumed a `remap` tool): `remap` does not
   exist on the fork base (PR #393 adds it). CAND-020 tracks the follow-up.
3. **read×6 → read×8** (`ix_read` added): justified addition, D8-7.

## Phase 9 addendum (2026-08-11, PARTIAL)

Local hardening landed on `feat/ix-mcp` (`863b3fd → 66fa5f5`, 2 commits):

- **H9-1** 1 MiB line-size cap — byte-bounded reader replaces readline;
  oversized line → `-32700` + resync (memory bound, proven in real binary).
- **H9-2/H9-3** JSON-RPC 2.0 compliance — batches → single `-32600`; wrong
  `jsonrpc` / non-scalar id → `-32600`.
- **H9-4** whole-tree kill — children spawn detached (own group on POSIX,
  `taskkill /T` on Windows); cancel/timeout/overflow/EOF/SIGINT/SIGTERM kill
  the tree; `disposeAll()` on shutdown. Grandchild reaping proven by
  PID-file tests.

Real-client E2E: Codex 0.143.0 drove `ix_status` + `ix_map` over real stdio
against the live backend — both completed, output cross-checked identical to
direct CLI (D9-1: the ix backend runs locally; D9-2: transient rev=0 during
concurrent ingest is cosmetic; D9-3: first orphan fixture wrote PID debris —
fixed with env-passed paths). Claude Code UNVERIFIED (broken npm install,
blocker recorded). Full records: `CLI-HANDOFF/phase-9/`.

Remaining Phase 9 scope: cross-platform matrix (WSL/native-Windows/macOS),
performance methodology (p50/p95, RSS, spawn overhead), MCP Inspector +
Cursor/OpenCode E2E, CAND-020 (remap write tool, gated on PR #393 merge).
