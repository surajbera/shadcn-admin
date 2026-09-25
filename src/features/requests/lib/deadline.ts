import { addDays, differenceInCalendarDays } from 'date-fns'
import { openStatuses, regulationOf } from '../data/data'
import { type PrivacyRequest, type Regulation } from '../data/schema'

/** Received date plus the regulation's statutory window. */
export function suggestedDueDate(regulation: Regulation, receivedAt: Date) {
  return addDays(receivedAt, regulationOf(regulation).days)
}

type DeadlineState = 'closed' | 'overdue' | 'due_soon' | 'on_track'

export type Deadline = {
  state: DeadlineState
  /** Calendar days from receipt to due date. */
  totalDays: number
  /** Days used so far, 0..totalDays. Stops counting once the request closes. */
  elapsedDays: number
  /** Negative when overdue. */
  daysLeft: number
}

const DUE_SOON_DAYS = 7

export function getDeadline(
  request: Pick<
    PrivacyRequest,
    'status' | 'receivedAt' | 'dueAt' | 'completedAt'
  >,
  now: Date = new Date()
): Deadline {
  const open = openStatuses.includes(request.status)
  const end = open ? now : (request.completedAt ?? now)
  const totalDays = Math.max(
    1,
    differenceInCalendarDays(request.dueAt, request.receivedAt)
  )
  const elapsedDays = Math.min(
    totalDays,
    Math.max(0, differenceInCalendarDays(end, request.receivedAt))
  )
  const daysLeft = differenceInCalendarDays(request.dueAt, now)

  let state: DeadlineState = 'on_track'
  if (!open) state = 'closed'
  else if (daysLeft < 0) state = 'overdue'
  else if (daysLeft <= DUE_SOON_DAYS) state = 'due_soon'

  return { state, totalDays, elapsedDays, daysLeft }
}

export function formatDaysLeft({ state, daysLeft }: Deadline) {
  if (state === 'closed') return 'Closed'
  if (daysLeft < 0) {
    const late = -daysLeft
    return `${late} ${late === 1 ? 'day' : 'days'} overdue`
  }
  if (daysLeft === 0) return 'Due today'
  return `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`
}
