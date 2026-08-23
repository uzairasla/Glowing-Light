import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({apiVersion: "2026-08-18"});
const documentId = "drafts.article-original-sin-abrahamic-consistency-test";

const article = await client.fetch(
  `*[_id == $documentId][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
    taxonomies,
    "bodyComponents": count(body),
    "componentTypes": array::unique(body[]._type),
    "sourceCount": count(body[_type == "sourceList"][0].items),
    "quranVerseCount": count(body[_type == "quranVerse"]),
    "hasGroundingNote": count(body[_type == "sideNote" && body match "*Grounded with quran.ai*"]) > 0
  }`,
  {documentId},
);

if (!article) {
  throw new Error(`Draft not found: ${documentId}`);
}

const requiredTypes = ["lead", "block", "callout", "table", "quranVerse", "pullQuote", "sourceList", "sideNote"];
const missingTypes = requiredTypes.filter((type) => !article.componentTypes.includes(type));
const failures = [];

if (article._type !== "article") failures.push("document is not an article");
if (article.slug !== "are-we-born-guilty-for-adams-sin") failures.push("slug is incorrect");
if (!article.taxonomies?.length) failures.push("taxonomy is missing");
if (article.bodyComponents < 40) failures.push("body is unexpectedly short");
if (article.sourceCount < 20) failures.push("source list is unexpectedly short");
if (article.quranVerseCount < 6) failures.push("Quran evidence is unexpectedly sparse");
if (!article.hasGroundingNote) failures.push("quran.ai grounding note is missing");
if (missingTypes.length) failures.push(`missing component types: ${missingTypes.join(", ")}`);

if (failures.length) {
  throw new Error(`Verification failed: ${failures.join("; ")}`);
}

console.log(JSON.stringify({...article, status: "verified-draft"}, null, 2));
