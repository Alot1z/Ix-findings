# Phase 08 — Repository Architecture Audit

| Field | Value |
|---|---|
| Phase | 08 |
| Purpose | Map the full repository ecosystem and its data flow |
| Date/time | 2026-08-10 |
| Category | AUDIT |
| Inputs | phases 00, 07 |
| Repositories involved | all five |
| Artifacts involved | none |
| Work performed | 5-repo inventory with roles/visibility; relationship diagram (source → fork → distribution → user install); data-flow trace (system-compass → build → ix-compass-dist release → `ix upgrade` → `ix view` → `/__ix/remap`); access matrix; synchronization model |
| Findings | ix-compass-dist = manual, no CI, README-only; Ix-findings not yet a repo; system-compass only source for Compass UI |
| Evidence | E-019, E-020 |
| Changes | none |
| Tests | none |
| Suggestions | S-009 (Ix-findings standalone — ACCEPTED), S-027 (modify dist artifacts — REJECTED) |
| Decisions | D-007 (dist is distribution channel), D-008 (Ix-findings standalone) |
| Unresolved questions | whether to create Alot1z/Ix-findings on GitHub (authorization) |
| Outputs | `../../repositories/repository-map.md` |
| Next-phase dependencies | phase-09 |

**Data flow:** `system-compass (private) → Rolldown build → ix-compass-dist
release assets → ix upgrade fetch → ~/.ix/cli/compass/ → ix view server →
http://127.0.0.1:PORT/ → POST /__ix/remap → ix map . in workspace cwd`.
