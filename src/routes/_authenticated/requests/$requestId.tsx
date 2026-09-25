import { createFileRoute } from '@tanstack/react-router'
import { requestQueryOptions } from '@/features/requests/api/queries'
import { RequestDetail } from '@/features/requests/request-detail'

export const Route = createFileRoute('/_authenticated/requests/$requestId')({
  loader: ({ context, params }) => {
    void context.queryClient.prefetchQuery(
      requestQueryOptions(params.requestId)
    )
  },
  component: RequestDetail,
})
