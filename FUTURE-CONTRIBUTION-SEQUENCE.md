# FUTURE-CONTRIBUTION-SEQUENCE.md

**Generated:** 2026-08-10 (Contribution Readiness Gate)
**Status:** READ-ONLY plan — describes what should happen LATER, does not execute it

---

## Phase-by-Phase Sequence

### Phase A: Foundation (can be done NOW, no external contact)

| Step | Action | Repository | Prerequisite | Status |
|---|---|---|---|---|
| A-1 | Sync fork main: fast-forward `0437abf` → `c4f8fea` | Alot1z/Ix | User authorization | **READY** |
| A-2 | Push remap branch: `c021b52` → `fork/feat/ix-remap-hardening` | Alot1z/Ix | A-1 complete | **READY** |
| A-3 | Commit Ix-findings: initial commit of 165 files | Ix-findings (local) | None | **READY** |
| A-4 | Verify Ix-test worktree remains clean and reproducible | Ix-test (local) | None | **READY** |

### Phase B: Ix Contribution (after Phase A)

| Step | Action | Repository | Prerequisite | Status |
|---|---|---|---|---|
| B-1 | Open remap PR: `feat/ix-remap-hardening` → `ix-infrastructure/Ix:main` | Ix upstream | A-2 complete, user authorization | **AWAITING AUTH** |
| B-2 | Tag reviewers: @josephismikhail (code owner), mention @KageBinary (view.ts domain) | GitHub PR | B-1 | **SPECIFIED** |
| B-3 | Determine #376 approach with maintainer | Ix issue #376 | B-1 (establishes contributor credibility) | **NEEDS MAINTAINER** |
| B-4 | Implement #376 fix (Option A: stamp dist version) | Ix fork → upstream | B-3 complete | **SPEC READY** |
| B-5 | Determine #371 disposition (OSS vs Pro) with maintainer | Ix issue #371 | B-1 | **NEEDS MAINTAINER** |
| B-6 | Implement #371 fix (register or delete patches.ts) | Ix fork → upstream | B-5 complete | **SPEC READY** |

### Phase C: System-Compass Foundation (gated on D-014)

| Step | Action | Repository | Prerequisite | Status |
|---|---|---|---|---|
| C-1 | Request system-compass access from KageBinary | GitHub (PR #368 thread or discussion) | User authorization | **BLOCKED (D-014)** |
| C-2 | Create Alot1z/system-compass fork | GitHub | C-1 complete | **BLOCKED** |
| C-3 | Clone fork locally | Local disk | C-2 complete | **BLOCKED** |
| C-4 | Create worktree: `feat/f-key-fit-view` based on `main` | Local worktree | C-3 complete | **BLOCKED** |
| C-5 | Inspect keyboard handler source — confirm fit callback | Source read | C-4 complete | **BLOCKED** |
| C-6 | Inspect KeyboardHelp component | Source read | C-4 complete | **BLOCKED** |
| C-7 | Inspect test infrastructure | Source read | C-4 complete | **BLOCKED** |

### Phase D: F-Key Contribution (after Phase C)

| Step | Action | Repository | Prerequisite | Status |
|---|---|---|---|---|
| D-1 | Implement F-key: +2 lines keyboard handler, +1 line KeyboardHelp | system-compass fork | C-7 complete | **BLOCKED** |
| D-2 | Write 15 behavioral tests | system-compass fork | D-1 complete | **BLOCKED** |
| D-3 | Run full test suite, verify zero regressions | Local | D-2 complete | **BLOCKED** |
| D-4 | Verify diff <100 lines | Local | D-3 complete | **BLOCKED** |
| D-5 | Push to fork | Alot1z/system-compass | D-4 complete | **BLOCKED** |
| D-6 | Open PR against ix-infrastructure/system-compass:main | GitHub | D-5 complete, user authorization | **BLOCKED** |
| D-7 | Tag @KageBinary, reference v0.3.0 release notes, reference artifact archaeology | GitHub PR | D-6 | **SPECIFIED** |

### Phase E: Delayed-Data Contribution (after Phase D)

| Step | Action | Repository | Prerequisite | Status |
|---|---|---|---|---|
| E-1 | Inspect region rollup / aggregation source | system-compass source | C-3 complete | **BLOCKED** |
| E-2 | Inspect camera fit lifecycle source | system-compass source | C-3 complete | **BLOCKED** |
| E-3 | Determine root cause in source (classify as A from C/D) | Analysis | E-1, E-2 | **BLOCKED** |
| E-4 | Propose fix approach to maintainer before implementing | GitHub issue | E-3 complete | **BLOCKED** |
| E-5 | Implement fix per maintainer direction | system-compass fork | E-4 complete | **BLOCKED** |
| E-6 | Write reproduction test (delayed /v1 → visible graph) | system-compass fork | E-5 complete | **BLOCKED** |
| E-7 | Open separate PR (not combined with F-key — D-006) | GitHub | E-6 complete | **BLOCKED** |

### Phase F: Zoom Anomaly Resolution (after Phase C)

| Step | Action | Repository | Prerequisite | Status |
|---|---|---|---|---|
| F-1 | Inspect zoom control source | system-compass source | C-3 complete | **BLOCKED** |
| F-2 | Determine if ×1.25 observation matches source or is an artifact | Analysis | F-1 | **BLOCKED** |
| F-3 | If source says ×1.1: update F-013 to CONFIRMED (source-proven) | Investigation | F-2 | **BLOCKED** |
| F-4 | If source says ×1.25: update F-013 to CONTRADICTED (constants wrong) | Investigation | F-2 | **BLOCKED** |

---

## Dependency Graph

```
Phase A (Foundation) ─────────────────────────────────────────┐
  ├── A-1 (sync fork main)                                    │
  ├── A-2 (push remap)                                        │
  ├── A-3 (commit Ix-findings)                                │
  └── A-4 (verify Ix-test)                                    │
         │                                                     │
         ▼                                                     │
Phase B (Ix Contribution) ────────────────────────────────────┤
  ├── B-1 (open remap PR) ─── B-2 (tag reviewers)             │
  ├── B-3 (determine #376) ─── B-4 (fix #376)                 │
  └── B-5 (determine #371) ─── B-6 (fix #371)                 │
                                                               │
Phase C (system-compass Foundation) ── GATED ON D-014 ────────┤
  ├── C-1 (request access)                                    │
  ├── C-2 (create fork)                                       │
  ├── C-3 (clone locally)                                     │
  ├── C-4 (create worktree)                                   │
  ├── C-5–C-7 (source inspection)                             │
         │                                                     │
         ├── Phase D (F-Key) ─── SPEC READY                   │
         ├── Phase E (Delayed-Data) ─── INVESTIGATION READY   │
         └── Phase F (Zoom) ─── LOW PRIORITY                  │
```

---

## What Must NOT Happen

| Action | Reason |
|---|---|
| Combine F-key with delayed-data in one PR | D-006: different root causes, different reviews |
| Add auto-frame or drill reframe to F-key | D-005: duplicates Compass #57 |
| Modify ix-compass-dist | D-007: distribution channel, never modified |
| Push feat/ix-agent-skill (dirty branch) | 14 uncommitted changes, active development |
| Open PR for #376 without maintainer direction | Approach (Option A vs B) needs maintainer input |
| Open PR for #371 without OSS vs Pro decision | Maintainer must decide disposition |

---

## Sequence Rationale

1. **Remap first**: It's the most complete, most tested contribution. Establishes the contributor as credible before proposing more complex changes (#376, #371).
2. **#376/#371 after remap**: These need maintainer direction. Opening the remap PR first creates a natural channel for asking about these issues.
3. **F-key after system-compass access**: The spec is ready but implementation requires source. The F-key change is minimal (~4 files, <100 lines) — the lowest-risk way to enter the system-compass codebase.
4. **Delayed-data after F-key**: More complex fix, needs source-level root cause confirmation. Separate PR per D-006.
5. **Zoom last**: Low confidence (Class D), low severity (P3). May resolve to "no action" after source inspection.

---

*This sequence is a plan, not an execution log. No steps have been performed. No maintainers have been contacted. No PRs have been opened.*
