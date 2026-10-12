import { expect, test } from '@playwright/test'
import { collectErrors, isPhone, jumpToSlide, open, scrollSettled, waitForReveal } from './helpers'

test('works when site storage is blocked', async ({ page }) => {
    const errors = collectErrors(page)
    await open(page, { blockStorage: true })
    await expect(page.locator('#hero-title')).toBeVisible()
    await page.waitForLoadState('networkidle')
    expect(errors.filter((e) => e.startsWith('pageerror'))).toEqual([])
})

/** Records every class the <html> element has, from the first script onwards. */
async function recordThemeClasses(page: import('@playwright/test').Page) {
    await page.addInitScript(() => {
        const log: string[] = []
        ;(window as unknown as { __themeLog: string[] }).__themeLog = log
        const record = () => log.push(document.documentElement.classList.contains('dark') ? 'dark' : document.documentElement.classList.contains('light') ? 'light' : 'none')
        new MutationObserver(record).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    })
}

test('a stored light theme never flashes dark', async ({ page }) => {
    await recordThemeClasses(page)
    await open(page, { theme: 'light' })
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    const log = await page.evaluate(() => (window as unknown as { __themeLog: string[] }).__themeLog)
    expect(log).not.toContain('dark')
})

test('with no stored theme, the site follows the system and stores nothing', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await recordThemeClasses(page)
    await open(page)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull()
    expect(await page.evaluate(() => (window as unknown as { __themeLog: string[] }).__themeLog)).not.toContain('dark')
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(page.locator('html')).toHaveClass(/dark/)
})

test('a chosen theme persists across reloads', async ({ page }, testInfo) => {
    await open(page, { theme: 'light' })
    if (isPhone(testInfo)) {
        await page.getByRole('button', { name: /open menu/i }).click()
        await page.locator('#mobile-menu').getByRole('button', { name: /dark/i }).click()
    } else {
        await page.locator('header').getByRole('button', { name: /dark/i }).click()
    }
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
})

test('every section is in the server HTML', async ({ request }) => {
    const html = await (await request.get('/')).text()
    for (const id of ['hero', 'about', 'services', 'specs', 'experience', 'projects', 'contact']) {
        expect(html, `#${id} missing from server HTML`).toContain(`id="${id}"`)
    }
    // Vercel's SpeedInsights renders client-only after </main>; page content must not.
    const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'))
    expect(main).not.toContain('BAILOUT_TO_CLIENT_SIDE_RENDERING')
})

test('dialogs keep focus, padding and never block the page after closing', async ({ page }, testInfo) => {
    await open(page)
    await page.waitForLoadState('networkidle')
    const trigger = page.locator('#about').getByRole('button').filter({ hasText: /story|ιστορία/i }).first()
    if (isPhone(testInfo)) await trigger.scrollIntoViewIfNeeded()
    else {
        await jumpToSlide(page, 1)
        await scrollSettled(page)
    }
    await waitForReveal(trigger)
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const padding = await dialog.evaluate((el) => {
        const inner = el.querySelector(':scope > div:last-child') ?? el
        return Math.max(parseFloat(getComputedStyle(el).paddingBottom), parseFloat(getComputedStyle(inner).paddingBottom))
    })
    expect(padding).toBeGreaterThanOrEqual(40)

    // Focus stays put when the parent re-renders (e.g. a resize).
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 80))
    const size = page.viewportSize()!
    await page.setViewportSize({ width: size.width - 10, height: size.height })
    await page.waitForTimeout(200)
    expect(await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 80))).toBe(focused)

    // Background is inert while open.
    expect(await page.locator('#main-content').getAttribute('inert')).not.toBeNull()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden({ timeout: 2000 })
    expect(await page.locator('#main-content').getAttribute('inert')).toBeNull()
    if (!isPhone(testInfo)) {
        // Right after closing, a click reaches the page.
        const hit = await page.evaluate(() => {
            const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2)
            return !!el && !el.closest('[role="dialog"]') && getComputedStyle(el.closest('.fixed') ?? document.body).pointerEvents !== 'none'
        })
        expect(hit).toBe(true)
    }
})

test('the phone menu is modal', async ({ page }, testInfo) => {
    test.skip(!isPhone(testInfo), 'phone menu only')
    await open(page)
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: /open menu/i }).click()
    await expect(page.locator('#mobile-menu')).toBeVisible()
    expect(await page.locator('#main-content').getAttribute('inert')).not.toBeNull()
    for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab')
        const inPage = await page.evaluate(() => !!document.activeElement?.closest('#main-content'))
        expect(inPage).toBe(false)
    }
    const before = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.scrollY)).toBe(before)
    await page.keyboard.press('Escape')
    await expect(page.locator('#mobile-menu')).toBeHidden()
})
