"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { env } from "@/lib/env";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!env.NEXT_PUBLIC_POSTHOG_KEY || posthog.__loaded) {
      return;
    }

    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      autocapture: false,
      person_profiles: "identified_only",
    });
  }, []);

  return children;
}
