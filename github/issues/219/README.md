# Issue #219 — Add `ix mcp` subcommand: expose ix as a local MCP server

**URL:** https://github.com/ix-infrastructure/Ix/issues/219  
**Author:** josephismikhail (maintainer)  
**Opened:** 2026-05-26 · **Status:** **OPEN** — the one genuinely actionable open item  
**Labels:** enhancement · **Comments:** 0 · **Evidence Class:** Class A (requirement source)

## Summary (verbatim intent)

> Add an `ix mcp` subcommand that runs ix as a local Model Context Protocol
> (MCP) server. Exposes a curated set of read + write tools to MCP-aware AI
> clients (Claude Code, Cursor, OpenCode, etc.) so the model can invoke ix
> operations directly without going through shell subprocess invocations.

## Current state (2026-08-11, API + source verified)

- **No MCP code exists in `ix-infrastructure/Ix`** — zero `mcp` references in
  `ix-cli/src`, `skills/`, or `docs/` (source scan).
- The **ix-codex-plugin** repo (separate, public) already ships a Python MCP
  server that invokes the ix CLI, with related open items (#16 "invoke the ix
  CLI for every tool", #23 "use --format llm where supported" — closed). That
  is a plugin-side implementation, not the requested CLI subcommand.
- `ix patches` (F-009) taught us the registration surface: a new command must
  be registered in `ix-cli/src/cli/register/oss.ts` and listed appropriately;
  `--format llm` support exists for the read commands (PR #372).
- Relevant existing surface for tool candidates: `ix map/explain/trace/
  impact/search/rank` (read), `ix remap` (write), `--format llm` output.

## Why this is the priority open item for us

1. Requested by the maintainer himself — high upstream value.
2. Aligns with the user's own MCP experience (skill-router MCP, many MCP
   projects in the workspace).
3. Fit with the shipped ix agent skill (#368): a native `ix mcp` subcommand
   would replace the shell-invocation pattern the skill teaches.
4. Developable **on the fork** (Alot1z/Ix) under the standing constraint
   (no upstream PRs): design → implement on `feat/ix-mcp` → test → commit to
   fork → PR body prepared, not submitted.

## Recommended follow-up

**Phase 8 centerpiece** — see `CLI-HANDOFF/phase-8/PHASE-8-PROMPT.md`.
Design decisions to nail down first: stdio transport, tool list (curated
read + write), authentication/loopback model, `--format llm` reuse, docs.
