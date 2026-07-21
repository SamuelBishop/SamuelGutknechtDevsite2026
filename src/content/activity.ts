import githubGenerated from './github-activity.generated.json'
import stravaGenerated from './strava-activity.generated.json'

/** A single day cell in a contribution calendar. */
export type ActivityDay = {
  // ISO 'YYYY-MM-DD'.
  date: string
  // Heat level 0..4 (0 = none).
  level: number
  // Underlying metric count for the day (contributions, activities, …).
  count: number
}

/**
 * A year of activity, shaped identically for GitHub and Strava so a single
 * heatmap component can render either. Weeks are columns of 7 slots (Sun..Sat);
 * a null slot is grid padding for partial first/last weeks. Built at build time
 * by scripts/generate-github-activity.mjs and generate-strava-activity.mjs.
 */
export type ActivityCalendar = {
  generatedAt: string
  source: string
  // Platform name, e.g. "GitHub" | "Strava".
  label: string
  // Singular metric noun, e.g. "contribution" | "active day".
  metricLabel: string
  // Total metric over the window.
  total: number
  // Human-readable summary, e.g. "1,204 contributions in the last year".
  totalLabel: string
  weeks: (ActivityDay | null)[][]
}

export const githubActivity = githubGenerated as ActivityCalendar
export const stravaActivity = stravaGenerated as ActivityCalendar

/** True when a calendar has at least one real day to render. */
export function hasActivity(calendar: ActivityCalendar): boolean {
  return calendar.weeks.some((week) => week.some((day) => day !== null))
}
