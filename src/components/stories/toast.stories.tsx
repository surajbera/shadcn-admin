import { useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ExternalToast, toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'

const meta = {
  title: 'Primitives/Toast',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type Theme = 'light' | 'dark'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const requestClosed = (options?: ExternalToast) =>
  toast.success('DSR-20418 closed', {
    description: 'Anna Berg was emailed the response package.',
    ...options,
  })

const exportFailed = (options?: ExternalToast) =>
  toast.error('Export failed', {
    description: 'Snowflake did not answer within 30 seconds. Try again soon.',
    ...options,
  })

function StatesDemo({ theme }: { theme: Theme }) {
  useEffect(() => {
    // Fixed ids update these toasts instead of stacking copies, and they stay
    // on screen for review. Real success and error toasts close on their own.
    requestClosed({ id: 'closed', duration: Infinity })
    exportFailed({ id: 'export', duration: Infinity })
    toast.loading('Publishing consent v5…', {
      id: 'publish',
      description: 'Updating the banner on 4 properties.',
    })
    return () => void toast.dismiss()
  }, [])

  return (
    <>
      <p className='max-w-sm text-body text-muted-foreground'>
        Success and error close after 5 seconds. Loading stays until the work
        finishes, then turns into success or error.
      </p>
      {/* No entrance fade here, so screenshots and axe see the settled toasts. */}
      <Toaster
        theme={theme}
        expand
        duration={5000}
        toastOptions={{ style: { transition: 'none' } }}
      />
    </>
  )
}

/** Success, error and loading. Status reads from the icon and the words, not a colored toast. */
export const States: Story = {
  render: (_, { globals }) => <StatesDemo theme={globals.theme} />,
}

function FromActionsDemo({ theme }: { theme: Theme }) {
  useEffect(() => () => void toast.dismiss(), [])

  return (
    <>
      <div className='flex flex-wrap items-center gap-2'>
        <Button variant='outline' onClick={() => requestClosed()}>
          Close request
        </Button>
        <Button variant='outline' onClick={() => exportFailed()}>
          Export to Snowflake
        </Button>
        <Button
          onClick={() =>
            toast.promise(sleep(2000), {
              loading: 'Publishing consent v5…',
              success: 'Consent v5 is live on 4 properties',
              error: 'Consent v5 was not published',
            })
          }
        >
          Publish consent v5
        </Button>
      </div>
      <Toaster theme={theme} duration={5000} />
    </>
  )
}

/** Mutations toast once they settle. Long work uses `toast.promise`, so loading turns into the result. */
export const FromActions: Story = {
  render: (_, { globals }) => <FromActionsDemo theme={globals.theme} />,
}
