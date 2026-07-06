import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { pageMetadata } from '../content/siteContent'
import { Footer } from './Footer'
import { Header } from './Header'

export function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const metadata = pageMetadata[pathname] ?? {
      title: 'Page not found — Samuel Gutknecht',
      description: 'The requested page could not be found.',
    }
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
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  )
}
