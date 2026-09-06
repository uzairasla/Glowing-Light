import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const scriptDir = dirname(fileURLToPath(import.meta.url));

const topics = [
  {
    id: "taxonomy-jesus-and-christology",
    title: "Jesus and Christology",
    slug: "jesus-and-christology",
    description:
      "Explore who Jesus is, what he taught, his birth, miracles, divinity, crucifixion, resurrection, and return across Christian and Islamic sources.",
    articles: [
      [
        "article-did-jesus-choose-to-die-sacrifice-execution",
        "Examines Jesus’ intent, crucifixion, sacrifice, and competing atonement interpretations.",
      ],
      [
        "article-did-jesus-survive-crucifixion-ate-fish",
        "Examines the Gospel appearance accounts, bodily resurrection, crucifixion, and the Quranic position.",
      ],
      [
        "article-bible-vs-quran-kings-christology",
        "Examines early beliefs about Jesus, sonship, councils, canon, and imperial influence.",
      ],
      [
        "article-human-sacrifice-forgiveness-abrahamic-consistency-test",
        "Compares Christian atonement claims about Jesus with Abraham, prophetic repentance, and the Quran.",
      ],
      [
        "article-is-jesus-god-scripture-trinity-textual-evidence",
        "Directly evaluates Jesus’ identity and the textual case for his divinity.",
      ],
      [
        "article-is-trinity-taught-in-bible",
        "Examines the scriptural and creedal development of Trinitarian Christology.",
      ],
      [
        "article-jesus-in-islam",
        "A comprehensive account of Jesus’ identity, mission, miracles, crucifixion, and return in Islam.",
      ],
      [
        "article-who-is-father-of-jesus-joseph-god-adam",
        "Examines the virgin birth, divine sonship, and the comparison between Jesus and Adam.",
      ],
    ],
  },
  {
    id: "taxonomy-faith-doubt-and-evidence",
    title: "Faith, Doubt and Evidence",
    slug: "faith-doubt-and-evidence",
    description:
      "Investigate honest questions about God, belief, divine hiddenness, purpose, free will, and the philosophical and natural evidence considered by religious faith.",
    articles: [
      [
        "article-a-world-prepared-for-life",
        "Considers habitability and cosmic order as possible evidence of purpose and creation.",
      ],
      [
        "article-does-the-human-body-point-to-an-intelligent-creator",
        "Uses biological order, information, and consciousness to examine the design question.",
      ],
      [
        "article-why-does-anything-exist",
        "Develops scientific and philosophical evidence for a Creator.",
      ],
      [
        "article-if-evolution-is-true-why-need-creator",
        "Addresses a common doubt about whether evolution removes the need for God.",
      ],
      [
        "article-divine-plan-human-responsibility",
        "Addresses the apparent tension between divine decree, human freedom, and accountability.",
      ],
      [
        "article-why-dependent-things-cannot-explain-themselves",
        "Presents the contingency argument for an independent Creator.",
      ],
      [
        "article-why-does-god-need-worship",
        "Answers a common theological objection about divine self-sufficiency and worship.",
      ],
      [
        "article-why-doesnt-god-make-existence-obvious",
        "Directly examines divine hiddenness, sincere nonbelief, evidence, and faith.",
      ],
    ],
  },
  {
    id: "taxonomy-sin-sacrifice-and-salvation",
    title: "Sin, Sacrifice and Salvation",
    slug: "sin-sacrifice-and-salvation",
    description:
      "Compare sin, repentance, forgiveness, sacrifice, atonement, inherited guilt, salvation, and personal responsibility across the Abrahamic traditions.",
    articles: [
      [
        "article-did-jesus-choose-to-die-sacrifice-execution",
        "Directly evaluates whether execution can function as voluntary sacrifice or transferred punishment.",
      ],
      [
        "article-did-jesus-survive-crucifixion-ate-fish",
        "Separates resurrection claims from the further claim that Jesus died as an atoning sacrifice.",
      ],
      [
        "article-hell-actions-consequences-abrahamic-faiths",
        "Examines repentance, righteous action, final consequences, and whether identity alone saves.",
      ],
      [
        "article-human-sacrifice-forgiveness-abrahamic-consistency-test",
        "Directly compares sacrifice, forgiveness, personal guilt, and salvation across scripture.",
      ],
      [
        "article-judgment-accountability-abrahamic-faiths",
        "Compares repentance, individual guilt, moral accountability, and final judgment.",
      ],
    ],
  },
  {
    id: "taxonomy-abraham-covenant-and-shared-heritage",
    title: "Abraham, Covenant and Shared Heritage",
    slug: "abraham-covenant-and-shared-heritage",
    description:
      "Trace Abraham, covenant, monotheism, sacrifice, worship, and shared religious inheritance through Judaism, Christianity, and Islam.",
    articles: [
      [
        "article-circumcision-abrahamic-religions",
        "Examines Abraham’s covenant and circumcision across all three traditions.",
      ],
      [
        "article-prostration-abrahamic-faiths",
        "Traces a shared form of prophetic worship across Abrahamic scripture.",
      ],
      [
        "article-human-sacrifice-forgiveness-abrahamic-consistency-test",
        "Uses Abraham’s commanded sacrifice as a cross-traditional theological comparison.",
      ],
      [
        "article-one-god-oneness-abrahamic-faiths",
        "Compares the monotheistic inheritance shared by the Abrahamic faiths.",
      ],
      [
        "article-what-are-abrahamic-religions",
        "Introduces Abraham, shared roots, scriptures, beliefs, and differences.",
      ],
    ],
  },
  {
    id: "taxonomy-god-and-divine-nature",
    title: "God and Divine Nature",
    slug: "god-and-divine-nature",
    description:
      "Study divine oneness, attributes, self-sufficiency, worship, sonship, the Trinity, and the relationship between God and Jesus across Abrahamic theology.",
    articles: [
      [
        "article-bible-vs-quran-kings-christology",
        "Examines how Jesus came to be understood as the Son of God within Christian history.",
      ],
      [
        "article-is-jesus-god-scripture-trinity-textual-evidence",
        "Directly evaluates whether Jesus belongs within the identity of God.",
      ],
      [
        "article-is-trinity-taught-in-bible",
        "Directly examines the doctrine of one God in three persons.",
      ],
      [
        "article-jesus-in-islam",
        "Explains Islamic monotheism and why honoring Jesus does not mean worshipping him.",
      ],
      [
        "article-one-god-oneness-abrahamic-faiths",
        "Directly compares divine oneness across Judaism, Christianity, and Islam.",
      ],
      [
        "article-who-is-father-of-jesus-joseph-god-adam",
        "Examines divine sonship, miraculous creation, and the uniqueness of God.",
      ],
      [
        "article-why-does-god-need-worship",
        "Examines divine self-sufficiency, purpose, love, judgment, and worship.",
      ],
    ],
  },
  {
    id: "taxonomy-science-creation-and-signs",
    title: "Science, Creation and Signs",
    slug: "science-creation-and-signs",
    description:
      "Explore the universe, life, evolution, the human body, consciousness, and the natural signs that invite reflection on purpose and a Creator.",
    articles: [
      [
        "article-a-world-prepared-for-life",
        "Examines Earth’s habitability, cosmic order, and the question of purpose.",
      ],
      [
        "article-does-the-human-body-point-to-an-intelligent-creator",
        "Examines biology, information, development, consciousness, and design.",
      ],
      [
        "article-why-does-anything-exist",
        "Connects cosmology and scientific evidence with philosophical reasoning about creation.",
      ],
      [
        "article-if-evolution-is-true-why-need-creator",
        "Distinguishes evolutionary mechanisms from questions of origin, laws, and purpose.",
      ],
      [
        "article-what-bees-reveal-about-the-creator",
        "Combines the science of bees with reflection on Quranic natural signs.",
      ],
    ],
  },
  {
    id: "taxonomy-ethics-law-and-society",
    title: "Ethics, Law and Society",
    slug: "ethics-law-and-society",
    description:
      "Compare moral responsibility, justice, religious law, economic ethics, bodily practice, punishment, and social obligation across the Abrahamic faiths.",
    articles: [
      [
        "article-circumcision-abrahamic-religions",
        "Compares covenantal law, bodily practice, and religious authority across the traditions.",
      ],
      [
        "article-hell-actions-consequences-abrahamic-faiths",
        "Connects conduct, repentance, moral consequence, and divine justice.",
      ],
      [
        "article-human-sacrifice-forgiveness-abrahamic-consistency-test",
        "Examines the justice of transferred guilt, innocent punishment, and sacrifice.",
      ],
      [
        "article-divine-plan-human-responsibility",
        "Examines agency, responsibility, fairness, and accountability.",
      ],
      [
        "article-judgment-accountability-abrahamic-faiths",
        "Compares personal responsibility, impartial justice, and treatment of wrongdoing.",
      ],
      [
        "article-interest-usury-abrahamic-faiths",
        "Directly compares economic ethics, lending, exploitation, and religious law.",
      ],
    ],
  },
  {
    id: "taxonomy-scripture-and-revelation",
    title: "Scripture and Revelation",
    slug: "scripture-and-revelation",
    description:
      "Examine the Torah, Tanakh, Bible, and Quran—their formation, authority, interpretation, preservation, textual history, and use in comparative religious claims.",
    articles: [
      [
        "article-bible-vs-quran-kings-christology",
        "Directly examines biblical canon, textual transmission, imperial power, and Quranic history.",
      ],
      [
        "article-circumcision-abrahamic-religions",
        "Compares how scripture, hadith, and religious authority establish practice.",
      ],
      [
        "article-human-sacrifice-forgiveness-abrahamic-consistency-test",
        "Conducts a sustained comparison across Genesis, the prophets, the New Testament, and the Quran.",
      ],
      [
        "article-is-jesus-god-scripture-trinity-textual-evidence",
        "Examines manuscript variants, additions, countertexts, and doctrinal interpretation.",
      ],
      [
        "article-is-trinity-taught-in-bible",
        "Directly evaluates biblical passages, countertexts, and later creedal interpretation.",
      ],
      [
        "article-what-are-abrahamic-religions",
        "Introduces the major scriptures and their roles in the three traditions.",
      ],
    ],
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
const publish = process.argv.includes("--publish");
const token = publish ? await resolveToken() : undefined;

if (publish && !token) {
  throw new Error(
    "Missing SANITY_WRITE_TOKEN in apps/.env.local and no Sanity CLI session was found.",
  );
}

for (const topic of topics) {
  if (topic.articles.length < 2) {
    throw new Error(`${topic.title} has fewer than two launch-ready articles.`);
  }
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-09-05",
  useCdn: false,
  perspective: "published",
  token,
});

const topicIds = topics.map((topic) => topic.id);
const topicSlugs = topics.map((topic) => topic.slug);
const articleIds = [
  ...new Set(
    topics.flatMap((topic) => topic.articles.map(([articleId]) => articleId)),
  ),
];

const [articles, slugOwners] = await Promise.all([
  client.fetch(
    `*[_type == "article" && _id in $articleIds] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      "taxonomyIds": taxonomies[]._ref
    }`,
    { articleIds },
  ),
  client.fetch(
    `*[
      _type == "taxonomy" &&
      slug.current in $topicSlugs &&
      !(_id in path("drafts.**"))
    ]{
      _id,
      title,
      "slug": slug.current
    }`,
    { topicSlugs },
  ),
]);

const articleById = new Map(articles.map((article) => [article._id, article]));
const missingArticleIds = articleIds.filter((id) => !articleById.has(id));
if (missingArticleIds.length > 0) {
  throw new Error(
    `Missing published article document(s): ${missingArticleIds.join(", ")}`,
  );
}

const conflictingSlugs = slugOwners.filter(
  (owner) => !topicIds.includes(owner._id),
);
if (conflictingSlugs.length > 0) {
  throw new Error(
    `Topic slug conflict(s): ${conflictingSlugs
      .map((owner) => `${owner.slug} (${owner._id})`)
      .join(", ")}`,
  );
}

const audit = topics.map((topic) => ({
  id: topic.id,
  title: topic.title,
  slug: topic.slug,
  description: topic.description,
  articles: topic.articles.map(([articleId, reason]) => {
    const article = articleById.get(articleId);
    return {
      id: articleId,
      title: article.title,
      slug: article.slug,
      reason,
      alreadyTagged: (article.taxonomyIds ?? []).includes(topic.id),
    };
  }),
}));

if (!publish) {
  console.log(
    JSON.stringify(
      {
        status: "dry-run",
        topicCount: topics.length,
        uniqueArticleCount: articleIds.length,
        newReferenceCount: audit.reduce(
          (count, topic) =>
            count +
            topic.articles.filter((article) => !article.alreadyTagged).length,
          0,
        ),
        topics: audit,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

let transaction = client.transaction();

for (const topic of topics) {
  transaction = transaction
    .createOrReplace({
      _id: topic.id,
      _type: "taxonomy",
      title: topic.title,
      slug: { _type: "slug", current: topic.slug },
      description: topic.description,
      kind: "topic",
    })
    .delete(`drafts.${topic.id}`);
}

const referencesByArticle = new Map();
for (const topic of audit) {
  for (const article of topic.articles) {
    if (article.alreadyTagged) continue;
    const references = referencesByArticle.get(article.id) ?? [];
    references.push({
      _key: topic.slug.replaceAll("-", "_").slice(0, 80),
      _type: "reference",
      _ref: topic.id,
    });
    referencesByArticle.set(article.id, references);
  }
}

for (const [articleId, references] of referencesByArticle) {
  transaction = transaction.patch(articleId, (patch) =>
    patch.setIfMissing({ taxonomies: [] }).append("taxonomies", references),
  );
}

const result = await transaction.commit();
const verification = await client.fetch(
  `*[_id in $topicIds] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    kind,
    "articles": *[_type == "article" && references(^._id)] | order(title asc) {
      _id,
      title,
      "slug": slug.current
    }
  }`,
  { topicIds },
);

const verifiedTopicById = new Map(
  verification.map((topic) => [topic._id, topic]),
);
const verificationFailures = [];

for (const topic of topics) {
  const verifiedTopic = verifiedTopicById.get(topic.id);
  if (!verifiedTopic) {
    verificationFailures.push(`${topic.id}: topic missing`);
    continue;
  }

  const verifiedArticleIds = new Set(
    verifiedTopic.articles.map((article) => article._id),
  );
  for (const [articleId] of topic.articles) {
    if (!verifiedArticleIds.has(articleId)) {
      verificationFailures.push(`${topic.id}: missing ${articleId}`);
    }
  }
}

if (verificationFailures.length > 0) {
  throw new Error(
    `Post-publish verification failed: ${verificationFailures.join("; ")}`,
  );
}

console.log(
  JSON.stringify(
    {
      status: "published",
      transactionId: result.transactionId,
      topicCount: verification.length,
      uniqueArticleCount: articleIds.length,
      newReferenceCount: audit.reduce(
        (count, topic) =>
          count +
          topic.articles.filter((article) => !article.alreadyTagged).length,
        0,
      ),
      topics: verification.map((topic) => ({
        id: topic._id,
        title: topic.title,
        slug: topic.slug,
        articleCount: topic.articles.length,
      })),
    },
    null,
    2,
  ),
);
