import { ContactForm } from './ContactForm'

export function ContactCallout() {
  return (
    <aside className="contact-callout" aria-labelledby="contact-heading">
      <p className="eyebrow">Contact</p>
      <h2 id="contact-heading">Good conversations are welcome.</h2>
      <div className="contact-callout-body">
        <p>
          Interested in comparing notes on product engineering, complex
          interfaces, or the trails worth getting lost on? Send a note and it
          comes straight to my inbox.
        </p>
        <ContactForm />
      </div>
    </aside>
  )
}
