# PHASE 10 — COMPASS FORK READINESS & SOURCE-GATED IMPLEMENTATION

## STATUS

**READY TO EXECUTE** (fork gate already verified: BLOCKED). Regenerated from
the Phase 8 report (`STATUS: COMPLETE`) plus the live-verified state on
2026-08-11. This prompt supersedes the roadmap-era draft: baseline numbers
are current, the fork gate is already API-verified, and Phase 9's partial
hardening + real-client E2E is noted.

## ROLE

You are executing **Phase 10** of the ladder — the Compass thread. This phase
(1) audits the F-key fit-view and delayed-data specifications for drop-in
completeness, (2) verifies the Compass dist artifact hashes, (3) attempts
the `Alot1z/system-compass` fork gate (already verified 404), and (4)
produces a BLOCKED/READINESS_COMPLETE report. No implementation can proceed
without source access, and source is not accessible.

Standing constraint: **NO PRs and NO commits to any `ix-infrastructure/*`
repo. External writes ONLY to `Alot1z/Ix`, `Alot1z/Ix-findings`.**

---

# 0. AUTHORITATIVE INPUTS (read these first)

- `CLI-HANDOFF/phase-8/PHASE-8-REPORT.md` — Phase 8 COMPLETE (ix mcp built)
- `CLI-HANDOFF/phase-9/PHASE-9-REPORT.md` — Phase 9 PARTIAL (hardening + codex E2E done; platform/perf remain)
- `pr-packets/compass-f-key/README.md` — complete F-key implementation spec
- `pr-packets/compass-delayed-data/README.md` — delayed-data investigation + fix directions
- `planning/findings/registry.json` — F-001…F-007, F-013
- `CLI-HANDOFF/phase-9/PHASE-10-IMPLEMENTATION-INPUT.md` — does NOT exist (Phase 9 not complete — derive from Phase 8 report + live state instead)
- `github/issues/383/README.md` — ecosystem split context (compass source is private)

---

# 1. CURRENT VERIFIED BASELINE (2026-08-11)

| Item | State |
|---|---|
| `Alot1z/system-compass` | **404** — API-verified this run. Cannot be created by us. |
| `ix-infrastructure/system-compass` | **404** (private) — no access. |
| ix-compass-dist | `v0.3.0` still latest (2026-08-09); hash `7ed6cc82…` matches `.sha256`. |
| Skill inventory | **88 skills**, 0 spec issues; registry at `~/.agents/skills/.parasite-skill/registry.json`. |
| F-001..F-007 | Reprobed/verified/confirmed during Phase 7–8; statuses stable. |
| F-013 | OPEN, unclassified (zoom ×1.25 observed vs ×1.1 constant); browser experiment deferred (Chromium not available this run). |
| Protected | Ix `b038c46`; ix-compass-dist `396426b`; Ix-remap `1497596`. |
| Fork branches | `feat/ix-mcp` @ `66fa5f5`; `feat/ix-remap-hardening` @ `1497596` — both diverge cleanly from fork main `5488741`. |

---

# 2. UNIVERSAL RULES

Same mandatory block: source-driven, verification-before-completion,
doubt-driven, no fabrication, privacy allowlist, tool safety. Full skill
inventory: 88 skills (0 spec issues). The thinking cadence (`tractatus` →
`sequential` → `doubt-driven` / `debug-thinking` / `context-engineering`
between, `verification` → `code-review` after) is mandatory.

**Phase 10 emphasis:** `/spec-driven-development` `/source-driven-development`
`/verification-before-completion` `/doubt-driven-development` `/stop-slop`

Critical extra rule: **do not fabricate source access.** The fork gate is
already verified 404. Do not attempt workarounds. BLOCKED is a valid
completion.

---

# 3. PHASE OBJECTIVES

1. **Spec audit** — audit the F-key specification for drop-in completeness
   (any developer with source must be able to implement from it with zero
   archaeology). Same for the delayed-data packet.
2. **Artifact hash verification** — confirm the v0.3.0 archive hash still
   matches.
3. **F-013 experiment** — if browser + Compass runtime are available, capture
   zoom-button deltas; otherwise record methodology + DEFERRED. Upgrade or
   demote only with evidence.
4. **Fork gate** — already API-verified 404 (this run). BLOCKED is the
   outcome.
5. **Report** — `PHASE-10-REPORT.md` (BLOCKED/READINESS_COMPLETE) +
   `PHASE-11-IMPLEMENTATION-INPUT.md`.
6. **Do NOT** implement anything (no source). Do NOT fabricate a branch.

---

# 4. AUTHORIZATION MODEL

| Action | State |
|---|---|
| Spec audit, hash verification, report writing | AUTHORIZED |
| Create `Alot1z/system-compass` | IMPOSSIBLE (404 on both upstream and fork) |
| Any implementation | IMPOSSIBLE (no source) |
| PR to `ix-infrastructure/system-compass` | PROHIBITED |
| Touch ix-compass-dist | PROHIBITED (distribution channel) |
| Touch Ix/remap/mcp worktrees | PROHIBITED |

# 5. PROTECTED WORK

Ix `b038c46/14`, ix-compass-dist `396426b/3`, Ix-remap `1497596` — untouched.

---

# 6. IMPLEMENTATION PLAN (ordered)

## 6.1 Spec audit — F-key packet (deliverable: audit findings)

The `pr-packets/compass-f-key/README.md` must pass the "drop-in check":
1. Keyboard handler insertion point — exact switch/case, what function to
   call → ✅ references `onFitView` (same callback as `"0"` key), states
   developer must locate exact function name from source.
2. KeyboardHelp insertion — exact structure, suggested placement → ✅
   `{keys:["F"],label:"Fit view"}`, after `"0"` entry.
3. Constants reused → ✅ "the `0` key already has a working fit callback"
   (no duplication needed).
4. Anti-scope list → ✅ 9 "do not" items covering CameraStore,
   mount auto-fit, drill auto-fit, DOM transforms, timers, no existing key
   changes, no INPUT/TEXTAREA guard changes.
5. Test plan → ✅ 15-point plan, each concrete (press F → fit target;
   press F in input → no action; etc.), not aspirational.
6. Files estimate → ✅ 4 files, ~93 lines (plausible, non-bloated).
7. Blockers documented → ✅ source access documented as BLOCKED.
8. Related work → ✅ system-compass #57, ix-compass-dist, Ix remap PR
   all cross-referenced with relationship notes.

**Verdict:** SPECIFICATION COMPLETE — any developer with source can
implement from this document with zero archaeology. No fabrication
detected.

## 6.2 Spec audit — delayed-data packet

1. Root cause (two layers) → ✅ timing-dependent region rollup +
   refit effect doesn't recover.
2. Live evidence → ✅ 7 measurements from actual v0.3.0 Compass at :8099,
   table with exact values and sources.
3. Interactive experiments → ✅ 4 experiments with actions and results.
4. Evidence classification → ✅ A/B/C/D per-measurement.
5. Fix directions → ✅ 4 options (rollup timing, zoom floor, centering,
   progressive aggregation) with estimated impact.
6. Scope boundaries → ✅ in-scope and out-of-scope explicit.
7. Blockers → ✅ source access documented.

**Verdict:** INVESTIGATION COMPLETE — the mechanism hypothesis (zoomed-rect
self-reference + rollup timing) is sound, the evidence is Class B live on
v0.3.0, and the fix directions are concrete enough to evaluate against
source. No fabrication.

## 6.3 Artifact hash verification

`compass-0.3.0.tar.gz` SHA-256: `7ed6cc82fe58…` — matches `.sha256`
file in ix-compass-dist. Archive unchanged since the Phase 7 probe.

## 6.4 F-013 experiment

Methodology (recorded for when browser available):
1. Serve v0.3.0 Compass locally (extract the tar.gz).
2. Playwright script: click "Zoom In" button 10 times, capture
   `transform` matrix after each click; extract current zoom multiplier
   from CSS `transform` or `getBoundingClientRect`.
3. Compare per-click multiplier to ×1.1 (the constant path).

**This run:** Chromium not in PATH, Compass not running (port 8099 dead).
Cannot execute the experiment. Recorded methodology, status DEFERRED.
F-013 remains OPEN/unclassified — do not upgrade without evidence.

## 6.5 Fork gate

`Alot1z/system-compass` → 404 (API-verified this run).
`ix-infrastructure/system-compass` → 404 (private, no access).
**Verdict: BLOCKED.** No source, no fork, no implementation.

## 6.6 Report + ledger

1. `PHASE-10-REPORT.md` — STATUS: BLOCKED/READINESS_COMPLETE.
2. `PHASE-11-IMPLEMENTATION-INPUT.md` — ecosystem second-order items.
3. Commit + push to `Alot1z/Ix-findings`.

---

# 7. VALIDATION PLAN

| Area | Checks |
|---|---|
| Spec audit (F-key) | 8 drop-in items pass/fail with evidence |
| Spec audit (delayed-data) | 7 items pass/fail with evidence |
| Artifact hash | SHA-256 match = unchanged |
| F-013 | Methodology recorded OR experiment conducted with raw data |
| Fork gate | API response recorded (404) |

# 8. DELIVERABLES

- `CLI-HANDOFF/phase-10/PHASE-10-REPORT.md`
- `CLI-HANDOFF/phase-10/PHASE-11-IMPLEMENTATION-INPUT.md`
- Updated findings if F-013 resolved (not this run)
- No fork branch (no source)

# 9. COMPLETION CRITERIA

□ F-key spec audited (drop-in check) with per-item evidence □ delayed-data
packet audited □ dist hash verified □ F-013 status recorded □ fork gate
verified 404 □ zero fabrication □ zero source access escalation □ zero
upstream mutations □ ledger pushed □ protected work untouched

# 10. FAILURE / RECOVERY

- **Fork 404** → BLOCKED is valid; do not work around.
- **No browser** → record methodology + DEFERRED.
- **No Compass runtime** → same.

# 11. PHASE 11 HANDOFF

`PHASE-11-IMPLEMENTATION-INPUT.md`: ecosystem items — #385/#349 verification
harnesses (fix-on-main confirmation, Class A), ix-codex-plugin alignment
study, CAND-006 (delayed-data repro), CAND-019 (docs scope), new candidates.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END PHASE 10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
