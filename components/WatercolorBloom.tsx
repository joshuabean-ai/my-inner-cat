/**
 * Signature ambient element: a soft watercolor wash that drifts very slowly
 * behind the hero and result reveal. Purely decorative; hidden from assistive
 * tech and frozen under prefers-reduced-motion (handled globally in globals.css).
 *
 * Built from layered CSS radial gradients (not an SVG blur filter): the soft
 * transparent falloff gives the wash for free, composites cleanly, and avoids
 * the iOS Safari repaint glitches that large animated `feGaussianBlur` layers
 * cause — which could leave the header blank on scroll. `fixed` keeps it pinned
 * to the viewport so the wash stays consistent on long result pages.
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
  const layers = [
    "radial-gradient(38% 34% at 26% 28%, #C8B6E2 0%, rgba(200,182,226,0) 70%)",
    "radial-gradient(36% 36% at 72% 42%, #B8D4E3 0%, rgba(184,212,227,0) 70%)",
    "radial-gradient(46% 32% at 46% 76%, #B5DDC4 0%, rgba(181,221,196,0) 70%)",
  ];
  if (tint) {
    layers.unshift(`radial-gradient(50% 44% at 56% 34%, ${tint} 0%, transparent 72%)`);
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-[-12%] opacity-70 motion-safe:animate-drift"
        style={{
          backgroundImage: layers.join(", "),
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
