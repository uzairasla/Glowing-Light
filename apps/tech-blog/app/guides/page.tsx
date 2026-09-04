import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  GUIDES_PER_PAGE,
  getGuideArticleCount,
  getGuideArticles,
} from "../../lib/sanity";
import { JsonLd } from "../../src/JsonLd";
import { SITE_NAME, SITE_URL, absoluteUrl } from "../../lib/site";
import "./guides.css";

export const revalidate = 60;

type GuidesPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

function parsePage(value?: string | string[]) {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function pageHref(page: number) {
  return page === 1 ? "/guides" : `/guides?page=${page}`;
}

export async function generateMetadata({
  searchParams,
}: GuidesPageProps): Promise<Metadata> {
  const { page: requestedPage } = await searchParams;
  const currentPage = parsePage(requestedPage);
  const pageSuffix = currentPage > 1 ? ` – Page ${currentPage}` : "";
  const canonical = pageHref(currentPage);
  const description =
    "Browse tested Dev Fieldnotes guides for Next.js, Sanity, deployment, caching, and production debugging.";

  return {
    title: `Guides${pageSuffix}`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `Guides${pageSuffix} | Dev Fieldnotes`,
      description:
        "Tested field guides for modern web development and production debugging.",
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `Guides${pageSuffix} | Dev Fieldnotes`,
      description:
        "Tested field guides for modern web development and production debugging.",
      images: ["/og.png"],
    },
  };
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const { page: requestedPage } = await searchParams;
  const currentPage = parsePage(requestedPage);
  const guideCount = await getGuideArticleCount();
  const totalPages = Math.max(1, Math.ceil(guideCount / GUIDES_PER_PAGE));

  if (currentPage > totalPages) notFound();

  const offset = (currentPage - 1) * GUIDES_PER_PAGE;
  const guides = await getGuideArticles({
    offset,
    limit: GUIDES_PER_PAGE,
  });
  const currentPageHref = pageHref(currentPage);

  return (
    <div className="guides-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${SITE_URL}${currentPageHref}#collection`,
          url: `${SITE_URL}${currentPageHref}`,
          name: currentPage > 1 ? `Guides – Page ${currentPage}` : "Guides",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: guides.length,
            itemListElement: guides.map((guide, index) => ({
              "@type": "ListItem",
              position: offset + index + 1,
              url: `${SITE_URL}/guides/${guide.slug}`,
              name: guide.title,
            })),
          },
        }}
      />
      <header className="topbar">
        <a className="brand" href="/" aria-label="Dev Fieldnotes home">
          <span className="brand-mark" aria-hidden="true">
            D<span>/</span>F
          </span>
          <span>DEV FIELDNOTES</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/guides" aria-current="page">Guides</a>
          <a href="/kits">Kits</a>
          <a href="/author">Author</a>
        </nav>
      </header>

      <main>
        <section className="guides-hero">
          <span className="section-index">
            DEV FIELDNOTES / LIBRARY
            {currentPage > 1 && ` / PAGE ${currentPage} OF ${totalPages}`}
          </span>
          <h1>Guides</h1>
          <p>
            Tested solutions, reproducible failure modes, and practical
            verification steps for modern web development.
          </p>
        </section>

        <section className="guides-list" aria-label="Published guides">
          {guides.map((guide, index) => (
            <article className="guide-row" key={guide._id}>
              <span className="guide-index">
                {String(offset + index + 1).padStart(2, "0")}
              </span>
              <a
                className="guide-cover"
                href={`/guides/${guide.slug}`}
                aria-label={`Read ${guide.title}`}
              >
                {guide.coverImageUrl && (
                  <img
                    src={absoluteUrl(guide.coverImageUrl)}
                    alt={guide.coverImageAlt || ""}
                  />
                )}
              </a>
              <div className="guide-copy">
                <div className="guide-meta">
                  <span>{guide.taxonomies?.join(" · ")}</span>
                  <span>{formatDate(guide.updatedAt ?? guide.publishedAt)}</span>
                </div>
                <h2>
                  <a href={`/guides/${guide.slug}`}>{guide.title}</a>
                </h2>
                <p>{guide.description}</p>
                <a className="guide-link" href={`/guides/${guide.slug}`}>
                  Read guide
                </a>
              </div>
            </article>
          ))}
          {!guides.length && (
            <p className="guides-empty">No published guides yet.</p>
          )}
          {totalPages > 1 && (
            <nav className="guides-pagination" aria-label="Guides pagination">
              {currentPage > 1 ? (
                <a
                  className="pagination-direction"
                  href={pageHref(currentPage - 1)}
                  rel="prev"
                >
                  Previous
                </a>
              ) : (
                <span className="pagination-direction is-disabled">Previous</span>
              )}

              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) =>
                    page === currentPage ? (
                      <span
                        className="pagination-page is-current"
                        aria-current="page"
                        key={page}
                      >
                        {page}
                      </span>
                    ) : (
                      <a
                        className="pagination-page"
                        href={pageHref(page)}
                        key={page}
                      >
                        {page}
                      </a>
                    ),
                )}
              </div>

              {currentPage < totalPages ? (
                <a
                  className="pagination-direction pagination-next"
                  href={pageHref(currentPage + 1)}
                  rel="next"
                >
                  Next
                </a>
              ) : (
                <span className="pagination-direction pagination-next is-disabled">
                  Next
                </span>
              )}
            </nav>
          )}
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">D<span>/</span>F</span>
          <div><strong>DEV FIELDNOTES</strong><small>Tested solutions for modern web development.</small></div>
        </div>
        <div className="footer-links"><a href="/guides">Guides</a><a href="/kits">Kits</a><a href="/author">Author</a></div>
        <span className="copyright">{"\u00A9"} 2026 Dev Fieldnotes</span>
      </footer>
    </div>
  );
}
