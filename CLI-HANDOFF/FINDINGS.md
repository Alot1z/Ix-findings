# FINDINGS.md — Complete Finding Registry (F-001…F-013)

> Authoritative count: **13 findings**.
> Source: `../planning/findings/registry.json` (canonical).
> Evidence class: A=source, B=artifact/runtime, C=reconstruction, D=inference.

---

| ID | Title | Class | Repo | Severity | Status | Evidence |
|---|---|---|---|---|---|---|
| **F-001** | Keyboard handler invariant across 4 releases | B | system-compass | — | REPRODUCED | E-005, E-006 |
| **F-002** | F/f genuinely unbound in all releases | B | system-compass | — | REPRODUCED | E-005, E-006, E-007 |
| **F-003** | KeyboardHelp byte-identical, no F entry | B | system-compass | — | VERIFIED | E-005, E-007 |
| **F-004** | Fit math + constants invariant | B | system-compass | — | VERIFIED | E-005, E-007 |
| **F-005** | #57 one-shot fit latch → keyed refit (v0.2.0 → v0.3.0) | A+ | system-compass | — | CONFIRMED | E-008 (release notes) |
| **F-006** | Delayed-data blank persists on v0.3.0 | B+ | system-compass | P1 | REPRODUCED_LIVE | E-009, E-012 |
| **F-007** | Region-rollup aggregate formation timing-dependent | B | system-compass | P2 | OBSERVED | E-009, E-012 |
| **F-008** | Version-series mismatch in `ix upgrade` (#376) | A | ix-infrastructure/Ix | P1 | OPEN | E-017 |
| **F-009** | `patches` command dead/unregistered (#371) | A | ix-infrastructure/Ix | P2 | OPEN | E-018 |
| **F-010** | Loopback-hardened /__ix/remap endpoint (IMPLEMENTED) | A | ix-infrastructure/Ix | — | PR_READY | E-014, E-015, E-016 |
| **F-011** | WSL bootstrap fix | A | ix-infrastructure/Ix | — | IN_REMAP_PR | E-014, E-015 |
| **F-012** | Dead node_ok removal | A | ix-infrastructure/Ix | — | IN_REMAP_PR | E-014, E-015 |
| **F-013** | Zoom-in multiplier discrepancy (×1.25 observed vs ×1.1 in constants) | D | system-compass | P3 | OPEN | E-011 |

---

## Finding-to-Evidence Trace

```
F-001 ─── E-005, E-006                    (keyboard byte-identity)
F-002 ─── E-005, E-006, E-007             (F/f unbound)
F-003 ─── E-005, E-007                    (KeyboardHelp)
F-004 ─── E-005, E-007                    (fit math)
F-005 ─── E-008                           (release notes, Class A)
F-006 ─── E-009, E-012                    (delayed-data A/B runs)
F-007 ─── E-009, E-012                    (rollup timing A/B)
F-008 ─── E-017                           (#376 source analysis)
F-009 ─── E-018                           (#371 source analysis)
F-010 ─── E-014, E-015, E-016             (remap diff, tests, suite)
F-011 ─── E-014, E-015                    (WSL fix in remap branch)
F-012 ─── E-014, E-015                    (dead code removal)
F-013 ─── E-011                           (zoom anomaly)
```

---

## Finding-to-Phase Trace

```
F-001..F-004  → phase-05 (Compass artifact reconstruction)
F-005          → phase-05 (release-note analysis, Class A)
F-006, F-007   → phase-07 (delayed-data deep probe)
F-008, F-009   → phase-03 (#376 analysis), phase-04 (security audit)
F-010..F-012   → phase-02 (remap finalization)
F-013          → phase-05 (zoom contract anomalies)
```

---

## Finding-to-Repo Trace

```
ix-infrastructure/Ix:
  F-008, F-009, F-010, F-011, F-012

system-compass (source-constrained):
  F-001, F-002, F-003, F-004, F-005, F-006, F-007, F-013
```

---

## CLI Verification Required

For every finding:

1. Re-read the evidence files (E-001…E-025 from registry)
2. Cross-check the finding title/status against live repo state
3. Flag any finding whose evidence chain is incomplete
4. Do NOT change finding IDs or titles — add new findings as F-014+

**Current status assessment (from Desktop audit):**
- All F-001…F-013 have supporting evidence in E-001…E-025
- F-005 has Class A evidence (release notes as behavioral source)
- F-001…F-004 and F-006, F-007 are Class B (artifact/runtime — verified but not from source)
- F-013 is Class D (inference — unverified zoom anomaly)
- No fabricated findings detected
