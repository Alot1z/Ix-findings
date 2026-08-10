# Compass — Fit, Zoom, Pan & Snapping

## Camera state (ARTIFACT/RUNTIME)

State = `zoom` + `pan`; setters `setZoom`/`setPan`. Rendered as
`translate(snappedPan.x, snappedPan.y)` on a wrap div + `zoom: snappedZoom` on
`.ix-crisp-canvas` (RUNTIME — observed in live DOM; this is exactly the pair the
old DOM patch tried to write directly, which is why it was rejected).

## Fit target formula (RECONSTRUCTION — verified against release-note numbers)

```
fitZoom = min( s, o × 1.25 )                 // readable cap
  s = min( availW/contentW, availH/contentH )  // plain contain
  o = min( (availW−112)/contentW, (availH−152)/contentH )
fitPan.x = (availW − contentW×fitZoom)/2 + (reserved==0 ? 36 : 0)
fitPan.y = 96 + (availH − 96 − contentH×fitZoom)/2
```
- content bbox: 1200×700 floor + 160/180 margins (RECONSTRUCTION)
- constants: 1200, 700, 56, 1.25, 112, 36, 2.5, 1.1, 96 — ARTIFACT (extracted)
- placeholder case verified: `min(527/1200, 307/700) = 0.439` (RUNTIME observed)

## Zoom contract (ARTIFACT + RUNTIME)

- In: `min(2.5, z × 1.1)` — live-verified (2.5 cap)
- Out: `max(fitZoom, z × 0.9)` — floor = fit target (live-verified)
- Snap: `Sn(e,t) = round(e×t)/t` applied to pan; zoom rounded to 3 decimals
- **Open anomaly (F-013, INFERENCE/D):** on-screen zoom button appeared ~×1.25
  in one phase-07 observation; not reconciled with ×1.1 constants.

## Snapping & grid (ARTIFACT + RUNTIME)

Snapped pan drives **both** the graph transform and the grid background — the
grid follows the camera natively. The old patch's "grid left behind on F" defect
does not exist on the native path.

## #57 relationship

The fit math is invariant; #57 changed only the trigger (see `lifecycle.md`).
The `0` key has always jumped to the memoized fit target (ARTIFACT — present in
all four releases) — F mirrors it (D-005).
