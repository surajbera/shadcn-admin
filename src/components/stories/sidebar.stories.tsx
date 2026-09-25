import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ClipboardCheck,
  Cookie,
  FileSearch,
  Inbox,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const meta = {
  title: 'Primitives/Sidebar',
  component: Sidebar,
  parameters: { bare: true },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

const groups = [
  {
    label: 'Operate',
    items: [
      { title: 'Overview', icon: LayoutDashboard },
      { title: 'Requests', icon: Inbox, badge: '42', active: true },
      { title: 'Assessments', icon: ClipboardCheck, badge: '7' },
    ],
  },
  {
    label: 'Govern',
    items: [
      { title: 'Consent', icon: Cookie },
      { title: 'Data discovery', icon: FileSearch },
      { title: 'Records of processing', icon: ScrollText },
    ],
  },
]

export const ProductNav: Story = {
  render: () => (
    <SidebarProvider className='bg-canvas'>
      <Sidebar variant='floating'>
        <SidebarHeader>
          <div className='flex items-center gap-2 px-2 py-1.5'>
            <div className='flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground'>
              <ShieldCheck className='size-4' />
            </div>
            <div className='grid leading-tight'>
              <span className='text-sm font-semibold tracking-tight'>
                Safeguard
              </span>
              <span className='text-xs text-muted-foreground'>
                Northwind EU
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {groups.map((g) => (
            <SidebarGroup key={g.label}>
              <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {g.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={'active' in item}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {'badge' in item && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg'>
                <Avatar className='size-7'>
                  <AvatarFallback className='text-xs'>PN</AvatarFallback>
                </Avatar>
                <div className='grid leading-tight'>
                  <span className='text-sm font-medium'>Priya Nair</span>
                  <span className='text-xs text-muted-foreground'>
                    Privacy lead
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className='bg-canvas'>
        <header className='flex h-14 items-center gap-2 px-4'>
          <SidebarTrigger />
          <span className='text-sm text-muted-foreground'>Requests</span>
        </header>
        <div className='grid gap-1 px-6'>
          <h1 className='text-xl font-semibold tracking-tight'>
            Data subject requests
          </h1>
          <p className='text-sm text-muted-foreground'>
            42 open · 6 due this week · 3 overdue
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
}
