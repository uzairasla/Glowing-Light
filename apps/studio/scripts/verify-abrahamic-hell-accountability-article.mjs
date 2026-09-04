import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({ apiVersion: "2026-07-23" });
const documentId = "drafts.article-hell-actions-consequences-abrahamic-faiths";
const document = await client.getDocument(documentId);

if (!document) {
  throw new Error(`Sanity draft not found: ${documentId}`);
}

console.log(
  JSON.stringify(
    {
      documentId: document._id,
      type: document._type,
      title: document.title,
      slug: document.slug?.current,
      bodyBlocks: document.body?.length ?? 0,
      quranBlocks:
        document.body?.filter((item) => item._type === "quranVerse").length ??
        0,
      tables:
        document.body?.filter((item) => item._type === "table").length ?? 0,
    },
    null,
    2,
  ),
);
