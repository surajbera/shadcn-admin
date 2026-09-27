import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox, Radar, ShieldCheck } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts'
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

const meta = {
  title: 'Patterns/Metrics',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const weeks = [
  'Jul 6',
  'Jul 13',
  'Jul 20',
  'Jul 27',
  'Aug 3',
  'Aug 10',
  'Aug 17',
  'Aug 24',
  'Aug 31',
  'Sep 7',
  'Sep 14',
  'Sep 21',
]

const consentRate = [
  68.1, 68.8, 69.4, 69.0, 70.2, 70.9, 70.4, 71.3, 71.8, 72.0, 71.7, 72.4,
].map((rate, i) => ({ week: weeks[i], rate }))

const consentRateConfig = {
  rate: { label: 'Consent rate', color: 'chart-1' },
} satisfies ChartConfig

const openByType = [
  { type: 'Access', open: 21 },
  { type: 'Erasure', open: 14 },
  { type: 'Opt-out', open: 8 },
  { type: 'Correction', open: 4 },
  { type: 'Portability', open: 2 },
]

const openByTypeConfig = {
  open: { label: 'Open', color: 'chart-1' },
} satisfies ChartConfig

const scans = [
  [9, 3],
  [10, 4],
  [9, 5],
  [11, 3],
  [10, 4],
  [12, 2],
  [11, 3],
  [10, 5],
  [12, 4],
  [11, 4],
  [12, 3],
  [13, 2],
].map(([clean, found], i) => ({ week: weeks[i], clean, found }))

const scansConfig = {
  found: { label: 'Personal data found', color: 'chart-1' },
  clean: { label: 'Nothing found', color: 'chart-4' },
} satisfies ChartConfig

function StatRow({ loading = false }: { loading?: boolean }) {
  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      <StatCard
        loading={loading}
        label='Consent rate'
        icon={<ShieldCheck />}
        value='72.4%'
        hint='Accepted all or some purposes, last 30 days'
      />
      <StatCard
        loading={loading}
        label='Open requests'
        icon={<Inbox />}
        value={49}
        hint='New, verifying or in progress'
      />
      <StatCard
        loading={loading}
        label='Sources scanned'
        icon={<Radar />}
        value={128}
        hint='Of 140 connected, in the last 7 days'
      />
    </div>
  )
}

function ChartCard({
  title,
  description,
  loading,
  className,
  children,
}: {
  title: string
  description: string
  loading: boolean
  className?: string
  children: React.ReactElement
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className='h-60 w-full' /> : children}
      </CardContent>
    </Card>
  )
}

function MetricsDemo({ loading = false }: { loading?: boolean }) {
  return (
    <div className='grid max-w-6xl gap-4'>
      <StatRow loading={loading} />
      <div className='grid gap-4 lg:grid-cols-2'>
        <ChartCard
          title='Consent rate'
          description='Share of visitors who accepted at least one purpose, per week'
          loading={loading}
        >
          <ChartContainer config={consentRateConfig}>
            <LineChart data={consentRate}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='week'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <YAxis
                width={40}
                tickLine={false}
                axisLine={false}
                domain={[66, 74]}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Week of ${label}`}
                    valueFormatter={(value) => `${value}%`}
                  />
                }
              />
              <Line
                dataKey='rate'
                type='monotone'
                stroke='var(--color-rate)'
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ChartContainer>
        </ChartCard>
        <ChartCard
          title='Open requests by type'
          description='Requests not yet closed, all regulations'
          loading={loading}
        >
          <ChartContainer config={openByTypeConfig}>
            <BarChart data={openByType} layout='vertical'>
              <CartesianGrid horizontal={false} />
              <XAxis
                type='number'
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type='category'
                dataKey='type'
                width={80}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip cursor content={<ChartTooltipContent />} />
              <Bar
                dataKey='open'
                fill='var(--color-open)'
                radius={[0, 4, 4, 0]}
                barSize={18}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
      <ChartCard
        title='Sources scanned'
        description='Discovery scans per week, by what they found'
        loading={loading}
      >
        <ChartContainer config={scansConfig} className='h-56'>
          <BarChart data={scans}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='week'
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
              dataKey='found'
              stackId='scans'
              fill='var(--color-found)'
              isAnimationActive={false}
            />
            <Bar
              dataKey='clean'
              stackId='scans'
              fill='var(--color-clean)'
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </ChartCard>
    </div>
  )
}

/**
 * Three figures, then the trends behind them. Each series takes a `chart-*`
 * color from its `ChartConfig`: primary for the figure that matters, a neutral
 * for the rest.
 */
export const PrivacyOverview: Story = {
  render: () => <MetricsDemo />,
}

/** `loading` on each StatCard and a Skeleton the size of each chart. */
export const Loading: Story = {
  render: () => <MetricsDemo loading />,
}
