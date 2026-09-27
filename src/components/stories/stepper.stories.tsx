import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircleCheckBig } from 'lucide-react'
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
import {
  DescriptionItem,
  DescriptionList,
} from '@/components/ui/description-list'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Stepper, type StepperStep } from '@/components/ui/stepper'

const meta = {
  title: 'Patterns/Stepper',
  component: Stepper,
  args: { steps: [], current: 0 },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

const intakeSteps: StepperStep[] = [
  { title: 'Identity', description: 'Who is asking' },
  { title: 'Request type', description: 'What they want done' },
  { title: 'Review', description: 'Check and submit' },
]

const verificationMethods = [
  { value: 'email', label: 'Email one-time code' },
  { value: 'account', label: 'Signed-in account' },
  { value: 'document', label: 'ID document' },
]

const requestTypes = [
  { value: 'access', label: 'Access', hint: 'A copy of the data we hold.' },
  { value: 'erasure', label: 'Erasure', hint: 'Delete their personal data.' },
  { value: 'correction', label: 'Correction', hint: 'Fix data that is wrong.' },
  {
    value: 'portability',
    label: 'Portability',
    hint: 'Their data as a machine-readable file.',
  },
]

const regulations = [
  { value: 'gdpr', label: 'GDPR', days: 30 },
  { value: 'ccpa', label: 'CCPA', days: 45 },
  { value: 'lgpd', label: 'LGPD', days: 15 },
  { value: 'dpdp', label: 'DPDP', days: 30 },
]

const labelOf = (
  list: { value: string; label: string }[],
  value: string
): string => list.find((item) => item.value === value)?.label ?? '—'

function RequestIntakeDemo() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('Anna Berg')
  const [email, setEmail] = useState('anna.berg@northwind.eu')
  const [verifiedBy, setVerifiedBy] = useState('email')
  const [type, setType] = useState('')
  const [regulation, setRegulation] = useState('gdpr')

  const done = step === intakeSteps.length
  const canContinue =
    step === 0
      ? name.trim() !== '' && /\S+@\S+\.\S+/.test(email)
      : step === 1
        ? type !== ''
        : true

  const restart = () => {
    setName('')
    setEmail('')
    setType('')
    setStep(0)
  }

  return (
    <Card className='max-w-2xl'>
      <CardHeader>
        <CardTitle>New request</CardTitle>
        <CardDescription>
          Log a request that arrived by email or phone.
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <Stepper
          aria-label='New request'
          steps={intakeSteps}
          current={step}
          onStepClick={setStep}
        />
        <Separator />

        {step === 0 && (
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='grid gap-2'>
              <Label htmlFor='intake-name'>Subject name</Label>
              <Input
                id='intake-name'
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='intake-email'>Subject email</Label>
              <Input
                id='intake-email'
                type='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className='grid gap-2 sm:col-span-2'>
              <Label htmlFor='intake-verification'>Identity verified by</Label>
              <Select value={verifiedBy} onValueChange={setVerifiedBy}>
                <SelectTrigger id='intake-verification' className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {verificationMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className='grid gap-6'>
            <div className='grid gap-3'>
              <Label id='intake-type-label'>Request type</Label>
              <RadioGroup
                aria-labelledby='intake-type-label'
                value={type}
                onValueChange={setType}
                className='grid gap-3 sm:grid-cols-2'
              >
                {requestTypes.map((option) => (
                  <div key={option.value} className='flex items-start gap-2.5'>
                    <RadioGroupItem
                      id={`intake-type-${option.value}`}
                      value={option.value}
                      className='mt-0.5'
                    />
                    <div className='grid gap-0.5'>
                      <Label htmlFor={`intake-type-${option.value}`}>
                        {option.label}
                      </Label>
                      <p className='text-caption text-muted-foreground'>
                        {option.hint}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className='grid gap-2 sm:max-w-60'>
              <Label htmlFor='intake-regulation'>Regulation</Label>
              <Select value={regulation} onValueChange={setRegulation}>
                <SelectTrigger id='intake-regulation' className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regulations.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <DescriptionList>
            <DescriptionItem term='Subject'>{name}</DescriptionItem>
            <DescriptionItem term='Email'>{email}</DescriptionItem>
            <DescriptionItem term='Identity verified by'>
              {labelOf(verificationMethods, verifiedBy)}
            </DescriptionItem>
            <DescriptionItem term='Type'>
              <Badge variant='outline'>{labelOf(requestTypes, type)}</Badge>
            </DescriptionItem>
            <DescriptionItem term='Regulation'>
              <Badge variant='secondary'>
                {labelOf(regulations, regulation)}
              </Badge>
            </DescriptionItem>
            <DescriptionItem term='Due'>
              {regulations.find((r) => r.value === regulation)?.days} days from
              today
            </DescriptionItem>
          </DescriptionList>
        )}

        {done && (
          <EmptyState
            variant='plain'
            icon={<CircleCheckBig />}
            title='DSR-20431 created'
            description={`${name} gets a confirmation email with the due date.`}
            action={
              <Button variant='outline' onClick={restart}>
                Log another request
              </Button>
            }
          />
        )}
      </CardContent>
      {!done && (
        <CardFooter className='justify-between'>
          <Button
            variant='ghost'
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </Button>
          <Button disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
            {step === intakeSteps.length - 1 ? 'Submit request' : 'Continue'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

/**
 * Continue unlocks once the step is valid. Completed steps are buttons, so
 * people can go back to fix something; later steps cannot be skipped to.
 */
export const RequestIntake: Story = {
  render: () => <RequestIntakeDemo />,
}

const installSteps: StepperStep[] = [
  { title: 'Server', description: 'Host and port reachable' },
  { title: 'License key', description: 'Valid for 3 modules' },
  { title: 'Admin user', description: 'First owner account' },
  { title: 'Environment check', description: 'Storage, queue and mail' },
]

/** Without `onStepClick` the stepper only reports progress. */
export const Installation: Story = {
  render: () => (
    <Card className='max-w-3xl'>
      <CardHeader>
        <CardTitle>Set up the on-premise scanner</CardTitle>
        <CardDescription>Step 3 of 4 · Admin user</CardDescription>
        <CardAction>
          <Badge variant='info' dot>
            In progress
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Stepper aria-label='Scanner setup' steps={installSteps} current={2} />
      </CardContent>
    </Card>
  ),
}

const templateSteps: StepperStep[] = [
  { title: 'Overview' },
  { title: 'Sections' },
  { title: 'Preview' },
]

export const States: Story = {
  render: () => (
    <div className='grid max-w-xl gap-8'>
      {[
        { label: 'Not started', current: 0 },
        { label: 'In progress', current: 1 },
        { label: 'Done', current: templateSteps.length },
      ].map((state) => (
        <div key={state.label} className='grid gap-3'>
          <p className='text-caption text-muted-foreground'>{state.label}</p>
          <Stepper
            aria-label={`Assessment template, ${state.label.toLowerCase()}`}
            steps={templateSteps}
            current={state.current}
          />
        </div>
      ))}
    </div>
  ),
}
