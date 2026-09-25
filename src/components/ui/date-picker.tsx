import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { type Matcher } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type DatePickerProps = Omit<
  React.ComponentProps<'button'>,
  'value' | 'onChange' | 'children'
> & {
  value?: Date | null
  onValueChange: (date: Date | undefined) => void
  placeholder?: string
  /** Days the user cannot pick, e.g. `{ before: new Date() }`. */
  disabledDays?: Matcher | Matcher[]
  /** date-fns format for the trigger. Defaults to `PP` (Sep 25, 2026). */
  displayFormat?: string
  /** `dropdown` adds month and year selects, for dates far away (birthdays). */
  captionLayout?: 'label' | 'dropdown'
  size?: 'sm' | 'default' | 'lg'
}

/**
 * One date, picked from a calendar. Extra props (`id`, `aria-*`) go to the
 * trigger button, so it works inside `FormControl`.
 */
function DatePicker({
  value,
  onValueChange,
  placeholder = 'Pick a date',
  disabledDays,
  displayFormat = 'PP',
  captionLayout = 'label',
  size = 'default',
  disabled,
  className,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          data-slot='date-picker-trigger'
          data-size={size}
          data-placeholder={value ? undefined : ''}
          disabled={disabled}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg border border-input bg-background px-2.5 text-start text-sm whitespace-nowrap shadow-control transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=lg]:h-9 data-[size=sm]:h-7 dark:bg-input/20 dark:hover:bg-input/40',
            className
          )}
          {...props}
        >
          <CalendarIcon className='size-4 shrink-0 opacity-50' />
          <span className='truncate tabular-nums'>
            {value ? format(value, displayFormat) : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-auto p-0'>
        <Calendar
          mode='single'
          captionLayout={captionLayout}
          selected={value ?? undefined}
          defaultMonth={value ?? undefined}
          disabled={disabledDays}
          onSelect={(date) => {
            onValueChange(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
