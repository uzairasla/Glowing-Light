import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const topicId = "taxonomy-death-judgment-and-afterlife";
const topicSlug = "death-judgment-and-afterlife";
const topicReferenceKey = "deathJudgmentAfterlife";

const topic = {
  _id: topicId,
  _type: "taxonomy",
  title: "Death, Judgment and the Afterlife",
  slug: { _type: "slug", current: topicSlug },
  description:
    "Explore death, resurrection, moral accountability, divine judgment, Heaven, Hell, and the world to come across Judaism, Christianity, and Islam.",
  kind: "topic",
};

const selectedArticles = [
  {
    id: "article-hell-actions-consequences-abrahamic-faiths",
    reason:
      "A direct comparison of Hell, judgment, conduct, and final consequences.",
  },
  {
    id: "article-judgment-accountability-abrahamic-faiths",
    reason:
      "A direct comparison of final judgment and personal accountability.",
  },
  {
    id: "article-divine-plan-human-responsibility",
    reason:
      "Substantively examines moral responsibility and the justice of divine judgment.",
  },
  {
    id: "article-did-jesus-survive-crucifixion-ate-fish",
    reason:
      "Centrally examines death, bodily resurrection, and post-crucifixion appearances.",
  },
  {
    id: "article-did-jesus-choose-to-die-sacrifice-execution",
    reason:
      "Centrally examines death, execution, sacrifice, guilt, and judgment.",
  },
  {
    id: "article-jesus-in-islam",
    reason:
      "Contains substantial sections on Jesus’ death, crucifixion, return, and end-times role.",
  },
];

async function readEnvValue(path, name) {
  try {
    const contents = await readFile(path, "utf8");
    const line = contents
      .split(/\r?\n/)
      .find((candidate) => candidate.trim().startsWith(`${name}=`));
    if (!line) return undefined;
    return line
      .slice(line.indexOf("=") + 1)
      .trim()
      .replace(/^(["'])(.*)\1$/, "$2");
  } catch {
    return undefined;
  }
}

async function resolveToken() {
  if (process.env.SANITY_WRITE_TOKEN) return process.env.SANITY_WRITE_TOKEN;

  const envToken = await readEnvValue(
    join(scriptDir, "../../.env.local"),
    "SANITY_WRITE_TOKEN",
  );
  if (envToken) return envToken;

  try {
    const session = JSON.parse(
      await readFile(
        join(homedir(), ".config", "sanity", "config.json"),
        "utf8",
      ),
    );
    return session.authToken;
  } catch {
    return undefined;
  }
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "dis8yhkz";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const apiVersion = "2026-09-05";
const publish = process.argv.includes("--publish");
const token = publish ? await resolveToken() : undefined;

if (publish && !token) {
  throw new Error(
    "Missing SANITY_WRITE_TOKEN in apps/.env.local and no Sanity CLI session was found.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token,
});

const selectedIds = selectedArticles.map((article) => article.id);
const [articles, duplicateTopicCount] = await Promise.all([
  client.fetch(
    `*[_type == "article" && _id in $selectedIds] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      "taxonomyIds": taxonomies[]._ref
    }`,
    { selectedIds },
  ),
  client.fetch(
    `count(*[
      _type == "taxonomy" &&
      slug.current == $topicSlug &&
      _id != $topicId &&
      !(_id in path("drafts.**"))
    ])`,
    { topicSlug, topicId },
  ),
]);

if (duplicateTopicCount > 0) {
  throw new Error(
    `Refusing to create the topic because ${duplicateTopicCount} other taxonomy document(s) use ${topicSlug}.`,
  );
}

const articlesById = new Map(articles.map((article) => [article._id, article]));
const missingIds = selectedIds.filter((id) => !articlesById.has(id));
if (missingIds.length > 0) {
  throw new Error(
    `Missing published article document(s): ${missingIds.join(", ")}`,
  );
}

const audit = selectedArticles.map(({ id, reason }) => {
  const article = articlesById.get(id);
  return {
    id,
    title: article.title,
    slug: article.slug,
    reason,
    alreadyTagged: (article.taxonomyIds ?? []).includes(topicId),
  };
});

if (!publish) {
  console.log(
    JSON.stringify(
      {
        status: "dry-run",
        topic,
        selectedArticleCount: audit.length,
        articles: audit,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

let transaction = client
  .transaction()
  .createOrReplace(topic)
  .delete(`drafts.${topicId}`);

for (const article of audit) {
  if (article.alreadyTagged) continue;

  transaction = transaction.patch(article.id, (patch) =>
    patch
      .setIfMissing({ taxonomies: [] })
      .append("taxonomies", [
        { _key: topicReferenceKey, _type: "reference", _ref: topicId },
      ]),
  );
}

const result = await transaction.commit();
const verification = await client.fetch(
  `{
    "topic": *[_id == $topicId][0]{
      _id,
      title,
      "slug": slug.current,
      description,
      kind
    },
    "articles": *[_type == "article" && references($topicId)] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      "taxonomyIds": taxonomies[]._ref
    }
  }`,
  { topicId },
);

const verifiedIds = new Set(
  verification.articles.map((article) => article._id),
);
const unverifiedIds = selectedIds.filter((id) => !verifiedIds.has(id));
if (!verification.topic || unverifiedIds.length > 0) {
  throw new Error(
    `Post-publish verification failed. Missing topic or article reference(s): ${unverifiedIds.join(", ")}`,
  );
}

console.log(
  JSON.stringify(
    {
      status: "published",
      transactionId: result.transactionId,
      topic: verification.topic,
      selectedArticleCount: selectedIds.length,
      newlyTaggedCount: audit.filter((article) => !article.alreadyTagged)
        .length,
      articles: verification.articles,
    },
    null,
    2,
  ),
);
