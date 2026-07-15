import type { Metadata } from "next";
import { JourneyCard } from "@/components/journey-card";
import { SectionHeading } from "@/components/section-heading";
import { getJourneys } from "@/lib/content";

export const metadata: Metadata = {
  title: "Learning Journeys",
  description: "Choose a guided path for questioning religion, exploring Islam, or beginning as a new Muslim.",
  alternates: { canonical: "/journeys" },
};

export default async function JourneysPage() {
  const journeys = await getJourneys();

  return (
    <main className="container py-16">
      <SectionHeading
        kicker="Start where you are"
        title="Guided journeys"
        description="Each path is predefined for editorial review and can later be managed in Sanity."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {journeys.map((journey, index) => (
          <JourneyCard key={journey.id} journey={journey} index={index} />
        ))}
      </div>
    </main>
  );
}
