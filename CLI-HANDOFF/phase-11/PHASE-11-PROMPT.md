# PHASE 11 — ECOSYSTEM SECOND-ORDER RECONCILIATION

## STATUS

**READY TO EXECUTE.** Regenerated from the Phase 10 report (`STATUS:
BLOCKED/READINESS_COMPLETE`) on 2026-08-11. This prompt corrects the
roadmap-era draft: #385/#349 are still OPEN (not "fixed-on-main") but their
fixes ARE merged upstream — the verification is read-only GitHub API
evidence, not a harness. The ix-codex-plugin repo is 404 (moved/renamed).
CAND-006 deferred (same Chromium+Compass gate as Phase 10).

## ROLE

You are executing **Phase 11** of the ladder — the discovery/reconciliation
phase of the second cycle. Phase 10 delivered the Compass readiness audit
(BLOCKED). This phase turns back to the ecosystem: verifying the upstream
fix evidence for #385/#349, studying the plugin MCP alignment (if
accessible), regenerating the candidate universe from live evidence, and
harvesting new findings.

Standing constraint: **NO PRs and NO commits to any `ix-infrastructure/*`
repo. External writes ONLY to `Alot1z/Ix`, `Alot1z/Ix-findings`.**

---

# 0. AUTHORITATIVE INPUTS

- `CLI-HANDOFF/phase-10/PHASE-10-REPORT.md` — Phase 10 BLOCKED/READINESS_COMPLETE
- `CLI-HANDOFF/phase-10/PHASE-11-IMPLEMENTATION-INPUT.md` — carried-forward items
- `planning/findings/registry.json` — F-001…F-013, plus any new
- `CLI-HANDOFF/phase-3/CANDIDATE-EVIDENCE-MATRIX.json` — original candidate universe
- `CLI-HANDOFF/phase-9/PHASE-9-REPORT.md` — Phase 9 PARTIAL (hardening done; platform/perf remain)
- Live GitHub API: PRs #386, #392, #352, #395; issues #385, #349, #383

---

# 1. CURRENT VERIFIED BASELINE (2026-08-11, live-verified)

| Item | State |
|---|---|
| #385 (upgrade-breaks-wrapper) | **OPEN** (0 comments since fix), but fixes MERGED: #386 (ix.cmd diagnosis) + #392 (upgrade under IX_HOME) |
| #349 (installer-space-in-path) | **OPEN** (0 comments since fix), but fixes MERGED: #352 (short TEMP path) + #392 (IX_HOME staging) + open #395 (space-in-path test) |
| #383 (Windows PATHEXT) | **OPEN** — ix-codex-plugin-specific; not an Ix CLI issue per se |
| Merged fix PRs | #352 (2026-08-10), #386 (2026-08-10), #392 (2026-08-11) — all three on upstream main `1292375` |
| Fork state | fork main `5488741` = merge-base with upstream — **none of the #385/#349 fixes are on the fork** (fork-main sync BLOCKED) |
| Plugin MCP | `openai/ix-codex-plugin` → 404 (repo moved/renamed/deprecated) — alignment study impossible without repo access |
| CAND-006 | Deferred (needs Compass + Chromium, both unavailable) |
| CAND-019 | Docs scope — ix mcp docs already landed on fork (Phase 8 + 9); remap docs live on upstream (PR #393) |
| CAND-020 | Blocked on PR #393 merging |
| Phase 9 remaining | Cross-platform + perf + client expansion — carried forward |
| Skill inventory | 88 skills, 0 spec issues |
| Protected | Ix `b038c46`; ix-compass-dist `396426b`; Ix-remap `1497596` |

---

# 2. UNIVERSAL RULES

Same mandatory block: source-driven, verification-before-completion,
doubt-driven, no fabrication, privacy allowlist. 88 skills, 0 spec issues.
Thinking cadence mandatory (START / BETWEEN / AFTER). Parasite-skill
scan/route before and after every tool batch.

**Phase 11 emphasis:** `/verification-before-completion`
`/source-driven-development` `/doubt-driven-development` `/stop-slop`
`/code-review-graph` `/knip`

---

# 3. PHASE OBJECTIVES

1. **#385/#349 fix verification (Class A, read-only)** — confirm the three
   merged PRs (#352, #386, #392) constitute fixes by examining their GitHub
   API evidence: merged dates, changed files, test additions. Record in the
   ledger as Class A evidence (merged code on main). No harness — fork
   lacks the fixes and the fork-main sync is BLOCKED.
2. **Plugin MCP alignment** — `openai/ix-codex-plugin` is 404 (moved or
   deprecated). Record UNVERIFIED + the blocker. If the repo resurfaces,
   the alignment study is: compare tool surface, transport, invocation
   model vs `ix mcp`.
3. **CAND-006** — Playwright delayed-data reproduction: deferred (same
   Chromium+Compass gate as Phase 10).
4. **CAND-019** — docs scope: ix mcp docs already landed on fork (Phase 8:
   docs/api/README.md MCP section, CLAUDE.md, skills/ix; Phase 9: hardening
   contract). Record as DONE for the ix-mcp portion; remap docs live on
   upstream PR #393.
5. **Candidate universe regeneration** — re-evaluate every live candidate
   against current evidence; retire resolved/obsolete ones; promote new
   ones; update the ledger.
6. **Harvest + close-out** — new findings or candidates with provenance
   (never fabricated); `PHASE-11-REPORT.md` +
   `PHASE-12-IMPLEMENTATION-INPUT.md`.

---

# 4. AUTHORIZATION MODEL

| Action | State |
|---|---|
| GitHub API reads | AUTHORIZED |
| Ledger writes (`Alot1z/Ix-findings`) | AUTHORIZED |
| Any implementation on fork branches | AUTHORIZED (but no code changes this phase — read-only) |
| Issue comments on #385/#349 | PROHIBITED |
| Upstream PRs / maintainer contact | PROHIBITED |

# 5. PROTECTED WORK

Ix `b038c46`; ix-compass-dist `396426b`; Ix-remap `1497596`; `feat/ix-mcp`
and `feat/ix-remap-hardening` — untouched.

---

# 6. IMPLEMENTATION PLAN (ordered)

## 6.1 #385/#349 fix evidence record

From the GitHub API (already fetched this run):
- PR #352: merged 2026-08-10 — `install.ps1` (+97/-2) + test (+35) — stops
  Windows installer dying on 8.3-short TEMP path. **This is the #349 fix.**
- PR #386: merged 2026-08-10 — `install.ps1` (+19), `upgrade.ts` (+44/-1),
  `doctor.ts` (+64), new `windows-launcher.test.ts` (+149). The launcher
  now diagnoses its own broken target. **This is part of the #385 fix.**
- PR #392: merged 2026-08-11 — `upgrade.ts` (+144/-16), new
  `upgrade-archive-shape.test.ts` (+171). Upgrade staging under IX_HOME
  instead of TEMP. **This + #386 = the #385 fix.**
- PR #395: OPEN — test covering IX_HOME with a space (directly tests the
  #349 scenario). **The final verification piece.**

Record evidence IDs `E-014` (for #385 fix) and `E-015` (for #349 fix) in
the evidence registry with provenance: PR numbers, merge dates, files,
test counts. Issues remain open as admin matter — not a code defect.

## 6.2 Plugin alignment

`openai/ix-codex-plugin` → 404 API. Record UNVERIFIED with note: "The
repo has been moved, renamed, or deprecated since the Phase 7 audit.
Alignment study is deferred until the new repo name is discovered."

## 6.3 CAND-006 / CAND-019

- CAND-006: deferred (gated on Chromium + running Compass at :8099).
- CAND-019: ix mcp docs DONE (landed on fork, Phase 8+9); remap docs live
  in upstream PR #393. Candidate can be RETIRED or reduce scope to
  "periodic docs refresh."

## 6.4 Candidate universe regeneration

Review all candidates against current evidence:
- CAND-001..CAND-007 (Compass F-key + fit): BLOCKED (no source access)
- CAND-006 (Playwright repro): deferred
- CAND-019 (docs): ix-mcp portion DONE; remap portion IN_PR
- CAND-020 (remap write tool): BLOCKED on PR #393 merge
- Any Phase 1–3 items resolved/retired since → update status
- New candidates (if any) → promote with evidence

## 6.5 Report + ledger

`PHASE-11-REPORT.md` + `PHASE-12-IMPLEMENTATION-INPUT.md`; commit + push
to `Alot1z/Ix-findings`.

---

# 7. VALIDATION PLAN

| Area | Checks |
|---|---|
| Fix evidence | PR #s, merge dates, files, test counts from API — all cited |
| Plugin | API response recorded; honest UNVERIFIED |
| Candidates | Statuses updated against live evidence; retired resolved items |
| Registers | JSON valid; new entries have provenance |

# 8. DELIVERABLES

- `CLI-HANDOFF/phase-11/PHASE-11-REPORT.md`
- `CLI-HANDOFF/phase-11/PHASE-12-IMPLEMENTATION-INPUT.md`
- Updated evidence registry (E-014, E-015)
- Candidate status updates in the ledger

# 9. COMPLETION CRITERIA

□ #385 fix evidence recorded □ #349 fix evidence recorded □ plugin blocked
on 404 (honest) □ candidate universe regenerated □ CAND-006/019 status
updated □ Phase 12 input produced □ ledger pushed □ protected work untouched

# 10. PHASE 12 HANDOFF

`PHASE-12-IMPLEMENTATION-INPUT.md` must list every live contribution and
its packet: remap (#393 — open upstream), ix mcp (feat/ix-mcp — packet),
docs (landed), compass F-key (packet — BLOCKED), delayed-data (packet —
BLOCKED), plus the submission-trigger table (exact commands for when the
user authorizes).
