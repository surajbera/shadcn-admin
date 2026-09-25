import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { requestsQueryOptions } from './api/queries'
import { RequestDeleteDialog } from './components/request-delete-dialog'
import { RequestFormSheet } from './components/request-form-sheet'
import { RequestsOverview } from './components/requests-overview'
import { RequestsTable } from './components/requests-table'
import { type PrivacyRequest } from './data/schema'

type SheetState = { open: boolean; request?: PrivacyRequest }

export function Requests() {
  const { data, isPending } = useQuery(requestsQueryOptions())
  const [sheet, setSheet] = useState<SheetState>({ open: false })
  const [deleting, setDeleting] = useState<PrivacyRequest | null>(null)

  const openCreate = useCallback(() => setSheet({ open: true }), [])
  const openEdit = useCallback(
    (request: PrivacyRequest) => setSheet({ open: true, request }),
    []
  )

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <PageHeader
          title='Requests'
          description='Data subject requests across every regulation, with their deadlines.'
          actions={
            <Button onClick={openCreate}>
              <Plus />
              New request
            </Button>
          }
        />
        <RequestsOverview data={data} loading={isPending} />
        <RequestsTable
          data={data}
          loading={isPending}
          onCreate={openCreate}
          onEdit={openEdit}
          onDelete={setDeleting}
        />
      </Main>

      <RequestFormSheet
        key={sheet.request?.id ?? 'new'}
        open={sheet.open}
        request={sheet.request}
        onOpenChange={(open) => setSheet((s) => ({ ...s, open }))}
      />
      <RequestDeleteDialog
        request={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      />
    </>
  )
}
