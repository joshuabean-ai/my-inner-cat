import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { WatercolorBloom } from "@/components/WatercolorBloom";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <WatercolorBloom />
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <Hero />
      </div>
      <Footer />
    </main>
  );
}
