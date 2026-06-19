import Image from "next/image";
import Link from "next/link";
import { toSlug } from "@/lib/data";
import { RARITY_META } from "@/lib/rarity";
import type { Cat } from "@/lib/types";

/** A single cat in the gallery grid: a mini collectible card linking to its result. */
export function CatTile({ cat }: { cat: Cat }) {
  const meta = RARITY_META[cat.rarity];

  return (
    <Link
      href={`/result/${toSlug(cat.archetype)}/${toSlug(cat.id)}`}
      className="group flex flex-col rounded-2xl bg-paper p-2 shadow-paper-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-paper-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
    >
      <div
        className={`rounded-xl p-[2px] ${meta.foil ? "foil-surface" : ""}`}
        style={meta.foil ? undefined : { backgroundColor: meta.accent }}
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-[10px] bg-cream">
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 44vw, (max-width: 1024px) 22vw, 200px"
            className="object-cover"
          />
        </div>
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
