import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircleCheckBig } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const meta = {
  title: 'Primitives/Form',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const sources = [
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'zendesk', label: 'Zendesk' },
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'workspace', label: 'Google Workspace' },
  { value: 'postgres', label: 'Postgres (prod)' },
]

const frequencies = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const jobSchema = z.object({
  name: z.string().trim().min(1, 'Name the job so owners can find it.'),
  source: z.string().min(1, 'Pick a source to scan.'),
  frequency: z.enum(['once', 'daily', 'weekly', 'monthly']),
  startsOn: z.date({ error: 'Pick a start date.' }),
  notes: z.string().max(200, 'Keep notes under 200 characters.'),
  notifyOwners: z.boolean(),
  ownersInformed: z.boolean().refine(Boolean, {
    message: 'Confirm that the source owners were told.',
  }),
})

type JobValues = z.infer<typeof jobSchema>

const filled: JobValues = {
  name: 'Weekly CRM sweep',
  source: 'salesforce',
  frequency: 'weekly',
  startsOn: new Date(2026, 9, 5),
  notes: 'Skip the sandbox org.',
  notifyOwners: true,
  ownersInformed: true,
}

const blank: Partial<JobValues> = {
  name: '',
  source: '',
  frequency: 'once',
  startsOn: undefined,
  notes: '',
  notifyOwners: false,
  ownersInformed: false,
}

type DiscoveryJobFormProps = {
  defaults: Partial<JobValues>
  /** Validate on mount, as after a submit with missing fields. */
  showErrors?: boolean
  disabled?: boolean
  status?: React.ReactNode
}

function DiscoveryJobForm({
  defaults,
  showErrors = false,
  disabled = false,
  status,
}: DiscoveryJobFormProps) {
  const [saved, setSaved] = useState(false)
  const form = useForm<JobValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: defaults,
    disabled,
  })

  useEffect(() => {
    if (showErrors) void form.trigger()
  }, [form, showErrors])

  return (
    <Card className='max-w-xl'>
      <CardHeader>
        <CardTitle>Discovery job</CardTitle>
        <CardDescription>
          Scans a source for personal data and adds what it finds to the data
          map.
        </CardDescription>
        {status && <CardAction>{status}</CardAction>}
      </CardHeader>
      <CardContent className='grid gap-4'>
        {saved && (
          <Alert>
            <CircleCheckBig />
            <AlertTitle>Job scheduled</AlertTitle>
            <AlertDescription>
              Owners get an email before the first scan starts.
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form
            id='discovery-job-form'
            onSubmit={form.handleSubmit(() => setSaved(true))}
            className='grid gap-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job name</FormLabel>
                  <FormControl>
                    <Input placeholder='Weekly CRM sweep' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='source'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={field.disabled}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Choose a source' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sources.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='frequency'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeats</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={field.disabled}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frequencies.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='startsOn'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First scan</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={field.disabled}
                      className='sm:w-60'
                    />
                  </FormControl>
                  <FormDescription>
                    Scans start at 02:00 in the source’s region.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes for owners</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder='Anything the source owner should know'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notifyOwners'
              render={({ field }) => (
                <FormItem className='flex items-start justify-between gap-4 rounded-xl border p-3'>
                  <div className='grid gap-1'>
                    <FormLabel>Email a summary to owners</FormLabel>
                    <FormDescription>
                      Sent after each scan with new findings.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={field.disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ownersInformed'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-2'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormLabel>
                      The source owners know about this scan
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className='justify-end gap-2'>
        <Button
          variant='ghost'
          disabled={disabled}
          onClick={() => {
            form.reset()
            setSaved(false)
          }}
        >
          Reset
        </Button>
        <Button type='submit' form='discovery-job-form' disabled={disabled}>
          Schedule job
        </Button>
      </CardFooter>
    </Card>
  )
}

/** `FormLabel`, `FormDescription` and `FormMessage` come from the field, so ids and errors line up. */
export const DiscoveryJob: Story = {
  render: () => <DiscoveryJobForm defaults={filled} />,
}

/** After a submit with missing fields: each message sits under its field and the label turns red. */
export const WithErrors: Story = {
  render: () => <DiscoveryJobForm defaults={blank} showErrors />,
}

/** `useForm({ disabled: true })` locks every field, for example while a scan runs. */
export const Disabled: Story = {
  render: () => (
    <DiscoveryJobForm
      defaults={filled}
      disabled
      status={
        <Badge variant='info' dot>
          Scanning
        </Badge>
      }
    />
  ),
}
