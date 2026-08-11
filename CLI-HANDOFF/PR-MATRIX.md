# PR-MATRIX.md — All PR and Issue References

> Every PR and issue referenced in the investigation, with URLs, authors,
> SHAs, and relationship to findings/decisions/commits.
> Sources: `../planning/github/`, `manifests/investigation-index.json`,
> live git state (2026-08-10) **+ GitHub API re-verification (2026-08-11)**.
> Statuses below are current as of 2026-08-11.

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
| #375 | Resolve JS/TS calls across parse batches | https://github.com/ix-infrastructure/Ix/pull/375 | Hiro-Chiba | — | main | MERGED | #374 (fixes) |
| #378 | Remove stale graph entities | https://github.com/ix-infrastructure/Ix/pull/378 | Hiro-Chiba | — | main | MERGED | #377 (fixes) |
| #380 | Preserve same-kind ambiguity | https://github.com/ix-infrastructure/Ix/pull/380 | Hiro-Chiba | — | main | MERGED | #379 (fixes) |
| #382 | Resolve PHP calls through typed receivers | https://github.com/ix-infrastructure/Ix/pull/382 | Hiro-Chiba | — | main | MERGED | #381 (fixes) |
| **#389** | View fs-race + 2 lockfile CVEs | https://github.com/ix-infrastructure/Ix/pull/389 | josephismikhail | `ffe21f0` | main | MERGED | view security (disjoint from remap) |
| **#390** | Register the `patches` command | https://github.com/ix-infrastructure/Ix/pull/390 | KageBinary | — | main | MERGED | **F-009 (#371) — fixes** |
| **#391** | Stop comparing unrelated version series | https://github.com/ix-infrastructure/Ix/pull/391 | KageBinary | — | main | MERGED | **F-008 (#376) — fixes** |
| **#392** | Stage upgrade downloads under IX_HOME | https://github.com/ix-infrastructure/Ix/pull/392 | KageBinary | — | main | MERGED | #385 (mitigates) |
| **#393** | Real /__ix/remap + loopback guard; WSL fix | https://github.com/ix-infrastructure/Ix/pull/393 | Alot1z | `1497596` | main | **OPEN (CI green)** | **F-010/F-011/F-012** |
| **#395** | Test: IX_HOME containing a space | https://github.com/ix-infrastructure/Ix/pull/395 | KageBinary | — | main | OPEN | #392, #349 |

> **State notes (2026-08-11, GitHub API verified):** #375/#378/#380/#382 are
> MERGED (Hiro-Chiba's fix pairs for #374/#377/#379/#381). #389–#392 merged
> (josephismikhail security; KageBinary patches/upgrade). **#393 (our remap PR)
> is OPEN with 14/14 CI checks green; blocked only on REVIEW_REQUIRED.** #371
> and #376 were ISSUES, not PRs — both closed as completed by their fix PRs
> #390/#391. #394 (CodeQL advanced) merged. #388 (brew v0.9.2) open.

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
| **#371** | ix-infrastructure/Ix | `patches` command dead/unregistered | https://github.com/ix-infrastructure/Ix/issues/371 | F-009 — **CLOSED (fixed by #390)** |
| **#374** | ix-infrastructure/Ix | Cross-batch calls | https://github.com/ix-infrastructure/Ix/issues/374 | **CLOSED (fixed by #375)** |
| **#376** | ix-infrastructure/Ix | Version-series mismatch in `ix upgrade` | https://github.com/ix-infrastructure/Ix/issues/376 | F-008 — **CLOSED (fixed by #391)** |
| **#377** | ix-infrastructure/Ix | Remapping keeps deleted/renamed symbols in graph | https://github.com/ix-infrastructure/Ix/issues/377 | **CLOSED (fixed by #378)** |
| **#379** | ix-infrastructure/Ix | --kind silently selects among duplicate same-kind symbols | https://github.com/ix-infrastructure/Ix/issues/379 | **CLOSED (fixed by #380)** |
| **#381** | ix-infrastructure/Ix | PHP member calls lose receiver types | https://github.com/ix-infrastructure/Ix/issues/381 | **CLOSED (fixed by #382)** |
| **#385** | ix-infrastructure/Ix | `ix upgrade` breaks Windows CLI 0.8.1→0.9.1 | https://github.com/ix-infrastructure/Ix/issues/385 | **OPEN** — fix on main (#386/#392), awaiting reporter confirm |
| **#383** | ix-infrastructure/Ix | Codex hooks fail on native Windows | https://github.com/ix-infrastructure/Ix/issues/383 | **OPEN** |
| **#349** | ix-infrastructure/Ix | Windows installer — path with spaces | https://github.com/ix-infrastructure/Ix/issues/349 | **OPEN** (#352 fixed 8.3 variant) |
| **#219** | ix-infrastructure/Ix | Add `ix mcp` subcommand | https://github.com/ix-infrastructure/Ix/issues/219 | **OPEN** (feature request) |

---

## PR-to-Finding Mapping

| Finding | PRs/Issues | Relationship |
|---|---|---|
| F-001..F-005 | #368, #57 | Compass F-key feature surfaced in #368; redirected to system-compass by maintainer |
| F-005 | #57 | #57 already covers V3 refit; F-key must NOT re-add auto-frame |
| F-006, F-007 | — | Delayed-data: separate concern, separate issue |
| F-008 | #376 → **#391 (fix)** | Latent `ix upgrade` version-series mismatch — **resolved upstream 2026-08-11** |
| F-009 | #371 → **#390 (fix)** | `patches` command dead/unregistered — **resolved upstream 2026-08-11** |
| F-010..F-012 | #358, #362, #368, **#393 (our PR, open)** | Remap hardening: loopback binding, WSL fix, dead-code removal |
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
| Ix remap | **#393 (open)** | ✅ DONE — pushed @ `1497596`, PR open, CI green | F-010..F-012, E-014..E-016 | awaiting review |
| Ix #376 | **#391 (merged)** | ✅ DONE UPSTREAM — marker-based skip (supersedes Option A) | F-008, E-017 | none |
| Ix #371 | **#390 (merged)** | ✅ DONE UPSTREAM — OSS path chosen | F-009, E-018 | none |
| Compass F-key | NEW PR | F + help + hint chip only (against system-compass source) | F-001..F-005 | Source access (D-014) |
| Compass delayed-data | NEW ISSUE/PR | Reproducible blank with delayed data | F-006, F-007 | Source access, maintainer scoping |
| ix-compass-dist | NO ACTION | Distribution channel — never modify | D-007 | — |
