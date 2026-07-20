---
name: generate-asset
description: Generate or edit production-ready image assets with OpenAI's image model. Invoke explicitly with /generate-asset.
---

# Generate Image Asset

Create polished image assets from a text brief, optionally using one or more
reference images to preserve a subject, composition, or style.

## Safety rules

- Work only in the current repository and worktree.
- Read `OPENAI_API_KEY` from the environment or the git-ignored root `.env`.
- Never print, log, copy, commit, or expose the API key.
- Never add generated assets or references to git unless the user asks.
- Treat reference photos as private input and send them only to the configured
  OpenAI image endpoint.

## Process

1. Determine the requested asset, intended use, output path, aspect ratio, and
   any reference image paths. Use attached image paths directly rather than
   copying private photos into the repository.
2. Write a specific production prompt. For portraits, explicitly preserve the
   subject's identity, facial structure, hair, eye color, skin texture, and age;
   describe wardrobe, expression, crop, background, and lighting without
   inventing identifying traits.
3. Confirm that `.env` contains a non-empty `OPENAI_API_KEY` without displaying
   its value.
4. Run the generator:

   ```bash
   pnpm generate:asset -- \
     --prompt "Detailed image brief" \
     --output public/assets/example.png \
     --reference /absolute/path/to/reference-1.jpg \
     --reference /absolute/path/to/reference-2.jpg
   ```

   Omit `--reference` for text-to-image generation. Optional overrides are
   `--model`, `--size`, `--quality`, `--background`, and `--format`.

5. Inspect the generated image for likeness, anatomy, crop, visual artifacts,
   unintended text/logos, and suitability for the requested placement. Iterate
   with a more precise prompt when needed.
6. Report the final asset path and the meaningful visual direction used.

## Defaults

- Model: `IMAGE_MODEL` or `gpt-image-2`
- Size: `IMAGE_SIZE` or `1024x1024`
- Quality: `IMAGE_QUALITY` or `high`
- Background: `IMAGE_BACKGROUND` or `auto`
- Format: inferred from the output extension (`png`, `jpeg`, or `webp`)
