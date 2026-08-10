# CLI-READING-PLAN.md — Ordered Reading Plan for Freebuff CLI

> Designed to build understanding incrementally — from overview → structure → detail → graph.
> STOP if you encounter a contradiction and report it.

---

## Phase 1 — Orientation (5 minutes)

Read these in order:

1. `CLI-HANDOFF/README.md` — what this handoff contains
2. `CLI-HANDOFF/REPOSITORIES.md` — every repository with URLs
3. `CLI-HANDOFF/PATHS.md` — exact filesystem paths
4. `CLI-HANDOFF/GIT-STATE.md` — current Git state

**After phase 1, you should know:**
- What repos exist, where they're cloned, what forks exist
- What branch is active, what worktrees exist
- What must NOT be touched (feat/ix-agent-skill, ix-compass-dist)

---

## Phase 2 — Investigation Context (10 minutes)

Read in order:

1. `planning/final/EXECUTIVE-SUMMARY.md` — the big picture
2. `CLI-HANDOFF/FINDINGS.md` — all 13 findings with evidence
3. `CLI-HANDOFF/DECISIONS.md` — all 14 decisions
4. `CLI-HANDOFF/PR-MATRIX.md` — PR/issue relationships
5. `planning/final/MASTER-REPORT.md` — full investigation report

**After phase 2, you should know:**
- What was verified, what was proven, what remains uncertain
- What decisions were made and why
- What PRs/commits/findings/evidence connect how

---

## Phase 3 — Live Git Verification (15 minutes)

Without modifying anything:

1. cd to `E:\E-github-repos\Ix`
2. Run: `git status -sb`, `git branch -vva`, `git worktree list`
3. Compare every value against `GIT-STATE.md` and `BRANCH-MATRIX.md`
4. Record ALL discrepancies — even minor (different ahead/behind counts, different untracked files)
5. cd to `E:\E-github-repos\Ix-remap` — verify clean state, test count
6. cd to `E:\E-github-repos\Ix-findings` — verify 0 commits, 28 untracked
7. cd to `E:\E-github-repos\ix-compass-dist` — verify clean + untracked artifacts

**Output:** a validation report showing every verified claim and every discrepancy.

---

## Phase 4 — Registry Verification (15 minutes)

1. Parse `planning/findings/registry.json` — verify 13 entries, F-001…F-013
2. Parse `planning/evidence/registry.json` — verify 25 entries, E-001…E-025
3. Parse `planning/decisions/registry.json` — verify 14 entries, D-001…D-014
4. Parse `planning/suggestions/registry.json` — verify 33 entries, S-001…S-033
5. Parse `planning/maps/investigation-map.json` — verify node/edge counts
6. Cross-check the counts against `README.md`, `FINDINGS.md`, `EVIDENCE.md`
7. Verify every Finding → Evidence → Source chain in the registry is intact

**Output:** a registry integrity report.

---

## Phase 5 — Deep File Audit (variable)

Read these supporting files:

1. `planning/overview/*.md` (7 files) — investigation overview layer
2. `planning/compass/*.md` (7 files) — Compass knowledge base
3. `planning/ix/*.md` (4 files) — Ix knowledge base
4. `planning/git/*.md` (5 files) — Git knowledge base
5. `planning/github/*.md` (6 files) — GitHub context
6. `planning/security/*.md` (2 files) — Security + privacy
7. All per-phase READMEs — `planning/phases/phase-*/README.md` (15 files)
8. PR packets — `pr-packets/*/README.md` (4 files)
9. `planning/pr-planning/*.md` (5 files)

Cross-reference every claim against the registries.

---

## Phase 6 — Interactive Wiki Verification

1. Open `planning/wiki/index-standalone.html` in a browser
2. Verify:
   - Investigation Map loads with all nodes
   - All 12 views switch correctly
   - Search returns findings
   - Detail drawer shows evidence/suggestions
   - Timeline filters work
   - No console errors
3. Report any rendering bugs

---

## Phase 7 — Repository Deep Scan

For each accessible repository (`Ix`, `Ix-remap`, `ix-compass-dist`):

1. List all branches (local + remote) — compare to handoff
2. Inspect key commits (diffs for remap branch, PR history)
3. Run `tsc --noEmit` and `npm test` (or equivalent) — verify suite state
4. Build a file inventory of source directories
5. Extract symbol relationships (functions, classes, imports)
6. Map PRs to commits to files to findings

Do NOT modify any file, branch, or worktree.

---

## Phase 8 — Graph Expansion

See `GRAPH-AUDIT.md` for the full specification. Key steps:

1. For each MISSING category, build nodes + edges
2. Follow the schema in `GRAPH-AUDIT.md`
3. Update `planning/maps/investigation-map.json`
4. Run `cd planning/wiki && node build-data.mjs`
5. Rebuild `index-standalone.html` (inline CSS + data.js + wiki.js)
6. Update workspace preview copy

---

## Phase 9 — Public Data Enrichment

Using the URLs in `PUBLIC-REFERENCES.md`:

1. Fetch public PR metadata (titles, authors, merge status, labels)
2. Fetch public commit metadata (messages, files changed)
3. Fetch release notes from ix-compass-dist
4. Cross-reference against findings and evidence registries
5. Flag any new finding-worthy observations

Do NOT attempt to access system-compass (private repository).

---

## Phase 10 — Final Integrity Audit

1. Run the full discrepancy scan from `STALE-CLAIMS.md`
2. Every claim in the handoff must match live state
3. Every finding must have intact evidence chain
4. Every decision must be internally consistent
5. Generate final validation report
6. Update `STALE-CLAIMS.md` with any new discrepancies found

---

## Phase 11 — Output Generation

1. Generate updated `manifest.json` (repos, paths, branches, findings, decisions, graph)
2. Generate provenance report (what came from where)
3. Generate consistency report (cross-registry integrity)
4. Generate master report update (if any change warrants it)
5. Save everything to `CLI-HANDOFF/` and `planning/final/`
