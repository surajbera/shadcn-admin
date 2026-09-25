import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const gap = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

const align = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

const stackVariants = cva('flex flex-col', {
  variants: { gap, align, justify },
  defaultVariants: { gap: 'md', align: 'stretch' },
})

const inlineVariants = cva('flex flex-row', {
  variants: {
    gap,
    align,
    justify,
    wrap: { true: 'flex-wrap', false: 'flex-nowrap' },
  },
  defaultVariants: { gap: 'sm', align: 'center', wrap: true },
})

type StackProps = React.ComponentProps<'div'> &
  VariantProps<typeof stackVariants> & { asChild?: boolean }

/** Vertical rhythm. Use instead of hand-written `flex flex-col gap-*`. */
function Stack({
  className,
  gap,
  align,
  justify,
  asChild,
  ...props
}: StackProps) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      data-slot='stack'
      className={cn(stackVariants({ gap, align, justify }), className)}
      {...props}
    />
  )
}

type InlineProps = React.ComponentProps<'div'> &
  VariantProps<typeof inlineVariants> & { asChild?: boolean }

/** Horizontal row that wraps by default: toolbars, button groups, meta rows. */
function Inline({
  className,
  gap,
  align,
  justify,
  wrap,
  asChild,
  ...props
}: InlineProps) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      data-slot='inline'
      className={cn(inlineVariants({ gap, align, justify, wrap }), className)}
      {...props}
    />
  )
}

export { Stack, Inline, stackVariants, inlineVariants }
