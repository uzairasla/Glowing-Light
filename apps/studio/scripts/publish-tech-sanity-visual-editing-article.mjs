import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const session = JSON.parse(
  await readFile(join(homedir(), ".config", "sanity", "config.json"), "utf8"),
);
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "dis8yhkz",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  apiVersion: "2026-07-24",
  useCdn: false,
  token: session.authToken,
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

const articleId = "tech-article-sanity-visual-editing-not-working-nextjs";
const existingCoverRef = await client.fetch(
  `*[_id == $articleId][0].coverImage.asset._ref`,
  { articleId },
);
const coverPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../tech-blog/public/articles/sanity-visual-editing-not-working/cover.png",
);
const coverAsset = existingCoverRef
  ? { _id: existingCoverRef }
  : await client.assets.upload("image", createReadStream(coverPath), {
      filename: "sanity-visual-editing-not-working-nextjs.png",
      contentType: "image/png",
    });

const article = {
  _id: articleId,
  _type: "techArticle",
  title:
    "Sanity Visual Editing overlays are missing or clicking the wrong field.",
  slug: { _type: "slug", current: "sanity-visual-editing-not-working-nextjs" },
  description:
    "A layer-by-layer debugging guide for missing overlays, broken click-to-edit links, incorrect field paths, stega leaks, iframe failures, and live updates in Next.js App Router.",
  kicker: "Sanity field guide 004",
  readTime: "15 min",
  difficulty: "Intermediate",
  publishedAt: "2026-07-24T12:00:00.000Z",
  updatedAt: "2026-07-24T12:00:00.000Z",
  coverImage: {
    _type: "image",
    asset: { _type: "reference", _ref: coverAsset._id },
    alt: "A browser preview with editable content overlays connected to structured fields, alongside a broken source-map connection being diagnosed",
  },
  taxonomies: [
    { _key: "sanity", _type: "reference", _ref: "tech-taxonomy-sanity" },
    { _key: "nextjs", _type: "reference", _ref: "tech-taxonomy-nextjs" },
    { _key: "debugging", _type: "reference", _ref: "tech-taxonomy-debugging" },
    { _key: "guides", _type: "reference", _ref: "tech-taxonomy-guides" },
  ],
  seoTitle: "Sanity Visual Editing Not Working in Next.js App Router",
  seoDescription:
    "Fix missing or broken Sanity Visual Editing overlays in Next.js by tracing Draft Mode, stega data, source maps, Studio URLs, iframe messaging, and field paths.",
  sourceUrls: [
    {
      _key: "src1",
      title: "Visual Editing with Next.js App Router",
      url: "https://www.sanity.io/docs/nextjs/visual-editing-with-next-js-app-router",
    },
    {
      _key: "src2",
      title: "Overlays and click-to-edit",
      url: "https://www.sanity.io/docs/visual-editing/visual-editing-overlays",
    },
    {
      _key: "src3",
      title: "Configuring the Presentation Tool",
      url: "https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool",
    },
    {
      _key: "src4",
      title: "Sanity and Next.js",
      url: "https://www.sanity.io/docs/nextjs/introduction",
    },
    {
      _key: "src5",
      title: "Next.js draftMode",
      url: "https://nextjs.org/docs/app/api-reference/functions/draft-mode",
    },
  ],
  body: [
    p(
      "The Presentation Tool loads the correct Next.js page and even shows unpublished content, but no blue editing overlays appear. Or the overlays appear and clicking one opens the wrong document, the wrong field, or nothing at all. Another common variation is that plain text works while images, arrays, and custom components remain impossible to select.",
    ),
    p(
      "These symptoms all live under “Visual Editing,” but they fail at different layers. The rendered value needs a Content Source Map, the Sanity client must encode that map into the value, the page must preserve the encoded value in a safe DOM location, the overlay runtime must discover it, and the embedded preview must maintain a connection to the correct Studio. Test those layers in order and the failure becomes much smaller.",
    ),
    h2("Visual Editing is a source-mapping pipeline"),
    p(
      "Click-to-edit does not infer a field from the words visible on screen. Sanity returns source-map information with a query result. Stega encoding attaches that information to string values as invisible characters. The VisualEditing component scans the rendered DOM, decodes the document ID and field path, and draws an interactive layer over the matching element. A click then sends that location to the parent Studio.",
    ),
    callout(
      "tip",
      "Separate preview from overlays",
      "Draft content appearing proves that authentication and perspective switching work. It does not prove that source maps, stega encoding, DOM discovery, or Studio communication work.",
    ),
    h2("Start from the current App Router shape"),
    p(
      "For current Next.js and next-sanity projects, defineLive is the main integration point. It provides a preview-aware sanityFetch function and the SanityLive component. The client also needs the deployed Studio URL so decoded source locations have somewhere to send the editor.",
    ),
    code(
      "src/sanity/lib/client.ts",
      "typescript",
      "good",
      `import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-02-01',
  useCdn: true,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
})`,
    ),
    code(
      "src/sanity/lib/live.ts",
      "typescript",
      "good",
      `import {defineLive} from 'next-sanity/live'
import {client} from './client'

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
})`,
    ),
    callout(
      "warning",
      "The read token stays server-only",
      "Do not add NEXT_PUBLIC_ to SANITY_API_READ_TOKEN. defineLive can share the Viewer token with the browser during Draft Mode without putting it in the public application bundle.",
    ),
    code(
      "app/layout.tsx",
      "typescript",
      "good",
      `import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {SanityLive} from '@/sanity/lib/live'

export default async function RootLayout({children}) {
  const {isEnabled} = await draftMode()

  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive />
        {isEnabled && <VisualEditing />}
      </body>
    </html>
  )
}`,
    ),
    h2("Run the six-layer isolation test"),
    h3("1. Prove the page is inside the Presentation Tool"),
    p(
      "Open the same route both directly and inside the Studio. The overlay layer can render outside the iframe, but click-to-edit navigation needs a connection to the parent Presentation Tool. If you are testing a normal browser tab, a visible overlay that cannot focus the Studio is not a valid end-to-end test.",
    ),
    p(
      "If the iframe is blank, blocked, or redirected, fix the Presentation Tool origin first. Confirm that previewUrl.origin is the actual frontend origin and that previewMode.enable points to the deployed Draft Mode route.",
    ),
    code(
      "sanity.config.ts",
      "typescript",
      "good",
      `presentationTool({
  resolve,
  previewUrl: {
    origin: process.env.SANITY_STUDIO_PREVIEW_ORIGIN,
    previewMode: {
      enable: '/api/draft-mode/enable',
    },
  },
})`,
    ),
    h3("2. Prove Draft Mode is active"),
    p(
      "VisualEditing should normally mount only during Draft Mode. Temporarily log draftMode().isEnabled in the root layout. If it is false, the overlay component is absent by design; debug the enable route, redirect, hostname, and cookie before touching stega.",
    ),
    code(
      "Temporary server diagnostic",
      "typescript",
      "neutral",
      `const {isEnabled} = await draftMode()
console.info({draftMode: isEnabled})`,
    ),
    h3("3. Prove the rendered query uses sanityFetch"),
    p(
      "A page can fetch drafts correctly with a custom client and still have no overlays if the returned strings were never stega encoded. Follow the rendered component back to its data loader. It must use the preview-aware sanityFetch call, or a custom fetch configured to request source maps and encode them.",
    ),
    code(
      "app/posts/[slug]/page.tsx",
      "typescript",
      "good",
      `const {data: post} = await sanityFetch({
  query: POST_QUERY,
  params: {slug},
})

return <h1>{post.title}</h1>`,
    ),
    callout(
      "warning",
      "Do not clean the visible value",
      "stegaClean is correct before comparisons, URL construction, or non-visual logic. Calling it on the title that you render removes the source information the overlay needs.",
    ),
    h3("4. Look for stega in a safe rendered string"),
    p(
      "Inspect a simple text field such as the article title. DevTools may reveal a longer string than the visible characters because stega uses zero-width Unicode characters. If Draft Mode is active but every rendered string is clean, inspect the client stega configuration, the fetch function, and any sanitization step between the query and JSX.",
    ),
    p(
      "If the source characters exist in the data but disappear in the DOM, look for serialization, trimming, slugification, Markdown processing, or a component library that reconstructs the string. Render the raw value in a plain element as a control test.",
    ),
    h3("5. Prove VisualEditing mounted and discovered the element"),
    p(
      "Confirm the VisualEditing component exists in the rendered React tree and that no client error prevented it from initializing. Start with one plain text element. Complex rich text, portals, canvas rendering, pseudo-elements, and deeply nested interactive controls introduce additional discovery rules that should not be part of the first test.",
    ),
    code(
      "Temporary stega diagnostic",
      "tsx",
      "neutral",
      `<VisualEditing
  onSuspiciousStega={(reports) => {
    for (const report of reports) {
      console.warn('Unsafe stega placement', report)
    }
  }}
/>`,
    ),
    p(
      "The suspicious-stega callback helps find encoded values in attributes, metadata, scripts, styles, form values, and URLs. Those placements can break application behavior and are not valid overlay targets.",
    ),
    h3("6. Prove the decoded Studio destination is correct"),
    p(
      "If an overlay appears but clicking does nothing, inspect stega.studioUrl. It must identify the Studio that contains the referenced project, dataset, and workspace. A localhost URL in production, an obsolete Studio domain, or the wrong workspace base path can produce an apparently healthy overlay with a dead destination.",
    ),
    code(
      ".env.local",
      "bash",
      "neutral",
      `NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333
SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3000`,
    ),
    p(
      "In production, replace both origins with their HTTPS deployments. Add the frontend origin to the Sanity project CORS list and allow credentials. Preview deployments and custom production domains are separate origins and must be treated deliberately.",
    ),
    h2("Why an overlay opens the wrong field"),
    h3("The query reshapes data without preserving the expected source"),
    p(
      "Aliases, projections, dereferences, array filters, and computed values can change how a result maps back to the source document. Sanity source maps handle normal GROQ projections, but a value assembled in application code has no single editable origin. Test the unmodified field first, then add transformations one at a time.",
    ),
    code(
      "A value with no single source field",
      "typescript",
      "bad",
      `const displayTitle = post.eyebrow + ': ' + post.title
return <h1>{displayTitle}</h1>`,
    ),
    code(
      "Keep editable fields independently rendered",
      "tsx",
      "good",
      `<p>{post.eyebrow}</p>
<h1>{post.title}</h1>`,
    ),
    h3("A list uses unstable React keys"),
    p(
      "Portable Text blocks and object arrays should keep their Sanity _key values. Index-based React keys can make DOM nodes appear to belong to a different item after reordering. Query _key, pass it through your component boundary, and use it as the React key.",
    ),
    code(
      "Array rendering",
      "tsx",
      "good",
      `{post.features.map((feature) => (
  <FeatureCard key={feature._key} feature={feature} />
))}`,
    ),
    h3("The editable value belongs to a referenced document"),
    p(
      "A category name, author name, or reusable callout may come from a referenced document rather than the page document. Opening that referenced record is correct. If editors expect the page document instead, change the content model or explicitly design a different editing interaction; do not discard accurate source information to hide the relationship.",
    ),
    h3("Images and non-string controls need explicit annotation"),
    p(
      "Stega naturally travels through strings. Image objects, boolean controls, numbers, empty fields, and layout containers may need explicit data-sanity attributes or a dedicated editable wrapper. Use the overlay utilities documented for your installed visual-editing version instead of placing encoded JSON into a DOM attribute.",
    ),
    h2("Failure patterns in production"),
    h3("Overlays work locally but disappear after deployment"),
    p(
      "Check the production Studio URL, frontend preview origin, Sanity CORS origins, Viewer token, and Draft Mode cookie on the custom hostname. Then confirm the deployed build contains the same next-sanity version as local. This is usually an environment contract, not a rendering bug.",
    ),
    h3("Text overlays work, but Portable Text blocks do not"),
    p(
      "Confirm the Portable Text query preserves _key and does not flatten blocks into plain strings before rendering. Test a normal text block without a custom serializer. Then reintroduce custom components and verify each component renders the original stega-enabled children.",
    ),
    h3("The overlay is offset or has the wrong size"),
    p(
      "Transforms, zoom, sticky containers, nested scrolling regions, portals, and pseudo-elements can make the visual box differ from the text node the runtime discovered. Reduce the element to a normal block in the document flow. Reintroduce layout effects until the geometry breaks.",
    ),
    h3("Clicks work, but edits do not update live"),
    p(
      "Overlay discovery and live subscriptions are separate layers. If click-to-edit focuses the correct field, stop changing stega and Studio URLs. Confirm SanityLive is mounted, the browser token is available during Draft Mode, the frontend origin is allowed by CORS, and browser requests to the Content Lake are not returning 403.",
    ),
    h3("Metadata, links, or class names behave strangely in preview"),
    p(
      "A stega-enabled string reached application logic or an unsafe DOM location. Disable stega for generateMetadata and generateStaticParams, and clean values before equality tests, class selection, href construction, or JSON-LD generation. Keep the original encoded value only for visible editable content.",
    ),
    code(
      "Metadata and route-safe fetch",
      "typescript",
      "good",
      `const {data: post} = await sanityFetch({
  query: POST_QUERY,
  params: {slug},
  stega: false,
})`,
    ),
    h2("The shortest reliable verification sequence"),
    p(
      "Open the page inside the Presentation Tool. Confirm Draft Mode is enabled. Render one unmodified string from sanityFetch in a plain element. Verify that the string carries stega data. Confirm VisualEditing mounted and draws an overlay. Click it and verify the correct Studio workspace, document, and field. Edit the field and confirm SanityLive refreshes the rendered value. Only after that baseline passes should you test Portable Text, arrays, references, images, transformed layouts, and production domains.",
    ),
    callout(
      "tip",
      "Debug one boundary at a time",
      "Iframe, Draft Mode, source map, stega string, DOM element, overlay, Studio focus, and live update are independently testable. The first failed boundary tells you where the repair belongs.",
    ),
  ],
};

const result = await client.createOrReplace(article);
console.log(
  JSON.stringify(
    {
      published: {
        _id: result._id,
        _type: result._type,
        slug: result.slug.current,
      },
      coverAsset: coverAsset._id,
    },
    null,
    2,
  ),
);
