import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { listStories, storyUrl } from './stories'

// Stories are discovered from the running Storybook, so each theme runs as one
// test that visits every story and reports all violations together.
for (const theme of ['light', 'dark'] as const) {
  test(`every story passes axe (${theme})`, async ({ page, baseURL }) => {
    test.setTimeout(10 * 60_000)
    const failures: string[] = []

    for (const story of await listStories(baseURL!)) {
      await page.goto(storyUrl(story.id, { theme }))
      await page.locator('#storybook-root').waitFor()
      const { violations } = await new AxeBuilder({ page })
        .include('#storybook-root')
        .analyze()

      for (const v of violations) {
        for (const node of v.nodes) {
          failures.push(
            `${story.id} · ${v.id} · ${node.target.join(' ')}\n    ${node.failureSummary?.split('\n').slice(1).join(' ').trim()}`
          )
        }
      }
    }

    expect(failures, failures.join('\n')).toEqual([])
  })
}
