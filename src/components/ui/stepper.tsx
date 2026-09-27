import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StepperStep = {
  title: React.ReactNode
  description?: React.ReactNode
}

type StepperProps = Omit<React.ComponentProps<'ol'>, 'children'> & {
  steps: StepperStep[]
  /**
   * Index of the step in progress. Steps before it are complete. Set it to
   * `steps.length` once every step is done.
   */
  current: number
  /**
   * Lets people go back to a completed step. The current step and the steps
   * after it are never clickable.
   */
  onStepClick?: (index: number) => void
}

type StepState = 'complete' | 'current' | 'upcoming'

/**
 * Where someone is in a multi-step flow: submit a request, install a
 * connector, build a template. Pass an `aria-label` that names the flow.
 */
function Stepper({
  steps,
  current,
  onStepClick,
  className,
  ...props
}: StepperProps) {
  return (
    <ol
      data-slot='stepper'
      className={cn('flex w-full items-start gap-3', className)}
      {...props}
    >
      {steps.map((step, index) => {
        const state: StepState =
          index < current
            ? 'complete'
            : index === current
              ? 'current'
              : 'upcoming'
        const isLast = index === steps.length - 1

        const body = (
          <>
            <span
              aria-hidden='true'
              data-slot='stepper-indicator'
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full text-caption font-medium tabular-nums transition-colors duration-fast',
                state === 'complete' &&
                  'bg-primary/10 text-info-strong dark:bg-primary/20',
                state === 'current' &&
                  'bg-primary text-primary-foreground shadow-control',
                state === 'upcoming' &&
                  'border border-border-strong bg-background text-muted-foreground'
              )}
            >
              {state === 'complete' ? (
                <Check className='size-3.5' />
              ) : (
                index + 1
              )}
            </span>
            <span className='grid min-w-0 gap-0.5 pt-0.5 text-start'>
              <span
                data-slot='stepper-title'
                className={cn(
                  'text-body font-medium underline-offset-4',
                  state === 'upcoming' && 'text-muted-foreground'
                )}
              >
                {step.title}
                {state === 'complete' && (
                  <span className='sr-only'> (completed)</span>
                )}
              </span>
              {step.description && (
                <span
                  data-slot='stepper-description'
                  className='text-caption text-muted-foreground'
                >
                  {step.description}
                </span>
              )}
            </span>
          </>
        )

        return (
          <li
            key={index}
            data-slot='stepper-item'
            data-state={state}
            aria-current={state === 'current' ? 'step' : undefined}
            className={cn(
              'flex min-w-0 items-start gap-3',
              !isLast && 'flex-1'
            )}
          >
            {state === 'complete' && onStepClick ? (
              <button
                type='button'
                onClick={() => onStepClick(index)}
                className='flex min-w-0 items-start gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 [&:hover_[data-slot=stepper-title]]:underline'
              >
                {body}
              </button>
            ) : (
              <div className='flex min-w-0 items-start gap-2.5'>{body}</div>
            )}
            {!isLast && (
              <span
                aria-hidden='true'
                data-slot='stepper-separator'
                className='mt-3 h-px min-w-4 flex-1 bg-border'
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export { Stepper }
