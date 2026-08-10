# Compass — Lifecycle (#57, mount, drill, resize)

## #57 — the fit lifecycle change (SOURCE — v0.3.0 release notes by KageBinary)

> "The viewport re-fits when the canvas changes. The fit used to run once
> against the 1200×700 placeholder and latch, so the map rendered blank until
> something else re-centred it."

| Generation | Mechanism (ARTIFACT — bundle diff) |
|---|---|
| v0.1.0–v0.2.0 | one-shot fit: computed against placeholder, applied once, `A` flag set, never re-applied |
| v0.3.0 | latch guard removed; keyed effect re-fires on drill-key / canvas-key / reserved-space change; initial fit ~250 ms; drill-in 360 ms with 3.5% pop; drill-out 320 ms; canvas change 320 ms |

## Consequences drawn (conservative)

- **Mount auto-frame is unnecessary** — #57 covers mount (SUPERSEDED S-032).
- **Drill reframe already ships** — #57 covers drill (SUPERSEDED S-033).
- The F-key PR must add **no lifecycle code** (D-005).

## Full lifecycle (RECONSTRUCTION)

Mount → ResizeObserver measures canvas → fit target memo computed → apply (with
animation in v0.3.0 on change) → first paint uses SMIL fade-in (opacity 0→0.8,
staggered) → drill-in/out recenters selected node (separate 300 ms pan effect)
→ command palette overlays → keyboard help modal.

## UNKNOWNs

- Exact effect dependency keys (INFERENCE: drillKey/canvasKey/reserved).
- Whether maintainers consider the delayed-data gap (F-006) in scope for #57.
