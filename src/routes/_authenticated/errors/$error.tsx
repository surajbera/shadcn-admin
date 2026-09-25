import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedError } from '@/features/errors/authenticated-error'

export const Route = createFileRoute('/_authenticated/errors/$error')({
  component: AuthenticatedError,
})
