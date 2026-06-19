import archetypesData from "@/data/archetypes.json";
import catsData from "@/data/cats.json";
import questionsData from "@/data/questions.json";
import type { Archetype, Cat, Question } from "./types";

export const archetypes: Archetype[] = archetypesData.archetypes as Archetype[];
export const cats: Cat[] = catsData.cats as Cat[];
export const questions: Question[] = questionsData.questions as Question[];

/** Underscored id -> hyphenated URL slug ("cozy_giant" -> "cozy-giant"). */
export function toSlug(id: string): string {
  return id.replace(/_/g, "-");
}

/** Hyphenated URL slug -> underscored id ("cozy-giant" -> "cozy_giant"). */
export function fromSlug(slug: string): string {
  return slug.replace(/-/g, "_");
}

const archetypeById = new Map(archetypes.map((a) => [a.id, a]));
const catById = new Map(cats.map((c) => [c.id, c]));

/** Look up an archetype by id OR by URL slug. Returns undefined if not found. */
export function getArchetype(idOrSlug: string): Archetype | undefined {
  return archetypeById.get(idOrSlug) ?? archetypeById.get(fromSlug(idOrSlug));
}

/** Look up a cat by id OR by URL slug. Returns undefined if not found. */
export function getCat(idOrSlug: string): Cat | undefined {
  return catById.get(idOrSlug) ?? catById.get(fromSlug(idOrSlug));
}

/** All cats belonging to a given archetype. */
export function getCatsByArchetype(archetypeId: string): Cat[] {
  return cats.filter((c) => c.archetype === archetypeId);
}
