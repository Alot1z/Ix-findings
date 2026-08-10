# SYSTEM-COMPASS-KNOWLEDGE.md — System-Compass External Knowledge Reconciliation

**Phase 2 · Generated 2026-08-10**

---

## Access Status (verified 2026-08-10)

| Check | Result | Evidence |
|---|---|---|
| `ix-infrastructure/system-compass` | **HTTP 404 — Not Found** | GitHub API via authorized token |
| `Alot1z/system-compass` fork | **HTTP 404 — does not exist** | GitHub API |
| Local clone | none | — |
| Source inspection | **NOT POSSIBLE** | access boundary |

**Access remains BLOCKED. Nothing in this phase (or any prior phase) bypassed or requested access.**

---

## Knowledge Classification

| Class | Meaning | Applied to |
|---|---|---|
| **KNOWN** | Public/distribution evidence | release notes (E-008), public dist artifacts (E-001..E-004), observed runtime behavior (E-005..E-007, E-009..E-012, E-022), maintainer guidance recorded in #368 review |
| **INFERRED** | Analysis of artifacts | F-013 zoom multiplier (Class D) |
| **UNVERIFIED** | Cannot be checked | internal implementation details of all 8 findings |
| **BLOCKED** | Cannot be obtained | source code, internal architecture, issue #57/#58/#59 contents |

---

## Findings Mapped to System-Compass

| Finding | Evidence class | Status | Source needed to verify | Blocker |
|---|---|---|---|---|
| F-001 Keyboard handler invariant | B | ACTIVE | view/KeyboardHelp source | BLOCKED |
| F-002 F/f unbound | B | ACTIVE | keyboard binding source | BLOCKED |
| F-003 KeyboardHelp no F entry | B | ACTIVE | KeyboardHelp component | BLOCKED |
| F-004 Fit math constants invariant | B | ACTIVE | fit/camera source | BLOCKED |
| F-005 #57 fit latch → keyed refit | A+B | RESOLVED (covered by #57) | release notes + artifact | — |
| F-006 Delayed-data blank persists | B+C | ACTIVE | data-loading source | BLOCKED |
| F-007 Region-rollup timing-dependent | B | ACTIVE | rollup source | BLOCKED |
| F-013 Zoom ×1.25 vs ×1.1 | D | BLOCKED | fit constants source or dedicated experiment | BLOCKED |

---

## Proposed Contribution Scopes (prepared, NOT submitted)

### F-key (PACK-fkey)
- **Scope (D-005, S-007):** keyboard case + callback + KeyboardHelp entry ONLY. No CameraStore, no new fit math.
- **EXCLUDED:** auto-frame / mount reframe / drill-in-out reframe — **already covered by system-compass#57** (F-005 RESOLVED; S-032/S-033 SUPERSEDED).
- **Evidence:** E-001..E-007, E-010, E-025 (source-equivalent spec).
- **Readiness:** BLOCKED on source access. Spec complete; no fabrication of source.

### Delayed-data (PACK-delayed)
- **Scope (D-006):** separate concern from F-key; separate PR.
- **Evidence:** E-009, E-012, E-022 (live reproductions on public dist).
- **Readiness:** BLOCKED on source access for implementation; a Playwright reproduction against the public dist (S-018) is possible without access.

### Auto-frame — DO NOT DO
- Covered by Compass #57. Explicitly excluded per reviewer direction.

---

## Reviewer Guidance (from merged PR #368 review — historical record)

- Compass-specific work belongs in **system-compass** (not Ix).
- fit-view was **not rejected conceptually** — redirected to the correct repository.
- auto-frame is **already covered by Compass #57**.
- F-key **remains a candidate** because nothing currently binds F.
- This is project guidance, **not authorization to submit**.

---

## Access Requirement (D-014)

| Item | Detail |
|---|---|
| What is required | read access to `ix-infrastructure/system-compass` (or a maintainer-created fork) |
| Who must grant it | maintainer (KageBinary) — **request is NOT authorized in any phase so far** |
| What must be inspected first | keyboard binding registration, KeyboardHelp entries, fit/zoom constants, data/rollup timing code |
| What would then be done | implement F-key only (D-005 scope), exclude auto-frame (#57), add tests, prepare worktree |
| Current status | **BLOCKED — requires user decision to request access** |

---

## Explicitly Not Done (Phase 2)

- No fork created
- No access requested
- No maintainer contacted
- No source inferred and presented as fact
- No bypass attempted
