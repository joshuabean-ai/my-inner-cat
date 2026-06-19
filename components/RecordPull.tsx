"use client";

import { useEffect, useState } from "react";
import { addCollected, consumePullFlag, getCollected } from "@/lib/collection";

/**
 * Records a cat into the collection — but only when this result was just drawn
 * by the quiz (flagged in sessionStorage), never on a browsed or shared link.
 * Shows a small confirmation when it happens.
 */
export function RecordPull({ catId }: { catId: string }) {
  const [state, setState] = useState<"idle" | "new" | "have">("idle");

  useEffect(() => {
    const pulled = consumePullFlag();
    const already = getCollected().includes(catId);

    if (pulled === catId) {
      addCollected(catId);
      setState(already ? "have" : "new");
    } else if (already) {
      setState("have");
    }
  }, [catId]);

  if (state === "idle") return null;

  return (
    <p className="mt-4 text-center animate-fade-up">
      <span
        className={`eyebrow inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${
          state === "new"
            ? "foil-surface border-gold/60 text-[#5a4410]"
            : "border-mint bg-paper text-[#3F7C5E]"
        }`}
      >
        {state === "new" ? "✦ New to your collection" : "✓ Already collected"}
      </span>
    </p>
  );
}
