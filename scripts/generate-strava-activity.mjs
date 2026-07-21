#!/usr/bin/env node
/**
 * Build a committed calendar of the owner's Strava activity for the site's
 * "consistency" heatmap (parallel to the GitHub one).
 *
 * Strava requires OAuth, so this needs a one-time setup (see scripts/strava-auth.mjs)
 * producing a long-lived refresh token. At build time we exchange it for a
 * short-lived access token, pull ~the last year of activities, aggregate them
 * per day (active days coloured by daily distance), and write
 * src/content/strava-activity.generated.json.
 *
 * Usage:
 *   node scripts/generate-strava-activity.mjs
 *   pnpm generate:strava
 *
 * Required env (from .env locally / Vercel env vars in prod):
 *   STRAVA_CLIENT_ID
 *   STRAVA_CLIENT_SECRET
 *   STRAVA_REFRESH_TOKEN
 *
 * Resilient by design: if credentials are missing or any request fails, the
 * existing JSON is kept (or an empty calendar is written) so builds stay green.
 */

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildWeeks,
  isoDay,
  keepOrEmpty,
  loadDotEnv,
  writeCalendar,
} from './lib/activity.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_FILE = resolve(ROOT, 'src', 'content', 'strava-activity.generated.json')

loadDotEnv(ROOT)

const WINDOW_DAYS = 371 // ~53 weeks, matching the GitHub grid

function emptyPayload() {
  return {
    generatedAt: new Date().toISOString(),
    source: 'https://www.strava.com',
    label: 'Strava',
    metricLabel: 'active day',
    total: 0,
    totalLabel: 'No activities yet',
    weeks: [],
  }
}

/** Map a day's total distance (metres) to a 0..4 heat level. */
function levelForDistance(meters, activityCount) {
  if (activityCount === 0) return 0
  const km = meters / 1000
  if (km >= 18) return 4
  if (km >= 10) return 3
  if (km >= 5) return 2
  return 1 // any activity (incl. non-distance workouts) registers at least 1
}

async function refreshAccessToken(clientId, clientSecret, refreshToken) {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!res.ok || !data.access_token) {
    throw new Error(
      `Token refresh failed (${res.status}): ${data.message || 'unknown error'}`,
    )
  }
  return data.access_token
}

async function fetchActivities(accessToken, afterEpoch) {
  const activities = []
  for (let page = 1; page <= 20; page += 1) {
    const url =
      'https://www.strava.com/api/v3/athlete/activities?' +
      new URLSearchParams({
        after: String(afterEpoch),
        per_page: '200',
        page: String(page),
      }).toString()
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) {
      throw new Error(`Activities request failed (${res.status} ${res.statusText}).`)
    }
    const batch = await res.json()
    if (!Array.isArray(batch) || batch.length === 0) break
    activities.push(...batch)
    if (batch.length < 200) break
  }
  return activities
}

async function main() {
  const clientId = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    keepOrEmpty(
      OUT_FILE,
      emptyPayload(),
      'missing STRAVA_CLIENT_ID / STRAVA_CLIENT_SECRET / STRAVA_REFRESH_TOKEN',
    )
    return
  }

  try {
    console.log('Refreshing Strava access token…')
    const accessToken = await refreshAccessToken(clientId, clientSecret, refreshToken)

    const afterEpoch = Math.floor(Date.now() / 1000) - WINDOW_DAYS * 24 * 60 * 60
    console.log('Fetching Strava activities…')
    const activities = await fetchActivities(accessToken, afterEpoch)

    // Aggregate per calendar day (athlete-local date), summing distance/count.
    const perDay = {}
    for (const act of activities) {
      const local = act.start_date_local || act.start_date
      if (!local) continue
      const date = String(local).slice(0, 10)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue
      const entry = (perDay[date] ||= { meters: 0, count: 0 })
      entry.meters += Number(act.distance) || 0
      entry.count += 1
    }

    // Ensure the window's start day exists so the grid spans the full year even
    // when the earliest activity is recent.
    const startKey = isoDay(new Date(afterEpoch * 1000))
    if (!perDay[startKey]) perDay[startKey] = { meters: 0, count: 0 }

    const dayMap = {}
    let activeDays = 0
    let totalMeters = 0
    for (const [date, { meters, count }] of Object.entries(perDay)) {
      dayMap[date] = { level: levelForDistance(meters, count), count }
      if (count > 0) activeDays += 1
      totalMeters += meters
    }

    const weeks = buildWeeks(dayMap)
    const miles = Math.round(totalMeters / 1609.34)
    writeCalendar(OUT_FILE, {
      generatedAt: new Date().toISOString(),
      source: 'https://www.strava.com',
      label: 'Strava',
      metricLabel: 'active day',
      total: activeDays,
      totalLabel:
        `${activeDays.toLocaleString('en-US')} active days` +
        (miles > 0 ? ` · ${miles.toLocaleString('en-US')} mi` : '') +
        ' in the last year',
      weeks,
    })
    console.log(
      `Wrote ${activeDays} active day(s) from ${activities.length} activities to ${OUT_FILE}`,
    )
  } catch (err) {
    keepOrEmpty(
      OUT_FILE,
      emptyPayload(),
      err instanceof Error ? err.message : String(err),
    )
  }
}

main().catch((err) => {
  console.warn(String(err instanceof Error ? err.message : err))
  process.exit(0)
})
