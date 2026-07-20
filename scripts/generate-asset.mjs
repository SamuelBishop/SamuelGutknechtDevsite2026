#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { basename, dirname, extname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const SUPPORTED_FORMATS = new Set(['png', 'jpeg', 'webp'])
const MIME_TYPES = new Map([
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
])

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

function readOption(argv, index, option) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`${option} requires a value.`)
  }
  return value
}

export function parseArgs(argv) {
  const options = {
    prompt: '',
    promptFile: '',
    output: '',
    references: [],
    model: '',
    size: '',
    quality: '',
    background: '',
    format: '',
  }

  for (let i = 0; i < argv.length; i += 1) {
    const option = argv[i]
    switch (option) {
      case '--':
        break
      case '--prompt':
        options.prompt = readOption(argv, i, option)
        i += 1
        break
      case '--prompt-file':
        options.promptFile = readOption(argv, i, option)
        i += 1
        break
      case '--output':
        options.output = readOption(argv, i, option)
        i += 1
        break
      case '--reference':
        options.references.push(readOption(argv, i, option))
        i += 1
        break
      case '--model':
        options.model = readOption(argv, i, option)
        i += 1
        break
      case '--size':
        options.size = readOption(argv, i, option)
        i += 1
        break
      case '--quality':
        options.quality = readOption(argv, i, option)
        i += 1
        break
      case '--background':
        options.background = readOption(argv, i, option)
        i += 1
        break
      case '--format':
        options.format = readOption(argv, i, option).toLowerCase()
        i += 1
        break
      case '--help':
        options.help = true
        break
      default:
        throw new Error(`Unknown option: ${option}`)
    }
  }

  return options
}

export function mimeFor(file) {
  const mime = MIME_TYPES.get(extname(file).toLowerCase())
  if (!mime) {
    throw new Error(
      `Unsupported reference image type for ${file}. Use PNG, JPEG, or WebP.`,
    )
  }
  return mime
}

function printHelp() {
  console.log(`Usage:
  pnpm generate:asset -- --prompt "brief" --output public/assets/image.png
  pnpm generate:asset -- --prompt "brief" --output public/assets/image.png \\
    --reference /path/to/reference.jpg

Options:
  --prompt <text>          Image brief
  --prompt-file <path>     Read the image brief from a UTF-8 text file
  --output <path>          Destination .png, .jpg/.jpeg, or .webp file
  --reference <path>       Reference image; repeat up to 16 times
  --model <name>           Override IMAGE_MODEL
  --size <dimensions>      Override IMAGE_SIZE
  --quality <level>        Override IMAGE_QUALITY
  --background <mode>      Override IMAGE_BACKGROUND
  --format <format>        png, jpeg, or webp
  --help                   Show this help`)
}

function outputFormat(output, requestedFormat) {
  const extension = extname(output).slice(1).toLowerCase()
  const inferred = extension === 'jpg' ? 'jpeg' : extension
  const format = requestedFormat || inferred

  if (!SUPPORTED_FORMATS.has(format)) {
    throw new Error('Output format must be png, jpeg, or webp.')
  }
  if (requestedFormat && inferred !== requestedFormat) {
    throw new Error(
      `Output extension .${extension} does not match --format ${requestedFormat}.`,
    )
  }
  return format
}

async function resolvePrompt(options) {
  if (options.prompt && options.promptFile) {
    throw new Error('Use either --prompt or --prompt-file, not both.')
  }
  const prompt = options.promptFile
    ? await readFile(resolve(options.promptFile), 'utf8')
    : options.prompt
  if (!prompt.trim()) {
    throw new Error('A non-empty --prompt or --prompt-file is required.')
  }
  return prompt.trim()
}

async function requestGeneration(key, config) {
  const body = {
    model: config.model,
    prompt: config.prompt,
    size: config.size,
    quality: config.quality,
    background: config.background,
    output_format: config.format,
    n: 1,
  }

  return fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + key,
    },
    body: JSON.stringify(body),
  })
}

async function requestEdit(key, config) {
  const form = new FormData()
  form.append('model', config.model)
  form.append('prompt', config.prompt)
  form.append('size', config.size)
  form.append('quality', config.quality)
  form.append('background', config.background)
  form.append('output_format', config.format)
  form.append('n', '1')

  for (const reference of config.references) {
    const absolutePath = resolve(reference)
    const bytes = await readFile(absolutePath)
    form.append(
      'image[]',
      new Blob([bytes], { type: mimeFor(absolutePath) }),
      basename(absolutePath),
    )
  }

  return fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key },
    body: form,
  })
}

async function responseBytes(response) {
  if (!response.ok) {
    const raw = await response.text().catch(() => '')
    let detail = raw
    try {
      detail = JSON.parse(raw)?.error?.message || raw
    } catch {
      // Preserve the raw response when it is not JSON.
    }
    throw new Error(
      `OpenAI image request failed (${response.status} ${response.statusText}). ${detail}`,
    )
  }

  const json = await response.json()
  const result = json?.data?.[0]
  if (result?.b64_json) return Buffer.from(result.b64_json, 'base64')
  if (result?.url) {
    const download = await fetch(result.url)
    if (!download.ok) {
      throw new Error(`Generated image download failed (${download.status}).`)
    }
    return Buffer.from(await download.arrayBuffer())
  }
  throw new Error('OpenAI response contained no image data.')
}

async function main() {
  loadDotEnv()
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    printHelp()
    return
  }

  const key = process.env.OPENAI_API_KEY
  if (!key) {
    throw new Error(
      'Missing OPENAI_API_KEY. Add it to the git-ignored .env file at the repository root.',
    )
  }
  if (!options.output) throw new Error('--output is required.')
  if (options.references.length > 16) {
    throw new Error('OpenAI image edits accept at most 16 reference images.')
  }

  const output = resolve(options.output)
  const config = {
    prompt: await resolvePrompt(options),
    output,
    references: options.references,
    model: options.model || process.env.IMAGE_MODEL || 'gpt-image-2',
    size: options.size || process.env.IMAGE_SIZE || '1024x1024',
    quality: options.quality || process.env.IMAGE_QUALITY || 'high',
    background: options.background || process.env.IMAGE_BACKGROUND || 'auto',
    format: outputFormat(output, options.format),
  }

  console.log(
    `${config.references.length ? 'Editing' : 'Generating'} with ${config.model} at ${config.size} -> ${config.output}`,
  )
  const response = config.references.length
    ? await requestEdit(key, config)
    : await requestGeneration(key, config)
  const bytes = await responseBytes(response)
  await mkdir(dirname(config.output), { recursive: true })
  await writeFile(config.output, bytes)
  console.log(`Saved ${config.output}`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
