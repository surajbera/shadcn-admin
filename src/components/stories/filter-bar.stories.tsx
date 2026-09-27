import { useState } from 'react'
import { format } from 'date-fns'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox, Radar, Search, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack } from '@/components/ui/stack'
import { StatCard } from '@/components/ui/stat-card'

const meta = {
  title: 'Patterns/Filter bar',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const regulations = [
  { value: 'all', label: 'All regulations', share: 1, rate: 72.4 },
  { value: 'gdpr', label: 'GDPR', share: 0.54, rate: 68.9 },
  { value: 'ccpa', label: 'CCPA', share: 0.28, rate: 81.2 },
  { value: 'lgpd', label: 'LGPD', share: 0.11, rate: 74.6 },
  { value: 'dpdp', label: 'DPDP', share: 0.07, rate: 77.3 },
]

const units = [
  { value: 'all', label: 'All business units', share: 1 },
  { value: 'eu-retail', label: 'EU retail', share: 0.46 },
  { value: 'us-retail', label: 'US retail', share: 0.31 },
  { value: 'payments', label: 'Payments', share: 0.15 },
  { value: 'people', label: 'People team', share: 0.08 },
]

type Filters = {
  search: string
  regulation: string
  unit: string
  from?: Date
  to?: Date
}

const noFilters: Filters = { search: '', regulation: 'all', unit: 'all' }

const activeCount = (filters: Filters) =>
  [
    filters.search.trim() !== '',
    filters.regulation !== 'all',
    filters.unit !== 'all',
    Boolean(filters.from),
    Boolean(filters.to),
  ].filter(Boolean).length

type FilterBarProps = {
  value: Filters
  onChange: (value: Filters) => void
}

/** Search, two short selects, a date range and clear, on one row of `h-8` controls. */
function FilterBar({ value, onChange }: FilterBarProps) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch })
  const active = activeCount(value)

  return (
    <div
      role='search'
      aria-label='Dashboard filters'
      className='flex flex-wrap items-center gap-2'
    >
      <div className='relative w-full sm:w-60'>
        <Search className='pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          type='search'
          aria-label='Search systems or owners'
          placeholder='Search systems or owners'
          className='ps-8'
          value={value.search}
          onChange={(event) => set({ search: event.target.value })}
        />
      </div>
      <Select
        value={value.regulation}
        onValueChange={(regulation) => set({ regulation })}
      >
        <SelectTrigger aria-label='Regulation' className='w-40'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {regulations.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={value.unit} onValueChange={(unit) => set({ unit })}>
        <SelectTrigger aria-label='Business unit' className='w-44'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {units.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        aria-label={
          value.from ? `From ${format(value.from, 'PP')}` : 'From date'
        }
        placeholder='From'
        className='w-36'
        value={value.from}
        onValueChange={(from) => set({ from })}
        disabledDays={value.to ? { after: value.to } : undefined}
      />
      <DatePicker
        aria-label={value.to ? `To ${format(value.to, 'PP')}` : 'To date'}
        placeholder='To'
        className='w-36'
        value={value.to}
        onValueChange={(to) => set({ to })}
        disabledDays={value.from ? { before: value.from } : undefined}
      />
      {active > 0 && (
        <Button variant='ghost' onClick={() => onChange(noFilters)}>
          <X />
          Clear {active > 1 ? `${active} filters` : 'filter'}
        </Button>
      )}
    </div>
  )
}

function DashboardDemo({ initial }: { initial: Filters }) {
  const [filters, setFilters] = useState(initial)
  const regulation = regulations.find((r) => r.value === filters.regulation)!
  const unit = units.find((u) => u.value === filters.unit)!
  const searchShare = filters.search.trim() ? 0.25 : 1

  const period =
    filters.from || filters.to
      ? `${filters.from ? format(filters.from, 'MMM d') : 'Start'} to ${
          filters.to ? format(filters.to, 'MMM d, yyyy') : 'today'
        }`
      : 'Last 30 days'

  return (
    <Stack gap='lg' className='max-w-5xl'>
      <PageHeader
        title='Overview'
        description='Requests, consent and discovery across Northwind.'
      />
      <FilterBar value={filters} onChange={setFilters} />
      <div className='grid gap-4 sm:grid-cols-3'>
        <StatCard
          label='Open requests'
          icon={<Inbox />}
          value={Math.round(49 * regulation.share * unit.share * searchShare)}
          hint={period}
        />
        <StatCard
          label='Consent rate'
          icon={<ShieldCheck />}
          value={`${regulation.rate}%`}
          hint='Accepted all or some purposes'
        />
        <StatCard
          label='Sources scanned'
          icon={<Radar />}
          value={Math.round(128 * unit.share * searchShare)}
          hint={`Of ${Math.round(140 * unit.share * searchShare)} connected`}
        />
      </div>
    </Stack>
  )
}

/** Dashboard filters. Clear appears once anything is set. */
export const Dashboard: Story = {
  render: () => <DashboardDemo initial={noFilters} />,
}

export const Applied: Story = {
  render: () => (
    <DashboardDemo
      initial={{
        search: '',
        regulation: 'gdpr',
        unit: 'eu-retail',
        from: new Date(2026, 8, 1),
        to: new Date(2026, 8, 27),
      }}
    />
  ),
}
