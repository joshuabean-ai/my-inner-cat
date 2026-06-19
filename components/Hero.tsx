import Link from "next/link";
import { BeginButton } from "./BeginButton";
import { CardFan } from "./CardFan";

export function Hero() {
  return (
    <div className="flex flex-col items-center text-center animate-fade-up">
      <CardFan />

      <h1 className="mt-10 font-display text-hero font-bold text-ink-deep text-balance">
        My Inner Cat
      </h1>
      <p className="mt-3 font-display text-xl italic text-ink-soft sm:text-2xl">
        Which cat lives in you?
      </p>

      <div className="mt-9">
        <BeginButton />
      </div>

      <Link
        href="/cats"
        className="mt-5 rounded font-body text-sm text-ink-soft underline decoration-dove underline-offset-4 transition-colors hover:text-ink-deep hover:decoration-lavender focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
      >
        or browse all 89 cats
      </Link>

      <p className="eyebrow mt-8 text-ink-whisper">
        A watercolor quiz by Georgia
      </p>
    </div>
  );
}
