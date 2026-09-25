import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowUpRight, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const meta = {
  title: 'Primitives/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const metrics = [
  { label: 'Open requests', value: '42', meta: '6 due this week' },
  { label: 'Median time to close', value: '9.4d', meta: 'Target 30 days' },
  { label: 'Overdue', value: '3', meta: 'Oldest 4 days late', alert: true },
]

export const Metrics: Story = {
  render: () => (
    <div className='grid max-w-3xl grid-cols-3 gap-4'>
      {metrics.map((m) => (
        <Card key={m.label}>
          <CardHeader>
            <CardDescription>{m.label}</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-1'>
            <span className='text-3xl font-semibold tracking-tight tabular-nums'>
              {m.value}
            </span>
            <span
              className={
                m.alert
                  ? 'text-xs text-destructive-strong'
                  : 'text-xs text-muted-foreground'
              }
            >
              {m.meta}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}

const facts = [
  ['Subject', 'anna.berg@northwind.eu'],
  ['Type', 'Access'],
  ['Regulation', 'GDPR Art. 15'],
  ['Received', '12 Sep 2026'],
  ['Owner', 'Priya Nair'],
]

export const RequestDetail: Story = {
  render: () => (
    <Card className='max-w-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <span className='font-mono text-xs font-normal text-muted-foreground'>
            DSR-20418
          </span>
          Access request
        </CardTitle>
        <CardDescription>
          Submitted through the web privacy form
        </CardDescription>
        <CardAction>
          <Badge variant='info' dot>
            In review
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className='grid gap-2.5'>
          {facts.map(([k, v]) => (
            <div key={k} className='grid grid-cols-[7rem_1fr] text-sm'>
              <dt className='text-muted-foreground'>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
      <Separator />
      <CardFooter className='justify-between'>
        <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <Clock className='size-3.5' />
          Due 12 Oct · 17 days left
        </span>
        <Button size='sm' variant='outline'>
          Open
          <ArrowUpRight />
        </Button>
      </CardFooter>
    </Card>
  ),
}
