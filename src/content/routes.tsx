import type { ReactElement } from 'react'
import { AboutPage } from '../pages/AboutPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { ResumePage } from '../pages/ResumePage'
import { WorkPage } from '../pages/WorkPage'
import { WrittenWorkPage } from '../pages/WrittenWorkPage'
import { WrittenWorksPage } from '../pages/WrittenWorksPage'

export type RouteMeta = {
  title: string
  description: string
  // When true the page sets its own document title/description (dynamic route),
  // so SiteLayout should not overwrite it from the manifest.
  dynamic?: boolean
}

export type RouteEntry = RouteMeta & {
  path: string
  element: ReactElement
  // Present when the page appears in the primary nav. Array order = nav order.
  nav?: { label: string }
}

export type NavRoute = RouteEntry & { nav: { label: string } }

export const routes: RouteEntry[] = [
  {
    path: '/',
    title: 'Samuel Gutknecht | Software Engineer',
    description:
      'Senior software engineer building clear, reliable product experiences.',
    element: <HomePage />,
    nav: { label: 'Home' },
  },
  {
    path: '/about',
    title: 'About | Samuel Gutknecht',
    description:
      'A little about how Samuel works and what matters beyond the screen.',
    element: <AboutPage />,
    nav: { label: 'About' },
  },
  {
    path: '/work',
    title: 'Professional Work | Samuel Gutknecht',
    description: 'Selected product and engineering work from Samuel Gutknecht.',
    element: <WorkPage />,
    nav: { label: 'Career' },
  },
  {
    path: '/projects',
    title: 'Personal Projects | Samuel Gutknecht',
    description: 'Side projects and practical experiments by Samuel Gutknecht.',
    element: <ProjectsPage />,
    nav: { label: 'Projects' },
  },
  {
    path: '/written-works',
    title: 'Written Works | Samuel Gutknecht',
    description:
      'Essays and ideas by Samuel Gutknecht on engineering, trail running, and the space between.',
    element: <WrittenWorksPage />,
    nav: { label: 'Written Works' },
  },
  {
    path: '/written-works/:slug',
    title: 'Written Works | Samuel Gutknecht',
    description:
      'Essays and ideas by Samuel Gutknecht on engineering, trail running, and the space between.',
    element: <WrittenWorkPage />,
  },
  {
    path: '/resume',
    title: 'Resume | Samuel Gutknecht',
    description: 'Experience, skills, and education for Samuel Gutknecht.',
    element: <ResumePage />,
    nav: { label: 'Resume' },
  },
  {
    path: '*',
    title: 'Page not found | Samuel Gutknecht',
    description: 'The requested page could not be found.',
    element: <NotFoundPage />,
  },
]

const fallback = routes.find((route) => route.path === '*')

const ARTICLE_PREFIX = '/written-works/'

export const navRoutes: NavRoute[] = routes.filter((route): route is NavRoute =>
  Boolean(route.nav),
)

export function getRouteMeta(pathname: string): RouteMeta {
  const match = routes.find((route) => route.path === pathname)
  if (match) return match
  // Article pages (/written-works/:slug) set their own title/description.
  if (
    pathname.startsWith(ARTICLE_PREFIX) &&
    pathname.length > ARTICLE_PREFIX.length
  ) {
    const base = routes.find((route) => route.path === '/written-works/:slug')
    if (base) {
      return { title: base.title, description: base.description, dynamic: true }
    }
  }
  return fallback ?? routes[0]
}
