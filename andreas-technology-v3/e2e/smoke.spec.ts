import { expect, test } from '@playwright/test'
import { collectErrors, isPhone, open } from './helpers'

for (const lang of ['en', 'el'] as const) {
    test(`loads cleanly (${lang})`, async ({ page }) => {
        const errors = collectErrors(page)
        await open(page, { lang })
        await expect(page.locator('#hero-title')).toBeVisible()
        await page.waitForLoadState('networkidle')
        expect(errors).toEqual([])
    })
}

test('no horizontal overflow on phones', async ({ page }, testInfo) => {
    test.skip(!isPhone(testInfo), 'phone layout only')
    for (const lang of ['en', 'el'] as const) {
        await open(page, { lang })
        await page.waitForLoadState('networkidle')
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
        }))
        expect(scrollWidth, `${lang} page is wider than the screen`).toBeLessThanOrEqual(clientWidth)
    }
})
