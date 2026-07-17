import { describe, expect, it } from 'vitest'
import { getRouteMeta, navRoutes, routes } from './routes'

describe('route manifest', () => {
  it('gives every route a non-empty title and description', () => {
    for (const route of routes) {
      expect(route.title.trim().length).toBeGreaterThan(0)
      expect(route.description.trim().length).toBeGreaterThan(0)
    }
  })

  it('has exactly one catch-all fallback', () => {
    const fallbacks = routes.filter((route) => route.path === '*')
    expect(fallbacks).toHaveLength(1)
  })

  it('exposes only nav-flagged routes to the header, each with a label', () => {
    expect(navRoutes.length).toBeGreaterThan(0)
    for (const route of navRoutes) {
      expect(route.path).not.toBe('*')
      expect(route.nav.label.trim().length).toBeGreaterThan(0)
    }
  })

  it('resolves metadata for a known path and falls back for an unknown one', () => {
    expect(getRouteMeta('/about').title).toBe('About | Samuel Gutknecht')
    expect(getRouteMeta('/does-not-exist').title).toBe(
      'Page not found | Samuel Gutknecht',
    )
  })

  it('serves a static title for the written works index', () => {
    const meta = getRouteMeta('/written-works')
    expect(meta.dynamic).toBeFalsy()
    expect(meta.title).toContain('Written Works')
  })

  it('flags article pages as dynamic so the page owns its title', () => {
    expect(getRouteMeta('/written-works/some-post').dynamic).toBe(true)
  })

  it('exposes Written Works in the primary nav', () => {
    expect(navRoutes.some((route) => route.nav.label === 'Written Works')).toBe(
      true,
    )
  })
})
