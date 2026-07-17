import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'
import { posts } from './content/posts'

function renderAt(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

describe('portfolio routes', () => {
  it.each([
    ['/', 'Building software consistently'],
    ['/about', 'Engineering with a wide lens'],
    ['/work', 'Complex products, made more understandable'],
    ['/projects', 'Built from curiosity, utility, or both'],
    ['/written-works', 'Ideas worth writing down'],
    ['/resume', 'Experience at a glance'],
  ])('renders %s', (route, heading) => {
    renderAt(route)
    expect(
      screen.getByRole('heading', { level: 1, name: new RegExp(heading) }),
    ).toBeInTheDocument()
  })

  it('renders a written work article by slug', () => {
    expect(posts.length).toBeGreaterThan(0)
    const post = posts[0]
    renderAt(`/written-works/${post.slug}`)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(escapeRegExp(post.title)),
      }),
    ).toBeInTheDocument()
  })

  it('shows a not-found message for an unknown written work', () => {
    renderAt('/written-works/definitely-not-a-real-post')
    expect(
      screen.getByRole('heading', { name: /that written work isn’t here/i }),
    ).toBeInTheDocument()
  })

  it('renders a not-found route', () => {
    renderAt('/missing')
    expect(
      screen.getByRole('heading', { name: /trail doesn’t go anywhere/i }),
    ).toBeInTheDocument()
  })

  it('marks the current navigation item', () => {
    renderAt('/work')
    const currentLinks = screen.getAllByRole('link', { name: 'Work' })
    expect(currentLinks.some((link) => link.classList.contains('active'))).toBe(
      true,
    )
  })

  it('opens and closes the mobile navigation dialog', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: /open navigation/i }))
    expect(
      screen.getByRole('dialog', { name: /navigation/i }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /close navigation/i }))
    expect(
      screen.queryByRole('dialog', { name: /navigation/i }),
    ).not.toBeInTheDocument()
  })
})
