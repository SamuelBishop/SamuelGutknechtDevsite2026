import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { navRoutes } from '../content/routes'

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return navRoutes.map((route) => (
    <NavLink
      key={route.path}
      to={route.path}
      end={route.path === '/'}
      onClick={onNavigate}
      className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
    >
      {route.nav.label}
    </NavLink>
  ))
}

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink
          className="site-name"
          to="/"
          aria-label="Samuel Gutknecht, home"
        >
          <span className="wordmark">Samuel Gutknecht</span>
        </NavLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <NavLinks />
        </nav>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              className="menu-button"
              type="button"
              aria-label="Open navigation"
            >
              <Menu aria-hidden="true" size={20} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="menu-overlay" />
            <Dialog.Content className="menu-panel" aria-describedby={undefined}>
              <div className="menu-heading">
                <Dialog.Title>Navigation</Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="menu-button"
                    aria-label="Close navigation"
                  >
                    <X aria-hidden="true" size={20} />
                  </button>
                </Dialog.Close>
              </div>
              <nav className="mobile-nav" aria-label="Mobile navigation">
                <NavLinks onNavigate={() => setOpen(false)} />
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  )
}
