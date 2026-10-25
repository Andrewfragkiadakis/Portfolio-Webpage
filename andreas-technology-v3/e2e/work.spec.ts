import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { collectErrors, isPhone } from './helpers'

/** Every case-study page, with its other-language version. */
const PAGES = [
    { path: '/work', other: '/el/work' },
    { path: '/el/work', other: '/work' },
    { path: '/work/vulnerability-burndown', other: '/el/work/vulnerability-burndown' },
    { path: '/el/work/vulnerability-burndown', other: '/work/vulnerability-burndown' },
    { path: '/work/zero-touch-onboarding', other: '/el/work/zero-touch-onboarding' },
    { path: '/el/work/zero-touch-onboarding', other: '/work/zero-touch-onboarding' },
]

for (const { path, other } of PAGES) {
    test(`loads cleanly: ${path}`, async ({ page }) => {
        const errors = collectErrors(page)
        const response = await page.goto(path)
        expect(response?.status()).toBe(200)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://andreas.technology${path}`)
        await expect(page.locator('header a[hreflang]')).toHaveAttribute('href', other)
        await page.waitForLoadState('networkidle')
        expect(errors).toEqual([])
    })
}

for (const theme of ['light', 'dark'] as const) {
    test(`case-study pages have no serious accessibility violations (${theme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: theme })
        for (const { path } of PAGES) {
            await page.goto(path)
            const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
            const serious = results.violations
                .filter((v) => v.impact === 'serious' || v.impact === 'critical')
                .map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)
            expect(serious, path).toEqual([])
        }
    })
}

test('case-study pages fit narrow phones', async ({ page }, testInfo) => {
    test.skip(!isPhone(testInfo), 'phone layout only')
    await page.setViewportSize({ width: 360, height: 740 })
    for (const { path } of PAGES) {
        await page.goto(path)
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
        }))
        expect(scrollWidth, `${path} is wider than the screen`).toBeLessThanOrEqual(clientWidth)
    }
})

test('an unknown case study gets the branded 404', async ({ page }) => {
    const response = await page.goto('/work/does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found.')
})

test('an unknown path gets the branded 404', async ({ page }) => {
    const response = await page.goto('/no-such-page')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('link', { name: 'Go to the homepage' })).toBeVisible()
})

test('the About slide links to the case studies in its language', async ({ request }) => {
    for (const [path, href] of [['/', '/work'], ['/el', '/el/work']]) {
        const html = await (await request.get(path)).text()
        expect(html, path).toContain(`href="${href}"`)
    }
})

test('security.txt, the CV and the thesis are served', async ({ request }) => {
    const security = await request.get('/.well-known/security.txt')
    expect(security.status()).toBe(200)
    expect(await security.text()).toContain('Contact: mailto:')
    const cv = await request.get('/files/Andreas-Fragkiadakis-CV.pdf')
    expect(cv.status()).toBe(200)
    expect(cv.headers()['content-type']).toContain('application/pdf')
    // The public copy of the thesis (student number and signature removed) replaced the Drive link.
    const thesis = await request.get('/files/Fragkiadakis_2025_Radio-over-Fiber_5G_thesis.pdf')
    expect(thesis.status()).toBe(200)
    expect(thesis.headers()['content-type']).toContain('application/pdf')
})

test('the sitemap lists every case-study page in both languages', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    for (const { path } of PAGES) expect(xml).toContain(`<loc>https://andreas.technology${path}</loc>`)
})
