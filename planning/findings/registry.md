# Master Finding Registry

Canonical IDs `F-###` (1:1 alias `IXF-###` used by the earlier ledger —
`../manifests/findings-index.json`). Evidence classes: A = source,
B = artifact/runtime, C = reconstruction, D = inference. Class is per-claim and
never upgraded by repetition. Machine-readable: `registry.json`.

---

## F-001 — Keyboard handler invariant across 4 releases
- **Repository:** system-compass (artifact evidence) · **Subsystem:** keyboard
- **First phase:** 05 · **Latest phase:** final
- **Evidence class:** B · **Confidence:** high · **Status:** REPRODUCED
- **Severity:** n/a (informational)
- **Affected versions:** v0.1.0, v0.1.1, v0.2.0, v0.3.0
- **Supporting evidence:** E-005
- **Reproduction:** byte-compare of extracted JS keyboard switch across all 4 tarballs — identical
- **Related files:** `../comparisons/keyboard/reconstruction.md`, `../comparisons/historical-matrix.md`
- **Related commits:** n/a · **Related issues:** n/a · **Related PRs:** compass-f-key packet
- **Related suggestions:** S-007 · **Alternative explanations:** minifier renaming could hide a semantic change — ruled out because the switch body/strings are identical
- **Current recommendation:** use as evidence that a keyboard addition is safe (no historical conflict surface)

## F-002 — F/f genuinely unbound in all releases
- **Repository:** system-compass · **Subsystem:** keyboard
- **First phase:** 05 · **Latest phase:** final
- **Evidence class:** B · **Confidence:** high · **Status:** REPRODUCED
- **Affected versions:** all four
- **Supporting evidence:** E-005
- **Reproduction:** zero grep matches for F/f bindings in every chunk of every version
- **Related files:** `../comparisons/keyboard/reconstruction.md`
- **Related PRs:** compass-f-key packet · **Related suggestions:** S-007
- **Alternative explanations:** F could be bound via a different event path — not found (no matches anywhere)
- **Current recommendation:** F-key addition has zero historical conflict

## F-003 — KeyboardHelp byte-identical, no F entry
- **Repository:** system-compass · **Subsystem:** KeyboardHelp
- **First phase:** 05 · **Latest phase:** final
- **Evidence class:** B · **Confidence:** high · **Status:** VERIFIED
- **Affected versions:** all four
- **Supporting evidence:** E-006
- **Reproduction:** extracted `KeyboardHelp-*.js` (v0.3.0: `KnF66B2h`, 1,784 B) — 8 entries, no F
- **Related files:** `../comparisons/keyboard/reconstruction.md`
- **Related PRs:** compass-f-key packet · **Related suggestions:** S-007
- **Current recommendation:** add `{keys:["F"], label:"Fit view"}` when source access exists

## F-004 — Fit math + constants invariant
- **Repository:** system-compass · **Subsystem:** camera/fit
- **First phase:** 05 · **Latest phase:** final
- **Evidence class:** B · **Confidence:** high · **Status:** VERIFIED
- **Affected versions:** all four
- **Supporting evidence:** E-007, E-011
- **Reproduction:** 9 constants (1200,700,56,1.25,112,36,2.5,1.1,96) + contain + snap extracted and compared
- **Related files:** `../comparisons/camera-fit/reconstruction.md`, `../comparisons/historical-matrix.md`
- **Related suggestions:** S-007
- **Current recommendation:** F-key must reuse existing fit math — no duplication (D-005)

## F-005 — #57: one-shot fit latch → keyed refit (v0.2.0→v0.3.0)
- **Repository:** system-compass · **Subsystem:** camera/fit lifecycle
- **First phase:** 05 · **Latest phase:** final
- **Evidence class:** A (release notes) + B (code-level bundle diff) · **Confidence:** high · **Status:** CONFIRMED
- **Affected versions:** all four (change in v0.3.0)
- **Supporting evidence:** E-008, E-003, E-004
- **Reproduction:** v0.2.0 bundle has one-shot latch guard `!q‖A‖(...)`; v0.3.0 replaces with keyed refit effect re-firing on drill/canvas/reserved changes
- **Related issues:** system-compass#57 (also #58, #59 referenced)
- **Related suggestions:** S-032, S-033 (do not duplicate)
- **Alternative explanations:** none — release notes + bundle diff agree
- **Current recommendation:** v0.3.0 already refits on mount/drill/resize — F-key must NOT add auto-frame or drill reframe

## F-006 — Delayed-data blank persists on v0.3.0
- **Repository:** system-compass · **Subsystem:** camera/fit lifecycle + data loading
- **First phase:** 07 · **Latest phase:** final
- **Evidence class:** B (reproduced ×3) + C (mechanism) · **Confidence:** high (repro), medium (mechanism)
- **Status:** REPRODUCED_LIVE · **Severity:** P1 (UX regression vs #57 intent)
- **Affected versions:** v0.2.0, v0.3.0
- **Supporting evidence:** E-009
- **Reproduction:** 60 s proxy delay → camera frozen at placeholder fit (0.44), graph rendered outside viewport, 0 cards visible; fast path correct (0.129)
- **Related files:** `../comparisons/camera-fit/delayed-data-investigation.md`, `../pr-packets/compass-delayed-data/README.md`
- **Related issues:** system-compass#57 · **Related suggestions:** S-008, S-018
- **Alternative explanations:** data race in rollup (E-012 suggests timing-dependent aggregation also plays a role); mechanism C1 (zoomed-rect self-reference) is the strongest inference but needs source confirmation
- **Current recommendation:** separate Compass issue/PR; call out in F-key PR description as known limitation; do NOT fold into F-key (D-006)

## F-007 — Region-rollup aggregate formation is timing-dependent
- **Repository:** system-compass · **Subsystem:** region rollup
- **First phase:** 07 · **Latest phase:** final
- **Evidence class:** B · **Confidence:** medium · **Status:** OBSERVED
- **Severity:** P2
- **Affected versions:** v0.3.0 (observed)
- **Supporting evidence:** E-012
- **Reproduction:** fast data → 9 cards + 1 aggregate; delayed data → 15 cards, no aggregate; same `map_rev`
- **Related files:** `../comparisons/camera-fit/reconstruction.md`
- **Related suggestions:** S-008
- **Alternative explanations:** aggregate threshold depends on total node count at decision time
- **Current recommendation:** investigate rollup decision timing after data completes

## F-008 — Version-series mismatch in `ix upgrade` (#376)
- **Repository:** ix-infrastructure/Ix · **Subsystem:** upgrade
- **First phase:** 03 · **Latest phase:** final
- **Evidence class:** A · **Confidence:** high · **Status:** RESOLVED_UPSTREAM (PR #391 merged 2026-08-11)
- **Severity:** P1 (latent downgrade risk)
- **Affected versions:** v0.9.1 (stamping since PR #365)
- **Supporting evidence:** E-017
- **Reproduction:** deterministic from source — `isNewer("0.3.0","0.9.1")` false today; flips when dist > Ix version
- **Related files:** `../github/issues/376/README.md`, `../pr-packets/ix-376-version-mismatch/README.md`, `../state/phase-7-upstream-reconciliation-2026-08-11.md`
- **Related commits:** `dcc0962` (#365) · **Related issues:** Ix#376 · **Related PRs:** #365, #366, #344, **#391 (fix)**
- **Related suggestions:** S-013 · **Alternative explanations:** none — source-proven
- **Upstream resolution (2026-08-11):** KageBinary merged #391 — `release.yml` stamps `compass/.version` with `$VERSION+release.<sha>` and the CLI skips the comparison for release bundles. The fix comments cite this finding's exact failure scenario ("the first dist tag above the running Ix version…"). Shipped fix is a superset of Option C (identity marker), better than Option A. Analysis retained as validated; status corrected per `state/phase-7-upstream-reconciliation-2026-08-11.md`.

## F-009 — `patches` command dead/unregistered (#371)
- **Repository:** ix-infrastructure/Ix · **Subsystem:** CLI registration
- **First phase:** 04 · **Latest phase:** final
- **Evidence class:** A · **Confidence:** high · **Status:** RESOLVED_UPSTREAM (PR #390 merged 2026-08-11)
- **Affected versions:** current main
- **Supporting evidence:** E-018
- **Reproduction:** `registerPatchesCommand` exported but never imported (absent from `oss.ts`); `PRO_COMMANDS` masks it
- **Related files:** `../github/issues/371/README.md`, `../state/phase-7-upstream-reconciliation-2026-08-11.md`
- **Related issues:** Ix#371 · **Related PRs:** #372 (--format llm), **#390 (fix)** · **Related suggestions:** S-014
- **Upstream resolution (2026-08-11):** KageBinary merged #390, choosing this investigation's Option 1 (OSS path) — `patches` registered in `oss.ts`, removed from `PRO_COMMANDS`. Issue #371 closed as completed.

## F-010 — Loopback-hardened `/__ix/remap` endpoint (implemented)
- **Repository:** ix-infrastructure/Ix · **Subsystem:** view server
- **First phase:** 02 · **Latest phase:** 13 (PR open)
- **Evidence class:** A · **Confidence:** high · **Status:** PR_OPEN (#393, CI green)
- **Affected versions:** n/a (new feature)
- **Supporting evidence:** E-014, E-015, E-016
- **Reproduction:** 10-test guard matrix + full suite green (730 passed on rebased base); live curl 200/403 (per packet)
- **Related files:** `ix-cli/src/cli/commands/view.ts`, `ix-cli/test/view-server.test.ts`, `../pr-packets/ix-remap-hardening/README.md`
- **Related commits:** `c021b52` → `a05e740` → `1497596` (PR head) · **Related PRs:** **#393 (open)** · **Related suggestions:** S-003, S-004, S-012, S-030
- **Current recommendation:** awaiting maintainer review on #393; merge blocked on REVIEW_REQUIRED only (14/14 checks green)

## F-011 — WSL bootstrap fix
- **Repository:** ix-infrastructure/Ix · **Subsystem:** bootstrap/install
- **First phase:** 02 · **Latest phase:** final
- **Evidence class:** A · **Confidence:** high · **Status:** IN_PR_393 (open)
- **Affected versions:** current main (merged `bootstrap.sh`)
- **Supporting evidence:** E-014
- **Reproduction:** `is_windows()` treats `WSL_DISTRO_NAME` as Windows; WSL has no PowerShell on PATH → installer takes wrong path
- **Related PRs:** remap PR #393 (open) · **Related suggestions:** S-002
- **Current recommendation:** ship with remap PR — now in #393, awaiting review

## F-012 — Dead `node_ok` removal
- **Repository:** ix-infrastructure/Ix · **Subsystem:** bootstrap/install
- **First phase:** 02 · **Latest phase:** final
- **Evidence class:** A · **Confidence:** high · **Status:** IN_PR_393 (open)
- **Affected versions:** current main
- **Supporting evidence:** E-014
- **Reproduction:** `node_ok` set but never read
- **Related PRs:** remap PR #393 (open) · **Current recommendation:** ship with remap PR — now in #393, awaiting review

## F-013 — Zoom-in multiplier discrepancy (×1.25 observed vs ×1.1 in constants)
- **Repository:** system-compass · **Subsystem:** camera/zoom
- **First phase:** 07 · **Latest phase:** final
- **Evidence class:** D (single runtime observation) · **Confidence:** low · **Status:** OPEN (unknown)
- **Severity:** P3
- **Affected versions:** v0.3.0 (observed)
- **Supporting evidence:** E-011
- **Reproduction:** on-screen zoom button appeared to apply ~×1.25
- **Related suggestions:** S-017
- **Alternative explanations:** button may compound two steps, or the observation mixed zoom+pan; artifact constant analysis says ×1.1
- **Current recommendation:** re-verify with source access or a dedicated experiment before claiming anything

---

## Cross-cutting notes

- **Never upgraded:** F-006's mechanism stayed C even though three agents reproduced the symptom (repetition does not upgrade class).
- **Severity legend:** P0 critical / P1 high / P2 medium / P3 low / n/a informational.
- **Statuses:** REPRODUCED · VERIFIED · CONFIRMED · REPRODUCED_LIVE · OBSERVED · OPEN · PR_READY · PR_OPEN · IN_REMAP_PR · IN_PR_393 · RESOLVED_UPSTREAM.

---

## PR-audit findings (2026-08-15) — see `PR-AUDIT-2026-08-15.md` for evidence

## F-014 — #446 global↔namespace PHP scope-boundary regression (C6/C8/D/E)
- **Repository:** ix-infrastructure/Ix · **Subsystem:** core-ingestion (PHP resolution)
- **Evidence class:** A · **Confidence:** high · **Status:** FIXED_FORK · **Severity:** high
- **Reproduction:** global `use` + namespace block declaring its own symbol → wrong CALLS @0.9 to the vendor file; base emits nothing
- **Fix:** fork `0a7d97f` (phpMixedScope parser-level guard) — 113/113 relevant tests

## F-015 — #446 C7 block-scoped use → global code (pre-existing)
- **Status:** PRE_EXISTING (base 043bc68, 83b9be4, 0a7d97f identical) · **Severity:** medium
- **Recommendation:** documented limitation; excluded from 0a7d97f deliberately

## F-016 — #443 renamed-import fallback binds to provider members (X1/X3)
- **Evidence class:** A · **Status:** FIXED_FORK · **Severity:** high
- **Reproduction:** `import { Base as LocalBase }` + provider method `M.Base` → EXTENDS @0.9; base emits nothing
- **Fix:** fork `cba11a3` (plain-qualified-key requirement) — 70/70 resolveEdges

## F-017 — #445 configured-binding path binds to provider members (Y1)
- **Evidence class:** A · **Status:** FIXED_FORK · **Severity:** high
- **Reproduction:** configured mapping + renamed EXTENDS to method `W.Base` → EXTENDS @0.9; base emits nothing
- **Fix:** fork `f9274cc` (same plain-key guard on the configured path) — 72/72 resolveEdges

## F-018 — #446 parser-level phpNamespaceBlocks guard (upstream)
- **Status:** UPSTREAM_PR (in #446 at 83b9be4) · **Severity:** informational
- **Reproduction:** counts namespace_definition nodes on the existing walk; covers same-name and use-only blocks

## N-003 — #444 / #447 audited, no defect
- **Status:** AUDITED · **Severity:** informational
- #444: truncation→failure + bounded failure-reason preservation coherent; #447: path-segment containment sound
