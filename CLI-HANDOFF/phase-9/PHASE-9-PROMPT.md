# PHASE 9 — `ix mcp` HARDENING, SECURITY & REAL-CLIENT VERIFICATION

## STATUS
READY TO EXECUTE — complete independent phase (supersedes the earlier short draft)

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

- `CLI-HANDOFF/phase-8/PHASE-9-IMPLEMENTATION-INPUT.md` (required — do not
  start if absent; Phase 8 must have completed)
- `planning/ix/ix-mcp.md` (design + decisions — the attack surface)
- `pr-packets/ix-mcp/README.md` (PR body to finalize with evidence)
- Live fork branch `feat/ix-mcp` (the code under test)
- `ix-cli/test/view-server.test.ts` (F-010 guard-matrix precedent)
- `planning/findings/registry.json` (F-011 WSL, F-012, F-013 contexts)
- `github/issues/383/README.md` (native-Windows/PATHEXT lesson from the plugin)
- `CLI-HANDOFF/PR-MATRIX.md`, `CLI-HANDOFF/STALE-CLAIMS.md`

---

# 1. CURRENT VERIFIED BASELINE (expect per Phase 8 report)

| Item | State |
|---|---|
| `feat/ix-mcp` | Built + pushed to `Alot1z/Ix` (per Phase 8 report — re-verify HEAD) |
| Tool set | read: map/status, explain, trace, impact, search, rank · write: remap |
| Transport | stdio JSON-RPC 2.0 (framing per official spec, recorded in design doc) |
| Registration | `oss.ts`, OSS command, no Pro-stub shadow (Phase 8 guard) |
| Suite | 730 + Phase 8 additions (re-verify actual counts) |
| Fork main | `5488741` (or newer if the user synced; verify) |
| Protected | Ix `b038c46/14`; ix-compass-dist `396426b/3`; remap `1497596` |

---

# 2. UNIVERSAL RULES (mandatory)

Same block as Phase 8 — source-driven, verification-before-completion,
doubt-driven, no fabrication, privacy allowlist, tool safety. **Full skill
inventory applies (all 85, / prefixes — see Phase 8 §2 for the complete list;
copy it into your session context).**

**Phase 9 emphasis:** `/security-and-hardening` `/debug-thinking`
`/browser-testing-with-devtools` `/playwright-cli` `/performance-optimization`
`/verification-before-completion` `/doubt-driven-development`
`/source-driven-development` `/code-review-and-quality` `/stop-slop`

Re-invoke thinking skills START / BETWEEN / AFTER every milestone.

---

# 3. PHASE OBJECTIVES

1. **Adversarial protocol testing** — malformed input, protocol violations,
   resource exhaustion, concurrency, lifecycle abuse.
2. **Security review** — argument injection, information disclosure, privilege
   discipline, no-shell guarantee, dependency surface.
3. **Real-client E2E** — connect actual MCP clients (Claude Code, Cursor,
   OpenCode, generic MCP inspector) to the running server and exercise tools.
4. **Cross-platform matrix** — WSL (F-011 lesson), native Windows (PATHEXT /
   `ix.cmd` lessons from #383/#386), macOS — at minimum static + logic review
   per platform, plus runtime where the platform is available.
5. **Performance** — large-workspace latency, payload truncation, memory
   bounds; record numbers with methodology (no fabricated benchmarks).
6. **PR packet finalization** — fold all evidence into `pr-packets/ix-mcp/
   README.md`; flag any new findings; update the ledger.
7. **Close-out** — `PHASE-9-REPORT.md` + `PHASE-10-IMPLEMENTATION-INPUT.md`.

---

# 4. AUTHORIZATION MODEL

| Action | State |
|---|---|
| Local adversarial testing / real-client runs | AUTHORIZED |
| Commit + push fixes to `Alot1z/Ix:feat/ix-mcp` | **AUTHORIZED** |
| Install MCP clients locally (npm/pip, user-level) | AUTHORIZED with user awareness (local tooling only) |
| PR to upstream / comments / maintainer contact | **PROHIBITED** |
| Touch protected worktrees | PROHIBITED |

---

# 5. PROTECTED WORK

Identical to Phase 8: Ix `b038c46/14`, ix-compass-dist `396426b/3`, remap
`1497596`, upstream read-only.

---

# 6. IMPLEMENTATION PLAN (ordered)

## 6.1 Adversarial protocol matrix

1. **Malformed framing**: truncated line, huge line (>64 KiB?), invalid JSON,
   JSON not an object, unknown JSON-RPC version, bad `id` types, missing `method`.
2. **Method abuse**: `tools/call` with unknown tool, wrong arg types, extra
   unknown args, args that are arrays/objects where strings expected, missing
   `params`, `initialize` twice with conflicting versions, `ping` during a
   long `tools/call`, `notifications/initialized` before `initialize`.
3. **Resource exhaustion**: oversized tool args, deep recursion in schema
   validation, many rapid concurrent calls, call that spawns `remap` twice
   concurrently (single-flight?), messages arriving during shutdown.
4. **Lifecycle**: EOF mid-call (child cleanup?), SIGINT/SIGTERM exit codes,
   stdin close then delayed stdout flush, restart without drain.
5. **Determinism**: same input → same output across runs (record hashes).

## 6.2 Security review

1. **No-shell guarantee**: grep the diff for `exec(`/`spawn(` with shell:
   true; assert tool args can never reach a shell (the F-010 URL-API lesson —
   prefer structured invocation over string building).
2. **Disclosure**: run each tool against a workspace containing a fake secret
   and a private path; assert responses never echo them.
3. **Privilege**: `ix mcp` must not read credentials beyond what the underlying
   commands do; document the trust model ("the client has the same power as
   the user at the terminal").
4. **Dependency surface**: zero new runtime deps preferred (record actual);
   if any, list them with justification.
5. **Reuse the F-010 checklist**: bind-nothing, no Origin/Host surface because
   there is no network; state this explicitly in the packet.

## 6.3 Real-client E2E

1. **MCP Inspector / generic client** — full session (already covered in 6.1,
   re-run with the built CLI).
2. **Claude Code** — `.mcp.json` (or `claude mcp add --transport stdio ...`);
   configure `ix mcp`; drive a real task: explain a symbol, trace a flow,
   run remap; record transcripts (sanitized).
3. **Cursor / OpenCode** — config-file E2E where runnable locally; otherwise
   document the exact config and mark UNVERIFIED (do not claim).
4. Record: client, version, config snippet (public-safe), tools exercised,
   result, evidence.

## 6.4 Cross-platform

1. **WSL** — the F-011 lesson (WSL is Linux; `curl|sh` path). Verify the
   server starts under WSL/bash; stdio through WSL interop is client-side —
   document.
2. **Native Windows** — PATHEXT lesson (#383/plugin#19): if `ix` is resolved
   as a subprocess anywhere in the mcp path, ensure `ix.CMD` resolution;
   verify `ix mcp` runs under cmd/PowerShell.
3. **macOS** — logic review + any available runtime.
4. Static: Node version floor (`>=22` per bootstrap), no platform-specific
   paths in the code.

## 6.5 Performance (methodology mandatory)

1. Workspace fixture sizes: small (<1k files), medium (10k), large (100k) —
   synthesize deterministically (do not map the protected worktrees).
2. Measure: `initialize`, `tools/list`, `tools/call` per tool (p50/p95),
   memory RSS delta, payload sizes, truncation behavior.
3. Record: fixture size, tool, timing method, numbers, machine. Never report
   an unmeasured number.

## 6.6 Packet + ledger finalization

1. Fold every finding + evidence into `pr-packets/ix-mcp/README.md`
   (adversarial results, security posture, client E2E, platform matrix, perf
   numbers with methodology).
2. Any NEW bug found → classify (A/B/C/D), add to
   `planning/findings/registry.json` with provenance (e.g., F-014 if
   mcp-specific; follow the numbering convention).
3. Update manifest, `CLI-HANDOFF/STALE-CLAIMS.md` if needed, commit to
   `Alot1z/Ix-findings`.

---

# 7. VALIDATION PLAN

| Area | Checks |
|---|---|
| Protocol | full adversarial matrix green; every case has an expected behavior (error or defined handling), none crash or hang |
| Security | no-shell grep clean; disclosure test clean; dep surface recorded |
| Clients | each claimed client run recorded with version + result; unverified = UNVERIFIED |
| Platforms | WSL/Windows/macOS items recorded with evidence or UNVERIFIED |
| Perf | numbers + methodology + fixture descriptions |
| Regression | full suite + tsc + eslint after any fixes |
| Fork | `feat/ix-mcp` HEAD matches latest commit; API-verified |

# 8. SECURITY / PRIVACY

- Real-client transcripts sanitized (no paths/secrets/personal data).
- No new credentials; config snippets in the packet use placeholders.
- Secret scan on every new artifact.

# 9. DELIVERABLES

- `CLI-HANDOFF/phase-9/PHASE-9-REPORT.md`
- `CLI-HANDOFF/phase-9/PHASE-10-IMPLEMENTATION-INPUT.md`
- Updated `pr-packets/ix-mcp/README.md` (final evidence)
- Any fixes committed to `Alot1z/Ix:feat/ix-mcp`
- Registry updates (new findings with provenance, if any)

# 10. COMPLETION CRITERIA

□ adversarial matrix executed with recorded expected/actual □ no-shell
guarantee verified by grep + test □ disclosure test clean □ at least one real
client E2E recorded (or all marked UNVERIFIED with reason) □ platform matrix
recorded □ perf methodology documented □ PR packet final □ registry consistent
□ ledger pushed □ protected work untouched □ zero upstream mutations

# 11. FAILURE / RECOVERY

- **Test hangs** → kill child, tighten timeout, record; never ship a hang.
- **Client not installable** → mark UNVERIFIED with the exact blocker; never
  claim success.
- **New bug found** → fix on the fork with a regression test; do not disable
  the test.
- **Fork push guard** → record, do not force.

# 12. PHASE 10 HANDOFF

`PHASE-10-IMPLEMENTATION-INPUT.md` must specify: the compass thread state
(F-key spec at `pr-packets/compass-f-key/README.md`, delayed-data packet,
F-001…F-007/F-013), the fork-creation gate (`Alot1z/system-compass` 404,
source access D-014), and the exact readiness checklist for a source-gated
implementation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END PHASE 9
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
