# Issue #349 — Windows installer — path with spaces

**URL:** https://github.com/ix-infrastructure/Ix/issues/349  
**Author:** RMA1313 (community)  
**Opened:** 2026-08-09 · **Status:** **OPEN** — fixed on `main` (#352), deliberately kept open pending a real verification run  
**Labels:** bug · **Comments:** 3 · **Evidence Class:** Class B (runtime report) + Class A (fix verified in source)

## Summary

The Windows installer fails when the user profile / TEMP path contains a space
(e.g. `C:\Users\Win 10`): the CLI archive downloads and extracts, but the
installer resolves part of the path as the 8.3 short form `C:\Users\WIN10~1`.

## Resolution

- **#352 (merged)**: the installer mixed 8.3 short paths with long-path APIs —
  it resolved a path it was never asked to write. The two scratch files
  (`.cli-staging-<pid>.zip` and the compose pull log) now live under
  `$IX_HOME` (from `USERPROFILE`, long form) instead of `TEMP`.
- josephismikhail reopened the issue after the #352 auto-close because the fix
  was not yet confirmed on a real run; KageBinary merged #352 with `Refs #349`
  (not `Fixes`) so the issue stays open pending verification.
- Related: PR #395 (KageBinary) adds a test covering an `IX_HOME` containing a
  space; #392 (stage under IX_HOME) is part of the same path.

## Current state (2026-08-11)

- **FIXED ON `main`**; awaiting a real run by the reporter.
- **Not actionable by us** — no upstream PRs allowed per standing constraint;
  verification belongs to the reporter/maintainer.

## Relationship to our work

Same domain as F-011/F-012 (bootstrap/install). #352/#392/#395 form the
installer hardening series; nothing for the ledger to fix. Catalogue only.
