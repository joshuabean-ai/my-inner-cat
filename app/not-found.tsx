import { Button } from "@/components/ui/Button";
import { WatercolorBloom } from "@/components/WatercolorBloom";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <WatercolorBloom />
      <h1 className="font-display text-page-title font-bold text-ink-deep">
        This cat wandered off
      </h1>
      <p className="mt-3 font-body text-lg text-ink-soft">
        We couldn&apos;t find that page.
      </p>
      <div className="mt-8">
        <Button href="/">Back to the start</Button>
      </div>
    </main>
  );
}
