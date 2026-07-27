#!/usr/bin/env node
/**
 * Generate and trace the four About page chapter icons.
 *
 * The chapters (Home, Movement, Coaching, Music) previously used generic
 * lucide glyphs. This script renders a bespoke, hand-drawn-feeling icon per
 * chapter, then traces each PNG into a flat single-path SVG that the page uses
 * as a CSS mask, so the icon inherits its color from the design tokens.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-about-icons.mjs
 *   pnpm generate:about-icons
 *
 * Options (env):
 *   ABOUT_ICONS=home,music     Only (re)generate the listed icon keys.
 *   ABOUT_ICON_MODEL=gpt-image-2
 *   ABOUT_ICON_SIZE=1024x1024
 *   ABOUT_ICON_QUALITY=high
 *   ABOUT_ICON_PNG_DIR=/tmp/about-icons  Where the intermediate PNGs are written.
 *   ABOUT_ICON_SKIP_GENERATE=1 Re-trace the existing PNGs without calling the API.
 *
 * The API key is read from the environment only. It is never logged, printed, or
 * written to disk. This script is committed; the key is not.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { trace } from 'potrace'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const PNG_DIR = process.env.ABOUT_ICON_PNG_DIR || '/tmp/about-icons'
const SVG_DIR = resolve(REPO_ROOT, 'public', 'icons')

/**
 * Minimal .env loader (no dependency): reads KEY=VALUE lines from a .env file at
 * the repo root and applies any keys not already set in the environment.
 */
function loadDotEnv() {
  const envPath = resolve(REPO_ROOT, '.env')
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

const MODEL = process.env.ABOUT_ICON_MODEL || 'gpt-image-2'
const SIZE = process.env.ABOUT_ICON_SIZE || '1024x1024'
const QUALITY = process.env.ABOUT_ICON_QUALITY || 'high'

/**
 * Shared icon style. These are traced to a single flat color, so the prompt asks
 * for pure black shapes on pure white with no shading, gradients, or color —
 * anything else turns to mud at the 20px size these render at.
 */
const STYLE = [
  'A single minimalist pictogram icon, drawn as solid pure black (#000000) shapes on a plain pure white (#FFFFFF) background.',
  'Strictly two tones: black and white only. No gray, no color, no gradients, no shading, no hatching, no texture, no outline around the frame.',
  'Bold and chunky with thick strokes and generous negative space, in the spirit of a hand-inked woodcut stamp — confident and a little imperfect rather than a sterile geometric line icon.',
  'The subject is centered, complete, never cropped, and fills roughly 80% of the square frame with even margins.',
  'It must stay instantly readable when shrunk to 20px wide, so omit small interior details, thin lines, and fine ornament.',
  'No text, no words, no letters, no numbers, no watermark, no signature, no drop shadow, no border, no background scenery.',
]

const ICONS = [
  {
    key: 'home',
    subject:
      'a small cabin-like house with a steep pitched roof and a single chimney, with two simple triangular mountain peaks rising directly behind it and one chunky pine tree standing beside it. Solid black silhouette shapes, no windows or doors drawn as thin lines.',
  },
  {
    key: 'movement',
    subject:
      'a single trail running shoe in a clean side profile facing right, with a thick lugged sole, a chunky heel, and two or three bold lace lines across the upper. One solid black silhouette.',
  },
  {
    key: 'coaching',
    subject:
      'a coach\u2019s whistle seen from the side facing right, with a rounded chunky body, a short mouthpiece, and a thick looped cord rising from the ring at its top. One solid black silhouette.',
  },
  {
    key: 'music',
    subject:
      'a short section of a piano keyboard seen straight on from the front, showing about five wide white keys separated by thick black gaps, with three fat black keys sitting on top. The black keys and the separating gaps are solid black; the white keys are the white background.',
  },
]

const TRACE_OPTIONS = {
  threshold: 170,
  turdSize: 4,
  optCurve: true,
  optTolerance: 0.4,
  color: '#2f6b4f',
  background: 'transparent',
}

function requireKey() {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    console.error(
      'Missing OPENAI_API_KEY. Add it to a .env file at the repo root, then run:\n' +
        '  pnpm generate:about-icons',
    )
    process.exit(1)
  }
  return key
}

function selectedIcons() {
  const raw = process.env.ABOUT_ICONS
  if (!raw) return ICONS
  const wanted = new Set(raw.split(',').map((s) => s.trim().toLowerCase()))
  return ICONS.filter((icon) => wanted.has(icon.key))
}

async function generateOne(key, icon) {
  const prompt = `${STYLE.join(' ')}\n\nIcon: ${icon.subject}`
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      size: SIZE,
      quality: QUALITY,
      output_format: 'png',
      n: 1,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(
      `Icon ${icon.key}: OpenAI request failed (${res.status} ${res.statusText}). ${detail}`,
    )
  }

  const json = await res.json()
  const b64 = json?.data?.[0]?.b64_json
  if (!b64) throw new Error(`Icon ${icon.key}: response had no image data.`)
  const file = resolve(PNG_DIR, `${icon.key}.png`)
  await writeFile(file, Buffer.from(b64, 'base64'))
  return file
}

function traceOne(file) {
  return new Promise((res, rej) => {
    trace(file, TRACE_OPTIONS, (err, svg) => (err ? rej(err) : res(svg)))
  })
}

async function main() {
  const skipGenerate = process.env.ABOUT_ICON_SKIP_GENERATE === '1'
  const key = skipGenerate ? null : requireKey()
  await mkdir(PNG_DIR, { recursive: true })
  await mkdir(SVG_DIR, { recursive: true })

  const icons = selectedIcons()
  console.log(
    skipGenerate
      ? `Tracing ${icons.length} existing icon(s) -> public/icons/`
      : `Generating ${icons.length} icon(s) with ${MODEL} at ${SIZE} (quality ${QUALITY}) -> public/icons/`,
  )

  for (const icon of icons) {
    process.stdout.write(`  ${icon.key} ... `)
    try {
      const png = skipGenerate
        ? resolve(PNG_DIR, `${icon.key}.png`)
        : await generateOne(key, icon)
      const svg = await traceOne(png)
      await writeFile(resolve(SVG_DIR, `${icon.key}.svg`), svg, 'utf8')
      console.log('done')
    } catch (err) {
      console.log('failed')
      console.error(String(err instanceof Error ? err.message : err))
      process.exitCode = 1
    }
  }
}

main().catch((err) => {
  console.error(String(err instanceof Error ? err.message : err))
  process.exit(1)
})
