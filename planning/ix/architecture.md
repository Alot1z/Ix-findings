# Ix — Architecture (as relevant to this investigation)

## CLI / view server

- `view.ts` `serverScript()` generates an inline Node server (template literal)
  that serves the bundled Compass SPA, proxies `/v1/*`, and (post-remap)
  handles `POST /__ix/remap`.
- Because the server is generated from a template literal, any regex in the
  script is re-interpreted on every regeneration — the reason Origin parsing
  uses `new URL()` (S-012).

## Upgrade / release

- `upgrade.ts`: fetches latest ix-compass-dist release, compares via `isNewer`
  against the installed `.version` stamp → #376 (F-008).
- `release.yml`: builds/embeds the Compass bundle, stamps `compass/.version`
  with the Ix version, publishes to ix-compass-dist.

## Skill / bootstrap

- `skills/ix/scripts/bootstrap.sh` + `.ps1`: installs the CLI and Compass;
  `is_windows()` must exclude WSL (F-011); `node_ok` was dead (F-012).
- The ix agent skill (merged #368) includes the HTTP API reference —
  `docs/api/README.md`, which the remap PR updates for the real endpoint.

## CLI registration

- `register/oss.ts` + `PRO_COMMANDS`; `patches.ts` exports a command that
  nothing registers (#371, F-009).

## Data flow (SOURCE — verified)

```
workspace cwd
   ↓ ix map .
code map (indexed via core-ingestion)
   ↓ served on /v1/* by ix view
Compass UI (bundled)
   ↓ POST /__ix/remap (post-remap)
re-run ix map . in workspace cwd
```

## Generated vs source

- `dist/` (built CLI bundles) is generated + gitignored; `ix-cli/` is source.
- `skills/ix/scripts/compass-patch/` — the local stopgap patch (S-011,
  D-013) lives here as local-only material; not part of any PR.
