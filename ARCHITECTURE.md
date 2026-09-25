# Architecture

This app is a product shell. New screens plug into the contracts below. They do not rewrite the layout.

## Layers

1. **Brand tokens** — semantic CSS variables in [`src/styles/theme.css`](src/styles/theme.css). Change these to rebrand. Do not restyle primitives by overriding their class names.
2. **Primitives** — [`src/components/ui`](src/components/ui). Shared controls (button, dialog, sidebar, and the rest).
3. **Shell** — layout, providers, and route groups. [`src/main.tsx`](src/main.tsx) mounts theme, font, direction, React Query, and the router. [`AuthenticatedLayout`](src/components/layout/authenticated-layout.tsx) wraps signed-in routes. Route groups are `(auth)`, `_authenticated`, and `(errors)`.
4. **Patterns** — shared screen pieces such as [`src/components/data-table`](src/components/data-table), dialogs, and forms.
5. **Products** — screens in [`src/features`](src/features). Tasks, users, chats, and apps are sample products.

## Navigation

[`src/config/app.ts`](src/config/app.ts) owns teams, the current user, and `navGroups`. The sidebar and command menu only render that config.

To add a product:

1. Add a nav item in `appConfig.navGroups`.
2. Add a route file under `src/routes`.
3. Put the screen in `src/features/<name>`.

## Page recipe

Route files stay thin: `createFileRoute` plus the feature component. Search params may live on the route.

The feature screen uses [`Header`](src/components/layout/header.tsx) and [`Main`](src/components/layout/main.tsx). `Main` accepts `fixed` (fill the shell height) and `fluid` (full width). Feature state stays inside that feature folder.

## Import boundaries

- A feature does not import another feature.
- The shell (`src/components/layout`, providers, route groups) does not import feature internals.
- Features may import primitives, layout chrome (`Header`, `Main`), and patterns.
