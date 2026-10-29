# Design tokens

The single source of truth for every visual value in the portfolio. Components
reference **semantic tokens only** (`src/styles/tokens/semantic.css`); the
semantic layer points at primitives from three sources.

```
src/styles/
├── media.css              breakpoints and media features (@custom-media)
├── global.css             imports, reset, base elements, utilities
└── tokens/
    ├── open-props.css     Open Props primitives (fonts, borders, z-index, shadows, sizes, ratios)
    ├── brand.css          ORDIVOX kit v1.0 — palette and base geometry, copied verbatim
    ├── utopia.css         GENERATED fluid type and space scales (npm run tokens:utopia)
    └── semantic.css       roles used by components (colour, type, space, motion, WebGL…)
```

| Layer | Source | Rule |
|---|---|---|
| Brand | ORDIVOX design kit v1.0 (`ordivox_tokens.css`) | Never edit the values. |
| Open Props | `open-props@1.7` — https://open-props.style/ | Imported per module. |
| Utopia | https://utopia.fyi — 360 → 1440px | Regenerate with the script, never hand-edit. |
| Semantic | this project | The only layer components may use. |
| Brief | project brief | Hero display, intro and glyph timing. |

## 1. Colour

Brand palette (verified on the approved logo reference): Midnight Navy `#111B29`,
Ice White `#F3F7FC`, Electric Cyan `#37BFF4`, Performance Blue `#164BA7`,
Racing Red `#F02B42`, Steel Blue `#A8BAD0`, plus the four 50 → 950 scales and
the dark surfaces `#0A121E`, `#1B293B`, `#223349`, `#2A3B50`.

| Token | Value | Use |
|---|---|---|
| `--color-canvas` | Midnight Navy | page background |
| `--color-canvas-deep` | neutral-950 | alternate bands, footer |
| `--color-surface` / `-hover` | neutral-800 / `#223349` | cards |
| `--color-border` / `-strong` | neutral-700 / neutral-600 | hairlines |
| `--color-text` / `-muted` / `-subtle` | Ice White / Steel Blue / neutral-400 | text, 16.1 / 8.7 / 5.3 : 1 on canvas |
| `--color-accent` (`-hover`) | Electric Cyan (cyan-300) | actions, links, focus |
| `--color-accent-ink` | Midnight Navy | text on cyan (8.2 : 1) |
| `--color-depth` | Performance Blue | depth, diagrams |
| `--color-signal` | Racing Red | small accents only — never body text |
| `--color-accent-tint` / `-halo` | cyan at 11% / 10% | icon tiles, section halos (kit values) |
| `--color-status-*` | cyan-300 / blue-300 / neutral-300 | published / in development / coming soon (always with a text label) |

## 2. Typography

Manrope (display) and Inter (body) are self-hosted variable fonts
(`@fontsource-variable`); monospace uses the system stack from the kit.

Utopia type scale — 360px: 16px × 1.125 (Major Second); 1440px: 16px × 1.2 (Minor Third).
Body stays 16px at every width, as in the brand guide.

| Role | Step | 360px → 1440px | Brand reference |
|---|---|---|---|
| `--font-size-body` | step-0 | 16 → 16 | Body 16 / 16 |
| `--font-size-lead` | step-1 | 18 → 19.2 | Lead 17 / 18 |
| `--font-size-h4` | step-2 | 20.3 → 23 | H4 20 / 22 |
| `--font-size-h3` | step-3 | 22.8 → 27.6 | H3 24 / 28 |
| `--font-size-h2` | step-5 | 28.8 → 39.8 | H2 30 / 40 |
| `--font-size-band-title`, `--font-size-metric` | step-7 | 36.5 → 57.3 | editorial headlines |
| `--font-size-h1` | step-8 | 41 → 68.8 | H1 40 / 64 |
| `--font-size-small` / `-label` | fixed | 14 / 12 | brand small and label sizes |

**Hero display (brief):** `--hero-display-size: clamp(4.5rem, 16vw, 14rem)`,
`--hero-display-leading: .82`, `--hero-display-tracking: -.05em`, weight 800.
Verified at 320px: the longest line ends at 282px inside a 288px column.

## 3. Spacing

Utopia space with a 16px base at both ends, so every single step stays on the
brand's 4px grid; fluidity comes from pairs.

| Token | Value | Use |
|---|---|---|
| `--space-3xs` … `--space-4xl` | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px | fixed steps |
| `--space-gutter` | s-m: 16 → 24px | page margin (brand 16 / 24) |
| `--space-section` | xl-3xl: 48 → 96px | band padding (brand 48 / 64 / 96) |
| `--space-grid` | s-m: 16 → 24px | grid gaps (brand 16 / 20 / 24) |
| `--space-card` / `-compact` | 24 / 20px | card padding (brand) |
| `--space-stack-*`, `--space-inline-*` | Utopia steps and pairs | vertical rhythm, inline gaps |

## 4–6. Radii, elevation, borders

Radii are the brand's 8 / 12 / 16 / 24 / pill. `--elevation-rest` is the
brand card shadow; `--elevation-raised` (hover) and `--elevation-overlay`
are Open Props `--shadow-5` / `--shadow-6` with Open Props' dark settings.
Borders are 1px hairlines (`--border-hairline`), 2px for focus, and a dashed
`--border-upcoming` for work that is not published yet.

## 7. Layout

| Token | Value | Source |
|---|---|---|
| `--layout-container` | 1200px | brand |
| `--layout-wide` | 1440px | Open Props `--size-xl` |
| `--layout-measure` | 70ch | brand range 65–75 characters |
| `--layout-measure-lead` / `-heading` | 40rem / 50rem | brand ~640px / ~800px |
| `--layout-header-height` | 64 / 72 / 80px | brand (mobile / tablet / desktop) |
| `--layout-control-height`, `--a11y-min-target` | 48px | brand |
| `--layout-icon-size` / `-stroke` / `-tile` | 24px / 1.75 / 44px | brand guide, kit `.info-icon` |
| `--layout-cover-ratio` | 16 / 9 | Open Props `--ratio-widescreen` |

## 8. Breakpoints

Defined once in `src/styles/media.css` and compiled by `postcss-custom-media`:
`--bp-tablet` ≥ 640px, `--bp-desktop` ≥ 1024px, `--bp-wide` ≥ 1440px, plus
`--motion-ok`, `--motion-reduce` and `--can-hover`.

## 9. Motion

| Token | Value | Source |
|---|---|---|
| `--motion-fast` / `-base` / `-enter` | 150 / 220 / 320ms | brand |
| `--motion-ease` | `cubic-bezier(.2,.8,.2,1)` | brand |
| `--intro-duration` | 2000ms | brief |
| `--intro-text-out-at`, `--intro-curtain-at` | derived: 1360ms, 1680ms | intro timeline below |
| `--glyph-stagger` / `--glyph-duration` | 42ms / 320ms | brief / brand |
| `--intro-lift`, `--glyph-lift`, `--reveal-distance`, `--hover-lift` | 12px, 16 → 32px, 24px, −4px | Utopia space steps |

Intro timeline: line fades in with a 12px lift (0–320ms) → holds → fades out
(1360–1680ms) → curtain lifts (1680–2000ms) while the name enters glyph by
glyph. It never plays with `prefers-reduced-motion: reduce`, with an `#anchor`
in the URL, without JavaScript, or twice in one browser session.

## 10. States

Focus: 2px cyan outline, 3px offset and the brand focus ring. Hover: surface
`#223349`, stronger border, −4px lift on cards (−1px on buttons, as in the
kit). Disabled / upcoming: neutral-400 text and dashed border — no opacity.

## 11. WebGL hero

CSS tokens (`--ribbon-*` in `semantic.css`) drive colours, gain, size, speed
and rendering limits; `src/scripts/ribbons.ts` documents the geometry
(`RIBBON_PATHS`) and wave shape (`RIBBON_SHAPE`). The shader reads the
tokens at start-up, so changing a token changes the render.

Rendering limits: DPR capped at 1.5, internal resolution × 0.75, 30 fps, paused
when the hero is off-screen or the tab is hidden, a single still frame with
reduced motion or Save-Data, CSS gradient fallback without WebGL, context-loss
handling and full GPU clean-up.

## 12. Accessibility

Contrast pairs above meet WCAG AA (most AAA). Racing Red is never used for
text smaller than 24px. Every interactive target is at least 48px tall.

---

## Decisions awaiting approval

The references did not define these values. Each is isolated in one token so
it can be changed in one place.

| # | Token(s) | Where | Proposed value and reasoning |
|---|---|---|---|
| 1 | `--ribbon-*` intensities, width, glow, bloom, speed, amplitude, focus, falloff, grain; `RIBBON_PATHS`, `RIBBON_SHAPE` | hero shader | Tuned visually: red at 0.38 gain so it stays an accent; light field centred upper-right, fading towards the headline. |
| 2 | `--ribbon-max-dpr`, `--ribbon-render-scale`, `--ribbon-max-fps` | hero shader | 1.5 / 0.75 / 30 — GPU budget. |
| 3 | `--hero-overlay` stops | hero | Fade starts at 40% height, 70% canvas at 76%; left darkening to 60% width. |
| 4 | `--hero-fallback` | hero without WebGL | Three radial gradients echoing the ribbons. |
| 5 | `--layout-measure` | long text | 70ch — midpoint of the brand's 65–75 range. |
| 6 | Motion distances (#9) | intro, glyphs, reveals, hover | Reuse Utopia space steps instead of new numbers. |
| 7 | `--color-status-*` | badges | cyan-300 / blue-300 / neutral-300. |
| 8 | `--elevation-raised`, `--elevation-overlay` | hover, mobile menu | Open Props shadows; the brand defines only the card shadow. |
| 9 | `--layout-avatar(-lg)` | avatars | 40 / 48px — brand spacing values reused as sizes. |
| 10 | `--color-selection` | text selection | cyan-900. |
| 11 | Experience covers | `ExperienceCover.astro` | Procedural SVG placeholders in token colours until approved imagery exists. |

Literal values that remain on purpose: the `theme-color` meta and the favicon
use brand hex codes (they cannot read CSS variables); image `sizes`
attributes; SVG drawing coordinates; shader maths constants (τ, hash noise).
