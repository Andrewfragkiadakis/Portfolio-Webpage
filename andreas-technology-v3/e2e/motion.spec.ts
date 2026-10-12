import { expect, test } from '@playwright/test'
import { isPhone, jumpToSlide, open, scrollSettled, waitForReveal } from './helpers'

test('phone sheets can be dragged down to dismiss', async ({ page }, testInfo) => {
    test.skip(!isPhone(testInfo), 'bottom sheets are a phone layout')
    await open(page)
    const trigger = page.locator('#about').getByRole('button').filter({ hasText: /story/i }).first()
    await trigger.scrollIntoViewIfNeeded()
    await waitForReveal(trigger)
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.waitForTimeout(600) // let the sheet finish rising
    const grabber = page.locator('.kn-grabber')
    const box = (await grabber.boundingBox())!
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    for (let i = 1; i <= 10; i++) await page.mouse.move(x, y + i * 18)
    await page.mouse.up()
    await expect(dialog).toBeHidden({ timeout: 2000 })
})

test('switching projects never shows an empty stage', async ({ page }, testInfo) => {
    test.skip(isPhone(testInfo), 'the stage is desktop only')
    await open(page)
    await jumpToSlide(page, 5)
    await scrollSettled(page)
    const row = page.locator('#projects li button').nth(3)
    await waitForReveal(row)
    await row.click()
    // Within half a second the new shot is in place and its image has decoded.
    await expect.poll(() => page.locator('#project-stage .kn-stage-in img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), { timeout: 1500 }).toBe(true)
    await expect.poll(() => page.locator('#project-stage .kn-stage-out').count(), { timeout: 1500 }).toBe(0)
})

test('copy confirms through a status message', async ({ page, context }, testInfo) => {
    test.skip(isPhone(testInfo), 'clipboard permission is desktop Chromium only')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await open(page)
    await page.keyboard.press('End')
    await scrollSettled(page, 300)
    const button = page.locator('#contact').getByRole('button', { name: /copy/i })
    await waitForReveal(button)
    await button.click()
    await expect(page.locator('#contact [role="status"]')).toHaveText(/copied/i)
})

test('no animation library ships', async ({ request }) => {
    const html = await (await request.get('/')).text()
    const scripts = [...html.matchAll(/<script[^>]+src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)].map((m) => m[1])
    for (const src of scripts) {
        const js = await (await request.get(src)).text()
        expect(js.includes('AnimatePresence') || js.includes('framer-motion'), src).toBe(false)
    }
})
