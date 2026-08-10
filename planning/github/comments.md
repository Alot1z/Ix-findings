# GitHub — Review Comments & Guidance

## KageBinary's #368 review (the redirect that shaped this investigation)

| Point | Consequence |
|---|---|
| fit-view belongs in **system-compass source**, not the Ix repo | two-repo, two-PR plan (S-006) |
| patching the compiled Compass bundle "fights the build" | DOM patch rejected (S-022); native camera path used (F-004) |
| "nothing here builds React" | prep the port buildable + tested (D-010) |
| patch writes the exact two inline styles React drives (`snappedZoom`/`snappedPan`) | F-key must drive the store/setters (D-005) |
| review-1 blocking list (all resolved in `0c9087c`) | python3, /dev/null swallowing, GNU sed, `/__ix/remap` must be source in `view.ts`, CLAUDE.md absolute paths, `.gitignore /dist/`, docs remap section, `install-skill.sh rm -rf` |
| **explicit suggestion:** "`/__ix/remap` — a small PR against `view.ts` with the bind + origin fix" | Phase 2/5 target — the remap branch (F-010) |
| "If you open it against system-compass I will review it there" | access path D-014 |

## Review pattern notes (from commit history)

- KageBinary's PRs are reviewed by @josephismikhail (code owner), then
  self-merged.
- Hiro-Chiba files issues **with reproductions** and immediately opens fix PRs.
- PR #365's merge comment contains the "monotonic stand-in" rationale that #376
  later flags — the exact wording is quoted in `../github/issues/376/README.md`.

## Drafted review requests (for phase-13, when authorized)

```
Remap PR:        reviewers: @josephismikhail (code owner)
                 mention:   @KageBinary (view.ts domain; authored #358/#362)
                 body refs: thanks @Hiro-Chiba for the #358 pattern
F-key PR:        reviewers: @KageBinary (system-compass maintainer)
                 body refs: v0.3.0 release notes + artifact archaeology
Delayed-data:    reviewers: @KageBinary
                 body refs: system-compass#57 + live reproduction evidence
```
