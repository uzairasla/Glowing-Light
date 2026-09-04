import type { MetadataRoute } from "next";
import {
  getJourneys,
  getPublishedLessonSitemapEntries,
  getTopics,
} from "@/lib/content";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const [journeys, topics, publishedLessons] = await Promise.all([
    getJourneys(),
    getTopics(),
    getPublishedLessonSitemapEntries(),
  ]);
  const staticRoutes = [
    "",
    "/about",
    "/journeys",
    "/topics",
    "/faith-leaders",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency:
        route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...journeys.map((journey) => ({
      url: `${base}/journeys/${journey.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...topics.map((topic) => ({
      url: `${base}/topics/${topic.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...publishedLessons.map((lesson) => ({
      url: base + "/lessons/" + lesson.slug,
      lastModified: new Date(lesson.lastModified),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
