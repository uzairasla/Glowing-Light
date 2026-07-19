import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { createClient } from "@sanity/client";

const cliSession = JSON.parse(
  await readFile(join(homedir(), ".config", "sanity", "config.json"), "utf8"),
);
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  "dis8yhkz";
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";
const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-07-18",
  useCdn: false,
  token: cliSession.authToken,
});
let key = 0;
const block = (style, text) => ({
  _key: `b${++key}`,
  _type: "block",
  style,
  markDefs: [],
  children: [{ _key: `s${key}`, _type: "span", marks: [], text }],
});
const p = (text) => block("normal", text);
const h2 = (text) => block("h2", text);
const h3 = (text) => block("h3", text);
const code = (filename, language, tone, value) => ({
  _key: `c${++key}`,
  _type: "codeBlock",
  filename,
  language,
  tone,
  code: value,
});
const callout = (tone, title, body) => ({
  _key: `a${++key}`,
  _type: "techCallout",
  tone,
  title,
  body,
});
const article = {
  _id: "tech-article-sanity-content-not-updating-nextjs",
  _type: "techArticle",
  title: "Sanity content isn�t updating in Next.js.",
  slug: { _type: "slug", current: "sanity-content-not-updating-nextjs" },
  description:
    "A systematic guide to finding stale content across drafts, perspectives, the Sanity CDN, Next.js caches, and revalidation�without guessing which cache to clear.",
  kicker: "Sanity field guide 001",
  readTime: "18 min",
  publishedAt: "2026-07-18T12:00:00.000Z",
  updatedAt: "2026-07-18T12:00:00.000Z",
  taxonomies: [
    { _key: "sanity", _type: "reference", _ref: "tech-taxonomy-sanity" },
    { _key: "nextjs", _type: "reference", _ref: "tech-taxonomy-nextjs" },
    { _key: "debugging", _type: "reference", _ref: "tech-taxonomy-debugging" },
  ],
  seoTitle: "Sanity Content Not Updating in Next.js: A Debugging Guide",
  seoDescription:
    "Trace stale Sanity content through drafts, perspectives, the CDN, Next.js caches, and webhook revalidation with a systematic debugging workflow.",
  sourceUrls: [
    {
      _key: "src1",
      title: "Sanity and Next.js overview",
      url: "https://www.sanity.io/docs/nextjs/introduction",
    },
    {
      _key: "src2",
      title: "Implementing Draft Mode",
      url: "https://www.sanity.io/docs/visual-editing/implementing-draft-mode",
    },
    {
      _key: "src3",
      title: "Perspectives and previewing content",
      url: "https://www.sanity.io/docs/content-lake/presenting-and-previewing-content",
    },
    {
      _key: "src4",
      title: "Visual Editing with Next.js App Router",
      url: "https://www.sanity.io/docs/nextjs/visual-editing-with-next-js-app-router",
    },
    {
      _key: "src5",
      title: "Sanity Live with Cache Components",
      url: "https://www.sanity.io/docs/nextjs/cache-components",
    },
  ],
  body: [
    p(
      "You publish a change in Sanity Studio. The document looks correct in Vision. You refresh the Next.js page�and the old copy is still there. This feels like one caching problem. It usually is not.",
    ),
    p(
      "A Sanity document passes through several independent decisions before it reaches a visitor: which document version is visible, which query perspective is active, whether Sanity�s CDN can answer the request, whether Next.js cached the data or route, and what event invalidates that cache. Debugging gets fast once you test those decisions in order.",
    ),
    h2("There are four places an update can disappear"),
    p(
      "Sanity stores drafts as separate documents with a drafts. prefix. Publishing copies the draft into its canonical document ID. Since API version 2025-02-19, the default query perspective is published, so a normal production request will not return unpublished edits. That is correct behavior�not stale data.",
    ),
    callout(
      "tip",
      "The fastest distinction",
      "If the public API returns the new value but the page does not, the fault is in Next.js or a downstream cache. If the API itself returns the old value, stay on the Sanity side.",
    ),
    h2("The two-minute isolation test"),
    p(
      "Run the smallest possible query against the exact project, dataset, API version, and perspective used by the application. Do not start by changing cache settings.",
    ),
    code(
      "Terminal � query published content",
      "bash",
      "neutral",
      `curl --get \\\n  'https://YOUR_PROJECT.api.sanity.io/v2025-02-19/data/query/production' \\\n  --data-urlencode 'query=*[_type == "post" && slug.current == $slug][0]{_id,_updatedAt,title}' \\\n  --data-urlencode '$slug="your-post"' \\\n  --data-urlencode 'perspective=published'`,
    ),
    p(
      "If the direct query returns the old value, confirm the document was published and verify the project ID, dataset, and perspective. If it returns the new value while the page stays old, inspect Next.js and downstream caches. If only preview is stale, check authentication, the drafts perspective, useCdn: false, and the Draft Mode cookie.",
    ),
    h2("Seven common reasons updates do not appear"),
    h3("1. The change is still a draft"),
    p(
      "Studio shows the draft while your public application correctly asks for published content. Publish the document for public visitors. For editorial preview, enable Draft Mode and fetch with an authenticated server-only token.",
    ),
    code(
      "Production client",
      "typescript",
      "good",
      `const client = createClient({\n  projectId, dataset, apiVersion: '2026-02-01',\n  useCdn: true, perspective: 'published',\n})`,
    ),
    h3("2. Vision and the application use different perspectives"),
    p(
      "Vision may show drafts while the application uses published. Make the perspective and a fixed, tested API version explicit so an upgrade cannot silently change the result.",
    ),
    h3("3. Preview uses the CDN"),
    p(
      "The drafts perspective requires authentication and bypasses the CDN. A preview client using useCdn: true asks for private changing content through a cache designed for public published content.",
    ),
    code(
      "Correct preview configuration",
      "typescript",
      "good",
      `const previewClient = client.withConfig({\n  perspective: 'drafts',\n  useCdn: false,\n  token: process.env.SANITY_API_READ_TOKEN,\n  stega: true,\n})`,
    ),
    callout(
      "warning",
      "Keep the token on the server",
      "Never prefix a Sanity read token with NEXT_PUBLIC_. That would expose it to the browser bundle.",
    ),
    h3("4. Next.js cached the query indefinitely"),
    p(
      "Sanity can return the correct value while Next.js serves a cached fetch or route. A route generated at build time does not become dynamic merely because the CMS changed.",
    ),
    code(
      "Time-based revalidation",
      "typescript",
      "good",
      `const post = await client.fetch(POST_QUERY, {slug}, {\n  next: {revalidate: 60, tags: ['sanity', 'post', \`post:\${slug}\`]},\n})`,
    ),
    h3("5. The webhook invalidates the wrong thing"),
    p(
      "A 200 response only proves the endpoint ran. It does not prove its tag matches the tag attached to the original query. Validate the webhook signature and use exactly matching tags.",
    ),
    code(
      "Matching invalidation",
      "typescript",
      "good",
      `revalidateTag('sanity', 'max')\nrevalidateTag(body._type, 'max')\nif (body.slug) revalidateTag(\`post:\${body.slug}\`, 'max')`,
    ),
    h3("6. The app points at another project or dataset"),
    p(
      "Studio may write to production while a preview deployment reads staging, or local and hosted environments may contain different project IDs. Log identifiers�never tokens�and compare deployed values with Sanity Manage.",
    ),
    h3("7. A referenced document was not published"),
    p(
      "The article may be published while its author, category, CTA, or page-builder block remains a draft. Production dereferencing can then return null or an older published reference.",
    ),
    code(
      "Inspect reference state",
      "groq",
      "neutral",
      `*[_type == 'post' && slug.current == $slug][0]{\n  title, author, 'resolvedAuthor': author->{_id, _updatedAt, name}\n}`,
    ),
    h2("Use Sanity Live for the default path"),
    p(
      "For current Next.js App Router projects, Sanity recommends the Live Content API through defineLive. It handles live updates and automatic cache revalidation, while Draft Mode switches to the correct preview behavior.",
    ),
    code(
      "src/sanity/lib/live.ts",
      "typescript",
      "good",
      `import {defineLive} from 'next-sanity/live'\nimport {client} from './client'\n\nexport const {sanityFetch, SanityLive} = defineLive({\n  client, serverToken: process.env.SANITY_API_READ_TOKEN,\n})`,
    ),
    p(
      "Keep the implementation aligned with the versions of Next.js and next-sanity you actually run. Cache Components in Next.js 16 introduce different boundaries: request-time values such as cookies and draftMode() must be resolved outside cached functions and passed inward.",
    ),
    h2("Debug from the source outward"),
    p(
      "Confirm the edit was published or intentionally enable Draft Mode. Query the exact project and dataset directly. Set a fixed API version and explicit perspective. Use useCdn: false for drafts. Compare the API result with the rendered page. Identify the cache strategy on the actual query. Verify webhook signatures and tags. Check referenced documents, production variables, CORS origins, and Draft Mode cookies.",
    ),
    callout(
      "tip",
      "The rule to remember",
      "Do not clear every cache. Find the first layer that returns the old value, fix that layer, and leave the others working.",
    ),
  ],
};
const documents = [
  {
    _id: "tech-taxonomy-sanity",
    _type: "techTaxonomy",
    title: "Sanity",
    slug: { _type: "slug", current: "sanity" },
  },
  {
    _id: "tech-taxonomy-nextjs",
    _type: "techTaxonomy",
    title: "Next.js",
    slug: { _type: "slug", current: "nextjs" },
  },
  {
    _id: "tech-taxonomy-debugging",
    _type: "techTaxonomy",
    title: "Debugging",
    slug: { _type: "slug", current: "debugging" },
  },
  article,
];

const results = await Promise.all(
  documents.map((document) => client.createOrReplace(document)),
);
console.log(
  JSON.stringify(
    { published: results.map(({ _id, _type }) => ({ _id, _type })) },
    null,
    2,
  ),
);
