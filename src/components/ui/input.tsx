import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  [
    'flex w-full min-w-0 rounded-lg border border-input bg-background py-1 text-base shadow-control transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/20',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
  ],
  {
    variants: {
      size: {
        sm: 'h-7 rounded-md px-2 md:text-xs',
        default: 'h-8 px-2.5',
        lg: 'h-9 px-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

function Input({
  className,
  type,
  size,
  ...props
}: Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot='input'
      data-size={size ?? 'default'}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
