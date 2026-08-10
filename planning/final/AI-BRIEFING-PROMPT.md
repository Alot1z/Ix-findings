# Prompt to send to an external AI (ChatGPT, Claude, etc.)

> Paste everything between the `===` fences into a fresh chat. It is
> self-contained: no links, no attachments required.
> Optional: also attach `planning/wiki/index-standalone.html` if the chat
> accepts files — it is the full interactive investigation wiki.

```
You are a senior technical advisor reviewing a completed open-source
investigation. Your job is to help me decide how to proceed, challenge weak
reasoning, and catch anything risky. Ask clarifying questions if needed, but
give me your best recommendation first.

=== CONTEXT ===

Subject: a browser-based mapping/visualization tool called "Ix" (repo
ix-infrastructure/Ix, my fork Alot1z/Ix). A compiled distribution of its map
UI ships as "Compass" (repo ix-compass-dist); the Compass source lives in a
separate, not-yet-accessible repo called system-compass.

History: a previous feature thread (Ix PR #368) produced a Compass fit-view
prototype (an "F" keyboard shortcut) plus a DOM patch against the compiled
Compass bundle. The maintainer (KageBinary) redirected the work: the feature
belongs in the system-compass source repo, not Ix, and patching the compiled
bundle fights the build process.

An autonomous multi-phase investigation then consolidated everything,
re-verified every claim against the live repositories, and produced a fully
traceable record: 13 findings, 25 evidence items, 33 AI-agent suggestions
(with accept/reject/defer dispositions), 14 decisions, 4 PR packets, and an
interactive wiki. Evidence is classified: A=source, B=artifact/runtime,
C=reconstruction, D=inference. Nothing was fabricated; source-only claims are
labeled as such.

=== WHAT WAS VERIFIED (key findings) ===

1. Compass fit-view is safe to add: the keyboard system, KeyboardHelp, fit
   math, and zoom contract are byte-identical across all four releases
   (v0.1.0 → v0.3.0), and the F key has never been bound — zero-conflict
   feature surface. The "0" key already jumps to the fit target; making F do
   the same is a small, clean change with a written spec.
2. Compass issue #57 already covers mount/drill/resize refit in v0.3.0 — the
   F-key change must NOT re-add auto-frame or drill reframe.
3. A reproducible rendering gap: with delayed data the map stays blank even on
   the latest release (reproduced 3×). Separate concern, separate issue.
4. A latent upgrade hazard (Ix issue #376): "ix upgrade" compares two
   unrelated version series; correct today only by accident. Separate PR.
5. A real security fix (P0): the visualizer server was bound to 0.0.0.0; the
   remap branch binds loopback and adds a Host/Origin guard.

=== CURRENT STATE ===

- One PR-ready branch exists in my fork: feat/ix-remap-hardening @ c021b52
  (loopback-only /__ix/remap endpoint, WSL fix, dead-code removal; 656 tests,
  tsc + eslint clean).
- Four PR packets are written: remap hardening, Compass F-key, delayed-data,
  #376 fix.
- NOTHING was pushed, opened, merged, or released. All publication is gated
  on my authorization (a decision I made deliberately).
- The fork (Alot1z/Ix) is behind upstream; sync is pending authorization.

=== OPEN DECISIONS I NEED YOUR ADVICE ON ===

D-010: Where to prep the Compass port (recommendation on file: a standalone
prep repo). Do you agree?
D-011: Compass PR scope — recommend F key + help + hint chip ONLY. Is that
the right minimal scope?
D-012: A "no-map" chip (feature-detect) — defer it until after remap merges?
D-013: A local stopgap patch of the compiled bundle — keep it local and
documented, or drop it?
D-014: system-compass source access path — the recommendation is to ask
KageBinary in the #368 thread. Alternatives: PAT with Contents:read, fork
grant, or a URL from the maintainer.

=== BLOCKERS ===

- All push/PR actions wait on my go-ahead.
- Compass source work (F-key, delayed-data) is blocked on system-compass
  access.
- Two GitHub issues (#371 OSS-vs-Pro question, #376 fix option choice) need
  maintainer direction.
- One branch (feat/ix-agent-skill) has a reconciliation question (local
  overhaul vs an older remote commit) that must be resolved before any push.

=== WHAT I WANT FROM YOU ===

1. A recommended decision for each of D-010…D-014, with reasoning and risk.
2. A recommended execution order (what to push/PR first, what to defer) with
   a clear dependency chain.
3. A risk review: what could go wrong with the remap PR, the fork sync, or
   asking the maintainer — and how to de-risk.
4. A short message template for contacting KageBinary about system-compass
   access, professional and not demanding.
5. Anything in my plan you would challenge, especially anything that mixes
   scopes, weakens security, or risks the fork.

Be direct. If my plan is good, say so and tell me exactly what to do first.
```

---

**What to send alongside it (optional, in priority order):**

1. `planning/wiki/index-standalone.html` — the full interactive wiki (154 KB,
   works offline). Best for chats that accept file uploads.
2. `planning/final/EXECUTIVE-SUMMARY.md` + `planning/final/NEXT-ACTIONS.md` —
   plain text if the chat cannot take HTML.
3. Nothing else is required — the prompt above is self-contained.
