import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('keeps a type role next to a text color', () => {
    expect(cn('text-caption', 'text-muted-foreground')).toBe(
      'text-caption text-muted-foreground'
    )
    expect(cn('text-body font-medium', 'text-destructive-strong')).toBe(
      'text-body font-medium text-destructive-strong'
    )
  })

  it('lets a later type role or size replace an earlier one', () => {
    expect(cn('text-caption', 'text-body')).toBe('text-body')
    expect(cn('text-heading', 'text-sm')).toBe('text-sm')
  })
})
