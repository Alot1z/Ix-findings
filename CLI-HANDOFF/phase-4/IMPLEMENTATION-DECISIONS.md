# Phase 4 — Implementation Decisions

**Date:** 2026-08-10

This file records the decisions made during Phase 4 implementation, the evidence
behind them, and the user decisions that bounded the phase.

---

## 1. User decisions (explicit, provided at phase start)

| # | Topic | Decision |
|---|---|---|
| U-1 | Wiki syntax fix | Commit the validated 1-char `renderFindings()` fix after exact-diff review; do **not** create a new build pipeline unless a deterministic standalone-generation path already exists (none does); commit the standalone as-is; document reproducible standalone generation as a separate candidate. |
| U-2 | Remap branch | Prepare `c021b52` exactly as it exists. Do NOT rebase, force-push, fast-forward, merge, reset, amend. Verify/document clean merge with upstream; prepare the exact local rebase procedure + PR plan. Do not open a PR, do not push. |
| U-3 | GitHub Pages | Prepare the implementation locally: sanitization pipeline, allowlist-based public-data model, static export, validation, deployment structure. Unknown/private data excluded by default. Validate locally. Do **not** enable Pages, deploy, change visibility, push deployment changes, create a PR, or publish. |

These decisions are reflected in the work performed and in `BLOCKED-CANDIDATES.json`
and `DEFERRED-CANDIDATES.json`.

---

## 2. Reconciliation decisions (evidence-backed)

| # | Decision | Evidence |
|---|---|---|
| D-4.1 | **Promote** E-026/E-027/E-028 into the evidence registry rather than removing them from the graph | They are real Class-A source nodes with `supported_by` edges to F-008/F-009 and `sourced_from` edges to real files. The manifest's "28" was correct; the *registry* was missing 3 records. Registry now 28 == graph 28. |
| D-4.2 | **Add** the 6 missing nodes (S-001/S-002/S-007/S-008, file-GIT-STATE.md, file-manifest.json) instead of deleting 8 dangling edges | The referenced suggestions exist in the suggestions registry; the files exist in the handoff. Removing edges would destroy genuine `implements`/`found_in` knowledge. |
| D-4.3 | Update PR-362/PR-372 status to MERGED in graph + matrix | GitHub API `pulls/{n}` returns `merged_at` (362: 16:24:03Z, 372: 16:27:42Z, 373: 16:07:21Z). Graph previously said "open". |
| D-4.4 | CAND-004 recorded as **already-satisfied** in current PR-MATRIX | Live grep found zero `PR #371`/`pull/371` mislabels; #371/#376 sit in the Issues table. Added explicit state note to prevent regression. |
| D-4.5 | Manifest evidence count stays 28 with corrected note | After promotion, registry(28) == graph(28) == manifest(28). The old note cited S-038 file counts — replaced with the actual reconciliation reason. |
| D-4.6 | `build-data.mjs` derives contribution gate from `phase-3/CONTRIBUTION-READINESS.json` + `manifest.test_results` + `pr-packets/` existence | Kills the hardcoded stale values ("656/2", CONTRIB-376 BLOCKED). Status normalization maps NEAR_READY correctly. |
| D-4.7 | Graph counts 165/141 are authoritative; 290/240 stays a historical narrative | 290/240 never existed in the graph file (Phase 2 root cause); Phase 4 additions are verified real nodes/edges. |
| D-4.8 | Public projection excludes worktree graph nodes and private system-compass URLs | Worktree titles embed `E:\` paths; private URLs nulled. Edges filtered to published endpoints (162/133). |

---

## 3. Skills evaluation (Phase 4)

| Skill | Relevant | Used | Evidence / reason |
|---|---|---|---|
| source-driven-development | yes | yes | All implementation driven by live graph/registry/API/merge-tree evidence |
| verification-before-completion | yes | yes | Every claim mapped to test/validation output in VERIFICATION-MATRIX.json |
| doubt-driven-development | yes | yes | Challenged the "phantom evidence = delete" assumption → promoted instead; verified PR states via API rather than trusting Phase 3 |
| sequential-thinking | yes | yes | Dependency order honored: graph repair → manifest → generator → Pages |
| planning-and-task-breakdown | yes | yes | Wave 1/2/3/4 ordering from PHASE-4-IMPLEMENTATION-INPUT followed |
| debug-thinking | yes | partial | Used for the wiki.js syntax error + repair-script node-push bug diagnosis |
| git-workflow-and-versioning | yes | yes | merge-tree verification; no-destructive-ops discipline |
| test-driven-development | yes | no | Not applicable: Ix-findings has no test framework; validation is script-based |
| browser-testing-with-devtools | yes | no | browser-use agent used instead (no devtools MCP available) |
| webapp-testing / playwright-cli | yes | no | browser-use covered the smoke test; no Playwright harness present |
| tractatus-thinking | yes | no | not required for these bounded edits |

---

## 4. Tools used

| Tool | Class | Purpose |
|---|---|---|
| basher | DANGEROUS (shell) | read-only git/node inspections; merge-tree; static server; build runs |
| read_files | READ_ONLY | phase artifacts, manifest, build scripts |
| write_file | LOCAL_MUTATION | phase-4 artifacts, packets, pages package |
| str_replace | LOCAL_MUTATION | manifest/PR-MATRIX/GRAPH-AUDIT/build-data edits |
| spawn_agents | ORCHESTRATION | parallel read-only evidence gathering |
| browser_use | DANGEROUS (browser) | findings-view smoke test of the fixed explorer |
| ask_user | — | U-1/U-2/U-3 decisions |
