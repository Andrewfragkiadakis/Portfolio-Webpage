import { defineConfig, devices } from '@playwright/test'

const PORT = 3217

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    reporter: [['list']],
    use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
    webServer: {
        command: `npm run build && npm run start -- -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        // Always build and serve the current code: a reused server could be a stale build.
        reuseExistingServer: false,
        timeout: 240_000,
    },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
        { name: 'phone', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
        // Firefox has no scroll-driven animations yet, so it exercises the track's JS fallback.
        { name: 'firefox', testMatch: /(scroll|fit|first-paint)\.spec\.ts/, use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
    ],
})
