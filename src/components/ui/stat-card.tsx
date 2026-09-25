import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './card'
import { Skeleton } from './skeleton'

type StatCardProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  label: React.ReactNode
  value: React.ReactNode
  /** One line of context: a comparison, a period, a threshold. */
  hint?: React.ReactNode
  icon?: React.ReactNode
  loading?: boolean
}

/** One key figure. Put 2 to 4 in a `grid gap-4` row at the top of a screen. */
function StatCard({
  label,
  value,
  hint,
  icon,
  loading,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card data-slot='stat-card' className={cn('gap-2', className)} {...props}>
      <CardHeader>
        <CardTitle className='font-medium text-muted-foreground'>
          {label}
        </CardTitle>
        {icon && (
          <CardAction className='text-muted-foreground [&_svg]:size-4'>
            {icon}
          </CardAction>
        )}
      </CardHeader>
      <CardContent className='grid gap-1'>
        {loading ? (
          <>
            <Skeleton className='h-9 w-20' />
            <Skeleton className='h-4 w-32' />
          </>
        ) : (
          <>
            <div className='text-display tabular-nums'>{value}</div>
            {hint && (
              <p className='text-caption text-muted-foreground'>{hint}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export { StatCard }
