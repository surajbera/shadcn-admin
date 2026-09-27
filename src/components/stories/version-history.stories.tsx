import { useState } from 'react'
import { format } from 'date-fns'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertTriangle, History, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DescriptionItem,
  DescriptionList,
} from '@/components/ui/description-list'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Toaster } from '@/components/ui/sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  VersionHistory,
  type VersionHistoryItem,
} from '@/components/version-history'

const meta = {
  title: 'Patterns/Version history',
  component: VersionHistory,
  args: { versions: [] },
} satisfies Meta<typeof VersionHistory>

export default meta
type Story = StoryObj<typeof meta>

const consentVersions: VersionHistoryItem[] = [
  {
    id: 'v6',
    label: 'v6',
    author: 'Priya Nair',
    createdAt: new Date(2026, 8, 24, 16, 5),
    status: 'draft',
    summary: 'Adds the personalised advertising purpose for the EU store.',
  },
  {
    id: 'v5',
    label: 'v5',
    author: 'Leo Martin',
    createdAt: new Date(2026, 8, 12, 9, 30),
    status: 'active',
    summary: 'Shortens analytics retention to 13 months.',
  },
  {
    id: 'v4',
    label: 'v4',
    author: 'Priya Nair',
    createdAt: new Date(2026, 7, 28, 14, 12),
    status: 'published',
    summary: 'Adds Brazilian Portuguese for LGPD.',
  },
  {
    id: 'v3',
    label: 'v3',
    author: 'Sofia Reyes',
    createdAt: new Date(2026, 6, 3, 11, 48),
    status: 'published',
    summary: 'Rewords the marketing email purpose after legal review.',
  },
  {
    id: 'v2',
    label: 'v2',
    author: 'Leo Martin',
    createdAt: new Date(2026, 4, 19, 10, 2),
    status: 'published',
    summary: 'Splits analytics from product research.',
  },
  {
    id: 'v1',
    label: 'v1',
    author: 'Priya Nair',
    createdAt: new Date(2026, 2, 2, 8, 40),
    status: 'published',
    summary: 'First published version.',
  },
]

const statusBadge = {
  draft: (
    <Badge variant='info' dot>
      Draft
    </Badge>
  ),
  published: (
    <Badge variant='neutral' dot>
      Published
    </Badge>
  ),
  active: (
    <Badge variant='success' dot>
      Active
    </Badge>
  ),
}

function ConsentVersionsDemo({ theme }: { theme: 'light' | 'dark' }) {
  const [versions, setVersions] = useState(consentVersions)
  const [selectedId, setSelectedId] = useState('v5')
  const [restoring, setRestoring] = useState<VersionHistoryItem | null>(null)
  const selected = versions.find((v) => v.id === selectedId) ?? versions[0]

  const restore = () => {
    if (!restoring) return
    const next = `v${versions.length + 1}`
    // A restore never rewrites history: it starts a new draft from the old one.
    setVersions((list) => [
      {
        id: next,
        label: next,
        author: 'Priya Nair',
        createdAt: new Date(2026, 8, 27, 10, 15),
        status: 'draft',
        summary: `Restored from ${restoring.label}.`,
      },
      ...list,
    ])
    setSelectedId(next)
    setRestoring(null)
  }

  return (
    <>
      <div className='grid max-w-4xl items-start gap-4 lg:grid-cols-[1fr_22rem]'>
        <Card>
          <CardHeader>
            <CardTitle>Cookie consent · northwind.eu</CardTitle>
            <CardDescription>
              Viewing {selected.label}. Only the active version is shown to
              visitors.
            </CardDescription>
            <CardAction>{statusBadge[selected.status]}</CardAction>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionItem term='Version'>{selected.label}</DescriptionItem>
              <DescriptionItem term='Saved by'>
                {selected.author}
              </DescriptionItem>
              <DescriptionItem term='Saved'>
                {format(selected.createdAt, 'MMM d, yyyy, HH:mm')}
              </DescriptionItem>
              <DescriptionItem term='Purposes'>
                <span className='flex flex-wrap gap-1.5'>
                  {['Strictly necessary', 'Analytics', 'Marketing email'].map(
                    (purpose) => (
                      <Badge key={purpose} variant='outline'>
                        {purpose}
                      </Badge>
                    )
                  )}
                </span>
              </DescriptionItem>
              <DescriptionItem term='What changed' className='sm:col-span-2'>
                {selected.summary}
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Version history</CardTitle>
            <CardDescription>{versions.length} versions</CardDescription>
          </CardHeader>
          <CardContent className='px-2'>
            <VersionHistory
              versions={versions}
              selectedId={selectedId}
              onView={(v) => setSelectedId(v.id)}
              onDownload={(v) => toast.success(`${v.label} downloaded as JSON`)}
              onRestore={setRestoring}
            />
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(restoring)}
        onOpenChange={(open) => !open && setRestoring(null)}
        title={`Restore ${restoring?.label ?? 'version'}?`}
        desc={`This starts a new draft from ${restoring?.label ?? 'this version'}. The active version stays live until you publish the draft.`}
        confirmText='Restore as draft'
        handleConfirm={restore}
      />
      <Toaster theme={theme} />
    </>
  )
}

/**
 * Beside the record it versions. View switches the record on the left,
 * Restore goes through `ConfirmDialog` and starts a new draft.
 */
export const ConsentVersions: Story = {
  render: (_, { globals }) => <ConsentVersionsDemo theme={globals.theme} />,
}

const purposeVersions: VersionHistoryItem[] = [
  {
    id: 'mp-4',
    label: 'v4',
    author: 'Sofia Reyes',
    createdAt: new Date(2026, 8, 20, 15, 42),
    status: 'active',
    summary: 'Adds the weekly digest to the description.',
  },
  {
    id: 'mp-3',
    label: 'v3',
    author: 'Leo Martin',
    createdAt: new Date(2026, 7, 2, 9, 5),
    status: 'published',
    summary: 'Retention set to 2 years after last contact.',
  },
  {
    id: 'mp-2',
    label: 'v2',
    author: 'Priya Nair',
    createdAt: new Date(2026, 5, 14, 13, 20),
    status: 'published',
  },
  {
    id: 'mp-1',
    label: 'v1',
    author: 'Priya Nair',
    createdAt: new Date(2026, 3, 1, 10, 0),
    status: 'published',
    summary: 'First published version.',
  },
]

function InASheetDemo() {
  const [selectedId, setSelectedId] = useState('mp-4')
  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant='outline'>
          <History />
          Version history
        </Button>
      </SheetTrigger>
      <SheetContent className='sm:max-w-md'>
        <SheetHeader className='text-start'>
          <SheetTitle>Version history</SheetTitle>
          <SheetDescription>
            Marketing email purpose · {purposeVersions.length} versions
          </SheetDescription>
        </SheetHeader>
        <div className='overflow-y-auto px-2 pb-5'>
          <VersionHistory
            versions={purposeVersions}
            selectedId={selectedId}
            onView={(v) => setSelectedId(v.id)}
            onDownload={() => {}}
            onRestore={() => {}}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

/** Opened from a record's toolbar, over the record. */
export const InASheet: Story = {
  render: () => <InASheetDemo />,
}

function Panel({
  children,
  description = 'Cookie consent · northwind.eu',
}: {
  children: React.ReactNode
  description?: string
}) {
  return (
    <Card className='max-w-sm'>
      <CardHeader>
        <CardTitle>Version history</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='px-2'>{children}</CardContent>
    </Card>
  )
}

export const Loading: Story = {
  render: () => (
    <Panel>
      <VersionHistory versions={[]} loading />
    </Panel>
  ),
}

export const Empty: Story = {
  render: () => (
    <Panel description='Product research purpose · never published'>
      <VersionHistory versions={[]} />
    </Panel>
  ),
}

/** The list failed to load: say what happened and offer a retry. */
export const ErrorState: Story = {
  name: 'Error',
  render: () => (
    <Panel>
      <Alert variant='destructive'>
        <AlertTriangle />
        <AlertTitle>Versions did not load</AlertTitle>
        <AlertDescription>
          The consent service did not answer in time.
          <Button variant='outline' size='sm' className='mt-2'>
            <RefreshCw />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    </Panel>
  ),
}

/** No handlers, no row menus: for people who can see history but not change it. */
export const ReadOnly: Story = {
  render: () => (
    <Panel description='You have view access to this consent form'>
      <VersionHistory versions={consentVersions} selectedId='v5' />
    </Panel>
  ),
}
