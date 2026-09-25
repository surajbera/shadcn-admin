import type { Meta, StoryObj } from '@storybook/react-vite'
import { Download, Inbox, Plus, SearchX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { Section } from '@/components/ui/section'
import { Inline, Stack } from '@/components/ui/stack'

const meta = {
  title: 'Layout/Primitives',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Page: Story = {
  render: () => (
    <Stack gap='xl' className='max-w-4xl'>
      <PageHeader
        title='Data subject requests'
        description='Every request received in the last 30 days.'
        actions={
          <>
            <Button variant='outline'>
              <Download />
              Export
            </Button>
            <Button>
              <Plus />
              New request
            </Button>
          </>
        }
      />
      <Section
        title='Due this week'
        description='Sorted by deadline'
        actions={
          <Button variant='ghost' size='sm'>
            View all
          </Button>
        }
      >
        <Card>
          <CardContent>
            <Inline justify='between'>
              <span className='text-body'>Access request · anna.berg</span>
              <Badge variant='warning' dot>
                Due in 2 days
              </Badge>
            </Inline>
          </CardContent>
        </Card>
      </Section>
      <Section title='Archived'>
        <EmptyState
          icon={<Inbox />}
          title='No archived requests'
          description='Closed requests move here after 30 days.'
          action={<Button variant='outline'>Open settings</Button>}
        />
      </Section>
    </Stack>
  ),
}

/** `plain` fills a panel that already has a frame (a table body, a pane). */
export const EmptyInPanel: Story = {
  render: () => (
    <Card className='max-w-xl'>
      <EmptyState
        variant='plain'
        icon={<SearchX />}
        title='No requests match these filters'
        description='Try another search, or clear the filters to see every request.'
        action={<Button variant='outline'>Clear filters</Button>}
      />
    </Card>
  ),
}

export const StackAndInline: Story = {
  render: () => (
    <Stack gap='md' className='max-w-md'>
      <Inline gap='sm'>
        <Badge variant='neutral'>Draft</Badge>
        <Badge variant='info'>In review</Badge>
        <Badge variant='success'>Done</Badge>
      </Inline>
      <Inline justify='end'>
        <Button variant='ghost'>Cancel</Button>
        <Button>Save</Button>
      </Inline>
    </Stack>
  ),
}

export const ControlSizes: Story = {
  render: () => (
    <Stack gap='md' className='max-w-md'>
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Inline key={size} wrap={false}>
          <Input size={size} placeholder={`Input ${size}`} aria-label={size} />
          <Button size={size}>Button</Button>
        </Inline>
      ))}
    </Stack>
  ),
}
