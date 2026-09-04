import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({apiVersion: "2026-07-23"});
const ids = [
  "article-why-does-anything-exist",
  "article.why-does-anything-exist",
  "article-hell-actions-consequences-abrahamic-faiths",
];

for (const id of ids) {
  const document = await client.getDocument(id);
  if (!document) {
    console.log(JSON.stringify({id, missing: true}));
    continue;
  }

  console.log(
    JSON.stringify(
      {
        id,
        revision: document._rev,
        title: document.title,
        body: (document.body ?? []).map((item, index) => ({
          index,
          ...item,
        })),
      },
      null,
      2,
    ),
  );
}
