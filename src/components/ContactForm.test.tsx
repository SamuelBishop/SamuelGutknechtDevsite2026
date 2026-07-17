import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('renders accessible name, email, and message fields', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /send message/i }),
    ).toBeInTheDocument()
  })

  it('shows a fallback message when no access key is configured', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Name'), 'Trail Friend')
    await user.type(screen.getByLabelText('Email'), 'friend@example.com')
    await user.type(screen.getByLabelText('Message'), 'Hello from the ridge!')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByRole('status')).toHaveTextContent(/connected yet/i)
  })
})
