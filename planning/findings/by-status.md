# Findings by Status

> Reconciled 2026-08-11 — F-008/F-009 resolved upstream; F-010/F-011/F-012 in
> open PR #393. See `../state/phase-7-upstream-reconciliation-2026-08-11.md`.

| Status | ID | Title | Next step |
|---|---|---|---|
| REPRODUCED | F-001, F-002 | keyboard invariant; F unbound | evidence for F-key PR |
| VERIFIED | F-003, F-004 | KeyboardHelp; fit constants | evidence for F-key PR |
| CONFIRMED | F-005 | #57 latch → refit | guard against duplication |
| REPRODUCED_LIVE | F-006 | delayed-data blank | Compass issue/PR (source-blocked) |
| OBSERVED | F-007 | rollup timing | Compass issue (source-blocked) |
| RESOLVED_UPSTREAM | F-008, F-009 | #376, #371 | fixed by #391/#390 (merged 2026-08-11) — close-out only |
| PR_OPEN | F-010 | loopback `/__ix/remap` | **#393 open** — await maintainer review |
| IN_PR_393 | F-011, F-012 | WSL fix; node_ok removal | ships with #393 |
| OPEN | F-013 | zoom anomaly | dedicated experiment (Class D) |

| FIXED_FORK | F-014, F-016, F-017 | #446/#443/#445 regressions | fork commits 0a7d97f / cba11a3 / f9274cc — cherry-pick into PR branches |
| PRE_EXISTING | F-015 | #446 C7 block-use→global leak | known limitation, separate follow-up |
| UPSTREAM_PR | F-018 | #446 phpNamespaceBlocks | already in #446 at 83b9be4 |
| AUDITED | N-003 | #444 / #447 | no defect found — suites pass |
