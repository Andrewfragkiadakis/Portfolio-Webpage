# UI/UX 2026 — Implementation Super Prompts

Nine mobile-first enhancements, specified as executable briefs. Each one is scoped against
the invariants in [`UI-UX-SUPER-PROMPT.md`](./UI-UX-SUPER-PROMPT.md) — that document wins
every conflict.

**Global constraints that apply to all nine:**

- Animate `transform` / `opacity` / `filter` only. Never `width`, `height`, `top`, `left`.
- Every effect degrades to *visible, static content* when unsupported or when
  `prefers-reduced-motion: reduce` is set. Nothing may be invisible by default.
- No high-frequency event (scroll, mousemove, deviceorientation) may drive React state.
  Use refs, CSS custom properties, or motion values.
- Feature-detect, never UA-sniff. `@supports` in CSS, `typeof x === 'function'` in TS.
- New user-facing strings need both `en` and `gr` entries in `content.ts`.
- Touch targets stay ≥ 44×44px. Nothing important becomes hover-only.

---

## 1. Native CSS scroll-driven animations

**Objective.** Move mobile reveal animations and scroll progress off the main thread onto
the compositor, using `animation-timeline: view()` / `scroll()`.

**Why.** Mobile currently pays for a Framer Motion `useScroll` subscription plus a
`scroll` listener in `MobileNav` on every frame of every scroll. Scroll-driven CSS runs on
the compositor and keeps running smoothly even when the main thread is busy.

**Do.**
- Add `.reveal-on-scroll` in `globals.css` driven by `animation-timeline: view()` with
  `animation-range: entry 10% cover 35%`, animating `opacity` + `translateY` only.
- Add a `.scroll-progress` bar driven by `animation-timeline: scroll(root block)` for the
  mobile vertical stack (desktop keeps its Framer-driven bar).
- Gate everything behind `@supports (animation-timeline: view())`. Inside the
  `@supports` block only, set the start state to hidden — so browsers without support
  never hide anything.
- Replace the active-section detection in `MobileNav` with an `IntersectionObserver`
  (`rootMargin: '-45% 0px -45% 0px'`), deleting that scroll listener's per-frame work.
  Keep a separate, cheap listener only for show/hide of the bar.

**Acceptance.** No `scroll` listener in `MobileNav` computing section offsets. Reveals
work in Chrome/Safari 26; content is fully visible in a browser without
`animation-timeline`. Reduced motion shows everything with no animation.

---

## 2. View Transitions API

**Objective.** Native, compositor-driven transitions for the project modal and the theme
toggle, replacing hand-rolled JS animation of the same moments.

**Do.**
- Add `src/utils/view-transition.ts` exporting `startViewTransition(update)`: calls
  `document.startViewTransition(update)` when available and motion is allowed, otherwise
  runs `update()` synchronously. Must never throw on unsupported browsers.
- Give the tapped project card's image `view-transition-name: project-media` while it is
  the active one, and the same name on the modal's image, so the browser morphs card →
  dialog. Only one element may carry a given name at a time — assign it on the active
  card only.
- Route the theme toggle through the same helper with a circular-reveal
  `::view-transition-new(root)` clip-path animation originating at the toggle.
- Add `@view-transition { navigation: auto }` for cross-document navigation
  (`/thesis-presentation`).

**Acceptance.** Opening a project morphs the image instead of cross-fading. Escape/close
reverses it. Zero console errors on Firefox (partial support) and with reduced motion.

---

## 3. Liquid Glass surfaces

**Objective.** A real Liquid-Glass-style material — layered blur, saturation, specular
edge highlight, and adaptive tint — on the floating navigation surfaces and the modal.

**Why.** It is Apple's 2026 system material, it is thematically exact for an Apple Fleet
lead, and almost no personal site ships a credible version of it.

**Do.**
- Add `.liquid-glass` in `globals.css`: `backdrop-filter: blur(20px) saturate(180%)`,
  a translucent tint from `color-mix(in srgb, var(--background), transparent …)`, a
  1px hairline border, and a `::before` specular highlight (a soft linear-gradient sheen
  along the top edge) plus a `::after` inner rim light.
- Correct for both themes: the tint and the sheen opacity differ in light vs dark.
- Apply to: `MobileNav` bar, desktop `Navigation` bar, `Modal` panel.
- `@supports not (backdrop-filter: blur(1px))` → fall back to a solid `var(--background)`
  surface at high opacity. Legibility never depends on the blur.

**Acceptance.** Text contrast over the glass stays ≥ 4.5:1 in both themes. No visible
seams at the border radius. Fallback path is opaque and readable.

---

## 4. "Active Grid" bento Projects (mobile)

**Objective.** Replace the mobile horizontal card rail with a bento grid whose tiles
expand *in place* on tap, matching the README's bento language.

**Do.**
- Mobile (< 1024px) only: render the projects as a 2-column bento grid with a deterministic
  size pattern (feature tiles span 2 columns) derived from index, so it is stable across
  renders and languages.
- Tap expands the tile in place — `grid-column: span 2` + revealed detail/highlights —
  routed through `startViewTransition` so the reflow is animated by the browser.
- Desktop keeps the existing horizontal rail and modal untouched. **One layout tree:**
  branch on `useIsDesktop()`, never render both.
- The expand control is a real `<button>` with `aria-expanded` and `aria-controls`.

**Acceptance.** Desktop rail behaviour is byte-identical to today. Mobile grid has no
horizontal overflow at 375px. Expansion is keyboard-operable and screen-reader-labelled.

---

## 5. Gyroscope-reactive 3D tilt

**Objective.** Project tiles that respond to *device orientation* on mobile and pointer
position on desktop — the effect most sites drop entirely on touch.

**Do.**
- Add `src/hooks/useTilt.ts`. Desktop: `pointermove` within the element. Mobile:
  `deviceorientation`, normalised against the first reading so the neutral position is
  however the user is already holding the phone.
- Write results to CSS custom properties (`--tilt-x`, `--tilt-y`) on the element. **No
  React state.** The transform lives in CSS.
- iOS 13+ requires `DeviceOrientationEvent.requestPermission()` from a user gesture.
  Do **not** prompt on load. Expose an opt-in control; if permission is absent or denied,
  silently fall back to no tilt.
- Clamp to ±8°, ease with a short CSS transition, and disable entirely under reduced motion.

**Acceptance.** No permission dialog appears unprompted. Tilt never blocks scrolling or
taps. Android and desktop both work; iOS without permission degrades to flat.

---

## 7. Signature scramble-in headings

**Objective.** Turn the existing hero LetterGlitch into a site-wide signature: section
headings decode from noise as they enter view.

**Do.**
- Add `src/components/ui/ScrambleText.tsx`: `IntersectionObserver` triggers a single
  `requestAnimationFrame` pass that resolves characters left-to-right from a glyph pool.
- The real text is always present in the DOM for screen readers; scrambling only mutates a
  visual `aria-hidden` layer. Never animate the accessible name.
- Runs **once** per element, cancels on unmount, and is a no-op under reduced motion
  (renders final text immediately).
- Apply to the section headings: About, Services, Experience, Projects, Contact.

**Acceptance.** Screen reader announces the final heading, never the noise. No layout
shift while scrambling (reserve width with the final string).

---

## 8. Swipe + momentum navigation (mobile)

**Objective.** Make mobile section-to-section movement feel like a native pager instead of
a plain document scroll.

**Do.**
- Add `src/hooks/useSwipeNavigation.ts`: raw `touchstart`/`touchmove`/`touchend` with
  velocity tracking (px/ms over the last ~100ms).
- Trigger on a horizontal-dominant swipe (|dx| > |dy| × 1.5) exceeding a distance **or**
  velocity threshold → navigate to previous/next section via the existing
  `smoothScrollToElement` helper. One source of truth for section order: `SECTION_IDS`.
- **Never call `preventDefault` on vertical movement.** Normal scrolling must stay
  completely untouched — this is an *additional* gesture, not a replacement.
- Ignore gestures that begin inside a horizontal scroller (project rail) or the modal.
- Fire a haptic tick (feature 10) on a committed swipe.

**Acceptance.** Vertical scrolling is unaffected and never janky. Swiping inside the
project rail scrolls the rail, not the page. No scroll trap at either end.

---

## 9. Animated beam / aurora hero background

**Objective.** A GPU-cheap animated backdrop behind the hero that reads as depth, not
decoration.

**Do.**
- Add `src/components/ui/BeamsBackground.tsx`: a handful of absolutely-positioned,
  blurred, rotated gradient beams animated purely with `transform` + `opacity` via CSS
  keyframes (no canvas, no rAF, no WebGL).
- Colours come from `var(--accent)` / `var(--glow)` so both themes work automatically.
- `pointer-events: none`, `aria-hidden`, sits behind hero content, must not affect the
  blob-cursor mask or the existing `LetterGlitch` layer.
- Fully static (beams visible, animation paused) under reduced motion.

**Acceptance.** No measurable main-thread cost (animation is compositor-only). Hero text
contrast unchanged. Blob cursor still masks correctly.

---

## 10. Real haptic feedback

**Objective.** Genuine tactile confirmation on mobile interactions via the Vibration API.

**Do.**
- Add `src/hooks/useHaptics.ts` exposing `tick()` (8ms), `select()` (12ms),
  `impact()` ((18ms)) — thin wrappers over `navigator.vibrate`.
- Guard: `typeof navigator !== 'undefined' && 'vibrate' in navigator`, wrapped in
  `try/catch` (some browsers throw when the page lacks user activation), and **off**
  under `prefers-reduced-motion`.
- Wire to: mobile nav taps, bento tile expand, swipe commit, theme toggle.
- iOS Safari does not implement it. The helper must be a silent no-op there — never
  a fallback CSS "fake" buzz, and never a console warning.

**Acceptance.** No errors on iOS. Android Chrome produces a short tick on nav taps.
Nothing is gated behind haptics working.

---

## Verification (all nine)

1. `npx tsc --noEmit` clean, `npm run lint` clean, `npm run build` clean.
2. Playwright pass at 375 / 768 / 1024 / 1440 in **both** themes:
   - no horizontal overflow at any width
   - no console errors
   - all six section IDs present exactly once
   - headings visible (scramble resolved) and nav operable
3. Reduced-motion pass: every section still fully visible and readable.
4. `localStorage.setItem('cinematic-entered', 'true')` before screenshotting, or the
   intro is all you will capture.
