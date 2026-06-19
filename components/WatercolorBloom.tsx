/**
 * Signature ambient element. Several overlapping organic blobs filled with
 * translucent palette gradients, blurred into a soft watercolor wash that
 * drifts very slowly. Purely decorative; hidden from assistive tech and
 * frozen under prefers-reduced-motion (handled globally in globals.css).
 *
 * `tint` (an rgba string) lets the result page wash the bloom toward the
 * matched cat's rarity color, so each result feels subtly different.
 */
export function WatercolorBloom({
  className = "",
  tint,
}: {
  className?: string;
  tint?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <svg
        className="h-full w-full opacity-50 motion-safe:animate-drift"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="watercolor-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="55" />
          </filter>
          <radialGradient id="bloom-lavender" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8B6E2" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C8B6E2" stopOpacity="0.15" />
          </radialGradient>
          <radialGradient id="bloom-sky" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B8D4E3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#B8D4E3" stopOpacity="0.15" />
          </radialGradient>
          <radialGradient id="bloom-mint" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B5DDC4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#B5DDC4" stopOpacity="0.15" />
          </radialGradient>
        </defs>
        <g filter="url(#watercolor-blur)">
          <ellipse cx="220" cy="220" rx="200" ry="160" fill="url(#bloom-lavender)" />
          <ellipse cx="560" cy="320" rx="190" ry="180" fill="url(#bloom-sky)" />
          <ellipse cx="400" cy="450" rx="230" ry="150" fill="url(#bloom-mint)" />
          {tint ? (
            <ellipse cx="430" cy="270" rx="260" ry="200" fill={tint} />
          ) : null}
        </g>
      </svg>
    </div>
  );
}
