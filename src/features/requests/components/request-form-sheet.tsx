import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useCreateRequest, useUpdateRequest } from '../api/queries'
import {
  assignees,
  regulationOf,
  regulationOptions,
  typeOptions,
} from '../data/data'
import {
  type PrivacyRequest,
  type RequestInput,
  requestInputSchema,
} from '../data/schema'
import { suggestedDueDate } from '../lib/deadline'

const assigneeOptions = assignees.map((a) => ({
  value: a.id,
  label: a.name,
  description: a.team,
}))

function defaultsFor(request?: PrivacyRequest): RequestInput {
  if (request) {
    const {
      subjectName,
      subjectEmail,
      type,
      regulation,
      assigneeId,
      dueAt,
      notes,
    } = request
    return {
      subjectName,
      subjectEmail,
      type,
      regulation,
      assigneeId,
      dueAt,
      notes,
    }
  }
  return {
    subjectName: '',
    subjectEmail: '',
    type: 'access',
    regulation: 'gdpr',
    assigneeId: null,
    dueAt: suggestedDueDate('gdpr', new Date()),
    notes: '',
  }
}

type RequestFormSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Omit to create a request. Remount with `key` when switching records. */
  request?: PrivacyRequest
  onSaved?: (request: PrivacyRequest) => void
}

export function RequestFormSheet({
  open,
  onOpenChange,
  request,
  onSaved,
}: RequestFormSheetProps) {
  const isEdit = Boolean(request)
  const create = useCreateRequest()
  const update = useUpdateRequest()
  const saving = create.isPending || update.isPending

  const form = useForm<RequestInput>({
    resolver: zodResolver(requestInputSchema),
    defaultValues: defaultsFor(request),
  })
  const regulation = regulationOf(
    useWatch({ control: form.control, name: 'regulation' })
  )

  const close = (next: boolean) => {
    onOpenChange(next)
    if (!next) form.reset(defaultsFor(request))
  }

  const onSubmit = (input: RequestInput) => {
    const done = (saved: PrivacyRequest) => {
      onSaved?.(saved)
      onOpenChange(false)
      form.reset(defaultsFor(saved))
    }
    if (request) {
      update.mutate({ id: request.id, patch: input }, { onSuccess: done })
    } else {
      create.mutate(input, { onSuccess: done })
    }
  }

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent className='flex flex-col sm:max-w-md'>
        <SheetHeader className='text-start'>
          <SheetTitle>
            {isEdit ? `Edit ${request!.id}` : 'New request'}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Change the details. Status changes are made from the request page.'
              : 'Log a request received outside the intake form, such as by email or phone.'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='request-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid flex-1 content-start gap-4 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='subjectName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject name</FormLabel>
                  <FormControl>
                    <Input placeholder='Maya Lindqvist' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='subjectEmail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='maya@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Updates and the final response go to this address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
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
                name='regulation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regulation</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value: RequestInput['regulation']) => {
                        field.onChange(value)
                        // Keep the suggested deadline until someone sets one by hand.
                        if (!isEdit && !form.getFieldState('dueAt').isDirty) {
                          form.setValue(
                            'dueAt',
                            suggestedDueDate(value, new Date())
                          )
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regulationOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
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
              name='assigneeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <FormControl>
                    <Combobox
                      options={assigneeOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder='Unassigned'
                      searchPlaceholder='Search people…'
                      emptyText='No one by that name.'
                      clearable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dueAt'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onValueChange={(date) => date && field.onChange(date)}
                    />
                  </FormControl>
                  <FormDescription>
                    {regulation.label} allows {regulation.days} days from
                    receipt.
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder='Anything the next person should know'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline' disabled={saving}>
              Cancel
            </Button>
          </SheetClose>
          <Button form='request-form' type='submit' disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create request'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
