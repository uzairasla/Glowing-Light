import sanityCli from "sanity/cli";

const client = sanityCli
  .getCliClient({ apiVersion: "2026-07-23" })
  .withConfig({ perspective: "raw" });

const documents = await client.fetch(`*[_type == "article"] | order(title asc) {
  _id,
  _rev,
  _updatedAt,
  title,
  "slug": slug.current,
  body
}`);

function portableText(block) {
  return (block.children ?? [])
    .filter((child) => child?._type === "span")
    .map((child) => child.text ?? "")
    .join("");
}

const inventory = documents.map((document) => ({
  id: document._id,
  status: document._id.startsWith("drafts.") ? "draft" : "published",
  revision: document._rev,
  updatedAt: document._updatedAt,
  title: document.title,
  slug: document.slug,
  quotes: (document.body ?? []).flatMap((item, index) => {
    if (item?._type === "quranVerse") {
      return [
        {
          index,
          key: item._key,
          type: "quranVerse",
          reference: item.reference,
          arabic: item.arabic,
          text: item.translation,
        },
      ];
    }

    if (item?._type === "block" && item.style === "blockquote") {
      return [
        {
          index,
          key: item._key,
          type: "blockquote",
          text: portableText(item),
        },
      ];
    }

    return [];
  }),
}));

console.log(
  JSON.stringify(
    {
      documentCount: inventory.length,
      publishedCount: inventory.filter((item) => item.status === "published")
        .length,
      draftCount: inventory.filter((item) => item.status === "draft").length,
      quoteCount: inventory.reduce(
        (total, item) => total + item.quotes.length,
        0,
      ),
      documents: inventory,
    },
    null,
    2,
  ),
);
