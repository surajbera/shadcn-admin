import { z } from 'zod'

const requestTypes = [
  'access',
  'deletion',
  'correction',
  'portability',
  'opt_out',
] as const

const requestStatuses = [
  'new',
  'verifying',
  'in_progress',
  'completed',
  'rejected',
] as const

const regulations = ['gdpr', 'ccpa', 'lgpd', 'pipeda', 'dpdp'] as const

export const requestTypeSchema = z.enum(requestTypes)
export const requestStatusSchema = z.enum(requestStatuses)
export const regulationSchema = z.enum(regulations)

const activitySchema = z.object({
  id: z.string(),
  actor: z.string(),
  action: z.string(),
  at: z.coerce.date(),
})

export const requestSchema = z.object({
  /** Human-facing record ID, e.g. `DSR-20418`. */
  id: z.string(),
  type: requestTypeSchema,
  status: requestStatusSchema,
  regulation: regulationSchema,
  subjectName: z.string(),
  subjectEmail: z.email(),
  assigneeId: z.string().nullable(),
  receivedAt: z.coerce.date(),
  dueAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  /** Systems searched for the subject's data. */
  systems: z.array(z.string()),
  notes: z.string(),
  activity: z.array(activitySchema),
})

export type RequestType = z.infer<typeof requestTypeSchema>
export type RequestStatus = z.infer<typeof requestStatusSchema>
export type Regulation = z.infer<typeof regulationSchema>
export type RequestActivity = z.infer<typeof activitySchema>
export type PrivacyRequest = z.infer<typeof requestSchema>

/** What the create / edit form sends. The API fills in the rest. */
export const requestInputSchema = z.object({
  subjectName: z.string().trim().min(1, 'Enter the subject’s name.'),
  subjectEmail: z.email('Enter a valid email address.'),
  type: requestTypeSchema,
  regulation: regulationSchema,
  assigneeId: z.string().nullable(),
  dueAt: z.date({ error: 'Pick a due date.' }),
  notes: z.string(),
})

export type RequestInput = z.infer<typeof requestInputSchema>
