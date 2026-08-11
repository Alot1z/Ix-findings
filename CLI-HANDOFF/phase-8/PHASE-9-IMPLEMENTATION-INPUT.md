# PHASE 9 — IMPLEMENTATION INPUT (consumed from Phase 8)

**Produced:** 2026-08-11 · Phase 8 STATUS: COMPLETE.

## What Phase 8 actually delivered (evidence)

- `Alot1z/Ix:feat/ix-mcp` @ `863b3fd513656253536fd398aed62b30526e7ef1` — 3 commits,
  19 files, +1936/−0. Pushed, API-verified. PR packet at
  `pr-packets/ix-mcp/` (NOT submitted — authorization gate).
- Dual-era MCP stdio server: modern 2026-07-28 (stateless `_meta`,
  `server/discover`, `-32022`) + legacy 2025-06-18 initialize handshake.
- 8 tools: `ix_map/status/explain/trace/impact/search/rank/read`, all reusing
  `--format llm`.
- Seams (for Phase 9 reuse): `McpServer(tools, executor, io)` injectable;
  `ToolExecutor` interface (`src/cli/mcp/types.ts`); `IX_MCP_CLI_MAIN` env
  override (F-010 `IX_VIEW_MAP_MAIN` analog); `IX_MCP_<CMD>_TIMEOUT_MS`
  per-tool timeout override.

## Known gaps / hardening candidates for Phase 9 (from review, not yet fixed)

1. **Request-line size cap** — the readline loop has no message-length limit; a
   pathological client can push arbitrarily large lines (memory exhaustion).
   Adversarial test: oversized initialize/tools/call; expect bounded rejection.
2. **Child-of-child reaping** — tool calls spawn `node <cli-main>` which may
   itself spawn the backend; we kill the direct child only. Verify no orphan
   processes after timeout/cancel on each platform.
3. **Real-client E2E** — verify against actual MCP clients (Claude Code,
   Cursor, OpenCode, MCP Inspector) over real stdio, not just our fixture.
4. **Platform matrix** — WSL (F-011), native Windows (PATHEXT/#383 lessons),
   macOS; confirm `process.execPath` spawn + `--format llm` parity.
5. **Perf methodology** — tool-call latency vs `--format json`; startup cost of
   spawning `node main.js` per call (this is the F-010 spawn cost; measure and
   document; a long-lived in-process executor is the alternative if it matters).
6. **Protocol abuse matrix** — malformed framing mid-line, EOF mid-call
   (covered), concurrent cancels, unknown _meta keys, notifications storms.
7. **Tool registry additions after upstream merges** — CAND-020: `ix_remap`
   write tool once PR #393 lands (`/__ix/remap` on main); re-verify the
   `ix_mcp` tool list against upstream command surface at phase start.

## Authorization state carried forward

- Fork push + ledger: AUTHORIZED. PR submission: PROHIBITED until explicit
  user authorization. Upstream mutation: PROHIBITED forever.
- Fork-main sync: BLOCKED (PAT `workflow` scope) — Phase 9 may branch off
  `feat/ix-mcp` or `5488741` as appropriate; record the base.
- Protected: `Ix b038c46/14`, `ix-compass-dist 396426b/3`, `Ix-remap 1497596`.

## Live-state note for the Phase 9 controller run

Re-verify before execution: upstream main SHA, PR #393 state (may now have
reviews), #219 state, fork branch list, and whether any upstream MCP work
appeared (would supersede CAND-020 / adjust the tool list). Do not assume
`863b3fd` is still the fork tip.
