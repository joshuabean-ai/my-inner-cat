"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RARITY_META } from "@/lib/rarity";
import type { Rarity } from "@/lib/types";
import { PawMark } from "./PawMark";

/** Just what the fan needs from each cat — keeps cats.json out of the bundle. */
export type FanCat = { id: string; image: string; rarity: Rarity };

const POSITIONS = [
  { rotate: -11, x: -104, z: 10 },
  { rotate: 0, x: 0, z: 30 },
  { rotate: 11, x: 104, z: 10 },
];

function pickThree(pool: FanCat[]): FanCat[] {
  if (pool.length <= 3) return pool.slice(0, 3);
  const chosen = new Set<number>();
  while (chosen.size < 3) chosen.add(Math.floor(Math.random() * pool.length));
  return [...chosen].map((i) => pool[i]);
}

/**
 * The homepage hero fan. Renders three face-down card frames on the server, then
 * deals a random trio from the full roster on the client (fresh every visit),
 * fading each cat in over its frame — a small "drawing your cards" reveal.
 */
export function CardFan({ pool }: { pool: FanCat[] }) {
  const [trio, setTrio] = useState<FanCat[] | null>(null);
  useEffect(() => {
    setTrio(pickThree(pool));
  }, [pool]);

  return (
    <div aria-hidden="true" className="relative mx-auto h-48 w-72 sm:h-56 sm:w-80">
      {POSITIONS.map((pos, i) => {
        const cat = trio?.[i];
        const meta = cat ? RARITY_META[cat.rarity] : null;
        const border = meta ? (meta.foil ? "#C9A24B" : meta.accent) : "#C9C6C3";
        return (
          <div
            key={i}
            className="absolute left-1/2 top-2 h-40 w-32 rounded-2xl border-2 bg-paper p-1.5 shadow-paper-md transition-colors duration-500 sm:h-48 sm:w-36"
            style={{
              transform: `translateX(calc(-50% + ${pos.x}px)) rotate(${pos.rotate}deg)`,
              zIndex: pos.z,
              borderColor: border,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-cream">
              <div className="absolute inset-0 flex items-center justify-center">
                <PawMark className="h-8 w-8 text-dove/40" />
              </div>
              {cat ? (
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 128px, 144px"
                  className="object-cover motion-safe:animate-fade-in"
                  style={{ animationDelay: `${i * 90}ms` }}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
