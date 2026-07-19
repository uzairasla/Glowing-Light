import { AUTHOR, SITE_NAME, SITE_URL } from "../lib/site";
import { DevFieldnotesHome } from "../src/DevFieldnotesHome";
import { JsonLd } from "../src/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: SITE_NAME,
          description:
            "Practical, tested guides for debugging Next.js, Sanity, deployment, caching, and modern web development.",
          publisher: { "@id": `${AUTHOR.url}#person` },
        }}
      />
      <DevFieldnotesHome />
    </>
  );
}