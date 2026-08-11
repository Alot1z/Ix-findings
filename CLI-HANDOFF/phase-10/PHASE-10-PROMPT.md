# PHASE 10 — COMPASS FORK READINESS & SOURCE-GATED IMPLEMENTATION

## STATUS
READY TO EXECUTE — expected honest outcome: READINESS_COMPLETE / BLOCKED (fork
does not exist) unless source access has been granted.

## ROLE

You are executing **Phase 10** of the ladder — the Compass thread. This phase
(1) verifies and hardens the complete implementation specifications for the
F-key fit-view and the delayed-data fix, (2) attempts the `Alot1z/system-compass`
fork **only if access has been granted**, (3) if the fork exists, implements
per the specs with full test plans and commits **only to the fork**, and
(4) prepares — never submits — PR bodies.

Standing constraint (user, 2026-08-11): **NO PRs and NO commits to any
`ix-infrastructure/*` repository. External writes ONLY to `Alot1z/Ix`,
`Alot1z/system-compass` (fork does not exist — create it ONLY if access is
granted; never request or escalate access), `Alot1z/Ix-findings`.**
Standing rule from the investigation: **present public data; never write to
request access.**

---

# 0. AUTHORITATIVE INPUTS

- `pr-packets/compass-f-key/README.md` — the complete F-key implementation spec
- `pr-packets/compass-delayed-data/README.md` — the delayed-data investigation packet
- `planning/compass/*` — reconstruction, historical-matrix, lifecycle, artifacts
- `comparisons/keyboard/reconstruction.md`, `comparisons/camera-fit/reconstruction.md`,
  `comparisons/releases/timeline.md`, `comparisons/camera-fit/delayed-data-investigation.md`
- `state/phase-6-f-key-gate.md` — the access gate (D-014)
- `planning/findings/registry.json` — F-001…F-007, F-013
- `CLI-HANDOFF/phase-9/PHASE-10-IMPLEMENTATION-INPUT.md` (required)
- `github/issues/383/README.md` — ecosystem split context (compass source is
  private; the F-key belongs in system-compass, not Ix)

---

# 1. CURRENT VERIFIED BASELINE (2026-08-11)

| Item | State |
|---|---|
| `Alot1z/system-compass` | **404 — does not exist** (API-verified). Upstream private; no access. |
| ix-compass-dist | `v0.3.0` still latest (API-verified 2026-08-11). Artifact evidence current. |
| F-001/F-002 | REPRODUCED (Class B — keyboard invariant, F unbound, byte-verified across 4 releases) |
| F-003/F-004 | VERIFIED (KeyboardHelp byte-identical; fit-math constants 1200,700,56,1.25,112,36,2.5,1.1,96) |
| F-005 | CONFIRMED (A+B — #57 latch → keyed refit in v0.3.0 release notes + bundle diff) |
| F-006 | REPRODUCED_LIVE (delayed-data blank; mechanism Class C — zoomed-rect self-reference hypothesis) |
| F-007 | OBSERVED (region rollup timing-dependent) |
| F-013 | OPEN, Class D (zoom ×1.25 observed vs ×1.1 constant) — LOW confidence |
| v0.3.0 source rev | `7f98724` (from release notes; the only source-adjacent fact) |
| Release pipeline | #391 now stamps the source SHA per bundle — future access can be verified against it |
| Protected | Ix `b038c46/14`; ix-compass-dist `396426b/3` (NEVER touch — distribution channel, D-007) |

---

# 2. UNIVERSAL RULES

Same mandatory block as Phase 8 (source-driven, verification-before-completion,
doubt-driven, no fabrication, privacy allowlist, tool safety). **Full skill
inventory applies (all 85, / prefixes — Phase 8 §2; copy into context).**

**Phase 10 emphasis:** `/spec-driven-development` `/source-driven-development`
`/verification-before-completion` `/doubt-driven-development`
`/sequential-thinking` `/tractatus-thinking` `/documentation-writer`
`/code-review-and-quality` `/stop-slop`

Critical extra rule: **do not fabricate source access.** If the fork cannot be
created, the phase outcome is BLOCKED/READINESS_COMPLETE — a valid and
sufficient outcome. Never invent file names, line numbers, or behaviors of the
private source.

---

# 3. PHASE OBJECTIVES

1. **Spec verification** — audit the F-key spec for completeness and
   unambiguity (any developer with source must be able to implement from it
   with zero archaeology). Same for the delayed-data packet.
2. **Artifact cross-check** — confirm the four v0.3.0 artifacts still match
   the specs' assumptions (bundle unchanged → re-extraction unnecessary;
   record hashes).
3. **F-013 experiment** — a dedicated artifact-level experiment to resolve or
   demote the zoom anomaly (no source needed). Either upgrade or retire the
   finding — with methodology.
4. **Fork gate** — attempt to create `Alot1z/system-compass` ONLY if access
   was granted (API-visible fork existence or explicit user confirmation).
   Otherwise record BLOCKED with the exact gate.
5. **Implementation (conditional)** — if the fork exists: implement F-key per
   spec on `feat/f-key-fit-view`, run the 15-point test plan + full build,
   commit + push to the fork; implement delayed-data fix per the packet.
6. **PR bodies** — prepare (not submit) PR bodies against
   `ix-infrastructure/system-compass` for F-key and delayed-data.
7. **Close-out** — `PHASE-10-REPORT.md` + `PHASE-11-IMPLEMENTATION-INPUT.md`.

---

# 4. AUTHORIZATION MODEL

| Action | State |
|---|---|
| Read-only spec/artifact work, F-013 experiment | AUTHORIZED |
| Create `Alot1z/system-compass` | ONLY if access granted (verified); otherwise IMPOSSIBLE |
| Commit + push to `Alot1z/system-compass` | AUTHORIZED once it exists |
| PR to `ix-infrastructure/system-compass` | **PROHIBITED** (bodies prepared only) |
| Access requests / maintainer contact | **PROHIBITED** (standing rule) |
| Touch ix-compass-dist | PROHIBITED (D-007) |
| Touch Ix protected work | PROHIBITED |

---

# 5. PROTECTED WORK

- Ix `b038c46/14` — untouched.
- ix-compass-dist `396426b/3` — untouched (distribution channel).
- Remap `1497596`, `feat/ix-mcp` — untouched.
- Upstream — read-only.

---

# 6. IMPLEMENTATION PLAN (ordered)

## 6.1 Spec audit (deliverable: `pr-packets/compass-f-key/README.md` "drop-in check")

1. Implementation shape: keyboard entry `{keys:["F"], label:"Fit view"}` in
   the keyboard handler + KeyboardHelp array — verify the exact structure
   documented matches the extracted artifact (8 entries, no F).
2. Fit-math reuse: the 9 constants + contain/snap — the spec must state that
   F-key reuses existing fit math (no duplication, D-005).
3. Anti-scope list: no CameraStore changes, no auto-frame, no drill reframe
   (F-005: #57 already refits on mount/drill/resize — do NOT duplicate).
4. Test plan: the 15-point plan — verify each point is concrete (input →
   expected output), not aspirational.
5. Delayed-data packet: mechanism hypothesis (C1 zoomed-rect self-reference)
   + fix directions + a verification plan that works WITHOUT source (runtime
   probe on the dist artifact).

## 6.2 F-013 experiment (no source needed)

1. Methodology: instrumented browser run against the v0.3.0 bundle (Playwright,
   `/playwright-cli`), capture zoom-button click → transform matrix deltas
   across many trials; compare to the ×1.1 constant path.
2. Decision: if ×1.25 replicates → upgrade F-013 to Class B (artifact/runtime)
   with the reproduction; if ×1.1 → retire/demote; if inconclusive → keep
   Class D with the experiment recorded. Update registry accordingly.

## 6.3 Fork gate + implementation (conditional)

1. Check fork existence (`gh api repos/Alot1z/system-compass`).
2. If 404 → status = BLOCKED; deliver the readiness package; STOP here (valid
   completion).
3. If it exists (access granted): verify it is a fork of
   `ix-infrastructure/system-compass`, clone, branch `feat/f-key-fit-view`,
   implement per spec, run the 15-point plan + `npm run build`, commit, push,
   API-verify.

## 6.4 PR bodies (never submit)

- `pr-packets/compass-f-key/README.md` — full PR body section (title, spec
  summary, test evidence, anti-scope note, cross-ref system-compass#57).
- `pr-packets/compass-delayed-data/README.md` — PR/issue body for the fix.

## 6.5 Ledger close-out

- Registry updates (F-013 outcome; any new evidence IDs with provenance).
- `PHASE-10-REPORT.md`, `PHASE-11-IMPLEMENTATION-INPUT.md`, commit to
  `Alot1z/Ix-findings`.

---

# 7. VALIDATION PLAN

| Area | Checks |
|---|---|
| Spec | every "drop-in check" item pass/fail with evidence; nothing ambiguous left unmarked |
| Artifacts | SHA check of the four bundles vs recorded hashes |
| F-013 | methodology recorded; trials count; outcome classified |
| Fork | existence check recorded (API); if created: clone/branch/HEAD verified |
| Implementation (if any) | 15-point plan + full build + suite results recorded |
| Ledger | JSON valid; findings/evidence consistent; secret scan clean |

# 8. SECURITY / PRIVACY

- No private source content beyond release-note facts.
- No tokens, no paths, no fabrication.
- The readiness package is public-safe.

# 9. DELIVERABLES

- Audited `pr-packets/compass-f-key/README.md` + `compass-delayed-data/README.md`
- F-013 experiment record (`reproductions/zoom/` or `comparisons/camera-fit/`)
- `CLI-HANDOFF/phase-10/PHASE-10-REPORT.md` (READINESS_COMPLETE or BLOCKED)
- `CLI-HANDOFF/phase-10/PHASE-11-IMPLEMENTATION-INPUT.md`
- (Conditional) `Alot1z/system-compass` fork branch

# 10. COMPLETION CRITERIA

□ spec audit complete with per-item evidence □ artifacts hash-verified
□ F-013 outcome recorded with methodology □ fork gate attempted + recorded
□ no access escalation □ no fabrication □ (if access) implementation + tests
done + pushed □ PR bodies prepared, not submitted □ ledger pushed □ protected
work untouched

# 11. FAILURE / RECOVERY

- **Fork 404** → BLOCKED is a valid completion; do not attempt workarounds
  (no API hacks, no third-party mirrors).
- **Spec gap found** → fix the spec (that is the deliverable), do not guess
  implementation.
- **F-013 inconclusive** → keep Class D; never upgrade without evidence.

# 12. PHASE 11 HANDOFF

`PHASE-11-IMPLEMENTATION-INPUT.md` must specify: the ecosystem second-order
items — #385/#349 verification harnesses (fix-on-main confirmation, Class A),
ix-codex-plugin alignment study (MCP across both repos; plugin #16/#17 open),
CAND-006 (Playwright delayed-data repro), CAND-019 (docs scope), and any new
candidates discovered.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END PHASE 10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
