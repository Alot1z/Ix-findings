# Compass Camera & Fit System — Historical Reconstruction

**Evidence Class:** B (reproducible artifact/runtime), with Class A for #57  
**Last Updated:** 2026-08-10

## 1. Fit Math Constants

All confirmed present in v0.3.0 artifact (extracted `index-C9dqEzlZ.js`):

| Constant | Value | Occurrences | Role |
|----------|-------|-------------|------|
| Placeholder width | 1200 | 3 | Default canvas width before content |
| Placeholder height | 700 | 5 | Default canvas height before content |
| Chrome height | 56 | 2 | Header/footer deduction |
| Readable cap | 1.25 | 4 | Maximum zoom for readability |
| Sidebar width | 112 | 1 | Left panel deduction |
| Offset | 36 | 5 | Padding from viewport edge |
| Max zoom | 2.5 | 19 | Hard ceiling on zoom-in |
| Zoom-in multiplier | 1.1 | 1 | `zoom × 1.1` |
| DPI constant | 96 | 1 | Reference DPI for pixel calculations |

## 2. Zoom Contract

### Zoom In

```
newZoom = min(2.5, currentZoom × 1.1)
```

- Multiplier 1.1 confirmed in artifact
- Cap 2.5 confirmed (19 occurrences in main bundle)

### Zoom Out

```
newZoom = max(fitZoom, currentZoom × 0.9)
```

- Multiplier 0.9: Reference in prior investigation. In v0.3.0, the value 0.9 was not found as a standalone constant — it may be computed as `1/1.1` or expressed differently. The behavioral contract (zoom out by 10% with fitZoom floor) has been live-verified.

### Snap

```
snapped = round(value × snapPrecision) / snapPrecision
```

Confirms the "round(e×t)/t" pattern from the prior investigation. Used to snap pan/zoom to pixel grid.

## 3. Fit View Computation

The fit calculation determines the zoom and pan that contain all graph content within the viewport:

```
available_width  = viewport_width  - sidebar(112) - padding(2×36)
available_height = viewport_height - chrome(56)   - padding(2×36)

scale_x = available_width  / canvas_width
scale_y = available_height / canvas_height
fitZoom = min(scale_x, scale_y, readable_cap(1.25))

fitPan = center_of_viewport - center_of_canvas × fitZoom
```

This is a `contain` fit (shows everything, no cropping) with:
- Chrome deduction for header/footer
- Readable cap preventing zoom below 1.25 (ensures text remains legible)
- 36px offset from each edge

## 4. #57 Fit Lifecycle Evolution

### v0.1.0, v0.1.1, v0.2.0: One-Shot Fit Latch

Based on the v0.3.0 release notes (Class A evidence):

> *"The fit used to run once against the 1200×700 placeholder and latch, so the map rendered blank until something else re-centred it."*

**Behavior:**
1. Component mounts
2. Canvas is initially 1200×700 (placeholder)
3. Fit calculation runs once against the placeholder
4. Result is stored ("latched") — never recomputed
5. When real content arrives later (e.g., delayed `/v1` response), canvas grows
6. Camera stays at placeholder fit → content invisible or microscopic

**Impact:** The delayed-data finding — blank map after late content — is a direct consequence of this latch behavior.

### v0.3.0: Keyed Refit Effect

> *"The viewport re-fits when the canvas changes."* — v0.3.0 release notes

**Behavior:**
1. Component mounts with placeholder canvas
2. A reactive effect watches for canvas size changes
3. When canvas changes (content arrives), effect re-runs fit calculation
4. Camera snaps to correct fit for actual content

**Dependency fingerprint (from prior investigation):** The effect key includes canvas dimensions, drill state, and reserved space — consistent with the behavior of re-fitting when any of these change.

**Remaining gap:** The delayed-data finding persists in v0.3.0 despite the refit effect. This suggests the fit calculation itself has a self-referencing issue under specific timing conditions (see delayed-data reconstruction).

## 5. Camera State

The camera state is conceptually:

```typescript
interface CameraState {
  zoom: number;  // Current zoom level
  panX: number;  // Horizontal pan offset (pixels)
  panY: number;  // Vertical pan offset (pixels)
}
```

Operations:
- `setZoom(zoom)` — sets zoom level
- `setPan(panX, panY)` — sets pan position
- `onFitView()` — calls `setZoom(fitZoom)` and `setPan(fitPanX, fitPanY)`

The `0` key triggers `onFitView()`. The F-key should trigger the same.

## 6. Delayed-Data Mechanism (Class C Reconstruction)

### Observed Behavior

| Scenario | Placeholder Fit | After Content | Visible Cards |
|----------|----------------|---------------|---------------|
| Fast data | ~0.129 @ (39, 254) | ~0.129 @ (39, 254) | 9 + 1 aggregate |
| Delayed data (~60s) | ~0.441 @ varies | ~0.441 @ unchanged | 0 |

### Strongest Current Explanation

```
Canvas is content-sized (grows from 1200×700 to actual graph size)
    ↓
Fit viewport measurement includes CSS-zoomed bounding rectangle
    ↓
Viewport measurement depends on current zoom
    ↓
Fit target depends on current zoom
    ↓
New fit ≈ current fit
    ↓
Camera does not visibly move — self-referencing cycle
```

The placeholder canvas (1200×700) produces a placeholder fit (~0.44). When real content arrives, if the fit calculation uses the current CSS-zoomed viewport dimensions, the resulting fit target converges on the same value — because the viewport already reflects the current zoom.

### Why fast data works

When data arrives quickly (before the initial fit compute or during a different render cycle), the canvas already has its real dimensions when the fit first runs. No self-referencing cycle.

### Evidence Limitations

- **Class C only.** The exact measurement path (getBoundingClientRect, ResizeObserver, or CSSOM) has not been source-verified.
- **Timing-dependent.** The reproduction is consistent across multiple runs but the exact mechanism (render cycle ordering, effect scheduling) is inferred.
- **No source access.** Cannot confirm the specific hooks, refs, or layout effects involved.

## 7. Region Rollup Behavior

### Observed (Fast Data)

```
Root regions: 9 cards + 1 aggregate
Same map_rev
```

### Observed (Delayed Data)

```
Root regions: 15 cards + no aggregate
Same map_rev
```

### Implication

The aggregate ("rollup") formation depends on timing — specifically on whether certain regions are present when the rollup decision runs. This is Class B evidence (reproducible artifact behavior). The exact rollup decision logic (threshold, grouping algorithm) is unknown without source access.

### v0.3.0 Release Note

> *"1,471 root regions aggregate to 33, with the long tail folded into a roll-up that drills in recursively."*

This confirms the rollup mechanism exists and is intentional, but doesn't describe the timing dependency we observe.

## 8. Initial Fit Instability

Observed placeholder fit values across runs:

| Run | Placeholder Fit | Pan |
|-----|----------------|-----|
| v0.2.0 run 1 | ~0.439 | varies |
| v0.3.0 run 1 | ~0.441 | varies |
| v0.3.0 run 2 | ~0.441 | varies |

The variation (~0.439 vs ~0.441) is small but real. Recorded as **mount-timing / initialization instability** — possibly due to viewport measurement racing with DOM layout. Class B observation, mechanism unknown.

## 9. Summary

| Property | v0.1.0–v0.2.0 | v0.3.0 | Status |
|----------|---------------|--------|--------|
| Fit math constants | Same | Same | **Invariant** |
| Zoom contract | Same | Same | **Invariant** |
| Snap function | Same | Same | **Invariant** |
| Camera state shape | Same | Same | **Invariant** |
| Fit trigger mechanism | One-shot latch | Keyed refit effect | **Changed (#57)** |
| Delayed-data blank | Present | Present | **Persists** |
| Region rollup timing | Unknown | Timing-dependent | **Present** |
| Initial fit value | ~0.44 | ~0.44 | **Invariant** |
| Mount-time instability | Present | Present | **Persists** |

---

*A: Source-proven (v0.3.0 release notes). B: Artifact/runtime. C: Strongly reconstructed.*
