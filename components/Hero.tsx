import Link from "next/link";
import { cats } from "@/lib/data";
import { BeginButton } from "./BeginButton";
import { CardFan } from "./CardFan";

// Slim pool passed to the (client) fan — only what it renders, so the full
// cats.json (blurbs/trivia) never ships to the browser.
const fanPool = cats.map((c) => ({ id: c.id, image: c.image, rarity: c.rarity }));

export function Hero() {
  return (
    <div className="flex flex-col items-center text-center animate-fade-up">
      <CardFan pool={fanPool} />

      <h1 className="mt-10 font-display text-[2.75rem] font-bold leading-[1.05] text-ink-deep text-balance sm:text-hero">
        My Inner Cat
      </h1>
      <p className="mt-3 font-display text-lg italic text-ink-soft sm:text-2xl">
        Which cat lives in you?
      </p>

      <div className="mt-9">
        <BeginButton />
      </div>

      <div className="mt-5 flex items-center gap-3 font-body text-sm">
        <Link
          href="/cats"
          className="rounded text-ink-soft underline decoration-dove underline-offset-4 transition-colors hover:text-ink-deep hover:decoration-lavender focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
        >
          Browse all 89 cats
        </Link>
        <span className="text-dove" aria-hidden="true">
          ·
        </span>
        <Link
          href="/about"
          className="rounded text-ink-soft underline decoration-dove underline-offset-4 transition-colors hover:text-ink-deep hover:decoration-lavender focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
        >
          About
        </Link>
      </div>

      <p className="eyebrow mt-8 text-ink-whisper">
        A watercolor quiz by Georgia
      </p>
    </div>
  );
}
