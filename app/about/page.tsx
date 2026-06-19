import type { Metadata } from "next";
import { cats, archetypes } from "@/lib/data";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { WatercolorBloom } from "@/components/WatercolorBloom";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind My Inner Cat — a watercolor personality quiz of 89 cats, made by Georgia.",
};

const domestic = cats.filter((c) => c.origin === "domestic").length;
const wild = cats.length - domestic;

const steps = [
  {
    title: "Ten questions",
    body: "Each answer quietly leans toward a few personality types. There are no wrong ones.",
  },
  {
    title: "One archetype",
    body: `The type your answers lean toward becomes your result — one of ${archetypes.length}.`,
  },
  {
    title: "One cat",
    body: "From that archetype's cats you draw a single variant — and some are far rarer than others.",
  },
  {
    title: "Collect them all",
    body: "Every cat you draw is saved to your collection. Take the quiz again to discover more.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <WatercolorBloom />
      <Masthead />

      <article className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16 pt-4">
        <header className="text-center">
          <p className="eyebrow text-ink-whisper">About</p>
          <h1 className="mt-1 font-display text-page-title font-bold text-ink-deep text-balance">
            A small, soft corner of the internet
          </h1>
          <p className="mt-4 font-body text-lg leading-relaxed text-ink-soft text-pretty">
            My Inner Cat is a watercolor personality quiz. Answer ten short
            questions and you&apos;ll be matched to one of {cats.length} cats —
            from cozy housecats to rare wild species — each painted by hand and
            sorted into one of {archetypes.length} personality archetypes.
          </p>
        </header>

        <section className="mt-12">
          <h2 className="font-display text-section-title font-semibold text-ink-deep">
            How it works
          </h2>
          <ol className="mt-5 space-y-4">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lavender/40 font-display text-sm font-semibold text-ink-deep">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-deep">
                    {s.title}
                  </h3>
                  <p className="font-body text-base text-pretty text-ink-soft">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-section-title font-semibold text-ink-deep">
            The cats
          </h2>
          <p className="mt-4 font-body text-lg leading-relaxed text-ink-soft text-pretty">
            There are {cats.length} in all — {domestic} domestic breeds and {wild}{" "}
            wild species — across four rarity tiers, from Common to the elusive
            Legendary. Each comes with a short profile and a piece of true trivia,
            so you might leave knowing a little more about cats than when you
            arrived.
          </p>
        </section>

        <section className="mt-12 rounded-card border border-dove/50 bg-paper/70 p-6">
          <h2 className="font-display text-section-title font-semibold text-ink-deep">
            Made by Georgia
          </h2>
          <p className="mt-4 font-body text-lg leading-relaxed text-ink-soft text-pretty">
            My Inner Cat began as a project to make together — a love of cats, a
            love of painting, and a quiet wish to build something wholesome and
            unhurried. There&apos;s nothing to sign up for and nothing to buy. We
            just hope it makes your day a little softer.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Button href="/quiz">Take the quiz</Button>
          <Button href="/cats" variant="secondary">
            Browse all {cats.length} cats
          </Button>
        </div>
      </article>

      <Footer />
    </main>
  );
}
