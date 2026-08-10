# Repository — Ix-findings (investigation ledger)

| Property | Value |
|---|---|
| Identity | Local investigation/evidence repository (no GitHub repo) |
| Local representation | `<IX_FINDINGS>` |
| Git | initialized; **zero commits** (all files untracked as of phase-final) |
| Default branch | `master` |
| Remotes | none |
| Purpose | Canonical evidence ledger for the Ix / Compass investigation |
| Source/generated status | documents + machine-readable registries + generated wiki |
| .gitignore | `/artifacts/` (extracted bundles, reproducible from SHA256), OS/editor/temp noise |

## Layout (top level — all preserved)

`artifacts/` (gitignored) · `comparisons/` · `decisions/` · `evidence/` (link
dir) · `findings/` · `github/` · `manifests/` · `planning/` (this layer) ·
`pr-packets/` · `reports/` · `repositories/` · `reproductions/` · `security/` ·
`state/`

## Findings

- ID system: `IXF-###` (ledger) ↔ `F-###` (planning layer), 1:1.
- 12 registered findings + 1 open unknown (F-013); 25 evidence items;
  33 suggestions; 14 decisions.

## Open questions (user)

- Commit the ledger? (S-015 / D-009) — currently deferred to final review.
- Create a GitHub repo (e.g. `Alot1z/Ix-findings`)? — authorization needed.

## Related
- `../overview/current-state.md` · `../final/MASTER-REPORT.md`
