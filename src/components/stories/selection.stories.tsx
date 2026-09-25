import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'

const meta = {
  title: 'Primitives/Selection',
  component: Switch,
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

const purposes = [
  {
    id: 'essential',
    title: 'Strictly necessary',
    hint: 'Session, security and load balancing. Always on.',
    checked: true,
    locked: true,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    hint: 'Aggregated product usage. 14 vendors.',
    checked: true,
  },
  {
    id: 'marketing',
    title: 'Marketing email',
    hint: 'Newsletters and product announcements.',
    checked: false,
  },
  {
    id: 'ads',
    title: 'Personalised advertising',
    hint: 'Shared with ad partners. Counts as sale under CCPA.',
    checked: false,
  },
]

export const ConsentPurposes: Story = {
  render: () => (
    <div className='grid max-w-md divide-y rounded-2xl bg-card ring-1 ring-foreground/[0.07]'>
      {purposes.map((p) => (
        <div key={p.id} className='flex items-start justify-between gap-4 p-4'>
          <div className='grid gap-0.5'>
            <Label htmlFor={p.id}>{p.title}</Label>
            <p className='text-xs text-muted-foreground'>{p.hint}</p>
          </div>
          <Switch id={p.id} defaultChecked={p.checked} disabled={p.locked} />
        </div>
      ))}
    </div>
  ),
}

export const VerificationMethod: Story = {
  render: () => (
    <div className='grid max-w-md gap-6'>
      <RadioGroup defaultValue='email' className='grid gap-3'>
        <div className='flex items-start gap-2.5'>
          <RadioGroupItem value='email' id='email' className='mt-0.5' />
          <div className='grid gap-0.5'>
            <Label htmlFor='email'>Email one-time code</Label>
            <p className='text-xs text-muted-foreground'>
              Sent to the address on the request.
            </p>
          </div>
        </div>
        <div className='flex items-start gap-2.5'>
          <RadioGroupItem value='account' id='account' className='mt-0.5' />
          <div className='grid gap-0.5'>
            <Label htmlFor='account'>Signed-in account</Label>
            <p className='text-xs text-muted-foreground'>
              Subject is already authenticated.
            </p>
          </div>
        </div>
      </RadioGroup>
      <div className='flex items-center gap-2'>
        <Checkbox id='notify' defaultChecked />
        <Label htmlFor='notify'>
          Notify the subject when the request closes
        </Label>
      </div>
    </div>
  ),
}
