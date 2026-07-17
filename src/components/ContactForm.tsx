import { useState, type FormEvent } from 'react'

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? ''
const ENDPOINT = 'https://api.web3forms.com/submit'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [feedback, setFeedback] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    if (!ACCESS_KEY) {
      setStatus('error')
      setFeedback(
        'The contact form isn’t connected yet. Please reach out through one of the links below in the meantime.',
      )
      return
    }

    const data = new FormData(form)
    data.append('access_key', ACCESS_KEY)
    data.append('subject', 'New message from your portfolio site')

    setStatus('submitting')
    setFeedback('')

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      const result = await response.json()

      if (result.success) {
        setStatus('success')
        setFeedback(
          'Thanks — your message is on its way. I’ll be in touch soon.',
        )
        form.reset()
      } else {
        setStatus('error')
        setFeedback(
          result.message ?? 'Something went wrong. Please try again in a bit.',
        )
      }
    } catch {
      setStatus('error')
      setFeedback('Something went wrong. Please try again in a bit.')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" rows={5} required />
      </div>

      {/* Honeypot: hidden from people, tempting to spam bots. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      <button
        className="contact-submit"
        type="submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>

      <p
        className={`form-status form-status-${status}`}
        role="status"
        aria-live="polite"
      >
        {feedback}
      </p>
    </form>
  )
}
