import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'

const meta = {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

/** Detail screens put the breadcrumb directly above `PageHeader`. */
export const OnADetailScreen: Story = {
  render: () => (
    <div className='grid max-w-3xl gap-4'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>Requests</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className='font-mono'>DSR-20418</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader
        title='Anna Berg'
        description='Access request under GDPR'
        actions={
          <Button variant='outline'>
            <Pencil />
            Edit
          </Button>
        }
      >
        <div className='flex gap-2 pt-1'>
          <Badge variant='info' dot>
            In progress
          </Badge>
          <Badge variant='warning'>5 days left</Badge>
        </div>
      </PageHeader>
    </div>
  ),
}

export const Collapsed: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='#'>Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href='#'>Retention</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Billing records</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}
