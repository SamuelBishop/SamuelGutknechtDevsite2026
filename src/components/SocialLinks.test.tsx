import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { socialLinks } from '../content/siteContent'
import { SocialLinks } from './SocialLinks'

describe('SocialLinks', () => {
  it('renders an accessible link for every configured platform', () => {
    render(<SocialLinks />)
    for (const link of socialLinks) {
      expect(screen.getByRole('link', { name: link.label })).toBeInTheDocument()
    }
  })

  it('opens external profiles safely and keeps email inline', () => {
    render(<SocialLinks />)

    const github = screen.getByRole('link', { name: 'GitHub' })
    expect(github).toHaveAttribute('target', '_blank')
    expect(github).toHaveAttribute('rel', 'noopener noreferrer')

    const email = screen.getByRole('link', { name: 'Email' })
    expect(email).not.toHaveAttribute('target')
    expect(email.getAttribute('href')).toMatch(/^mailto:/)
  })
})
