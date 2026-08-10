# DECISIONS.md — Decision Registry (D-001…D-014)

> Authoritative: `../planning/decisions/registry.json`

---

## Decided (D-001…D-009)

| ID | Decision | Phase | Consequence |
|---|---|---|---|
| D-001 | Remap based on origin/main | 01 | Clean PR base — not contaminated by fork history |
| D-002 | Dedicated worktree for remap | 01 | 18-file overhaul isolated from agent-skill work |
| D-003 | Evidence classification A/B/C/D | 04 | No overclaiming — every statement tagged |
| D-004 | Release notes = Class A (behavior) | 05 | #57/#376 claims grounded in published release notes |
| D-005 | F-key = keyboard exposure only | 06 | Smallest change — zero conflict with existing bindings |
| D-006 | Delayed-data separate from F-key | 06 | Two packets — not combined |
| D-007 | ix-compass-dist never modified | 08 | Distribution channel safe |
| D-008 | Ix-findings standalone ledger | 09 | Evidence separate from code |
| D-009 | No remote action without authorization | 12 | Nothing pushed, opened, merged, or released |

---

## Open — Maintainer/User Decisions (D-010…D-014)

| ID | Question | Recommended | Evidence | Status |
|---|---|---|---|---|
| D-010 | Where to prep the Compass port | Standalone prep repo | D-007, S-002 | **AWAITING** |
| D-011 | Compass PR scope | F key + help + hint chip only | F-001..F-005, S-001 | **AWAITING** |
| D-012 | No-map chip timing | Defer + feature-detect after remap | S-020 | **AWAITING** |
| D-013 | Stopgap patch fate | Keep local + document expiry | S-017, D-007 | **AWAITING** |
| D-014 | system-compass access path | Ask KageBinary in #368 | PR #368 context | **AWAITING** |

---

## Decision Alternatives Recorded

For each decision, the registry (`../planning/decisions/registry.json`) records:
- Options considered
- Chosen option
- Rejected alternatives
- Reason for rejection
- Related evidence
- Related findings

---

## CLI Verification

1. Verify all 14 decisions are internally consistent
2. Check no decision contradicts any finding
3. Flag any decision that was made on incomplete evidence
4. D-010…D-014 are user-facing — do NOT change them
