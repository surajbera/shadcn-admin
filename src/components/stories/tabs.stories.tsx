import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const panels = [
  {
    value: 'consent',
    label: 'Consent',
    count: '18,420',
    hint: 'Active consent records across 4 properties',
  },
  {
    value: 'preferences',
    label: 'Preferences',
    count: '6,112',
    hint: 'Subjects with at least one saved preference',
  },
  {
    value: 'cookies',
    label: 'Cookies',
    count: '212',
    hint: 'Cookies classified in the last scan',
  },
]

export const ConsentViews: Story = {
  render: () => (
    <Tabs defaultValue='consent' className='max-w-md gap-4'>
      <TabsList>
        {panels.map((p) => (
          <TabsTrigger key={p.value} value={p.value}>
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {panels.map((p) => (
        <TabsContent
          key={p.value}
          value={p.value}
          className='grid gap-1 rounded-2xl bg-card p-5 ring-1 ring-foreground/[0.07]'
        >
          <span className='text-3xl font-semibold tracking-tight tabular-nums'>
            {p.count}
          </span>
          <span className='text-xs text-muted-foreground'>{p.hint}</span>
        </TabsContent>
      ))}
    </Tabs>
  ),
}
