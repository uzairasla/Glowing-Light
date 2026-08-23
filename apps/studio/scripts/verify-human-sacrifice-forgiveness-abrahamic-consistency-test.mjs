import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({apiVersion: "2026-08-12"}).withConfig({
  perspective: "raw",
  useCdn: false,
});
const documentId =
  "drafts.article-human-sacrifice-forgiveness-abrahamic-consistency-test";

const document = await client.fetch(
  `*[_id == $documentId][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    taxonomies[]{_ref},
    body
  }`,
  {documentId},
);

if (!document) {
  throw new Error(`Missing Sanity draft: ${documentId}`);
}

const failures = [];
const serialized = JSON.stringify(document);
const text = (document.body ?? [])
  .flatMap((item) => [
    item.text,
    item.translation,
    item.reference,
    item.title,
    item.body,
    item.finalLine,
    ...(item.children ?? []).map((child) => child.text),
    ...(item.items ?? []).flatMap((entry) => [entry.text, entry.url]),
    ...(item.rows ?? []).flatMap((row) => row.cells ?? []),
  ])
  .filter(Boolean)
  .join("\n");

const requireValue = (condition, message) => {
  if (!condition) failures.push(message);
};

requireValue(
  document.title ===
    "The Abrahamic Consistency Test: Does God Require a Human Sacrifice to Forgive?",
  "Unexpected title.",
);
requireValue(
  document.slug === "does-god-require-human-sacrifice-to-forgive",
  "Unexpected slug.",
);
requireValue(
  document.taxonomies?.some(
    (item) => item._ref === "84c893d4-2898-4444-b36d-3f8607d78b9a",
  ),
  "Missing comparative-faith taxonomy reference.",
);
requireValue((document.body?.length ?? 0) >= 70, "Article body is unexpectedly short.");

for (const phrase of [
  "Leviticus 5",
  "Isaiah 53",
  "Abraham's son",
  "Quran 37:102",
  "No bearer carries another person's burden",
  "Hebrews 9:22",
  "The strongest Christian response",
  "The verdict of the Abrahamic Consistency Test",
  "Grounding note:",
]) {
  requireValue(text.includes(phrase), `Missing required coverage: ${phrase}`);
}

for (const forbidden of ["ï¿½", "â€œ", "â€", "Â·", "Ã"]) {
  requireValue(!serialized.includes(forbidden), `Encoding artifact found: ${forbidden}`);
}

const quranBlocks = (document.body ?? []).filter(
  (item) => item._type === "quranVerse",
);
requireValue(quranBlocks.length >= 5, "Expected at least five grounded Quran blocks.");
requireValue(
  quranBlocks.every((item) => item.reference?.includes("Tafhim al-Quran")),
  "Every Quran block must identify the Tafhim al-Quran translation.",
);

const sourceList = (document.body ?? []).find(
  (item) => item._type === "sourceList",
);
requireValue(Boolean(sourceList), "Missing source list.");
requireValue(
  (sourceList?.items?.length ?? 0) >= 35,
  "Source list is unexpectedly short.",
);
requireValue(
  sourceList?.items?.every(
    (item) => !item.url || /^https:\/\//.test(item.url),
  ),
  "A source URL is invalid.",
);

if (failures.length > 0) {
  console.error(JSON.stringify({documentId, failures}, null, 2));
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      {
        documentId,
        title: document.title,
        slug: document.slug,
        bodyComponents: document.body.length,
        quranBlocks: quranBlocks.length,
        sources: sourceList.items.length,
        status: "verified",
      },
      null,
      2,
    ),
  );
}
