# MASTER REPORT — Ix / Compass Investigation

**Phase FINAL · 2026-08-10 · Status: investigation + preparation COMPLETE; publication GATED on authorization**
**Location:** this `planning/` layer indexes the full ledger. Interactive: `../wiki/index.html`.

---

## Executive Summary

A 12-phase (plus final) investigation of the Ix / Compass ecosystem established
verified ground truth for every repository, worktree, branch, remote, and fork;
reconstructed the Compass behavioral history (v0.1.0→v0.3.0) from released
artifacts and live runtime because the source repo is private; investigated two
open Ix issues (#371, #376) from source; hardened the `/__ix/remap` endpoint
(loopback-only) as a PR-ready branch; and prepared four PR packets. All claims
are evidence-classified (A/B/C/D); nothing was fabricated; **nothing was
pushed, no PR opened, no review requested, nothing merged or released.**

One PR-ready branch (`feat/ix-remap-hardening` @ `c021b52`) and three other
actions are ready to execute **upon explicit authorization**.

## Investigation Scope

In scope: `ix-infrastructure/Ix`, `Alot1z/Ix` (fork), `ix-compass-dist` (4
release artifacts), `system-compass` (as an object of study — private), the
local ledger `Ix-findings`; Ix issues #371/#374/#376/#379/#381 and relevant PRs;
Compass behavior (keyboard, KeyboardHelp, fit, zoom, pan, snapping, resize,
drill, lifecycle, delayed data, region rollup, rendering, network). Out of
scope: unrelated local repos, `ix-compass-dist` modification, anything inside
`system-compass`, and all publication. Full detail: `../overview/scope.md`.

## Phase Overview

| Phase | Category | Result |
|---|---|---|
| 00 | DISCOVERY | ground-truth audit; 18-file overhaul; fork 5 behind; system-compass private |
| 01 | SYNCHRONIZATION | local main → `c4f8fea`; 18 files preserved; fork not pushed |
| 02 | IMPLEMENTATION | remap branch `c021b52` (+250/−11, 656 tests) |
| 03 | RESEARCH | #376 investigated (F-008) |
| 04 | AUDIT | security posture STRONG; P0 bind fixed; #371 catalogued (F-009) |
| 05 | RESEARCH | Compass archaeology; keyboard/fit invariants (F-001…F-005) |
| 06 | VERIFICATION | F-key source gate: BLOCKED; spec finalized |
| 07 | REPRODUCTION | delayed-data blank reproduced (F-006/F-007) |
| 08 | AUDIT | 5-repo ecosystem map |
| 09 | AUDIT | Ix-findings ledger built |
| 10 | GITHUB | maintainer/reviewer context |
| 11 | PR PREPARATION | 4 PR packets |
| 12 | VERIFICATION | fresh gate: READY |
| 13 | PR PREPARATION | **PENDING — authorization** |
| final | AUDIT | this report + knowledge system + wiki |

## Current Repository State (verified live)

| Repo | Local | Branch | HEAD | Working tree |
|---|---|---|---|---|
| Ix | `<IX_REPO>` | feat/ix-agent-skill | b038c46 | 13 uncommitted files (preserved) |
| Ix | `<IX_REMAP_WORKTREE>` | feat/ix-remap-hardening | c021b52 | clean |
| Ix | `<IX_REPO>` | main | c4f8fea | (pointer) synced |
| ix-compass-dist | `<COMPASS_DIST_REPO>` | main | 396426b | clean + untracked v0.3.0 artifacts |
| system-compass | none | — | — | private (404) |
| Ix-findings | `<IX_FINDINGS>` | master | no commits, 28 untracked entries | investigation ledger + planning layer (NOT committed) |

## Fork / Upstream State

- `fork/main` @ `0437abf` — 5 behind origin; **not pushed**.
- fork `feat/ix-agent-skill` @ `0c9087c` — cleanup commit, not local (open
  reconciliation).
- local `main` = origin/main (0/0). remap = 1 ahead / 0 behind.
- No destructive sync performed. See `../git/forks.md`.

## Git / Worktree State

Two worktrees in the Ix repo (primary + remap), one standalone dist clone.
Local-only commits: `c021b52` (remap), `b038c46` (agent skill). Remote-only:
`0c9087c` (fork). Full map: `../git/`.

## Complete Change Inventory

**Production change (phase-02, branch `c021b52`, NOT pushed):**

| File | Δ |
|---|---|
| `ix-cli/src/cli/commands/view.ts` | +55/−3 |
| `ix-cli/test/view-server.test.ts` | +178 |
| `skills/ix/scripts/bootstrap.sh` | +4/−5 |
| `docs/api/README.md` | +13/−3 |

**Investigation-phase changes (this `planning/` layer + earlier ledger):** all
documents/JSON under `<IX_FINDINGS>/`; no repository code changed outside the
remap branch. **Sanitization:** raw local paths in `decisions/log.md` and
`repositories/repository-map.md` replaced with placeholders (privacy).

**Deliberately NOT changed:** `feat/ix-agent-skill` uncommitted overhaul,
`ix-compass-dist` artifacts, `upgrade.ts`/`config.ts`/`release.yml`,
anything in `system-compass`.

## Historical Compass Reconstruction

v0.1.0→v0.3.0: keyboard + KeyboardHelp + fit math + zoom contract invariant
(B); **F/f never bound** (B); #57 changed only the trigger — one-shot latch →
keyed refit (A release notes + B bundle diff); v0.3.0 added bounded layout,
aggregation 1,471→33, searchable roll-ups, breadcrumb collapse (A). Delayed-data
blank persists on v0.3.0 (B ×3). Full matrix: `../compass/`, `../../comparisons/`.

## Ix Findings

F-008 (#376 version mismatch), F-009 (#371 patches dead), F-010 (loopback
`/__ix/remap`), F-011 (WSL fix), F-012 (node_ok removal). Full registry:
`../findings/registry.md`.

## Compass Findings

F-001…F-005 (keyboard/fit invariants + #57), F-006 (delayed-data blank),
F-007 (rollup timing), F-013 (zoom ×1.25 anomaly, class D). Full registry:
`../findings/registry.md`.

## Security Findings

- P0 (`server.listen(PORT)` → 0.0.0.0) **fixed** in the remap branch.
- Remap endpoint: loopback bind + Host/Origin double guard + client-disconnect
  reaping; 10-test matrix. Posture (Ix): STRONG (gitleaks, Trivy, Scorecard,
  dep-review, pinned actions).
- Open: DEP0169 (P2), localhost-vs-127.0.0.1 advertising (P2), stale bundle
  watch (P3), token format (P3), curl|sh hash (P3).
- See `../security/audit.md`.

## Privacy Audit

No secrets, no emails, no `C:\Users`/`E:\Users`/`/home/` paths anywhere in the
ledger. Raw `E:\E-github-repos\…` paths in two files sanitized to placeholders.
Public maintainer GitHub handles retained (they are public, required for
mention context). Notes: `<IX_REPO>/tasks/*.md` retain forward-slash drive paths
(local-only; not to be shared unsanitized). See `../security/privacy.md`.

## Evidence Classification

A = source (Ix source, release notes) · B = artifact/runtime · C = reconstruction
· D = inference. 25 evidence items (E-001…E-025) back 13 findings. Class never
upgraded by repetition (e.g. F-006 mechanism stays C). Registry:
`../evidence/registry.md`.

## Master Finding Registry

13 findings (F-001…F-013). Canonical: `../findings/registry.md` /
`registry.json` (aliasing ledger `IXF-###`).

## AI-Agent Suggestion Registry

33 suggestions (S-001…S-033) with dispositions: 12 ACCEPTED, 8 DEFERRED,
11 REJECTED, 2 SUPERSEDED, 3 dangerous recorded. Canonical:
`../suggestions/registry.md` / `registry.json`.

## Decision Registry

14 decisions (D-001…D-014): 9 decided, 5 open to the user (D-010…D-014).
Canonical: `../decisions/registry.md` / `registry.json`.

## GitHub / Maintainer Context

KageBinary (collaborator, primary active, v0.3.0 releaser), josephismikhail
(code owner), Hiro-Chiba (contributor), TannerTorrey3 (inactive historic),
Alot1z (fork owner). Mention guidance: recommendation-only, no mass-tagging.
See `../github/`.

## Issues / PR Relationships

- F-008 ↔ Ix#376 ↔ PR #365 (root cause)/#366/#344 → packet `ix-376`.
- F-009 ↔ Ix#371 ↔ #372 → decision needed.
- F-005/F-006 ↔ system-compass#57 → v0.3.0 (F-005) / delayed-data gap (F-006).
- Remap ↔ #358 pattern, #362 sibling (no conflict), #368 origin.
- See `../github/issues.md`, `../github/pull-requests.md`, `../maps/finding-map.json`.

## Recommended PR Separation

| Item | Disposition | Target | Blocked by |
|---|---|---|---|
| Ix remap | KEEP EXISTING PR (ready) | ix-infrastructure/Ix | authorization |
| Ix #376 | NEW PR (packet ready) | ix-infrastructure/Ix | authorization + maintainer direction |
| Ix #371 | NEW ISSUE decision | ix-infrastructure/Ix | maintainer decision |
| Compass F-key | NEW PR (spec) | system-compass | source access |
| Compass delayed-data | NEW ISSUE then PR | system-compass | source access |
| ix-compass-dist | NO ACTION | — | — |

Each pack: `../pr-planning/`.

## Verification Matrix

| Check | Result | Where |
|---|---|---|
| vitest | 656 pass / 2 skip | E-016 |
| tsc --noEmit | 0 errors | E-016 |
| eslint (changed files) | clean | E-016 |
| guard matrix | 10/10 | E-015 |
| artifact SHA256 | 4/4 verified | E-001…E-004 |
| delayed-data repro | ×3 (deterministic) | E-009 |
| F-key PoC | F ≡ 0 target | E-010 |
| secret scan | clean | `../security/privacy.md` |
| path scan | clean (post-sanitization) | `../security/privacy.md` |
| system-compass access | BLOCKED (re-verified) | phase-06 gate |

## Remaining Unknowns

- Exact system-compass source filenames/line anchors (D).
- Delayed-data mechanism (C — needs source confirmation).
- Region-rollup decision inputs (D).
- Canvas measurement method (D).
- #58/#59 details (external).
- Zoom ×1.25 vs ×1.1 (F-013, D).
- Whether maintainers consider delayed-data in scope for #57.

## Remaining Blockers

| Blocker | Affects |
|---|---|
| Push/PR authorization (D-009) | remap PR, #376 PR, fork sync, #371 |
| system-compass source access (D-014) | F-key, delayed-data, #58/#59 |
| Maintainer direction | #376 fix option; #371 OSS-vs-Pro |

## Required Maintainer Decisions

1. #376 fix option (A/B/C) — @KageBinary.
2. #371 OSS vs Pro — @KageBinary.
3. system-compass F-key review (when open) — @KageBinary.
4. Whether delayed-data gap is in scope for #57.

## Recommended Next Actions

Prioritized: see `NEXT-ACTIONS.md`. Headline:
**NOW** — user decides D-010…D-014 and authorizes publication;
**NEXT** — push remap, open PR, fork sync; **BLOCKED** — all Compass source work.

## Remote Operations

```
pushes:            none (list: —)
PRs opened:        none (list: —)
reviews requested: none (list: —)
merges:            none (list: —)
releases:          none (list: —)
```

No remote operation is authorized merely because the investigation is complete.