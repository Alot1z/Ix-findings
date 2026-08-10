# Phase 5 — Implementation Input

**Phase 4 → Phase 5 handoff · 2026-08-10**

---

## A. Completed (Phase 4)

| Candidate | Implementation | Verification |
|---|---|---|
| CAND-011 | graph dangling edges repaired (8 → 0); graph 165/141 | endpoint validation PASS |
| CAND-002 | E-026/027/028 promoted to evidence registry (25 → 28 == graph) | set-difference PASS |
| CAND-001 | manifest counts corrected to live (165/141/28; PRs 11, issues 6) | JSON.parse + cross-check PASS |
| CAND-003/009 | PR-362/372 → merged; +PR-373/375/378/380/382, ISSUE-377/379, fixes edges | API cross-check + validation PASS |
| CAND-004 | #371/#376 classification verified already-correct + note | grep PASS |
| CAND-007 | GRAPH-AUDIT.md historical-vs-actual rewrite | counts match PASS |
| CAND-014/020 | renderFindings 1-char fix validated + committed | node --check + browser smoke PASS |
| CAND-015 | build-data.mjs contribution gate derived from canonical sources; data.js regenerated | rebuild + audit PASS |
| CAND-005 | PACK-371 packet written | review PASS |
| CAND-012 | remap merge verified clean vs fa10045; rebase procedure + PR plan documented | merge-tree exit 0 PASS |
| CAND-008 | Pages deployment package built locally (allowlist + sanitize + validate + workflow template) | validate-public 15/15 PASS |
| CAND-016/017/018 | version series, forge divergence, --format llm recorded | evidence-backed |

## B. Remaining ready (deferred, ordered)

| Order | Candidate | Work | Depends on | Notes |
|---|---|---|---|---|
| 1 | CAND-010 | Fresh F-008/F-009 reproduction against current upstream main | fetch fa10045 into Ix-test | run vitest suite; expect 646/648 + delta doc |
| 2 | CAND-012 (execute) | Rebase remap onto fa10045 + re-run guard tests | **user authorization** to force-update fork branch | procedure in packet; merge-tree already clean |
| 3 | CAND-013 | Sync fork main (Alot1z/Ix) to upstream fa10045 | CAND-012 (order) + **user authorization** | fork currently c4f8fea, 4 behind |
| 4 | CAND-006 | Playwright delayed-data repro against public dist | none | optional evidence |
| 5 | CAND-021 (new) | Reproducible index-standalone.html generation | Phase 5 scope decision | do not hand-edit 170KB HTML |
| 6 | CAND-008 (execute) | Activate Pages deployment | sanitization sign-off + **user authorization** | package ready in planning/pages/ |

## C. Blocked (external)

- system-compass findings (F-001..F-004, F-006, F-007, F-013) — private access (B-001/D-014)
- CONTRIB-fkey / CONTRIB-delayed — same access blocker
- PACK-371 submission — maintainer decision + authorization

## D. New discoveries (Phase 4)

| # | Discovery | Impact |
|---|---|---|
| ND-1 | Upstream main advanced to `fa10045` (was 2e246e8) during Phase 4; +2 commits (#380, #384) | remap base gap now 6 commits; fork main 4 behind |
| ND-2 | PR #372 (--format llm) MERGED — does NOT cover F-009 | PACK-371 written on verified basis |
| ND-3 | Registry (not manifest) was the stale side of the "28 vs 25" evidence split | reconciled by promotion |
| ND-4 | 290/240 was never in the graph file; only in the audit narrative | closed as historical |
| ND-5 | wiki.js committed syntax error reproduced (node --check FAIL) + fixed | BUG-001 resolved |
| ND-6 | `planning/pages/` sanitized projection validated clean (15/15) | Pages package ready |
| ND-7 | CONTRIBUTION-READINESS.json is the canonical contribution-state source | build-data.mjs now reads it |

## E. Repository state (end of Phase 4)

| Repo | Branch | SHA | Dirty | Worktree |
|---|---|---|---|---|
| Ix | feat/ix-agent-skill | b038c46 | 14 (protected) | E:/E-github-repos/Ix |
| Ix-remap | feat/ix-remap-hardening | c021b52 | 0 | E:/E-github-repos/Ix-remap |
| Ix-test | (detached) | c4f8fea | 0 | E:/E-github-repos/Ix-test |
| ix-compass-dist | main | 396426b | 3 (protected) | E:/E-github-repos/ix-compass-dist |
| freebuff-forge | feat/modkit-enhancement-layer | 441cec670 | 0 | E:/E-github-repos/freebuff-forge |
| Ix-findings | master | phase-4 commit (PENDING→after push) | 0 | E:/E-github-repos/Ix-findings |

## F. Recommended Phase 5 objective

> **Execute the verified, authorization-gated tranche:** (1) refresh the Ix-test
> validation baseline to upstream `fa10045` and reproduce F-008/F-009; (2) with
> user authorization, rebase `feat/ix-remap-hardening` onto `fa10045`, re-run the
> guard suite, and prepare/ submit the remap PR packet; (3) sync fork main;
> (4) implement reproducible standalone generation (CAND-021) so
> `index-standalone.html` is a derived artifact; (5) deploy the sanitized Pages
> package only after explicit authorization.

## G. Exit criteria for Phase 5

- [ ] F-008/F-009 reproduction recorded against fa10045
- [ ] Remap rebase executed (if authorized) with guard tests green on new base
- [ ] Fork main synced (if authorized)
- [ ] Standalone generation reproducible from sources (CAND-021)
- [ ] Pages package deployed (if authorized) with validation gate in CI
- [ ] No protected worktree modified; no secrets; no upstream mutation
