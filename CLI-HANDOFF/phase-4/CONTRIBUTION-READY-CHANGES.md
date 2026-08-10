# Phase 4 — Contribution-Ready Changes

**Date:** 2026-08-10

> Nothing here has been submitted. External submission (PRs, issues, comments,
> maintainer contact, pushes) remains outside the Phase 4 boundary.

---

## 1. PACK-371 — `patches` command dead/unregistered (F-009)

- **Target:** `ix-infrastructure/Ix`, branch `main`
- **Packet:** `pr-packets/ix-371-patches-dead-code/README.md` (new in Phase 4)
- **Status:** `PACKET_READY — NOT SUBMITTED`
- **Blocker:** maintainer register-vs-delete decision (OSS vs Pro scope)
- **Key evidence:**
  - `registerPatchesCommand` defined but never invoked in `registerOssCommands()`
  - Issue #371 OPEN
  - PR #372 (merged) verified **not** to touch `oss.ts`/`patches.ts` — F-009 fully valid

## 2. CONTRIB-remap — remap hardening (F-010/F-011/F-012)

- **Target:** `ix-infrastructure/Ix`, branch `main`
- **Packet:** `pr-packets/ix-remap-hardening/README.md` (updated in Phase 4)
- **Status:** `VERIFIED_MERGEABLE — rebase + submission deferred`
- **Phase 4 verification:** `git merge-tree --write-tree origin/main HEAD` → exit 0,
  clean tree `f5359738` against upstream `fa10045` (no conflicts)
- **Deferred action (documented, not executed):** exact rebase procedure + PR plan
  in the packet; requires user authorization to rebase + force-update the fork branch

## 3. CONTRIB-376 — version-series mismatch (F-008)

- **Target:** `ix-infrastructure/Ix`, branch `main`
- **Packet:** `pr-packets/ix-376-version-mismatch/README.md` (preserved)
- **Status:** `NEAR_READY`
- **Blocker:** fresh reproduction against current upstream main (deferred, CAND-010)

---

## 4. Explicitly NOT contribution-ready

| Item | Reason |
|---|---|
| system-compass F-key (CONTRIB-fkey) | private source access (D-014) — spec only |
| system-compass delayed-data (CONTRIB-delayed) | private source access — repro confirmed, source blocked |
| Agent-skill overhaul (CONTRIB-agent-skill) | PROTECTED active development (b038c46, 14 dirty) |
| GitHub Pages site | not a contribution; deployment requires authorization |
| Ix-findings knowledge fixes | ledger-internal, not upstream contributions |

---

## 5. PR body drafts

Both packets contain full PR body drafts. They are local artifacts only.
No PR has been opened. No maintainer has been contacted.
