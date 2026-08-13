# Knowledge Graph Data Quality

Generated: 2026-08-12

- Raw source files ingested: 404
- Canonical entities: 3654
- Typed relationships: 13570
- Orphan entities: 19
- Historical duplicate-ID claims requiring recheck: 0
- Explicit contradictions: 6
- Finding evidence coverage: 86.7%
- Provenance coverage: 88.6%
- Human-summary coverage: 95.6%
- LLM metadata coverage: 100.0%
- Precise typed-edge coverage: 100.0%

## Interpretation

These metrics describe data quality, not engineering correctness. Orphans are reported for review; the generator does not invent edges merely to reduce the count. Historical contradictions remain explicit. The existing UI remains unchanged and its Pages output remains a snapshot.

## Blockers

- Private system-compass source remains inaccessible in the audited baseline.
- Live GitHub state must be refreshed before treating the dataset as current for publication.
- The generator and JSON integrity checks passed in this reconstruction run.
