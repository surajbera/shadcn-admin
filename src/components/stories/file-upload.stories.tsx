import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react-vite'
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
import { FileUpload, type FileUploadItem } from '@/components/ui/file-upload'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const meta = {
  title: 'Patterns/File upload',
  component: FileUpload,
  args: { value: [], onValueChange: () => {} },
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

const KB = 1024
const MB = 1024 * KB

const evidenceAccept = '.pdf,.docx,.xlsx,.csv,.png,.jpg'
const sourceAccept = '.pdf,.docx,.xlsx,.pptx,.csv'

type UpdateItems = (
  update: (items: FileUploadItem[]) => FileUploadItem[]
) => void

/** Stands in for the upload request: progress climbs, then the row settles. */
function useFakeUpload(updateItems: UpdateItems) {
  const timers = useRef<number[]>([])
  useEffect(() => {
    const active = timers.current
    return () => active.forEach((timer) => window.clearInterval(timer))
  }, [])

  return (added: FileUploadItem[]) => {
    for (const { id } of added) {
      let progress = 0
      const setProgress = (value: number | undefined) =>
        updateItems((items) =>
          items.map((item) =>
            item.id === id ? { ...item, progress: value } : item
          )
        )
      setProgress(0)
      const timer = window.setInterval(() => {
        progress = Math.min(100, progress + 20)
        setProgress(progress < 100 ? progress : undefined)
        if (progress === 100) window.clearInterval(timer)
      }, 350)
      timers.current.push(timer)
    }
  }
}

function EvidenceUploadDemo() {
  const [items, setItems] = useState<FileUploadItem[]>([
    { id: 'ev-1', name: 'identity-check-anna-berg.pdf', size: 1258 * KB },
    { id: 'ev-2', name: 'salesforce-export-DSR-20418.csv', size: 846 * KB },
  ])
  const upload = useFakeUpload(setItems)

  return (
    <Card className='max-w-xl'>
      <CardHeader>
        <CardTitle>Evidence</CardTitle>
        <CardDescription>
          Attached to DSR-20418. Reviewers see every file in the audit log.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload
          multiple
          accept={evidenceAccept}
          maxSize={15 * MB}
          title='Drop evidence here'
          value={items}
          onValueChange={setItems}
          onFilesAdded={upload}
        />
      </CardContent>
    </Card>
  )
}

/** Several files per request. New files upload as soon as they are added. */
export const EvidenceUpload: Story = {
  render: () => <EvidenceUploadDemo />,
}

function RedactionSourceDemo() {
  const [items, setItems] = useState<FileUploadItem[]>([
    { id: 'src-1', name: 'customer-complaints-q3.docx', size: 3170 * KB },
  ])
  const upload = useFakeUpload(setItems)
  const ready =
    items.length === 1 && !items[0].error && items[0].progress === undefined

  return (
    <Card className='max-w-xl'>
      <CardHeader>
        <CardTitle>New redaction job</CardTitle>
        <CardDescription>
          Personal data is found and masked in a copy. The source file stays
          unchanged.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload
          accept={sourceAccept}
          maxSize={50 * MB}
          title='Drop the source file here'
          value={items}
          onValueChange={setItems}
          onFilesAdded={upload}
        />
      </CardContent>
      <CardFooter className='justify-end'>
        <Button disabled={!ready}>Start redaction</Button>
      </CardFooter>
    </Card>
  )
}

/** One file. Picking another replaces it. */
export const RedactionSource: Story = {
  render: () => <RedactionSourceDemo />,
}

function StatesDemo() {
  const [items, setItems] = useState<FileUploadItem[]>([
    {
      id: 'st-1',
      name: 'processing-agreement-signed.pdf',
      size: 2355 * KB,
    },
    {
      id: 'st-2',
      name: 'zendesk-tickets-anna-berg.xlsx',
      size: 5734 * KB,
      progress: 64,
    },
    {
      id: 'st-3',
      name: 'call-recording-transcript.pdf',
      size: 23 * MB,
      error: 'Over the 15 MB limit',
    },
    {
      id: 'st-4',
      name: 'board-minutes.key',
      size: 3 * MB,
      error: 'PDF, DOCX, XLSX, CSV, PNG or JPG only',
    },
    {
      id: 'st-5',
      name: 'snowflake-query-results.csv',
      size: 1 * MB,
      error: 'Upload failed. Check the connection and add the file again.',
    },
  ])

  return (
    <Card className='max-w-xl'>
      <CardHeader>
        <CardTitle>Evidence</CardTitle>
        <CardDescription>
          Uploaded, uploading, too large, wrong type and failed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload
          multiple
          accept={evidenceAccept}
          maxSize={15 * MB}
          title='Drop evidence here'
          value={items}
          onValueChange={setItems}
        />
      </CardContent>
    </Card>
  )
}

/** Every row state. Rejected files stay in the list so people see why. */
export const States: Story = {
  render: () => <StatesDemo />,
}

function EmptyDemo() {
  const [items, setItems] = useState<FileUploadItem[]>([])
  const upload = useFakeUpload(setItems)
  return (
    <Card className='max-w-xl'>
      <CardHeader>
        <CardTitle>Evidence</CardTitle>
        <CardDescription>No files attached to DSR-20431 yet.</CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload
          multiple
          accept={evidenceAccept}
          maxSize={15 * MB}
          title='Drop evidence here'
          value={items}
          onValueChange={setItems}
          onFilesAdded={upload}
        />
      </CardContent>
    </Card>
  )
}

export const Empty: Story = {
  render: () => <EmptyDemo />,
}

const reviewSchema = z.object({
  evidence: z
    .array(z.custom<FileUploadItem>())
    .refine(
      (items) => items.some((item) => !item.error),
      'Attach at least one file before sending the request to review.'
    ),
})

type ReviewValues = z.infer<typeof reviewSchema>

function ErrorDemo() {
  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { evidence: [] },
    mode: 'onChange',
  })
  const upload = useFakeUpload((update) =>
    form.setValue('evidence', update(form.getValues('evidence')), {
      shouldValidate: true,
    })
  )

  // Show the state after a failed submit.
  useEffect(() => {
    void form.trigger()
  }, [form])

  return (
    <Card className='max-w-xl'>
      <CardHeader>
        <CardTitle>Send DSR-20431 to review</CardTitle>
        <CardDescription>
          The reviewer checks the evidence before the response goes out.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id='review-form' onSubmit={form.handleSubmit(() => {})}>
            <FormField
              control={form.control}
              name='evidence'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evidence</FormLabel>
                  <FormControl>
                    <FileUpload
                      multiple
                      accept={evidenceAccept}
                      maxSize={15 * MB}
                      title='Drop evidence here'
                      value={field.value}
                      onValueChange={field.onChange}
                      onFilesAdded={upload}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className='justify-end'>
        <Button type='submit' form='review-form'>
          Send to review
        </Button>
      </CardFooter>
    </Card>
  )
}

/** Inside `FormControl`: the error outlines the drop zone and `FormMessage` says why. */
export const ErrorState: Story = {
  name: 'Error',
  render: () => <ErrorDemo />,
}

const lockedEvidence: FileUploadItem[] = [
  { id: 'lk-1', name: 'identity-check-m-okafor.pdf', size: 1104 * KB },
  { id: 'lk-2', name: 'erasure-confirmation-stripe.pdf', size: 212 * KB },
  { id: 'lk-3', name: 'hubspot-contact-deleted.png', size: 488 * KB },
]

/** A closed request keeps its evidence for the audit trail. */
export const Disabled: Story = {
  render: () => (
    <Card className='max-w-xl'>
      <CardHeader>
        <CardTitle>Evidence</CardTitle>
        <CardDescription>
          DSR-20377 closed on Sep 18. Evidence is locked for the audit trail.
        </CardDescription>
        <CardAction>
          <Badge variant='success' dot>
            Completed
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FileUpload
          disabled
          multiple
          accept={evidenceAccept}
          maxSize={15 * MB}
          title='Drop evidence here'
          value={lockedEvidence}
          onValueChange={() => {}}
        />
      </CardContent>
    </Card>
  ),
}
