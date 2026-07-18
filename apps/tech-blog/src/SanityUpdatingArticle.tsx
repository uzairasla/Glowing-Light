import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  Clock3,
  ExternalLink,
  Menu,
  ShieldAlert,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import "./article.css";

const articlePath = "/guides/sanity-content-not-updating-nextjs";

function CodeBlock({ label, tone = "neutral", children }: { label: string; tone?: "bad" | "good" | "neutral"; children: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return (
    <figure className={`code-block ${tone}`}>
      <figcaption><span>{label}</span><button onClick={copy}>{copied ? "Copied" : "Copy"}</button></figcaption>
      <pre><code>{children}</code></pre>
    </figure>
  );
}

function ArticleHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="topbar article-topbar">
      <a className="brand" href="/" aria-label="Fieldnotes home">
        <span className="brand-mark" aria-hidden="true">F<span>/</span>N</span><span>FIELDNOTES</span>
      </a>
      <nav className={open ? "nav open" : "nav"} aria-label="Main navigation">
        <a href="/#guides">Guides</a><a href="/#templates">Templates</a><a href="/#about">About</a>
      </nav>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
    </header>
  );
}

export function SanityUpdatingArticle() {
  return (
    <div className="site-shell article-site">
      <ArticleHeader />
      <main>
        <header className="article-hero">
          <div className="article-kicker"><span>Sanity field guide 001</span><span>Updated July 18, 2026</span></div>
          <h1>Sanity content isn’t updating in Next.js.</h1>
          <p className="article-deck">A systematic guide to finding stale content across drafts, perspectives, the Sanity CDN, Next.js caches, and revalidation—without guessing which cache to clear.</p>
          <div className="article-meta"><span><Clock3 size={15} /> 18 min read</span><span>Sanity · Next.js · Debugging</span></div>
        </header>

        <figure className="cover-figure">
          <img src="/articles/sanity-content-not-updating/cover.png" alt="A diagnostic content pipeline showing an update blocked at a cache layer between a CMS and website" />
        </figure>

        <div className="article-layout">
          <aside className="article-toc">
            <span>In this guide</span>
            <a href="#mental-model">The mental model</a>
            <a href="#two-minute-test">Two-minute isolation test</a>
            <a href="#failure-modes">Seven failure modes</a>
            <a href="#production-pattern">Recommended setup</a>
            <a href="#checklist">Debugging checklist</a>
          </aside>

          <article className="article-content">
            <p className="lead">You publish a change in Sanity Studio. The document looks correct in Vision. You refresh the Next.js page—and the old copy is still there. This feels like one caching problem. It usually is not.</p>
            <p>A Sanity document passes through several independent decisions before it reaches a visitor: which document version is visible, which query perspective is active, whether Sanity’s CDN can answer the request, whether Next.js cached the data or route, and what event invalidates that cache. Debugging gets fast once you test those decisions in order.</p>

            <section id="mental-model">
              <div className="section-label">01 / Mental model</div>
              <h2>There are four places an update can disappear.</h2>
              <div className="pipeline" role="img" aria-label="Content travels from Studio through perspective selection, Sanity delivery, Next.js cache, and finally the browser">
                <div><small>01</small><strong>Document</strong><span>Draft or published?</span></div><i>?</i>
                <div><small>02</small><strong>Perspective</strong><span>Published or drafts?</span></div><i>?</i>
                <div><small>03</small><strong>Delivery</strong><span>CDN or live API?</span></div><i>?</i>
                <div><small>04</small><strong>Next.js</strong><span>Cached or invalidated?</span></div>
              </div>
              <p>Sanity stores drafts as separate documents with a <code>drafts.</code> prefix. Publishing copies the draft into its canonical document ID. Since API version <code>2025-02-19</code>, the default query perspective is <code>published</code>, so a normal production request will not return unpublished edits. That is correct behavior—not stale data.</p>
              <div className="callout note"><Zap /><div><strong>The fastest distinction</strong><p>If the public API returns the new value but the page does not, the fault is in Next.js or a downstream cache. If the API itself returns the old value, stay on the Sanity side.</p></div></div>
            </section>

            <section id="two-minute-test">
              <div className="section-label">02 / Isolation</div>
              <h2>The two-minute isolation test</h2>
              <p>Run the smallest possible query against the exact project, dataset, API version, and perspective used by the application. Do not start by changing cache settings.</p>
              <CodeBlock label="Terminal — query published content">{`curl --get \\
  'https://YOUR_PROJECT.api.sanity.io/v2025-02-19/data/query/production' \\
  --data-urlencode 'query=*[_type == "post" && slug.current == $slug][0]{_id,_updatedAt,title}' \\
  --data-urlencode '$slug="your-post"' \\
  --data-urlencode 'perspective=published'`}</CodeBlock>
              <ol className="diagnostic-list">
                <li><strong>Old value here?</strong> Confirm that the document was published, then verify project ID, dataset and perspective.</li>
                <li><strong>New value here, old value on the page?</strong> Inspect the Next.js data cache, full-route cache and hosting/CDN layer.</li>
                <li><strong>Draft preview only is stale?</strong> Check authentication, <code>drafts</code> perspective, <code>useCdn: false</code> and the Draft Mode cookie.</li>
              </ol>
            </section>

            <section id="failure-modes">
              <div className="section-label">03 / Failure modes</div>
              <h2>Seven common reasons updates do not appear</h2>

              <h3><span>1</span> The change is still a draft</h3>
              <p>Studio shows the draft while your public application correctly asks for published content. This commonly looks like a cache problem because the previous published version continues to render.</p>
              <CodeBlock label="Common mistake — production fetch expects a draft" tone="bad">{`const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-19',
  useCdn: true,
  perspective: 'published',
})

// This can only return the last published version.`}</CodeBlock>
              <p><strong>Fix:</strong> publish the document for public visitors. For editorial preview, enable Draft Mode and fetch with an authenticated server-only token using the requested draft perspective.</p>

              <h3><span>2</span> Vision and the application use different perspectives</h3>
              <p>Vision may be showing drafts while the application uses <code>published</code>. API versions before and after <code>2025-02-19</code> also differ in their default perspective, which can make an upgrade appear to “lose” content.</p>
              <CodeBlock label="Make the production intention explicit" tone="good">{`export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-02-01',
  useCdn: true,
  perspective: 'published',
})`}</CodeBlock>
              <p>Never use a future date as the API version. Choose a fixed version you have tested, then change it deliberately during upgrades.</p>

              <h3><span>3</span> Preview uses the CDN</h3>
              <p>The <code>drafts</code> perspective requires authentication and bypasses the CDN. A preview client using <code>useCdn: true</code> is internally contradictory: you are asking for private, changing content through a cache designed for public, published content.</p>
              <CodeBlock label="Common mistake — unsafe preview client" tone="bad">{`const previewClient = client.withConfig({
  perspective: 'drafts',
  useCdn: true,          // Wrong for drafts
  token: readToken,
})`}</CodeBlock>
              <CodeBlock label="Correct preview configuration" tone="good">{`const previewClient = client.withConfig({
  perspective: 'drafts',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: true,
})`}</CodeBlock>
              <div className="callout warning"><ShieldAlert /><div><strong>Keep the token on the server</strong><p>Never prefix a Sanity read token with <code>NEXT_PUBLIC_</code>. That would expose it to the browser bundle.</p></div></div>

              <h3><span>4</span> Next.js cached the query indefinitely</h3>
              <p>Sanity can return the correct value while Next.js continues serving a cached fetch or a cached route. A route generated at build time does not become dynamic merely because the CMS changed.</p>
              <CodeBlock label="Common mistake — static forever unless invalidated" tone="bad">{`const post = await client.fetch(POST_QUERY, { slug }, {
  // No revalidation strategy and no live invalidation
  cache: 'force-cache',
})`}</CodeBlock>
              <CodeBlock label="Simple time-based strategy" tone="good">{`const post = await client.fetch(POST_QUERY, { slug }, {
  next: {
    revalidate: 60,
    tags: ['sanity', \
      'post', \
      \`post:\${slug}\`],
  },
})`}</CodeBlock>
              <p>A short <code>revalidate</code> interval is easy to reason about, but it permits stale content for that interval. Tags or Sanity Live can provide faster updates.</p>

              <h3><span>5</span> The webhook runs but invalidates the wrong thing</h3>
              <p>A webhook returning 200 only proves the endpoint ran. It does not prove that its tag matches the tag attached to the original query. Broad calls to <code>revalidatePath('/') </code> can also miss separately cached data or cause unnecessary work.</p>
              <CodeBlock label="Common mistake — tag mismatch" tone="bad">{`// Fetch uses:
next: { tags: [\`post:\${slug}\`] }

// Webhook invalidates:
revalidateTag('posts') // Different tag; nothing changes.`}</CodeBlock>
              <CodeBlock label="Validated webhook with matching tags" tone="good">{`import {parseBody} from 'next-sanity/webhook'
import {revalidateTag} from 'next/cache'

export async function POST(req: Request) {
  const {isValidSignature, body} = await parseBody<{_type: string; slug?: string}>(
    req,
    process.env.SANITY_REVALIDATE_SECRET,
  )
  if (!isValidSignature) return new Response('Invalid signature', {status: 401})

  revalidateTag('sanity', 'max')
  revalidateTag(body._type, 'max')
  if (body.slug) revalidateTag(\`post:\${body.slug}\`, 'max')
  return Response.json({revalidated: true})
}`}</CodeBlock>

              <h3><span>6</span> The app points at another project or dataset</h3>
              <p>This is mundane and extremely common. Studio writes to <code>production</code> while a preview deployment reads <code>staging</code>; or local and hosted environments contain different project IDs.</p>
              <CodeBlock label="Fail early instead of silently reading the wrong dataset" tone="good">{`const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')

console.info('[sanity]', {projectId, dataset})`}</CodeBlock>
              <p>Log identifiers, never tokens. Compare the deployed values with the project and dataset shown in Sanity Manage.</p>

              <h3><span>7</span> A referenced document was not published</h3>
              <p>The parent article may be published while its referenced author, category, CTA or page-builder block remains a draft. Production dereferencing can then return <code>null</code> or the old published reference.</p>
              <CodeBlock label="Inspect reference state directly">{`*[_type == 'post' && slug.current == $slug][0]{
  title,
  author,
  'resolvedAuthor': author->{_id, _updatedAt, name}
}`}</CodeBlock>
              <p>If <code>author</code> has a <code>_ref</code> but <code>resolvedAuthor</code> is null in the published perspective, inspect the referenced document’s publication state.</p>
            </section>

            <section id="production-pattern">
              <div className="section-label">04 / Recommended pattern</div>
              <h2>Use Sanity Live for the default path</h2>
              <p>For current Next.js App Router projects, Sanity recommends the Live Content API through <code>defineLive</code>. It handles live updates and automatic cache revalidation, while Draft Mode switches to the correct preview behavior.</p>
              <CodeBlock label="src/sanity/lib/live.ts" tone="good">{`import {defineLive} from 'next-sanity/live'
import {client} from './client'

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
})`}</CodeBlock>
              <CodeBlock label="app/layout.tsx" tone="good">{`import {SanityLive} from '@/sanity/lib/live'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive />
      </body>
    </html>
  )
}`}</CodeBlock>
              <p>Keep the implementation aligned with the version of Next.js and <code>next-sanity</code> you actually run. Cache Components in Next.js 16 introduce different boundaries: request-time values such as cookies and <code>draftMode()</code> must be resolved outside cached functions and passed inward.</p>
            </section>

            <section id="checklist">
              <div className="section-label">05 / Checklist</div>
              <h2>Debug from the source outward</h2>
              <div className="checklist">
                {[
                  "Confirm the edit was published, or intentionally enable Draft Mode.",
                  "Query the exact project and dataset directly.",
                  "Set a fixed API version and explicit perspective.",
                  "Use useCdn: false for drafts and authenticated preview.",
                  "Compare the direct API result with the rendered page.",
                  "Identify the Next.js cache strategy on the actual query.",
                  "Verify webhook signature, payload and tag names.",
                  "Check referenced documents as well as the parent.",
                  "Confirm production environment variables and CORS origins.",
                  "Test in a fresh private window to exclude browser and Draft Mode cookies.",
                ].map((item) => <div key={item}><Check size={17} />{item}</div>)}
              </div>
              <div className="callout conclusion"><ClipboardCheck /><div><strong>The rule to remember</strong><p>Do not clear every cache. Find the first layer that returns the old value, fix that layer, and leave the others working.</p></div></div>
            </section>

            <section className="sources">
              <div className="section-label">Sources & further reading</div>
              <a href="https://www.sanity.io/docs/nextjs/introduction" target="_blank" rel="noreferrer">Sanity and Next.js overview <ExternalLink size={14} /></a>
              <a href="https://www.sanity.io/docs/visual-editing/implementing-draft-mode" target="_blank" rel="noreferrer">Implementing Draft Mode <ExternalLink size={14} /></a>
              <a href="https://www.sanity.io/docs/content-lake/presenting-and-previewing-content" target="_blank" rel="noreferrer">Perspectives and previewing content <ExternalLink size={14} /></a>
              <a href="https://www.sanity.io/docs/nextjs/visual-editing-with-next-js-app-router" target="_blank" rel="noreferrer">Visual Editing with Next.js App Router <ExternalLink size={14} /></a>
              <a href="https://www.sanity.io/docs/nextjs/cache-components" target="_blank" rel="noreferrer">Sanity Live with Cache Components <ExternalLink size={14} /></a>
            </section>

            <nav className="article-end-nav" aria-label="Article navigation">
              <a href="/"><ArrowLeft size={17} /> Back to all guides</a>
              <a href="/#templates">Explore field-tested templates <ArrowRight size={17} /></a>
            </nav>
          </article>
        </div>
      </main>
      <footer className="article-footer"><span>FIELDNOTES</span><small>Practical guides for technical work.</small><a href={articlePath}>Copy article link</a></footer>
    </div>
  );
}
