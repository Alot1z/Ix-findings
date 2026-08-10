# PR Packet — Compass Delayed-Data Blank

- **Proposed title:** fix(fit): recover from placeholder zoom after delayed data load
- **Repository:** ix-infrastructure/system-compass (private)
- **Target branch:** main
- **Source branch:** fix/delayed-data-fit-recovery
- **Base:** main @ 7f98724 (per v0.3.0 release)
- **Remote status:** BLOCKED — no source access. Investigation only.

**Status:** INVESTIGATION COMPLETE — blocked on source access  
**Target repo:** `ix-infrastructure/system-compass` (private)  
**Related:** system-compass #57 (fit latch fix, partially addresses)

---

## 1. Summary

When Compass data loads slowly (~60s from a delayed `/v1` endpoint), the graph
renders blank. The data IS loaded (15 nodes in the DOM), the canvas IS sized
correctly (78,600 × 77,783 px), and the CSS zoom IS set (0.441). But the zoom
is the placeholder fit (computed against the initial 1200×700 canvas), and the
nodes are invisible at 1.3px wide.

## 2. Root Cause (Class C Reconstruction)

The blank has **two interacting causes:**

### Primary: Timing-Dependent Region Rollup

With fast data, the root view aggregates 9 cards → 1 rollup, producing a compact
canvas at a readable zoom (~0.13). With delayed data, aggregation doesn't run,
leaving 15 individual nodes on a 78,600px canvas. The correct fit zoom for this
canvas is 0.004 — each 300px node renders at 1.3px wide.

### Secondary: Refit Effect Doesn't Recover

The v0.3.0 #57 fix added a keyed refit effect that re-fits when the canvas
changes. But the canvas dimensions (offsetWidth/offsetHeight) don't change
materially when content arrives — the Fruchterman-Reingold layout produces a
similar-sized canvas regardless of aggregation. So the effect either doesn't
fire or produces the same invisible result.

## 3. Live Evidence (Phase 7 Deep Probe)

All measurements from live v0.3.0 Compass at `:8099`:

| Property | Value | Source |
|----------|-------|--------|
| CSS zoom | 0.441 | `.ix-crisp-canvas` style |
| Canvas offset W×H | 78,820 × 78,023 | offsetWidth/offsetHeight |
| Node count | 15 | DOM query |
| Node span | 78,600 × 77,783 | Min/max of all positions |
| Aggregation | None | 15 individual cards |
| Available viewport | 351 × 860 | Viewport - chrome - sidebar - padding |
| Correct fit zoom | 0.00445 | min(availW/canvasW, availH/canvasH, cap) |
| Zoom-in multiplier | ×1.25 | Click "Zoom In" → 0.441→0.551 |

### Interactive Experiments

| Experiment | Action | Result |
|------------|--------|--------|
| Manual zoom change | Set zoom to 0.01 via DOM | No React re-fit triggered |
| Window resize event | `dispatchEvent(new Event('resize'))` | Zoom unchanged after 500ms |
| App zoom control | Click "Zoom In" button | Zoom increased to 0.551 (×1.25), no fit reset |
| Computed fit zoom | Calculate constants | 0.00445 — would make nodes 1.3px wide |

## 4. Evidence Classification

| Finding | Class | Method |
|---------|-------|--------|
| Zoom stuck at placeholder (0.441) with loaded data | B | Live preview probing (3 separate reproductions) |
| 15 individual nodes, no aggregation | B | DOM extraction |
| 78,600 × 77,783 px node span | B | Position math |
| Correct fit zoom = 0.00445 | B | Constant-based calculation |
| v0.3.0 release notes confirm #57 latch→refit | A | KageBinary release notes |
| v0.3.0 release notes confirm fit zoom 0.0044→0.184 via aggregation | A | KageBinary release notes |
| Region rollup timing dependency | B | Fast vs delayed A/B testing |
| Refit effect dependency keys | C/D | Inferred, needs source |
| Exact measurement path (getBoundingClientRect vs offsetWidth) | D | Needs source |

## 5. Scope

### IN SCOPE (for eventual fix)
- Ensure region rollup runs after data is complete, not during initial load
- Consider a fallback zoom floor so nodes never become invisible
- Consider centering on visible content at a readable zoom
- Regression test: delayed `/v1` response → visible graph

### EXPLICITLY OUT OF SCOPE
- F-key fit view (separate PR)
- Keyboard changes
- Fit math changes (the math is correct — the input canvas size is wrong)
- Camera state architecture changes

## 6. Proposed Fix Directions

### Option A: Fix rollup timing (primary)

Make region rollup wait for data to be complete before running, or re-run
rollup after data arrives. This addresses the primary cause.

**Estimated impact:** Eliminates the blank for most delayed-data scenarios.

### Option B: Zoom floor (safety net)

Set a minimum zoom level (e.g., 0.05) so individual nodes are always at least
15px wide. Even without aggregation, the graph would be navigable.

**Estimated impact:** Prevents invisible graphs regardless of canvas size.

### Option C: Content-aware centering (heuristic)

When fit zoom would be below a threshold, instead center on the centroid of
visible nodes at a readable zoom.

**Estimated impact:** Improves UX for large, sparse graphs.

### Option D: Progressive aggregation (architectural)

Aggregate incrementally as data arrives, rather than all-or-nothing.

**Estimated impact:** Eliminates the timing window entirely.

## 7. Repository State

| Attribute | Value |
|-----------|-------|
| Repository | `ix-infrastructure/system-compass` |
| Visibility | Private — 404 |
| Source access | None |
| Implementation | Cannot proceed |

## 8. Relationship to Other Work

| Item | Relationship |
|------|-------------|
| system-compass #57 | v0.3.0 fix for fit latch — partially addresses but doesn't fix delayed data |
| Compass F-key PR | Separate — F-key is keyboard exposure only |
| Ix remap PR | Separate — different repo, different subsystem |
| v0.3.0 release notes | Class A evidence confirming fit zoom 0.0044→0.184 via aggregation |

## 9. Authorization Gates

| Gate | Status |
|------|--------|
| Source access | ❌ Blocked |
| Implementation | ❌ Cannot proceed |
| Push branch | ❌ Not yet |
| Open PR | ❌ Not yet |

---

*Investigation complete. Live reproduction confirmed. Root cause identified
(Class C). Implementation blocked on source access.*
