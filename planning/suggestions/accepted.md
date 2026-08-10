# Accepted Suggestions (S-001…S-012)

| ID | Suggestion | Where it landed |
|---|---|---|
| S-001 | Dedicated Git worktree for remap | `<IX_REMAP_WORKTREE>` (D-002) |
| S-002 | Base remap on origin/main | `c021b52` on `c4f8fea` (D-001) |
| S-003 | Export `serverScript()` | view.ts |
| S-004 | `IX_VIEW_MAP_MAIN` seam | view.ts + tests |
| S-005 | Evidence classification A/B/C/D | every registry in this tree |
| S-006 | Compass separate from Ix | 4 separate PR packets |
| S-007 | F-key = keyboard exposure only | compass-f-key packet (D-005) |
| S-008 | Delayed-data separate | compass-delayed-data packet (D-006) |
| S-009 | Ix-findings standalone | this repository |
| S-010 | #376 packet | ix-376-version-mismatch packet |
| S-011 | Local stopgap with expiry | `<IX_REPO>/tasks/` + compass-patch (local only) |
| S-012 | Origin parsing via URL API | view.ts guard |

All accepted suggestions are traceable to evidence (E-###) and, where relevant,
to decisions (D-###). See `registry.md` / `registry.json`.
