# SYSTEM-COMPASS-CONTRIBUTION-SPEC.md

**Status:** SPECIFICATION ONLY — source access BLOCKED
**Repository:** `ix-infrastructure/system-compass` (private, inaccessible)
**Fork:** `Alot1z/system-compass` — does NOT exist, cannot be created without access

---

## Access Status (2026-08-10)

| Test | Result |
|---|---|
| `git ls-remote` upstream | 404 — private/inaccessible |
| `git ls-remote` fork | 404 — does not exist |
| `gh api` upstream | HTTP 404 |
| Authenticated account | Alot1z — no access to this repo |
| Resolution path | D-014: request access from KageBinary |

---

## F-Key Contribution

### Expected Behavior
Press `F` or `f` in Compass → fit viewport (same behavior as `0` key).

### Current Evidence (Class B — artifact/runtime)
- Keyboard handler: byte-identical across v0.1.0–v0.3.0
- `0` key already invokes fit-to-viewport
- `F`/`f` never bound in any release
- KeyboardHelp panel: 8 entries, no F entry
- Fit math: 9 constants invariant, contain + snap unchanged

### Intended Implementation (once source accessible)
```
Keyboard handler:   +2 lines (case "f": case "F": → same callback as "0")
KeyboardHelp:       +1 line  ({keys:["F"], label:"Fit view"})
Tests:              +~15 behavioral tests
Total:              ~4 files, <100 lines
```

### Assumptions Requiring Source Verification
- Fit callback name (same function called by `0` key)
- KeyboardHelp component structure (array of {keys, label} objects)
- Test framework (likely same as Ix: vitest + tsc + eslint)

---

## Fit-View Context

### Reviewer Direction (from PR #368)
The PR #368 reviewer stated that fit-view work belongs in `system-compass`, not Ix. The Compass monkey-patch was intentionally stripped from PR #368.

### Relationship to Existing Work
- Compass #57 (fixed in v0.3.0): changed fit from one-shot latch to keyed refit effect
- F-key is a keyboard exposure of existing fit functionality — complementary to #57

### Implementation Prerequisites
1. system-compass source access (D-014)
2. Fork creation
3. Source inspection to confirm callback names and component structure

---

## Auto-Frame — EXPLICITLY EXCLUDED

### Why Not
Compass #57 already covers canvas-change refit in v0.3.0. Adding auto-frame would:
1. Duplicate existing behavior
2. Conflict with the keyed refit effect
3. Add unnecessary complexity to a minimal keyboard addition

### Evidence
- v0.3.0 release notes: "The viewport re-fits when the canvas changes"
- F-key PR scope per D-005: keyboard exposure only

---

## What CAN Be Done Without Access

| Activity | Status |
|---|---|
| F-key specification | ✅ Complete |
| Artifact archaeology (4 releases) | ✅ Complete |
| PoC verification (patched v0.3.0) | ✅ Complete |
| KeyboardHelp extraction | ✅ Complete |
| Fit math extraction | ✅ Complete |
| Test plan | ✅ Complete |
| Access request message | ✅ Prepared (in SYSTEM-COMPASS-ACCESS-PLAN.md) |

## What CANNOT Be Done Without Access

| Activity | Reason |
|---|---|
| Source inspection | Private repo — 404 |
| Fork creation | Cannot fork invisible repo |
| Implementation | No source to modify |
| Testing | No test infrastructure accessible |
| PR creation | No fork, no source, no access |

---

*All specifications based on Class B artifact evidence. No source filenames or line numbers fabricated. No access requested. No maintainer contacted.*
