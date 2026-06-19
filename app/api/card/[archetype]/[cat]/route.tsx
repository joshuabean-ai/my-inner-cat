import { cats, getArchetype, getCat, toSlug } from "@/lib/data";
import { buildCardResponse } from "@/lib/og-card";

export const runtime = "nodejs";
export const dynamic = "force-static";

// Pre-render a portrait collectible card PNG for every result, used by the
// Share/Download actions on the result page.
export function generateStaticParams() {
  return cats.map((cat) => ({
    archetype: toSlug(cat.archetype),
    cat: toSlug(cat.id),
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ archetype: string; cat: string }> }
) {
  const { archetype: archetypeSlug, cat: catSlug } = await params;
  const archetype = getArchetype(archetypeSlug);
  const cat = getCat(catSlug);

  if (!archetype || !cat || cat.archetype !== archetype.id) {
    return new Response("Not found", { status: 404 });
  }

  return buildCardResponse({ archetype, cat, format: "portrait" });
}
