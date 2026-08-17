# Knowledge Graph Data Quality

Generated: 2026-08-12

- Raw source files ingested: 407
- Canonical entities: 3695
- Typed relationships: 13604
- Orphan entities: 31
- Historical duplicate-ID claims requiring recheck: 0
- Explicit contradictions: 6
- Finding evidence coverage: 58.3%
- Provenance coverage: 87.8%
- Human-summary coverage: 95.6%
- LLM metadata coverage: 100.0%
- Precise typed-edge coverage: 100.0%

## Interpretation

These metrics describe data quality, not engineering correctness. Orphans are reported for review; the generator does not invent edges merely to reduce the count. Historical contradictions remain explicit. The existing UI remains unchanged and its Pages output remains a snapshot.

## Blockers

- Private system-compass source remains inaccessible in the audited baseline.
- Live GitHub state must be refreshed before treating the dataset as current for publication.
- The generator and JSON integrity checks passed in this reconstruction run.
