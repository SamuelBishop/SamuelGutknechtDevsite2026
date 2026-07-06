# CONTEXT.md — domain glossary

Shared vocabulary for this codebase. Architecture terms (module, interface, depth,
seam, adapter, leverage, locality) come from the `/codebase-design` skill; the terms
below name the domain-specific seams particular to this site.

## Route manifest

`src/content/routes.tsx` — the single source of truth for every page path on the site.
Each `RouteEntry` owns its `path`, SEO `title`/`description`, rendered `element`, and an
optional `nav` label. It is the seam three consumers read through:

- **`App.tsx`** maps entries into `<Route>` elements.
- **`SiteLayout`** reads the current entry's metadata (via `getRouteMeta`) to set the
  document title and description on navigation.
- **`Header`** renders the primary nav from `navRoutes` (entries flagged with `nav`).

Adding a page is a single manifest entry; the route table, `<title>`, meta description,
and nav link all follow from it. The `path: '*'` entry doubles as the not-found fallback,
so there is no separately maintained 404 metadata. Because the manifest is plain data,
its integrity ("every route has a title", "one catch-all") is unit-tested in
`src/content/routes.test.ts`.
