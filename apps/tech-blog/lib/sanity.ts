import { createClient } from "@sanity/client";
import type { TechArticle } from "../src/tech-article";

const projectId =
  process.env.SANITY_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  "dis8yhkz";
const dataset =
  process.env.SANITY_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";
const apiVersion =
  process.env.SANITY_API_VERSION ??
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ??
  "2026-07-18";

export const techArticleQuery = `*[_type == "techArticle" && slug.current == $slug][0]{
  _id,title,"slug":slug.current,description,publishedAt,updatedAt,readTime,kicker,body,
  "taxonomies":taxonomies[]->title,sourceUrls,
  "coverImageUrl":coalesce(coverImage.asset->url, "/articles/sanity-content-not-updating/cover.png"),
  "coverImageAlt":coalesce(coverImage.alt, "A diagnostic content pipeline showing an update blocked at a cache layer between a CMS and website"),
  seoTitle,seoDescription
}`;

function getClient() {
  if (!projectId)
    throw new Error(
      "Missing SANITY_PROJECT_ID (or NEXT_PUBLIC_SANITY_PROJECT_ID).",
    );
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
  });
}

export async function getTechArticle(
  slug: string,
): Promise<TechArticle | null> {
  return getClient().fetch<TechArticle | null>(
    techArticleQuery,
    { slug },
    { next: { revalidate: 60, tags: [`techArticle:${slug}`] } },
  );
}

export async function getTechArticleSlugs(): Promise<string[]> {
  return getClient().fetch<string[]>(
    `*[_type == "techArticle" && defined(slug.current)].slug.current`,
    {},
    { next: { revalidate: 60, tags: ["techArticles"] } },
  );
}
