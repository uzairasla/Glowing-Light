import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({apiVersion: "2026-07-24"});

const expected = [
  {
    id: "drafts.article-one-god-oneness-abrahamic-faiths",
    slug: "one-god-oneness-abrahamic-faiths",
    linkedUrl:
      "https://theglowinglight.com/lessons/is-jesus-god-scripture-trinity-textual-evidence",
    quranReferences: ["Quran 2:163", "Quran 112:1–4", "Quran 6:102"],
  },
  {
    id: "drafts.article-is-jesus-god-scripture-trinity-textual-evidence",
    slug: "is-jesus-god-scripture-trinity-textual-evidence",
    linkedUrl:
      "https://theglowinglight.com/lessons/one-god-oneness-abrahamic-faiths",
    quranReferences: ["Quran 4:171", "Quran 5:72"],
  },
];

const failures = [];
const summaries = [];

for (const target of expected) {
  const document = await client.getDocument(target.id);

  if (!document) {
    failures.push(`${target.id}: document not found`);
    continue;
  }

  const body = document.body ?? [];
  const links = body.flatMap((item) =>
    (item.markDefs ?? [])
      .filter((mark) => mark._type === "link")
      .map((mark) => mark.href),
  );
  const quranBlocks = body.filter((item) => item._type === "quranVerse");
  const sourceBlocks = body.filter((item) => item._type === "sourceList");
  const serialized = JSON.stringify(document);

  if (document.slug?.current !== target.slug) {
    failures.push(`${target.id}: unexpected slug ${document.slug?.current}`);
  }

  if (!links.includes(target.linkedUrl)) {
    failures.push(`${target.id}: reciprocal article link is missing`);
  }

  if (!document.taxonomies?.some((item) => item._ref === "84c893d4-2898-4444-b36d-3f8607d78b9a")) {
    failures.push(`${target.id}: Explore Abrahamic Faiths taxonomy is missing`);
  }

  for (const reference of target.quranReferences) {
    if (!quranBlocks.some((item) => item.reference?.includes(reference))) {
      failures.push(`${target.id}: missing Quran block for ${reference}`);
    }
  }

  if (sourceBlocks.length !== 1) {
    failures.push(`${target.id}: expected exactly one source list`);
  }

  if (serialized.includes("â€") || serialized.includes("Â")) {
    failures.push(`${target.id}: possible encoding corruption detected`);
  }

  summaries.push({
    id: document._id,
    title: document.title,
    slug: document.slug?.current,
    blocks: body.length,
    quranBlocks: quranBlocks.length,
    tables: body.filter((item) => item._type === "table").length,
    sources: sourceBlocks[0]?.items?.length ?? 0,
    reciprocalLink: links.find((href) => href === target.linkedUrl),
    taxonomy: document.taxonomies?.map((item) => item._ref),
  });
}

if (failures.length > 0) {
  console.error(JSON.stringify({status: "failed", failures, summaries}, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({status: "verified", summaries}, null, 2));
}
