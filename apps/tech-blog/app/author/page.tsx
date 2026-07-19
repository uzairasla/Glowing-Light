import type { Metadata } from "next";
import { AUTHOR, SITE_NAME, SITE_URL } from "../../lib/site";
import { JsonLd } from "../../src/JsonLd";
import "./author.css";

export const metadata: Metadata = {
  title: "Uzair — Software Engineer",
  description:
    "Meet Uzair, the software engineer behind Dev Fieldnotes, with more than seven years of experience building production web systems.",
  alternates: { canonical: "/author" },
  openGraph: {
    title: "Uzair — Software Engineer",
    description:
      "The software engineer behind Dev Fieldnotes, with more than seven years of experience building production web systems.",
    url: "/author",
    siteName: SITE_NAME,
    type: "profile",
    images: ["/og.png"],
  },
};

export default function AuthorPage() {
  const person = {
    "@type": "Person",
    "@id": `${AUTHOR.url}#person`,
    name: AUTHOR.name,
    url: AUTHOR.url,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.description,
    knowsAbout: [
      "Software engineering",
      "Next.js",
      "Sanity CMS",
      "WordPress",
      "Website migrations",
      "HubSpot",
      "Subscription systems",
      "FIFO queues",
      "Web analytics",
      "Event technology",
    ],
  };

  return (
    <div className="author-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            person,
            {
              "@type": "ProfilePage",
              "@id": `${AUTHOR.url}#profile`,
              url: AUTHOR.url,
              name: "Uzair — Software Engineer",
              isPartOf: { "@id": `${SITE_URL}/#website` },
              mainEntity: { "@id": `${AUTHOR.url}#person` },
            },
          ],
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
          <a href="/guides">Guides</a>
          <a href="/author" aria-current="page">Author</a>
        </nav>
      </header>

      <main>
        <section className="author-hero">
          <span className="section-index">AUTHOR / SOFTWARE ENGINEER</span>
          <h1>Uzair</h1>
          <p>
            I&apos;ve worked in the technology industry as a software engineer
            for more than seven years, consistently using new technologies to
            develop practical, production-ready systems.
          </p>
        </section>

        <section className="author-body">
          <div>
            <span className="section-index">EXPERIENCE</span>
            <h2>Building systems that hold up in production.</h2>
          </div>
          <div className="author-copy">
            <p>
              My work has included Sanity CMS and WordPress implementations,
              along with website migrations involving thousands of pages where
              content integrity, redirects, and continuity matter.
            </p>
            <p>
              I&apos;ve built HubSpot-based subscription systems using FIFO
              queues to coordinate requests within rate limits and reduce
              operating costs. I&apos;ve also developed form systems connected
              to subscription platforms, Google Analytics, and agenda builders
              for event systems.
            </p>
            <p>
              Dev Fieldnotes is where I document the failure modes, tradeoffs,
              and verified solutions that emerge from that work.
            </p>
            <a className="author-cta" href="/#guides">Read the field guides</a>
          </div>
        </section>
      </main>

      <footer className="author-footer">
        <strong>DEV FIELDNOTES</strong>
        <span>Tested solutions for modern web development.</span>
      </footer>
    </div>
  );
}
