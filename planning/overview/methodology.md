# Methodology

## Evidence classification (applied everywhere)

| Class | Name | Criterion | Example |
|---|---|---|---|
| A | Direct source evidence | Source inspected, or authoritative maintainer release notes | Ix `view.ts` bind; v0.3.0 release notes for #57 |
| B | Reproducible artifact/runtime | Released artifact, browser runtime, byte comparison, repeatable experiment | Keyboard byte-identity; delayed-data A/B |
| C | Strongly corroborated reconstruction | Multiple independent observations, not source-verified | Self-referential refit mechanism |
| D | Inference/speculation | Plausible but insufficiently established | Exact source filenames/line anchors |

Rules: class is assigned per claim, never inherited from another agent's
repetition; PRs must not present C/D as facts.

## Audit loop (used per phase)

1. **Read** the previous phase's outputs (not just summaries).
2. **Verify** against live state: git refs, remotes, worktrees, tests, artifacts.
3. **Classify** each claim: VERIFIED / PARTIALLY VERIFIED / CONTRADICTED /
   STALE / UNVERIFIED / BLOCKED / SUPERSEDED.
4. **Reconcile** — document the contradiction, make only the minimum correction
   needed to preserve integrity (e.g. path sanitization; release-date note).
5. **Record** findings, evidence, suggestions, decisions with stable IDs.

## Reproduction standards

- Artifacts: SHA256-verified against published `.sha256` files before analysis.
- Runtime: real server + real process spawn; A/B with a 60 s proxy delay;
  experiments repeated (delayed-data reproduced v0.2.0×1, v0.3.0×2).
- Tests: `vitest` full suite (656 pass / 2 skip), `tsc --noEmit` (0 errors),
  ESLint on changed files; re-run fresh at phase 12 and not carried over.

## Suggestion/decision discipline

- Every meaningful AI-agent recommendation is registered (S-###) with a
  disposition: ACCEPTED / REJECTED / DEFERRED / SUPERSEDED / BLOCKED /
  PARTIALLY ACCEPTED — including the dangerous ones (audit value).
- Every architectural choice is registered (D-###) with options considered,
  chosen option, rejected alternatives, reason, consequences.

## Integrity rules

- No fabricated source access, GitHub activity, usernames, PR numbers, or facts.
- No destructive git ops (`reset --hard`, force-push, branch deletion).
- No remote action without explicit authorization (D-009).
- PR separation: Ix ↔ system-compass ↔ ix-compass-dist never mixed.
- Privacy: `<REPO_ROOT>`-style placeholders; no secrets; no local usernames;
  final grep-based secret scan before completion.

## Tooling used for verification

`git remote -v`, `git rev-parse`, `git rev-list --left-right --count`,
`git worktree list`, `git status --porcelain`, `git log`, `grep`/`rg`
(byte-identity, secret scan), `sha256sum`, `vitest`, `tsc --noEmit`,
`eslint`, browser preview + devtools, local HTTP servers on loopback.
