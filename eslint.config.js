import globals from 'globals'
import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

// Class strings that bypass tokens: arbitrary visual values (bg-[#fff],
// rounded-[13px], z-[60]...), hex colors, and raw Tailwind palette colors
// (text-red-500). Layout arbitraries like w-[...] or grid-cols-[...] stay allowed.
const offTokenClass =
  /(^|[\s:!])(bg|text|border|ring|outline|fill|stroke|shadow|rounded(-[a-z]+)?|z|duration|ease|tracking|leading|font)-\[(?!inherit\])|#[0-9a-fA-F]{3,8}\b|(^|[\s:!])(bg|text|border|ring|fill|stroke|from|to|via)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d{2,3}/
    .source
const tokenMessage =
  'Use a design token (bg-primary, rounded-xl, shadow-overlay, z-overlay, text-caption...) instead of an arbitrary or raw palette value. See Foundations/Tokens in Storybook.'
const designTokenRules = [
  `JSXAttribute[name.name='className'] Literal[value=/${offTokenClass}/]`,
  `JSXAttribute[name.name='className'] TemplateElement[value.raw=/${offTokenClass}/]`,
  `CallExpression[callee.name=/^(cn|cva|clsx)$/] Literal[value=/${offTokenClass}/]`,
].map((selector) => ({ selector, message: tokenMessage }))

// Raw type scale and heavy weights bypass the type roles (text-title,
// text-heading, text-display...). Small sizes (text-xs/sm/base) stay allowed.
const offScaleType =
  /(^|[\s:!])(text-(lg|xl|[2-9]xl)|font-(bold|extrabold|black))(?![\w-])/.source
const typeMessage =
  'Use a type role (text-title, text-heading, text-display, text-caption) or PageHeader / Section instead of a raw size or weight. See AGENTS.md > Type.'
const typeRules = [
  `JSXAttribute[name.name='className'] Literal[value=/${offScaleType}/]`,
  `JSXAttribute[name.name='className'] TemplateElement[value.raw=/${offScaleType}/]`,
  `CallExpression[callee.name=/^(cn|cva|clsx)$/] Literal[value=/${offScaleType}/]`,
].map((selector) => ({ selector, message: typeMessage }))

// Card spacing comes from --card-spacing; padding belongs on its sections.
const cardPadding = /(^|[\s:!])p[xytbse]?-/.source
const cardPaddingRule = {
  selector: `JSXOpeningElement[name.name='Card'] > JSXAttribute[name.name='className'] Literal[value=/${cardPadding}/]`,
  message:
    'Do not pad a Card. Use CardHeader / CardContent / CardFooter, which read --card-spacing.',
}

export default defineConfig(
  { ignores: ['dist', 'src/components/ui', 'storybook-static'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginQuery.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-console': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      // Enforce type-only imports for TypeScript types
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      // Prevent duplicate imports from the same module
      'no-duplicate-imports': 'error',
    },
  },
  {
    files: ['**/*.stories.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // Design-system guardrails: product code styles through tokens and primitives.
  // src/components/ui is ignored above, so the primitives themselves are exempt.
  {
    files: ['src/**/*.tsx'],
    ignores: ['src/components/stories/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@radix-ui/react-(?!icons$|slot$)',
              message:
                'Import the design-system wrapper from @/components/ui instead of Radix directly.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        ...designTokenRules,
        ...typeRules,
        cardPaddingRule,
      ],
    },
  }
)
