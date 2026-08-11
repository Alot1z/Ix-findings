# Issue #381 — PHP member calls lose receiver types

**URL:** https://github.com/ix-infrastructure/Ix/issues/381  
**Author:** Hiro-Chiba (Contributor)  
**Opened:** 2026-08-10  
**Status:** **CLOSED — fixed by PR #382 (merged 2026-08-10, verified 2026-08-11)**  
**Linked PR:** #382 (fix, merged)  
**Evidence Class:** Class A (source-proven)

## Summary

PHP member calls lose their receiver types during ingestion — calls on typed
receivers are not resolved through the type.

## Resolution

PR #382 (`fix(ingest): resolve PHP calls through typed receivers`, Hiro-Chiba)
merged. Verified via GitHub API on 2026-08-11; the ledger's earlier
cataloguing listed it as OPEN (corrected in
`state/phase-7-upstream-reconciliation-2026-08-11.md`).

## Relationship to Remap

**Unrelated.** PHP ingestion path; remap touches the view server.
