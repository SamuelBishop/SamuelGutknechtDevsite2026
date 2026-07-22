import { ContactForm } from './ContactForm'

export function ContactCallout() {
  return (
    <aside className="contact-callout" aria-labelledby="contact-heading">
      <p className="eyebrow">Contact</p>
      <h2 id="contact-heading">Let’s talk.</h2>
      <div className="contact-callout-body">
        <p>
          Building something interesting? Chasing a weird idea? Want to talk
          software, running, or anything else you’re excited about? My inbox is
          open.
        </p>
        <ContactForm />
      </div>
    </aside>
  )
}
