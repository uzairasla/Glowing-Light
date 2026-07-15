import type { Metadata } from "next";
import { JourneyCard } from "@/components/journey-card";
import { getJourneys } from "@/lib/content";

export const metadata: Metadata = {
  title: "New Muslim Guide",
  description: "A gentle step-by-step guide for new Muslims learning Shahadah, wudu, prayer, Quran basics, mosque etiquette, and sustainable habits.",
  alternates: { canonical: "/guides/new-muslim" },
};

export default async function NewMuslimGuidePage() {
  const journeys = await getJourneys();
  const journey = journeys.find((item) => item.slug === "new-muslim");

  return (
    <main className="container py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-gold">
          Gentle first steps
        </p>
        <h1 className="mt-3 font-serif text-5xl font-bold md:text-7xl">New Muslim guide</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Start with what matters most and build gradually. This page will become a focused guide for practical first steps.
        </p>
      </div>
      <div className="mt-10 max-w-xl">
        {journey ? <JourneyCard journey={journey} index={2} /> : null}
      </div>
    </main>
  );
}
