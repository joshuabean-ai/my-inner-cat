export type Rarity = "common" | "uncommon" | "rare" | "legendary";

export type Origin = "domestic" | "wild";

export interface Archetype {
  id: string;
  name: string;
  description: string;
  tagline: string;
}

export interface Cat {
  id: string;
  name: string;
  archetype: string;
  rarity: Rarity;
  origin: Origin;
  /** Stable 1-based collection number, "No. N / 89". */
  number: number;
  blurb: string;
  trivia: string;
  image: string;
}

export interface Answer {
  id: string;
  text: string;
  tags: string[];
}

export interface Question {
  id: string;
  title: string;
  setup: string;
  answers: Answer[];
}

export interface UserAnswer {
  questionId: string;
  answer: Answer;
}
