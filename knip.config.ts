import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['.storybook/**', 'src/components/stories/**'],
  ignore: [
    'src/components/ui/**',
    'src/components/layout/app-title.tsx',
    'src/tanstack-table.d.ts',
  ],
}

export default config