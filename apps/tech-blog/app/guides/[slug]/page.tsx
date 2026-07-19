import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AUTHOR, absoluteUrl, SITE_NAME, SITE_URL } from "../../../lib/site";
import { JsonLd } from "../../../src/JsonLd";
import { SanityUpdatingArticle } from "../../../src/SanityUpdatingArticle";
import { getTechArticle, getTechArticleSlugs } from "../../../lib/sanity";

export const revalidate = 60;

type GuidePageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getTechArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getTechArticle(slug);
  if (!article) return {};
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.description,
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    alternates: { canonical: `/guides/${slug}` },
    openGraph: {
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.description,
      url: `/guides/${slug}`,
      siteName: SITE_NAME,
      images: article.coverImageUrl ? [article.coverImageUrl] : undefined,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [AUTHOR.url],
    },
    twitter: {
      card: "summary_large_image",
      images: article.coverImageUrl ? [article.coverImageUrl] : undefined,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = await getTechArticle(slug);
  if (!article) notFound();

  const articleUrl = `${SITE_URL}/guides/${slug}`;
  const imageUrl = article.coverImageUrl ? absoluteUrl(article.coverImageUrl) : undefined;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${articleUrl}#article`,
              mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
              headline: article.seoTitle ?? article.title,
              description: article.seoDescription ?? article.description,
              image: imageUrl ? [imageUrl] : undefined,
              datePublished: article.publishedAt,
              dateModified: article.updatedAt ?? article.publishedAt,
              author: { "@id": `${AUTHOR.url}#person` },
              publisher: { "@id": `${AUTHOR.url}#person` },
              keywords: article.taxonomies?.join(", "),
              isPartOf: { "@id": `${SITE_URL}/#website` },
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${articleUrl}#breadcrumb`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: SITE_NAME,
                  item: SITE_URL,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: article.seoTitle ?? article.title,
                  item: articleUrl,
                },
              ],
            },
          ],
        }}
      />
      <SanityUpdatingArticle article={article} />
    </>
  );
}