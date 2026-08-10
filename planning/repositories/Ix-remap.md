# Repository — Ix-remap (linked worktree of ix-infrastructure/Ix)

| Property | Value |
|---|---|
| Identity | Linked worktree of `ix-infrastructure/Ix` (not a separate repo) |
| Local representation | `<IX_REMAP_WORKTREE>` |
| Shared git dir | `<IX_REPO>/.git` |
| Branch | `feat/ix-remap-hardening` |
| HEAD | `c021b52` — `feat(view): real /__ix/remap endpoint with loopback guard; fix WSL bootstrap` |
| Base | `origin/main` @ `c4f8fea` |
| Ahead / behind | 1 ahead, 0 behind origin/main |
| Tracking | origin/main |
| Working tree | clean (no uncommitted, no untracked) |
| Purpose | Isolate the remap PR from the 18-file overhaul on `feat/ix-agent-skill` (D-002) |
| Source/generated status | source changes only (no generated files) |

## Change set (c021b52, vs origin/main)

| File | Δ |
|---|---|
| `ix-cli/src/cli/commands/view.ts` | +55/−3 |
| `ix-cli/test/view-server.test.ts` | +178 |
| `skills/ix/scripts/bootstrap.sh` | +4/−5 |
| `docs/api/README.md` | +13/−3 |

## State
- Tests: vitest 656 pass / 2 skip; tsc 0 errors; eslint clean (fresh, phase-12)
- Security: loopback-only bind + Host/Origin guard; 10-test matrix
- **NOT pushed; PR NOT opened** (D-009)

## Related
- `../pr-planning/ix-remap.md` · findings F-010…F-012 · evidence E-014…E-016
- Git map: `../git/branches.md`, `../git/worktrees.md`, `../git/commits.md`
