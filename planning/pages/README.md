# GitHub Pages Deployment Package (LOCAL PREP — NOT DEPLOYED)

**Phase 4 · CAND-008 local implementation** · 2026-08-10

> This package prepares the complete static-deployment pipeline for the
> Ix-findings knowledge explorer. **Nothing here deploys, pushes, publishes,
> or enables GitHub Pages.** Activation requires explicit user authorization
> in a later phase.

---

## What is here

| File | Purpose |
|---|---|
| `public-data-allowlist.json` | **Allowlist-based public data model.** Only listed fields may be published; unknown/private data is excluded by default. |
| `build-public.mjs` | Sanitization + static export. Reads canonical registries, graph, manifest, phase-3 contribution record; applies the allowlist; writes `public/`. |
| `validate-public.mjs` | Deployment gate. Checks files, JSON parse, snapshot label, excluded patterns (local paths, secrets, localhost), graph edge integrity, relative asset refs. |
| `workflow/pages.yml.template` | Prepared GitHub Actions workflow. **Template only** — must be copied to `.github/workflows/` by an authorized later phase. |
| `public/` | Generated sanitized site (build output, validated locally). |

## Pipeline

```
canonical sources (registries, graph, manifest, pr-packets, phase-3 readiness)
        │  node planning/wiki/build-data.mjs      (canonical data.js — unchanged)
        │  node planning/pages/build-public.mjs   (sanitize + export)
        ▼
planning/pages/public/   (index.html + assets + data/data.js — sanitized)
        │  node planning/pages/validate-public.mjs
        ▼
gate passes → deployment ONLY when user authorizes
```

## Public-data decisions (allowlist model)

- **Excluded by default:** raw `manifest` object (embeds `E:\` local paths),
  `worktrees` (local filesystem paths), `sysCompass` internal narrative
  (replaced by a public PRIVATE-status marker), `local_path`/`head_sha` repo
  fields, graph node `note`/`file` fields, system-compass private URLs.
- **Included:** findings, evidence, suggestions, decisions, phases, timeline,
  graph (ids/titles/statuses), public PR/issue metadata, contribution states,
  test results, stale-claim IDs + short descriptions.
- **Unknown/potentially private → excluded by default.** Add to the allowlist
  only after explicit review.

## Local validation (executed Phase 4)

```bash
node planning/pages/build-public.mjs
node planning/pages/validate-public.mjs   # PASSED — see phase-4/TEST-RESULTS.json
```

## Activation checklist (LATER, explicit authorization only)

- [ ] User authorizes public publication + repository visibility decision.
- [ ] `validate-public.mjs` passes on the exact commit to be published.
- [ ] Copy `workflow/pages.yml.template` → `.github/workflows/pages.yml`.
- [ ] Repository Pages source set to "GitHub Actions".
- [ ] Post-deploy smoke: site loads at the Pages URL, no localhost, 22 views render.

## Do NOT (Phase 4)

- Do NOT enable Pages, change visibility, deploy, push deployment changes,
  create a PR, or publish any data. This phase prepares the package only.
