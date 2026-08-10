# STALE-CLAIMS.md — Known Discrepancies & Stale Claims

> Updated: 2026-08-10 (Freebuff CLI re-verification)
> Each discrepancy mapped to the file(s) where it appears.
> Distinguish: CURRENT vs HISTORICAL vs STALE vs DERIVED vs UNKNOWN.

---

## Newly Discovered Discrepancies (Freebuff CLI Phase 3–7)

| # | Claim | File(s) | Authoritative Value | Status |
|---|---|---|---|---|
| **S-034** | "11 modified (M)" files in Ix primary | `GIT-STATE.md`, `FREEBUFF-CLI-PROMPT.md` | **6 modified** files: CLAUDE.md, docs/api/README.md, bootstrap.ps1, bootstrap.sh, apply.sh, fit-view.js | **NEW** |
| **S-035** | "13 uncommitted changes" | `GIT-STATE.md`, `FREEBUFF-CLI-PROMPT.md` | **14 uncommitted**: 6M + 5D + 3?? = 14 total | **NEW** |
| **S-036** | "28 untracked entries" in Ix-findings | `GIT-STATE.md`, `README.md`, `manifest.json` | **14 top-level entries** (164 files via `git ls-files --others`) | **NEW** |
| **S-037** | Ix root `package.json` shows version "0.5.0" with 0 dependencies | `manifest.json` | Monorepo: root is workspace shell; `ix-cli/package.json` is the actual CLI at **v0.6.1** with full dependency tree | **NEW** |
| **S-038** | "28 untracked entries" / "164 files" | `GIT-STATE.md`, `manifest.json`, `README.md` | **165 files** across **17 top-level directories** (not 14) | **NEW** |
| **S-039** | PATHS.md lists only `artifacts/` | `PATHS.md` | Missing 4 directories: `evidence/`, `investigations/`, `reproductions/`, `artifacts/v0.1.0`, `artifacts/v0.1.1`, `artifacts/v0.2.0` | **NEW** |
| **S-040** | "118 files in investigation ledger" | `FILE-MANIFEST.md`, `README.md` | Actual count is **186 files** | **NEW** |
| **S-041** | "Alot1z/Ix is the fork" — system-compass fork assumed | `REPOSITORIES.md`, `FINDINGS.md` | `Alot1z/system-compass` returns **404** — fork does NOT exist | **NEW** |

---

## Resolved Discrepancies (fixed in final Desktop audit)

| # | Claim | File(s) | Authoritative Value | Status |
|---|---|---|---|---|
| 1 | "12 findings" | `planning/overview/`, `planning/phases/phase-09/` | **13 findings** (F-001…F-013) | FIXED |
| 2 | "9 decisions" | `planning/overview/phase-overview.md` | **14 decisions** (D-001…D-014) | FIXED |
| 3 | "12 tracked findings" | `planning/phases/phase-09/README.md` | **0 tracked** — Ix-findings has zero commits | FIXED |
| 4 | "12 findings registered with IXF-IDs" | `planning/maps/phases.json`, `wiki/data/data.js` | **13** findings registered | FIXED |
| 5 | MASTER-REPORT "no commits" (vague) | `planning/final/MASTER-REPORT.md` | "no commits, 164 untracked files" | FIXED |
| 6 | Stale wiki data ("12 findings") | `planning/wiki/data/data.js`, `index-standalone.html` | Regenerated from fixed source | FIXED |

---

## Verified-Accurate Claims (re-audited live 2026-08-10)

| Claim | Source | Verified State |
|---|---|---|
| Ix branch: `feat/ix-agent-skill` | Live `git status -sb` | **CORRECT** — 6M + 5D + 3?? |
| Ix HEAD: `b038c46` | Live `git log -1` | **CORRECT** |
| Ix main: `c4f8fea` (synced with origin/main) | Live `git branch -vva` | **CORRECT** |
| Ix remap: `c021b52`, ahead 1, clean | Live `git status` | **CORRECT** |
| Fork/main: `0437abf`, 5 behind origin/main | Live `git rev-list --count` | **CORRECT** |
| Fork agent-skill: `0c9087c` (stripped patch) | Live `git log -1 fork/feat/ix-agent-skill` | **CORRECT** |
| ix-compass-dist: `396426b`, clean + untracked v0.3.0 artifacts | Live `git status` | **CORRECT** |
| ix-compass-dist tags: v0.1.0, v0.1.1, v0.2.0, v0.3.0 | Live `git tag -l` | **CORRECT** |
| Ix-findings: `master`, 0 commits, no remotes | Live `git status` | **CORRECT** |
| F-009: `patches` command dead/unregistered | Live `oss.ts` source | **CORRECT** — in `PRO_COMMANDS`, not imported in `registerOssCommands()` |
| F-008: version-series mismatch in upgrade | Live `upgrade.ts` source | **CORRECT** — `isNewer('0.3.0','0.9.1')` would flip when dist > Ix version |
| F-010: loopback guard in remap | Live `view.ts` diff | **CORRECT** — checks Origin + Host, binds 127.0.0.1 |
| F-011: WSL fix | Live `bootstrap.sh` diff | **CORRECT** — `WSL_DISTRO_NAME` removed from `is_windows()` |
| F-012: `node_ok` removed | Live `bootstrap.sh` diff | **CORRECT** — `node_ok=0` → direct `if ! version_ge` |
| PR #368: 12 files +2,482, compass patch stripped | Live `git log 2157158` | **CORRECT** |
| Remap diff: 4 files +251/-10 | Live `git diff origin/main --stat` | **CORRECT** |

---

## Historical Snapshots (not corrected — they reflect their era)

| File | Content | Why Preserved |
|---|---|---|
| `planning/wiki/repomix-bundle/output.1.md` | Contains "12 findings registered" (stale) | Historical derivative |
| `state/phase-0-audit.md` through `state/phase-12-publication-gate.md` | Phase state files | Historical records |
| `reports/master-report.md`, `reports/phase-summaries.md` | Legacy reports (superseded) | Historical reference |
| `manifests/investigation-index.json` | Phase-era index | Superseded by planning layer |

---

## Findings Chain Integrity (Freebuff CLI verified)

All 13 findings (F-001 through F-013) have intact evidence chains with verified source provenance:

| Finding | Evidence | Source File(s) | Confidence |
|---|---|---|---|
| F-001 | E-005 | Byte-diff of 4 tarballs | HIGH (Class B → confirmed) |
| F-002 | E-005 | Zero grep across 4 tarballs | HIGH (Class B → confirmed) |
| F-003 | E-006 | `KeyboardHelp-KnF66B2h.js` extraction | HIGH (Class B → confirmed) |
| F-004 | E-007, E-011 | Constant extraction + runtime | HIGH (Class B → confirmed) |
| F-005 | E-008 | v0.3.0 release notes | HIGH (Class A+B → confirmed) |
| F-006 | E-009 | 3× A/B reproduction runs | HIGH repro / MEDIUM mechanism |
| F-007 | E-012 | Rollup timing A/B | MEDIUM (Class B → confirmed) |
| F-008 | E-017 | `upgrade.ts:141` (`isNewer`) + `fetchLatestRelease` | HIGH (Class A → confirmed) |
| F-009 | E-018 | `oss.ts:49` (`PRO_COMMANDS`) + `patches.ts:6` | HIGH (Class A → confirmed) |
| F-010 | E-014, E-015, E-016 | `view.ts` diff + tests + 656 suite | HIGH (Class A → confirmed) |
| F-011 | E-014 | `bootstrap.sh` WSL fix diff | HIGH (Class A → confirmed) |
| F-012 | E-014 | `bootstrap.sh` `node_ok` removal diff | HIGH (Class A → confirmed) |
| F-013 | E-011 | Runtime zoom observation | LOW (Class D → unverified) |

---

## Rules for Future CLI Sessions

1. **Do NOT mass-replace historical files** — distinguish stale claims in CURRENT reports from HISTORICAL snapshots.
2. **Revalidate every count** — finding count, decision count, evidence count, modified file count, untracked count.
3. **Report new discrepancies** — record as S-034+ format.
4. **The registries (`registry.json` files) are authoritative** — not markdown summaries or wiki data.
5. **F-013 remains low confidence (Class D)** — requires source access or dedicated experiment for resolution.
