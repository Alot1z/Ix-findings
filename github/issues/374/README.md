# Issue #374 — JS/TS calls disappear across 500-file parse batches

**URL:** https://github.com/ix-infrastructure/Ix/issues/374  
**Author:** Hiro-Chiba (Contributor)  
**Opened:** 2026-08-10  
**Status:** Open  
**Linked PR:** #375 (fix open)  
**Evidence Class:** Class A (source-proven reproduction steps)

## Summary

`ix map` resolves JavaScript and TypeScript calls differently depending on which 500-file parse batch contains the caller and callee. A caller parsed before its imported definition loses its CALLS edge. The path-only global index identifies the target file, but JS/TS definitions are not included in `fileQKeys` or `fileHasSymbol`, so `resolveEdges` drops the cross-batch edge.

## Fix PR

PR #375 by Hiro-Chiba is open with 5 of 14 tasks complete and 1 comment.

## Relationship to Remap

**Unrelated.** Core ingestion engine issue; remap touches view server.
