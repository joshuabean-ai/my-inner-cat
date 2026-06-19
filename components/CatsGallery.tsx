"use client";

import { useMemo, useState } from "react";
import type { Archetype, Cat, Rarity } from "@/lib/types";
import { RARITY_META } from "@/lib/rarity";
import { CatTile } from "./CatTile";

type RarityFilter = "all" | Rarity;

const RARITY_FILTERS: { key: RarityFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "common", label: "Common" },
  { key: "uncommon", label: "Uncommon" },
  { key: "rare", label: "Rare" },
  { key: "legendary", label: "Legendary" },
];

interface CatsGalleryProps {
  cats: Cat[];
  archetypes: Archetype[];
}

export function CatsGallery({ cats, archetypes }: CatsGalleryProps) {
  const [rarity, setRarity] = useState<RarityFilter>("all");
  const [archetype, setArchetype] = useState<string>("all");

  const archetypeName = useMemo(
    () => new Map(archetypes.map((a) => [a.id, a.name])),
    [archetypes]
  );

  const shown = useMemo(
    () =>
      cats.filter(
        (c) =>
          (rarity === "all" || c.rarity === rarity) &&
          (archetype === "all" || c.archetype === archetype)
      ),
    [cats, rarity, archetype]
  );

  return (
    <div className="w-full max-w-5xl">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by rarity">
          {RARITY_FILTERS.map(({ key, label }) => {
            const active = rarity === key;
            const accent = key === "all" ? "#6B6B7A" : RARITY_META[key].ink;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRarity(key)}
                aria-pressed={active}
                className="min-h-11 rounded-full border px-4 font-body text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
                style={
                  active
                    ? { backgroundColor: accent, borderColor: accent, color: "#FDFAF3" }
                    : { borderColor: "#C9C6C3", color: "#6B6B7A" }
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-2 font-body text-sm text-ink-soft">
          <span className="sr-only sm:not-sr-only">Archetype</span>
          <select
            value={archetype}
            onChange={(e) => setArchetype(e.target.value)}
            className="min-h-11 rounded-btn border border-dove bg-paper px-3 font-body text-sm text-ink-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
          >
            <option value="all">All archetypes</option>
            {archetypes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-5 eyebrow text-ink-whisper">
        Showing {shown.length} of {cats.length}
        {archetype !== "all" ? ` · ${archetypeName.get(archetype)}` : ""}
      </p>

      {/* Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {shown.map((cat) => (
          <CatTile key={cat.id} cat={cat} />
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 text-center font-body text-ink-soft">
          No cats match these filters.
        </p>
      ) : null}
    </div>
  );
}
