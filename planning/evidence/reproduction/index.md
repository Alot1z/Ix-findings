# Evidence — Reproduction

Repeatable experiments, with how-to-reproduce pointers.

| ID | Experiment | Reproduce by | Result |
|---|---|---|---|
| E-009 | delayed-data blank | serve v0.2.0/v0.3.0 artifact behind a 60 s proxy on `/v1/*`, open visualizer, compare pre/post data camera | frozen at placeholder fit; fast path correct |
| E-010 | F-key equivalence | patch a copy of the v0.3.0 main chunk with `case 'f'/'F'` + `onFitView` mirroring `onZoomReset`; serve against real backend | F target ≡ 0 target |
| E-011 | zoom contract | press +/− in live visualizer; read camera state | ×1.1/×0.9/2.5 cap |
| E-012 | rollup timing | same proxy A/B; count cards/aggregates at equal `map_rev` | 9+1 vs 15 |
| E-015 | remap guard matrix | `vitest run ix-cli/test/view-server.test.ts` | 10/10 pass |
| E-016 | full suite | `vitest run` + `tsc --noEmit` + eslint on changed files | 656/2, 0 errs, clean |

Full write-ups: `../../comparisons/camera-fit/delayed-data-investigation.md`,
`../../comparisons/keyboard/reconstruction.md`,
`../../comparisons/camera-fit/reconstruction.md`, `../../pr-packets/*`.
