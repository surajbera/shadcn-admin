import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Foundations/Tokens',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const surfaces = [
  { name: 'canvas', className: 'bg-canvas', use: 'Page behind cards' },
  { name: 'background', className: 'bg-background', use: 'Controls, dialogs' },
  { name: 'card', className: 'bg-card', use: 'Cards, panels' },
  { name: 'muted', className: 'bg-muted', use: 'Tabs track, hovers' },
  { name: 'border', className: 'bg-border', use: 'Dividers, inputs' },
]

const signals = [
  { name: 'primary', className: 'bg-primary', use: 'The one action' },
  { name: 'success', className: 'bg-success', use: 'Completed' },
  { name: 'warning', className: 'bg-warning', use: 'Due soon' },
  { name: 'destructive', className: 'bg-destructive', use: 'Overdue, delete' },
]

const typeScale = [
  {
    role: 'Page title',
    className: 'text-xl font-semibold tracking-tight',
    sample: 'Data subject requests',
  },
  {
    role: 'Section title',
    className: 'text-sm font-semibold tracking-tight',
    sample: 'Requests due this week',
  },
  {
    role: 'Key figure',
    className: 'text-3xl font-semibold tracking-tight tabular-nums',
    sample: '1,284',
  },
  {
    role: 'Body, row, control',
    className: 'text-sm',
    sample: 'Access request from anna.berg@northwind.eu',
  },
  {
    role: 'Meta, hint',
    className: 'text-xs text-muted-foreground',
    sample: 'Received 12 Sep · GDPR Art. 15',
  },
  {
    role: 'Record ID',
    className: 'font-mono text-xs',
    sample: 'DSR-20418',
  },
]

const radii = [
  { name: 'Container', className: 'rounded-2xl', use: 'Card, dialog, sheet' },
  { name: 'Floating', className: 'rounded-xl', use: 'Menu, popover, alert' },
  { name: 'Control', className: 'rounded-lg', use: 'Button, input, tabs' },
  { name: 'Item', className: 'rounded-md', use: 'Menu item, tab, nav' },
  { name: 'Pill', className: 'rounded-full', use: 'Badge, avatar' },
]

function Swatch({
  name,
  className,
  use,
}: {
  name: string
  className: string
  use: string
}) {
  return (
    <div className='grid gap-2'>
      <div
        className={`h-14 rounded-xl ring-1 ring-foreground/[0.07] ${className}`}
      />
      <div className='grid'>
        <span className='font-mono text-xs'>{name}</span>
        <span className='text-xs text-muted-foreground'>{use}</span>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className='grid gap-4'>
      <h2 className='text-sm font-semibold tracking-tight'>{title}</h2>
      {children}
    </section>
  )
}

export const Overview: Story = {
  render: () => (
    <div className='grid max-w-4xl gap-10'>
      <Section title='Surfaces'>
        <div className='grid grid-cols-5 gap-4'>
          {surfaces.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </Section>
      <Section title='Signals'>
        <div className='grid grid-cols-5 gap-4'>
          {signals.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </Section>
      <Section title='Type'>
        <div className='grid divide-y rounded-2xl bg-card ring-1 ring-foreground/[0.07]'>
          {typeScale.map((t) => (
            <div
              key={t.role}
              className='grid grid-cols-[10rem_1fr] items-baseline gap-4 px-5 py-4'
            >
              <span className='text-xs text-muted-foreground'>{t.role}</span>
              <span className={t.className}>{t.sample}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title='Radius'>
        <div className='grid grid-cols-5 gap-4'>
          {radii.map((r) => (
            <div key={r.name} className='grid gap-2'>
              <div
                className={`h-14 border-2 border-primary/40 bg-primary/5 ${r.className}`}
              />
              <div className='grid'>
                <span className='text-xs font-medium'>{r.name}</span>
                <span className='text-xs text-muted-foreground'>{r.use}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
}
