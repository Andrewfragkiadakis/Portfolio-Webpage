# Bento Grid v2

**Branch:** `style/bento-grid-v2`, built on the v1 Bento Grid (`style/bento-grid`).

> **Round 5 supersedes the palette, the hero and several tiles described below.** The multi-colour "keynote" families, the aurora, the conic border light, the activity rings, the analog clock, the Mac glyph grid and the Ken Burns drift are gone. See [Round 5: calmer and structured](#round-5-calmer-and-structured) for the current system. The sections in between are kept as the design history.

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

## Round 5: calmer and structured

### Why

Two friends tested the live preview and scored it 3/5 and 2/5, the lowest of the finalists. The written comment (translated from Greek) was that the data felt unstructured, the UI was unappealing and there were too many different colours. The one thing they praised was the map with the pin showing where Andreas is based. Andreas's own taste points the same way: Apple-native, clean grids, restraint and one confident accent colour.

Round 5 changes two things. The palette is now neutrals plus one accent, and every panel sits on a visible column grid with one tile anatomy. All facts and content are still reachable.

![Before and after, hero](style-preview/r5/compare-hero.jpg)
![Before and after, What I do](style-preview/r5/compare-services.jpg)
![Before and after, Contact](style-preview/r5/compare-contact.jpg)

### Palette: before and after

| | Round 4 | Round 5 |
| --- | --- | --- |
| Tile fills | White, graphite, black "night", five gradient families (fleet blue→indigo, security emerald, automation orange→pink, ai violet, itsm teal), an aurora name tile, a blue gradient CTA and a silver studio sweep | **White `#FFFFFF` on `#F5F5F7`** (light) and **graphite `#1C1C1E` on black** (dark). The only other surface is a neutral studio sweep behind the hero laptop (`#FBFBFD → #ECEEF2`, or `#2A2A2E → #1C1C1E` in dark). |
| Accent | `#0071E3` / `#2997FF` for links, plus white pills on coloured tiles | **One accent.** `#0066CC` for accent text and marks, `#0071E3` for filled buttons, `#2997FF` in dark. It marks what you can press (the primary pills, affordances on hover, links and Verify) and the key figures (550+, 70%, Jamf 200, 07+, 03, 95%+, the Athens time). |
| Name | Gradient surname (blue → indigo → red) | Two-tone ink: first name in `#1D1D1F`, surname in muted `#6E6E73` (in dark, `#F5F5F7` / `#A1A1A6`) |
| Status and extras | Green live dots, green `➜ whoami`, orange clock hand, rainbow conic border, green/orange activity rings, gradient icon wells, per-brand social wells | Accent live dot, muted `$ whoami`, no clock, no border light, no rings. Icon wells are a neutral fill with the icon in the accent. Social icons are monochrome. |
| Kept in colour | | **Official brand logos** (logo wall, service clusters), **project screenshots** and the **Athens map** (the Apple Maps palette the testers liked). The navigation memoji now sits on a neutral disc (`#E8E8ED` / `#2C2C2E`). |

**Contrast (WCAG 2.x, normal text).**

| Pair | Ratio |
| --- | --- |
| `#1D1D1F` on white | 16.8 : 1 |
| Muted `#6E6E73` on white / on `#F5F5F7` | 5.07 / 4.66 : 1 |
| Accent text `#0066CC` on white / on `#F5F5F7` / on the neutral avatar disc `#E8E8ED` | 5.57 / 5.11 / 4.56 : 1 |
| White on the `#0071E3` accent pill | 4.70 : 1 |
| `#F5F5F7` / muted `#A1A1A6` on `#1C1C1E` | 15.6 / 6.61 : 1 |
| Muted `#A1A1A6` on `#2C2C2E` (logo squares, fills) | 5.42 : 1 |
| Accent `#2997FF` on `#1C1C1E` / on black | 5.64 / 6.96 : 1 |
| Map card: accent time on light glass / on dark glass | 4.58 / 5.93 : 1 |

`#0071E3` as *text* on the `#F5F5F7` page background is only 4.31 : 1. That is why the accent is split, the way Apple splits it: `--accent` (`#0066CC`) for text and marks, and `--accent-fill` (`#0071E3`) for filled controls.

### Structure: one grid, one anatomy

**Column modules.** Each panel is still 12 × 6 on desktop, but tiles now snap to a small set of widths:

| Panel | Modules | Layout |
| --- | --- | --- |
| Hero | 4 + 4 + 4 | Rows 1–4: name and actions (8 columns), selected work (4). Rows 5–6: three key figures, one per module. |
| About | 3 + 3 + 3 + 3 | Rows 1–4: heading and story (left half), four key figures in a 2 × 2 (right half). Row 5: four core skills. Row 6: toolkit. |
| What I do | 3 + 3 + 3 + 3 | **Eight equal tiles**, 4 × 2: heading, Apple fleet, endpoint security, automation, then AI, service management, networks and "Let's talk". The flagship leads by position, not size. |
| Career | 4 + 8 | Heading, current role and timeline on the left. Six earlier roles, two degrees and four credentials on a 2-column grid on the right. |
| Projects | 4 + 8 | Heading and featured case study on the left. Ten equal project tiles and GitHub on the right. |
| Contact | 4 + 8 | Heading and availability on top. Email and profiles on the left, the **Athens map** across 8 columns × 4 rows on the right. |

**Tile anatomy.** Every tile uses the same padding and one of two shapes.

- **Block tile.** A label row on top (`.tile-head`: an 11 px uppercase `.t-label` on the left, the tile's only control on the right, which is an "i", a "+" or an arrow), then the content at the foot of the tile: a `.t-value` figure in the accent or a `.t-title`, then a `.t-caption`. Titles and figures therefore share a baseline across a row.
- **Row tile.** One entry in a list (skills, earlier roles, degrees): an optional icon well, a title and caption, and the control on the right, all vertically centred (`.row-tile`).

There are four type sizes for tile content: `.t-label`, `.t-value`, `.t-title` and `.t-caption`, all defined once in `globals.css`. `Bento.tsx` adds `TileHead` and `Figure` so that every panel builds its tiles the same way.

**Reading order.** Each panel reads title → key facts → details:

- **Hero.** Role and Athens time → name → `whoami` → *View my work* (accent) / *Get in touch* (outline) / LinkedIn, GitHub, Email → 550+ · 70% · Jamf 200.
- **About.** Story → 550+ · 07+ · 03 · 95%+ → skills → toolkit.
- **Contact.** Availability and *Send message* → email → profiles → map.

**Grouping and fewer one-off tiles (65 → 57 tiles).**

- The clock, the socials tile, the two CTA tiles and the rings are folded into the name tile and the three figure tiles.
- The About Mac-glyph tile and the credentials list became the 2 × 2 figures. The credentials, with their Verify links, now sit behind the "i" on "03 Certifications".
- On Contact, GitHub, LinkedIn and the résumé are one **Profiles** list, and the QR code moved behind a QR hotspot on the Email tile.
- `AnalogClock`, `FleetRings` and `MacGrid` were removed.

**Projects.** Screenshots now sit in a neutral inset frame with the name, year and links on the tile below. The dark frosted caption bars over the image, the blurred colour fill and the Ken Burns drift are gone. The featured case study keeps a fixed 16:10 frame, so it no longer shows a tall grey void.

### The Athens map, featured

The map is now the largest tile on Contact: 8 columns × 4 rows, about 920 × 530 at 1440 × 900.

- **Larger canvas.** The canvas grew from 840 × 780 to 1320 × 960 px so that the fixed 30 px/km scale still covers the bigger tile, up to 1920 × 1080, without stretching. The coast, the Aigaleo ridge, the Attiki Odos, Mesogeion, Athinon, Kifisias, Vouliagmenis and Poseidonos, and the district street grids were extended to ±22 km east–west and ±16 km north–south.
- **Bigger pin.** The memoji pin is 4 rem on desktop.
- **Location card.** The card reads "LOCATION / Athens, Greece · 21:34", with the time in the accent. The "i" still holds the coordinates and time zone.

![Map, light](style-preview/r5/map-closeup-light.png)
![Map, dark, Greek](style-preview/r5/map-closeup-dark-gr.png)

### Motion (what is left)

- The spring tile entrance, the counters, the showcase cross-fade, the typewriter and the map pin's pulse remain.
- The aurora drift, the conic border light, the Ken Burns drift, the ring fill, the glyph wave and the ticking clock are removed.
- Hover is still only the 4 px lift and the affordance turning accent.
- There are no pointer-following effects.

### What moved where (nothing removed)

| Content | Round 4 | Round 5 |
| --- | --- | --- |
| 95%+ SLA across 350+ tickets | Hero ring, About tile | Hero "Fleet" "i", About figure |
| Athens local time | Hero clock tile, map card | Hero label row, map card, map "i" |
| LinkedIn / GitHub / Email | Hero socials tile | Hero icon buttons, Contact Profiles list |
| Credentials with Verify | About credentials tile | "i" on About "03 Certifications", Career credential tiles, Jamf 200 hero tile |
| QR (mailto) | Contact QR tile | QR hotspot on the Contact Email tile |
| "Each glyph = 10 Macs" | Mac grid "i" | Removed along with the glyph chart (the figure 550+ stays) |
| Institution of each credential | Dialog only | Caption on the Career credential tile, and in the dialog |

New bilingual labels live in `content.bento.tile` (EN and GR): the status, story, fleet, automation, certified, core skills, profiles, email and at-a-glance labels.

### Verification (Round 5)

- `npm run lint` reports 0 errors and 0 warnings. `tsc --noEmit` is clean and `next build` passes.
- A fit check (`scratchpad/cap/r5.js`) found no clipped content at 1440 × 900 (EN and GR, light and dark) or at 1280 × 720.
- An interaction check (`r5-interact.js`) confirmed:
  - the fleet, credentials, QR and map hotspots open, and Escape returns focus;
  - a click outside closes a hotspot;
  - the skill and service dialogs open;
  - the map canvas covers its tile at 1024 × 768, 1440 × 900 and 1920 × 1080;
  - under reduced motion all 57 bento tiles are at opacity 1 and the pin pulse's `animation-name` is `none`.
- Horizontal overflow at 390 px is 0 px in EN light, GR light and GR dark.
- Previews are in `scratchpad/r5/bento-grid-v2/{light,dark,extra}`, with side-by-side comparisons in `compare/` and before shots in `before/`.

## Previews

Round 5 state. The dialog shots of the project, the skill in Greek and the mobile menu are from Round 4. Those components only changed their icon-well colour.

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
