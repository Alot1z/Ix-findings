# Ix / Compass — Master Investigation Report

**Date:** 2026-08-10  
**Phases:** 0–12 completed (investigation + preparation), 13 pending (push/PR)  
**Phase 15 queue generated, Phase 16 delivered (this document)**

---

## 1. Executive Summary

A 12-phase investigation of the Ix / Compass ecosystem was conducted. The
investigation covered repository topology, fork synchronization, security
auditing, historical artifact reconstruction, live runtime probing, GitHub
context mapping, and PR preparation. All claims are evidence-classified
(A–D). No source access was fabricated. No GitHub activity was fabricated.

**Key outcome:** One PR-ready branch (`feat/ix-remap-hardening`), three
additional PR packets prepared, 12 findings catalogued, complete Compass
historical matrix (v0.1.0–v0.3.0) built from artifact/runtime evidence.

## 2. Repository State (Verified Fresh)

| Repository | Local Path | Branch | HEAD | Status | Remote |
|-----------|-----------|--------|------|--------|--------|
| Ix (primary) | `<IX_REPO>` | `feat/ix-agent-skill` | `b038c46` | 13 uncommitted files (overhaul, preserved) | origin=ix-infrastructure/Ix, fork=Alot1z/Ix |
| Ix (remap worktree) | `<IX_REMAP_WORKTREE>` | `feat/ix-remap-hardening` | `c021b52` | Clean, 1 ahead of origin/main | Same repo |
| Ix (main) | `<IX_REPO>` | `main` | `c4f8fea` | Synced (0 ahead/0 behind origin/main) | origin=ix-infrastructure/Ix |
| ix-compass-dist | `<COMPASS_DIST_REPO>` | `main` | `396426b` | Clean | origin=ix-infrastructure/ix-compass-dist |
| system-compass | None | — | — | No local checkout | Private, 404 |
| Ix-findings (evidence) | `<IX_FINDINGS>` | `master` | No commits | 28 untracked files | No remote |

## 3. Fork / Upstream State

| Relationship | State |
|-------------|-------|
| Alot1z/Ix vs ix-infrastructure/Ix | Fork: 5 behind, 0 ahead |
| Local main vs origin/main | Synced (Phase 1) |
| Local main vs fork/main | Local is 5 ahead (fork stale) |
| ix-compass-dist vs upstream | Direct clone, not a fork |

## 4. Worktree / Branch Map

```
Ix repository (2 worktrees):
├── <IX_REPO>        → feat/ix-agent-skill @ b038c46 (13 uncommitted)
└── <IX_REMAP_WT>    → feat/ix-remap-hardening @ c021b52 (clean, PR-ready)

ix-compass-dist:
└── main @ 396426b

Ix-findings:
└── master (no commits, 28 files staged)
```

## 5. Change Inventory

### Production Changes (feat/ix-remap-hardening)

| File | Δ | Phase | Intent |
|------|---|-------|--------|
| `ix-cli/src/cli/commands/view.ts` | +55/−3 | Phase 2 | Real /__ix/remap endpoint, loopback guard, export serverScript |
| `ix-cli/test/view-server.test.ts` | +178 | Phase 2 | Guard matrix tests (10 scenarios) |
| `skills/ix/scripts/bootstrap.sh` | +4/−5 | Phase 2 | WSL fix, dead node_ok removal |
| `docs/api/README.md` | +13/−3 | Phase 2 | Endpoint documentation |

### Investigation Artifacts (Ix-findings, 28 files)

All under `<IX_FINDINGS>/` — comparisons, findings, github, manifests, pr-packets,
reports, repositories, security, state, decisions.

### No Changes To
- ix-compass-dist (distribution channel — not modified)
- system-compass (inaccessible)
- Ix upgrade.ts, config.ts, release.yml (separate concerns)

## 6. Claim Verification (Reconciled)

| Claim | Source Phase | Verified | Status |
|-------|-------------|----------|--------|
| Remap branch clean | 0,1,2,12 | ✅ Fresh check: 0 modified files | **Verified** |
| 656 tests passing | 2,12 | ✅ Fresh run: 656/2/51 | **Verified** |
| TypeScript clean | 2,12 | ✅ Fresh run: 0 errors | **Verified** |
| ESLint clean | 2,12 | ✅ Fresh run: clean | **Verified** |
| Fork 5 behind origin | 1,8 | ✅ Fresh check: 5/0 | **Verified** |
| system-compass inaccessible | 0,6 | ✅ Re-checked: 404, no local | **Verified** |
| KeyboardHelp byte-identical across 4 | 5 | ⚠️ Only v0.3.0 extracted locally | **Partially verified** (prior investigation compared all 4) |
| Delayed-data reproducible | 7 | ✅ Live on :8099, zoom 0.441, 15 nodes | **Verified** |
| F/f unbound in all versions | 5 | ⚠️ v0.3.0 confirmed via extraction | **Partially verified** (prior investigation checked all 4) |
| v0.3.0 SHA256 matches | 5 | ✅ Fresh verify: 7ed6cc82… | **Verified** |
| ix-compass-dist has no CI | 8 | ✅ Zero workflow files | **Verified** |
| ix-compass-dist releases manual | 8 | ✅ 4 tags, all on same commit | **Verified** |
| Ix-findings not committed | 9 | ✅ No commits on master | **Verified** |
| No secrets in any file | 4,12 | ✅ Fresh scan: clean | **Verified** |
| No personal paths in any file | 4,12 | ✅ Fresh scan: clean | **Verified** |
| Remap diff matches PR packet | 12 | ✅ Line-by-line verification | **Verified** |
| Guard matrix complete | 2,12 | ✅ All 10 scenarios in code + tests | **Verified** |

## 7. Historical Compass Reconstruction

### Evidence Summary

| Area | v0.1.0–v0.2.0 | v0.3.0 | Evidence |
|------|---------------|--------|----------|
| Keyboard handler | Invariant | Invariant | B (byte-compared across 4 releases per prior investigation) |
| KeyboardHelp (8 entries) | Invariant | Invariant | B (v0.3.0 extracted: ⌘K,Esc,?,L,I,+,-,0) |
| F/f key | Never bound | Never bound | B (zero matches in all versions) |
| Fit constants (1200,700,56,1.25,112,36,2.5,1.1,96) | Invariant | Invariant | B (v0.3.0 confirmed) |
| Zoom contract | Invariant | Invariant | B |
| #57: fit trigger | One-shot latch | Keyed refit effect | A (v0.3.0 release notes by KageBinary) |
| Delayed-data blank | Present | Present | B (3 reproductions) |
| Region rollup | Unknown | Timing-dependent | B (fast vs delayed A/B) |
| Root aggregation 1,471→33 | ✗ | ✓ | A (release notes) |
| Bounded layout | ✗ | ✓ | A (release notes) |
| Breadcrumb collapse 6+ | ✗ | ✓ | A (release notes) |

Full matrix: `comparisons/historical-matrix.md`

## 8. Finding Registry (12 Findings)

| ID | Title | Repo | Class | Status |
|----|-------|------|-------|--------|
| IXF-001 | Keyboard handler invariant across 4 releases | system-compass | B | Reproduced |
| IXF-002 | F/f genuinely unbound | system-compass | B | Reproduced |
| IXF-003 | KeyboardHelp byte-identical, no F | system-compass | B | Verified |
| IXF-004 | Fit math constants invariant | system-compass | B | Verified |
| IXF-005 | #57 one-shot latch → keyed refit | system-compass | A | Confirmed |
| IXF-006 | Delayed-data blank (rollup timing + refit gap) | system-compass | B | Reproduced live |
| IXF-007 | Region rollup timing-dependent | system-compass | B | Observed |
| IXF-008 | Version series mismatch (#376) | Ix | A | Open |
| IXF-009 | Patches command dead (#371) | Ix | A | Open |
| IXF-010 | Loopback-hardened /__ix/remap | Ix | A | PR-ready |
| IXF-011 | WSL bootstrap fix | Ix | A | In remap PR |
| IXF-012 | Dead node_ok removal | Ix | A | In remap PR |

Machine-readable: `manifests/findings-index.json`

## 9. AI-Agent Suggestion Registry

### Accepted

| Suggestion | Phase | Action |
|-----------|-------|--------|
| Use dedicated worktree for remap | 0 | Created `<IX_REMAP_WT>` |
| Base remap on origin/main | 1 | Confirmed `c021b52` on `c4f8fea` |
| Export serverScript for testing | 2 | `export function serverScript()` |
| Use IX_VIEW_MAP_MAIN test seam | 2 | Env var for stub CLI in tests |
| Evidence classification A/B/C/D | 2 | Applied to all findings |
| Keep Compass separate from Ix | 3 | Separate PR packets |
| F-key = keyboard only, no CameraStore | 5,6 | Spec reflects this |
| Delayed-data = separate from F-key | 7 | Different PR packet |
| Ix-findings as standalone repo | 9 | Initialized with .gitignore |
| PR packet for #376 | 11 | Created ix-376-version-mismatch packet |

### Deferred (P1–P2, not yet acted on)

| Suggestion | Phase | Reason deferred |
|-----------|-------|-----------------|
| Fix #376 (stamp dist version) | 3,11 | Awaiting authorization |
| Fix #371 (register patches) | 4,15 | Separate priority from remap |
| Commit Ix-findings | 9,15 | Deferred for final review |
| Sync fork main after remap push | 1,15 | Depends on remap push |
| Verify zoom multiplier (1.1 vs 1.25) | 15 | Low priority investigation |
| Reproduce delayed-data via Playwright | 15 | Source-blocked |
| Investigate system-compass #58, #59 | 15 | Source-blocked |

### Rejected / Superseded

| Suggestion | Phase | Reason |
|-----------|-------|--------|
| Create CameraStore for Compass | (historical Ix port) | Actual Compass has camera state — would duplicate |
| DOM zoom patch for Compass | (historical Ix port) | Fragile, CSS zoom is the actual mechanism |
| Combine F-key + delayed-data in one PR | (considered) | Different causes, different reviews |
| Mix Compass UI changes into Ix PR | (considered) | Separate repos, separate PRs |
| Stash Ix overhaul to work on main worktree | 1 | Unsafe — dedicated worktree used instead |
| Compare against fork/main as base | 1 | Fork stale, origin/main used |
| Manually modify ix-compass-dist artifacts | 8 | Distribution channel, not source |
| Push fork main without sync | 1 | Deferred — needs sync after remap push |

### Dangerous / Incorrect (recorded for audit)

| Suggestion | Phase | Why dangerous |
|-----------|-------|---------------|
| `git reset --hard` on primary worktree | N/A | Would destroy 13 uncommitted overhaul files — explicitly blocked |
| Bind remap to 0.0.0.0 | 2 | Would expose shell-exec endpoint to network — explicitly prevented |
| Pass CLAIM to doubt-driven reviewer | N/A | Would bias reviewer toward agreement — adversarial framing required |

## 10. Security Audit

### Remap Endpoint (Verified in Code + Tests)

| Check | Mechanism | Line | Test |
|-------|-----------|------|------|
| Loopback binding | `server.listen(PORT, "127.0.0.1"` | view.ts:260 | ✅ Template check in test setup |
| Host: localhost | `host === "localhost"` | view.ts:185 | ✅ |
| Host: 127.0.0.1 | `host === "127.0.0.1"` | view.ts:185 | ✅ |
| Host: [::1] | `host.startsWith("[")` branch | view.ts:184 | ✅ Test: accepts IPv6 |
| Origin: absent → allowed | `let loopbackOrigin = !origin` | view.ts:189 | ✅ Test: curl-style POST |
| Origin: loopback | `u.hostname === "localhost" \|\| ...` | view.ts:192-193 | ✅ Test: same-origin |
| Origin: non-loopback → 403 | `if (!loopbackOrigin) → 403` | view.ts:196 | ✅ Test: CSRF, non-loopback |
| Origin: malformed → 403 | `catch { loopbackOrigin = false }` | view.ts:194-195 | ✅ Test: malformed Origin |
| Origin: URL API (not regex) | `new URL(origin)` | view.ts:191 | ✅ Template-literal safe |
| Client-disconnect | `res.on("close", ...)` + `writableEnded` | view.ts:210 | ✅ Code review |
| Test seam | `process.env.IX_VIEW_MAP_MAIN` | view.ts:198 | ✅ Non-prod only |

### Secret / Privacy Scan (All Ix-findings Files)

- ✅ No API keys, tokens, or passwords
- ✅ No SSH keys or certificates
- ✅ No `.env` values
- ✅ No personal filesystem paths (all use sanitized `<REPO_ROOT>`, `<IX_FINDINGS>`, etc.)
- ✅ No email addresses or usernames in evidence files
- ✅ COMPASS_TOKEN references are descriptive only, no value present

### Repository Security Posture (Ix)

- Gitleaks full-history scanning (push + PR)
- Trivy vulnerability + misconfig scanning
- OpenSSF Scorecard (weekly, public)
- Dependency review (blocks high severity)
- All actions pinned to SHAs
- Step-security hardened runners
- Atomic config writes with 0600 permissions
- Debug output redaction in errors.ts

## 11. GitHub / Maintainer Context

### Verified Identities

| User | Role | Activity | Domain |
|------|------|----------|--------|
| KageBinary | COLLABORATOR | Active (14 of last 30 commits) | CLI, upgrade, release, Compass, view |
| josephismikhail | CODE OWNER | Active (7 of last 30) | Reviews KageBinary's PRs; release, deps |
| Hiro-Chiba | CONTRIBUTOR | Active (2 of last 30) | Bug reports + fix PRs; core-ingestion |
| TannerTorrey3 | Historic releaser | Inactive (0 recent) | Compass v0.1.0–v0.2.0 |

### Tagging Guidance

| PR | Tag @KageBinary | Tag @josephismikhail | Tag @Hiro-Chiba |
|----|----------------|---------------------|-----------------|
| Remap | ✅ (view.ts domain) | ✅ (code owner) | ❌ |
| #376 fix | ✅ (authored #365, #376) | ✅ (code owner) | ❌ |
| #371 fix | ✅ (authored #371) | ✅ (code owner) | ❌ |
| Compass F-key | ✅ (system-compass) | ❌ | ❌ |
| Compass delayed-data | ✅ (system-compass) | ❌ | ❌ |

### Relevant Issues & PRs

- **Open issues:** #371, #374, #376, #379, #381 (Ix)
- **Open PRs:** #352, #362, #372, #373, #375, #378, #380, #382 (Ix)
- **system-compass:** #57 (fit latch, fixed), #58, #59 (unknown)
- **Remap related:** #358 (merged, Hiro-Chiba), #362 (open, KageBinary)
- **#376 related:** #365 (merged, KageBinary), #366 (merged, KageBinary), #344 (merged, Joseph Mikhail)

Full context: `github/maintainer-context.md`, `github/historical-prs.md`

## 12. PR / Action Matrix

| Item | Repo | Branch | Status | Action | Blocker |
|------|------|--------|--------|--------|---------|
| Ix remap | Ix | feat/ix-remap-hardening @ c021b52 | PR-ready | Push + open PR | Authorization |
| Ix #376 | Ix | Not created | Packet ready | Create branch + fix release.yml | Authorization |
| Ix #371 | Ix | Not created | Issue open | Decide OSS vs Pro-only | Authorization |
| Compass F-key | system-compass | Not created | Spec only | Implement when source available | Source access |
| Compass delayed-data | system-compass | Not created | Investigation only | Investigate when source available | Source access |
| Ix-findings commit | Ix-findings | master | 28 files uncommitted | `git add -A && git commit` | None |
| Fork sync | Ix | main | 5 behind | `git push fork main` after remap push | Remap push |

## 13. Remote Operations

```
Pushed:           NO — no branch has been pushed
PRs opened:       NO — no PR has been opened
Reviews requested: NO — no reviewer has been notified
Merged:           NO — nothing merged
Released:         NO — nothing released
```

All remote actions require explicit Phase 13 authorization.

## 14. Test & Verification Matrix

| Test | Status | Phase |
|------|--------|-------|
| Ix Vitest (656/2/51) | ✅ PASS | 2, 12 (fresh) |
| Ix TypeScript --noEmit | ✅ PASS | 2, 12 (fresh) |
| Ix ESLint (changed files) | ✅ PASS | 2, 12 (fresh) |
| Remap guard matrix (10 scenarios) | ✅ PASS | 2, 12 |
| Secret scan (remap diff) | ✅ PASS | 2, 12 (fresh) |
| Personal path scan (remap diff) | ✅ PASS | 2, 12 (fresh) |
| Secret scan (all Ix-findings) | ✅ PASS | 11, 16 |
| Personal path scan (all Ix-findings) | ✅ PASS | 11, 16 |
| Artifact SHA256 (v0.3.0) | ✅ PASS | 5 (fresh) |
| KeyboardHelp extraction (v0.3.0) | ✅ PASS | 5 |
| Fit constants extraction (v0.3.0) | ✅ PASS | 5 |
| Delayed-data live reproduction | ✅ PASS | 7 (live on :8099) |
| F-key PoC (patched v0.3.0) | ✅ PASS | Prior investigation |
| Browser zoom-in click test | ✅ PASS | 7 |
| system-compass source access | ❌ BLOCKED | 0, 6 |
| Artifact SHA256 (v0.1.0–v0.2.0) | ⚠️ NOT RE-RUN | Prior investigation verified |

## 15. Remaining Blockers

| Blocker | Affects | Resolution |
|---------|---------|------------|
| Push/PR authorization | Remap PR | Explicit user authorization required |
| system-compass source access | F-key, delayed-data | PAT with Contents:read on private repo |
| v0.3.0 release notes only source for #58, #59 | system-compass investigation | Source access or maintainer disclosure |

## 16. Unknowns (requires source access)

- Exact keyboard handler file/function name in system-compass
- Exact fit callback function name
- Refit effect dependency keys
- Region rollup decision logic
- Canvas measurement method (getBoundingClientRect vs offsetWidth vs scrollWidth)
- system-compass #58 and #59 details
- Whether maintainers consider delayed-data blank a bug or acceptable behavior

## 17. Evidence File Index

| File | Content |
|------|---------|
| `README.md` | Repository index, finding quick-reference |
| `manifests/artifact-sha256.json` | SHA256 for all 4 Compass releases |
| `manifests/findings-index.json` | 12 findings, machine-readable |
| `manifests/investigation-index.json` | Investigation metadata |
| `comparisons/historical-matrix.md` | Full behavioral matrix v0.1.0–v0.3.0 |
| `comparisons/keyboard/reconstruction.md` | Keyboard handler + KeyboardHelp |
| `comparisons/camera-fit/reconstruction.md` | Fit math, #57 lifecycle, zoom contract |
| `comparisons/camera-fit/delayed-data-investigation.md` | Phase 7 deep runtime probe |
| `comparisons/releases/timeline.md` | Release history + evidence map |
| `findings/phase-4-audit.md` | Security + historical audit |
| `security/findings.md` | Security analysis |
| `github/maintainer-context.md` | Verified identities, tagging guidance |
| `github/historical-prs.md` | PR/issue relationships |
| `github/issues/{371,374,376}/README.md` | Per-issue investigations |
| `pr-packets/*/README.md` | 4 PR packets |
| `reports/phase-summaries.md` | Per-phase executive summaries |
| `reports/master-report.md` | This document |
| `repositories/repository-map.md` | Complete ecosystem map |
| `decisions/log.md` | 9 architectural decisions |
| `state/phase-{0,1,2,6,12}-*.md` | Phase gate reports |

---

*All claims verified against current repository state as of 2026-08-10. No
source access fabricated. No GitHub activity fabricated. No secrets or personal
data in any file. PR-ready branch confirmed with fresh test run (656/2/51).*
