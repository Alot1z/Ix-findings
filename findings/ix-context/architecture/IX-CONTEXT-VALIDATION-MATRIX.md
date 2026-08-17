# Ix-Context Validation Parity Matrix

**Captured against upstream `origin/main`** = `8be5f110` (without PR #455)
**Captured against fork + #455** = `76134e22` (feat/audit-read-side-investigation-validation)

Legend: ✓ = validated, – = cast-only or unchecked, R = runtime check, E = SDK-level enforcement (MCP outputSchema)

| Persisted object | WRITE | READ | MUTATE | RENDER (CLI) | RENDER (--resume) | RENDER (--diff input) | EXPORT (--out) | IMPORT (--resume/`--diff` input) | MCP (`ix_context`) |
|---|---|---|---|---|---|---|---|---|---|
| ix-investigation/1 envelope | ✓ (`saveInvestigation`)  | R (`loadInvestigation` envelope-only) | – | – | R (envelope via `loadInvestigation` then renders via `renderBundle`) | R (envelope only) | n/a | R (loadInvestigation) | n/a (not persisted) |
| ix-context-bundle/1 body | ✓ (`safeParse` in `--out`, `safeParse` in `--save`) | n/a | – (no in-place mutator) | derived from buildBundle output ✓ | n/a (read-only) | n/a | ✓ pre-write | n/a | R+MCP outputSchema |
| On origin/main: bundle body in  loadInvestigation return value | – (cast only) | – | – | – | – | – (used as truth by diffInvestigations) | n/a | – **THE GAP** | E (MCP only on output, not on persisted investigation) |

| Operation | Validation class | Notes |
|---|---|---|
| `--save <id>` | WRITE | bundle passes `safeParse` before temp+rename; tampering is rejected before disk |
| `--out <path>` | WRITE | bundle passes `safeParse` before temp+rename; EISDIR check | 
| `loadInvestigation` (origin/main) | READ | envelope check only; **GAP-1** |
| `loadInvestigation` (fork + #455) | READ | envelope + `safeParse(bundle)` |
| `--resume <id>` | RENDER | goes via `loadInvestigation` → `renderBundle`; safeParse closes the gap |
| `--diff <id>` | RENDER+MUTATE | goes via `loadInvestigation` then `bundle.target.name` re-resolved to backend; safeParse closes the gap (no arbitrary target.name reaches backend) |
| MCP `ix_context` (output) | EXPORT | bundle passes `contextBundleSchema.safeParse` before write, outputSchema enforces on SDK side |

## Asymmetries (origin/main)

| Asymmetry | Intent | Classification | Action |
|---|---|---|---|
| `--save` validates bundle; `loadInvestigation` does not validate bundle | unintentional | **BUG #455** | fix in PR #455; mirror in fork |
| Envelope `schema: "ix-investigation/2"` rejected silently without version-aware fallback | unconditional rejection is safe | INTENTIONAL | document in versioning section |
| `BUNDLE_SCHEMA` and `ENVELOPE_SCHEMA` versions are not synchronized with each other | two strings can drift | INTENTIONAL for now; ARCHITECTURAL WEAKNESS | Phase 11 versioning |
| `parseJsonOutput` returns first JSON-like substring | recovery from noisy startup banners | INTENTIONAL | no change |
| MCP `ix_context` declares `contextBundleSchema` as outputSchema but bundle returned by `runJsonStructured` is NOT separately validated even though it WOULD be if its source were `safeParse`d | double-check via SDK | DEFENSE-IN-DEPTH | already covered by SDK; no change |

## Asymmetries now closed by fork (#455 port)

1. `loadInvestigation` now passes the bundle through `contextBundleSchema.safeParse` — symmetrical to `--save` and `--out`.

## Remaining architectural considerations (Phase 11+)

- Hard-coded `"ix-context-bundle/1"` and `"ix-investigation/1"` strings.
- No version-aware dispatch in `loadInvestigation` for `v2` envelopes.
- No canonical-realpath check on the file the loader reads (symlink-tracking concern; ARCHITECTURAL WEAKNESS but evidence is weak — see notes in `reproducers/CORPUS-NOTES.md`).

