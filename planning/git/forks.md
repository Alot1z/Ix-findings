# Git — Fork / Upstream Map

## ix-infrastructure/Ix ⇄ Alot1z/Ix

```
ix-infrastructure/Ix (origin)
    main: c4f8fea  ← local main synced (phase-01)
        │
        │ 5 commits behind origin
        ▼
Alot1z/Ix (fork)
    fork/main: 0437abf                ← NOT pushed (D-009); sync deferred (S-016)
    fork/feat/ix-agent-skill: 0c9087c ← 1 commit ahead of local b038c46 (cleanup)
```

| Check | Result |
|---|---|
| Fork synchronization | fork/main 5 behind origin/main, 0 ahead |
| Branch divergence | fork/feat/ix-agent-skill has `0c9087c` unknown locally |
| Local divergence | local `main` = origin/main (0/0) |
| Upstream changes | none pending (origin/main = `c4f8fea`) |
| Pending synchronization | push fork/main (post-remap, authorization); reconcile `0c9087c` vs local overhaul |
| Destructive sync performed | **none** — audit-only |

## ix-compass-dist

Direct clone, not a fork — single remote, in sync.

## system-compass

No fork exists or is reachable from this account (private; D-014 access path
open). No fork was fabricated.
