import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ForbiddenError } from './forbidden'
import { GeneralError } from './general-error'
import { MaintenanceError } from './maintenance-error'
import { NotFoundError } from './not-found-error'
import { UnauthorisedError } from './unauthorized-error'

const route = getRouteApi('/_authenticated/errors/$error')

const errorMap: Record<string, React.ComponentType> = {
  unauthorized: UnauthorisedError,
  forbidden: ForbiddenError,
  'not-found': NotFoundError,
  'internal-server-error': GeneralError,
  'maintenance-error': MaintenanceError,
}

export function AuthenticatedError() {
  const { error } = route.useParams()
  const ErrorComponent = errorMap[error] ?? NotFoundError

  return (
    <>
      <Header fixed className='border-b'>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main fixed className='[&>div]:h-full'>
        <ErrorComponent />
      </Main>
    </>
  )
}
