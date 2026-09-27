import type { Meta, StoryObj } from '@storybook/react-vite'
import { Clock, PackageCheck, ScanSearch } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DescriptionItem,
  DescriptionList,
} from '@/components/ui/description-list'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const meta = {
  title: 'Primitives/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A short, blocking summary with one next step. To create or edit a record,
 * use a Sheet; to confirm a destructive action, use `ConfirmDialog`.
 */
export const ScanSummary: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <ScanSearch />
          Scan summary
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='text-start'>
          <DialogTitle>Discovery scan finished</DialogTitle>
          <DialogDescription>
            Weekly scan of every connected source · Sep 27, 02:00 to 04:12
          </DialogDescription>
        </DialogHeader>
        <DescriptionList>
          <DescriptionItem term='Sources scanned'>
            <span className='tabular-nums'>14 of 14</span>
          </DescriptionItem>
          <DescriptionItem term='Records with personal data'>
            <span className='tabular-nums'>38,204</span>
          </DescriptionItem>
          <DescriptionItem term='New data categories' className='sm:col-span-2'>
            <span className='flex flex-wrap gap-1.5'>
              <Badge variant='outline'>Health</Badge>
              <Badge variant='outline'>Precise location</Badge>
            </span>
          </DescriptionItem>
          <DescriptionItem term='Needs review' className='sm:col-span-2'>
            <span className='flex flex-wrap items-center gap-2'>
              <Badge variant='warning'>3 sources</Badge>
              <span className='text-muted-foreground'>
                Zendesk, HubSpot and Postgres (prod) hold data no record of
                processing covers.
              </span>
            </span>
          </DescriptionItem>
        </DescriptionList>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <Button>Review findings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

const packageFiles = [
  ['Personal data export', 'JSON · 2.4 MB'],
  ['Processing summary', 'PDF · 184 KB'],
  ['Systems searched', 'CSV · 12 KB'],
]

export const ResponsePackage: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <PackageCheck />
          Response package
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Response package ready</DialogTitle>
          <DialogDescription>
            <span className='font-mono'>DSR-20418</span> · Access request for
            Anna Berg
          </DialogDescription>
        </DialogHeader>
        <ul className='grid divide-y rounded-xl border'>
          {packageFiles.map(([name, meta]) => (
            <li
              key={name}
              className='flex items-center justify-between gap-4 px-3 py-2.5'
            >
              <span className='text-body'>{name}</span>
              <span className='text-caption text-muted-foreground tabular-nums'>
                {meta}
              </span>
            </li>
          ))}
        </ul>
        <Alert>
          <Clock />
          <AlertDescription>
            The subject gets a download link that works for 7 days.
          </AlertDescription>
        </Alert>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Not now</Button>
          </DialogClose>
          <Button>Send to subject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
