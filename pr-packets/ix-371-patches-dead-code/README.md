# PR Packet — Ix #371: `patches` Command Dead/Unregistered

- **Proposed title:** fix(patches): register the `patches` command or remove it
- **Repository:** ix-infrastructure/Ix
- **Target branch:** main
- **Source branch:** (not created — decision required first)
- **Base:** upstream main @ `2e246e8` (Phase 4 verified)
- **Remote status:** NOT pushed, NOT opened
- **Prepared:** 2026-08-10 (Phase 4)

---

## Summary

`registerPatchesCommand` is defined in `ix-cli/src/cli/commands/patches.ts` but is
**never invoked** by `registerOssCommands()` in `ix-cli/src/cli/register/oss.ts`.
The string `"patches"` appears only in the `PRO_COMMANDS` array. As a result the
command is silently dead for OSS users — it exists in source but is registered
nowhere.

## Evidence (Class A — source-verified)

- `ix-cli/src/cli/register/oss.ts`: `registerOssCommands()` does **not** call
  `registerPatchesCommand` (verified by direct source inspection and grep across
  `ix-cli/src/cli/register/` and `main.ts`).
- `ix-cli/src/cli/commands/patches.ts`: defines `registerPatchesCommand` (dead code).
- **PR #372 (merged 2026-08-10T16:27:42Z)** implemented `--format llm` for five
  commands (doctor/explain/read/savings/status + `llm.ts` + tests) but its merged
  file list **did not touch** `oss.ts` or `patches.ts` registration — F-009 remains
  fully valid after #372.
- Upstream issue **#371** (OPEN, "patches is registered nowhere") tracks this.

## Decision Required (maintainer)

Two valid resolutions — the packet does not pick one:

| Option | Change | Risk |
|--------|--------|------|
| **A. Register it** | `registerOssCommands()` gains `registerPatchesCommand(program)` (or equivalent call) | Patches is a Pro/monkey-patch utility; exposing it OSS may need a guard |
| **B. Delete it** | Remove `patches.ts` + `registerPatchesCommand` + `"patches"` from `PRO_COMMANDS` | Small diff; removes dead surface; may conflict with intended Pro scope |

Requires maintainer OSS-vs-Pro scoping decision (recorded as D-014-adjacent, issue
#371). This is **external and non-blocking for packet preparation**.

## Proposed Patch Scope (Option A sketch — not implemented)

- `ix-cli/src/cli/register/oss.ts` — add registration call (1-2 lines)
- `ix-cli/test/...` — registration smoke test asserting the command exists after
  `registerOssCommands()`
- Optional: guard behind a flag/env if the command is Pro-only

## Tests Proposed

- Registration smoke: `program.commands` contains `patches` after
  `registerOssCommands()`.
- Command help renders without throwing.
- No change to existing 646/648 suite expected; full vitest + tsc + eslint
  required before any PR.

## Blocker

- Maintainer decision (register vs delete) — **external**, do not push or open PR
  until resolved.

## Related

- Finding **F-009** (patches dead/unregistered)
- Evidence **E-018**, **E-026** (graph/registry records)
- Suggestion **S-014**
- Issue **#371**
- PR **#372** (verified NOT to cover this)
