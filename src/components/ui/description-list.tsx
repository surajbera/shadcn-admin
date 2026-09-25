import * as React from 'react'
import { cn } from '@/lib/utils'

type DescriptionListProps = React.ComponentProps<'dl'> & {
  /** Columns from `sm` up. On phones it is always one column. */
  columns?: 1 | 2 | 3
}

const columnClass = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
}

/** Label and value pairs on a detail screen: who, what, when. */
function DescriptionList({
  columns = 2,
  className,
  ...props
}: DescriptionListProps) {
  return (
    <dl
      data-slot='description-list'
      className={cn('grid gap-x-6 gap-y-4', columnClass[columns], className)}
      {...props}
    />
  )
}

type DescriptionItemProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  term: React.ReactNode
}

function DescriptionItem({
  term,
  className,
  children,
  ...props
}: DescriptionItemProps) {
  return (
    <div
      data-slot='description-item'
      className={cn('grid min-w-0 content-start gap-1', className)}
      {...props}
    >
      <dt className='text-caption text-muted-foreground'>{term}</dt>
      <dd className='min-w-0 text-body break-words'>{children}</dd>
    </div>
  )
}

export { DescriptionList, DescriptionItem }
