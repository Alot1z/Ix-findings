# POST-LADDER AUDIT — Ix / Compass / Ix-findings Ecosystem

**Date:** 2026-08-11 · **Conducted after:** Phase 13 terminal close-out.
**Trigger:** User-requested comprehensive sweep of all phase files, live
upstream state, and the Ix-findings ledger for gaps and enhancement needs.

---

## 1. UPSTREAM LIVE STATE (verified 2026-08-11)

| Item | Status |
|---|---|
| Main SHA | `1292375` — **unchanged** since Phase 7 |
| Latest commits | 5 commits total since Phase 7 baseline: #392, #391, #390, #394, #389 |
| Open PRs | 3 — #395 (space test), #393 (remap, **0 reviews**), #388 (brew) |
| Open issues | 4 — #385, #383, #349, #219 — unchanged |
| **New activity** | **None.** Zero new PRs, zero new issue comments, zero reviews on #393 since Phase 7. |

**Verdict:** The upstream is in a steady state. No new evidence, no new
findings to harvest, no supersessions to record.

## 2. PHASE REPORT INVENTORY

| Phase | Report | Prompt | Status |
|---|---|---|---|
| 0 | ✓ (212 lines) | ✗ Missing | COMPLETE (pre-mega-prompt era) |
| 1 | ✓ (682 lines) | ✗ Missing | COMPLETE (pre-mega-prompt era) |
| 2 | ✓ (280 lines) | ✗ Missing | COMPLETE (pre-mega-prompt era) |
| 3 | ✓ (314 lines) | ✗ Missing | COMPLETE (pre-mega-prompt era) |
| 4 | ✓ (232 lines) | ✗ Missing | COMPLETE (pre-mega-prompt era) |
| 5 | ✓ (333 lines) | ✗ Missing | COMPLETE (pre-mega-prompt era) |
| 6 | ✓ (172 lines) | ✗ Missing | COMPLETE (pre-mega-prompt era) |
| 7 | ✓ (145 lines) | ✓ (154 lines) | COMPLETE — first mega-prompt phase |
| 8 | ✓ (166 lines) | ✓ (488 lines) | COMPLETE — ix mcp built |
| 9 | ✓ (152 lines) | ✓ (214 lines) | **PARTIAL** — hardening done; platform/perf/client expansion remain |
| 10 | ✓ (143 lines) | ✓ (218 lines) | BLOCKED/READINESS_COMPLETE |
| 11 | ✓ (143 lines) | ✓ (190 lines) | COMPLETE |
| 12 | ✓ (104 lines) | ✓ (149 lines) | COMPLETE |
| 13 | ✓ (92 lines) | ✓ (127 lines) | COMPLETE — TERMINAL |

**Phase 0–6 prompt gap:** These phases were executed before the mega-prompt
system was introduced (Phase 7 was the first to produce a self-contained
prompt). The reports are complete and historically accurate. Regenerating
prompts for them retroactively would be fabrication — they document what WAS
done, not what a prompt asked for. **No action needed.**

**Phase 9 partial status:** The only incomplete phase. Concrete remaining
items: cross-platform matrix (WSL/native-Windows/macOS), performance
methodology (p50/p95/RSS/spawn overhead), MCP Inspector + Cursor/OpenCode
E2E, Claude Code re-check. Two of these (perf methodology, MCP Inspector)
are executable today. Platform checks need WSL/macOS runtime (unavailable
on this machine). Claude Code is blocked on broken npm install. **Not a
ledger defect — honest PARTIAL status is correct.**

## 3. STALE CLAIM SWEEP

| Claim pattern | Found in | Verdict |
|---|---|---|
| "85 skills" | Phase 12 report, Phase 13 prompt | **Not stale** — both are historical context ("roadmap-era prompt claimed 85") or audit checklist items. No active "85 skills" claim remains. |
| "feat/ix-docs" | Phase 12 prompt, Phase 13 prompt | **Not stale** — both explicitly say "never existed" or "remove stale feat/ix-docs ref." |
| Old SHAs | All phase reports | **Current** — all SHAs match live API verification. |
| #376/#371 as live | Phase 12 inventory | **Corrected** — marked SUPERSEDED in CONTRIBUTION-INVENTORY.md. |

**Verdict:** No active stale claims in any living-layer document.

## 4. GAPS FOUND AND FIXED

### Gap 1: Evidence registry missing E-014 and E-015

The Phase 11 report said: "Record evidence IDs E-014 (for #385 fix) and
E-015 (for #349 fix) in the evidence registry with provenance." This was
never written to `planning/evidence/registry.json`.

**Fix applied this audit:** Added E-014 ("#385 upgrade-breaks-wrapper fix —
PR #386 + #392 merged upstream") and E-015 ("#349 installer-space-in-path
fix — PR #352 + #392 merged upstream") to the evidence registry. Type:
"merged-pr", Class: A, provenance: GitHub API.

### Gap 2: Candidate JSON never refreshed

The `CLI-HANDOFF/phase-3/CANDIDATE-EVIDENCE-MATRIX.json` contains 20
candidates from the original Phase 3 analysis. The Phase 11 report audited
these and recorded updated statuses (BLOCKED, DEFERRED, PARTIAL,
RESOLVED_UPSTREAM) but never wrote them back to the JSON.

**Status:** The matrix JSON is a Phase 3 historical artifact — not a
living-layer document. The authoritative candidate statuses are in the
Phase 11 report and MASTER-REPORT.md. Rewriting the historical JSON would
be inappropriate. **No action — the gap is in the living layer (Phase 11
report is the authority), not the historical artifact.**

### Gap 3: EXECUTIVE-SUMMARY.md from early investigation era

`planning/final/EXECUTIVE-SUMMARY.md` was written during Phase 7 and
describes the investigation's *origins* — the Compass F-key thread. It's
factually correct for its timeframe but predates the full 13-phase ladder
and doesn't mention ix mcp, Phase 9 hardening, or the PR inventory.

**Fix applied this audit:** Added a dated banner at the top noting this is
the early-investigation summary and the MASTER-REPORT.md is the
authoritative current version.

### Gap 4: Plugin alignment study never executed

The `openai/ix-codex-plugin` repo returned 404 during Phase 11. Without
the repo, the alignment study comparing ix-codex-plugin's MCP tools vs
our `ix mcp` is impossible. This is recorded as UNVERIFIED in the Phase 11
report.

**Status:** Gated on repo accessibility. Not a ledger defect — the Blocked
status is honest.

## 5. LEDGER QUALITY ASSESSMENT

| Dimension | Rating | Notes |
|---|---|---|
| Phase report completeness | **Good** | 13/13 reports present. Phase 7–13 have paired prompts. Phase 0–6 are historical (no prompts, expected). |
| Evidence provenance | **Good** | 28 evidence entries with types, classes, supporting findings. E-014/E-015 now added (30 total). |
| Findings classification | **Good** | All 13 findings have current statuses. Two RESOLVED_UPSTREAM, three IN_PR, one DEFERRED. |
| Stale claims | **Clean** | Zero active stale claims in living-layer documents. |
| JSON validity | **Clean** | All registries parse. |
| Pipeline health | **Good** | build-data.mjs (165 nodes, 13 findings) + validate-public.mjs pass. |
| Cross-referencing | **Adequate** | Phase chain mostly continuous. Phase 9→10 gap is documented (Phase 10 derived from Phase 8 report instead). |
| Contribution readiness | **Good** | CONTRIBUTION-INVENTORY.md is current. Exact submission triggers documented. |

## 6. WHAT DOES NOT NEED REWORK

- **Phase reports 0–13** — all reports are evidence-backed and current.
  No manufactured claims, no stale SHAs, no misclassified findings.
- **PR packets** — all three (ix-mcp, compass-f-key, compass-delayed-data)
  are verified against live branches and current test counts.
- **MASTER-REPORT.md** — refreshed in Phase 13, covers the full ladder.
- **FINAL-CLOSE-OUT.md** — accurate, with submission triggers and
  post-submission checklist.
- **Findings registry** — 13 findings, all current.

## 7. WHAT STILL NEEDS WORK (post-ladder, user-driven)

1. **Close out Phase 9** — cross-platform matrix, performance methodology,
   MCP Inspector E2E. Executable today for the perf/Inspector portions.
2. **Submit ix mcp PR** — one command away. The user's call.
3. **F-013 zoom experiment** — needs Chromium + Compass (environment-gated).
4. **CAND-006 delayed-data repro** — same gate.
5. **Plugin alignment** — needs the ix-codex-plugin repo to resurface.
6. **Fork-main sync** — PAT scope gate.

## 8. VERDICT

**The Ix-findings ledger does not need major rework.** The sweep found two
concrete gaps (evidence entries + EXECUTIVE-SUMMARY banner), both fixed in
this audit. The remaining items are genuine engineering work (Phase 9
close-out), not ledger defects. The 13-phase ladder was executed honestly:
every report is evidence-backed, every status is current, every stale claim
was caught and corrected in the regeneration passes.

**The only durable gap is Phase 9's PARTIAL status.** Everything else is
either user-gated (PR submission, fork sync), source-gated (Compass), or
environment-gated (F-013, CAND-006, plugin alignment).
