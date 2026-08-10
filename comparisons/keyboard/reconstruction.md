# Compass Keyboard System — Historical Reconstruction

**Evidence Class:** B (reproducible artifact/runtime)  
**Last Updated:** 2026-08-10

## 1. Keyboard Handler Structure

Across all four artifact versions (v0.1.0, v0.1.1, v0.2.0, v0.3.0), the keyboard handler has the following invariant structure:

```
window.addEventListener("keydown", handler)
    │
    ├── 1. Cmd/Ctrl+K → open command palette (early return)
    │
    ├── 2. enabled gate → if disabled, return
    │
    ├── 3. INPUT/TEXTAREA guard → skip if focus is in an input
    │
    └── 4. Switch on e.key:
        ├── "Escape"  → reset mode / close panel
        ├── "?"       → toggle keyboard shortcuts
        ├── "+"       → zoom in
        ├── "="       → zoom in (same as +)
        ├── "-"       → zoom out
        ├── "0"       → reset zoom & center (fit view)
        ├── "l"       → locate (selected node)
        ├── "L"       → locate (selected node)
        ├── "i"       → impact (selected node)
        └── "I"       → impact (selected node)
```

### Key Invariants

| Property | Status | Evidence |
|----------|--------|----------|
| Handler registered on `window` | **invariant** | Byte-identical across 4 versions |
| `keydown` event (not keyup) | **invariant** | Byte-identical |
| Cmd/Ctrl+K early return | **invariant** | Byte-identical |
| enabled gate | **invariant** | Byte-identical |
| INPUT/TEXTAREA guard | **invariant** | Byte-identical |
| Switch on `e.key` (not keyCode) | **invariant** | Byte-identical |
| F/f unbound | **invariant** | Zero matches in any version |

### The F Key

- **F is genuinely unbound.** Not a single reference to "F" or "f" as a key binding in any of the four artifact versions.
- **No historical conflict.** F has never been assigned to any function.
- **No KeyboardHelp entry for F.** The help panel has never listed an F-key command.
- **PoC verified.** A patched v0.3.0 copy with `case "f":` and `case "F":` both calling the fit-view handler works correctly — the target is byte-identical to the `"0"` key's target.

## 2. KeyboardHelp Panel

The KeyboardHelp component is **byte-identical** across all four artifact versions.

### v0.3.0 Content (verified from artifact extraction)

```javascript
var o = [
  {keys: ["⌘", "K"], label: "Open command palette"},
  {keys: ["Esc"], label: "Reset mode / close panel"},
  {keys: ["?"],  label: "Toggle keyboard shortcuts"},
  {keys: ["L"],  label: "Quick locate (selected node)"},
  {keys: ["I"],  label: "Quick impact (selected node)"},
  {keys: ["+"],  label: "Zoom in"},
  {keys: ["-"],  label: "Zoom out"},
  {keys: ["0"],  label: "Reset zoom & center"}
];
```

Chunk: `KeyboardHelp-KnF66B2h.js` (1,784 bytes, v0.3.0)

### What would change with F-key:

A minimal addition to the KeyboardHelp array:

```javascript
{keys: ["F"], label: "Fit view"}
```

This follows the existing pattern exactly: a single-key binding with a short label. It would appear between the `?` and `L` entries (alphabetical by label), or at the end after `0`.

## 3. Key Binding Summary

| Key | Binding | Since | Purpose |
|-----|---------|-------|---------|
| ⌘/Ctrl + K | Command palette | v0.1.0 | Opens command bar (bypasses all guards) |
| Esc | Reset | v0.1.0 | Reset mode, close panel |
| ? | Help toggle | v0.1.0 | Show/hide keyboard shortcuts |
| + / = | Zoom in | v0.1.0 | `min(2.5, zoom × 1.1)` |
| - | Zoom out | v0.1.0 | `max(fitZoom, zoom × 0.9)` |
| 0 | Fit view | v0.1.0 | Reset zoom & center to fit target |
| l / L | Locate | v0.1.0 | Quick locate selected node |
| i / I | Impact | v0.1.0 | Quick impact selected node |
| **F / f** | **Fit view** | **proposed** | **Same target as 0** |

## 4. Safety Analysis

| Concern | Verdict | Evidence |
|---------|---------|----------|
| Would F conflict with existing binding? | No | F never bound in any version |
| Would F break existing keyboard flow? | No | Same guard chain as all other keys |
| Would F work in INPUT/TEXTAREA? | Correctly blocked | INPUT/TEXTAREA guard already present |
| Would F change 0 behavior? | No | Separate case, same target |
| Would F need new camera state? | No | Reuses existing fitZoom/fitPan |
| Would F break Cmd/Ctrl+K? | No | Early return before switch |
| Would F break escape? | No | Separate case |

## 5. Implementation Shape (Class C Reconstruction)

Based on the invariant keyboard system pattern and the verified PoC:

```typescript
// In the switch statement (after the "0" case):
case "f":
case "F":
    onFitView();  // Same callback as "0" key
    break;
```

```typescript
// In KeyboardHelp, add:
{keys: ["F"], label: "Fit view"}
```

This is the minimal change. No new camera system, no duplicate fit math, no DOM patches.

## 6. Evidence Limitations

- **No source access:** The exact component file, function name, and import path in `system-compass` are unknown.
- **KeyboardHelp byte-identical:** Only verified for v0.3.0 via extraction. Prior investigation compared all four versions.
- **PoC verified:** Patch applied to extracted v0.3.0 artifact. Live tested: F key triggers same behavior as 0 key.
