"use client";

import posthog from "posthog-js";

export type AnalyticsEvent =
  | "onboarding_started"
  | "journey_selected"
  | "lesson_started"
  | "lesson_completed"
  | "question_searched"
  | "question_submitted"
  | "bookmark_added"
  | "account_created"
  | "return_visit";

type SafeProperties = {
  journey_id?: string;
  lesson_id?: string;
  content_type?: string;
  content_id?: string;
  source?: string;
};

export function trackEvent(event: AnalyticsEvent, properties: SafeProperties = {}) {
  if (typeof window === "undefined") {
    return;
  }

  if (!posthog.__loaded) {
    return;
  }

  posthog.capture(event, properties);
}
