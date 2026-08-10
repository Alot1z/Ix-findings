# GRAPH-AUDIT.md — Investigation Graph Audit

> **Updated:** 2026-08-10 (Freebuff CLI Master Execution Phase)
> Graph source: `../planning/maps/investigation-map.json`

---

## Graph Evolution

| Metric | Before (Desktop) | After (Phase 7-10) | After (Master Execution) | Total Delta |
|---|---|---|---|---|
| Total nodes | 108 | ~270 | ~290 | +182 |
| Total edges | 75 | ~215 | ~240 | +165 |
| Node types | 10 | 18 | 18 | +8 |
| New types | — | worktree, release, artifact, file, symbol, api, test, stale_claim | — | — |

---

## Current Graph State

| Node Type | Count | Notes |
|---|---|---|
| phase | 16 | phase-00 through phase-fc7 |
| repository | 5 | Ix, fork, dist, system-compass, Ix-findings |
| branch | 6 | main, agent, remap, forkmain, forkagent, dist |
| worktree | 3 | primary, remap, test |
| commit | 6 | c021b52, 2157158, dcc0962, b038c46, 0437abf, 0c9087c |
| release | 4 | v0.1.0 through v0.3.0 |
| artifact | 4 | compass tarballs |
| file | 10 | view.ts, upgrade.ts, patches.ts, oss.ts, bootstrap.sh, tests, etc. |
| symbol | 9 | isNewer, getCurrentVersion, serverScript, PRO_COMMANDS, etc. |
| api | 2 | POST /__ix/remap, GET /__ix/status |
| test | 4 | view-server, upgrade-version-compare, full suite (remap), upstream suite (fresh) |
| finding | 13 | F-001 through F-013 |
| evidence | 28 | E-001 through E-028 |
| issue | 4 | #371, #376, #374, #57 |
| pr | 6 | #358, #362, #365, #366, #368, #372 |
| pr_packet | 4 | remap, fkey, delayed, 376 |
| decision | 14 | D-001 through D-014 |
| stale_claim | 8 | S-034 through S-041 |
| person | 5 | KageBinary, josephismikhail, Hiro-Chiba, TannerTorrey3, Alot1z |

---

## Graph Expansion Summary

### Added: Repository Layer
- **Worktrees**: `worktree-primary` and `worktree-remap` with `checks_out` edges to branches

### Added: Release/Artifact Layer
- **Releases**: v0.1.0, v0.1.1, v0.2.0, v0.3.0 with URLs
- **Artifacts**: 4 compass tarballs with SHA256 for v0.3.0

### Added: Source Layer
- **Files**: 10 key files across Ix and compass-dist with full paths
- **Symbols**: 9 functions/constants with line numbers
- **APIs**: 2 endpoints with security annotations

### Added: Test Layer
- **Test files**: view-server.test.ts (10 guard scenarios), upgrade-version-compare.test.ts
- **Test suite**: 656/2 passing + tsc + eslint

### Added: Test Worktree (Master Execution Phase)
- **worktree-test**: Clean upstream test environment at `E:\E-github-repos\Ix-test`
- **test-suite-upstream**: Fresh test results — 646/648 passed, tsc clean, eslint 0 errors
- **COMMIT-upstream**: c4f8fea validated as clean upstream HEAD

### Added: system-compass Fork Gap
- Confirmed `Alot1z/system-compass` does NOT exist (404)
- `ix-infrastructure/system-compass` still private (404)
- Blocked on D-014 for source access

### Added: Workspace Audit Discoveries
- 4 new stale claims: S-038 (untracked count 165), S-039 (missing directories), S-040 (186 total files), S-041 (no system-compass fork)
- `evidence/`, `investigations/`, `reproductions/` directories exist but are empty stubs

### Enhanced: Finding-Source Links
- F-008 → file-upgrade.ts → symbol-isNewer (exact provenance)
- F-009 → file-oss.ts → symbol-PRO_COMMANDS (exact provenance)
- F-010 → file-view.ts → api-remap (exact provenance)
- F-011 → file-bootstrap.sh (exact diff)
- F-012 → file-bootstrap.sh (exact diff)
- F-003 → file-KeyboardHelp.js (exact file in artifact)

---

## What the Graph CAN Answer Now

- "Where did F-008 originate?" → `file-upgrade.ts:141` → `isNewer()` → `ISSUE-376`
- "Which exact source code supports F-009?" → `file-oss.ts:49` → `PRO_COMMANDS` array
- "What is the blast radius of the remap change?" → 4 files (+251/-10), 10 guard tests, 656 suite
- "What changed between fork and upstream?" → 5 commits behind, different agent-skill content
- "Which release contains KeyboardHelp?" → v0.3.0 → `KeyboardHelp-KnF66B2h.js`
- "Which PRs are authored by Alot1z?" → PR #368

---

## Remaining Gaps

| Category | Status | Notes |
|---|---|---|
| Full symbol tree | PARTIAL | Only 9 key symbols extracted; full Ix codebase has hundreds |
| Dependency edges | MINIMAL | Import chains between files not fully modeled |
| system-compass internals | MISSING | Private repo — Class B/D evidence only |
| Build pipeline | MISSING | CI workflows not modeled |
| Full test mapping | PARTIAL | 80 test files exist; only 3 modeled |
| Code-to-finding for F-001–F-007, F-013 | PARTIAL | system-compass source blocked |
| Branch ancestry tree | PARTIAL | Full git DAG not modeled |

---

## Schema Reference

Required node types: Phase, Repository, Branch, Worktree, Commit, Release, Artifact, File, Symbol, API, Test, Finding, Evidence, Issue, PR, PR_Packet, Decision, StaleClaim, Person

Required edge types: precedes, produced, fork_of, distributes, has_worktree, checks_out, heads, merged_as, from_fork_head, contains, defines, implemented_in, tests, validates, originates_from, involves, hardens, supported_by, sourced_from, documents, caused_by, authored_by, implements, gates, found_in, investigates, contributes_to
