import {readFile} from "node:fs/promises";
import {homedir} from "node:os";
import {join} from "node:path";
import {createClient} from "@sanity/client";

const session = JSON.parse(
  await readFile(join(homedir(), ".config", "sanity", "config.json"), "utf8"),
);
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "dis8yhkz",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  apiVersion: "2026-08-01",
  useCdn: false,
  token: session.authToken,
  perspective: "raw",
});

const id = "drafts.article-sex-covenant-chastity-abrahamic-faiths";
const document = await client.getDocument(id);
if (!document) throw new Error(`Missing Sanity draft: ${id}`);

const keys = [];
const collectKeys = (value) => {
  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item);
    return;
  }
  if (!value || typeof value !== "object") return;
  if (typeof value._key === "string") keys.push(value._key);
  for (const child of Object.values(value)) collectKeys(child);
};
collectKeys(document.body);

const duplicateKeys = [...new Set(keys.filter((key, index) => keys.indexOf(key) !== index))];
const quranReferences = document.body
  .filter((item) => item._type === "quranVerse")
  .map((item) => item.reference);
const sourceList = document.body.find((item) => item._type === "sourceList");
const missingSourceFields = (sourceList?.items ?? []).filter((item) => !item.text || !item.url);
const requiredQuranReferences = ["17:32", "23:5-7", "24:30", "24:33", "24:4", "25:70-71"];
const missingQuranReferences = requiredQuranReferences.filter(
  (reference) => !quranReferences.some((value) => value.includes(reference)),
);
const hasTaxonomy = document.taxonomies?.some(
  (item) => item._ref === "84c893d4-2898-4444-b36d-3f8607d78b9a",
);

const failures = [];
if (document.slug?.current !== "sex-covenant-chastity-abrahamic-faiths") failures.push("slug");
if (!hasTaxonomy) failures.push("taxonomy");
if ((document.body?.length ?? 0) < 70) failures.push("body length");
if (duplicateKeys.length) failures.push("duplicate keys");
if (!sourceList || (sourceList.items?.length ?? 0) < 25) failures.push("source list");
if (missingSourceFields.length) failures.push("source fields");
if (missingQuranReferences.length) failures.push("Quran references");
if (!document.body.some((item) => item._type === "conclusionPanel")) failures.push("conclusion");
if (!document.body.some((item) => item._type === "sideNote")) failures.push("grounding note");

if (failures.length) {
  throw new Error(`Verification failed: ${failures.join(", ")}`);
}

console.log(
  JSON.stringify(
    {
      id: document._id,
      title: document.title,
      slug: document.slug.current,
      updatedAt: document._updatedAt,
      bodyComponents: document.body.length,
      quranReferences,
      sourceCount: sourceList.items.length,
      duplicateKeys: duplicateKeys.length,
      status: "verified draft",
    },
    null,
    2,
  ),
);
