import { type VariantProps } from 'class-variance-authority'
import {
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleX,
  ShieldQuestion,
} from 'lucide-react'
import { type badgeVariants } from '@/components/ui/badge'
import { type Regulation, type RequestStatus, type RequestType } from './schema'

type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>['variant']>

export const statusOptions: {
  value: RequestStatus
  label: string
  tone: BadgeTone
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { value: 'new', label: 'New', tone: 'neutral', icon: CircleDashed },
  {
    value: 'verifying',
    label: 'Verifying identity',
    tone: 'warning',
    icon: ShieldQuestion,
  },
  { value: 'in_progress', label: 'In progress', tone: 'info', icon: CircleDot },
  {
    value: 'completed',
    label: 'Completed',
    tone: 'success',
    icon: CircleCheck,
  },
  { value: 'rejected', label: 'Rejected', tone: 'danger', icon: CircleX },
]

export const typeOptions: { value: RequestType; label: string }[] = [
  { value: 'access', label: 'Access' },
  { value: 'deletion', label: 'Deletion' },
  { value: 'correction', label: 'Correction' },
  { value: 'portability', label: 'Portability' },
  { value: 'opt_out', label: 'Opt-out of sale' },
]

/** Statutory response window in days. Used to suggest a due date. */
export const regulationOptions: {
  value: Regulation
  label: string
  days: number
}[] = [
  { value: 'gdpr', label: 'GDPR', days: 30 },
  { value: 'ccpa', label: 'CCPA', days: 45 },
  { value: 'lgpd', label: 'LGPD', days: 15 },
  { value: 'pipeda', label: 'PIPEDA', days: 30 },
  { value: 'dpdp', label: 'DPDP', days: 30 },
]

export const assignees = [
  { id: 'u-priya', name: 'Priya Nair', team: 'Privacy ops' },
  { id: 'u-leo', name: 'Leo Martin', team: 'Privacy ops' },
  { id: 'u-sofia', name: 'Sofia Reyes', team: 'Legal' },
  { id: 'u-amara', name: 'Amara Okafor', team: 'Security' },
  { id: 'u-daniel', name: 'Daniel Kim', team: 'Customer support' },
]

export const systems = [
  'Salesforce',
  'Zendesk',
  'Stripe',
  'Snowflake',
  'HubSpot',
  'Postgres (prod)',
  'Google Workspace',
  'Segment',
]

export const openStatuses: RequestStatus[] = ['new', 'verifying', 'in_progress']

export const statusOf = (value: RequestStatus) =>
  statusOptions.find((o) => o.value === value)!
export const typeLabel = (value: RequestType) =>
  typeOptions.find((o) => o.value === value)!.label
export const regulationOf = (value: Regulation) =>
  regulationOptions.find((o) => o.value === value)!
export const assigneeOf = (id: string | null) =>
  assignees.find((a) => a.id === id) ?? null
