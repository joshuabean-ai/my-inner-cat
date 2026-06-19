import type { Metadata } from "next";
import { archetypes, cats } from "@/lib/data";
import { CatsGallery } from "@/components/CatsGallery";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { WatercolorBloom } from "@/components/WatercolorBloom";

export const metadata: Metadata = {
  title: "The Collection",
  description: "Browse all 89 cats across 20 archetypes in the My Inner Cat album.",
};

export default function CatsPage() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <WatercolorBloom />
      <Masthead />
      <div className="flex flex-1 flex-col items-center px-6 pb-16 pt-4">
        <header className="mb-9 text-center">
          <p className="eyebrow text-ink-whisper">The collection</p>
          <h1 className="mt-1 font-display text-page-title font-bold text-ink-deep">
            Every cat in the album
          </h1>
          <p className="mt-2 font-body text-lg text-ink-soft text-balance">
            All {cats.length} cats across {archetypes.length} archetypes. Tap any one to meet it.
          </p>
        </header>
        <CatsGallery cats={cats} archetypes={archetypes} />
      </div>
      <Footer />
    </main>
  );
}
