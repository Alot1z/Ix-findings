# Decision Log

Key architectural and investigative decisions made during the Ix / Compass
investigation. Each decision records: date, context, options considered,
decision, and rationale.

---

## DEC-001: Remap branch base on origin/main, not fork/main
**Date:** 2026-08-10  
**Context:** `feat/ix-remap-hardening` needed a clean base. Local main was
stale (10 behind), fork main was 5 behind.  
**Options:**
- A: Base on local main (stale, would need rebase later)
- B: Base on fork/main (5 behind, would create merge conflicts)
- C: Base on origin/main directly (current, clean)
**Decision:** C — `c021b52` based directly on `origin/main` (`c4f8fea`).
**Rationale:** Origin/main is the canonical target. Fork main is stale.
Remap branch is 0 behind, 1 ahead — clean.

---

## DEC-002: Keep Ix uncommitted overhaul isolated from remap
**Date:** 2026-08-10  
**Context:** Primary Ix worktree on `feat/ix-agent-skill` has 18 uncommitted
files. Must not entangle with remap PR.  
**Options:**
- A: Stash and work on remap in same worktree (risk of entanglement)
- B: Use dedicated worktree for remap (clean isolation)
**Decision:** B — created `<IX_REMAP_WORKTREE>` as a Git worktree.
**Rationale:** Complete isolation. Remap branch clean. Primary worktree
untouched. Can switch between them without stashing.

---

## DEC-003: Evidence classification system (A/B/C/D)
**Date:** 2026-08-10  
**Context:** Need to distinguish source-proven facts from artifact/runtime
evidence from reconstruction from speculation.  
**Decision:** Four-tier system:
- A = Direct source evidence (source inspected, or authoritative release notes)
- B = Reproducible artifact/runtime evidence
- C = Strongly corroborated reconstruction
- D = Inference/speculation
**Rationale:** Maintains credibility. Prevents overclaiming. All findings
must carry a class.

---

## DEC-004: system-compass release notes as Class A evidence
**Date:** 2026-08-10  
**Context:** v0.3.0 release notes by KageBinary are the only source-level
information available for the private system-compass repository.  
**Decision:** Treat maintainer-authored release notes as Class A evidence
for the facts they assert (fit latch mechanism, region aggregation count,
layout changes). Do NOT use them to infer filenames, line numbers, or
implementation details.  
**Rationale:** Maintainer release notes are authoritative about system
behavior. But they are not source code — they describe what changed, not
how it was implemented.

---

## DEC-005: F-key = keyboard exposure only, no new camera system
**Date:** 2026-08-10  
**Context:** Historical Ix port work contained CameraStore, useCameraFit,
DOM zoom patches. These were speculative ports, not based on actual
Compass source.  
**Decision:** F-key PR adds only: keyboard case + KeyboardHelp entry.
Reuses existing fit callback (same as 0 key). No new camera state, no
duplicate fit math, no DOM transformations.  
**Rationale:** The artifact evidence shows the fit system is invariant
across 4 releases. The 0 key already works. F just exposes the existing
behavior. Adding a CameraStore creates a duplicate camera system and
diverges from the actual Compass architecture.

---

## DEC-006: Delayed-data = separate from F-key
**Date:** 2026-08-10  
**Context:** The delayed-data blank and the F-key fit view are both about
"fit" but are different concerns.  
**Decision:** Keep as separate PRs. F-key = keyboard exposure of existing
behavior. Delayed-data = fit lifecycle/measurement/rollup timing issue.  
**Rationale:** Different root causes, different fixes, different review
scopes. Combining them obscures causality and increases review burden.

---

## DEC-007: ix-compass-dist is a distribution channel, not source
**Date:** 2026-08-10  
**Context:** Needed to determine whether to modify ix-compass-dist for
any Compass-related PRs.  
**Decision:** Do NOT manually modify ix-compass-dist. It is a manual release
channel with no CI. Artifacts are uploaded as GitHub Release assets, not
committed to the repo. All content changes happen in system-compass.  
**Rationale:** Modifying distribution artifacts without understanding the
build pipeline risks shipping wrong binaries. The correct path is: modify
system-compass source → build → upload to ix-compass-dist.

---

## DEC-008: Ix-findings as standalone investigation repo
**Date:** 2026-08-10  
**Context:** Needed a canonical location for investigation evidence.  
**Decision:** Ix-findings is a standalone Git repository, not a subdirectory
of Ix. No upstream dependency. Self-contained.  
**Rationale:** Keeps investigation evidence separate from code repositories.
Can be shared independently. No risk of accidentally committing evidence
files to Ix. Follows the "separate evidence ledger" pattern.

---

## DEC-009: Do not push without authorization
**Date:** 2026-08-10 (ongoing)  
**Context:** Multiple PR-ready branches exist locally.  
**Decision:** All remote operations (push, PR, merge, release) require
explicit authorization. "PR-ready" means branch + tests + PR body are
prepared locally. It does not mean published.  
**Rationale:** Explicit authorization gates prevent accidental publication.
The user controls the remote workflow.
