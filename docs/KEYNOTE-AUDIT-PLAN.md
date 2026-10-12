# Apple Keynote launch: audit and execution plan

**Site:** andreas.technology (Next.js 16, React 19, Tailwind 4, Motion 12; deployed on Vercel from `main`)
**Design chosen:** Apple Keynote (`style/apple-keynote`, the build that was on localhost:3001)
**Audit date:** 2026-10-12, against `style/apple-keynote` at commit `478acbd`
**Executor:** Claude Sonnet in Claude Code, working through this file phase by phase
**Owner:** Andreas Fragkiadakis

This document has three parts:

1. **Sections 0–4:** what to do, in what order, and how to know it worked.
2. **Section 5:** the phased task list. Each task names its files, gives the change (with code where the change is not obvious) and says how to verify it.
3. **Appendices:**
   - **A:** the content audit, with exact replacement copy in EN and GR.
   - **B:** the motion and runtime-performance audit, with reference code.
   - **C:** an index of every finding ID and the task that covers it.

The audit combined four parallel code reviews (bugs/architecture, UI/UX/accessibility, motion/performance, content) with measurements in a real browser: Playwright Chromium, Lighthouse 12, 20 viewport/theme/language combinations, keyboard runs, throttled phone probes and no-JS runs. The two most serious bugs (keyboard focus desynchronising the track, and the dark-theme flash) were found independently by two reviewers.

---

## 0. Rules for the executor

1. **Work on the release branch only.** Never commit to `main` or to any `style/*` branch. The other four designs (`style/bento-grid-v2`, `style/desktop-os-v2`, `style/swiss-cobalt`, `style/swiss-editorial`) are parked on GitHub on purpose. Leave them untouched.
2. **One phase at a time, in order.** Later phases assume the earlier ones are done. Inside a phase, tasks can be done in the order listed.
3. **Find code by the quoted snippet, not by line number.** Line numbers in this file and the appendices refer to commit `478acbd`. Earlier phases will move them.
4. **Run the gate at the end of every phase.** From `andreas-technology-v3/`, run `npm run check` (defined in task 0.3). Do not start the next phase with a red gate.
5. **Commit after each task or small group of tasks.**
   - Message format: `<area>: <what changed>`, for example `scroll: replace JS settle with native snap`.
   - End every message with: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`
6. **Never invent facts.**
   - Content changes come from Appendix A and the Decisions table (Section 3).
   - Anything marked **OWNER** that has no decision recorded stays as it is. Add it to `docs/OWNER-TODO.md` instead.
7. **Ask Andreas before:**
   - deleting anything in `public/`;
   - pushing;
   - merging to `main`;
   - changing anything on Vercel.
8. **Overrides take precedence.** Where Section 5 contradicts an appendix, Section 5 wins. The appendices are reference material; Section 5 is the plan. Known overrides are listed at the top of each appendix.
9. **Keep the code style.**
   - 4-space indentation in TS/TSX, single quotes in TS, double quotes in `content.ts` strings, comments only where the code needs them.
   - Prefer CSS over JS and transform/opacity over layout properties.

---

## 1. Where things stand

### 1.1 Branches

| Branch | Commit | What it is |
|---|---|---|
| `main` | `7fd1906` | Production (andreas.technology) |
| `style/apple-keynote` | `478acbd` | Chosen design = `main` + 14 commits (fast-forwardable) |
| `style/bento-grid-v2`, `style/desktop-os-v2`, `style/swiss-cobalt`, `style/swiss-editorial` | various | Parked alternatives; keep as is |
| `review` | `1f40096` | Friends' rating page for the five designs; keep |

Local review checkouts of all five designs exist as git worktrees in `C:\Users\Andrew\pf-review\<name>`. They are cleaned up in Phase 11.

### 1.2 Measured baseline (production build, `next start`)

| Metric | Today | Notes |
|---|---|---|
| Lighthouse mobile, first visit | **Perf 85–90**, A11y 93, BP 96, SEO 100 | LCP **3.7–3.8 s**: the intro memoji, render delay 3.2 s (88% of LCP) |
| Lighthouse desktop | Perf 100, A11y 93, BP 96, SEO 100 | LCP 0.8 s |
| Returning visitor, phone (4x CPU, slow 4G) | LCP **4.4–4.6 s** | The hero is server-rendered at `opacity:0` and waits for hydration plus a 1 s fade |
| Returning visitor, desktop | LCP 1.65 s (FCP 0.14 s) | Same cause |
| Initial JS | **228–274 KiB gzip** across 11 scripts | Both languages' content (23.6 KB gz) is in the client bundle; 66 KiB unused |
| Fonts | 103 KB Inter preloaded on every device | Apple devices never use it (system font comes first) |
| CLS | 0 in EN; **0.022 for Greek visitors** | The page renders in English, then swaps to Greek |
| Theme | Light-theme visitors see a **dark flash (~120–400 ms) on every load** | `ThemeContext` initial state is `'dark'` |
| Desktop scroll | 60 fps at 1440×900 (headless); p95 33 ms at 1920/2560 | Track `translateX` is written from JS every frame |
| Desktop keyboard | ArrowDown rubber-bands; ArrowLeft/Right do nothing; Tab desyncs the track | See P3 |
| Phone overflow | 0 px horizontal overflow at every width in EN and GR | Fine |
| Touch targets (390 px) | "Read the full story" 149×25, "Let's talk" 80×25, credential pills ×32, Verify links 43×16, ΕΛ 32×32, theme 36×36, menu 40×40 | Below 44×44 |
| Console | Only the expected local 404 for `/_vercel/speed-insights/script.js` | Fine on Vercel |
| No-JS | Blank page: the intro overlay covers everything and 31 elements are server-rendered at `opacity:0`; Career, Projects and Contact are not in the HTML | |
| Blocked site data | **The whole app crashes** ("This page couldn't load") | Unguarded `localStorage` |

### 1.3 Keep these (they already work)

- Layout fits 1440×900, 1280×720 and 1024×768 in EN and GR. There is no horizontal overflow on phones.
- The modal focus trap, Escape and focus return work. The z-index stack is sound.
- Strict TypeScript passes, lint has 1 warning, and there are no hydration warnings.
- The only `will-change` is on the track, and the page has 10–11 compositor layers.
- `MotionConfig reducedMotion="user"` is in place, and every listener and timer is cleaned up.
- The type scale, colour tokens and component language in `STYLE.md`: the design itself is not being changed, only finished.

---

## 2. Targets (definition of done)

| Metric | Target | How measured |
|---|---|---|
| Lighthouse mobile performance | **≥ 98** (median of 5) | `npx -y lighthouse@12.8.2` (Appendix C) |
| Lighthouse accessibility / best practices / SEO | **100 / 100 / 100** | same |
| Mobile LCP (Lighthouse and the 4x phone probe) | **< 1.8 s** | same; e2e LCP probe |
| Desktop LCP | **< 0.6 s** | same |
| CLS (EN and GR, light and dark) | **< 0.02** | e2e |
| TBT (mobile) | **< 100 ms** | Lighthouse |
| INP proxy: language switch, dialog open (4x CPU) | **< 100 ms** | DevTools / e2e Event Timing |
| Initial JS (gzip) | **≤ 150 KiB** (stretch ≤ 120) | `npm run size` (task 0.3) |
| Theme class changes after the head script on load | **0** | e2e |
| Layouts during a 3-slide desktop sweep | **≤ 5** | DevTools Performance |
| Main-thread work per scroll frame on desktop | **< 4 ms** at 4x CPU | DevTools Performance |
| Wheel notch / ArrowDown / ArrowRight / horizontal swipe | **each moves exactly one slide** | e2e + hardware checklist |
| Keyboard Tab through the whole desktop site | **The visible slide always matches the focus; the nav and dots agree** | e2e |
| No-JS | **Every section readable; no overlay** | e2e (JS disabled) |
| Blocked storage | **The site works** | e2e |
| Touch targets on touch layouts | **≥ 44×44** (≥ 24×24 on desktop) | e2e |
| Greek | **Server-rendered at `/el`, `lang="el"`, no English flash** | e2e + curl |

---

## 3. Decisions for Andreas (edit before handing to Sonnet)

Sonnet applies the **Decision** column. Change it here if you disagree. Items with "needs facts" stay untouched until you fill in the fact.

| # | Question | Decision | Alternatives |
|---|---|---|---|
| D1 | First-visit "Hello / Enter" intro gate | **Remove it.** It is the LCP element (3.7 s mobile), it blocks recruiters with a click, and the hero already has a staged entrance. | Keep it as a stateless CSS overlay that auto-dismisses (Appendix B, MOTION-06) |
| D2 | Greek language | **Real URLs: `/` = English, `/el` = Greek**, server-rendered, with hreflang. The toggle becomes a link. The stored preference redirects `/` → `/el`. | Keep the client toggle with a "hide until Greek" stopgap (worse SEO, still a flash risk) |
| D3 | Desktop scroll engine | **Native CSS scroll snap** (one snap per wheel notch, trackpad inertia stays native, interruptible). | Keep the JS settle but make it cancellable (BUG-07) |
| D4 | iPads and touch laptops in tablet mode | **Vertical layout.** The horizontal track only runs with a fine pointer, hover, width ≥ 64rem and height ≥ 40rem. | Width-only (today) |
| D5 | Résumé button | **Self-host** at `public/files/andreas-fragkiadakis-cv.pdf` once you provide an updated PDF. **Until then, hide the button.** The current Drive CV says "student", lacks the Team Lead role and Jamf 200, and shows your phone number. | Keep the Drive link |
| D6 | About stats | **550+ · 70% · 6+ yrs · 95%+ SLA.** "7+ yrs" does not match a 2020 start, and "3 certifications" counts a LinkedIn course while the pills beside it show 2 certifications plus a licence. | Keep 7+ and 3 if you have pre-2020 IT experience to add |
| D7 | LLM research project | **Reframe it as a research review** (CONTENT-04). You are not on the paper's author list (Trott, Jones, Chang, Michaelov, Bergen). | Remove the project |
| D8 | SRH Heidelberg entry | **"Erasmus+ exchange semester, M.Sc. Applied Computer Science"**, not "Master of Science" (CONTENT-05) | — |
| D9 | Omilia security stack in the experience bullets (EDR, SIEM, NAC, hypervisors, iLO, AnyDesk, HID) | **Sanitise** (CONTENT-33): it reads as a reconnaissance map of your employer. | Keep the vendor names |
| D10 | Contact line "Open to full-time roles and freelance projects" while employed | **Keep** (CONTENT-25 wording) | Remove "full-time roles"; add "in Athens or remote" |
| D11 | Overlapping dates (Omilia roles, army service, Keep Eat Healthy, Anemomyloi) — O-1…O-4 | **Needs facts.** Leave as is and list in `docs/OWNER-TODO.md`. | — |
| D12 | Tool label for xAI | **"Grok Bot"** (you asked for this). Ignore CONTENT-43's rename. | "Grok" |
| D13 | Vercel preview deployments of the parked `style/*` branches | **Hide them:** turn on Vercel Deployment Protection for previews, or add an Ignored Build Step for `style/*`. You do this in the Vercel dashboard. | Leave public preview URLs |
| D14 | Project order | **By relevance** (CONTENT-32): Signature Craft, Portfolio, Thesis, Raspberry Pi, Plano Plus, Schiller, LLM review, Nexus, Silence Hero, HappyFox, Wheelchair | Keep the current order |
| D15 | "Send a message" | **`mailto:`** with a localised subject (works with any mail app) | Gmail web compose (today) |
| D16 | Unused images in `public/` | **Delete after confirmation:** `portfolio-website/portfolio-site.png`, `portfolio-site-2025.png`, `research-llms-human-knowledge/Do Large Language Models Know What Humans Know.png`, `NexusPartyApp/Screenshot.png`, `NexusPartyApp/Square screenshot.png`, `public/images/favicons/*`, `public/CNAME`. **Never delete** `email-signature-icons/`, `Email Signature Icons/` or `QR Codes/`: email signatures hot-link them from the live site. | Keep all |
| D17 | `style-preview/` screenshots (3.2 MB) and `STYLE.md` | **Move `STYLE.md` to `docs/DESIGN.md`** (updated in Phase 10). **Drop `style-preview/` from the release**; it stays in the `style/apple-keynote` history. | Keep both |
| D18 | Fleet-wide "Jamf 200 certified" first-visit notification, contact extras (vCard, QR) | **Not in scope** | Phase 8 optional items |

---

## 4. Phase overview

| Phase | Theme | Main outcome | Risk |
|---|---|---|---|
| **P0** | Setup and safety net | Release branch, e2e harness, `npm run check`, size and perf scripts, baseline recorded | low |
| **P1** | Content truth (EN + GR) | Every fact consistent and true; copy tightened; the Decisions applied | low |
| **P2** | Critical correctness | No crash with blocked storage, no theme flash, menu and modals behave, all sections in the server HTML | low |
| **P3** | Scroll engine and navigation | Native snap; keyboard, trackpad and mouse feel native; Tab never desyncs; deep links; one active-slide source | **medium** |
| **P4** | First paint and reveals | Hero visible at first paint, no intro gate, CSS reveals, no-JS works, fonts not preloaded, motion tokens | medium |
| **P5** | Architecture and scalability | `/` + `/el` routes, one-locale payloads, content split and cleaned, slide registry, LazyMotion | **high** (largest refactor; commit before starting) |
| **P6** | Motion polish ("fly") | Compositor-driven track, springy sheets with drag, crossfading stage, transform-only micro-interactions | medium |
| **P7** | Sizing and responsive | Desktop gate, short and huge screens, phone nav, Greek widths, scrollbars, truncation | medium |
| **P8** | Accessibility and UX polish | WCAG 2.2 AA clean, 44 px targets, localised labels, contact flow, gallery paddles | low |
| **P9** | SEO, metadata, security, assets | Correct titles/OG/JSON-LD per locale, security headers, AVIF, lean images | low |
| **P10** | Repo hygiene, docs, CI | Dead code and deps gone, README/DESIGN updated, CI on PRs | low |
| **P11** | Final verification and launch | Full matrix green, owner hardware check, fast-forward `main`, deploy, clean up | — |


---

## 5. Phased tasks

Notation:
- **Covers** lists the finding IDs (Appendix C) that a task closes.
- **Verify** is what must be true before committing. Encode each "e2e" check as a Playwright test in the named spec file, so it keeps guarding the behaviour.
- All paths are relative to `andreas-technology-v3/` unless they start with the repo root.

---

### P0: Setup and safety net

#### 0.1 Create the release branch
In `C:\Users\Andrew\Portfolio-Webpage`:
```bash
git fetch origin
git switch -c release/keynote origin/style/apple-keynote
cd andreas-technology-v3 && npm ci
```
Before you start, stop the review servers still running from the audit (ports 3001 and 3011, started from `C:\Users\Andrew\pf-review\...`). PowerShell:
```powershell
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'pf-review' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```
Use `npm run dev` (port 3000) from now on.

#### 0.2 Playwright e2e harness
- Install: `npm i -D @playwright/test@1.56.1`. Chromium 1194 is already installed in `%LOCALAPPDATA%\ms-playwright`; if it is missing, run `npx playwright install chromium`.
- Add `playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    reporter: [['list']],
    use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure' },
    webServer: {
        command: 'npm run build && npm run start -- -p 3100',
        url: 'http://localhost:3100',
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
    },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
        { name: 'phone', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
    ],
})
```
- Add `e2e/helpers.ts` with:
  - `prime(page, { theme?, lang?, blockStorage? })`, which uses `page.addInitScript` to set `localStorage` and, with `blockStorage`, to make `localStorage` throw. Use: `Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError') } })`.
  - `slideIndexVisible(page)`, which returns the index of the `.slide` whose `getBoundingClientRect().left` is closest to 0.
  - `activeDot(page)`, which returns the index of the DotNav button with `aria-current`.
  - `collectConsoleErrors(page)`, which ignores `/_vercel/` URLs.
- Add `.gitignore` entries `test-results/` and `playwright-report/`.
- Write the **baseline specs now**. They must pass today:
  - `e2e/smoke.spec.ts`: the page returns 200; there are no console errors; `document.documentElement.scrollWidth === clientWidth` on phone.
  - `e2e/fit.spec.ts`, desktop: for each of the 7 slides, at 1440×900, 1280×720 and 1024×768, in EN and GR, content is between the nav bottom (52 px) and the DotNav top minus 8 px. Port the logic from `C:\Users\Andrew\AppData\Local\Temp\claude\audit-ux\audit.mjs` (`fit` mode) if that folder still exists. Otherwise, measure the bounding boxes of `section h1, h2, h3, p, li, a, button, img` within the visible slide.

#### 0.3 Scripts
Add to `package.json`:
```json
"typecheck": "tsc --noEmit",
"e2e": "playwright test",
"size": "node scripts/bundle-size.mjs",
"check": "npm run lint && npm run typecheck && npm run e2e && npm run size"
```
Create `scripts/bundle-size.mjs`:
- For every `.html` under `.next/server/app/` (recursive), collect the `<script src="/_next/static/chunks/*.js">` URLs.
- Gzip each referenced file (level 9) and print the total KiB per HTML file.
- Exit with code 1 if any page exceeds `BUDGET_KIB` (env var, default `300` now). Lower it to `150` at the end of P5.

#### 0.4 Record the baseline
Run Lighthouse (Appendix C commands) and `npm run size`, then write the numbers into `docs/perf-log.md` as a table with columns *date, commit, LH mobile perf, mobile LCP, desktop LCP, TBT, CLS, initial JS KiB*. Add a row at the end of each phase from P2 onwards.

**Gate:** `npm run check` is green. Commit: `chore: add e2e harness, size budget and perf log`.

---

### P1: Content truth (EN + GR)

All of P1 is data. Appendix A gives the exact replacement copy. Apply it in this order, with these decisions:

| Order | Apply | Notes |
|---|---|---|
| 1 | CONTENT-01, -03, -05 (D8), -06, -08 | Wrong facts. CONTENT-06's new screenshot is done in P9 (task 9.6); for now only change the copy. |
| 2 | CONTENT-02 + CONTENT-09 (D6) | `About.tsx` stat values and the `keynote.about.stats` captions. Also fix the `STYLE.md` sentence (it moves in P10 anyway). |
| 3 | CONTENT-04 (D7) | Research project reframed as a review |
| 4 | CONTENT-10, -11, -17, -18, -19, -20, -21, -22, -23, -24, -26, -28, -29, -30 | Copy and naming |
| 5 | CONTENT-25 (D10), CONTENT-32 (D14 reorder, EN and GR identical order), CONTENT-33 (D9 sanitise) | |
| 6 | CONTENT-34, -36, -37, -38, -39, -40, -44, -45 | Polish |

Rules:
- **Not in P1:**
  - CONTENT-07 (résumé) is D5, done in P8.
  - CONTENT-12/13/14/15 (metadata) are done in P9.
  - CONTENT-16 (SSR) is done in P2.
  - CONTENT-27 (mailto) is done in P8.
  - CONTENT-31 (README) is done in P10.
  - CONTENT-35 (labels) is done in P8.
  - CONTENT-41 (alt text) is done in P8.
  - CONTENT-42 (dead fields) is done in P5.
  - CONTENT-43: skip it, per D12.
  - CONTENT-46/47/48 are owner items or covered elsewhere.
- **Typography:** EN copy uses curly apostrophes (’) except the brand "Let's Encrypt". `zero‑touch` keeps U+2011. Greek uses «», `;` as the question mark, and no tonos on all-caps text.
- **Brand renames are type-checked:** renaming a tool label in `tools.ts` requires the same rename in both `tools:` arrays in `content.ts` (for example "Checkpoint Harmony EDR" → "Check Point Harmony Endpoint", "DUO MFA" → "Duo MFA").
- **Owner items:** add each **OWNER** item from Appendix A (O-1…O-13) with no decision in Section 3 to `docs/OWNER-TODO.md`, one line each with the question.

**Verify:**
- `npm run typecheck`.
- From `src/data`, `grep -nE "400\+|AXELOS|Checkpoint Harmony|PCI-DSS|ERASMUS|DUO MFA|Anydesk|GPA|measurably|stunning" content.ts tools.ts` returns nothing.
- EN and GR arrays have equal lengths for `projects`, `experience`, `education` and `services`. Add `e2e/content.spec.ts`, which imports `content` and asserts this.
- Visual pass at 1440×900 and 390×844: no new wrapping overflow on Career (titles at most 2 lines) or Projects (stage caption at most 2 lines).

Commit per row of the table.

---

### P2: Critical correctness

#### 2.1 Never crash on blocked storage
**Covers:** BUG-01, ARCH-08.

- Create `src/utils/storage.ts`:
```ts
/** localStorage throws (SecurityError) when site data is blocked or inside sandboxed frames. */
export function readStorage(key: string): string | null {
    try { return window.localStorage.getItem(key) } catch { return null }
}

export function writeStorage(key: string, value: string): void {
    try { window.localStorage.setItem(key, value) } catch { /* blocked: the preference lasts for this page only */ }
}
```
- Replace every direct `localStorage.getItem/setItem` in `src/` with these helpers (LanguageContext, ThemeContext, CinematicEntry). The `<head>` scripts already use try/catch.
- Add `src/app/global-error.tsx`: a client component with its own `<html lang="en"><body>`, the site name, one sentence and a **Reload** pill (`kn-pill kn-pill--fill`) that calls `reset()`.

**Verify:** `e2e/storage.spec.ts` with `prime(page, { blockStorage: true })`. The hero headline is visible and there are no page errors.

#### 2.2 Theme: no flash, follow the OS until the visitor chooses
**Covers:** BUG-03, UX-07, MOTION-01, MOTION-12, UX-15.

Replace `src/contexts/ThemeContext.tsx` with:
```tsx
'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { readStorage, writeStorage } from '@/utils/storage'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    /** Pass the click point to reveal the new theme as a circle growing from it. */
    setTheme: (theme: Theme, origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// The <head> script paints the first theme before React loads. After that the <html>
// class is the single source of truth and paint() is its only writer.
const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } }
const getSnapshot = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
const getServerSnapshot = (): Theme => 'light'

function paint(theme: Theme) {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    root.style.colorScheme = theme
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff'))
    listeners.forEach((listener) => listener())
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const follow = (e: MediaQueryListEvent) => { if (!readStorage('theme')) paint(e.matches ? 'dark' : 'light') }
        mq.addEventListener('change', follow)
        return () => mq.removeEventListener('change', follow)
    }, [])

    const setTheme = useCallback((next: Theme, origin?: { x: number; y: number }) => {
        const commit = () => { writeStorage('theme', next); paint(next) }
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!origin || reduce || typeof document.startViewTransition !== 'function') { commit(); return }
        const { x, y } = origin
        const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
        document.startViewTransition(() => flushSync(commit)).ready.then(() => {
            document.documentElement.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
            )
        }).catch(() => { /* skipped: the theme is already applied */ })
    }, [])

    const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within a ThemeProvider')
    return context
}
```
Also:
- Delete the `.theme-transition` rules in `globals.css` (around lines 134–140).
- Delete `other: { 'theme-color': … }` in `layout.tsx` metadata.
- Replace the two hand-written `<meta name="theme-color">` tags with `export const viewport: Viewport = { themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }, { media: '(prefers-color-scheme: dark)', color: '#000000' }] }`.
- In the theme head script, drop the time-of-day branch (`(prefers-color-scheme: light)` matches whenever no preference is set, so it is dead): `t = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')`.

**Verify:** `e2e/theme.spec.ts`. A `MutationObserver` (installed via `addInitScript`) on `<html class>` records:
- for stored light: **no `dark` ever**;
- for no stored theme: `localStorage.theme` is still `null` after load, and `page.emulateMedia({ colorScheme: 'dark' })` flips the class live;
- the toggle persists after a reload.

#### 2.3 All sections in the server HTML
**Covers:** BUG-04 (parts 1–2), PERF-07, UX-20, CONTENT-16.

- `MainContent.tsx`: `import HorizontalLayout from '@/components/HorizontalLayout'` (no `dynamic`).
- `HorizontalLayout.tsx`:
  - Add `'use client'` as line 1.
  - Import `Experience`, `Projects` and `Contact` statically.
  - Remove the three `<Suspense>` wrappers, `SectionFallback`, and the `dynamic`/`Suspense` imports.
  - Hoist the `sections` array to a module-level `const SECTIONS = [...]` (its elements take no props).
- `page.tsx`: remove the `<Suspense>` wrapper and `MainFallback`.

**Verify:**
- `curl -s localhost:3100 | grep -c 'id="contact"'` prints 1.
- The HTML contains no `BAILOUT_TO_CLIENT_SIDE_RENDERING`.
- There are no hydration warnings in the console.
- `LocalTime` renders a placeholder on the server; confirm it does not warn.

#### 2.4 Modal robustness
**Covers:** BUG-12, UX-13, MOTION-07 (click-through part).

In `src/components/ui/Modal.tsx`:
- Use `useEffectEvent` (React 19.2) for `onClose`, so the effect depends only on `[open]`: `const requestClose = useEffectEvent(() => onClose())`. Use it for Escape and the scrim click.
- Lock scrolling on `document.documentElement.style.overflow` (save and restore the previous value), not on `body`.
- While open, set `inert` on `document.querySelector('header')` and `document.getElementById('main-content')`. Remove it in cleanup.
- Restore focus with `lastFocused.current?.focus({ preventScroll: true })`.
- Delete `pb-[env(safe-area-inset-bottom)]` from the panel class (UX-06). It overrides callers' `py-10`/`py-12`, and `env()` is 0 here. P8 adds safe-area padding properly.
- **Click-through after close:** wrap the dialog layer in a component using `useIsPresent()`, and set `pointerEvents: 'none'` on it while `!isPresent` (Appendix B MOTION-07 `Layer`).

**Verify:** `e2e/modal.spec.ts`:
- Open the project dialog, Tab to "Visit site", resize the viewport by 10 px: focus stays on "Visit site".
- After Escape, a click on the page within 300 ms reaches the page.
- Every dialog panel's computed `padding-bottom` is ≥ 40 px.

#### 2.5 The phone menu is a real modal
**Covers:** BUG-09, A11Y-02.

In the `menuOpen` effect in `Navigation.tsx`:
- Set `inert` on `#main-content`.
- Lock `document.documentElement.style.overflow` (save and restore it).
- Close the menu when `matchMedia(DESKTOP_MEDIA_QUERY)` starts matching. The listener must be removed in cleanup.
- Label the menu `<nav>` with a new copy key `k.nav.menu` ("Menu" / "Μενού"), not `k.nav.openMenu`.

**Verify:** `e2e/menu.spec.ts` (phone):
- Tab from the last menu item never lands inside `#main-content`.
- A wheel or touch scroll does not change `scrollY` while the menu is open.
- Resizing to 1440 removes the menu from the DOM.

**Gate and perf-log row.**

---

### P3: Scroll engine and navigation

This phase replaces the JS settle with native CSS scroll snap (D3) and makes position math come from one module.

#### 3.1 One definition of "desktop"
**Covers:** SIZE-03, BUG-16, ARCH-08 (query literal).

The horizontal track should run only where it is pleasant: a large, fine-pointer, hover-capable screen (D4).
- In `src/app/globals.css`, after the Tailwind import and theme block, add:
```css
/* Desktop = big enough AND mouse/trackpad. Tablets, touch laptops and short windows get the vertical stack. */
@custom-variant md (@media (min-width: 64rem) and (min-height: 40rem) and (hover: hover) and (pointer: fine));
@custom-variant stack (@media not all and (min-width: 64rem) and (min-height: 40rem) and (hover: hover) and (pointer: fine));
```
  The audit verified with the installed Tailwind 4.3.3 that `@custom-variant md` overrides the built-in `md` and keeps its sort position before `lg`/`xl`.
- `src/hooks/useIsDesktop.ts`: `export const DESKTOP_MEDIA_QUERY = '(min-width: 64rem) and (min-height: 40rem) and (hover: hover) and (pointer: fine)'`. Update the doc comment.
- Replace every hand-written breakpoint query in `globals.css` with the variant, so the definition lives in one place. Tailwind 4 documents `@variant` **nested inside a rule**, so rewrite each rule like this:
  - Before: `@media (min-width: 64rem) { .foo { a: b } }`
  - After: `.foo { @variant md { a: b } }`
  - Use `@variant stack` for `@media (max-width: 63.99rem)`.
  - For the tablet rule (`max-width: 63.99rem` combined with `min-width: 40rem`): `.foo { @variant stack { @media (min-width: 40rem) { … } } }`.
  - Check the compiled CSS (`.next/static/chunks/*.css`) for `(hover:hover)` to confirm the variant expanded. If a nested form does not compile, write the full media query out instead.
- Search `src/` for `max-md:` and `'(min-width: 64rem)'`. Replace them with `stack:` and `DESKTOP_MEDIA_QUERY` respectively (`Navigation.tsx` has a literal around line 37).

**Verify:**
- Desktop 1440×900: the track works.
- Playwright `devices['iPad Pro 11 landscape']` (touch): vertical stack, Services gallery present, no horizontal track.
- Desktop at 1280×600: vertical stack.
- Emulated width 1023.9 px: no "dead zone" styles (BUG-16).

#### 3.2 Track geometry module
**Covers:** ARCH-04, BUG-08 (helpers), UX-05 (helper).

Replace `src/utils/smooth-scroll.ts` with `src/utils/track.ts`, and update the imports (Navigation, DotNav, HeroOverlay, Services):
```ts
import { SECTION_IDS, SECTION_STEPS, type SectionId } from '@/data/sections'
import { isDesktopViewport } from '@/hooks/useIsDesktop'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Desktop: the slide's snap marker inside the runway. Stack: the section itself (scroll-margin clears the nav). */
function anchorOf(index: number): HTMLElement | null {
    return isDesktopViewport()
        ? document.querySelector<HTMLElement>(`[data-snap="${index}"]`)
        : document.getElementById(SECTION_IDS[index])
}

/** Resolves when the scroll has settled: `scrollend` where supported, a timeout otherwise. */
export function scrollSettled(timeoutMs = 1000): Promise<void> {
    return new Promise((resolve) => {
        let timer = 0
        const done = () => { window.clearTimeout(timer); window.removeEventListener('scrollend', done); resolve() }
        timer = window.setTimeout(done, timeoutMs)
        window.addEventListener('scrollend', done, { once: true })
    })
}

/** Native, snap-aware and interruptible: any wheel or touch input takes over immediately. */
export function scrollToSection(index: number, { instant = false } = {}): Promise<void> {
    const anchor = anchorOf(Math.max(0, Math.min(SECTION_STEPS, index)))
    if (!anchor) return Promise.resolve()
    const behavior: ScrollBehavior = instant || prefersReducedMotion() ? 'instant' : 'smooth'
    anchor.scrollIntoView({ behavior, block: 'start' })
    return behavior === 'instant' ? Promise.resolve() : scrollSettled()
}

export function currentSectionIndex(): number {
    if (isDesktopViewport()) {
        const runway = document.querySelector<HTMLElement>('[data-runway]')
        if (!runway) return 0
        const travel = runway.offsetHeight - window.innerHeight
        const progress = travel > 0 ? (window.scrollY - runway.offsetTop) / travel : 0
        return Math.max(0, Math.min(SECTION_STEPS, Math.round(progress * SECTION_STEPS)))
    }
    const line = window.innerHeight / 3
    let index = 0
    SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) index = i
    })
    return index
}

export function stepSection(direction: 1 | -1): Promise<void> {
    return scrollToSection(currentSectionIndex() + direction)
}

/** Move keyboard and screen-reader focus to a section's heading after navigating to it. */
export function focusSection(id: SectionId): void {
    const heading = document.getElementById(`${id}-title`)
    if (!heading) return
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
}
```
- Call sites change from `scrollToSection(index, id)` to `scrollToSection(index)`.
- Confirm that every section's heading has `id="<sectionId>-title"`. `SlideHeader`, `HeroOverlay` (`hero-title`), About and Contact already do; add any that are missing.
- Add `[tabindex="-1"]:focus { outline: none; }` to `globals.css`.

#### 3.3 Native snap on desktop
**Covers:** MOTION-02, UX-02, BUG-07, UX Top-10 #1.

In `HorizontalLayout.tsx`:
- Give the runway `<div>` (the one with `--track-height`) the attribute `data-runway`. It already has `relative`.
- Inside the runway, before the sticky child, render the snap markers:
```tsx
{SECTION_IDS.map((id, i) => (
    <span key={id} data-snap={i} aria-hidden="true" className="kn-snap" style={{ top: `${i * 100}vh` }} />
))}
```
- Delete:
  - `SNAP_DEADZONE`, `SNAP_VELOCITY_CEILING`, `SNAP_IDLE_MS`;
  - `useVelocity`, `isSnappingRef`, `setSnapping`;
  - the settle effect;
  - the resize re-align effect. Browsers re-snap after a resize.

In `globals.css`:
```css
html { @variant md { scroll-snap-type: y mandatory; overscroll-behavior-x: none; } }
.kn-snap {
    display: none;
    @variant md { display: block; position: absolute; left: 0; width: 1px; height: 100vh; scroll-snap-align: start; pointer-events: none; }
}
section[id] { @variant stack { scroll-margin-top: var(--nav-h); } }
```
Leave `scroll-snap-stop` at `normal`.

**Verify (e2e `scroll.spec.ts`, desktop):**
- `keyboard.press('ArrowDown')` moves exactly one slide (`scrollY` = 900 after settling); `ArrowUp` returns to 0.
- `PageDown` moves one slide; `End` lands on Contact.
- With `emulateMedia({ reducedMotion: 'reduce' })`, a wheel of 400 px ends on an integer slide.
- After `scrollToSection(6)` from the DotNav, a wheel of −600 px within 200 ms is honoured: the final slide is not Contact.

**Hardware (owner, P11):**
- A Windows mouse notch moves one slide.
- A Mac trackpad fling lands on a slide with native inertia and no second glide.

#### 3.4 Arrow keys and horizontal swipes
**Covers:** UX-03, MOTION-03.

Create `src/hooks/useDeckGestures.ts`:
```ts
'use client'
import { useEffect } from 'react'
import { DESKTOP_MEDIA_QUERY } from '@/hooks/useIsDesktop'
import { stepSection } from '@/utils/track'

const blocked = (target: EventTarget | null) =>
    !!document.querySelector('[role="dialog"][aria-modal="true"]') ||
    (target instanceof Element && !!target.closest('input, textarea, select, [contenteditable="true"], .kn-gallery'))

/** ←/→ and a sideways two-finger swipe move one slide on the desktop track. */
export function useDeckGestures(): void {
    useEffect(() => {
        const mq = window.matchMedia(DESKTOP_MEDIA_QUERY)
        const onKey = (e: KeyboardEvent) => {
            if (!mq.matches || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || blocked(e.target)) return
            if (e.key === 'ArrowRight') { e.preventDefault(); void stepSection(1) }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); void stepSection(-1) }
        }
        let accumulated = 0
        let locked = false
        let idle = 0
        const onWheel = (e: WheelEvent) => {
            if (!mq.matches || Math.abs(e.deltaX) <= Math.abs(e.deltaY) || blocked(e.target)) return
            window.clearTimeout(idle)
            idle = window.setTimeout(() => { accumulated = 0; locked = false }, 180)
            if (locked) return
            accumulated += e.deltaX
            if (Math.abs(accumulated) >= 40) { locked = true; void stepSection(accumulated > 0 ? 1 : -1) }
        }
        window.addEventListener('keydown', onKey)
        window.addEventListener('wheel', onWheel, { passive: true })
        return () => {
            window.removeEventListener('keydown', onKey)
            window.removeEventListener('wheel', onWheel)
            window.clearTimeout(idle)
        }
    }, [])
}
```
Call `useDeckGestures()` in `HorizontalLayout`.

**Verify (e2e):**
- `ArrowRight` moves 0 → 1 slide.
- `page.mouse.wheel(300, 0)` moves exactly one slide.
- Nothing happens while a dialog is open.

#### 3.5 Tab, find-in-page and screen readers never desync the track
**Covers:** BUG-02, UX-01, BUG-11.

The cause: the sticky wrapper and the slides are `overflow:hidden`, which is still a scroll container, so focus scrolls them sideways (`scrollLeft`).

1. `HorizontalLayout.tsx`, sticky wrapper (`md:sticky … md:overflow-hidden`): replace `md:overflow-hidden` with `md:overflow-clip`. Slides: replace `md:overflow-hidden` with `md:overflow-clip`. A `clip` box is not a scroll container, so the browser cannot scroll it on focus.
2. Add a `viewportRef` on the sticky wrapper and `data-slide={index}` on each slide wrapper. Then add this effect:
```ts
useEffect(() => {
    const viewport = viewportRef.current
    if (!isDesktop || !viewport) return
    // Focus (Tab, find-in-page, VoiceOver) moved into a slide that is off screen: bring the page to it.
    const onFocusIn = (e: FocusEvent) => {
        const slide = (e.target as Element).closest<HTMLElement>('[data-slide]')
        if (!slide) return
        viewport.scrollLeft = 0 // safety for engines without overflow: clip
        const index = Number(slide.dataset.slide)
        if (index !== currentSectionIndex()) void scrollToSection(index, { instant: true })
    }
    const onScroll = () => { if (viewport.scrollLeft !== 0) viewport.scrollLeft = 0 }
    viewport.addEventListener('focusin', onFocusIn)
    viewport.addEventListener('scroll', onScroll, { passive: true })
    return () => {
        viewport.removeEventListener('focusin', onFocusIn)
        viewport.removeEventListener('scroll', onScroll)
    }
}, [isDesktop])
```
3. Safety for reveals: `globals.css`: `.slide:focus-within :is(.kn-reveal, [data-reveal]) { opacity: 1 !important; transform: none !important; }`. For now, add `data-reveal=""` to the Motion elements in `Headline` and `Rise`; P4 replaces them.

**Verify (e2e `keyboard.spec.ts`, desktop):**
- Press Tab 60 times. After each press:
  - `slideIndexVisible === index of the slide containing document.activeElement`;
  - `activeDot` equals it;
  - the sticky wrapper's `scrollLeft === 0`;
  - the focused element's computed opacity is 1.
- Shift+Tab from Contact back to Projects shows Projects.
- `Ctrl+F` cannot be automated; it goes on the owner checklist.

#### 3.6 One active-slide source
**Covers:** PERF-06, ARCH-04.

Create `src/hooks/useActiveSlide.ts`:
```ts
'use client'
import { useSyncExternalStore } from 'react'
import { currentSectionIndex } from '@/utils/track'

let active = 0
let frame = 0
const listeners = new Set<() => void>()

function measure() {
    frame = 0
    const next = currentSectionIndex()
    if (next !== active) { active = next; listeners.forEach((listener) => listener()) }
}
const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }

function subscribe(listener: () => void) {
    if (listeners.size === 0) {
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule)
        measure()
    }
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
        if (listeners.size === 0) {
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('resize', schedule)
            cancelAnimationFrame(frame)
            frame = 0
        }
    }
}

/** Index of the slide (desktop) or section (stack) currently in view. One listener for the whole page. */
export function useActiveSlide(): number {
    return useSyncExternalStore(subscribe, () => active, () => 0)
}
```
- `Navigation.tsx`: delete its own scroll/resize effect and its `activeIndex` state, and use `const activeIndex = useActiveSlide()`.
- `DotNav.tsx`: delete `useMotionValueEvent`/`useState`, use `useActiveSlide()`, and drop the `progress` prop.

**Verify:** a 3-slide sweep causes exactly one React commit per slide change (React DevTools profiler, or count renders with a temporary `console.count`).

#### 3.7 Deep links, URL sync, scroll restoration, and focus after navigation
**Covers:** UX-04, BUG-20, UX-05.

- `MainContent.tsx`: replace the effect with:
```ts
useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const index = (SECTION_IDS as readonly string[]).indexOf(location.hash.slice(1))
    if (index > 0) requestAnimationFrame(() => { void scrollToSection(index, { instant: true }) })
    else if (!location.hash) window.scrollTo(0, 0)
}, [])
```
  Leave `#main-content` (the skip link) alone.
- **URL sync, in `Navigation.tsx`:**
  - Track whether the visitor has interacted: `const moved = useRef(false)`. Set it on the first `wheel`/`touchstart`/`keydown` (once listeners) and inside `go()`.
  - Then add:
```ts
useEffect(() => {
    if (!moved.current) return
    window.history.replaceState(null, '', activeIndex === 0 ? location.pathname + location.search : `#${SECTION_IDS[activeIndex]}`)
}, [activeIndex])
```
- **Nav items:** render them as `<a href={'#' + id}>` with `onClick={(e) => { e.preventDefault(); go(id, i) }}` so they can be copied and middle-clicked.
- **Focus follows navigation:** `go()` becomes `moved.current = true; restoreFocus.current = false; setMenuOpen(false); void scrollToSection(index).then(() => focusSection(id))`. In the menu cleanup, refocus the menu button only `if (restoreFocus.current)`, then reset it to `true`. Do the same `.then(() => focusSection(id))` in `HeroOverlay` and the Services CTA. The DotNav keeps focus on the dot (carousel convention).

**Verify (e2e `navigation.spec.ts`):**
- `/#projects` lands on slide 6 (desktop) or the Projects section (phone).
- Scrolling to Career makes `location.hash === '#experience'`.
- A reload stays there.
- After keyboard-activating nav "Projects", one Tab focuses "More on GitHub" and the track does not move.

#### 3.8 Crossing the breakpoint keeps the section
**Covers:** BUG-08.

In `HorizontalLayout.tsx`, keep a `lastIndexRef` updated from `useActiveSlide()`. When `isDesktop` flips from one boolean to the other (not on its first non-null value), run `requestAnimationFrame(() => scrollToSection(lastIndexRef.current, { instant: true }))`.

**Verify:** e2e at 900 px wide: scroll to Projects, resize to 1440×900, and Projects is visible with the nav showing "Projects". Then resize back to 900, and the Projects section is still in view.

**Gate and perf-log row.**

---

### P4: First paint, reveals and motion tokens

#### 4.1 Motion tokens
**Covers:** MOTION-13.

Add the token system from **Appendix B, Section 3** verbatim:
- the `@theme static` easing block and `:root` durations;
- the reduced-motion overrides;
- the new `src/utils/motion.ts`.

Keep the temporary `EASE_APPLE`/`EASE_OUT` aliases until P6 finishes migrating call sites.

#### 4.2 Remove the intro gate (D1)
**Covers:** A11Y-03, BUG-10, MOTION-06, BUG-04 (part 3), CONTENT-48.

- Delete `src/components/dom/CinematicEntry.tsx`, `src/hooks/useSiteEntered.ts` and `SITE_ENTERED_EVENT` (in `utils/motion.ts`).
- Remove `<CinematicEntry />` from the layout and the `cinematic-entered` head script.
- Remove the `play` props in HeroOverlay (the hero now plays on load).
- The `keynote.intro` copy becomes dead; it is deleted in P5.
- *If D1 is changed to "keep", use Appendix B MOTION-06 instead and add A11Y-03's `role="dialog"` plus `inert` handling.*

#### 4.3 One head script
**Covers:** PERF-01, MOTION-05.

Replace the remaining theme head script with this single script. It sets `data-js`, paints the theme, and marks slides as revealed when they enter the viewport. Put the string in `src/app/head-script.ts` as `export const HEAD_SCRIPT = \`...\``, so the layout stays readable:
```js
(function () {
  var d = document.documentElement;
  d.setAttribute('data-js', '');
  var t = null;
  try { t = localStorage.getItem('theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  d.classList.add(t);
  d.style.colorScheme = t;
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', t === 'dark' ? '#000000' : '#ffffff'); });
    if (!('IntersectionObserver' in window)) { d.removeAttribute('data-js'); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.setAttribute('data-revealed', ''); io.unobserve(e.target); } });
    }, { rootMargin: '0px -12% -12% 0px' });
    document.querySelectorAll('.slide').forEach(function (s) { io.observe(s); });
  });
})();
```
- Add `suppressHydrationWarning` to each slide wrapper `div` in `HorizontalLayout`, because the script adds `data-revealed` before hydration.
- `<html>` already has it.

#### 4.4 The hero is visible at first paint
**Covers:** PERF-01.

Add to `globals.css` (replacing the old reveal rules around lines 153–155):
```css
@keyframes kn-rise   { from { opacity: 0; transform: translate3d(0, var(--motion-rise), 0); } }
@keyframes kn-settle { from { transform: translate3d(0, var(--motion-rise-sm), 0); } } /* LCP text moves but is never invisible */
.kn-enter, .kn-enter-text {
    animation: kn-rise var(--motion-reveal) var(--ease-apple) both;
    animation-delay: calc(min(var(--i, 0), 5) * var(--motion-stagger));
}
.kn-enter-text { animation-name: kn-settle; }
html:not([data-js]) :is(.kn-enter, .kn-enter-text) { animation: none; }
```
In `HeroOverlay.tsx`:
- Remove `motion`, `Rise`, `EASE_APPLE` and `useSiteEntered`.
- Mark wrapper: `kn-enter`, `--i: 0`.
- Name eyebrow: `kn-enter-text`, `--i: 1`.
- Headline span: `kn-enter-text`, `--i: 2`.
- Lede: `kn-enter-text`, `--i: 3`.
- Pills row: `kn-enter`, `--i: 4`.
- Note: `kn-enter`, `--i: 5`.
- Set `--i` with `style={{ '--i': n } as CSSProperties}`.
- Appendix B PERF-01 step 3 has the exact markup. Ignore its `html:not([data-entered])` rule, since the intro is gone.

**Verify:**
- `grep -o 'style="opacity:0' .next/server/app/**/*.html | wc -l` → 0 for the hero.
- e2e LCP probe on phone (`page.emulateCPUThrottling` via CDP `Emulation.setCPUThrottlingRate` 4 and `Network.emulateNetworkConditions` 150 ms/1.6 Mbps): LCP < 1.8 s.
- Desktop LCP within 100 ms of FCP.

#### 4.5 Slide reveals in CSS
**Covers:** MOTION-05, UX-09, UX-19.

Add:
```css
.kn-reveal {
    opacity: 0;
    transform: translate3d(0, var(--motion-rise), 0);
    transition: opacity var(--motion-reveal) var(--ease-apple), transform var(--motion-reveal) var(--ease-apple);
    transition-delay: calc(min(var(--i, 0), 5) * var(--motion-stagger));
}
.slide[data-revealed] .kn-reveal, html:not([data-js]) .kn-reveal, .slide:focus-within .kn-reveal { opacity: 1; transform: none; }
```
- Replace `Headline`, `Rise` and `CountUp` in `keynote.tsx` with the versions in **Appendix B MOTION-05**: `step` replaces `delay`, the `play` prop is removed, and `CountUp` uses an `IntersectionObserver` and starts from 0 while hidden. Use its step table for every call site.
- Remove the per-tile `Rise as="li"` in `Services.tsx`: tiles become plain `<li>`, and the `<ul>` is wrapped in one `<Rise step={2}>`. Add `.kn-gallery :focus-visible { outline-offset: -2px; }`.
- Delete the `[data-reveal]` safety added in 3.5; `.slide:focus-within` now covers it.

**Verify:**
- No server-rendered `opacity:0` anywhere: `grep -c 'opacity:0' .next/server/app/**/*.html` = 0.
- e2e `nojs.spec.ts` (`javaScriptEnabled: false`): every section's heading is visible, and screenshots look complete.
- The About number never shows "550+" before it counts.
- On phones, all six service tiles are revealed together.

#### 4.6 Fonts
**Covers:** PERF-04.

In `layout.tsx`, set `Inter({ subsets: ['latin', 'greek'], display: 'swap', variable: '--font-inter', axes: ['opsz'], preload: false })`. Keep `adjustFontFallback` (the default).

**Verify:**
- With a Mac Safari UA (`devices['Desktop Safari']`), there are no `.woff2` requests.
- With a Windows Chrome UA, one latin request is made and CLS < 0.02.
- If Android CLS > 0.01, switch to `display: 'optional'`.

**Gate and perf-log row.** Expected: mobile LCP < 1.8 s, Lighthouse mobile ≥ 95.

---

### P5: Architecture and scalability

This is the largest refactor. Commit and push `release/keynote` before starting (ask first; see Rule 7) so there is a clean rollback point.

**Goal:**
- Greek and English are real, server-rendered pages.
- Each visitor downloads one language.
- Adding a project, slide, tool or language touches one place.

#### 5.1 Locale code `gr` → `el`
**Covers:** ARCH-06.

- Rename the `gr` key in `content.ts` to `el`, and do the same everywhere `'gr'` appears as a language value (`Language` type, toggles, `HeroOverlay`'s Greek-size branch).
- Move the Greek hero size override from JS into CSS: `:lang(el) .t-hero { … }`. Use the same values the JS branch used.
- Add `src/data/locales.ts`:
```ts
export const LOCALES = [
    { code: 'en', label: 'English', short: 'EN', path: '/' },
    { code: 'el', label: 'Ελληνικά', short: 'ΕΛ', path: '/el' },
] as const
export type Locale = (typeof LOCALES)[number]['code']
export const DEFAULT_LOCALE: Locale = 'en'
```
- Render the language switchers from `LOCALES`; no more hard-coded binaries.

#### 5.2 Split and clean the content
**Covers:** ARCH-02, PERF-02 step 2, CONTENT-42.

- Install `npm i server-only`.
- Create `src/data/content/types.ts` with the interfaces from `content.ts`, `src/data/content/en.ts`, `src/data/content/el.ts`, and `src/data/content/index.ts` containing:
```ts
import 'server-only'
import type { Locale } from '@/data/locales'
import type { Content } from './types'
import en from './en'
import el from './el'
export const content: Record<Locale, Content> = { en, el }
export type { Content } from './types'
```
- Delete `src/data/content.ts`. Client code may only `import type` from `@/data/content/types`; the `server-only` import makes any accidental client import a build error.
- **Delete the dead fields** listed in CONTENT-42 / ARCH-02 from the interface and both locales:
  - `name`, `title`, `phone`, `nav`
  - every `about.*` except `description`
  - `hero`, `contact`, `cursor`, `skillsTitle`, `servicesTitle`, `servicesSubtitle`, `servicesCta`, `servicesCtaButton`, `servicesLabels`
  - `experienceTitle`, `educationTitle`, `projectsTitle`, `experienceSection`, `projectsSection`, `cinematicEntry`, `contactTitle`
  - `Service.description`, `Education.icon`, `Education.featured`, `KeynoteCopy.projects.role`, `keynote.intro` (D1)

  `npm run typecheck` confirms nothing reads them.
- **Add a stable `id` slug** to every project, service, experience and education item (for example `'plano-plus'`). Use it as the React `key` instead of the localised name (`Projects.tsx` `item.name`, `Experience.tsx` `item.degree`).
- **Type the icons:** `export type GlyphName = keyof typeof PATHS` in `Glyph.tsx`. Type `icon: GlyphName` in content, migrate the values from Font Awesome class names to glyph names, and delete `FROM_FONT_AWESOME`. Make `KeynoteCopy.specs.groups` a `Record<ToolGroup, string>`.

#### 5.3 Locale routes `/` and `/el`
**Covers:** ARCH-01, PERF-03 B, BUG-06, UX-12, CONTENT-47, UX Top-10 #9.

- Move `src/app/layout.tsx` → `src/app/[lang]/layout.tsx` and `src/app/page.tsx` → `src/app/[lang]/page.tsx`. Move `opengraph-image.tsx` into `[lang]/` as well. `robots.ts`, `sitemap.ts`, `favicon.ico` and `global-error.tsx` stay in `src/app/`.
- In `[lang]/layout.tsx`:
```tsx
export const dynamicParams = false
export function generateStaticParams() { return LOCALES.map(({ code }) => ({ lang: code })) }

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: Locale }> }) {
    const { lang } = await params
    return (
        <html lang={lang} className={inter.variable} suppressHydrationWarning>
            <head>{/* HEAD_SCRIPT, JSON-LD (P9) */}</head>
            <body>
                <ThemeProvider>
                    <LocaleProvider locale={lang} copy={content[lang]}>
                        <MotionProvider>{children}</MotionProvider>
                    </LocaleProvider>
                </ThemeProvider>
                <SpeedInsights />
            </body>
        </html>
    )
}
```
  Use `MotionConfig` here until 6.12 introduces `MotionProvider`.
- In `next.config.ts`:
  - Add `async rewrites() { return [{ source: '/', destination: '/en' }] }`.
  - Add the redirect `{ source: '/en', destination: '/', permanent: true }` to `redirects()`. Match `/en` exactly so `/en/opengraph-image` keeps working.
- `/el` is served as is.
- **Language memory:** in `HEAD_SCRIPT`, before the theme logic, add:
```js
try { var l = localStorage.getItem('language'); if ((l === 'el' || l === 'gr') && location.pathname === '/') { location.replace('/el' + location.search + location.hash); return; } } catch (e) {}
```
  This requires the IIFE to `return` early. It runs before first paint, so no English frame is shown.
- **The switcher:**
  - Render it as plain `<a href={target.path + location.hash} hrefLang={target.code} lang={target.code}>`, which forces a full navigation so the `<html lang>` and the content are server-correct.
  - Its `onClick` calls `writeStorage('language', target.code)` without preventing the default.
  - Build the `href` in an effect or the click handler (`location` is not available on the server). Server-render `target.path`, then append the hash on click.
- **404s:** `/foo` must return a 404 page and not throw.
  - With `dynamicParams = false`, unknown `lang` values 404 automatically.
  - If the build complains that there is no root layout for not-found, add `src/app/[lang]/not-found.tsx`.
  - If needed, add `src/app/global-not-found.tsx` with `experimental: { globalNotFound: true }`.
  - Check `curl -I localhost:3100/foo` → 404.

#### 5.4 LocaleProvider replaces LanguageContext
**Covers:** ARCH-01, PERF-03, PERF-05.

- Create `src/contexts/LocaleContext.tsx` (`'use client'`). It takes `{ locale, copy, children }`, provides them through a memoised context value, and exports `useLocale()`.
- `src/hooks/useContent.ts` becomes `export function useContent() { return useLocaleContext().copy }`. Keep the name so component call sites don't change.
- Delete `src/contexts/LanguageContext.tsx` and every `useLanguage()` call.
- Components that need the code (switcher, `Intl` formatting) use `useLocale()`.

**Verify (e2e `locale.spec.ts`):**
- `curl -s localhost:3100/el` contains `lang="el"` and "Αυτοματοποιημένοι".
- `curl -s localhost:3100/` contains `lang="en"` and no Greek headline.
- Clicking ΕΛ on `/#projects` lands on `/el#projects` on the Projects slide.
- After choosing Greek, visiting `/` lands on `/el` with no English frame. Check the first screenshot after `domcontentloaded`.
- A CLS probe for a Greek visitor gives < 0.02.
- `npm run size`: neither page's initial JS contains the other language. `grep -l "Αυτοματοποιημένοι" .next/static/chunks/*.js` returns nothing.

#### 5.5 Slide registry
**Covers:** ARCH-03.

- Create `src/components/slides.ts` with `export const SLIDES: Record<SectionId, ComponentType> = { hero: HeroOverlay, about: About, services: Services, specs: TechSpecs, experience: Experience, projects: Projects, contact: Contact }`.
- `HorizontalLayout` renders `SECTION_IDS.map((id, i) => { const Slide = SLIDES[id]; … })`.
- `KeynoteCopy.nav` becomes `sections: Record<SectionId, string>` plus the existing UI labels. Delete `useSectionLabels.ts`.

Adding a slide is then: one id in `SECTION_IDS`, one component, two labels. TypeScript enforces the rest.

#### 5.6 Data out of components
**Covers:** ARCH-05.

- Create `src/data/site.ts`: `SITE_URL`, `PERSON` (name, email, social URLs, `CONTENT_UPDATED_AT`), `CV_PATH`.
- Import it in the layout metadata, JSON-LD, robots, sitemap and OG image. Remove every other `SITE_URL` literal.
- Move About's stat values (550/70/6/95) into content as `stats: { value: number; suffix: string; label: string; unit?: string }[]`.
- Move `Experience.tsx`'s `NOW_STACK` to `experience[i].stack?: ToolLabel[]`.
- Mark the current role with `current: true` instead of relying on index 0.
- Move `ProjectImage.tsx`'s `EDGES` map to `project.edges?: [string, string]`.

#### 5.7 Optional: structured dates
**Covers:** ARCH-02.

- Store `{ start: '2024-09', end: '2026-05' | null }`.
- Format with `Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })` and years with `{ year: 'numeric' }`.
- Delete `yearSpan` parsing in `utils/format.ts`.

Skip this if time is short; it is not user-visible.

**Gate and perf-log row.** Set `BUDGET_KIB=180`.

---

### P6: Motion polish ("animations fly")

Rules for every animation from here on:
- Only animate `transform` and `opacity`. In Motion, animate a `transform` **string**, not `x`/`y`/`scale` (those run on the main thread).
- Use the P4 tokens.
- Reduced motion keeps fades and drops movement.

#### 6.1 The desktop track and the product shot move on the compositor
**Covers:** MOTION-04, AUD-09.

Follow **Appendix B MOTION-04**, with these adjustments:
- Use `stack:!transform-none` (not `max-md:`), because the `md` variant is custom now (3.1).
- Keep `useIsDesktop` in `HorizontalLayout`; the focus and breakpoint effects from 3.5 and 3.8 need it. Remove only `trackGate`, `motionGate` and their effect.
- `useScroll()` takes no target: the runway is the whole document.

**Verify:**
- DevTools Animations panel lists the scroll-driven track animation.
- A Performance recording of a 3-slide sweep at 4x CPU shows no per-frame Recalculate Style or Layerize from the track, and main thread < 4 ms per frame.
- Firefox still moves the track.
- Re-run the frame probe at 1920×1080 and 2560×1440: p95 frame time ≤ 17 ms (the audit measured 33 ms).

#### 6.2 Dialogs and sheets
**Covers:** MOTION-07, UX-14, UX Top-10 #5.

- **Motion:** apply Appendix B MOTION-07.
  - The scrim owns its own opacity, so the blur stays live.
  - Cards scale in from 0.98; phone sheets rise from `translate3d(0,100%,0)` with `SPRING.sheet`.
  - Exits use `TRANSITION.exit`; under reduced motion, only fades.
- **Drag to dismiss** on phone sheets:
  - `drag="y"` with `dragControls`, started only from a 44 px grabber zone so inner scrolling still works.
  - `dragConstraints={{ top: 0, bottom: 0 }}` and `dragElastic={{ top: 0, bottom: 0.6 }}`.
  - `onDragEnd` closes if `offset.y > 120 || velocity.y > 500`.
  - Drag needs Motion's `domMax` feature set, so in 6.12 load `domMax` instead of `domAnimation`.
  - Give the grabber `aria-hidden` and keep the Close button.
  - If drag proves flaky, remove the grabber element instead (UX-14).

**Verify:**
- The blur is present in the first frame where the scrim is visible (screenshot series).
- The phone sheet travels in from off-screen.
- Dragging the grabber down 150 px closes the sheet.
- Dialog-open Event Timing < 100 ms at 4x.

#### 6.3 Project stage crossfade with decode-before-swap
**Covers:** MOTION-08.

Apply Appendix B MOTION-08 **option A**:
- an overlapping crossfade (no `mode="wait"`);
- preload and decode on hover and focus;
- swap after decode or 250 ms, whichever comes first;
- immediate row highlight.

Also set the stage `sizes` to `"(min-width: 1024px) 640px, 100vw"` (BUG-17).

**Verify:** switching projects never shows an empty device frame, and the new shot is in place within 500 ms.

#### 6.4 Phone accordion
**Covers:** MOTION-09, UX-16, A11Y-08.

- Apply Appendix B MOTION-09: CSS `grid-template-rows` 0fr↔1fr with `inert` on closed panels.
- After a row expands, call `requestAnimationFrame(() => row.scrollIntoView({ block: 'nearest' }))`.
- On phones, use `aria-expanded` + `aria-controls` on the row button. On desktop, keep `aria-pressed`. Pick with `useIsDesktop()`.

#### 6.5 DotNav
**Covers:** MOTION-10, A11Y-04.

- Make it transform-only: each dot is a fixed 8 px circle plus an absolutely positioned 24 px bar that animates `scale-x` and `opacity` with `--motion-base`/`ease-apple`.
- Add `[contain:layout_paint]` on the `<nav>`.
- **Target sizes:** buttons `h-10 min-w-6 px-2`, nav `h-10 px-1.5`. That is still 20 + 40 = 60 px against the slide's `md:pb-[3.75rem]`.

**Verify:** a 3-slide sweep causes ≤ 5 layouts, and each dot button is ≥ 24×24.

#### 6.6 Hamburger morph
**Covers:** MOTION-11.

Apply Appendix B MOTION-11: transform-only, the lines meet in the middle and rotate.

#### 6.7 Menu panel and items
Panel: `TRANSITION.fade`. Items: `TRANSITION.move`, delay `Math.min(i, 5) * STAGGER`, using transform strings.

#### 6.8 CopyButton label
Animate the label with `transform: translate3d(0, ±100%, 0)` strings and `TRANSITION.move`.

#### 6.9 Hover only where hover exists; pressed states
**Covers:** UX-10.

- In `globals.css`, wrap the `:hover` rules of `.kn-pill`, `.kn-link`, `.kn-icon-btn`, `.tile` and `.kn-plus` in `@media (hover: hover) { … }`. Keep the `:focus-visible` chevron nudge outside.
- Add `html { -webkit-tap-highlight-color: transparent; }` and `:is(.kn-pill, .tile, .kn-icon-btn):active { opacity: .8; transition-duration: 0ms; }`.

#### 6.10 Reduced transparency
**Covers:** PERF-11.

- Add `@custom-variant reduced-transparency (@media (prefers-reduced-transparency: reduce));`.
- On the nav and the DotNav, add `reduced-transparency:backdrop-blur-none reduced-transparency:bg-[var(--background)]`.

#### 6.11 Finish the token migration
**Covers:** MOTION-13.

- Apply the call-site table in Appendix B Section 3.
- Remove every `duration-300`/`duration-500` on `transition-colors` (the default 200 ms token applies).
- Delete the `EASE_APPLE`/`EASE_OUT` aliases and `EASE_IN_OUT`.
- `grep -rnE "duration: ?(0\.[0-9]+|1(\.[0-9])?)|cubic-bezier\(" src` should only show `utils/motion.ts` and the token block in `globals.css`.

#### 6.12 LazyMotion
**Covers:** PERF-02 step 1.

- Create `src/components/MotionProvider.tsx` as in Appendix B PERF-02, with `strict`.
- Load `domMax` if 6.2 drag is implemented, `domAnimation` otherwise.
- Replace every `motion.x` with `m.x` (`import * as m from 'motion/react-m'`).
- Use `<MotionProvider>` in the layout.

**Verify:** `npm run size` ≤ 150 KiB. Set `BUDGET_KIB=150`.

#### 6.13 Optional: phone product-shot scrub
Add the `@supports (animation-timeline: view())` block from Appendix B Section 4. Gate it with `@variant stack` and `prefers-reduced-motion: no-preference`.

#### 6.14 Optional: `content-visibility` on phones
**Covers:** PERF-08.

Apply Appendix B PERF-08, then confirm menu jumps still land exactly on each section. If they don't, revert.

**Gate and perf-log row.**

---

### P7: Sizing and responsive

#### 7.1 Short desktop heights
**Covers:** SIZE-01, BUG-11.

- Floor every vh-driven size with `clamp(floor, N·vh, max)`. Use the floors from SIZE-01:
  - ledes `1.0625rem`;
  - list and body text `0.8125–0.875rem`;
  - titles `1.125–1.3125rem`.
  - Example: `md:text-[min(0.875rem,1.6vh)]` → `md:text-[clamp(0.8125rem,1.6vh,0.875rem)]`.
  - At 1440×900 every value is unchanged.
- The files with vh-driven sizes are `About.tsx`, `Services.tsx`, `TechSpecs.tsx`, `Experience.tsx`, `Projects.tsx`, `HeroOverlay.tsx` and `Contact.tsx`. Search for `md:text-[min(`.
- `Contact.tsx` and `HeroOverlay.tsx`: `justify-center` → `justify-center-safe`. Slides: `md:items-center` → `md:items-center-safe`.
- Heights under 640 px already get the stack (3.1).
- If a slide still overflows at 1366×657, tighten in this order:
  1. Projects lineup row padding `py-[min(0.7rem,1.2vh)]` → `py-[min(0.6rem,1vh)]`.
  2. The Projects description `line-clamp-1` under `[@media(max-height:44rem)]:`.
  3. Single-row padding on the About focus rows.

**Verify:** extend `fit.spec.ts` to 1366×657, 1536×730, 1280×720 and 1024×768 (EN + GR). For every slide:
- top ≥ 52 px;
- bottom ≤ DotNav top − 8;
- smallest computed font ≥ 12 px.

#### 7.2 Large displays
**Covers:** SIZE-02, AUD-03, UX Top-10 #7.

- Cap the type, using SIZE-02's values:
  - `HEADLINE_SIZE` → `'text-[clamp(2rem,9.4vw,2.5rem)] md:text-[clamp(2.25rem,min(4.4vw,7.2vh),4rem)]'`.
  - Hero: `md:text-[clamp(3rem,min(6.6vw,11vh),6rem)]`.
  - Contact: `md:text-[clamp(2.75rem,min(5.6vw,8.8vh),5rem)]`.
  - About lead stat: `md:text-[clamp(4.5rem,min(10vw,17vh),9rem)]`.
  - About sub-stats: `md:text-[clamp(2rem,min(3.9vw,6.6vh),3.5rem)]`.
- `--slide-top: max(clamp(1rem, 11vh - 3rem, 4.25rem), 27.5vh - 12.3rem);` keeps the value at ≤ 900 px tall and moves content down on tall screens.
- Scale the whole system on big screens:
```css
@media (min-width: 112rem) and (min-height: 62rem) { html { font-size: 112.5%; } }  /* ≥1792×992 */
@media (min-width: 150rem) and (min-height: 80rem) { html { font-size: 125%; } }    /* ≥2400×1280 */
```
  The 71rem content column, the nav and the spacing grow together.

**Verify:**
- At 2560×1440, headlines are ≤ 64 px × 1.25 and "Meet Andreas." is on one line.
- At 2560×1440, content fills ≥ 60% of the slide height.
- 1440×900 screenshots are pixel-identical to before for the content column.

#### 7.3 Phone nav
**Covers:** SIZE-04, UX Top-10 #3.

- Fix the truncated title. In `Navigation.tsx`, `gap-6` → `gap-3 md:gap-6`. Render the first name only below 25rem: `<span className="min-[25rem]:hidden">{first}</span><span className="hidden min-[25rem]:inline">{full}</span>`.
- **Optional apple.com phone bar:**
  - The bar holds the title, a "Let's talk" `kn-pill--nav` and the menu toggle; move ΕΛ and the theme toggle into the menu only.
  - The menu has 28 px links with grey `›` chevrons and a footer row with "Email" and (once D5 is done) "Résumé".

#### 7.4 Greek pills on narrow phones
**Covers:** SIZE-05.

Add `flex-1 basis-[8.5rem] max-w-[16rem] md:flex-none` to both pills in `HeroOverlay` and `Contact`.

#### 7.5 Landscape phones
**Covers:** SIZE-06.

In `Modal.tsx`:
- Replace `sm:items-center sm:p-4 sm:rounded-[1.75rem]`, `sm:max-h-[88vh]` and the grabber's `sm:hidden` with the `[@media(min-width:40rem)_and_(min-height:36rem)]:` equivalents.
- Use `max-h-[88svh]`.

#### 7.6 Focus never hides under the fixed nav
**Covers:** A11Y-01.

`html { @variant stack { scroll-padding-top: calc(var(--nav-h) + 0.75rem); } }`

**Verify:** Shift+Tab through Career at 390 px; every focused element's top is ≥ 52 px.

#### 7.7 Scrollbars
**Covers:** UX-11, BUG-18, PERF-10.

- Replace the global `::-webkit-scrollbar { display: none }` with `html { @variant md { scrollbar-width: none; &::-webkit-scrollbar { display: none; } } }`.
- Keep `.no-scrollbar` and `.kn-gallery` hidden.
- In the Modal, `no-scrollbar` → `[scrollbar-width:thin]`, so long dialogs show they scroll.

#### 7.8 Wordmark logos repeat their own label
**Covers:** AUD-01.

- In Tech specs and the Career "Now" stack, these logos are wordmarks that spell out the name printed next to them: Jamf ("jamf Jamf Pro"), macOS ("macOS macOS"), VMware ("vmware VMware ESXi"), Duo ("DUO Duo MFA") and Cisco ("cisco Cisco ISE").
- Render the logo only when it is a symbol (`(tool.ratio ?? 1) <= 1.3`). For wordmarks, show the text label alone.
- If a mark is a square symbol but has a `ratio > 1.3` because of padding, fix its `ratio`/viewBox instead.

**Verify:** screenshot the Tech specs slide; no row shows a name twice.

#### 7.9 Don't truncate facts
**Covers:** AUD-02.

- Education rows on Career use `truncate`. This cut the ITIL year ("AXELOS Global Best Practice · 2…") and the Greek TEE name. Change these meta lines to `line-clamp-2`.
- On phones, the Projects list truncates long names ("Thesis Hybrid Wireless-Optical Net…"). Let the subtitle wrap under the title (`flex-col` below 25rem).
- **Verify:** at 1024×768 GR and 390 px, no `…` appears in Career, Projects or Contact text (e2e: check `scrollWidth > clientWidth` on these elements).

**Gate and perf-log row.**

---

### P8: Accessibility and UX polish

Target: Lighthouse accessibility 100, and an axe run in e2e (`@axe-core/playwright`, `npm i -D @axe-core/playwright`) with zero serious or critical violations on `/` and `/el`, desktop and phone, with one dialog open.

#### 8.1 Touch targets
**Covers:** AUD-04, A11Y-04.

On `stack` layouts every control is ≥ 44×44. On desktop, ≥ 24×24.

| Control | Change |
|---|---|
| ΕΛ, theme and menu buttons | `stack:size-11` |
| "Read the full story", the Services "Let's talk" link, "More on GitHub" | `inline-flex items-center min-h-11` |
| Credential pills | `min-h-11` on stack |
| Career "Verify" links | `inline-flex items-center min-h-6 py-1 -my-1` (desktop) / `min-h-11` (stack); the row above gets `mt-1.5` |
| Skip-intro control | gone (D1) |

**Verify:** an e2e walk of all `a, button` elements on phone asserts ≥ 44×44, excluding the sr-only skip link and inline links inside sentences.

#### 8.2 Accessible names match visible text
**Covers:** A11Y-06.

- Remove the `aria-label`s that hide visible text: the Services tile buttons, Career rows and project rows. Append the extra hint as `<span className="sr-only">, {learnMore}</span>`.
- Language link: visible "ΕΛ", accessible name `ΕΛ — Ελληνικά`, with `lang="el"` on the Greek text and `lang="en"` on the English text.

#### 8.3 Dialog semantics
**Covers:** A11Y-07.

- Dialog titles `h3` → `h2`, and their subsections `h4` → `h3`. Keep the classes.
- Link pills that open a new tab get `<span className="sr-only"> ({k.common.newTab})</span>`.
- The stage `ProjectShot` gets `alt=""`, because the caption names it.

#### 8.4 Valid definition lists
**Covers:** A11Y-05, BUG-15.1.

- In About, close the first `<dl>` after the lead stat.
- The three-stat grid becomes its own `<dl className="…grid…">`, so each `Rise` div directly wraps a `dt` + `dd`.

#### 8.5 Project selector announcements
**Covers:** A11Y-08, BUG-15.2.

- Remove `aria-live` from the whole stage.
- Add `<p className="sr-only" aria-live="polite">{stageName.title}</p>`.

#### 8.6 Copy feedback
**Covers:** A11Y-09.

- Remove `aria-live` inside the CopyButton.
- Add a sibling `<span role="status" className="sr-only">{state === 'copied' ? copiedLabel : state === 'failed' ? failedLabel : ''}</span>`.

#### 8.7 Contrast
**Covers:** A11Y-10.

- `--accent-fill-hover: #006edb` (4.94:1 with white), in both themes' declarations.
- `LocalTime`'s `opacity-60` → `text-[var(--muted)]`.

#### 8.8 Increased contrast and forced colors
**Covers:** A11Y-11.

- Append the A11Y-11 block (below) unlayered at the end of `globals.css`.
- Add the class `kn-dot` to the DotNav dot span.

```css
@media (prefers-contrast: more) {
  :root, html:not(.dark) [data-tone] { --muted:#424245; --line:#86868b; --nav-bg:rgba(251,251,253,.98); }
  .dark, html.dark [data-tone] { --muted:#c7c7cc; --line:#86868b; --nav-bg:rgba(22,22,23,.98); }
  .kn-sheet { --line:#86868b; }
}
@media (forced-colors: active) {
  .t-accent { -webkit-text-fill-color: currentColor; background: none; }
  .tool-logo, .tool-tile__logo, .kn-dot { forced-color-adjust: none; background-color: CanvasText; }
  .kn-plus { border: 1px solid CanvasText; }
}
```

#### 8.9 Localised landmark labels, skip link and focusable main
**Covers:** A11Y-12, BUG-14, CONTENT-35.

- Add copy keys (EN / GR):
  - `nav.main` "Main navigation" / "Κύρια πλοήγηση"
  - `nav.menu` "Menu" / "Μενού" (if not added in 2.5)
  - `nav.slides` "Slides" / "Διαφάνειες"
  - `common.skip` "Skip to content" / "Μετάβαση στο περιεχόμενο"
  - `common.newTab` "opens in a new tab" / "ανοίγει σε νέα καρτέλα"
- Use them in `Navigation` and `DotNav`.
- Move the skip link into `Navigation`, or keep it in the now locale-aware layout using `content[lang]`.
- `<main id="main-content" tabIndex={-1} className="… outline-none">`.

#### 8.10 Contact flow
**Covers:** UX-08, UX-18, CONTENT-27, D5, D15, UX Top-10 #8 (partial).

- **"Send a message":** `href={\`mailto:${email}?subject=${encodeURIComponent(k.contact.subject)}\`}`, with no `target`, `rel` or new-tab label. Add `contact.subject`:
  - EN: "Hello from andreas.technology"
  - GR: "Χαιρετισμούς από το andreas.technology"
- **Résumé:**
  - If `public/files/andreas-fragkiadakis-cv.pdf` exists: `<a href={CV_PATH} download="Andreas-Fragkiadakis-CV.pdf" className="kn-pill kn-pill--line">{k.contact.resume}</a>` plus a caption `PDF · {size}`. Compute the size at build time with `fs.statSync` in a server component, or hard-code it next to `CV_PATH` in `site.ts`.
  - **If the file does not exist, do not render the button** (D5). Add "Upload updated CV" to `docs/OWNER-TODO.md`.
- **Contact grid at 640–1023 px:** add `sm:gap-x-8 md:gap-x-0`. Wrap the copyright line in `<footer>`.
- **About bio sheet:** render the pipe- or middot-separated last paragraph as a hairline `<ul>`.

#### 8.11 Phone menu polish
**Covers:** UX-17.

- Use one gutter everywhere: nav and menu `px-6 sm:px-10`, the same as the sections.
- The current item gets `aria-current` and `text-[var(--foreground)]`; the others get `text-[var(--foreground)]/80`.

#### 8.12 Projects lineup readability
**Covers:** UX-16.

Inactive rows: title in `--foreground`, subtitle `--muted`. The active row keeps `font-semibold`.

#### 8.13 Image alt text
**Covers:** CONTENT-41.

`alt={[title, subtitle].filter(Boolean).join(', ')}` from `splitName(project.name)` in `Device.tsx` and `ProjectImage.tsx`.

#### 8.14 Safe areas
- Set `viewport` to `{ viewportFit: 'cover', … }` alongside `themeColor`.
- Phone sheets: `pb-[max(2.5rem,env(safe-area-inset-bottom))]`.
- Nav: `px-[max(1.5rem,env(safe-area-inset-left))]` (and right).
- The phone DotNav is hidden, so it needs nothing.

**Verify:** a landscape iPhone in the simulator or a real device has no content under the notch, and sheets clear the home indicator.

#### 8.15 Optional: gallery paddles on phones
**Covers:** UX Top-10 #4.

- Put two 44 px `kn-icon-btn` (‹ ›) under the Services gallery.
- They call `scrollBy({ left: ±(tileWidth + gap), behavior: 'smooth' })`.
- At the ends, set `aria-disabled` and opacity .42, updated from a passive `scroll` listener.

#### 8.16 Optional: Light / Dark / Auto appearance control
**Covers:** UX Top-10 #10.

Add a three-state control in the menu. "Auto" removes `localStorage.theme` and paints from `matchMedia`.

#### 8.17 Optional: project permalinks
**Covers:** UX Top-10 #6.

- `#projects/<id>` selects the project; `#projects/<id>/details` opens its dialog.
- ↑/↓ moves through the lineup with a roving tabindex.

**Gate and perf-log row.**

---

### P9: SEO, metadata, security, assets

#### 9.1 Metadata per locale
**Covers:** CONTENT-12, CONTENT-13, BUG-13.1–3.

Use `generateMetadata({ params })` in `[lang]/layout.tsx`, built from `site.ts` and the locale copy.

- **EN:**
  - title: `Andreas Fragkiadakis | Apple Fleet & IT Automation Lead` (template `%s | Andreas Fragkiadakis`)
  - description: CONTENT-12
  - keywords: CONTENT-12
  - `openGraph.locale: 'en_GB'`
- **GR:**
  - title: `Ανδρέας Φραγκιαδάκης | Apple Fleet & IT Automation Lead`
  - description: `Team Lead Apple Fleet & IT Automation στην Omilia, Αθήνα. Jamf Certified Tech (Jamf 200) με 550+ Mac: zero-touch enrollment και θωράκιση CIS.`
  - `openGraph.locale: 'el_GR'`
- **Alternates:** `{ canonical: lang === 'en' ? '/' : '/el', languages: { en: '/', el: '/el', 'x-default': '/' } }`.
- Delete the static `openGraph.images` (the file convention wins), `twitter.creator` and `other.theme-color`.

**Verify:** `curl -s localhost:3100/el | grep -E 'hreflang|og:locale|<title>'`.

#### 9.2 JSON-LD
**Covers:** CONTENT-15, BUG-13.7, AUD-10.

- **Remove `telephone`.** Your mobile number is published in the page source today.
- Person `'@id': SITE_URL + '/#person'`; WebSite `publisher: { '@id': SITE_URL + '/#person' }`.
- `jobTitle: 'Team Lead, Apple Fleet & IT Automation'`.
- `worksFor: { '@type': 'Organization', name: 'Omilia', url: 'https://omilia.com' }`.
- `knowsAbout`, `description`, `alumniOf` and `knowsLanguage` from CONTENT-15.
- `hasCredential` stays derived from content (now with PeopleCert).

**Verify:** paste the JSON-LD into Google's Rich Results Test (owner, P11).

#### 9.3 robots and sitemap
**Covers:** BUG-05, CONTENT-14, BUG-13.5.

- `robots.ts`: delete `disallow: ['/opengraph-image']`.
- `sitemap.ts`: two entries (`/` and `/el`), each with `alternates.languages`, and `lastModified: CONTENT_UPDATED_AT` (a constant in `site.ts`; bump it when content changes).

#### 9.4 Web manifest
**Covers:** BUG-13.4.

- Link `public/favicons/site.webmanifest` via `metadata.manifest`.
- Update its `name`, `short_name`, `theme_color` and `background_color` (`#000000`).

#### 9.5 OG image
**Covers:** BUG-13.6.

- `[lang]/opengraph-image.tsx` renders the locale's headline and title.
- Add `{ signal: AbortSignal.timeout(5000) }` to both font `fetch` calls, and fall back to the system font on failure.
- Add `{/* eslint-disable-next-line @next/next/no-img-element */}` above the `<img>` (lint goes to 0 warnings).

#### 9.6 Portfolio project screenshot
**Covers:** CONTENT-06 (image).

- Take a fresh 2880×1800 screenshot (1440×900 at 2x) of the finished hero in light theme with Playwright.
- Save it as `public/images/portfolio-website/2026-keynote.png`, and point both locales' `image` at it with an `edges` entry or `imageFit: 'cover'`.
- Do not include the Next.js dev badge: shoot the production server.

#### 9.7 Images
**Covers:** PERF-09, AUD-05, BUG-17, D16.

- `next.config.ts`:
  - Add `images.formats: ['image/avif', 'image/webp']`.
  - Remove the unused `remotePatterns`.
- **Shrink the sources** with a one-off `scripts/optimize-images.mjs` using `sharp`, which Next already installs (`require.resolve('sharp')`; otherwise `npm i -D sharp`):
  - for every project image under `public/images/<project>/` that is referenced by content: resize to ≤ 2400 px wide (keep the aspect ratio) and re-encode PNG with `{ compressionLevel: 9, palette: true }` when the result is smaller, or as JPEG q88 for photographic shots. Then update the path in content if the extension changes.
  - The current originals are up to **5.8 MB** (`signature-craft.png`). Target ≤ 600 KB each.
  - Leave `email-signature-icons/`, `Email Signature Icons/` and `QR Codes/` untouched.
- **Delete the D16 list,** only after asking Andreas in the chat.
- `Mark.tsx`: rename the `priority` prop to `preload`, which is the Next 16 API. Preload only the hero mark, not the 30 px nav mark.

#### 9.8 Security headers
**Covers:** AUD-06.

The live site sends only HSTS today. In `next.config.ts` `headers()`, add for `source: '/:path*'`:
```ts
{ key: 'X-Content-Type-Options', value: 'nosniff' },
{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
```
Do **not** add an enforcing CSP now: the head script, JSON-LD and Next's inline bootstrap would need nonces, and nonces force dynamic rendering. If wanted later, start with `Content-Security-Policy-Report-Only`.

**Verify:** `curl -sI localhost:3100 | grep -iE "x-content-type|referrer-policy|x-frame|permissions-policy"`.

**Gate and perf-log row.**

---

### P10: Repo hygiene, docs, CI

#### 10.1 Dead code and dependencies
**Covers:** ARCH-07.

- `npm uninstall typewriter-effect`.
- Try deleting `.npmrc` (`legacy-peer-deps=true`) and run `npm install`. If it resolves without peer errors, keep it deleted.
- Remove the unused `Tool.brand`/`Tool.row` and fix the stale comments in `tools.ts` (they mention a "marquee" and `keynote.services.groups`; it is `keynote.specs.groups`).
- Remove `export` from `MARK_SRC` if it is only used internally.
- Delete the unused CSS `.kn-rule` and `.tool-tile--sm`.
- Delete `andreas-technology-v3/docs/title-locations.md` (the old typewriter guide).
- Delete `public/CNAME` (D16, a GitHub Pages leftover; Vercel serves the domain).

#### 10.2 READMEs
**Covers:** CONTENT-31, BUG-19.

- Apply CONTENT-31 to the repo-root `README.md` and `docs/bento-infographic.svg`.
- Replace `andreas-technology-v3/README.md` with a short developer README: scripts (`dev`, `check`, `e2e`, `size`), the structure (`[lang]` routes, `data/content/{en,el}.ts`, `SLIDES`, `track.ts`), "how to add a project / slide / tool / language", and the perf budgets.

#### 10.3 Design doc
**Covers:** D17.

- `git mv STYLE.md docs/DESIGN.md`.
- Add a "Round 6: launch" section summarising this plan's outcome: the architecture, the motion tokens, the desktop gate and the budgets.
- Remove `style-preview/` from the release branch (`git rm -r style-preview`); it stays in `style/apple-keynote`'s history.

#### 10.4 CHANGELOG
Add an entry to `andreas-technology-v3/CHANGELOG.md` for the launch, grouped as Content / Performance / Motion / Accessibility / SEO / Architecture.

#### 10.5 CI
Add `.github/workflows/ci.yml`:
- trigger on `pull_request` and `push` to `main`;
- ubuntu-latest, Node 22, working directory `andreas-technology-v3`;
- steps: `npm ci`, `npm run lint`, `npm run typecheck`, `npx playwright install --with-deps chromium`, `npm run e2e`, `npm run size`.

#### 10.6 Optional: dependency refresh (last)
Run `npm outdated`.

- **Safe minors:** next / eslint-config-next 16.x latest, react / react-dom 19.x latest, `@types/node` → `^22`.
- **Skip unless trivial:** `motion` 14 (major) and `@vercel/speed-insights` 2 (major). Read their changelogs first.

Run the full gate after each bump.

**Gate.**

---

### P11: Final verification and launch

#### 11.1 Full matrix
- `npm run check` must be green.
- Lighthouse, 5 runs each, median, mobile and desktop, for `/` and `/el`. Record the results in `docs/perf-log.md`. They must meet Section 2.
- Run the fit and overflow e2e across all viewports: 360, 390, 430, 768, 1024×768, 1280×720, 1366×657, 1440×900, 1536×730, 1920×1080, 2560×1440, iPad landscape and phone landscape, in EN and GR, in both themes.

#### 11.2 Push for a preview
Ask Andreas, then `git push -u origin release/keynote`. Vercel builds a preview URL; send it to Andreas.

#### 11.3 Owner hardware checklist
For Andreas, on the preview URL:
- [ ] **Mac + trackpad (Safari and Chrome):**
  - a vertical fling lands on a slide with no second glide;
  - a sideways swipe moves one slide and never goes Back;
  - pinch zoom works.
- [ ] **Windows + mouse:** one wheel notch moves one slide; the keyboard Arrows, PageUp/PageDown, Space, Home and End all work.
- [ ] **Find in page (Ctrl/Cmd+F)** for "Weballdesign" from the hero lands cleanly on Career.
- [ ] **VoiceOver:** reading order is slide by slide; dialogs announce their titles.
- [ ] **iPhone Safari:**
  - no theme flash;
  - the hero is visible immediately;
  - sheets rise from the bottom and can be dragged down;
  - the menu locks scrolling;
  - landscape clears the notch.
- [ ] **Android Chrome:** the same, plus no visible font jump.
- [ ] **iPad:** gets the vertical layout.
- [ ] **macOS "Reduce motion" on:** fades only, instant snaps.
- [ ] **The Greek path:** switch to ΕΛ, reload, and open `/` in a new tab; it lands on `/el` with no English frame.
- [ ] **External checks:**
  - LinkedIn Post Inspector shows the OG image for `/` and `/el`;
  - Google Rich Results Test passes for the JSON-LD.
- [ ] **D5:** the updated CV PDF has been provided (or the button stays hidden).

#### 11.4 Launch
After Andreas approves:
```bash
git switch main && git pull --ff-only
git merge --ff-only release/keynote   # main is an ancestor; this must fast-forward
git push origin main                  # Vercel deploys production
```
If `--ff-only` fails because `main` moved, rebase `release/keynote` onto `main`, rerun the gate and ask again.

#### 11.5 After deploy
- `curl -sI https://andreas.technology` shows the security headers.
- `curl -s https://andreas.technology/el | grep 'lang="el"'` matches.
- Check that https://andreas.technology/images/email-signature-icons/github-white.png still returns 200.
- Submit the sitemap in Google Search Console.
- After 7 days, check Vercel Speed Insights p75 on mobile: LCP < 1.8 s, INP < 100 ms, CLS < 0.02.

#### 11.6 Clean up
- Stop all local dev servers.
- Remove the review worktrees:
```bash
cd C:\Users\Andrew\Portfolio-Webpage
for n in apple-keynote bento-grid-v2 desktop-os-v2 swiss-cobalt swiss-editorial; do git worktree remove --force ../pf-review/$n; done
git worktree prune
```
  Then delete the empty `C:\Users\Andrew\pf-review` folder.
- Keep all `style/*` branches and `review` on GitHub (the owner's request).
- **D13 (owner, in the Vercel dashboard):** protect or ignore preview deployments of `style/*`.
- Optionally delete the audit scratch folders `C:\Users\Andrew\AppData\Local\Temp\claude\{audit-bugs,audit-ux,audit-content,audit-motion,pwtool}`.

---


---

## Appendix A: Content audit (EN + GR), verbatim

**Overrides from the plan (they win over the text below):**
- **Line numbers** refer to commit `478acbd`. Find text by the quoted snippet. The `gr` block becomes `el` in P5, and its content is the same.
- **CONTENT-02 / CONTENT-09:** apply per **D6**.
- **CONTENT-04:** apply per **D7**.
- **CONTENT-05:** apply per **D8**.
- **CONTENT-25:** apply per **D10**.
- **CONTENT-32:** apply per **D14**.
- **CONTENT-33:** apply per **D9**.
- **CONTENT-06:** apply the copy in P1. Ignore its instruction to copy `style-preview/light/desktop-1-hero.jpg`; task **9.6** takes a fresh screenshot of the finished site instead.
- **CONTENT-07:** handled by **D5** and task **8.10**.
- **CONTENT-12…15:** done in **P9**, in `generateMetadata` and the JSON-LD, built from `site.ts`.
- **CONTENT-16:** done in **2.3**.
- **CONTENT-27:** done in **8.10**.
- **CONTENT-31:** done in **10.2**. In its feature list, change "English / Greek with persisted preference" to "English at `/`, Greek at `/el`, both server-rendered".
- **CONTENT-35:** done in **8.9**.
- **CONTENT-41:** done in **8.13**.
- **CONTENT-42:** done in **5.2**.
- **CONTENT-43:** **ignore the rename.** The label stays **"Grok Bot"** (**D12**, the owner's explicit request). The `keynote.specs.groups` comment fix still applies (10.1).
- **CONTENT-47:** after P5, `/el` exists, so **do** add hreflang (task 9.1).
- **CONTENT-48:** the intro is removed (**D1**).

### Content audit: andreas.technology, Apple Keynote branch

**What I audited:** the app at `C:\Users\Andrew\pf-review\apple-keynote\andreas-technology-v3`, checked out at detached HEAD `478acbd`. I compared it with `main` (`7fd1906`, production).

**Scope:** `src/data/content.ts`, `src/data/tools.ts`, `src/app/layout.tsx`, `opengraph-image.tsx`, `robots.ts`, `sitemap.ts`, every component under `src/components/**`, and the repo-root `STYLE.md` and `README.md`.

**External sources checked (read-only):**
- The live résumé PDF behind the "Download résumé" link.
- `public/files/itil-v4-cert.pdf`.
- The Jamf 200 badge, through Credly's public API.
- The GitHub API for the owner's public repos.
- PubMed, for the research project.

No repo files were edited. Scratch files are under `C:\Users\Andrew\AppData\Local\Temp\claude\audit-content\` (`main-content.ts`, `cv.pdf`, `lens.py`).

**Notes for whoever applies this report:**
- Line numbers refer to HEAD `478acbd`. All paths are relative to `andreas-technology-v3/` unless stated otherwise.
- `zero‑touch` below contains U+2011 (non-breaking hyphen), the same as the current source. Keep it. Every other hyphen is ASCII.
- EN replacement copy uses curly apostrophes (’), per CONTENT-37.
- Items marked **OWNER** in the last section need a fact from Andreas. Do not apply them automatically.
- Many fields in `content.ts` are not rendered at all in this layout (see CONTENT-42). The findings below target rendered copy unless they say otherwise.

**Fields that are actually rendered:**
- `keynote.*`
- `about.description` (shown in the bio dialog)
- `skills`
- `services[]`: `title`, `oneLiner`, `detail`, `highlights`, `tools`
- `experience[]`
- `education[]` (also feeds the JSON-LD `hasCredential`)
- `projects[]`
- `email`, `location`, `github`, `linkedin`, `copyright`

---

#### Regressions vs `main` (production)

- **Not a regression, but unfinished:** the branch moves 400+ to 550+ in the tagline, bio and Team Lead bullet. It leaves **400+ in two IT Engineer bullets** in EN and GR (CONTENT-01). Production still shows "400+" as an About stat, so this branch fixes that.
- **Carried over from `main` unchanged:**
  - The metadata and JSON-LD still position him as "IT & Security Engineer … SecOps" (CONTENT-12).
  - The "7+ years" stat (CONTENT-02).
  - The ITIL year and issuer (CONTENT-03).
  - The research-authorship claim (CONTENT-04).
  - The GPA mismatch (CONTENT-11).
- **Lost from `main`:**
  - The hero's LinkedIn, GitHub and email icons. The contact links now exist only on slide 7 (CONTENT-48).
  - The languages stat. Languages now appear only in the bio dialog footer. This is acceptable.
- **Fixed by the branch:** Greek service titles and project names now carry tonos. On `main` they were unaccented ("Ασφαλεια Τερματικων…").

---

#### P0: wrong facts

##### CONTENT-01 · P0 · Fleet count still 400+ in two places
**Locations:** `src/data/content.ts:444`, `:446`, `:1078`, `:1080`. Unit consistency also at `:322` and `:956`.

**Problem:** The owner confirmed 550+. These bullets also contradict the hero, the stat and the OG image.

**Replacements:**
- EN `:444`: `Architected Jamf Pro zero‑touch enrollment via Apple Business Manager for the 550+ Mac fleet, cutting onboarding time by 70%`
- EN `:446`: `Led the enterprise EDR migration to Check Point Harmony Endpoint across 550+ devices, resolving FileVault conflicts at cutover with zero data loss`
- GR `:1078`: `Σχεδίαση zero‑touch enrollment με Jamf Pro και Apple Business Manager για στόλο 550+ Mac — μείωση χρόνου onboarding κατά 70%`
- GR `:1080`: `Ηγεσία εταιρικής μετάβασης EDR σε Check Point Harmony Endpoint σε 550+ συσκευές, με επίλυση συγκρούσεων FileVault χωρίς καμία απώλεια δεδομένων`

**Unit consistency** (the current text says "Jamf 200 certified… for a 550+ macOS fleet"):
- EN `:322`: `Jamf Certified Tech (Jamf 200). I own Jamf Pro end to end for 550+ Macs: zero‑touch enrollment through Apple Business Manager, configuration profiles, patching, Self Service and day-to-day fleet hygiene.`
- GR `:956`: `Jamf Certified Tech (Jamf 200). Διαχειρίζομαι εξ ολοκλήρου το Jamf Pro για 550+ Mac: zero‑touch enrollment μέσω Apple Business Manager, configuration profiles, ενημερώσεις, Self Service και καθημερινή συντήρηση του στόλου.`

##### CONTENT-02 · P0 · "7+ yrs" is not supported by the timeline
**Locations:** `src/components/dom/About.tsx:27`; the comment at `src/data/content.ts:94`; `STYLE.md:64`.

**Current:** `{ value: 7, suffix: '+', unit: k.about.yearsUnit }`

**Problem:** The earliest role on the site and on the CV is 2020. As of Oct 2026 that is 6 years and some months.

**Replacements:**
- `About.tsx:27`: `{ value: 6, suffix: '+', unit: k.about.yearsUnit },`
- `content.ts:94`: `/** Captions for 550+, 70%, 6+ and 95%+ (SLA), in that order. */` (this pairs with CONTENT-09)
- `STYLE.md:64`: change "with 70%, 7+ yrs and 3 certifications" to `with 70%, 6+ yrs and 95%+ SLA`

##### CONTENT-03 · P0 · ITIL year, issuer and name are wrong
**Locations:** `content.ts:538–540` and `:1170–1172`.

**Current:** EN degree `"ITIL 4 Foundation certified in IT Service Management"`, institution `"AXELOS Global Best Practice"`, duration `"2024"` in both languages.

**Problem:** The hosted certificate (`public/files/itil-v4-cert.pdf`) says "ITIL Foundation Certificate in IT Service Management". It is issued by **PeopleCert**, **effective 06 Nov 2025**, and must be renewed by 06 Nov 2028. These values also flow into the JSON-LD `hasCredential`.

**Replacements:**
- EN `:538`: `degree: "ITIL 4 Foundation Certificate in IT Service Management",`
- EN `:539`: `institution: "PeopleCert",`
- EN `:540`: `duration: "2025",`
- GR `:1171`: `institution: "PeopleCert",`
- GR `:1172`: `duration: "2025",`
- GR `:1175`, second detail: `Έμφαση στις βέλτιστες πρακτικές διαχείρισης υπηρεσιών πληροφορικής (ITSM)`. "Εξειδίκευση" overstates a Foundation-level certificate.

##### CONTENT-04 · P0 · The research project claims authorship of a paper he did not write
**Locations:** `content.ts:751–765` (EN) and `:1383–1397` (GR).

**Current:**
- Role: "Research contributor · Published in Cognitive Science"
- Highlight: "Peer-reviewed and published in Cognitive Science (Wiley)"
- Highlight: "Analysis pipeline implemented in Python"

**Problem:** According to PubMed, *Do Large Language Models Know What Humans Know?* (Cogn Sci 2023;47(7):e13309, [DOI](https://doi.org/10.1111/cogs.13309)) is by Trott, Jones, Chang, Michaelov and Bergen, all at UC San Diego. Andreas is not an author. The image file is even named after the paper. A recruiter who clicks "Publication" will see the author list.

**Replace these fields** (`publicationLink`, `reportLink`, `image` and `year` stay):

| Field | EN | GR |
|---|---|---|
| `name` | `LLMs & Human Knowledge - Research review` | `LLMs & Ανθρώπινη Γνώση - Ερευνητική ανασκόπηση` |
| `tags` | `["Research", "Cognitive Science", "LLMs", "GPT-3"]` | `["Έρευνα", "Cognitive Science", "LLMs", "GPT-3"]` |
| `description` | `A research review of whether GPT-3 attributes beliefs the way people do, based on Trott et al.’s False Belief Task study in Cognitive Science (2023).` | `Ερευνητική ανασκόπηση: αποδίδει το GPT-3 πεποιθήσεις όπως οι άνθρωποι; Βασίζεται στη μελέτη των Trott et al. με το False Belief Task στο Cognitive Science (2023).` |
| `role` | `Research review · Source study: Trott et al., Cognitive Science 47(7), 2023` | `Ερευνητική ανασκόπηση · Πηγή: Trott et al., Cognitive Science 47(7), 2023` |
| `detail` | `A review of how GPT-3 and people compare on the False Belief Task, a standard test of theory of mind from developmental psychology. The question: does a language model that writes fluently about beliefs actually attribute them, or does it pattern-match its way to the right answer? Based on “Do Large Language Models Know What Humans Know?” by Trott, Jones, Chang, Michaelov and Bergen (Cognitive Science, 2023).` | `Ανασκόπηση της σύγκρισης GPT-3 και ανθρώπων στο False Belief Task, καθιερωμένο τεστ της αναπτυξιακής ψυχολογίας για τη θεωρία του νου. Το ερώτημα: ένα γλωσσικό μοντέλο που γράφει με ευχέρεια για πεποιθήσεις όντως τις αποδίδει ή απλώς αναγνωρίζει μοτίβα; Βασίζεται στη μελέτη «Do Large Language Models Know What Humans Know?» των Trott, Jones, Chang, Michaelov και Bergen (Cognitive Science, 2023).` |
| `highlights` | `["GPT-3 versus human baselines on the False Belief Task", "Developmental-psychology methods applied to model evaluation", "What the results imply about learning theory of mind from language", "Source: peer-reviewed study in Cognitive Science (Wiley, 2023)"]` | `["GPT-3 έναντι ανθρώπινων επιδόσεων στο False Belief Task", "Μεθοδολογία αναπτυξιακής ψυχολογίας στην αξιολόγηση μοντέλων", "Τι δείχνουν τα αποτελέσματα για τη θεωρία του νου μέσα από τη γλώσσα", "Πηγή: μελέτη με κριτές στο Cognitive Science (Wiley, 2023)"]` |

See OWNER O-5 if he did run his own Python analysis.

##### CONTENT-05 · P0 · An Erasmus+ semester is listed as a "Master of Science"
**Locations:** `content.ts:516–521` and `:1149–1153`.

**Current:** `degree: "Master of Science, Applied Computer Science"` (2023, with "ERASMUS+ Semester" as a detail).

**Problem:** One exchange semester is not an M.Sc. Listed as a degree, it will fail a background check. The résumé has the same problem.

**Replacements:**
- EN `degree`: `Erasmus+ exchange semester, M.Sc. Applied Computer Science`
- EN `details`: `["One semester of the M.Sc. Applied Computer Science programme, on Erasmus+", "Recognised as presenter and team lead"]`
- GR `degree`: `Εξάμηνο Erasmus+, M.Sc. Applied Computer Science`
- GR `details`: `["Ένα εξάμηνο του προγράμματος M.Sc. Applied Computer Science, μέσω Erasmus+", "Διάκριση ως ομιλητής και επικεφαλής ομάδας"]`
- GR `duration` (`:1152`): `Απρίλιος 2023 – Οκτώβριος 2023` (en dash)

##### CONTENT-06 · P0 · The Portfolio project describes features that no longer exist
**Locations:** `content.ts:633–647` (EN) and `:1264–1279` (GR).

**Problem:** The copy promises a "Canvas glitch effect", a "masked cursor trail" and "six pinned sections". This build has 7 slides and nothing follows the pointer. The screenshot `/images/portfolio-website/2026.png` shows the old outlined-name design and the Next.js dev-mode "N" badge.

**Replacements:**
- `tags`, EN and GR: `["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion"]`
- EN `description`: `This site: a portfolio told like a product launch. Seven slides on one horizontal track on desktop, a clean vertical stack on phones, in English and Greek, light and dark.`
- EN `detail`: `This site, designed like a product launch page. On desktop, seven slides travel along one horizontal track with snapping and dot navigation; on tablets and phones they become a vertical stack with bottom-sheet dialogs. Fully bilingual, light and dark, and built to stay accessible: keyboard navigable, focus-visible throughout, and respectful of reduced-motion preferences.`
- EN `highlights`: `["Seven-slide horizontal track with idle snapping and dot navigation", "Bottom-sheet dialogs and a snapping tile gallery on phones", "Full EN/GR content with light and dark themes", "Keyboard accessible with reduced-motion support"]`
- GR `description`: `Αυτή η ιστοσελίδα: ένα portfolio σαν παρουσίαση προϊόντος. Επτά διαφάνειες σε έναν οριζόντιο άξονα στο desktop, καθαρή κάθετη διάταξη στο κινητό, στα ελληνικά και στα αγγλικά, σε φωτεινό και σκοτεινό θέμα.`
- GR `detail`: `Αυτή η ιστοσελίδα, σχεδιασμένη σαν σελίδα παρουσίασης προϊόντος. Στο desktop, επτά διαφάνειες κινούνται σε έναν οριζόντιο άξονα με snapping και πλοήγηση με τελείες. Σε tablet και κινητό γίνονται κάθετη διάταξη με διαλόγους bottom sheet. Πλήρως δίγλωσση, με φωτεινό και σκοτεινό θέμα, και προσβάσιμη: πλοήγηση από πληκτρολόγιο, ορατή εστίαση παντού και σεβασμός στη ρύθμιση reduced motion.`
- GR `highlights`: `["Οριζόντιος άξονας επτά διαφανειών με snapping και πλοήγηση με τελείες", "Διάλογοι bottom sheet και gallery με snapping στο κινητό", "Πλήρες δίγλωσσο περιεχόμενο EN/GR με φωτεινό και σκοτεινό θέμα", "Πλοήγηση από πληκτρολόγιο και υποστήριξη reduced motion"]`

**Image:** Copy `style-preview/light/desktop-1-hero.jpg` (repo root) to `public/images/portfolio-website/2026-keynote.jpg`. Set `image: "/images/portfolio-website/2026-keynote.jpg"` in both languages. Either add an `EDGES` entry in `ProjectImage.tsx` or set `imageFit: "cover"`.

##### CONTENT-07 · P0 · "Download résumé" serves an outdated CV
**Location:** `src/components/dom/Contact.tsx:9` (`CV_LINK`, Drive id `1b-GiyMU…`).

**Problem:** The PDF it serves contradicts the site:
- It calls him an "IT & Computer Engineering **student**" and shows the degree as "September 2019 - **Present**".
- It lists "Information Technology **Support** Engineer | OMILIA LTD | September 2024 - Present".
- It has no Team Lead role, no Jamf 200, no 550+ and no metrics.
- It repeats the "Master of Science (MS)" claim from CONTENT-05.
- It publishes his mobile number.

**Action (owner):** Upload a CV that matches the facts sheet below and replace the Drive id in `CV_LINK`. Until then, hide the button or point it to LinkedIn.

##### CONTENT-08 · P0 · The thesis year is after the degree ended
**Locations:** `content.ts:651` and `:1283`.

**Current:** `year: 2026`. The degree is listed as "September 2019 – June 2025", and the TEE licence (2025) requires the completed degree.

**Replacement:** `year: 2025` in both languages. If 2026 is a later publication date, see OWNER O-11.

---

#### P1: noticeable

##### CONTENT-09 · P1 · "3 certifications" contradicts the pills beside it
**Locations:** `About.tsx:21` and `:28`; `content.ts:811` and `:1443` (the 4th caption).

**Problem:** The count includes "Career Essentials in Generative AI", a LinkedIn Learning course certificate. The pills right next to it show Jamf 200, ITIL 4 and a TEE licence, which reads as 2 certifications plus a licence. A recruiter sees a mismatch, and the number looks padded. Replace the stat with the strongest metric the site already backs up.

**Replacements:**
- `About.tsx`: delete line 21 (`const certifications = …`).
- `About.tsx:28`: `{ value: 95, suffix: '%+', unit: '' },`
- EN `stats[3]`: `SLA met across 350+ tickets`
- GR `stats[3]`: `τήρηση SLA σε 350+ tickets`

##### CONTENT-10 · P1 · Signature Craft's "open source" claim can't be checked
**Locations:** `content.ts:619–625` and `:1251–1257`.

**Problem:** The project has no `githubLink`, and `github.com/Andrewfragkiadakis/signature-craft` returns 404. The description also uses "stunning".

**Replacements:**
- EN `description`: `An email-signature builder with 32+ templates. Signatures that render correctly in Gmail, Outlook, Apple Mail, Yahoo and Thunderbird — free, with no sign-up.`
- EN `role`: `Solo design and build`
- EN `detail`: `An email-signature builder for a problem every company has and nobody owns: signatures that break the moment they leave your machine. Signature Craft generates table-based HTML that renders consistently across the major mail clients, with no sign-up, no paywall and no tracking.`
- EN `highlights[2]`: `Free, with no sign-up and no tracking`
- GR `description`: `Εργαλείο δημιουργίας email signatures με 32+ templates. Υπογραφές που εμφανίζονται σωστά σε Gmail, Outlook, Apple Mail, Yahoo και Thunderbird — δωρεάν, χωρίς εγγραφή.`
- GR `role`: `Ατομικός σχεδιασμός και υλοποίηση`
- GR `detail`: `Εργαλείο δημιουργίας email signatures για ένα πρόβλημα που έχουν όλες οι εταιρείες: υπογραφές που «σπάνε» μόλις φύγουν από τον υπολογιστή. Παράγει HTML βασισμένο σε πίνακες που εμφανίζεται σωστά στους βασικούς mail clients, χωρίς εγγραφή, χωρίς συνδρομή και χωρίς tracking.`
- GR `highlights[2]`: `Δωρεάν, χωρίς εγγραφή και χωρίς tracking`

The GR detail also drops the informal «σου», to match the formal register used across the site. If the repo is made public instead, add its `githubLink` and keep "Open source".

##### CONTENT-11 · P1 · The GPA differs between languages
**Locations:** `content.ts:512` (EN `GPA: 2.98`) and `:1146` (GR `Μέσος Όρος (GPA): 7.6 / 10`, which also uses a decimal point instead of the Greek comma).

**Replacement:** Delete both lines. The GPA adds nothing for a team-lead profile, and the two scales disagree.

##### CONTENT-12 · P1 · Title and description are stuck on the old positioning
**Locations:** `src/app/layout.tsx:22`, `:25–29`, `:47–58`.

**Current:** `'Andreas Fragkiadakis | IT & Security Engineer'`, plus "SecOps, infrastructure automation, and AI". The keywords include "Next.js Developer", "Frontend Developer Greece" and "IT Support Ελλάδα". None of this mentions Apple, Jamf or 550+.

**Replacement** for the `title` through `twitter` keys:
```ts
title: {
    default: 'Andreas Fragkiadakis | Apple Fleet & IT Automation Lead',
    template: '%s | Andreas Fragkiadakis',
},
description: 'Team Lead for Apple Fleet & IT Automation at Omilia, Athens. Jamf Certified Tech (Jamf 200) running 550+ Macs: zero-touch enrollment, CIS hardening.',
keywords: [
    'Andreas Fragkiadakis', 'Fragkiadakis', 'Apple fleet management', 'Jamf Pro', 'Jamf 200', 'Jamf Certified Tech', 'macOS', 'MDM', 'Apple Business Manager', 'IT automation', 'Endpoint security', 'CIS Benchmarks', 'IT Automation Lead', 'Security Engineer', 'Computer Engineer', 'M.Eng', 'ITIL 4', 'Athens', 'Greece',
    'Ανδρέας Φραγκιαδάκης', 'Φραγκιαδάκης', 'Μηχανικός Πληροφορικής και Υπολογιστών', 'Διαχείριση Mac', 'Αυτοματισμός IT', 'Ασφάλεια τερματικών',
],
```
**In `openGraph`:**
- `locale: 'en_GB'`
- `title: 'Andreas Fragkiadakis | Apple Fleet & IT Automation Lead'`
- `description: 'Apple fleets. Automated. 550+ Macs on Jamf Pro, enrolled zero-touch and hardened to CIS Benchmarks.'`
- Image `alt: 'Andreas Fragkiadakis — Apple fleets. Automated.'`

**In `twitter`:**
- `title: 'Andreas Fragkiadakis | Apple Fleet & IT Automation Lead'`
- `description: 'Apple fleets. Automated. 550+ Macs on Jamf Pro, zero-touch and CIS-hardened.'`
- Remove `creator` (see CONTENT-13).

The description is 148 characters. Metadata uses an ASCII hyphen in "zero-touch".

##### CONTENT-13 · P1 · The Twitter creator handle is invalid
**Location:** `layout.tsx:58`, `creator: '@Andrewfragkiadakis'`.

**Problem:** X handles are at most 15 characters; this one is 18.

**Replacement:** Delete the line.

##### CONTENT-14 · P1 · robots.txt blocks the social card image
**Location:** `src/app/robots.ts:9`, `disallow: ['/opengraph-image'],`.

**Problem:** Twitterbot and LinkedInBot honour robots.txt, so share cards can lose the image.

**Replacement:** Delete the line. Keep `allow: '/'`.

##### CONTENT-15 · P1 · JSON-LD is outdated and exposes a phone number
**Location:** `layout.tsx:97`, `:102`, `:123–129`.

**Replacements:**
- WebSite `description` (`:97`): `'Portfolio of Andreas Fragkiadakis, Team Lead for Apple Fleet & IT Automation: Jamf Pro, endpoint security and automation for 550+ Macs.'`
- `publisher.jobTitle` (`:102`) and Person `jobTitle` (`:123`): `'Team Lead, Apple Fleet & IT Automation'`
- `worksFor` (`:124`): `{ '@type': 'Organization', name: 'Omilia', url: 'https://omilia.com' }`
- Delete `telephone` (`:127`). The site never shows the number, and structured data gets scraped.
- `knowsAbout` (`:129`): `['Jamf Pro', 'Apple Business Manager', 'macOS fleet management', 'Endpoint security', 'CIS Benchmarks', 'Microsoft Sentinel', 'IT automation', 'Python', 'Bash', 'ITIL 4']`
- Add to the Person object:
  - `description: 'Apple fleet and IT automation lead at Omilia: Jamf Pro, endpoint security and automation for 550+ Macs.'`
  - `alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of West Attica' }`
  - `knowsLanguage: ['en', 'el', 'de']`

##### CONTENT-16 · P1 · Career, Projects and Contact are missing from the server HTML
**Location:** `src/components/HorizontalLayout.tsx:13–15` (`{ ssr: false }`).

**Problem:** Non-JS crawlers and link-preview bots (Bing, LinkedIn) never see the work history, projects or email.

**Replacement:** `dynamic(() => import('@/components/dom/Experience'))`, and the same for Projects and Contact. First confirm the components do not touch `window` during render (`LocalTime` and `CopyButton` already guard this).

##### CONTENT-17 · P1 · Vendor and standard names are misspelled
Apply these token replacements exactly:
- **`Checkpoint Harmony EDR` → `Check Point Harmony Endpoint`** at `tools.ts:33` (label) and `content.ts:327`, `:352`, `:358`, `:961`, `:986`, `:992`. `:267` is rewritten in CONTENT-22, and `:446`/`:1080` in CONTENT-01.
- **`DUO MFA` → `Duo MFA`** at `tools.ts:37` and `content.ts:327`, `:358`, `:961`, `:992`.
- **`Anydesk` → `AnyDesk`** at `content.ts:448` and `:1082`.
- **`PCI-DSS` → `PCI DSS`** at `content.ts:268`, `:327`, `:350`, `:351`, `:352`, `:354`, `:445`, `:904`, `:961`, `:984`, `:985`, `:986`, `:988`, `:1079`.
- **`ERASMUS+` → `Erasmus+`**, covered by CONTENT-05.

`tools` arrays are type-checked against `ToolLabel`, so rename the label in `tools.ts` and in both `tools:` arrays together.

##### CONTENT-18 · P1 · Employer and role names: inconsistent casing and EN/GR mismatch
**Problem:** Company names are in all caps ("OMILIA LTD", "KEEP EAT HEALTHY", "ANEMOMYLOI ANDROS AE") next to "Hellenic Army". EN uses long role titles where GR already uses short ones. The long titles wrap to three lines on the Career slide.

**EN replacements:**
- `:431` and `:441`: `Omilia, Athens, Greece`
- `:440`: `IT Engineer` (see OWNER O-3)
- `:454`: `Military Service — IT & Administrative Support`
- `:463`: `IT Support & Infrastructure Coordinator`
- `:464`: `Keep Eat Healthy, Koropi, Greece`
- `:473`: `IT Support Specialist`
- `:474`: `Anemomyloi Andros, Andros, Greece`
- `:484`: `Freelance, Greece`
- `:492`: `Network Systems Technician`

**GR replacements:**
- `:1065` and `:1075`: `Omilia, Αθήνα`
- `:1074`: `IT Engineer`
- `:1088`: `Στρατιωτική θητεία — IT & διοικητική υποστήριξη`
- `:1098`: `Keep Eat Healthy, Κορωπί`
- `:1108`: `Anemomyloi Andros, Άνδρος`

##### CONTENT-19 · P1 · The degree and licence are named six different ways
**Problem:** The site variously says "IT & Computer Engineer", "Computer Science", "IT & Computer Science Engineer", "Computer Science Engineer", "M.Eng. Computer Engineer" and "Integrated Master's in Computer Science (5ετές)". The UniWA department is officially "Informatics and Computer Engineering" (Τμήμα Μηχανικών Πληροφορικής και Υπολογιστών).

**Replacements:**
- EN `:506`: `Integrated Master’s (M.Eng.), Informatics & Computer Engineering`
- GR `:1140`: `Δίπλωμα Μηχανικού Πληροφορικής και Υπολογιστών (Integrated Master)`
- GR `:1142`: `Σεπτέμβριος 2019 – Ιούνιος 2025`
- EN `:547`: `Professional Licence — Informatics & Computer Engineer`
- EN `:553`: `Statutory licence to practise as an Informatics & Computer Engineer in Greece`
- GR `:1179`: `Άδεια Άσκησης Επαγγέλματος — Μηχανικός Πληροφορικής & Υπολογιστών`
- GR `:1185`: `Θεσμοθετημένη άδεια άσκησης επαγγέλματος Μηχανικού Πληροφορικής και Υπολογιστών στην Ελλάδα`

**Short descriptor everywhere else:** EN `Computer Engineer (M.Eng.)`, GR `Μηχανικός Πληροφορικής και Υπολογιστών (M.Eng.)`.

##### CONTENT-20 · P1 · The About lede is abstract and omits the title
**Locations:** `content.ts:805` and `:1437`.

**Problem:** The lede doesn't mention the role. "The work sits where…" is abstract and repeats word for word in the bio dialog. In GR, "πλήρη ευθύνη του Jamf Pro" is ungrammatical.

**Replacements:**
- EN: `A Computer Engineer (M.Eng.) leading Apple Fleet & IT Automation at Omilia, a global conversational-AI company. I own **Jamf Pro end to end**, harden the fleet to CIS Benchmarks, and turn **every repeated task** into code.`
- GR: `Μηχανικός Πληροφορικής και Υπολογιστών (M.Eng.), επικεφαλής Apple Fleet & IT Automation στην Omilia, μια παγκόσμια εταιρεία conversational AI. Έχω **πλήρη ευθύνη για το Jamf Pro**, θωρακίζω τον στόλο κατά CIS Benchmarks και μετατρέπω **κάθε επαναλαμβανόμενη εργασία** σε κώδικα.`

Both are no longer than the current text, so the 1024×768 fit is preserved.

##### CONTENT-21 · P1 · Greek hero sub-line grammar
**Location:** `content.ts:1429`.

**Current:** "Ηγούμαι του Apple Fleet & IT Automation…"

**Replacement:** `Ηγούμαι της ομάδας Apple Fleet & IT Automation στην Omilia: **550+ Mac** στο Jamf Pro, με **zero‑touch** enrollment και θωράκιση κατά CIS Benchmarks.`

##### CONTENT-22 · P1 · Bio dialog: repetition, pipes, missing parity
**Locations:** `content.ts:267–270` and `:903–906`.

**Problem:**
- "550+ device environment" doesn't match the canonical unit.
- GR uses "ηγούμαι" twice in one paragraph.
- GR drops "org-wide".
- "350+ tickets a year" (see CONTENT-24).
- The footer is joined with pipes.
- GR capitalises "Μητρική" mid-phrase.

**EN replacement array:**
1. `I’m a Computer Engineer (M.Eng.) and Team Lead for Apple Fleet & IT Automation at Omilia, a global conversational-AI company. I own Jamf Pro end to end for 550+ Macs and lead endpoint engineering across Check Point Harmony Endpoint, Microsoft Sentinel and SSL certificate automation.`
2. `In practice, that means CIS Benchmark hardening ahead of PCI DSS and SOC 2 audits, and zero‑touch enrollment that cut Mac onboarding time by 70%.`
3. `I also lead AI adoption: Google Gemini org-wide, Atlassian Rovo Agents, and an AI ticket-triage pipeline that cut average triage time across 350+ tickets.`
4. `Jamf Certified Tech (Jamf 200) · TEE-licensed engineer · ITIL 4 Foundation · Athens, Greece · English (C2), Greek (native), German (B2)`

**GR replacement array:**
1. `Είμαι Μηχανικός Πληροφορικής και Υπολογιστών (M.Eng.) και Team Lead της ομάδας Apple Fleet & IT Automation στην Omilia, μια παγκόσμια εταιρεία conversational AI. Έχω πλήρη ευθύνη για το Jamf Pro σε 550+ Mac και ηγούμαι του endpoint engineering για Check Point Harmony Endpoint, Microsoft Sentinel και αυτοματοποίηση πιστοποιητικών SSL.`
2. `Στην πράξη: θωράκιση κατά CIS Benchmarks ενόψει ελέγχων PCI DSS και SOC 2, και zero‑touch enrollment που μείωσε τον χρόνο onboarding των Mac κατά 70%.`
3. `Παράλληλα προωθώ την υιοθέτηση AI: Google Gemini σε όλο τον οργανισμό, Atlassian Rovo Agents και ένα pipeline διαλογής αιτημάτων με AI που μείωσε τον μέσο χρόνο triage σε 350+ tickets.`
4. `Jamf Certified Tech (Jamf 200) · Αδειούχος μηχανικός ΤΕΕ · ITIL 4 Foundation · Αθήνα · Αγγλικά (C2), Ελληνικά (μητρική), Γερμανικά (B2)`

##### CONTENT-23 · P1 · AI claims say "measurably" with no measure
**Locations:** `content.ts:389`, `:391`, `:1023`, `:1025`.

**Problem:** "measurably cut work" and "AI adoption that shows up in the numbers" come with no numbers. The GR detail also uses "Ανέπτυξα" (deployed) and "αναπτύσσω" (develop) in the same sentence.

**Replacements:**
- EN oneLiner: `Gemini org-wide, Rovo Agents and AI ticket triage in Jira.`
- EN detail: `AI that does real work. I rolled out Google Gemini org-wide and Atlassian Rovo Agents, built an AI ticket-triage pipeline for Jira Service Management, and prototype MCP servers so assistants like Claude Code can work with IT systems directly.`
- GR oneLiner: `Gemini σε όλο τον οργανισμό, Rovo Agents και διαλογή αιτημάτων με AI στο Jira.`
- GR detail: `AI που κάνει πραγματική δουλειά. Εισήγαγα το Google Gemini σε όλο τον οργανισμό και τους Atlassian Rovo Agents, δημιούργησα pipeline διαλογής αιτημάτων με AI για το Jira Service Management και αναπτύσσω prototypes MCP servers ώστε βοηθοί όπως το Claude Code να δουλεύουν απευθείας με τα συστήματα IT.`

##### CONTENT-24 · P1 · "350+ tickets a year" vs "350+ tickets resolved"
**Locations:** `content.ts:394` and `:1028`; the bio is covered by CONTENT-22.

**Problem:** The two framings conflict. "350+ tickets" with no period is true under either reading.

**Replacements:**
- EN: `AI ticket triage across 350+ tickets`
- GR: `Διαλογή αιτημάτων με AI σε 350+ tickets`

##### CONTENT-25 · P1 · Contact and CTA copy: EN/GR mismatch and filler
**Locations:** `content.ts:855`, `:1487`, `:817`, `:1449`.

**Problem:** GR drops "full-time roles". "interesting collaborations" and "unique project" are filler.

**Replacements:**
- EN sub: `Open to **full-time roles** and **freelance projects**.`
- GR sub: `Ανοιχτός σε **θέσεις πλήρους απασχόλησης** και **freelance projects**.`
- EN `ctaLead`: `Have a project in mind?`
- GR `ctaLead`: `Έχετε κάποιο project στο μυαλό σας;`

Advertising availability while employed is an owner decision (O-8).

##### CONTENT-26 · P1 · "All projects on GitHub" is false
**Locations:** `content.ts:847` and `:1479`.

**Problem:** GitHub has only 5 public repos. Plano Plus, Signature Craft, Nexus, Schiller, the research report and the wheelchair project aren't there.

**Replacements:**
- EN: `More on GitHub`
- GR: `Περισσότερα στο GitHub`

##### CONTENT-27 · P1 · "Send a message" opens Gmail web with a freelance subject
**Location:** `Contact.tsx:19` and the `<a href={gmailComposeUrl}…>` below it.

**Problem:** Visitors who use Outlook, or aren't signed in to Gmail, land on a login page. The subject is "Project Collaboration // Andreas Technology".

**Replacements:**
- `Contact.tsx:19`: ``const mailtoUrl = `mailto:${t.email}?subject=${encodeURIComponent('Hello from andreas.technology')}` ``
- The anchor: `<a href={mailtoUrl} className="kn-pill kn-pill--fill">{k.contact.send}</a>`. This drops `target`, `rel` and the "(opens in a new tab)" aria suffix.

##### CONTENT-28 · P1 · Project stage captions read like feature lists
**Problem:** The stage caption is `line-clamp-2`, so only about two lines show. The current text is feature lists with filler ("modern UI/UX", "stunning", "Perfect for wild nights with friends", "Never disturb your neighbors again!"). EN also contains Greek script ("Παλέρμο, Πες Βρες").

**Plano Plus:**
- EN `:603`: `A fast, premium website for a signage and visual-identity studio in Crete, built on Next.js, with a contact form that lands straight in the client’s inbox.`
- GR `:1235`: `Γρήγορη, premium ιστοσελίδα για στούντιο επιγραφών και οπτικής ταυτότητας στην Κρήτη, με Next.js και φόρμα επικοινωνίας που φτάνει κατευθείαν στο inbox του πελάτη.`

**Silence Hero:**
- EN `:670`: `A Chrome extension that shows, at a glance, whether it’s Greek quiet hours — with a countdown to the next change.`
- GR `:1302`: `Επέκταση Chrome που δείχνει με μια ματιά αν είναι ώρες κοινής ησυχίας, με αντίστροφη μέτρηση για την επόμενη αλλαγή.`
- GR `:1304`, to fix the register: `Μικρή επέκταση Chrome με έναν και μόνο σκοπό: παρακολουθεί τις ώρες κοινής ησυχίας στην Ελλάδα και δείχνει με μια ματιά αν είναι καλή στιγμή να τρυπήσετε τον τοίχο. Οπτική ένδειξη και ζωντανή αντίστροφη μέτρηση.`

**Nexus Party App:**
- EN `:686`: `Six Greek party games in one installable PWA — Quizball, Taboo, Palermo, Pes Vres, Impostor and Truth or Dare — with automatic scoring, timers and custom rules.`
- EN `:690`: `Six multiplayer games: Quizball, Taboo, Palermo, Pes Vres, Impostor, Truth or Dare`
- GR `:1318`: `Έξι ελληνικά παιχνίδια για πάρτι σε μία εγκαταστάσιμη PWA — Quizball, Taboo, Παλέρμο, Πες Βρες, Impostor και Truth or Dare — με αυτόματη βαθμολογία, χρονόμετρα και δικούς σας κανόνες.`

**HappyFox:**
- `name`, EN `:701`: `HappyFox - Mental Health App`
- `name`, GR `:1333`: `HappyFox - Εφαρμογή Ψυχικής Υγείας` (both drop the 🦊, which screen readers announce in image alt text)
- EN `:704`: `A mental-health app concept for low-energy days, built around a daily check-in that takes under a minute. Team project at SRH Heidelberg.`
- GR `:1336`: `Concept εφαρμογής ψυχικής υγείας για μέρες χαμηλής ενέργειας, με καθημερινό check-in που ολοκληρώνεται σε λιγότερο από ένα λεπτό. Ομαδικό έργο στο SRH Heidelberg.`
- Note: the linked repo is a fork of `Chinmayee1398/Mental-Health-Project`. That's acceptable for a team project.

**Schiller:**
- EN `:722`: `The website for Schiller Language Centers in Rethymno, Crete: English, German and Educational Robotics courses, kept current by the school’s own staff.`
- GR `:1354`: `Η ιστοσελίδα των κέντρων ξένων γλωσσών Schiller στο Ρέθυμνο: προγράμματα Αγγλικών, Γερμανικών και Εκπαιδευτικής Ρομποτικής, που ενημερώνει το ίδιο το προσωπικό της σχολής.`

**Friendly Wheelchair:**
- EN `:771`: `A project plan and technical specification for an AI-assisted self-driving wheelchair, scoped for the Heidelberg clinics.`
- GR `:1403`: `Πλάνο διαχείρισης έργου και τεχνικές προδιαγραφές για αυτόνομο αναπηρικό αμαξίδιο με AI, για τις κλινικές της Χαϊδελβέργης.`

**Raspberry Pi:**
- GR `:1370`: `Παραμετροποίηση Raspberry Pi για αποκλεισμό διαφημίσεων σε όλο το δίκτυο (Pi-hole) και media streaming (Plex) στο σπίτι.`

##### CONTENT-29 · P1 · Thesis title untranslated in GR; GR detail is incomplete
**Locations:** `content.ts:650`, `:653`, `:655`, `:1282`, `:1285`, `:1287`.

**Problem:** `splitName` turns "Thesis: …" into a stage title that just says "Thesis". The GR name is in English. The GR detail drops the "Published as…" sentence. EN uses straight quotes.

**Replacements:**
- EN `name`: `Radio over Fiber for 5G - M.Eng. Thesis`
- GR `name`: `Radio over Fiber για 5G - Διπλωματική Εργασία`
- EN `description`: `M.Eng. thesis on Radio over Fiber: where hybrid wireless-optical networks change the cost of 5G. Comes with an interactive slide deck.`
- GR `description`: `Διπλωματική εργασία για το Radio over Fiber: πού τα υβριδικά ασύρματα-οπτικά δίκτυα αλλάζουν το κόστος του 5G. Συνοδεύεται από διαδραστική παρουσίαση.`
- EN `detail`: in the last sentence, replace the straight quotes with curly ones: `…Published as “New Hybrid Wireless Optical Networks (Radio Over Fiber) for 5G Networks”.`
- GR `detail`: append ` Δημοσιεύτηκε ως «New Hybrid Wireless Optical Networks (Radio Over Fiber) for 5G Networks».`

##### CONTENT-30 · P1 · Experience bullets: vague claims and EN/GR gaps
**Team Lead role:**
- EN `:435`: `Lead automation engineering in Bash, Python and TypeScript — Jamf API, AI ticket triage, MCP server prototypes and SSL renewal infrastructure`
- GR `:1069`: `Ηγεσία automation engineering σε Bash, Python και TypeScript — Jamf API, διαλογή αιτημάτων με AI, prototypes MCP servers και υποδομή ανανέωσης SSL`

**IT Engineer role:**
- EN `:447`: `Built a centralised SSL renewal pipeline (acme.sh, Let’s Encrypt, DNS-01) for Cisco ISE, ESXi, Proxmox and HPE iLO, ending manual certificate renewals`
- GR `:1081`: `Κατασκευή κεντρικού pipeline ανανέωσης SSL (acme.sh, Let's Encrypt, DNS-01) για Cisco ISE, ESXi, Proxmox και HPE iLO — τέλος στις χειροκίνητες ανανεώσεις πιστοποιητικών`
- GR `:1083`: `Προώθηση εταιρικής υιοθέτησης AI: Gemini σε όλο τον οργανισμό, Atlassian Rovo Agents και pipeline διαλογής αιτημάτων με AI`

**Web Developer** (drops "measurable gains" that come with no measure):
- EN `:487`: `Built and launched client websites end to end: domain, DNS, SSL/TLS, hosting, MySQL, WordPress and SEO`
- EN `:488`: `Improved organic search visibility with structured data and performance tuning`
- GR `:1122`: `Βελτίωση της οργανικής προβολής στις μηχανές αναζήτησης με structured data και βελτιστοποίηση απόδοσης`

**Weballdesign:**
- GR `:1128`: `2020 – Νοέμβριος 2022`
- GR `:1130`: `Εγκατάσταση και παραμετροποίηση συστημάτων server/client σε εκπαιδευτικά ιδρύματα`
- GR `:1131`: `Συντήρηση δικτυακού εξοπλισμού (routers, switches, UPS) και διαγνωστικοί έλεγχοι`
- GR `:1132`: `Εκπαίδευση προσωπικού και τεκμηρίωση διαδικασιών`

##### CONTENT-31 · P1 · The public README describes the old site
**Location:** repo-root `README.md`.

**Problem:**
- Line 14 says "IT & Security Engineer … blob cursor".
- Lines 33–35 list Blob cursor, LetterGlitch, SpotlightCard and LogoLoop.
- Line 50 has a Font Awesome badge.
- `docs/bento-infographic.svg` and the line 20 alt text say "Blob cursor · spotlight cards · logo loop".

**Replacements:**
- Line 14: `Personal portfolio and CV for **Andreas Fragkiadakis**, Team Lead for Apple Fleet & IT Automation (M.Eng.). A product-launch-style site: seven slides on a horizontal track, bilingual EN/GR, light and dark.`
- Features list (replace lines 31–37):
  ```
  - **Seven slides** – A horizontal track on desktop with snapping and dot navigation; a vertical stack on phones
  - **Product-page design** – Neutral surfaces, one interactive blue, San Francisco / Inter type scale
  - **Sheets, not pages** – Bio, roles, services and projects open in dialogs (bottom sheets on phones)
  - **Bilingual** – English / Greek with persisted preference
  - **Theme** – Light and dark mode
  - **Accessible** – Keyboard navigation, visible focus, reduced-motion support
  - **SEO** – Canonical URL, JSON-LD (WebSite + Person), Open Graph image, sitemap
  ```
- Delete line 50 (Font Awesome badge). On lines 49 and 80, change "Framer Motion" to `Motion`.
- In the SVG, change the "Playful micro-UI" tile text to `Product-page UI` / `Slides · sheets · dot navigation`, and update the line 20 alt text to match.
- `andreas-technology-v3/README.md` is create-next-app boilerplate (it mentions Geist). Replace it with one line: `See the repository README.` Delete the obsolete `andreas-technology-v3/docs/title-locations.md` (typewriter guide).

##### CONTENT-32 · P1 · Projects don't show the job the site sells
**Problem:** The headline is "Apple fleets. Automated.", but the 11 projects are websites, a party game and student work. Not one shows fleet or automation work.

**Apply now:** Reorder `projects` (EN and GR, same order) by relevance: Signature Craft, Portfolio Website, Radio over Fiber thesis, Raspberry Pi, Plano Plus, Schiller, LLMs research review, Nexus Party App, Silence Hero, HappyFox, Friendly Wheelchair.

**OWNER:** Add one sanitised automation case study (O-12).

##### CONTENT-33 · P1 · OWNER decision: publishing the employer's security stack
**Problem:** The Omilia bullets name the employer next to its EDR, SIEM, NAC (Cisco ISE), hypervisors, HPE iLO, the remote-access tool (AnyDesk) and the physical-access system (HID). Together that is a reconnaissance map, and it may breach employer policy.

**If Andreas agrees to sanitise, apply these instead of the versions in CONTENT-01, CONTENT-17 and CONTENT-30:**
- EN `:447`: `Built a centralised certificate renewal pipeline (acme.sh, Let’s Encrypt, DNS-01) for network, virtualisation and server-management infrastructure, ending manual renewals`
- EN `:448`: `Engineered Microsoft Sentinel SIEM integration with Python log collectors (RFC 5424 over TLS), unifying endpoint and access telemetry`
- GR `:1081`: `Κατασκευή κεντρικού pipeline ανανέωσης πιστοποιητικών (acme.sh, Let's Encrypt, DNS-01) για υποδομές δικτύου, virtualization και διαχείρισης servers — τέλος στις χειροκίνητες ανανεώσεις`
- GR `:1082`: `Υλοποίηση ενσωμάτωσης Microsoft Sentinel SIEM με Python log collectors (RFC 5424 μέσω TLS) για telemetry τερματικών και πρόσβασης`

---

#### P2: polish

##### CONTENT-34 · P2 · Greek UI strings drift from EN
- `:1424`: `toLight: "Αλλαγή σε φωτεινό θέμα"`, `toDark: "Αλλαγή σε σκοτεινό θέμα"`
- `:1426`: `skip: "Παράλειψη εισαγωγής"`
- `:1455`: the specs eyebrow becomes `Εργαλεία`, to match the nav label as EN does
- `:1496`: `copyFailed: "Η αντιγραφή απέτυχε"`
- `:1432`: `Jamf Certified Tech (Jamf 200) · Αθήνα, Ελλάδα`

##### CONTENT-35 · P2 · Hard-coded English labels for screen readers
**Locations:** `Navigation.tsx:93` ("Main navigation"), `Navigation.tsx:174` (the mobile menu `<nav>` is labelled `k.nav.openMenu`, i.e. "Open menu"), `DotNav.tsx:25` ("Slides").

**Replacements:**
- Add to `KeynoteCopy.nav` and both blocks:
  - EN: `main: "Main navigation", menu: "Menu", slides: "Slides"`
  - GR: `main: "Κύρια πλοήγηση", menu: "Μενού", slides: "Διαφάνειες"`
- Use them as `aria-label={k.nav.main}`, `{k.nav.menu}` and `{labels…}`. DotNav would need `useContent()`.
- The layout's "Skip to content" can stay EN, because it is server-rendered under `lang="en"`.

##### CONTENT-36 · P2 · Two GR service titles left in English
- `:996`: `Διαχείριση Στόλου Apple`
- `:1022`: `Λειτουργίες IT με AI`
- "IT Service Management" stays; it's a standard term.

##### CONTENT-37 · P2 · Typography
- **Curly apostrophes in rendered EN copy:**
  - `:791` and `:818`: `Let’s talk`
  - `:854`: `Let’s build\nsomething.`
  - `:554`: `Requires an accredited five-year integrated Master’s degree`
  - `:706`: `…during a Master’s course…`
  - `:510`: becomes `Active member of the university’s Tech Society` (see CONTENT-40)
  - Leave the brand `Let's Encrypt` in `tools.ts` as is.
- **Adverb "end to end":** `:365` → `I own Jamf Pro end to end for a 550+ Mac fleet.` and keep the rest of that sentence.
- **Non-breaking spaces (U+00A0):** use them in `Jamf 200`, `ITIL 4`, `SOC 2`, `RFC 5424`, `550+ Macs` and `550+ Mac` inside oneLiners, details and highlights.
- **Greek quotes:** use «» in GR prose; this is already handled in CONTENT-04 and CONTENT-29.

##### CONTENT-38 · P2 · "70% faster" doesn't match "cut onboarding time by 70%"
- EN `:363`: `550+ Macs on Jamf Pro. Zero‑touch enrollment, 70% less onboarding time.`
- EN `:368`: `Zero‑touch enrollment: 70% less onboarding time`
- EN `:811` `stats[1]`: `less onboarding time, zero‑touch`
- GR `:997`: `550+ Mac στο Jamf Pro. Zero‑touch enrollment, 70% λιγότερος χρόνος onboarding.`
- GR `:1002`: `Zero‑touch enrollment: 70% λιγότερος χρόνος onboarding`
- GR `:1443` `stats[1]`: `λιγότερος χρόνος onboarding, zero‑touch`

##### CONTENT-39 · P2 · Copyright line
- EN `:869`: `© 2026 Andreas Fragkiadakis. All rights reserved.`
- GR `:1501`: `© 2026 Ανδρέας Φραγκιαδάκης. Με την επιφύλαξη παντός δικαιώματος.`

##### CONTENT-40 · P2 · Education detail wording
- EN `:510`: `Active member of the university’s Tech Society`. The GR text already says "Ενεργό μέλος"; "Distinguished" was puffery.
- EN `:721` tag "Educational" → `Education`

##### CONTENT-41 · P2 · Image alt text is the raw project name
**Locations:** `Device.tsx:48`, `:60`; `ProjectImage.tsx:47`.

**Problem:** The alt text is the raw `project.name`, which carries " - " and the emoji.

**Replacement:** `alt={[splitName(project.name).title, splitName(project.name).subtitle].filter(Boolean).join(', ')}`, importing `splitName` from `@/utils/format`.

##### CONTENT-42 · P2 · Dead copy contains wrong or stale text
None of these are rendered:
- `name`, `title`, `phone`, `nav`
- `about.title`, `subtitle`, `tagline`, `readMore`, `showLess`, `currentFocus*`, `statsLabels`, `credentialsLabel`
- `hero.*`: the typewriter has "ITIL V4", "SCRIPTING EXPERT", "PROBLEM SOLVER"
- `contact.*`: "Let's build something amazing together"; the GR version lacks full-time and has unaccented "Διαθεσιμος για νεες προκλησεις"
- `cursor`, `skillsTitle`
- `servicesTitle`, `servicesSubtitle`, `servicesCta*`, `servicesLabels`
- `services[].description` (still says "measurably")
- `experienceTitle`, `educationTitle`, `projectsTitle`, `experienceSection`, `projectsSection`, `cinematicEntry`, `contactTitle`
- `keynote.projects.role`

**Recommendation:** Remove these from the `Content` interface and both blocks. At minimum, never publish them unfixed. Also uninstall `typewriter-effect`, which `STYLE.md` notes is unused.

##### CONTENT-43 · P2 · tools.ts
- `:24`: the comment should say `keynote.specs.groups`, not `keynote.services.groups`.
- `:59` "Grok Bot": confirm the label (the product is "Grok", from xAI). If it's the public product, use `Grok` in `tools.ts:59` and in `content.ts:397` and `:1031`.

##### CONTENT-44 · P2 · GR tag parity
- `:1335`: `["UI/UX Design", "Figma", "Ομαδικό έργο", "SRH Heidelberg"]`
- `:1353`: `["Wix", "Wix Studio", "Web Development", "Εκπαίδευση"]`

##### CONTENT-45 · P2 · Spelling standard
The copy is mostly en-GB (centralised, licence, programme). Keep "enrollment", which is Apple's product term.
- EN `:416`, `:417`, `:421`: `virtualization` → `virtualisation`
- Metadata `locale: 'en_GB'` (in CONTENT-12)

##### CONTENT-46 · P2 · The ITIL "Verify" link is a self-hosted PDF
**Problem:** The PDF shows the certificate and candidate numbers, and the name reads "Andrew Fragkiadakis".

**Owner action:** Redact the candidate number, or link to a PeopleCert/Credly badge if one exists. Keep the button label "Verify".

##### CONTENT-47 · P2 · hreflang
GR is a client-side toggle on the same URL, so Greek content is never indexed. **Do not add hreflang** until a real `/el` route exists. Canonical (`https://andreas.technology`) and the sitemap are fine.

##### CONTENT-48 · P2 · Recruiter friction (owner decision)
- The first-visit "Hello. / Enter" gate puts a click in front of the value proposition.
- `main`'s hero had LinkedIn, GitHub and email icons; this branch removed them.
- Option: under the hero buttons, add a line `LinkedIn · GitHub` using `kn-link`.

---

#### Needs owner confirmation (do not apply automatically)

- **O-1 · Omilia dates overlap.** The IT Engineer role runs Sep 2024 – **May 2026** and Team Lead starts **April 2026**. If the promotion was in April, use EN `:442` `September 2024 – March 2026` and GR `:1076` `Σεπτέμβριος 2024 – Μάρτιος 2026`.
- **O-2 · Military service overlaps Omilia.** Service runs Nov 2025 – Aug 2026, which overlaps both Omilia roles, including leading a team. Recruiters will ask. If he served while keeping the role, add a task: EN `Served while retaining my role at Omilia`, GR `Παράλληλα με τον ρόλο μου στην Omilia`. The "Then" list is also not in date order (Army ends after the IT Engineer role).
- **O-3 · Earlier Omilia title.** The CV says "Information Technology **Support** Engineer"; the site says "Information Technology Engineer". It must match the contract and LinkedIn.
- **O-4 · Concurrent roles.** Keep Eat Healthy (to Nov 2025) overlaps Omilia by 14 months. Anemomyloi (Jan 2023 – Feb 2024) overlaps Keep Eat Healthy and the Erasmus semester in Germany. Freelance and Weballdesign overlap university. If any were part-time, add ` (part-time)` / ` (μερική απασχόληση)` to the role title.
- **O-5 · Research project.** What did he actually produce? If he did run his own Python analysis, re-add the highlight `Own replication analysis in Python` / `Δική μου ανάλυση αναπαραγωγής σε Python`.
- **O-6 · Ticket count.** Is 350+ a year or a total? CONTENT-24 removes "a year" for safety.
- **O-7 · Team size.** For a Team Lead, add a quantified bullet: EN `Lead a team of N engineers…`.
- **O-8 · Availability.** Advertising "Open to full-time roles" while employed is his call. Remote or relocation preference is missing. If true, EN `Open to **full-time roles** and **freelance projects**, in Athens or remote.`
- **O-9 · Security stack.** Approve or reject the sanitisation in CONTENT-33.
- **O-10 · Degree wording.** Check the exact diploma name behind CONTENT-19.
- **O-11 · Thesis date.** If the thesis was published in 2026 in the UniWA repository, keep `year: 2025` and add "(published 2026)" to the role.
- **O-12 · Automation case study.** A sanitised case study (e.g. "Zero‑touch Mac onboarding") would need its own image. Separately, `github.com/Andrewfragkiadakis/PiHolePlus` ("Custom Network Security Gateway – DNS filtering appliance extending Pi-hole", Python, Dec 2025) fits the security positioning better than the 2024 Raspberry Pi entry. If it's the same appliance, add its `githubLink`.
- **O-13 · Signature Craft repo.** If he publishes it, add the `githubLink` and restore "Open source".

I could not verify the TEE licence (2025) or the Career Essentials certificate (2024); neither has a link.

---

#### Facts sheet: canonical values every place must match

| Fact | EN | GR | Where it appears |
|---|---|---|---|
| Name | Andreas Fragkiadakis | Ανδρέας Φραγκιαδάκης | nav, hero, OG, JSON-LD, README (the ITIL certificate is issued to "Andrew") |
| Current title (official) | Team Lead, Apple Fleet & IT Automation | same (English) | Experience, OG sub, JSON-LD `jobTitle`, résumé |
| Positioning line (SEO) | Apple Fleet & IT Automation Lead | — | `<title>`, OG/Twitter title |
| Short descriptor | Computer Engineer (M.Eng.) | Μηχανικός Πληροφορικής και Υπολογιστών (M.Eng.) | bio, metadata |
| Employer | Omilia (global conversational-AI company), Athens | Omilia, Αθήνα | Experience, bio, JSON-LD `worksFor` (url https://omilia.com) |
| Current role dates | April 2026 – Present | Απρίλιος 2026 – Σήμερα | Experience |
| Previous Omilia role | IT Engineer, September 2024 – May 2026 (see O-1, O-3) | IT Engineer, Σεπτέμβριος 2024 – Μάιος 2026 | Experience |
| Fleet | **550+ Macs** (550+ macOS endpoints in experience; 550+ devices only for EDR) | 550+ Mac | hero, stat, services, bio, experience, OG, meta |
| Onboarding | zero‑touch enrollment cut onboarding time by 70% | μείωση χρόνου onboarding κατά 70% | hero, stat, services, bio, experience |
| Tickets / SLA | 350+ Jira tickets at 95%+ SLA (no "a year") | 350+ tickets με SLA 95%+ | stat 4, ITSM tile, experience, bio |
| Docs / platforms | 40+ Confluence guides; 9 enterprise platforms | 40+ οδηγοί Confluence; 9 εταιρικές πλατφόρμες | ITSM tile, experience |
| Device lifespan | +18 months (Keep Eat Healthy) | +18 μήνες | experience |
| Years in IT | **6+** (since 2020, as of Oct 2026) | 6+ έτη | About stat |
| About stats | 550+ · 70% · 6+ yrs · 95%+ SLA | same | About.tsx + `keynote.about.stats` |
| Jamf credential | Jamf Certified Tech — Jamf Pro (Jamf 200); short "Jamf Certified Tech (Jamf 200)"; badge "Jamf 200"; issued 11 Sep 2026, expires 9 Sep 2029; Credly `05e1f049-…` | same | hero note, education, services, bio, OG, JSON-LD |
| ITIL | ITIL 4 Foundation Certificate in IT Service Management · **PeopleCert** · **2025** (effective 6 Nov 2025, renew by 6 Nov 2028); badge "ITIL 4" | same | education, bio, JSON-LD |
| TEE licence | Professional Licence — Informatics & Computer Engineer · Technical Chamber of Greece (TEE) · 2025; badge "TEE licence" | Άδεια Άσκησης Επαγγέλματος — Μηχανικός Πληροφορικής & Υπολογιστών · ΤΕΕ; badge "ΤΕΕ" | education, bio, stats caption |
| Degree | Integrated Master’s (M.Eng.), Informatics & Computer Engineering · University of West Attica · Sep 2019 – Jun 2025 (no GPA) | Δίπλωμα Μηχανικού Πληροφορικής και Υπολογιστών (Integrated Master) · Πανεπιστήμιο Δυτικής Αττικής · Σεπτέμβριος 2019 – Ιούνιος 2025 | education, JSON-LD `alumniOf` |
| Erasmus+ | Exchange semester, M.Sc. Applied Computer Science, SRH Hochschule Heidelberg, Apr–Oct 2023 (**not a degree**) | Εξάμηνο Erasmus+ | education, résumé |
| Other certificate | Career Essentials in Generative AI · Microsoft & LinkedIn · 2024 (course; not counted in stats) | same | education |
| Thesis year | 2025 | 2025 | projects |
| Location / time | Athens, Greece · Europe/Athens | Αθήνα, Ελλάδα | contact, hero note, JSON-LD |
| Languages | English (C2), Greek (native), German (B2) | Αγγλικά (C2), Ελληνικά (μητρική), Γερμανικά (B2) | bio dialog, JSON-LD `knowsLanguage` |
| Contact | andrewfragkiadakis@gmail.com · linkedin.com/in/andreas-fragkiadakis · github.com/Andrewfragkiadakis; **phone not published** | same | contact, JSON-LD |
| Site | https://andreas.technology (canonical, no trailing slash) | — | metadata, sitemap, robots |
| Brand spellings | Check Point Harmony Endpoint · Duo MFA · AnyDesk · PCI DSS · SOC 2 · CIS Benchmarks · Erasmus+ · Microsoft Entra ID · Apple Business Manager · Jamf Pro · Self Service | same | everywhere |
| Spelling standard | en-GB, except Apple/Jamf product terms ("enrollment") | Greek: «», `;` as the question mark, no tonos on all-caps | everywhere |

---

## Appendix B: Motion and runtime-performance audit, verbatim

**Overrides from the plan (they win over the text below):**
- **MOTION-01 and MOTION-12:** superseded by the `ThemeContext` in task **2.2** (`useSyncExternalStore`, `paint()`).
- **MOTION-02:** use `src/utils/track.ts` from task **3.2**, not the `smooth-scroll.ts` replacement shown here. Its signature is `scrollToSection(index, { instant })`. The snap CSS uses `@variant md` / `@variant stack` (task 3.3) instead of raw `min-width` / `max-width` queries.
- **MOTION-04:** use `stack:!transform-none` instead of `max-md:` (the `md` variant is custom after 3.1). Keep `useIsDesktop` in `HorizontalLayout`; tasks 3.5 and 3.8 need it.
- **MOTION-06** and the intro parts of **PERF-01** (`data-entered`, `data-intro-seen`, the intro click handler, `html:not([data-entered])`): **skip them; D1 removes the intro.** Use the head script from task **4.3**.
- **PERF-03:**
  - Option B is implemented as in **5.3**: `[lang]` routes with a `next.config` rewrite of `/` → `/en`. It does not use `proxy.ts` or cookies.
  - Option A is not needed.
- **Any `@media (max-width: 63.99rem)` / `(min-width: 64rem)`** in the snippets below becomes `@variant stack` / `@variant md`.
- **Section 4 "Phases" and "How to verify":** the plan's P0–P11 replace the phases. The probe scripts referenced here may have been deleted; the e2e suite from P0 is the source of truth.

### Motion and runtime performance audit: Apple Keynote (`andreas-technology-v3`)

**Scope and method.** I read every file in `src/` (including `globals.css`) plus `STYLE.md`, `next.config.ts` and `package.json`. Bundle sizes come from the existing production build in `.next/` (BUILD_ID `UBPxcltHH5f-3_BIT41cl`). Runtime numbers come from headless Chromium 141 (Playwright) and Lighthouse 12, run against the `next start -p 3011` server another process was already running on that same build.

- Throttled phone probes use real 4x CPU throttling plus 150 ms RTT and 1.6 Mbps. Lighthouse uses its own simulated throttling.
- Headless frame rates are not meaningful, so I report counts (layouts, style recalcs, React commits) instead of FPS.
- **No repo files were changed and `next build` was not run.** Probe scripts, traces and screenshots are in `C:\Users\Andrew\AppData\Local\Temp\claude\audit-motion\` (they import Playwright from `C:\Users\Andrew\AppData\Local\Temp\claude\pwtool\`).

#### Key numbers today

| Metric | Measured |
|---|---|
| Lighthouse mobile (first visit) | Perf 85. FCP 1.3 s, **LCP 3.8 s** (element: intro memoji), TBT 220 ms, CLS 0. Main thread 3.8 s (script 1.35 s, style/layout 1.06 s). Unused JS 66 KiB |
| Lighthouse desktop | Perf 100. LCP 0.8 s |
| Returning visitor, desktop, unthrottled | FCP 144 ms, **LCP 1648 ms** (hero "Apple fleets.") |
| Returning visitor, phone probe (4x CPU, slow 4G) | FCP 1216 ms, **LCP 4576 ms** (hero lede). Summed long tasks 825 ms |
| Light-theme phone | `<html>` flips **light → dark → light** during hydration. Screencast shows an all-black screen for about 400 ms |
| Initial JS | **228.1 KiB gzip** (201 KB brotli). `content.ts` alone is 23.6 KB gzip, both languages |
| Fonts | **103 KB of Inter preloaded on every device**, including Apple devices that never use it (system font comes first) |
| Desktop wheel and keyboard | 1 wheel notch or 3 notches → snaps back to the same slide. ArrowDown snaps back. ArrowLeft/Right do nothing |
| 3-slide scroll sweep | 90 layouts, 87 of them caused by the DotNav `width` transition |
| INP proxy, language toggle (4x CPU) | 320 ms desktop, 408 ms phone |

#### Already fine (keep)

- Only 10–11 compositor layers. One `will-change` (the track), which is appropriate.
- Chevron nudge, (+) opacity and pill colour changes are cheap.
- `CountUp` writes `textContent` directly, so React never re-renders per frame.
- CLS is 0–0.003 everywhere I measured.
- `next/image` with `sizes`; the mark image is preloaded.
- Every listener and timer is cleaned up; I found no memory leaks.
- `MotionConfig reducedMotion="user"` is in place. `typewriter-effect` is in `package.json` but is **not** bundled.

---

### Section 1: Animation inventory

"Main" means JS runs every frame. "WAAPI" means compositor (Motion only accelerates `opacity`, `transform`, `clipPath`, `filter` and `backgroundColor`, per `motion-dom/.../waapi/supports/waapi.mjs:37-41`). So **every `x`, `y` and `scale` animation in this codebase runs on the main thread.**

| # | Where | Trigger | Animates | Timing | Runs on | Reduced motion | Finding |
|---|---|---|---|---|---|---|---|
| A1 | HorizontalLayout.tsx:33,49-52,144-146 | vertical scroll (desktop) | track `transform: translateX(-p·600vw)` via Motion `x` | scroll-linked | main (style write each scroll frame, plus target offset reads) | still moves (correct) | MOTION-04 |
| A2 | HorizontalLayout.tsx:63-99 | 140 ms after last scroll event, if \|v\| ≤ 0.08 | `window.scrollTo` every frame | 0.7 s, [0.22,1,0.36,1] | main | disabled (deck can rest between slides) | MOTION-02 |
| A3 | HorizontalLayout.tsx:101-122 | resize (150 ms debounce) | instant `scrollTo` | none | main | none | MOTION-02 |
| A4 | smooth-scroll.ts:29-51 | nav links, DotNav, hero pills, services link | rAF `window.scrollTo` | 1.2 s easeOutCubic for any distance, not cancellable | main | instant | MOTION-02 |
| A5 | keynote.tsx:39-48 (used at Projects.tsx:76) | scroll-linked, desktop | scale 0.9→1, opacity 0.4→1 | scroll-linked | main, element not promoted | gate → 0 | MOTION-04 |
| A6 | keynote.tsx:127-138 `Headline` | whileInView 50% once, or `play` | opacity 0→1 (WAAPI), y 24→0 (main) | 1 s, EASE_APPLE | mixed | y dropped, fade kept | MOTION-05, PERF-01 |
| A7 | keynote.tsx:141-151 `Rise` (≈30 call sites) | whileInView 20% once, or `play` | same as A6 | 1 s + 0–0.7 s delay | mixed | same | MOTION-05 |
| A8 | keynote.tsx:154-176 `CountUp` | in view 60% once | `textContent` 0→N | 1.6 s, [0.16,1,0.3,1] | main (text relayout each frame) | jumps to final | MOTION-05 |
| A9 | HeroOverlay.tsx:34-76 | `useSiteEntered()` (post-hydration or Enter) | mark, eyebrow, h1, lede, pills, note: opacity + y | 1 s; delays 0/0.1/0.2/0.4/0.55/0.7 | mixed | fade only | PERF-01 |
| A10 | CinematicEntry.tsx:54-87 | mount (first visit) | mark y16 + fade 1 s; "Hello." 1 s; Enter pill delay 0.5 + 1 s; overlay exit opacity 0.7 s | EASE_APPLE | mixed | fade only | MOTION-06, PERF-01 |
| A11 | DotNav.tsx:39 | active slide change | `width` 8↔24 px, background-color | 500 ms ease-apple (CSS) | main (layout every frame) | CSS kills it | MOTION-10 |
| A12 | Navigation.tsx:120,132 | hover / active | color | 300 ms, Tailwind default curve | paint | killed | MOTION-13 |
| A13 | Navigation.tsx:94 | menu open | nav background-color (blur toggles off instantly) | 300 ms | paint | killed | ok |
| A14 | Navigation.tsx:153-156 | menu toggle | `rotate` transitions, but `top` jumps 2/8→5 px instantly | 300 ms | main | killed | MOTION-11 |
| A15 | Navigation.tsx:166-191 | menu open/close | panel opacity; items y −6→0 + fade, 30 ms stagger | 0.25 s (Motion default ease); 0.4 s EASE_APPLE | mixed | fade only | MOTION-13 |
| A16 | Modal.tsx:87-122 | open/close | wrapper opacity; scrim `backdrop-blur(20px)`; panel opacity + y 48→0, exit y 32 | 0.18 s default; 0.45 s apple in and out | mixed | fade only | MOTION-07 |
| A17 | Projects.tsx:77-93 | line-up click | stage opacity + y 16→0, exit y −8, `mode="wait"` | 0.5 s + 0.5 s = 1 s | mixed | fade only | MOTION-08 |
| A18 | Projects.tsx:132-149 | row tap (phones) | `height` 0↔auto + opacity | 0.45 s apple | main (layout every frame) | **still animates** (height is not a transform) | MOTION-09 |
| A19 | ThemeContext.tsx:72-95 | theme toggle | View Transition, clip-path circle on `::view-transition-new(root)` | 650 ms [0.22,1,0.36,1] | compositor (VT) | falls to A20 | MOTION-12 |
| A20 | globals.css:134-140 | theme toggle without VT, or reduced motion | bg, color, border-color, **box-shadow** on every element, `!important` | 0.3 s `ease` | main | this is the RM path | MOTION-12 |
| A21 | ThemeToggle.tsx:27 | mount | icon opacity 0→1 | 150 ms | compositor | killed | ok |
| A22 | CopyButton.tsx:73-84 | copy result | label y 100%→0 / −100%, `popLayout` | 0.3 s [0.22,1,0.36,1] | main | y dropped | MOTION-13 |
| A23 | globals.css:357-369 | link hover/focus | chevron `translateX(2px)` | 0.3 s ease-apple | compositor | killed | ok |
| A24 | globals.css:386-417 | hover | pill bg, color, border | 0.3 s ease-apple | paint | killed | MOTION-13 |
| A25 | globals.css:443-448 | hover | icon-button bg, color | 0.25 s ease-apple | paint | killed | MOTION-13 |
| A26 | globals.css:461-466 | tile hover | (+) opacity → .86 | 0.3 s ease-apple | compositor | killed | ok |
| A27 | About.tsx:59,62,106,110 · Experience.tsx:83,90,108 · Projects.tsx:122 · Contact.tsx:58 · CinematicEntry.tsx:63 · ThemeToggle.tsx:25 · CopyButton.tsx:70 | hover | color / bg | 150 ms (Tailwind default) or 300 ms | paint | killed | MOTION-13 |

**Census.** There are 12 distinct durations (0.15, 0.18, 0.25, 0.3, 0.4, 0.45, 0.5, 0.65, 0.7, 1.0, 1.2, 1.6 s) and 7 easing curves (EASE_APPLE, EASE_OUT [0.22,1,0.36,1], [0.16,1,0.3,1], JS easeOutCubic, CSS `ease`, Tailwind `cubic-bezier(.4,0,.2,1)`, Motion default). `EASE_IN_OUT` is defined but unused.

---

### Section 2: Findings

Ordered P0 → P2. Each finding carries its own fix; phase ordering is in Section 4.

#### P0

##### MOTION-01 (P0): The whole page flashes dark during hydration for every light-theme visitor, and system-preference users get pinned
**File:** `src/contexts/ThemeContext.tsx:28`, `:30-63`, `:97-101`

**Problem.** State starts as `'dark'`. The `[theme]` effect runs on mount with that initial value, after the first effect has only *queued* the real theme. So it writes `class="dark"` and `localStorage.theme='dark'`. The next commit then writes the real theme back. Side effects:
- `localStorage.theme` is now always set, so the `prefers-color-scheme` change listener (`if (!localStorage.getItem('theme'))`) is dead after the first visit.
- The time-of-day fallback in the head script is permanently pinned.
- The document gets two extra full-page style recalcs during hydration.

**Evidence.**
```tsx
const [theme, setThemeState] = useState<Theme>('dark')
...
useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
}, [theme])
```
- `<html>` class mutations (MutationObserver), desktop: `light@25ms → dark@261ms → light@442ms`.
- Phone probe: `light → dark@2767ms → light@3143ms`.
- Screencast frames `frame-return-light-05…20` are solid black. Frame 04 (white) and frame 30 (white with hero) bracket them.
- Dark-theme users see no flash (initial state matches).

**Fix.** Mirror the class the head script already applied, and never write it on mount:
```tsx
type Theme = 'light' | 'dark'
function applyClass(t: Theme) {
  const c = document.documentElement.classList
  c.remove('light', 'dark'); c.add(t)
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', t === 'dark' ? '#000000' : '#ffffff'))
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    // The <head> script painted the right class before first paint: read it, never write it back here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme')) return            // an explicit choice wins
      const next: Theme = e.matches ? 'dark' : 'light'
      applyClass(next); setThemeState(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const commit = useCallback((next: Theme) => {
    applyClass(next)
    try { localStorage.setItem('theme', next) } catch {}
    setThemeState(next)
  }, [])

  const setTheme = useCallback((next: Theme, origin?: { x: number; y: number }) => { /* see MOTION-12; call commit(next) */ }, [commit])
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
// DELETE the useEffect(..., [theme]) at lines 97-101 and the duplicated matchMedia/time-of-day logic at 35-52.
```

**Verify.**
- Run `node …\audit-motion\mobile.mjs http://localhost:3011`. `themeMutations` for `return-light` must contain only the head-script entry. No black frames in `frame-return-light-*`.
- Clear `localStorage.theme`, toggle the OS appearance: the page follows live.
- The toggle still persists.

##### MOTION-02 (P0): Desktop scroll-jacking rejects mouse wheels and arrow keys, can't be interrupted, and double-moves trackpad inertia
**Files:** `src/components/HorizontalLayout.tsx:21-26, 54-99, 101-122`; `src/utils/smooth-scroll.ts:4-86`

**Problem.** The deck snaps with a JS idle timer and then writes `window.scrollTo` every frame.

**Evidence.**
```tsx
const SNAP_IDLE_MS = 140
...
animate(window.scrollY, nearest * maxScroll, { duration: 0.7, ease: [0.22, 1, 0.36, 1],
  onUpdate: (latest) => window.scrollTo({ top: latest }) })
```
Measured at 1440×900 against the production build (each slide = 900 px):
- **Mouse wheel:** 1 notch moves 900→1000, then snaps back to 900. Three notches move 900→1200, then back to 900. A mouse user must spin more than 450 px with gaps under 140 ms to advance.
- **Keyboard:** ArrowDown 0→40→0 (rubber-bands). ArrowRight: nothing. PageDown 0→787 (native), then a second JS glide to 900.
- **Fights the user:** after clicking Contact in the DotNav, 600 px of reverse wheel was ignored and the page still landed at 5400. `smoothScrollTo` has no cancel handle, and two clicks start two rAF loops that fight each other.
- **Trackpad:** the 140 ms idle timer restarts on every macOS momentum event. The settle glide starts only after inertia ends, so the user sees stop, pause, second glide.
- **Reduced motion:** snapping is disabled, so the deck can rest half-way between two slides.

**Fix.** Use native CSS scroll snap on the root scroller and native smooth scrolling.

1. `globals.css`:
```css
@media (min-width: 64rem) {
  html { scroll-snap-type: y mandatory; overscroll-behavior-x: none; }
  .kn-snap { position: absolute; left: 0; width: 1px; height: 100vh; scroll-snap-align: start; pointer-events: none; }
}
@media (max-width: 63.99rem) {
  .kn-snap { display: none; }
  section[id] { scroll-margin-top: var(--nav-h); }
}
```
2. `HorizontalLayout.tsx`: inside the runway `<div>` (the one with `--track-height`), before the sticky child, add one marker per slide:
```tsx
{SECTION_IDS.map((id, i) => (
  <span key={id} data-snap={i} aria-hidden="true" className="kn-snap" style={{ top: `${i * 100}vh` }} />
))}
```
3. Delete:
   - `SNAP_DEADZONE`, `SNAP_VELOCITY_CEILING`, `SNAP_IDLE_MS`;
   - `useVelocity`, `isSnappingRef`, `setSnapping`;
   - the snap effect (63-99) and the resize effect (101-122). Browsers re-snap on resize.
4. Replace `src/utils/smooth-scroll.ts` entirely:
```ts
import { SECTION_IDS, SECTION_STEPS, type SectionId } from '@/data/sections'
import { isDesktopViewport } from '@/hooks/useIsDesktop'

const behavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'

/** Desktop: the slide's snap marker. Phones: the section (scroll-margin-top clears the nav). Native, interruptible, snap-aware. */
export function scrollToSection(index: number, id: SectionId): void {
  const el = isDesktopViewport()
    ? document.querySelector<HTMLElement>(`[data-snap="${index}"]`)
    : document.getElementById(id)
  el?.scrollIntoView({ behavior: behavior(), block: 'start' })
}

export function currentSlide(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? Math.round((window.scrollY / max) * SECTION_STEPS) : 0
}

export function stepSlide(dir: 1 | -1): void {
  const i = Math.min(SECTION_STEPS, Math.max(0, currentSlide() + dir))
  scrollToSection(i, SECTION_IDS[i])
}
```
   Every call site already passes `(index, id)`: Navigation `go`, DotNav, HeroOverlay `go`, Services CTA. Drop the `durationMs` argument everywhere.
5. Add ArrowLeft/ArrowRight with `src/hooks/useDeckGestures.ts` (shared with MOTION-03) and call `useDeckGestures()` in HorizontalLayout:
```ts
'use client'
import { useEffect } from 'react'
import { DESKTOP_MEDIA_QUERY } from '@/hooks/useIsDesktop'
import { stepSlide } from '@/utils/smooth-scroll'

const blocked = (t: EventTarget | null) =>
  !!document.querySelector('[role="dialog"]') ||
  (t instanceof Element && !!t.closest('input, textarea, select, [contenteditable="true"]'))

export function useDeckGestures(): void {
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MEDIA_QUERY)
    const onKey = (e: KeyboardEvent) => {
      if (!mq.matches || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || blocked(e.target)) return
      if (e.key === 'ArrowRight') { e.preventDefault(); stepSlide(1) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); stepSlide(-1) }
    }
    // Horizontal trackpad swipe = one slide per gesture (momentum included). Passive: never blocks scrolling.
    let acc = 0, locked = false, idle = 0
    const onWheel = (e: WheelEvent) => {
      if (!mq.matches || Math.abs(e.deltaX) <= Math.abs(e.deltaY) || blocked(e.target)) return
      window.clearTimeout(idle)
      idle = window.setTimeout(() => { acc = 0; locked = false }, 180)
      if (locked) return
      acc += e.deltaX
      if (Math.abs(acc) >= 40) { locked = true; stepSlide(acc > 0 ? 1 : -1) }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('wheel', onWheel); window.clearTimeout(idle) }
  }, [])
}
```
   Leave `scroll-snap-stop` at `normal`. Evaluate `always` only if you want strictly one slide per fling.

**Verify.**
- A page-only experiment (snap CSS and markers injected into the live page) gave ArrowDown 0→900, ArrowUp →0, PageDown →900 in one move each.
- **Headless CDP wheel events arrive as isolated precise scrolls and cannot emulate a notch or a fling, so wheel behaviour must be checked on hardware:**
  - Windows mouse: one notch moves one slide.
  - Mac trackpad: a fling ends exactly on a slide with native inertia and no second glide.
  - Reverse-scroll during a DotNav jump takes over immediately.
- Keyboard: ArrowDown/Right/PageDown/Space each move one slide; Up/Left/Home/End behave as expected.
- Reduced motion: snaps instantly and never rests between slides.

##### PERF-01 (P0): LCP is gated on hydration plus a 1-second opacity fade
**Files:** `src/components/ui/keynote.tsx:114-151`, `src/components/dom/HeroOverlay.tsx:21,34-76`, `src/components/dom/CinematicEntry.tsx:68-87`, `src/hooks/useSiteEntered.ts`, `src/app/layout.tsx:79-88`, `src/app/globals.css:153-155`

**Problem.** Motion server-renders every reveal at `opacity:0`. The hero only plays after the dynamically imported `HorizontalLayout` hydrates and `useSiteEntered`'s effect runs. Opacity then animates as a compositor (WAAPI) animation, and **Chromium records the LCP paint when the fade finishes**:
- Desktop LCP 1648 ms ≈ hydration (~450) + 200 ms delay + 1000 ms fade.
- Phone LCP entries for the mark, h1 and lede are spaced exactly by their 0, 0.2 and 0.4 s delays.

**Evidence.**
- 31 `style="opacity:0;transform:translateY(...)"` occurrences in `.next/server/app/index.html`.
- `const REVEAL = { opacity: 0, y: 24 }` and `animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}`.
- Phone screencast: between 1.2 s and 2.8 s a returning visitor sees a white page with only the nav.
- Lighthouse mobile LCP is 3.8 s (intro memoji). On phones the LCP element is the hero **lede `<p>`**, which is larger than the h1 at 390 px.

**Fix.** CSS-driven entrance that runs at first paint, with LCP text never starting invisible.

1. Replace the two head scripts (layout.tsx:79-88) with this one. It is a superset: theme, intro state, intro click before hydration, and slide reveals.
```tsx
<script dangerouslySetInnerHTML={{ __html: `(function(){var d=document.documentElement;d.setAttribute('data-js','');try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){var dk=matchMedia('(prefers-color-scheme: dark)'),lt=matchMedia('(prefers-color-scheme: light)');if(dk.matches||lt.matches){t=dk.matches?'dark':'light'}else{var h=new Date().getHours();t=h>=7&&h<20?'light':'dark'}}d.classList.add(t);if(localStorage.getItem('cinematic-entered')==='true'){d.setAttribute('data-intro-seen','');d.setAttribute('data-entered','')}}catch(e){}document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('[data-intro-enter]');if(!b||d.hasAttribute('data-entered'))return;d.setAttribute('data-entered','');try{localStorage.setItem('cinematic-entered','true')}catch(_){}},true);document.addEventListener('DOMContentLoaded',function(){if(!('IntersectionObserver' in window)){d.removeAttribute('data-js');return}var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.setAttribute('data-revealed','');io.unobserve(en.target)}})},{rootMargin:'0px -12% -12% 0px'});document.querySelectorAll('.slide').forEach(function(s){io.observe(s)})})})();` }} />
```
2. `globals.css`: replace lines 153-155 with the block below (tokens come from Section 3).
```css
@keyframes kn-rise   { from { opacity: 0; transform: translate3d(0, var(--motion-rise), 0); } }
@keyframes kn-settle { from { transform: translate3d(0, var(--motion-rise-sm), 0); } }  /* LCP text: moves, never invisible */
.kn-enter, .kn-enter-text {
  animation: kn-rise var(--motion-reveal) var(--ease-apple) both;
  animation-delay: calc(min(var(--i, 0), 5) * var(--motion-stagger));
}
.kn-enter-text { animation-name: kn-settle; }
html:not([data-entered]) #hero :is(.kn-enter, .kn-enter-text) { animation-play-state: paused; }  /* waits for the intro */
html:not([data-js]) :is(.kn-enter, .kn-enter-text) { animation: none; }

/* Intro overlay */
html[data-intro-seen] [data-cinematic], html:not([data-js]) [data-cinematic] { display: none; }
[data-cinematic] { transition: opacity var(--motion-slow) var(--ease-apple), visibility 0s linear var(--motion-slow); }
html[data-entered] [data-cinematic] { opacity: 0; visibility: hidden; pointer-events: none; }
html[data-js]:not([data-entered]) body { overflow: hidden; }
```
3. `HeroOverlay.tsx`: remove `motion`, `Rise`, `EASE_APPLE` and `useSiteEntered`. Markup (keep every existing class; add the ones shown):
```tsx
<div className="kn-enter" style={{ '--i': 0 } as CSSProperties}><Mark size={112} alt="" priority className="mx-auto …" /></div>
<h1 id="hero-title" className="…">
  <span className="t-eyebrow block !text-[var(--foreground)] kn-enter-text" style={{ '--i': 1 } as CSSProperties}>{k.common.name}<span className="sr-only"> — </span></span>
  <span className={`t-hero block mt-2 md:mt-3 ${phoneSize} md:text-[min(6.6vw,11vh)] kn-enter-text`} style={{ '--i': 2 } as CSSProperties}><HeadlineText text={k.hero.headline} /></span>
</h1>
<p className="t-lede … kn-enter-text" style={{ '--i': 3 } as CSSProperties}><Rich text={k.hero.sub} /></p>
<div className="mt-8 … flex flex-wrap justify-center gap-3.5 kn-enter" style={{ '--i': 4 } as CSSProperties}>…pills…</div>
<p className="mt-7 … kn-enter" style={{ '--i': 5 } as CSSProperties}>{k.hero.note}</p>
```
4. `CinematicEntry.tsx`: no state, no effects, no AnimatePresence (see MOTION-06 for the markup).
5. Delete `src/hooks/useSiteEntered.ts` and `SITE_ENTERED_EVENT`.

**Verify.**
- `grep -o 'style="opacity:0' .next/server/app/index.html | wc -l` → 0.
- Desktop probe: LCP within 100 ms of FCP.
- Phone probe: LCP < 1.8 s.
- Lighthouse mobile LCP < 1.8 s.
- With JS disabled, the hero is visible and there is no intro.
- On first visit, Enter works before hydration (MOTION-06).

#### P1

##### MOTION-03 (P1): Horizontal swipes on a horizontal deck do nothing, and on macOS they trigger Back
**Files:** `src/app/globals.css` (no `overscroll-behavior`), `src/components/HorizontalLayout.tsx` (no deltaX handling)

**Evidence.** 20 × 30 px `deltaX` wheel events left `scrollY` at 900→900. Computed `overscroll-behavior-x` is `auto` on both `html` and `body`. With no horizontal scroll range, a two-finger sideways swipe on a Mac becomes the browser's history-swipe gesture and leaves the site.

**Fix.** `html { overscroll-behavior-x: none }` at ≥64rem plus the `onWheel` half of `useDeckGestures` (both in MOTION-02).

**Verify.** On a Mac trackpad, one sideways swipe (with momentum) moves exactly one slide and never navigates back in Chrome/Edge. Check Safari separately; it may still honour its own swipe setting.

##### MOTION-04 (P1): The track's translateX and the Projects ScaleIn are written from JS every scroll frame
**Files:** `src/components/HorizontalLayout.tsx:33, 41-52, 137, 144-146`; `src/components/ui/keynote.tsx:13-48`

**Evidence.**
```tsx
const { scrollYProgress } = useScroll({ target: targetRef })
const x = useTransform([scrollYProgress, trackGate], ([progress, gate]: number[]) => `${-progress * gate * TRACK_TRAVEL_VW}vw`)
```
Motion 12.43 hands scroll animations to a native ScrollTimeline only when all of these hold:
- `useScroll` has no `target`;
- `useTransform` has one input with array ranges;
- the style key is `transform` or `opacity`.

(Sources: `framer-motion/dist/es/value/use-scroll.mjs:57-68`, `use-transform.mjs:28-41`, `motion-dom/dist/es/render/VisualElement.mjs:262-280`.) This code fails all three.

Consequences:
- On every scroll event Motion walks `offsetTop`/`offsetParent` and reads `clientWidth/Height` (`on-scroll-handler.mjs:5-24`), then writes `style.transform`.
- In a 3-slide sweep: about 1.5 style recalcs per frame (272 over ~180 frames). In the 5 s scroll trace: 311 Layerize and 311 Commit events.
- Vertical scroll is compositor-driven while the horizontal move is main-thread, so any hitch (hydration, a React commit, CountUp) freezes the track while the page keeps scrolling.
- `ScaleIn` is unpromoted, so the device frame and screenshot repaint inside the 10080×900 track layer on every frame.

**Fix.**
- Gate desktop/mobile in CSS instead of motion values. An author `!important` beats animations and inline styles, so a desktop→phone resize can't strand a transform, which was the reason for the gates in the old comment.
- Change `keynote.tsx` to `export const TrackContext = createContext<MotionValue<number> | null>(null)` and delete `useSlideOffset` and `TrackValue`.
```tsx
// HorizontalLayout.tsx
const { scrollYProgress } = useScroll()   // page scroll == runway progress (the runway is the whole 700vh document)
const trackTransform = useTransform(scrollYProgress, [0, 1], ['translate3d(0vw,0,0)', `translate3d(-${TRACK_TRAVEL_VW}vw,0,0)`])
...
<TrackContext.Provider value={scrollYProgress}>
  …
  <m.div style={{ transform: trackTransform }}
         className="flex flex-col md:flex-row md:h-screen md:items-center md:will-change-transform max-md:!transform-none">
```
- Delete `useIsDesktop`, `useReducedMotion`, `trackGate`, `motionGate` and their effect from HorizontalLayout. Hoist the `sections` array to a module-level `const SECTIONS = [...]` so the component has no state and never re-renders.
- Add `suppressHydrationWarning` to each slide wrapper `div` (the head script adds `data-revealed`).
- Replace `ScaleIn`:
```tsx
const S = SECTION_STEPS
/** Strictly increasing stops around this slide; centre = scale 1. */
function slideStops(index: number) {
  const raw: Array<[number, boolean]> = [[0, false], [(index - 1) / S, false], [index / S, true], [(index + 1) / S, false], [1, false]]
  const kept: Array<[number, boolean]> = []
  for (const [p, centre] of raw) {
    if (p < 0 || p > 1) continue
    const last = kept[kept.length - 1]
    if (last && p <= last[0]) { if (centre) kept[kept.length - 1] = [p, true]; continue }
    kept.push([p, centre])
  }
  return { input: kept.map(([p]) => p), transform: kept.map(([, c]) => (c ? 'scale(1)' : 'scale(0.9)')), opacity: kept.map(([, c]) => (c ? 1 : 0.4)) }
}

export function ScaleIn({ className = '', children }: { className?: string; children: ReactNode }) {
  const progress = useContext(TrackContext)
  const index = useContext(SlideIndexContext)
  const fallback = useMotionValue(index / S)
  const stops = useMemo(() => slideStops(index), [index])
  const transform = useTransform(progress ?? fallback, stops.input, stops.transform)
  const opacity = useTransform(progress ?? fallback, stops.input, stops.opacity)
  return (
    <m.div style={{ transform, opacity }}
      className={`${className} will-change-transform max-md:!transform-none max-md:!opacity-100 motion-reduce:!transform-none motion-reduce:!opacity-100`}>
      {children}
    </m.div>
  )
}
```
- **Alternative with no JS:** `@supports (animation-timeline: scroll())` with `.kn-track { animation: kn-track linear both; animation-timeline: scroll(root block); }` and `@keyframes kn-track { to { transform: translate3d(-600vw,0,0) } }`. This needs a separate Motion fallback for Firefox, so prefer the Motion-accelerated version above (one code path, automatic fallback).

**Verify.**
- DevTools → Animations panel lists scroll-driven animations on the track and the stage.
- Performance panel (CPU 4x), sweep 3 slides: no per-frame "Recalculate style" or "Layerize" from the track. Main thread under 4 ms per frame.
- Rendering → Paint flashing: no green over the track while scrolling (nav and dot backdrops excepted).
- Firefox still moves the track through Motion's JS fallback.
- Phones: no transform on the stack.

##### MOTION-05 (P1): Reveal system: content hidden until JS, `y` animated on the main thread, 1 s plus delays, uncoordinated triggers, count-up jump
**Files:** `src/components/ui/keynote.tsx:114-176` and call sites in About, Services, TechSpecs, Experience, Projects, Contact.

**Evidence.**
- `const REVEAL = { opacity: 0, y: 24 }` with `transition={{ duration: 1, ease: EASE_APPLE, delay }}`. That is 37 hidden elements at runtime.
- Opacity runs as WAAPI while `y` runs as a JS tween, so they desync under load. 6–10 main-thread tweens per slide arrival coincide with the track move.
- Headline triggers at 50% visible, Rise at 20%, CountUp at 60%, so one slide starts its pieces at different moments. Content is still moving about 1.4 s after the slide lands.
- **CountUp jump:** About.tsx:76-92 server-renders "550+" inside a Rise that fades in at 20% visibility, then resets to "0+" at 60% and counts up. The number visibly drops.
- **Services phone gallery (Services.tsx:59-61):** per-tile `whileInView` inside a horizontal scroller, so tiles hidden off to the right only start their 1 s fade while being swiped.

**Fix.** Reveal at slide level with CSS transitions (compositor, no per-element observers). The head script from PERF-01 adds `data-revealed` to each `.slide`.
```css
.kn-reveal {
  opacity: 0;
  transform: translate3d(0, var(--motion-rise), 0);
  transition: opacity var(--motion-reveal) var(--ease-apple), transform var(--motion-reveal) var(--ease-apple);
  transition-delay: calc(min(var(--i, 0), 5) * var(--motion-stagger));
}
.slide[data-revealed] .kn-reveal, html:not([data-js]) .kn-reveal { opacity: 1; transform: none; }
```
`keynote.tsx` (keep the export names so call sites change minimally):
```tsx
type Step = 0 | 1 | 2 | 3 | 4 | 5
export function Headline({ text, as: Tag = 'h2', id, className = '', step = 1 }: { text: string; as?: 'h1' | 'h2' | 'h3' | 'p'; id?: string; className?: string; step?: Step }) {
  return <Tag id={id} className={`kn-reveal ${className}`} style={{ '--i': step } as CSSProperties}><HeadlineText text={text} /></Tag>
}
export function Rise({ children, step = 0, className = '', as: Tag = 'div' }: { children: ReactNode; step?: Step; className?: string; as?: 'div' | 'li' }) {
  return <Tag className={`kn-reveal ${className}`} style={{ '--i': step } as CSSProperties}>{children}</Tag>
}
```
Delay → step mapping. Remove the `play` prop everywhere; the hero uses `.kn-enter` from PERF-01.

| Call site | Element | Step |
|---|---|---|
| SlideHeader (keynote.tsx:191-199) | eyebrow / Headline / aside (was 0.15) | 0 / 1 / 2 |
| About.tsx:37, 40, 41, 51 | eyebrow / headline / bio / focus | 0 / 1 / 2 / 3 |
| About.tsx:76, 85, 96 | big stat / three small stats / credentials | 2 / `3 + i` / 5 |
| Services.tsx:61 | each tile | `(2 + Math.min(index, 3)) as Step` |
| TechSpecs.tsx:25 | spec table | 3 |
| Experience.tsx:44, 71, 99 | Now / Then / Education | 2 / 3 / 4 |
| Projects.tsx:97, 110 | caption / line-up | 3 / 3 |
| Contact.tsx:29, 33, 38, 43, 53 | mark+eyebrow / headline / lede / buttons / details | 0 / 1 / 2 / 3 / 4 |

`CountUp`: drop Motion's `animate` and `useInView`. Start from 0 while still hidden, and count when the number is visible:
```tsx
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.textContent = `0${suffix}`                       // parent .kn-reveal is still opacity 0 here
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now(), dur = DURATION.count * 1000
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur)
        el.textContent = `${Math.round((1 - Math.pow(1 - t, 4)) * value)}${suffix}`
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.3 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value, suffix])
  return <span ref={ref}>{value}{suffix}</span>
}
```
Because the trigger is the slide, the Services gallery reveals all tiles together, which fixes the phone gallery issue too.

**Verify.**
- `grep -o 'style="opacity:0' index.html | wc -l` → 0.
- With JS disabled, every slide is visible.
- Performance: no "Animation frame fired" during reveals.
- Each slide's content is settled within about 1.0 s of landing.
- The About number never shows "550+" before counting.

##### MOTION-06 (P1): The intro blocks content, its Enter button is dead until hydration, and its exit blocks clicks
**Files:** `src/components/dom/CinematicEntry.tsx:14-92`, `src/app/layout.tsx:84-88`, `src/app/globals.css:153-155`

**Evidence.**
- First visit on the throttled phone: the Enter pill only worked **1.1 s after `load`** (it needs hydration); clicks before that do nothing.
- The pill appears after 0.5 s delay + 1 s fade.
- After Enter: a 0.7 s overlay fade that keeps intercepting the pointer, then the hero's 0.7 s delays + 1 s fade, about 1.7 s from click to full hero.
- `document.body.style.overflow = … 'auto'` leaves an inline `overflow:auto` on `body` permanently.

**Fix.** A stateless overlay, driven by the head-script click handler and the CSS in PERF-01:
```tsx
'use client'
import type { CSSProperties } from 'react'
import { useContent } from '@/hooks/useContent'
import { HeadlineText } from '@/components/ui/keynote'
import { Mark } from '@/components/ui/Mark'

export default function CinematicEntry() {
  const k = useContent().keynote
  return (
    <div data-cinematic className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-6 text-center">
      <button type="button" data-intro-enter className="absolute top-4 right-5 t-caption text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">{k.intro.skip}</button>
      <div className="kn-enter" style={{ '--i': 0 } as CSSProperties}><Mark size={128} priority alt="Andreas Fragkiadakis" className="w-28 h-28 md:w-32 md:h-32" /></div>
      <p className="t-hero mt-4 text-[clamp(3.5rem,14vw,7rem)] kn-enter-text" style={{ '--i': 1 } as CSSProperties}><HeadlineText text={k.intro.headline} /></p>
      <button type="button" data-intro-enter className="mt-9 kn-pill kn-pill--fill kn-enter" style={{ '--i': 3 } as CSSProperties}>{k.intro.enter}</button>
    </div>
  )
}
```

**Verify.** Click Enter immediately after FCP with 4x throttle: the overlay fades at once. The page is scrollable right after. The hero completes within about 1 s of the click.

##### MOTION-07 (P1): Modal backdrop blur pops, an invisible layer swallows clicks after close, and the phone sheet doesn't rise from the edge
**File:** `src/components/ui/Modal.tsx:84-127`

**Evidence.**
```tsx
<motion.div initial={{ opacity: 0 }} … transition={{ duration: 0.18 }} className="fixed inset-0 …" onClick={onClose}>
  <div className="absolute inset-0 bg-black/40 sm:backdrop-blur-[20px]" />
```
- **Blur pop.** An ancestor at opacity below 1 becomes the backdrop root, so the blur samples nothing. In a page-only test with the wrapper at opacity 0.99 the backdrop is completely sharp (`modal-opacity-099.png` vs `modal-opacity-1.png`). The blur therefore snaps on when the 180 ms fade ends and disappears the moment the exit starts.
- **Click-blocking exit.** The wrapper fades out in 0.18 s, but AnimatePresence keeps it mounted for the panel's 0.45 s exit. That leaves about 270 ms of an invisible full-screen layer that eats clicks.
- **Phone sheet.** `y: 48` on every viewport, so on phones the bottom sheet nudges and fades instead of rising from the screen edge.
- `y` runs on the main thread. INP for opening the bio dialog: 128 ms (desktop, 4x).

**Fix.** Keep the focus-trap and scroll-lock effect (lines 42-80) unchanged.
```tsx
import { AnimatePresence, useIsPresent, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useSyncExternalStore } from 'react'
import { SPRING, TRANSITION } from '@/utils/motion'

const noopSubscribe = () => () => {}
const useIsClient = () => useSyncExternalStore(noopSubscribe, () => true, () => false)

function Layer({ children }: { children: ReactNode }) {
  const isPresent = useIsPresent()   // false while exiting → let clicks through
  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4"
         style={{ pointerEvents: isPresent ? undefined : 'none' }}>{children}</div>
  )
}

// in Modal(): replace the `mounted` state + effect with:
const isClient = useIsClient()
const reduce = useReducedMotion()
if (!isClient) return null
const isCard = window.matchMedia('(min-width: 40rem)').matches
const panelMotion = reduce
  ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: TRANSITION.fade }, exit: { opacity: 0, transition: TRANSITION.fade } }
  : isCard
    ? { initial: { opacity: 0, transform: 'translate3d(0,16px,0) scale(0.98)' },
        animate: { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', transition: SPRING.sheet },
        exit: { opacity: 0, transform: 'translate3d(0,8px,0) scale(0.98)', transition: TRANSITION.exit } }
    : { initial: { transform: 'translate3d(0,100%,0)' },
        animate: { transform: 'translate3d(0,0,0)', transition: SPRING.sheet },
        exit: { transform: 'translate3d(0,100%,0)', transition: TRANSITION.exit } }

return createPortal(
  <AnimatePresence>
    {open && (
      <Layer key="modal">
        {/* Opacity lives on the scrim itself, so its own backdrop-filter stays live during the fade. */}
        <m.div aria-hidden="true" className="absolute inset-0 bg-black/40 sm:backdrop-blur-[20px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={TRANSITION.fade} onClick={onClose} />
        <m.div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={labelledBy} {...panelMotion}
          className={`kn-sheet relative z-10 … (unchanged classes) ${className}`}>
          {/* close button, grabber, children: unchanged */}
        </m.div>
      </Layer>
    )}
  </AnimatePresence>,
  document.body,
)
```
`transform` strings are hardware-accelerated by Motion, and springs become a WAAPI `linear()` curve.

**Verify.**
- Record the opening with screenshots: the blur is present in the first frame where the scrim is visible.
- After Escape, a click under the sheet within 300 ms reaches the page.
- Phones: the sheet travels in from off-screen.
- Event Timing for opening the dialog under 100 ms.

##### PERF-02 (P1): 228 KiB gzip of initial JS
**Files:** `src/app/layout.tsx:4,152`; all `motion.*` users; `src/data/content.ts:119-228`; `src/components/MainContent.tsx:6`

**Evidence.**
- Initial module scripts total 228.1 KiB gzip:

| Chunk | Contents | gzip |
|---|---|---|
| `2sa0vye4l_7p5` | react-dom | 70.7 KB |
| `1ij17791fzil0` | Motion + components ≈ 46 KB, plus `content.ts` 23.4 KB (EN + GR) | 69.9 KB |
| `3psrapv`, `14mumt5`, `1ptwlt`, `1zfeh`, `turbopack` | Next runtime | 38.7 + 13.7 + 10.7 + 7.6 + 4.2 KB |
| `2cvnym` | layout client: theme, intro, next/image, speed-insights | 13.6 KB |
| `10tm8u` | HorizontalLayout | 4.3 KB |

- Lighthouse: unused JS 66 KiB; bootup 1.3 s on mobile.
- Content measured by field: both languages 23.6 KB gzip; fields actually used 19.5 KB; EN only 9.6 KB.

**Fix, in order.**
1. **LazyMotion.** Once PERF-01, MOTION-05 and MOTION-06 are done, Motion is only needed for AnimatePresence (Modal, menu, stage, CopyButton) and `useScroll`/`useTransform`.
```tsx
// src/components/MotionProvider.tsx
'use client'
import { LazyMotion, MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { TRANSITION } from '@/utils/motion'
const loadFeatures = () => import('@/utils/motion-features').then((mod) => mod.default)
export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures} strict><MotionConfig reducedMotion="user" transition={TRANSITION.reveal}>{children}</MotionConfig></LazyMotion>
}
// src/utils/motion-features.ts
import { domAnimation } from 'motion/react'
export default domAnimation
```
   In `layout.tsx`, replace `<MotionConfig reducedMotion="user">` with `<MotionProvider>`. Replace every `motion.x` with `m.x` (`import * as m from 'motion/react-m'`) in Navigation, Modal, Projects, CopyButton, keynote (ScaleIn) and HorizontalLayout. `strict` throws on any leftover `motion.` usage.
2. **Delete unused `Content` fields** (no component reads them): `name`, `title`, `phone`, `nav`, `hero`, `contact`, `cursor`, `skillsTitle`, `servicesTitle`, `servicesSubtitle`, `servicesCta`, `servicesCtaButton`, `servicesLabels`, `experienceTitle`, `educationTitle`, `projectsTitle`, `experienceSection`, `projectsSection`, `cinematicEntry`, `contactTitle`; every `about.*` except `description`; `Service.description`; `Education.icon` and `Education.featured`. Saves about 4 KB gzip.
3. **Split by language.** Keep `content.en` static and load `content.gr` with `import('@/data/content.gr')` only when the language is `gr` (saves ~10 KB gzip for EN visitors), or do PERF-03 option B.
4. In `MainContent.tsx`, import `HorizontalLayout` statically. It is always needed, so `dynamic()` only adds a chunk and a round trip.
5. Remove `typewriter-effect` from `package.json` (hygiene; it isn't bundled).

**Budget.** ≤ 150 KiB gzip after steps 1–4; ≤ 120 KiB with PERF-03 option B.

**Verify** (from the app root):
```bash
cd .next && grep -o '<script src="/_next/static/chunks/[^"]*\.js"[^>]*async' server/app/index.html | grep -o 'static/chunks/[^"]*\.js' | sort -u | while read f; do gzip -9 -c "$f" | wc -c; done | awk '{s+=$1} END {printf "%.1f KB gzip\n", s/1024}'
```
Today this prints 228.1.

##### PERF-03 (P1): The language switch is a 300–400 ms interaction, and Greek visitors get English HTML
**File:** `src/contexts/LanguageContext.tsx:15-37`

**Evidence.**
- Event Timing, 4x CPU: language toggle **320 ms on desktop, 408 ms on phone**, almost all of it presentation delay from re-rendering every section and the 6 dialogs.
- A Greek returning visitor on the phone gets EN server HTML. `lang` flips to `el` at 2133 ms and the nav labels swap after hydration.
- Greek copy is not in the HTML at all, which also hurts SEO.

**Fix A (now):**
```tsx
const [isPending, startTransition] = useTransition()
useEffect(() => {
  const stored = localStorage.getItem('language')
  if (stored === 'gr') startTransition(() => setLanguageState('gr'))   // yields during the post-hydration swap
}, [])
const setLanguage = useCallback((lang: Language) => {
  try { localStorage.setItem('language', lang) } catch {}
  startTransition(() => setLanguageState(lang))
}, [])
const value = useMemo(() => ({ language, setLanguage, isPending }), [language, setLanguage, isPending])
```
Show `isPending` on the toggles in Navigation.tsx (lines 128-135 and 209-216): `aria-busy={isPending}` and `className={… ${isPending ? 'opacity-60' : ''}}`.

**Fix B (structural, do last):** locale routes.
- Move the root layout and page to `app/[lang]/layout.tsx` and `app/[lang]/page.tsx` with `generateStaticParams = () => [{ lang: 'en' }, { lang: 'el' }]` and `dynamicParams = false`. Render `<html lang={lang}>` on the server.
- Add `proxy.ts` (Next 16's renamed middleware): rewrite `/` → `/en`, and redirect `/` → `/el` when the `lang=el` cookie is set.
- The toggle becomes `<Link href>` and also sets the cookie.
- Pass `content[lang]` slices as props. TechSpecs and the static markup of About, Services, Experience, Projects and Contact become Server Components. Client islands: Navigation, DotNav, dialog triggers and Modal, the Projects selector, CopyButton, LocalTime.
- Add hreflang alternates in `metadata`.
- Result: no language flip, Greek is indexable, and `content.ts` stops shipping to the client.

**Verify.** Language toggle under 100 ms with 4x CPU. With option B, `/el` HTML contains "Αυτοματοποιημένοι" and `lang="el"`.

##### PERF-04 (P1): 103 KB of Inter preloaded on devices that never use it
**File:** `src/app/layout.tsx:15`

**Evidence.**
- `Inter({ subsets: ['latin', 'greek'], display: 'swap', variable: '--font-inter', axes: ['opsz'] })` produces two `<link rel=preload as=font>`: latin 73.3 KB (the **single largest resource** on the page) and Greek 30.6 KB, on every device.
- The font stack starts with `-apple-system` and `BlinkMacSystemFont`, so iOS and macOS never render Inter. On those devices the bytes compete with LCP for nothing.
- EN visitors download the Greek file as well.

**Fix.** `Inter({ …same…, preload: false })`. Apple devices then fetch no font. Windows and Android fetch latin when it is first used. Greek is fetched only when Greek glyphs render (`unicode-range`). Keep `adjustFontFallback` (the default; it generates `Inter Fallback` = Arial at size-adjust 107.12%). Optionally drop `axes: ['opsz']` to shrink the latin file (measure first).

**Risk.** After PERF-01 the hero text is visible while the font swaps. On Android, `local(Arial)` may not resolve, so the fallback would be unmatched Roboto. If Android CLS exceeds 0.01, switch to `display: 'optional'`.

**Verify.** Network panel with a Mac UA or Safari: no `.woff2` requests. Windows: one latin request and CLS < 0.02. Android Chrome: CLS < 0.02.

#### P2

##### MOTION-08 (P2): The project stage swap takes 1 s, and the image pops in after the frame
**File:** `src/components/dom/Projects.tsx:76-94`

**Evidence.** `AnimatePresence mode="wait"` runs a 0.5 s exit then a 0.5 s enter. `next/image` is lazy and not decoded, so the device frame fades in empty and the screenshot pops in afterwards.

**Fix (option A, recommended).** Overlapping crossfade, and decode before swapping:
```tsx
import { flushSync } from 'react-dom'
import { getImageProps } from 'next/image'
const STAGE_SIZES = '(min-width: 1024px) 46vw, 100vw'
const decoded = new Map<string, Promise<void>>()
function preloadShot(p: Project): Promise<void> {
  if (!p.image) return Promise.resolve()
  if (!decoded.has(p.image)) {
    const sizes = p.device === 'phone' ? '720px' : STAGE_SIZES
    const { props } = getImageProps({ src: p.image, alt: '', fill: true, sizes })
    const img = new window.Image(); img.sizes = sizes; if (props.srcSet) img.srcset = props.srcSet; img.src = props.src
    decoded.set(p.image, img.decode().catch(() => {}))
  }
  return decoded.get(p.image)!
}
// row button: onPointerEnter={() => preloadShot(item)} onFocus={() => preloadShot(item)}
// onClick: setPending(index); Promise.race([preloadShot(item), new Promise((r) => setTimeout(r, 250))]).then(() => { setActiveIndex(index); setPending(null) })
// (use `pending ?? activeIndex` for the row's highlighted state so feedback is immediate)

<ScaleIn className="relative h-[min(40vh,25rem)]">
  <AnimatePresence initial={false}>
    <m.div key={project.name} className="absolute inset-0 flex items-end justify-center"
      initial={{ opacity: 0, transform: 'translate3d(0,12px,0)' }}
      animate={{ opacity: 1, transform: 'translate3d(0,0,0)', transition: TRANSITION.container }}
      exit={{ opacity: 0, transition: TRANSITION.fade }}>
      <div className="relative w-[min(100%,72vh)] flex justify-center"><ProjectShot … sizes={STAGE_SIZES} … /></div>
    </m.div>
  </AnimatePresence>
</ScaleIn>
```
**Option B (View Transition morph, laptop ↔ phone frame).** Wrap the update in `document.startViewTransition(() => flushSync(() => setActiveIndex(i)))` (skip it under reduced motion). Add:
```css
#project-stage .kn-stage-shot { view-transition-name: project-shot; }
::view-transition-group(project-shot) { animation-duration: var(--motion-slow); animation-timing-function: var(--ease-apple); }
```

**Verify.** Switching projects never shows an empty frame. The new shot is in place within 500 ms of the click.

##### MOTION-09 (P2): The phone accordion animates `height`, re-laying out the page every frame
**File:** `src/components/dom/Projects.tsx:132-149`

**Evidence.** `initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', … }}`, 0.45 s, driven from JS. Reduced motion does not stop it (height is not a transform). Opening one row and closing another runs two of these at once.

**Fix.** Keep content mounted and transition the grid rows in CSS (still layout, but no JS per frame and shorter):
```tsx
<div inert={!isActive}
  className={`md:hidden grid transition-[grid-template-rows,opacity] duration-[var(--motion-base)] ease-apple ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
  <div className="min-h-0 overflow-hidden"><div className="pt-4 pb-7">…unchanged content…</div></div>
</div>
```
`inert` keeps hidden links unfocusable. Lazy images in closed rows stay unloaded because they are clipped.

**Verify.** With reduced motion, rows switch instantly. Performance shows no JS during the toggle.

##### MOTION-10 (P2): The DotNav `width` transition is the main layout source during scrolling
**File:** `src/components/dom/DotNav.tsx:39`

**Evidence.** `transition-[width,background-color] duration-500`. A/B over a 3-slide sweep: 90 layouts with it, 3 with that transition disabled. It is cheap in absolute terms (about 10 ms total on desktop), but it is the only per-frame layout on the scroll path.

**Fix (minimal).**
- Add `[contain:layout_paint]` to the `<nav>` className.
- Change the dot to `duration-[var(--motion-base)] ease-apple`.

**Fix (transform-only).** Each dot becomes an 8 px circle plus an absolutely positioned 24 px bar that animates `scale` and `opacity` (`scale-x-[0.34]`/`opacity-0` → `scale-x-100`/`opacity-80`). Spacing stays fixed, which is a small visual change.

**Verify.** Re-run `layout-attrib.mjs`: the baseline should show 5 layouts or fewer.

##### MOTION-11 (P2): The hamburger jumps instead of morphing
**File:** `src/components/dom/Navigation.tsx:153-156`

**Evidence.** `top-[5px] rotate-45` vs `top-[2px]`. `top` is not in `transition-transform`, so the lines jump, then rotate.

**Fix.**
```tsx
<span className={`absolute left-0 right-0 top-[5px] h-[1.2px] rounded-full bg-current transition-transform duration-[var(--motion-base)] ease-apple ${menuOpen ? 'rotate-45' : '-translate-y-[3px]'}`} />
<span className={`absolute left-0 right-0 top-[5px] h-[1.2px] rounded-full bg-current transition-transform duration-[var(--motion-base)] ease-apple ${menuOpen ? '-rotate-45' : 'translate-y-[3px]'}`} />
```

##### MOTION-12 (P2): The theme switch is off-system, and its fallback transitions every element
**Files:** `src/contexts/ThemeContext.tsx:72-95`, `src/app/globals.css:134-140`

**Evidence.**
- The circle runs 650 ms on `cubic-bezier(0.22,1,0.36,1)`.
- The fallback adds `transition: … box-shadow 0.3s ease !important` to every element. That fallback is also the reduced-motion path.

**Fix.**
```tsx
const setTheme = useCallback((next: Theme, origin?: { x: number; y: number }) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!origin || reduce || typeof document.startViewTransition !== 'function') { commit(next); return }   // instant swap
  const { x, y } = origin
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  document.startViewTransition(() => flushSync(() => commit(next))).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: ms(DURATION.slow), easing: cubicBezier(EASE.emphasized), pseudoElement: '::view-transition-new(root)' })
  }).catch(() => {})
}, [commit])
```
Delete the `.theme-transition` rules (globals.css:134-140) and the class toggling.

##### MOTION-13 (P2): Durations and easings are inconsistent (12 durations, 7 curves)
**Evidence.** See the census in Section 1.

**Fix.** Section 3 (tokens plus a per-site mapping).

##### PERF-05 (P2): 10–18 React commits during load from effect-driven state
**Files:**
- `src/contexts/ThemeContext.tsx:30-63`
- `src/contexts/LanguageContext.tsx:17-24`
- `src/components/dom/CinematicEntry.tsx:19-29`
- `src/hooks/useIsDesktop.ts:26-37` (used in HorizontalLayout)
- `src/components/ui/Modal.tsx:38-40` (× 6 instances)
- `src/components/ui/ThemeToggle.tsx:12-16`
- `src/hooks/useSiteEntered.ts`

**Evidence.**
- 10 commits during desktop load, 12–18 on phones.
- When `useIsDesktop` goes from `null` to a boolean, `HorizontalLayout` re-renders, and because `sections` is rebuilt each render, all 7 sections re-render.
- Longest hydration task: 529–619 ms at 4x, followed by 110–221 ms tasks.

**Fix.**
- HorizontalLayout becomes stateless with module-level `SECTIONS` (MOTION-04).
- Delete CinematicEntry state (MOTION-06) and `useSiteEntered` (PERF-01).
- Modal and ThemeToggle use `useIsClient()` (`useSyncExternalStore` with an empty subscribe, `() => true`, `() => false`).
- Memoize the provider `value`s with `useMemo` and `useCallback` (MOTION-01, PERF-03).

**Verify.** Probe `commits` during load ≤ 4 (EN visitor).

##### PERF-06 (P2): Two separate active-slide trackers, one reading layout every frame on phones
**Files:** `src/components/dom/Navigation.tsx:32-65`, `src/components/dom/DotNav.tsx:16-21`

**Evidence.**
- Navigation adds its own scroll and resize listeners. Every frame it builds `matchMedia(...)` and, on phones, calls `getBoundingClientRect` on 7 sections.
- DotNav separately subscribes to the progress value.
- Each slide change costs 2 React commits (7 commits in a 3-slide sweep).

**Fix.** One shared store in `src/hooks/useActiveSlide.ts`:
- Desktop: rAF-throttled `scrollY / (scrollHeight - innerHeight) * SECTION_STEPS`, rounded; notify only when the index changes.
- Phones: one `IntersectionObserver` over `SECTION_IDS` elements with `rootMargin: '-50% 0px -50% 0px'`; on `isIntersecting`, set the index to `SECTION_IDS.indexOf(e.target.id as SectionId)`.
- Expose it via `useSyncExternalStore(subscribe, () => active, () => 0)`; `subscribe` starts the listeners once.
- Navigation and DotNav both read `useActiveSlide()`. Delete Navigation's effect (32-65) and DotNav's `useMotionValueEvent`/`useState`.

##### PERF-07 (P2): Experience, Projects and Contact are client-only
**File:** `src/components/HorizontalLayout.tsx:13-15`

**Evidence.** `dynamic(…, { ssr: false })`. `index.html` has 0 matches for `id="experience|projects|contact"` and contains `BAILOUT_TO_CLIENT_SIDE_RENDERING`. These sections mount in a second pass (a second layout of 58–70 ms at 4x on phones), are missing for no-JS users, SEO and link previews, and pop in without a reveal.

**Fix.** Remove `{ ssr: false }`. Keep `dynamic()` only if you want the split; nothing in them needs the browser at render time (LocalTime already renders a placeholder on the server).

**Verify.** `grep -c 'id="projects"' .next/server/app/index.html` returns 1.

##### PERF-08 (P2): Phones lay out all seven sections up front
**Files:** `src/app/globals.css:177-183`, slide wrappers in HorizontalLayout.tsx

**Evidence.** The first Layout takes 199–306 ms at 4x (≈50–75 ms on a real phone). Removing `text-wrap` saved only about 30–100 ms at 4x, and the measurements were noisy.

**Fix (optional).**
```css
@media (max-width: 63.99rem) { .slide + .slide { content-visibility: auto; contain-intrinsic-size: auto 900px; } }
```
**Caveat.** Menu jumps compute against estimated heights. After MOTION-02 (`scrollIntoView`), check that tapping Contact from the top lands exactly. If it doesn't, drop this. Keep `text-wrap: balance` on headings.

##### PERF-09 (P2): Images: no AVIF
**File:** `next.config.ts:10-14`

**Fix.** Add `formats: ['image/avif', 'image/webp']` to `images`. Screenshot sources are large PNGs (`happyfox-app.png` is 2.2 MB), so AVIF cuts transfer size. Decode-before-swap is covered in MOTION-08. The `sizes` values are correct.

##### PERF-10 (P2): Firefox root scrollbar on the desktop deck
**File:** `src/app/globals.css:202-210`

**Evidence.** Only `::-webkit-scrollbar` is hidden. Firefox with classic scrollbars shows a root scrollbar over the 100vw slides. The `overflow:hidden` toggles in the intro and Modal then add and remove it, reflowing the whole track.

**Fix.** `@media (min-width: 64rem) { html { scrollbar-width: none; } }`

##### PERF-11 (P2): Backdrop filters over a moving track
**Files:** `src/components/dom/Navigation.tsx:94`, `src/components/dom/DotNav.tsx:26`, `src/components/ui/Modal.tsx:95`

**Evidence.** The nav (1440×52) and dot pill (174×36) use `blur(20px) saturate(1.8)` and are re-filtered every frame while the track moves underneath. The modal scrim blurs the full viewport at ≥640 px. Layer count (10–11) is fine.

**Fix.**
- Keep the nav blur; it is the apple.com signature.
- Add `@custom-variant reduced-transparency (@media (prefers-reduced-transparency: reduce));` and, on both navs, `reduced-transparency:backdrop-blur-none reduced-transparency:bg-[var(--background)]`.

**Verify.** On an integrated-GPU Windows laptop, the Performance GPU track stays under 8 ms per frame during a sweep. If it doesn't, drop the dot-pill blur first.

---

### Section 3: Motion token system

Usage rules:
- **standard**: hovers, colour changes and opacity-only state.
- **apple**: anything entering or settling into place.
- **exit**: anything leaving.
- **emphasized**: large user-initiated moves (theme circle, count-up).
- **springs**: physical surfaces (sheets, dialogs).
- Scroll-linked effects are always linear.
- Stagger at most 5 steps.
- No bounce anywhere (per STYLE.md).

##### CSS (`src/app/globals.css`)
Delete `--ease-apple` from `:root` at lines 84-85 (it moves into `@theme static`). Replace the blanket reduced-motion rule at lines 191-200 with the block at the end.
```css
@theme static {
  --ease-standard: cubic-bezier(0.25, 0.1, 0.25, 1);     /* utility: ease-standard */
  --ease-apple: cubic-bezier(0.28, 0.11, 0.32, 1);       /* utility: ease-apple; apple.com product-page curve */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);               /* utility: ease-exit */
  --ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);      /* utility: ease-emphasized */
  --default-transition-duration: 200ms;                  /* every bare transition-colors / transition-opacity */
  --default-transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}

:root {
  --motion-fast: 200ms;     /* hover, colour, opacity-only state, scrim fade */
  --motion-base: 300ms;     /* small moves: dot, chevron, copy label, menu items, accordion, exits */
  --motion-slow: 500ms;     /* containers: stage cross-fade, menu panel, theme circle, intro fade-out */
  --motion-reveal: 700ms;   /* content entrances: fade + rise */
  --motion-stagger: 50ms;   /* per sibling, max 5 steps */
  --motion-rise: 24px;      /* entrance travel */
  --motion-rise-sm: 8px;    /* LCP text travel (no fade) */
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-rise: 0px;
    --motion-rise-sm: 0px;
    --motion-stagger: 0ms;
    --motion-slow: 200ms;
    --motion-reveal: 200ms;   /* fades stay, movement goes */
  }
  html { scroll-behavior: auto; }
}
```
Component CSS updates:
- `.kn-chevron` (line 363): `transition: transform var(--motion-fast) var(--ease-standard);`
- `.kn-pill` (line 386): `transition: background-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard);`
- `.kn-icon-btn` (line 443) and `.kn-plus` (line 461): same, with `var(--motion-fast) var(--ease-standard)`.
- Remove `duration-300` from every `transition-colors` utility (About.tsx:59,62,106; Projects.tsx:122; Navigation.tsx:94,120,132; ThemeToggle.tsx:25; CopyButton.tsx:70). The default token applies.

##### TypeScript (`src/utils/motion.ts`)
Replaces the current file.
```ts
import type { Transition } from 'motion/react'

/** Seconds (Motion). CSS twins: --motion-fast / --motion-base / --motion-slow / --motion-reveal. */
export const DURATION = {
  fast: 0.2,
  base: 0.3,
  slow: 0.5,
  reveal: 0.7,
  count: 1.2,   // number count-up (text tween)
} as const

export const STAGGER = 0.05
export const RISE = 24
export const RISE_SM = 8

type Bezier = readonly [number, number, number, number]
export const EASE = {
  standard: [0.25, 0.1, 0.25, 1],
  apple: [0.28, 0.11, 0.32, 1],
  exit: [0.4, 0, 1, 1],
  emphasized: [0.16, 1, 0.3, 1],
} as const satisfies Record<string, Bezier>

/** Critically damped, like SwiftUI's .smooth. */
export const SPRING = {
  sheet: { type: 'spring', visualDuration: 0.5, bounce: 0 },
  ui: { type: 'spring', visualDuration: 0.3, bounce: 0 },
} as const satisfies Record<string, Transition>

export const TRANSITION = {
  hover: { duration: DURATION.fast, ease: EASE.standard },
  fade: { duration: DURATION.fast, ease: EASE.standard },
  move: { duration: DURATION.base, ease: EASE.apple },
  container: { duration: DURATION.slow, ease: EASE.apple },
  reveal: { duration: DURATION.reveal, ease: EASE.apple },
  exit: { duration: DURATION.base, ease: EASE.exit },
  enter: SPRING.sheet,
} as const satisfies Record<string, Transition>

export const ms = (seconds: number) => Math.round(seconds * 1000)
export const cubicBezier = (e: Bezier) => `cubic-bezier(${e.join(', ')})`

/** Temporary aliases; delete once every call site is migrated. */
export const EASE_APPLE = EASE.apple
export const EASE_OUT = EASE.emphasized
```
In any Motion animation, move with `transform` strings (`'translate3d(0,12px,0)'`), not `x`/`y`/`scale`, so they run on the compositor. Branch on `useReducedMotion()` for those, since `reducedMotion="user"` only strips independent transforms.

##### Call-site mapping (old → new)

| Call site | Now | New |
|---|---|---|
| Headline / Rise (keynote.tsx) | 1 s EASE_APPLE + delay | `.kn-reveal`: `--motion-reveal`, `ease-apple`, `--i` × 50 ms |
| Hero (HeroOverlay.tsx) | 1 s, delays 0.1–0.7 s | `.kn-enter` / `.kn-enter-text`, `--i` 0–5 |
| Intro content / exit | 1 s; pill delay 0.5 s / 0.7 s | `.kn-enter` `--i` 0,1,3 / `--motion-slow` `ease-apple` |
| CountUp | 1.6 s [0.16,1,0.3,1] | `DURATION.count`, quartic-out (≈ emphasized) |
| JS snap / smoothScrollTo | 0.7 s / 1.2 s | native CSS snap + `scrollIntoView` |
| Track / ScaleIn | JS scroll-linked | accelerated scroll-linked, linear |
| DotNav | 500 ms width | `--motion-base` `ease-apple` (+ containment) |
| Nav links, language, theme button | 300 ms Tailwind curve | default 200 ms standard |
| Hamburger | 300 ms + `top` jump | `--motion-base` `ease-apple`, transform only |
| Mobile menu panel / items | 0.25 s default / 0.4 s, 30 ms stagger | `TRANSITION.fade` / `TRANSITION.move`, delay `Math.min(i, 5) * STAGGER` |
| Modal scrim / panel | 0.18 s / 0.45 s in and out | `TRANSITION.fade` / `SPRING.sheet` in, `TRANSITION.exit` out |
| Project stage | 0.5 + 0.5 s, `mode="wait"` | `TRANSITION.container` in, `TRANSITION.fade` out, overlapped |
| Phone accordion | 0.45 s height | grid-rows `--motion-base` `ease-apple` |
| Theme circle | 650 ms [0.22,1,0.36,1] | `ms(DURATION.slow)`, `cubicBezier(EASE.emphasized)` |
| `.theme-transition` | 0.3 s on every element | deleted |
| CopyButton label | 0.3 s [0.22,1,0.36,1] | `TRANSITION.move` |
| Pills, icon buttons, (+), chevron | 0.25–0.3 s ease-apple | `--motion-fast` `ease-standard` |

---

### Section 4: Plan to make it fly, with verification

#### Phases

| Phase | Items | Expected outcome |
|---|---|---|
| 0. Bugs (≈1 h) | MOTION-01, MOTION-07, MOTION-10, MOTION-11 | No dark flash; modal blur correct; no layout on scroll |
| 1. First paint | PERF-01, MOTION-06, PERF-04 | Mobile LCP 3.8 s → ≤ 1.8 s; returning-visitor LCP ≈ FCP; 0 font bytes on Apple devices |
| 2. Scroll engine | MOTION-02, MOTION-03, MOTION-04, PERF-06 | Native wheel, trackpad and keyboard; compositor-driven track; 1 commit per slide change |
| 3. Reveals and tokens | MOTION-05, MOTION-08, MOTION-09, MOTION-12, MOTION-13 + Section 3 | Every animation on transform/opacity at the compositor; one vocabulary |
| 4. JS diet | PERF-02, PERF-03 (A), PERF-05, PERF-07, then PERF-03 (B) | ≤ 150 KiB, then ≤ 120 KiB; language-toggle INP < 100 ms |

**View transitions.** Use them only for the theme circle (keep, retuned) and optionally the project stage (MOTION-08 option B). Do not use them for slide navigation or dialogs: a view transition freezes input and snapshots the page.

**Scroll-driven, apple.com style.** Exactly two scrubbed effects:
1. The desktop product shot (accelerated ScaleIn).
2. Optionally the phone product shot:
```css
@supports (animation-timeline: view()) {
  @media (max-width: 63.99rem) and (prefers-reduced-motion: no-preference) {
    .kn-shot-scrub { animation: kn-shot-in linear both; animation-timeline: view(); animation-range: entry 0% cover 35%; }
  }
}
@keyframes kn-shot-in { from { transform: scale(0.92); opacity: 0.6; } }
```
Text reveals stay time-based (triggered once), as apple.com does them.

#### Targets

| Metric | Now | Target |
|---|---|---|
| Lighthouse mobile LCP, first visit | 3.8 s | < 1.8 s |
| Phone probe LCP, returning visitor (4x, slow 4G) | 4.4–4.6 s | < 1.8 s |
| Lighthouse mobile TBT | 220 ms | < 100 ms |
| CLS (watch the font swap after PERF-01) | 0–0.003 | < 0.02 |
| INP proxy, language toggle (4x) | 320 ms desktop / 408 ms phone | < 100 ms |
| INP proxy, open dialog (4x) | 128 ms | < 100 ms |
| Initial JS gzip | 228.1 KiB | ≤ 150 KiB (≤ 120 with PERF-03 B) |
| Theme class mutations after the head script | 2 (dark flash) | 0 |
| Layouts during a 3-slide sweep | 90 | ≤ 5 |
| Style recalcs per scroll frame (Chrome/Safari) | ~1.5 | ~0 |
| Wheel notch / ArrowDown / ArrowRight advances one slide | no / no / no | yes / yes / yes |

#### How to verify

1. **Build.** Once the other build process is done: `npm run build && npx next start -p 3011`.
2. **Lighthouse** (5 runs, take the median), from any directory:
```bash
CHROME_PATH="C:/Users/Andrew/AppData/Local/ms-playwright/chromium-1194/chrome-win/chrome.exe" node C:/Users/Andrew/AppData/Local/Temp/claude/pwtool/node_modules/lighthouse/cli/index.js http://localhost:3011/ --only-categories=performance --output=json --output-path=./lh-mobile.json --chrome-flags="--headless=new"
```
   Add `--preset=desktop` for desktop. Lighthouse always measures the first visit with the intro; the probes below cover returning visitors.
3. **Probes.** Run with `node <script> http://localhost:3011` from `C:\Users\Andrew\AppData\Local\Temp\claude\audit-motion\`. Selectors may need updating after the refactor.

| Script | What it reports |
|---|---|
| `mobile.mjs` | LCP, CLS, long tasks, theme mutations, screencast frames |
| `desktop.mjs` (`… light`) | load metrics, layers, scroll/keyboard/nav-jump behaviour, trace |
| `layout-attrib.mjs` | layouts and style recalcs per sweep |
| `inp.mjs` | Event Timing for toggles, dialogs, project switch, menu |
| `gr-and-snap.mjs` | Greek flip and CLS |
| `modal-blur.mjs` | backdrop with the wrapper at opacity 1 vs 0.99 |

4. **DevTools** (Chrome, 1440×900, CPU 4x):
   - Performance: record a trackpad sweep across 3 slides. Expect no Layout events from DotNav, no per-frame Recalculate Style or Layerize from the track, a main thread under 4 ms per frame, and no dropped frames in the Frames lane at 120 Hz on Apple silicon.
   - Animations panel: the scroll-driven track and stage animations are listed.
   - Rendering: Paint flashing shows nothing over the track during the sweep. Layer borders show one track layer, plus the stage while ScaleIn is active.
   - Network: with a Mac UA, no `.woff2` requests.
5. **Hardware** (headless cannot emulate wheel or trackpad gestures):
   - Mac trackpad: vertical fling lands on a slide; horizontal swipe moves one slide and never goes Back.
   - Windows mouse: one notch moves one slide.
   - Keyboard: Up/Down/Left/Right, PageUp/PageDown, Space, Home/End.
   - iPhone Safari and Android Chrome: no theme flash, hero visible at first paint, bottom sheet rises from the edge.
   - macOS "Reduce motion" on: fades only, instant snaps.
6. **Field.** Vercel Speed Insights (already installed) at p75 after 7 days: LCP < 1.8 s on mobile, INP < 100 ms, CLS < 0.02.

---

## Appendix C: Finding index and measurement commands

### C.1 Where each finding is handled

| Findings | Task |
|---|---|
| BUG-01 storage crash | 2.1 |
| BUG-02 / UX-01 Tab desync | 3.5 |
| BUG-03 / UX-07 / MOTION-01 theme flash | 2.2 |
| BUG-04 / PERF-07 / UX-20 / CONTENT-16 SSR + no-JS | 2.3, 4.2–4.5 |
| BUG-05 / CONTENT-14 robots blocks OG | 9.3 |
| BUG-06 / UX-12 / PERF-03 / ARCH-01 Greek flash + i18n | 5.1–5.4 |
| BUG-07 / MOTION-02 / UX-02 snap fights user | 3.2–3.3 |
| BUG-08 breakpoint crossing | 3.8 |
| BUG-09 / A11Y-02 menu not modal | 2.5 |
| BUG-10 / A11Y-03 / MOTION-06 intro | 4.2 |
| BUG-11 short-viewport clipping | 3.5, 3.1, 7.1 |
| BUG-12 / UX-13 modal focus | 2.4 |
| BUG-13 metadata | 9.1–9.5 |
| BUG-14 / A11Y-12 / CONTENT-35 English-only labels | 8.9 |
| BUG-15 / A11Y-05 / A11Y-08 semantics | 8.4, 8.5, 6.4 |
| BUG-16 / SIZE-03 breakpoints, iPad | 3.1 |
| BUG-17 `priority`, stage `sizes` | 9.7, 6.3 |
| BUG-18 / UX-11 / PERF-10 scrollbars | 7.7 |
| BUG-19 / CONTENT-06 / CONTENT-31 stale descriptions | P1, 9.6, 10.2 |
| BUG-20 / UX-04 deep links | 3.7 |
| ARCH-02 content model | 5.2, 5.7 |
| ARCH-03 slide registry | 5.5 |
| ARCH-04 / PERF-06 one scroll source | 3.2, 3.6 |
| ARCH-05 data in components | 5.6 |
| ARCH-06 `gr` → `el` | 5.1 |
| ARCH-07 dead code and deps | 10.1 |
| ARCH-08 error boundary, `'use client'` | 2.1, 2.3 |
| UX-03 / MOTION-03 arrows, sideways swipe | 3.4 |
| UX-05 focus after nav | 3.7 |
| UX-06 sheet padding | 2.4, 8.14 |
| UX-08 / UX-18 / CONTENT-27 / CONTENT-07 contact | 8.10 |
| UX-09 / UX-19 / MOTION-05 reveals, count-up | 4.5 |
| UX-10 sticky hover | 6.9 |
| UX-14 / MOTION-07 sheets | 2.4, 6.2 |
| UX-15 theme-color | 2.2 |
| UX-16 projects | 6.4, 8.12 |
| UX-17 menu polish | 8.11 |
| A11Y-01 scroll padding | 7.6 |
| A11Y-04 target size | 6.5, 8.1 |
| A11Y-06 / A11Y-07 / A11Y-09 / A11Y-10 / A11Y-11 | 8.2, 8.3, 8.6, 8.7, 8.8 |
| SIZE-01 / SIZE-02 / SIZE-04 / SIZE-05 / SIZE-06 | 7.1, 7.2, 7.3, 7.4, 7.5 |
| MOTION-04 compositor track | 6.1 |
| MOTION-08 / MOTION-09 / MOTION-10 / MOTION-11 / MOTION-12 / MOTION-13 | 6.3, 6.4, 6.5, 6.6, 2.2, 4.1 + 6.11 |
| PERF-01 LCP gated on hydration | 4.3–4.4 |
| PERF-02 JS size | 5.2, 6.12, 10.1 |
| PERF-04 fonts | 4.6 |
| PERF-05 load commits | 2.2, 4.2, 5.4 |
| PERF-08 content-visibility | 6.14 (optional) |
| PERF-09 AVIF | 9.7 |
| PERF-11 backdrop blur | 6.10 |
| UX Top-10 #1 / #2 / #3 / #4 / #5 / #6 / #7 / #8 / #9 / #10 | 3.3 / 4.2 / 7.3 / 8.15 / 6.2 / 8.17 / 7.2 / 8.10 / 5.3 / 8.16 |
| CONTENT-01…48 | P1 (exceptions listed in P1) |
| **AUD-01** wordmark logos repeat their label (Tech specs: "jamf Jamf Pro", "macOS macOS", "DUO DUO MFA") | 7.8 |
| **AUD-02** truncation hides facts (ITIL year, Greek TEE name, thesis title on phones) | 7.9 |
| **AUD-03** at 2560×1440 the layout is small and half empty | 7.2 |
| **AUD-04** touch targets 16–40 px on phones | 8.1 |
| **AUD-05** source images up to 5.8 MB; six unused images | 9.7, D16 |
| **AUD-06** no security headers on the live site (HSTS only) | 9.8 |
| **AUD-07** parked `style/*` branches have public Vercel preview URLs | D13 |
| **AUD-08** `style-preview/` (3.2 MB) and `STYLE.md` in the release | 10.3, D17 |
| **AUD-09** headless frame p95 33 ms at 1920/2560 during wheel sweeps | 6.1 (re-measure) |
| **AUD-10** mobile number published in JSON-LD and in the Drive CV | 9.2, D5 |

### C.2 Measurement commands

Lighthouse uses Playwright's Chromium. Run from any folder and take the median of 5:
```bash
export CHROME_PATH="C:/Users/Andrew/AppData/Local/ms-playwright/chromium-1194/chrome-win/chrome.exe"
npx -y lighthouse@12.8.2 http://localhost:3100/   --quiet --chrome-flags="--headless=new" --output=json --output-path=./lh-mobile.json
npx -y lighthouse@12.8.2 http://localhost:3100/   --quiet --chrome-flags="--headless=new" --preset=desktop --output=json --output-path=./lh-desktop.json
npx -y lighthouse@12.8.2 http://localhost:3100/el --quiet --chrome-flags="--headless=new" --output=json --output-path=./lh-mobile-el.json
node -e "const r=require('./lh-mobile.json');console.log(Object.values(r.categories).map(c=>c.id+':'+Math.round(c.score*100)).join(' '), 'LCP', r.audits['largest-contentful-paint'].displayValue, 'TBT', r.audits['total-blocking-time'].displayValue)"
```

The audit's probe scripts are reference implementations to port into e2e tests. They import Playwright from the `pwtool` folder and expect a server on `:3001`/`:3011`, and they may have been cleaned up:

| Folder | Scripts |
|---|---|
| `C:\Users\Andrew\AppData\Local\Temp\claude\audit-bugs\` | `t1-theme` … `t14-greek` (theme, Tab, resize, nav, deep link, snap, fit, no-JS, count-up, no-storage, modal, overflow, Greek) |
| `C:\Users\Andrew\AppData\Local\Temp\claude\audit-ux\` | `audit.mjs fit\|mobile\|kbd\|theme\|dialogs\|nav\|intro`, `contrast.mjs`, `gr.mjs` |
| `C:\Users\Andrew\AppData\Local\Temp\claude\audit-motion\` | `mobile.mjs`, `desktop.mjs`, `layout-attrib.mjs`, `inp.mjs`, `gr-and-snap.mjs`, `modal-blur.mjs` |
| `C:\Users\Andrew\AppData\Local\Temp\claude\pwtool\` | `shots.mjs` (20-combination screenshots and metrics), `mobile-walk.mjs`, `sheet.mjs` |

