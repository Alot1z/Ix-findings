# Evidence — Source (Ix, public)

Direct source inspection of `ix-infrastructure/Ix` (public). **No
system-compass source was inspected** — none exists in this class.

| ID | File / diff | Claim supported |
|---|---|---|
| E-013 | `ix-cli/src/cli/commands/view.ts` — `server.listen(PORT)` (pre-fix) | P0 bind (0.0.0.0) motivation for F-010 |
| E-014 | remap diff `c021b52` — view.ts, view-server.test.ts, bootstrap.sh, docs/api/README.md | F-010, F-011, F-012 |
| E-017 | `upgrade.ts` + `.github/workflows/release.yml` | F-008 (#376) |
| E-018 | `ix-cli/src/cli/commands/patches.ts` + `register/oss.ts` | F-009 (#371) |
| E-024 | `skills/ix/scripts/bootstrap.sh` (`is_windows()`, `node_ok`) | F-011, F-012 |

Minified Compass identifiers (`Cn`, `Sn`, …) found in artifacts are **labels,
not source names** — see `compass/reconstruction.md`.
