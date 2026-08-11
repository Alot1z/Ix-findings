# Phase 14 — Independent Forensic Audit Report

**Status:** COMPLETE
**Date:** 2026-08-11
**Type:** READ-ONLY AUDIT — No code changes, no GitHub mutations

---

## ACTUALLY VERIFIED

### Live GitHub State (verified at start and end)

| Fact | Value |
|---|---|
| Upstream HEAD | `1292375548fb` — unchanged |
| Open PRs | 3 (#395, #393, #388) — all 0 reviews |
| Open issues | 4 (#385, #383, #349, #219) |
| Fork `feat/ix-mcp` | `01a2f14` — 21 files, +2472 lines |
| Fork `feat/ix-remap-hardening` | `1497596` — 4 files in PR scope (+251/-10) |
| Fork main | `5488741` — 7 commits behind upstream |
| Protected worktrees | Ix `b038c46`, ix-compass-dist `396426b`, Ix-remap `1497596` — all untouched |

### Upstream Fixes Merged (since Phase 7 baseline)

13 PRs merged upstream in 2 days (2026-08-10/11): #352, #368, #372, #375, #378, #382, #384, #386, #387, #389, #390, #391, #392, #394. This is an **actively maintained project** with a 24-hour merge cycle.

### Findings Reclassified

| Finding | Old Status | New Status | Verdict |
|---|---|---|---|
| F-001 | REPRODUCED | VALIDATED | Source-gated Compass finding |
| F-002 | REPRODUCED | VALIDATED | Source-gated |
| F-003 | VERIFIED | VALIDATED | Source-gated |
| F-004 | VERIFIED | VALIDATED | Source-gated |
| F-005 | CONFIRMED | VALIDATED | Source-gated |
| F-006 | REPRODUCED_LIVE | VALIDATED_SEPARATE_CONCERN | Source-gated, P1 severity |
| F-007 | OBSERVED | OBSERVED_MEDIUM_CONFIDENCE | P2, T3 evidence only |
| F-008 | RESOLVED_UPSTREAM | FIXED_UPSTREAM | PR #391 merged — fully resolved |
| F-009 | RESOLVED_UPSTREAM | FIXED_UPSTREAM | PR #390 merged — fully resolved |
| F-010 | PR_OPEN | PR_OPEN_NEEDS_REVIEW | 0 reviews, mergeable_state: blocked |
| F-011 | IN_PR_393 | IN_PR_393 | Gated on #393 |
| F-012 | IN_PR_393 | IN_PR_393 | Gated on #393 |
| F-013 | OPEN | INCONCLUSIVE | T5 evidence — speculative, drop from active |

### MCP Implementation

**Verdict: GOOD — Production quality, zero security findings.**

- Protocol: Dual-era MCP (2026-07-28 + 2025-06-18 handshake). JSON-RPC 2.0 compliant. Correct error codes.
- Security: No shell exec. Validated arguments. Batch rejected. Byte-bounded reader (1 MiB cap). Tree-kill on cancel/timeout/shutdown (PID-file verified).
- Tests: 53 MCP tests (749/2 full suite). 15-case protocol-abuse matrix. Real-process stdio integration. Grandchild reaping verified.
- PR readiness: PR_READY_AFTER_REVIEW. The Codebuff footer was removed from commit messages.

One observation: `mcp-server.test.ts` at 310 lines could be split for maintainability (severity: INFO).

### Remap PR #393

**Verdict: Sound, awaiting maintainer review.**

- 4 files: view.ts (+160 endpoint + loopback guard), bootstrap.sh (WSL fix + dead node_ok), view-server.test.ts (+178 test lines), docs
- 0 reviews, 0 review comments. `mergeable_state: blocked` — likely CI gate requiring manual approval for fork PRs.
- No action possible. The PR is coherent and technically correct. Sole blocker: maintainer attention.

### Compass / Knowledge Explorer

- Dist v0.3.0 SHA256 verified: `7ed6cc82fe58b3adb1c0e0bb411485d1a36fd862a4d33a1d64eae3141a3936f1` (matches `.tar.gz.sha256`)
- No Pages workflow in ix-compass-dist
- F-key spec (8/8 drop-in items) and delayed-data investigation (7/7 items) both complete
- Source-gated — `Alot1z/system-compass` and `ix-infrastructure/system-compass` both 404

---

## ACTUALLY DISCOVERED

### Evidence Registry Duplicate IDs

E-014 and E-015 appear **twice** in `planning/evidence/registry.json` with different meanings:
- First set: E-014 = "remap diff c021b52", E-015 = "guard-matrix tests"
- Second set: E-014 = "#385 upgrade-breaks-wrapper fix", E-015 = "#349 installer-space-in-path fix"

The second set was added in Phase 11 (post-ladder audit) and should have been E-029/E-030 or the original E-014/E-015 meanings should have been renumbered.

### Fork-main is 7 commits behind upstream

`Alot1z/Ix:main @ 5488741` vs upstream `main @ 1292375`. The fork lacks #386, #389, #390, #391, #392, #394, and the upstream commits between 5488741 and 1292375. This does not affect the contribution branches (both diverge from fork main cleanly), but it means the fork cannot serve as a base for new work without a sync.

---

## PREVIOUS CLAIMS CONFIRMED

1. **#385/#349 fixes are real** — PRs #352, #386, #392 all merged upstream with tests. Issues remain open as admin backlog (not code defects). The Phase 11 finding was correct.
2. **#371/#376 fixes are real** — PRs #390, #391 merged upstream. Issues closed. Phase 7/11 findings correct.
3. **MCP implementation is good** — Independent review confirms all hardening claims (line-size cap, tree-kill, protocol-abuse matrix).
4. **Remap PR #393 is sound** — 4 files, clean diff, 10 security tests. Awaiting review.
5. **Compass source-gate is real** — Both forks 404. No workaround.

---

## PREVIOUS CLAIMS CORRECTED

1. **"85 skills" in Phase 0-6 reports** → 88 skills (parasite-skill expanded). Historical artifact, corrected in Phase 8+.
2. **"feat/ix-docs" in Phase 8 report** → Branch never existed. Removed in Phase 12 regenerated prompt.
3. **"9 read tools" in Phase 8 report** → 8 tools (map, status, explain, trace, impact, search, rank, read). Corrected.
4. **"Issues open = admin backlog" in Phase 11** → More nuanced: the maintainer specifically requested native-Windows verification for #385/#349. The issues are deliberately open, not negligently. The PRs with fixes are merged.

---

## PREVIOUS CLAIMS NOW OBSOLETE

None. All previous claims were either confirmed or corrected. No finding has become fully obsolete — even F-008/F-009 (fixed upstream) remain as historical evidence.

---

## AI-SLOP IDENTIFIED

**None.** This is a clean investigation.

The only speculative finding is F-013 (T5 evidence, single visual observation), and the ledger correctly marked it as Class D with low confidence and deferred re-verification (S-017). That is honest uncertainty, not slop.

The evidence registry duplicate IDs (E-014/E-015) are a data quality issue, not a reasoning error — fixable by renumbering.

---

## REAL FINDINGS (surviving independent review)

| Tier | Finding | Status |
|---|---|---|
| TIER 1 | F-010: /__ix/remap endpoint | PR open, awaiting review |
| TIER 1 | MCP subcommand (issue #219) | Implemented on fork, PR-ready after review |
| TIER 2 | F-006: Delayed-data blank | Source-gated, P1 severity |
| TIER 2 | F-001..F-005: F-key prep | Source-gated, spec-complete |
| TIER 3 | F-007: Rollup timing | Medium confidence, low priority |
| TIER 3 | F-013: Zoom discrepancy | Speculative, T5 evidence |

---

## FIXED FINDINGS

- F-008 (#376 version mismatch): Fixed by PR #391 (2026-08-11)
- F-009 (#371 patches dead): Fixed by PR #390 (2026-08-11)

---

## NEW FINDINGS

**N-001: Evidence registry duplicate IDs (E-014, E-015)**

- Evidence quality: T1 (direct source: `planning/evidence/registry.json`)
- Impact: Data integrity — two different evidence items share the same ID
- Fix: Renumber the second set to E-029/E-030 (non-breaking, purely editorial)

**N-002: Fork-main is 7 commits behind upstream**

- Evidence quality: T1 (GitHub API: compare/ix-infrastructure:main...Alot1z:main)
- Impact: Fork cannot serve as a base for new work without sync
- Fix: `git fetch upstream && git push fork upstream/main:main` (requires user authorization)

---

## DROPPED CANDIDATES

- **F-013 (reclassify as INCONCLUSIVE/DROP)**: T5 evidence. Should not consume engineering effort. Keep as historical observation, remove from active planning.

---

## HIGH-VALUE CANDIDATES (what to work on next)

### TIER 1 — Clearly worth doing

1. **Submit the MCP PR** — `feat/ix-mcp` is PR-ready. One `gh pr create` command. The hardening is solid, tests pass, real-client E2E recorded. Issue #219 has been open since May 2026.
2. **Await PR #393 review** — No action possible. The PR is sound. Maintainer review is the only gate.

### TIER 2 — Potentially worth doing

3. **Close out Phase 9** — Cross-platform matrix (WSL/native-Windows), performance methodology, MCP Inspector E2E. These are documentation/validation tasks, not implementation.
4. **Fix evidence registry duplicate IDs** — Trivial editorial fix, 5 minutes.

### TIER 3 — Do not spend time on now

5. Compass F-key implementation — Source-gated. Cannot proceed without system-compass fork access.
6. Compass delayed-data investigation — Source-gated. Same blocker.
7. F-013 zoom investigation — T5 evidence. Not worth the effort.
8. F-007 rollup timing — Medium confidence, need source access to verify.

---

## BLOCKED ITEMS

| Item | Blocker |
|---|---|
| Compass F-key (F-001..F-005) | No system-compass source access (both forks 404) |
| Compass delayed-data (F-006) | No system-compass source access |
| PR #393 merge | Maintainer review (0 reviews, mergeable_state: blocked) |
| Fork-main sync | User authorization (force-push to fork main) |
| Phase 9 remaining (cross-platform, perf) | Engineering effort — not blocked, just not done |

---

## HUMAN DECISIONS REQUIRED

1. **Submit the MCP PR?** — `gh pr create --repo ix-infrastructure/Ix --head Alot1z:feat/ix-mcp` is ready. This requires your go-ahead.
2. **Fix evidence registry duplicates?** — Trivial, but modifying the findings ledger during audit is not permitted (this is an audit-only phase).
3. **Sync fork main?** — `git fetch upstream && git push fork upstream/main:main`. Changes fork-main SHAs.
4. **Request system-compass access?** — D-014 (open decision): ask KageBinary (offered review on #368) or provide your own contact.

---

## EXTERNAL ACTIONS

| Action | Count |
|---|---|
| PRs created | 0 |
| Issues opened | 0 |
| Comments posted | 0 |
| Reviews submitted | 0 |
| Pushes executed | 0 |
| Merges performed | 0 |
| Upstream mutations | 0 |
| Protected worktree changes | 0 |

This audit was **entirely read-only**.

---

## FINAL ANSWER: What should we work on next?

> If we completely ignored everything the previous AI agents recommended and started from the current Ix repository + current GitHub state today, what would we independently conclude should be worked on next?

### TIER 1 — CLEARLY WORTH DOING

**Submit the MCP PR.** The feat/ix-mcp branch adds 8 read-only tools to ix via a dual-era MCP stdio server. It is production-quality: protocol-correct, security-hardened (line cap, tree-kill, batch rejection), 53 tests, real-client E2E verified. The upstream issue #219 has been open since May 2026. This is the single highest-value contribution on the fork.

### TIER 2 — POTENTIALLY WORTH DOING

**Close out Phase 9 remaining items** (cross-platform matrix, MCP Inspector E2E, performance methodology). These add confidence to the MCP PR without changing code.

**Fix the evidence registry duplicate IDs** — trivial but improves ledger quality.

### TIER 3 — DO NOT SPEND TIME ON NOW

Everything Compass-related (source-gated), F-013 (speculative), F-007 (low confidence), fork-main sync (not blocking anything — both contribution branches diverge from fork main, not upstream).

---

*Phase 14 audit complete. Zero code changes. Zero GitHub mutations. All protected worktrees intact.*
