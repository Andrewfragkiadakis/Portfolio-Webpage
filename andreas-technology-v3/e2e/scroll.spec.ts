import { devices, expect, test, type Page } from '@playwright/test'
import { activeDot, isPhone, open, prime, scrollSettled, slideIndexVisible, waitForApp } from './helpers'

/** Slide index the desktop page rests on, from the scroll position (must be a whole number). */
async function restingSlide(page: Page) {
    await scrollSettled(page, 300)
    // Firefox can rest on a fractional pixel; a slide boundary is within half a pixel.
    return page.evaluate(() => {
        const slide = window.scrollY / window.innerHeight
        return Math.abs(slide - Math.round(slide)) * window.innerHeight < 0.5 ? Math.round(slide) : slide
    })
}

test.describe('desktop deck', () => {
    test.beforeEach(async ({ page }, testInfo) => {
        test.skip(isPhone(testInfo), 'desktop track only')
        await open(page)
        await page.waitForLoadState('networkidle')
        await page.mouse.click(5, 300)
    })

    test('keys move exactly one slide', async ({ page }) => {
        await page.keyboard.press('ArrowDown')
        expect(await restingSlide(page)).toBe(1)
        await page.keyboard.press('ArrowRight')
        expect(await restingSlide(page)).toBe(2)
        await page.keyboard.press('ArrowLeft')
        expect(await restingSlide(page)).toBe(1)
        await page.keyboard.press('ArrowUp')
        expect(await restingSlide(page)).toBe(0)
        await page.keyboard.press('PageDown')
        expect(await restingSlide(page)).toBe(1)
        await page.keyboard.press('End')
        expect(await restingSlide(page)).toBe(6)
        await page.keyboard.press('Home')
        expect(await restingSlide(page)).toBe(0)
    })

    // Headless wheel events are precise (trackpad-like), so a single mouse notch cannot be
    // emulated here; that is on the hardware checklist. A scroll past half a slide must land
    // on the next one, and a sideways swipe must move exactly one.
    test('wheel scrolls rest on a slide and a sideways swipe moves one', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name === 'firefox', 'headless Firefox handles synthetic wheel events differently; checked on hardware')
        await page.mouse.move(700, 450)
        await page.mouse.wheel(0, 600)
        expect(await restingSlide(page)).toBe(1)
        for (let i = 0; i < 6; i++) await page.mouse.wheel(30, 0)
        expect(await restingSlide(page)).toBe(2)
    })

    test('the page never rests between slides, also with reduced motion', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name === 'firefox', 'headless Firefox fires no scrollend for synthetic wheel events; checked on hardware')
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.mouse.move(700, 450)
        await page.mouse.wheel(0, 400)
        const slide = await restingSlide(page)
        expect(Number.isInteger(slide)).toBe(true)
    })

    test('Tab keeps the visible slide, the dots and the focus together', async ({ page }) => {
        test.setTimeout(90_000) // 60 key presses, each waiting for the page to settle
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
        for (let i = 0; i < 60; i++) {
            await page.keyboard.press('Tab')
            const state = await page.evaluate(() => {
                const el = document.activeElement as HTMLElement | null
                const slide = el?.closest<HTMLElement>('[data-slide]')
                const viewport = document.querySelector<HTMLElement>('[data-runway] > div')
                return {
                    slide: slide ? Number(slide.dataset.slide) : -1,
                    scrollLeft: viewport?.scrollLeft ?? 0,
                    opacity: el ? Number(getComputedStyle(el).opacity) : 1,
                    label: (el?.getAttribute('aria-label') || el?.textContent || '').trim().slice(0, 40),
                }
            })
            expect(state.scrollLeft, `scrollLeft after Tab ${i} (${state.label})`).toBe(0)
            if (state.slide < 0) continue
            await scrollSettled(page, 150)
            expect(await slideIndexVisible(page), `visible slide for "${state.label}"`).toBe(state.slide)
            expect(await activeDot(page), `dot for "${state.label}"`).toBe(state.slide)
        }
    })
})

test('deep links open on their section and the address follows the slide', async ({ page }, testInfo) => {
    await prime(page)
    await page.goto('/#projects')
    await waitForApp(page)
    await page.waitForLoadState('networkidle')
    await scrollSettled(page)
    if (isPhone(testInfo)) {
        const top = await page.locator('#projects').evaluate((el) => el.getBoundingClientRect().top)
        expect(Math.abs(top)).toBeLessThan(80)
    } else {
        expect(await slideIndexVisible(page)).toBe(5)
        await page.mouse.click(5, 300)
        await page.keyboard.press('ArrowLeft')
        await scrollSettled(page, 300)
        await expect.poll(() => page.evaluate(() => location.hash)).toBe('#experience')
        await page.reload()
        await page.waitForLoadState('networkidle')
        await scrollSettled(page)
        expect(await slideIndexVisible(page)).toBe(4)
    }
})

test('in-page hash links scroll to their section', async ({ page }) => {
    await open(page)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => { location.hash = 'contact' })
    await scrollSettled(page, 300)
    await expect.poll(() => page.locator('#contact-title').evaluate((el) => {
        const r = el.getBoundingClientRect()
        return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight
    })).toBe(true)
})

test('navigating moves focus to the section', async ({ page }, testInfo) => {
    test.skip(isPhone(testInfo), 'desktop nav links')
    await open(page)
    await page.waitForLoadState('networkidle')
    await page.locator('header').getByRole('link', { name: 'Projects' }).focus()
    await page.keyboard.press('Enter')
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('projects-title')
    await page.keyboard.press('Tab')
    await scrollSettled(page)
    expect(await slideIndexVisible(page)).toBe(5)
})

test('crossing the breakpoint keeps the section', async ({ page }, testInfo) => {
    test.skip(isPhone(testInfo), 'resizes a desktop window')
    await page.setViewportSize({ width: 900, height: 900 })
    await open(page)
    await page.waitForLoadState('networkidle')
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await scrollSettled(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.waitForTimeout(400)
    await scrollSettled(page)
    expect(await slideIndexVisible(page)).toBe(5)
    await page.setViewportSize({ width: 900, height: 900 })
    await page.waitForTimeout(400)
    await scrollSettled(page)
    const top = await page.locator('#projects').evaluate((el) => el.getBoundingClientRect().top)
    expect(top).toBeLessThan(450)
    expect(top).toBeGreaterThan(-450)
})

test('tablets and short windows get the vertical stack', async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name === 'firefox', 'Firefox cannot emulate touch devices')
    for (const options of [
        { ...devices['iPad Pro 11 landscape'], defaultBrowserType: undefined },
        { viewport: { width: 1280, height: 600 } },
        // A 1366 × 768 laptop's browser window, and a narrow desktop window.
        { viewport: { width: 1366, height: 657 } },
        { viewport: { width: 1100, height: 900 } },
    ]) {
        const context = await browser.newContext(options)
        const page = await context.newPage()
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        const runwayHeight = await page.locator('[data-runway]').evaluate((el) => el.getBoundingClientRect().height)
        const slideWidth = await page.locator('.slide').first().evaluate((el) => el.getBoundingClientRect().width)
        // Stack: slides are as wide as the page and the runway is not the 700vh track.
        expect(slideWidth).toBeLessThanOrEqual(page.viewportSize()!.width)
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType)).toBe('none')
        expect(runwayHeight).toBeGreaterThan(0)
        await context.close()
    }
})
