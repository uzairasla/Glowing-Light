import type { Metadata } from "next";
import { getGuideArticles } from "../../lib/sanity";
import { JsonLd } from "../../src/JsonLd";
import { SITE_NAME, SITE_URL, absoluteUrl } from "../../lib/site";
import "./guides.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Browse tested Dev Fieldnotes guides for Next.js, Sanity, deployment, caching, and production debugging.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Guides | Dev Fieldnotes",
    description:
      "Tested field guides for modern web development and production debugging.",
    url: "/guides",
    siteName: SITE_NAME,
    type: "website",
    images: ["/og.png"],
  },
};

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default async function GuidesPage() {
  const guides = await getGuideArticles();

  return (
    <div className="guides-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/guides#collection`,
          url: `${SITE_URL}/guides`,
          name: "Guides",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: guides.length,
            itemListElement: guides.map((guide, index) => ({
              "@type": "ListItem",
              position: index + 1,
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
          <a href="/author">Author</a>
        </nav>
      </header>

      <main>
        <section className="guides-hero">
          <span className="section-index">DEV FIELDNOTES / LIBRARY</span>
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
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="guide-cover">
                {guide.coverImageUrl && (
                  <img
                    src={absoluteUrl(guide.coverImageUrl)}
                    alt={guide.coverImageAlt || ""}
                  />
                )}
              </div>
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
        </section>
      </main>
    </div>
  );
}
