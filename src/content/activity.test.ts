import { describe, expect, it } from 'vitest'
import { githubActivity, hasActivity, type ActivityCalendar } from './activity'

describe('activity content wrapper', () => {
  it('exposes a well-formed GitHub calendar snapshot', () => {
    expect(githubActivity.label).toBe('GitHub')
    expect(typeof githubActivity.totalLabel).toBe('string')
    // Every non-null day carries a valid level and an ISO date.
    for (const week of githubActivity.weeks) {
      expect(week).toHaveLength(7)
      for (const day of week) {
        if (day === null) continue
        expect(day.level).toBeGreaterThanOrEqual(0)
        expect(day.level).toBeLessThanOrEqual(4)
        expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      }
    }
  })

  it('reports emptiness via hasActivity', () => {
    const empty: ActivityCalendar = {
      generatedAt: '',
      source: '',
      label: 'Strava',
      metricLabel: 'active day',
      total: 0,
      totalLabel: 'No activities yet',
      weeks: [],
    }
    expect(hasActivity(empty)).toBe(false)

    const filled: ActivityCalendar = {
      ...empty,
      weeks: [
        [
          { date: '2026-01-01', level: 1, count: 1 },
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      ],
    }
    expect(hasActivity(filled)).toBe(true)
  })
})
