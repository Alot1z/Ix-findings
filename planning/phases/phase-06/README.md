# Phase 06 — F-Key Source-Access Gate

| Field | Value |
|---|---|
| Phase | 06 |
| Purpose | Determine whether system-compass source is reachable; if not, finalize the F-key change as an implementable specification |
| Date/time | 2026-08-10 |
| Category | VERIFICATION (gate) |
| Inputs | phase-05 artifact evidence; GitHub probes |
| Repositories involved | system-compass (probe only) |
| Artifacts involved | v0.3.0 artifact (E-004) |
| Work performed | `ls` for local checkout (none); GitHub visibility (404); `git ls-remote` (denied); release-body source rev (`7f98724`) confirmed; wrote the complete implementation specification |
| Findings | F-001…F-005 usable as spec basis; source remains unavailable |
| Evidence | E-004, E-008, E-010 |
| Changes | none |
| Tests | none (spec only; 15-point test plan specified for when source access exists) |
| Suggestions | S-007 (ACCEPTED), S-032 (mount auto-frame — REJECTED/SUPERSEDED by #57), S-033 (drill reframe — SUPERSEDED by #57) |
| Decisions | D-005 (F-key = keyboard exposure only) |
| Unresolved questions | exact function/file names (D-class); COMPASS_TOKEN availability locally (unknown) |
| Outputs | `../../state/phase-6-f-key-gate.md`, `../../pr-packets/compass-f-key/README.md` |
| Next-phase dependencies | phase-07; eventually system-compass PR (source access) |

**Verdict:** BLOCKED — source remains unavailable; **no implementation was
fabricated**. The packet is a complete spec (2 code lines + 1 help entry + ~15
tests + explicit "what NOT to do").
