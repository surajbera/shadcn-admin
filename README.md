# Shadcn Admin

An admin product shell built on shadcn/ui, Vite and TanStack, with a design system that the linter enforces. New screens plug into the shell and are assembled from tokens and primitives. They don't restyle anything.

The sample domain is privacy operations: data subject requests, regulations, consent. The same foundations work for any admin product.

- **Tokens.** One file holds every color, radius, shadow, layer, duration, type role and spacing role. Change it to rebrand the whole app.
- **Primitives.** 40+ components in `src/components/ui` that read only tokens and expose `variant` and `size`.
- **Guardrails.** ESLint fails the build on hex colors, raw palette classes, arbitrary visual values, raw type sizes and direct Radix imports in product code.
- **Reference feature.** `src/features/requests` shows the full pattern (list, detail, create/edit, delete, loading and empty states, React Query) and is the one to copy.
- **Verified in Storybook.** Every story runs in light, dark and RTL, is checked with axe and is compared against screenshot baselines.

## Quick start

Requires Node 24 (the version CI uses).

```bash
npm install
npm run dev
```

| Task                             | Command                        |
| -------------------------------- | ------------------------------ |
| Dev server                       | `npm run dev`                  |
| Lint (includes design rules)     | `npm run lint`                 |
| Typecheck                        | `npm run typecheck`            |
| Typecheck and production build   | `npm run build`                |
| Unit tests (Vitest, in Chromium) | `npm test`                     |
| Install the test browser         | `npm run test:browser:install` |
| Unused files and dependencies    | `npm run knip`                 |
| Storybook                        | `npm run storybook`            |
| Accessibility on every story     | `npm run test:storybook`       |
| Visual regression on every story | `npm run test:visual`          |

A change is done when `npm run lint`, `npx tsc -b` and `npm test` pass.

## Architecture

The app is split into layers. Each layer depends only on the layers below it.

```
Products     src/features/*                     compose primitives and patterns; no raw values
Patterns     src/components/data-table, dialogs  shared screen pieces
Shell        src/main.tsx, components/layout     providers, sidebar, header, route groups
Primitives   src/components/ui                   consume tokens; expose variant and size
Tokens       src/styles/theme.css                the only place raw values live
```

- A feature never imports another feature.
- The shell never imports feature internals.
- Only a feature's `api/*-api.ts` file talks to the backend.

For the full description, see [ARCHITECTURE.md](ARCHITECTURE.md). The working rules for people and coding agents are in [AGENTS.md](AGENTS.md).

## Design system

### Tokens

All tokens live in [`src/styles/theme.css`](src/styles/theme.css) as semantic CSS variables, with light and dark values, and are exposed to Tailwind as utilities.

| Group     | Tokens                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------- |
| Surfaces  | `canvas` (behind the page), `card` (panels), `background` (controls, dialogs), `muted` (tracks, hovers) |
| Brand     | `primary`: the one main action, active nav item, focus ring and first chart series                      |
| Status    | `success`, `warning`, `destructive`, `info`, plus `*-strong` variants for AA text on tinted surfaces    |
| Charts    | `chart-1` (primary), `chart-2`, `chart-3` (derived from primary), `chart-4`, `chart-5` (neutrals)       |
| Type      | `text-hero`, `text-display`, `text-title`, `text-heading`, `text-body`, `text-caption`, `text-micro`    |
| Radius    | `rounded-sm` … `rounded-2xl`, all derived from `--radius`                                               |
| Elevation | `shadow-control`, `shadow-overlay`, `shadow-modal`                                                      |
| Layers    | `z-sticky` (10), `z-raised` (20), `z-overlay` (50), `z-toast` (100)                                     |
| Motion    | `duration-fast` … `duration-slower`, `ease-standard`, `ease-emphasized`                                 |
| Spacing   | `p-page`, `gap-section`, `p-card`, `gap-stack`                                                          |

Each type role sets size, line height, weight and tracking with one class, so there is no `text-2xl font-bold tracking-tight`:

| Role                           | Class                                              |
| ------------------------------ | -------------------------------------------------- |
| Page title                     | `text-title` (comes with `PageHeader`)             |
| Section or card title          | `text-heading` (comes with `Section`, `CardTitle`) |
| Key figure                     | `text-display tabular-nums`                        |
| Body, row, control             | `text-body` or `text-sm`                           |
| Meta, axis, hint, table header | `text-caption text-muted-foreground`               |
| Record ID (`DSR-20418`)        | `font-mono text-caption`                           |

Inter is the sans font and Geist Mono is used only for record IDs. Secondary colors are derived from `--primary` with relative `oklch()`, so you rebrand by changing two values:

```css
:root {
  /* The sidebar accent, focus ring, info and charts follow it */
  --primary: oklch(0.5894 0.2026 258.024);
  /* Every radius from rounded-sm to rounded-2xl follows it */
  --radius: 0.625rem;
}
```

### Primitives

Import each primitive from its own file: `import { Button } from '@/components/ui/button'`.

| Group        | Components                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Page layout  | `PageHeader`, `Section`, `Stack`, `Inline`, `Card`, `Separator`, `ScrollArea`, `Sidebar`                                                       |
| Data display | `StatCard`, `DescriptionList`, `Badge`, `Progress`, `Table`, `Chart`, `Avatar`, `Skeleton`, `EmptyState`                                       |
| Inputs       | `Button`, `Input`, `Textarea`, `Select`, `Combobox`, `DatePicker`, `Calendar`, `Checkbox`, `RadioGroup`, `Switch`, `InputOTP`, `Form`, `Label` |
| Overlays     | `Dialog`, `AlertDialog`, `Sheet`, `Popover`, `DropdownMenu`, `Tooltip`, `Command`                                                              |
| Navigation   | `Tabs`, `Breadcrumb`, `Collapsible`                                                                                                            |
| Feedback     | `Alert`, `Sonner` toasts                                                                                                                       |

Patterns built on top of them:

- **Data table** (`@/components/data-table`): `DataTableView` with `loading` and `empty`, `DataTableToolbar` with faceted filters, `DataTablePagination`, column headers, view options and bulk actions. `useTableUrlState` keeps paging, search and filters in the URL.
- **`ConfirmDialog`** handles destructive confirmations (`destructive` prop).

Components follow a shared scale:

- **Density.** Controls are `h-8` (`sm` is `h-7`, `lg` is `h-9`) on `Button`, `Input` and `SelectTrigger` alike. Badges are `h-5`. Table rows are `h-11` and headers are `h-9`.
- **Radius.** An outer element is always rounder than what sits inside it: `rounded-2xl` for cards, dialogs and sheets; `rounded-xl` for menus and popovers; `rounded-lg` for controls; `rounded-md` for items; `rounded-full` for badges and avatars.
- **Status.** Color appears only through `Badge` (`neutral`, `info`, `success`, `warning`, `danger`) and `Alert`. Categories such as regulation or request type are labels (`outline` or `secondary`) and never get a hue of their own.

If a primitive needs a new look, add a variant to it. Don't override its classes from a feature.

### Enforced by lint

`npm run lint` applies these rules to all product code (everything outside `src/components/ui` and the stories):

```tsx
// Rejected
<div className='bg-[#fff] rounded-[13px] z-[60]' />   // arbitrary visual values
<p className='text-red-500' />                       // raw palette color
<h2 className='text-2xl font-bold' />                // raw type scale and weight
<Card className='p-6' />                             // padding on a Card
import * as Dialog from '@radix-ui/react-dialog'     // Radix outside the primitives

// Accepted
<div className='bg-card rounded-2xl z-overlay' />
<Badge variant='danger'>Overdue</Badge>
<h2 className='text-heading' />
<Card><CardContent>…</CardContent></Card>
import { Dialog } from '@/components/ui/dialog'
```

Layout arbitraries such as `w-[…]` and `grid-cols-[…]` are allowed. When a rule blocks you, add a token to `theme.css` or a variant to the primitive; don't disable the rule.

### Storybook

`npm run storybook` opens the component catalog at `localhost:6006`:

- **Guide/Introduction** and **Guide/Usage rules**: how the layers fit together, plus do and don't tables.
- **Foundations/Tokens**: every surface, status color, shadow, layer, duration and radius, rendered live.
- **Primitives/** and **Layout/**: each component and variant, with realistic privacy-ops content.
- **Theme** and **Direction** toolbars, and an **Accessibility** panel running axe.

Two Playwright suites run against every story:

- `npm run test:storybook` runs axe in light and dark mode and fails on any violation.
- `npm run test:visual` compares full-page screenshots in light, dark and RTL. After an intended visual change, update the baselines with `npm run test:visual -- --update-snapshots`. Baselines are stored per platform in `tests/storybook/__screenshots__/<platform>`, so the first run on a new OS has to create them.

Both suites start their own Storybook on port 6007.

## Building a screen

Copy [`src/features/requests`](src/features/requests). It is the reference feature:

```
src/routes/_authenticated/requests/
  index.tsx            search schema + prefetch in `loader` + component
  $requestId.tsx       prefetch in `loader` + component
src/features/requests/
  api/requests-api.ts  the only file that talks to the backend (fake today)
  api/queries.ts       query options, cache keys, mutation hooks + toasts
  data/schema.ts       zod schemas and types
  data/data.ts         option lists (labels, Badge tones, icons)
  lib/                 pure domain logic, unit tested
  components/          table, columns, form sheet, dialogs
  index.tsx            list screen
  request-detail.tsx   detail screen
```

1. Add a nav item to `appConfig.navGroups` in [`src/config/app.ts`](src/config/app.ts). The sidebar and command menu render from this config.
2. Add a thin route file under `src/routes/_authenticated/<name>/` containing `createFileRoute`, the search schema, and an optional `loader` that prefetches.
3. Build the screen in `src/features/<name>/`. Read data with `useQuery(...QueryOptions())` and write through the feature's mutation hooks.

Every screen has the same shape:

```tsx
<Header fixed>…</Header>
<Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
  <PageHeader
    title='Requests'
    description='Data subject requests across every regulation, with their deadlines.'
    actions={<Button>New request</Button>}
  />
  <Section title='Open'>…</Section>
</Main>
```

| Need                         | Use                                                                     |
| ---------------------------- | ----------------------------------------------------------------------- |
| Key figures                  | 2 to 4 `StatCard`s in a `grid gap-4` row, with `loading` while pending  |
| A list of records            | TanStack table rendered through `DataTableView`                         |
| Create or edit a record      | `react-hook-form` + `Form` in a `Sheet`                                 |
| Confirm a destructive action | `ConfirmDialog` with `destructive`                                      |
| Nothing to show              | `EmptyState` with an action, never a bare "No data"                     |
| Loading                      | A `Skeleton` shaped like the content, or the primitive's `loading` prop |

To connect a real backend, replace the function bodies in `api/*-api.ts` with HTTP calls that return the same shapes. The hooks and screens keep working without changes.

## The shell

- **Theming.** Light, dark and system modes, plus a choice of Inter, Manrope or the system font.
- **Layout.** Settings drawer for the sidebar variant (inset, sidebar, floating) and collapse mode (icon, off-canvas, none).
- **RTL.** A direction toggle. All components use logical classes (`ms-`, `pe-`, `start-`), and RTL is covered by the visual tests.
- **Navigation.** A global command menu (<kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd>), a top loading bar on route changes and a skip-to-main link.
- **Data.** A React Query client that handles errors centrally (a 401 signs you out; a 500 shows a toast and, in production, an error page), and routes that preload on hover.
- **Pages.** Sign in, sign up, forgot password and OTP pages, error pages for 401, 403, 404, 500 and 503, and settings screens.

Tasks, users, chats, apps and the dashboard are sample screens from the original template.

## Quality gates

- **Pre-commit.** Husky and lint-staged run Prettier and ESLint on staged files.
- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)). On every push and pull request: lint, format check, knip, typecheck and build, and unit tests.
- **Unit tests.** Vitest runs in real Chromium via Playwright, covering domain logic, hooks, stores and components.

## Tech stack

| Area    | Tools                                                                  |
| ------- | ---------------------------------------------------------------------- |
| UI      | React 19, [shadcn/ui](https://ui.shadcn.com) on Radix, Tailwind CSS v4 |
| Build   | Vite 8, TypeScript 6                                                   |
| Routing | TanStack Router (file-based, type-safe search params)                  |
| Data    | TanStack Query, TanStack Table, Zod, React Hook Form, Zustand          |
| Charts  | Recharts through `ChartContainer`                                      |
| Icons   | Lucide                                                                 |
| Testing | Vitest browser mode, Playwright, axe-core                              |
| Tooling | ESLint, Prettier, knip, Husky, Storybook 10                            |

## License

[MIT](LICENSE). Based on [shadcn-admin](https://github.com/satnaing/shadcn-admin) by Sat Naing.
