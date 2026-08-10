# Compass Historical Comparison Matrix (v2 — Deepened)

**Evidence class legend:**
- **A** = direct source evidence (source inspected, or authoritative release notes)
- **B** = reproducible artifact/runtime evidence
- **C** = strongly corroborated reconstruction
- **D** = inference/speculation

## Release Timeline

| Release | Date | Released By | Source Rev | Chunks |
|---------|------|-------------|------------|--------|
| v0.1.0 | 2026-03-28 | TannerTorrey3 | unknown | Rolldown, 13 chunks |
| v0.1.1 | 2026-03-29 | TannerTorrey3 | unknown | Rolldown, 13 chunks (several byte-identical to v0.1.0) |
| v0.2.0 | 2026-06-08 | TannerTorrey3 | unknown | Rolldown, 13 chunks |
| v0.3.0 | 2026-08-09 | KageBinary | system-compass main @ 7f98724 | Rolldown, 13 chunks |

## Behavioral Matrix

### Keyboard System

| Property | v0.1.0 | v0.1.1 | v0.2.0 | v0.3.0 | Status | Class |
|----------|--------|--------|--------|--------|--------|-------|
| Handler structure | same | same | same | same | **INVARIANT** | B |
| `window.addEventListener("keydown", ...)` | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Cmd/Ctrl+K early return | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| enabled gate | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| INPUT/TEXTAREA guard | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Key: Esc | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Key: ? | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Key: + | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Key: = | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Key: - | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Key: 0 (fit view) | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Key: l/L (locate) | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Key: i/I (impact) | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Key: F/f | ✗ | ✗ | ✗ | ✗ | **ALWAYS UNBOUND** | B |

### KeyboardHelp

| Property | v0.1.0 | v0.1.1 | v0.2.0 | v0.3.0 | Status | Class |
|----------|--------|--------|--------|--------|--------|-------|
| Byte content | same | same | same | same | **BYTE-IDENTICAL** | B |
| ⌘K entry | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Esc entry | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| ? entry | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| L entry | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| I entry | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| + entry | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| - entry | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| 0 entry ("Reset zoom & center") | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| F entry | ✗ | ✗ | ✗ | ✗ | **NEVER EXISTED** | B |

### Camera & Fit

| Property | v0.1.0 | v0.1.1 | v0.2.0 | v0.3.0 | Status | Class |
|----------|--------|--------|--------|--------|--------|-------|
| Constants: 1200/700/56/1.25/96/36 | ✓ | ✓ | ✓ | ✓ | **INVARIANT** | B |
| Constant: 112 (sidebar) | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Contain algorithm | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Readable cap (1.25) | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Snap: `round(e×t)/t` | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Zoom-in: `min(2.5, z×1.1)` | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Zoom-out: `max(fitZoom, z×0.9)` | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Max zoom (2.5) | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |

### #57 Fit Lifecycle

| Property | v0.1.0 | v0.1.1 | v0.2.0 | v0.3.0 | Status | Class |
|----------|--------|--------|--------|--------|--------|-------|
| One-shot fit latch | ✓ | ✓ | ✓ | ✗ | **REMOVED v0.3.0** | A |
| Keyed refit effect | ✗ | ✗ | ✗ | ✓ | **INTRODUCED v0.3.0** | A |
| Delayed-data blank | ✓ | ✓ | ✓ | ✓ | **PERSISTS** | B |
| Placeholder fit (~0.44) | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Fast-data fit (~0.13) | ✓ | ✓ | ✓ | ✓ | CORRECT | B |
| Mount-time fit instability | ✓ | ✓ | ✓ | ✓ | PERSISTS | B |

### Layout & Rendering

| Property | v0.1.0 | v0.1.1 | v0.2.0 | v0.3.0 | Status | Class |
|----------|--------|--------|--------|--------|--------|-------|
| Fruchterman-Reingold | ✓ | ✓ | ✓ | ✓ | INVARIANT | B |
| Gravity + repulsion cutoff | ✗ | ✗ | ✗ | ✓ | **INTRODUCED v0.3.0** | A |
| Layout time 15.3s → 90ms | ✗ | ✗ | ✗ | ✓ | INTRODUCED | A |

### UI & Navigation

| Property | v0.1.0 | v0.1.1 | v0.2.0 | v0.3.0 | Status | Class |
|----------|--------|--------|--------|--------|--------|-------|
| Rolled-up regions searchable | ✗ | ✗ | ✗ | ✓ | **INTRODUCED v0.3.0** | A |
| Breadcrumb collapse (6+) | ✗ | ✗ | ✗ | ✓ | **INTRODUCED v0.3.0** | A |
| Root aggregation 1,471→33 | ✗ | ✗ | ✗ | ✓ | **INTRODUCED v0.3.0** | A |

### Data Loading

| Property | v0.1.0 | v0.1.1 | v0.2.0 | v0.3.0 | Status | Class |
|----------|--------|--------|--------|--------|--------|-------|
| Region rollup timing-dependent | — | — | ✓ | ✓ | **PRESENT** | B |
| Fast: 9 cards + 1 aggregate | — | — | — | ✓ | OBSERVED | B |
| Delayed: 15 cards, no aggregate | — | — | — | ✓ | OBSERVED | B |

### Artifact Metadata

| Property | v0.1.0 | v0.1.1 | v0.2.0 | v0.3.0 | Status | Class |
|----------|--------|--------|--------|--------|--------|-------|
| Source maps | ✗ | ✗ | ✗ | ✗ | **NEVER PRESENT** | B |
| Build tool | Rolldown | Rolldown | Rolldown | Rolldown | INVARIANT | B |
| Chunk count | 13 | 13 | 13 | 13 | INVARIANT | B |
| Source revision known | ✗ | ✗ | ✗ | ✓ (7f98724) | **CHANGED v0.3.0** | A |

## Key Insights

1. **Keyboard is completely stable.** Zero changes across 4 releases, 5 months. Any keyboard change (like adding F) is safe because the system has never changed.

2. **F has never existed.** Not a single reference to F or f as a key binding. No historical conflict, no regression risk, no compatibility concern.

3. **Fit math is completely stable.** All constants, the contain algorithm, the zoom contract, and the snap function have never changed. The F-key reuses this existing behavior — no new math.

4. **#57 changed only the trigger.** v0.2.0 → v0.3.0: one-shot latch → keyed refit effect. The fit math and camera state remained the same. This is Class A evidence from KageBinary's release notes.

5. **Delayed-data blank persists.** Even with the v0.3.0 refit effect, late content can still produce an invisible map. This is a separate concern from F-key exposure.

6. **v0.3.0 is the landmark release.** It introduced bounded layout, recursive rollups, breadcrumb collapse, and searchable aggregates — all Class A since KageBinary's notes are authoritative for the private system-compass repo.

## Evidence Depth

| Area | Depth | Key source |
|------|-------|------------|
| Keyboard handler | Byte-compared across 4 versions | Extracted JS chunks |
| KeyboardHelp | Byte-compared; v0.3.0 fully extracted | KeyboardHelp chunk |
| Fit constants | All 9 constants extracted from v0.3.0 | Main bundle grep |
| Zoom contract | Live-verified + constant patterns | Behavioral testing |
| #57 lifecycle | Class A (release notes) + B (behavior) | v0.3.0 release notes + preview |
| Delayed-data | Class B (3 reproductions) | Live A/B testing |
| Region rollup | Class B (observed) + A (release notes count) | Live testing + release notes |
| Mount instability | Class B (observed variance) | Multiple runs |
