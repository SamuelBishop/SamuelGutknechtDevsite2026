#!/usr/bin/env node
/**
 * One-time helper to mint a long-lived Strava **refresh token** for the
 * activity-heatmap generator.
 *
 * Prerequisites (once):
 *   1. Create a free API app at https://www.strava.com/settings/api
 *      - Set "Authorization Callback Domain" to: localhost
 *   2. Put the app's Client ID / Secret in .env:
 *        STRAVA_CLIENT_ID=...
 *        STRAVA_CLIENT_SECRET=...
 *
 * Then:
 *   pnpm strava:auth                      # prints the authorize URL to open
 *   # ...authorize in the browser; it redirects to http://localhost/?code=XXXX
 *   # (the page won't load — that's fine, copy the `code` value from the URL bar)
 *   pnpm strava:auth <code>               # exchanges the code for tokens
 *
 * Copy the printed STRAVA_REFRESH_TOKEN into .env (and your Vercel env vars).
 * The refresh token is long-lived; the generator uses it to mint short-lived
 * access tokens at build time.
 */

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadDotEnv } from './lib/activity.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
loadDotEnv(resolve(__dirname, '..'))

const SCOPE = 'activity:read_all'
const REDIRECT_URI = 'http://localhost/exchange_token'

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    console.error(
      `Missing ${name}. Add STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET to .env first.`,
    )
    process.exit(1)
  }
  return value
}

async function main() {
  const clientId = requireEnv('STRAVA_CLIENT_ID')
  const clientSecret = requireEnv('STRAVA_CLIENT_SECRET')
  const code = process.argv[2] || process.env.STRAVA_AUTH_CODE

  if (!code) {
    const authorizeUrl =
      'https://www.strava.com/oauth/authorize?' +
      new URLSearchParams({
        client_id: clientId,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        approval_prompt: 'force',
        scope: SCOPE,
      }).toString()
    console.log('\n1. Open this URL and click Authorize:\n')
    console.log(`   ${authorizeUrl}\n`)
    console.log(
      '2. Your browser redirects to http://localhost/exchange_token?code=XXXX&scope=...',
    )
    console.log('   The page will fail to load — that is expected.')
    console.log('   Copy the `code` value from the address bar, then run:\n')
    console.log('   pnpm strava:auth <code>\n')
    return
  }

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
    }),
  })
  const data = await res.json()
  if (!res.ok || !data.refresh_token) {
    console.error('Token exchange failed:', JSON.stringify(data, null, 2))
    process.exit(1)
  }

  console.log('\nSuccess! Add this to your .env (and Vercel env vars):\n')
  console.log(`STRAVA_REFRESH_TOKEN=${data.refresh_token}\n`)
  console.log(`(athlete: ${data.athlete?.username ?? data.athlete?.id ?? 'unknown'})`)
}

main().catch((err) => {
  console.error(String(err instanceof Error ? err.message : err))
  process.exit(1)
})
