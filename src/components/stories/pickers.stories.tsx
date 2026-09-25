import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'Primitives/Pickers',
  component: Combobox,
  args: { options: [], onValueChange: () => {} },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

const people: ComboboxOption[] = [
  { value: 'u-priya', label: 'Priya Nair', description: 'Privacy ops' },
  { value: 'u-leo', label: 'Leo Martin', description: 'Privacy ops' },
  { value: 'u-sofia', label: 'Sofia Reyes', description: 'Legal' },
  { value: 'u-amara', label: 'Amara Okafor', description: 'Security' },
  { value: 'u-daniel', label: 'Daniel Kim', description: 'Customer support' },
]

function ComboboxDemo({
  initial = null,
  invalid = false,
}: {
  initial?: string | null
  invalid?: boolean
}) {
  const [value, setValue] = useState<string | null>(initial)
  const id = `assignee-${initial ?? 'none'}-${invalid}`
  return (
    <div className='grid w-72 gap-2'>
      <Label htmlFor={id}>Assignee</Label>
      <Combobox
        id={id}
        aria-invalid={invalid || undefined}
        options={people}
        value={value}
        onValueChange={setValue}
        placeholder='Unassigned'
        searchPlaceholder='Search people…'
        clearable
      />
    </div>
  )
}

/** Use for long lists that need search. For a handful of fixed options, use Select. */
export const ComboboxStates: Story = {
  render: () => (
    <div className='grid gap-6'>
      <ComboboxDemo />
      <ComboboxDemo initial='u-sofia' />
      <ComboboxDemo invalid />
    </div>
  ),
}

function DatePickerDemo({
  label,
  initial,
  size,
}: {
  label: string
  initial?: Date
  size?: 'sm' | 'default' | 'lg'
}) {
  const [value, setValue] = useState<Date | undefined>(initial)
  const id = `date-${label.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <div className='grid w-60 gap-2'>
      <Label htmlFor={id}>{label}</Label>
      <DatePicker id={id} value={value} onValueChange={setValue} size={size} />
    </div>
  )
}

export const DatePickerStates: Story = {
  render: () => (
    <div className='grid gap-6'>
      <DatePickerDemo label='Due date' />
      <DatePickerDemo label='Received' initial={new Date(2026, 8, 12)} />
      <DatePickerDemo
        label='Small, in a toolbar'
        size='sm'
        initial={new Date(2026, 9, 12)}
      />
    </div>
  ),
}
