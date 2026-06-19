import { cats, getArchetype, getCat, toSlug } from "@/lib/data";
import { buildCardResponse } from "@/lib/og-card";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "My Inner Cat result";

// One OG image per archetype × cat, matching the page routes.
export function generateStaticParams() {
  return cats.map((cat) => ({
    archetype: toSlug(cat.archetype),
    cat: toSlug(cat.id),
  }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ archetype: string; cat: string }>;
}) {
  const { archetype: archetypeSlug, cat: catSlug } = await params;
  const archetype = getArchetype(archetypeSlug);
  const cat = getCat(catSlug);

  if (!archetype || !cat) {
    return new Response("Not found", { status: 404 });
  }

  return buildCardResponse({ archetype, cat, format: "landscape" });
}
