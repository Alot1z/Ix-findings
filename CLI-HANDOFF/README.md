# IX / Compass Investigation — CLI Handoff

**Generated:** 2026-08-10 (from verified Desktop workspace state)
**Status:** READ-ONLY investigation package — no external actions authorized
**Parent:** `../planning/` — canonical investigation layer (this handoff is a derivative index)

---

## What This Is

A self-contained handoff package for CLI agents. Every repository, path, branch,
commit, PR, finding, decision, and evidence is recorded with exact paths and URLs.

A CLI agent can read this directory and immediately know:
- What to investigate
- Where everything lives on disk
- What has already been established
- What has NOT been established
- Which files to read (with priority tiers)
- Which repositories to inspect
- What must remain untouched

---

## Handoff Files

| File | Purpose | Critical? |
|---|---|---|
| `README.md` | This index | Entry point |
| `REPOSITORIES.md` | Every repository: owner, URL, local path, fork relationship | YES |
| `PATHS.md` | Exact local filesystem paths for every repo/worktree/dir | YES |
| `GIT-STATE.md` | Current verified Git state (branches, SHAs, ahead/behind) | YES |
| `BRANCH-MATRIX.md` | All branches across all repos with SHAs and relationships | YES |
| `PR-MATRIX.md` | Every PR/issue referenced, with URLs, authors, SHAs | YES |
| `FINDINGS.md` | F-001 through F-013 with evidence links, status, repo | YES |
| `EVIDENCE.md` | E-001 through E-025 with classification, source, repo | — |
| `DECISIONS.md` | D-001 through D-014 with options, outcome, status | — |
| `GRAPH-AUDIT.md` | What the existing graph contains, what it's missing | — |
| `PUBLIC-REFERENCES.md` | Every public URL discovered | — |
| `STALE-CLAIMS.md` | Known discrepancies found during final audit | — |
| `FILE-MANIFEST.md` | Complete file inventory with reading priorities | YES |
| `CLI-READING-PLAN.md` | Ordered reading plan for CLI (MUST → SHOULD → OPTIONAL) | YES |
| `CLI-PROMPT.md` | The main investigation prompt for CLI agents | YES |
| `manifest.json` | Machine-readable: repos, paths, branches, findings, decisions, constraints | YES |

---

## Quick Summary

| Metric | Count |
|---|---|
| Repositories discovered | 5 (3 accessible, 2 reference-only) |
| Local repositories | 3 (Ix, Ix-remap worktree, Ix-findings) |
| Branches across all repos | 30+ |
| Worktrees | 2 |
| PRs referenced | 12 |
| Issues referenced | 8 |
| Findings (F-001…F-013) | 13 |
| Evidence items (E-001…E-025) | 25 |
| AI-agent suggestions (S-001…S-033) | 33 |
| Decisions (D-001…D-014) | 14 |
| Graph nodes | 108 |
| Graph edges | 75 |
| Files in investigation ledger | 118 |

---

## External Actions: NONE

```
PR CREATED:      NO
PR MERGED:       NO
PR COMMENTED:    NO
ISSUE CREATED:   NO
MAINTAINER CONTACT: NO
ACCESS REQUESTED: NO
REMOTE PUSH:     NO
REMOTE MUTATION: NO
```

---

## CLI Safety Contract

CLI agent, upon receiving this handoff:

**MUST NOT:**
- `git reset --hard`, `git clean`, destructive checkout
- Discard local changes or uncommitted work
- Push, force-push, or mutate any remote
- Create/merge/comment on PRs or issues
- Contact maintainers or request access
- Modify `feat/ix-agent-skill` working-tree changes
- Modify `ix-compass-dist`

**MAY:**
- Read all files, fetch public metadata, inspect Git state
- Build, test, run `tsc --noEmit`, `npm test`
- Generate reports, graph data, registry updates
- Write new local files in `planning/` or `CLI-HANDOFF/`

---

## Data Canonical Source

The authoritative source for all findings, evidence, decisions, and suggestions
is `../planning/`. The registries are:

- `../planning/findings/registry.json` — F-001 through F-013
- `../planning/evidence/registry.json` — E-001 through E-025
- `../planning/suggestions/registry.json` — S-001 through S-033
- `../planning/decisions/registry.json` — D-001 through D-014
- `../planning/maps/*.json` — Graph models (investigation, evidence, finding, decision, dependency, timeline, repository maps)

**This handoff file is derivative — do not treat it as more authoritative than the registries.**
