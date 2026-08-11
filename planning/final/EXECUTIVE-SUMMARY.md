# Executive Summary

> **Note (2026-08-11):** This document was written during the early
> investigation (Phase 7 era) and describes the project's *origins*. For the
> authoritative current state — including the full 13-phase ladder, the
> `ix mcp` build, the `ix remap` PR, contribution inventory, and submission
> triggers — see [`MASTER-REPORT.md`](./MASTER-REPORT.md) and
> [`../CLI-HANDOFF/phase-13/FINAL-CLOSE-OUT.md`](../CLI-HANDOFF/phase-13/FINAL-CLOSE-OUT.md).

**What happened:** A prior feature thread (Ix PR #368) produced a Compass
fit-view prototype (F-key) plus a DOM patch. The maintainer (KageBinary)
redirected it: the feature belongs in the **system-compass** source repo, not
Ix, and patching the compiled Compass bundle fights the build. This
investigation consolidated the resulting state, verified every claim against
the live repositories, and prepared the work that is actually justified.

**What we found (all evidence-classified, nothing fabricated):**

- **Compass fit-view is safe to add.** The keyboard system, KeyboardHelp, fit
  math, and zoom contract are byte-invariant across all four releases
  (v0.1.0→v0.3.0), and **F has never been bound** — a zero-conflict feature
  surface. The `0` key already jumps to the fit target; making F do the same is
  a small, clean change (spec ready).
- **Compass #57 already covers mount/drill/resize refit** in v0.3.0 — so the
  F-key change must NOT re-add auto-frame or drill reframe.
- **A reproducible rendering gap:** with delayed data the map stays blank even
  on v0.3.0 (reproduced 3×). Separate concern, separate issue.
- **A latent upgrade hazard (#376):** `ix upgrade` compares two unrelated
  version series; correct today only by accident. Separate PR.
- **A real security fix (P0):** the visualizer server bound to `0.0.0.0`; the
  remap branch binds loopback and adds a Host/Origin guard.

**What we produced:**

- One **PR-ready branch** — `feat/ix-remap-hardening` @ `c021b52` (loopback-only
  `/__ix/remap`, WSL fix, dead-code removal; 656 tests, tsc/eslint clean).
- **Four PR packets** (remap, F-key, delayed-data, #376).
- **13 findings, 25 evidence items, 33 suggestions, 14 decisions** — traceable
  and machine-readable.
- **An interactive wiki** (open `../wiki/index.html` locally — no server).

**What remains (all gated on you):**

- **Authorize** the remap push + PR (and the fork sync, #376, #371).
- **Decide** the five open choices (D-010…D-014, incl. the Compass PR scope and
  the system-compass access path).
- **Grant/obtain** system-compass source access for the Compass F-key and
  delayed-data work.

**Nothing was pushed, opened, merged, or released.** The investigation is
complete; publication is your call.