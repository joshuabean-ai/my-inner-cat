"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { Archetype, Cat, Rarity } from "@/lib/types";
import { RARITY_META } from "@/lib/rarity";
import {
  COLLECTION_EVENT,
  clearCollected,
  collectedSnapshot,
} from "@/lib/collection";
import { CatTile } from "./CatTile";

type RarityFilter = "all" | Rarity;
type StatusFilter = "all" | "collected" | "locked";

const RARITY_FILTERS: { key: RarityFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "common", label: "Common" },
  { key: "uncommon", label: "Uncommon" },
  { key: "rare", label: "Rare" },
  { key: "legendary", label: "Legendary" },
];

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "collected", label: "Collected" },
  { key: "locked", label: "Not yet" },
];

function useCollectedSet(): Set<string> {
  const snap = useSyncExternalStore(
    (cb) => {
      window.addEventListener(COLLECTION_EVENT, cb);
      window.addEventListener("storage", cb);
      return () => {
        window.removeEventListener(COLLECTION_EVENT, cb);
        window.removeEventListener("storage", cb);
      };
    },
    collectedSnapshot,
    () => "[]"
  );
  return useMemo(() => new Set<string>(JSON.parse(snap) as string[]), [snap]);
}

interface CatsGalleryProps {
  cats: Cat[];
  archetypes: Archetype[];
}

export function CatsGallery({ cats, archetypes }: CatsGalleryProps) {
  const [rarity, setRarity] = useState<RarityFilter>("all");
  const [archetype, setArchetype] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Collection state only exists on the client; gate on `mounted` so server and
  // first client render match (everything neutral) before applying status.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const collected = useCollectedSet();
  const count = collected.size;

  const archetypeName = useMemo(
    () => new Map(archetypes.map((a) => [a.id, a.name])),
    [archetypes]
  );

  const shown = useMemo(
    () =>
      cats.filter((c) => {
        if (rarity !== "all" && c.rarity !== rarity) return false;
        if (archetype !== "all" && c.archetype !== archetype) return false;
        if (mounted && statusFilter === "collected" && !collected.has(c.id)) return false;
        if (mounted && statusFilter === "locked" && collected.has(c.id)) return false;
        return true;
      }),
    [cats, rarity, archetype, statusFilter, mounted, collected]
  );

  const pct = Math.round((count / cats.length) * 100);

  return (
    <div className="w-full max-w-5xl">
      {/* Collection progress */}
      {mounted ? (
        <div className="mb-7 rounded-card border border-dove/40 bg-paper/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="font-body text-sm text-ink-deep">
              You&apos;ve collected{" "}
              <span className="font-medium">{count}</span> of {cats.length} cats
            </p>
            {count > 0 ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Reset your collection? This can't be undone.")) {
                    clearCollected();
                  }
                }}
                className="rounded font-body text-xs text-ink-whisper underline underline-offset-2 transition-colors hover:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
              >
                Reset
              </button>
            ) : null}
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-dove/40">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {count === 0 ? (
            <p className="mt-2 font-body text-xs text-ink-whisper">
              Take the quiz to start collecting — each cat you draw is added here.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Filters */}
      <div className="flex flex-col gap-4">
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

        <div className="flex flex-wrap items-center justify-between gap-3">
          {mounted ? (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by collection status">
              {STATUS_FILTERS.map(({ key, label }) => {
                const active = statusFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatusFilter(key)}
                    aria-pressed={active}
                    className={`min-h-11 rounded-full border px-4 font-body text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender ${
                      active
                        ? "border-lavender bg-lavender text-ink-deep"
                        : "border-dove text-ink-soft"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : (
            <span />
          )}

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
      </div>

      <p className="mt-5 eyebrow text-ink-whisper">
        Showing {shown.length} of {cats.length}
        {archetype !== "all" ? ` · ${archetypeName.get(archetype)}` : ""}
      </p>

      {/* Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {shown.map((cat) => (
          <CatTile
            key={cat.id}
            cat={cat}
            status={mounted ? (collected.has(cat.id) ? "collected" : "locked") : undefined}
          />
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
