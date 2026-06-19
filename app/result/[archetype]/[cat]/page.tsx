import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cats, getArchetype, getCat, toSlug } from "@/lib/data";
import { RARITY_META } from "@/lib/rarity";
import { SITE_URL } from "@/lib/site";
import { ResultReveal } from "@/components/ResultReveal";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { WatercolorBloom } from "@/components/WatercolorBloom";

interface RouteParams {
  archetype: string;
  cat: string;
}

// Pre-render every archetype × cat result page at build time.
export function generateStaticParams(): RouteParams[] {
  return cats.map((cat) => ({
    archetype: toSlug(cat.archetype),
    cat: toSlug(cat.id),
  }));
}

export const dynamicParams = false;

function resolve(params: RouteParams) {
  const cat = getCat(params.cat);
  const archetype = getArchetype(params.archetype);
  // Guard against mismatched archetype/cat pairs in a shared URL.
  if (!cat || !archetype || cat.archetype !== archetype.id) return null;
  return { cat, archetype };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const resolved = resolve(await params);
  if (!resolved) return {};
  const { cat, archetype } = resolved;

  const url = `${SITE_URL}/result/${toSlug(archetype.id)}/${toSlug(cat.id)}`;

  return {
    title: `${cat.name} · ${archetype.name}`,
    description: `${archetype.tagline} Take the quiz at myinnercat.com.`,
    openGraph: {
      title: `I'm ${cat.name}`,
      description: archetype.tagline,
      url,
      siteName: "My Inner Cat",
    },
    twitter: {
      card: "summary_large_image",
      title: `I'm ${cat.name}`,
      description: archetype.tagline,
    },
  };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const resolved = resolve(await params);
  if (!resolved) notFound();
  const { cat, archetype } = resolved;

  const shareUrl = `${SITE_URL}/result/${toSlug(archetype.id)}/${toSlug(cat.id)}`;
  const tint = RARITY_META[cat.rarity].glow;

  return (
    <main className="relative flex min-h-screen flex-col">
      <WatercolorBloom className="opacity-60" tint={tint} />
      <Masthead right={`No. ${cat.number} / 89`} />
      <div className="flex flex-1 items-start justify-center px-6 pb-16 pt-4">
        <ResultReveal archetype={archetype} cat={cat} shareUrl={shareUrl} />
      </div>
      <Footer />
    </main>
  );
}
