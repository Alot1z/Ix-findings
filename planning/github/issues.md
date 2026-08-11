# GitHub — Issues

> **Reconciled 2026-08-11 (GitHub API):** all five investigated issues are now
> CLOSED (see below). Newly open items (#385, #383, #349, #219) catalogued.
> Full record: `../state/phase-7-upstream-reconciliation-2026-08-11.md`.

## ix-infrastructure/Ix

| # | Title | Author | Status | Investigation | Relevance |
|---|---|---|---|---|---|
| 371 | `patches` command registered nowhere | KageBinary | **CLOSED** (fixed by #390) | `../github/issues/371/README.md` | F-009; validated — OSS path chosen |
| 374 | Cross-batch JS/TS call resolution | Hiro-Chiba | **CLOSED** (fixed by #375) | `../github/issues/374/README.md` | fixed by #375 (merged) |
| 376 | Version-series mismatch in upgrade | KageBinary | **CLOSED** (fixed by #391) | `../github/issues/376/README.md` | F-008; validated — marker-based fix |
| 379 | `--kind` ambiguity | Hiro-Chiba | **CLOSED** (fixed by #380) | `../github/issues/379/README.md` | fixed by #380 (merged) |
| 381 | PHP receiver types lost | Hiro-Chiba | **CLOSED** (fixed by #382) | `../github/issues/381/README.md` | fixed by #382 (merged) |
| 385 | `ix upgrade` breaks Windows CLI 0.8.1→0.9.1 | RMA1313 | **OPEN** | — | fix on main (#386/#392); awaiting reporter confirm |
| 383 | Codex hooks fail on native Windows | tept-creator | **OPEN** | — | two independent causes per report |
| 349 | Windows installer — path with spaces | RMA1313 | **OPEN** | — | #352 fixed 8.3 short-TEMP variant only |
| 219 | Add `ix mcp` subcommand | josephismikhail | **OPEN** | — | maintainer feature request |

## ix-infrastructure/system-compass (private — from release notes only)

| # | Known from | Status | Detail |
|---|---|---|---|
| 57 | v0.3.0 release notes | FIXED (v0.3.0) | fit latch → keyed refit (F-005) |
| 58 | v0.3.0 release notes | unknown | likely layout bounding (gravity + repulsion cutoff) |
| 59 | v0.3.0 release notes | unknown | likely search/roll-up or breadcrumb collapse |

## Issue → PR → finding chains

```
Ix#376 → #391 (MERGED) → F-008 RESOLVED_UPSTREAM
Ix#371 → #390 (MERGED) → F-009 RESOLVED_UPSTREAM
Ix#374 → #375 (MERGED)   Ix#379 → #380 (MERGED)   Ix#381 → #382 (MERGED)
Ix#377 → #378 (MERGED)
Ix remap → #393 (OPEN, our PR)
system-compass#57 → v0.3.0 → F-005 → F-key spec must not duplicate
system-compass#57 (delayed-data gap) → F-006 → investigation packet
```
