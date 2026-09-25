import { expect, test } from '@playwright/test'
import { listStories, storyUrl } from './stories'

// Screenshot of every story in light, dark and RTL. Update baselines with
// `npm run test:visual -- --update-snapshots` after an intended change.
const variants = [
  { theme: 'light', dir: 'ltr' },
  { theme: 'dark', dir: 'ltr' },
  { theme: 'light', dir: 'rtl' },
] as const

for (const globals of variants) {
  test(`stories match baseline (${globals.theme}, ${globals.dir})`, async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(10 * 60_000)
    for (const story of await listStories(baseURL!)) {
      await test.step(story.id, async () => {
        await page.goto(storyUrl(story.id, globals))
        await page.locator('#storybook-root').waitFor()
        await page.evaluate(() => document.fonts.ready)
        await expect
          .soft(page)
          .toHaveScreenshot(`${story.id}--${globals.theme}-${globals.dir}.png`, {
            fullPage: true,
          })
      })
    }
  })
}
