import { defineConfig, devices } from '@playwright/test'

// Storybook-driven checks for the design system: axe on every story, and
// screenshot comparison on every story. Run `npm run build-storybook` first.
export default defineConfig({
  testDir: 'tests/storybook',
  testMatch: '*.pw.ts',
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  use: {
    baseURL: 'http://127.0.0.1:6007',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'npx storybook dev -p 6007 --ci --no-open --quiet',
    url: 'http://127.0.0.1:6007/index.json',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
