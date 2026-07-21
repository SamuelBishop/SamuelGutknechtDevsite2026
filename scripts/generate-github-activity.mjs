#!/usr/bin/env node
/**
 * Build a committed calendar of the owner's GitHub contributions for the site's
 * "consistency" heatmap.
 *
 * Credential-free: GitHub exposes the public contribution calendar as an HTML
 * fragment at https://github.com/users/<user>/contributions. We parse the
 * per-day cells (data-date + data-level) and the matching <tool-tip> counts,
 * then write src/content/github-activity.generated.json.
 *
 * Usage:
 *   node scripts/generate-github-activity.mjs
 *   pnpm generate:github
 *
 * Options (env):
 *   GITHUB_USERNAME   Profile to read. Default: SamuelBishop
 *
 * Resilient by design: on any network/parse failure the existing JSON is kept
 * (or an empty calendar is written on first run) so builds stay green.
 */

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildWeeks,
  keepOrEmpty,
  loadDotEnv,
  writeCalendar,
} from './lib/activity.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_FILE = resolve(ROOT, 'src', 'content', 'github-activity.generated.json')

loadDotEnv(ROOT)

const DEFAULT_USER = 'SamuelBishop'

function emptyPayload(user) {
  return {
    generatedAt: new Date().toISOString(),
    source: `https://github.com/${user}`,
    label: 'GitHub',
    metricLabel: 'contribution',
    total: 0,
    totalLabel: 'No contributions yet',
    weeks: [],
  }
}

/** Extract the leading integer from a tooltip like "3 contributions on ...". */
function countFromTooltip(text) {
  if (!text) return 0
  const match = text.trim().match(/^([\d,]+)\s+contribution/i)
  return match ? Number.parseInt(match[1].replace(/,/g, ''), 10) : 0
}

/**
 * Parse the contributions HTML fragment into a `date -> { level, count }` map.
 * Cells carry data-date/data-level/id; a separate <tool-tip for="<id>"> holds
 * the exact count, so we join the two by cell id.
 */
function parseContributions(html) {
  const tooltipById = new Map()
  const tooltipRe = /<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g
  for (let m; (m = tooltipRe.exec(html)); ) {
    tooltipById.set(m[1], countFromTooltip(m[2]))
  }

  const dayMap = {}
  const cellRe = /<td\b[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g
  for (let m; (m = cellRe.exec(html)); ) {
    const tag = m[0]
    const date = tag.match(/\bdata-date="([0-9-]+)"/)?.[1]
    if (!date) continue
    const level = Number.parseInt(tag.match(/\bdata-level="(\d+)"/)?.[1] ?? '0', 10)
    const id = tag.match(/\bid="([^"]+)"/)?.[1]
    const count = id && tooltipById.has(id) ? tooltipById.get(id) : 0
    dayMap[date] = { level: Number.isFinite(level) ? level : 0, count }
  }
  return dayMap
}

async function main() {
  const user = (process.env.GITHUB_USERNAME || DEFAULT_USER).trim()
  const url = `https://github.com/users/${encodeURIComponent(user)}/contributions`
  console.log(`Fetching GitHub contributions: ${url}`)

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'samuel-gutknecht-portfolio-build',
        Accept: 'text/html',
      },
    })
    if (!res.ok) {
      throw new Error(`Request failed (${res.status} ${res.statusText}).`)
    }
    const html = await res.text()
    const dayMap = parseContributions(html)
    const days = Object.keys(dayMap)
    if (days.length === 0) throw new Error('No contribution cells found.')

    const total = days.reduce((sum, d) => sum + (dayMap[d].count || 0), 0)
    const weeks = buildWeeks(dayMap)
    writeCalendar(OUT_FILE, {
      generatedAt: new Date().toISOString(),
      source: `https://github.com/${user}`,
      label: 'GitHub',
      metricLabel: 'contribution',
      total,
      totalLabel: `${total.toLocaleString('en-US')} contributions in the last year`,
      weeks,
    })
    console.log(`Wrote ${days.length} day(s), ${total} contributions to ${OUT_FILE}`)
  } catch (err) {
    keepOrEmpty(
      OUT_FILE,
      emptyPayload(user),
      err instanceof Error ? err.message : String(err),
    )
  }
}

main().catch((err) => {
  // Never fail the build over activity data.
  console.warn(String(err instanceof Error ? err.message : err))
  process.exit(0)
})
