import { expect, test } from '@playwright/test'
import { isPhone, open, scrollSettled, slideIndexVisible, waitForApp } from './helpers'

const GREEK_HEADLINE = 'Αυτοματοποιημένοι'

test('each language is its own server-rendered page', async ({ request }) => {
    const en = await (await request.get('/')).text()
    expect(en).toContain('<html lang="en"')
    expect(en).not.toContain(GREEK_HEADLINE)
    expect(en).toContain('hrefLang="el"')

    const el = await (await request.get('/el')).text()
    expect(el).toContain('<html lang="el"')
    expect(el).toContain(GREEK_HEADLINE)
})

test('a page ships only its own language', async ({ request }) => {
    const html = await (await request.get('/')).text()
    const scripts = [...html.matchAll(/<script[^>]+src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)].map((m) => m[1])
    expect(scripts.length).toBeGreaterThan(0)
    for (const src of scripts) {
        expect(await (await request.get(src)).text(), src).not.toContain(GREEK_HEADLINE)
    }
})

test('routing: /en redirects to /, unknown paths are 404', async ({ request }) => {
    const en = await request.get('/en', { maxRedirects: 0 })
    expect([301, 308]).toContain(en.status())
    expect(en.headers().location).toBe('/')
    expect((await request.get('/foo')).status()).toBe(404)
})

test('switching language keeps the slide and is remembered', async ({ page }, testInfo) => {
    await open(page)
    await page.goto('/#projects')
    await waitForApp(page)
    if (isPhone(testInfo)) {
        await page.getByRole('button', { name: /open menu/i }).click()
        await page.locator('#mobile-menu').getByRole('link', { name: 'Ελληνικά' }).click()
    } else {
        await page.locator('header').getByRole('link', { name: /ΕΛ/ }).click()
    }
    await page.waitForURL(/\/el#projects$/)
    await waitForApp(page)
    await expect(page.locator('html')).toHaveAttribute('lang', 'el')
    if (!isPhone(testInfo)) {
        await scrollSettled(page)
        expect(await slideIndexVisible(page)).toBe(5)
    }

    // The choice is remembered: "/" now opens Greek, without an English frame.
    await page.goto('/')
    await page.waitForURL(/\/el$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'el')
})
