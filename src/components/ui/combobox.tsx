import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export type ComboboxOption = {
  value: string
  label: string
  /** Secondary line, e.g. a team or an email. Also searched. */
  description?: string
  icon?: React.ReactNode
}

type ComboboxProps = Omit<
  React.ComponentProps<'button'>,
  'value' | 'onChange' | 'children'
> & {
  options: ComboboxOption[]
  value?: string | null
  onValueChange: (value: string | null) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  /** Lets the user pick the current value again to clear it. */
  clearable?: boolean
  size?: 'sm' | 'default' | 'lg'
}

/**
 * Single choice from a list long enough to need search (people, systems,
 * countries). For up to ~7 fixed options, use `Select`.
 *
 * Extra props (`id`, `aria-*`) go to the trigger button, so it works inside
 * `FormControl`.
 */
function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No matches.',
  clearable = false,
  size = 'default',
  disabled,
  className,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          role='combobox'
          aria-expanded={open}
          data-slot='combobox-trigger'
          data-size={size}
          data-placeholder={selected ? undefined : ''}
          disabled={disabled}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-2.5 text-sm whitespace-nowrap shadow-control transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=lg]:h-9 data-[size=sm]:h-7 dark:bg-input/20 dark:hover:bg-input/40',
            className
          )}
          {...props}
        >
          <span className='flex min-w-0 items-center gap-2 truncate'>
            {selected?.icon}
            {selected?.label ?? placeholder}
          </span>
          <ChevronsUpDown className='size-4 shrink-0 opacity-50' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-(--radix-popover-trigger-width) min-w-56 p-0'
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.value === value
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label, option.description ?? '']}
                    onSelect={() => {
                      onValueChange(
                        isSelected && clearable ? null : option.value
                      )
                      setOpen(false)
                    }}
                  >
                    {option.icon}
                    <span className='grid min-w-0 flex-1'>
                      <span className='truncate'>{option.label}</span>
                      {option.description && (
                        <span className='truncate text-caption text-muted-foreground'>
                          {option.description}
                        </span>
                      )}
                    </span>
                    <Check
                      className={cn(
                        'size-4 shrink-0',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
