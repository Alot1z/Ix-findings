# Privacy Audit (final)

## Scan scope & method

`grep -rI` over every `.md`/`.json` in `<IX_FINDINGS>` for: drive paths
(`C:\Users`, `E:\Users`, `/Users/`, `/home/`), local repo paths
(`E:\E-github-repos`), email regexes, credential prefixes (`ghp_`, `gho_`,
`sk-`, `api_key`, `password`, `token`).

## Results

| Pattern | Found | Disposition |
|---|---|---|
| `C:\Users` / `E:\Users` / `/Users/` / `/home/` | none | — |
| `E:\E-github-repos\…` raw paths | 6 occurrences in 2 files | **SANITIZED** during this phase: `decisions/log.md`, `repositories/repository-map.md` → `<IX_REPO>`, `<IX_REMAP_WORKTREE>`, `<COMPASS_DIST_REPO>`, `<IX_FINDINGS>`, `<SANITIZED_ROOT>` |
| emails | none | — |
| credential prefixes / tokens / passwords | none (only descriptive prose: "COMPASS_TOKEN", "GH_TOKEN", scan terminology) | — |
| `.env` values | none | — |
| SSH keys / certs | none | — |

## Placeholder vocabulary (used everywhere)

`<REPO_ROOT>` · `<IX_REPO>` · `<IX_REMAP_WORKTREE>` · `<COMPASS_DIST_REPO>` ·
`<IX_FINDINGS>` · `<SANITIZED_ROOT>` · `<ARTIFACT_DIR>` · `<TEMP_DIR>`

## What the wiki deliberately does NOT contain

- Real filesystem paths (all sanitized).
- The local OS username, machine identifiers, or browser profile data.
- Credentials, tokens, cookies, personal emails.
- Private source code (no system-compass content exists anywhere in this
  ledger).
- Unrelated personal files.

**Public GitHub handles of maintainers/reviewers (KageBinary, josephismikhail,
Hiro-Chiba, TannerTorrey3) are retained** — they are public identities required
for the investigation's maintainer context and mention guidance; they are not
private data.

## Pre-existing material outside Ix-findings (documented, not modified)

- `<IX_REPO>/tasks/*.md` (plan/todo/spec notes) contain forward-slash drive
  paths (`e:/E-github-repos/…`). These are local-only, uncommitted
  investigation notes inside the Ix working tree; **do not push/share without
  sanitizing** (flagged in `../final/verification.md`).
- `<IX_FINDINGS>/artifacts/` holds an extracted public Compass bundle
  (gitignored) — it is a public artifact, not private data.

## Commitment

No secrets were reproduced in any planning document. Nothing in this layer is
safe-to-share-except-this: the entire `planning/` tree and wiki are shareable
after the path sanitization above.
