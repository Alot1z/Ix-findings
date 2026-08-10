# Repository — ix-infrastructure/Ix

| Property | Value |
|---|---|
| Identity | `ix-infrastructure/Ix` (public, source) |
| Local representation | `<IX_REPO>` (primary worktree) + `<IX_REMAP_WORKTREE>` (linked worktree, same repo) |
| Remote (origin) | https://github.com/ix-infrastructure/Ix (upstream) |
| Fork remote | https://github.com/Alot1z/Ix (remote name `fork`) |
| Default branch | `main` |
| Active branch (primary worktree) | `feat/ix-agent-skill` @ `b038c46` |
| Active branch (remap worktree) | `feat/ix-remap-hardening` @ `c021b52` |
| Local main | `c4f8fea` — synced with origin/main (0 ahead / 0 behind) |
| Working tree (primary) | 13 uncommitted files (overhaul — **preserved, never discarded**) |
| Working tree (remap) | clean |
| Purpose | The `ix` CLI: commands, core ingestion, GitHub API, release CI, bundled Compass |
| Source/generated status | source (generated artifacts live under `dist/`, gitignored) |
| Security posture | gitleaks (push+PR), Trivy, OpenSSF Scorecard, dependency review, pinned actions, hardened runners |

## Local branches

| Branch | HEAD | Tracking | Status |
|---|---|---|---|
| `main` | `c4f8fea` | origin/main | synced |
| `feat/ix-agent-skill` | `b038c46` | — | uncommitted overhaul (13 files) |
| `feat/ix-remap-hardening` | `c021b52` | origin/main | clean, PR-ready, NOT pushed |
| `freebuff/first-…` (×2) | `01308e6` | — | Freebuff auto-branches (stale) |

## Key files of interest

- `ix-cli/src/cli/commands/view.ts` — visualizer server; `/__ix/remap` (F-010)
- `ix-cli/src/cli/commands/upgrade.ts` — version compare (#376, F-008)
- `ix-cli/src/cli/commands/patches.ts` + `register/oss.ts` — dead command (#371, F-009)
- `skills/ix/scripts/bootstrap.sh` — WSL fix + node_ok removal (F-011/F-012)
- `.github/workflows/release.yml` — compass `.version` stamping (#376)
- `docs/api/README.md` — endpoint docs (updated in remap PR)

## Related
- `../git/branches.md`, `../git/forks.md`, `../git/commits.md`, `../git/worktrees.md`
- Findings: F-008…F-012 · PR planning: `../pr-planning/ix-remap.md`, `../pr-planning/ix-376.md`
