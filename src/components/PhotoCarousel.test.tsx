import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { PhotoCarousel, type PhotoStoryItem } from './PhotoCarousel'

const items: [PhotoStoryItem, ...PhotoStoryItem[]] = [
  {
    src: '/first.jpg',
    alt: 'First moment',
    title: 'First story',
    description: 'The first description.',
  },
  {
    src: '/second.jpg',
    alt: 'Second moment',
    title: 'Second story',
    description: 'The second description.',
    fit: 'contain',
  },
]

describe('PhotoCarousel', () => {
  it('moves through photos with controls and wraps around', async () => {
    const user = userEvent.setup()
    render(<PhotoCarousel items={items} label="Personal moments" />)

    expect(
      screen.getByRole('img', { name: 'First moment' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show next photo/i }))
    expect(
      screen.getByRole('img', { name: 'Second moment' }),
    ).toBeInTheDocument()
    const frame = screen
      .getByRole('img', { name: 'Second moment' })
      .closest('.photo-carousel-frame')
    expect(frame).not.toBeNull()
    expect(frame).toHaveAttribute('data-fit', 'contain')

    await user.click(screen.getByRole('button', { name: /show next photo/i }))
    expect(
      screen.getByRole('img', { name: 'First moment' }),
    ).toBeInTheDocument()
  })

  it('supports arrow-key navigation from the carousel region', async () => {
    const user = userEvent.setup()
    render(<PhotoCarousel items={items} label="Personal moments" />)

    const carousel = screen.getByRole('region', { name: 'Personal moments' })
    carousel.focus()
    await user.keyboard('{ArrowLeft}')

    expect(
      screen.getByRole('img', { name: 'Second moment' }),
    ).toBeInTheDocument()
  })
})
