import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SanityUpdatingArticle } from "../../../src/SanityUpdatingArticle";
import { getTechArticle, getTechArticleSlugs } from "../../../lib/sanity";

export const revalidate = 60;

type GuidePageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getTechArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getTechArticle(slug);
  if (!article) return {};
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.description,
    openGraph: {
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.description,
      images: article.coverImageUrl ? [article.coverImageUrl] : undefined,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = await getTechArticle(slug);
  if (!article) notFound();
  return <SanityUpdatingArticle article={article} />;
}
