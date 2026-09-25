import { describe, expect, it } from 'vitest'
import { formatDaysLeft, getDeadline, suggestedDueDate } from './deadline'

const now = new Date('2026-09-25T10:00:00')
const receivedAt = new Date('2026-09-05T09:00:00')
const dueAt = new Date('2026-10-05T09:00:00')

describe('getDeadline', () => {
  it('counts elapsed and remaining days for an open request', () => {
    const deadline = getDeadline(
      { status: 'in_progress', receivedAt, dueAt, completedAt: null },
      now
    )
    expect(deadline).toEqual({
      state: 'on_track',
      totalDays: 30,
      elapsedDays: 20,
      daysLeft: 10,
    })
    expect(formatDaysLeft(deadline)).toBe('10 days left')
  })

  it('is due soon inside the last seven days, and due today on the day', () => {
    const soon = getDeadline(
      {
        status: 'new',
        receivedAt,
        dueAt: new Date('2026-09-30'),
        completedAt: null,
      },
      now
    )
    expect(soon.state).toBe('due_soon')

    const today = getDeadline(
      { status: 'new', receivedAt, dueAt: now, completedAt: null },
      now
    )
    expect(formatDaysLeft(today)).toBe('Due today')
  })

  it('is overdue once the due date passes and caps elapsed at the window', () => {
    const deadline = getDeadline(
      {
        status: 'verifying',
        receivedAt,
        dueAt: new Date('2026-09-24'),
        completedAt: null,
      },
      now
    )
    expect(deadline.state).toBe('overdue')
    expect(deadline.elapsedDays).toBe(deadline.totalDays)
    expect(formatDaysLeft(deadline)).toBe('1 day overdue')
  })

  it('stops the clock when the request closes', () => {
    const deadline = getDeadline(
      {
        status: 'completed',
        receivedAt,
        dueAt,
        completedAt: new Date('2026-09-15'),
      },
      now
    )
    expect(deadline.state).toBe('closed')
    expect(deadline.elapsedDays).toBe(10)
    expect(formatDaysLeft(deadline)).toBe('Closed')
  })
})

describe('suggestedDueDate', () => {
  it('adds the regulation window to the received date', () => {
    expect(suggestedDueDate('lgpd', receivedAt)).toEqual(
      new Date('2026-09-20T09:00:00')
    )
    expect(suggestedDueDate('ccpa', receivedAt)).toEqual(
      new Date('2026-10-20T09:00:00')
    )
  })
})
