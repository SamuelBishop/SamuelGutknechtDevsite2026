#!/usr/bin/env node
/**
 * Generate the watercolor trail scenes used by the Home page trail animation.
 *
 * Each scene is a static, painterly landscape band that sits behind a Home
 * section. A small shoe animates horizontally (left -> right) across whichever
 * scene is in view, so every scene shares one composition rule: a soft dirt
 * trail enters from the lower-left and exits at the right, and the upper-left
 * stays pale and near-empty so heading/body text stays readable on top.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-trail-scenes.mjs
 *
 * Options (env):
 *   TRAIL_SCENES=1,3      Only (re)generate the listed scene numbers.
 *   TRAIL_MODEL=gpt-image-1
 *   TRAIL_SIZE=1536x1024
 *
 * The API key is read from the environment only. It is never logged, printed,
 * or written to disk. This script is committed; the key is not.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '..', 'public', 'trail')

/**
 * Minimal .env loader (no dependency): reads KEY=VALUE lines from a .env file at
 * the repo root and applies any keys not already set in the environment. Values
 * may be wrapped in single or double quotes. The file is git-ignored so keys
 * stay local.
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

const MODEL = process.env.TRAIL_MODEL || 'gpt-image-1'
const SIZE = process.env.TRAIL_SIZE || '1536x1024'

/**
 * Shared style guidance applied to every scene. Keep the palette muted and the
 * contrast low so the site's dark text remains legible, and always reserve a
 * pale, near-empty upper-left quadrant.
 */
const STYLE = [
  'Loose, airy watercolor illustration on off-white paper, hand-painted look with soft washes and gentle paper texture.',
  'Muted, calm palette only: pine green (#1c3f36), sage mist (#dde8de), warm birch/off-white paper (#f3f5ef), and small accents of jade (#0f9d76).',
  'Very low contrast and high-key overall — like a faded, sun-bleached trail-guide watercolor. No black, no harsh saturated colors, no neon.',
  'Wide cinematic landscape framing. The scene occupies the lower two-thirds; the top third is pale, washed-out sky/paper with almost nothing in it.',
  'The entire UPPER-LEFT quadrant must stay nearly empty and pale (just faint paper/sky) so dark text can sit on top and stay readable.',
  'A soft, dotted dirt hiking trail winds in from the LOWER-LEFT of the frame and exits at the RIGHT edge, staying in the lower half.',
  'No people, no animals, no text, no words, no lettering, no watermark, no borders or frames. Flat, no strong vignette.',
].join(' ')

/**
 * Per-scene subject matter. Ordered as a continuous descent/ascent journey so
 * the stacked scenes read as one trip down the page.
 */
const SCENES = [
  {
    n: 1,
    subject:
      'A quiet trailhead meadow at the start of a hike: soft rolling grassland with a few slender birch and pine saplings scattered to the right, distant hazy foothills low on the horizon. Sparse and open.',
  },
  {
    n: 2,
    subject:
      'Forested foothills a little further along: clusters of tall pine and fir trees gathered mostly on the right side, a soft wash of layered hills behind them, the dotted trail curving gently between the trees. Left side stays open and pale.',
  },
  {
    n: 3,
    subject:
      'A rockier stretch climbing higher: a few loose boulders and low granite outcrops among thinning pines to the right, taller ridgelines rising in soft layered washes behind, the trail threading upward past the rocks. Left side open and pale.',
  },
  {
    n: 4,
    subject:
      'An exposed alpine ridge near the top: bare rocky ridgeline and a couple of weathered pines, distant mountain peaks in pale overlapping watercolor layers, the trail running along the crest. Airy, high, minimal. Left side open and pale.',
  },
  {
    n: 5,
    subject:
      'A summit valley overlook at journey’s end: a broad calm valley seen from above, soft distant ranges fading in high-key washes, the trail easing down toward a gentle basin on the right. Very serene, very pale, lots of open sky. Left side open and pale.',
  },
]

function requireKey() {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    console.error(
      'Missing OPENAI_API_KEY. Add it to a .env file at the repo root:\n' +
        '  cp .env.example .env   # then edit .env and paste your key\n' +
        'or export it in your shell:\n' +
        '  export OPENAI_API_KEY=sk-...\n' +
        'then run:  pnpm generate:trail',
    )
    process.exit(1)
  }
  return key
}

function selectedScenes() {
  const raw = process.env.TRAIL_SCENES
  if (!raw) return SCENES
  const wanted = new Set(
    raw
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isInteger(n)),
  )
  return SCENES.filter((s) => wanted.has(s.n))
}

async function generateOne(key, scene) {
  const prompt = `${STYLE}\n\nScene: ${scene.subject}`
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
      n: 1,
      output_format: 'jpeg',
      output_compression: 86,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(
      `Scene ${scene.n}: OpenAI request failed (${res.status} ${res.statusText}). ${detail}`,
    )
  }

  const json = await res.json()
  const b64 = json?.data?.[0]?.b64_json
  if (!b64) {
    throw new Error(`Scene ${scene.n}: response had no image data.`)
  }
  const file = resolve(OUT_DIR, `scene-0${scene.n}.jpg`)
  await writeFile(file, Buffer.from(b64, 'base64'))
  return file
}

async function main() {
  const key = requireKey()
  await mkdir(OUT_DIR, { recursive: true })
  const scenes = selectedScenes()
  console.log(
    `Generating ${scenes.length} scene(s) with ${MODEL} at ${SIZE} -> public/trail/`,
  )
  for (const scene of scenes) {
    process.stdout.write(`  scene-0${scene.n}.jpg ... `)
    try {
      const file = await generateOne(key, scene)
      console.log(`done (${file})`)
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
