# Evidence — Runtime / Browser

Live observations against real backends and real bundles (all on loopback).

| ID | Experiment | Result |
|---|---|---|
| E-009 | delayed-data A/B (60 s proxy) | v0.2.0 + v0.3.0 frozen at placeholder fit, 0 cards; fast path correct |
| E-010 | F-key PoC (patched v0.3.0 bundle, :8095) | F ≡ 0 target byte-identical; guards hold; zero console errors |
| E-011 | zoom contract (+/− keys, buttons) | ×1.1 in / ×0.9 out / 2.5 cap / floor = fit; ×1.25 button anomaly (F-013) |
| E-012 | rollup timing A/B | fast 9+1 aggregate vs delayed 15, no aggregate |
| E-022 | placeholder-fit instability | 0.439 vs 0.441 across runs |

Notes: browser evidence was captured via a real browser preview + devtools on
loopback servers; no browser profile or personal data was ever exposed.
