import { Hero } from "@/components/Hero";
import { WatercolorBloom } from "@/components/WatercolorBloom";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <WatercolorBloom />
      {/* The hero is the brand sign-off here, so no separate footer is needed. */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <Hero />
      </div>
    </main>
  );
}
