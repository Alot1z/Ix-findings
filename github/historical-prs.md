# Historical PRs, Issues & Review Context

**Last updated:** 2026-08-10  
**Scope:** ix-infrastructure/Ix + ix-infrastructure/ix-compass-dist

## 1. PRs Directly Relevant to Remap

### PR #358 — fix(view): report the port the visualizer is actually serving on

- **URL:** https://github.com/ix-infrastructure/Ix/pull/358
- **Author:** Hiro-Chiba (CONTRIBUTOR)
- **Status:** Merged
- **Commit:** `87cd9c0`
- **Summary:** Fixed the view server to report the actual port it's serving on,
  not the requested port. The already-running branch was printing an unreachable URL.
- **Relevance to remap:** The remap PR extends the view server. #358 established
  the pattern of fixing server behavior and testing it. The port reporting
  mechanism #358 added is what #362 builds on. The remap PR's test infrastructure
  follows the patterns from #358's tests.
- **Remap overlap:** None — #358 is a prerequisite, already merged.

### PR #362 — fix(view): say when -p was not honoured, and show the URL in status

- **URL:** https://github.com/ix-infrastructure/Ix/pull/362
- **Author:** KageBinary (COLLABORATOR)
- **Status:** Open
- **Reviewer:** @josephismikhail (requested)
- **Summary:** Follow-up to #358. Warns when `-p` flag is ignored. Shows URL in
  `ix view status`. Extracted `runningInstanceLines` as a pure function.
- **Relevance to remap:** Both touch `view.ts`. #362 is about the CLI-side view
  management; the remap PR is about the inline server script within view.ts.
  Different sections of the same file — no merge conflict expected.
- **Note:** PR references @Hiro-Chiba for finding the original issue.

### PR #358 + #362 + remap relationship

```
#358 (Hiro-Chiba, merged)
  → Fixed port reporting in already-running server
  → Established test patterns for view server

#362 (KageBinary, open)
  → Added -p mismatch warning
  → Added URL to `ix view status`
  → Touches view.ts CLI-side logic

remap PR (c021b52, PR-ready)
  → Adds /__ix/remap endpoint to inline server
  → Touches view.ts serverScript() function
  → Different section of view.ts than #362
  → Zero overlap expected
```

## 2. PRs Directly Relevant to #376 (Version Mismatch)

### PR #365 — fix(release): stamp the bundled compass with the release it ships in

- **URL:** https://github.com/ix-infrastructure/Ix/pull/365
- **Author:** KageBinary
- **Status:** Merged
- **Commit:** `dcc0962`
- **Summary:** Added `.version` stamp to compass bundle at release packaging time.
  Uses the **Ix version** as the stamp value. Fixes v0.9.0 bug where missing stamp
  caused `ix upgrade` to replace bundled compass with older dist version.
- **Relevance to #376:** Directly. This is the PR that introduced the Ix-version
  stamp. #376 identifies the version-series mismatch this creates.
- **Key quote:** "The Ix version rather than a compass version: the bundle is
  built from compass main at release time, so it is always at least as new as any
  ix-compass-dist release cut before it, which makes the Ix version a monotonic
  stand-in."

### PR #366 — fix(upgrade): pair the tar binary with the path form it understands

- **URL:** https://github.com/ix-infrastructure/Ix/pull/366
- **Author:** KageBinary
- **Status:** Merged
- **Commit:** `0437abf`
- **Summary:** Fixed Windows tar extraction path mismatch. The cygpath conversion
  and tar binary selection were independent decisions that could disagree.
- **Relevance to #376:** Companion fix — #365 fixed the stamp, #366 fixed the
  extract path. Together they repaired the v0.9.0 regression.

### PR #344 — fix(upgrade): compare prerelease versions so RC users see the GA

- **URL:** https://github.com/ix-infrastructure/Ix/pull/344
- **Author:** Joseph Mikhail
- **Status:** Merged
- **Commit:** `04d23b1`
- **Summary:** Fixed `isNewer` to correctly handle prerelease versions.
- **Relevance to #376:** This is the `isNewer` function that compares two
  different version series. Any fix to #376 must be compatible with this fix.

## 3. Hiro-Chiba's Active PRs (Core-Ingestion)

### #375 — fix(ingest): resolve JS and TS calls across parse batches

- **URL:** https://github.com/ix-infrastructure/Ix/pull/375
- **Author:** Hiro-Chiba
- **Status:** Open
- **Related issue:** #374
- **Summary:** Fixes cross-batch call resolution in 500-file parse batches.

### #380 — fix(resolve): preserve same-kind ambiguity

- **URL:** https://github.com/ix-infrastructure/Ix/pull/380
- **Author:** Hiro-Chiba
- **Status:** Open
- **Related issue:** #379

### #382 — fix(ingest): resolve PHP calls through typed receivers

- **URL:** https://github.com/ix-infrastructure/Ix/pull/382
- **Author:** Hiro-Chiba
- **Status:** Open
- **Related issue:** #381

## 4. KageBinary's Active PRs

### #372 — feat(llm): implement --format llm for the five commands that faked it

- **URL:** https://github.com/ix-infrastructure/Ix/pull/372
- **Author:** KageBinary
- **Status:** Open
- **Related:** #371 (patches command has --format llm stub)

### #373 — ci(release): give the auto-generated brew PR a conventional title

- **URL:** https://github.com/ix-infrastructure/Ix/pull/373
- **Author:** KageBinary
- **Status:** Open
- **Summary:** CI-only change.

### #352 — fix(install): stop the Windows installer dying on an 8.3 short TEMP path

- **URL:** https://github.com/ix-infrastructure/Ix/pull/352
- **Author:** KageBinary
- **Status:** Open

## 5. system-compass Context

### Issues #57, #58, #59

- **Repository:** ix-infrastructure/system-compass (private)
- **Known from:** v0.3.0 release notes
- **#57:** Fit latch — "The fit used to run once against the 1200×700 placeholder
  and latch, so the map rendered blank until something else re-centred it."
  Fixed in v0.3.0 by adding keyed refit effect.
- **#58, #59:** Referenced alongside #57. Details unknown. #58 likely relates to
  layout bounding (gravity + repulsion cutoff). #59 likely relates to search
  reaching rolled-up regions or breadcrumb collapsing.

### v0.3.0 Release

- **URL:** https://github.com/ix-infrastructure/ix-compass-dist/releases/tag/v0.3.0
- **Released by:** KageBinary
- **Date:** 2026-08-09
- **Source:** system-compass main @ 7f98724
- **Key changes:** Root aggregation 1,471→33, bounded layout, refit effect,
  searchable roll-ups, breadcrumb collapse
- **Purpose:** "This release exists to stop a downgrade" — Ix v0.9.0 bundled
  compass lacked .version stamp, causing ix upgrade to replace it with older
  v0.2.0 dist build.

## 6. Relationship Graph

```
Ix Remap PR (c021b52)
    │
    ├── Based on: origin/main (c4f8fea)
    ├── Predecessor: #358 (view port reporting) by Hiro-Chiba
    ├── Sibling: #362 (view -p warning) by KageBinary — same file, different section
    └── Unrelated to: all 8 open issues (#371, #374, #376, #379, #381, etc.)

#376 (version mismatch)
    │
    ├── Caused by: #365 (compass stamp with Ix version) by KageBinary
    ├── Companion: #366 (tar path pairing) by KageBinary
    ├── Depends on: #344 (isNewer prerelease fix) by Joseph Mikhail
    └── Fix: Change release.yml stamp to use dist version instead of Ix version

Compass F-Key (spec, blocked)
    │
    ├── References: system-compass#57 (fit latch fix in v0.3.0)
    ├── References: v0.3.0 release notes
    └── Reviewer: @KageBinary (system-compass maintainer)

Compass Delayed-Data (investigation, blocked)
    │
    ├── References: system-compass#57 (fit latch → refit)
    ├── Root cause: Timing-dependent region rollup + refit effect gap
    └── Reviewer: @KageBinary

#371 (patches dead)
    │
    ├── Found by: @Alot1z (during agent skill work)
    ├── Related: #372 (--format llm implementation)
    └── Fix: Register in oss.ts or delete patches.ts
```

## 7. PR Reference Format

When preparing future PRs, use these reference formats:

```
Fixes #376         — When the PR actually fixes the issue
Refs #365, #366    — When referencing related historical PRs
Closes #371        — When the PR closes the issue
```

When mentioning people:

```
@KageBinary        — For Compass/view/upgrade/release domain
@josephismikhail   — For code-owner review
@Hiro-Chiba        — For core-ingestion/resolve domain
```

**Do NOT:**
- `@TannerTorrey3` — inactive historic releaser
- Invent PR/issue numbers
- Mass-tag maintainers
- Tag people merely to attract attention
