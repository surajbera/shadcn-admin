import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pencil, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { DataTableView } from '@/components/data-table'

const meta = {
  title: 'Patterns/Form sheet',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const legalBases = [
  { value: 'consent', label: 'Consent' },
  { value: 'legitimate_interest', label: 'Legitimate interest' },
  { value: 'contract', label: 'Contract' },
  { value: 'legal_obligation', label: 'Legal obligation' },
] as const

const retentions = [
  { value: '30d', label: '30 days' },
  { value: '6m', label: '6 months' },
  { value: '13m', label: '13 months' },
  { value: '2y', label: '2 years after last contact' },
] as const

const purposeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Give the purpose a name visitors understand.'),
  description: z
    .string()
    .trim()
    .min(20, 'Describe the purpose in at least 20 characters.'),
  legalBasis: z.enum([
    'consent',
    'legitimate_interest',
    'contract',
    'legal_obligation',
  ]),
  retention: z.enum(['30d', '6m', '13m', '2y']),
  required: z.boolean(),
})

type PurposeInput = z.infer<typeof purposeSchema>
type Purpose = PurposeInput & { id: string; vendors: number }

const initialPurposes: Purpose[] = [
  {
    id: 'necessary',
    name: 'Strictly necessary',
    description:
      'Sign-in, security and load balancing. The site does not work without them.',
    legalBasis: 'legitimate_interest',
    retention: '30d',
    required: true,
    vendors: 3,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description:
      'Counts visits and clicks so we can see which pages help people.',
    legalBasis: 'consent',
    retention: '13m',
    required: false,
    vendors: 14,
  },
  {
    id: 'marketing',
    name: 'Marketing email',
    description: 'Newsletters and product announcements sent to your inbox.',
    legalBasis: 'consent',
    retention: '2y',
    required: false,
    vendors: 2,
  },
  {
    id: 'ads',
    name: 'Personalised advertising',
    description:
      'Shares what you browse with ad partners to show relevant ads.',
    legalBasis: 'consent',
    retention: '13m',
    required: false,
    vendors: 31,
  },
]

const labelOf = (
  list: readonly { value: string; label: string }[],
  value: string
) => list.find((item) => item.value === value)?.label ?? value

const emptyPurpose: PurposeInput = {
  name: '',
  description: '',
  legalBasis: 'consent',
  retention: '13m',
  required: false,
}

type PurposeSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  purpose?: Purpose
  onSave: (input: PurposeInput) => void
}

function PurposeSheet({
  open,
  onOpenChange,
  purpose,
  onSave,
}: PurposeSheetProps) {
  const form = useForm<PurposeInput>({
    resolver: zodResolver(purposeSchema),
    defaultValues: purpose ?? emptyPurpose,
  })

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) form.reset()
      }}
    >
      <SheetContent className='sm:max-w-md'>
        <SheetHeader className='text-start'>
          <SheetTitle>
            {purpose ? `Edit ${purpose.name}` : 'New purpose'}
          </SheetTitle>
          <SheetDescription>
            {purpose
              ? 'Changes go into the next draft of the consent form. Visitors see them after you publish.'
              : 'Add a reason for processing that visitors can accept or decline.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='purpose-form'
            onSubmit={form.handleSubmit((input) => {
              onSave(input)
              if (!purpose) form.reset(emptyPurpose)
            })}
            className='grid flex-1 content-start gap-4 overflow-y-auto px-5'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Product research' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description for visitors</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormDescription>
                    Shown in the banner under the name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='legalBasis'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal basis</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {legalBases.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='retention'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keep data for</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {retentions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='required'
              render={({ field }) => (
                <FormItem className='flex items-start justify-between gap-4 rounded-xl border p-3'>
                  <div className='grid gap-1'>
                    <FormLabel>Always on</FormLabel>
                    <FormDescription>
                      Visitors cannot decline it. Only for what the site needs
                      to work.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='flex-row justify-end'>
          <SheetClose asChild>
            <Button variant='outline'>Cancel</Button>
          </SheetClose>
          <Button type='submit' form='purpose-form'>
            {purpose ? 'Save changes' : 'Add purpose'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

type SheetState = { open: boolean; purpose?: Purpose }

function ConsentPurposesDemo({ initial }: { initial: SheetState }) {
  const [purposes, setPurposes] = useState(initialPurposes)
  const [sheet, setSheet] = useState<SheetState>(initial)

  const columns = useMemo<ColumnDef<Purpose>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Purpose',
        cell: ({ row }) => (
          <div className='grid max-w-80 min-w-0'>
            <span className='truncate font-medium'>{row.original.name}</span>
            <span className='truncate text-caption text-muted-foreground'>
              {row.original.description}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'legalBasis',
        header: 'Legal basis',
        cell: ({ row }) => (
          <Badge variant='secondary'>
            {labelOf(legalBases, row.original.legalBasis)}
          </Badge>
        ),
      },
      {
        accessorKey: 'retention',
        header: 'Kept for',
        cell: ({ row }) => labelOf(retentions, row.original.retention),
      },
      {
        accessorKey: 'vendors',
        header: 'Vendors',
        cell: ({ row }) => (
          <span className='tabular-nums'>{row.original.vendors}</span>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label={`Edit ${row.original.name}`}
            onClick={() => setSheet({ open: true, purpose: row.original })}
          >
            <Pencil />
          </Button>
        ),
        meta: { className: 'w-12' },
      },
    ],
    []
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: purposes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const save = (input: PurposeInput) => {
    const editing = sheet.purpose
    setPurposes((list) =>
      editing
        ? list.map((p) => (p.id === editing.id ? { ...p, ...input } : p))
        : [...list, { ...input, id: `purpose-${list.length + 1}`, vendors: 0 }]
    )
    setSheet((s) => ({ ...s, open: false }))
  }

  return (
    <div className='grid max-w-5xl gap-4 sm:gap-6'>
      <PageHeader
        title='Consent purposes'
        description='Reasons for processing that visitors accept or decline in the banner.'
        actions={
          <Button onClick={() => setSheet({ open: true })}>
            <Plus />
            New purpose
          </Button>
        }
      />
      <DataTableView table={table} />
      <PurposeSheet
        key={sheet.purpose?.id ?? 'new'}
        open={sheet.open}
        onOpenChange={(open) => setSheet((s) => ({ ...s, open }))}
        purpose={sheet.purpose}
        onSave={save}
      />
    </div>
  )
}

/** Edit in a Sheet so the list stays in view. Saving updates the row and closes the sheet. */
export const EditPurpose: Story = {
  render: () => (
    <ConsentPurposesDemo
      initial={{ open: true, purpose: initialPurposes[1] }}
    />
  ),
}

/** The same sheet creates a record: empty fields, a create button. */
export const NewPurpose: Story = {
  render: () => <ConsentPurposesDemo initial={{ open: true }} />,
}
