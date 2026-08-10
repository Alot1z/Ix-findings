# Objectives

## Investigation-level objectives (all phases)

1. **Establish ground truth.** Verify every repository, worktree, branch, remote,
   fork, and commit against the live state — never trust an old report.
2. **Preserve work.** Never discard, stash-over, or commit the uncommitted
   overhaul on `feat/ix-agent-skill`.
3. **Classify evidence.** Every claim carries class A (source), B
   (artifact/runtime), C (reconstruction), D (inference). Never upgrade a class
   because multiple agents repeated it.
4. **Reconstruct Compass history** from released artifacts + runtime behavior,
   because the source repo is private. Never fabricate source facts.
5. **Prepare justified PRs/issues** with separation of concerns: Ix vs
   system-compass vs ix-compass-dist. Do not mix scopes.
6. **Harden security.** The `/__ix/remap` endpoint shells out with full user
   privileges → loopback-only bind + Host/Origin guard, tested.
7. **No remote action without authorization** (D-009). "PR-ready" ≠ "published".
8. **Privacy.** No personal paths, credentials, tokens, or emails in any
   shareable material.
9. **Final phase:** turn the whole investigation into a traceable, navigable
   knowledge system (this `planning/` layer + interactive wiki).

## Per-phase objectives

| Phase | Objective |
|---|---|
| 00 | Establish exact state of every repo/worktree/branch/remote/fork |
| 01 | Sync local `main` to `origin/main` without touching uncommitted work |
| 02 | Finalize `feat/ix-remap-hardening` as a clean, reviewable PR candidate |
| 03 | Investigate Ix #376 (version-series mismatch) from source |
| 04 | Full security + historical audit of Ix |
| 05 | Behavioral reconstruction of Compass v0.1.0→v0.3.0 from artifacts |
| 06 | Gate: is system-compass source reachable? (verdict: no) |
| 07 | Deep runtime probe of the delayed-data blank |
| 08 | Map the repository ecosystem and its data flow |
| 09 | Build Ix-findings as the central evidence repository |
| 10 | Reconcile GitHub history, maintainers, reviewers |
| 11 | Generate PR packets for every justified change |
| 12 | Fresh pre-publication verification gate (remap) |
| 13 | (PENDING) Push + open PR — requires explicit authorization |
| final | Master audit, reconciliation, knowledge graph, interactive wiki, master report |

## Success criteria

- A maintainer can trace any conclusion → finding → evidence → reproduction.
- A maintainer can see why each recommendation was made and what remains unknown.
- Another engineer can reproduce the important findings.
- The wiki works locally with no server, no network, no secrets.
