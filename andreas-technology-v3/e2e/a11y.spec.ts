import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { isPhone, jumpToSlide, open, scrollSettled, waitForReveal } from './helpers'

/** Visit every slide so their entrance animations have run, then come back to the top. */
async function revealAll(page: Page, phone: boolean) {
    for (let i = 0; i < 7; i++) {
        if (phone) await page.evaluate((i) => window.scrollTo({ top: (document.documentElement.scrollHeight / 7) * i, behavior: 'instant' }), i)
        else await jumpToSlide(page, i)
        await page.waitForTimeout(250)
    }
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
    await page.waitForTimeout(1200)
}

function serious(results: Awaited<ReturnType<AxeBuilder['analyze']>>) {
    return results.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)
}

for (const lang of ['en', 'el'] as const) {
    for (const theme of ['light', 'dark'] as const) {
        test(`no serious accessibility violations (${lang}, ${theme})`, async ({ page }, testInfo) => {
            await open(page, { lang, theme })
            await revealAll(page, isPhone(testInfo))
            const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
            expect(serious(results)).toEqual([])
        })
    }
}

test('no serious accessibility violations with a dialog open', async ({ page }, testInfo) => {
    await open(page)
    const trigger = page.locator('#about').getByRole('button').filter({ hasText: /story/i }).first()
    if (isPhone(testInfo)) await trigger.scrollIntoViewIfNeeded()
    else {
        await jumpToSlide(page, 1)
        await scrollSettled(page)
    }
    await waitForReveal(trigger)
    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.waitForTimeout(700)
    const results = await new AxeBuilder({ page }).include('[role="dialog"]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(serious(results)).toEqual([])
})

test('touch targets are at least 44 px on phones', async ({ page }, testInfo) => {
    test.skip(!isPhone(testInfo), 'phone layout only')
    await open(page)
    await revealAll(page, true)
    const small = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('a[href], button')]
        .filter((el) => {
            const r = el.getBoundingClientRect()
            if (!r.width || !r.height || el.closest('.sr-only, [inert]') || el.matches('.sr-only')) return false
            // Links inside running text are exempt (WCAG 2.5.8).
            if (el.tagName === 'A' && el.closest('p')) return false
            // An invisible hit area (.kn-hit::after) counts towards the target.
            const after = getComputedStyle(el, '::after')
            const grow = (v: string) => (after.content !== 'none' && after.position === 'absolute' ? Math.max(0, -parseFloat(v) || 0) : 0)
            const width = r.width + grow(after.left) + grow(after.right)
            const height = r.height + grow(after.top) + grow(after.bottom)
            return width < 44 || height < 43.5
        })
        .map((el) => `${(el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 40)} ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`))
    expect(small).toEqual([])
})
