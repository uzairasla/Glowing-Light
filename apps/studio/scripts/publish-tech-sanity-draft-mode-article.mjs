import {createReadStream} from 'node:fs'
import {readFile} from 'node:fs/promises'
import {homedir} from 'node:os'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'

const session = JSON.parse(await readFile(join(homedir(), '.config', 'sanity', 'config.json'), 'utf8'))
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'dis8yhkz',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  apiVersion: '2026-07-20', useCdn: false, token: session.authToken,
})
let key = 0
const block = (style, text) => ({_key:`b${++key}`,_type:'block',style,markDefs:[],children:[{_key:`s${key}`,_type:'span',marks:[],text}]})
const p = text => block('normal', text)
const h2 = text => block('h2', text)
const h3 = text => block('h3', text)
const code = (filename, language, tone, value) => ({_key:`c${++key}`,_type:'codeBlock',filename,language,tone,code:value})
const callout = (tone, title, body) => ({_key:`a${++key}`,_type:'techCallout',tone,title,body})

const existingCoverRef = await client.fetch(
  `*[_id == "tech-article-sanity-draft-mode-not-working-nextjs"][0].coverImage.asset._ref`,
)
const coverPath = join(dirname(fileURLToPath(import.meta.url)), '../../tech-blog/public/articles/sanity-draft-mode-not-working/cover.png')
const coverAsset = existingCoverRef
  ? {_id: existingCoverRef}
  : await client.assets.upload('image', createReadStream(coverPath), {
      filename: 'sanity-draft-mode-not-working-nextjs.png',
      contentType: 'image/png',
    })

const article = {
  _id:'tech-article-sanity-draft-mode-not-working-nextjs', _type:'techArticle',
  title:'Sanity Draft Mode isn’t working in the Next.js App Router.',
  slug:{_type:'slug',current:'sanity-draft-mode-not-working-nextjs'},
  description:'A source-to-browser debugging guide for Draft Mode activation, cookies, draft perspectives, tokens, CORS, stega, and live preview in the Next.js App Router.',
  kicker:'Sanity field guide 002', readTime:'16 min', difficulty:'Intermediate',
  publishedAt:'2026-07-20T12:00:00.000Z', updatedAt:'2026-07-20T12:00:00.000Z',
  coverImage:{_type:'image',asset:{_type:'reference',_ref:coverAsset._id},alt:'A secure Draft Mode pipeline connecting a CMS document, an authentication gate, a browser cookie, draft inspection, and a rendered webpage'},
  taxonomies:[
    {_key:'sanity',_type:'reference',_ref:'tech-taxonomy-sanity'},
    {_key:'nextjs',_type:'reference',_ref:'tech-taxonomy-nextjs'},
    {_key:'debugging',_type:'reference',_ref:'tech-taxonomy-debugging'},
    {_key:'guides',_type:'reference',_ref:'tech-taxonomy-guides'},
  ],
  seoTitle:'Sanity Draft Mode Not Working in Next.js App Router',
  seoDescription:'Debug Sanity Draft Mode in the Next.js App Router by tracing the enable route, cookie, token, draft perspective, CDN, CORS, stega, and live updates.',
  sourceUrls:[
    {_key:'src1',title:'Visual Editing with Next.js App Router',url:'https://www.sanity.io/docs/nextjs/visual-editing-with-next-js-app-router'},
    {_key:'src2',title:'Implementing Draft Mode',url:'https://www.sanity.io/docs/visual-editing/implementing-draft-mode'},
    {_key:'src3',title:'Perspectives for Content Lake',url:'https://www.sanity.io/docs/content-lake/perspectives'},
    {_key:'src4',title:'Configuring the Sanity client for Next.js',url:'https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs'},
    {_key:'src5',title:'Next.js Draft Mode',url:'https://nextjs.org/docs/app/guides/draft-mode'},
  ],
  body:[
    p('Sanity Studio shows an unpublished edit, but the embedded Next.js preview still renders the published document. Sometimes the preview route returns 404. Sometimes Draft Mode reports enabled while the content never changes. Sometimes everything works locally and fails after deployment. These symptoms look similar, but they belong to different contracts in the preview pipeline.'),
    p('A working preview requires the Studio to reach the correct enable route, the route to validate the request, the browser to retain the Draft Mode cookie, the server fetch to use authenticated draft content without the CDN, and the page to render stega-encoded values only where visual editing needs them. Test those contracts in order and the failure usually becomes obvious.'),
    h2('Draft Mode is a chain, not a switch'),
    p('Next.js Draft Mode only changes application behavior after its enable route sets a cookie for the current browser session. It does not automatically make a normal Sanity client return drafts. Your data layer must observe the session and switch from the published perspective to authenticated draft or release content.'),
    callout('tip','Find the first broken contract','First prove that the enable route ran, then prove the cookie persisted, then prove the fetch returned the draft. Each result eliminates an entire class of causes.'),
    h2('Start with the supported App Router wiring'),
    p('For current next-sanity projects, defineLive is the main integration point. It coordinates perspective switching, stega encoding, caching, and live updates. Keep the implementation aligned with the versions you actually install; current Sanity guidance targets Next.js 16 and next-sanity 12.1.1 or later.'),
    code('.env.local','bash','neutral',`NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID\nNEXT_PUBLIC_SANITY_DATASET=production\nNEXT_PUBLIC_SANITY_STUDIO_URL=https://YOUR_STUDIO_URL\nSANITY_API_READ_TOKEN=YOUR_VIEWER_TOKEN`),
    callout('warning','Keep the read token server-only','Never name the token NEXT_PUBLIC_SANITY_API_READ_TOKEN. Draft content is private, and a public environment-variable prefix can expose credentials to the browser bundle.'),
    code('src/sanity/lib/client.ts','typescript','good',`import {createClient} from 'next-sanity'\n\nexport const client = createClient({\n  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,\n  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,\n  apiVersion: '2026-02-01',\n  useCdn: true,\n  stega: {studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL},\n})`),
    code('src/sanity/lib/live.ts','typescript','good',`import {defineLive} from 'next-sanity/live'\nimport {client} from './client'\n\nexport const {sanityFetch, SanityLive} = defineLive({\n  client: client.withConfig({apiVersion: '2026-02-01'}),\n  serverToken: process.env.SANITY_API_READ_TOKEN,\n  browserToken: process.env.SANITY_API_READ_TOKEN,\n})`),
    p('The browser token is shared only during Draft Mode for live subscriptions and should have Viewer permissions. The server token lets server-side queries read drafts. Use the smallest token configuration your preview requires.'),
    h2('Run the five-minute isolation test'),
    h3('1. Open the enable route directly'),
    p('The Presentation Tool path must match a real App Router route exactly. If Studio calls /api/draft-mode/enable while the application implements /api/draft/enable, the preview can never activate. A 404 here is routing, not Sanity caching.'),
    code('app/api/draft-mode/enable/route.ts','typescript','good',`import {defineEnableDraftMode} from 'next-sanity/draft-mode'\nimport {client} from '@/sanity/lib/client'\n\nexport const {GET} = defineEnableDraftMode({\n  client: client.withConfig({\n    token: process.env.SANITY_API_READ_TOKEN || '',\n  }),\n})`),
    h3('2. Confirm the browser received the cookie'),
    p('After the enable request, inspect browser storage for the Next.js Draft Mode cookie and the Sanity preview perspective cookie. Reload the exact preview URL and confirm the cookies are sent. In iframe contexts, SameSite and Secure behavior can make a browser silently reject a cookie even when the endpoint returned successfully.'),
    h3('3. Prove Next.js sees Draft Mode'),
    code('Temporary server diagnostic','typescript','neutral',`import {draftMode} from 'next/headers'\n\nconst {isEnabled} = await draftMode()\nconsole.log({draftMode: isEnabled})`),
    p('If this is false, stay focused on the route, redirect, hostname, HTTPS, and cookie. If it is true, stop debugging activation and move to the Sanity fetch.'),
    h3('4. Compare a published fetch with a draft fetch'),
    p('The drafts perspective requires authentication and bypasses the CDN. A client that remains on perspective: published correctly hides unpublished edits even when Next.js Draft Mode is enabled. A client using useCdn: true with drafts is invalid because draft queries are not served by the CDN.'),
    code('Manual draft client check','typescript','good',`const previewClient = client.withConfig({\n  token: process.env.SANITY_API_READ_TOKEN,\n  perspective: 'drafts',\n  useCdn: false,\n  stega: true,\n})`),
    h3('5. Verify the page uses the preview-aware fetch'),
    p('A correct enable route cannot affect a page that still calls an unrelated client.fetch configured permanently for published content. Use sanityFetch in the rendered page path, or make your custom loader explicitly read Draft Mode and apply the requested perspective, token, CDN, and stega settings.'),
    h2('Seven failure patterns and what they mean'),
    h3('The enable route returns 401 or 403'),
    p('The preview secret could not be validated. Confirm the deployed SANITY_API_READ_TOKEN exists, belongs to the same project and dataset, and has Viewer access. Also confirm the Studio generated a preview secret and that the route uses an authenticated client.'),
    h3('Draft Mode is enabled, but the page stays published'),
    p('The data fetch is still using the published perspective, an unauthenticated client, or a code path that never observes Draft Mode. Test the query directly with perspective: drafts and useCdn: false. If that returns the edit, the content is fine and the application switch is broken.'),
    h3('Preview works locally but not on Vercel'),
    p('Compare environment variables between local and production, then check Sanity CORS settings for the exact deployed frontend origin with credentials allowed. Confirm the Presentation Tool origin and allowOrigins configuration use the production HTTPS URL rather than localhost or an obsolete preview domain.'),
    h3('The cookie appears, then disappears'),
    p('Check whether the enable route redirects across hostnames, such as from a Vercel preview URL to the custom domain. Cookies belong to hosts. Also inspect SameSite and Secure rules in the embedded iframe and make sure every production request uses HTTPS.'),
    h3('Draft text appears, but click-to-edit overlays do not'),
    p('Draft fetching and visual editing are separate. Confirm the client has stega.studioUrl, the page renders stega-enabled strings, and VisualEditing is mounted only when Draft Mode is enabled. If overlays appear but clicks do nothing, the Studio URL or iframe communication contract is usually wrong.'),
    code('app/layout.tsx','typescript','good',`import {draftMode} from 'next/headers'\nimport {VisualEditing} from 'next-sanity/visual-editing'\nimport {SanityLive} from '@/sanity/lib/live'\n\nexport default async function RootLayout({children}) {\n  const {isEnabled} = await draftMode()\n  return (\n    <html><body>\n      {children}\n      <SanityLive />\n      {isEnabled && <VisualEditing />}\n    </body></html>\n  )\n}`),
    h3('Titles contain strange invisible characters'),
    p('Stega belongs in visible preview content, not in metadata, route parameters, comparisons, or generated slugs. Fetch generateMetadata and generateStaticParams with stega disabled. Otherwise invisible source-map characters can corrupt titles, canonical URLs, or string equality checks.'),
    code('Metadata fetch','typescript','good',`const {data: post} = await sanityFetch({\n  query: POST_QUERY,\n  params: {slug},\n  stega: false,\n})`),
    h3('Draft content loads once but does not update live'),
    p('Activation and live subscriptions are different stages. Confirm SanityLive is mounted, the browser token is available in Draft Mode, and the installed next-sanity version matches the current Next.js caching model. If basic preview works, debug subscriptions separately rather than changing the perspective again.'),
    h2('Use a disable route while debugging'),
    p('A stale Draft Mode cookie can make ordinary browsing behave like preview and confuse later tests. Add an explicit disable route, exit preview, and reproduce activation from a known published session.'),
    code('app/api/draft-mode/disable/route.ts','typescript','good',`import {draftMode} from 'next/headers'\nimport {NextResponse} from 'next/server'\n\nexport async function GET() {\n  ;(await draftMode()).disable()\n  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL!))\n}`),
    h2('The verification sequence'),
    p('Start in a normal browser session and confirm published content. Create an unpublished edit. Open the Presentation Tool and watch the enable request return successfully. Verify the cookies persist on the frontend hostname. Confirm draftMode().isEnabled on the server. Run the exact query with authenticated drafts and no CDN. Confirm the page uses the preview-aware fetch. Only then test overlays and live updates.'),
    callout('tip','A reliable preview has observable boundaries','Route, cookie, server state, Sanity perspective, rendered value, overlay, and live subscription should each be testable independently. Once those boundaries are visible, Draft Mode stops feeling mysterious.'),
  ],
}

const result = await client.createOrReplace(article)
console.log(JSON.stringify({published:{_id:result._id,_type:result._type},coverAsset:coverAsset._id}, null, 2))
