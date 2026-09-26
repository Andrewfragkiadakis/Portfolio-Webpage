# Desktop OS v2

**Branch:** `style/desktop-os-v2` (builds on `style/desktop-os`)

## Concept

The portfolio is a Mac. It suits someone who runs a fleet of 550+ Macs. v1 was macOS-*inspired*. v2 aims to feel native.

- There is a real menu bar with real menus.
- Windows can be dragged, raised, zoomed, minimised into the Dock and closed.
- The Dock magnifies under the pointer and bounces when you launch an app.
- The icons, type, focus rings and motion follow the platform.

The horizontal journey is kept: each section is a desktop space. Phones still get a vertical stack of sheets.

Nothing is Apple artwork. There is no Apple logo, and no Apple app icon is copied. All app icons, glyphs and the wallpaper are drawn from scratch in this repo. Tool logos in the toolkit marquee are left alone, because they name tools.

## Round 4: polish, performance, macOS extras

Asked for: "more polishing, more performance fixes, and visual enhancements", and the memoji instead of an "AF" logo.

### Performance (measured, then fixed, then re-measured)

Method: `next build` + `next start` on port 3191 (the untouched round-3 commit built from a `git archive` copy on 3192 for the baseline), Chrome via Playwright at 1440×900, **CPU throttled 4×** to make main-thread cost visible. Load = median of 5 cold loads. Interactions = rAF frame sampler + CDP `Performance.getMetrics`, average of two passes per build and two runs per side. Component renders are counted with a React DevTools-style commit hook. Scripts: `scratchpad/cap/perf-r4.js`, `renders-r4.js`, `trace-r4.js`, `recalc-r4.js`, `paintflash-r4.js`.

| Scenario (4× CPU) | Before | After |
| --- | --- | --- |
| **Scroll across the spaces**: frames > 25 ms / p95 frame / script | 32 / 33 ms / 0.49 s | **14 / 17 ms / 0.21 s** |
| Scroll: React components re-rendered | 3,762 | **178** (−95%) |
| **Drag a window**: first-frame stall / janky frames | ~96 ms / 3 | **~62 ms / 1** |
| Drag: components re-rendered on grab | 372 | **34** |
| Drag: style recalc from the grab/release class | 30 / 22 ms (4×); 7.6 ms per toggle unthrottled | **0 ms** (no root class) |
| **Minimise + restore**: worst frame / janky frames | ~54 ms / 1.8 | **17 ms / 0** |
| Minimise + restore: components re-rendered | 1,124 | **57** |
| Dock hover sweep: janky frames / layouts | 0 / 200 | 0 / **179** (no layout reads per move) |
| Idle on the Desktop space | 0 commits | 0 commits (typing loop now pauses off-space) |
| Load: JS transferred (gzip) | 280.0 KB | 282.6 KB (+2.6 KB: Control Center, Mission Control, notification) |
| Load: images | 32.1 KB | 45.2 KB (+13 KB memoji, two pre-cropped WebPs) |
| Load: TBT (4×) / LCP (4×) | 115–121 ms / 0.71–1.08 s | 104–130 ms / 0.72–0.74 s (noise-level) |

What was wrong, and the fix:

1. **Every window-manager change re-rendered the whole page.** `DesktopContext` was one context value holding `active`, `keyId`, `stack`, `status`…; every section consumed it, so focusing a window or crossing a space re-rendered ~1,100 components (every icon, card and chip). It is now a tiny external store (`useSyncExternalStore`) with **selectors** (`useDesktopState(s => s.status.about)`) plus a **stable actions context** (`useDesktopActions()`). Focusing a window re-renders the window frames and the menu bar, never the content. `AppIcon`, `Icon` and `LocalTime` are `memo`ised.
2. **A class on `<html>` for the whole drag.** `html.is-dragging-window *{user-select:none}` restyled all ~3,000 elements at grab and release (30 ms + 22 ms at 4×). Replaced by a `selectstart` listener for the duration of the drag.
3. **The key-window shadow animated a 64 px blur.** `box-shadow` transitioned on every focus change (repaint of the full window area for 280 ms). The extra depth now lives on a pseudo-element of the new `.os-win` frame and only fades its **opacity**; the window is promoted to its own layer (`will-change: transform`) only while dragged.
4. **Dock magnification read layout on every pointer move** (`getBoundingClientRect()` ×10 per move, interleaved with the springs' size writes). Resting icon centres are now measured once when the pointer enters; the falloff is a cosine curve and the spring is critically damped (no overshoot), 48 → 72 px.
5. **Off-screen work.** The Terminal's typing loop kept re-laying out a translucent window on other spaces; it now runs only while the Desktop space is in front. The `animate-ping` status dot (a style recalc every frame) is a still dot, and the terminal cursor blinks in hard steps like Terminal.app.
6. **A full-screen `backdrop-filter` behind dialogs** (Quick Look, service sheets) re-blurred the page on every frame of the fade. It is now a light scrim with no blur.

Not changed, deliberately: Inter/JetBrains are still not preloaded (Apple devices use SF, 0 KB of fonts on the Mac). Greek content still ships in the main bundle (~14 KB gzip); lazy-loading it is possible but would move the Greek copy out of `content.ts`, which every branch shares.

### Polish

- **Traffic lights:** only the three buttons are "no-drag" now. In compact title bars the lights' grid cell used to swallow the left third of the bar, so grabbing a window there did nothing.
- **Key window:** when a window is hidden, the frontmost open window on the same space becomes key (it used to leave none).
- **Window open spring** settles with less bounce (`bounce .08`), closer to a macOS window appearing.
- **Selection colour** is the macOS highlight (`#B3D7FF` light, `#3F638B` dark).
- **Scrollbars:** only the page's own (journey-driving) scrollbar is hidden. Inner scroll areas keep the platform's overlay scrollbars on macOS, with a thin quiet thumb elsewhere (`.os-scroll`). Before, every scrollbar on the site was removed.
- **Dock:** larger plate radius, running dots as a component style, divider as a token.

### Visual enhancements (three, kept quiet)

- **Control Center** menu extra (two-switch glyph) replaces the loose sun/moon button: Dark Mode and Language toggles as round knobs on vibrancy modules, and a wide **Focus** module ("Open to Opportunities") that opens Mail. Esc or a click outside closes it; EN/GR.
- **Notification banner**, once per browser: "Jamf 200 certified", sliding in from the right edge under the menu bar (spring), the certificate icon, "now", a close button on hover/focus as on macOS, auto-dismiss after 9 s unless hovered. Links to the Credly credential. Announced politely to screen readers.
- **Mission Control** (Window ▸ Mission Control, **F3** or **⌃↑**): the journey zooms out into a 3 × 2 grid of the six spaces. The thumbnails are the live panels themselves, scaled on one spring (`ov` 0 → 1, written straight to motion values: no React render per frame), each on a miniature of the wallpaper, over a dimmed desktop. Click, Enter or Space picks a space and it zooms back in; arrows move between spaces; Esc or a click on the background returns. The page cannot scroll underneath; the track is `inert` while it is open. Desktop only; instant under reduced motion.

### Logo: the memoji replaces "AF"

`public/avatar/memoji-peek.webp` (288 px, 10 KB) and `memoji-face.webp` (72 px, 3 KB) are crops of the existing `favicons/android-chrome-512x512.png`, **cut above the laptop so its Apple logo never shows**. `Avatar` (in `AppIcon.tsx`) draws them in a circle on a soft neutral plate, like a macOS user picture, with `alt="Andreas Fragkiadakis"`.

- **Menu bar:** the head crop at 18 px where the Apple menu sits (the owner menu: About Andreas, Résumé, LinkedIn, GitHub).
- **Welcome window** 64 px, **About sidebar** 52 px, **Mail contact card** 48 px.
- **Boot screen:** a login-window-style 96 px picture with the name under it, instead of the "AF" wordmark.
- **Open Graph image:** redrawn in the site's language (wallpaper gradient, white card, the memoji as a data URL read at build time, name, role, "Jamf 200 · Apple fleet of 550+ Macs · Athens"). `MonogramIcon` is gone; no "AF" logo remains anywhere.

### Keyboard

Esc closes menus, Control Center, Mission Control and dialogs. F3 / ⌃↑ toggles Mission Control. **⌘W and ⌘M are not bound:** Chrome and Safari reserve them (close tab, minimise the browser) and a page cannot intercept them, so the menus do not advertise shortcuts that would not work.

### Round 4 files

- **New:** `src/components/ui/ControlCenter.tsx`, `src/components/ui/Notification.tsx`, `src/components/ui/MissionControl.tsx`, `public/avatar/memoji-peek.{webp,png}` and `memoji-face.webp` (the PNG crop feeds the OG image).
- **Rewritten:** `src/contexts/DesktopContext.tsx` (store + selectors + stable actions, `overview`), `src/components/dom/Dock.tsx`, `src/app/opengraph-image.tsx`.
- **Adjusted:** `Window.tsx` (selectors, `.os-win` shadow frame, drag layer, `selectstart`), `HorizontalLayout.tsx` (`Space` panels with the overview transform, dim layer), `Navigation.tsx` (memoji owner menu, Control Center, Mission Control item), `HeroOverlay.tsx`, `About.tsx`, `Contact.tsx`, `CinematicEntry.tsx`, `Projects.tsx`, `Services.tsx`, `Finder.tsx`, `MobileNav.tsx`, `Modal.tsx`, `AppIcon.tsx` (`Avatar`), `Icon.tsx`, `LocalTime.tsx`, `utils/motion.ts`, `globals.css`, `content.ts` (`os.controlCenter`, `os.notification`, `os.missionControl`, `os.menu.missionControl`, EN and GR).

### Round 4 previews

In `scratchpad/r4/desktop-os-v2/` (`light/`, `dark/`, `extra/`): Mission Control (mid-zoom and settled, both themes, and the space picked), Control Center (EN/GR, both themes), the notification (and its hover close), the owner and Window menus, a dragged Terminal overlapping the inactive Welcome window, traffic-light glyphs, Dock magnification, genie mid-flight and the minimised hint, Quick Look, the boot screen, Greek hero/About, and phones (EN/GR; no horizontal overflow at 390 px).

## Owner feedback → what changed

| Asked for | v2 |
| --- | --- |
| "Look more like Apple macOS" | **Opaque windows** with **vibrancy sidebars** (the wallpaper glows through them) replace v1's all-glass windows. Other changes: a **unified 52px toolbar** with a bold left-aligned title and a subtitle ("6 items"); **0.5px separators**; a **key window** with a deeper shadow; **inactive windows** that grey their traffic lights and dim their title; Finder source lists and path bars; a Mail compose layout; Quick Look dialogs. |
| "Similar icons" | **Original Big Sur-style app icons** (`AppIcon.tsx`). Each is a superellipse squircle (n = 5) with a two-stop gradient, a soft top highlight, a hairline rim, a drop shadow and one simple glyph. The set covers: a display with a tiny wallpaper (Desktop/Welcome), a contact card (About), sliders (What I Do), a briefcase (Experience), a system-blue folder (Projects), a paper plane (Mail/Contact) and a `>_` prompt (Terminal). There are also GitHub and LinkedIn tiles, a **PDF document** icon (Résumé) and a **certificate with a ribbon seal** (Jamf 200). |
| "Integrate a moving-windows feature" | A small **window manager** (`DesktopContext.tsx`). It covers dragging by the title bar, z-order, the key window, zoom, genie-style minimise, close to the Dock, Restore All, and resets on resize. See *Interactions*. |
| "New fonts and icons" | **System font first**, so Apple devices render **SF Pro** (text and display optical sizes, with Greek). Inter (latin + greek) is the fallback everywhere else. Mono is `ui-monospace` / SF Mono / Menlo, with JetBrains Mono as the fallback. **Font Awesome is gone** (one fewer third-party CSS request). The UI uses ~30 original **SF-Symbols-like line icons** (`Icon.tsx`: 24-unit grid, one 1.5 stroke, round caps). |
| "Animations more polished and macOS" | Every motion value is new: spring window opening, a genie-ish minimise into the Dock icon and back out, pointer-driven Dock magnification (inside the Dock only), a launch bounce, 120ms menu fades, a spring zoom and a spring for Quick Look. Everything is instant under `prefers-reduced-motion`. |
| Taste: clean, no gimmicks | v1's **rotated stickers are removed**, and the Terminal is no longer tilted: macOS never rotates a window. No pointer-following effect exists outside the Dock, where magnification is platform behaviour. The wallpaper is static. |

## Tokens

### Palette

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--foreground` | `#1D1D1F` | `#F5F5F7` | label |
| `--muted` | `#5C5C62` | `#A1A1A8` | secondary label |
| `--accent-brand` | `#007AFF` | `#0A84FF` | system blue as a **mark** (bullets, rails, source-list glyphs, timeline dot) |
| `--accent` | `#0058D6` | `#58A6FF` | blue as **text** (links, chip text, eyebrow accents) |
| `--accent-top` → `--accent-bottom` | `#106EF2 → #0060D8` | `#1873E6 → #0A5CC8` | push-button gradient (white text) |
| `--accent-fill` | `#0762DD` | `#1168D7` | menu highlight, selection pill |
| `--focus-ring` | `#3B8CFF` | `#3E8EFF` | 3px macOS focus halo |
| `--window-bg` | `#FFFFFF` | `#1F1F22` | window content (opaque) |
| `--window-chrome` / `--statusbar` | `#F6F6F7` | `#2A2A2E` / `#252528` | unified toolbar, status and path bars |
| `--sidebar` | `rgba(236,234,242,.74)` + `blur(40px) saturate(190%)` | `rgba(46,44,54,.62)` + same | vibrancy sidebars |
| `--card` | `#F5F5F7` | white @ 5% | inset cards |
| `--hairline` / `--hairline-strong` | black @ 10% / 16% | white @ 9% / 15% | 0.5px separators |
| `--menubar` | `rgba(246,246,250,.62)` + blur 40 | `rgba(20,20,26,.5)` + blur 40 | 24px menu bar |
| `--menu-bg` | `rgba(240,240,244,.82)` + blur 40 | `rgba(38,38,44,.8)` + blur 40 | dropdown menus, Dock labels |
| `--dock-bg` | white @ 30% + blur 30 | `rgba(36,36,44,.38)` + blur 30 | Dock |
| `--hud` | `rgba(252,252,254,.78)` | `rgba(34,34,40,.78)` | Now widget, window hints, phone launcher |
| Traffic lights | close `#FF5F57`, minimise `#FEBC2E`, zoom `#28C840`; inactive `#D6D6DA` | inactive `#4C4C52` | with ×, − and + glyphs in darker inks |
| `--shadow-key` / `--shadow-inactive` | 0.5px rim + 26/64 + 8/18 blur / 0.5px rim + 12/32 + 3/8 | deeper, plus a 0.5px light inner rim | the key window casts the deeper shadow |
| Wallpaper | peach, pink, lilac, periwinkle and sky folds on `#F9E4DA → #E6DDF6 → #CFE2F6` | plum, violet, indigo and teal folds on `#120D2E → #161A48 → #0A1B33` | original SVG (`Wallpaper.tsx`), four folded bands with soft shadows and an edge sheen; no image download |

**Contrast (WCAG 2.x).** These values are measured, not computed from tokens. `.research/contrast.js` hides each text and screenshots the real rendered background, including vibrancy over the wallpaper and translucent chips. `.research/contrast.py` then composites the text colour over every sampled pixel. Each value is the 5th-percentile ratio.

| Text | On | Light | Dark |
| --- | --- | --- | --- |
| ink | window | 16.8 | 15.1 |
| muted | window / status bar / card | 6.6 / 6.2 / 6.1 | 6.4 / 6.0 / 5.6 |
| muted | vibrancy sidebar | 6.3 | 5.0 |
| ink | vibrancy sidebar | 14.8 | 13.5 |
| subtitle ("6 items") | toolbar | 6.2 | 5.6 |
| accent text | window / card | 5.7 | 5.7 |
| accent chip (Jamf 200) | tinted chip | 5.3 | 5.3 |
| white | push button (gradient) | 4.9 | 4.9 |
| menu bar items / clock | translucent bar | 13.0 / 13.3 | 13.0 / 12.4 |
| menu item | open menu | 13.6 | 13.2 |
| desktop icon labels | wallpaper | 10.6–12.4 | 10.5–15.6 |
| Now widget label / accent | HUD glass | 5.5 / 5.8 | 4.9 / 6.2 |
| terminal dim / inactive title | terminal | 5.3 / 4.6 | 6.3 / 4.7 |
| LIVE / OSS tags | tinted tags | 5.3 / 5.9 | 5.3 / 5.1 |
| focus ring (non-text, ≥ 3) | white / toolbar | 3.3 / 3.0 | 5.0 |

### Type

- **UI stack:** `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", <Inter>, sans-serif`. On Apple devices this is SF Pro with automatic Text/Display optical sizes. Elsewhere it is Inter from `next/font/google` with `subsets: ['latin', 'greek']`. Inter is **not preloaded** (`preload: false`), because Apple devices never request it.
- **Mono stack:** `ui-monospace, "SF Mono", SFMono-Regular, Menlo, <JetBrains Mono>, monospace`. JetBrains Mono also comes from `next/font` with latin and greek.
- **Sizes and weights, following macOS:**
  - 13px UI text (the body default), 11px labels (source-list headings, status and path bars, subtitles).
  - Window titles are bold: 15px in unified toolbars and 13px in compact bars (Welcome, Terminal, Quick Look).
  - Large titles are 700 with −0.022em tracking: 24–28px in About, 26–32px in Mail, and 46–68px for the hero name.
  - Menu bar: 13px/500, with the front app's name in bold.
- **Greek was verified** with Chrome DevTools `CSS.getPlatformFontsForNode` on macOS. The Greek h1 (700), window titles (700), bold menu-bar app name (700) and chips (500) all render in **`.SF NS`**, the system SF Pro, at the requested weight. Terminal mono renders in Menlo. The unaccented Greek labels from the content file stay uppercase in Greek only (`.caps-gr`), as in v1.

### Shape

- Windows have a 12px radius and a 0.5px rim. Dark windows also get a light inner rim, drawn above the content. App icons are superellipse squircles, and document and certificate icons are paper shapes.
- Buttons are capsules: push buttons are 28px, and CTAs are 36–40px. Segmented controls are 8px with a raised white segment. Toolbar buttons are borderless 28px plates that show on hover. Chips are capsule "tokens".
- Menus are 9px with 5px items. Items are 24px tall, and the highlight fills in system blue with white text. Separators are 1px hairlines.

## Interactions (window manager)

State lives in `DesktopContext` (`stack`, `keyId`, `status`, `zoomed`, `layoutEpoch`, `bounce`, `projectsView`). Each `Window` registers `minimize / close / restore / toggleZoom` handlers. That way the traffic lights, menu items, Dock and hints all run the same animated code.

- **Drag** works on desktop only (≥ 64rem with a `(pointer: fine)` mouse or pen; touch is ignored).
  - Press on the title bar, or the sidebar's top strip, and drag. It uses pointer events with `setPointerCapture`.
  - The window is clamped so the whole window stays on the visible desktop of its space: inside its panel, below the menu bar and above the Dock.
  - Buttons, links and segmented controls inside the title bar never start a drag (`data-no-drag`).
  - While dragging, a `selectstart` listener blocks text selection (Round 4: no class on `<html>`, which restyled the whole page). Content text stays selectable.
  - Wheel and trackpad scrolling of the horizontal journey is untouched.
- **Z-order and key window:** pressing or focusing anything in a window raises it (`zIndex = 10 + stack index`) and makes it **key**. The menu bar's bold item names the key window's app ("Terminal", "Finder", "Mail", "Timeline"…).
  - Inactive windows grey their lights (they colour again on hover) and cast the lighter shadow.
  - Travelling to another space makes that space's window key. Clicking bare desktop leaves no window key, and the menu bar then says "Finder".
- **Zoom:** the green light, a double-click on the title bar, or *Window ▸ Zoom*. The window springs (`visualDuration .34`) to fill the desktop between the menu bar and the Dock. It steers the frame's layout position frame by frame, so zoom works in flex and grid parents alike. Zooming again returns the window to its previous spot.
- **Minimise:** the yellow light, *Window ▸ Minimize*, or *App ▸ Hide*. It is a **genie-ish** 0.52s keyframe path into the app's Dock icon:
  1. The width pinches toward the icon first.
  2. Then the window pours down, scaling to the icon's size and fading at the very end.
  3. Restoring plays the reverse path from wherever the icon is now.
- **Close:** the red light, *File ▸ Close Window*, or *App ▸ Quit*. The window fades and scales out in 0.16s. The Dock's running dot for that app disappears.
- **Nothing is lost.**
  - A hidden window leaves a small HUD in its place ("About.app is closed · Reopen"). Keyboard focus moves onto its *Reopen* button, and reopening focuses the window.
  - The app's **Dock icon** restores the window (with a launch bounce). If the window is on another space, it travels there first.
  - ***Window ▸ Restore All*** reopens every hidden window. The Window menu also lists every window: ✓ marks the key window and ◆ a minimised one.
  - Hidden windows are `inert` and `visibility: hidden`. They stay in the DOM (and in SSR HTML), so their state is kept.
  - Resizing the viewport resets positions and zoom (`layoutEpoch`). Leaving the desktop layout reopens everything, because phones have no Dock.
- **Menus.** The menu bar has these menus:
  - **Owner menu** (the memoji, where the Apple menu sits): About Andreas, Download Résumé…, LinkedIn ↗, GitHub ↗
  - **App (bold):** About This Portfolio, Hide *App*, Quit *App*
  - **File:** New Message…, Download Résumé…, Close Window
  - **View:** as Icons / as List (drives the Projects view), Toggle Appearance, Switch to Greek or English
  - **Go:** the six spaces, with ✓ on the current one
  - **Window:** Minimize, Zoom, Restore All, and the window list

  A menu opens on click. While one is open, hovering another title switches to it, as on macOS. Keyboard support follows the ARIA menubar pattern: ↓ / Enter / Space open a menu and focus its first item, ↑ ↓ Home End move within it, ← → move between menus, and Esc closes the menu and returns focus to its title. Menu items are 24px tall.
- **Status items:** an input-source badge (EN/ΕΛ), **Control Center** (Round 4; it replaces the sun/moon toggle), and the clock in macOS format ("Sat 26 Sep 18:45", Athens time, localised in Greek).
- **Keyboard.** Windows are reached in DOM order. In split windows the traffic lights come first in the DOM but are drawn on the sidebar. The order is lights → title → toolbar → sidebar → content.
  - Tabbing into a window on another space brings that space to the front. It never scrolls the clipped track sideways.
  - Traffic lights are real `<button>`s named "Close — About.app", "Minimize — Welcome", and so on. Each light's focus ring hugs its circle.
  - The dialog's red light is its close button, as in v1.

## Motion

| What | How |
| --- | --- |
| Window open | `opacity 0 → 1`, `scale 0.92 → 1`, spring `{ visualDuration: 0.35, bounce: 0.14 }`. It plays on reveal: the hero after the boot screen, the other windows when their space comes into view. |
| Minimise / restore | 0.52s keyframes, `cubic-bezier(.5,0,.25,1)`. The width pinches first, then the window moves down into the icon. Restore plays the reverse path (0.5s). |
| Close / reopen | 0.16s fade and scale to 0.96. Reopening uses the window-open spring. |
| Zoom | a size and position spring, `visualDuration .34`, `bounce .06` |
| Dock | Icons go from 48px to 66px based on pointer distance (reach 140px), through a spring (`mass .1, stiffness 180, damping 15`). This happens **only while the pointer is in the Dock**. The launch bounce is `y: 0 → −20 → 0 → −9 → 0` over 0.9s with ease-out on the way up and ease-in on the way down. |
| Menus | 120ms fade with a 4px slide on open, 100ms fade on close |
| Dialogs (Quick Look) | the window-open spring, with a 0.16s close |
| Wallpaper | static (subtle by design; see trade-offs) |
| Reduced motion | Every variant switches to `duration: 0`: windows, genie, close, zoom, menus and dialogs. Dock magnification and bounce are off. Motion still honours `MotionConfig reducedMotion="user"` and the global reduced-motion CSS. It was verified by script: minimise hides the window instantly. |

## Per-section changes (v1 → v2)

| Section | v2 |
| --- | --- |
| Chrome | 24px translucent **menu bar** with real menus, replacing v1's list of section buttons. Status items as above. **Dock:** 7 apps (the six spaces plus Terminal), a divider, then GitHub, LinkedIn and a PDF document for the Résumé. It has running dots, labels, magnification and bounce. The blur on the menu bar and the Dock sits on a `::before`, so their menus and labels can blur the page themselves. Nested `backdrop-filter`s otherwise lose their blur. |
| Boot | A black startup screen with the owner's **memoji user picture and name** (Round 4; was an AF monogram), a thin progress bar, the same typed log (small, grey, mono) and a white "Enter System" capsule. |
| Hero | The Welcome window (compact title bar) has the memoji user picture (Round 4; was an AF squircle), the status token, the name as a large title, the role, the tagline, credential tokens, capsule CTAs and round social buttons. The **Terminal** is a dark "Pro"-profile window, now draggable and not rotated. The **Now** widget is a Sonoma-style HUD. **Desktop icons** are a PDF document, a certificate and two app tiles, with labels that turn into the blue selection pill on focus. The **stickers are removed**. |
| About | A split window. The vibrancy sidebar holds the identity, the current focus, "Get Info" key/value rows and the `engineer.ts` pane (tall viewports only). The main pane has the large-title tagline, paragraphs, credential tokens and four skill cards with squircle glyph tiles. Skill detail is now actually clamped: v1's `md:block` overrode the clamp. The status strip keeps the tools marquee. |
| What I Do | A Finder window with a Favorites source list (blue line glyphs), unified title "Services — Finder / 6 items", six service cards with squircle tiles, and a path bar with the "Let's Talk" CTA. |
| Experience | A Timeline window. The toolbar has a segmented control (Professional / Education) and borderless ‹ › buttons. The rail, dots, date tokens and Verify Credential buttons are kept. |
| Projects | A Finder window with a source list. The toolbar has an Icons / List segmented control, which is also driven by *View ▸ as Icons / as List*. The icon view is a thumbnail grid with selection-pill labels. The list view has a header row, zebra rows and borderless link buttons. Quick Look is the dialog. The path bar includes "View Full Portfolio on GitHub". |
| Contact | A Mail compose window with a Send capsule in the toolbar, right-aligned *To:* and *Subject:* labels, 0.5px field separators, a large-title status line, a mono signature, Send and Download capsules, and an inspector-style contact card. |
| Mobile | This is the stacked sheets from v1, with the new chrome. The status bar shows the Desktop icon, clock, EN/ΕΛ, appearance and a launcher. Windows show their app icon beside the title; there are no traffic lights and no dragging. The phone dock and the home-screen launcher use the new icons. There is no horizontal overflow at 390px. |

## Files

- **New:**
  - `src/contexts/DesktopContext.tsx` (window manager)
  - `src/components/ui/AppIcon.tsx` (squircle app icons, `GlyphTile`, `Avatar` (Round 4, replaces `MonogramIcon`), PDF and certificate art)
  - `src/components/ui/Icon.tsx` (line-icon set, plus `symbolFor()` mapping the content file's legacy glyph names)
  - `src/components/ui/Finder.tsx` (source list, path bar)
  - `src/components/ui/Wallpaper.tsx`
- **Rewritten:**
  - `src/components/ui/Window.tsx` (drag, z-order, key state, zoom, genie, close, hints, split layout, real traffic lights)
  - `src/components/dom/Navigation.tsx` (menu bar with menus; phone status bar and launcher)
  - `src/components/dom/Dock.tsx`
  - `src/app/globals.css` (v2 tokens and components; the marquee and tool-tile rules are kept)
  - `src/data/apps.ts` (window and app ids, tints, title helpers)
- **Adjusted:**
  - `layout.tsx` (system font stack, no Font Awesome, wallpaper component, theme colours)
  - `page.tsx` (`DesktopProvider`)
  - `HorizontalLayout.tsx` (`data-panel`, a desktop click deactivates windows, focus travel between spaces)
  - `useActiveSection.ts` (`readActiveSection`)
  - `HeroOverlay`, `About`, `Services`, `Experience`, `Projects`, `Contact`, `Modal`, `CinematicEntry`, `CredentialChips`, `CopyButton`, `LocalTime` (menu-bar date format), `ThemeToggle` (`useToggleAppearance`), `MobileNav`, `utils/motion.ts` (`WINDOW_SPRING`, `MENU_TRANSITION`)
- **Content:** `content.ts` gains `os.menu`, `os.windowActions`, `os.hidden`, `os.apps` and `os.clock` **in both languages**. No existing copy was removed.
- **Scripts** (untracked, in `.research/`):
  - `interact.js`: drag, constraint, z-order, zoom, genie, Restore All, resize reset, menus, keyboard, reduced motion, Greek fonts, mobile. It also writes `style-preview/extra/`.
  - `keyboard.js`: tab travel across spaces.
  - `contrast.js` and `contrast.py`: measured contrast.
  - `quick.js`: fit per panel.

## Trade-offs

- **Opaque windows cost less GPU than v1.** `backdrop-filter` is now used only on sidebars, the menu bar, the Dock, menus, the Terminal and HUDs.
- **Only the text-bearing areas are vibrancy.** Content panes are opaque, as on macOS, so body text never sits on a moving blur.
- **The genie is approximate.** CSS transforms cannot warp a surface, so the window pinches (scaleX) before it pours (y, scaleY), with split timing. At 0.5s it reads as the genie. A true mesh warp would need WebGL.
- **Windows cannot leave their space.** Dragging is clamped to the visible desktop of the window's own panel, so the horizontal journey stays coherent. On macOS you can push a window partly off-screen.
- **Hidden windows leave a hint card.** macOS leaves empty desktop. Here a visitor could otherwise lose the section without knowing the Dock restores it. The hint is quiet, on HUD glass, and it is also where keyboard focus lands.
- **Traffic lights are 12px at a 20px pitch,** true to macOS. Each is a 20×20 button, and every action also exists in the Window, File and App menus with 24px items. That covers the equivalent-control exception of WCAG 2.5.8.
- **Menus are the real macOS set** (File, View, Go, Window) rather than a list of section names. Navigation is one more click in the menu bar. The Dock (always visible, labelled) and *Go* carry it.
- **The wallpaper is static.** Animating it would re-render every backdrop blur on every frame, and macOS wallpapers are still unless dynamic.
- **Terminal output and app names stay in English** in both languages (software names), as in v1.
- **`/_vercel/speed-insights/script.js` 404s on a local `next start`.** This is pre-existing and only exists on Vercel. It is the only console error.
- **Fit.** Every desktop panel fits 1440×900 without inner scrolling, checked by script. A `short:` variant (≤ 52rem tall) tightens About and Experience, so 1280×800 fits too.

## Previews

Light, desktop 1440×900:

| | |
| --- | --- |
| ![Hero](style-preview/light/desktop-1-hero.jpg) | ![About](style-preview/light/desktop-2-about.jpg) |
| ![Services](style-preview/light/desktop-3-services.jpg) | ![Experience](style-preview/light/desktop-4-experience.jpg) |
| ![Projects](style-preview/light/desktop-5-projects.jpg) | ![Contact](style-preview/light/desktop-6-contact.jpg) |

Dark, desktop:

| | |
| --- | --- |
| ![Hero dark](style-preview/dark/desktop-1-hero.jpg) | ![About dark](style-preview/dark/desktop-2-about.jpg) |
| ![Services dark](style-preview/dark/desktop-3-services.jpg) | ![Experience dark](style-preview/dark/desktop-4-experience.jpg) |
| ![Projects dark](style-preview/dark/desktop-5-projects.jpg) | ![Contact dark](style-preview/dark/desktop-6-contact.jpg) |

Mobile 390×844 (light / dark):

| | | | | |
| --- | --- | --- | --- | --- |
| ![m1](style-preview/light/mobile-1.jpg) | ![m2](style-preview/light/mobile-2.jpg) | ![m3](style-preview/light/mobile-3.jpg) | ![m4](style-preview/light/mobile-4.jpg) | ![m5](style-preview/light/mobile-5.jpg) |
| ![d1](style-preview/dark/mobile-1.jpg) | ![d2](style-preview/dark/mobile-2.jpg) | ![d3](style-preview/dark/mobile-3.jpg) | ![d4](style-preview/dark/mobile-4.jpg) | ![d5](style-preview/dark/mobile-5.jpg) |

Window manager (from `.research/interact.js`):

| | |
| --- | --- |
| ![Terminal dragged over Welcome, now key](style-preview/extra/drag-terminal-light.jpg) | ![Zoomed Welcome](style-preview/extra/zoom-welcome-light.jpg) |
| ![Genie minimise, mid-flight](style-preview/extra/minimize-genie-mid-light.jpg) | ![Minimised: hint + Dock](style-preview/extra/minimized-welcome-light.jpg) |
| ![Restoring out of the Dock (icon bouncing)](style-preview/extra/restore-genie-mid-light.jpg) | ![About closed + Window menu with Restore All](style-preview/extra/menu-window-light.jpg) |
| ![Dock magnification](style-preview/extra/dock-magnify-light.jpg) | ![Traffic-light glyphs on hover](style-preview/extra/lights-hover-light.jpg) ![Focus ring on a light](style-preview/extra/focus-ring-light.jpg) |

Menus, dialogs, Greek, boot:

| | |
| --- | --- |
| ![Go menu (dark)](style-preview/extra/menu-go-dark.jpg) | ![Owner menu (dark, round 2 capture)](style-preview/extra/menu-af-dark.jpg) |
| ![Quick Look (dark)](style-preview/extra/quicklook-dark.jpg) | ![Service dialog](style-preview/extra/service-dialog-light.jpg) |
| ![Projects list view](style-preview/extra/projects-list-light.jpg) | ![Restore All result](style-preview/extra/restore-all-light.jpg) |
| ![Greek hero](style-preview/extra/greek-hero-light.jpg) | ![Greek Window menu](style-preview/extra/greek-menu-window-light.jpg) |
| ![Greek services (dark)](style-preview/extra/greek-services-dark.jpg) | ![Greek contact (dark)](style-preview/extra/greek-contact-dark.jpg) |
| ![Boot](style-preview/extra/boot.jpg) | ![Phone launcher](style-preview/extra/mobile-launcher-light.jpg) ![Greek phone hero](style-preview/extra/greek-mobile-hero-light.jpg) |
