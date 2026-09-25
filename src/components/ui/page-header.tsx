import * as React from 'react'
import { cn } from '@/lib/utils'

type PageHeaderProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  title: React.ReactNode
  description?: React.ReactNode
  /** Primary actions, aligned to the end. */
  actions?: React.ReactNode
}

/** Top of every screen: one title, optional description, actions on the end. */
function PageHeader({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div
      data-slot='page-header'
      className={cn(
        'flex flex-wrap items-end justify-between gap-x-4 gap-y-2',
        className
      )}
      {...props}
    >
      <div className='grid min-w-0 gap-1'>
        <h1 className='text-title'>{title}</h1>
        {description && (
          <p className='text-body text-muted-foreground'>{description}</p>
        )}
        {children}
      </div>
      {actions && (
        <div data-slot='page-header-actions' className='flex gap-2'>
          {actions}
        </div>
      )}
    </div>
  )
}

export { PageHeader }
