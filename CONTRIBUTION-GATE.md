# CONTRIBUTION-GATE.md

**Generated:** 2026-08-10 (Contribution Readiness Gate)
**Status:** READ-ONLY analysis — the definitive boundary between what is known and what remains

---

## READY

These items are verified, tested, and require no further investigation. They can proceed upon user authorization.

| Item | Repository | Branch | Evidence | Next Action |
|---|---|---|---|---|
| **Remap hardening PR** | ix-infrastructure/Ix | `feat/ix-remap-hardening` @ `c021b52` | 656/2 tests, tsc clean, eslint clean, 10 guard tests, 4 files +251/-10 | **BLOCKED: PAT needs workflow scope** (see EXECUTION-PUSH-REMAP.md) |
| **Fork main sync** | Alot1z/Ix | `fork/main` @ `0437abf` → `c4f8fea` | 5 commits behind, linear fast-forward | **BLOCKED: PAT needs workflow scope** (see EXECUTION-SYNC-IX.md) |
| **Ix-findings initial commit** | Ix-findings → Alot1z/Ix-findings | `master` @ `daff6f9` | 171 files, 34,563 insertions | ✅ **DONE** — https://github.com/Alot1z/Ix-findings (Phase A-3) |
| **Ix-test worktree** | Ix-test (local) | `c4f8fea` (detached) | 646/648 pass, tsc clean, eslint 0 errors | Preserved as regression baseline |
| **F-key specification** | system-compass (spec only) | `pr-packets/compass-f-key/README.md` | Full spec: 2-line change, 15 tests, <100 lines | Hand to developer upon source access (Phase D) |
| **#376 fix specification** | ix-infrastructure/Ix | `pr-packets/ix-376-version-mismatch/README.md` | Source-proven: 2 implementation options | Discuss with maintainer (Phase B-3) |

---

## BLOCKED

These items cannot proceed due to missing access or information.

| Item | Blocker | Resolution Path | Dependencies |
|---|---|---|---|
| **F-key implementation** | No system-compass source access | Request access from KageBinary (D-014) | Phases C+D |
| **Delayed-data fix** | No system-compass source access | Same as above; separate PR per D-006 | Phases C+E |
| **Zoom anomaly resolution (F-013)** | No system-compass source access; Class D (low confidence) | Source inspection may resolve to no-op | Phases C+F |
| **F-001–F-007 source verification** | No system-compass source access | All 7 findings are Class B (artifact/runtime) — verified but not from source | Phase C |
| **system-compass fork creation** | Private repo; fork not creatable without access | C-1 → C-2 | D-014 |
| **#371 fix** | Maintainer must decide OSS vs Pro disposition | Ask in context of remap PR | B-1 |

---

## NEEDS USER DECISION

These items require explicit user authorization before proceeding.

| Decision | Options | Recommended | Context |
|---|---|---|---|
| **D-009: Authorize remote push** | Push remap + sync fork vs. wait | Push remap first (lowest risk) | Remap is clean, tested, 1 commit ahead |
| **D-014: Request system-compass access** | Ask KageBinary in #368 thread vs. direct message vs. wait | Ask in #368 thread (KageBinary offered review) | Template prepared in SYSTEM-COMPASS-ACCESS-PLAN.md |
| **D-010: Where to prep Compass port** | Standalone repo vs. Ix worktree | system-compass fork worktree (correct target) | Reviewer said system-compass, not Ix |
| **D-011: F-key PR scope** | F + help + chip only vs. + drill reframe | F + help only (D-005) | #57 already covers refit |
| **D-013: Stopgap compass-patch fate** | Keep local + expiry vs. drop | Keep local + document expiry | User's active worktree has the patch |

---

## NEEDS MORE EVIDENCE

These items have gaps that should be resolved before contribution.

| Item | Gap | How to Resolve | Priority |
|---|---|---|---|
| **F-013 (zoom ×1.25 vs ×1.1)** | Class D (inference), low confidence | Inspect zoom control source when access granted | P3 (low) |
| **F-007 (rollup timing mechanism)** | Class B (observed), medium confidence on root cause | Inspect aggregation source when access granted | P2 |
| **F-006 (delayed-data root cause)** | Class C (reconstruction) — root cause inferred, not source-verified | Inspect region rollup + camera lifecycle source | P1 (after access) |
| **Graph: system-compass relationships** | All 7 system-compass findings are Class B only | Source inspection when access granted | P2 |
| **Graph: full symbol tree** | Only 9 symbols mapped; Ix codebase has hundreds | Automated extraction via Ix CLI (ix map) | P2 |
| **Graph: dependency edges** | Import chains between files not modeled | Automated extraction | P2 |

---

## DO NOT DO

These actions would be redundant, dangerous, unnecessary, or already covered.

| Action | Why Not |
|---|---|
| **Open PR for feat/ix-agent-skill** | 14 uncommitted changes; active development; contains Compass patch intentionally stripped from PR #368 per reviewer direction |
| **Modify ix-compass-dist** | D-007: distribution channel — artifacts built from system-compass, never manually modified |
| **Combine F-key with delayed-data in one PR** | D-006: different root causes, different subsystems, different reviews |
| **Add auto-frame or drill reframe to F-key** | D-005: duplicates Compass #57 |
| **Push remap to fork/main instead of feature branch** | Must use `feat/ix-remap-hardening` branch for PR isolation |
| **Contact KageBinary about system-compass without authorization** | External-action boundary still in effect |
| **Modify the dirty feat/ix-agent-skill worktree** | 14 uncommitted changes are user's active development work |
| **Create a new Ix PR for the agent skill** | PR #368 already merged — covers agent skill + HTTP API docs |
| **Merge remap into agent-skill branch** | Different purposes, different targets |
| **Open #376 or #371 PRs without maintainer direction** | Both need maintainer input on approach |

---

## Contribution Readiness Matrix: All 13 Findings

| Finding | Repo | Verified | Source-backed | Test-backed | Existing PR Overlap | Action |
|---|---|---|---|---|---|---|
| F-001 | system-compass | ✅ Class B | ❌ No source | ❌ No tests | F-key spec only | DOCUMENT ONLY |
| F-002 | system-compass | ✅ Class B | ❌ No source | ❌ No tests | F-key spec only | DOCUMENT ONLY |
| F-003 | system-compass | ✅ Class B | ❌ No source | ❌ No tests | F-key spec only | DOCUMENT ONLY |
| F-004 | system-compass | ✅ Class B | ❌ No source | ❌ No tests | None | DOCUMENT ONLY |
| F-005 | system-compass | ✅ Class A+B | ❌ No source | ❌ No tests | #57 (fixed in v0.3.0) | DOCUMENT ONLY |
| F-006 | system-compass | ✅ Class B+C | ❌ No source | ❌ No tests | Separate from F-key (D-006) | BLOCKED |
| F-007 | system-compass | ✅ Class B | ❌ No source | ❌ No tests | Separate from F-key | BLOCKED |
| **F-008** | **Ix** | ✅ **Class A** | ✅ **upgrade.ts:141** | ❌ No dedicated test | **PR #365 (cause), #376 (issue)** | **FUTURE CONTRIBUTION** |
| **F-009** | **Ix** | ✅ **Class A** | ✅ **oss.ts:49** | ❌ No dedicated test | **#371 (issue)** | **FUTURE CONTRIBUTION** |
| **F-010** | **Ix** | ✅ **Class A** | ✅ **view.ts diff** | ✅ **10 guard tests, 656 suite** | **None — new** | **SOURCE CHANGE (READY)** |
| **F-011** | **Ix** | ✅ **Class A** | ✅ **bootstrap.sh diff** | ✅ **In remap suite** | **None** | **SOURCE CHANGE (READY)** |
| **F-012** | **Ix** | ✅ **Class A** | ✅ **bootstrap.sh diff** | ✅ **In remap suite** | **None** | **SOURCE CHANGE (READY)** |
| F-013 | system-compass | ⚠️ Class D | ❌ No source | ❌ No tests | None | NEEDS MORE EVIDENCE |

---

## Graph Completeness Assessment

| Improvement | Priority | Missing Data | Source of Data | Blocked | Effort |
|---|---|---|---|---|---|
| Full test mapping (all 50 test files) | P2 | Test file → symbol relationships | Ix-test worktree | No | Medium |
| Dependency edges (import chains) | P2 | File → import → file | Ix CLI (ix map) | No | Medium |
| Full symbol tree | P2 | All exported symbols in Ix | Ix CLI (ix map) | No | Medium |
| Branch ancestry (full git DAG) | P2 | Commit parent relationships | Git log | No | Low |
| system-compass source relationships | P1 | F-001–F-007 → exact source files | system-compass source | **YES** | Unknown |
| CI/build pipeline | P3 | Workflow relationships | GitHub workflows dir | No | Low |
| Code-to-finding for F-001–F-007 | P1 | Finding → source file → symbol | system-compass source | **YES** | Low |

---

## NEXT SAFE ACTION

### Recommended: Sync fork main and push remap branch

```
git push fork origin/main:main          # Fast-forward fork/main 0437abf → c4f8fea
cd E:/E-github-repos/Ix-remap
git push fork feat/ix-remap-hardening   # Push remap branch to fork
```

**Why this first:**
- Fork main sync is a safe, linear fast-forward (5 commits)
- Remap push is the lowest-risk contribution — clean, tested, 1 commit ahead
- Does NOT open a PR (still gated on D-009)
- Does NOT contact any maintainer
- Preserves all existing worktrees unchanged
- Positions the fork for future PR creation
- Establishes the fork as current before any other contribution work

**This action has NOT been performed. It requires explicit user authorization.**

---

*All classifications are evidence-based. No speculative readiness claims. The boundary between verified knowledge and remaining gaps is clearly delineated.*
