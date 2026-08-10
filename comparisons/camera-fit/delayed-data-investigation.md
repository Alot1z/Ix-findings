# Delayed-Data Deep Investigation

**Date:** 2026-08-10  
**Artifact:** v0.3.0 (SHA256: `7ed6cc82fe58b3ad…`)  
**Preview:** `http://localhost:8099/`  
**Evidence Class:** B (reproducible artifact/runtime) + direct interactive probing

## 1. Live Reproduction Confirmed

The delayed-data condition is **live right now** on the preview. Key measurements:

| Property | Value | Source |
|----------|-------|--------|
| CSS zoom (`.ix-crisp-canvas`) | **0.441** | `crispCanvas.style.zoom` |
| Canvas natural width | **78,820 px** | `crispCanvas.offsetWidth` |
| Canvas natural height | **78,023 px** | `crispCanvas.offsetHeight` |
| Canvas visual width (zoomed) | 34,760 px | `crispCanvas.getBoundingClientRect().width` |
| Viewport width | 535 px | `window.innerWidth` |
| Viewport height | 988 px | `window.innerHeight` |
| Available width (viewport - sidebar - padding) | **351 px** | 535 − 112 − 2×36 |
| Available height (viewport - chrome - padding) | **860 px** | 988 − 56 − 2×36 |
| Correct fit zoom | **0.00445** | min(351/78820, 860/78023, 1.25) |
| Node count | **15** | All `cursor-pointer` divs in canvas |
| Node span | **78,600 × 77,783** | min/max of all node positions |
| Aggregation | **None** | 15 individual nodes, no rollup region |
| Nodes visible | **No** | `getBoundingClientRect()` returns empty rects |

## 2. Interactive Experiments

### Experiment 1: Manual zoom change

```
Before: zoom = 0.441
Action: crispCanvas.style.zoom = '0.01'
After:  zoom = 0.01
```

**Result:** Zoom stayed at 0.01. React did NOT re-fit. The refit effect either
doesn't watch the `zoom` style property directly, or the DOM manipulation
bypassed React's state management.

### Experiment 2: Window resize event

```
Before: zoom = 0.441
Action: window.dispatchEvent(new Event('resize'))
After:  zoom = 0.441 (unchanged, 500ms wait)
```

**Result:** No change. The refit effect either doesn't watch resize events, or
needs a genuine viewport dimension change (not just an event dispatch).

### Experiment 3: App's own zoom control (Zoom In button click)

```
Before: zoom = 0.441
Action: Click "Zoom in" button
After:  zoom = 0.551 (= 0.441 × 1.25)
```

**Result:** The app's zoom machinery works. Zoom increased to 0.551. But the fit
did NOT reset — the zoom moved away from the placeholder fit, not toward the
correct fit.

**Finding:** The zoom-in multiplier appears to be ×1.25 in this version, not
×1.1 as previously documented. (0.441 × 1.25 = 0.55125, rounds to 0.551.)

### Experiment 4: Computed fit zoom

```
Available width:  351 px
Available height: 860 px
Canvas natural W: 78,820 px
Canvas natural H: 78,023 px
Fit zoom:         min(351/78820, 860/78023, 1.25)
                = min(0.00445, 0.01102, 1.25)
                = 0.00445
```

At fit zoom 0.00445, each 300px-wide node would render at 1.33 pixels —
invisible. This is the same "1.3px" the v0.3.0 release notes describe for the
pre-#57 behavior.

## 3. Competing Explanations Analyzed

### Theory A: CSS-zoomed bounding rectangle self-reference ⚠️ PARTIALLY SUPPORTED

**Claim:** The fit viewport measurement uses a CSS-zoomed bounding rect,
creating a self-referencing cycle.

**Test:** If the viewport measurement used the zoomed coordinate space, at zoom
0.441, the effective available width would be 351/0.441 ≈ 796 px. Then fit zoom
= 796/78820 ≈ 0.0101. But the actual zoom is 0.441, not 0.0101.

**Verdict:** Does NOT explain why zoom stays at 0.441. The refit effect should
produce a different (smaller) value even under this theory.

### Theory B: Refit effect doesn't fire for this canvas change ✅ STRONG

**Claim:** The v0.3.0 refit effect watches canvas dimensions but the canvas
dimensions don't change in the way the effect expects.

**Test:** Canvas offsetWidth is 78,820 before and after data arrival (the
Fruchterman-Reingold layout produces the same sized canvas regardless of whether
aggregation happened). If the effect keys on canvas width/height and they don't
change, the effect doesn't re-run.

**Verdict:** Plausible. The canvas was already sized for the full layout from
the start. The placeholder dimensions (1200×700) might be separate from the
canvas element's actual dimensions. Need source access to confirm.

### Theory C: Timing-dependent region rollup causes sparse canvas ✅ CONFIRMED

**Claim:** The delayed data prevents region rollup, producing 15 individual
nodes on a 78,600px canvas. Even with correct fit zoom (0.004), everything is
invisible.

**Test:** 
- Fast data: 9 cards + 1 aggregate → compact canvas → visible at reasonable zoom
- Delayed data: 15 cards + no aggregate → 78,600px canvas → invisible at correct fit zoom

**Verdict:** **CONFIRMED.** This is the primary mechanism. The v0.3.0 release
notes confirm: "Fit zoom 0.0044 → 0.184" — the improvement came from
aggregation (1,471→33), not from a change to the fit math.

### Theory D: Mount-timing instability ✅ OBSERVED

**Claim:** Placeholder fit varies between runs (0.439 vs 0.441).

**Test:** The current run shows 0.441. Prior investigation observed 0.439 in
v0.2.0 and 0.441 in v0.3.0. The 0.002 difference is small but real.

**Verdict:** **CONFIRMED** as observation but mechanism unknown. Could be
viewport measurement racing with DOM layout during initial mount.

## 4. Root Cause (Class C Reconstruction)

The delayed-data blank has **two interacting causes:**

### Primary: Timing-Dependent Region Rollup

```
Data arrives quickly
    → Region rollup runs with complete data
    → 9 cards → 1 aggregate
    → Canvas: manageable size
    → Fit zoom: reasonable (~0.13)
    → Graph visible ✓

Data arrives slowly (~60s)
    → Region rollup runs BEFORE data is complete
    → 15 individual cards, no aggregate
    → Canvas: 78,600 × 77,783 px (full Fruchterman-Reingold layout)
    → Fit zoom: ~0.004
    → Nodes: 1.3px wide
    → Graph invisible ✗
```

### Secondary: Refit Effect Doesn't Recover

The v0.3.0 #57 fix (keyed refit effect) should re-fit when the canvas changes.
But:

1. The canvas dimensions (offsetWidth/offsetHeight) may not change
   significantly because the Fruchterman-Reingold layout produces a similar-
   sized canvas regardless of aggregation.
2. The effect keys might not include the specific property that changed.
3. Even if the effect fires, the computed fit zoom for 15 un-aggregated nodes
   on a 78,600px canvas is 0.004 — still invisible.

## 5. Evidence Summary

| Finding | Class | Method |
|---------|-------|--------|
| Zoom stuck at 0.441 with loaded data | B | Live preview probing |
| 15 individual nodes, no aggregation | B | DOM query |
| 78,600 × 77,783 px node span | B | Node position extraction |
| Correct fit zoom = 0.00445 | B | Constant-based calculation |
| Zoom-in multiplier = ×1.25 (not ×1.1) | B | Click experiment |
| App zoom machinery functional | B | Zoom-in button click |
| Window resize doesn't trigger refit | B | Event dispatch test |
| Rollup timing dependency | B | Comparison with fast-data observation |
| Self-referencing measurement theory | C | Not confirmed by interactive tests |
| Exact effect dependency keys | D | Requires source access |

## 6. Relationship to v0.3.0 Release Notes

The v0.3.0 release notes (Class A) describe the fix as:

> "The viewport re-fits when the canvas changes. The fit used to run once against
> the 1200×700 placeholder and latch, so the map rendered blank until something
> else re-centred it."

And:

> "1,471 root regions aggregate to 33... Fit zoom 0.0044 → 0.184."

These confirm that the primary fix was **aggregation** (making the canvas
smaller) plus **refit triggering** (re-running fit when canvas changes). The
delayed-data finding shows that:

1. The aggregation is timing-dependent — it doesn't always run
2. When aggregation doesn't run, even the refit produces an invisible graph
3. The fit zoom math is correct — it's working as designed, but the input
   (canvas size) is wrong because aggregation failed

## 7. Potential Fix Directions

### Option 1: Make rollup independent of data-load timing

Run rollup after data is complete, not during initial load. This addresses the
primary cause.

### Option 2: Fallback zoom floor

Set a minimum zoom level (e.g., 0.05) so that even with a sparse canvas,
individual nodes remain visible. This is a safety net.

### Option 3: Center on visible content

When the fit zoom would make nodes invisible, instead center on the centroid of
visible nodes at a readable zoom. This is a heuristic improvement.

### Option 4: Progressive aggregation

Aggregate incrementally as data arrives, rather than all-or-nothing. This
prevents the "no aggregation" gap.

**None of these can be implemented without source access.** All are speculative
fix directions — the actual implementation must follow the existing code
architecture.

## 8. Data Collected

```
nodeCount: 15
nodeSpan:  { minX: 60, minY: 60, maxX: 78660, maxY: 77843 }
canvas:    offsetWidth=78820, offsetHeight=78023
zoom:      0.441
viewport:  535×988
avail:     351×860
fitZoom:   0.00445
```

```
Node positions (sample of 5):
  (77992, 25850) — far right, upper mid
  (13284, 70269) — left, near bottom
  (78360, 50830) — far right, center
  (60, 50572)    — far left, center
  (5027, 13616)  — left, near top
```

The spread confirms Fruchterman-Reingold layout without aggregation.
