import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { VersionHistory, type VersionHistoryItem } from './version-history'

const versions: VersionHistoryItem[] = [
  {
    id: 'v3',
    label: 'v3',
    author: 'Priya Nair',
    createdAt: new Date(2026, 8, 24, 16, 5),
    status: 'draft',
    summary: 'Adds the personalised advertising purpose.',
  },
  {
    id: 'v2',
    label: 'v2',
    author: 'Leo Martin',
    createdAt: new Date(2026, 8, 12, 9, 30),
    status: 'active',
  },
  {
    id: 'v1',
    label: 'v1',
    author: 'Sofia Reyes',
    createdAt: new Date(2026, 6, 3, 11, 48),
    status: 'published',
  },
]

describe('VersionHistory', () => {
  it('lists each version with its status, author and time', async () => {
    const screen = await render(<VersionHistory versions={versions} />)
    const rows = screen.getByRole('listitem')

    await expect.element(rows.nth(0)).toHaveTextContent('v3')
    await expect.element(rows.nth(0)).toHaveTextContent('Draft')
    await expect
      .element(rows.nth(0))
      .toHaveTextContent('Priya Nair · Sep 24, 2026, 16:05')
    await expect
      .element(screen.getByText('Adds the personalised advertising purpose.'))
      .toBeInTheDocument()
    await expect.element(rows.nth(1)).toHaveTextContent('Active')
    await expect.element(rows.nth(2)).toHaveTextContent('Published')
  })

  it('marks the version on screen', async () => {
    const screen = await render(
      <VersionHistory versions={versions} selectedId='v2' />
    )
    const selected = screen.getByRole('listitem').nth(1)

    await expect.element(selected).toHaveAttribute('aria-current', 'true')
    await expect.element(selected).toHaveTextContent('Viewing')
  })

  it('offers view, download and restore from each row menu', async () => {
    const onView = vi.fn()
    const onDownload = vi.fn()
    const onRestore = vi.fn()
    const screen = await render(
      <VersionHistory
        versions={versions}
        selectedId='v2'
        onView={onView}
        onDownload={onDownload}
        onRestore={onRestore}
      />
    )

    await screen.getByRole('button', { name: 'Actions for v1' }).click()
    await expect
      .element(screen.getByRole('menuitem', { name: 'View' }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByRole('menuitem', { name: 'Download' }))
      .toBeInTheDocument()
    await screen.getByRole('menuitem', { name: 'Restore' }).click()
    expect(onRestore).toHaveBeenCalledWith(versions[2])

    // v2 is on screen and live: nothing to view, nothing to restore.
    await screen.getByRole('button', { name: 'Actions for v2' }).click()
    await expect
      .element(screen.getByRole('menuitem', { name: 'Download' }))
      .toBeInTheDocument()
    expect(screen.getByRole('menuitem').elements()).toHaveLength(1)
    await screen.getByRole('menuitem', { name: 'Download' }).click()
    expect(onDownload).toHaveBeenCalledWith(versions[1])
    expect(onView).not.toHaveBeenCalled()
  })

  it('is read-only without handlers', async () => {
    const screen = await render(<VersionHistory versions={versions} />)

    expect(screen.getByRole('button').elements()).toHaveLength(0)
  })

  it('shows older versions on request', async () => {
    const screen = await render(
      <VersionHistory versions={versions} initialCount={1} />
    )

    expect(screen.getByRole('listitem').elements()).toHaveLength(1)
    await screen.getByRole('button', { name: 'Show 2 older versions' }).click()
    expect(screen.getByRole('listitem').elements()).toHaveLength(3)
  })

  it('has loading and empty states', async () => {
    const loading = await render(<VersionHistory versions={[]} loading />)
    await expect
      .element(loading.getByText('Loading versions'))
      .toBeInTheDocument()
    loading.unmount()

    const empty = await render(<VersionHistory versions={[]} />)
    await expect.element(empty.getByText('No versions yet')).toBeInTheDocument()
  })
})
