# My Inner Cat

A watercolor personality quiz (Next.js 15 / App Router, React 19, TypeScript, Tailwind v3).
Users answer 10 of 27 random questions and are matched to 1 of 89 cats across 20 archetypes.
Fully static — no backend, no DB. Result state lives in the URL.

See `my_inner_cat_build_spec.md` for the authoritative design.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build (prerenders all result pages + OG images)
- `npm run test` — Vitest unit tests for the matching engine
- `npm run start` — serve the production build

## Architecture

- `data/*.json` — all content (archetypes, cats, questions). The only source of truth at runtime.
- `lib/matching.ts` — `matchArchetype()` (tag tally + 3-tag narrow tiebreak) and `selectVariant()`
  (rarity-weighted pick: common 40 / uncommon 30 / rare 20 / legendary 10). Pure, RNG-injectable.
- `lib/selection.ts` — `selectQuestions()`, Fisher-Yates shuffle, RNG-injectable.
- `lib/data.ts` — typed loaders + `toSlug`/`fromSlug` (id `cozy_giant` ↔ URL slug `cozy-giant`).
- Routes: `/` → `/quiz` → `/result/[archetype]/[cat]`. Result pages prerender via `generateStaticParams`.
- Quiz randomness runs client-side only (in `QuizFlow`) to avoid hydration mismatch.

## Conventions

- Palette + fonts (Fraunces display / Geist body) are in `tailwind.config.ts` and `app/globals.css`.
- Image files: `public/cats/{archetype-slug}-{cat-slug}-{rarity}.png`. The `cat.image` field
  in `cats.json` must match exactly.
- All animation respects `prefers-reduced-motion` (global rule in `globals.css`).
- Analytics events fire via `@vercel/analytics` `track()`: `quiz_started`, `quiz_completed`
  (with `archetype`), `result_shared`, `quiz_retaken`.

## Regenerating data from source content

`data/*.json` is GENERATED from the three source markdown files by `scripts/build-data.mjs`
(`npm run data`). It is the single source of truth — edit the markdown, not the JSON.

- `archetype_data.md` -> `archetypes.json` (20) and the naming conventions
- `cat_profiles_and_trivia.md` -> `cats.json` (89) — archetype comes from the `##` section header
- `cat_quiz_scoring_tags.md` -> `questions.json` (27)

The script parses the markdown, validates referential integrity (counts, FK tags, unique ids,
every archetype has >=1 cat), then copies/renames each image from `images/` into `public/cats/` as
`{archetype-slug}-{cat-slug}-{rarity}.png`. Two source images have typo'd filenames handled by
`SOURCE_OVERRIDES` in the script (`main-coone.png` -> Maine Coon, `lapirm.png` -> LaPerm).

Known content notes (non-fatal warnings from the script):
- Answers `q11c`, `q15a`, `q27c` have only 2 archetype tags (most have 3-5). Intentional in source;
  the engine handles it. Add a 3rd tag in `cat_quiz_scoring_tags.md` and re-run `npm run data`.

Note: source images are ~2.8 MB each (~250 MB total) — compress before launch (performance pass).
