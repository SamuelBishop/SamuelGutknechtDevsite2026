# Build Plan

Do not select framework, hosting, analytics, or content-management tools until the implementation requirements justify them. Prefer the simplest approach that supports the sitemap, content, accessibility, and maintainability needs.

## Tech stack

| Layer                   | Choice                                          |
| ----------------------- | ----------------------------------------------- |
| Language                | TypeScript                                      |
| UI library              | React                                           |
| Build tool / dev server | Vite                                            |
| Routing                 | React Router v7                                 |
| Styling                 | Tailwind CSS                                    |
| Component primitives    | shadcn/ui (Radix UI)                            |
| Animation               | Framer Motion (reduced-motion support required) |
| Testing                 | Vitest (unit); Playwright (visual / E2E)        |
| Deployment              | Vercel                                          |

## Phase 1: Static content and page structure

### Work

- Establish shared page structure and navigation for Home, About, Work, Projects, and Resume.
- Add semantic content sections based on `SITEMAP.md` and `CONTENT.md`.
- Create shared header, footer, section introduction, and contact call-to-action structures.
- Keep optional work/project detail routes out of scope unless content is ready.
- Identify and resolve launch-blocking TODOs; retain clearly labeled placeholders only during development.

### Acceptance criteria

- All five primary routes exist and are reachable through consistent navigation.
- Each page has one clear purpose, a unique title, and a logical heading hierarchy.
- Content is readable without styling or client-side behavior.
- No confidential details, invented metrics, dead links, or fabricated projects appear.
- Shared content is not unnecessarily duplicated between pages.

## Phase 2: Styling and responsive layout

### Work

- Define typography, spacing, color, content widths, and interaction-state foundations from `DESIGN_BRIEF.md`.
- Build responsive page compositions for small mobile, tablet, and desktop widths.
- Add approved imagery with intentional cropping and alternative text.
- Add only restrained, nonessential motion with reduced-motion support.

### Acceptance criteria

- The site feels warm, professional, calm, and visually consistent.
- Pages remain readable and free of horizontal overflow at common viewport sizes.
- Navigation and primary actions work comfortably with mouse, keyboard, and touch.
- Text contrast, focus indicators, reading widths, and touch targets meet accessibility expectations.
- Layouts tolerate long headings, missing optional media, and realistic content variation.

## Phase 3: Work/project cards and resume integration

### Work

- Build reusable work and project cards from the approved content fields.
- Add focus-area labels only when they improve scanning.
- Add detail pages only for items with enough approved content.
- Integrate the current resume PDF and an accessible, scannable web version.
- Verify all repository, demo, social, contact, and download links.

### Acceptance criteria

- Cards clearly distinguish professional work from personal projects.
- Every published item has factual copy, an explicit status where useful, and a valid destination or no implied link.
- Card interaction works with keyboard, touch, and pointer input.
- The web resume and PDF agree on roles, dates, and core facts.
- The resume download is clearly labeled and functional.

## Phase 4: Polish, accessibility, SEO, and deployment prep

### Work

- Review copy for accuracy, tone, confidentiality, spelling, and unresolved TODOs.
- Test keyboard navigation, focus order, landmarks, labels, alternative text, contrast, zoom, and reduced motion.
- Add page titles, descriptions, canonical metadata, social preview metadata, favicon/app icons, and structured data only where accurate.
- Check performance and optimize media without compromising quality.
- Add a not-found page and verify production route behavior.
- Prepare deployment configuration and a short release checklist after the platform is chosen.

### Acceptance criteria

- No launch-blocking TODOs, placeholder copy, broken links, console errors, or missing assets remain.
- Core flows pass keyboard and automated accessibility checks, followed by manual review.
- Every public page has accurate title and description metadata.
- Social previews use an approved image and copy.
- Production builds and routes load correctly, including direct navigation and the not-found case.
- The deployed site is usable on current mobile and desktop browsers.

## Visual inspection with Playwright

Once pages are implemented and runnable locally, use Playwright to capture full-page screenshots at representative widths, including at minimum:

- Desktop: approximately 1440 px wide
- Mobile: approximately 390 px wide

Inspect Home, About, Work, Projects, and Resume at both sizes. Compare screenshots for hierarchy, spacing, line length, clipping, overflow, image treatment, card consistency, and navigation behavior. Also capture focused and open-menu states where relevant. Fix visible issues and repeat the screenshots; do not treat the first capture as final approval.

<!-- TODO: Add the local start command, base URL, and exact screenshot paths after the implementation approach is selected. -->
