import { journeys as allJourneys } from "@guiding-light/learning-engine";
import type { JourneyDefinition, LessonSummary } from "@guiding-light/types";
import { sanityFetch } from "@/lib/sanity/client";

// Temporarily hidden until the full journey content is ready.
const hiddenJourneySlugs = new Set(["exploring-the-abrahamic-faiths"]);

export const journeys = allJourneys.filter(
  (journey) => !hiddenJourneySlugs.has(journey.slug),
);

export type PublicQuestion = {
  slug: string;
  title: string;
  summary: string;
  reviewStatus: string;
};

export type LessonWithJourney = LessonSummary & {
  journey: Pick<JourneyDefinition, "title" | "slug">;
  body?: RichTextBlock[];
};

export type RichTextBlock = {
  _key?: string;
  _type: string;
  [key: string]: unknown;
};

export const publicQuestions: PublicQuestion[] = [
  {
    slug: "does-god-exist",
    title: "Does God exist?",
    summary:
      "A source-backed introductory answer that explains why many seekers begin with contingency, order, morality, and lived experience.",
    reviewStatus: "Placeholder draft",
  },
  {
    slug: "why-does-religion-matter",
    title: "Why does religion matter?",
    summary:
      "Religion is introduced as a claim about truth, purpose, worship, moral formation, and accountability.",
    reviewStatus: "Placeholder draft",
  },
  {
    slug: "how-do-i-pray",
    title: "How do I pray?",
    summary:
      "A beginner-friendly overview of purification, intention, the prayer sequence, and what to learn first.",
    reviewStatus: "Placeholder draft",
  },
];

export const sourceNotice = {
  status: "Placeholder content",
  reviewer: "Awaiting editorial and scholarly review",
  lastReviewedAt: "Not reviewed yet",
};

type SanityArticle = {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  body?: RichTextBlock[];
};

type SanityTaxonomy = {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  articles?: SanityArticle[];
  children?: SanityTaxonomy[];
};

type SanityArticleDetail = SanityArticle & {
  taxonomies?: Array<{
    title?: string;
    slug?: string;
    parent?: {
      title?: string;
      slug?: string;
    };
  }>;
};

const taxonomyQuery = `*[_type == "taxonomy" && !defined(parent)] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "articles": *[_type == "article" && references(^._id)] | order(_createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    description
  },
  "children": *[_type == "taxonomy" && parent._ref == ^._id] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "articles": *[_type == "article" && references(^._id)] | order(_createdAt asc) {
      _id,
      title,
      "slug": slug.current,
      description
    }
  }
}`;

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

const publishedLessonSlugsQuery =
  '*[_type == "article" && defined(slug.current) && count(body) > 0] | order(_updatedAt desc) {"slug": slug.current, "lastModified": _updatedAt}';

export async function getPublishedLessonSitemapEntries(): Promise<
  Array<{ slug: string; lastModified: string }>
> {
  try {
    return (
      (await sanityFetch<Array<{ slug: string; lastModified: string }>>(
        publishedLessonSlugsQuery,
      )) ?? []
    );
  } catch {
    return [];
  }
}

export async function getJourneys(): Promise<JourneyDefinition[]> {
  try {
    const sanityTaxonomies = await sanityFetch<SanityTaxonomy[]>(taxonomyQuery);
    const mapped = sanityTaxonomies
      ?.map(mapSanityTaxonomy)
      .filter(isPresent)
      .filter((journey) => !hiddenJourneySlugs.has(journey.slug));

    if (!mapped || mapped.length === 0) {
      return journeys;
    }

    return mapped;
  } catch {
    return journeys;
  }
}

export async function getJourneyBySlug(
  slug: string,
): Promise<JourneyDefinition | undefined> {
  const allJourneys = await getJourneys();
  return allJourneys.find((journey) => journey.slug === slug);
}

export async function getPublicQuestions(): Promise<PublicQuestion[]> {
  return publicQuestions;
}

export async function getPublicQuestionBySlug(
  slug: string,
): Promise<PublicQuestion | undefined> {
  return publicQuestions.find((question) => question.slug === slug);
}

export async function getLessons(): Promise<LessonWithJourney[]> {
  const allJourneys = await getJourneys();
  return allJourneys.flatMap((journey) =>
    journey.lessons.map((lesson) => ({
      ...lesson,
      journey: {
        title: journey.title,
        slug: journey.slug,
      },
    })),
  );
}

export async function getLessonBySlug(
  slug: string,
): Promise<LessonWithJourney | undefined> {
  try {
    const sanityArticle = await sanityFetch<SanityArticleDetail>(
      articleBySlugQuery,
      { slug },
    );
    const mapped = sanityArticle ? mapSanityArticleDetail(sanityArticle) : null;

    if (mapped) {
      return mapped;
    }
  } catch {
    // Fall through to placeholders.
  }

  const lessons = await getLessons();
  return lessons.find((lesson) => lesson.slug === slug);
}

function mapSanityTaxonomy(taxonomy: SanityTaxonomy): JourneyDefinition | null {
  if (!taxonomy.title || !taxonomy.slug) {
    return null;
  }

  const staticJourney = journeys.find(
    (journey) => journey.slug === taxonomy.slug,
  );
  const articles = uniqueArticlesById([
    ...(taxonomy.articles ?? []),
    ...(taxonomy.children ?? []).flatMap((child) => child.articles ?? []),
  ]);

  return {
    id: taxonomy.slug,
    slug: taxonomy.slug,
    title: taxonomy.title,
    eyebrow: staticJourney?.eyebrow ?? "Guided path",
    description:
      taxonomy.description ?? "A guided collection of related articles.",
    promise: taxonomy.description ?? "Move through this topic step by step.",
    lessons: articles.map(mapSanityArticle).filter(isPresent),
  };
}

function mapSanityArticle(article: SanityArticle): LessonSummary | null {
  if (!article.title || !article.slug) {
    return null;
  }

  return {
    id: article._id,
    slug: article.slug,
    title: article.title,
    summary: article.description ?? "Article description coming soon.",
    estimatedMinutes: 8,
    difficulty: "introductory",
  };
}

function mapSanityArticleDetail(
  article: SanityArticleDetail,
): LessonWithJourney | null {
  const mappedArticle = mapSanityArticle(article);
  const taxonomy = article.taxonomies?.find((item) => item.title && item.slug);
  const journeyTaxonomy =
    taxonomy?.parent?.title && taxonomy.parent.slug
      ? taxonomy.parent
      : taxonomy;

  if (!mappedArticle || !journeyTaxonomy?.title || !journeyTaxonomy.slug) {
    return null;
  }

  return {
    ...mappedArticle,
    body: article.body,
    journey: {
      title: journeyTaxonomy.title,
      slug: journeyTaxonomy.slug,
    },
  };
}

function uniqueArticlesById(articles: SanityArticle[]) {
  const seen = new Set<string>();

  return articles.filter((article) => {
    if (seen.has(article._id)) {
      return false;
    }

    seen.add(article._id);
    return true;
  });
}

function isPresent<T>(value: T | null | undefined): value is T {
  return value != null;
}
