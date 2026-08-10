# Rejected Suggestions (S-021…S-031, S-023–S-028)

| ID | Suggestion | Rejection reason |
|---|---|---|
| S-021 | CameraStore abstraction | duplicates the real camera state — would create a second camera system |
| S-022 | DOM zoom patch | fragile, fights React state, timers |
| S-023 | F-key + delayed-data in one PR | different causes, different reviews |
| S-024 | Compass UI changes in the Ix PR | separate repos, separate PRs |
| S-025 | Stash the Ix overhaul | unsafe — worktree isolation instead |
| S-026 | Base remap on fork/main | fork is stale; origin/main canonical |
| S-027 | Modify ix-compass-dist artifacts | distribution channel, built from source |
| S-028 | Push fork/main unsynced | would publish a stale fork |
| S-029 | `git reset --hard` on primary worktree | **destructive** — would erase 13 uncommitted files |
| S-030 | Bind remap to 0.0.0.0 | **security** — network-exposed shell exec |
| S-031 | Give the reviewer the claim to confirm | **bias** — undermines adversarial review |

Why we record these: rejected ideas explain why the chosen path exists, and the
dangerous ones document the guardrails (destructive git ops, network exposure,
review bias) that were deliberately not crossed.
