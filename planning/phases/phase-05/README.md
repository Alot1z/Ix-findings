# Phase 05 — Compass Historical Reconstruction

| Field | Value |
|---|---|
| Phase | 05 |
| Purpose | Deep behavioral reconstruction of all four Compass artifact versions (v0.1.0→v0.3.0) |
| Date/time | 2026-08-10 |
| Category | RESEARCH |
| Inputs | ix-compass-dist release tarballs; v0.3.0 release notes; prior F-key PoC; `b038c46` historical port (`upstream/compass-fit-view`) |
| Repositories involved | ix-compass-dist (artifacts), system-compass (object of study — private), Ix (historical port) |
| Artifacts involved | compass-0.1.0/0.1.1/0.2.0/0.3.0.tar.gz (SHA256-verified) |
| Work performed | SHA256 verification; chunk extraction; byte-compare keyboard switch + KeyboardHelp across 4 releases; fit-constant extraction; #57 lifecycle diff (v0.2.0 latch `!q‖A‖` vs v0.3.0 keyed refit); live zoom-contract verification |
| Findings | F-001 (keyboard invariant), F-002 (F unbound), F-003 (KeyboardHelp identical), F-004 (fit constants invariant), F-005 (#57 latch→refit, Class A) |
| Evidence | E-001…E-008, E-010, E-011, E-023 |
| Changes | none (analysis); mapped the old `upstream/compass-fit-view` port → real artifact (delete/adapt/replace table) |
| Tests | artifact SHA256 (4/4), byte comparisons, constant extraction, live zoom checks |
| Suggestions | S-007 (F-key keyboard-only — ACCEPTED), S-021 (CameraStore — REJECTED), S-022 (DOM patch — REJECTED) |
| Decisions | D-003, D-004, D-005 |
| Unresolved questions | exact source filenames/line anchors (class D) |
| Outputs | `../../comparisons/historical-matrix.md`, `../../comparisons/keyboard/reconstruction.md`, `../../comparisons/camera-fit/reconstruction.md`, `../../comparisons/releases/timeline.md` |
| Next-phase dependencies | phase-06 (gate), phase-07 (delayed-data) |

**Headline:** the keyboard system, KeyboardHelp content, fit mathematics, zoom
contract, and theme tokens are **invariant across all four releases**; F/f is
genuinely unbound in every artifact — a zero-conflict feature surface.
