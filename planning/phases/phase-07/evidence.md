# Phase 07 — Evidence

| ID | Item | Class | Detail |
|---|---|---|---|
| E-009 | delayed-data A/B runs | B (runtime) | A: v0.2.0 0.439@(39,315) 0 cards; B: v0.3.0 0.441@(39,388) 0 cards; B2 repeat 0 cards; C: v0.3.0 fast 0.129@(39,254) visible |
| E-012 | rollup timing A/B | B (runtime) | 9 cards + 1 aggregate (fast) vs 15 cards (delayed), same `map_rev` |
| E-011 | zoom contract | B (runtime) | +/button and − verified; ×1.25 anomaly noted |
| E-022 | placeholder-fit instability | B (runtime) | 0.439 vs 0.441 across runs |

Live state at time of writing (recorded in ledger): zoom 0.441, 15 nodes,
78,600 px canvas, no aggregation, served on :8099.
