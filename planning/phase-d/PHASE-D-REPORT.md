# Phase D — Canonical Reconciliation + Provenance + Sync

Generated: 2026-08-12T11:57:27.404Z

Phase C artifacts were consumed as the baseline. No Phase-E roadmap was invented.

## Result

**STATUS: PARTIALLY COMPLETE**

### Canonical reconciliation

- Phase-C verified snapshot: 3614 entities / 13535 relationships.
- Controlled rebuild: 3614 entities / 13535 relationships.
- Duplicate IDs: 0; duplicate relationships: 0; dangling relationships: 0.
- Duplicate concept candidates: 576; overlapping type candidates: 327.
- Historical records were retained. Phase-D scripts/reports are excluded from canonical source discovery so report generation cannot inflate the graph.

### Provenance

Entity provenance: {"UNKNOWN":386,"PARTIAL":3120,"BLOCKED":7,"VERIFIED":101}. Relationship provenance: {"UNKNOWN":774,"PARTIAL":1740,"VERIFIED":11021}. Missing URLs, timestamps, evidence IDs, extraction methods, repository metadata, and line precision are explicitly classified in PROVENANCE-AUDIT.json; nothing was fabricated.

### Current versus historical commits

Current-to-historical commit relationships remaining: 0. The freshness model preserves old SHAs as HISTORICAL and avoids presenting superseded branch/PR heads as CURRENT.

### Collaboration

182 collaboration entities and 429 relationships were reconciled with 0 dangling relationships. Review-thread state remains UNKNOWN; reviewer/maintainer ownership was not inferred.

### Findings

15 findings were reconciled from Phase C: 3 current, 1 resolved, and 3 unknown/blocked-or-needs-reproduction. The ledger was not silently rewritten.

### Incremental sync foundation

Implemented planning/phase-d/incremental-sync.mjs as a deterministic local/manual dry-run foundation. Representative event: changed_pr_head; receipt SYNC-59481a541a4e0af8; status PASS; affected IDs: COMMIT-1b9a761fc2db7087b5bad37f07119f8f6a3467aa, PR-358; full rebuild: false. Watermark, source cursor, changed objects, affected relationships, rebuild scope, validation, timestamps, and failure state are persisted.

### Git relationship quality

1392 CO_CHANGED_WITH edges are labeled STATISTICAL; they are not semantic dependencies. Git history counts remain 2154 commits, 2051 files, 156 branches, and 20394 co-change signals.

### Projections and routes

Canonical/public graph parity: PASS. Public graph: 3614/13535; routes: 3628; sidebar groups root/deep: 8/8. Existing UI design was preserved.

### Visual and production verification

Desktop evidence from Phase C is retained and structurally consistent. Visual result is PARTIAL: mobile/responsive behavior, direct refresh/back-forward, and production HTTP behavior remain UNKNOWN.

### Security and protected work

No external mutations occurred. Public projection and secret/path validation are run after generation. External worktrees unchanged: **true**. The root already contained 4911 dirty paths; only the approved canonical/projection/planning scope was mutated.

## Blockers

- GraphQL review-thread state unavailable.
- Mobile/responsive and production HTTP behavior unavailable in this environment.
- Many local source and relationship records remain PARTIAL or UNKNOWN for provenance; the audit records the gaps.
- No maintainer/owner claim is promoted without stronger evidence.

## Required Phase-E input

PHASE-E-IMPLEMENTATION-INPUT.md is an evidence index only. Phase E must consume the Phase-D report, validation, reconciliation, provenance, sync artifacts, and a newly refreshed live state. Phase D stops here.
