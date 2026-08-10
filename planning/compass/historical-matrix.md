# Compass — Historical Matrix (v0.1.0 → v0.3.0)

Provenance tags: **SOURCE** = source-level evidence · **ARTIFACT** = from
released bundles · **RUNTIME** = observed live · **RECONSTRUCTION** = derived
consistently from the above · **INFERENCE** = plausible but unverified ·
**UNKNOWN** = not established.

Full matrix: `../comparisons/historical-matrix.md` (45 rows). Summary:

| Area | v0.1.0 | v0.1.1 | v0.2.0 | v0.3.0 | Tag |
|---|---|---|---|---|---|
| Keyboard switch + guards | same | same | same | same | ARTIFACT (byte-identical) |
| KeyboardHelp array | same | same | same | same | ARTIFACT (byte-identical) |
| F/f binding | none | none | none | none | ARTIFACT (zero matches) |
| Fit math + 9 constants | same | same | same | same | ARTIFACT |
| Zoom contract (×1.1 / ×0.9 / 2.5) | same | same | same | same | ARTIFACT + RUNTIME |
| Fit lifecycle | one-shot latch | one-shot latch | one-shot latch | **keyed refit** | SOURCE (release notes) + ARTIFACT |
| Delayed-data blank | present | present | present | **present** | RUNTIME (reproduced) |
| Region rollup | — | — | timing-dependent | timing-dependent | RUNTIME |
| Bounded layout | — | — | — | ✓ | SOURCE (release notes) |
| Aggregation 1,471→33 | — | — | — | ✓ | SOURCE (release notes) |
| Searchable roll-ups / breadcrumb collapse | — | — | — | ✓ | SOURCE (release notes) |
| Source maps | none | none | none | none | ARTIFACT |

## Key insights (re-stated conservatively)

1. The keyboard surface has **never changed** — a keyboard addition is safe (F-001…F-003).
2. **F has never been bound** — no historical conflict (F-002).
3. The fit math is **invariant** — the F-key must reuse it (F-004, D-005).
4. #57 changed only the **trigger** (latch → refit), not the math (F-005).
5. The delayed-data blank **persists even with the refit effect** — separate
   concern (F-006, D-006).
