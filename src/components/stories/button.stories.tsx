import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Check,
  Download,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Hierarchy: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-2'>
      <Button>
        <Plus />
        New request
      </Button>
      <Button variant='outline'>
        <Download />
        Export
      </Button>
      <Button variant='secondary'>
        <Filter />
        Filters
      </Button>
      <Button variant='ghost'>Cancel</Button>
      <Button variant='link'>View audit log</Button>
    </div>
  ),
}

export const Toolbar: Story = {
  render: () => (
    <div className='flex w-full max-w-2xl items-center justify-between rounded-2xl bg-card p-3 ring-1 ring-foreground/[0.07]'>
      <span className='ps-2 text-sm text-muted-foreground'>
        3 requests selected
      </span>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='sm'>
          Clear
        </Button>
        <Button variant='outline' size='sm'>
          Assign owner
        </Button>
        <Button size='sm'>
          <Check />
          Approve
        </Button>
        <Button variant='ghost' size='icon' aria-label='More actions'>
          <MoreHorizontal />
        </Button>
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-2'>
      <Button disabled>
        <Loader2 className='animate-spin' />
        Verifying identity
      </Button>
      <Button variant='outline' disabled>
        Export
      </Button>
      <Button variant='destructive'>Delete subject data</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-2'>
      <Button size='sm'>Small</Button>
      <Button>Default</Button>
      <Button size='lg'>Large</Button>
    </div>
  ),
}
