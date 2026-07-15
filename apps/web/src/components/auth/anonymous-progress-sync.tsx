"use client";

import { useEffect, useState } from "react";
import { journeys } from "@/lib/content";
import { enrollInJourney } from "@/lib/learning/enrollment";

type StoredAnonymousJourney = {
  journeySlug?: string;
};

export function AnonymousProgressSync() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function syncJourney() {
      const stored = window.localStorage.getItem("guiding-light.anonymous-journey");

      if (!stored) {
        return;
      }

      let parsed: StoredAnonymousJourney;
      try {
        parsed = JSON.parse(stored) as StoredAnonymousJourney;
      } catch {
        window.localStorage.removeItem("guiding-light.anonymous-journey");
        return;
      }

      const journey = journeys.find((item) => item.slug === parsed.journeySlug);

      if (!journey) {
        window.localStorage.removeItem("guiding-light.anonymous-journey");
        return;
      }

      const result = await enrollInJourney(journey);

      if (result.status === "saved") {
        setMessage("Your selected journey was saved to this account.");
      }
    }

    void syncJourney();
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm font-semibold text-teal-950">
      {message}
    </div>
  );
}
