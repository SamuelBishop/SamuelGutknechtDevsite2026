import { render, screen } from '@testing-library/react'
import { Github } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import type { ActivityCalendar } from '../content/activity'
import { ContributionHeatmap } from './ContributionHeatmap'

function fixture(overrides: Partial<ActivityCalendar> = {}): ActivityCalendar {
  return {
    generatedAt: '2026-01-01T00:00:00.000Z',
    source: 'https://github.com/SamuelBishop',
    label: 'GitHub',
    metricLabel: 'contribution',
    total: 5,
    totalLabel: '5 contributions in the last year',
    weeks: [
      [
        null,
        { date: '2025-12-29', level: 0, count: 0 },
        { date: '2025-12-30', level: 2, count: 3 },
        { date: '2025-12-31', level: 4, count: 9 },
        null,
        null,
        null,
      ],
      [
        { date: '2026-01-04', level: 1, count: 1 },
        { date: '2026-01-05', level: 0, count: 0 },
        null,
        null,
        null,
        null,
        null,
      ],
    ],
    ...overrides,
  }
}

describe('ContributionHeatmap', () => {
  it('renders one cell per week slot plus the legend, with a linked title', () => {
    const calendar = fixture()
    const { container } = render(
      <ContributionHeatmap
        calendar={calendar}
        icon={Github}
        href="https://github.com/SamuelBishop"
      />,
    )

    // 2 weeks x 7 slots = 14 grid cells + 5 legend swatches.
    expect(container.querySelectorAll('.activity-cell')).toHaveLength(14 + 5)

    const link = screen.getByRole('link', { name: /GitHub/ })
    expect(link).toHaveAttribute('href', 'https://github.com/SamuelBishop')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')

    expect(
      screen.getByText('5 contributions in the last year'),
    ).toBeInTheDocument()
  })

  it('exposes an accessible summary and per-day tooltips', () => {
    const calendar = fixture()
    render(
      <ContributionHeatmap
        calendar={calendar}
        icon={Github}
        href="https://github.com/SamuelBishop"
      />,
    )

    expect(
      screen.getByRole('img', {
        name: /GitHub activity heatmap: 5 contributions in the last year/,
      }),
    ).toBeInTheDocument()

    expect(
      document.querySelector('[title="3 contributions on December 30, 2025"]'),
    ).not.toBeNull()
    expect(
      document.querySelector('[title="1 contribution on January 4, 2026"]'),
    ).not.toBeNull()
  })

  it('shows an empty state when there is no activity yet', () => {
    const calendar = fixture({
      weeks: [],
      total: 0,
      totalLabel: 'No activity yet',
    })
    render(
      <ContributionHeatmap
        calendar={calendar}
        icon={Github}
        href="https://github.com/SamuelBishop"
      />,
    )

    expect(screen.getByText(/Syncing soon/)).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('uses Strava phrasing for the per-day noun', () => {
    const calendar = fixture({
      label: 'Strava',
      metricLabel: 'active day',
      weeks: [
        [
          { date: '2026-01-04', level: 3, count: 1 },
          { date: '2026-01-05', level: 4, count: 2 },
          null,
          null,
          null,
          null,
          null,
        ],
      ],
    })
    render(
      <ContributionHeatmap
        calendar={calendar}
        icon={Github}
        href="https://www.strava.com/athletes/23012268"
      />,
    )

    expect(
      document.querySelector('[title="1 activity on January 4, 2026"]'),
    ).not.toBeNull()
    expect(
      document.querySelector('[title="2 activities on January 5, 2026"]'),
    ).not.toBeNull()
  })
})
