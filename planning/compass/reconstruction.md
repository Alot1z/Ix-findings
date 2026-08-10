# Compass — Reconstruction Methodology & Boundaries

## What the reconstruction rests on

| Source | Class | Used for |
|---|---|---|
| v0.3.0 release notes (KageBinary) | A | what changed, why, issue references |
| Four release tarballs (SHA256-verified) | B | behavior surface, constants, byte-identity |
| Live runtime (browser, real backend) | B | zoom contract, PoCs, delayed-data A/B |
| KageBinary #368 review | A (review comment) | architecture direction, port critique |
| `b038c46` historical port | C (prior work) | what the prototype assumed vs reality |

## Provenance tags used across `compass/`

- **SOURCE** — source-level fact (Ix public source, or release notes for
  system-compass behavior).
- **ARTIFACT** — extracted from released bundles.
- **RUNTIME** — observed live.
- **RECONSTRUCTION** — consistently derived from the above, not source-verified.
- **INFERENCE** — plausible mechanism/name; explicitly not established.
- **UNKNOWN** — not established by any evidence.

## Boundaries (never crossed)

1. Minified identifiers (`Cn`, `Sn`, `Zt`, `Ie`, `J`, `k`) are **labels, not
   source names** (INFERENCE). Never cited as source.
2. Class C/D claims are never presented as facts; PRs must not contain them.
3. No source access was fabricated — `system-compass` remains private and
   unreachable (phase-06 gate, re-verified).
4. No system-compass issue numbers beyond #57/#58/#59 (from the release body).

## The old port → reality table

| Old prototype (`b038c46`) | Real artifact | Disposition |
|---|---|---|
| CameraStore abstraction | real zoom/pan + setters | DELETE |
| camera.ts fit math | real `Cn` fit (equivalent) | ADAPT/REFERENCE |
| useCameraFit auto-frame | #57 refit effect | MOSTLY DELETE |
| KeyboardHelp.tsx | real `[{keys,label}]` array | ADAPT (+F) |
| FitViewHint.tsx | real UI location unknown | ADAPT/OPTIONAL |
| `var(--color-*)` fallbacks | Tailwind semantic tokens | REPLACE |
| `Ie` keyboard identity | real hook + switch | REPLACE (add case) |
| DOM patch (style.zoom, timers) | native camera state | DELETE |

## Reproducibility pointers

Every important finding maps to a reproduction: `../evidence/reproduction/index.md`.
