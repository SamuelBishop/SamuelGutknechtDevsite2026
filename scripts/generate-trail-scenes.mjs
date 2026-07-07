#!/usr/bin/env node
/**
 * Generate the five scene backgrounds used by the Home page trail animation.
 *
 * Each scene is a static, clean modern illustration that sits behind a Home
 * section and represents one chapter of the journey (Coder, Mountains, Tinkerer,
 * Runner, Lifelong Learner). A small object (see generate-objects.mjs) animates
 * horizontally along whichever scene is in view, so every scene shares one
 * composition rule: a clear, continuous route runs from the lower-left across to
 * the right within the lower third, and the left side stays pale and near-empty
 * so heading/body text stays readable on top.
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
 * Shared style guidance applied to every scene, taken from the Portfolio
 * Background Image Guide. Clean, modern, slightly cartoony technical
 * illustration on a warm cream ground, one cohesive palette, lots of empty
 * space on the left for text, and a single clear route across the lower third
 * for the animated object to follow. The object itself is NEVER baked in.
 */
const STYLE = [
  'A clean, modern, software-product style vector illustration — sleek, minimal, and professional, with a slightly cartoony technical feel: simplified shapes, crisp clean lines, soft shadows, and subtle depth.',
  'Cohesive muted palette only, used consistently: warm cream (#F5F3EC) background, light sage (#E9EDE6), sage (#C7D1C2), mid sage-green (#8CA28C), dark forest green (#2F4B3C), warm gray (#6B716C), taupe (#A89F90), and a small terracotta accent (#C7896A). No black, no neon, no harsh saturated colors.',
  'Wide horizontal landscape framing with a warm cream background and gentle, even lighting. Low contrast and calm.',
  'The entire LEFT side of the frame must stay open, pale and near-empty (just soft cream/negative space) so dark text can sit on top and stay readable; arrange the subject toward the center and right.',
  'A single clear, continuous route runs from the LOWER-LEFT across to the RIGHT, staying within the lower 30-45% of the frame — drawn as a subtle dotted guide line/path. It is unobstructed, with 2-4 broad, smooth curves and no tight loops or intersections, leaving clean clearance (about 24-40px) for a small object to travel along it.',
  'Keep the same horizon-line placement, perspective, and lighting mood across every scene so the five read as one cohesive set.',
  'No people, no animals, no cars, no text, no words, no numbers, no lettering, no watermark, no logos, no borders or frames. Do NOT draw any animated character or object on the path — leave the path empty.',
].join(' ')

/**
 * Per-scene subject matter — the five chapters from the guide. Each keeps the
 * left side open and places its subject toward the center/right.
 */
const SCENES = [
  {
    n: 1,
    subject:
      "the Coder's modern, minimalist workspace: a sleek desktop monitor displaying tidy, simplified lines of code, a small potted plant, a desk lamp, and a coffee mug arranged toward the center and right on a clean desk, with a calm window view of distant pine trees and soft hills beyond. Uncluttered and airy.",
  },
  {
    n: 2,
    subject:
      'a mountain trail in the Pacific Northwest: layered alpine peaks fading into the distance, evergreen fir and pine trees clustered mostly to the right, scattered rocks and low shrubs, and a soft dirt trail winding through the lower portion.',
  },
  {
    n: 3,
    subject:
      "the Tinkerer's electronics workshop: a workbench with a pegboard of neatly hung hand tools, a soldering iron, a small circuit board and half-built electronic projects, and a desk lamp arranged toward the center and right. Tidy and purposeful.",
  },
  {
    n: 4,
    subject:
      'a running track at sunrise: a curving athletic running track with clean lane lines sweeping through the lower portion, soft low golden light, distant stadium light poles and a calm treeline, evoking training and performance. Open and serene.',
  },
  {
    n: 5,
    subject:
      "the Lifelong Learner's quiet library and reading nook: tall bookshelves filled with books toward the right, a neat stack of books and one open book, a small potted plant, and warm natural light from a window with a soft view of trees. Calm and studious.",
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
