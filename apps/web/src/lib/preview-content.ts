import "server-only";

import type { LessonWithJourney, RichTextBlock } from "@/lib/content";
import { sanityClient, sanityFetch } from "@/lib/sanity/client";

const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  body[]{
    ...,
    _type == "imageBlock" => {
      ...,
      "assetUrl": asset->url
    }
  },
  taxonomies[]->{
    title,
    "slug": slug.current,
    parent->{
      title,
      "slug": slug.current
    }
  }
}`;

type SanityArticleDetail = {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  body?: RichTextBlock[];
  taxonomies?: Array<{
    title?: string;
    slug?: string;
    parent?: {
      title?: string;
      slug?: string;
    };
  }>;
};

const sanityReadToken = process.env.SANITY_API_READ_TOKEN;

const sanityPreviewClient =
  sanityClient && sanityReadToken
    ? sanityClient.withConfig({
        token: sanityReadToken,
        useCdn: false,
        perspective: "drafts",
      })
    : null;

export const isSanityPreviewConfigured = Boolean(sanityPreviewClient);

export async function getPreviewLessonBySlug(
  identifier: string,
): Promise<LessonWithJourney | undefined> {
  try {
    const slug = normalizePreviewLessonSlug(identifier);
    const article = sanityPreviewClient
      ? await sanityPreviewClient.fetch<SanityArticleDetail>(
          articleBySlugQuery,
          { slug },
          { cache: "no-store" },
        )
      : await sanityFetch<SanityArticleDetail>(articleBySlugQuery, { slug });

    return article ? (mapPreviewArticle(article) ?? undefined) : undefined;
  } catch {
    return undefined;
  }
}

export function normalizePreviewLessonSlug(identifier: string) {
  const draftArticleIdPrefix = "drafts.article-";

  return identifier.startsWith(draftArticleIdPrefix)
    ? identifier.slice(draftArticleIdPrefix.length)
    : identifier;
}

function mapPreviewArticle(
  article: SanityArticleDetail,
): LessonWithJourney | null {
  const taxonomy = article.taxonomies?.find((item) => item.title && item.slug);
  const journeyTaxonomy =
    taxonomy?.parent?.title && taxonomy.parent.slug
      ? taxonomy.parent
      : taxonomy;

  if (
    !article.title ||
    !article.slug ||
    !journeyTaxonomy?.title ||
    !journeyTaxonomy.slug
  ) {
    return null;
  }

  return {
    id: article._id,
    slug: article.slug,
    title: article.title,
    summary: article.description ?? "Article description coming soon.",
    estimatedMinutes: 8,
    difficulty: "introductory",
    body: article.body,
    journey: {
      title: journeyTaxonomy.title,
      slug: journeyTaxonomy.slug,
    },
  };
}
