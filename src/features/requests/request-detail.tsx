import { useState } from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { Link, getRouteApi } from '@tanstack/react-router'
import { ChevronDown, FileSearch, Pencil, Trash2 } from 'lucide-react'
import { getDisplayNameInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DescriptionItem,
  DescriptionList,
} from '@/components/ui/description-list'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { requestQueryOptions, useUpdateRequest } from './api/queries'
import {
  AssigneeName,
  DeadlineBadge,
  StatusBadge,
} from './components/request-badges'
import { RequestDeleteDialog } from './components/request-delete-dialog'
import { RequestFormSheet } from './components/request-form-sheet'
import { regulationOf, statusOptions, typeLabel } from './data/data'
import { type PrivacyRequest, requestStatusSchema } from './data/schema'
import { formatDaysLeft, getDeadline } from './lib/deadline'

const route = getRouteApi('/_authenticated/requests/$requestId')

export function RequestDetail() {
  const { requestId } = route.useParams()
  const navigate = route.useNavigate()
  const {
    data: request,
    isPending,
    isError,
  } = useQuery(requestQueryOptions(requestId))
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to='/requests'>Requests</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='font-mono'>{requestId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {isPending ? (
          <DetailSkeleton />
        ) : isError ? (
          <EmptyState
            icon={<FileSearch />}
            title={`We could not find ${requestId}`}
            description='It may have been deleted, or the link has a typo.'
            action={
              <Button variant='outline' asChild>
                <Link to='/requests'>Back to requests</Link>
              </Button>
            }
          />
        ) : (
          <>
            <PageHeader
              title={request.subjectName}
              description={`${typeLabel(request.type)} request under ${regulationOf(request.regulation).label}`}
              actions={
                <>
                  <StatusMenu request={request} />
                  <Button variant='outline' onClick={() => setEditing(true)}>
                    <Pencil />
                    Edit
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label={`Delete ${request.id}`}
                    onClick={() => setDeleting(true)}
                  >
                    <Trash2 />
                  </Button>
                </>
              }
            >
              <div className='flex flex-wrap items-center gap-2 pt-1'>
                <StatusBadge status={request.status} />
                <DeadlineBadge request={request} />
              </div>
            </PageHeader>

            <div className='grid items-start gap-4 lg:grid-cols-3'>
              <div className='grid gap-4 lg:col-span-2'>
                <DetailsCard request={request} />
                <ActivityCard request={request} />
              </div>
              <div className='grid gap-4'>
                <DeadlineCard request={request} />
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {request.notes ? (
                      <p className='text-body whitespace-pre-line'>
                        {request.notes}
                      </p>
                    ) : (
                      <p className='text-body text-muted-foreground'>
                        No notes yet. Add one with Edit.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <RequestFormSheet
              open={editing}
              onOpenChange={setEditing}
              request={request}
            />
            <RequestDeleteDialog
              request={deleting ? request : null}
              onOpenChange={setDeleting}
              onDeleted={() => navigate({ to: '/requests' })}
            />
          </>
        )}
      </Main>
    </>
  )
}

function StatusMenu({ request }: { request: PrivacyRequest }) {
  const update = useUpdateRequest()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' disabled={update.isPending}>
          Set status
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-52'>
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={request.status}
          onValueChange={(value) =>
            update.mutate({
              id: request.id,
              patch: { status: requestStatusSchema.parse(value) },
            })
          }
        >
          {statusOptions.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DetailsCard({ request }: { request: PrivacyRequest }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardAction>
          <span className='font-mono text-caption text-muted-foreground'>
            {request.id}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DescriptionList>
          <DescriptionItem term='Subject email'>
            {request.subjectEmail}
          </DescriptionItem>
          <DescriptionItem term='Assignee'>
            <AssigneeName id={request.assigneeId} />
          </DescriptionItem>
          <DescriptionItem term='Type'>
            <Badge variant='outline'>{typeLabel(request.type)}</Badge>
          </DescriptionItem>
          <DescriptionItem term='Regulation'>
            <Badge variant='secondary'>
              {regulationOf(request.regulation).label}
            </Badge>
          </DescriptionItem>
          <DescriptionItem term='Received'>
            <span className='tabular-nums'>
              {format(request.receivedAt, 'PP')}
            </span>
          </DescriptionItem>
          <DescriptionItem term={request.completedAt ? 'Closed' : 'Due'}>
            <span className='tabular-nums'>
              {format(request.completedAt ?? request.dueAt, 'PP')}
            </span>
          </DescriptionItem>
          <DescriptionItem term='Systems searched' className='sm:col-span-2'>
            {request.systems.length ? (
              <span className='flex flex-wrap gap-1.5'>
                {request.systems.map((system) => (
                  <Badge key={system} variant='outline'>
                    {system}
                  </Badge>
                ))}
              </span>
            ) : (
              <span className='text-muted-foreground'>
                None yet. Search starts after identity is verified.
              </span>
            )}
          </DescriptionItem>
        </DescriptionList>
      </CardContent>
    </Card>
  )
}

function DeadlineCard({ request }: { request: PrivacyRequest }) {
  const deadline = getDeadline(request)
  const { days } = regulationOf(request.regulation)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deadline</CardTitle>
        <CardDescription>
          {regulationOf(request.regulation).label} allows {days} days
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-3'>
        <div className='text-display tabular-nums'>
          {formatDaysLeft(deadline)}
        </div>
        <Progress
          value={deadline.elapsedDays}
          max={deadline.totalDays}
          aria-label='Share of the response window used'
        />
        <p className='text-caption text-muted-foreground tabular-nums'>
          Day {deadline.elapsedDays} of {deadline.totalDays} · due{' '}
          {format(request.dueAt, 'PP')}
        </p>
      </CardContent>
    </Card>
  )
}

function ActivityCard({ request }: { request: PrivacyRequest }) {
  const entries = [...request.activity].reverse()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Newest first</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className='grid gap-4'>
          {entries.map((entry) => (
            <li key={entry.id} className='flex items-start gap-3'>
              <Avatar className='size-7'>
                <AvatarFallback className='text-micro'>
                  {getDisplayNameInitials(entry.actor)}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 gap-0.5'>
                <span className='text-body'>
                  <span className='font-medium'>{entry.actor}</span>{' '}
                  {entry.action}
                </span>
                <time
                  dateTime={entry.at.toISOString()}
                  className='text-caption text-muted-foreground tabular-nums'
                >
                  {format(entry.at, 'PP, HH:mm')}
                </time>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

function DetailSkeleton() {
  return (
    <div className='grid gap-4' aria-busy='true'>
      <div className='grid gap-2'>
        <Skeleton className='h-7 w-56' />
        <Skeleton className='h-4 w-72' />
      </div>
      <div className='grid items-start gap-4 lg:grid-cols-3'>
        <Skeleton className='h-72 rounded-2xl lg:col-span-2' />
        <Skeleton className='h-44 rounded-2xl' />
      </div>
    </div>
  )
}
