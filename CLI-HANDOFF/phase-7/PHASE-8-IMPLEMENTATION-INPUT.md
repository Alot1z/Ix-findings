# Phase 8 — Implementation Input

**Phase 7 → Phase 8 handoff · 2026-08-11**

---

## 1. Phase 7 outcome (what is now true)

| Item | State |
|---|---|
| PR #393 (remap) | OPEN, MERGEABLE, 14/14 CI green, blocked only on review — healthy, awaiting upstream |
| F-008 (#376) | RESOLVED_UPSTREAM — #391 merged 2026-08-11 04:36Z; issue closed |
| F-009 (#371) | RESOLVED_UPSTREAM — #390 merged 2026-08-11 03:17Z; issue closed |
| Open issues | **#219 `ix mcp` (actionable)** · #385 fixed-on-main (awaiting reporter) · #349 fixed-on-main (#352) · #383 fixed in ix-codex-plugin |
| Fork `Alot1z/Ix` main | `5488741` — **behind upstream `1292375`; sync BLOCKED** (PAT `workflow` scope). Remedy: `gh auth refresh -s workflow` or UI Sync fork |
| Fork remap branch | `1497596` (API-verified, matches local) |
| `Alot1z/system-compass` | 404 — does not exist; Phase 9 readiness-only |
| Ledger | reconciled + pushed to `Alot1z/Ix-findings` (Phase 7 commit) |

## 2. The Phase 8 target — issue #219 `ix mcp` subcommand

**Requirement (maintainer josephismikhail):** an `ix mcp` subcommand running ix
as a local MCP server exposing a curated set of read + write tools to
MCP-aware AI clients, so models invoke ix without shell subprocess calls.

**Verified facts:**
- Zero MCP code in `ix-infrastructure/Ix` (`ix-cli/src`, `skills/`, `docs/`
  scanned — none).
- Registration surface: `ix-cli/src/cli/register/oss.ts` — F-009 lesson: a new
  command MUST be imported/registered there; if it belongs in `PRO_COMMANDS`,
  decide deliberately (Pro stubs shadow OSS — see CLAUDE.md notes from #390).
- Output: the five read commands now implement `--format llm` (PR #372) —
  reuse for tool responses.
- Loopback discipline: F-010 established the pattern (bind 127.0.0.1, Host +
  Origin checks) — the MCP server (stdio, local) should follow the same
  least-privilege spirit.
- The shipped agent skill (`skills/ix/`, PR #368) teaches shell invocation;
  `ix mcp` supersedes that pattern — docs should cross-reference.

## 3. Design scope to nail down first (`planning/ix/ix-mcp.md`)

1. Transport: stdio (JSON-RPC 2.0) — per MCP spec; optional HTTP later.
2. Tool list (curated, mapped to existing commands):
   - Read: `map` (status), `explain`, `trace`, `impact`, `search`, `rank`
   - Write: `remap` (rebuild map)
   - Each tool = name, description, JSON-schema args mapped from CLI flags.
3. Output: reuse `--format llm` / JSON output; errors mapped to MCP error codes.
4. Config/auth: no remote binding; stdin/stdout only; no new credentials.
5. Registration: `mcp` in `oss.ts` (OSS command), NOT in `PRO_COMMANDS`.
6. Docs: `docs/api/README.md`, `CLAUDE.md`, `skills/ix/`.

## 4. Test plan

- Unit: tool/schema mapping, arg validation, error mapping.
- Integration: boot stdio server; full JSON-RPC session — `initialize` →
  `tools/list` → `tools/call` (each tool, incl. failure path) → clean exit.
- Full suite + `tsc --noEmit` + eslint (base ~730/732 green).
- Guard: server must exit cleanly on EOF; no hangs (strict timeouts).

## 5. Fork workflow (standing constraint)

- Branch: `feat/ix-mcp` off fork main `5488741` (record base honestly — do
  NOT claim a sync that did not happen; if the user refreshes the token and
  syncs first, rebase onto the new base).
- Commit to `Alot1z/Ix` and push (authorized).
- **Do NOT open a PR against `ix-infrastructure/Ix`** — prepare the complete
  PR body in `pr-packets/ix-mcp/README.md` (title, body, diff summary, test
  evidence, reviewer notes) for submission only on explicit user instruction.

## 6. Protected / do-not-touch

- `E:/E-github-repos/Ix` — `feat/ix-agent-skill` @ `b038c46`, 14 dirty.
- `E:/E-github-repos/ix-compass-dist` — `396426b`, 3 dirty.
- `E:/E-github-repos/Ix-remap` — `1497596` (PR #393 head); backup refs.
- Upstream `ix-infrastructure/Ix` — read-only.

## 7. Authorization gates for Phase 8 (defaults)

| Gate | Default |
|---|---|
| Local implementation + tests | AUTHORIZED |
| Commit + push to `Alot1z/Ix` fork branch | AUTHORIZED |
| PR to upstream | **PROHIBITED** (body prepared only) |
| Comments on #219 / maintainer contact | PROHIBITED |
| Upstream mutation | PROHIBITED forever |

## 8. Phase 8 objective

> **Deliver a working, tested `ix mcp` subcommand on the fork** — designed,
> implemented, registered, documented, pushed to `Alot1z/Ix:feat/ix-mcp`,
> with a complete PR body ready to submit on user instruction and the ledger
> kept in sync.
