#!/usr/bin/env node
/**
 * Generate the five traversal objects that ride along the Home page scenes.
 *
 * Each scene (see generate-trail-scenes.mjs) has its own object that animates
 * along the painted route: Coder -> mouse cursor, Mountains -> running shoe,
 * Tinkerer -> tiny robot, Runner -> runner silhouette, Lifelong Learner ->
 * paper airplane. Every object shares one illustration style and palette so the
 * set reads as cohesive, and each ships on a fully transparent background,
 * facing right, legible when drawn only ~30-60px wide.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-objects.mjs
 *   pnpm generate:objects
 *
 * Options (env):
 *   TRAIL_OBJECTS=cursor,robot   Only (re)generate the listed object keys.
 *   OBJECT_MODEL=gpt-image-1
 *   OBJECT_SIZE=1024x1024
 *   OBJECT_QUALITY=high
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

const MODEL = process.env.OBJECT_MODEL || 'gpt-image-1'
const SIZE = process.env.OBJECT_SIZE || '1024x1024'
const QUALITY = process.env.OBJECT_QUALITY || 'high'

/**
 * Shared object style — matches the scenes' clean, modern, slightly cartoony
 * illustration and the guide palette, on a transparent background.
 */
const STYLE = [
  'A single icon-like object in a clean, modern, software-product style vector illustration — sleek and slightly cartoony: simplified shapes, crisp clean lines, soft shadow within the shape, and subtle depth.',
  'Cohesive muted palette only: warm cream (#F5F3EC), light sage (#E9EDE6), sage (#C7D1C2), mid sage-green (#8CA28C), dark forest green (#2F4B3C), warm gray (#6B716C), taupe (#A89F90), and a small terracotta accent (#C7896A). No black, no neon, no harsh saturated colors.',
  'The object is centered and fills most of the frame, complete and never cropped. Bold and iconic so it reads clearly even at a very small size (about 30-60px wide).',
  'No ground line, no cast shadow on the ground, no motion lines, no text, no words, no lettering, no watermark, no border.',
  'Fully transparent background — only the object, nothing else around it.',
]

/**
 * Per-object subject matter, ordered to match the five scenes. Every object
 * faces to the RIGHT so it reads as travelling left -> right along the path.
 */
const OBJECTS = [
  {
    key: 'cursor',
    subject:
      'a classic desktop arrow mouse cursor / pointer, tilted as usual, with a solid dark forest green (#2F4B3C) fill and a crisp cream (#F5F3EC) outline. Simple and instantly recognizable.',
  },
  {
    key: 'shoe',
    subject:
      'a single trail-running shoe in a clean side profile, facing RIGHT (toe on the right, heel on the left), sitting level as if mid-stride, with a sage and cream upper, a dark forest green sole, and one small terracotta (#C7896A) accent stripe.',
  },
  {
    key: 'robot',
    subject:
      'a small, friendly, boxy robot standing upright and facing slightly RIGHT (three-quarter view): a rounded rectangular head with two round eyes and a little antenna, a compact body, and stubby arms and legs. Sage-green and warm-gray body with dark forest green details and a small terracotta antenna light. Cute and simple.',
  },
  {
    key: 'runner',
    subject:
      'a running human figure shown as a clean solid silhouette in dark forest green (#2F4B3C), side profile facing RIGHT, captured mid-stride in a dynamic running pose with arms and legs bent. Simplified and iconic.',
  },
  {
    key: 'plane',
    subject:
      'a folded paper airplane gliding, seen in a three-quarter side view pointing to the RIGHT and slightly upward, made of light cream and sage paper with crisp dark forest green fold lines. Simple origami dart shape.',
  },
]

function requireKey() {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    console.error(
      'Missing OPENAI_API_KEY. Add it to a .env file at the repo root, then run:\n' +
        '  pnpm generate:objects',
    )
    process.exit(1)
  }
  return key
}

function selectedObjects() {
  const raw = process.env.TRAIL_OBJECTS
  if (!raw) return OBJECTS
  const wanted = new Set(raw.split(',').map((s) => s.trim().toLowerCase()))
  return OBJECTS.filter((o) => wanted.has(o.key))
}

async function generateOne(key, obj) {
  const prompt = `${STYLE.join(' ')}\n\nObject: ${obj.subject}`
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
      background: 'transparent',
      output_format: 'png',
      n: 1,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(
      `Object ${obj.key}: OpenAI request failed (${res.status} ${res.statusText}). ${detail}`,
    )
  }

  const json = await res.json()
  const b64 = json?.data?.[0]?.b64_json
  if (!b64) throw new Error(`Object ${obj.key}: response had no image data.`)
  const file = resolve(OUT_DIR, `obj-${obj.key}.png`)
  await writeFile(file, Buffer.from(b64, 'base64'))
  return file
}

async function main() {
  const key = requireKey()
  await mkdir(OUT_DIR, { recursive: true })
  const objects = selectedObjects()
  console.log(
    `Generating ${objects.length} object(s) with ${MODEL} at ${SIZE} (quality ${QUALITY}) -> public/trail/`,
  )
  for (const obj of objects) {
    process.stdout.write(`  obj-${obj.key}.png ... `)
    try {
      const file = await generateOne(key, obj)
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
