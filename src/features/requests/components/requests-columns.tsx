import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { type ColumnDef, type FilterFn } from '@tanstack/react-table'
import { Ellipsis, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table'
import { assigneeOf, regulationOf, typeLabel } from '../data/data'
import { type PrivacyRequest } from '../data/schema'
import { AssigneeName, DeadlineBadge, StatusBadge } from './request-badges'

/** Faceted filters store an array of selected values. */
const inSelection: FilterFn<PrivacyRequest> = (row, columnId, value) =>
  (value as string[]).includes(row.getValue(columnId))

type RowActions = {
  onEdit: (request: PrivacyRequest) => void
  onDelete: (request: PrivacyRequest) => void
}

export function getRequestsColumns({
  onEdit,
  onDelete,
}: RowActions): ColumnDef<PrivacyRequest>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Request' />
      ),
      cell: ({ row }) => (
        <Link
          to='/requests/$requestId'
          params={{ requestId: row.original.id }}
          className='font-mono text-caption underline-offset-4 hover:underline'
        >
          {row.original.id}
        </Link>
      ),
      enableHiding: false,
    },
    {
      id: 'subject',
      accessorFn: (r) => r.subjectName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Subject' />
      ),
      cell: ({ row }) => (
        <div className='grid max-w-56 min-w-0'>
          <span className='truncate font-medium'>
            {row.original.subjectName}
          </span>
          <span className='truncate text-caption text-muted-foreground'>
            {row.original.subjectEmail}
          </span>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Type' />
      ),
      cell: ({ row }) => (
        <Badge variant='outline'>{typeLabel(row.original.type)}</Badge>
      ),
      filterFn: inSelection,
      enableSorting: false,
    },
    {
      accessorKey: 'regulation',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Regulation' />
      ),
      cell: ({ row }) => (
        <Badge variant='secondary'>
          {regulationOf(row.original.regulation).label}
        </Badge>
      ),
      filterFn: inSelection,
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      filterFn: inSelection,
    },
    {
      id: 'assignee',
      accessorFn: (r) => assigneeOf(r.assigneeId)?.name ?? '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Assignee' />
      ),
      cell: ({ row }) => <AssigneeName id={row.original.assigneeId} />,
    },
    {
      accessorKey: 'dueAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Due' />
      ),
      sortingFn: 'datetime',
      cell: ({ row }) => (
        <div className='grid justify-items-start gap-1'>
          <span className='tabular-nums'>
            {format(row.original.dueAt, 'MMM d')}
          </span>
          <DeadlineBadge request={row.original} />
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='size-8 data-[state=open]:bg-muted'
              aria-label={`Actions for ${row.original.id}`}
            >
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-40'>
            <DropdownMenuItem asChild>
              <Link
                to='/requests/$requestId'
                params={{ requestId: row.original.id }}
              >
                <Eye />
                Open
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onEdit(row.original)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant='destructive'
              onSelect={() => onDelete(row.original)}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      meta: { className: 'w-12' },
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
