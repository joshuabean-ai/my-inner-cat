import { RARITY_META } from "@/lib/rarity";
import type { Rarity } from "@/lib/types";

/** The stamped tier medallion that overlaps the portrait on the result card. */
export function RaritySeal({ rarity }: { rarity: Rarity }) {
  const m = RARITY_META[rarity];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-1.5 eyebrow shadow-paper-sm ${
        m.foil
          ? "foil-surface motion-safe:animate-shimmer border-gold/70 text-[#5a4410]"
          : "bg-paper"
      }`}
      style={m.foil ? undefined : { borderColor: m.accent, color: m.ink }}
    >
      <Sparkle className="h-3.5 w-3.5" />
      {m.label}
    </span>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0c.6 5.7 2.3 7.4 8 8-5.7.6-7.4 2.3-8 8-.6-5.7-2.3-7.4-8-8 5.7-.6 7.4-2.3 8-8z" />
    </svg>
  );
}
