"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/events";
import { enrollInJourney } from "@/lib/learning/enrollment";
import { journeys } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function OnboardingSelector() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(journeys[0]?.slug ?? "");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function continueJourney() {
    const journey = journeys.find((item) => item.slug === selected);
    if (!journey) {
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    const result = await enrollInJourney(journey);
    setIsSaving(false);

    if (result.status === "error") {
      setStatusMessage(result.message);
      return;
    }

    trackEvent("journey_selected", { journey_id: journey.id, source: "onboarding" });
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
              selected === journey.slug ? "border-teal bg-teal-50/60" : "hover:-translate-y-0.5"
            }`}
          >
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-gold">
              {journey.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{journey.title}</h2>
            <p className="mt-2 leading-7 text-muted-foreground">{journey.description}</p>
          </Card>
        </button>
      ))}
      {statusMessage ? <p className="text-sm text-destructive">{statusMessage}</p> : null}
      <Button className="mt-2" onClick={continueJourney} disabled={isSaving}>
        {isSaving ? "Saving..." : "Continue"}
      </Button>
    </div>
  );
}
