import type { Metadata } from "next";
import { JourneyCard } from "@/components/journey-card";
import { SectionHeading } from "@/components/section-heading";
import { getJourneys } from "@/lib/content";

export const metadata: Metadata = {
  title: "Learning Journeys",
  description:
    "Choose a guided path for questioning religion, exploring Islam, or beginning as a new Muslim.",
  alternates: { canonical: "/journeys" },
};

export default async function JourneysPage() {
  const journeys = await getJourneys();
  const preferredOrder = [
    "questioning-religion",
    "exploring-the-abrahamic-faiths",
  ];
  const orderedJourneys = [...journeys].sort((a, b) => {
    const aRank = preferredOrder.indexOf(a.slug);
    const bRank = preferredOrder.indexOf(b.slug);

    if (aRank === -1 && bRank === -1) return 0;
    if (aRank === -1) return 1;
    if (bRank === -1) return -1;
    return aRank - bRank;
  });

  return (
    <main className="container py-16">
      <SectionHeading
        kicker="Start where you are"
        title="Guided journeys"
        description="Choose a path that matches where you are, then explore each topic in a clear, intentional order."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {orderedJourneys.map((journey, index) => (
          <JourneyCard key={journey.id} journey={journey} index={index} />
        ))}
      </div>
    </main>
  );
}
