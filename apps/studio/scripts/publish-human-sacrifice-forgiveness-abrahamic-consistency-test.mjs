import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({apiVersion: "2026-08-13"}).withConfig({
  perspective: "raw",
  useCdn: false,
});

const draftId =
  "drafts.article-human-sacrifice-forgiveness-abrahamic-consistency-test";
const publishedId = draftId.replace(/^drafts\./, "");

const draft = await client.fetch(
  "*[_id == $draftId][0]",
  {draftId},
);

if (!draft) {
  throw new Error(`Missing verified draft: ${draftId}`);
}

const published = {
  ...draft,
  _id: publishedId,
};
delete published._rev;
delete published._createdAt;
delete published._updatedAt;

const result = await client
  .transaction()
  .createOrReplace(published)
  .delete(draftId)
  .commit();

console.log(
  JSON.stringify(
    {
      documentId: publishedId,
      slug: published.slug?.current,
      status: "published",
      transactionId: result.transactionId,
    },
    null,
    2,
  ),
);
