import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'
import { posts } from './content/posts'
import { projectItems, workItems } from './content/siteContent'

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
    ['/', 'So I usually do'],
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

  it('renders verified resume highlights without dropping skills', () => {
    renderAt('/resume')
    expect(screen.getByRole('heading', { name: /garmin/i })).toBeInTheDocument()
    expect(screen.getByText(/graduated cum laude/i)).toBeInTheDocument()
    expect(screen.getByText('AI agent development')).toBeInTheDocument()
    expect(screen.getByText('C++')).toBeInTheDocument()
    expect(screen.getByText('Agent evaluations')).toBeInTheDocument()
    expect(screen.getByText('Computer architecture')).toBeInTheDocument()
    expect(screen.getByText('Microprocessor systems')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /download resume pdf/i }),
    ).toHaveAttribute('download')
  })

  it('presents selected work with quiet image slots and no status chips', () => {
    renderAt('/work')
    expect(
      screen.getByRole('heading', {
        name: /modern rich text editor experience/i,
      }),
    ).toBeInTheDocument()
    expect(screen.queryAllByText(/project image forthcoming/i)).toHaveLength(
      workItems.filter((item) => !item.image && !item.video).length,
    )
    expect(
      screen.getByRole('img', {
        name: /modern rich text editor with a full formatting toolbar/i,
      }),
    ).toBeInTheDocument()
    const serviceVideo = document.querySelector('.has-video video')
    expect(serviceVideo).not.toBeNull()
    expect(serviceVideo).toHaveAttribute(
      'src',
      '/videos/service-agent-launch.mp4',
    )
    expect(
      screen.getByRole('link', { name: /launch announcement — rushil vora/i }),
    ).toHaveAttribute(
      'href',
      expect.stringContaining('linkedin.com/posts/rushilvora'),
    )
    expect(
      screen.getByRole('link', {
        name: /customer service integration — alan ross/i,
      }),
    ).toHaveAttribute(
      'href',
      expect.stringContaining('linkedin.com/posts/alandross'),
    )
    expect(
      screen.queryByText(/case study in progress/i),
    ).not.toBeInTheDocument()
  })

  it('uses real photography across the portfolio story', () => {
    renderAt('/')
    expect(
      screen.getByRole('img', {
        name: /samuel visiting the microsoft campus/i,
      }),
    ).toHaveAttribute('src', '/photos/microsoft-campus.jpg')
    expect(
      screen.getByRole('img', { name: /trail running through a field/i }),
    ).toBeInTheDocument()
  })

  it('surfaces the consistency band with a GitHub contribution heatmap', () => {
    renderAt('/')
    expect(
      screen.getByRole('heading', {
        name: /showing up, on the keyboard and the trail/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /GitHub activity heatmap/i }),
    ).toBeInTheDocument()
  })

  it('shows selected work as a carousel that links into the Work page', () => {
    renderAt('/')
    const firstItem = workItems[0]
    const slide = screen.getByRole('link', {
      name: new RegExp(
        `${escapeRegExp(firstItem.title)} — View in Professional Work`,
      ),
    })
    expect(slide).toHaveAttribute('href', '/work')
    expect(
      screen.getByRole('button', { name: /show next work/i }),
    ).toBeInTheDocument()
  })

  it('includes personal projects in the home carousel linking to Personal Projects', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const project = projectItems[0]
    const dot = screen.getByRole('button', { name: `Show ${project.title}` })
    await user.click(dot)
    const slide = screen.getByRole('link', {
      name: new RegExp(
        `${escapeRegExp(project.title)} — View in Personal Projects`,
      ),
    })
    expect(slide).toHaveAttribute('href', '/projects')
  })

  it('presents the personal story as an accessible carousel', async () => {
    const user = userEvent.setup()
    renderAt('/about')

    expect(
      screen.getByRole('region', { name: /life beyond work/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /graduation day/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show next photo/i }))
    expect(
      screen.getByRole('heading', { name: /an engineering foundation/i }),
    ).toBeInTheDocument()
  })

  it('features the custom numpad PCB as a real project', () => {
    renderAt('/projects')
    expect(
      screen.getByRole('heading', {
        name: /hot-swappable numpad, built from the circuit up/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /hot-swappable numpad keyboard pcb/i }),
    ).toBeInTheDocument()
  })

  it('marks the current navigation item', () => {
    renderAt('/work')
    const currentLinks = screen.getAllByRole('link', { name: 'Career' })
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
