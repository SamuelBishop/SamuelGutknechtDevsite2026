import {
  Github,
  Instagram,
  Linkedin,
  Mail,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'
import {
  socialLinks,
  type SocialLink,
  type SocialPlatform,
} from '../content/siteContent'
import { StravaIcon, SubstackIcon } from './BrandIcons'

type IconProps = Pick<LucideProps, 'size'> & { 'aria-hidden'?: boolean }
type IconComponent = ComponentType<IconProps>

const iconByPlatform: Record<SocialPlatform, IconComponent> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  substack: SubstackIcon,
  strava: StravaIcon,
  email: Mail,
}

function isExternal(link: SocialLink) {
  return link.platform !== 'email'
}

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={className ? `social-links ${className}` : 'social-links'}>
      {socialLinks.map((link) => {
        const Icon = iconByPlatform[link.platform]
        const external = isExternal(link)

        return (
          <li key={link.platform}>
            <a
              className="social-link"
              href={link.href}
              aria-label={link.label}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <Icon size={18} aria-hidden={true} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
