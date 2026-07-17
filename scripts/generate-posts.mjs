#!/usr/bin/env node
/**
 * Fetch the owner's Substack RSS feed and turn it into committed JSON that the
 * site renders as fully-formatted "Written Works" articles.
 *
 * The feed is fetched and its HTML sanitized here, at build time, then written
 * to src/content/posts.generated.json (committed). The React app only ever reads
 * that already-sanitized JSON, so there is no runtime dependency, no CORS, and
 * the client renders trusted output.
 *
 * Usage:
 *   node scripts/generate-posts.mjs
 *   pnpm generate:posts
 *
 * Options (env):
 *   SUBSTACK_URL   Publication base URL or full feed URL.
 *                  Default: https://www.chasing-trail.com
 *   POSTS_LIMIT    Max number of posts to keep (default: all in the feed).
 *
 * Resilient by design: if the network is unavailable or parsing fails, the
 * existing JSON is kept (or an empty set is written on first run) so builds and
 * CI stay green.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser } from 'fast-xml-parser'
import sanitizeHtml from 'sanitize-html'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_FILE = resolve(
  __dirname,
  '..',
  'src',
  'content',
  'posts.generated.json',
)

/**
 * Minimal .env loader (no dependency): reads KEY=VALUE lines from a .env file at
 * the repo root and applies any keys not already set in the environment.
 */
function loadDotEnv() {
  const envPath = resolve(__dirname, '..', '.env')
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

loadDotEnv()

const DEFAULT_SUBSTACK = 'https://www.chasing-trail.com'

function feedUrlFrom(input) {
  const base = (input || DEFAULT_SUBSTACK).trim().replace(/\/+$/, '')
  return base.endsWith('/feed') ? base : `${base}/feed`
}

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
}

/** Decode HTML entities for plain-text fields (title, excerpt, author). */
function decodeEntities(input) {
  if (!input) return ''
  return String(input)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => NAMED_ENTITIES[name] ?? m)
}

/** fast-xml-parser wraps CDATA values under __cdata; normalise to a string. */
function textOf(node) {
  if (node == null) return ''
  if (typeof node === 'string') return node
  if (typeof node === 'object') {
    if (typeof node.__cdata === 'string') return node.__cdata
    if (typeof node['#text'] === 'string') return node['#text']
  }
  return String(node)
}

function plainText(html) {
  return decodeEntities(
    String(html)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  )
}

function readingTimeMin(html) {
  const words = plainText(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

function slugFrom(link) {
  try {
    const path = new URL(link).pathname
    const afterP = path.match(/\/p\/([^/]+)/)
    if (afterP) return afterP[1]
    const segments = path.split('/').filter(Boolean)
    return segments[segments.length - 1] || ''
  } catch {
    return ''
  }
}

/** Pull the Substack image id (a UUID) out of a media URL, if present. */
function imageKeyFrom(url) {
  if (!url) return ''
  const decoded = decodeURIComponent(String(url))
  const match = decoded.match(/public\/images\/([0-9a-f-]{36})/i)
  return match ? match[1].toLowerCase() : ''
}

/**
 * Substack repeats the lead image: it is both the RSS <enclosure> (rendered as
 * the article cover) and the first <figure> in the body. When the first figure
 * is that same image, drop it so it only appears once.
 */
function stripLeadingCoverFigure(html, coverKey) {
  if (!coverKey) return html
  const figStart = html.indexOf('<figure')
  if (figStart === -1) return html
  const closeIdx = html.indexOf('</figure>', figStart)
  if (closeIdx === -1) return html
  let stop = closeIdx + '</figure>'.length
  const block = html.slice(figStart, stop)
  if (!block.toLowerCase().includes(coverKey)) return html
  let start = figStart
  // Swallow a wrapping <div>...</div> that tightly encloses the figure.
  const divOpen = html.slice(0, figStart).match(/<div\b[^>]*>\s*$/)
  if (divOpen) {
    const divClose = html.slice(stop).match(/^\s*<\/div>/)
    if (divClose) {
      start = figStart - divOpen[0].length
      stop += divClose[0].length
    }
  }
  return (html.slice(0, start) + html.slice(stop)).trim()
}

/** Allowlist sanitizer: keeps Substack's rich structure, drops anything unsafe. */
function sanitizePostHtml(html) {
  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'br',
      'hr',
      'a',
      'strong',
      'em',
      'b',
      'i',
      'u',
      's',
      'sub',
      'sup',
      'blockquote',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'img',
      'figure',
      'figcaption',
      'picture',
      'source',
      'pre',
      'code',
      'span',
      'div',
      'table',
      'thead',
      'tbody',
      'tr',
      'td',
      'th',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: [
        'src',
        'srcset',
        'sizes',
        'alt',
        'title',
        'width',
        'height',
        'loading',
      ],
      source: ['srcset', 'sizes', 'type', 'media'],
      '*': [],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.href && !attribs.href.startsWith('#')
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {}),
        },
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: 'lazy' },
      }),
    },
    // Drop Substack's subscribe widgets / tracking pixels and empty wrappers.
    exclusiveFilter: (frame) =>
      frame.tag === 'img' &&
      typeof frame.attribs.src === 'string' &&
      /\/open($|\?)|pixel/i.test(frame.attribs.src),
  }).trim()
}

function toPost(item) {
  const link = textOf(item.link) || textOf(item.guid)
  const slug = slugFrom(link)
  const rawContent = textOf(item['content:encoded'])
  const pubDate = textOf(item.pubDate)
  let date = pubDate
  const parsed = new Date(pubDate)
  if (!Number.isNaN(parsed.valueOf())) date = parsed.toISOString()
  const cover =
    item.enclosure && typeof item.enclosure === 'object'
      ? item.enclosure['@_url'] || null
      : null
  const contentHtml = stripLeadingCoverFigure(
    sanitizePostHtml(rawContent),
    imageKeyFrom(cover),
  )
  return {
    slug,
    title: decodeEntities(textOf(item.title)).trim(),
    url: link,
    date,
    author: decodeEntities(textOf(item['dc:creator'])).trim(),
    excerpt: plainText(textOf(item.description)),
    coverImage: cover,
    readingTimeMin: readingTimeMin(rawContent),
    contentHtml,
  }
}

function writeOutput(source, posts) {
  const payload = {
    generatedAt: new Date().toISOString(),
    source,
    posts,
  }
  writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

async function main() {
  const source = (process.env.SUBSTACK_URL || DEFAULT_SUBSTACK)
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/feed$/, '')
  const feedUrl = feedUrlFrom(process.env.SUBSTACK_URL)
  const limit = Number.parseInt(process.env.POSTS_LIMIT || '', 10)

  console.log(`Fetching Substack feed: ${feedUrl}`)

  let posts
  try {
    const res = await fetch(feedUrl, {
      headers: { 'User-Agent': 'chasing-trail-portfolio-build' },
    })
    if (!res.ok) {
      throw new Error(`Feed request failed (${res.status} ${res.statusText}).`)
    }
    const xml = await res.text()
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      cdataPropName: '__cdata',
    })
    const doc = parser.parse(xml)
    const channel = doc?.rss?.channel
    if (!channel) throw new Error('Feed did not contain an <rss><channel>.')
    const items = Array.isArray(channel.item)
      ? channel.item
      : channel.item
        ? [channel.item]
        : []
    posts = items
      .map(toPost)
      .filter((post) => post.slug && post.title && post.contentHtml)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    if (Number.isFinite(limit) && limit > 0) posts = posts.slice(0, limit)
  } catch (err) {
    console.warn(
      `Could not refresh posts: ${err instanceof Error ? err.message : err}`,
    )
    if (existsSync(OUT_FILE)) {
      console.warn('Keeping the existing posts.generated.json.')
      return
    }
    console.warn('Writing an empty post set so the build can proceed.')
    writeOutput(source, [])
    return
  }

  writeOutput(source, posts)
  console.log(`Wrote ${posts.length} post(s) to ${OUT_FILE}`)
}

main().catch((err) => {
  console.error(String(err instanceof Error ? err.message : err))
  process.exit(1)
})
