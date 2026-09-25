import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
// Real layout matters here: sheets and dialogs are fixed-position overlays.
import '@/styles/index.css'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { DirectionProvider } from '@/context/direction-provider'
import { FontProvider } from '@/context/font-provider'
import { ThemeProvider } from '@/context/theme-provider'

// The fake API waits to feel like a network. Tests do not need to.
vi.mock(import('@/lib/utils'), async (importOriginal) => ({
  ...(await importOriginal()),
  sleep: () => Promise.resolve(),
}))

async function renderApp(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { queryClient },
  })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FontProvider>
          <DirectionProvider>
            <RouterProvider router={router} />
          </DirectionProvider>
        </FontProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
  return { screen, router }
}

describe('Requests feature', () => {
  it('lists requests with their key figures', async () => {
    const { screen } = await renderApp('/requests')

    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'Requests' }))
      .toBeInTheDocument()
    await expect.element(screen.getByText('Due this week')).toBeInTheDocument()
    await expect
      .element(screen.getByRole('link', { name: /^DSR-\d+$/ }).first())
      .toBeInTheDocument()
  })

  it('validates, creates a request, and opens it', async () => {
    const { screen, router } = await renderApp('/requests')

    await screen.getByRole('button', { name: 'New request' }).first().click()
    const sheet = screen.getByRole('dialog', { name: 'New request' })
    await expect.element(sheet).toBeInTheDocument()

    await sheet.getByRole('button', { name: 'Create request' }).click()
    await expect
      .element(sheet.getByText('Enter the subject’s name.'))
      .toBeInTheDocument()
    await expect
      .element(sheet.getByText('Enter a valid email address.'))
      .toBeInTheDocument()

    await userEvent.fill(
      sheet.getByRole('textbox', { name: 'Subject name' }),
      'Maya Lindqvist'
    )
    await userEvent.fill(
      sheet.getByRole('textbox', { name: 'Subject email' }),
      'maya@example.com'
    )
    await sheet.getByRole('button', { name: 'Create request' }).click()

    // Newest first, so the new request is on page one.
    const row = screen.getByRole('row').filter({ hasText: 'Maya Lindqvist' })
    await expect.element(row).toBeInTheDocument()
    await expect.element(row.getByText('New', { exact: true })).toBeVisible()

    // Clicking the ID opens the record. This once bounced back to the list:
    // the table reset its page mid-navigation (see autoResetPageIndex).
    // The test viewport is phone-sized, so click through the DOM.
    const link = row.getByRole('link', { name: /^DSR-\d+$/ })
    ;(link.element() as HTMLAnchorElement).click()
    await expect
      .element(
        screen.getByRole('heading', { level: 1, name: 'Maya Lindqvist' })
      )
      .toBeInTheDocument()
    expect(router.state.location.pathname).toMatch(/^\/requests\/DSR-\d+$/)
    await expect
      .element(screen.getByText('Logged the request manually'))
      .toBeInTheDocument()
  })

  it('changes status and deletes from the detail page', async () => {
    const { screen, router } = await renderApp('/requests/DSR-20558')

    await expect
      .element(screen.getByRole('heading', { level: 1 }))
      .toBeInTheDocument()

    await screen.getByRole('button', { name: 'Set status' }).click()
    await screen.getByRole('menuitemradio', { name: 'In progress' }).click()
    await expect
      .element(screen.getByText('Set status to In progress'))
      .toBeInTheDocument()

    await screen.getByRole('button', { name: 'Delete DSR-20558' }).click()
    await screen.getByRole('button', { name: 'Delete request' }).click()

    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'Requests' }))
      .toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/requests')
    await expect
      .element(screen.getByRole('link', { name: 'DSR-20558' }))
      .not.toBeInTheDocument()
  })

  it('shows a way back when a request does not exist', async () => {
    const { screen } = await renderApp('/requests/DSR-1')

    await expect
      .element(screen.getByText('We could not find DSR-1'))
      .toBeInTheDocument()
    await expect
      .element(screen.getByRole('link', { name: 'Back to requests' }))
      .toBeInTheDocument()
  })
})
