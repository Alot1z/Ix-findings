# Decision Log

Chronological summary. Full records (options, evidence, consequences):
`registry.md`. Machine-readable: `registry.json`. Original ledger entries:
`../decisions/log.md` (DEC-001…DEC-009).

## 2026-08-10 — made

| ID | Decision | One-line why |
|---|---|---|
| D-002 | Dedicated worktree for remap | isolate from the 18-file overhaul |
| D-001 | Remap based on origin/main | canonical target; fork stale |
| D-009 | No remote action without authorization | user controls publication |
| D-003 | Evidence classification A/B/C/D | credibility, no overclaiming |
| D-004 | Release notes = Class A (behavior only) | authoritative about what changed, not how |
| D-005 | F-key = keyboard exposure only | fit system already exists and is invariant |
| D-006 | Delayed-data separate from F-key | different cause, different review |
| D-007 | ix-compass-dist never modified | distribution channel |
| D-008 | Ix-findings standalone ledger | evidence separate from code |

## 2026-08-10 — open (awaiting user)

| ID | Decision | Recommended | Blocks |
|---|---|---|---|
| D-010 | Port prep location | standalone prep repo | Compass port build-out |
| D-011 | Compass PR scope | F key + help + chip only | Compass PR shape |
| D-012 | No-map chip timing | defer + feature-detect | chip UX |
| D-013 | Stopgap patch fate | keep local + expiry | local stopgap |
| D-014 | system-compass access path | ask KageBinary in #368 | all Compass source work |

## Answer to the question the registry exists for

> Why did we do this instead of the obvious alternatives?

- **Remap on origin/main instead of local main** — local main was 10 commits
  stale; basing there would have forced a rebase and polluted the diff.
- **Worktree instead of stash** — a stash is a single fragile snapshot; a
  worktree keeps the 18-file overhaul live and switchable.
- **F-key as keyboard exposure instead of a port** — the artifact archaeology
  proved the fit system exists and is invariant; a port would have duplicated
  architecture and invited the "wrong layer" review again.
- **Two packets instead of one Compass PR** — delayed-data and F-key share the
  word "fit" and nothing else.
- **Nothing pushed** — every "ready" artifact is deliberately local; the
  authorization gate is the mechanism that keeps the remote state honest.
