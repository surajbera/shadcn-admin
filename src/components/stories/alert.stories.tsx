import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertTriangle, Clock, ShieldCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const meta = {
  title: 'Primitives/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Notices: Story = {
  render: () => (
    <div className='grid max-w-xl gap-3'>
      <Alert>
        <ShieldCheck />
        <AlertTitle>Identity verified</AlertTitle>
        <AlertDescription>
          The subject confirmed their email on 13 Sep. Data collection can
          start.
        </AlertDescription>
      </Alert>
      <Alert variant='warning'>
        <Clock />
        <AlertTitle>Response due in 3 days</AlertTitle>
        <AlertDescription>
          2 of 5 connected systems have not returned records yet.
        </AlertDescription>
      </Alert>
      <Alert variant='destructive'>
        <AlertTriangle />
        <AlertTitle>Statutory deadline missed</AlertTitle>
        <AlertDescription>
          DSR-20409 passed its 30-day window. Record a reason before closing.
        </AlertDescription>
      </Alert>
    </div>
  ),
}
