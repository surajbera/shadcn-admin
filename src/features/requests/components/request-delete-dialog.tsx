import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteRequest } from '../api/queries'
import { type PrivacyRequest } from '../data/schema'

type RequestDeleteDialogProps = {
  /** The request to delete. `null` closes the dialog. */
  request: PrivacyRequest | null
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function RequestDeleteDialog({
  request,
  onOpenChange,
  onDeleted,
}: RequestDeleteDialogProps) {
  const remove = useDeleteRequest()

  return (
    <ConfirmDialog
      open={Boolean(request)}
      onOpenChange={onOpenChange}
      destructive
      isLoading={remove.isPending}
      title={`Delete ${request?.id ?? 'request'}?`}
      desc={
        <p>
          This removes the request for{' '}
          <span className='font-medium text-foreground'>
            {request?.subjectName}
          </span>{' '}
          and its activity log. It cannot be undone. If the request was a
          duplicate or sent in error, reject it instead so the record stays.
        </p>
      }
      confirmText={remove.isPending ? 'Deleting…' : 'Delete request'}
      handleConfirm={() => {
        if (!request) return
        remove.mutate(request.id, {
          onSuccess: () => {
            onOpenChange(false)
            onDeleted?.()
          },
        })
      }}
    />
  )
}
