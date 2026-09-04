import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({ apiVersion: "2026-07-23" });

const documents = await client.fetch(`*[_type == "article"] | order(title asc) {
  _id,
  _rev,
  _updatedAt,
  title,
  "slug": slug.current,
  body
}`);

const scriptureReferencePattern =
  /\b(?:Qur(?:an|'an|’an)|Surah|Sahih|Hadith|Torah|Tanakh|Bible|Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Psalms?|Proverbs|Ecclesiastes|Isaiah|Jeremiah|Ezekiel|Daniel|Matthew|Mark|Luke|John|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Hebrews|James|Peter|Jude|Revelation)\b/i;
const numericReferencePattern = /\b\d{1,3}:\d{1,3}(?:[–-]\d{1,3})?\b/;

function portableText(block) {
  return (block.children ?? [])
    .filter((child) => child?._type === "span")
    .map((child) => child.text ?? "")
    .join("");
}

function collectEmbeddedStrings(value, path = "") {
  if (typeof value === "string") {
    if (
      scriptureReferencePattern.test(value) ||
      numericReferencePattern.test(value)
    ) {
      return [{ path, text: value }];
    }
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectEmbeddedStrings(item, `${path}[${index}]`),
    );
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      key.startsWith("_")
        ? []
        : collectEmbeddedStrings(item, path ? `${path}.${key}` : key),
    );
  }

  return [];
}

const inventory = documents.map((document) => {
  const body = document.body ?? [];
  const quotes = [];
  const references = [];

  body.forEach((item, index) => {
    if (item?._type === "quranVerse") {
      quotes.push({
        index,
        type: "quranVerse",
        reference: item.reference,
        arabic: item.arabic,
        text: item.translation,
      });
      return;
    }

    if (item?._type === "block") {
      const text = portableText(item);
      if (item.style === "blockquote") {
        quotes.push({
          index,
          type: "blockquote",
          text,
        });
      } else if (
        scriptureReferencePattern.test(text) ||
        numericReferencePattern.test(text)
      ) {
        references.push({
          index,
          type: `block:${item.style ?? "normal"}`,
          path: "text",
          text,
        });
      }
      return;
    }

    for (const match of collectEmbeddedStrings(item)) {
      references.push({
        index,
        type: item?._type ?? "unknown",
        ...match,
      });
    }
  });

  return {
    id: document._id,
    status: document._id.startsWith("drafts.") ? "draft" : "published",
    revision: document._rev,
    updatedAt: document._updatedAt,
    title: document.title,
    slug: document.slug,
    bodyBlocks: body.length,
    quotes,
    references,
  };
});

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
