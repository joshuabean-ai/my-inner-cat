# My Inner Cat — Build Specification

The operational document for the Claude Code build phase. Everything downstream of this spec assumes its choices.

---

## 1. Project Overview

- **Name**: My Inner Cat
- **Tagline**: Which cat lives in you?
- **Domain**: myinnercat.com
- **What it is**: A watercolor personality quiz. Users answer 10 randomly-pulled scenario questions and are matched to one of 89 cat variants across 20 archetypes.
- **Audience**: General public, ages 10 to 70+
- **Visual identity**: Soft watercolor illustrations, cool dreamy palette, wholesome and inviting

---

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript |
| UI library | React 19 |
| Styling | Tailwind CSS |
| Hosting | Vercel |
| Domain | myinnercat.com (Vercel-managed) |
| OG image generation | `@vercel/og` |
| Analytics | Vercel Analytics (free tier) |
| Database | None. All content is static JSON. Result state is URL-encoded. |

No backend services, no auth, no database. Everything renders from static JSON files committed to the repo, and result URLs are deep-linkable on their own.

---

## 3. File Structure

```
my-inner-cat/
├── app/
│   ├── layout.tsx                  # Root layout, fonts, metadata
│   ├── page.tsx                    # Homepage
│   ├── globals.css                 # Tailwind + custom CSS
│   ├── quiz/
│   │   └── page.tsx                # Quiz flow (client component)
│   ├── result/
│   │   └── [archetype]/
│   │       └── [cat]/
│   │           ├── page.tsx        # Result page
│   │           └── opengraph-image.tsx  # OG card for this result
│   └── api/
│       └── og/
│           └── route.tsx           # Dynamic OG endpoint (alternative)
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ProgressBar.tsx
│   ├── Hero.tsx
│   ├── QuestionCard.tsx
│   ├── AnswerOption.tsx
│   ├── ResultReveal.tsx
│   ├── ShareButton.tsx
│   └── WatercolorBloom.tsx         # Signature ambient element
├── data/
│   ├── archetypes.json
│   ├── cats.json
│   └── questions.json
├── lib/
│   ├── matching.ts                 # The matching engine
│   ├── selection.ts                # Random question + variant selection
│   ├── data.ts                     # Data loading and lookups
│   └── types.ts                    # TypeScript types
├── public/
│   └── cats/
│       └── (89 watercolor PNGs)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Data Architecture

Three JSON files hold everything. Schemas with samples below.

### `data/archetypes.json`

```json
{
  "archetypes": [
    {
      "id": "cozy_giant",
      "name": "The Cozy Giant",
      "description": "You're the friend people text when something hard happens. You don't panic, you don't perform, and you don't run out of patience. Big rooms tire you out, but small circles of people you love can hold you all day. People put themselves back together faster around you, and they usually don't realize you're the reason.",
      "tagline": "The friend you text first when things go wrong."
    }
  ]
}
```

20 entries total. Source content: `cat_profiles_and_trivia.md` and the taglines list.

### `data/cats.json`

```json
{
  "cats": [
    {
      "id": "ragdoll",
      "name": "Ragdoll",
      "archetype": "cozy_giant",
      "rarity": "common",
      "blurb": "Famously gentle and floppy. Ragdolls will literally go limp in your arms when you pick them up, like they trust you to handle the rest. They're indoor cats by temperament and they bond deeply to one or two people for life.",
      "trivia": "The breed gets its name from this go-limp behavior, which first appeared in the founding queen, Josephine, in 1960s California and has been carried in every Ragdoll line since.",
      "image": "/cats/cozy-giant-ragdoll-common.png"
    }
  ]
}
```

89 entries total. `rarity` is one of `common` | `uncommon` | `rare` | `legendary`. Source content: `cat_profiles_and_trivia.md`.

### `data/questions.json`

```json
{
  "questions": [
    {
      "id": "q1",
      "title": "The party arrival",
      "setup": "You walk into a friend's party. Twenty people are already there and the room is loud.",
      "answers": [
        {
          "id": "q1a",
          "text": "Scan for someone you already know, post up near them, stay there.",
          "tags": ["cozy_giant", "quiet_mystic", "soft_hearted_charmer"]
        },
        {
          "id": "q1b",
          "text": "Find the friend who invited you, get the lay of the land, ease in.",
          "tags": ["steady_companion", "old_soul", "cozy_giant"]
        }
      ]
    }
  ]
}
```

27 entries total. Source content: `cat_quiz_scoring_tags.md`.

### `lib/types.ts`

```typescript
export type Rarity = "common" | "uncommon" | "rare" | "legendary";

export interface Archetype {
  id: string;
  name: string;
  description: string;
  tagline: string;
}

export interface Cat {
  id: string;
  name: string;
  archetype: string;
  rarity: Rarity;
  blurb: string;
  trivia: string;
  image: string;
}

export interface Answer {
  id: string;
  text: string;
  tags: string[];
}

export interface Question {
  id: string;
  title: string;
  setup: string;
  answers: Answer[];
}

export interface UserAnswer {
  questionId: string;
  answer: Answer;
}
```

---

## 5. Page Routes & User Flow

### Routes

| Path | Purpose |
|---|---|
| `/` | Homepage with name, tagline, "Begin" CTA |
| `/quiz` | Quiz flow, one question at a time |
| `/result/[archetype]/[cat]` | Result page. Deep-linkable. |

### User journey

1. User arrives on `/`. Sees the hero with name, tagline, and a CTA button.
2. Clicks **Begin** → routed to `/quiz`.
3. Quiz pulls 10 random questions from the pool of 27 (in random order) and presents them one at a time with a progress indicator.
4. Each answer click stores the answer and advances. No back button by design — keeps the quiz lightweight and prevents over-thinking.
5. After answer 10, the matching engine runs locally, selects an archetype, weighted-picks a variant cat, and routes to `/result/{archetype}/{cat}`.
6. Result page shows the watercolor cat illustration, archetype name, cat name and rarity, archetype description, cat blurb, and trivia. Share button and "Take it again" button below.
7. Sharing produces a URL like `myinnercat.com/result/cozy-giant/ragdoll` which anyone can open and see the same result, including a custom OG image for the link preview.

### Wireframes (ASCII)

**Homepage:**
```
+--------------------------------------+
|                                       |
|                                       |
|    (ambient watercolor bloom drifts)  |
|                                       |
|           My Inner Cat                |
|       Which cat lives in you?         |
|                                       |
|         [   Begin   ]                 |
|                                       |
|        a watercolor quiz              |
|                                       |
+--------------------------------------+
```

**Quiz page:**
```
+--------------------------------------+
|  ▓▓▓░░░░░░░  3 of 10                  |
|                                       |
|  The party arrival                    |
|                                       |
|  You walk into a friend's party.      |
|  Twenty people are already there      |
|  and the room is loud.                |
|                                       |
|  ┌───────────────────────────────┐    |
|  │ Scan for someone you know...  │    |
|  └───────────────────────────────┘    |
|  ┌───────────────────────────────┐    |
|  │ Find the friend who invited.. │    |
|  └───────────────────────────────┘    |
|  ┌───────────────────────────────┐    |
|  │ Make a slow lap, see who...   │    |
|  └───────────────────────────────┘    |
|  ┌───────────────────────────────┐    |
|  │ Head straight for the snacks. │    |
|  └───────────────────────────────┘    |
+--------------------------------------+
```

**Result page:**
```
+--------------------------------------+
|                                       |
|    +----------------------------+     |
|    |                            |     |
|    | (watercolor cat image)     |     |
|    |                            |     |
|    +----------------------------+     |
|                                       |
|        You are The Cozy Giant         |
|         Ragdoll · Common              |
|                                       |
|  The friend you text first when       |
|  things go wrong.                     |
|                                       |
|  [archetype description, 4 sentences] |
|                                       |
|  [cat blurb, 2-3 sentences about      |
|   why the Ragdoll specifically]       |
|                                       |
|  Did you know?                        |
|  [cat trivia, 1-2 sentences]          |
|                                       |
|  [  Share  ]   [  Take it again  ]    |
|                                       |
+--------------------------------------+
```

---

## 6. Component Architecture

### Homepage components

- `<Hero />` — title, tagline, CTA button
- `<WatercolorBloom />` — signature ambient element, soft-shifts position over time
- `<Footer />` — minimal: small "myinnercat.com" mark and a link to retake/share

### Quiz components

- `<QuizFlow />` — client component, manages quiz state
- `<ProgressBar />` — visual progress, e.g., `3 of 10`
- `<QuestionCard />` — title, setup, list of `<AnswerOption />` children
- `<AnswerOption />` — clickable tile with answer text

### Result components

- `<ResultReveal />` — orchestrates the reveal layout
- `<CatPortrait />` — the watercolor image with subtle entrance animation
- `<ShareButton />` — Web Share API on mobile, copy-to-clipboard fallback on desktop
- `<RetakeButton />` — links back to `/quiz`

### Shared UI

- `<Button />` — primary, secondary, ghost variants
- `<Card />` — soft-edged container with watercolor paper feel

---

## 7. Matching Engine Algorithm

The core of the app. Lives in `lib/matching.ts`. Pure functions, no side effects, fully testable.

```typescript
import type { Cat, UserAnswer, Rarity } from "./types";

/**
 * Determines the matched archetype based on the user's answers.
 * Returns the archetype ID.
 */
export function matchArchetype(userAnswers: UserAnswer[]): string {
  // 1. Tally tag counts
  const tagCounts: Record<string, number> = {};
  for (const ua of userAnswers) {
    for (const tag of ua.answer.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }

  // 2. Find the highest-scoring archetype(s)
  const maxCount = Math.max(...Object.values(tagCounts));
  const topArchetypes = Object.keys(tagCounts).filter(
    (k) => tagCounts[k] === maxCount
  );

  if (topArchetypes.length === 1) return topArchetypes[0];

  // 3. Tie-breaking: count "narrow" answers (3-tag answers) per tied archetype
  // A 3-tag answer is a stronger personality signal than a 4 or 5-tag answer.
  const narrowScore: Record<string, number> = Object.fromEntries(
    topArchetypes.map((a) => [a, 0])
  );

  for (const ua of userAnswers) {
    if (ua.answer.tags.length === 3) {
      for (const tag of ua.answer.tags) {
        if (tag in narrowScore) {
          narrowScore[tag]++;
        }
      }
    }
  }

  // 4. Sort by narrow score (descending), then by tag-order as final tiebreak
  const sorted = [...topArchetypes].sort(
    (a, b) => narrowScore[b] - narrowScore[a]
  );
  return sorted[0];
}

/**
 * Weighted-random selection of a variant cat from a matched archetype.
 * Rarity weights: common 40, uncommon 30, rare 20, legendary 10.
 */
export function selectVariant(archetypeId: string, allCats: Cat[]): Cat {
  const archetypeCats = allCats.filter((c) => c.archetype === archetypeId);
  if (archetypeCats.length === 0) {
    throw new Error(`No cats found for archetype: ${archetypeId}`);
  }

  const weights: Record<Rarity, number> = {
    common: 40,
    uncommon: 30,
    rare: 20,
    legendary: 10,
  };

  // Build a weighted pool
  const pool: Cat[] = [];
  for (const cat of archetypeCats) {
    const w = weights[cat.rarity];
    for (let i = 0; i < w; i++) pool.push(cat);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}
```

### Question selection (`lib/selection.ts`)

```typescript
import type { Question } from "./types";

/**
 * Returns N randomly-selected questions from the full pool, in random order.
 */
export function selectQuestions(
  allQuestions: Question[],
  n: number = 10
): Question[] {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
```

---

## 8. Share Card / OG Image Generation

Each result page generates a custom OpenGraph image so when someone shares a URL on Twitter, iMessage, Slack, etc., the preview shows the watercolor cat + name + archetype + tagline.

### Approach

Use Next.js's built-in OG image route convention. Inside the dynamic result route directory, create an `opengraph-image.tsx` file that exports a default function returning an `ImageResponse`.

```typescript
// app/result/[archetype]/[cat]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getArchetype, getCat } from "@/lib/data";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: { archetype: string; cat: string };
}) {
  const archetype = getArchetype(params.archetype);
  const cat = getCat(params.cat);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F8F4ED",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: 64,
          fontFamily: "Fraunces",
        }}
      >
        <img
          src={`https://myinnercat.com${cat.image}`}
          width={400}
          height={400}
          style={{ borderRadius: 24 }}
        />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 48 }}>
          <p style={{ fontSize: 32, color: "#6B6B7A" }}>You are</p>
          <h1 style={{ fontSize: 72, color: "#3A3A4A", margin: 0 }}>
            {archetype.name}
          </h1>
          <p style={{ fontSize: 40, color: "#3A3A4A", marginTop: 16 }}>
            {cat.name}
          </p>
          <p style={{ fontSize: 24, color: "#6B6B7A", marginTop: 32 }}>
            myinnercat.com
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

This generates a 1200x630 image at request time (cached at the edge afterward).

### Metadata for share previews

In each result page, configure metadata:

```typescript
// app/result/[archetype]/[cat]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const archetype = getArchetype(params.archetype);
  const cat = getCat(params.cat);

  return {
    title: `${cat.name} · ${archetype.name} · My Inner Cat`,
    description: `${archetype.tagline} Take the quiz at myinnercat.com.`,
    openGraph: {
      title: `I'm ${cat.name}`,
      description: archetype.tagline,
      url: `https://myinnercat.com/result/${params.archetype}/${params.cat}`,
      siteName: "My Inner Cat",
    },
    twitter: {
      card: "summary_large_image",
      title: `I'm ${cat.name}`,
      description: archetype.tagline,
    },
  };
}
```

---

## 9. Design System

### Palette

Committed hex values. Defined in `tailwind.config.ts` and `globals.css`.

| Token | Hex | Purpose |
|---|---|---|
| `cream` | `#F8F4ED` | Page background, warm cream paper |
| `paper` | `#FDFAF3` | Cards and surfaces, slightly lighter than bg |
| `lavender` | `#C8B6E2` | Primary accent |
| `sky` | `#B8D4E3` | Secondary accent |
| `mint` | `#B5DDC4` | Tertiary accent |
| `dove` | `#C9C6C3` | Subtle dividers and disabled states |
| `ink-deep` | `#3A3A4A` | Body text, headings, deep slate (not black) |
| `ink-soft` | `#6B6B7A` | Secondary text, captions |
| `ink-whisper` | `#9A9AA8` | Tertiary text, footnotes |

**Design note**: the palette is warm cream + cool accents. The warmth of the cream prevents the design from reading clinical or sterile; the cool accents (lavender, sky, mint) keep it from falling into the AI-default warm-cream-with-terracotta look. The ink color is a deep slate rather than pure black, which keeps everything soft.

### Typography

Two faces, used deliberately.

**Display: Fraunces**
- Use weights 600 and 700 only
- Use the SOFT optical-size axis where supported (Fraunces has variable axes)
- Heading sizes: 56px (hero), 40px (page titles), 32px (section titles)
- Slight letter-spacing of -0.01em on the largest sizes for cohesion

**Body: Geist**
- Use weights 400 and 500
- Body text: 18px on desktop, 16px on mobile
- Line height: 1.6
- Caption/label text: 14px

**Loading**: Use `next/font/google` to self-host Fraunces and Geist for performance and stability.

```typescript
// app/layout.tsx
import { Fraunces, Geist } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fraunces",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist",
});
```

### Spacing

Base 4px grid. Use Tailwind's default scale where it aligns: 1, 2, 3, 4, 6, 8, 12, 16, 24, 32. Avoid arbitrary pixel values in code.

### Border radius

- Buttons: 12px
- Cards: 16px
- Cat portrait frame: 24px
- Watercolor bloom shapes: organic, drawn from SVG path

Avoid hard 90-degree corners. They break the watercolor metaphor.

### Shadows

Use shadows sparingly. The default is `shadow-sm` (subtle, like paper on paper). Avoid heavy drop shadows.

For elevated cards: `shadow-md` with a tint toward lavender rather than gray.

### Motion

- Page transitions: 400ms ease-out for fades and slides
- Button hover: 150ms ease-out
- Watercolor bloom: drifts very slowly across hero and result pages (60 to 90 seconds per cycle), respects `prefers-reduced-motion`
- Cat portrait entrance on result page: soft scale-in from 0.95 to 1.0 with opacity, 600ms ease-out

All animation must check `prefers-reduced-motion` and disable smoothly.

### Signature element: the watercolor bloom

A subtle ambient SVG element that lives behind the hero on the homepage and behind the result reveal. Implemented as an SVG with several overlapping organic blobs, each filled with a translucent gradient drawing from the palette (lavender + sky + mint), with the blobs slowly shifting position via CSS animation.

This is what people will remember. Keep it understated. It should never compete with the cat illustration.

```tsx
// components/WatercolorBloom.tsx (conceptual)
<svg className="absolute inset-0 -z-10 opacity-40 motion-safe:animate-drift">
  <g filter="url(#watercolor-blur)">
    <ellipse cx="30%" cy="40%" rx="180" ry="120" fill="var(--lavender)" />
    <ellipse cx="65%" cy="55%" rx="160" ry="140" fill="var(--sky)" />
    <ellipse cx="50%" cy="70%" rx="200" ry="110" fill="var(--mint)" />
  </g>
  <defs>
    <filter id="watercolor-blur"><feGaussianBlur stdDeviation="40" /></filter>
  </defs>
</svg>
```

---

## 10. Performance & Accessibility

### Performance

- All cat images use `next/image` with `priority` on the result page hero and lazy-loading elsewhere
- All pages statically generated at build time
- The result route uses `generateStaticParams` to pre-render the full archetype × cat matrix (89 result pages)
- No client-side data fetching during quiz or result; all JSON imported at build time
- Target Lighthouse scores: 95+ across all four metrics

### Accessibility

- All interactive elements reachable by keyboard
- Visible focus rings (lavender outline) on all focusable elements
- All images have meaningful alt text (cat name + archetype)
- Color contrast: text on cream/paper meets WCAG AA minimum
- `prefers-reduced-motion` disables the watercolor bloom drift and the cat portrait scale-in
- Touch targets minimum 44x44px (Tailwind `min-h-11`)
- Semantic HTML throughout: actual `<button>`, `<nav>`, `<main>`, `<article>` etc.

---

## 11. Analytics

Vercel Analytics free tier gives page views, top pages, referrers. Add it via `@vercel/analytics`.

Custom events to track (via `track()` from the same package):

| Event | When fired |
|---|---|
| `quiz_started` | User clicks "Begin" on homepage |
| `quiz_completed` | Result page renders for the first time |
| `result_shared` | User clicks share button |
| `quiz_retaken` | User clicks "Take it again" from a result page |

Track the matched archetype on `quiz_completed` events so you can monitor distribution over time and tune the matching engine. This is what tells you whether Old Soul is over-matching or Night Owl under-matching in the wild.

---

## 12. Claude Code Session Plan

Eight focused sessions. Each has a clean scope finishable in one focused work block (usually 1 to 2 hours). Run them in order.

### Session 1 — Scaffold and data

- Initialize a Next.js project with TypeScript and Tailwind
- Set up the file structure described in section 3
- Convert `cat_profiles_and_trivia.md`, `cat_quiz_scoring_tags.md`, and the taglines list into the three JSON files in `data/`
- Place all 89 cat illustrations into `public/cats/` with the naming convention `archetype-cat-rarity.png`
- Set up `lib/types.ts` and `lib/data.ts` for type-safe data access
- Verify the JSON loads correctly with a smoke-test script

**Done when**: the project builds cleanly, types are sound, and `import { archetypes, cats, questions } from "@/lib/data"` works.

### Session 2 — Design system

- Configure `tailwind.config.ts` with the custom colors, font variables, spacing scale
- Set up `next/font/google` for Fraunces and Geist
- Build the base UI components: `<Button />`, `<Card />`, `<ProgressBar />`
- Build the `<WatercolorBloom />` signature component
- Set up `globals.css` with custom properties and base styles

**Done when**: A throwaway page can render the buttons, cards, and bloom in the right palette and fonts.

### Session 3 — Homepage

- Build `<Hero />` with the title, tagline, and CTA
- Compose homepage with `<WatercolorBloom />` behind the hero
- Wire the CTA to navigate to `/quiz`
- Add metadata for the homepage (title, description, OG defaults)

**Done when**: `/` renders, looks like the wireframe, and clicking Begin takes you to `/quiz`.

### Session 4 — Quiz flow

- Build `<QuestionCard />` and `<AnswerOption />`
- Build the `<QuizFlow />` client component that manages state: which questions, current index, answers so far
- Wire random question selection on quiz start using `selectQuestions()`
- On answer click, store the answer and advance
- After question 10, run the matching engine and navigate to the result URL

**Done when**: you can complete a quiz and land on a result URL.

### Session 5 — Matching engine

- Implement `matchArchetype()` and `selectVariant()` in `lib/matching.ts`
- Implement `selectQuestions()` in `lib/selection.ts`
- Write unit tests (Vitest) for both, covering: clear win, tie-breaking, variant weighting distribution
- Verify edge cases: all answers tag the same archetype, no answers tag any shared archetype

**Done when**: the engine is tested, and the quiz flow from session 4 produces sensible results.

### Session 6 — Result page

- Build `<ResultReveal />` with cat portrait, archetype name, cat name, rarity, blurb, trivia
- Add the entrance animation respecting `prefers-reduced-motion`
- Build `<ShareButton />` with Web Share API and clipboard fallback
- Build `<RetakeButton />` linking back to `/quiz`
- Set up `generateStaticParams` so all 89 result pages pre-render at build time

**Done when**: `/result/cozy-giant/ragdoll` (and all 88 others) renders fully, looks like the wireframe, and shares correctly.

### Session 7 — OG image and metadata

- Create `app/result/[archetype]/[cat]/opengraph-image.tsx`
- Wire dynamic OG image generation with cat illustration, archetype name, cat name
- Configure per-page `generateMetadata` for clean Twitter and OG previews
- Test with a deployed staging URL by pasting into Twitter, iMessage, Slack to verify the previews render

**Done when**: any result URL produces a watercolor cat preview when shared.

### Session 8 — Polish and deploy

- Run a Lighthouse audit on homepage, quiz, and a result page; fix anything below 95
- Verify accessibility: keyboard nav, screen reader sweep, color contrast spot-checks
- Mobile responsiveness check across iPhone, Android, iPad breakpoints
- Set up Vercel Analytics
- Connect myinnercat.com domain to the Vercel project
- Production deploy
- Smoke-test in production: quiz, share, retake

**Done when**: myinnercat.com is live, fast, accessible, and shareable.

---

## 13. Open Questions for Build Time

A few decisions deliberately left open for the actual build, because they're easier to make once code exists to react to.

- **Whether to add a `/about` page**. Probably useful to explain the watercolor art and the project. Can be added in a post-launch session.
- **Whether to add a gallery of all cats**. Could be fun for the collectability angle. Add only if you want to.
- **Whether to add an admin path for tag-tuning**. Probably overkill for v1. Just edit `questions.json` directly when you want to rebalance.
- **Whether to send a result to email or save it somewhere**. Avoid for v1 to keep things simple. Sharing is the social loop.

---

*End of build spec. The next step after this is to start Session 1 with Claude Code.*
