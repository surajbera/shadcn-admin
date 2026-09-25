import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const data = [
  { name: 'Jan', total: 4120 },
  { name: 'Feb', total: 3380 },
  { name: 'Mar', total: 5210 },
  { name: 'Apr', total: 2790 },
  { name: 'May', total: 4630 },
  { name: 'Jun', total: 3950 },
  { name: 'Jul', total: 5480 },
  { name: 'Aug', total: 4310 },
  { name: 'Sep', total: 2640 },
  { name: 'Oct', total: 3870 },
  { name: 'Nov', total: 5020 },
  { name: 'Dec', total: 4490 },
]

const chartConfig = {
  total: { label: 'Revenue', color: 'chart-1' },
} satisfies ChartConfig

const currency = (value: number) => `$${value.toLocaleString()}`

export function Overview() {
  return (
    <ChartContainer config={chartConfig} className='h-88'>
      <BarChart data={data}>
        <XAxis dataKey='name' tickLine={false} axisLine={false} />
        <YAxis
          direction='ltr'
          tickLine={false}
          axisLine={false}
          tickFormatter={currency}
        />
        <ChartTooltip
          cursor
          content={<ChartTooltipContent valueFormatter={currency} />}
        />
        <Bar dataKey='total' fill='var(--color-total)' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
