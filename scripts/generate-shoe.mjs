#!/usr/bin/env node
/**
 * Generate the small trail-running shoe that rides along the Home page trail.
 *
 * The shoe is overlaid on the watercolor scenes (see generate-trail-scenes.mjs)
 * and animated to run down the painted trail, so it must match their palette and
 * ship on a fully transparent background at a clean side profile facing right.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-shoe.mjs
 *   pnpm generate:shoe
 *
 * Options (env):
 *   SHOE_MODEL=gpt-image-1
 *   SHOE_SIZE=1024x1024
 *   SHOE_QUALITY=high
 *
 * The API key is read from the environment only. It is never logged, printed, or
 * written to disk. This script is committed; the key is not.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '..', 'public', 'trail')

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

const MODEL = process.env.SHOE_MODEL || 'gpt-image-1'
const SIZE = process.env.SHOE_SIZE || '1024x1024'
const QUALITY = process.env.SHOE_QUALITY || 'high'

/**
 * Prompt: a single, iconic side-profile trail runner that matches the scenes'
 * faded-watercolor look and stays legible when drawn only ~40px wide.
 */
const PROMPT = [
  'A single trail-running shoe shown in a clean, simple side profile, facing to the RIGHT (toe on the right, heel on the left), sitting level as if mid-stride.',
  'Loose, airy watercolor illustration with soft washes and gentle paper texture, hand-painted look — the same style as a faded trail-guide watercolor.',
  'Muted, calm palette only: pine green (#1c3f36) sole and detailing, sage mist (#dde8de) and warm birch off-white (#f3f5ef) on the upper, with one small jade (#0f9d76) accent stripe.',
  'Very low contrast, high-key, no black, no harsh saturated colors, no neon.',
  'The shoe is centered and fills most of the frame, complete and never cropped. Bold and iconic so it reads clearly even at a very small size.',
  'No ground line, no cast shadow, no motion lines, no text, no words, no lettering, no watermark, no border.',
  'Fully transparent background — only the shoe, nothing else.',
].join(' ')

function requireKey() {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    console.error(
      'Missing OPENAI_API_KEY. Add it to a .env file at the repo root, then run:\n' +
        '  pnpm generate:shoe',
    )
    process.exit(1)
  }
  return key
}

async function main() {
  const key = requireKey()
  await mkdir(OUT_DIR, { recursive: true })
  console.log(
    `Generating shoe with ${MODEL} at ${SIZE} (quality ${QUALITY}) -> public/trail/shoe.png`,
  )
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: PROMPT,
      size: SIZE,
      quality: QUALITY,
      background: 'transparent',
      output_format: 'png',
      n: 1,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(
      `OpenAI request failed (${res.status} ${res.statusText}). ${detail}`,
    )
  }

  const json = await res.json()
  const b64 = json?.data?.[0]?.b64_json
  if (!b64) throw new Error('Response had no image data.')
  const file = resolve(OUT_DIR, 'shoe.png')
  await writeFile(file, Buffer.from(b64, 'base64'))
  console.log(`done (${file})`)
}

main().catch((err) => {
  console.error(String(err instanceof Error ? err.message : err))
  process.exit(1)
})
