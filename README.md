# My Inner Cat

> Which cat lives in you?

A watercolor personality quiz. Answer 10 of 27 randomly-pulled questions and get
matched to one of **89 cats** across **20 archetypes**, revealed as a collectible
card with a rarity tier you can share or download.

Static Next.js app — no backend, no database. Every result is a deep-linkable URL.

## Tech

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · `next/og` for
share cards · Vercel Analytics · deployed on Vercel.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm run test         # matching-engine unit tests (Vitest)
npm run build        # production build (prerenders all 89 results + cards)
```

## Content is generated from markdown

All content lives in three source files and is compiled into `data/*.json`:

| Source | Output |
|---|---|
| `archetype_data.md` | `data/archetypes.json` (20) |
| `cat_profiles_and_trivia.md` | `data/cats.json` (89) |
| `cat_quiz_scoring_tags.md` | `data/questions.json` (27) |

```bash
npm run data         # regenerate JSON + optimize images, with integrity checks
```

`scripts/build-data.mjs` parses the markdown, validates referential integrity
(every archetype reference resolves, ids are unique, every archetype has cats),
and optimizes each illustration from `images/` (the untouched ~2.5 MB originals)
into `public/cats/` as a 1024 px WebP. Edit the markdown, never the JSON.

## Architecture

- `lib/matching.ts` — `matchArchetype()` (tag tally + 3-tag-narrow tiebreak) and
  rarity-weighted `selectVariant()`. Pure and unit-tested.
- `lib/rarity.ts` — tier metadata (colors, foil, draw odds).
- `lib/og-card.tsx` — renders the shareable card (portrait 1080×1350) and the
  OG link-preview (1200×630) from one place; fonts vendored in `assets/fonts/`.
- `app/result/[archetype]/[cat]/` — result page, prerendered for all 89 pairs.
- `app/api/card/[archetype]/[cat]/` — the downloadable/shareable card PNG.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project** and import the repo (framework auto-detects
   as Next.js; no config needed).
3. Add an environment variable: `NEXT_PUBLIC_SITE_URL = https://myinnercat.com`.
4. Deploy, then add the `myinnercat.com` domain under **Settings → Domains** and
   point DNS as Vercel instructs.

See `.env.example` for environment variables.
