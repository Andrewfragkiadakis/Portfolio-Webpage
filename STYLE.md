# Bento Grid v2

**Branch:** `style/bento-grid-v2`, built on the v1 Bento Grid (`style/bento-grid`).

## Brief

Andreas shortlisted Bento Grid and asked for three things: **more imagery in the tiles, better colouring, and more wow factor**. His taste is Apple-native and polished. He does not want clutter or pointer-following effects. v2 keeps the v1 structure: a 12 × 6 bento per panel, the horizontal journey on desktop and a 2-column stack on mobile. What changes is what the tiles show, how they are coloured and how they move.

## What changed vs v1

| Area | v1 | v2 |
| --- | --- | --- |
| Colour | White tiles, one blue accent, four pastel tints | **Keynote palette**: five subject families, each a rich gradient with AA white text, plus white and graphite neutrals for rhythm. The dark theme uses near-black tiles lit by each family's glow, not flat grey. |
| Imagery | Project screenshots only in Projects | Screenshots in the hero (a laptop showcase), image-first project tiles, official tool logos in clusters and in a logo wall, the owner's QR code, a drawn Athens map, a Mac-glyph fleet chart and an analog clock |
| Hero | Pastel name tile, terminal, stat tiles, digital time | Aurora name tile with a **travelling conic border light**, the typewriter inline under the name, a **laptop cross-fading 7 project screenshots**, **activity rings**, a Jamf tile, an **analog Athens clock**, a socials list and two CTAs |
| About | Code-object "current focus", 2 × 2 stats, text marquee of tools | **550+ Macs drawn as 55 laptop glyphs** that light up in a wave, coloured stat tiles (07+ / 70% / 03 / 95%+), and a **logo wall** of all 29 tools. The current focus becomes a line in the story tile. |
| Services | White tiles with small accent logo squares | Each service in its family gradient, with its toolkit shown as an **overlapping cluster of brand-coloured logo discs** |
| Career | Sky current-role tile, grey Gantt | Current role in the fleet gradient. The Gantt's current bar glows. Jamf 200 is a fleet tile carrying the Jamf mark and a white Verify pill. |
| Projects | Image above a white caption | **Image-first**: the screenshot fills the tile and drifts slowly (Ken Burns), with a frosted caption bar. The featured case study also gets the conic border light. |
| Connect | Mint availability tile, plain location and time tiles | Emerald availability tile, **Athens map tile** (pure SVG) with a pulsing pin and the live time, **QR tile**, and GitHub, LinkedIn and résumé in graphite, fleet and automation colours |
| Motion | Fade, scale and rise with a 55 ms stagger | **Spring** entrance (stiffness 150, damping 19) with a 50 ms stagger. Ambient loops run only while their panel is on screen. |

Everything from v1 is still there: all EN and GR copy, every link, credentials and Verify links, the project, service, skill, role and degree dialogs, copy-email, the typewriter, counters, the Gantt, the theme toggle and circle reveal, the GR/EN switch, focus styles and reduced motion.

## Palette

Families are set in `globals.css` as `.tile--fam.tile--{family}`. Each defines three light gradient stops (`--c1…--c3`) and two dark glow colours (`--g1`, `--g2`).

| Family | Used for | Light gradient (135°) | Dark glow |
| --- | --- | --- | --- |
| **fleet** | Apple fleet, Jamf 200, Mac grid, current role, LinkedIn | `#0A5CD6 → #3A44D4 → #5835C6` (blue → indigo) | `#2F6BFF`, `#7A4DFF` |
| **security** | Endpoint security, 95%+ SLA, availability | `#0A7A57 → #07644A → #054E3C` (emerald) | `#13C486`, `#0A8F7A` |
| **automation** | Scripting, 70% onboarding, résumé | `#C03E0A → #BF2748 → #AD175C` (orange → pink) | `#FF6A2B`, `#FF2F7A` |
| **ai** | AI operations, certifications | `#7236E3 → #5A27C6 → #44209C` (violet) | `#9D5CFF`, `#5F3DFF` |
| **itsm** | IT service management | `#0A7280 → #085D6B → #064858` (teal) | `#19B8C9`, `#1F7FD6` |

Neutrals:

- **plain**: white on `#F5F5F7` in light. In dark, `#17171B → #0F0F12` with an inner top highlight and a 7.5% hairline.
- **graphite**: `#2C2C30 → #1D1D1F` in both themes.
- **night**: an always-black watch face, used for the rings.
- **aurora**: the name tile.
- **studio**: a silver product-shot sweep, or a lit void in dark, used for the showcase.

**Accent:** `#0071E3` (light) and `#2997FF` (dark), used for links, CTAs and focus rings only. On coloured tiles the CTA is a white pill (`.pill--white`).

**Contrast (WCAG 2.x, normal text).** The ratios were checked with `.research/contrast.py`.

| Pair | Ratio |
| --- | --- |
| White on the lightest stop of each family (fleet / security / automation / ai / itsm) | 5.97 / 5.34 / 5.34 / 6.26 / 5.63 : 1 |
| Family `--muted` (white at 90%) on the lightest stop | ≥ 4.62 : 1 |
| Dark family tiles | white on near-black lit at ≤ 46% colour, ≥ 8 : 1 |
| Project caption glass (`rgba(18,18,22,.74)`) over a pure-white screenshot | white 7.8, white/80 5.7, status `#9FD0FF` 4.8 : 1 |
| `#1D1D1F` / muted `#3A3A3F` on the aurora, even where all three pastel fields (≤ 40% alpha) overlap at full strength | ≥ 9 : 1 / ≥ 5.5 : 1 |
| Accent `#0071E3` on white, `#2997FF` on near-black | 4.7 / 6.5 : 1 |

The gradient surname (`#0850C0 → #4A2CB4 → #A01F45` in light, `#6CB8FF → #FF8FB1` in dark) is display type at more than 60 px. Every stop is at least 3.4 : 1 even over the darkest aurora overlap.

## Tiles and imagery

- **Showcase** (`ui/Showcase.tsx`): a CSS laptop (bezel, 16:10 display, a base with a thumb notch and a glass reflection) sized with container-query units, so it always fits its tile. It cross-fades 7 web screenshots every 4.2 s through the existing `ProjectImage`. Contain-fit shots keep their blurred fill, so nothing is badly cropped. Only the current and next shots are mounted. The first loads eagerly and the rest lazily. A caption bar rolls the project name and shows dots. The tile opens Projects.
- **Activity rings** (`ui/FleetRings.tsx`): two rings with **real figures only**: 95% (SLA over 350+ tickets, emerald) and 70% (faster onboarding, orange → pink). **550+ Macs** sits in the centre as a count, not a ring. There is no published enrolment or compliance percentage, so no ring was invented for either.
- **Mac grid** (`ui/MacGrid.tsx`): 55 SVG laptop glyphs, each worth 10 Macs. They light up in a diagonal wave the first time they are seen. The legend is in both languages.
- **Logo wall** (About): all 29 tools in `data/tools.ts` as brand-coloured marks on quiet squares. The top row is ops (fleet, security, identity, infrastructure) and the bottom row is build (code, AI, collaboration). Pale brands are deepened on white and navy brands lifted on black (`brandInks`). Names stay available as `title` and screen-reader text.
- **Logo clusters** (Services): overlapping white discs carrying each service's toolkit in brand colours. The dialog still lists the tool names.
- **Analog clock** (`ui/AnalogClock.tsx`): Apple-style ticks and an orange second hand that ticks with a slight overshoot. It uses the Athens time zone and ticks only while on screen. Under reduced motion there is no second hand and it updates every 15 s.
- **Athens map** (`ui/AthensMap.tsx`): a pure SVG of the Saronic Gulf, a rotated street grid, the main avenues, the National Garden and Lycabettus, with a pulsing pin. There are no map tiles and no external requests. It has a light and a dark palette and carries a glass card with the city and live time.
- **QR** (Contact): the owner's `QR Codes/qr-code-for white-background.png`. Decoding it gives `mailto:andrewfragkiadakis@gmail.com`, so the label reads "Scan to email me". It sits on a white card so it scans in either theme. It is served unoptimised because the folder name has a space, which the optimiser rejects.
- **Project tiles**: image-first with a frosted caption bar. Contain screenshots sit above the bar (`ProjectImage` `containBox`), so the bar only covers the blurred fill.

New bilingual labels live in `content.bento` (EN and GR): selected work, fleet title, Macs, SLA label, glyph legend, "in daily use", scan to email, QR alt text, map label and city.

## Motion

| Effect | How | Cost |
| --- | --- | --- |
| Tile entrance | `motion` spring (y and scale) with an opacity tween, staggered 50 ms | Once per panel |
| Conic border light (hero name, featured project) | A square conic-gradient **rotates** (`transform`) inside a static ring mask, 7 s per turn | Compositor only |
| Aurora | Four radial fields drift with `transform` (24–34 s, alternate) | Compositor only |
| Ken Burns | Scale 1 → 1.05 with a small translate over 22 s, alternate, with staggered delays and origins per tile | Compositor only |
| Counters | `AnimatedCounter` (v1), 07+ / 70% / 03 / 95%+ / 550+ | Once |
| Rings | `pathLength` fills over 1.6 s, then stop | Once |
| Mac glyphs | Opacity wave with a per-glyph `transition-delay` | Once |
| Showcase | Opacity cross-fade over 1.2 s every 4.2 s, paused on hover | While on screen |
| Clock | 1 s tick with a spring-like cubic-bezier | While on screen |
| Map pin | Pulse | While on screen |

- **Pausing offscreen**: `Bento` sets `data-live` from `useInView` (35%). CSS loops are `animation-play-state: paused` unless an ancestor has `[data-live="true"]`. JS loops (showcase, clock) check their own `useInView`. On load only the hero reports `live=true`.
- **Reduced motion**: every loop is declared inside `@media (prefers-reduced-motion: no-preference)`, so under `reduce` it does not exist. This was verified: the glow and aurora `animation-name` are `none` and all tiles are at opacity 1. Tiles appear without an entrance, rings and glyphs render filled, the showcase rests on its first screenshot, the typewriter shows the first role and the clock drops its second hand.
- **No pointer-following effects.** Hover does only what v1 did: a 4 px lift and the affordance turning blue, or white on coloured tiles.

## Trade-offs

- **The tool names are no longer visible in About.** The logo wall replaces the v1 text marquee to satisfy "more images, less clutter". Names are still in tooltips, in screen-reader text and in every service dialog.
- **Current focus is shorter.** The v1 code object became one line (label and detail) at the foot of the story tile. The same content, without the stack and certs code lines.
- **The Ken Burns drift crops up to about 2.5% per edge** at its widest. Contain screenshots stay whole inside their frame, apart from that drift.
- **Greek fitting.** Greek copy is longer, so two places tighten under `:lang(el)` through a `lang-el:` variant: the About story paragraphs (about 0.92vw) and the two hero CTAs.
- **The featured project hides its highlight bullets** on short desktops (`short:`), as in v1.
- **The QR image is not optimised** (a 1155 px PNG), to avoid renaming the owner's externally referenced asset folder.
- **`LogoLoop.tsx` was removed**, because the marquee was replaced. This also clears v1's only lint warning.

## Verification

- `npm run build` passes. `npx eslint src` reports **0 errors and 0 warnings**. `tsc --noEmit` is clean.
- Mobile (390 × 844) horizontal overflow is **0 px** in EN and GR, light and dark.
- A fit check (`.research/check.js`) walks every in-flow element of every tile on every panel. It found **no clipped content** at 1440 × 900, 1280 × 720 or 1024 × 768, in English or Greek.
- An interaction check (`.research/interact.js`) confirmed that the project, service and skill dialogs open, that Escape closes them, that reduced motion is honoured and that only the visible bento is live.
- The only console error is the expected local 404 for `/_vercel/speed-insights/script.js`.
- No new runtime dependencies. Fonts are unchanged: Inter via `next/font/google` with `latin` + `greek`.

## Round 4: a calmer grid, a real Athens map, the memoji mark

Andreas asked for three things: fix the location image on Contact, make the site about 25% less cluttered without losing anything, and use his memoji instead of the "AF" monogram.

### Athens map tile

**What was wrong.** The old map was a 400 × 260 SVG stretched with `slice` into a tile that is nearly square on desktop and wide on mobile. That meant:

- it was blown up about 2×, so the 1 px street grid became thick, even graph paper;
- the sides were cropped away, so the coast shrank to a sliver in a corner that the glass card then covered;
- nothing on it said "Athens" (the parks were arbitrary blobs and there was no coastline shape, mountain or place name);
- the text was repeated four times: the Location chip, the coordinates chip, the card, and the "Athens, Greece" chip on the tile above.

**The fix** (`ui/AthensMap.tsx`) is a new inline SVG drawn from simplified real geography, in kilometres from Syntagma:

- the Saronic Gulf coast from Piraeus round Faliro Bay to Glyfada;
- Hymettus and Aigaleo, each with faint contour lines;
- the Kifisou, Attiki Odos and Hymettus ring motorways;
- the main avenues (Syngrou, Pireos, Kifisias, Mesogeion, Vouliagmenis, Poseidonos and others);
- the National Garden, the Acropolis and Philopappos, Lycabettus, Pedion tou Areos and Ellinikon;
- a separate street grid for each district, each at its own angle (a single grid reads as graph paper).

How it is drawn:

- **Fixed scale.** The map is drawn at 30 px/km and is never stretched. A larger tile simply shows more of the city, the way a real map does. Strokes stay 1 px sharp and labels stay 11 px at every size. `.map-canvas` places the canvas so that Syntagma lands on the pin at `(50% + --ox, 50% + --oy)`, with separate offsets for mobile and desktop so that the pin, the card and the coast all fit.
- **Apple Maps palette** in `.map`, with a night palette for dark mode. There are only two labels: Piraeus and the Saronic Gulf, in both EN and GR.
- **A "Find My" pin** made from the memoji in a white ring, on a tail, over a pulsing blue dot. The pulse pauses offscreen and is removed under reduced motion.
- **One glass card**, "Athens, Greece · 21:34". The coordinates and the UTC offset sit behind the tile's "i".
- There are still no tiles and no network requests.

### Less on screen, one click deeper

**`ui/InfoSpot.tsx`** is a quiet 28 px "i" (or "+N") hotspot:

- it is a real `<button>` with `aria-expanded` and `aria-controls` and a 44 px hit area;
- it opens a small frosted popover (`role="dialog"`) that is portalled to `<body>`, so tiles and the transformed track cannot clip it;
- the popover is positioned against the button and follows it on scroll, and it closes when the button leaves the screen;
- Escape (which returns focus to the button), a click or tap outside, or tabbing away all close it;
- only one popover is open at a time;
- it has no blinking or pulsing, and under reduced motion it opens with an opacity change only.

Density at 1440 × 900 was measured with Playwright (`density.js`). The script counts words that are actually visible, taking clipping, `line-clamp`, `truncate` and `sr-only` into account, and counts visible text blocks and graphics (images, SVGs, icons and logos) per panel.

| Panel | Words, EN (before → after) | Words, GR | Elements (text blocks + graphics) |
| --- | --- | --- | --- |
| Hero | 75 → 53 (−29%) | 77 → 56 | 46 → 35 (−24%) |
| About | 157 → 111 (−29%) | 169 → 115 | 86 → 61 (−29%) |
| What I do | 205 → 131 (−36%) | 206 → 127 | 80 → 57 (−29%) |
| Career | 242 → 140 (−42%) | 222 → 129 | 89 → 63 (−29%) |
| Projects | 137 → 81 (−41%) | 137 → 82 | 83 → 53 (−36%) |
| Connect | 69 → 53 (−23%) | 69 → 50 | 41 → 31 (−24%) |
| **Total** | **885 → 569 (−36%)** | **880 → 559** | **425 → 300 (−29%)** |

The tile count is unchanged (65). The layouts are the same, with more air inside each tile. Career and Projects were cut further than the others because they were the densest panels.

**What moved, and where it lives now:**

- **Hero.**
  - The ring legend (95%+ SLA across 350+ tickets, 70% faster onboarding and 550+ endpoints) is now behind the rings tile's "i".
  - The tagline has gone from the name tile. It is word for word the heading of the About story.
  - The clock tile reads "Athens 21:34". The UTC offset is in the Contact map "i".
  - The social rows have lost their arrow glyphs, and the Jamf tile has lost its Apple watermark.
- **About.**
  - The story shows its first paragraph. The second paragraph and the Current Focus line are behind its "i".
  - "Each glyph = 10 Macs" is behind the Mac grid's "i".
  - The stat tiles have lost their icons, and the skill tiles have lost "Read more" (the "+" and the dialog remain).
  - The logo wall shows one row of 14 headline tools. A "15 +" hotspot opens all 29 tools **with their names**, which were previously only tooltips.
- **What I do.**
  - The tile descriptions are now actually clamped to two lines (three on the flagship). The old `block` class had been overriding `line-clamp`.
  - The flagship's three highlights and every "06 TOOLS" counter have been removed from the tiles.
  - The clusters show up to four logos.
  - The dialog now opens with the tile's summary above the detail, then the highlights and the full toolkit, so nothing clamped is lost.
- **Career.**
  - The current role shows its first responsibility, and the whole tile opens the full list (the same dialog as the other roles, now with a "+").
  - The earlier roles and degrees show years only (for example "2024 – 2026"). Months and institutions are in each dialog.
  - The credential tiles show the badge, the year and Verify. The full name and issuer are in the dialog, and the full name is also screen-reader text.
  - The Gantt has lost its row numbers, and the role tiles have lost their 02–07 indices.
- **Projects.**
  - The featured project drops its highlights and tags, and its "· 01" index, and its description is clamped to two lines. All of this is in the dialog.
  - The small tiles drop the number chips and the LIVE / OSS / PAPER words. The live and code buttons still show on the tile, and report and publication links are in the dialog.
- **Connect.**
  - The duplicate "Athens, Greece" chip and the paper-plane watermark have gone from the availability tile.
  - The "Email" label and the envelope well are gone.
  - The duplicate address under the QR code is gone.
  - "Find me on" is gone from the GitHub and LinkedIn tiles, and the "CV" eyebrow and file icon are gone from the résumé tile.
  - The map's chips became one card plus the "i" (see above).

### Logo

The "AF" monogram in the navigation is replaced by the owner's memoji (`public/favicons/android-chrome-512x512.png`):

- it is rendered through `next/image` at 36 px, so 1× and 2× files are generated, and has `alt="Andreas Fragkiadakis"`;
- it sits on a soft avatar disc: pale blue in light mode, slate in dark mode;
- the same memoji is the map pin;
- `opengraph-image.tsx` now reads the PNG and embeds it as a data URL in a ringed disc above the name, and falls back to the name alone if the file cannot be read;
- there is no other "AF" mark in `src`, and the intro overlay is a terminal with no logo.

### Verification (Round 4)

- `npm run lint`: 0 errors and 0 warnings. `tsc --noEmit` is clean. `next build` passes, and `/opengraph-image` prerenders.
- Hotspots were tested in Playwright (`r4extra.js`), in light and dark:
  - a click opens a hotspot, and `aria-expanded` flips;
  - a click outside closes it;
  - Escape closes it and returns focus to the button;
  - Enter opens it from the keyboard and moves focus into the popover;
  - opening a second hotspot closes the first;
  - on a 390 px touch device, a tap opens a hotspot and a tap outside closes it;
  - the toolkit popover lists all 29 tools.
- Mobile horizontal overflow is 0 px in both themes. Greek was checked on every panel and in the map popover.
- Previews are in `scratchpad/r4/bento-grid-v2/{light,dark,extra}`, with before shots and density numbers in `before/`.

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

### Greek, 1440 × 900

![Hero GR](style-preview/greek/gr-1440x900-1.jpg)
![About GR](style-preview/greek/gr-1440x900-2.jpg)
![What I do GR](style-preview/greek/gr-1440x900-3.jpg)
![Career GR](style-preview/greek/gr-1440x900-4.jpg)
![Projects GR](style-preview/greek/gr-1440x900-5.jpg)
![Connect GR](style-preview/greek/gr-1440x900-6.jpg)

### Mobile (390 × 844)

| Light | Dark |
| --- | --- |
| ![](style-preview/light/mobile-1.jpg) | ![](style-preview/dark/mobile-1.jpg) |
| ![](style-preview/light/mobile-3.jpg) | ![](style-preview/dark/mobile-3.jpg) |
| ![](style-preview/light/mobile-5.jpg) | ![](style-preview/dark/mobile-5.jpg) |

Mobile menu (Greek): ![](style-preview/light/mobile-menu-gr.jpg)

### Dialogs, compact viewport and reduced motion

![Project dialog](style-preview/light/dialog-project.jpg)
![Service dialog](style-preview/light/dialog-service.jpg)
![Skill dialog, dark, Greek](style-preview/dark/dialog-skill-gr.jpg)
![Hero at 1280 × 720](style-preview/light/compact-1280x720-hero.jpg)
![Career at 1280 × 720](style-preview/light/compact-1280x720-experience.jpg)
![Hero with reduced motion](style-preview/light/reduced-motion-hero.jpg)
