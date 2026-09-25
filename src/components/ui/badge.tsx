import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex h-5 items-center justify-center rounded-full border px-2 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        neutral: 'border-transparent bg-muted text-muted-foreground',
        info: 'border-transparent bg-info/10 text-info-strong',
        success: 'border-transparent bg-success/12 text-success-strong',
        warning: 'border-transparent bg-warning/15 text-warning-strong',
        danger: 'border-transparent bg-destructive/10 text-destructive-strong',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  dot = false,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean; dot?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant }), dot && 'ps-1.5', className)}
      {...props}
    >
      {dot && !asChild && (
        <span
          aria-hidden='true'
          className='size-1.5 shrink-0 rounded-full bg-current'
        />
      )}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
