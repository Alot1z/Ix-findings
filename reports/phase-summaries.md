# Phase Summaries

## Phase 0 — Initial State Audit

**Status:** ✅ Complete  
**Report:** `state/phase-0-audit.md`

Established the exact current state of every repository, worktree, branch, and
remote. Key findings:

- Ix primary worktree: `feat/ix-agent-skill` @ `b038c46`, 18 uncommitted files
- Ix-remap worktree: `feat/ix-remap-hardening` @ `c021b52`, clean
- ix-compass-dist: Distribution channel, not source code
- system-compass: Private, no local checkout
- Ix-findings: Not a Git repo, investigation workspace only
- Fork main: 5 behind origin/main
- Remap branch correctly positioned on origin/main (not stale main)

## Phase 1 — Fork Synchronization

**Status:** ✅ Complete  
**Report:** `state/phase-1-sync-report.md`

Synchronized the Ix fork without touching the uncommitted overhaul:

- Local main fast-forwarded from `01308e6` (10 behind) to `c4f8fea` (= origin/main)
- Used `git branch -f` to avoid checkout (18 uncommitted files preserved)
- Remap branch already correctly positioned — no rebase needed
- Fork NOT pushed (remains at `0437abf`, 5 behind)
- Only 2 of 10 incorporated commits touched remap files, both already in ancestry

## Phase 2 — Remap Finalization

**Status:** ✅ Complete  
**Report:** `state/phase-2-remap-report.md`

Prepared `feat/ix-remap-hardening` as a clean, reviewable PR candidate:

- 4 files changed: view.ts (+55/-3), view-server.test.ts (+178 new), bootstrap.sh (+4/-5), docs (+13/-3)
- Security model verified: loopback binding, Host guard, Origin guard, IPv6, client-disconnect reaping
- 10-test guard matrix covering all scenarios
- 656 Vitest passed, 2 skipped, TypeScript clean, ESLint clean
- No secrets, no personal paths, no debug output
- Full PR packet written

## Phase 3 — Issue #376 Investigation

**Status:** ✅ Complete  
**Report:** `github/issues/376/README.md`

Investigated the version-series mismatch in `ix upgrade`:

- `compass/.version` stamped with Ix version (e.g., "0.9.1") — PR #365
- `compassLatest` fetched from ix-compass-dist (e.g., "0.3.0")
- `isNewer("0.3.0", "0.9.1")` → false — correct by accident
- When ix-compass-dist > Ix version, upgrade would incorrectly replace bundled compass
- All claims Class A (source-proven via direct code inspection)
- Unrelated to remap PR

## Phase 4 — Full Security & Historical Audit

**Status:** ✅ Complete  
**Report:** `findings/phase-4-audit.md`

Comprehensive audit of the Ix repository:

- **8 open issues** catalogued and classified
- **6 open PRs** with fix PRs linked (Hiro-Chiba's #375, #378, #380, #382)
- **Security posture: STRONG** — gitleaks, Trivy, Scorecard, dependency review, pinned actions, hardened runners, atomic config writes, debug redaction
- **No secrets found** — zero hardcoded tokens, keys, or passwords
- **Minor findings:** GitHub token format validation (P3), bootstrap curl-pipe-no-hash (P2), Compass-patch reference may be stale (P3)
- **Remap PR cleared** — zero overlap with any open issue or PR

## Phase 5 — Compass Historical Reconstruction

**Status:** ✅ Complete  
**Reports:** `comparisons/historical-matrix.md`, `comparisons/keyboard/reconstruction.md`, `comparisons/camera-fit/reconstruction.md`, `comparisons/releases/timeline.md`

Deep behavioral reconstruction of all 4 Compass artifact versions:

- **Keyboard handler invariant** — byte-identical across v0.1.0–v0.3.0
- **KeyboardHelp fully extracted** — 8 entries, no F, byte-identical
- **All 9 fit constants verified** in v0.3.0 bundle (1200, 700, 56, 1.25, 112, 36, 2.5, 1.1, 96)
- **Zoom contract confirmed** — min(2.5, z×1.1) up, max(fitZoom, z×0.9) down
- **#57 lifecycle (Class A)** — one-shot latch → keyed refit effect (v0.2.0→v0.3.0)
- **45-row behavioral matrix** with evidence classification

## Phase 6 — F-Key Source-Access Gate

**Status:** ✅ Complete (BLOCKED)  
**Report:** `state/phase-6-f-key-gate.md`

Determined system-compass source availability:

- **Source remains unavailable** — private repo, 404, no clone access
- Did NOT fabricate implementation
- Finalized F-key PR packet as **complete implementation specification**
- Spec: 2 lines in keyboard switch + 1 entry in KeyboardHelp + 15 tests
- Ready to hand to any developer with source access

## Phase 7 — Delayed-Data Deep Investigation

**Status:** ✅ Complete  
**Reports:** `comparisons/camera-fit/delayed-data-investigation.md`, `pr-packets/compass-delayed-data/README.md`

Live runtime probing of the delayed-data condition:

- **Live reproduction confirmed** on :8099
- CSS zoom: 0.441 (placeholder fit, frozen)
- 15 nodes on 78,600 × 77,783 px canvas
- No region rollup (timing-dependent failure)
- Correct fit zoom: 0.00445 — nodes would be 1.3px wide
- **Root cause:** Timing-dependent rollup + refit effect doesn't recover
- 4 interactive experiments performed (manual zoom, resize, zoom-in button, fit computation)

## Phase 8 — Repository Architecture Audit

**Status:** ✅ Complete  
**Report:** `repositories/repository-map.md`

Complete ecosystem map:

- **5 repositories** catalogued: Ix (source), Alot1z/Ix (fork), ix-compass-dist (distribution), system-compass (private source), Ix-findings (investigation)
- **ix-compass-dist workflow:** Manual releases, no CI, README-only repo
- **Ix-findings status:** No GitHub repo exists, not Git-initialized
- **Access matrix:** Public read for Ix + ix-compass-dist, blocked for system-compass
- **Synchronization model:** Fork → upstream PR flow for Ix; manual releases for Compass

## Phase 9 — Ix-findings Central Evidence Repository

**Status:** ✅ Complete  
**Deliverables:** This file, `README.md`, `manifests/findings-index.json`, `decisions/log.md`, `.gitignore`

Built Ix-findings as a proper evidence repository:

- Initialized as Git repo with .gitignore
- 12 tracked findings with IDs (IXF-001–IXF-012)
- Machine-readable findings index
- 9 architectural decisions recorded
- Complete directory structure with cross-references
- Per-phase summaries

---

## Overall Status

| Phase | Name | Status |
|-------|------|--------|
| 0 | Initial State Audit | ✅ |
| 1 | Fork Synchronization | ✅ |
| 2 | Remap Finalization | ✅ |
| 3 | Issue #376 Investigation | ✅ |
| 4 | Security & Historical Audit | ✅ |
| 5 | Compass Historical Reconstruction | ✅ |
| 6 | F-Key Source-Access Gate | ✅ (BLOCKED) |
| 7 | Delayed-Data Deep Investigation | ✅ |
| 8 | Repository Architecture Audit | ✅ |
| 9 | Ix-findings Evidence Repository | ✅ |

### Ready to Ship
- `feat/ix-remap-hardening` — PR-ready, not pushed

### Blocked on Source Access
- Compass F-key PR
- Compass delayed-data fix

### Open Issues (Ix)
- #371 (patches dead), #374 (cross-batch calls), #376 (version mismatch), #379 (--kind ambiguity), #381 (PHP receivers)
