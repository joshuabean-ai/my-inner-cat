import { getCatsByArchetype, toSlug } from "@/lib/data";
import { RARITY_META, drawOdds } from "@/lib/rarity";
import type { Archetype, Cat } from "@/lib/types";
import { CatPortrait } from "./CatPortrait";
import { RaritySeal } from "./RaritySeal";
import { RarityScale } from "./RarityScale";
import { RecordPull } from "./RecordPull";
import { ShareButton } from "./ShareButton";
import { RetakeButton } from "./RetakeButton";

interface ResultRevealProps {
  archetype: Archetype;
  cat: Cat;
  shareUrl: string;
}

export function ResultReveal({ archetype, cat, shareUrl }: ResultRevealProps) {
  const meta = RARITY_META[cat.rarity];
  const odds = drawOdds(cat, getCatsByArchetype(cat.archetype));
  const originLabel = cat.origin === "wild" ? "Wild species" : "Domestic breed";
  const cardImageUrl = `/api/card/${toSlug(archetype.id)}/${toSlug(cat.id)}`;

  return (
    <article className="w-full max-w-xl">
      {/* Archetype identity — the personality reveal, its own quiet moment. */}
      <header className="text-center animate-fade-up">
        <p className="eyebrow text-ink-whisper">You are</p>
        <h1 className="mt-1 font-display text-page-title font-bold text-ink-deep text-balance">
          {archetype.name}
        </h1>
        <p className="mt-2 font-display text-xl italic text-ink-soft text-balance">
          {archetype.tagline}
        </p>
      </header>

      {/* The collectible card — the cat you drew, framed by its rarity. */}
      <div
        className="relative mt-7 rounded-portrait border-2 bg-paper p-4 sm:p-5"
        style={{
          borderColor: meta.accent,
          boxShadow: `0 14px 44px -14px ${meta.glow}`,
        }}
      >
        {meta.foil ? (
          <div className="foil-surface rounded-[22px] p-[3px] motion-safe:animate-shimmer">
            <CatPortrait src={cat.image} alt={`${cat.name} — ${archetype.name}`} />
          </div>
        ) : (
          <div className="rounded-[22px] p-[3px]" style={{ backgroundColor: meta.accent }}>
            <CatPortrait src={cat.image} alt={`${cat.name} — ${archetype.name}`} />
          </div>
        )}

        <div className="-mt-5 flex justify-center motion-safe:animate-stamp">
          <RaritySeal rarity={cat.rarity} />
        </div>

        <div className="mt-3 pb-1 text-center">
          <h2 className="font-display text-[2.25rem] font-bold leading-none text-ink-deep text-balance">
            {cat.name}
          </h2>
          <p className="eyebrow mt-3 text-ink-soft">{originLabel}</p>
        </div>
      </div>

      <RecordPull catId={cat.id} />

      {/* Teach the rarity system with this cat's real odds. */}
      <div className="mt-7">
        <RarityScale
          rarity={cat.rarity}
          odds={odds}
          archetypeName={archetype.name}
          catName={cat.name}
        />
      </div>

      {/* The writing: who this archetype is, then why this specific cat. */}
      <div className="mt-7 space-y-6 font-body text-lg leading-relaxed">
        <p className="text-pretty text-ink-deep">{archetype.description}</p>
        <div>
          <h3 className="font-display text-lg font-semibold text-ink-deep">
            Why a {cat.name}?
          </h3>
          <p className="mt-1 text-pretty text-ink-soft">{cat.blurb}</p>
        </div>
      </div>

      <div
        className="mt-7 rounded-card border border-dove/50 p-5"
        style={{ backgroundColor: meta.tint }}
      >
        <p className="eyebrow text-ink-soft">Did you know</p>
        <p className="mt-1.5 font-body text-base text-pretty text-ink-deep">
          {cat.trivia}
        </p>
      </div>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <ShareButton
          url={shareUrl}
          cardImageUrl={cardImageUrl}
          fileName={`my-inner-cat-${toSlug(cat.id)}.png`}
          title={`I'm a ${cat.name}`}
          text={`I'm ${archetype.name} — specifically a ${meta.label} ${cat.name}. Which cat lives in you?`}
        />
        <RetakeButton />
      </div>
    </article>
  );
}
