# PR Packet — Compass F-Key Fit View

- **Proposed title:** feat(keyboard): add F key for fit-to-viewport
- **Repository:** ix-infrastructure/system-compass (private)
- **Target branch:** main
- **Source branch:** feat/f-key-fit-view
- **Base:** main @ 7f98724 (per v0.3.0 release)
- **Remote status:** BLOCKED — no source access. Specification only.

**Status:** SPECIFICATION READY — blocked on source access  
**Target repo:** `ix-infrastructure/system-compass` (private)  
**Proposed branch:** `feat/f-key-fit-view`  
**Base:** `main` @ `7f98724` (per v0.3.0 release)

---

## 1. Summary

Add `F`/`f` keyboard shortcut to invoke the existing fit-to-viewport behavior in
Compass. This is a **pure keyboard exposure** of existing functionality — the
`0` key already invokes the same fit target and has done so since v0.1.0. No
new camera math, no new state, no lifecycle changes.

## 2. Blockers

| Blocker | Status |
|---------|--------|
| system-compass source access | **BLOCKED** — private repo, 404 on GitHub, no local checkout |
| GitHub credentials with Contents:read on system-compass | Unknown — COMPASS_TOKEN exists in Ix CI but not locally |

**This packet is a complete implementation specification.** When source access
becomes available, any developer can implement this PR by following the
specification below — no archaeology or reconstruction needed.

## 3. Evidence Summary

### Keyboard System (Class B — all four artifacts)

The keyboard handler is byte-identical across v0.1.0, v0.1.1, v0.2.0, v0.3.0:

```
Structure:
  window.addEventListener("keydown", handler)
    → Cmd/Ctrl+K → early return (command palette)
    → enabled gate → return if disabled
    → INPUT/TEXTAREA guard → return if focus in input
    → switch(e.key):
        "Escape" → reset mode / close panel
        "?"      → toggle keyboard shortcuts
        "+", "=" → zoom in
        "-"      → zoom out
        "0"      → reset zoom & center (FIT VIEW)
        "l", "L" → quick locate
        "i", "I" → quick impact
```

### KeyboardHelp Content (Class B — byte-identical, v0.3.0 extracted)

```javascript
var o = [
  {keys: ["⌘", "K"], label: "Open command palette"},
  {keys: ["Esc"],   label: "Reset mode / close panel"},
  {keys: ["?"],     label: "Toggle keyboard shortcuts"},
  {keys: ["L"],     label: "Quick locate (selected node)"},
  {keys: ["I"],     label: "Quick impact (selected node)"},
  {keys: ["+"],     label: "Zoom in"},
  {keys: ["-"],     label: "Zoom out"},
  {keys: ["0"],     label: "Reset zoom & center"}
];
```

Source: `KeyboardHelp-KnF66B2h.js` (1,784 bytes, extracted from `compass-0.3.0.tar.gz`)

### F-Key Status (Class B)

- **F never bound** in any of the four artifact versions (zero grep matches)
- **f never bound** (zero matches)
- **No KeyboardHelp entry for F** in any version
- **No historical conflict** — F has never been assigned to any function

### Fit Math Invariant (Class B — v0.3.0 verified)

| Constant | Value | Confirmed in v0.3.0 |
|----------|-------|---------------------|
| Placeholder width | 1200 | ✓ (3 occurrences) |
| Placeholder height | 700 | ✓ (5 occurrences) |
| Chrome height | 56 | ✓ (2 occurrences) |
| Sidebar width | 112 | ✓ (1 occurrence) |
| Offset | 36 | ✓ (5 occurrences) |
| Readable cap | 1.25 | ✓ (4 occurrences) |
| Max zoom | 2.5 | ✓ (19 occurrences) |
| Zoom-in multiplier | 1.1 | ✓ (1 occurrence) |
| DPI constant | 96 | ✓ (1 occurrence) |

### Zoom Contract (Class B — live-verified)

```
Zoom in:  min(2.5, currentZoom × 1.1)
Zoom out: max(fitZoom, currentZoom × 0.9)
Snap:     round(value × precision) / precision
```

### #57 Lifecycle (Class A — from v0.3.0 release notes by KageBinary, 2026-08-09)

> *"The viewport re-fits when the canvas changes. The fit used to run once against
> the 1200×700 placeholder and latch, so the map rendered blank until something
> else re-centred it."* — system-compass #57

This confirms:
1. v0.2.0 and earlier: one-shot latch against placeholder
2. v0.3.0: keyed refit effect — fit re-runs when canvas changes
3. The F-key targets v0.3.0's refit-aware camera state

### PoC Verification (Class B)

A patched v0.3.0 copy was tested:
- `F` key → same byte-identical target as `0` key
- INPUT/TEXTAREA guard holds (F ignored in input fields)
- All other keys unchanged (⌘K, Esc, +, -, 0, L, I)
- Zero console errors

## 4. Implementation Specification

### 4.1 Keyboard Handler

In the keyboard `switch` statement (conceptually after the `"0"` case):

```typescript
case "f":
case "F":
    onFitView();  // Same callback as "0" key
    break;
```

The exact function name (`onFitView`, `handleFitView`, `resetZoom`, etc.) must
be determined from actual source. It is the same function called by the `"0"`
case.

### 4.2 KeyboardHelp

Add one entry to the KeyboardHelp array, following the existing pattern:

```typescript
{keys: ["F"], label: "Fit view"}
```

Suggested placement: after `{keys: ["0"], label: "Reset zoom & center"}` since
it is a related action, or at the end of the array.

### 4.3 What NOT to Do

| Don't | Why |
|-------|-----|
| Create a `CameraStore` | Camera state already exists in the app — the `0` key uses it |
| Duplicate fit math | The `0` key already has a working fit callback |
| Add mount auto-fit | #57 already handles refit on canvas change in v0.3.0 |
| Add drill auto-fit | Out of scope — drill changes are a separate concern |
| Add DOM transforms or CSS zoom patches | The existing camera system handles zoom/pan |
| Add timers or setTimeout | The existing fit runs synchronously |
| Change any existing key binding | Zero modifications to `0`, Esc, +, -, L, I, ⌘K |
| Change INPUT/TEXTAREA guard | Already correct — F will be ignored in inputs |
| Change enabled gate | Already correct — F will be ignored when disabled |

### 4.4 Architectural Target

```
existing Compass camera state
        │
        ├── "0" key → setZoom(fitZoom) + setPan(fitPan)
        │
        └── "F"/"f" key → same call ──────┘
```

NOT:

```
new CameraStore → duplicate camera system → duplicate fit math
```

## 5. Test Plan

| # | Test | Expected |
|---|------|----------|
| 1 | Press F | Camera moves to fit target (same as pressing 0) |
| 2 | Press f | Same behavior as F |
| 3 | Press F while focus in `<input>` | No action (INPUT guard) |
| 4 | Press F while focus in `<textarea>` | No action (TEXTAREA guard) |
| 5 | Press 0 | Unchanged behavior |
| 6 | Press ⌘/Ctrl+K | Unchanged — opens command palette |
| 7 | Press Esc | Unchanged — resets mode |
| 8 | Press + | Unchanged — zooms in |
| 9 | Press - | Unchanged — zooms out |
| 10 | Press L | Unchanged — quick locate |
| 11 | Press I | Unchanged — quick impact |
| 12 | Repeated F | Stable — idempotent (already at fit, no change) |
| 13 | Drill into a node, then press F | Fits to current drill view |
| 14 | Resize browser window, then press F | Fits to new viewport dimensions |
| 15 | Open KeyboardHelp (? key) | Shows "F — Fit view" entry |

## 6. Files To Change (Estimated)

| File | Change | Lines |
|------|--------|-------|
| Keyboard handler component | Add `case "f": case "F":` | +2 |
| KeyboardHelp component | Add F entry to array | +1 |
| Keyboard handler test | 15 behavioral tests | +~80 |
| KeyboardHelp test | Verify F entry rendered | +~10 |

**Total estimated: 4 files, ~93 lines.**

## 7. Repository State

| Attribute | Value |
|-----------|-------|
| Repository | `ix-infrastructure/system-compass` |
| Visibility | **Private** — not accessible |
| v0.3.0 source rev | `main` @ `7f98724` |
| Local checkout | **None** |
| GitHub access | **404 — no access** |

## 8. Reviewer Notes

- **Tag @KageBinary** when PR is opened — released v0.3.0, authored the #57 fix, active Ix collaborator
- **Reference the v0.3.0 release notes** — they are Class A evidence for the fit lifecycle
- **Mention the artifact archaeology** briefly: "The keyboard handler and KeyboardHelp are byte-identical across 4 releases; F has never been bound; the 0 key already invokes the same fit target"
- **Keep it minimal** — this is a 2-line code change plus tests. If the PR diff exceeds ~100 lines, it's too large

## 9. Related Work

| Item | Relationship |
|------|-------------|
| system-compass #57 | v0.3.0 fix for fit latch — enables safe F-key addition |
| system-compass #58, #59 | Referenced in v0.3.0 release notes — separate concerns |
| ix-compass-dist v0.3.0 | The artifact this specification is built against |
| Ix #376 | Version-series mismatch in upgrade — separate repo, separate concern |
| Ix remap PR | Loopback-hardened `/__ix/remap` endpoint — separate repo, separate concern |
| Ix #371 | Dead patches command — separate repo, separate concern |

## 10. Authorization Gates

| Gate | Status |
|------|--------|
| Source access | ❌ Blocked |
| Local checkout | ❌ No |
| Implementation | ❌ Cannot proceed |
| Push branch | ❌ Not yet |
| Open PR | ❌ Not yet |
| Merge | ❌ Not yet |

---

*All evidence classified. No source filenames or line numbers fabricated. No
GitHub activity fabricated. Specification ready to hand to any developer with
system-compass source access.*
