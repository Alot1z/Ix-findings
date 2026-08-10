# SYSTEM-COMPASS-ACCESS-PLAN.md

**Generated:** 2026-08-10 (Contribution Readiness Gate)
**Status:** READ-ONLY analysis — no actions performed

---

## 1. Current State

| Fact | Classification |
|---|---|
| `ix-infrastructure/system-compass` is private | **VERIFIED** — `git ls-remote` returns 404 |
| `Alot1z/system-compass` does not exist | **VERIFIED** — `git ls-remote` returns 404 |
| No local clone of system-compass exists | **VERIFIED** — filesystem search negative |
| Compiled artifacts exist (ix-compass-dist, `~/.ix/cli/compass/`) | **VERIFIED** — distribution only, no source |
| KageBinary is the system-compass maintainer | **VERIFIED** — v0.3.0 release notes, GitHub activity |
| Reviewer said fit-view belongs in system-compass | **VERIFIED** — PR #368 review feedback |

---

## 2. Why a system-compass Fork IS Necessary

1. **Reviewer direction**: The PR #368 reviewer explicitly stated that fit-view work belongs in `system-compass`, not Ix. Contributing to Ix would be redirected.

2. **Correct target**: Findings F-001 through F-007 and F-013 all target system-compass internals. The F-key addition, delayed-data fix, and zoom investigation cannot be addressed without source access.

3. **No workaround**: The compiled artifacts (ix-compass-dist) are minified/bundled. Byte-diffs and runtime probes can confirm behavior but cannot produce a source-level PR. Class B/D evidence is not sufficient for contribution.

4. **Separate contribution streams**: Ix changes (remap, #376, #371) target `ix-infrastructure/Ix`. Compass changes (F-key, delayed-data) target `ix-infrastructure/system-compass`. These are independently reviewable, independently mergeable contributions.

---

## 3. What Access/Authorization Would Be Required

| Requirement | Status |
|---|---|
| GitHub account with `Contents:read` on system-compass | **UNKNOWN** — user must verify |
| Fork creation permission | **UNKNOWN** — depends on org settings |
| Maintainer approval for external contribution | **REQUIRED** — KageBinary is the gate |
| `COMPASS_TOKEN` or equivalent CI secret | **NOT REQUIRED** for source-level contribution |

---

## 4. What Must Be Known Before Creating the Fork

| Question | Answer |
|---|---|
| Is system-compass open to external contributions? | Ask KageBinary (D-014) |
| What is the contribution workflow? | Likely fork → PR, same as Ix |
| What is the default branch? | `main` (per v0.3.0 release reference `@ 7f98724`) |
| What is the current HEAD? | Unknown until access granted |
| What build/test infrastructure exists? | Unknown — possibly similar to Ix (tsc, vitest, eslint) |
| What are the coding conventions? | Unknown — inferred from compiled artifacts |

---

## 5. What Exact Source Would Need to Be Inspected

### For F-Key (F-001–F-005):
| File/Component | Why |
|---|---|
| Keyboard handler component | Add `case "f": case "F":` |
| KeyboardHelp component | Add F entry to shortcuts array |
| Camera/fit utility | Confirm existing fit callback name and signature |
| Keyboard handler tests | Add 15 behavioral tests |
| KeyboardHelp tests | Verify F entry rendered |

### For Delayed-Data (F-006, F-007):
| File/Component | Why |
|---|---|
| Region rollup / aggregation logic | Fix timing dependency |
| Camera fit lifecycle | Investigate refit effect keys |
| Data loading pipeline | Understand when data is considered "complete" |
| Canvas measurement path | Determine getBoundingClientRect vs offsetWidth usage |

### For Zoom Anomaly (F-013):
| File/Component | Why |
|---|---|
| Zoom control code | Verify ×1.25 vs ×1.1 discrepancy |
| Fit constant definitions | Confirm 9 extracted constants |

---

## 6. What Exact Changes Would Likely Be Required

### F-Key (minimal, ~4 files, ~93 lines):
```
Keyboard handler:   +2 lines (case "f": case "F":)
KeyboardHelp:       +1 line  (F entry)
Handler tests:      +~80 lines (15 tests)
Help tests:         +~10 lines
```

### Delayed-Data (investigation only — fix scope TBD):
```
Rollup timing fix:  unknown scope until source inspectable
Zoom floor:         unknown scope
Content-aware fit:  unknown scope
```

### Zoom Anomaly (validation only — may be no-op):
```
Verify ×1.25 in source matches or doesn't match observation
```

---

## 7. What Tests Would Need to Exist

### F-Key:
- 15 behavioral tests (defined in PR packet specification)
- KeyboardHelp rendering test
- Zero regression on existing key bindings (0, Esc, +, -, L, I, ⌘K)

### Delayed-Data:
- Delayed `/v1` response → visible graph (reproduction test)
- Fast data → unchanged behavior (regression test)
- Zoom floor guard (unit test if implemented)

---

## 8. Minimal Future Workflow

```
1. User requests system-compass access from KageBinary
   (via PR #368 comment thread or direct message)
2. Access granted → fork becomes visible/creatable
3. Create Alot1z/system-compass fork (GitHub UI or API)
4. Clone fork locally
5. Create dedicated worktree: feat/f-key-fit-view
6. Inspect keyboard handler source → confirm fit callback name
7. Implement: +2 lines keyboard, +1 line KeyboardHelp
8. Write 15 tests
9. Run full test suite
10. Push to fork
11. Open PR against ix-infrastructure/system-compass
    - Tag @KageBinary
    - Reference v0.3.0 release notes
    - Reference artifact archaeology evidence
    - Keep diff <100 lines
12. Await review
```

**This workflow is specified, not executed. No step has been performed.**

---

## 9. What Can Be Done WITHOUT Source Access

| Activity | Status |
|---|---|
| F-key specification | ✅ COMPLETE (pr-packets/compass-f-key/README.md) |
| Delayed-data investigation | ✅ COMPLETE (pr-packets/compass-delayed-data/README.md) |
| Artifact archaeology (4 releases) | ✅ COMPLETE (F-001–F-005) |
| PoC verification (patched v0.3.0) | ✅ COMPLETE |
| KeyboardHelp extraction | ✅ COMPLETE |
| Fit math constant extraction | ✅ COMPLETE |
| Zoom contract measurement | ✅ COMPLETE |
| Prepare access request message | ✅ CAN BE DONE NOW |
| Implement source changes | ❌ BLOCKED |
| Write source-level tests | ❌ BLOCKED |
| Open PR | ❌ BLOCKED |

---

## 10. Access Request Preparation

### Recommended approach (per D-014):
Ask KageBinary in the PR #368 comment thread (or via GitHub discussion if #368 is locked). KageBinary offered to review further Compass work and is the primary system-compass maintainer.

### Suggested message template:

> @KageBinary — I'd like to contribute a small keyboard addition to Compass (F key for fit-to-viewport, reusing the existing fit target from the `0` key — just a keyboard exposure, no new camera math). The reviewer on #368 mentioned this belongs in system-compass rather than Ix. Could I get access to the system-compass repo to prepare a PR? Happy to follow whatever contribution workflow you prefer.

**This message has NOT been sent. Do NOT send it without explicit user authorization.**

---

## 11. Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| Access denied | Medium | All work is spec-ready; can be handed to any developer with access |
| system-compass uses unexpected framework | Low | Compiled artifacts suggest React + bundler; consistent with Ix ecosystem |
| F-key callback name differs from spec assumption | Low | Spec identifies the callback by behavior (same as `0` key), not by name |
| Contributor workflow differs from Ix | Medium | Ask KageBinary for guidance when access is granted |
| #57 already covers the F-key need in maintainer's view | Low | F-key is a keyboard exposure of existing fit, not new fit logic; complementary to #57 |

---

*All analysis is speculative beyond public evidence. No source filenames or line numbers are fabricated. No access has been requested. No fork has been created. No maintainer has been contacted.*
