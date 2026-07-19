import type { MetadataRoute } from "next";
import { getTechArticleSlugs } from "../lib/sanity";

const siteUrl = "https://devfieldnotes.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getTechArticleSlugs();

  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/guides`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/author`, changeFrequency: "yearly", priority: 0.6 },
    ...slugs.map((slug) => ({
      url: `${siteUrl}/guides/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
