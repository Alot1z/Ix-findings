# Git — Commit Map (change → PR)

## Ix main chain (recent, most recent first)

| Commit | Subject | PR | Relevance |
|---|---|---|---|
| `c4f8fea` | chore(deps-dev): bump dev-deps | #369 | base of remap branch |
| `f2803e8` | chore(deps): bump actions | #370 | — |
| `e6a1d7f` | refactor(stale): drop stale client | #363 | — |
| `2157158` | feat(skill): ship ix agent skill + HTTP API docs | #368 | origin of the whole thread; reviewer redirect |
| `9b70bd9` | brew: update formula v0.9.1 | #367 | — |
| `0437abf` | fix(upgrade): pair tar binary | #366 | #376 companion |
| `dcc0962` | fix(release): stamp bundled compass | #365 | **caused #376** (F-008) |
| `3c49cc2` | fix(cli): stop progress frames | #359 | — |
| `87cd9c0` | fix(view): report real port | #358 | view.ts precedent (Hiro-Chiba) |
| `ebeee6c` | fix(status): keep staleness scoped | #356 | — |
| `01308e6` | fix(ingest): stop DEP0151 | #348 | old local main tip |
| `0b4caf9` | fix(windows): install Compass | #346 | — |
| `47b11f7` | fix(release): stop make_latest | #343 | — |
| `04d23b1` | fix(upgrade): prerelease compare | #344 | isNewer baseline for #376 |

## Investigation-relevant commits

| Commit | Branch/Ref | Meaning |
|---|---|---|
| `b038c46` | `feat/ix-agent-skill` | agent skill + **historical Compass port** (`upstream/compass-fit-view`, 723 lines) — recoverable source of the port |
| `0c9087c` | fork `feat/ix-agent-skill` | cleanup: scope PR to skill+docs, drop monkey-patch (not local) |
| `c021b52` | `feat/ix-remap-hardening` | **the remap change** (F-010…F-012) |
| `396426b` | ix-compass-dist main | init README; all 4 release tags |

## History-rewriting caution

No history rewriting has occurred. Do not assume any old SHA remains current
after future rebases — this map is a point-in-time snapshot (2026-08-10) and
must be re-verified before any operation (methodology rule).
