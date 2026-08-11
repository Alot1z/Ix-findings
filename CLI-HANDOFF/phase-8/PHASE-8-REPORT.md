# PHASE 8 — FORK-BASED `ix mcp` SUBCOMMAND: EVIDENCE-DERIVED BUILD (#219) — REPORT

**Date:** 2026-08-11 · **Status:** COMPLETE (implemented, tested, pushed to
fork; PR packet prepared-not-submitted per standing authorization rules)

---

## STATUS

**COMPLETE.** `ix mcp` implemented on `Alot1z/Ix:feat/ix-mcp` @ `863b3fd`
(3 commits, 19 files, +1936/−0), pushed and API-verified. Dual-era MCP stdio
server (2026-07-28 + 2025-06-18), eight read-only tools reusing `--format llm`,
F-010 exec discipline, F-009 registration guard. Full suite green
(735/2, +parser smoke), tsc clean, eslint clean. PR packet prepared,
**NOT submitted**. Zero upstream mutations.

## MISSION

Build a production-grade `ix mcp` subcommand on the user's fork so MCP-aware
AI clients invoke ix directly. (Full mission in `PHASE-8-PROMPT.md`.)

## ACTUALLY CHANGED

- **Fork `Alot1z/Ix` branch `feat/ix-mcp`** (new worktree `E:/E-github-repos/Ix-mcp`,
  branched from fork main `5488741`):
  - New `ix-cli/src/cli/mcp/{protocol,tools,types,cli-executor,server,stdio-main}.ts`
  - New `ix-cli/src/cli/commands/mcp.ts`; `register/oss.ts` registers it
  - 5 new test files + 2 fixtures (`src/cli/__tests__/mcp-*.test.ts`)
  - Docs: `docs/api/README.md` (MCP section + ToC), `CLAUDE.md` (routing
    section), `skills/ix/SKILL.md` (MCP cross-ref)
  - Commits: `36c7c7e` feat · `73860aa` docs · `863b3fd` review fixes
- **Ix-findings ledger**: this report, `PHASE-9-IMPLEMENTATION-INPUT.md`,
  `planning/ix/ix-mcp.md` (design record), `pr-packets/ix-mcp/` (packet +
  PR body), phase-8 JSON artifacts (baseline, authorization, tool registry,
  test results, external actions, agent review).

## ACTUALLY VERIFIED

| Claim | Evidence |
|---|---|
| `feat/ix-mcp` pushed @ `863b3fd` | GitHub API branch head == local HEAD |
| 3 commits / 19 files / +1936 −0 vs fork main | `gh api compare` |
| 8 tools over real stdio | real binary session: initialize → tools/list → tools/call → ping |
| Dual-era handshake | legacy initialize returns `2025-06-18` + capabilities + serverInfo; `server/discover` returns `2026-07-28` |
| Suite regression | `npm test`: 735 passed / 2 skipped + parser smoke |
| tsc / eslint / build | clean / 0 errors / clean |
| Spec pinned | 2026-07-28 + 2025-06-18, URLs in `planning/ix/ix-mcp.md` |
| Protected work untouched | `Ix b038c46/14`, `ix-compass-dist 396426b/3`, `Ix-remap 1497596` — before/after checks |

## NOT CHANGED

- Upstream `ix-infrastructure/Ix` — read-only, zero mutations.
- PR #393 — untouched, still open/mergeable/awaiting review.
- Protected worktrees — never touched (only a new worktree was created).
- #219 — left open; no comments posted (PROHIBITED).

## PROTECTED

`E:/E-github-repos/Ix` (`feat/ix-agent-skill` @ `b038c46`, 14 dirty) and
`E:/E-github-repos/ix-compass-dist` (@ `396426b`, 3 dirty) — verified
unchanged before and after execution. `Ix-remap` @ `1497596` untouched.

## BLOCKED

| Item | Blocker | Remedy |
|---|---|---|
| Fork-main sync | PAT lacks `workflow` scope (unchanged) | `gh auth refresh -s workflow` or UI Sync fork — user action |

Not a dependency of this phase (branched off `5488741`, recorded).

## AUTHORIZATION REQUIRED

- **PR creation against `ix-infrastructure/Ix`** — PROHIBITED; packet + body
  prepared at `pr-packets/ix-mcp/` with the exact submission command. User
  go-ahead required.
- Upstream issue/comment/maintainer contact — PROHIBITED.
- Fork-main sync — blocked (user token action).

## FINDINGS RESOLVED / INVALIDATED / STILL ACTIVE

- Resolved: none new (F-008/F-009 remain RESOLVED_UPSTREAM from Phase 7).
- Invalidated: none.
- Still active: F-001…F-007 (Compass), F-010/11/12 (IN_PR_393), F-013 (D).
- New findings: **none promoted to the registry** — the two design-reality
  discoveries (no remap on base; no reusable command seams) are recorded as
  decisions D8-2/D8-9 and candidates, not findings (no evidence of a defect).

## AI-SLOP / QUALITY AUDIT

- No AI-slop discovered in the ledger during this phase.
- One plan-vs-reality correction: the Phase 8 prompt's assumptions (remap
  write tool; exported command functions) were disproven against source and
  the design adapted (D8-2, D8-9) — recorded in `planning/ix/ix-mcp.md`.

## ISSUES / PRS / COMMITS RECONCILED

- #219: open, untouched — implemented on the fork (no comment, per rules).
- PR #393: open/mergeable/awaiting review — untouched.
- Upstream: main still `1292375`; no new activity during the phase window.
- Fork: `feat/ix-mcp` added (live); `main` + `feat/ix-remap-hardening` unchanged.

## FORK / UPSTREAM STATE

- Fork: `main` `5488741`, `feat/ix-remap-hardening` `1497596`, **`feat/ix-mcp` `863b3fd`**.
- Upstream: `main` `1292375`.

## TEST RESULTS

See `TEST-RESULTS.json`. Summary: 39 new MCP tests green; full suite
735/2 + parser smoke; tsc/eslint/build clean; real-binary smoke green.
One transient first-run `npm test` failure (core-ingestion `npm ci`) —
identical rerun passed, no code change (recorded).

## SECURITY RESULTS

- No shell in the tool-exec path; whitelisted flags; schema
  `additionalProperties: false`; output caps; per-tool timeouts; kill on
  cancel and on disconnect. No network binding (stdio only).
- Deferred to Phase 9 (adversarial): request-line size cap; child-of-child
  reaping (backend is a shared service); real-client E2E; cross-platform.

## KNOWLEDGE GRAPH / EVIDENCE / CANDIDATE STATE

- Registries unchanged except candidate additions (below).
- New candidate: **CAND-020** — `ix_mcp` write tool (remap) once PR #393
  merges (gate: `main` contains `/__ix/remap`).
- Candidate universe otherwise unchanged: #219 now IMPLEMENTED_ON_FORK (PR
  packet prepared); #385/#349 evidence-only; CAND-006/CAND-019 optional;
  compass BLOCKED; fork-main sync BLOCKED.

## EXTERNAL ACTIONS

1. Fork push `feat/ix-mcp` → `Alot1z/Ix` — SUCCESS, API-verified (`EXTERNAL-ACTION-LOG.json`).
2. PR creation — NOT performed (packet prepared).
3. Upstream mutations — none. Ledger commit+push — pending (this report).

## REMAINING WORK

- Phase 9: hardening (adversarial protocol matrix, resource limits incl.
  line-size cap, real-client E2E with Claude Code/Cursor/OpenCode, WSL/Windows
  matrix, perf methodology) — input below.
- CAND-020: remap write tool after #393 merges.
- PR #393: awaiting upstream review. #219: awaiting user authorization to
  submit the prepared PR.

## NEXT PHASE INPUT

`CLI-HANDOFF/phase-8/PHASE-9-IMPLEMENTATION-INPUT.md` — full details
(built tool set, seams, adversarial matrix, real-client plan, platform
matrix, perf methodology, open items).

## FINAL INTEGRITY CHECK

□ Phase 7 report consumed ✅ □ live baseline re-verified ✅ □ design doc with
pinned spec references ✅ □ adapter seam discovered (spawn, F-010) ✅ □ all 8
tools functional over real stdio ✅ □ dual-era session verified ✅ □ arg
validation on every tool ✅ □ registered + regression guard (mirrors
`89ca55e`) ✅ □ full suite green (735/2 + smoke) ✅ □ docs updated ✅ □
multi-agent review recorded (2 disputes, 3 confirmed defects fixed) ✅ □
fork branch pushed + API-verified ✅ □ PR body complete, NOT submitted ✅ □
JSON artifacts parse ✅ □ secret scan clean ✅ □ protected work untouched
(before/after) ✅ □ zero upstream mutations ✅ □ `PHASE-9-IMPLEMENTATION-INPUT.md`
produced ✅

**Phase 8 ends here.** The single user-gated item: authorizing the prepared
PR submission (and/or unblocking fork-main sync).
