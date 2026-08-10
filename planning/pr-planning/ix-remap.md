# PR Plan — Ix remap hardening

**Verdict: KEEP EXISTING PR (ready) — AUTHORIZATION-BLOCKED**

| Field | Value |
|---|---|
| Repository | ix-infrastructure/Ix (PR from fork Alot1z/Ix) |
| Branch | `feat/ix-remap-hardening` @ `c021b52` |
| Base | `origin/main` @ `c4f8fea` (0 behind) |
| Evidence | E-014, E-015, E-016 (gate: READY TO PUSH / READY TO OPEN PR) |
| Scope | 4 files, +250/−11: real `/__ix/remap` (loopback-only), guard-matrix tests, WSL bootstrap fix, node_ok removal, docs |
| Dependencies | none (already on origin/main) |
| Blockers | **explicit push/PR authorization (D-009)** |
| Reviewers | @josephismikhail (code owner) · mention @KageBinary (view.ts domain) |
| Historical refs | #358 (Hiro-Chiba port reporting — pattern), #362 (KageBinary, same file, different section — no conflict), #368 (origin thread) |
| Mentions | @KageBinary recommended; @Hiro-Chiba referenced in body (not a reviewer); do NOT tag TannerTorrey3 |
| PR title | feat(view): real /__ix/remap endpoint with loopback guard; fix WSL bootstrap |

## Actions when authorized

1. `git push fork feat/ix-remap-hardening`
2. Open PR fork → upstream main with the packet body
3. Request code-owner review; mention KageBinary
4. After it settles, sync fork/main (S-016)

## Do NOT

- Mix in #376, #371, or any Compass change (S-006, S-024).
- Force-push the fork branch.
