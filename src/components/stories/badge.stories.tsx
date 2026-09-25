import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@/components/ui/badge'

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const RequestLifecycle: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-2'>
      <Badge variant='neutral' dot>
        Received
      </Badge>
      <Badge variant='info' dot>
        Verifying identity
      </Badge>
      <Badge variant='info' dot>
        In review
      </Badge>
      <Badge variant='warning' dot>
        Due in 3 days
      </Badge>
      <Badge variant='danger' dot>
        Overdue
      </Badge>
      <Badge variant='success' dot>
        Completed
      </Badge>
    </div>
  ),
}

export const Labels: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-2'>
      <Badge variant='outline'>GDPR</Badge>
      <Badge variant='outline'>CCPA</Badge>
      <Badge variant='outline'>DPDP</Badge>
      <Badge variant='secondary'>Access</Badge>
      <Badge variant='secondary'>Erasure</Badge>
      <Badge variant='secondary'>Portability</Badge>
    </div>
  ),
}
