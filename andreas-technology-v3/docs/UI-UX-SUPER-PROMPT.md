# andreas.technology — UI/UX Super Prompt

The standing quality contract for this site. Read this before changing anything visual,
interactive, or structural. Every rule here is specific to *this* codebase — not generic advice.

Derived from the `ui-ux-pro-max` design-intelligence database (v2.11.0) applied to this
project's detected stack and product type, plus a full source audit.

---

## 1. What this product is

| Dimension | Value |
|---|---|
| Product type | Personal portfolio / credibility site for an IT & Security Engineer |
| Audience | Recruiters, hiring managers, prospective freelance clients (EN + GR) |
| Stack | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · Framer Motion |
| Pattern | **Horizontal Scroll Journey** — 6 pinned sections on a 600vh sticky track (desktop); vertical stack (mobile) |
| Style | Dark Mode (OLED) primary, with a real light mode that must be equally correct |
| Type | Inter (display + body), monospace accents for the "engineer" voice |
| Goal | Communicate competence in ~30 seconds and make contact trivially easy |

**The wow factor is the horizontal journey.** Protect it. Every change must keep that
journey smooth, legible, and reversible — never sacrifice comprehension for spectacle.

---

## 2. Non-negotiable invariants

These are the things that must never regress. Treat a violation as a build failure.

1. **One layout tree at a time.** Mobile and desktop layouts must not both mount.
   Duplicate section trees mean duplicate DOM IDs, double `rAF` loops, and double canvas work.
2. **Section IDs are unique.** `hero, about, services, experience, projects, contact`
   appear exactly once in the DOM. Navigation resolves by ID.
3. **Scroll position math has one source of truth.** Desktop maps section index →
   `(index / 5) * maxScroll`. If the track length or section count changes, update
   `SECTION_COUNT` in one place — never hardcode `5` in a new file.
4. **No scroll trap.** The user must always be able to reach the end and back with a
   normal gesture. Snapping may *settle* an idle scroll; it may never fight an active one.
5. **Content is never invisible by default.** Entry animations start hidden, so any
   animation failure must degrade to visible, not blank. Respect `prefers-reduced-motion`.
6. **Bilingual parity.** Every string exists in both `en` and `gr`. No English fallback
   leaking into the Greek tree, and no layout that breaks on longer Greek words.
7. **Both themes are first-class.** Every colour comes from a CSS variable. Never hardcode
   a hex that only works in dark mode.

---

## 3. Priority ladder (fix in this order)

From the `ui-ux-pro-max` rule database, scoped to this site.

### P1 — Accessibility (CRITICAL)
- Text contrast ≥ 4.5:1 in **both** themes. `opacity-70` on a muted foreground is the usual offender.
- Every interactive element is reachable and operable by keyboard, in visual order.
- Visible focus ring on everything focusable. Never `outline-none` without a replacement.
- Anything with `onClick` is a `<button>`/`<a>` — or has `role`, `tabIndex`, and key handlers.
- Modals: `role="dialog"`, `aria-modal`, Escape closes, focus is trapped, focus returns on close.
- Icons are decorative (`aria-hidden`) and never the sole label. Icon-only controls need `aria-label`.

### P2 — Touch & Interaction (CRITICAL)
- Minimum hit target 44×44px, minimum 8px apart.
- **Nothing important may be hover-only.** Hover does not exist on touch. Any affordance
  revealed on hover must also be permanently visible on touch, or expressed as a real control.
- Every state change is animated 150–300ms. No 0ms jumps.
- Active/pressed feedback on touch (`active:` state) for every button.

### P3 — Performance (HIGH)
- No component mounts twice.
- Continuous `rAF` loops (LetterGlitch, LogoLoop) pause when off-screen or hidden.
- High-frequency events (mousemove, scroll) must not drive React state. Use motion values or refs.
- Scroll/resize listeners are `{ passive: true }` and are not re-subscribed on every event —
  watch for state in the dependency array of the effect that registers them.
- Images reserve their space. No layout shift (CLS < 0.1).

### P4 — Layout & Responsive (HIGH)
- Verify at **375 / 768 / 1024 / 1440**. 768 is the mode switch and the highest-risk width.
- No unintended horizontal overflow at any width.
- Fluid type must be clamped: bare `vw` units break at extremes. Use `clamp()`.
- Tablet (768–1024) enters desktop horizontal mode — confirm cards and nav still fit.

### P5 — Motion (MEDIUM)
- Motion conveys spatial continuity — where you came from, where you're going.
- 150–300ms for UI feedback; longer only for deliberate cinematic beats.
- Animate `transform` and `opacity` only. Never `width`/`height`/`top`/`left`.
- `prefers-reduced-motion` disables decorative motion but never hides content.

### P6 — Navigation (HIGH)
- Active section indicator must always reflect reality, including every section.
- Bottom nav ≤ 5 items.
- Nav must not overlap content — reserve space for fixed bars.

---

## 4. Site-specific gotchas

Hard-won specifics for this codebase.

- **`main` height is layout-dependent.** `h-[600vh]` is desktop-only. Mobile must be `h-auto`,
  or content overflows its own container.
- **The 600vh track and the `-500vw` transform are coupled.** 6 sections → 600vh → -500vw →
  divide progress by 5. Changing section count means changing all four numbers.
- **This repo lives on a Google Drive FUSE mount.** Cold Next compiles take minutes and
  builds may appear hung. Verify against a local mirror (`/private/tmp/...`) before
  concluding that something is broken.
- **`CinematicEntry` gates first paint** behind `localStorage.cinematic-entered`. When
  testing, set that key or you will only ever screenshot the intro.
- **Font Awesome loads from a CDN via injected `<link>`.** Icons are not guaranteed at
  first paint; never let layout depend on icon dimensions.
- **Two theme sources fight on load**: an inline script sets the class pre-hydration and
  `ThemeContext` sets it post-hydration. Keep them agreeing or the theme flashes.

---

## 5. Pre-delivery checklist

Run every item before declaring work done. No exceptions.

**Structure**
- [ ] Exactly one layout tree mounted; no duplicate section IDs
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run lint` clean
- [ ] Production build succeeds

**Desktop (1280 / 1440)**
- [ ] Horizontal journey runs start→end and back, no dead zones
- [ ] Snap settles on idle, never fights an active scroll
- [ ] Every nav item lands on the correct section
- [ ] Keyboard: Tab reaches everything, focus always visible
- [ ] Hover states smooth (150–300ms), cursor is `pointer` on clickables

**Mobile (375) / Tablet (768)**
- [ ] No horizontal overflow
- [ ] Fixed nav overlaps nothing
- [ ] All hit targets ≥ 44px
- [ ] Every hover-revealed affordance is visible without hover
- [ ] Card carousels scroll and snap cleanly

**Cross-cutting**
- [ ] Light and dark both pass contrast
- [ ] EN and GR both fit their layouts
- [ ] `prefers-reduced-motion` respected, content still visible
- [ ] No console errors or warnings

---

## 6. Working method

1. Read this file.
2. Reproduce the issue in the browser at the real breakpoint — do not fix from imagination.
3. Change one concern at a time.
4. Re-verify at 375 / 768 / 1280.
5. Re-run the checklist.
