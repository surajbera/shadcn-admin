import {
  ArrowDownRight,
  Clock,
  MousePointerClick,
  UserRound,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { StatCard } from '@/components/ui/stat-card'
import { AnalyticsChart } from './analytics-chart'

export function Analytics() {
  return (
    <Stack>
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Weekly clicks and unique visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsChart />
        </CardContent>
      </Card>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          label='Total Clicks'
          icon={<MousePointerClick />}
          value='1,248'
          hint='+12.4% vs last week'
        />
        <StatCard
          label='Unique Visitors'
          icon={<UserRound />}
          value='832'
          hint='+5.8% vs last week'
        />
        <StatCard
          label='Bounce Rate'
          icon={<ArrowDownRight />}
          value='42%'
          hint='-3.2% vs last week'
        />
        <StatCard
          label='Avg. Session'
          icon={<Clock />}
          value='3m 24s'
          hint='+18s vs last week'
        />
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>Referrers</CardTitle>
            <CardDescription>Top sources driving traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={[
                { name: 'Direct', value: 512 },
                { name: 'Product Hunt', value: 238 },
                { name: 'Twitter', value: 174 },
                { name: 'Blog', value: 104 },
              ]}
              barClass='bg-primary'
              valueFormatter={(n) => `${n}`}
            />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Devices</CardTitle>
            <CardDescription>How users access your app</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={[
                { name: 'Desktop', value: 74 },
                { name: 'Mobile', value: 22 },
                { name: 'Tablet', value: 4 },
              ]}
              barClass='bg-muted-foreground'
              valueFormatter={(n) => `${n}%`}
            />
          </CardContent>
        </Card>
      </div>
    </Stack>
  )
}

function SimpleBarList({
  items,
  valueFormatter,
  barClass,
}: {
  items: { name: string; value: number }[]
  valueFormatter: (n: number) => string
  barClass: string
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className='space-y-3'>
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`
        return (
          <li key={i.name} className='flex items-center justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <div className='mb-1 truncate text-xs text-muted-foreground'>
                {i.name}
              </div>
              <div className='h-2.5 w-full rounded-full bg-muted'>
                <div
                  className={`h-2.5 rounded-full ${barClass}`}
                  style={{ width }}
                />
              </div>
            </div>
            <div className='ps-2 text-xs font-medium tabular-nums'>
              {valueFormatter(i.value)}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
