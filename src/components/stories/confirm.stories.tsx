import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

const meta = {
  title: 'Patterns/Confirm',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Runs `work`, holding the dialog in its loading state until it settles. */
function useFakeMutation(ms = 1200) {
  const [pending, setPending] = useState(false)
  const timer = useRef<number>(undefined)
  const run = (done: () => void) => {
    setPending(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setPending(false)
      done()
    }, ms)
  }
  return { pending, run }
}

function DeleteDraftDemo() {
  const [open, setOpen] = useState(true)
  const remove = useFakeMutation()
  return (
    <>
      <Button variant='outline' onClick={() => setOpen(true)}>
        <Trash2 />
        Delete draft
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        destructive
        isLoading={remove.pending}
        title='Delete draft v6?'
        desc='The draft and its change notes are removed. Published versions of the consent form are not affected.'
        confirmText={remove.pending ? 'Deleting…' : 'Delete draft'}
        handleConfirm={() => remove.run(() => setOpen(false))}
      />
    </>
  )
}

/** `destructive` turns the confirm button red. Confirm shows `isLoading` until the delete settles. */
export const Destructive: Story = {
  render: () => <DeleteDraftDemo />,
}

/** While the action runs, both buttons are disabled so it cannot be sent twice or dismissed halfway. */
export const Loading: Story = {
  render: () => (
    <ConfirmDialog
      open
      onOpenChange={() => {}}
      destructive
      isLoading
      title='Delete draft v6?'
      desc='The draft and its change notes are removed. Published versions of the consent form are not affected.'
      confirmText='Deleting…'
      handleConfirm={() => {}}
    />
  ),
}

function PublishDemo() {
  const [open, setOpen] = useState(true)
  const publish = useFakeMutation()
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Send />
        Publish v6
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        isLoading={publish.pending}
        title='Publish consent v6?'
        desc='Visitors on 4 properties see the new banner within 5 minutes. v5 stays in the version history.'
        confirmText={publish.pending ? 'Publishing…' : 'Publish'}
        handleConfirm={() => publish.run(() => setOpen(false))}
      />
    </>
  )
}

/** Not every confirm is destructive: publishing is reversible, so the button stays primary. */
export const Publish: Story = {
  render: () => <PublishDemo />,
}

const REQUEST_ID = 'DSR-20418'

function TypedConfirmationDemo() {
  const [open, setOpen] = useState(true)
  const [typed, setTyped] = useState('')
  const erase = useFakeMutation(1500)
  const matches = typed.trim() === REQUEST_ID

  return (
    <>
      <Button variant='destructive' onClick={() => setOpen(true)}>
        Erase subject data
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setTyped('')
        }}
        destructive
        disabled={!matches}
        isLoading={erase.pending}
        title='Erase all data for Anna Berg?'
        form='erase-subject-form'
        desc={
          <form
            id='erase-subject-form'
            className='grid gap-4'
            onSubmit={(event) => {
              event.preventDefault()
              if (matches) erase.run(() => setOpen(false))
            }}
          >
            <p>
              Records in 5 systems are deleted and cannot be recovered. The
              request log keeps a note that the erasure happened.
            </p>
            <div className='grid gap-2'>
              <Label htmlFor='erase-confirm' className='text-foreground'>
                Type <span className='font-mono'>{REQUEST_ID}</span> to confirm
              </Label>
              <Input
                id='erase-confirm'
                autoComplete='off'
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
              />
            </div>
          </form>
        }
        confirmText={erase.pending ? 'Erasing…' : 'Erase data'}
      />
    </>
  )
}

/** For what cannot be undone: confirm stays disabled until the record ID is typed. */
export const TypedConfirmation: Story = {
  render: () => <TypedConfirmationDemo />,
}
