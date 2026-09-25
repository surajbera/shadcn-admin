import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { type RequestInput } from '../data/schema'
import {
  type RequestPatch,
  RequestNotFoundError,
  createRequest,
  deleteRequest,
  getRequest,
  listRequests,
  updateRequest,
} from './requests-api'

/** One place for cache keys, so invalidation cannot drift from the queries. */
const requestKeys = {
  all: ['requests'] as const,
  list: () => [...requestKeys.all, 'list'] as const,
  detail: (id: string) => [...requestKeys.all, 'detail', id] as const,
}

export const requestsQueryOptions = () =>
  queryOptions({ queryKey: requestKeys.list(), queryFn: listRequests })

export const requestQueryOptions = (id: string) =>
  queryOptions({
    queryKey: requestKeys.detail(id),
    queryFn: () => getRequest(id),
    retry: (failureCount, error) =>
      !(error instanceof RequestNotFoundError) && failureCount < 2,
  })

export function useCreateRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: RequestInput) => createRequest(input),
    onSuccess: (request) => {
      queryClient.setQueryData(requestKeys.detail(request.id), request)
      void queryClient.invalidateQueries({ queryKey: requestKeys.list() })
      toast.success(`${request.id} created`)
    },
  })
}

export function useUpdateRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: RequestPatch }) =>
      updateRequest(id, patch),
    onSuccess: (request) => {
      queryClient.setQueryData(requestKeys.detail(request.id), request)
      void queryClient.invalidateQueries({ queryKey: requestKeys.list() })
      toast.success(`${request.id} updated`)
    },
  })
}

export function useDeleteRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRequest(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: requestKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: requestKeys.list() })
      toast.success(`${id} deleted`)
    },
  })
}
