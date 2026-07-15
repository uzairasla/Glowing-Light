import type { MetadataRoute } from "next";
import { journeys, publicQuestions } from "@/lib/content";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const staticRoutes = [
    "",
    "/about",
    "/questions",
    "/guides/new-muslim",
    "/compare",
    "/journeys",
    "/onboarding",
    "/sign-in",
    "/ask",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
    })),
    ...journeys.map((journey) => ({
      url: `${base}/journeys/${journey.slug}`,
      lastModified: new Date(),
    })),
    ...publicQuestions.map((question) => ({
      url: `${base}/questions/${question.slug}`,
      lastModified: new Date(),
    })),
  ];
}
