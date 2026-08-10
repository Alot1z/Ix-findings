# PR-MATRIX.md — All PR and Issue References

> Every PR and issue referenced in the investigation, with URLs, authors,
> SHAs, and relationship to findings/decisions/commits.
> Sources: `../planning/github/`, `manifests/investigation-index.json`,
> live git state (2026-08-10).

---

## Pull Requests (ix-infrastructure/Ix)

| PR # | Title | URL | Author | Head SHA | Base | State | Related Finding |
|---|---|---|---|---|---|---|---|
| #358 | View port reporting | https://github.com/ix-infrastructure/Ix/pull/358 | Hiro-Chiba | — | main | MERGED | F-010 (remap) |
| #362 | View -p warning | https://github.com/ix-infrastructure/Ix/pull/362 | Hiro-Chiba | — | main | MERGED | F-010 |
| #365 | Compass stamp | https://github.com/ix-infrastructure/Ix/pull/365 | KageBinary | `dcc0962` | main | MERGED | — |
| #366 | Tar pairing | https://github.com/ix-infrastructure/Ix/pull/366 | KageBinary | — | main | MERGED | — |
| **#368** | Agent skill + HTTP API docs | https://github.com/ix-infrastructure/Ix/pull/368 | Alot1z | `2157158` | main | MERGED | F-001..F-007, F-010, D-014 |
| #372 | --format llm | https://github.com/ix-infrastructure/Ix/pull/372 | KageBinary | — | main | MERGED | — |
| #373 | Brew PR conventional title | https://github.com/ix-infrastructure/Ix/pull/373 | — | — | main | MERGED | F-008 (release) |
| #375 | Resolve JS/TS calls across parse batches | https://github.com/ix-infrastructure/Ix/pull/375 | — | — | main | OPEN | #374 (fixes) |
| #378 | Remove stale graph entities | https://github.com/ix-infrastructure/Ix/pull/378 | — | — | main | OPEN | #377 (fixes) |
| #380 | Preserve same-kind ambiguity | https://github.com/ix-infrastructure/Ix/pull/380 | — | — | main | OPEN | #379 (fixes) |
| #382 | Resolve PHP calls through typed receivers | https://github.com/ix-infrastructure/Ix/pull/382 | — | — | main | OPEN | — |

> **State notes (2026-08-10, GitHub API verified):** #362, #372, #373 are MERGED
> (merged_at 16:24, 16:27, 16:07 UTC). #371 and #376 are **ISSUES**, not PRs
> (C-007/C-008 resolved). PR #375 fixes #374; #378 fixes #377; #380 fixes #379.

---

## Issues Referenced

| Issue # | Repository | Title | URL | Related Finding |
|---|---|---|---|---|
| #57 | system-compass | Fit latch → keyed refit (v0.2.0 → v0.3.0) | PRIVATE | F-005 |
| #58 | system-compass | (referenced in v0.3.0 release notes) | PRIVATE | — |
| #59 | system-compass | (referenced in v0.3.0 release notes) | PRIVATE | — |
| #194 | ix-infrastructure/Ix | Brew formula update | https://github.com/ix-infrastructure/Ix/issues/194 | — |
| #347 | ix-infrastructure/Ix | Map: fail loudly on patch commit failure | https://github.com/ix-infrastructure/Ix/issues/347 | — |
| #348 | ix-infrastructure/Ix | Ingest: stop DEP0151 warnings | https://github.com/ix-infrastructure/Ix/issues/348 | — |
| #369 | ix-infrastructure/Ix | Bump dev-dependencies | https://github.com/ix-infrastructure/Ix/issues/369 | — |
| **#371** | ix-infrastructure/Ix | `patches` command dead/unregistered | https://github.com/ix-infrastructure/Ix/issues/371 | F-009 |
| **#374** | ix-infrastructure/Ix | Cross-batch calls | https://github.com/ix-infrastructure/Ix/issues/374 | PR #375 (fixes) |
| **#376** | ix-infrastructure/Ix | Version-series mismatch in `ix upgrade` | https://github.com/ix-infrastructure/Ix/issues/376 | F-008 |
| **#377** | ix-infrastructure/Ix | Remapping keeps deleted/renamed symbols in graph | https://github.com/ix-infrastructure/Ix/issues/377 | PR #378 (fixes) |
| **#379** | ix-infrastructure/Ix | --kind silently selects among duplicate same-kind symbols | https://github.com/ix-infrastructure/Ix/issues/379 | PR #380 (fixes) |

---

## PR-to-Finding Mapping

| Finding | PRs/Issues | Relationship |
|---|---|---|
| F-001..F-005 | #368, #57 | Compass F-key feature surfaced in #368; redirected to system-compass by maintainer |
| F-005 | #57 | #57 already covers V3 refit; F-key must NOT re-add auto-frame |
| F-006, F-007 | — | Delayed-data: separate concern, separate issue |
| F-008 | #376 | Latent `ix upgrade` version-series mismatch |
| F-009 | #371 | `patches` command dead/unregistered |
| F-010..F-012 | #358, #362, #368 | Remap hardening: loopback binding, WSL fix, dead-code removal |
| F-013 | — | Zoom ×1.25 vs ×1.1 anomaly — open investigation |

---

## PR-to-Commit Mapping

| PR | Commit(s) | Notes |
|---|---|---|
| #365 | `dcc0962` | Compass stamp |
| #368 | `2157158` (merged), `0c9087c` (fork head after monkey-patch strip) | Agent skill + docs |
| #348 | `01308e6` | DEP0151 fix |
| #347 | `4258d9f` | Patch fail fix |

---

## PR Recommendation Matrix (from `../planning/pr-planning/`)

| Target | PR/Issue | Recommendation | Evidence | Blockers |
|---|---|---|---|---|
| Ix remap | NEW PR | Push `feat/ix-remap-hardening` → open PR | F-010..F-012, E-014..E-016 | Push/PR authorization (D-009) |
| Ix #376 | NEW PR | Fix version-series mismatch (Option A) | F-008, E-017 | Maintainer direction |
| Ix #371 | NEW ISSUE/PR | OSS vs Pro decision | F-009, E-018 | Maintainer decision |
| Compass F-key | NEW PR | F + help + hint chip only (against system-compass source) | F-001..F-005 | Source access (D-014) |
| Compass delayed-data | NEW ISSUE/PR | Reproducible blank with delayed data | F-006, F-007 | Source access, maintainer scoping |
| ix-compass-dist | NO ACTION | Distribution channel — never modify | D-007 | — |
