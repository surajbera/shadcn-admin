import { addDays, addHours, min, subDays } from 'date-fns'
import { faker } from '@faker-js/faker'
import { suggestedDueDate } from '../lib/deadline'
import { assignees, regulationOptions, systems } from './data'
import {
  type PrivacyRequest,
  type RequestActivity,
  type RequestStatus,
  type RequestType,
} from './schema'

const SYSTEM = 'Intake form'

const outcome: Record<RequestType, string> = {
  access: 'Delivered the data export to the subject',
  deletion: 'Confirmed deletion across all systems',
  correction: 'Corrected the records and notified the subject',
  portability: 'Delivered a machine-readable export',
  opt_out: 'Recorded the opt-out in the consent platform',
}

const noteSamples = [
  'Subject asked for the export by email only.',
  'Legal hold on billing records until the dispute closes.',
  'Duplicate of an earlier request; merged the history.',
  'Subject is also an employee; loop in HR before sending.',
  'Marketing lists synced nightly; re-check tomorrow.',
]

/** Picks a status that is plausible for how old the request is. */
function pickStatus(receivedAt: Date, dueAt: Date, now: Date): RequestStatus {
  if (dueAt < now) {
    return faker.helpers.weightedArrayElement([
      { weight: 76, value: 'completed' },
      { weight: 12, value: 'rejected' },
      { weight: 12, value: 'in_progress' },
    ])
  }
  const ageDays = (now.getTime() - receivedAt.getTime()) / 86_400_000
  if (ageDays < 2) return 'new'
  return faker.helpers.weightedArrayElement([
    { weight: 10, value: 'new' },
    { weight: 20, value: 'verifying' },
    { weight: 45, value: 'in_progress' },
    { weight: 20, value: 'completed' },
    { weight: 5, value: 'rejected' },
  ])
}

function buildActivity(
  request: Omit<PrivacyRequest, 'activity'>,
  now: Date
): RequestActivity[] {
  const assignee = assignees.find((a) => a.id === request.assigneeId)
  const actor = assignee?.name ?? 'Priya Nair'
  const end = request.completedAt ?? now
  let at = request.receivedAt
  const next = () => {
    const latest = addHours(end, -1)
    if (at < latest) at = faker.date.between({ from: at, to: latest })
    return at
  }
  const entry = (who: string, action: string, when: Date) => ({
    id: faker.string.uuid(),
    actor: who,
    action,
    at: when,
  })

  const log = [entry(SYSTEM, 'Received the request', request.receivedAt)]
  if (request.status === 'new') return log

  if (assignee) log.push(entry('Priya Nair', `Assigned to ${actor}`, next()))
  log.push(entry(actor, 'Sent an identity verification email', next()))
  if (request.status === 'verifying') return log

  if (request.status === 'rejected') {
    log.push(
      entry(
        actor,
        'Rejected: identity could not be verified',
        request.completedAt!
      )
    )
    return log
  }

  log.push(entry(actor, 'Verified the subject’s identity', next()))
  log.push(entry(actor, `Searched ${request.systems.length} systems`, next()))
  if (request.status === 'completed') {
    log.push(entry(actor, outcome[request.type], request.completedAt!))
  }
  return log
}

/** Deterministic seed, relative to `now` so deadlines stay meaningful. */
export function seedRequests(count = 140, now = new Date()): PrivacyRequest[] {
  faker.seed(20418)

  const received = Array.from({ length: count }, () =>
    faker.date.between({ from: subDays(now, 100), to: now })
  ).sort((a, b) => b.getTime() - a.getTime())

  return received.map((receivedAt, index) => {
    const regulation = faker.helpers.weightedArrayElement([
      { weight: 50, value: regulationOptions[0].value },
      { weight: 25, value: regulationOptions[1].value },
      { weight: 10, value: regulationOptions[2].value },
      { weight: 8, value: regulationOptions[3].value },
      { weight: 7, value: regulationOptions[4].value },
    ])
    const dueAt = suggestedDueDate(regulation, receivedAt)
    const status = pickStatus(receivedAt, dueAt, now)
    const closed = status === 'completed' || status === 'rejected'
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    const base = {
      id: `DSR-${20418 + count - index}`,
      type: faker.helpers.weightedArrayElement<RequestType>([
        { weight: 40, value: 'access' },
        { weight: 30, value: 'deletion' },
        { weight: 10, value: 'correction' },
        { weight: 8, value: 'portability' },
        { weight: 12, value: 'opt_out' },
      ]),
      status,
      regulation,
      subjectName: `${firstName} ${lastName}`,
      subjectEmail: faker.internet.email({ firstName, lastName }).toLowerCase(),
      assigneeId:
        status === 'new' ? null : faker.helpers.arrayElement(assignees).id,
      receivedAt,
      dueAt,
      completedAt: closed
        ? faker.date.between({
            from: addDays(receivedAt, 1),
            to: min([addDays(dueAt, 2), now]),
          })
        : null,
      systems:
        status === 'new' || status === 'verifying'
          ? []
          : faker.helpers.arrayElements(systems, { min: 2, max: 5 }),
      notes: faker.datatype.boolean(0.3)
        ? faker.helpers.arrayElement(noteSamples)
        : '',
    }

    return { ...base, activity: buildActivity(base, now) }
  })
}
