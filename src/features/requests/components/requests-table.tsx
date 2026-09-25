import { useEffect, useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
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
import { Inbox, Plus, SearchX } from 'lucide-react'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import {
  DataTablePagination,
  DataTableToolbar,
  DataTableView,
} from '@/components/data-table'
import { regulationOptions, statusOptions, typeOptions } from '../data/data'
import { type PrivacyRequest } from '../data/schema'
import { getRequestsColumns } from './requests-columns'

const route = getRouteApi('/_authenticated/requests/')

type RequestsTableProps = {
  data: PrivacyRequest[] | undefined
  loading: boolean
  onCreate: () => void
  onEdit: (request: PrivacyRequest) => void
  onDelete: (request: PrivacyRequest) => void
}

const noRows: PrivacyRequest[] = []

export function RequestsTable({
  data,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: RequestsTableProps) {
  // The API returns newest first; column headers sort from there.
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const columns = useMemo(
    () => getRequestsColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  )

  // Filters, search and page live in the URL, so a filtered view can be shared.
  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: 'filter' },
    columnFilters: [
      { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'type', searchKey: 'type', type: 'array' },
      { columnId: 'regulation', searchKey: 'regulation', type: 'array' },
    ],
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data ?? noRows,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      globalFilter,
      pagination,
    },
    // The page lives in the URL. Letting the table reset it on its own would
    // call navigate() while the router is leaving this screen and bounce back.
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
    globalFilterFn: (row, _columnId, filterValue) => {
      const needle = String(filterValue).toLowerCase()
      const { id, subjectName, subjectEmail } = row.original
      return [id, subjectName, subjectEmail].some((v) =>
        v.toLowerCase().includes(needle)
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const pageCount = table.getPageCount()
  useEffect(() => {
    // While loading there are no rows yet; do not reset the page from the URL.
    if (!loading) ensurePageInRange(pageCount)
  }, [loading, pageCount, ensurePageInRange])

  const isFiltered = columnFilters.length > 0 || Boolean(globalFilter?.trim())

  const empty = isFiltered ? (
    <EmptyState
      variant='plain'
      icon={<SearchX />}
      title='No requests match these filters'
      description='Try another search, or clear the filters to see every request.'
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
      icon={<Inbox />}
      title='No requests yet'
      description='Requests from your intake form land here. You can also log one by hand.'
      action={
        <Button onClick={onCreate}>
          <Plus />
          New request
        </Button>
      }
    />
  )

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Search ID, name or email…'
        filters={[
          { columnId: 'status', title: 'Status', options: statusOptions },
          { columnId: 'type', title: 'Type', options: typeOptions },
          {
            columnId: 'regulation',
            title: 'Regulation',
            options: regulationOptions,
          },
        ]}
      />
      <DataTableView table={table} loading={loading} empty={empty} />
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
