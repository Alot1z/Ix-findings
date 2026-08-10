# GitHub Maintainer & Review Context

**Last updated:** 2026-08-10  
**Evidence:** GitHub API + Git commit history (origin/main, last 30 commits)

## 1. Verified Identities

### Repository: ix-infrastructure/Ix

| GitHub User | ID | Association | Activity | Domain |
|-------------|-----|-------------|----------|--------|
| **KageBinary** | 107007243 | **COLLABORATOR** | Active (14 of last 30 commits) | CLI, upgrade, release, install, Compass, docs, view |
| **josephismikhail** (Joseph Mikhail) | 56614593 | **CODE OWNER** | Active (7 of last 30 commits) | Release, upgrade, docs, deps, test, chore; reviews KageBinary's PRs |
| **Hiro-Chiba** | 203865699 | **CONTRIBUTOR** | Active (2 of last 30 commits) | Bug reports with reproductions; view, status, core-ingestion |
| **Alot1z** | — | **FORK OWNER** | Occasional (1 of last 30 commits) | Agent skill, HTTP API docs |
| **TannerTorrey3** | — | **HISTORIC RELEASER** | Inactive (0 recent commits) | Compass v0.1.0–v0.2.0 releases |
| **dependabot[bot]** | — | **BOT** | Automated | Dependency bumps |
| **github-actions[bot]** | — | **BOT** | Automated | Brew formula updates |

### Repository: ix-infrastructure/ix-compass-dist

| GitHub User | Role | Activity |
|-------------|------|----------|
| **KageBinary** | Releaser | v0.3.0 (2026-08-09) |
| **TannerTorrey3** | Historic releaser | v0.1.0 (2026-03-28), v0.1.1 (2026-03-29), v0.2.0 (2026-06-08) |

### Repository: ix-infrastructure/system-compass

| GitHub User | Role | Evidence |
|-------------|------|----------|
| **KageBinary** | Maintainer/Builder | Built v0.3.0 from `main @ 7f98724`; referenced issues #57, #58, #59 in release notes |
| **Unknown** | Repository owner | Private repo, no public access |

## 2. Review & Merge Pattern

### KageBinary's PRs

- **Reviewer:** @josephismikhail (requested as code owner on PR #362)
- **Merge pattern:** Self-merge after review (standard for Collaborator)
- **PR types:** Bug fixes, release fixes, docs, install improvements
- **Example:** #365 (compass stamp), #366 (tar pairing), #362 (view -p warning)

### Hiro-Chiba's PRs

- **Bug reports:** Issues #374, #379, #381 — all with reproduction steps
- **Fix PRs:** #375, #380, #382 — immediately opened for each issue
- **Prior merged PRs:** #358 (view port reporting), #356 (status scoping)
- **Review pattern:** Not yet known — current PRs are open and pending review

### Joseph Mikhail's Role

- **Code owner** — reviews KageBinary's PRs
- **Direct commits** — release fixes, deps, docs, chore
- **Has merge authority** — can approve and merge PRs

## 3. Issue → PR → Maintainer Map

```
Ix#374 (bug: cross-batch calls) ─── Hiro-Chiba
    └── Ix#375 (fix PR) ─── Hiro-Chiba ─── pending review

Ix#379 (bug: --kind ambiguity) ─── Hiro-Chiba
    └── Ix#380 (fix PR) ─── Hiro-Chiba ─── pending review

Ix#381 (bug: PHP receivers) ─── Hiro-Chiba
    └── Ix#382 (fix PR) ─── Hiro-Chiba ─── pending review

Ix#371 (patches dead) ─── KageBinary ─── open, no fix PR
Ix#376 (version mismatch) ─── KageBinary ─── open, no fix PR

system-compass#57 (fit latch) ─── KageBinary (fix in v0.3.0)
system-compass#58 ─── KageBinary (reference only, no public detail)
system-compass#59 ─── KageBinary (reference only, no public detail)
```

## 4. Tagging Guidance

### When tagging @KageBinary

**DO tag when:**
- PR touches Compass bundle/upgrade/release/install logic
- PR touches view.ts (visualizer server)
- PR is a follow-up to prior KageBinary-authored work
- PR addresses an issue KageBinary authored (#371, #376)

**Reason:** KageBinary is the primary active maintainer with the most context on the Compass integration, view server, and release pipeline. Authored #365/#366 which directly relate to #376.

### When tagging @josephismikhail

**DO tag when:**
- PR needs code-owner review (standard procedure — KageBinary already does this)
- PR touches release workflow, deps, or CI

**Reason:** Code owner. Reviews KageBinary's PRs. Has merge authority.

### When tagging @Hiro-Chiba

**DO tag when:**
- PR relates to issues Hiro-Chiba authored (#374, #379, #381)
- PR is a follow-up to prior Hiro-Chiba work (#358, #356)
- PR touches core-ingestion, resolve logic, or parser internals

**Reason:** Active contributor with deep knowledge of ingestion/parsing. Provides detailed bug reports with reproduction steps.

### Do NOT tag

| User | Reason |
|------|--------|
| @TannerTorrey3 | Inactive — no commits in recent history. Historic releaser only. |
| @Alot1z | Fork owner — contributed agent skill but not an ongoing maintainer. Tag only if PR directly relates to the agent skill. |

## 5. system-compass Context

### Known Issues

| Issue | Known From | Detail |
|-------|-----------|--------|
| #57 | v0.3.0 release notes | Fit latch: "The fit used to run once against the 1200×700 placeholder and latch, so the map rendered blank until something else re-centred it." Fixed in v0.3.0. |
| #58 | v0.3.0 release notes | Unknown — referenced alongside #57, #59. Possibly related to layout/aggregation changes. |
| #59 | v0.3.0 release notes | Unknown — referenced alongside #57, #58. Possibly related to search/breadcrumb changes. |

### Release Build Process

1. Compass is built from private `ix-infrastructure/system-compass` using `COMPASS_TOKEN`
2. Build artifact is uploaded as `compass-dist` in the Ix release CI
3. The Ix release packages the compass bundle into the CLI tarball
4. Separately, KageBinary manually creates `ix-compass-dist` releases with the same build

## 6. PR Communication Strategy

### For the Ix Remap PR (feat/ix-remap-hardening)

```
Reviewers: @josephismikhail (code owner)
Mention:   @KageBinary (view.ts domain expert, authored #358, #362)
Body refs: Thanks @Hiro-Chiba for the view-server port reporting in #358
           which established the pattern this PR follows.
```

### For the Compass F-Key PR (blocked)

```
Reviewers: @KageBinary (system-compass maintainer, v0.3.0 releaser)
Body refs: References v0.3.0 release notes (fit latch fix)
           References artifact archaeology (keyboard invariant across 4 releases)
```

### For the Compass Delayed-Data Investigation (blocked)

```
Reviewers: @KageBinary
Body refs: References system-compass#57 (fit latch → refit)
           Includes live reproduction evidence
```

## 7. Recent Commit Activity (Last 30 on origin/main)

| Count | Author | Domain |
|-------|--------|--------|
| 14 | KageBinary | CLI, upgrade, release, install, Compass, docs, view |
| 7 | Joseph Mikhail | Release, deps, docs, test, chore |
| 2 | Hiro-Chiba | View port reporting, status scoping |
| 2 | dependabot[bot] | Dependency bumps |
| 1 | Alot1z | Agent skill, HTTP API docs |
| 1 | github-actions[bot] | Brew formula |

**Conclusion:** KageBinary is the primary active maintainer. Joseph Mikhail reviews and has merge authority. Hiro-Chiba contributes targeted bug fixes.
