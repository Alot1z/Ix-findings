# Investigation Overview

**Subject:** The Ix / Compass ecosystem — the `ix` CLI (ix-infrastructure/Ix),
its bundled Compass visualizer (private `system-compass`, distributed via
`ix-compass-dist`), a user fork (Alot1z/Ix), and the local evidence ledger
(Ix-findings).

**Initiated:** 2026-08-10 · **Completed (final phase):** 2026-08-10 ·
**Status:** investigation + preparation complete; publication gated on explicit
authorization (D-009).

## Why this investigation exists

A prior work thread (the "ix agent skill" effort, merged as Ix PR #368) produced
a Compass fit-view prototype (F-key) plus a DOM patch. During review the
maintainer (KageBinary) redirected the work: the fit-view feature belongs in the
**system-compass source repo**, not in Ix, and patching Ix's compiled Compass
bundle "fights the build". This investigation consolidated the resulting state,
verified every claim against the live repositories, reconstructed the Compass
behavioral history from released artifacts (source is private), and prepared the
PRs/issues that are actually justified.

## What the investigation covers

1. **Topology** — every repository, worktree, branch, remote, fork (phase 0, 8).
2. **Synchronization** — local `main` synced to `origin/main` without touching
   13 uncommitted overhaul files (phase 1).
3. **Implementation** — `feat/ix-remap-hardening` @ `c021b52`: real loopback-only
   `/__ix/remap` endpoint + WSL bootstrap fix + dead-code removal (phase 2, 12).
4. **Source research** — Ix issues #371, #376 investigated from source
   (phases 3, 4); GitHub/maintainer context (phase 10).
5. **Artifact archaeology** — all four Compass releases (v0.1.0→v0.3.0)
   recovered, SHA256-verified, behaviorally diffed (phase 5).
6. **Runtime probing** — F-key PoC, zoom contract, delayed-data A/B (phases 6, 7).
7. **Evidence ledger** — Ix-findings repo built with 13 findings, 9+ decisions,
   PR packets (phases 9, 11).
8. **Final phase (this)** — cross-phase audit, reconciliation, knowledge graph,
   interactive wiki, master report.

## Headline results

| Result | Detail |
|---|---|
| PR-ready branch | `feat/ix-remap-hardening` @ `c021b52` (4 files, +250/−11, 656 tests) — **not pushed** |
| PR packets | 4 (`ix-remap-hardening`, `compass-f-key`, `compass-delayed-data`, `ix-376-version-mismatch`) |
| Findings | 12 registered (F-001…F-012) + 1 open unknown (F-013) |
| Evidence | 25 registered items (E-001…E-025) |
| Suggestions | 33 registered (S-001…S-033), all dispositions recorded |
| Decisions | 14 registered (D-001…D-014), 5 still open to the user |
| Compass history | v0.1.0→v0.3.0 behavioral matrix, #57 reconstructed (Class A via release notes + Class B via runtime) |
| Security | 1 P0 fixed (0.0.0.0 bind), 2 P2 open, 1 P3 watch; ledger clean of secrets |
| Blockers | system-compass source (permanent), push/PR authorization (gate) |

## Traceability model

```
conclusion → finding (F-###) → evidence (E-###) → observation/reproduction → artifact/source/GitHub ref
recommendation → suggestion (S-###) → evidence → decision (D-###) → action/rejection/deferral
change → repository → branch → commit → tests → PR/issue recommendation
```

## Canonical entry points

- Narrative: `../reports/master-report.md`, `../reports/phase-summaries.md`
- This layer: `phase-overview.md`, `timeline.md`, `current-state.md`
- Interactive: `../wiki/index.html`
