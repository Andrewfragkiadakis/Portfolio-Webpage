import { expect, test } from '@playwright/test'
import { isPhone, jumpToSlide, open, type Lang } from './helpers'

/** Desktop sizes where every slide must fit between the nav and the dot navigation. */
const VIEWPORTS = [
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 1152, height: 768 },
    { width: 1536, height: 730 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1440 },
]

const SLIDES = 7
/** Smallest allowed text, and the clear gap kept above the dot navigation. */
const MIN_FONT_PX = 12
const DOT_GAP_PX = 8

for (const viewport of VIEWPORTS) {
    for (const lang of ['en', 'el'] as Lang[]) {
        test(`every slide fits at ${viewport.width}×${viewport.height} (${lang})`, async ({ page }, testInfo) => {
            test.skip(isPhone(testInfo), 'desktop track only')
            await page.setViewportSize(viewport)
            await open(page, { lang })
            await page.waitForLoadState('networkidle')

            const problems: string[] = []
            for (let i = 0; i < SLIDES; i++) {
                await jumpToSlide(page, i)
                await page.waitForTimeout(1800) // let entrance animations finish
                const report = await page.evaluate((DOT_GAP_PX) => {
                    const iw = window.innerWidth
                    const nav = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
                    const dots = document.querySelector('[data-dotnav], nav[aria-label="Slides"]')?.getBoundingClientRect().top ?? window.innerHeight
                    const bad: string[] = []
                    let minFont = Infinity
                    document.querySelectorAll<HTMLElement>('.slide :is(h1, h2, h3, p, li, a, button, img, dt, dd)').forEach((el) => {
                        const r = el.getBoundingClientRect()
                        if (!r.width || !r.height || r.right <= 1 || r.left >= iw - 1) return
                        const label = (el.textContent || el.getAttribute('alt') || el.tagName).trim().slice(0, 40)
                        if (r.top < nav - 1) bad.push(`${label}: top ${Math.round(r.top)} < nav ${Math.round(nav)}`)
                        if (r.bottom > dots - DOT_GAP_PX) bad.push(`${label}: bottom ${Math.round(r.bottom)} > dots ${Math.round(dots)}`)
                        if (el.childElementCount === 0 && el.textContent?.trim()) minFont = Math.min(minFont, parseFloat(getComputedStyle(el).fontSize))
                    })
                    return { bad: bad.slice(0, 5), minFont }
                }, DOT_GAP_PX)
                for (const b of report.bad) problems.push(`slide ${i + 1}: ${b}`)
                if (report.minFont < MIN_FONT_PX) problems.push(`slide ${i + 1}: smallest text ${report.minFont}px`)
            }
            expect(problems).toEqual([])
        })
    }
}
