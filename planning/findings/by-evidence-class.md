# Findings by Evidence Class

Legend: **A** = direct source evidence · **B** = reproducible artifact/runtime ·
**C** = strongly corroborated reconstruction · **D** = inference/speculation.
Class is per-claim and never upgraded by repetition.

## Class A (source)
| ID | Title | Status |
|---|---|---|
| F-005 | #57 latch → keyed refit (release notes + bundle diff) | CONFIRMED |
| F-008 | Version-series mismatch (#376) | OPEN |
| F-009 | `patches` dead (#371) | OPEN |
| F-010 | Loopback-hardened `/__ix/remap` | PR_READY |
| F-011 | WSL bootstrap fix | IN_REMAP_PR |
| F-012 | Dead `node_ok` removal | IN_REMAP_PR |

## Class B (artifact/runtime)
| ID | Title | Status |
|---|---|---|
| F-001 | Keyboard handler invariant | REPRODUCED |
| F-002 | F/f unbound | REPRODUCED |
| F-003 | KeyboardHelp identical | VERIFIED |
| F-004 | Fit math + constants invariant | VERIFIED |
| F-006 | Delayed-data blank (B) + mechanism (C) | REPRODUCED_LIVE |
| F-007 | Rollup timing-dependent | OBSERVED |

## Class D (inference)
| ID | Title | Status |
|---|---|---|
| F-013 | Zoom ×1.25 vs ×1.1 anomaly | OPEN |

## Class C (reconstruction — never presented as fact)
- F-006 mechanism: self-referential refit via CSS-zoomed rect (E-009/C1).
- (No standalone C-class findings registered; C qualifies mechanisms of B findings.)
