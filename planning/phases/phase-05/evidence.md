# Phase 05 — Evidence

| ID | Item | Class | Detail |
|---|---|---|---|
| E-001 | compass-0.1.0.tar.gz | B (artifact) | SHA256 `19bc427d0eca77b2…`; Rolldown; 13 chunks |
| E-002 | compass-0.1.1.tar.gz | B (artifact) | SHA256 `74e56488c5daf970…`; several chunks byte-identical to v0.1.0 |
| E-003 | compass-0.2.0.tar.gz | B (artifact) | SHA256 `863583084c91719f…` |
| E-004 | compass-0.3.0.tar.gz | B (artifact) | SHA256 `7ed6cc82fe58b3ad…`; source `main @ 7f98724` |
| E-005 | keyboard switch byte-identity | B (byte compare) | identical across all 4; F/f zero matches |
| E-006 | KeyboardHelp chunk extraction | B (artifact) | `KeyboardHelp-KnF66B2h.js`, 1,784 B, 8 entries |
| E-007 | fit constants extraction | B (artifact) | 9 constants confirmed in v0.3.0 bundle |
| E-008 | v0.3.0 release notes (KageBinary) | A | #57/#58/#59; "exists to stop a downgrade"; aggregation/layout/search/breadcrumb |
| E-010 | F-key PoC (patched v0.3.0) | B (runtime) | F ≡ 0 target byte-identical; guards hold; zero console errors |
| E-011 | zoom contract live checks | B (runtime) | ×1.1 in / ×0.9 out / 2.5 cap; floor = fit target |
| E-023 | source maps absent | B (artifact) | none shipped in any release |

*The 4-way byte comparison was performed during the follow-up deep-dive
(`tasks/compass-historical-reconstruction.md`); phase-12 master report notes the
local Ix-findings copy only re-extracted v0.3.0 — hence "partially verified" in
some tables. The full 4-way comparison evidence is E-005/E-006/E-007.*
