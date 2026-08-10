# PATHS.md — Exact Local Filesystem Paths

> Every path relevant to the investigation.
> Format: `E:\...` (Windows absolute, as verified 2026-08-10).
> All paths revalidated during final audit — not copied from prior reports.

---

## Repository Roots

| Repository | Absolute Path |
|---|---|
| ix-infrastructure/Ix (primary worktree) | `E:\E-github-repos\Ix` |
| Ix remap worktree | `E:\E-github-repos\Ix-remap` |
| ix-compass-dist | `E:\E-github-repos\ix-compass-dist` |
| Ix-findings (investigation ledger) | `E:\E-github-repos\Ix-findings` |
| system-compass | NONE — no local clone |

---

## Ix Worktrees

| Worktree | Path | Branch | HEAD |
|---|---|---|---|
| Primary | `E:\E-github-repos\Ix` | `feat/ix-agent-skill` | `b038c46` |
| Remap | `E:\E-github-repos\Ix-remap` | `feat/ix-remap-hardening` | `c021b52` |

---

## Ix-findings Directory Map

Root: `E:\E-github-repos\Ix-findings\`

| Directory | Purpose | Files |
|---|---|---|
| `./artifacts/` | Downloaded Compass release bundles (v0.3.0) | 20 |
| `./comparisons/` | Cross-version comparison notes | 5 |
| `./decisions/` | Decision log | 1 |
| `./findings/` | Phase-4 audit findings | 1 |
| `./github/` | GitHub context (issues, maintainers, PRs) | 5 |
| `./manifests/` | Machine-readable indexes | 3 |
| `./planning/` | **Canonical investigation layer** | 118 |
| `./pr-packets/` | PR preparation packets (4 PRs) | 4 |
| `./reports/` | Legacy reports | 2 |
| `./repositories/` | Repository map | 1 |
| `./security/` | Security findings | 1 |
| `./state/` | Phase state files | 5 |
| `./IX-INVESTIGATION-HANDOFF/` | **This handoff** | (being written) |

---

## Planning Layer (Canonical)

Root: `E:\E-github-repos\Ix-findings\planning\`

| Subdirectory | Purpose |
|---|---|
| `compass/` | Compass knowledge base (keyboard, fit, lifecycle, delayed-data, historical matrix) |
| `decisions/` | Decision registry (D-001…D-014) |
| `evidence/` | Evidence registry + per-category indexes (source, runtime, artifacts, GitHub, reproduction) |
| `final/` | Master reports (MASTER-REPORT, EXECUTIVE-SUMMARY, NEXT-ACTIONS, REMAINING-BLOCKERS, verification, AI-BRIEFING-PROMPT) |
| `findings/` | Finding registry (F-001…F-013) with cross-cuts |
| `git/` | Git knowledge base (branches, worktrees, commits, forks, synchronization) |
| `github/` | GitHub knowledge base (issues, PRs, comments, releases, maintainers, references) |
| `ix/` | Ix knowledge base (remap, security, #376, architecture) |
| `maps/` | Machine-readable graph models (investigation, evidence, finding, decision, dependency, timeline, repository, phases) |
| `overview/` | Investigation overview layer |
| `phases/` | Per-phase archives (phase-00 through phase-13 + phase-final) |
| `pr-planning/` | PR recommendation matrix (5 planned PRs) |
| `repositories/` | Per-repository knowledge base |
| `security/` | Security + privacy audit |
| `suggestions/` | AI-agent suggestion registry (S-001…S-033) |
| `wiki/` | Interactive HTML investigation wiki + build scripts |

---

## Key Individual Files

| File | Path | Purpose |
|---|---|---|
| Findings registry | `E:\E-github-repos\Ix-findings\planning\findings\registry.json` | Authoritative F-001…F-013 |
| Evidence registry | `E:\E-github-repos\Ix-findings\planning\evidence\registry.json` | Authoritative E-001…E-025 |
| Decisions registry | `E:\E-github-repos\Ix-findings\planning\decisions\registry.json` | Authoritative D-001…D-014 |
| Suggestions registry | `E:\E-github-repos\Ix-findings\planning\suggestions\registry.json` | Authoritative S-001…S-033 |
| Investigation graph | `E:\E-github-repos\Ix-findings\planning\maps\investigation-map.json` | 108 nodes, 75 edges |
| Phases map | `E:\E-github-repos\Ix-findings\planning\maps\phases.json` | Phase summaries |
| Master report | `E:\E-github-repos\Ix-findings\planning\final\MASTER-REPORT.md` | Full investigation report |
| Executive summary | `E:\E-github-repos\Ix-findings\planning\final\EXECUTIVE-SUMMARY.md` | 2-page summary |
| Next actions | `E:\E-github-repos\Ix-findings\planning\final\NEXT-ACTIONS.md` | Prioritized action matrix |
| Remaining blockers | `E:\E-github-repos\Ix-findings\planning\final\REMAINING-BLOCKERS.md` | What's stuck |
| Wiki (standalone) | `E:\E-github-repos\Ix-findings\planning\wiki\index-standalone.html` | Self-contained interactive wiki |
| Wiki (multi-file) | `E:\E-github-repos\Ix-findings\planning\wiki\index.html` | Wiki requiring assets/ + data/ |
| Wiki data | `E:\E-github-repos\Ix-findings\planning\wiki\data\data.js` | Generated graph data (110 KB) |
| PR packet: remap | `E:\E-github-repos\Ix-findings\pr-packets\ix-remap-hardening\README.md` | Remap PR spec |
| PR packet: F-key | `E:\E-github-repos\Ix-findings\pr-packets\compass-f-key\README.md` | F-key PR spec |
| PR packet: delayed-data | `E:\E-github-repos\Ix-findings\pr-packets\compass-delayed-data\README.md` | Delayed-data investigation |
| PR packet: #376 | `E:\E-github-repos\Ix-findings\pr-packets\ix-376-version-mismatch\README.md` | #376 fix spec |
| Ix-findings .gitignore | `E:\E-github-repos\Ix-findings\.gitignore` | Untracked, 199 bytes |

---

## Preview / Temp Paths

| Path | Purpose |
|---|---|
| `E:\E-github-repos\Ix\.wiki-preview-tmp\index.html` | Workspace copy of standalone wiki (for Preview tab) |
| `E:\E-github-repos\Ix\.freebuff\run.md` | Preview run doc (ix view server + wiki preview mode) |
| `E:\E-github-repos\Ix\.freebuff\preview-29e929ce-2ab4-4fed-bab0-3a77a1d195d8.log` | Current session log (unused for HTML preview) |

---

## Paths NOT AVAILABLE

| Resource | Reason |
|---|---|
| system-compass local clone | No source access — private repo, 404 |
| ix-compass-dist source relations | Distribution repo only — no build pipeline visible |
| GitHub API tokens / PATs | Not present — no remote operations authorized |
