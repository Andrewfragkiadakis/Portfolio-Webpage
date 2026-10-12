import type { Page, TestInfo } from '@playwright/test'

export type Theme = 'light' | 'dark'
export type Lang = 'en' | 'el'

/** Sets stored preferences before any page script runs. */
export async function prime(page: Page, { theme, lang, blockStorage = false }: { theme?: Theme; lang?: Lang; blockStorage?: boolean } = {}) {
    await page.addInitScript(({ theme, lang, blockStorage, LOCALE_ROUTES }) => {
        if (blockStorage) {
            Object.defineProperty(window, 'localStorage', {
                configurable: true,
                get() { throw new DOMException('blocked', 'SecurityError') },
            })
            return
        }
        try {
            // Seed once per tab, so reloads keep whatever the page itself stored.
            if (sessionStorage.getItem('__primed')) return
            sessionStorage.setItem('__primed', '1')
            if (theme) localStorage.setItem('theme', theme)
            if (lang && !LOCALE_ROUTES) localStorage.setItem('language', lang === 'el' ? 'gr' : lang)
            // Skip the first-visit intro while it still exists.
            localStorage.setItem('cinematic-entered', 'true')
        } catch { /* ignore */ }
    }, { theme, lang, blockStorage, LOCALE_ROUTES })
}

/** Whether each language has its own URL ("/" and "/el"). */
export const LOCALE_ROUTES = false

/** Opens the home page in a language, with stored preferences set first. */
export async function open(page: Page, { theme, lang = 'en', blockStorage }: { theme?: Theme; lang?: Lang; blockStorage?: boolean } = {}) {
    await prime(page, { theme, lang, blockStorage })
    await page.goto(LOCALE_ROUTES && lang === 'el' ? '/el' : '/')
}

export const isPhone = (testInfo: TestInfo) => testInfo.project.name === 'phone'

/** Console errors and failed requests, ignoring Vercel's analytics script (it only exists on Vercel). */
export function collectErrors(page: Page): string[] {
    const errors: string[] = []
    const ignored = (url: string) => url.includes('/_vercel/')
    page.on('console', (msg) => {
        if (msg.type() === 'error' && !ignored(msg.location().url ?? '') && !ignored(msg.text())) errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
    page.on('requestfailed', (req) => { if (!ignored(req.url())) errors.push(`requestfailed: ${req.url()}`) })
    page.on('response', (res) => { if (res.status() >= 400 && !ignored(res.url())) errors.push(`HTTP ${res.status()}: ${res.url()}`) })
    return errors
}

/** Index of the desktop slide whose left edge is closest to the viewport's left edge. */
export function slideIndexVisible(page: Page): Promise<number> {
    return page.evaluate(() => {
        let best = 0
        let distance = Infinity
        document.querySelectorAll<HTMLElement>('.slide').forEach((slide, i) => {
            const d = Math.abs(slide.getBoundingClientRect().left)
            if (d < distance) { distance = d; best = i }
        })
        return best
    })
}

/** Index of the dot marked as current in the desktop dot navigation. */
export function activeDot(page: Page): Promise<number> {
    return page.evaluate(() => {
        const dots = Array.from(document.querySelectorAll('[data-dotnav] button, nav[aria-label="Slides"] button'))
        return dots.findIndex((dot) => dot.getAttribute('aria-current') === 'true' || dot.getAttribute('aria-current') === 'step')
    })
}

/** Scrolls the desktop runway so slide `index` is in view, without relying on app code. */
export async function jumpToSlide(page: Page, index: number) {
    await page.evaluate((i) => {
        const runway = document.querySelector<HTMLElement>('[data-runway]')
        const top = (runway?.offsetTop ?? 0) + i * window.innerHeight
        window.scrollTo({ top, behavior: 'instant' })
    }, index)
}

/** Waits until the scroll position has not changed for `quietMs`. */
export async function scrollSettled(page: Page, quietMs = 250, timeoutMs = 4000) {
    await page.evaluate(([quietMs, timeoutMs]) => new Promise<void>((resolve) => {
        const start = performance.now()
        let last = window.scrollY
        let still = performance.now()
        const tick = () => {
            const now = performance.now()
            if (window.scrollY !== last) { last = window.scrollY; still = now }
            if (now - still >= quietMs || now - start > timeoutMs) resolve()
            else requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
    }), [quietMs, timeoutMs])
}
