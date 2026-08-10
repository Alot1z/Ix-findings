# Final Validation & Reconciliation

## Reconciliation log

| # | Item | Disposition |
|---|---|---|
| R-01 | **Release dates.** `manifests/artifact-sha256.json` lists v0.1.0/v0.1.1/v0.2.0 `release_date` as 2026-08-07/08; three other documents (release timeline, repository map, investigation index) corroborate 2026-03-28 / 03-29 / 06-08. | The August values are **recovery dates**; March/June are the reconciled release dates (used in `../overview/timeline.md`, `../github/releases.md`). Documented; the manifest was **not** rewritten (evidence preservation). |
| R-02 | **Phase numbering.** Ledger uses 0–12; planning layer preserves that and adds `phase-13` (pending) + `phase-final`. | Kept existing numbering for link compatibility. |
| R-03 | **Finding IDs.** Ledger `IXF-###` ↔ planning `F-###` (1:1). | Mapped in `../findings/registry.md`; both stable. |
| R-04 | **Decision IDs.** Ledger `DEC-###` ↔ planning `D-###` (D-001…D-009 1:1); plan.md D1–D5 → D-010…D-014 (OPEN). | Mapped; no collision. |
| R-05 | **Zoom multiplier.** phase-07 observed ×1.25 on the button vs ×1.1 constants. | Recorded as F-013 (class D), not resolved. |
| R-06 | **Path sanitization.** Raw `E:\E-github-repos\…` in `decisions/log.md` + `repositories/repository-map.md`. | Replaced with placeholders (privacy). `tasks/*.md` in the Ix repo flagged as unsanitized, local-only. |
| R-07 | **Claim "KeyboardHelp verified across all 4".** Master report phase-05 note: local copy only re-extracted v0.3.0; the 4-way comparison was done in the deep-dive. | Classified PARTIALLY VERIFIED in prior tables; the 4-way evidence (E-005/E-006/E-007) stands. |
| R-08 | **Fork `0c9087c`.** Not present locally. | Open reconciliation (blocker #12). |

## Claim status of important statements

| Claim | Class | Source of truth |
|---|---|---|
| remap branch clean, 656 tests, tsc/eslint clean | VERIFIED | live re-run (E-016) |
| fork 5 behind, local main synced | VERIFIED | live `rev-list` (E-019) |
| system-compass private/unreachable | VERIFIED | live probe (re-checked) |
| F/f unbound in all 4 releases | VERIFIED | artifact byte-compare (E-005) |
| #57 latch→refit | VERIFIED (A) | release notes + bundle diff |
| delayed-data blank on v0.3.0 | VERIFIED | reproduced ×3 (E-009) |
| delayed-data mechanism (self-referential refit) | PARTIALLY VERIFIED (C) | needs source |
| zoom ×1.25 | UNVERIFIED (D) | single observation |
| v0.3.0 source rev 7f98724 | VERIFIED | release body |

## Quality gate (Phase FINAL)

- **Files:** every referenced registry exists (checked via `find`).
- **JSON:** all registries + maps parse (validated with `node -e JSON.parse`).
- **Links:** internal markdown links point to existing files (spot + grep check).
- **Wiki:** `../wiki/index.html` loads locally (no server), graph renders, all
  views/filters present (opened + inspected).
- **Evidence:** every major finding (F-001…F-013) has ≥1 evidence ref.
- **Claims:** source claims are source-proven (A) or explicitly C/D.
- **Git/GitHub:** verified live, not from memory.
- **Privacy:** grep scan clean; secrets none.

## "Did I…" checklist (all YES unless noted)

Read every phase ✓ · inspected actual outputs ✓ · reconciled stale claims ✓ ·
collected findings ✓ · collected suggestions ✓ · recorded rejected/deferred/
superseded ✓ · recorded decisions ✓ · verified git/forks/worktrees/artifacts/
tests/security/privacy ✓ · reconciled GitHub context ✓ · preserved PR
separation ✓ · avoided fabricating source/remote ops ✓ · created the planning
archive + knowledge base + wiki ✓ · wiki works ✓ · findings traceable to
evidence ✓ · recommendations traceable to suggestion/decision ✓ · unknowns
visible ✓ · reproductions documented ✓.

**Not done (by design):** no push, no PR, no merge, no release, no review
request, no destructive git op, no fabricated source access.