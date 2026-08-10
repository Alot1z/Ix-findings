# Phase 07 — Delayed-Data Deep Investigation

| Field | Value |
|---|---|
| Phase | 07 |
| Purpose | Deep runtime probing of the delayed-data blank (map invisible when content arrives late) |
| Date/time | 2026-08-10 |
| Category | REPRODUCTION |
| Inputs | phase-05; v0.2.0 + v0.3.0 artifacts; local servers |
| Repositories involved | system-compass (runtime, via artifacts) |
| Artifacts involved | v0.2.0, v0.3.0 bundles |
| Work performed | delayed-data A/B (60 s proxy delay vs fast); 3 reproductions (v0.2.0×1, v0.3.0×2); 4 interactive experiments (manual zoom, resize, zoom-in button, fit computation); rollup timing observation |
| Findings | F-006 (delayed-data blank persists on v0.3.0), F-007 (region rollup timing-dependent), F-013 (zoom button ×1.25 anomaly, class D) |
| Evidence | E-009, E-011, E-012, E-022 |
| Changes | none (runtime only; temp copies of artifacts) |
| Tests | A/B matrix (runs A/B/B2/C); live on :8099 at time of writing |
| Suggestions | S-008 (separate from F-key — ACCEPTED), S-017 (zoom multiplier — DEFERRED), S-018 (Playwright repro — DEFERRED) |
| Decisions | D-006 (delayed-data separate concern) |
| Unresolved questions | exact measurement method (getBoundingClientRect vs offsetWidth) — class D; whether maintainers consider the gap in scope for #57 |
| Outputs | `../../comparisons/camera-fit/delayed-data-investigation.md`, `../../pr-packets/compass-delayed-data/README.md` |
| Next-phase dependencies | phase-08 (ecosystem) |

**Reproduction table:** A v0.2.0 0.439@(39,315) → 0 cards visible; B v0.3.0
0.441@(39,388) → 0 cards; B2 repeat → 0 cards; C v0.3.0 fast → 0.129@(39,254)
visible. `map_rev` constant (16) rules out data change.
**Mechanism (C):** canvas is content-sized; fit viewport measured via
CSS-zoomed rect → refit target ≈ current zoom (self-referential fixed point).
