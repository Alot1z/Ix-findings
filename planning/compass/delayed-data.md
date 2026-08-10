# Compass — Delayed Data (F-006)

## Symptom (RUNTIME — reproduced 3×)

With a 60 s proxy delay on `/v1/*`, the camera stays at the placeholder fit
(~0.44) after real content arrives; the graph renders **outside the visible
window** — 0 cards visible. Reproduced on v0.2.0 (×1) and v0.3.0 (×2,
deterministic). Fast-data path fits correctly (0.129 @ (39,254), visible).

| Run | Version | Pre-data | Post-data | Cards visible |
|---|---|---|---|---|
| A | v0.2.0 | 0.439 @ (39,315) | 0.439 @ (39,315) | 0 |
| B | v0.3.0 | 0.441 @ (39,388) | 0.441 @ (39,388) | 0 |
| B2 | v0.3.0 (repeat) | 0.441 @ (39,388) | 0.441 @ (39,388) | 0 |
| C | v0.3.0 fast | — | 0.129 @ (39,254) | ✓ |

`map_rev` constant (16) rules out data changes between runs.

## Mechanism (RECONSTRUCTION — strong inference, needs source)

The canvas element is *content-sized*; the fit's viewport input is measured via
a rect that **includes the CSS zoom**. At refit time `avail ≈ content ×
currentZoom`, so `fitZoom ≈ currentZoom` — a self-referential fixed point: the
refit fires but its target equals the current camera. INFERENCE details:
exact measurement call (getBoundingClientRect vs offsetWidth) is UNKNOWN.

## Related but distinct (F-007)

Region-rollup aggregate formation also depends on data-arrival timing (fast:
9 cards + 1 aggregate; delayed: 15 cards, no aggregate). Whether rollup timing
**causes** the blank or is a parallel symptom is UNKNOWN.

## Impact & handling

- **Severity:** P1 (UX regression vs #57's intent — the map is blank).
- **Deliberately separate** from the F-key PR (D-006, S-008); called out in the
  F-key PR description as a known limitation.
- **PR packet:** `../pr-packets/compass-delayed-data/README.md` — investigation
  complete, fix blocked on source access.
