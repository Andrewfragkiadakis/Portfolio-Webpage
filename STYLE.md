# Bento Grid

**Branch:** `style/bento-grid`

## Concept

The site takes the clarity of an Apple product page. Every section is one **bento**: a 12 × 6 grid of rounded tiles that exactly fills a 1440 × 900 panel, with no inner scrolling. Each tile holds one idea: a name, a number, a credential, a role, a link. The page is light grey with white tiles, one blue accent, and four soft tints (mint, lavender, peach, sky) that pick out a few tiles per panel. Every section opens with an Indisea-style numbered tile ("04 / Timeline: work & education"). Stats are big zero-padded numerals that count up, Kardev-style. The name tile reuses the pastel gradient from the README's bento infographic (`docs/bento-infographic.svg`), so the site and the README read as one system.

The horizontal journey on desktop and the vertical stack on mobile are unchanged. Only what is inside each panel changed.

## Inspirations

| Site | What was taken |
| --- | --- |
| [Indisea](https://www.awwwards.com/sites/indisea) | Numbered section labels ("02 / About"). Zero-padded stat tiles ("07+", "03"). A category-tagged logo marquee, which became the toolkit tile. Confident, heavy sans headings with tight tracking. |
| [Kardev Feed Machinery](https://www.awwwards.com/sites/kardev-feed-machinery) | Stat numbers that count up the first time they scroll into view (550+, 70%, 07+, 03). |
| [Clico AI Studio](https://www.awwwards.com/sites/clico-ai-studio) | A mosaic of pastel, rounded tiles on a pale field. A real artefact instead of a decorative graphic: a terminal tile types out the roles, and the "current focus" is shown as a code object. A floating, pill-shaped segmented nav. |
| Apple keynote / product-page bento (and the repo's own `docs/bento-infographic.svg`) | Tiles of 1×1, 2×1, 2×2 and 4×4. `#F5F5F7` page, white tiles, 1px hairline plus a soft shadow. An inverse "AF" tile. The pastel flagship gradient. A dark terminal tile. |

## Tokens

### Palette

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--background` | `#F5F5F7` | `#000000` | page |
| `--surface` | `#FFFFFF` | `#1C1C1E` | tiles, dialogs |
| `--surface-2` | `#F5F5F7` | `#2C2C2E` | chips inside tiles, tool pills |
| `--foreground` | `#1D1D1F` | `#F5F5F7` | text |
| `--muted` | `#6E6E73` | `#A1A1A6` | secondary text, eyebrows |
| `--line` | black 8% | white 8% | tile hairline |
| `--fill` | black 4.5% | white 8% | icon wells, quiet pills |
| `--accent` | `#0071E3` | `#2997FF` | accent **text** and marks |
| `--accent-fill` | `#0071E3` | `#0071E3` | filled buttons and tiles, always with white text |
| `--ink` / `--on-ink` | `#1D1D1F` / `#F5F5F7` | `#F5F5F7` / `#1D1D1F` | inverse tile ("Get in touch", GitHub). It flips with the theme. |
| `--terminal` | `#1D1D1F` | `#0B0B0C` + 14% white border | always-dark terminal tiles |
| mint | `#E3F6E9` / ink `#0F7A3A` | `#0F2A1A` / ink `#5BD98A` | 70% stat, availability |
| lavender | `#EEEAFD` / ink `#5B3FD1` | `#221C3A` / ink `#B4A6FF` | Jamf 200, AI service |
| peach | `#FDEEE2` / ink `#A8480A` | `#33200F` / ink `#FFB27A` | résumé |
| sky | `#E3F0FD` / ink `#0062C4` | `#0C2340` / ink `#6CB8FF` | 550+ stat, current role, LinkedIn |

Inside a tinted tile, `--muted` is swapped for `--tint-muted` (`#56565B` light, `#B4B4B9` dark). Plain `#6E6E73` on mint is only 4.47:1.

**Contrast (WCAG 2.x, normal text):**

| Pair | Ratio |
| --- | --- |
| `#1D1D1F` on `#FFFFFF` / `#F5F5F7` | 16.8 / 15.4 : 1 |
| `#6E6E73` on white / on `#F5F5F7` | 5.0 / 4.7 : 1 |
| `#0071E3` on white | 4.7 : 1 |
| white on `#0071E3` (filled tiles and buttons, both themes) | 4.7 : 1 |
| `#F5F5F7` on `#1C1C1E` | 15.9 : 1 |
| `#A1A1A6` on `#1C1C1E` / on `#000` | 6.6 / 8.0 : 1 |
| `#2997FF` on `#1C1C1E` | 5.6 : 1 |
| tint inks on their tints (light) | mint 4.8, lavender 5.8, peach 5.2, sky 5.1 : 1 |
| tint inks on their tints (dark) | all ≥ 8 : 1 |

In dark mode `#2997FF` fails as a background for white text (3.0 : 1). Filled controls therefore stay `#0071E3` in both themes, and `#2997FF` is used only for text and marks.

### Type

- **Inter** via `next/font/google`, variable weight, subsets **`latin` + `greek`**, exposed as `--font-inter`. Before this change Greek fell back to a system face. Now "ΑΝΔΡΕΑΣ ΦΡΑΓΚΙΑΔΑΚΗΣ" and every Greek heading render in Inter 700, matching the Latin.
- `.display`: weight 700, tracking −0.04em, line-height 0.92. Solid and never outlined.
- `.numeral`: weight 700, tracking −0.045em, tabular figures, so counters don't jitter.
- `.eyebrow`: 11px, weight 600, uppercase, +0.08em, muted.
- Code and terminal: `ui-monospace` (SF Mono on Apple devices). No web mono font is loaded.
- **Greek capitals:** many Greek labels in `content.ts` are written without tonos because they were designed to be shown in capitals ("Τρεχουσα Εστιαση"). `.el-caps` sets them in capitals **only** under `:lang(el)`, so English keeps its natural case ("Open to Opportunities") and Greek reads correctly ("ΔΙΑΘΕΣΙΜΟΣ ΓΙΑ ΝΕΕΣ ΠΡΟΚΛΗΣΕΙΣ").
- Sizes are fluid, as `min(vw, vh)`, so each bento scales with both viewport dimensions. Examples: the hero name is `min(6.3vw, 11vh)`, section titles are `min(3.6vw, 6vh)` and hero stats are `min(5.4vw, 9.5vh)`.

### Grid and geometry

- `.bento` is a 2-column grid on mobile and tablet. From `md` (64rem) it becomes 12 columns × 6 rows, `height: 100%` of the panel. Tiles are placed with `md:col-[a/b] md:row-[c/d]`.
- Tile radius: 1.75rem desktop, 1.5rem mobile. Gap: 14px desktop, 12px mobile. Padding: `clamp(1rem, 2.4vh, 1.5rem)`.
- A `short:` custom variant (desktop and `max-height: 820px`) tightens gap, padding, icon wells and a few line clamps, so 1280 × 720 and 1024 × 768 also fit without clipping.
- Component CSS (`.tile`, `.pill`, `.chip`…) lives in `@layer components`, so Tailwind utilities can override it per tile.

### Motion

- Each bento reveals once, the first time it enters the viewport. Tiles fade in and scale from 0.955 while rising 14px, with a 55ms stagger (`components/ui/Bento.tsx`). The hero waits for the intro overlay.
- Interactive tiles lift 4px and deepen their shadow on hover. This happens only with `(hover: hover)` and no reduced-motion preference. The corner "+" affordance turns blue, and on service tiles it rotates.
- Counters: `components/ui/AnimatedCounter.tsx`, extracted from the old About counter, with zero-padding added. SSR and reduced motion show the final value.
- Toolkit marquees, the live dot pulse and the terminal typewriter all respect reduced motion. Under reduced motion the typewriter shows the first role statically and tiles have no entrance.
- The theme circle-reveal, the section-counter roll in the nav and the idle section snapping are all kept.

## Per-section changes

| # | Section | Bento |
| --- | --- | --- |
| 01 | **Hero** | Name tile (7×4, pastel gradient, live dot + title, tagline, scroll hint). Terminal tile typing the roles (`➜ whoami`). **550+** endpoints (sky). **Jamf 200** tile linking to Credly (lavender). **70%** faster onboarding (mint). Athens local time + location. Socials (LinkedIn, GitHub, email). Two CTA tiles: *View my work* (blue) and *Get in touch* (inverse). |
| 02 | **About** | Title tile. Story tile (tagline + two paragraphs, as before). "Current focus" as a terminal code object. Credentials list (Jamf 200, ITIL 4, TEE), with verify links where they exist. A 2 × 2 of counting stats (07+, 550+, 70%, 03). Four skill tiles that open the existing dialog. A full-width toolkit tile holding both logo marquees. |
| 03 | **What I do** | Title tile. Six service tiles in four sizes: Apple Fleet as the 4×4 hero tile with highlights, the others 4×2, 3×2 and 5×2. Each tile has an icon, title, a clamped one-line-ish description, a row of its tool logos and "06 tools". Each opens the existing dialog, restyled. The "Let's talk" CTA is a blue tile. |
| 04 | **Career** | Title tile. The current role as a large sky tile with all its tasks. A **Gantt tile** of all seven roles, 2020 → 2026, derived from the duration strings. The six earlier roles as compact tiles that open a dialog with their full task lists. Two degree tiles, each opening a dialog with details. Four certificate/licence tiles with **Verify** links (Jamf 200 highlighted). |
| 05 | **Projects** | Title tile. The featured project (Plano Plus) as a tall tile: an uncropped 16:10 `ProjectImage`, title, description, top highlights, tags and a Live link. Ten projects as 2×2 image tiles with number, name, year, LIVE/OSS/PAPER status and icon links. A "View full portfolio on GitHub" tile. Every tile opens the existing project dialog. |
| 06 | **Connect** | Title tile with copyright. Availability tile (mint, *Open to opportunities*, Send message). Email tile with copy button. Location. Local time. GitHub (inverse) and LinkedIn (sky) tiles. Download-résumé tile (peach). |
| — | **Chrome** | Frosted nav bar: "AF" monogram + rolling "04 / 06" counter, a segmented-control section switcher, and GR/EN plus theme buttons on the right. The theme toggle is in the bar on desktop and is a floating round button on mobile. The mobile menu is a small bento of section tiles. The mobile tab bar is a rounded frosted pill. Dialogs are rounded white/graphite sheets. The intro overlay is a terminal tile with a blue *Enter* pill. |

Every piece of copy (EN and GR), link, credential and dialog from `main` is still present. Nothing was added to `content.ts`. All new UI labels reuse existing keys, for example `skillsTitle`, `servicesLabels.toolkit` and `cursor.verify`.

## Trade-offs

- **All in one panel.** The fit-the-viewport rule meant replacing the horizontally scrolling Experience and Projects carousels with fixed grids. Older roles and the degrees now show a summary and open a dialog for their full text. The eleven projects are small tiles, not large cards.
- **Removed decoration.** The outlined type, letter-glitch canvas, noise overlay, spotlight cards, scramble/roll text and the custom crosshair cursor were all removed. They clash with the Apple-clean direction. Their components were deleted (`LetterGlitch`, `SpotlightCard`, `ScrambleText`, `RollText`, `ScrollRail`, `SectionHeading`, `CustomCursor`, `NoiseOverlay`, `useCardScroll`). The native cursor is used.
- **Greek in capitals.** Because the Greek labels are written without accents, Greek service titles, project names and buttons are set in capitals, including English words inside them ("SIGNATURE CRAFT").
- **Fluid type.** Sizes depend on the viewport, so very wide but short screens get relatively small text. It fits and stays legible, but it is denser.
- **Inverse tiles flip.** The inverse tiles (Get in touch, GitHub) turn white in dark mode. This is deliberate: a white tile on black. It is the one place the dark theme is not "graphite on black".
- **Keyboard travel.** Focusing a tile on another panel now scrolls the track to that panel. The browser's attempt to scroll the clipped viewport sideways is undone.
- **Very small desktops.** At 1024 × 768 small project tiles wrap their status line, and the featured tile's Live link drops to its own row.

## Verification

- `npm run build` passes. `npx eslint src` reports 0 errors and 1 pre-existing warning (`<img>` in `LogoLoop`).
- Mobile (390 × 844) horizontal overflow is **0 px** in light, dark and Greek.
- The only console error is the expected local 404 for `/_vercel/speed-insights`.
- An automated check found no tile with clipped content at 1440 × 900, 1280 × 720, 1024 × 768 or 1920 × 1080, in English or Greek. This check is not part of the repo.

## Previews

### Light, 1440 × 900

![Hero](style-preview/light/desktop-1-hero.jpg)
![About](style-preview/light/desktop-2-about.jpg)
![What I do](style-preview/light/desktop-3-services.jpg)
![Career](style-preview/light/desktop-4-experience.jpg)
![Projects](style-preview/light/desktop-5-projects.jpg)
![Connect](style-preview/light/desktop-6-contact.jpg)

### Dark, 1440 × 900

![Hero](style-preview/dark/desktop-1-hero.jpg)
![About](style-preview/dark/desktop-2-about.jpg)
![What I do](style-preview/dark/desktop-3-services.jpg)
![Career](style-preview/dark/desktop-4-experience.jpg)
![Projects](style-preview/dark/desktop-5-projects.jpg)
![Connect](style-preview/dark/desktop-6-contact.jpg)

### Greek

![Hero GR](style-preview/greek/gr-1440x900-1.jpg)
![What I do GR](style-preview/greek/gr-1440x900-3.jpg)
![Career GR](style-preview/greek/gr-1440x900-4.jpg)

### Mobile (390 × 844)

| Light | Dark |
| --- | --- |
| ![](style-preview/light/mobile-1.jpg) | ![](style-preview/dark/mobile-1.jpg) |
| ![](style-preview/light/mobile-3.jpg) | ![](style-preview/dark/mobile-3.jpg) |

Mobile menu (Greek): ![](style-preview/light/mobile-menu-gr.jpg)

### Dialogs and compact viewport

![Project dialog](style-preview/light/dialog-project.jpg)
![Skill dialog, dark, Greek](style-preview/dark/dialog-skill-gr.jpg)
![Career at 1280 × 720](style-preview/light/compact-1280x720-experience.jpg)
