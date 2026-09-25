import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const meta = {
  title: 'Primitives/Select',
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const RequestFilters: Story = {
  render: () => (
    <div className='flex flex-wrap items-end gap-3'>
      <div className='grid gap-1.5'>
        <Label htmlFor='regulation'>Regulation</Label>
        <Select defaultValue='gdpr'>
          <SelectTrigger id='regulation' className='w-44'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              <SelectItem value='gdpr'>GDPR</SelectItem>
              <SelectItem value='uk-gdpr'>UK GDPR</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Americas</SelectLabel>
              <SelectItem value='ccpa'>CCPA / CPRA</SelectItem>
              <SelectItem value='lgpd'>LGPD</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Asia</SelectLabel>
              <SelectItem value='dpdp'>DPDP Act</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className='grid gap-1.5'>
        <Label htmlFor='request-type'>Request type</Label>
        <Select>
          <SelectTrigger id='request-type' className='w-44'>
            <SelectValue placeholder='All types' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='access'>Access</SelectItem>
            <SelectItem value='erasure'>Erasure</SelectItem>
            <SelectItem value='rectification'>Rectification</SelectItem>
            <SelectItem value='portability'>Portability</SelectItem>
            <SelectItem value='opt-out'>Opt-out of sale</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
}
