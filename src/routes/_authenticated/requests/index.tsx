import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Requests } from '@/features/requests'
import { requestsQueryOptions } from '@/features/requests/api/queries'
import {
  regulationSchema,
  requestStatusSchema,
  requestTypeSchema,
} from '@/features/requests/data/schema'

const requestsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
  status: z.array(requestStatusSchema).optional().catch([]),
  type: z.array(requestTypeSchema).optional().catch([]),
  regulation: z.array(regulationSchema).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/requests/')({
  validateSearch: requestsSearchSchema,
  // Start fetching on hover or navigation; the screen shows its own loading state.
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(requestsQueryOptions())
  },
  component: Requests,
})
