# Phase 15 — Implementation Input

**Generated from:** Phase 14 Independent Forensic Audit
**Recommended action:** Submit the ix mcp PR to upstream
**Authorization required:** YES — PR creation to `ix-infrastructure/Ix`

---

## LOCAL/AUTHORIZED WORK

### 1. Fix evidence registry duplicate IDs (CAND-EVIDENCE-DEDUP)

- **Problem:** E-014 and E-015 appear twice in `planning/evidence/registry.json` with different meanings
- **Fix:** Renumber the second set (added in Phase 11) to E-029/E-030
- **Affected:** `Alot1z/Ix-findings` — `planning/evidence/registry.json`
- **Scope:** 5 minutes, zero risk

### 2. Close out Phase 9 remaining items (CAND-PHASE9-CLOSEOUT)

- **Cross-platform matrix:** MCP server tested on WSL and native Windows (PowerShell + Git Bash)
- **Performance methodology:** p50/p95 timing for tool calls, RSS measurement, spawn overhead
- **MCP Inspector E2E:** Register ix mcp in MCP Inspector, drive tools/call against live backend
- **Affected:** Documentation/validation only — no code changes
- **Scope:** Testing and documentation, 1-2 hours

---

## EXTERNAL/AUTHORIZATION-GATED WORK

### 3. Submit the ix mcp PR (CAND-MCP-SUBMIT)

**Trigger command:**
```bash
cd /e/E-github-repos/Ix-mcp
gh pr create \
  --repo ix-infrastructure/Ix \
  --head Alot1z:feat/ix-mcp \
  --base main \
  --title "feat(mcp): add ix mcp subcommand exposing the code graph as MCP tools" \
  --body-file pr-packets/ix-mcp/README.md
```

- **Branch:** `Alot1z/Ix:feat/ix-mcp @ 01a2f14`
- **Diff:** 21 files, +2472 lines, 8 read-only tools, 53 tests, dual-era MCP
- **Targets:** Issue #219 (open since May 2026)
- **Risk:** Low — read-only tools, no shell exec, validated arguments, byte-bounded reader, tree-kill
- **Status:** PR-ready. Code reviewed (Phase 14 independent audit: GOOD). Real-client E2E recorded (Codex 0.143.0).
- **Authorization:** YOURS — do not execute without explicit go-ahead

---

## BLOCKED WORK

- Compass F-key (CAND-001..CAND-005): No system-compass source access
- Compass delayed-data (CAND-006): No source access + needs Chromium
- Compass rollup timing (CAND-007): No source access
- Remap write tool (CAND-020): Gated on PR #393 merge
- Fork-main sync: Requires user authorization + force-push

---

## HUMAN-DECISION WORK

- Submit MCP PR (requires go-ahead)
- Request system-compass access (D-014: ask KageBinary on #368)
