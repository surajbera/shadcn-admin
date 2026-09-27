import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Stepper } from './stepper'

const steps = [
  { title: 'Identity', description: 'Who is asking' },
  { title: 'Request type' },
  { title: 'Review' },
]

describe('Stepper', () => {
  it('marks complete, current and upcoming steps', async () => {
    const screen = await render(
      <Stepper aria-label='New request' steps={steps} current={1} />
    )
    const items = screen.getByRole('listitem')

    await expect.element(items.nth(0)).toHaveAttribute('data-state', 'complete')
    await expect.element(items.nth(0)).toHaveTextContent('(completed)')
    await expect.element(items.nth(1)).toHaveAttribute('aria-current', 'step')
    await expect.element(items.nth(2)).toHaveAttribute('data-state', 'upcoming')
    await expect.element(screen.getByText('Who is asking')).toBeInTheDocument()
  })

  it('has no buttons without onStepClick', async () => {
    const screen = await render(
      <Stepper aria-label='New request' steps={steps} current={2} />
    )

    expect(screen.getByRole('button').elements()).toHaveLength(0)
  })

  it('lets people go back to completed steps, never forward', async () => {
    const onStepClick = vi.fn()
    const screen = await render(
      <Stepper
        aria-label='New request'
        steps={steps}
        current={1}
        onStepClick={onStepClick}
      />
    )

    expect(screen.getByRole('button').elements()).toHaveLength(1)
    await screen.getByRole('button', { name: /Identity/ }).click()
    expect(onStepClick).toHaveBeenCalledWith(0)
  })

  it('shows every step complete when the flow is done', async () => {
    const screen = await render(
      <Stepper aria-label='New request' steps={steps} current={steps.length} />
    )

    for (const item of screen.getByRole('listitem').elements()) {
      expect(item).toHaveAttribute('data-state', 'complete')
      expect(item).not.toHaveAttribute('aria-current')
    }
  })
})
