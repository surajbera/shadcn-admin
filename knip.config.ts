import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: [
    '.storybook/**',
    'src/components/stories/**',
    'tests/storybook/**',
  ],
  ignore: [
    'src/components/ui/**',
    'src/components/layout/app-title.tsx',
  ],
}

export default config