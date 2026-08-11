# Final Decisions

## Decided (D-001…D-009)

| ID | Decision | Consequence |
|---|---|---|
| D-001 | Remap based on origin/main | clean PR base |
| D-002 | Dedicated worktree | 18-file overhaul untouched |
| D-003 | Evidence classification A/B/C/D | no overclaiming |
| D-004 | Release notes = Class A (behavior) | #57/#376 claims grounded |
| D-005 | F-key = keyboard exposure only | smallest change; zero conflict |
| D-006 | Delayed-data separate from F-key | two packets |
| D-007 | ix-compass-dist never modified | distribution channel safe |
| D-008 | Ix-findings standalone ledger | evidence separate from code |
| D-009 | No remote action without authorization | nothing published without explicit gates — 2026-08-11: remap push + PR #393 opened under Gates A/B (authorized); still governs all remaining remote actions |

## Open — need your call (D-010…D-014)

| ID | Question | Recommended |
|---|---|---|
| D-010 | Where to prep the Compass port | standalone prep repo |
| D-011 | Compass PR scope | F key + help + hint chip only |
| D-012 | No-map chip timing | defer + feature-detect |
| D-013 | Stopgap patch fate | keep local + document expiry |
| D-014 | system-compass access path | ask KageBinary in #368 thread |

## Decision traceability

Every decision → options → evidence → consequence is in
`../decisions/registry.md` / `registry.json` / `decision-log.md`, and the graph
in `../maps/decision-map.json`. The answer to "why not the obvious alternative"
is recorded per decision (e.g. worktree over stash; origin/main over fork/main;
keyboard exposure over a port; two packets over one).