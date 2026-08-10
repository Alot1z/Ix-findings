# GitHub Pages Deployment Package — PREPARED, NOT EXECUTED

**Phase 5 · 2026-08-10 · Gate F = NOT AUTHORIZED → prepared + locally validated only**

> No Pages deployment, no workflow activation, no visibility change, no
> publication occurred. This document is the complete deployment package for a
> later explicitly authorized phase.

---

## 1. What is ready

| Item | Path | State |
|---|---|---|
| Public-data allowlist | `planning/pages/public-data-allowlist.json` | committed |
| Sanitization + export pipeline | `planning/pages/build-public.mjs` | committed |
| 16-check validator | `planning/pages/validate-public.mjs` | committed, 16/16 PASS |
| Prepared (disabled) workflow | `planning/pages/workflow/pages.yml.template` | `.template` — must be renamed/authorized before use |
| Package README | `planning/pages/README.md` | committed |
| Built public output | `planning/pages/public/` | regenerated 2026-08-10 (graph 162/133, evidence 28, 132K) |
| Public-data audit | `PAGES-PUBLIC-DATA-AUDIT.json` | 0 secrets, 0 paths, 0 private URLs |
| Local validation | `PAGES-LOCAL-VALIDATION.json` | 16/16 PASS |

## 2. Pipeline

```
authoritative structured data (registries + manifest)
        ↓ build-data.mjs
data.js (ledger truth)
        ↓ build-standalone.mjs
wiki explorer (index.html + data.js + wiki.js + wiki.css)
        ↓ build-public.mjs  (allowlist + sanitize + redact)
planning/pages/public/  (PUBLIC_SAFE projection)
        ↓ validate-public.mjs  (16 checks)
        ↓ [authorized phase only] workflow + Pages
public site
```

## 3. Sanitization guarantees (verified)

- **No** local drive paths (`E:\`, `C:\`, `E:/`) — redacted to `[local-path]`.
- **No** `ghp_`/`github_pat_`/private-key patterns.
- **No** private URLs — only public `github.com/ix-infrastructure` and
  `github.com/Alot1z` references.
- **No** worktree nodes, **no** raw manifest, **no** machine-specific values.
- System-compass appears only as a public status marker (`access: PRIVATE`,
  `published: false`) and project-name references — no source detail.
- `localhost`/`127.0.0.1` in wiki.js are inert security-model documentation
  (loopback whitelist explanation), explicitly allowed by the Phase 3 spec.

## 4. Deployment procedure (for the authorized phase ONLY)

1. Confirm explicit user authorization for: enabling Pages, publishing the
   artifact, and (if needed) repository visibility.
2. Re-run `node planning/pages/build-public.mjs && node planning/pages/validate-public.mjs`
   on the final ledger state; record the artifact SHA.
3. Verify the target repository and branch for the Pages source.
4. Rename `planning/pages/workflow/pages.yml.template` → `.github/workflows/pages.yml`
   in the target repo, keeping the validation gate in the workflow.
5. Push the workflow + built artifact (requires the workflow-scoped token —
   the raw `git push` of workflow files was rejected by scope guard in Phase 5
   when using the credential-manager token; use the gh token or add workflow
   scope).
6. Enable GitHub Pages for the target branch.
7. Wait for the deployment run; obtain the **actual** deployment URL.
8. Browser-test the deployed site: graph loads, findings/evidence/suggestions/
   decisions/repositories/phases/PR-issue mappings load, search + filters +
   node inspection work, zero console errors, no forbidden data.
9. Record deployment SHA, workflow run ID, deployment timestamp.

## 5. Rollback procedure

- Disable Pages / switch the source branch back, or remove the workflow file
  and push — the site is static and fully regenerable from the committed
  pipeline, so rollback = delete the deployed branch/artifact and rebuild.

## 6. Privacy decision required before any deployment

- The project should publish **only sanitized public knowledge** (the
  `planning/pages/public/` projection). The internal ledger (CLI-HANDOFF,
  planning/ registries with local paths, packets with internal notes) must
  **never** be deployed.

## 7. Authorization status

```
Pages enabled:            NO
Workflow activated:       NO
Visibility changed:       NO
Artifact pushed:          NO
Deployment URL:           none
Authorization:            REQUIRED (Gate F not granted in Phase 5)
```
