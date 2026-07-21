---
name: deploy
description: Build and deploy the site to Vercel production on demand. Invoke explicitly with /deploy.
---

# Deploy to Vercel (production)

Use this skill to ship the current committed state to Vercel **production**. This
is intentionally separate from `/cap`: commits and pushes do NOT trigger a prod
deploy, so run this only when you explicitly want the live site updated.

## Safety rules

- Work only in the current repository and worktree.
- Deploy the current working tree as-is. Do not amend, reset, or discard changes.
- Never print, log, or expose secrets or environment variables.
- Do not change application code as part of deploying. If a build fails, report it
  rather than silently patching unrelated things.

## Prerequisites

- The Vercel CLI is installed at `/Users/samgu/Library/pnpm/bin/vercel` but is not
  on the default `PATH`. Prefix commands with:

  ```bash
  export PATH="/Users/samgu/Library/pnpm/bin:$PATH"
  ```

- The project is already linked (`.vercel/`) and authenticated as `samuelbishop`.
  Verify with `vercel whoami` if a deploy fails on auth.

## Process

1. (Recommended) Confirm the build is healthy locally first, only if the user
   hasn't just validated it:

   ```bash
   pnpm build
   ```

2. Deploy to production:

   ```bash
   export PATH="/Users/samgu/Library/pnpm/bin:$PATH"
   vercel deploy --prod --yes
   ```

   - If the CLI reports **"Already up to date"** and reuses a cached build that
     does NOT include your latest changes, redeploy with a forced fresh build:

     ```bash
     vercel deploy --prod --yes --force
     ```

3. Wait for `readyState: READY` and note the aliased production URL
   (`https://samuel-gutknecht-portfolio.vercel.app`).

4. Verify the deploy actually shipped the intended change — e.g. fetch the live
   HTML, find the hashed `/assets/index-*.css` (or `.js`) it references, and
   confirm that asset matches the local `dist/` build (a stale hash means the
   deploy served a cached build — use `--force`).

5. Report the production URL and what was verified, concisely.
