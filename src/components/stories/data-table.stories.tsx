import { useState } from 'react'
import { format } from 'date-fns'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CircleCheck,
  CircleDashed,
  CircleX,
  Clock,
  Download,
  Ellipsis,
  History,
  Mail,
  ShieldCheck,
  SearchX,
  UserX,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DataTableBulkActions,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
  DataTableView,
} from '@/components/data-table'

const meta = {
  title: 'Patterns/Data table',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type ConsentStatus = 'granted' | 'pending' | 'withdrawn' | 'expired'
type ConsentPurpose = 'analytics' | 'marketing' | 'ads' | 'research'

type ConsentRecord = {
  id: string
  subject: string
  purpose: ConsentPurpose
  property: string
  status: ConsentStatus
  version: string
  updatedAt: Date
}

const statusOptions = [
  { value: 'granted', label: 'Granted', tone: 'success', icon: CircleCheck },
  {
    value: 'pending',
    label: 'Awaiting confirmation',
    tone: 'info',
    icon: CircleDashed,
  },
  { value: 'withdrawn', label: 'Withdrawn', tone: 'neutral', icon: CircleX },
  { value: 'expired', label: 'Expired', tone: 'warning', icon: Clock },
] as const

const purposeOptions = [
  { value: 'analytics', label: 'Analytics' },
  { value: 'marketing', label: 'Marketing email' },
  { value: 'ads', label: 'Personalised ads' },
  { value: 'research', label: 'Product research' },
]

const propertyOptions = [
  'northwind.eu',
  'shop.northwind.eu',
  'Northwind iOS',
  'Northwind Android',
].map((value) => ({ value, label: value }))

const subjects = [
  'anna.berg@northwind.eu',
  'm.okafor@contoso.com',
  'r.sharma@fabrikam.in',
  'julia.k@tailspin.de',
  'sam.lee@adatum.com',
  'lena.fischer@northwind.eu',
  'tomas.silva@wingtip.com.br',
  'yuki.tanaka@litware.jp',
  'omar.haddad@proseware.ae',
  'chloe.martin@fourthcoffee.fr',
  'ben.carter@woodgrove.co.uk',
]

const statusCycle: ConsentStatus[] = [
  'granted',
  'granted',
  'withdrawn',
  'granted',
  'expired',
  'pending',
  'granted',
  'withdrawn',
]

// Fixed, so screenshots stay stable.
const records: ConsentRecord[] = Array.from({ length: 23 }, (_, i) => ({
  id: `CNS-${88412 - i * 7}`,
  subject: subjects[i % subjects.length],
  purpose: purposeOptions[(i * 3) % purposeOptions.length]
    .value as ConsentPurpose,
  property: propertyOptions[(i * 5 + 1) % propertyOptions.length].value,
  status: statusCycle[(i * 5) % statusCycle.length],
  version: `v${5 - (i % 3)}`,
  updatedAt: new Date(2026, 8, 26 - i, 9 + (i % 8), (i * 13) % 60),
}))

/** Faceted filters store an array of selected values. */
const inSelection: FilterFn<ConsentRecord> = (row, columnId, value) =>
  (value as string[]).includes(row.getValue(columnId))

const statusOf = (value: ConsentStatus) =>
  statusOptions.find((option) => option.value === value)!
const purposeLabel = (value: ConsentPurpose) =>
  purposeOptions.find((option) => option.value === value)!.label

const columns: ColumnDef<ConsentRecord>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all on this page'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.id}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-10' },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Record' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-caption'>{row.original.id}</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Subject' />
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'purpose',
    header: 'Purpose',
    cell: ({ row }) => (
      <Badge variant='outline'>{purposeLabel(row.original.purpose)}</Badge>
    ),
    filterFn: inSelection,
  },
  {
    accessorKey: 'property',
    header: 'Property',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.original.property}</span>
    ),
    filterFn: inSelection,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statusOf(row.original.status)
      return (
        <Badge variant={status.tone} dot>
          {status.label}
        </Badge>
      )
    },
    filterFn: inSelection,
  },
  {
    accessorKey: 'version',
    header: 'Version',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.original.version}</span>
    ),
  },
  {
    id: 'updated',
    accessorFn: (row) => row.updatedAt,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated' />
    ),
    sortingFn: 'datetime',
    cell: ({ row }) => format(row.original.updatedAt, 'MMM d, HH:mm'),
  },
  {
    id: 'actions',
    header: () => <span className='sr-only'>Actions</span>,
    cell: ({ row }) => (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label={`Actions for ${row.original.id}`}
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-52'>
          <DropdownMenuItem>
            <History />
            Consent history
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download />
            Export proof of consent
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>
            <UserX />
            Record a withdrawal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-12' },
  },
]

type ConsentTableProps = {
  rows: ConsentRecord[]
  loading?: boolean
  initialSelection?: RowSelectionState
  initialSearch?: string
  pagination?: boolean
}

function ConsentTable({
  rows,
  loading = false,
  initialSelection = {},
  initialSearch = '',
  pagination: showPagination = true,
}: ConsentTableProps) {
  // Local state keeps the story self-contained. Product screens keep filters
  // and page in the URL with useTableUrlState (see requests-table.tsx).
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialSelection)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState(initialSearch)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    state: {
      rowSelection,
      sorting,
      columnVisibility,
      columnFilters,
      globalFilter,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: (row, _columnId, filterValue) => {
      const needle = String(filterValue).toLowerCase()
      return [row.original.id, row.original.subject].some((value) =>
        value.toLowerCase().includes(needle)
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const isFiltered = columnFilters.length > 0 || globalFilter.trim() !== ''
  const empty = isFiltered ? (
    <EmptyState
      variant='plain'
      icon={<SearchX />}
      title='No records match these filters'
      description='Try another search, or clear the filters to see every record.'
      action={
        <Button
          variant='outline'
          onClick={() => {
            table.resetColumnFilters()
            table.setGlobalFilter('')
          }}
        >
          Clear filters
        </Button>
      }
    />
  ) : (
    <EmptyState
      variant='plain'
      icon={<ShieldCheck />}
      title='No consent records yet'
      description='Records appear once the banner is live on a property and visitors make a choice.'
      action={<Button>Install the banner</Button>}
    />
  )

  return (
    <div className='@container/content grid max-w-6xl gap-4'>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Search record or email…'
        filters={[
          { columnId: 'status', title: 'Status', options: [...statusOptions] },
          { columnId: 'purpose', title: 'Purpose', options: purposeOptions },
          { columnId: 'property', title: 'Property', options: propertyOptions },
        ]}
      />
      <DataTableView table={table} loading={loading} empty={empty} />
      {showPagination && <DataTablePagination table={table} />}
      <DataTableBulkActions table={table} entityName='record'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              aria-label='Export proof of consent'
            >
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export proof of consent</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              aria-label='Ask to renew consent'
            >
              <Mail />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ask to renew consent</TooltipContent>
        </Tooltip>
      </DataTableBulkActions>
    </div>
  )
}

/**
 * Search, faceted filters with counts, sortable headers, column visibility
 * (View), row menu and pagination. Select rows to bring up bulk actions.
 */
export const ConsentRecords: Story = {
  render: () => <ConsentTable rows={records} />,
}

/** Selecting rows opens the bulk actions bar. Escape clears the selection. */
export const WithSelection: Story = {
  render: () => (
    <ConsentTable
      rows={records}
      initialSelection={{
        'CNS-88405': true,
        'CNS-88391': true,
        'CNS-88370': true,
      }}
    />
  ),
}

/** Skeleton rows in the same frame while the query is pending. */
export const Loading: Story = {
  render: () => <ConsentTable rows={[]} loading pagination={false} />,
}

/** Nothing recorded yet: say why, and what to do. */
export const Empty: Story = {
  render: () => <ConsentTable rows={[]} pagination={false} />,
}

/** Filters that match nothing get their own empty state with a way out. */
export const NoResults: Story = {
  render: () => (
    <ConsentTable rows={records} initialSearch='lindqvist' pagination={false} />
  ),
}
