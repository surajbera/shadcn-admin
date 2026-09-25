# Agent instructions

These rules apply to every coding agent (Claude Code, Cursor, Codex, Copilot, Gemini) and to people. `CLAUDE.md` imports this file, so there is one copy. Structure and layers are in [ARCHITECTURE.md](ARCHITECTURE.md).

## Commands

| Task                          | Command                                          |
| ----------------------------- | ------------------------------------------------ |
| Dev server                    | `npm run dev`                                    |
| Lint (design rules included)  | `npm run lint`                                   |
| Typecheck + build             | `npm run build`                                  |
| Unit tests (browser, vitest)  | `npm test`                                       |
| Unused files and dependencies | `npm run knip`                                   |
| Storybook                     | `npm run storybook`                              |
| Accessibility and visual      | `npm run test:storybook`, `npm run test:visual`  |

A change is done when `npm run lint`, `npx tsc -b` and `npm test` pass. The pre-commit hook lints and formats staged files. CI runs the full set on every push and pull request.

## Building a screen

**Copy `src/features/requests` — it is the reference feature.** It shows every pattern below working together: a list with stats, a chart and a URL-synced table; a detail screen; create and edit in a Sheet; delete through `ConfirmDialog`; loading, empty and not-found states; data through React Query.

```
src/routes/_authenticated/requests/
  index.tsx          search schema + prefetch in `loader` + component
  $requestId.tsx     prefetch in `loader` + component
src/features/requests/
  api/requests-api.ts   the only file that talks to the backend (fake today)
  api/queries.ts        query options, cache keys, mutation hooks + toasts
  data/schema.ts        zod schemas and types
  data/data.ts          option lists (labels, Badge tones, icons)
  lib/                  pure domain logic, unit tested
  components/           table, columns, form sheet, dialogs
  index.tsx             list screen
  request-detail.tsx    detail screen
```

1. Add the nav item to `appConfig.navGroups` in `src/config/app.ts`.
2. Add thin route files under `src/routes/_authenticated/<name>/`: `createFileRoute`, the search schema, an optional `loader` that prefetches (`void context.queryClient.prefetchQuery(...)`), and the feature component. Nothing else.
3. Put the screen in `src/features/<name>/`. A feature never imports another feature.
4. Screens read data with `useQuery(...QueryOptions())` and write with the feature's mutation hooks. Only `api/*-api.ts` knows about HTTP. To connect a real backend, replace those function bodies.

Every screen has this shape:

```tsx
<Header>…</Header>
<Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
  <PageHeader title='Requests' description='…' actions={<Button>New request</Button>} />
  <Section title='Open'>…</Section>
</Main>
```

| Need                          | Use                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Page title and main action    | `PageHeader` (one per screen). On a detail screen, a `Breadcrumb` above it                                                         |
| Titled group inside a page    | `Section`, or a `Card` with `CardHeader` / `CardTitle`                                                                             |
| Key figures                   | `StatCard`, 2–4 in a `grid gap-4` row. Pass `loading` while the query is pending                                                  |
| Chart                         | `ChartContainer` with a `ChartConfig` (colors are `chart-1`…`chart-5`), `ChartTooltipContent`, `ChartLegendContent`. Never hex colors |
| A list of records             | TanStack table rendered with `DataTableView` (`loading`, `empty`), `DataTableToolbar`, `DataTablePagination`; URL state through `useTableUrlState` and `autoResetPageIndex: false` |
| Label and value pairs         | `DescriptionList` + `DescriptionItem`                                                                                              |
| Progress against a limit      | `Progress`, with a `Badge` beside it for the status                                                                                |
| Nothing to show               | `EmptyState` with an action, never bare "No data". `variant='plain'` inside a framed panel or table                               |
| Loading                       | `Skeleton` shaped like the content, or the primitive's `loading` prop                                                              |
| Form                          | `react-hook-form` with `Form`, `FormField`, `FormItem`, in a `Sheet` for create/edit                                               |
| Choose from a short list      | `Select`                                                                                                                           |
| Choose from a long list       | `Combobox` (searchable)                                                                                                            |
| A date                        | `DatePicker`                                                                                                                       |
| Confirm a destructive action  | `ConfirmDialog` with `destructive`                                                                                                 |
| Vertical or horizontal rhythm | `Stack` / `Inline` instead of hand-written `flex flex-col gap-*`                                                                   |

Import primitives from `@/components/ui/<name>` and patterns from `@/components/data-table`. Look in `src/components/ui` and Storybook before writing a new component. If a primitive needs a new look, add a variant to it. Do not override its classes from a feature.

## Design rules

Tokens live in `src/styles/theme.css`. Change a color, radius or font there, never at the call site.

### Color

- The palette is zinc neutrals plus one `primary`. `primary` is for the one main action on a screen, the active nav item, the focus ring and the first chart series.
- Surfaces: `canvas` behind the page, `card` for panels, `background` for controls and dialogs, `muted` for tracks and hovers.
- Status color appears only through `Badge` (`neutral`, `info`, `success`, `warning`, `danger`) and `Alert` (`warning`, `destructive`). Color one element per fact: not the row, the button and the chart together.
- Category, department, regulation and request type are labels: `Badge variant='outline'` or `secondary`. They never get their own hue.
- Charts use `chart-1` (primary), `chart-2`, `chart-3`, then the neutrals `chart-4`, `chart-5`.

### Type

Inter is `font-sans`. Geist Mono (`font-mono`) is for record IDs such as `DSR-20418` and nothing else.

| Role                            | Class                                 |
| ------------------------------- | ------------------------------------- |
| Page title                      | `text-title` (comes with `PageHeader`) |
| Section or card title           | `text-heading` (comes with `Section`, `CardTitle`) |
| Key figure                      | `text-display tabular-nums`           |
| Body, row, control              | `text-body` or `text-sm`              |
| Meta, axis, hint, table header  | `text-caption text-muted-foreground`  |
| Record ID                       | `font-mono text-caption`              |
| Error code (error pages only)   | `text-hero`                           |

A heading and the text under it never share a size. Numbers that get compared use `tabular-nums`.

### Density

Controls are `h-8` (sm `h-7`, lg `h-9`) and controls in one row share one size. Badges are `h-5`. Table rows are `h-11`, headers `h-9`.

### Spacing

- `Main` owns the page padding. Sibling blocks on a page are separated by the `gap-4 sm:gap-6` on `Main`.
- A `Card` gets its inset from `--card-spacing`. Never add `p-*` to a `Card`; use `CardHeader`, `CardContent`, `CardFooter`.
- Inside one card, stack with `gap-3` or `gap-4`, not both.

### Radius

The outer element is always rounder than what sits inside it.

| Element                                          | Class          |
| ------------------------------------------------ | -------------- |
| Card, dialog, sheet, table frame, floating sidebar | `rounded-2xl` |
| Menu, popover, select list, alert                | `rounded-xl`   |
| Button, input, select trigger, tabs list         | `rounded-lg`   |
| Menu item, tab trigger, nav item                 | `rounded-md`   |
| Checkbox                                         | `rounded-sm`   |
| Badge, avatar, switch, progress                  | `rounded-full` |

### Elevation and layers

Use the primitive (`Card`, `Popover`, `Dialog`, `Sheet`); it already carries the right shadow. A custom layer uses `shadow-control`, `shadow-overlay` or `shadow-modal`, and `z-sticky`, `z-raised`, `z-overlay` or `z-toast`.

### Direction

The app supports RTL. Use logical classes (`ms-`, `pe-`, `start-`, `inset-e-`), not `ml-`, `pr-`, `left-`.

## What lint rejects

`npm run lint` fails in product code (everything outside `src/components/ui` and the stories) on:

- arbitrary visual values: `bg-[#fff]`, `rounded-[13px]`, `z-[60]`, `text-[11px]`
- raw palette colors: `text-red-500`, `bg-slate-900`, hex colors
- raw type scale and weights: `text-lg` … `text-9xl`, `font-bold`; use the type roles above
- `p-*` on a `Card`
- importing `@radix-ui/*` directly (except `icons` and `slot`)

Layout arbitraries (`w-[…]`, `grid-cols-[…]`) are allowed. When lint blocks you, add a token to `theme.css` or a variant to the primitive. Do not disable the rule. The one accepted exception carries a comment saying why (`appearance-form.tsx` draws fixed light and dark previews).

## Stories

Stories live in `src/components/stories`. Use realistic privacy-ops content (requests, subjects, regulations, consent), not placeholder text. Every new primitive or variant gets a story.
