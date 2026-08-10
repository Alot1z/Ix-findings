# GitHub — Pull Requests

## Directly relevant to this investigation

| PR | Subject | Author | Status | Relation |
|---|---|---|---|---|
| #344 | prerelease compare (isNewer) | Joseph Mikhail | MERGED | baseline for #376 (F-008) |
| #356 | staleness scoped per workspace | Hiro-Chiba | MERGED | view/status domain |
| #358 | report real visualizer port | Hiro-Chiba | MERGED | view.ts precedent for remap tests |
| #362 | `-p` mismatch warning + status URL | KageBinary | OPEN | same file as remap, different section — no conflict expected |
| #363 | drop stale client | (KageBinary) | MERGED | — |
| #365 | stamp bundled compass (.version) | KageBinary | MERGED | **root cause of #376** |
| #366 | pair tar binary with path form | KageBinary | MERGED | #376 companion |
| #368 | ship ix agent skill + HTTP API docs | Alot1z | MERGED | origin of this investigation; reviewer redirect |
| #369/#370 | dep bumps | dependabot | MERGED | base of remap |
| #372 | `--format llm` for five commands | KageBinary | OPEN | touches #371's stub |
| #373 | brew PR conventional title | KageBinary | OPEN | CI-only |

## Hiro-Chiba's fix pairs (catalogued, out of scope)

#375→#374 · #380→#379 · #382→#381 (all OPEN)

## Planned PRs (NOT opened — D-009)

| Item | Target | Branch | Status |
|---|---|---|---|
| Remap | ix-infrastructure/Ix main | `feat/ix-remap-hardening` @ `c021b52` | ready, not pushed |
| #376 fix | ix-infrastructure/Ix main | (not created) | packet ready |
| #371 decision | ix-infrastructure/Ix main | (not created) | needs maintainer decision |
| F-key | system-compass main | `feat/f-key-fit-view` | spec only (source-blocked) |
| Delayed-data | system-compass | (not created) | investigation packet (source-blocked) |

## Zero-overlap check

Phase-04/12 verified the remap diff overlaps none of the 8 open issues and none
of the open PRs (including #362, which touches a different section of view.ts).
