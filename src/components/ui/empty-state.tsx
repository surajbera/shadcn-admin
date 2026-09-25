import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center gap-3 text-center',
  {
    variants: {
      variant: {
        /** Stands on its own on the page. */
        dashed: 'rounded-2xl border border-dashed p-card py-12',
        /** Fills a panel that already has its own frame. */
        plain: 'h-full p-card',
      },
    },
    defaultVariants: { variant: 'dashed' },
  }
)

type EmptyStateProps = Omit<React.ComponentProps<'div'>, 'title'> &
  VariantProps<typeof emptyStateVariants> & {
    icon?: React.ReactNode
    title: React.ReactNode
    description?: React.ReactNode
    /** Usually one primary button that gets the user out of the empty state. */
    action?: React.ReactNode
  }

/** No data, no results, or nothing yet. Always say what to do next. */
function EmptyState({
  icon,
  title,
  description,
  action,
  variant,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot='empty-state'
      className={cn(emptyStateVariants({ variant }), className)}
      {...props}
    >
      {icon && (
        <div className='flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground [&_svg]:size-5'>
          {icon}
        </div>
      )}
      <div className='grid max-w-sm gap-1'>
        <p className='text-heading'>{title}</p>
        {description && (
          <p className='text-body text-muted-foreground'>{description}</p>
        )}
      </div>
      {action && <div className='mt-1'>{action}</div>}
    </div>
  )
}

export { EmptyState }
