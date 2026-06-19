import type { Question } from "./types";

/**
 * Returns N randomly-selected questions from the full pool, in random order.
 * Uses a Fisher-Yates shuffle for an unbiased ordering.
 *
 * @param rng injectable random source (defaults to Math.random) for testability.
 */
export function selectQuestions(
  allQuestions: Question[],
  n: number = 10,
  rng: () => number = Math.random
): Question[] {
  const arr = [...allQuestions];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(n, arr.length));
}
