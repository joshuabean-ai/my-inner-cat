import type { Cat, UserAnswer } from "./types";
import { RARITY_WEIGHTS } from "./rarity";

/**
 * Determines the matched archetype based on the user's answers.
 * Returns the archetype ID.
 */
export function matchArchetype(userAnswers: UserAnswer[]): string {
  // 1. Tally tag counts
  const tagCounts: Record<string, number> = {};
  for (const ua of userAnswers) {
    for (const tag of ua.answer.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }

  const tags = Object.keys(tagCounts);
  if (tags.length === 0) {
    throw new Error("Cannot match an archetype: no tags present in answers.");
  }

  // 2. Find the highest-scoring archetype(s)
  const maxCount = Math.max(...Object.values(tagCounts));
  const topArchetypes = tags.filter((k) => tagCounts[k] === maxCount);

  if (topArchetypes.length === 1) return topArchetypes[0];

  // 3. Tie-breaking: count "narrow" answers (3-tag answers) per tied archetype.
  // A 3-tag answer is a stronger personality signal than a 4 or 5-tag answer.
  const narrowScore: Record<string, number> = Object.fromEntries(
    topArchetypes.map((a) => [a, 0])
  );

  for (const ua of userAnswers) {
    if (ua.answer.tags.length === 3) {
      for (const tag of ua.answer.tags) {
        if (tag in narrowScore) {
          narrowScore[tag]++;
        }
      }
    }
  }

  // 4. Sort by narrow score (descending). Tie-order in topArchetypes acts as
  // the final, deterministic tiebreak.
  const sorted = [...topArchetypes].sort(
    (a, b) => narrowScore[b] - narrowScore[a]
  );
  return sorted[0];
}

/**
 * Weighted-random selection of a variant cat from a matched archetype.
 * Rarity weights: common 40, uncommon 30, rare 20, legendary 10.
 *
 * @param rng injectable random source (defaults to Math.random) for testability.
 */
export function selectVariant(
  archetypeId: string,
  allCats: Cat[],
  rng: () => number = Math.random
): Cat {
  const archetypeCats = allCats.filter((c) => c.archetype === archetypeId);
  if (archetypeCats.length === 0) {
    throw new Error(`No cats found for archetype: ${archetypeId}`);
  }

  const totalWeight = archetypeCats.reduce(
    (sum, cat) => sum + RARITY_WEIGHTS[cat.rarity],
    0
  );

  // Walk the cumulative weight line and pick where the random point lands.
  let target = rng() * totalWeight;
  for (const cat of archetypeCats) {
    target -= RARITY_WEIGHTS[cat.rarity];
    if (target < 0) return cat;
  }

  // Floating-point fallback: return the last cat.
  return archetypeCats[archetypeCats.length - 1];
}
