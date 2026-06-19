import Image from "next/image";
import Link from "next/link";
import { toSlug } from "@/lib/data";
import { RARITY_META } from "@/lib/rarity";
import type { Cat } from "@/lib/types";

type Status = "collected" | "locked";

/** A single cat in the gallery grid: a mini collectible card linking to its result. */
export function CatTile({ cat, status }: { cat: Cat; status?: Status }) {
  const meta = RARITY_META[cat.rarity];
  const locked = status === "locked";
  const collected = status === "collected";

  return (
    <Link
      href={`/result/${toSlug(cat.archetype)}/${toSlug(cat.id)}`}
      className="group flex flex-col rounded-2xl bg-paper p-2 shadow-paper-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-paper-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
    >
      <div
        className={`relative rounded-xl p-[2px] ${meta.foil ? "foil-surface" : ""}`}
        style={meta.foil ? undefined : { backgroundColor: meta.accent }}
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-[10px] bg-cream">
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 44vw, (max-width: 1024px) 22vw, 200px"
            className={`object-cover transition-[filter,opacity] duration-300 ${
              locked ? "opacity-80 saturate-[0.7]" : ""
            }`}
          />
        </div>

        {collected ? (
          <span
            aria-label="Collected"
            className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-paper bg-gold text-[0.7rem] font-bold text-paper shadow-paper-sm"
          >
            ✓
          </span>
        ) : null}
        {locked ? (
          <span
            aria-label="Not collected yet"
            className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink-deep/35 text-[0.6rem] text-paper backdrop-blur-sm"
          >
            ✦
          </span>
        ) : null}
      </div>

      <div className="px-1 pb-1 pt-2">
        <p className="font-display text-base font-semibold leading-tight text-ink-deep">
          {cat.name}
        </p>
        <p className="eyebrow mt-1 text-[0.6rem]" style={{ color: meta.ink }}>
          {meta.label}
        </p>
      </div>
    </Link>
  );
}
