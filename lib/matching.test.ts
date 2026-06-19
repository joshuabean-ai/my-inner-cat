import { describe, expect, it } from "vitest";
import { matchArchetype, selectVariant } from "./matching";
import { selectQuestions } from "./selection";
import type { Cat, Question, UserAnswer } from "./types";

function ans(tags: string[]): UserAnswer {
  return { questionId: "q", answer: { id: "a", text: "", tags } };
}

describe("matchArchetype", () => {
  it("returns the single highest-scoring archetype", () => {
    const answers = [
      ans(["cozy_giant", "quiet_mystic"]),
      ans(["cozy_giant", "spark_runner"]),
      ans(["cozy_giant"]),
    ];
    expect(matchArchetype(answers)).toBe("cozy_giant");
  });

  it("handles all answers tagging the same archetype", () => {
    const answers = [ans(["old_soul"]), ans(["old_soul"]), ans(["old_soul"])];
    expect(matchArchetype(answers)).toBe("old_soul");
  });

  it("breaks ties toward the archetype with more narrow (3-tag) signals", () => {
    // cozy_giant and night_owl both score 2, but cozy_giant appears in a
    // 3-tag (narrow) answer while night_owl only appears in wide answers.
    const answers = [
      ans(["cozy_giant", "a", "b"]), // narrow → cozy_giant +1
      ans(["cozy_giant", "x", "y", "z"]), // wide
      ans(["night_owl", "p", "q", "r", "s"]), // wide
      ans(["night_owl", "m", "n", "o", "t"]), // wide
    ];
    expect(matchArchetype(answers)).toBe("cozy_giant");
  });

  it("is deterministic when scores and narrow counts are fully tied", () => {
    const answers = [ans(["a", "b"]), ans(["a", "b"])];
    const first = matchArchetype(answers);
    expect(matchArchetype(answers)).toBe(first);
    expect(["a", "b"]).toContain(first);
  });

  it("throws when there are no tags at all", () => {
    expect(() => matchArchetype([ans([])])).toThrow();
  });
});

describe("selectVariant", () => {
  const cats: Cat[] = [
    makeCat("c_common", "x", "common"),
    makeCat("c_legendary", "x", "legendary"),
  ];

  it("throws when the archetype has no cats", () => {
    expect(() => selectVariant("none", cats)).toThrow();
  });

  it("always returns a cat from the requested archetype", () => {
    const mixed = [...cats, makeCat("other", "y", "common")];
    for (let i = 0; i < 50; i++) {
      const picked = selectVariant("x", mixed, () => i / 50);
      expect(picked.archetype).toBe("x");
    }
  });

  it("respects rarity weighting (common ~4x legendary)", () => {
    const counts: Record<string, number> = { c_common: 0, c_legendary: 0 };
    const N = 10000;
    for (let i = 0; i < N; i++) {
      // Deterministic sweep across [0,1) approximates a uniform RNG.
      const picked = selectVariant("x", cats, () => (i + 0.5) / N);
      counts[picked.id]++;
    }
    // Weights 40 vs 10 → common should land near 80% of picks.
    const commonShare = counts.c_common / N;
    expect(commonShare).toBeGreaterThan(0.75);
    expect(commonShare).toBeLessThan(0.85);
  });
});

describe("selectQuestions", () => {
  const pool: Question[] = Array.from({ length: 27 }, (_, i) => ({
    id: `q${i}`,
    title: "",
    setup: "",
    answers: [],
  }));

  it("returns exactly n questions when the pool is large enough", () => {
    expect(selectQuestions(pool, 10)).toHaveLength(10);
  });

  it("never returns duplicates", () => {
    const picked = selectQuestions(pool, 10);
    expect(new Set(picked.map((q) => q.id)).size).toBe(10);
  });

  it("caps at the pool size when asked for more than exist", () => {
    expect(selectQuestions(pool.slice(0, 4), 10)).toHaveLength(4);
  });

  it("does not mutate the input pool", () => {
    const before = pool.map((q) => q.id);
    selectQuestions(pool, 10);
    expect(pool.map((q) => q.id)).toEqual(before);
  });
});

function makeCat(id: string, archetype: string, rarity: Cat["rarity"]): Cat {
  return {
    id,
    name: id,
    archetype,
    rarity,
    blurb: "",
    trivia: "",
    image: "",
  };
}
