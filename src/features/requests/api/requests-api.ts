/**
 * Fake requests API backed by an in-memory list, with network latency.
 *
 * This file is the seam to a real backend: replace each function body with
 * an axios call that returns the same shape. Hooks in `./queries` and every
 * screen keep working unchanged.
 */
import { sleep } from '@/lib/utils'
import { appConfig } from '@/config/app'
import { assigneeOf, openStatuses, statusOf } from '../data/data'
import { seedRequests } from '../data/requests'
import {
  type PrivacyRequest,
  type RequestInput,
  type RequestStatus,
  requestSchema,
} from '../data/schema'

const LATENCY_MS = 450

let db: PrivacyRequest[] = seedRequests()

export class RequestNotFoundError extends Error {
  constructor(id: string) {
    super(`Request ${id} was not found.`)
    this.name = 'RequestNotFoundError'
  }
}

function find(id: string) {
  const request = db.find((r) => r.id === id)
  if (!request) throw new RequestNotFoundError(id)
  return request
}

function logEntry(action: string) {
  return {
    id: crypto.randomUUID(),
    actor: appConfig.user.name,
    action,
    at: new Date(),
  }
}

/** Parse at the boundary: a real API's surprises fail here, not in a screen. */
const parseRequest = (data: unknown) => requestSchema.parse(data)
const parseRequests = (data: unknown) => requestSchema.array().parse(data)

function nextId() {
  const highest = Math.max(...db.map((r) => Number(r.id.slice(4))), 20418)
  return `DSR-${highest + 1}`
}

export async function listRequests(): Promise<PrivacyRequest[]> {
  await sleep(LATENCY_MS)
  return parseRequests(structuredClone(db))
}

export async function getRequest(id: string): Promise<PrivacyRequest> {
  await sleep(LATENCY_MS)
  return parseRequest(structuredClone(find(id)))
}

export async function createRequest(
  input: RequestInput
): Promise<PrivacyRequest> {
  await sleep(LATENCY_MS)
  const now = new Date()
  const request: PrivacyRequest = {
    ...input,
    id: nextId(),
    status: 'new',
    receivedAt: now,
    completedAt: null,
    systems: [],
    activity: [logEntry('Logged the request manually')],
  }
  db = [request, ...db]
  return parseRequest(structuredClone(request))
}

export type RequestPatch = Partial<RequestInput> & { status?: RequestStatus }

export async function updateRequest(
  id: string,
  patch: RequestPatch
): Promise<PrivacyRequest> {
  await sleep(LATENCY_MS)
  const current = find(id)
  const next: PrivacyRequest = { ...current, ...patch }
  const log = []

  if (patch.status && patch.status !== current.status) {
    log.push(logEntry(`Set status to ${statusOf(patch.status).label}`))
    const closing = !openStatuses.includes(patch.status)
    next.completedAt = closing ? (current.completedAt ?? new Date()) : null
  }
  if (
    patch.assigneeId !== undefined &&
    patch.assigneeId !== current.assigneeId
  ) {
    const assignee = assigneeOf(patch.assigneeId)
    log.push(logEntry(assignee ? `Assigned to ${assignee.name}` : 'Unassigned'))
  }
  const { status: _status, assigneeId: _assignee, ...details } = patch
  if (
    Object.entries(details).some(
      ([key, value]) =>
        String(value) !== String(current[key as keyof PrivacyRequest])
    )
  ) {
    log.push(logEntry('Edited the request details'))
  }

  next.activity = [...current.activity, ...log]
  db = db.map((r) => (r.id === id ? next : r))
  return parseRequest(structuredClone(next))
}

export async function deleteRequest(id: string): Promise<void> {
  await sleep(LATENCY_MS)
  find(id)
  db = db.filter((r) => r.id !== id)
}
