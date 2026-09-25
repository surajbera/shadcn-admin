import * as React from 'react'
import { cn } from '@/lib/utils'

type SectionProps = Omit<React.ComponentProps<'section'>, 'title'> & {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

/** A titled group of content inside a page. Spacing comes from tokens. */
function Section({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: SectionProps) {
  const hasHeader = title || description || actions
  return (
    <section
      data-slot='section'
      className={cn('grid gap-stack', className)}
      {...props}
    >
      {hasHeader && (
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div className='grid gap-0.5'>
            {title && <h2 className='text-heading'>{title}</h2>}
            {description && (
              <p className='text-caption text-muted-foreground'>
                {description}
              </p>
            )}
          </div>
          {actions && <div className='flex gap-2'>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

export { Section }
