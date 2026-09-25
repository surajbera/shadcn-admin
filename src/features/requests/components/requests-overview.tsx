import { useMemo } from 'react'
import {
  differenceInCalendarWeeks,
  format,
  isAfter,
  isWithinInterval,
  startOfWeek,
  subDays,
  subWeeks,
} from 'date-fns'
import { AlarmClock, CalendarClock, CircleCheckBig, Inbox } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/ui/stat-card'
import { openStatuses } from '../data/data'
import { type PrivacyRequest } from '../data/schema'
import { getDeadline } from '../lib/deadline'

const WEEKS = 12

const chartConfig = {
  received: { label: 'Received', color: 'chart-1' },
  closed: { label: 'Closed', color: 'chart-3' },
} satisfies ChartConfig

function summarize(requests: PrivacyRequest[], now = new Date()) {
  const open = requests.filter((r) => openStatuses.includes(r.status))
  const deadlines = open.map((r) => getDeadline(r, now))
  const monthAgo = subDays(now, 30)

  const firstWeek = startOfWeek(subWeeks(now, WEEKS - 1), { weekStartsOn: 1 })
  const weeks = Array.from({ length: WEEKS }, (_, i) => {
    const start = startOfWeek(subWeeks(now, WEEKS - 1 - i), { weekStartsOn: 1 })
    return { start, label: format(start, 'MMM d'), received: 0, closed: 0 }
  })
  const weekOf = (date: Date) =>
    isAfter(firstWeek, date)
      ? undefined
      : weeks[differenceInCalendarWeeks(date, firstWeek, { weekStartsOn: 1 })]
  for (const r of requests) {
    const received = weekOf(r.receivedAt)
    if (received) received.received++
    const closed = r.completedAt && weekOf(r.completedAt)
    if (closed) closed.closed++
  }

  return {
    open: open.length,
    dueSoon: deadlines.filter((d) => d.state === 'due_soon').length,
    overdue: deadlines.filter((d) => d.state === 'overdue').length,
    closed30: requests.filter(
      (r) =>
        r.completedAt &&
        isWithinInterval(r.completedAt, { start: monthAgo, end: now })
    ).length,
    weeks,
  }
}

type RequestsOverviewProps = {
  data: PrivacyRequest[] | undefined
  loading: boolean
}

export function RequestsOverview({ data, loading }: RequestsOverviewProps) {
  const summary = useMemo(() => summarize(data ?? []), [data])

  return (
    <>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          loading={loading}
          label='Open'
          icon={<Inbox />}
          value={summary.open}
          hint='New, verifying or in progress'
        />
        <StatCard
          loading={loading}
          label='Due this week'
          icon={<CalendarClock />}
          value={summary.dueSoon}
          hint='Deadline in the next 7 days'
        />
        <StatCard
          loading={loading}
          label='Overdue'
          icon={<AlarmClock />}
          value={summary.overdue}
          hint='Past the statutory deadline'
        />
        <StatCard
          loading={loading}
          label='Closed'
          icon={<CircleCheckBig />}
          value={summary.closed30}
          hint='In the last 30 days'
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Received and closed</CardTitle>
          <CardDescription>
            Requests per week, last {WEEKS} weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className='h-60 w-full' />
          ) : (
            <ChartContainer config={chartConfig}>
              <BarChart data={summary.weeks} barGap={2}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='label'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={16}
                />
                <YAxis
                  width={28}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => `Week of ${label}`}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey='received'
                  fill='var(--color-received)'
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey='closed'
                  fill='var(--color-closed)'
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </>
  )
}
