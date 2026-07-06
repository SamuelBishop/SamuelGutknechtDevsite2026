import type { ReactElement } from 'react'
import { AboutPage } from '../pages/AboutPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { ResumePage } from '../pages/ResumePage'
import { WorkPage } from '../pages/WorkPage'

export type RouteMeta = {
  title: string
  description: string
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
    title: 'Selected Work | Samuel Gutknecht',
    description: 'Selected product and engineering work from Samuel Gutknecht.',
    element: <WorkPage />,
    nav: { label: 'Work' },
  },
  {
    path: '/projects',
    title: 'Projects | Samuel Gutknecht',
    description: 'Side projects and practical experiments by Samuel Gutknecht.',
    element: <ProjectsPage />,
    nav: { label: 'Projects' },
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

export const navRoutes: NavRoute[] = routes.filter(
  (route): route is NavRoute => Boolean(route.nav),
)

export function getRouteMeta(pathname: string): RouteMeta {
  const match = routes.find((route) => route.path === pathname)
  return match ?? fallback ?? routes[0]
}
