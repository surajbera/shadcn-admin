import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronsUpDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

const meta = {
  title: 'Primitives/Misc',
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

const activity = [
  ['PN', 'Priya Nair', 'Verified subject identity', '09:12'],
  ['LM', 'Leo Martin', 'Pulled records from Salesforce', '09:40'],
  ['SR', 'Sofia Reyes', 'Redacted 14 documents', '10:05'],
  ['PN', 'Priya Nair', 'Added a handover note', '10:22'],
  ['LM', 'Leo Martin', 'Requested legal review', '11:03'],
  ['SR', 'Sofia Reyes', 'Packaged export for delivery', '11:48'],
]

export const ActivityLog: Story = {
  render: () => (
    <div className='grid max-w-sm rounded-2xl bg-card ring-1 ring-foreground/[0.07]'>
      <div className='flex items-center justify-between px-5 pt-4 pb-3'>
        <span className='text-sm font-semibold tracking-tight'>Activity</span>
        <span className='font-mono text-xs text-muted-foreground'>
          DSR-20418
        </span>
      </div>
      <Separator />
      <ScrollArea className='h-64'>
        <ol className='grid gap-4 p-5'>
          {activity.map(([initials, name, action, time], i) => (
            <li key={i} className='flex items-start gap-3'>
              <Avatar className='size-7'>
                <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 gap-0.5'>
                <span className='text-sm'>
                  <span className='font-medium'>{name}</span> {action}
                </span>
                <span className='text-xs text-muted-foreground tabular-nums'>
                  {time}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </ScrollArea>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className='grid max-w-sm gap-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/[0.07]'>
      <Skeleton className='h-3 w-24' />
      <Skeleton className='h-8 w-16' />
      <Skeleton className='h-3 w-32' />
    </div>
  ),
}

export const DisclosedSystems: Story = {
  render: () => (
    <Collapsible className='grid max-w-sm gap-2'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium'>5 systems searched</span>
        <CollapsibleTrigger asChild>
          <Button variant='ghost' size='icon' aria-label='Toggle systems'>
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='grid gap-1.5 text-sm text-muted-foreground'>
        <span>Salesforce</span>
        <span>Zendesk</span>
        <span>Snowflake</span>
        <span>HubSpot</span>
        <span>Google Workspace</span>
      </CollapsibleContent>
    </Collapsible>
  ),
}
