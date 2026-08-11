# GitHub — Pull Requests

> **Reconciled 2026-08-11 (GitHub API).** Statuses below are current as of
> 2026-08-11. Full record: `../state/phase-7-upstream-reconciliation-2026-08-11.md`.

## Directly relevant to this investigation

| PR | Subject | Author | Status | Relation |
|---|---|---|---|---|
| #344 | prerelease compare (isNewer) | Joseph Mikhail | MERGED | baseline for #376 (F-008) |
| #356 | staleness scoped per workspace | Hiro-Chiba | MERGED | view/status domain |
| #358 | report real visualizer port | Hiro-Chiba | MERGED | view.ts precedent for remap tests |
| #362 | `-p` mismatch warning + status URL | KageBinary | MERGED | same file as remap, different section — no conflict |
| #363 | drop stale client | (KageBinary) | MERGED | — |
| #365 | stamp bundled compass (.version) | KageBinary | MERGED | **root cause of #376** |
| #366 | pair tar binary with path form | KageBinary | MERGED | #376 companion |
| #368 | ship ix agent skill + HTTP API docs | Alot1z | MERGED | origin of this investigation |
| #369/#370 | dep bumps | dependabot | MERGED | base of remap |
| #372 | `--format llm` for five commands | KageBinary | MERGED | touched #371's stub |
| #373 | brew PR conventional title | KageBinary | MERGED | CI-only |
| #375 | resolve JS/TS cross-batch calls | Hiro-Chiba | MERGED | fixes #374 |
| #378 | remove stale graph entities | Hiro-Chiba | MERGED | fixes #377 |
| #380 | preserve same-kind ambiguity | Hiro-Chiba | MERGED | fixes #379 |
| #382 | PHP calls through typed receivers | Hiro-Chiba | MERGED | fixes #381 |
| #389 | view fs-race + 2 lockfile CVEs | josephismikhail | MERGED | view security; disjoint from remap |
| **#390** | register the `patches` command | KageBinary | MERGED | **fixes #371 (F-009)** |
| **#391** | stop comparing unrelated version series | KageBinary | MERGED | **fixes #376 (F-008)** |
| #392 | stage upgrade downloads under IX_HOME | KageBinary | MERGED | mitigates #385 |
| **#393** | real /__ix/remap + loopback guard; WSL fix | Alot1z | **OPEN — CI green, awaiting review** | **F-010/F-011/F-012** |
| #394 | CodeQL advanced setup | — | MERGED | CI |
| #395 | test: IX_HOME containing a space | KageBinary | OPEN | #392, #349 |
| #388 | brew formula v0.9.2 | github-actions[bot] | OPEN | release 0.9.2 |

## Hiro-Chiba's fix pairs (catalogued, all MERGED)

#375→#374 · #378→#377 · #380→#379 · #382→#381

## Planned PRs

| Item | Target | Branch | Status |
|---|---|---|---|
| Remap | ix-infrastructure/Ix main | `feat/ix-remap-hardening` @ `1497596` | ✅ **#393 OPEN** (2026-08-11) |
| #376 fix | ix-infrastructure/Ix main | — | ✅ DONE UPSTREAM — #391 merged |
| #371 decision | ix-infrastructure/Ix main | — | ✅ DONE UPSTREAM — #390 merged (OSS path) |
| F-key | system-compass main | `feat/f-key-fit-view` | spec only (source-blocked) |
| Delayed-data | system-compass | (not created) | investigation packet (source-blocked) |

## Zero-overlap check

Phase-04/12 verified the remap diff overlaps none of the 8 open issues and none
of the open PRs (including #362, which touches a different section of view.ts).
