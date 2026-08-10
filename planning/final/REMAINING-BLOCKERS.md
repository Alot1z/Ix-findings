# Remaining Blockers

| # | Blocker | Type | Affects | Resolution path | State |
|---|---|---|---|---|---|
| 1 | Push/PR authorization | GATE (D-009) | remap PR, #376 PR, fork sync, #371, Ix-findings repo | user go-ahead | open |
| 2 | system-compass source access | PERMANENT (re-verified) | F-key PR, delayed-data, #58/#59 | PAT `Contents:read` / fork grant / URL from KageBinary (D-014) | open |
| 3 | v0.3.0 notes only source for #58/#59 | SOURCE-limited | Compass completeness | source access or maintainer disclosure | open |
| 4 | Compass port prep location (D-010) | USER DECISION | port build-out | user decision | open |
| 5 | Compass PR scope (D-011) | USER DECISION | Compass PR shape | user decision | open |
| 6 | No-map chip timing (D-012) | USER DECISION | chip UX | user decision | open |
| 7 | Stopgap patch fate (D-013) | USER DECISION | local stopgap | user decision | open |
| 8 | system-compass access path (D-014) | USER DECISION | all Compass work | user decision | open |
| 9 | #376 fix option (A/B/C) | MAINTAINER | #376 PR | KageBinary direction | open |
| 10 | #371 OSS vs Pro | MAINTAINER | #371 action | KageBinary decision | open |
| 11 | Delayed-data in-scope-for-#57? | MAINTAINER | delayed-data fix | maintainer scoping | open |
| 12 | `0c9087c` vs local overhaul reconciliation | OPEN | feat/ix-agent-skill push | decide merge strategy before any push | open |

**None of these block the investigation itself** — they block publication and
the Compass source work only. The remap branch is verification-clean and
awaits only #1.