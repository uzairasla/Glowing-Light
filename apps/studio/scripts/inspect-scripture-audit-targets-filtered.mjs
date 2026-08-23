import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({ apiVersion: "2026-07-23" });
const targetRules = {
  "article-why-does-anything-exist": (item) => item?._type === "quranVerse",
  "article.why-does-anything-exist": (item) =>
    ["quranVerse", "sourceList", "sideNote"].includes(item?._type),
  "article-hell-actions-consequences-abrahamic-faiths": (item) =>
    ["blockquote", "quranVerse", "table", "sourceList", "sideNote"].includes(
      item?.style === "blockquote" ? "blockquote" : item?._type,
    ),
};

for (const [id, include] of Object.entries(targetRules)) {
  const document = await client.getDocument(id);
  if (!document) {
    console.log(JSON.stringify({ id, missing: true }));
    continue;
  }

  console.log(
    JSON.stringify(
      {
        id,
        revision: document._rev,
        title: document.title,
        body: (document.body ?? []).flatMap((item, index) =>
          include(item) ? [{ index, ...item }] : [],
        ),
      },
      null,
      2,
    ),
  );
}
