import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({apiVersion: "2026-08-13"}).withConfig({
  perspective: "raw",
  useCdn: false,
});

const draftId =
  "drafts.article-human-sacrifice-forgiveness-abrahamic-consistency-test";
const publishedId = draftId.replace(/^drafts\./, "");
const expectedSlug = "does-god-require-human-sacrifice-to-forgive";

const [draft, published] = await Promise.all([
  client.fetch("*[_id == $draftId][0]{_id}", {draftId}),
  client.fetch(
    "*[_id == $publishedId][0]{_id,title,\"slug\":slug.current,body,taxonomies[]{_ref}}",
    {publishedId},
  ),
]);

const failures = [];
if (draft) failures.push("Draft copy still exists after publication.");
if (!published) failures.push("Published document is missing.");
if (published?.slug !== expectedSlug) failures.push("Published slug is incorrect.");
if ((published?.body?.length ?? 0) !== 90) {
  failures.push("Published body component count changed unexpectedly.");
}
if (
  !published?.taxonomies?.some(
    (item) => item._ref === "84c893d4-2898-4444-b36d-3f8607d78b9a",
  )
) {
  failures.push("Published article is missing its taxonomy reference.");
}

if (failures.length > 0) {
  console.error(JSON.stringify({publishedId, failures}, null, 2));
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      {
        documentId: published._id,
        title: published.title,
        slug: published.slug,
        bodyComponents: published.body.length,
        draftRemoved: true,
        status: "verified-published",
      },
      null,
      2,
    ),
  );
}
