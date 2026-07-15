"use client";

import type { JourneyDefinition } from "@guiding-light/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type EnrollmentResult =
  | { status: "saved" }
  | { status: "anonymous" }
  | { status: "error"; message: string };

export async function enrollInJourney(journey: JourneyDefinition): Promise<EnrollmentResult> {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    saveAnonymousJourney(journey);
    return { status: "anonymous" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { status: "error", message: userError.message };
  }

  if (!user) {
    saveAnonymousJourney(journey);
    return { status: "anonymous" };
  }

  const now = new Date().toISOString();
  const firstLesson = journey.lessons[0];

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    journey_stage: journey.id,
    updated_at: now,
  });

  if (profileError) {
    return { status: "error", message: profileError.message };
  }

  const { error: journeyError } = await supabase.from("user_journeys").upsert(
    {
      profile_id: user.id,
      journey_id: journey.slug,
      status: "in_progress",
      started_at: now,
      last_lesson_id: firstLesson?.slug ?? null,
      updated_at: now,
    },
    {
      onConflict: "profile_id,journey_id",
    },
  );

  if (journeyError) {
    return { status: "error", message: journeyError.message };
  }

  if (firstLesson) {
    const { error: progressError } = await supabase.from("lesson_progress").upsert(
      {
        profile_id: user.id,
        journey_id: journey.slug,
        lesson_id: firstLesson.slug,
        status: "in_progress",
        progress_percent: 0,
        started_at: now,
        updated_at: now,
      },
      {
        onConflict: "profile_id,journey_id,lesson_id",
      },
    );

    if (progressError) {
      return { status: "error", message: progressError.message };
    }
  }

  window.localStorage.removeItem("guiding-light.anonymous-journey");
  return { status: "saved" };
}

export function saveAnonymousJourney(journey: JourneyDefinition) {
  window.localStorage.setItem(
    "guiding-light.anonymous-journey",
    JSON.stringify({
      journeyId: journey.id,
      journeySlug: journey.slug,
      selectedAt: new Date().toISOString(),
    }),
  );
}
