# PHASE-4-IMPLEMENTATION-INPUT

**Phase 3 → Phase 4 handoff: the exact implementation work Phase 4 should execute.**
**Generated: 2026-08-10**

---

## A. Implementation Order

Wave 1 — independent, low-risk knowledge corrections (Ix-findings only):

1. **WORK-001** (CAND-001) — correct `CLI-HANDOFF/manifest.json` counts to live 152/136/25
2. **WORK-002** (CAND-002) — reconcile phantom evidence nodes E-026..E-028
3. **WORK-004** (CAND-004) — fix PR-MATRIX #371/#376 labels
4. **WORK-007** (CAND-007) — rewrite GRAPH-AUDIT.md to historical-vs-actual
5. **WORK-011** (CAND-011) — repair 8 dangling graph edges

Wave 2 — graph/matrix enrichment (after graph integrity):

6. **WORK-003** (CAND-003) — add verified PRs/issues to graph + PR-MATRIX
7. **WORK-009** (CAND-009) — enrich graph with verified execution-state nodes
8. **WORK-015** (CAND-015) — derive build-data.mjs contribution gate from canonical sources
9. **WORK-014** (CAND-014) — validate the renderFindings syntax fix (`node --check` + browser smoke)

Wave 3 — validation + contribution preparation:

10. **WORK-010** (CAND-010) — fresh F-008/F-009 reproduction against upstream main `2e246e8` (fetch into Ix-test first — read-only validation)
11. **WORK-005** (CAND-005) — write PACK-371 packet (register-or-delete options)
12. **WORK-012** (CAND-012) — rebase remap onto `2e246e8`, re-run guard tests (**requires authorization to update fork**)
13. **WORK-013** (CAND-013) — sync fork main to `2e246e8` (**requires authorization**)

Wave 4 — record-only + decision-gated:

14. **WORK-016** (CAND-016) — document dual version series (0.6.1 source vs v0.9.x releases)
15. **WORK-017** (CAND-017) — record forge divergence (U-003 resolved)
16. **WORK-018** (CAND-018) — record `--format llm` as implemented upstream
17. **WORK-020** (CAND-020) — commit the two dirty wiki files after validation (**user decision**)
18. **WORK-008** (CAND-008) — GitHub Pages implementation (**user decision + sanitization**)

---

## B. First Implementation Targets (highest-value safe work)

| Work | Why first |
|---|---|
| WORK-001 manifest fix | Foundation; unblocks generator + deployment; trivial |
| WORK-011 dangling edges | Graph integrity prerequisite for enrichment |
| WORK-002 phantom nodes | Registry/graph consistency |
| WORK-014 syntax fix | Committed explorer is currently broken |
| WORK-012 remap rebase | Unblocks the only READY contribution |

All are low-effort, low-risk, fully reversible local edits.

---

## C. Dependencies

- CAND-009 (graph enrichment) **BLOCKED by** CAND-011 (dangling repair)
- CAND-003 (add nodes) **SHOULD FOLLOW** CAND-011
- CAND-015 (generator) **DEPENDS ON** CAND-001 (canonical counts)
- CAND-008 (Pages) **DEPENDS ON** CAND-001, CAND-002, CAND-011, CAND-014, CAND-015
- CAND-020 (commit) **DEPENDS ON** CAND-014 (validated fix)
- CAND-012 (remap rebase) **PRECEDES** CAND-013 (fork sync)
- CAND-010 (reproduction) **ENABLED BY** CAND-012 (fresh baseline)

---

## D. Protected Areas — DO NOT TOUCH

| Path | State | Rule |
|---|---|---|
| `E:/E-github-repos/Ix` | `feat/ix-agent-skill` @ `b038c46`, 14 dirty | **ABSOLUTE — no reset/clean/checkout/stash/merge/rebase/edit** |
| `E:/E-github-repos/ix-compass-dist` | `main` @ `396426b`, 3 dirty (untracked tarballs) | Read-only; D-007 DO-NOT-MODIFY artifacts |
| `E:/E-github-repos/Ix-remap` | `feat/ix-remap-hardening` @ `c021b52`, clean | Read-only in Phase 3; Phase 4 may rebase ONLY with authorization |
| `E:/E-github-repos/Ix-test` | `c4f8fea`, clean | Validation only; fetch/checkout of `2e246e8` allowed (read-only) |
| `E:/E-github-repos/freebuff-forge` | `441cec670`, clean | No mutation without authorization |
| Ix-findings dirty wiki fix | 2 modified files | **Preserve** — it is a real fix, not junk |

---

## E. Blocked Work (must not proceed)

- **F-001..F-004, F-006, F-007, F-013 / CONTRIB-fkey / CONTRIB-delayed** — system-compass private (B-001); resolve only via D-014 user decision. No access request, no fork creation.
- **CAND-008 Pages deployment** — until user authorizes + sanitization review passes.
- **Any PR creation** — external action firewall persists unless the user explicitly authorizes.

---

## F. External-Action Boundaries

| Action | Status |
|---|---|
| Create PRs / issues / reviews / comments | ❌ NOT ALLOWED without explicit authorization |
| Maintainer contact / access request | ❌ NOT ALLOWED (D-014 is user's call) |
| Push to fork (remap rebase, fork main sync) | ❌ Requires user authorization (WORK-012/013) |
| GitHub Pages deploy | ❌ Requires user authorization (CAND-008) |
| Local commits to Ix-findings | ✅ Allowed (the investigation ledger) |
| Read-only GitHub API | ✅ Allowed |

---

## G. Test Requirements per Work Package

| Work | Required validation |
|---|---|
| WORK-001/002/003/009/011 | node endpoint-validation + set-difference scripts; JSON.parse |
| WORK-010 | `npm test` (vitest) in Ix-test @ 2e246e8; upgrade-version-compare.test.ts; patches smoke |
| WORK-012 | `git merge-tree --write-tree` clean; view-server.test.ts (10); full suite 646/648 |
| WORK-014 | `node --check planning/wiki/assets/wiki.js`; browser smoke of findings view |
| WORK-015 | rebuild `data/data.js`, diff vs committed, JSON.parse |
| WORK-020 | `node --check` on both wiki files before committing |
| WORK-008 | link check + secret scan + no-localhost grep on `public/` |

---

## H. Documentation Requirements

- Update `CLI-HANDOFF/manifest.json` `generated` timestamp after regeneration.
- Update PR-MATRIX.md and GRAPH-AUDIT.md to the repaired state.
- Record new findings (CAND-012..CAND-020 / BUG-001, BUG-007, BUG-008) in phase-4 artifacts.
- Do NOT rewrite historical SHAs, dates, PR numbers, or evidence.

---

## I. Exit Criteria for Phase 4

- [ ] Manifest reflects live counts (152/136/25)
- [ ] Graph has 0 dangling edges; evidence sets consistent (25 == 25)
- [ ] PR-MATRIX + graph include all verified PRs/issues with correct types
- [ ] Committed explorer passes `node --check`; findings view works in browser
- [ ] `build-data.mjs` no longer hardcodes the contribution gate
- [ ] F-008/F-009 reproduction recorded against `2e246e8`
- [ ] PACK-371 written
- [ ] Remap branch rebased onto `2e246e8` and guard tests green (if authorized)
- [ ] Fork main synced (if authorized)
- [ ] Dual version series + forge divergence documented
- [ ] All JSON artifacts parse; no secrets written
- [ ] Protected worktrees unchanged (Ix b038c46/14; compass-dist 396426b/3; remap c021b52 clean except authorized rebase; test clean; forge clean)
- [ ] External actions: PRs 0 · issues 0 · reviews 0 · comments 0 · maintainer contacts 0 · Pages deploys 0 (unless explicitly authorized by user)
