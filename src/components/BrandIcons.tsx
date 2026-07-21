import type { LucideProps } from 'lucide-react'

export type BrandIconProps = Pick<LucideProps, 'size'> & {
  'aria-hidden'?: boolean
}

// Substack and Strava aren't part of lucide-react, so they're defined inline
// here and shared across the footer social links and the activity heatmaps.
export function SubstackIcon({ size = 18, ...rest }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...rest}
    >
      <path d="M3 4.5h18V7H3V4.5Zm0 4.25h18V11H3V8.75ZM3 13v6.5l9-3.75 9 3.75V13H3Z" />
    </svg>
  )
}

export function StravaIcon({ size = 18, ...rest }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...rest}
    >
      <path d="M9.9 2 4.2 13.2h3.4L9.9 8.6l2.3 4.6h3.4L9.9 2Zm4.7 11.2-1.7 3.3-1.6-3.3H7.9l3.6 7 3.6-7h-2.5Z" />
    </svg>
  )
}
