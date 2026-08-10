# Scope

## In scope

- `ix-infrastructure/Ix` (public source), `Alot1z/Ix` (fork), local clones/worktrees.
- `ix-infrastructure/ix-compass-dist` (public distribution channel) and its four
  release artifacts (v0.1.0, v0.1.1, v0.2.0, v0.3.0).
- `ix-infrastructure/system-compass` — **only as an object of study**: its
  existence, its releases, its visibility. Not its source (inaccessible).
- Ix issues: #371 (patches dead), #374 (cross-batch calls), #376 (version-series
  mismatch), #379 (--kind ambiguity), #381 (PHP receivers) — investigated to the
  depth warranted by the PR-planning objective.
- Ix PRs relevant to the remap / #376 threads: #344, #356, #358, #362, #363,
  #365, #366, #368, #369, #370.
- system-compass issues referenced from release notes: #57, #58, #59.
- Compass behavior: keyboard, KeyboardHelp, fit, zoom, pan, snapping, resize,
  drill, lifecycle, delayed data, region rollup, rendering, network behavior.
- Ix behavior: `/__ix/remap` endpoint, view server bind, bootstrap/WSL,
  upgrade logic, release stamping.
- Security + privacy of the investigation material itself.

## Out of scope (explicitly excluded)

- `SysCompass/compass`, PackWise, and every other unrelated repository on the
  local machine (Kimi-Dev, agent-zero, warp, stitch, etc.) — **not examined,
  not cited**.
- Modifying `ix-compass-dist` artifacts (distribution channel; DEC-007/D-007).
- Implementing anything inside `system-compass` (no source access; blocked).
- Publishing anything: no push, PR, merge, release, or review request.
- Fixing unrelated Ix issues (#374/#379/#381) — they belong to Hiro-Chiba's PRs
  (#375/#380/#382) and are only catalogued.
- `.freebuff/` app runtime files (unexamined, untouched).

## Boundaries

- Claims about system-compass internals are limited to what release notes
  (Class A), artifacts (Class B), and reconstructions (Class C/D) support.
- Minified identifiers (`Cn`, `Sn`, `Zt`, …) are descriptive labels only —
  never presented as source names.
- Remote state is re-verified live; no remote claim is carried from memory.

## What "complete" means

Investigation, reconstruction, security/privacy audit, PR preparation, knowledge
base, and wiki are complete. Publication (phase-13) is **not** part of this
phase and remains gated on explicit user authorization.
