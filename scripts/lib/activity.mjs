/**
 * Shared helpers for the activity-heatmap generators (GitHub + Strava).
 *
 * Both generators produce the same committed JSON shape so a single React
 * component can render either calendar:
 *
 *   {
 *     generatedAt: string,      // ISO timestamp of this build
 *     source: string,           // profile / API the data came from
 *     label: string,            // e.g. "GitHub" | "Strava"
 *     metricLabel: string,      // singular metric noun, e.g. "contribution"
 *     total: number,            // sum over the window
 *     totalLabel: string,       // human sentence, e.g. "1,204 contributions ..."
 *     weeks: (Day | null)[][],  // columns of 7 slots (Sun..Sat); null = padding
 *   }
 *
 * where Day = { date: 'YYYY-MM-DD', level: 0..4, count: number }.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const DAY_MS = 24 * 60 * 60 * 1000

/** Minimal .env loader (no dependency); applies keys not already in the env. */
export function loadDotEnv(rootDir) {
  const envPath = resolve(rootDir, '.env')
  let raw
  try {
    raw = readFileSync(envPath, 'utf8')
  } catch {
    return
  }
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key && !(key in process.env)) process.env[key] = value
  }
}

/** UTC 'YYYY-MM-DD' for a Date. */
export function isoDay(date) {
  return date.toISOString().slice(0, 10)
}

/** Parse a 'YYYY-MM-DD' string into a UTC Date at midnight. */
export function parseDay(str) {
  return new Date(`${str}T00:00:00.000Z`)
}

/**
 * Turn a flat map of `YYYY-MM-DD -> { level, count }` into calendar columns.
 * Columns are Sunday-anchored weeks; slots outside the data window are null so
 * partial first/last weeks stay grid-aligned.
 */
export function buildWeeks(dayMap) {
  const dates = Object.keys(dayMap).sort()
  if (dates.length === 0) return []
  const first = parseDay(dates[0])
  const last = parseDay(dates[dates.length - 1])

  // Back up to the Sunday of the first week, forward to Saturday of the last.
  const start = new Date(first.getTime() - first.getUTCDay() * DAY_MS)
  const end = new Date(last.getTime() + (6 - last.getUTCDay()) * DAY_MS)

  const weeks = []
  let week = new Array(7).fill(null)
  for (let t = start.getTime(); t <= end.getTime(); t += DAY_MS) {
    const date = new Date(t)
    const key = isoDay(date)
    const weekday = date.getUTCDay()
    const inWindow = date >= first && date <= last
    week[weekday] = inWindow
      ? {
          date: key,
          level: dayMap[key]?.level ?? 0,
          count: dayMap[key]?.count ?? 0,
        }
      : null
    if (weekday === 6) {
      weeks.push(week)
      week = new Array(7).fill(null)
    }
  }
  return weeks
}

/** Write the payload as pretty JSON with a trailing newline. */
export function writeCalendar(outFile, payload) {
  writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

/**
 * Resilient failure handler shared by both generators: keep the last-good JSON
 * if it exists, otherwise write an empty calendar so the build stays green.
 * Always resolves without throwing.
 */
export function keepOrEmpty(outFile, emptyPayload, reason) {
  console.warn(`Could not refresh activity data: ${reason}`)
  if (existsSync(outFile)) {
    console.warn(`Keeping the existing ${outFile}.`)
    return
  }
  console.warn('Writing an empty calendar so the build can proceed.')
  writeCalendar(outFile, emptyPayload)
}
