# My Inner Cat — Enhancement Roadmap

Post-launch ideas to improve UX and stickiness, parked here until the content
expansion (more archetypes / cats / questions) is integrated. The app is live,
healthy (Lighthouse 99/100/100/100), and these are net-new features.

**Core levers:** (1) completion goals — reasons to keep drawing cats;
(2) reasons to return; (3) reasons to share. Almost everything below maps to one
of those, and most fit the current no-backend / static model.

---

## Phase 0 — Prerequisite: expand the content (do first)

Adding archetypes / cats / questions is just editing the three source markdown
files + dropping images in `images/`, then `npm run data`. Everything scales
automatically — gallery, result pages, share/OG cards, sitemap, collection
counts, and the dynamic "89 cats / 20 archetypes" copy all derive from the data.

Checklist when expanding:
- New archetype → add to `archetype_data.md` (id, name, tagline, description) AND
  tag answers toward it in `cat_quiz_scoring_tags.md`, or it can never be matched.
- New cat → add under its `##` archetype section in `cat_profiles_and_trivia.md`
  (name, rarity, blurb, trivia) + image in `images/`; if it's a wild species, add
  its id to `WILD_SPECIES` in `scripts/build-data.mjs`.
- New question → add to `cat_quiz_scoring_tags.md` (3–5 tags per answer).
- Run `npm run data` (validates integrity, optimizes images), then `npm run test`
  + `npm run build`, commit, push.
- Re-balance tags after ~50–100 real plays using Vercel Analytics (see CLAUDE.md).

---

## Phase 1 — Deepen the result (highest delight-per-effort)

### 1a. Top 3 archetypes, not just #1  — Effort: S
**Why:** more nuance, more replay, more to talk about. The tally already exists.
**Approach:** add `rankArchetypes(userAnswers)` to `lib/matching.ts` (reuse the
existing tag tally + 3-tag-narrow tiebreak, return sorted `[{id, count}]`).
**Key constraint:** the result page (`/result/[a]/[cat]`) is deep-linkable and has
NO access to the user's answers. So the runner-ups (and "why" below) only exist at
the moment the quiz completes. Pass them from `QuizFlow` via `sessionStorage`
(same pattern as `flagPull` in `lib/collection.ts`) and render them in a client
component on the result page that shows them only for a freshly-completed quiz
(hidden on shared/browsed links). Keep the primary result identical.

### 1b. "Why you got this"  — Effort: S
**Why:** transparency = trust + delight.
**Approach:** from the stored answers, surface the 2–3 answers whose tags most
contributed to the winning archetype. Same sessionStorage handoff as 1a.

### 1c. Wallpaper / alt share formats  — Effort: M
**Approach:** add a portrait phone-wallpaper size (e.g. 1080×1920) to
`lib/og-card.tsx` (`SIZES`) and a download option in `ShareButton`. Optional
seasonal frames keyed by date.

---

## Phase 2 — Finish the collection loop (biggest stickiness gain)

All client-side; `lib/collection.ts` + the gallery already exist.

### 2a. Milestones & set completion  — Effort: M
"10 / 25 / 50 / all," "All 4 Cozy Giants," "Every Legendary!" with a small
celebration (confetti, respecting reduced-motion). Detect on collection change;
remember which milestones were already celebrated (localStorage) so they fire once.

### 2b. Per-set progress in the gallery  — Effort: S
Progress rings/bars per archetype and per rarity ("Tricksters 3/5",
"Legendary 6/18"). Derive from the collected set + `cats` data in `CatsGallery`.

### 2c. Duplicate flavor  — Effort: M
Track per-cat pull counts (extend `lib/collection.ts` from a Set to a count map —
keep back-compat with the existing `string[]` storage). Show "drawn ×3"; optional
"shiny"/alt frame on repeats.

---

## Phase 3 — Reasons to return

### 3a. Daily cat / "Cat of the Day"  — Effort: S–M
Deterministic from the date (no backend): hash `YYYY-MM-DD` → index into `cats`.
Feature it on the homepage; add a lightweight visit streak in localStorage.

### 3b. Result history  — Effort: S
"Your last 5 cats" from localStorage; a small strip on home or in the gallery.

### 3c. PWA install + resume  — Effort: S
`manifest.ts` already exists — add an install nudge and app screenshots so
"Add to Home Screen" is clean. Optionally persist quiz progress to resume.

---

## Phase 4 — Sharing as a growth loop

### 4a. Compare with a friend  — Effort: M
Result state is already URL-encoded. A share link invites a friend to take it,
then a `/compare` view contrasts the two results ("You're both Old Souls" /
"total opposites"). Pass both results via URL; no backend needed.

---

## Phase 5 — Content depth (discovery + SEO + education)

### 5a. Cat encyclopedia pages `/cat/[id]`  — Effort: M
Today the gallery links to the *result* page. Dedicated cat pages (full profile,
trivia, range, and — for the 37 wild species — **conservation status**) are
richer, kid-educational, and add ~89 indexable pages for organic discovery.
**New content needed:** conservation status / range isn't in the data yet — add a
field to `cat_profiles_and_trivia.md` (or a sibling file) and the generator.
Prerender via `generateStaticParams` over `cats`; link from `CatTile` and results.

---

## Phase 6 — Social proof (the one real backend step)

### 6a. Live rarity stats  — Effort: L (needs a backend)
The most powerful shareable hook: "Only 4% of people are Night Owls," "rarest cat
drawn this week," total plays. Requires storing data — a small **Vercel KV** (or
Supabase) with simple increment counters keyed by archetype/cat, written on
`quiz_completed`. No PII; privacy-friendly. Surfaces on the result page and the
gallery. Do this deliberately — it's the only idea that breaks the static model.

---

## Suggested sequence

1. **1a + 1b** (top-3 + why) — quick, high delight, more shareable.
2. **2a + 2b** (milestones + per-set progress) — completes the collection loop.
3. **5a** (`/cat/[id]` encyclopedia) — depth + SEO + the wholesome education angle.
4. **3a** (daily cat) and **4a** (compare-with-a-friend) — return + growth loops.
5. **6a** (Vercel KV live stats) — when ready for a small backend.
