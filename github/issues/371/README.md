# Issue #371 — patches command registered nowhere

**URL:** https://github.com/ix-infrastructure/Ix/issues/371  
**Author:** KageBinary  
**Opened:** 2026-08-10  
**Status:** Open  
**Assignee:** None  
**Evidence Class:** Class A (source-proven)

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

**Unrelated.** Different subsystem entirely. Remap touches `view.ts` and the visualizer server; this is command registration in the CLI main entry path.
