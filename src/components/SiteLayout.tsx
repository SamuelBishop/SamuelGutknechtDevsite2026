import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { getRouteMeta } from '../content/routes'
import { Footer } from './Footer'
import { Header } from './Header'
import { TrailScene } from './TrailScene'

export function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const metadata = getRouteMeta(pathname)
    document.title = metadata.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', metadata.description)
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <TrailScene />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  )
}
