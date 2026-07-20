# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. Keep it
current: if you change how the project is built, tested, or structured, update
this file in the same change.

## What this is

The personal portfolio site for Samuel Gutknecht — a senior software engineer and
ultrarunner. Single-page marketing/portfolio site, no backend.

**Stack:** React 19 · TypeScript · Vite · React Router 7 · Tailwind CSS 3 ·
framer-motion. Tested with Vitest + Testing Library and Playwright. Package
manager is **pnpm** (pinned via `packageManager` in `package.json`).

## Setup

```bash
pnpm install
pnpm dev          # Vite dev server (defaults to http://localhost:5173, next free port otherwise)
```

## Commands you should run

Run these from the repo root. All are defined in `package.json`.

| Task                 | Command                                                                 | Notes                                                                               |
| -------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Dev server           | `pnpm dev`                                                              | Hot-reload; open the printed URL.                                                   |
| Type-check           | `pnpm typecheck`                                                        | `tsc -b`. Must be clean before committing.                                          |
| Lint                 | `pnpm lint`                                                             | `eslint .`. Must pass.                                                              |
| Format check         | `pnpm format`                                                           | Prettier in check mode.                                                             |
| Auto-format          | `pnpm format:write`                                                     | Apply Prettier fixes.                                                               |
| Unit tests           | `pnpm test`                                                             | `vitest run`. Must be green before committing.                                      |
| E2E tests            | `pnpm test:e2e`                                                         | Playwright. Needs a dev/preview server + browsers (`pnpm exec playwright install`). |
| Production build     | `pnpm build`                                                            | `tsc -b && vite build`.                                                             |
| Generate image asset | `pnpm generate:asset -- --prompt "..." --output public/assets/name.png` | Add repeatable `--reference` paths for image editing.                               |

**Before you commit or open a PR:** `pnpm typecheck`, `pnpm lint`, and `pnpm test`
must all pass. Add or update tests for code you change, even if not asked.

## Project layout

```
src/
  main.tsx              App entry; mounts <App> in <BrowserRouter>.
  App.tsx               Route table (maps the route manifest) + page transitions.
  styles.css            All styling: design tokens, component styles, animations.
  components/           Presentational + layout building blocks (Header, Footer,
                        SiteLayout, WorkCard, SectionIntro, ContactCallout).
  pages/                One component per route (Home, About, Work, Projects,
                        Resume, NotFound).
  content/
    routes.tsx          Route manifest — see below. Single source of truth for paths.
    siteContent.ts      Site copy/data (work items, skills).
  App.test.tsx          Route-level integration tests.
  content/routes.test.ts Manifest integrity tests.
  test/setup.ts         Vitest setup.
scripts/
  generate-asset.mjs    OpenAI text-to-image and reference-image generator.
```

There are no `hooks/`, `utils/`, or `lib/` folders yet — add them only when a real
need appears, not preemptively.

## Key architectural convention: the route manifest

`src/content/routes.tsx` is the **single source of truth for every page path**. Each
`RouteEntry` owns its `path`, `title`, `description`, `element`, and optional `nav`
label. Three consumers read through it:

- `App.tsx` maps entries into `<Route>` elements.
- `SiteLayout` reads the active entry's metadata via `getRouteMeta()` to set the
  document `<title>` and meta description.
- `Header` renders the primary nav from `navRoutes` (entries flagged with `nav`).

**To add or change a page, edit the manifest — not four separate files.** The
`path: '*'` entry is also the not-found fallback. See `CONTEXT.md` for the full
description of this seam.

## Code style

- Prettier enforces: **no semicolons**, **single quotes**, **trailing commas
  everywhere**. Run `pnpm format:write` rather than hand-formatting.
- TypeScript is strict. Prefer explicit types on exported/module boundaries; let
  inference handle locals.
- Components are function components with typed props. Keep prop interfaces
  narrow — an unused prop is a bug, not decoration.
- Styling is global CSS in `src/styles.css` using semantic class names and CSS
  custom properties (design tokens in `:root`). Don't hardcode hex colors in
  components; use the tokens. Tailwind is available but the site leans on
  `styles.css`.
- Animations must respect `prefers-reduced-motion`; scroll-driven effects are
  additionally guarded with `@supports (animation-timeline: view())`.

## Testing conventions

- **Unit/integration:** Vitest + Testing Library (jsdom). Test behavior and
  content through the rendered output, and test plain-data modules (like the route
  manifest) directly as functions.
- **E2E/visual:** Playwright (`playwright.config.ts`).
- Keep the suite green. If a test is failing for an unrelated reason (e.g. a
  missing dependency), fix the root cause rather than skipping.

## Related docs

- `CONTEXT.md` — domain/architecture glossary (start here for vocabulary).
- `docs/DESIGN_BRIEF.md` — visual direction and palette.
- `docs/CONTENT.md` — draft copy; replace TODOs before launch.
- `docs/SITEMAP.md` — page structure.
- `docs/BUILD_PLAN.md` — build/roadmap notes.
- `.github/skills/` — GitHub Copilot app skills (`cap`, `generate-asset`).
- `.skills/` — additional repo agent guidance (frontend-design, de-ai-copy,
  improve-codebase-architecture).

## Pull requests

- Keep changes surgical and scoped; don't fix unrelated issues in the same PR.
- Ensure `pnpm typecheck`, `pnpm lint`, and `pnpm test` all pass.
- Suggested PR title format: `[area] Short description` (e.g.
  `[content] Update home hero copy`).
