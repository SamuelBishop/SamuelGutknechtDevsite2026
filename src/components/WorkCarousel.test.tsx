import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { WorkItem } from '../content/siteContent'
import { WorkCarousel } from './WorkCarousel'

const items: WorkItem[] = [
  {
    title: 'Video Work',
    kind: 'AI UX',
    context: 'A short summary of the video-backed work item.',
    contribution: 'Longer detail not shown in the carousel.',
    focusAreas: ['One', 'Two'],
    video: {
      src: '/videos/example.mp4',
      poster: '/videos/example-poster.jpg',
      title: 'Poster describing the video work.',
    },
  },
  {
    title: 'Image Work',
    kind: 'Front-end',
    context: 'A short summary of the image-backed work item.',
    contribution: 'Longer detail not shown in the carousel.',
    focusAreas: ['Three'],
    image: { src: '/photos/example.png', alt: 'Example project screenshot.' },
  },
]

function renderCarousel() {
  return render(
    <MemoryRouter>
      <WorkCarousel items={items} label="Selected work" />
    </MemoryRouter>,
  )
}

describe('WorkCarousel', () => {
  it('shows the first slide with its image (falling back to the video poster) and links to /work', () => {
    renderCarousel()

    const image = screen.getByRole('img', {
      name: 'Poster describing the video work.',
    })
    expect(image).toHaveAttribute('src', '/videos/example-poster.jpg')

    expect(
      screen.getByText('A short summary of the video-backed work item.'),
    ).toBeInTheDocument()

    const slide = screen.getByRole('link', {
      name: /Video Work — view in Work/,
    })
    expect(slide).toHaveAttribute('href', '/work')
  })

  it('advances to the next slide when Next is pressed', async () => {
    const user = userEvent.setup()
    renderCarousel()

    await user.click(screen.getByRole('button', { name: /show next work/i }))

    expect(
      screen.getByRole('img', { name: 'Example project screenshot.' }),
    ).toHaveAttribute('src', '/photos/example.png')
    expect(
      screen.getByRole('link', { name: /Image Work — view in Work/ }),
    ).toHaveAttribute('href', '/work')
  })

  it('wraps around to the last slide when Previous is pressed from the first', async () => {
    const user = userEvent.setup()
    renderCarousel()

    await user.click(
      screen.getByRole('button', { name: /show previous work/i }),
    )

    expect(
      screen.getByRole('img', { name: 'Example project screenshot.' }),
    ).toBeInTheDocument()
  })

  it('renders one navigation dot per item', () => {
    renderCarousel()
    for (const item of items) {
      expect(
        screen.getByRole('button', { name: `Show ${item.title}` }),
      ).toBeInTheDocument()
    }
  })
})
