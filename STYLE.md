# Apple Keynote

**Branch:** `style/apple-keynote`

## Concept

The portfolio as an apple.com product launch. Each panel of the desktop horizontal track is a keynote **slide**, and slides alternate between black and white **tones**. The theme only decides which tone opens the show: the dark theme starts on a black hero (black, white, black, white, black, white), and the light theme starts on white and inverts the sequence. Both themes are designed on purpose, and both have the same rhythm.

Every slide follows one grammar:

- a grey **eyebrow**;
- a huge, tight **headline** whose words rise one after another, with the signature blue-to-violet gradient on at most one word (Apple's "Pro" treatment);
- grey **copy** in Apple's lede style, where key phrases are lifted to the foreground colour;
- Apple controls: blue pill buttons, and blue links with a `›` chevron.

The imagery is real project screenshots inside **device frames drawn in CSS**: an original laptop and phone, with no brand marks. The skills are laid out as an Apple **"Tech specs"** table with official logos.

Headlines are short, punchy and taken from real content:

| Slide | EN headline | GR headline | Gradient word |
|---|---|---|---|
| Hero | Apple fleets. / Automated. | Στόλοι Apple. / Αυτοματοποιημένοι. | Automated. |
| About | Meet Andreas. | Γνωρίστε τον Ανδρέα. | the "550+" stat |
| What I do | Happens twice? / It becomes a script. (from his own "If a task happens twice, it becomes a script") | Συμβαίνει δύο φορές; / Γίνεται script. | script. |
| Career | Then. Now. | Τότε. Τώρα. | Now. |
| Projects | Selected work. | Επιλεγμένα έργα. | none: the product shot is the hero |
| Contact | Let's build / something. | Ας φτιάξουμε / κάτι μαζί. | something. / μαζί. |

## How it relates to the shortlist

| Shortlisted | What Keynote shares | Where it differs |
|---|---|---|
| **Bento Grid** | Apple product-page language: `#F5F5F7` / `#1D1D1F`, SF-style type, Apple blue, big counting stats | Bento puts a whole section into tiles. Keynote gives each slide one idea at large scale, with lots of empty space and only a few cards (the services grid). It is more cinematic and less dense. |
| **Desktop OS** | Apple-native feel | No simulated macOS UI. The Apple reference is the marketing page, not the operating system, so there are no windows or dock. |
| **Cobalt Block** | One confident accent, and bold full-bleed colour fields | The fields are black and white instead of ultramarine. The single accent is Apple blue, and it grows into the blue-to-violet gradient only on the hero word of each slide. |
| **Swiss Editorial** | One grotesk, tight tracking, hairline rules (spec table, contact row) | Swiss Editorial is quiet and paper-like. Keynote is theatrical: giant headlines, a stage glow and product shots. |

He could combine it with Bento: the Keynote hero, About and Contact slides, with Bento-style tiles for Services.

## Tokens (`src/app/globals.css`)

### Palette

Two palettes are declared once. They are applied to `:root`/`.dark` for the page, dialogs and the mobile nav, and to `[data-tone="primary" | "inverse"]` for each slide.

| Token | Light tone | Dark tone | Use |
|---|---|---|---|
| `--background` | `#FFFFFF` | `#000000` | slide |
| `--surface` | `#F5F5F7` | `#1D1D1F` | cards, pills, icon wells |
| `--surface-2` | `#E8E8ED` | `#2C2C2E` | hover, tiles |
| `--foreground` | `#1D1D1F` | `#F5F5F7` | text |
| `--muted` | `#6E6E73` | `#86868B` | eyebrows, lede, captions |
| `--line` | black 10% | white 14% | hairlines |
| `--accent` | `#0066CC` | `#2997FF` | link **text** |
| `--accent-fill` | `#0071E3` | `#0071E3` | filled pills, always with white text |
| `--grad` | `#0071E3 → #5B4BF0 → #A13FD6` | `#2997FF → #7D7AFF → #D06BFF` | one headline word per slide, the progress line, the "Now" card outline |

Dialogs use a `.kn-sheet`: white in light mode, `#1D1D1F` with raised inner surfaces in dark mode.

**Contrast (WCAG 2.x):**

| Text | Background | Ratio |
|---|---|---|
| `#1D1D1F` | white | 16.8 : 1 |
| `#6E6E73` | white / `#F5F5F7` | 5.1 / 4.7 : 1 |
| `#0066CC` | white / `#F5F5F7` | 5.6 / 5.1 : 1 |
| white | `#0071E3` | 4.7 : 1 |
| `#86868B` | `#000` / `#1D1D1F` | 5.8 / 4.65 : 1 |
| `#2997FF` | `#000` / `#1D1D1F` | 7.0 / 5.6 : 1 |
| gradient stops | their own tone | 4.7 to 7.2 : 1 (all large text) |

`#86868B` is **not** used on white (3.6 : 1). The light tone uses `#6E6E73` instead.

### Type

- The stack is `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Inter, system-ui`. Apple devices get San Francisco, including its Greek. Other devices get **Inter via `next/font/google` with the `latin` + `greek` subsets**, so Greek keeps weights 600 and 700. The font variable sits on `<html>` so the stack resolves correctly.
- `.kn-display` is 700 weight with −0.035em tracking and line-height 1.02. Sizes are fluid in `min(vw, vh)`: the hero is `min(8.6vw, 13.5vh)`, about 116px at 1440×900.
- `.kn-lede` is 600 weight in the muted grey, with `**phrase**` lifted to the foreground (`<Rich>`).
- `.kn-numeral` is 700 weight with −0.045em tracking and tabular figures, so the count-ups don't jitter.
- All new UI copy is in `content.ts → keynote` (EN and GR), written in sentence case with **fully accented Greek**. The old Greek labels were unaccented because they were designed for all-caps.

### Components

- `components/ui/keynote.tsx`:
  - `Headline` renders `*gradient*` and `\n` line breaks. Each word rises out of its own mask, and screen readers get the plain sentence.
  - `Rise`
  - `CountUp`
  - `Chevron` and `ArrowOut`
  - `Rich`
  - `TrackContext` / `useSlideOffset`, with `Parallax` and `ScaleIn`
- `components/ui/Device.tsx` provides `Laptop`, `Phone` and `ProjectShot`, which picks the frame from `project.device` (`laptop` by default, `phone` for Nexus Party App, `bare` for HappyFox, whose image is already a phone mock-up shot).
- `.kn-pill` comes in `--fill`, `--line` and `--sm` variants. The other shared classes are `.kn-link`, `.kn-icon-btn`, `.kn-card`, `.kn-glow` and `.device-*`.
- A `short:` variant (desktop and max-height 820px) hides two secondary lines, so 1280×720 also fits.

### Motion

- **Headline words** slide up in sequence (75ms stagger, `EASE_OUT`). Supporting elements fade and rise after them.
- **Stats count up** once, when they come into view.
- **Parallax driven by track progress, not the cursor.** Each slide knows its signed distance from centre (`useSlideOffset`). The stage glow lags behind (depth −0.3), headlines drift slightly (−0.05), and content columns lead (+0.03 to +0.1). At rest everything is aligned.
- **Product shots scale up** from 0.86 to 1 as the projects slide arrives (`ScaleIn`). Switching projects cross-fades the device.
- The old "breathing" scale on the track, the cursor blob, the canvas glitch, the custom cursor and the noise overlay are **removed**. Nothing follows the cursor.
- **Reduced motion:** the parallax/scale gate collapses to 0, motion's `reducedMotion="user"` drops transforms, and the CSS media query zeroes transitions. This was verified: no transforms, and every headline visible.

## Per section

1. **Hero** (title slide). Eyebrow "Apple Fleet & IT Automation", a two-line headline, a lede naming Andreas, Omilia, 550+ Macs, zero-touch and CIS, then the pills "View work ›" (filled) and "Contact ›" (outline). The slide footer shows Athens and a live clock on the left and "Scroll to explore ›" on the right. The h1 reads "Andreas Fragkiadakis — Apple fleets. Automated."
2. **About** ("Meet Andreas."). A bio in the lede style and a "Read the full story ›" link that opens a dialog with all four original description paragraphs. There are credential pills (Jamf 200 is filled and links to Credly, ITIL 4 links to the PDF, the TEE licence has no link) and four focus-area links that open the existing skill dialogs. On the right is a 2×2 stat block, each stat counting up: **550+** (gradient), **70%**, **7+ yrs** and **3** certifications.
3. **What I do**. The headline sits next to the "Have a unique project in mind? Let's talk ›" CTA. A 3×2 feature grid follows, each card with an icon, title, **new one-liner** (`service.oneLiner`, EN and GR) and "Learn more ›", opening the existing service dialog with its highlights and toolkit. Below that is **Tech specs**, a hairline table with six rows (Apple fleet, Security & identity, Infrastructure, Code, AI, Collaboration & ITSM) covering all 29 tools with their official logos. The rows come from a new `group` field in `data/tools.ts`.
4. **Career** ("Then. Now."). The **current role is the hero card**, outlined in the gradient, with its three tasks and its stack (tool logos). "Then" is a timeline rail of the six earlier roles, and each opens a role dialog with its full task list. "Education & credentials" lists all six entries with inline "Verify ↗" links, and each opens a dialog with its details. Everything fits without the old horizontally scrolling cards.
5. **Projects** ("Selected work."). A product-shot stage on a soft glow holds the selected project in a laptop frame (or a phone or bare shot). Below it are the name, year, description, "Learn more ›" (the existing dialog, now with a device shot at the top) and Visit site / View code / Report / Publication. The line-up on the right selects any of the ten projects. **On phones** the line-up becomes an accordion with the device shot inline.
6. **Contact** ("Let's build something."). A centred closing slide with "Send a message ›" (Gmail compose) and "Download résumé ›" (the same Drive link). Below is a hairline row with the email (mailto link plus Copy), location, local time and LinkedIn / GitHub, followed by the copyright.

**Chrome.**
- **Global nav:** a translucent 48px bar that takes the tone of the slide beneath it. On the left is the name. In the middle are the six slides, with the active one in the foreground colour. On the right are ΕΛ/EN, a sun/moon theme button and a blue "Let's talk" pill.
- **Mobile:** the name, ΕΛ/EN, theme and menu. The full-screen menu has large links plus Appearance and Language toggles.
- **Tab bar:** the iOS-style floating tab bar is kept on mobile.
- **Progress line:** a 2px gradient line along the bottom on desktop.
- **Intro:** the first-visit intro is now a black stage with a gradient "Hello." / "Γεια σας." and an "Enter ›" pill.

**Content corrections made while restyling (Greek only).**
- Accents were restored on titles that are now shown in sentence case: three service titles and five project names.
- The Greek bio said "άνω των 400 συσκευών". It now says 550, matching the English text and the Greek tagline.

## Trade-offs

- **Half of every theme is the opposite colour.** A dark-theme visitor still gets three white slides, and a light-theme visitor gets three black ones. That rhythm is the point of the direction, but someone who wants a fully dark page will not get one. It is a small change: dropping `[data-tone="inverse"]` gives single-tone themes.
- **System font first.** On Apple devices the site renders in San Francisco (it looks native, and the screenshots come from a Mac). Windows and Android get Inter, which is close but not identical. Brand consistency across platforms is traded for native feel on Apple devices, which is his audience.
- **Dialog-heavy detail.** For every slide to fit 1440×900 with no inner scrolling, the earlier roles' tasks, the education details and the full bio moved into dialogs. The slides show headlines, and the depth is one click away.
- **Projects show one at a time on desktop.** The product-shot stage features one project; the other nine are one click away in the line-up. That is less browsable than a card rail, but much more "launch page".
- Font Awesome is still used for service and skill icons (it was already loaded). SF Symbols can't be used on the web.
- `typewriter-effect` is no longer imported. The dependency was left in `package.json`: no new dependencies were added, and removing it is optional.

## Checks

- `npm run build` passes, and `npx eslint src` reports 0 problems.
- **Fit:** every desktop panel fits **1440×900** (EN and GR, both themes; the Greek Career slide bottoms out at 860px) and also **1280×720** with the `short:` variant.
- **Mobile (390px):** 0px horizontal overflow in EN and GR, in both themes.
- **Console:** the only error is the local 404 for `/_vercel/speed-insights/script.js`, which only exists on Vercel. It was already there before this change.

## Previews (`style-preview/`)

| Dark | Light |
|---|---|
| `dark/desktop-1-hero.jpg` … `desktop-6-contact.jpg` | `light/desktop-1-hero.jpg` … `desktop-6-contact.jpg` |
| `dark/mobile-1…5.jpg` | `light/mobile-1…5.jpg` |
| `dark/dialog-bio-gr.jpg` (Greek dialog) | `light/dialog-service.jpg`, `light/dialog-project.jpg` |
| `dark/mobile-menu-gr.jpg` | `light/projects-phone-frame.jpg` (phone frame on the stage) |
| | `light/desktop-1-hero-gr.jpg`, `light/desktop-4-experience-gr.jpg` (Greek) |
