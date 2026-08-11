# Issue #371 — patches command registered nowhere

**URL:** https://github.com/ix-infrastructure/Ix/issues/371  
**Author:** KageBinary (found by @Alot1z via #368)  
**Opened:** 2026-08-10  
**Status:** **CLOSED (completed) 2026-08-11 — fixed by PR #390**  
**Assignee:** None  
**Evidence Class:** Class A (source-proven)

## Resolution (2026-08-11, verified via GitHub API)

KageBinary merged **PR #390** (`fix(cli): register the patches command instead
of stubbing it`) choosing this investigation's **Option 1 (OSS path)**:
`patches` is registered in `oss.ts`, removed from `PRO_COMMANDS`, and the Pro
stub test no longer lists it. `CLAUDE.md` documents that `@ix/pro` also
registers a `patches` and the OSS one wins on a Kartr install (commander throws
on the duplicate, Pro's `tryRegister` swallows it). Issue closed as completed
2026-08-11T03:17Z.

## Summary

`ix patches` is an unknown command today. `patches.ts` exports `registerPatchesCommand` but nothing imports it — it's absent from `oss.ts`. Listed in `PRO_COMMANDS`, so the pro stub masks the gap with "requires Ix Pro" instead of an unknown-command error.

## Source Evidence

File: `ix-cli/src/cli/commands/patches.ts:6` — exports `registerPatchesCommand`  
File: `ix-cli/src/cli/register/oss.ts` — does NOT import or call it  
File: `ix-cli/src/cli/register/oss.ts` — `PRO_COMMANDS` array includes `"patches"`  

## Additional Finding

`patches.ts` declares `--format llm` but no LLM renderer exists behind it (covered by PR #372).

## Resolution Options

1. **OSS path:** Register in `oss.ts`, drop from `PRO_COMMANDS`
2. **Pro-only path:** Delete `patches.ts` from this repo

## Relationship to Remap

**Unrelated.** Different subsystem entirely. Remap touches `view.ts` and the visualizer server; this is command registration in the CLI main entry path. #390's merge does not touch the remap PR's 4 files.
