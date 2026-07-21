import { Github } from 'lucide-react'
import { githubActivity, stravaActivity } from '../content/activity'
import { socialLinks } from '../content/siteContent'
import { StravaIcon } from './BrandIcons'
import { ContributionHeatmap } from './ContributionHeatmap'

function hrefFor(platform: string, fallback: string): string {
  const link = socialLinks.find((social) => social.platform === platform)
  return link && link.href !== '#' ? link.href : fallback
}

export function ConsistencyBand() {
  return (
    <section className="activity-band" aria-labelledby="consistency-heading">
      <div className="section-shell">
        <div className="activity-intro">
          <p className="eyebrow">Consistency &amp; commitment</p>
          <h2 id="consistency-heading">
            Showing up, on the keyboard and the trail.
          </h2>
          <p>
            A year of daily habits — commits shipped and miles logged. Steady
            reps are how both good software and long distances get built.
          </p>
        </div>
        <div className="activity-grid-wrap">
          <ContributionHeatmap
            calendar={githubActivity}
            icon={Github}
            href={hrefFor('github', githubActivity.source)}
          />
          <ContributionHeatmap
            calendar={stravaActivity}
            icon={StravaIcon}
            href={hrefFor('strava', stravaActivity.source)}
          />
        </div>
      </div>
    </section>
  )
}
