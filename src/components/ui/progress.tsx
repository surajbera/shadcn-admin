import * as React from 'react'
import { cn } from '@/lib/utils'

type ProgressProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  /** Current value, clamped to 0..max. */
  value: number
  max?: number
}

/**
 * A determinate bar: time used against a deadline, steps done, quota used.
 * It has one tone. Say what the number means with a Badge next to it,
 * not by recoloring the bar.
 */
function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), max)
  const percent = max > 0 ? (clamped / max) * 100 : 0

  return (
    <div
      role='progressbar'
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      data-slot='progress'
      className={cn(
        'relative h-1.5 w-full overflow-hidden rounded-full bg-muted',
        className
      )}
      {...props}
    >
      <div
        data-slot='progress-indicator'
        className='h-full rounded-full bg-primary transition-[width] duration-base ease-standard'
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export { Progress }
