# PHASE 3 — COMPLETE ENGINEERING OPPORTUNITY, BUG, ENHANCEMENT & IMPLEMENTATION-BACKLOG ANALYSIS

**Generated: 2026-08-10**
**Method: live filesystem + Git + GitHub API + registry/graph parsing. Every claim re-verified against primary evidence; Phase 0–2 inputs consumed and cross-checked.**

---

## 1. STATUS

**COMPLETE.** All Phase 3 objectives met. The authoritative implementation backlog is produced in `MASTER-CANDIDATE-BACKLOG.json` with a sliced work breakdown and actionable Phase 4 input. No external mutation occurred; all protected work verified unchanged.

---

## 2. EXECUTION SUMMARY

Phase 3 consumed the Phase 0–2 artifacts, re-verified protected worktree state, re-queried live GitHub state, inspected the Ix source tree (via the clean Ix-test worktree), audited the knowledge explorer pipeline, and built a **20-candidate master backlog** (14 READY, 3 NEEDS_EVIDENCE, 2 NEEDS_DECISION, 1 ALREADY_COVERED) sliced into **20 work items**.

**Three new Phase 3 discoveries materially change the picture:**

1. **Upstream Ix main has moved** — `ix-infrastructure/Ix` main is now `2e246e8` (2026-08-10T16:53Z), **4 commits past** the fork/local baseline `c4f8fea` (04:58Z): #373 (brew PR title), #362 (view -p), #372 (--format llm), #352 (Windows 8.3 TEMP fix). All local/fork state is stale by 4 commits. **Remap branch merge-tree is CLEAN against the new main** (no conflicts), so a rebase is safe (CAND-012).
2. **PR #372 (merged) did NOT touch patches registration** — verified via the PR files list (doctor/explain/read/savings/status + llm.ts + tests only). F-009 (dead patches command) remains fully valid; the open question in CAND-005 is resolved → PACK-371 can be prepared.
3. **Committed explorer syntax error** — `planning/wiki/assets/wiki.js` and `index-standalone.html` contain an unbalanced-paren error in `renderFindings()`. The **uncommitted dirty diff IS the fix** — it must be preserved, not cleaned (CAND-014/CAND-020, BUG-001).

Additional verified facts: Freebuff-forge divergence now measurable (3 commits ahead of upstream/main, merge-base `914a4e458` — resolves U-003); Ix has a dual version series (source `package.json` 0.6.1 vs GitHub releases v0.9.x); `build-data.mjs` hardcodes stale contribution-gate data.

---

## 3. CANDIDATE UNIVERSE

**20 candidates** (11 carried from Phase 2, re-verified; 9 new in Phase 3).

| ID | Title | Status | Repo | Priority |
|---|---|---|---|---|
| CAND-001 | Correct manifest.json stale counts | READY | Ix-findings | P1 |
| CAND-002 | Reconcile phantom evidence nodes E-026..028 | READY | Ix-findings | P1 |
| CAND-003 | Add verified PRs/issues to graph + PR-MATRIX | READY | Ix-findings | P2 |
| CAND-004 | Fix PR-MATRIX mislabeling (#371/#376 issues) | READY | Ix-findings | P2 |
| CAND-005 | Prepare PACK-371 packet (F-009) | READY | Ix | P3 |
| CAND-006 | Playwright delayed-data reproduction | NEEDS_EVIDENCE | system-compass (ext) | P3 |
| CAND-007 | Reconcile GRAPH-AUDIT.md with actual graph | READY | Ix-findings | P2 |
| CAND-008 | GitHub Pages deployment | NEEDS_DECISION | Ix-findings | P4 |
| CAND-009 | Enrich graph with execution-state nodes | READY | Ix-findings | P2 |
| CAND-010 | Verify F-008/F-009 against CURRENT main | NEEDS_EVIDENCE | Ix | P2 |
| CAND-011 | Repair 8 dangling graph edges | READY | Ix-findings | P1 |
| CAND-012 | Rebase remap onto 2e246e8 | READY | Ix | P1 |
| CAND-013 | Sync fork main to 2e246e8 | READY | Alot1z/Ix | P3 |
| CAND-014 | Fix committed wiki syntax error | READY | Ix-findings | P1 |
| CAND-015 | Derive build-data contribution gate | READY | Ix-findings | P2 |
| CAND-016 | Document dual version series | READY | Ix-findings | P3 |
| CAND-017 | Record forge divergence (U-003) | READY | Ix-findings | P3 |
| CAND-018 | Record --format llm as implemented | ALREADY_COVERED | Ix | P4 |
| CAND-019 | Ix docs/API reference gap closure | NEEDS_EVIDENCE | Ix | P3 |
| CAND-020 | Commit two dirty wiki files | NEEDS_DECISION | Ix-findings | P1 |

**By priority:** P1=6, P2=6, P3=6, P4=2. **By repo:** Ix-findings=13, Ix=6, system-compass=1 (evidence). See `MASTER-CANDIDATE-BACKLOG.json`.

---

## 4. BUG INVENTORY

**13 bugs** in `BUG-INVENTORY.json`. New in Phase 3: **BUG-001** (committed wiki syntax error), **BUG-007** (stale base — upstream main 4 commits ahead), **BUG-008** (dual version series). Notable:

| Bug | Severity | Status |
|---|---|---|
| BUG-001 committed renderFindings syntax error | medium | CONFIRMED — fix is the dirty diff |
| BUG-002 8 dangling graph edges | medium | CONFIRMED |
| BUG-003 3 phantom evidence nodes | low | CONFIRMED |
| BUG-004 manifest stale counts | medium | CONFIRMED |
| BUG-007 all local/fork baselines 4 commits behind upstream | high (process) | CONFIRMED |
| BUG-009 F-009 patches dead code (#371) | medium | OPEN upstream |
| BUG-010 F-008 version mismatch (#376) | medium | OPEN upstream |
| BUG-011 system-compass access | high (process) | BLOCKED |

---

## 5. ENHANCEMENT INVENTORY

**12 enhancements** in `ENHANCEMENT-INVENTORY.json`. New in Phase 3: ENH-009 (wiki CI validation — `node --check` would have caught BUG-001), ENH-010 (forge divergence tracking), ENH-011 (version-series documentation). Existing pipeline (ENH-002) works but needs the CAND-015 de-hardcoding fix.

---

## 6. FINDING RECONCILIATION

All 13 findings re-verified against live state. **No Phase 2 classification changed** — but Phase 3 added decisive evidence:

- **F-009 (patches dead)** — strengthened: PR #372 (merged) did NOT touch `oss.ts`/`patches.ts`; `registerPatchesCommand` still never invoked → **ACTIVE, fully valid**.
- **F-010/F-011/F-012 (remap)** — base is now stale (4 commits behind upstream); content unaffected, merge-tree clean → **PARTIALLY_RESOLVED, needs rebase** (CAND-012).
- **F-008 (upgrade mismatch)** — issue #376 still OPEN; dual version series documented as context (CAND-016) → **ACTIVE**.
- F-001..F-004, F-006, F-007, F-013 → unchanged, source verification BLOCKED.

---

## 7. SUGGESTION RECONCILIATION

All 33 suggestions re-verified. **S-013 (fix #376), S-014 (fix #371), S-018 (Playwright delayed-data), S-020 (no-map chip)** remain STILL_VALID and are mapped to CAND-010, CAND-005, CAND-006 respectively. S-020 remains spec-level only (no demand evidence). No suggestion reclassified in Phase 3.

---

## 8. PR / ISSUE CORRELATION

Live API verification confirmed and extended the Phase 2 picture — see `PR-ISSUE-CORRELATION.json`. Key facts:

- **PR #368** MERGED (2026-08-10T03:58:42Z) — historical, do not reopen.
- **PR #372** MERGED (16:27:42Z) — `--format llm` for 5 commands; **did not touch patches**.
- **Open upstream PRs**: #375 (fixes #374), #378 (relates #377), #380 (relates #379), #382 (PHP typed receivers) — **do NOT duplicate**.
- **Open issues**: #371 (F-009), #374, #376 (F-008), #377, #379.
- System-compass #57/#58/#59 private.

---

## 9. REPOSITORY OWNERSHIP

Every candidate has an explicit repository target (`REPOSITORY-OWNERSHIP-MATRIX.json`). Ix-findings carries the knowledge work; Ix candidates are packet/repro/rebase only (no upstream mutation); Freebuff/Forge has no Ix-findings candidates (NO_RELATIONSHIP preserved); system-compass remains BLOCKED.

---

## 10. PRIORITY MODEL

Transparent 5-axis scoring (impact, confidence, feasibility, risk-reduction, testability; max 15) in `PRIORITY-MATRIX.json`. P1 items all have CONFIRMED evidence. No P0 items — nothing is critical-risk in this knowledge/infra backlog.

---

## 11. DEPENDENCY GRAPH

`CANDIDATE-DEPENDENCY-GRAPH.json` — 20 relationships. Key chains:
`CAND-011 → CAND-003 → CAND-009`; `CAND-001 → CAND-015 → CAND-008`; `CAND-012 → CAND-013`; `CAND-014 → CAND-020`.

---

## 12. IMPLEMENTATION WORK BREAKDOWN

**20 work items** (`IMPLEMENTATION-WORK-BREAKDOWN.json`), 13 low-effort / 6 medium / 3 requiring external authorization. Full ordering in `PHASE-4-IMPLEMENTATION-INPUT.md`.

---

## 13. TEST READINESS

`TEST-READINESS-MATRIX.json`. Known baseline: Ix 646/648 @ c4f8fea (needs re-run at 2e246e8). Recommendation: add `node --check` + link check to Ix-findings validation (ENH-009).

---

## 14. KNOWLEDGE-SYSTEM BACKLOG

`KNOWLEDGE-SYSTEM-BACKLOG.json` — 9 items. Graph repair first (K-001), then canonical regeneration (K-002), then enrichment (K-003), then Pages (K-007, decision-gated).

---

## 15. GITHUB PAGES PLAN

Feasibility: **YES**. Implementation spec: `GITHUB-PAGES-IMPLEMENTATION-SPEC.md`. State: **READY_AFTER_SANITIZATION + authorization** (CAND-008). No deployment performed.

---

## 16. SYSTEM-COMPASS STATUS

Unchanged: **private (HTTP 404), no fork, source unavailable**. 8 findings remain source-unverifiable (F-001..F-004, F-006, F-007, F-013). F-key + delayed-data contribution scopes remain BLOCKED pending **D-014** (user decision on access path). Auto-frame excluded (#57). Nothing fabricated.

---

## 17. BLOCKERS

| Blocker | Impact |
|---|---|
| B-001 system-compass private | 8 findings unverifiable; 2 contributions blocked |
| B-002 no Alot1z/system-compass fork | no contribution prep path |
| B-005 old handoff dir locked | dangling empty dir |
| B-NEW stale base (c4f8fea vs 2e246e8) | remap/fork need rebase/sync before contribution |
| B-NEW authorization | rebase+push fork, fork-main sync, Pages deploy |

---

## 18. NEEDS-DECISION

| Decision | Options |
|---|---|
| D-014 system-compass access path | request access / wait / abandon — user only |
| CAND-008 GitHub Pages deployment | authorize after sanitization / defer |
| CAND-020 commit dirty wiki files | commit (it's a real fix) / keep uncommitted |
| F-009 register-vs-delete patches | maintainer decision (downstream) |
| CAND-019 docs scope | which commands to document |

---

## 19. DO-NOT-DO

- Compass auto-frame (covered by #57) · CameraStore (D-005) · DOM zoom patch (D-005)
- Mixing Compass changes into Ix PRs (D-007) · manual ix-compass-dist edits (D-007)
- Resurrecting 290/240 as current data · any system-compass work without access
- Creating PRs/issues/reviews/comments without explicit authorization

---

## 20. PROTECTED WORK

| Worktree | Head | Dirty | Phase 3 changed? |
|---|---|---|---|
| Ix primary (`feat/ix-agent-skill`) | `b038c46` | 14 | **NO** ✅ |
| Ix-remap (`feat/ix-remap-hardening`) | `c021b52` | 0 | **NO** ✅ |
| Ix-test | `c4f8fea` | 0 | **NO** ✅ (read-only inspection) |
| ix-compass-dist | `396426b` | 3 | **NO** ✅ |
| freebuff-forge | `441cec670` | 0 | **NO** ✅ |
| Ix-findings dirty wiki fix | — | 2 files | **PRESERVED** ✅ (it is the BUG-001 fix) |

---

## 21. SKILLS USED

| Skill | Used | Purpose |
|---|---|---|
| source-driven-development | ✅ | live source/API over reports for every candidate |
| verification-before-completion | ✅ | re-verified protected state + PR/issue metadata + merge-tree |
| doubt-driven-development | ✅ | challenged v0.6.1 claim (→ dual series), PR #372 overlap (→ not touching patches) |
| sequential-thinking | ✅ | dependency ordering of the backlog |
| git-workflow-and-versioning | ✅ | merge-tree, rev-list, fetch (read-only) |
| using-git-worktrees | ✅ | correct worktree selection (Ix-test for inspection) |
| planning-and-task-breakdown | ✅ | candidate → work-item slicing |

## 22. SKILLS NOT USED

| Skill | Reason |
|---|---|
| debug-thinking / tractatus-thinking | no non-trivial failure trace required; findings already reconciled in Phase 2 |
| browser-testing-with-devtools / webapp-testing / playwright-cli | no UI change made in Phase 3; browser validation deferred to Phase 4 (WORK-014) |
| github-actions-docs | Pages workflow is a Phase 4 implementation (spec only here) |
| code-review-and-quality / code-review-graph | no code written in Phase 3 |
| tdd / test-driven-development | no implementation phase |
| graphify / understand | graph already modeled; no new graph build |

---

## 23. TOOLS USED

`read_files` (Phase 0–2 inputs) · `basher` (live git/GitHub/registry verification, read-only) · `write_file` (Phase 3 artifacts) · `write_todos` · `spawn_agents` (parallel evidence gathering).

---

## 24. EXTERNAL ACTIONS

```
PRs created: 0
Issues created: 0
Reviews: 0
Comments: 0
Maintainer contacts: 0
Repositories created: 0
Merges: 0
Force pushes: 0
Upstream mutations: 0
Pages deployments: 0
External releases: 0
```

GitHub API usage: read-only metadata only. One local `git fetch origin main` in Ix-remap updated only local remote-tracking refs (no working-tree mutation, no push).

---

## 25. FILES CREATED

| File | Type |
|---|---|
| `CLI-HANDOFF/phase-3/MASTER-CANDIDATE-BACKLOG.json` | machine-readable |
| `CLI-HANDOFF/phase-3/BUG-INVENTORY.json` | machine-readable |
| `CLI-HANDOFF/phase-3/ENHANCEMENT-INVENTORY.json` | machine-readable |
| `CLI-HANDOFF/phase-3/CANDIDATE-EVIDENCE-MATRIX.json` | machine-readable |
| `CLI-HANDOFF/phase-3/CANDIDATE-DEPENDENCY-GRAPH.json` | machine-readable |
| `CLI-HANDOFF/phase-3/IMPLEMENTATION-WORK-BREAKDOWN.json` | machine-readable |
| `CLI-HANDOFF/phase-3/PR-ISSUE-CORRELATION.json` | machine-readable |
| `CLI-HANDOFF/phase-3/REPOSITORY-OWNERSHIP-MATRIX.json` | machine-readable |
| `CLI-HANDOFF/phase-3/PRIORITY-MATRIX.json` | machine-readable |
| `CLI-HANDOFF/phase-3/TEST-READINESS-MATRIX.json` | machine-readable |
| `CLI-HANDOFF/phase-3/CONTRIBUTION-READINESS.json` | machine-readable |
| `CLI-HANDOFF/phase-3/KNOWLEDGE-SYSTEM-BACKLOG.json` | machine-readable |
| `CLI-HANDOFF/phase-3/GITHUB-PAGES-IMPLEMENTATION-SPEC.md` | spec |
| `CLI-HANDOFF/phase-3/PHASE-4-IMPLEMENTATION-INPUT.md` | handoff |
| `CLI-HANDOFF/phase-3/PHASE-3-REPORT.md` | this report |

---

## 26. JSON VALIDATION

All 12 Phase 3 JSON files parse (node `JSON.parse`) — verified in the final integrity check.

---

## 27. SECURITY CHECK

**SECRET SCAN: CLEAN.** No tokens, PATs, credentials, `.env` contents, or private keys in Phase 3 artifacts. The GitHub token was used only through the shell environment variable and never echoed or persisted.

---

## 28. PHASE 4 INPUT

See `PHASE-4-IMPLEMENTATION-INPUT.md`: ordered waves (knowledge corrections → graph enrichment → validation/contribution prep → decision-gated), first targets, dependencies, protected areas, blocked work, external-action boundaries, test requirements, documentation requirements, and exit criteria.

**First implementation targets:** WORK-001 (manifest), WORK-011 (dangling edges), WORK-002 (phantom nodes), WORK-014 (syntax fix), WORK-012 (remap rebase, with authorization).

---

## 29. FINAL INTEGRITY CHECK

| Check | Result |
|---|---|
| Protected worktrees unchanged | ✅ all 5 verified |
| Dirty wiki fix preserved | ✅ (not cleaned) |
| All 12 JSON parse | ✅ |
| No secrets written | ✅ |
| No external mutation | ✅ (read-only API + local remote-tracking fetch only) |
| Phase 0–2 artifacts preserved | ✅ |
| Every Phase 2 candidate reconciled | ✅ (CAND-001..011 all present with updated evidence) |
| Every active finding has a candidate mapping | ✅ |
| Every still-valid suggestion mapped | ✅ (S-013→CAND-010, S-014→CAND-005, S-018→CAND-006, S-020 documented) |
| System-Compass remains correctly blocked | ✅ |
| Priorities evidence-backed | ✅ (scoring matrix) |
| Duplicates removed / obsolete identified | ✅ (CAND-018 ALREADY_COVERED; excluded list) |
