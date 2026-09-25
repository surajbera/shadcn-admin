# Architecture

This app is a product shell. New screens plug into the contracts below. They do not rewrite the layout.

## Layers

1. **Brand tokens**: semantic CSS variables in [`src/styles/theme.css`](src/styles/theme.css). These cover color, status text (`*-strong`), radius, elevation (`shadow-control/overlay/modal`), layers (`z-sticky/raised/overlay/toast`), motion (`duration-*`, `ease-*`), type roles (`text-title/heading/body/caption`) and layout spacing (`p-page`, `gap-section`...). Change these to rebrand. Do not restyle primitives by overriding their class names.
2. **Primitives**: [`src/components/ui`](src/components/ui). Shared controls (button, dialog, sidebar and the rest) plus layout primitives (`Stack`, `Inline`, `PageHeader`, `Section`, `EmptyState`). Product code imports each one from `@/components/ui/<name>`.
3. **Shell** — layout, providers, and route groups. [`src/main.tsx`](src/main.tsx) mounts theme, font, direction, React Query, and the router. [`AuthenticatedLayout`](src/components/layout/authenticated-layout.tsx) wraps signed-in routes. Route groups are `(auth)`, `_authenticated`, and `(errors)`.
4. **Patterns** — shared screen pieces such as [`src/components/data-table`](src/components/data-table), dialogs, and forms.
5. **Products** — screens in [`src/features`](src/features). [`requests`](src/features/requests) is the reference feature to copy (list, detail, create/edit, fake API behind React Query). Tasks, users, chats, and apps are template samples.

## Navigation

[`src/config/app.ts`](src/config/app.ts) owns teams, the current user, and `navGroups`. The sidebar and command menu only render that config.

To add a product:

1. Add a nav item in `appConfig.navGroups`.
2. Add a route file under `src/routes`.
3. Put the screen in `src/features/<name>`.

## Page recipe

Route files stay thin: `createFileRoute` plus the feature component. Search params may live on the route.

The feature screen uses [`Header`](src/components/layout/header.tsx) and [`Main`](src/components/layout/main.tsx). `Main` accepts `fixed` (fill the shell height) and `fluid` (full width). Feature state stays inside that feature folder.

## Design system guardrails

- The full rule set for people and agents is in [AGENTS.md](AGENTS.md).
- `npm run lint` rejects arbitrary visual values (`bg-[#fff]`, `rounded-[13px]`, `z-[60]`), raw palette colors (`text-red-500`), raw type sizes and weights (`text-2xl`, `font-bold`), padding on `Card`, and direct `@radix-ui/*` imports outside `src/components/ui`.
- The pre-commit hook runs Prettier and ESLint on staged files. CI (`.github/workflows/ci.yml`) runs lint, format, knip, build and tests on every push and pull request.
- `npm run storybook` has Theme and Direction toolbars plus the accessibility panel. Guidance lives under **Guide/** in Storybook.
- `npm run test:storybook` runs axe on every story in light and dark mode.
- `npm run test:visual` compares a screenshot of every story (light, dark, RTL). After an intended visual change, run `npm run test:visual -- --update-snapshots`.

## Import boundaries

- A feature does not import another feature.
- The shell (`src/components/layout`, providers, route groups) does not import feature internals.
- Features may import primitives, layout chrome (`Header`, `Main`), and patterns.
