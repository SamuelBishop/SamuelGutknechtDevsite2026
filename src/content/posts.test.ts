import { describe, expect, it } from 'vitest'
import { formatPostDate, getPostBySlug, posts } from './posts'

describe('posts data module', () => {
  it('orders posts newest first', () => {
    for (let i = 1; i < posts.length; i += 1) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true)
    }
  })

  it('looks up a post by slug', () => {
    const first = posts[0]
    expect(getPostBySlug(first.slug)?.title).toBe(first.title)
    expect(getPostBySlug('not-a-real-slug')).toBeUndefined()
  })

  it('formats an ISO date and ignores invalid input', () => {
    // Build the ISO from a local date so the assertion is timezone-independent.
    const local = new Date(2026, 5, 24)
    expect(formatPostDate(local.toISOString())).toBe('June 24, 2026')
    expect(formatPostDate('not-a-date')).toBe('')
  })
})
