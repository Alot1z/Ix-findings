# Phase 05 — Findings

| ID | Finding | Class | Evidence |
|---|---|---|---|
| F-001 | Keyboard handler invariant across 4 releases (switch, guards, keys Esc ? + = - 0 l L i I) | B | E-005 |
| F-002 | F/f genuinely unbound in every artifact (zero matches in every chunk) | B | E-005 |
| F-003 | KeyboardHelp byte-identical; 8 entries; no F | B | E-006 |
| F-004 | Fit math + constants invariant (1200,700,56,1.25,112,36,2.5,1.1,96; contain; snap round(e·t)/t) | B | E-007, E-011 |
| F-005 | #57: one-shot fit latch (`!q‖A‖`, v0.1.0–v0.2.0) → keyed refit effect (v0.3.0) | A (release notes) + B (code-level diff) | E-008, E-003/E-004 |
| — | v0.3.0 landmark: bounded layout (gravity+repulsion cutoff, 15.3s→90ms), aggregation 1,471→33, searchable roll-ups, breadcrumb collapse | A | E-008 |

**Port → artifact mapping** (what the old `upstream/compass-fit-view` prototype
was vs what actually exists):

| Old prototype | Real artifact | Disposition |
|---|---|---|
| `CameraStore` abstraction | real `zoom`/`pan` + setters | DELETE (hypothetical) |
| `camera.ts` fit math | real `Cn` fit | ADAPT/REFERENCE (no duplicate) |
| `useCameraFit` auto-frame | #57 refit effect | MOSTLY DELETE |
| `KeyboardHelp.tsx` | real `[{keys,label}]` array | ADAPT (+F entry) |
| `FitViewHint.tsx` | real UI location unknown | ADAPT/OPTIONAL |
| `var(--color-*)` fallbacks | Tailwind semantic tokens | REPLACE |
| DOM patch (style.zoom, timers) | native camera state | DELETE |

**Zoom contract (live-verified):** in `min(2.5, z×1.1)`; out `max(fitZoom, z×0.9)`;
snap `round(e·t)/t`. Phase-07 observed the on-screen zoom button behaving as
`×1.25` — recorded as open unknown F-013 (see registry).
