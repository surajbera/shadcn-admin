import { Area, AreaChart, XAxis, YAxis } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const data = [
  { name: 'Mon', clicks: 612, uniques: 402 },
  { name: 'Tue', clicks: 748, uniques: 455 },
  { name: 'Wed', clicks: 531, uniques: 388 },
  { name: 'Thu', clicks: 889, uniques: 610 },
  { name: 'Fri', clicks: 802, uniques: 574 },
  { name: 'Sat', clicks: 344, uniques: 231 },
  { name: 'Sun', clicks: 297, uniques: 205 },
]

const chartConfig = {
  clicks: { label: 'Clicks', color: 'chart-1' },
  uniques: { label: 'Unique visitors', color: 'chart-4' },
} satisfies ChartConfig

export function AnalyticsChart() {
  return (
    <ChartContainer config={chartConfig} className='h-75'>
      <AreaChart data={data}>
        <XAxis dataKey='name' tickLine={false} axisLine={false} />
        <YAxis width={36} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type='monotone'
          dataKey='clicks'
          stroke='var(--color-clicks)'
          fill='var(--color-clicks)'
          fillOpacity={0.15}
        />
        <Area
          type='monotone'
          dataKey='uniques'
          stroke='var(--color-uniques)'
          fill='var(--color-uniques)'
          fillOpacity={0.1}
        />
      </AreaChart>
    </ChartContainer>
  )
}
