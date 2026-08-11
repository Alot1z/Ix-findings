# Issue #379 — `--kind` silently selects among duplicate same-kind symbols

**URL:** https://github.com/ix-infrastructure/Ix/issues/379  
**Author:** Hiro-Chiba (Contributor)  
**Opened:** 2026-08-10  
**Status:** **CLOSED — fixed by PR #380 (merged 2026-08-10, verified 2026-08-11)**  
**Linked PR:** #380 (fix, merged)  
**Evidence Class:** Class A (source-proven)

## Summary

`--kind` silently selects among duplicate same-kind symbols — the user cannot
tell which of several identically-typed symbols the filter picked.

## Resolution

PR #380 (`fix(resolve): preserve same-kind ambiguity`, Hiro-Chiba) merged —
the resolver no longer silently collapses same-kind duplicates. Verified via
GitHub API on 2026-08-11; the ledger's earlier cataloguing listed it as OPEN
(corrected in `state/phase-7-upstream-reconciliation-2026-08-11.md`).

## Relationship to Remap

**Unrelated.** Core resolve/ingest path; remap touches the view server.
