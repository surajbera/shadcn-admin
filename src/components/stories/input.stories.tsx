import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const meta = {
  title: 'Primitives/Input',
  component: Input,
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const RequestIntake: Story = {
  render: () => (
    <div className='grid max-w-md gap-4'>
      <div className='grid gap-1.5'>
        <Label htmlFor='subject'>Data subject email</Label>
        <Input
          id='subject'
          type='email'
          placeholder='name@company.com'
          defaultValue='anna.berg@northwind.eu'
        />
      </div>
      <div className='grid gap-1.5'>
        <Label htmlFor='reference'>External reference</Label>
        <Input id='reference' placeholder='Optional' />
        <p className='text-xs text-muted-foreground'>
          Ticket or case number from the source system.
        </p>
      </div>
      <div className='grid gap-1.5'>
        <Label htmlFor='notes'>Internal notes</Label>
        <Textarea id='notes' placeholder='Visible to the privacy team only' />
      </div>
      <div className='grid gap-1.5'>
        <Label htmlFor='invalid'>Verification code</Label>
        <Input id='invalid' defaultValue='48A1' aria-invalid />
        <p className='text-xs text-destructive'>Code must be 6 digits.</p>
      </div>
    </div>
  ),
}

export const SearchField: Story = {
  render: () => (
    <div className='relative max-w-sm'>
      <Search className='pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
      <Input className='ps-8' placeholder='Search requests, subjects, IDs' />
    </div>
  ),
}
