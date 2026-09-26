# Apple Keynote

**Branch:** `style/apple-keynote`

## Concept

The portfolio as an apple.com product-launch page. Each panel of the desktop horizontal track is a **slide**; on phones the slides stack vertically. The language is apple.com's product pages, deliberately restrained: neutral surfaces, one interactive blue, San Francisco at Apple's scale and tracking, pill buttons, "Learn more ›" links, borderless tiles, and a hairline spec table.

It is a personal portfolio *in the style of* a launch page. The Apple logo is never used as site branding; the site mark is Andreas's own memoji.

| # | Slide | EN headline | GR headline |
|---|---|---|---|
| 1 | Overview (hero) | Apple fleets. / Automated. | Στόλοι Apple. / Αυτοματοποιημένοι. |
| 2 | About | Meet Andreas. | Γνωρίστε τον Ανδρέα. |
| 3 | What I do | Happens twice? / It becomes a script. | Συμβαίνει δύο φορές; / Γίνεται script. |
| 4 | Tech specs (new) | The toolkit. | Η εργαλειοθήκη. |
| 5 | Career | Then. Now. | Τότε. Τώρα. |
| 6 | Projects | Selected work. | Επιλεγμένα έργα. |
| 7 | Contact | Let's build / something. | Ας φτιάξουμε / κάτι μαζί. |

## Round 4: what changed and why

Andreas: *"It's too colourful, and some fonts and components look off from Apple's style. Redesign it — I like the general idea."* Also, for every branch: use the memoji technologist as the logo, not "AF" letters.

### What was off-Apple (audit of the round-3 build)

**Colour**
- A blue → violet → purple gradient on one word of **every** slide (Automated., the 550+ stat, script., Now., something., the intro's Hello.), plus the gradient progress line, the gradient dot on the active project and a gradient outline around the "Now" card. That made six-plus colour moments; Apple uses at most one.
- Blue/purple radial "stage glows" behind the hero, projects, contact and intro.
- Slides alternated **black and white inside one theme**, so a dark-theme visitor got three white slides. apple.com alternates *neutrals* (white / #F5F5F7), not black and white.
- Blue Font Awesome icons in the feature cards, a filled blue "JAMF 200" badge, blue check marks: the accent was spent on decoration rather than on things you can click.

**Type**
- Headlines at weight **700** with **−0.035em** tracking (numbers −0.045em). Apple sets display type at **600**, about −0.015em at 80–96px and −0.009em at 56–64px. The result looked cramped and heavier than apple.com.
- One stack for everything; no distinction between the Display and Text optical sizes on non-Apple devices (Inter was loaded without its `opsz` axis).
- Eyebrow, lede and body sizes were fluid `vw`/`vh` values that drifted off Apple's scale (17 / 21 / 24 / 28 / 40 / 56 / 64 / 96px).

**Components**
- Chevrons inside pill buttons (Apple puts `›` on text links, never inside pills); pill text at weight 500 (Apple: 400).
- 48px global nav whose colour flipped with the slide underneath, with the name as plain 15px text and centred links. Apple's local nav is 52px, frosted (`saturate(180%) blur(20px)`), consistent, with a 21px product title on the left and links + a small pill on the right.
- Cards with blue FA glyphs, a scale-on-hover and a "Learn more ›" row; Apple feature tiles are borderless with a round (+) disclosure.
- The services slide packed six cards *and* the full tech-specs table: too full.
- Floating iOS-style tab bar on mobile (an app pattern, not apple.com), overlapping content.
- Dialogs with a visible border and heavy shadow.

**Motion**
- Headlines split into words that rose one by one out of masks; layers drifted in parallax at different speeds. apple.com fades and rises whole blocks gently.

### What the redesign does

**Colour**
- Neutrals only. Light: `#FFFFFF` / `#F5F5F7` slides, `#1D1D1F` text, `#6E6E73` secondary. Dark: `#000000` / `#101011` slides, `#1D1D1F` tiles, `#F5F5F7` text, `#86868B` secondary.
- Slides alternate between the **two neutrals of the current theme**, the way apple.com alternates white and #F5F5F7 sections. Tiles always sit one step from their slide (grey tiles on white slides, white tiles on grey slides).
- One blue for interaction: `#0071E3` fills, `#0066CC` links (`#2997FF` on dark).
- **One** colour moment on the whole site: the hero's second line ("Automated." / "Αυτοματοποιημένοι.") in a short ramp *inside Apple's blues* (`#0071E3 → #4B62D9`; dark `#2997FF → #6F84FF`). No violet, no glows.

**Type**
- System stack first, so Apple devices get San Francisco and its automatic Display/Text switch: `--font-display` = `-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, …` and `--font-text` = `…"SF Pro Text", Inter, …`. Other devices get **Inter via `next/font`, `latin` + `greek` subsets, with the `opsz` axis** and `font-optical-sizing: auto`.
- apple.com's scale and tracking as classes in `globals.css`:

| Class | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| `.t-hero` | 40 → 96px | 600 | −0.015em | 1.05 |
| `.t-headline` | 40 → 64px | 600 | −0.009em | 1.08 |
| `.t-title` | 21–28px | 600 | +0.007–0.011em | 1.14 |
| `.t-eyebrow` | 17 → 21px | 600 | −0.022 → +0.011em | 1.19 |
| `.t-lede` | 17 → 24px, grey with `**foreground**` phrases | 600 | +0.011em | 1.38 |
| `.t-body` (body default) | 17px | 400 | −0.022em | 1.47 |
| `.t-small` / `.t-caption` | 14px / 12px | 400 | −0.016 / −0.01em | 1.43 / 1.33 |
| `.t-stat` | 52 → 80px | 600 | −0.015em, tabular | 1 |

**Components**
- **Local nav** (`Navigation.tsx`): 52px, `rgba(251,251,253,.8)` / `rgba(22,22,23,.8)`, `saturate(1.8) blur(20px)`, hairline bottom border; memoji mark + 21px name on the left (name hidden between 1024 and 1279px so the links fit), 12px links, ΕΛ/EN, theme, and a 12px "Let's talk" pill (4 × 11px padding). Aligned to the same 71rem content column as the slides.
- **Pills** (`.kn-pill`): 17px regular, radius 980px, filled blue primary, outlined blue secondary; no chevrons. `--nav`, `--sm` and a neutral `--quiet` variant.
- **Links** (`.kn-link`): blue, underline on hover, `›` chevron that nudges 2px.
- **Tiles** (`.tile`, `.tile--lg`): 18px / 28px radius, no border, no shadow. Feature tiles carry an SF-Symbols-style line glyph, title, one line and apple.com's round **(+)** disclosure (`.kn-plus`, dark on light, light on dark).
- **Glyphs** (`ui/Glyph.tsx`): hand-drawn line icons in the spirit of SF Symbols (laptop, shield, terminal, sparkles, gear, headphones, network, copy, check, ×, +). They replace **Font Awesome, which is no longer loaded at all**. Content still names icons by the old FA class, mapped inside `Glyph`.
- **Tech specs** now has its own slide, laid out like apple.com/…/specs: 21px label column, hairline rows, official tool logos at 17px.
- **Stats**: big, plain, foreground colour, grey caption under the number; no rules, no gradient.
- **Career**: the current role is a plain tile; earlier roles and education are hairline lists with a grey `›` that turns blue on hover.
- **Devices** (`.device-*`): thin black bezel inside an aluminium edge and a flatter base; silver in light, space black in dark. No brand marks, no floor glow.
- **Dot nav** (`DotNav.tsx`): apple.com gallery dots in a small frosted pill at the bottom of the desktop track; the current dot stretches into a bar. Replaces the gradient progress line.
- **Dialogs**: no border, soft shadow, 28px radius, generous padding, section titles over hairline lists.
- **Mobile**: the iOS tab bar is removed; the frosted local nav and its full-screen menu (large 28px links, Appearance and Language) are the only chrome.

**Motion**
- Headlines and supporting blocks fade and rise 24px as a whole, 1s on apple.com's curve `cubic-bezier(0.28, 0.11, 0.32, 1)`. No per-word masks, no parallax drift, no bounce, nothing follows the pointer.
- One scroll-driven moment: the product shot scales from 0.9 and fades in as the Projects slide arrives (`ScaleIn`).
- Stats count up once. Project changes cross-fade.
- The intro is now in the current theme: memoji, "Hello.", an "Enter" pill; it fades away.
- Reduced motion: `MotionConfig reducedMotion="user"` drops transforms, the scale gate collapses to 0, and CSS zeroes transitions.

### Logo
- The memoji technologist (`public/favicons/android-chrome-512x512.png`) is the site mark, via `ui/Mark.tsx` (next/image, alt "Andreas Fragkiadakis"): 30px in the nav, as the "app icon" above the hero title (decorative there, since the name is right below it), and on the intro screen.
- The OG image (`app/opengraph-image.tsx`) was the old indigo "ANDREAS FRAGKIADAKIS" card. It is now white with the memoji embedded as a data URL, the name, "Apple fleets. Automated." and "Team Lead, Apple Fleet & IT Automation · Jamf 200 · 550+ Macs", set in Inter SemiBold fetched at build time (falls back to the default font offline).
- No "AF" monogram existed in this branch's source; none was added.

### Copy changes (EN + GR, `content.ts → keynote`)
- Nav: "Home" → "Overview" / "Επισκόπηση" (apple.com's local-nav term); new "Tech specs" / "Εργαλεία" item.
- Hero: the name is now the eyebrow, so the lede drops "I'm Andreas Fragkiadakis." and starts "I lead Apple Fleet & IT Automation at Omilia…". Removed the unused hero eyebrow and "Scroll to explore".
- New `specs` block (eyebrow, headline, sub, row labels moved from `services`).
- Gradient markers removed from every headline except the hero.

## Tokens (`src/app/globals.css`)

| Token | Light primary | Light alt | Dark primary | Dark alt | Use |
|---|---|---|---|---|---|
| `--background` | `#FFFFFF` | `#F5F5F7` | `#000000` | `#101011` | slide |
| `--surface` | `#F5F5F7` | `#FFFFFF` | `#1D1D1F` | `#1D1D1F` | tiles, pills |
| `--surface-2` | `#E8E8ED` | | `#2C2C2E` | | hover |
| `--foreground` | `#1D1D1F` | | `#F5F5F7` | | text |
| `--muted` | `#6E6E73` | | `#86868B` | | eyebrows, captions |
| `--line` | `#D2D2D7` | | `#424245` | | hairlines |
| `--accent` | `#0066CC` | | `#2997FF` | | link text |
| `--accent-fill` | `#0071E3` | | `#0071E3` | | filled pills (white text) |

**Contrast (WCAG 2.x, all AA):** `#6E6E73` on white 5.07 / on `#F5F5F7` 4.66; `#0066CC` on white 5.57 / on `#F5F5F7` 5.11; white on `#0071E3` 4.7; `#86868B` on black 5.8 / on `#101011` 5.25 / on `#1D1D1F` 4.65; `#2997FF` on black 6.96 / on `#1D1D1F` 5.58; nav links (65% foreground) 5.15 light / 7.53 dark; hero accent end stops 5.19 (light) / 6.42 (dark). `#86868B` is never used on white.

## Trade-offs

- **System font first.** On Apple devices the site renders in San Francisco (native, and what the previews show). Windows and Android get Inter with optical sizing: close, not identical.
- **Seven slides.** Giving Tech specs its own slide adds one step to the desktop track, in exchange for a services slide that is no longer "full".
- **Dialog-heavy detail** is unchanged: every slide fits 1440×900 with no inner scrolling, so the full bio, role tasks, education details and service highlights live in sheets.
- **Mobile has no tab bar.** Navigation on phones is the nav's menu button, as on apple.com.
- `typewriter-effect` is still in `package.json` but unused; no dependencies were added.

## Checks

- `npm run lint`: 0 errors, 0 warnings. `npx next build`: passes (all routes static, OG image generated).
- **Fit** (measured content bounds, between the 52px nav and the dot nav): every slide fits 1440×900 (EN and GR, both themes), 1280×720 and 1024×768.
- **Nav**: no overflow at 1024px (EN or GR).
- **Mobile (390×844)**: 0px horizontal overflow (EN and GR); the Greek hero word is set one step smaller on phones so it never touches the edges.
- **Console**: only the local 404 for `/_vercel/speed-insights/script.js`, which exists only on Vercel.

## Previews (`style-preview/`)

| Folder | Contents |
|---|---|
| `light/`, `dark/` | `desktop-1-hero` … `desktop-7-contact` (1440×900), `mobile-1…7` (390×844) |
| `extra/` | Greek hero and career (`gr-light-desktop-1/5`), Greek dark services, Greek mobile hero and menu, service / project / Greek bio dialogs, phone frame on the stage, 1280×720 career, the nav, the intro, and the new OG image |
