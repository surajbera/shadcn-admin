import type { Decorator, Preview } from '@storybook/react-vite'
import '../src/styles/index.css'

const withTheme: Decorator = (Story, context) => {
  document.documentElement.classList.toggle(
    'dark',
    context.globals.theme === 'dark'
  )

  if (context.parameters.bare) return <Story />

  return (
    <div className='min-h-svh bg-canvas p-8 text-foreground'>
      <Story />
    </div>
  )
}

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
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
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withTheme],
}

export default preview
