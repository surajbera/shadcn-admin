import { type Table as TanstackTable, flexRender } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type DataTableViewProps<TData> = {
  table: TanstackTable<TData>
  /** Shown in the body when there are no rows. Pass an `EmptyState variant='plain'`. */
  empty?: React.ReactNode
  /** Renders skeleton rows instead of data, e.g. while a query is pending. */
  loading?: boolean
  loadingRows?: number
  className?: string
  tableClassName?: string
}

/** Renders any TanStack table with the design-system table chrome. */
export function DataTableView<TData>({
  table,
  empty = 'No results.',
  loading = false,
  loadingRows = 5,
  className,
  tableClassName,
}: DataTableViewProps<TData>) {
  const rows = table.getRowModel().rows
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl bg-card shadow-control ring-1 ring-foreground/[0.07] dark:ring-foreground/10',
        className
      )}
      aria-busy={loading || undefined}
    >
      <Table className={cn('min-w-xl', tableClassName)}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={cn(
                    header.column.columnDef.meta?.className,
                    header.column.columnDef.meta?.thClassName
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: loadingRows }, (_, i) => (
              <TableRow key={i} className='hover:bg-transparent'>
                {table.getVisibleLeafColumns().map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton className='h-4 w-full max-w-32' />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      cell.column.columnDef.meta?.className,
                      cell.column.columnDef.meta?.tdClassName
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className='h-24 text-center whitespace-normal'
              >
                {empty}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
