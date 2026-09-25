import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlarmClock, CalendarClock, CircleCheckBig, Inbox } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
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
import {
  DescriptionItem,
  DescriptionList,
} from '@/components/ui/description-list'
import { Progress } from '@/components/ui/progress'
import { StatCard } from '@/components/ui/stat-card'

const meta = {
  title: 'Primitives/Data display',
  component: StatCard,
  args: { label: 'Open', value: 42 },
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const StatCards: Story = {
  render: () => (
    <div className='grid max-w-5xl gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <StatCard
        label='Open'
        icon={<Inbox />}
        value={49}
        hint='New, verifying or in progress'
      />
      <StatCard
        label='Due this week'
        icon={<CalendarClock />}
        value={11}
        hint='Deadline in the next 7 days'
      />
      <StatCard
        label='Overdue'
        icon={<AlarmClock />}
        value={3}
        hint='Oldest is 4 days late'
      />
      <StatCard
        label='Closed'
        icon={<CircleCheckBig />}
        value={25}
        hint='In the last 30 days'
      />
    </div>
  ),
}

export const StatCardLoading: Story = {
  render: () => (
    <div className='grid max-w-xl gap-4 sm:grid-cols-2'>
      <StatCard label='Open' icon={<Inbox />} value={0} loading />
      <StatCard label='Overdue' icon={<AlarmClock />} value={0} loading />
    </div>
  ),
}

export const DetailFacts: Story = {
  render: () => (
    <Card className='max-w-2xl'>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardAction>
          <span className='font-mono text-caption text-muted-foreground'>
            DSR-20418
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DescriptionList>
          <DescriptionItem term='Subject email'>
            anna.berg@northwind.eu
          </DescriptionItem>
          <DescriptionItem term='Assignee'>Priya Nair</DescriptionItem>
          <DescriptionItem term='Type'>
            <Badge variant='outline'>Access</Badge>
          </DescriptionItem>
          <DescriptionItem term='Regulation'>
            <Badge variant='secondary'>GDPR</Badge>
          </DescriptionItem>
          <DescriptionItem term='Received'>Sep 12, 2026</DescriptionItem>
          <DescriptionItem term='Due'>Oct 12, 2026</DescriptionItem>
          <DescriptionItem term='Systems searched' className='sm:col-span-2'>
            <span className='flex flex-wrap gap-1.5'>
              {['Salesforce', 'Zendesk', 'Snowflake'].map((s) => (
                <Badge key={s} variant='outline'>
                  {s}
                </Badge>
              ))}
            </span>
          </DescriptionItem>
        </DescriptionList>
      </CardContent>
    </Card>
  ),
}

export const DeadlineProgress: Story = {
  render: () => (
    <div className='grid max-w-sm gap-4'>
      {[
        { label: 'DSR-20418 · GDPR', used: 12, total: 30, badge: null },
        { label: 'DSR-20431 · LGPD', used: 13, total: 15, badge: 'warning' },
        { label: 'DSR-20377 · CCPA', used: 45, total: 45, badge: 'danger' },
      ].map(({ label, used, total, badge }) => (
        <div key={label} className='grid gap-2'>
          <div className='flex items-center justify-between gap-2'>
            <span className='text-body'>{label}</span>
            {badge === 'warning' && (
              <Badge variant='warning'>2 days left</Badge>
            )}
            {badge === 'danger' && (
              <Badge variant='danger'>3 days overdue</Badge>
            )}
            {!badge && (
              <span className='text-caption text-muted-foreground'>
                18 days left
              </span>
            )}
          </div>
          <Progress
            value={used}
            max={total}
            aria-label={`${label}: day ${used} of ${total}`}
          />
        </div>
      ))}
    </div>
  ),
}

const weekly = [
  { week: 'Jul 6', received: 9, closed: 7 },
  { week: 'Jul 13', received: 12, closed: 8 },
  { week: 'Jul 20', received: 15, closed: 11 },
  { week: 'Jul 27', received: 10, closed: 13 },
  { week: 'Aug 3', received: 13, closed: 12 },
  { week: 'Aug 10', received: 8, closed: 10 },
  { week: 'Aug 17', received: 14, closed: 9 },
  { week: 'Aug 24', received: 11, closed: 14 },
]

const weeklyConfig = {
  received: { label: 'Received', color: 'chart-1' },
  closed: { label: 'Closed', color: 'chart-3' },
} satisfies ChartConfig

export const BarChartCard: Story = {
  render: () => (
    <Card className='max-w-2xl'>
      <CardHeader>
        <CardTitle>Received and closed</CardTitle>
        <CardDescription>Requests per week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={weeklyConfig}>
          <BarChart data={weekly} barGap={2}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='week' tickLine={false} axisLine={false} />
            <YAxis width={28} tickLine={false} axisLine={false} />
            <ChartTooltip cursor content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey='received'
              fill='var(--color-received)'
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey='closed'
              fill='var(--color-closed)'
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
}

const backlog = [
  { week: 'Jul 6', open: 38 },
  { week: 'Jul 13', open: 42 },
  { week: 'Jul 20', open: 46 },
  { week: 'Jul 27', open: 43 },
  { week: 'Aug 3', open: 44 },
  { week: 'Aug 10', open: 42 },
  { week: 'Aug 17', open: 47 },
  { week: 'Aug 24', open: 44 },
]

export const LineChartCard: Story = {
  render: () => (
    <Card className='max-w-2xl'>
      <CardHeader>
        <CardTitle>Open backlog</CardTitle>
        <CardDescription>Requests open at the end of each week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ open: { label: 'Open', color: 'chart-1' } }}
          className='h-48'
        >
          <LineChart data={backlog}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='week' tickLine={false} axisLine={false} />
            <YAxis
              width={28}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey='open'
              type='monotone'
              stroke='var(--color-open)'
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
}
