# GitHub — Issues

## ix-infrastructure/Ix

| # | Title | Author | Status | Investigation | Relevance |
|---|---|---|---|---|---|
| 371 | `patches` command registered nowhere | KageBinary | OPEN | `../github/issues/371/README.md` | F-009; dead code; Pro-stub masks it |
| 374 | Cross-batch JS/TS call resolution | Hiro-Chiba | OPEN | `../github/issues/374/README.md` | fixed by #375 (open) |
| 376 | Version-series mismatch in upgrade | KageBinary | OPEN | `../github/issues/376/README.md` | F-008; caused by #365 |
| 379 | `--kind` ambiguity | Hiro-Chiba | OPEN | — | fixed by #380 (open) |
| 381 | PHP receiver types lost | Hiro-Chiba | OPEN | — | fixed by #382 (open) |
| (351, 349, 350, 383) | community issues | RMA1313 / tept-creator | OPEN | catalogued in phase-04 | out of investigation scope |

## ix-infrastructure/system-compass (private — from release notes only)

| # | Known from | Status | Detail |
|---|---|---|---|
| 57 | v0.3.0 release notes | FIXED (v0.3.0) | fit latch → keyed refit (F-005) |
| 58 | v0.3.0 release notes | unknown | likely layout bounding (gravity + repulsion cutoff) |
| 59 | v0.3.0 release notes | unknown | likely search/roll-up or breadcrumb collapse |

## Issue → PR → finding chains

```
Ix#376 → (no PR) → F-008 → pr-packets/ix-376-version-mismatch
Ix#371 → (no PR) → F-009 → decision needed (OSS vs Pro)
Ix#374 → #375 (Hiro-Chiba)   Ix#379 → #380 (Hiro-Chiba)   Ix#381 → #382 (Hiro-Chiba)
system-compass#57 → v0.3.0 → F-005 → F-key spec must not duplicate
system-compass#57 (delayed-data gap) → F-006 → investigation packet
```
