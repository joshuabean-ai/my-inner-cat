import { RARITY_META, type DrawOdds } from "@/lib/rarity";
import type { Rarity } from "@/lib/types";

interface RarityScaleProps {
  rarity: Rarity;
  odds: DrawOdds;
  archetypeName: string;
  catName: string;
}

/**
 * Teaches the rarity system at the moment of reveal: a four-step scale plus a
 * plain-language line backed by this cat's real draw odds within its archetype.
 */
export function RarityScale({ rarity, odds, archetypeName, catName }: RarityScaleProps) {
  const m = RARITY_META[rarity];
  const tiers: Rarity[] = ["common", "uncommon", "rare", "legendary"];

  return (
    <div className="rounded-card border border-dove/40 bg-paper/60 p-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {tiers.map((t) => {
            const on = RARITY_META[t].rank <= m.rank;
            return (
              <span
                key={t}
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: on ? m.accent : "transparent",
                  boxShadow: on ? "none" : `inset 0 0 0 1.5px #C9C6C3`,
                }}
              />
            );
          })}
        </div>
        <span className="eyebrow" style={{ color: m.ink }}>
          {m.label} · tier {m.rank} of 4
        </span>
      </div>

      <p className="mt-3 font-body text-base text-pretty text-ink-soft">
        {m.meaning}{" "}
        <span className="text-ink-deep">
          You had about a 1-in-{odds.oneInN} chance of drawing {catName} as{" "}
          {archetypeName} — one of {odds.poolSize} cats you could have become.
        </span>
      </p>
    </div>
  );
}
