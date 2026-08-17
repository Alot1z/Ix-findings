# Related-Risk Analysis — patterns searched, hypotheses, results

Upstream SHA verified against: `8be5f110a5a072767e04dc108e79c539d1bab0f9`

Pattern scan (core-ingestion `src/index.ts` + `patch-builder.ts`) over:
`entity.container`, source-range containment, FQCN maps, file-level symbol maps,
fallback symbol lookup, configured bindings, scope heuristics, and length guards.

## Confirmed related finding #1 — same-line PHP siblings leak the container
artifact into graph qualified keys (NEW, low-medium severity)

**Observation (reproduced, high confidence).** With the F-019 fix applied (or
whenever a same-line sibling PHP type is indexed), a consumer's constructor call
resolves with an artifact-derived qualified key:

```
// Vendor/Package/User.php :  <?php namespace Vendor\Package; class A {} class User {}
// f.php :  use Vendor\Package\User; function f() { new User(); }
edges:  IMPORTS@0.9 User.php (qkey=User.php)
        CALLS@0.9 User.php (qkey=A.User)     <-- artifact key
```

`qualifiedKey()` (index.ts:2969) and `patch-builder.entityQKey` (patch-builder.ts:200)
both key the entity `A.User` because the parse carries `container=A`. The restored
CALLS edge references `A.User`, so it matches the (artifact-keyed) node — no
dangling edge — but the **node identity is semantically wrong** for a top-level
class: any other resolution path that produces the plain key `User` (a different
file where the class is not artifacted, or a future `findEnclosing` fix) creates a
**split identity** for the same logical class; the explorer/graph also surface the
misleading key `A.User`.

**Root cause.** Same root as F-019 (inclusive-line-range `findEnclosing` artifact)
— the FQCN-index exclusion was fixed, but the *qualified-key* derivation still
trusts `entity.container`.

**Confidence.** High that the qkey is `A.User` (direct observation); medium on
real-world impact (requires same-line layout; PHP PSR-12 discourages it).

**Action options (not implemented this campaign).** (a) strip the container
artifact when computing PHP type qkeys (mirrors the f577492 rationale); (b) fix
`findEnclosing` to not nest same-line siblings. (a) is the minimal, consistent
follow-up to f577492.

## Confirmed data gap #2 — TS public-name extractor omits plain named exports
(INFORMATIONAL)

**Observation (high confidence, from source + parse).**
`extractJsExportPublicNames` (index.ts:678) emits public names only for
`export { a as b }` re-export clauses and `export default ...` declarations.
Plain named exports — `export class M {}`, `export const c = 1`,
`export function f() {}` — produce **no** `exportPublicNames` entry.

**Consequence.** `filePublicNames` (the fallback's first branch, index.ts:4393)
almost never fires for TS class exports; renamed-import resolution for class
exports rides entirely on the `fileHasSymbol` fallback + the plain-key guard
(cba11a3/f9274cc). The guard is therefore **load-bearing** for TS: removing or
weakening it (e.g. "fixing" the extractor naively, or reverting to a
`fileHasSymbol`-only fallback) would reintroduce the member-binding class.

**Confidence.** High (code reading + observed `exportPublicNames: undefined`).

## Known pre-existing member-matching sites (documented, not new)

- index.ts:4236 — Go package-file resolution (`pkgFiles.filter(fileHasSymbol(entityName))`).
- index.ts:4429 — Elixir aliased-module resolution.
- index.ts:4489/4516 — generic import/transitive fallbacks (`fileHasSymbol(dstName)`).
- The legacy stem path (`symbolToFiles`/`modNameToFiles`) — the audit's
  documented "legacy stem-path member-binding" class (F-015 family, base==head).

All are pre-existing (verified identical on base vs head in the original audit);
a uniform guard would be a broad legacy-tier change. Recorded as known
limitation, not a contribution candidate.

## Related-bug hypotheses checked and resolved

| # | Hypothesis | Result | Confidence |
|---|---|---|---|
| H1 | Same-line sibling CALLS edge dangles (qkey mismatch) | **Not dangling** — edge qkey `A.User` matches the artifact-keyed node; but node identity is wrong (→ finding #1) | High |
| H2 | `exportPublicNames` unpopulated for TS breaks renamed-import resolution | **No resolution break** — the guarded fallback covers it; data gap only (→ #2) | High |
| H3 | Cross-batch FQCN index has a second producer that re-introduces the F-019 exclusion | **None found** — all producers share `phpTypeFqcn`/`ambiguousPhpTypeNames` | High (verified by 4/4 cross-batch fixed run) |
| H4 | `phpMixedScope` over-skips files (positive-control regression) | **No** — `declare(strict_types=1)` control (original audit) + harness multi-line controls pass | High |
| H5 | f9274cc alone fixes Y1 on merged main | **False** — leaks via unified fallback; needs cba11a3 too | High (reproduced) |

## Bottom line

One new related bug (container-qkey leak, #1) and one data gap (#2) found; no
additional resolution-regression sites beyond the four documented findings. All
hypotheses are reproduced or resolved above — nothing left as an unverified
concern.
