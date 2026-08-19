import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getGuideArticlesPage } from "../lib/sanity";
import { AUTHOR, SITE_NAME, SITE_URL } from "../lib/site";
import { DevFieldnotesHome } from "../src/DevFieldnotesHome";
import { JsonLd } from "../src/JsonLd";

export const revalidate = 60;

type HomePageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

function parsePage(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined) return 1;
  if (!/^[1-9]\d*$/.test(raw)) return null;

  const page = Number(raw);
  return Number.isSafeInteger(page) ? page : null;
}

export async function generateMetadata({
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const { page: value } = await searchParams;
  const page = parsePage(value) ?? 1;
  const canonical = page === 1 ? "/" : `/?page=${page}`;
  const pageTitle = page > 1 ? `Latest technical guides — Page ${page}` : undefined;
  const description =
    "Practical, tested guides for debugging Next.js, Sanity, deployment, caching, and modern web development.";

  return {
    title: pageTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: pageTitle ?? "Dev Fieldnotes - Tested solutions for modern web development",
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: ["/og.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        pageTitle ??
        "Dev Fieldnotes - Tested solutions for modern web development",
      description,
      images: ["/og.png"],
    },
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: value } = await searchParams;
  const page = parsePage(value);
  if (page === null) notFound();
  if (value !== undefined && page === 1) redirect("/#guides");

  const guidePage = await getGuideArticlesPage(page);
  if (page > guidePage.totalPages) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: SITE_NAME,
              description:
                "Practical, tested guides for debugging Next.js, Sanity, deployment, caching, and modern web development.",
              publisher: { "@id": `${AUTHOR.url}#person` },
            },
            {
              "@type": "ItemList",
              numberOfItems: guidePage.items.length,
              itemListElement: guidePage.items.map((guide, index) => ({
                "@type": "ListItem",
                position: (page - 1) * guidePage.pageSize + index + 1,
                url: `${SITE_URL}/guides/${guide.slug}`,
                name: guide.title,
              })),
            },
          ],
        }}
      />
      <DevFieldnotesHome
        guides={guidePage.items}
        latestGuide={guidePage.latest}
        currentPage={page}
        pageSize={guidePage.pageSize}
        totalPages={guidePage.totalPages}
      />
    </>
  );
}
