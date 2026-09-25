import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableView } from '@/components/data-table'

const meta = {
  title: 'Primitives/Table',
  component: Table,
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

type Status = 'Received' | 'In review' | 'Due soon' | 'Overdue' | 'Completed'

const tone = {
  Received: 'neutral',
  'In review': 'info',
  'Due soon': 'warning',
  Overdue: 'danger',
  Completed: 'success',
} as const satisfies Record<Status, string>

const requests: {
  id: string
  subject: string
  type: string
  regulation: string
  due: string
  owner: string
  status: Status
}[] = [
  {
    id: 'DSR-20418',
    subject: 'anna.berg@northwind.eu',
    type: 'Access',
    regulation: 'GDPR',
    due: '12 Oct',
    owner: 'Priya Nair',
    status: 'In review',
  },
  {
    id: 'DSR-20417',
    subject: 'm.okafor@contoso.com',
    type: 'Erasure',
    regulation: 'CCPA',
    due: '28 Sep',
    owner: 'Leo Martin',
    status: 'Due soon',
  },
  {
    id: 'DSR-20409',
    subject: 'r.sharma@fabrikam.in',
    type: 'Rectification',
    regulation: 'DPDP',
    due: '21 Sep',
    owner: 'Priya Nair',
    status: 'Overdue',
  },
  {
    id: 'DSR-20402',
    subject: 'julia.k@tailspin.de',
    type: 'Portability',
    regulation: 'GDPR',
    due: '02 Oct',
    owner: 'Unassigned',
    status: 'Received',
  },
  {
    id: 'DSR-20388',
    subject: 'sam.lee@adatum.com',
    type: 'Opt-out',
    regulation: 'CCPA',
    due: '15 Sep',
    owner: 'Leo Martin',
    status: 'Completed',
  },
]

export const RequestQueue: Story = {
  render: () => (
    <div className='max-w-5xl overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/[0.07]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-10'>
              <Checkbox aria-label='Select all' />
            </TableHead>
            <TableHead>Request</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Regulation</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-10'>
              <span className='sr-only'>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((r) => (
            <TableRow
              key={r.id}
              data-state={r.id === 'DSR-20417' ? 'selected' : undefined}
            >
              <TableCell>
                <Checkbox
                  aria-label={`Select ${r.id}`}
                  defaultChecked={r.id === 'DSR-20417'}
                />
              </TableCell>
              <TableCell>
                <div className='grid'>
                  <span className='font-medium'>{r.type}</span>
                  <span className='font-mono text-xs text-muted-foreground'>
                    {r.id}
                  </span>
                </div>
              </TableCell>
              <TableCell>{r.subject}</TableCell>
              <TableCell className='text-muted-foreground'>
                {r.regulation}
              </TableCell>
              <TableCell
                className={
                  r.owner === 'Unassigned' ? 'text-muted-foreground' : undefined
                }
              >
                {r.owner}
              </TableCell>
              <TableCell>{r.due}</TableCell>
              <TableCell>
                <Badge variant={tone[r.status]} dot>
                  {r.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant='ghost' size='icon' aria-label='Row actions'>
                  <MoreHorizontal />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

type Row = (typeof requests)[number]

const viewColumns: ColumnDef<Row>[] = [
  { accessorKey: 'id', header: 'Request' },
  { accessorKey: 'subject', header: 'Subject' },
  { accessorKey: 'regulation', header: 'Regulation' },
  { accessorKey: 'due', header: 'Due' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={tone[row.original.status]} dot>
        {row.original.status}
      </Badge>
    ),
  },
]

function ViewDemo({ loading, rows }: { loading?: boolean; rows: Row[] }) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns: viewColumns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <DataTableView
      className='max-w-4xl'
      table={table}
      loading={loading}
      empty={
        <EmptyState
          variant='plain'
          icon={<Inbox />}
          title='No requests yet'
          description='Requests from your intake form land here.'
          action={<Button>New request</Button>}
        />
      }
    />
  )
}

/** `DataTableView` while the query is pending: skeleton rows, same frame. */
export const ViewLoading: Story = {
  render: () => <ViewDemo loading rows={requests} />,
}

/** `DataTableView` with no rows: pass an `EmptyState variant='plain'`. */
export const ViewEmpty: Story = {
  render: () => <ViewDemo rows={[]} />,
}
