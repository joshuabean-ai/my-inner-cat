import type { Cat, Rarity } from "./types";

/** Weighted-draw weights for variant selection. Higher = more likely. */
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 40,
  uncommon: 30,
  rare: 20,
  legendary: 10,
};

export interface RarityMeta {
  label: string;
  /** 1-4 filled pips on the tier scale. */
  rank: number;
  /** Short, plain meaning for first-time players. */
  meaning: string;
  /** Border / seal accent. */
  accent: string;
  /** Deeper shade for seal text and outlines (AA on the tint). */
  ink: string;
  /** Soft wash behind the card for this tier. */
  tint: string;
  /** Ambient glow color (rgba) for the bloom + seal. */
  glow: string;
  /** Legendary gets the iridescent foil treatment. */
  foil: boolean;
}

export const RARITY_META: Record<Rarity, RarityMeta> = {
  common: {
    label: "Common",
    rank: 1,
    meaning: "A familiar favorite — the cat you're most likely to find.",
    accent: "#B8D4E3",
    ink: "#4D6F80",
    tint: "#EBF2F6",
    glow: "rgba(184, 212, 227, 0.55)",
    foil: false,
  },
  uncommon: {
    label: "Uncommon",
    rank: 2,
    meaning: "A little less often seen — a nice find.",
    accent: "#B5DDC4",
    ink: "#3F7C5E",
    tint: "#E8F4EC",
    glow: "rgba(181, 221, 196, 0.55)",
    foil: false,
  },
  rare: {
    label: "Rare",
    rank: 3,
    meaning: "An uncommon draw — only a handful of these in the album.",
    accent: "#C8B6E2",
    ink: "#67519A",
    tint: "#F0EAF7",
    glow: "rgba(200, 182, 226, 0.6)",
    foil: false,
  },
  legendary: {
    label: "Legendary",
    rank: 4,
    meaning: "The rarest pull in the album. Most people never draw one.",
    accent: "#C9A24B",
    ink: "#8A6A1E",
    tint: "#F6EFDF",
    glow: "rgba(201, 162, 75, 0.55)",
    foil: true,
  },
};

export interface DrawOdds {
  /** Whole-number percent chance of drawing THIS cat within its archetype. */
  percent: number;
  /** Rounded "1 in N" framing of the same probability. */
  oneInN: number;
  /** How many cats share this archetype (the pool you drew from). */
  poolSize: number;
}

/**
 * Probability of having drawn this specific cat, given the weighted pool of
 * all cats in its archetype. This is what makes "Legendary" mean something
 * concrete at the moment of reveal.
 */
export function drawOdds(cat: Cat, archetypeCats: Cat[]): DrawOdds {
  const total = archetypeCats.reduce((s, c) => s + RARITY_WEIGHTS[c.rarity], 0);
  const prob = RARITY_WEIGHTS[cat.rarity] / total;
  return {
    percent: Math.max(1, Math.round(prob * 100)),
    oneInN: Math.max(2, Math.round(1 / prob)),
    poolSize: archetypeCats.length,
  };
}
