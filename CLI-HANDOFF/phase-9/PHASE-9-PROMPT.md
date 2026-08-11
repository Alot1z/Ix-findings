# PHASE 9 — `ix mcp` HARDENING, SECURITY & REAL-CLIENT VERIFICATION

## STATUS

**IN PROGRESS — PARTIALLY EXECUTED.** Regenerated from the verified
`CLI-HANDOFF/phase-8/PHASE-8-REPORT.md` (STATUS: COMPLETE) plus the
hardening + real-client work already landed this run (2026-08-11). This
prompt supersedes the roadmap-era draft: its baseline is now the real fork
state, not the Phase 8 prompt's expectations.

## ROLE

You are executing **Phase 9** of the ladder. Phase 8 built `ix mcp` on the
fork. This phase **attacks it**: adversarial protocol testing, security
review, cross-platform verification, real-client end-to-end runs, performance
measurement, and finalization of the PR packet. Nothing is submitted upstream.

Standing constraint (user, 2026-08-11): **NO PRs and NO commits to any
`ix-infrastructure/*` repository. External writes ONLY to `Alot1z/Ix`,
`Alot1z/system-compass` (nonexistent — skip), `Alot1z/Ix-findings`.**

---

# 0. AUTHORITATIVE INPUTS

- `CLI-HANDOFF/phase-8/PHASE-8-REPORT.md` (the phase this one derives from — read it first)
- `CLI-HANDOFF/phase-8/PHASE-9-IMPLEMENTATION-INPUT.md` (Phase 8's handoff — its gap list drove this phase)
- `planning/ix/ix-mcp.md` (design + decisions D8-2/D8-9)
- `pr-packets/ix-mcp/README.md` + `PR-BODY.md` (packet to finalize with evidence)
- Live fork branch `feat/ix-mcp` (the code under test)
- `ix-cli/test/view-server.test.ts` (F-010 guard-matrix precedent)
- `planning/findings/registry.json` (F-011 WSL, F-012, F-013 contexts)
- `github/issues/383/README.md` (native-Windows/PATHEXT lesson)
- `CLI-HANDOFF/PR-MATRIX.md`, `CLI-HANDOFF/STALE-CLAIMS.md`

---

# 1. CURRENT VERIFIED BASELINE (re-verified 2026-08-11, not assumed)

| Item | State |
|---|---|
| `feat/ix-mcp` | `Alot1z/Ix` @ **`66fa5f5`** — 5 commits: `36c7c7e` feat · `73860aa` docs · `863b3fd` review-fix · `0d99ae0` hardening · `66fa5f5` hardening docs. API-verified. |
| Tool set | read ×8: `ix_map/status/explain/trace/impact/search/rank/read`, all reusing `--format llm`. **No write tool** (remap does not exist on this base; deferred to CAND-020 until PR #393 merges). |
| Transport | stdio newline-delimited JSON-RPC 2.0, dual-era (2026-07-28 stateless + 2025-06-18 handshake). Pinned spec refs in `src/cli/mcp/protocol.ts`. |
| **Already hardened this phase** | 1 MiB line-size cap (byte-bounded reader, `-32700` + resync) · JSON-RPC batch rejection (`-32600`) · `jsonrpc`/`id` validation · whole-tree kill on cancel/timeout/overflow/EOF/SIGTERM (POSIX group signal, Windows `taskkill /T`) · `disposeAll()` on shutdown · 14 new tests (protocol-abuse matrix + orphan reaping) |
| Suite | **749 passed / 2 skipped** + parser smoke; tsc clean; eslint 0 errors; build clean |
| Real-client E2E | **DONE (codex 0.143.0)** — `ix_status` + `ix_map` called over real stdio against the live backend (rev 47 workspace), both `completed`; output cross-checked against direct CLI (29 regions, "Assets / Pages" ✓). See `REAL-CLIENT-RUN.json`. |
| Upstream | main `1292375` (unchanged) |
| PR #393 | open / mergeable / **0 reviews**, review requested from `josephismikhail` |
| Protected | Ix `b038c46/14`; ix-compass-dist `396426b/3`; Ix-remap `1497596` (all re-verified) |

---

# 2. UNIVERSAL RULES (mandatory)

Same block as Phase 8 — source-driven, verification-before-completion,
doubt-driven, no fabrication, privacy allowlist, tool safety. Skill
inventory: **88 skills** (0 spec issues), authoritative registry at
`~/.agents/skills/.parasite-skill/registry.json` (scanned from
`~/.agents/skills` + `E:/E-github-repos/skill-router-soucecode`).

**Phase 9 emphasis:** `/security-and-hardening` `/debug-thinking`
`/browser-testing-with-devtools` `/playwright-cli` `/performance-optimization`
`/verification-before-completion` `/doubt-driven-development`
`/source-driven-development` `/code-review-and-quality` `/stop-slop`

Re-invoke thinking skills START / BETWEEN / AFTER every milestone, and run
the skill-router scan/route before and after every tool batch.

---

# 3. PHASE OBJECTIVES (remaining scope)

Already executed this run: adversarial protocol matrix (12 cases), orphan
reaping, disposeAll, line-size cap, batch rejection, JSON-RPC validation,
codex E2E. **Remaining:**

1. **Cross-platform matrix** — WSL (F-011 lesson), native Windows (PATHEXT /
   `ix.cmd` lessons from #383/#386), macOS. Static + logic review per
   platform, runtime where available. Node floor `>=22`.
2. **Performance (methodology mandatory)** — deterministic fixtures: small
   (<1k files), medium (10k), large (100k); measure `initialize`,
   `tools/list`, `tools/call` per tool (p50/p95), memory RSS delta, payload
   sizes, truncation behavior; record machine + method; never report an
   unmeasured number. Include the per-call `node <cli-main>` spawn cost
   (F-010 spawn overhead) and document whether a long-lived in-process
   executor is warranted.
3. **Real-client expansion** — MCP Inspector over the built CLI; Cursor /
   OpenCode config-file E2E where runnable, else document exact config and
   mark UNVERIFIED. **Claude Code: broken on this machine** (npm shim points
   at missing `@anthropic-ai/claude-code` package) — re-check before
   claiming; if still broken record the blocker, do not repair without user
   consent. Note codex needs
   `--dangerously-bypass-approvals-and-sandbox` for MCP tools in exec mode
   (open bug openai/codex#29857) — record, do not work around further.
4. **CAND-020 readiness** — `ix_remap` write tool gate: only when upstream
   main contains `/__ix/remap` (PR #393 merged). Re-verify the tool list
   against upstream command surface at phase start.
5. **PR packet finalization** — fold every finding + evidence into
   `pr-packets/ix-mcp/README.md`; flag new findings; update the ledger.
6. **Close-out** — complete `PHASE-9-REPORT.md` (STATUS: COMPLETE only when
   the above are done) + `PHASE-10-IMPLEMENTATION-INPUT.md`.

---

# 4. AUTHORIZATION MODEL

| Action | State |
|---|---|
| Local adversarial testing / real-client runs | AUTHORIZED |
| Commit + push fixes to `Alot1z/Ix:feat/ix-mcp` | **AUTHORIZED** (no force-push) |
| Install MCP clients locally (npm/pip, user-level) | AUTHORIZED with user awareness |
| PR to upstream / comments / maintainer contact | **PROHIBITED** |
| Repair the user's broken claude npm install | PROHIBITED without explicit consent |
| Touch protected worktrees | PROHIBITED |

# 5. PROTECTED WORK

Identical to Phase 8: Ix `b038c46/14`, ix-compass-dist `396426b/3`,
Ix-remap `1497596`, upstream read-only. Verify before/after every mutation.

# 6. REMAINING IMPLEMENTATION PLAN (ordered)

## 6.1 Cross-platform matrix

1. **WSL** — the F-011 lesson (WSL is Linux; `curl|sh` path). Verify the
   server starts under WSL/bash; stdio through WSL interop is client-side —
   document. Runtime only if WSL is available (`wsl -l`); else static review
   (no platform-specific paths in mcp code, `process.execPath` spawn) and
   mark UNVERIFIED.
2. **Native Windows** — PATHEXT lesson: if `ix` is ever resolved as a
   subprocess in the mcp path, ensure `ix.CMD` resolution; verify `ix mcp`
   runs under cmd/PowerShell (this machine already runs it under Git Bash;
   confirm cmd).
3. **macOS** — logic review + any available runtime. Mark UNVERIFIED if no
   runtime.

## 6.2 Performance (methodology mandatory)

1. Fixtures: synthesize deterministically in a temp dir (small/medium/large),
   do not map protected worktrees.
2. Measure with a real client or the built binary: `initialize`,
   `tools/list`, `tools/call` per tool — p50/p95 over ≥10 runs, RSS delta,
   payload sizes, truncation.
3. Report: fixture size, tool, timing method, numbers, machine. A number
   without a method is not evidence.

## 6.3 Real-client expansion

1. MCP Inspector (`npx @modelcontextprotocol/inspector`) — full session with
   the built CLI; record tool list + one call.
2. Cursor / OpenCode — config-file E2E where runnable; otherwise exact
   config snippet + UNVERIFIED.
3. Re-check Claude Code install; record result honestly.

## 6.4 Packet + ledger finalization

1. Fold evidence into `pr-packets/ix-mcp/README.md` (adversarial results,
   security posture, client E2E, platform matrix, perf numbers).
2. New bugs → classify (A/B/C/D), add to
   `planning/findings/registry.json` with provenance (F-014+ if mcp-specific).
3. Update manifest / STALE-CLAIMS if needed; commit to `Alot1z/Ix-findings`.

# 7. VALIDATION PLAN

| Area | Checks |
|---|---|
| Protocol | matrix green (12 done) — every case has defined behavior, none crash/hang |
| Security | no-shell grep clean; disclosure test; dep surface recorded (zero new deps) |
| Clients | each claimed client recorded with version + result; unverified = UNVERIFIED |
| Platforms | WSL/Windows/macOS recorded with evidence or UNVERIFIED |
| Perf | numbers + methodology + fixture descriptions |
| Regression | full suite + tsc + eslint after any fixes |
| Fork | `feat/ix-mcp` HEAD matches latest commit; API-verified |

# 8. SECURITY / PRIVACY

Real-client transcripts sanitized (no paths/secrets/personal data). No new
credentials. Config snippets use placeholders. Secret scan on new artifacts.

# 9. DELIVERABLES

- `CLI-HANDOFF/phase-9/PHASE-9-REPORT.md` (COMPLETE when 6.1–6.4 done)
- `CLI-HANDOFF/phase-9/PHASE-10-IMPLEMENTATION-INPUT.md`
- Updated `pr-packets/ix-mcp/README.md`
- Any fixes committed to `Alot1z/Ix:feat/ix-mcp`
- Registry updates (new findings with provenance, if any)

# 10. COMPLETION CRITERIA

□ adversarial matrix executed with recorded expected/actual (12 done) □
no-shell verified by grep + test □ disclosure test clean □ ≥1 real client
E2E recorded (codex done; others honest) □ platform matrix recorded □ perf
methodology documented with numbers □ PR packet final □ registry consistent
□ ledger pushed □ protected work untouched □ zero upstream mutations

# 11. FAILURE / RECOVERY

- Test hangs → kill child, tighten timeout, record; never ship a hang.
- Client not runnable → mark UNVERIFIED with exact blocker; never claim.
- New bug → fix on the fork with a regression test; never disable a test.
- Fork push guard → record, do not force.

# 12. PHASE 10 HANDOFF

`PHASE-10-IMPLEMENTATION-INPUT.md` must specify: the compass thread state
(F-key spec at `pr-packets/compass-f-key/README.md`, F-001…F-007/F-013), the
fork-creation gate (`Alot1z/system-compass` 404, source access D-014), and
the exact readiness checklist for a source-gated implementation — generated
only after this phase's report is COMPLETE.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END PHASE 9
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
