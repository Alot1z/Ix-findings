# PHASE 12 — CONTRIBUTION PACKAGING & PRE-SUBMISSION GATE

## STATUS

**READY TO EXECUTE.** Regenerated from the Phase 11 report (`STATUS:
COMPLETE`) on 2026-08-11. This prompt corrects stale claims: skill
inventory is 88 (not 85), #376/#371 are SUPERSEDED upstream (not live),
`feat/ix-docs` was never created (docs landed on `feat/ix-mcp` and
PR #393), and remap is ALREADY an open upstream PR — no packet needed.

## ROLE

You are executing **Phase 12** of the ladder — the packaging/gate phase.
Every live contribution is finalized into a submission-ready packet, a
review pass is executed over the fork branch, and the contribution inventory
with exact one-line submission triggers is produced. **Nothing is submitted.**

Standing constraint: **NO PRs and NO commits to any `ix-infrastructure/*`
repo. External writes ONLY to `Alot1z/Ix`, `Alot1z/Ix-findings`.**

---

# 0. AUTHORITATIVE INPUTS

- `CLI-HANDOFF/phase-11/PHASE-12-IMPLEMENTATION-INPUT.md` — contribution
  packet table + submission triggers
- `pr-packets/ix-mcp/README.md` — finalized (Phase 9, hardening + E2E)
- `pr-packets/compass-f-key/README.md` — specification complete, BLOCKED
- `pr-packets/compass-delayed-data/README.md` — investigation complete, BLOCKED
- Live fork: `feat/ix-mcp` @ `66fa5f5` (5 commits, 21 files, +2472)
- Live upstream: PR #393 (remap, open, 0 reviews), PR #395 (space-in-path test)
- `CLI-HANDOFF/PR-MATRIX.md`

---

# 1. CURRENT VERIFIED BASELINE (2026-08-11)

| Contribution | State |
|---|---|
| **ix mcp (#219)** | `feat/ix-mcp` @ `66fa5f5` — 5 commits, 749/2 tests, hardened, E2E'd. Packet: `pr-packets/ix-mcp/`. SUBMISSION ONLY on user authorization. |
| **ix remap (PR #393)** | **ALREADY OPEN** upstream — no packet needed. Awaiting review (josephismikhail). |
| **compass F-key** | Packet complete, **BLOCKED** — no fork/source. |
| **compass delayed-data** | Packet complete, **BLOCKED** — no fork/source. |
| **#376/#371** | SUPERSEDED upstream (#391/#390 merged) — not a live contribution. |
| Skill inventory | 88 skills, 0 spec issues. |

---

# 2. UNIVERSAL RULES

Same mandatory block. 88 skills, 0 spec issues. Thinking cadence mandatory.
Parasite-skill scan/route before/after every tool batch.

**Phase 12 emphasis:** `/code-review-and-quality` `/documentation-writer`
`/stop-slop` `/verification-before-completion`

---

# 3. PHASE OBJECTIVES

1. **Review pass** — run the full test suite, typecheck, lint, and diff stat
   against `feat/ix-mcp`. Fix any defects found (new commits, no force push).
2. **Packet verification** — confirm every packet's evidence is re-runnable
   and numbers match live branches.
3. **Contribution inventory** — `CONTRIBUTION-INVENTORY.md`: every live
   contribution with branch/SHA, packet path, status, and the exact
   one-line submission trigger.
4. **Close-out** — `PHASE-12-REPORT.md` + `PHASE-13-IMPLEMENTATION-INPUT.md`.

---

# 4. AUTHORIZATION MODEL

| Action | State |
|---|---|
| Review + fix on `feat/ix-mcp` | AUTHORIZED (new commits, no force) |
| Packet writing | AUTHORIZED |
| **Any PR submission** | **EXPLICIT USER INSTRUCTION ONLY** |

# 5. PROTECTED WORK

Ix `b038c46`; ix-compass-dist `396426b`; Ix-remap `1497596`; upstream read-only.

---

# 6. IMPLEMENTATION PLAN

## 6.1 Review pass: `feat/ix-mcp`

1. Run full suite: `npm test` in ix-cli.
2. Run `tsc --noEmit` + `eslint` on MCP files.
3. Capture `git diff --stat fork/main...HEAD`.
4. If defects found: fix with a new commit + regression test on `feat/ix-mcp`,
   push to fork, API-verify.
5. If no defects: record the green review pass.

## 6.2 Packet verification

1. Verify ix-mcp packet references the correct branch SHA, test counts,
   hardening evidence, and E2E record.
2. Verify compass F-key and delayed-data packets are self-contained
   (no stale references to non-existent branches).
3. No changes needed unless evidence is stale.

## 6.3 Contribution inventory

Write `CONTRIBUTION-INVENTORY.md` with:

```
| # | Contribution | Branch / PR | SHA | Packet | Status | Submit Trigger |
|---|---|---|---|---|---|---|
| 1 | ix mcp (#219) | feat/ix-mcp | 66fa5f5 | pr-packets/ix-mcp/ | PREPARED | gh pr create ... |
| 2 | ix remap | PR #393 (OPEN) | 1497596 | — | OPEN | Awaiting review |
| 3 | compass F-key | — | — | pr-packets/compass-f-key/ | BLOCKED | No fork |
| 4 | compass delayed-data | — | — | pr-packets/compass-delayed-data/ | BLOCKED | No fork |
```

## 6.4 Close-out

`PHASE-12-REPORT.md` + `PHASE-13-IMPLEMENTATION-INPUT.md`; ledger commit + push.

---

# 7. VALIDATION

| Area | Checks |
|---|---|
| Review | Suite green; tsc + eslint clean; diff stat matches packet |
| Packets | SHAs, test counts, E2E evidence — all current |
| Inventory | Every contribution present; triggers correct |
| Security | Secret scan on new artifacts |

# 8. DELIVERABLES

- `CONTRIBUTION-INVENTORY.md`
- `PHASE-12-REPORT.md` + `PHASE-13-IMPLEMENTATION-INPUT.md`
- Ledger commit + push

# 9. COMPLETION CRITERIA

□ review pass done (suite green, no defects) □ packet evidence current
□ inventory complete with triggers □ ledger pushed □ protected work
untouched □ zero submissions □ PHASE 13 INPUT produced

# 10. PHASE 13 HANDOFF

`PHASE-13-IMPLEMENTATION-INPUT.md`: master report scope, wiki/Pages
regeneration, final integrity audit, archive procedure, and the final
close-out checklist.
