import { expect, test } from '@playwright/test'
import { isPhone, open } from './helpers'

test('no element is server-rendered invisible', async ({ request }) => {
    const html = await (await request.get('/')).text()
    expect(html.match(/style="[^"]*opacity:\s*0[;"]/g) ?? []).toEqual([])
})

test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('every section is readable and nothing covers the page', async ({ page }) => {
        await page.goto('/')
        for (const id of ['hero', 'about', 'services', 'specs', 'experience', 'projects', 'contact']) {
            const heading = page.locator(`#${id}-title`)
            await expect(heading, `#${id}-title`).toHaveCount(1)
            expect(await heading.evaluate((el) => Number(getComputedStyle(el).opacity)), `#${id}-title opacity`).toBe(1)
        }
        expect(await page.locator('[data-cinematic]').count()).toBe(0)
    })
})

test('the hero is the first thing painted', async ({ page }, testInfo) => {
    await page.addInitScript(() => {
        const w = window as unknown as { __lcp: number; __fcp: number }
        w.__lcp = 0
        w.__fcp = 0
        new PerformanceObserver((list) => { for (const e of list.getEntries()) w.__lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true })
        new PerformanceObserver((list) => { for (const e of list.getEntries()) if (e.name === 'first-contentful-paint') w.__fcp = e.startTime }).observe({ type: 'paint', buffered: true })
    })
    await open(page)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    const { lcp, fcp } = await page.evaluate(() => {
        const w = window as unknown as { __lcp: number; __fcp: number }
        return { lcp: w.__lcp, fcp: w.__fcp }
    })
    // Unthrottled: the hero must not wait for hydration or a fade (it used to be ~1.6 s after FCP).
    expect(lcp - fcp, `LCP ${Math.round(lcp)} ms vs FCP ${Math.round(fcp)} ms (${isPhone(testInfo) ? 'phone' : 'desktop'})`).toBeLessThan(250)
})

test('slides reveal as they arrive', async ({ page }, testInfo) => {
    await open(page)
    await page.waitForLoadState('networkidle')
    const contactTitle = page.locator('#contact-title')
    const before = await contactTitle.evaluate((el) => Number(getComputedStyle(el).opacity))
    expect(before).toBe(0)
    if (isPhone(testInfo)) await contactTitle.scrollIntoViewIfNeeded()
    else await page.keyboard.press('End')
    await expect.poll(() => contactTitle.evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 4000 }).toBe(1)
})
