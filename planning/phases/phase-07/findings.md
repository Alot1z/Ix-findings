# Phase 07 — Findings

| ID | Finding | Class | Severity | Detail |
|---|---|---|---|---|
| F-006 | Delayed-data path leaves graph invisible on v0.2.0 AND v0.3.0 | B (reproduced ×3) + C (mechanism) | P1 (UX regression vs #57 intent) | refit target self-referential via zoomed-rect measurement |
| F-007 | Region-rollup aggregate formation depends on data-arrival timing | B (reproduced) | P2 | fast: 9 cards + 1 aggregate; delayed: 15 cards, no aggregate; same map_rev |
| F-013 | On-screen zoom button appeared to step ×1.25 (vs ×1.1 in artifact constants) | D (single observation) | P3 | open unknown — needs source or repeat |
| — | Initial placeholder fit unstable run-to-run (0.439 vs 0.441; pan 315 vs 388) | B | P2 | mount-timing dependent (E-022) |

**Consequence for F-key PR:** F-key reuses the existing fit target/setters and
does not touch this path; the delayed-data gap is called out in the PR
description as a known limitation (per S-008 / D-006).
