import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="section-shell not-found">
      <p className="eyebrow">404 · Off route</p>
      <h1>This trail doesn’t go anywhere.</h1>
      <p>
        The page may have moved, or it may never have been here in the first
        place.
      </p>
      <Link className="text-link" to="/">
        <ArrowLeft aria-hidden="true" size={17} /> Back home
      </Link>
    </section>
  )
}
