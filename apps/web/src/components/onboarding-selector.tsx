"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/events";
import { journeys } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function OnboardingSelector() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(journeys[0]?.slug ?? "");

  async function continueJourney() {
    const journey = journeys.find((item) => item.slug === selected);
    if (!journey) {
      return;
    }

    trackEvent("journey_selected", {
      journey_id: journey.id,
      source: "onboarding",
    });
    router.push(`/journeys/${journey.slug}`);
  }

  return (
    <div className="grid gap-4">
      {journeys.map((journey) => (
        <button
          key={journey.id}
          type="button"
          onClick={() => setSelected(journey.slug)}
          className="text-left"
        >
          <Card
            className={`p-6 transition ${
              selected === journey.slug
                ? "border-teal bg-teal-50/60"
                : "hover:-translate-y-0.5"
            }`}
          >
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-gold">
              {journey.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{journey.title}</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              {journey.description}
            </p>
          </Card>
        </button>
      ))}
      <Button className="mt-2" onClick={continueJourney}>
        Continue
      </Button>
    </div>
  );
}
