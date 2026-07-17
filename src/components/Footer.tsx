import { SocialLinks } from './SocialLinks'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-copy">
          <p>Built with care and an eye toward the long trail.</p>
          <p>© {new Date().getFullYear()} Samuel Gutknecht</p>
        </div>
        <SocialLinks className="footer-social" />
      </div>
    </footer>
  )
}
