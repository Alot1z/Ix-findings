# PHASE 12 — CONTRIBUTION PACKAGING & PRE-SUBMISSION GATE

## STATUS
READY TO EXECUTE

## ROLE

You are executing **Phase 12** of the ladder — the packaging/gate phase. Every
contribution the fork work produced (and the one already upstream) is
assembled into a **complete, submission-ready package**: final PR body, diff
summary, test evidence, reviewer notes, cross-references, and the exact
one-line instruction that would submit it. **Nothing is submitted during this
phase.** The phase ends with a gate table the user can fire from.

Standing constraint (user, 2026-08-11): **NO PRs and NO commits to any
`ix-infrastructure/*` repository. External writes ONLY to `Alot1z/Ix`,
`Alot1z/system-compass`, `Alot1z/Ix-findings`.** Submission = explicit user
instruction only.

---

# 0. AUTHORITATIVE INPUTS

- `CLI-HANDOFF/phase-11/PHASE-12-IMPLEMENTATION-INPUT.md` (required)
- `pr-packets/*` — ix-remap-hardening, ix-mcp, ix-376-version-mismatch,
  ix-371-patches-dead-code, compass-f-key, compass-delayed-data
- `CLI-HANDOFF/PHASE-LADDER.md`
- `planning/findings/registry.json`, `CLI-HANDOFF/PR-MATRIX.md`
- Fork branches: `feat/ix-remap-hardening` (`1497596` = PR #393 head),
  `feat/ix-mcp`, `feat/ix-docs` (if Phase 11 created it)

---

# 1. CURRENT VERIFIED BASELINE (per prior phases; re-verify live)

| Contribution | State |
|---|---|
| Remap (F-010…F-012) | **PR #393 OPEN upstream** — CI green, awaiting review. Follow-up packet: if review requests changes, the fix branch plan (fork-only) |
| `ix mcp` (new) | `feat/ix-mcp` pushed to fork; PR body in `pr-packets/ix-mcp/README.md` |
| Docs (CAND-019) | `feat/ix-docs` on fork (if done in Phase 11) |
| Compass f-key | Packet complete; **BLOCKED** (no fork/source) |
| Compass delayed-data | Packet complete; **BLOCKED** |
| #376/#371 packets | **SUPERSEDED** upstream (#391/#390 merged) — archive only |

---

# 2. UNIVERSAL RULES

Same mandatory block as Phase 8. **Full skill inventory applies (all 85, /
prefixes — Phase 8 §2; copy into context).**

**Phase 12 emphasis:** `/code-review-and-quality` `/code-simplification`
`/documentation-writer` `/stop-slop` `/verification-before-completion`
`/doubt-driven-development` `/source-driven-development` `/readme-skill`
`/api-docs-skill`

---

# 3. PHASE OBJECTIVES

1. **Packet finalization** — every live contribution gets a complete,
   self-contained PR packet (title, motivation, design, diff stat, test
   evidence with exact numbers, security posture, reviewer notes, cross-refs).
2. **Review pass** — a code-review pass (as if reviewing the PRs) over every
   fork branch; fix any defects found ON THE FORK (new commits), not by
   rewriting history.
3. **Gate table** — `CONTRIBUTION-INVENTORY.md`: contribution → branch/SHA →
   packet → status → **exact one-line submission instruction**.
4. **Completeness proof** — each packet's test evidence must be re-runnable
   and independently verifiable; no stale numbers.
5. **Close-out** — `PHASE-12-REPORT.md` + `PHASE-13-IMPLEMENTATION-INPUT.md`.

---

# 4. AUTHORIZATION MODEL

| Action | State |
|---|---|
| Review + fix on fork branches | **AUTHORIZED** (new commits on the fork) |
| Packet writing | AUTHORIZED |
| **Any submission** | **REQUIRES EXPLICIT USER INSTRUCTION — never implied** |
| Upstream mutation | PROHIBITED |

---

# 5. PROTECTED WORK

Ix `b038c46/14`; ix-compass-dist `396426b/3`; upstream read-only. Fork
branches are mutable only via new commits (no force, no history rewrite).

---

# 6. IMPLEMENTATION PLAN (ordered)

## 6.1 Review pass per branch

1. `feat/ix-remap-hardening` — re-read the diff vs upstream main; verify the
   packet matches; note #389 relationship (disjoint security fix) for
   reviewers.
2. `feat/ix-mcp` — full self-review: protocol correctness, error paths,
   registration, docs; run the suite again; fix defects with new commits.
3. `feat/ix-docs` (if exists) — consistency check vs `ix --help`.

## 6.2 Packet assembly

For each: `pr-packets/<name>/README.md` gets the final PR body section —
title, body, commit list, diff stat (from `git diff --stat`), test evidence
(suite counts, tsc, eslint, E2E transcripts — sanitized), reviewer notes,
cross-refs, and the SUBMIT instruction line (e.g., "Submit: `gh pr create
--repo ix-infrastructure/Ix ...` — requires user go-ahead").

## 6.3 Gate table + close-out

1. `CONTRIBUTION-INVENTORY.md` — the complete table with statuses
   (OPEN/PREPARED/BLOCKED/SUPERSEDED).
2. `PHASE-12-REPORT.md` + `PHASE-13-IMPLEMENTATION-INPUT.md`.
3. Ledger commit + push.

---

# 7. VALIDATION PLAN

| Area | Checks |
|---|---|
| Review | review checklist per branch; every finding fixed or explicitly deferred with reason |
| Packets | re-runnable evidence (exact commands + outputs recorded); diff stats match live branches |
| Inventory | every contribution present with one-line trigger |
| Registries | JSON valid; no stale statuses |
| Security | secret scan; sanitized transcripts |

# 8. SECURITY / PRIVACY

- PR bodies public-safe: no paths, no tokens, no internal context beyond the
  minimum necessary.
- Review transcripts sanitized.

# 9. DELIVERABLES

- Finalized `pr-packets/*/README.md` for every live contribution
- `CLI-HANDOFF/phase-12/CONTRIBUTION-INVENTORY.md`
- Any review-fix commits on fork branches
- `CLI-HANDOFF/phase-12/PHASE-12-REPORT.md` + `PHASE-13-IMPLEMENTATION-INPUT.md`
- Ledger commit + push

# 10. COMPLETION CRITERIA

□ every live contribution packet final + re-runnable □ review pass done
□ inventory table complete with triggers □ registries valid □ ledger pushed
□ protected work untouched □ zero submissions □ zero upstream mutations

# 11. FAILURE / RECOVERY

- Packet evidence stale → regenerate on the current branch, never reuse old
  numbers.
- Review finds a real bug → fix with a new commit + regression test on the
  fork; do not hide or defer silently.

# 12. PHASE 13 HANDOFF

`PHASE-13-IMPLEMENTATION-INPUT.md` must specify the close-out scope: master
report contents, wiki/Pages regeneration, final integrity audit, and the
archive procedure.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END PHASE 12
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
