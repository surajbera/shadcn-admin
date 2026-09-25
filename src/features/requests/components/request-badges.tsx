import { getDisplayNameInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { assigneeOf, statusOf } from '../data/data'
import { type PrivacyRequest, type RequestStatus } from '../data/schema'
import { formatDaysLeft, getDeadline } from '../lib/deadline'

export function StatusBadge({ status }: { status: RequestStatus }) {
  const { tone, label } = statusOf(status)
  return (
    <Badge variant={tone} dot>
      {label}
    </Badge>
  )
}

/** Only late or nearly-late requests get a colored badge. */
export function DeadlineBadge({
  request,
}: {
  request: Pick<
    PrivacyRequest,
    'status' | 'receivedAt' | 'dueAt' | 'completedAt'
  >
}) {
  const deadline = getDeadline(request)
  const text = formatDaysLeft(deadline)
  if (deadline.state === 'overdue')
    return <Badge variant='danger'>{text}</Badge>
  if (deadline.state === 'due_soon')
    return <Badge variant='warning'>{text}</Badge>
  return <span className='text-caption text-muted-foreground'>{text}</span>
}

export function AssigneeName({ id }: { id: string | null }) {
  const assignee = assigneeOf(id)
  if (!assignee) {
    return <span className='text-muted-foreground'>Unassigned</span>
  }
  return (
    <span className='flex min-w-0 items-center gap-2'>
      <Avatar className='size-6'>
        <AvatarFallback className='text-micro'>
          {getDisplayNameInitials(assignee.name)}
        </AvatarFallback>
      </Avatar>
      <span className='truncate'>{assignee.name}</span>
    </span>
  )
}
