import { useMemo, type ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import {
  hasActivity,
  type ActivityCalendar,
  type ActivityDay,
} from '../content/activity'

type IconComponent = ComponentType<
  Pick<LucideProps, 'size'> & { 'aria-hidden'?: boolean }
>

type Props = {
  calendar: ActivityCalendar
  icon: IconComponent
  // Link to the underlying profile (GitHub/Strava).
  href: string
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const LEVELS = [0, 1, 2, 3, 4] as const

/** Long-form date for the per-cell tooltip, e.g. "July 21, 2026". */
function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00.000Z`)
  if (Number.isNaN(date.valueOf())) return iso
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** A month abbreviation per week column, blank unless the month changes.
 *  Two guards keep adjacent month names (e.g. Jul/Aug at a boundary) from
 *  overlapping: the leading column is only labeled when the window actually
 *  starts near the month's beginning (otherwise it's a trailing sliver we skip
 *  in favor of the first full month), and any label closer than MIN_LABEL_GAP
 *  columns to the previous one is suppressed. */
function monthLabels(weeks: (ActivityDay | null)[][]): string[] {
  const MIN_LABEL_GAP = 3
  let lastMonth = -1
  let lastLabeledIndex = -Infinity
  return weeks.map((week, index) => {
    const firstDay = week.find((day): day is ActivityDay => day !== null)
    if (!firstDay) return ''
    const date = new Date(`${firstDay.date}T00:00:00.000Z`)
    const month = date.getUTCMonth()
    if (month === lastMonth) return ''
    lastMonth = month
    // Skip a partial leading month (a trailing sliver) so the first full month
    // becomes the first label instead of crowding it.
    if (index === 0 && date.getUTCDate() > 7) return ''
    if (index - lastLabeledIndex < MIN_LABEL_GAP) return ''
    lastLabeledIndex = index
    return MONTHS[month]
  })
}

export function ContributionHeatmap({ calendar, icon: Icon, href }: Props) {
  const months = useMemo(() => monthLabels(calendar.weeks), [calendar.weeks])
  const present = hasActivity(calendar)
  // Per-day noun differs from the summary metric (Strava counts activities).
  const dayNoun = calendar.label === 'Strava' ? 'activity' : 'contribution'
  const dayNounPlural =
    calendar.label === 'Strava' ? 'activities' : 'contributions'

  function tooltip(day: ActivityDay): string {
    const when = formatDate(day.date)
    if (day.count <= 0) return `No ${dayNounPlural} on ${when}`
    const noun = day.count === 1 ? dayNoun : dayNounPlural
    return `${day.count.toLocaleString('en-US')} ${noun} on ${when}`
  }

  return (
    <figure className="activity-card">
      <figcaption className="activity-card-head">
        <a
          className="activity-card-title"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon size={18} aria-hidden={true} />
          <span>{calendar.label}</span>
        </a>
        <p className="activity-total">{calendar.totalLabel}</p>
      </figcaption>

      {present ? (
        <div className="activity-scroll">
          <div className="activity-graph">
            <div className="activity-months" aria-hidden="true">
              {months.map((label, i) => (
                <span key={i} className="activity-month">
                  {label}
                </span>
              ))}
            </div>
            <div
              className="activity-grid"
              role="img"
              aria-label={`${calendar.label} activity heatmap: ${calendar.totalLabel}`}
            >
              {calendar.weeks.map((week, wi) => (
                <div className="activity-week" key={wi}>
                  {week.map((day, di) => (
                    <span
                      key={di}
                      className="activity-cell"
                      data-level={day ? day.level : 'none'}
                      title={day ? tooltip(day) : undefined}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="activity-legend" aria-hidden="true">
              <span>Less</span>
              {LEVELS.map((level) => (
                <span
                  key={level}
                  className="activity-cell"
                  data-level={level}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="activity-empty">
          Syncing soon — the first {dayNounPlural} will appear here
          automatically.
        </p>
      )}
    </figure>
  )
}
