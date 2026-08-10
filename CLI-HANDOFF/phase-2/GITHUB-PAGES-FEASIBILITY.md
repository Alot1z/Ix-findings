# GITHUB-PAGES-FEASIBILITY.md — GitHub Pages Feasibility for the Knowledge Explorer

**Phase 2 · Generated 2026-08-10 · No deployment performed**

---

## Summary

| Question | Answer |
|---|---|
| Is static hosting feasible? | **YES** |
| Current build produces a self-contained artifact? | **YES** — `planning/wiki/index-standalone.html` (~170 KB, all data + CSS + JS inlined) |
| Does it depend on localhost / filesystem / private APIs? | **NO** — works from `file://`; data is generated into the file at build time |
| Is a server needed? | **NO** |
| Are secrets required at runtime? | **NO** |

---

## Static Asset Requirements

1. **Output**: a single self-contained `index.html` (current `index-standalone.html`) OR the multi-file set (`index.html` + `assets/wiki.css` + `assets/wiki.js` + `data/data.js`) — GitHub Pages serves both fine.
2. **Build command**: `node planning/wiki/build-data.mjs` regenerates `data/data.js`; the standalone build inlines it (script exists in the earlier implementation).
3. **Base path**: GitHub Pages project sites are served from `/<repo>/`. The SPA is a single view-driven page (hash/state-based navigation, not URL-routed), so **no base-path or SPA fallback configuration is required**. Relative asset references only.
4. **Routing**: none — single page, state-driven views. No `404.html` needed (optional nicety).

---

## Data Loading Strategy

- **Recommended**: generate all public data into static JS at build time (current approach). Zero network at runtime.
- Alternative (fetch JSON at runtime) adds a GitHub Pages-compatible static JSON path but no benefit here.

---

## GitHub Pages Compatibility

| Requirement | Status |
|---|---|
| Static HTML/CSS/JS | ✅ |
| D3.js for graph | ✅ (bundled or inlined; no server needed) |
| Browser-only dependencies | ✅ |
| Asset size | ✅ ~170 KB single file; trivial for Pages |
| HTTPS | ✅ automatic on GitHub Pages |

---

## Privacy / Sanitization

**Before any deployment, a sanitization pass is MANDATORY.** The public projection must exclude:

| Data class | Public? | Handling |
|---|---|---|
| GitHub tokens / credentials | NEVER | excluded; nothing written to HTML today |
| Local filesystem paths (`E:\E-github-repos\...`) | NO | replace with neutral labels ("local clone") |
| Private repo source content (system-compass) | NO | only public evidence (artifacts, release notes) |
| Maintainer handles | CONDITIONAL | public GitHub usernames are public data; retain only if useful |
| Internal notes / private analysis | NO | review before publishing |

The current standalone was built from the same `build-data.mjs` source that powers the local preview, so **public and internal currently share one generator**. A dedicated sanitized build profile (or a `PUBLIC.md` whitelist) should be introduced before enabling Pages (CAND-008).

---

## Recommended Deployment Path (when authorized)

1. Introduce a sanitization flag/profile in `build-data.mjs` (exclude paths, private-repo source fields).
2. Rebuild `index-standalone.html` from the sanitized dataset.
3. Enable GitHub Pages in `Alot1z/Ix-findings` → Settings → Pages → deploy from branch `master` / folder `planning/wiki` (or a dedicated `docs/` output).
4. Add a workflow (`.github/workflows/pages.yml`) that runs `node planning/wiki/build-data.mjs` + standalone build on push and deploys the artifact.
5. Verify the public site contains no `E:\` paths, no tokens, no private source.
6. Publish only after explicit user authorization.

---

## Risks

- **Accidental private-data publication** if the sanitization step is skipped — mitigations: build-time assertion that `E:\` and token patterns are absent from output.
- **Stale data**: Pages build is a snapshot; freshness label ("SNAPSHOT · generated <date> · source <sha>") is already generated in the explorer.
- **None** related to Pages infrastructure itself.

---

## Phase Boundary

This phase performs **assessment only**. No `pages.yml`, no Pages settings change, no deployment. That work is CAND-008 (status: NEEDS_DECISION).
