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
  { name: 'info', className: 'bg-info', use: 'Neutral notice' },
]

const typeScale = [
  {
    role: 'text-display',
    className: 'text-display tabular-nums',
    sample: '1,284',
  },
  {
    role: 'text-title',
    className: 'text-title',
    sample: 'Data subject requests',
  },
  {
    role: 'text-heading',
    className: 'text-heading',
    sample: 'Requests due this week',
  },
  {
    role: 'text-body',
    className: 'text-body',
    sample: 'Access request from anna.berg@northwind.eu',
  },
  {
    role: 'text-caption',
    className: 'text-caption text-muted-foreground',
    sample: 'Received 12 Sep · GDPR Art. 15',
  },
  {
    role: 'font-mono text-caption',
    className: 'font-mono text-caption',
    sample: 'DSR-20418',
  },
]

const elevations = [
  { name: 'shadow-control', className: 'shadow-control', use: 'Button, input' },
  { name: 'shadow-overlay', className: 'shadow-overlay', use: 'Menu, popover' },
  { name: 'shadow-modal', className: 'shadow-modal', use: 'Dialog, sheet' },
]

const layers = [
  { name: 'z-sticky', value: '10', use: 'Sticky headers, table columns' },
  { name: 'z-raised', value: '20', use: 'Sidebar rail, floating bars' },
  { name: 'z-overlay', value: '50', use: 'Dialogs, sheets, popovers, menus' },
  { name: 'z-toast', value: '100', use: 'Toasts, always on top' },
]

const motion = [
  { name: 'duration-fast', value: '150ms', use: 'Hover, color' },
  { name: 'duration-base', value: '200ms', use: 'Dialogs, collapses' },
  { name: 'duration-slow', value: '300ms', use: 'Sheet close' },
  { name: 'duration-slower', value: '500ms', use: 'Sheet open' },
]

const radii = [
  { name: 'Container', className: 'rounded-2xl', use: 'Card, dialog, sheet' },
  { name: 'Floating', className: 'rounded-xl', use: 'Menu, popover, alert' },
  { name: 'Control', className: 'rounded-lg', use: 'Button, input, tabs' },
  { name: 'Item', className: 'rounded-md', use: 'Menu item, tab, nav' },
  { name: 'Inner', className: 'rounded-sm', use: 'Checkbox, close button' },
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
      <Section title='Elevation'>
        <div className='grid grid-cols-3 gap-6'>
          {elevations.map((e) => (
            <div key={e.name} className='grid gap-2'>
              <div className={`h-16 rounded-xl bg-card ${e.className}`} />
              <span className='font-mono text-caption'>{e.name}</span>
              <span className='text-caption text-muted-foreground'>
                {e.use}
              </span>
            </div>
          ))}
        </div>
      </Section>
      <Section title='Layers and motion'>
        <div className='grid grid-cols-2 gap-6'>
          {[layers, motion].map((rows, i) => (
            <div
              key={i}
              className='grid divide-y rounded-2xl bg-card ring-1 ring-foreground/[0.07]'
            >
              {rows.map((r) => (
                <div
                  key={r.name}
                  className='grid grid-cols-[8rem_4rem_1fr] gap-3 px-4 py-3 text-caption'
                >
                  <span className='font-mono'>{r.name}</span>
                  <span className='text-muted-foreground tabular-nums'>
                    {r.value}
                  </span>
                  <span className='text-muted-foreground'>{r.use}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>
      <Section title='Radius'>
        <div className='grid grid-cols-6 gap-4'>
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
