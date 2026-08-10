# Compass — Keyboard & KeyboardHelp

## Handler structure (ARTIFACT — byte-identical across all 4 releases)

```
window.addEventListener("keydown", handler)
  → Cmd/Ctrl+K  → early return (command palette; preventDefault)
  → enabled gate → return if disabled
  → INPUT/TEXTAREA tagName guard → return
  → switch(e.key):
      "Escape" → reset mode / close panel
      "?"      → toggle keyboard help
      "+","="  → zoom in
      "-"      → zoom out
      "0"      → jump to fit target (setZoom(k.fitZoom); setPan(k.fitPan))
      "l","L"  → quick locate
      "i","I"  → quick impact
```

## KeyboardHelp content (ARTIFACT — extracted `KeyboardHelp-KnF66B2h.js`, 1,784 B)

| Keys | Label |
|---|---|
| ⌘ K | Open command palette |
| Esc | Reset mode / close panel |
| ? | Toggle keyboard shortcuts |
| L | Quick locate (selected node) |
| I | Quick impact (selected node) |
| + | Zoom in |
| − | Zoom out |
| 0 | Reset zoom & center |

**F/f: UNBOUND in every release (ARTIFACT — zero matches). No KeyboardHelp F
entry ever (ARTIFACT).**

## F-key change (spec — RECONSTRUCTION, needs source confirmation)

1. In the existing switch, after the tagName guard: `case "f": case "F":
   onFitView(); break;` — same callback as `0`.
2. Callback mirrors `0`: `setZoom(fitTarget.fitZoom); setPan(fitTarget.fitPan);`
   — reuse the memoized fit target; no new math, no animation.
3. KeyboardHelp: `{ keys: ["F"], label: "Fit view" }`.

**Explicitly NOT:** mount auto-frame, drill reframe (both duplicate #57 —
SUPERSEDED S-032/S-033), CameraStore, DOM patches, timers, new guards.

## Test plan (for when source access exists — 15 points)

F/f trigger; target ≡ 0-key target; ignored in INPUT/TEXTAREA; ⌘K/Esc/+/−/0/L/I
unchanged; repeated F stable; F after drill uses current fit target; KeyboardHelp
shows F; regression guard that no auto-frame was added.
