import Image from "next/image";
import { getCat } from "@/lib/data";
import { RARITY_META } from "@/lib/rarity";

// A fanned peek at three cards — a common, a rare, and a legendary — so the
// homepage hints at the collection and the rarity payoff before you begin.
const FAN = [
  { id: "ragdoll", rotate: -11, x: -104, z: 10 },
  { id: "lion", rotate: 0, x: 0, z: 30 },
  { id: "snow_leopard", rotate: 11, x: 104, z: 10 },
];

export function CardFan() {
  const cards = FAN.map((f) => ({ ...f, cat: getCat(f.id) })).filter((f) => f.cat);

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-48 w-72 sm:h-56 sm:w-80"
    >
      {cards.map(({ cat, rotate, x, z }) => {
        if (!cat) return null;
        const meta = RARITY_META[cat.rarity];
        return (
          <div
            key={cat.id}
            className="absolute left-1/2 top-2 h-40 w-32 rounded-2xl border-2 bg-paper p-1.5 shadow-paper-md sm:h-48 sm:w-36"
            style={{
              // calc keeps the card centered on left-1/2 (the inline transform
              // would otherwise override Tailwind's -translate-x-1/2).
              transform: `translateX(calc(-50% + ${x}px)) rotate(${rotate}deg)`,
              zIndex: z,
              borderColor: meta.foil ? "#C9A24B" : meta.accent,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image
                src={cat.image}
                alt=""
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
