# GITHUB-PAGES-IMPLEMENTATION-SPEC

**Phase 3 · Ix-findings knowledge explorer static deployment spec**
**Generated: 2026-08-10 · Status: SPEC ONLY — no deployment performed**

---

## 1. Decision Status

| Question | Answer |
|---|---|
| Feasible? | **YES** (verified Phase 2 — see `phase-2/GITHUB-PAGES-FEASIBILITY.md`) |
| Deploy now? | **NO** — needs user authorization + sanitization review (CAND-008, P4) |
| Where? | `Alot1z/Ix-findings` → `gh-pages` branch or Pages-from-source |
| Base path | `https://alot1z.github.io/Ix-findings/` (repo Pages) |

---

## 2. Architecture

```
canonical sources (registries, graph, manifest, pr-packets)
        │  node planning/wiki/build-data.mjs
        ▼
planning/wiki/data/data.js   (generated, ~123KB)
        │  inlining step
        ▼
planning/wiki/index-standalone.html  (~170KB, self-contained, no server/network)
        │  sanitization pass
        ▼
public/ (sanitized static projection)
        │  GitHub Actions workflow
        ▼
gh-pages branch / Pages deployment
```

- The explorer is already fully client-side (D3-free vanilla JS + inline data). No SPA router, no backend, no fetch — ideal for Pages.
- `index.html` loads `data/data.js` + `assets/wiki.js` relative to the page — relative paths must be preserved (no absolute `/` paths).

---

## 3. Required Preconditions (in dependency order)

1. **CAND-001** — manifest counts corrected (deploy would otherwise publish stale 290/240/28).
2. **CAND-002** — phantom evidence nodes reconciled.
3. **CAND-011** — dangling graph edges repaired (integrity).
4. **CAND-014 / CAND-020** — committed explorer syntax error fixed and committed.
5. **CAND-015** — build-data.mjs derives contribution gate from canonical data (no stale hardcodes).
6. Sanitization review (below) signed off.

---

## 4. Sanitization Profile (mandatory before first publish)

### Exclude from public projection

| Class | What |
|---|---|
| INTERNAL | `CLI-HANDOFF/*` phase working notes (or publish only a curated public subset) |
| SENSITIVE | tokens, credentials, `.env` content, authorization headers, private keys — **none may appear** |
| PRIVATE-SOURCE | system-compass source (inaccessible anyway); private maintainer contact details |
| LOCAL PATHS | `E:\E-github-repos\...` → replace with neutral labels (`Ix — local clone`) |
| HISTORICAL/INTERNAL | IX-INVESTIGATION-HANDOFF stale dir; repomix-bundle dumps; temporary scripts |

### Required checks on the published artifact

```bash
# no local Windows paths
grep -r "E:\\\\" public/          # expect no hits
# no secret patterns
grep -rE "ghp_[A-Za-z0-9]{20,}|github_pat_|BEGIN (RSA|OPENSSH) PRIVATE" public/   # expect none
# no live claims
grep -riE "127.0.0.1|localhost" public/   # expect none (or only inert documentation)
```

### Freshness labeling

- The site must state: **SNAPSHOT** + generated timestamp + source revision (per Phase 17 of the original CLI handoff).
- Do not claim live GitHub state; label the snapshot date.

---

## 5. Workflow Sketch (implement in Phase 4, not now)

```yaml
# .github/workflows/pages.yml (draft — NOT created in Phase 3)
name: pages
on:
  push:
    branches: [master]
    paths: ['planning/**', 'CLI-HANDOFF/manifest.json']
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    steps:
      - uses: actions/checkout@v4
      - run: node planning/wiki/build-data.mjs
      - run: node scripts/build-standalone.mjs      # inline data into index-standalone.html
      - run: node scripts/sanitize-public.mjs       # copy + strip internal fields
      - uses: actions/upload-pages-artifact@v3
        with: { path: public/ }
  deploy:
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

- Trigger automatically when canonical knowledge data changes (paths filter above).
- Artifact stays below Pages 1GB limit trivially (~170KB).

---

## 6. Acceptance Criteria

- [ ] Site loads at `https://alot1z.github.io/Ix-findings/` without localhost
- [ ] All 22 views render; graph (152/136) renders; search works
- [ ] No internal paths, no secrets, no local Windows paths
- [ ] Data freshness label present
- [ ] Relative asset paths work under the repo sub-path
- [ ] Build is reproducible from canonical data only (no hand-edited HTML)

---

## 7. Do NOT

- Do NOT publish `CLI-HANDOFF/` raw contents without curation.
- Do NOT make the Pages site the authoritative database.
- Do NOT deploy in Phase 3 or Phase 4 without explicit authorization.
- Do NOT embed private GitHub API tokens or live-fetch APIs.
