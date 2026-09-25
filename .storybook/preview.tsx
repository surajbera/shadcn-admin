import type { Decorator, Preview } from '@storybook/react-vite'
import { PrimitiveDirectionProvider } from '../src/components/ui/direction'
import '../src/styles/index.css'

const withTheme: Decorator = (Story, context) => {
  document.documentElement.classList.toggle(
    'dark',
    context.globals.theme === 'dark'
  )
  document.documentElement.dir = context.globals.dir ?? 'ltr'

  const dir = context.globals.dir ?? 'ltr'
  if (context.parameters.bare)
    return (
      <PrimitiveDirectionProvider dir={dir}>
        <Story />
      </PrimitiveDirectionProvider>
    )

  return (
    <PrimitiveDirectionProvider dir={dir}>
      <div className='min-h-svh bg-canvas p-8 text-foreground'>
        <Story />
      </div>
    </PrimitiveDirectionProvider>
  )
}

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    // Accessibility checks run on every story; violations fail the story in test runs.
    a11y: { test: 'error' },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    dir: {
      description: 'Text direction',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    dir: 'ltr',
  },
  decorators: [withTheme],
}

export default preview
