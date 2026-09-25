type IndexEntry = { id: string; title: string; name: string; type: string }

/** Every story in the Storybook index, read at test collection time. */
export async function listStories(baseURL: string) {
  const res = await fetch(`${baseURL}/index.json`)
  const { entries } = (await res.json()) as {
    entries: Record<string, IndexEntry>
  }
  return Object.values(entries).filter((e) => e.type === 'story')
}

export function storyUrl(
  id: string,
  globals: { theme?: 'light' | 'dark'; dir?: 'ltr' | 'rtl' } = {}
) {
  const g = Object.entries({ theme: 'light', dir: 'ltr', ...globals })
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
  // a11y.manual stops the addon's own axe run, which would collide with ours.
  return `/iframe.html?id=${id}&viewMode=story&globals=${g};a11y.manual:!true`
}
