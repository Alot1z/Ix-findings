# PR Plan — Compass F-key fit view

**Verdict: NEW PR (spec complete) — SOURCE-BLOCKED**

| Field | Value |
|---|---|
| Repository | ix-infrastructure/system-compass (private) |
| Branch | `feat/f-key-fit-view` (proposed) |
| Base | `main @ 7f98724` (per v0.3.0 release) |
| Evidence | E-005…E-007 (invariants), E-008 (#57), E-010 (PoC), E-025 (source-equivalent spec) |
| Scope | 3 edits: keyboard case `f`/`F` + callback mirroring `0` + KeyboardHelp entry; ~15 tests |
| Dependencies | none in-repo; assumes #57 refit behavior (v0.3.0) |
| Blockers | **system-compass source access** (phase-06 gate; D-014 path open) |
| Reviewers | @KageBinary (maintainer, v0.3.0 releaser, offered to review) |
| Historical refs | v0.3.0 release notes; system-compass#57; #368 review direction |
| Mentions | @KageBinary recommended only |
| Known limitation to note | delayed-data blank (F-006) is out of scope — call out in PR description (S-008) |

## What the PR must NOT contain

CameraStore, duplicate fit math, mount auto-frame, drill reframe (all
superseded — S-021/S-022/S-032/S-033), `var(--color-*)` fallbacks, DOM patches,
timers, any Ix-side change (`/__ix/remap`, bootstrap fixes live in the Ix PR).

## Handoff

The packet (`../pr-packets/compass-f-key/README.md`) is a complete
implementation specification — any developer with source access can implement
it without archaeology.
