# Remaining Blockers

> **Reconciled 2026-08-11:** blocker 1 is partially cleared (remap pushed + PR
> #393 opened with authorization); blockers 9 and 10 are RESOLVED upstream
> (#391 merged, #390 merged). See
> `../state/phase-7-upstream-reconciliation-2026-08-11.md`.

| # | Blocker | Type | Affects | Resolution path | State |
|---|---|---|---|---|---|
| 1 | Push/PR authorization | GATE (D-009) | remap PR (DONE), fork sync, Ix-findings | user go-ahead | **partial** — remap #393 open; fork/main re-sync still gated |
| 2 | system-compass source access | PERMANENT (re-verified) | F-key PR, delayed-data, #58/#59 | PAT `Contents:read` / fork grant / URL from KageBinary (D-014) | open |
| 3 | v0.3.0 notes only source for #58/#59 | SOURCE-limited | Compass completeness | source access or maintainer disclosure | open |
| 4 | Compass port prep location (D-010) | USER DECISION | port build-out | user decision | open |
| 5 | Compass PR scope (D-011) | USER DECISION | Compass PR shape | user decision | open |
| 6 | No-map chip timing (D-012) | USER DECISION | chip UX | user decision | open |
| 7 | Stopgap patch fate (D-013) | USER DECISION | local stopgap | user decision | open |
| 8 | system-compass access path (D-014) | USER DECISION | all Compass work | user decision | open |
| 9 | #376 fix option (A/B/C) | MAINTAINER | #376 PR | KageBinary direction | **RESOLVED — #391 merged 2026-08-11** |
| 10 | #371 OSS vs Pro | MAINTAINER | #371 action | KageBinary decision | **RESOLVED — #390 merged 2026-08-11 (OSS path)** |
| 11 | Delayed-data in-scope-for-#57? | MAINTAINER | delayed-data fix | maintainer scoping | open |
| 12 | `0c9087c` vs local overhaul reconciliation | OPEN | feat/ix-agent-skill push | decide merge strategy before any push | open |

**None of these block the investigation itself** — they block publication and
the Compass source work only. The remap branch is verification-clean and
awaits only #1.