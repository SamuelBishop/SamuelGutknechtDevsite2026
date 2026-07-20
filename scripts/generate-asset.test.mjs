import { describe, expect, it } from 'vitest'

import { mimeFor, parseArgs } from './generate-asset.mjs'

describe('generate-asset arguments', () => {
  it('collects repeated reference images and overrides', () => {
    expect(
      parseArgs([
        '--',
        '--prompt',
        'A professional portrait',
        '--output',
        'public/headshot.png',
        '--reference',
        '/tmp/one.jpg',
        '--reference',
        '/tmp/two.webp',
        '--model',
        'gpt-image-2',
      ]),
    ).toMatchObject({
      prompt: 'A professional portrait',
      output: 'public/headshot.png',
      references: ['/tmp/one.jpg', '/tmp/two.webp'],
      model: 'gpt-image-2',
    })
  })

  it('rejects missing option values', () => {
    expect(() => parseArgs(['--output'])).toThrow('--output requires a value.')
  })

  it('maps supported reference image extensions to MIME types', () => {
    expect(mimeFor('portrait.JPG')).toBe('image/jpeg')
    expect(mimeFor('portrait.png')).toBe('image/png')
    expect(mimeFor('portrait.webp')).toBe('image/webp')
  })

  it('rejects unsupported reference image types', () => {
    expect(() => mimeFor('portrait.gif')).toThrow(
      'Unsupported reference image type',
    )
  })
})
