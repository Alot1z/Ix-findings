# Decision Registry

Canonical IDs `D-###`. D-001…D-009 map 1:1 to `DEC-001…DEC-009` in
`../decisions/log.md`; D-010…D-014 are the plan.md open decisions (D1–D5),
still awaiting user approval. Machine-readable: `registry.json`.

---

## D-001 — Base the remap branch on origin/main
- **Phase:** 01 · **Problem:** clean PR base needed; local main stale (10 behind), fork main 5 behind
- **Options:** A local main (needs later rebase) · B fork/main (5 behind, conflicts) · C origin/main (current)
- **Evidence:** E-019 · **Chosen:** C — `c021b52` on `c4f8fea`
- **Rejected:** A, B · **Reason:** origin/main is the canonical target; fork is stale
- **Consequences:** zero-conflict PR base; verified again at phase-12
- **Related:** F-010, S-002

## D-002 — Dedicated worktree for the remap work
- **Phase:** 00/01 · **Problem:** 18 uncommitted overhaul files on `feat/ix-agent-skill` must not entangle with the remap PR
- **Options:** A stash + same worktree (entanglement risk) · B dedicated worktree
- **Evidence:** E-021 · **Chosen:** B — `<IX_REMAP_WORKTREE>`
- **Rejected:** A · **Reason:** complete isolation; no stash risk
- **Consequences:** remap branch clean; overhaul untouched
- **Related:** S-001, S-025

## D-003 — Four-tier evidence classification
- **Phase:** 02 · **Problem:** distinguish source-proven fact from reconstruction from speculation
- **Chosen:** A = source / B = artifact+runtime / C = reconstruction / D = inference
- **Reason:** credibility; prevents overclaiming; all findings carry a class
- **Related:** S-005

## D-004 — Maintainer release notes count as Class A evidence
- **Phase:** 03/05 · **Problem:** v0.3.0 release notes are the only source-level window into system-compass
- **Chosen:** Class A for what they assert (fit latch mechanism, aggregation count, layout changes); **not** for filenames/line numbers
- **Reason:** authoritative about behavior, not implementation
- **Related:** F-005, F-008

## D-005 — F-key = keyboard exposure only, no new camera system
- **Phase:** 05/06 · **Problem:** historical port contained speculative CameraStore/useCameraFit/DOM patches
- **Chosen:** keyboard case + callback mirroring `0` key + KeyboardHelp entry; no new state/math/DOM
- **Evidence:** E-005…E-007, E-010 · **Reason:** fit system invariant across 4 releases; `0` already works
- **Rejected:** S-021 (CameraStore), S-022 (DOM patch), S-032/S-033 (auto/drill frame)
- **Consequences:** smallest possible change; zero conflict (F-001…F-005)
- **Related:** S-007

## D-006 — Delayed-data stays separate from F-key
- **Phase:** 07 · **Problem:** both are "fit"-adjacent but unrelated
- **Chosen:** separate PRs/packets · **Evidence:** E-009
- **Reason:** different root causes, different fixes, different review scopes
- **Related:** F-006, S-008, S-023

## D-007 — ix-compass-dist is a distribution channel, not source
- **Phase:** 08 · **Chosen:** never manually modify its artifacts
- **Reason:** artifacts are built from system-compass; manual edits risk shipping wrong binaries
- **Related:** S-027

## D-008 — Ix-findings is a standalone evidence repo
- **Phase:** 08/09 · **Chosen:** standalone Git repo, no upstream dependency
- **Reason:** keeps evidence separate from code repos; shareable; no accidental commits into Ix
- **Related:** S-009

## D-009 — No remote operation without explicit authorization
- **Phase:** 01 (ongoing) · **Chosen:** "PR-ready" = branch + tests + body prepared locally; publishing requires explicit user go-ahead
- **Reason:** user controls the remote workflow; prevents accidental publication
- **Consequences:** phases 13 pending; nothing pushed/opened/merged/released
- **Related:** S-016

## D-010 — (OPEN) Where to prep the Compass port
- **Problem (plan.md D1):** standalone prep repo vs back in the Ix worktree
- **Recommended:** standalone repo (keeps it out of Ix; avoids "wrong layer" review)
- **Status:** OPEN — awaiting user decision
- **Note:** no prep repo exists on disk yet; the port survives in git history (`b038c46`, `upstream/compass-fit-view`)

## D-011 — (OPEN) Compass PR scope
- **Problem (plan.md D2):** F key + keyboard help + hint chip only vs also drill-in/out node-set reframe
- **Recommended:** F key + help + chip only (drill reframe already ships in v0.3.0 via #57 — F-005)
- **Status:** OPEN — awaiting user decision

## D-012 — (OPEN) No-map chip timing
- **Problem (plan.md D3):** include no-map chip in first PR vs defer to paired follow-up with feature-detect
- **Recommended:** defer; feature-detect so the chip hides when `/__ix/remap` is absent (S-020)
- **Status:** OPEN — awaiting user decision

## D-013 — (OPEN) Stopgap compass-patch fate
- **Problem (plan.md D4):** keep improved patch as documented local stopgap vs drop
- **Recommended:** keep local + expiry documentation (S-011); not part of any PR
- **Status:** OPEN — awaiting user decision

## D-014 — (OPEN) Access path for system-compass
- **Problem (plan.md D5):** ask KageBinary in the merged #368 thread vs user-provided URL/contact
- **Recommended:** ask KageBinary (he offered to review "if you open it against system-compass")
- **Status:** OPEN — awaiting user decision; unblocks phases 3–4 of the Compass work
