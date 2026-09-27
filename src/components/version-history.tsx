import { useState } from 'react'
import { format } from 'date-fns'
import { Download, Ellipsis, Eye, History, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'

type VersionStatus = 'draft' | 'published' | 'active'

export type VersionHistoryItem = {
  id: string
  /** Version name, e.g. `v4`. */
  label: string
  author: string
  createdAt: Date
  /** `active` is live now, `published` was live before, `draft` never went live. */
  status: VersionStatus
  /** One line on what changed. */
  summary?: string
}

const statuses = {
  draft: { label: 'Draft', tone: 'info' },
  published: { label: 'Published', tone: 'neutral' },
  active: { label: 'Active', tone: 'success' },
} as const

type VersionHistoryProps = {
  /** Newest first. */
  versions: VersionHistoryItem[]
  /** The version on screen. It is marked and offers no View action. */
  selectedId?: string | null
  onView?: (version: VersionHistoryItem) => void
  onDownload?: (version: VersionHistoryItem) => void
  /** Offered on every version except the active one. */
  onRestore?: (version: VersionHistoryItem) => void
  loading?: boolean
  /** Versions shown before "Show older". */
  initialCount?: number
  /** Replaces the default empty state. */
  empty?: React.ReactNode
  className?: string
}

/**
 * The saved versions of a record (a consent form, a banner, a template), with
 * view, download and restore on each row. Row actions only appear for the
 * handlers you pass; without any, the list is read-only.
 */
export function VersionHistory({
  versions,
  selectedId,
  onView,
  onDownload,
  onRestore,
  loading = false,
  initialCount = 4,
  empty,
  className,
}: VersionHistoryProps) {
  const [expanded, setExpanded] = useState(false)

  if (loading) {
    return (
      <div className={cn('grid', className)} aria-busy='true'>
        <span className='sr-only'>Loading versions</span>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className='flex gap-3 px-3'>
            <Rail first={i === 0} last={i === 2} />
            <div className='grid flex-1 gap-2 py-3'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-8' />
                <Skeleton className='h-5 w-16 rounded-full' />
              </div>
              <Skeleton className='h-3 w-40' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (versions.length === 0) {
    return (
      empty ?? (
        <EmptyState
          variant='plain'
          icon={<History />}
          title='No versions yet'
          description='Each publish saves a version you can view, download or restore.'
          className={className}
        />
      )
    )
  }

  const shown = expanded ? versions : versions.slice(0, initialCount)
  const older = versions.length - shown.length

  return (
    <div className={cn('grid justify-items-start gap-1', className)}>
      <ol aria-label='Versions' className='grid w-full'>
        {shown.map((version, index) => (
          <VersionRow
            key={version.id}
            version={version}
            first={index === 0}
            last={index === shown.length - 1 && older === 0}
            selected={version.id === selectedId}
            onView={onView}
            onDownload={onDownload}
            onRestore={onRestore}
          />
        ))}
      </ol>
      {older > 0 && (
        <Button
          variant='ghost'
          size='sm'
          className='ms-6'
          onClick={() => setExpanded(true)}
        >
          Show {older} older {older === 1 ? 'version' : 'versions'}
        </Button>
      )}
    </div>
  )
}

/** Neutral timeline rail: a marker level with the first line, joined to its neighbours. */
function Rail({ first, last }: { first: boolean; last: boolean }) {
  return (
    <span
      aria-hidden='true'
      className='flex w-2 shrink-0 flex-col items-center'
    >
      <span className={cn('h-4.5 w-px', !first && 'bg-border')} />
      <span className='size-2 shrink-0 rounded-full bg-border-strong' />
      <span className={cn('w-px flex-1', !last && 'bg-border')} />
    </span>
  )
}

type VersionRowProps = Pick<
  VersionHistoryProps,
  'onView' | 'onDownload' | 'onRestore'
> & {
  version: VersionHistoryItem
  first: boolean
  last: boolean
  selected: boolean
}

function VersionRow({
  version,
  first,
  last,
  selected,
  onView,
  onDownload,
  onRestore,
}: VersionRowProps) {
  const status = statuses[version.status]
  const canView = Boolean(onView) && !selected
  const canRestore = Boolean(onRestore) && version.status !== 'active'

  return (
    <li
      aria-current={selected || undefined}
      data-selected={selected || undefined}
      className='flex gap-3 rounded-xl px-3 data-selected:bg-muted'
    >
      <Rail first={first} last={last} />
      <div className='grid min-w-0 flex-1 gap-1 py-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-body font-medium'>{version.label}</span>
          <Badge variant={status.tone} dot>
            {status.label}
          </Badge>
          {selected && (
            <span className='text-caption text-muted-foreground'>Viewing</span>
          )}
        </div>
        <p className='text-caption text-muted-foreground'>
          {version.author} ·{' '}
          <time dateTime={version.createdAt.toISOString()}>
            {format(version.createdAt, 'MMM d, yyyy, HH:mm')}
          </time>
        </p>
        {version.summary && <p className='text-body'>{version.summary}</p>}
      </div>
      {(canView || onDownload || canRestore) && (
        <div className='py-2'>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon-sm'
                aria-label={`Actions for ${version.label}`}
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              {canView && (
                <DropdownMenuItem onSelect={() => onView?.(version)}>
                  <Eye />
                  View
                </DropdownMenuItem>
              )}
              {onDownload && (
                <DropdownMenuItem onSelect={() => onDownload(version)}>
                  <Download />
                  Download
                </DropdownMenuItem>
              )}
              {canRestore && (
                <>
                  {(canView || onDownload) && <DropdownMenuSeparator />}
                  <DropdownMenuItem onSelect={() => onRestore?.(version)}>
                    <RotateCcw />
                    Restore
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </li>
  )
}
