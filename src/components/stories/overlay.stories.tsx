import type { Meta, StoryObj } from '@storybook/react-vite'
import { MoreHorizontal, UserPlus } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const meta = {
  title: 'Primitives/Overlay',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const ConfirmRedaction: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='outline'>Apply redaction</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apply redaction to 14 documents?</AlertDialogTitle>
          <AlertDialogDescription>
            Personal data for anna.berg@northwind.eu will be masked in the
            export package. The originals stay unchanged.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Apply redaction</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const AssignOwner: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline'>
          <UserPlus />
          Assign owner
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Assign owner</SheetTitle>
          <SheetDescription>DSR-20402 · Portability · GDPR</SheetDescription>
        </SheetHeader>
        <div className='grid gap-4 px-5'>
          <div className='grid gap-1.5'>
            <Label>Owner</Label>
            <Select defaultValue='priya'>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='priya'>Priya Nair</SelectItem>
                <SelectItem value='leo'>Leo Martin</SelectItem>
                <SelectItem value='sofia'>Sofia Reyes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-1.5'>
            <Label htmlFor='handover'>Handover note</Label>
            <Textarea id='handover' placeholder='Context for the new owner' />
          </div>
        </div>
        <SheetFooter className='flex-row justify-end'>
          <SheetClose asChild>
            <Button variant='ghost'>Cancel</Button>
          </SheetClose>
          <Button>Assign</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const RowActions: Story = {
  render: () => (
    <div className='flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon' aria-label='Row actions'>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-52'>
          <DropdownMenuLabel className='font-mono text-xs text-muted-foreground'>
            DSR-20418
          </DropdownMenuLabel>
          <DropdownMenuItem>
            Open request
            <DropdownMenuShortcut>↵</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Assign owner</DropdownMenuItem>
          <DropdownMenuItem>Extend deadline</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>
            Reject request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost'>Why 30 days?</Button>
        </PopoverTrigger>
        <PopoverContent className='grid gap-1'>
          <span className='font-medium'>GDPR Art. 12(3)</span>
          <span className='text-xs text-muted-foreground'>
            Controllers must respond within one month, extendable by two months
            for complex requests.
          </span>
        </PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost'>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Last synced 2 minutes ago</TooltipContent>
      </Tooltip>
    </div>
  ),
}
