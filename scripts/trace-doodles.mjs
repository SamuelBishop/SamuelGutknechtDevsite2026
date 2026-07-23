#!/usr/bin/env node

// Traces the generated doodle PNGs into flat SVGs used as CSS masks on the
// About page. Regenerate the source PNGs with scripts/generate-asset.mjs, then
// run: node scripts/trace-doodles.mjs
import { trace } from 'potrace'
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const SRC_DIR = process.argv[2] || '/tmp/doodles'
const OUT_DIR = resolve(REPO_ROOT, 'public/doodles')

const options = {
  threshold: 170,
  turdSize: 4,
  optCurve: true,
  optTolerance: 0.4,
  color: '#2a2512',
  background: 'transparent',
}

function traceOne(file) {
  return new Promise((res, rej) => {
    trace(file, options, (err, svg) => (err ? rej(err) : res(svg)))
  })
}

const files = (await readdir(SRC_DIR)).filter((f) => extname(f) === '.png')
await mkdir(OUT_DIR, { recursive: true })

for (const file of files) {
  const name = basename(file, '.png')
  const svg = await traceOne(join(SRC_DIR, file))
  await writeFile(join(OUT_DIR, `${name}.svg`), svg, 'utf8')
  console.log(`traced ${name}.svg`)
}
console.log('done')
