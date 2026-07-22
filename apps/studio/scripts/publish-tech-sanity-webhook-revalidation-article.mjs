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
  apiVersion: '2026-07-22', useCdn: false, token: session.authToken,
})
let key = 0
const block = (style, text) => ({_key:`b${++key}`,_type:'block',style,markDefs:[],children:[{_key:`s${key}`,_type:'span',marks:[],text}]})
const p = text => block('normal', text)
const h2 = text => block('h2', text)
const h3 = text => block('h3', text)
const code = (filename, language, tone, value) => ({_key:`c${++key}`,_type:'codeBlock',filename,language,tone,code:value})
const callout = (tone, title, body) => ({_key:`a${++key}`,_type:'techCallout',tone,title,body})

const articleId = 'tech-article-sanity-webhook-revalidation-nextjs'
const existingCoverRef = await client.fetch(`*[_id == $articleId][0].coverImage.asset._ref`, {articleId})
const coverPath = join(dirname(fileURLToPath(import.meta.url)), '../../tech-blog/public/articles/sanity-webhook-revalidation/cover.png')
const coverAsset = existingCoverRef
  ? {_id: existingCoverRef}
  : await client.assets.upload('image', createReadStream(coverPath), {
      filename: 'sanity-webhook-revalidation-nextjs.png', contentType: 'image/png',
    })

const article = {
  _id:articleId, _type:'techArticle',
  title:'Sanity published the update, but Next.js still shows stale content.',
  slug:{_type:'slug',current:'sanity-webhook-revalidate-tag-nextjs'},
  description:'A production guide to signed Sanity webhooks, precise Next.js cache tags, path revalidation, slug changes, deletes, and proving that fresh content reached Vercel.',
  kicker:'Sanity field guide 003', readTime:'17 min', difficulty:'Intermediate',
  publishedAt:'2026-07-22T12:00:00.000Z', updatedAt:'2026-07-22T12:00:00.000Z',
  coverImage:{_type:'image',asset:{_type:'reference',_ref:coverAsset._id},alt:'A publishing pipeline where a content document sends a webhook through a security gate, breaks a stale cache layer, and refreshes a webpage'},
  taxonomies:[
    {_key:'sanity',_type:'reference',_ref:'tech-taxonomy-sanity'},
    {_key:'nextjs',_type:'reference',_ref:'tech-taxonomy-nextjs'},
    {_key:'debugging',_type:'reference',_ref:'tech-taxonomy-debugging'},
    {_key:'guides',_type:'reference',_ref:'tech-taxonomy-guides'},
  ],
  seoTitle:'Sanity Webhook Revalidation with revalidateTag in Next.js',
  seoDescription:'Fix stale Sanity content in Next.js with signed webhooks, revalidateTag, revalidatePath, cache-tag design, slug-change handling, and Vercel verification.',
  sourceUrls:[
    {_key:'src1',title:'Next.js revalidateTag',url:'https://nextjs.org/docs/app/api-reference/functions/revalidateTag'},
    {_key:'src2',title:'Next.js revalidatePath',url:'https://nextjs.org/docs/app/api-reference/functions/revalidatePath'},
    {_key:'src3',title:'Next.js revalidation guide',url:'https://nextjs.org/docs/app/getting-started/revalidating'},
    {_key:'src4',title:'Sanity GROQ-powered webhooks',url:'https://www.sanity.io/docs/content-lake/webhooks'},
    {_key:'src5',title:'Sanity and Next.js',url:'https://www.sanity.io/docs/nextjs/introduction'},
  ],
  body:[
    p('The editor publishes a Sanity document, the webhook reports a successful delivery, and the production Next.js page still shows the previous version. Refreshing does nothing. Redeploying fixes it, which makes the CMS look unreliable even though the document is already correct in the Content Lake.'),
    p('This failure lives between a mutation and the cached page that readers receive. A reliable implementation must connect four contracts: the query has the right cache tags, Sanity sends a focused and authenticated event, the Route Handler invalidates every affected cache entry, and the next request regenerates the correct routes. Debug those contracts in order instead of purging every cache at once.'),
    h2('A webhook does not refresh a page by itself'),
    p('A Sanity webhook is only an HTTP request describing a content change. Next.js must validate that request and explicitly invalidate the cached data or route. If the query was never tagged, revalidateTag has nothing to target. If only the article tag is invalidated, the homepage and guides archive can remain stale. If a slug changes, the old URL also needs deliberate handling.'),
    callout('tip','Model the affected surfaces first','For a guide mutation, this site must consider the individual article, the homepage list, the guides archive, and the sitemap. Your application may have category pages, feeds, search indexes, or related-content blocks too.'),
    h2('Tag the Sanity reads you intend to invalidate'),
    p('Use a collection tag for shared lists and a document-specific tag for individual pages. Tag names are case-sensitive, must match exactly, and should remain stable across the webhook and data layer.'),
    code('lib/sanity.ts','typescript','good',`export async function getArticle(slug: string) {
  return client.fetch(ARTICLE_QUERY, {slug}, {
    next: {tags: ['techArticles', \`techArticle:\${slug}\`]},
  })
}

export async function getGuideArticles() {
  return client.fetch(GUIDES_QUERY, {}, {
    next: {tags: ['techArticles', 'techGuides']},
  })
}`),
    p('The broad techArticles tag gives you a safe shared invalidation boundary. The techGuides tag isolates guide listings, while techArticle:<slug> targets one article. Do not create tags from mutable titles. Slugs or immutable document IDs are predictable enough to reproduce in the webhook handler.'),
    h2('Create a signed Route Handler'),
    p('The endpoint is public because Sanity must reach it, but its action must not be public. Validate the signature with a server-only secret before calling any revalidation function. Never place the webhook secret behind a NEXT_PUBLIC_ prefix.'),
    code('.env.local','bash','neutral',`SANITY_REVALIDATE_SECRET=replace-with-a-long-random-secret`),
    code('app/api/revalidate/route.ts','typescript','good',`import {revalidatePath, revalidateTag} from 'next/cache'
import {parseBody} from 'next-sanity/webhook'

type Payload = {_id?: string; slug?: string; previousSlug?: string}

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return Response.json({message: 'Missing secret'}, {status: 500})

  const {body, isValidSignature} = await parseBody<Payload>(request, secret)
  if (!isValidSignature) {
    return Response.json({message: 'Invalid signature'}, {status: 401})
  }

  revalidateTag('techArticles', 'max')
  revalidateTag('techGuides', 'max')

  if (body?.slug) {
    revalidateTag(\`techArticle:\${body.slug}\`, 'max')
    revalidatePath(\`/guides/\${body.slug}\`)
  }
  if (body?.previousSlug && body.previousSlug !== body.slug) {
    revalidateTag(\`techArticle:\${body.previousSlug}\`, 'max')
    revalidatePath(\`/guides/\${body.previousSlug}\`)
  }

  revalidatePath('/')
  revalidatePath('/guides')
  revalidatePath('/sitemap.xml')
  return Response.json({revalidated: true, now: Date.now()})
}`),
    callout('warning','Use the current profile argument','The one-argument immediate-expiration form is deprecated in current Next.js. For webhook-driven content, revalidateTag(tag, "max") uses stale-while-revalidate. updateTag is for read-your-own-writes in Server Actions and cannot be called from this Route Handler.'),
    h2('Configure a narrow Sanity webhook'),
    p('Create a document webhook in the Sanity project management interface. Use the production endpoint, POST, the production dataset, and the same secret configured in Vercel. Trigger only on create, update, and delete events for the content type this handler understands.'),
    code('Webhook URL','text','neutral',`https://YOUR_DOMAIN/api/revalidate`),
    code('Webhook filter','groq','good',`_type == "techArticle"`),
    code('Webhook projection','groq','good',`{
  _id,
  "slug": coalesce(after().slug.current, before().slug.current),
  "previousSlug": before().slug.current
}`),
    p('The projection keeps the payload small and preserves the previous slug. That matters on delete events and slug changes, where after() may not contain the route that was previously cached. Sanity ignores drafts and versions by default unless those options are explicitly enabled, which is appropriate for a published-site webhook.'),
    h2('Understand what “max” means during verification'),
    p('revalidateTag with the max profile marks tagged data stale. The next visit can receive the stale value while Next.js refreshes it in the background; a following request receives the fresh value. That first stale response is expected stale-while-revalidate behavior, not proof that the webhook failed.'),
    p('revalidatePath handles the route-level output around the data cache. Using both is intentional here: tags express which Sanity reads changed, while paths cover the pages and metadata routes that assemble those reads. Keep the invalidation set specific enough that one edit does not regenerate the entire application.'),
    h2('Run the production verification sequence'),
    h3('1. Prove the mutation is published'),
    p('Query the production dataset with perspective: published and useCdn: false. If the new value is absent there, stay in Sanity and do not debug Next.js yet.'),
    h3('2. Inspect the Sanity delivery attempt'),
    p('Open the webhook attempts log. Confirm the expected event triggered, the URL is the production domain, the response is in the 200 range, and the payload contains the current and previous slugs. A 401 means signature or secret mismatch. A 404 means the deployed route path is wrong.'),
    h3('3. Log the invalidation boundary'),
    p('Temporarily log the webhook document ID, slug, previousSlug, tags, and paths being invalidated. Do not log the secret or full signature. This proves the handler did more than return a successful status.'),
    code('Temporary diagnostic','typescript','neutral',`console.info('Sanity revalidation', {
  id: body?._id,
  slug: body?.slug,
  previousSlug: body?.previousSlug,
  tags: ['techArticles', 'techGuides'],
})`),
    h3('4. Request every affected surface twice'),
    p('Open the article, homepage, guides archive, and sitemap. Because max uses stale-while-revalidate, request each surface again after the first response. Confirm the article copy, updated date, list order, links, and sitemap URL all agree.'),
    h3('5. Test a slug change and deletion'),
    p('Change a disposable document slug and verify the new URL appears while the old URL stops resolving or redirects according to your policy. Then delete or unpublish it and verify it disappears from lists and the sitemap. Create and update tests alone do not prove lifecycle correctness.'),
    h2('Failure patterns that look alike'),
    h3('The webhook never appears in the attempts log'),
    p('The filter, dataset, event selection, or webhook status is wrong. Confirm the mutation matches _type == "techArticle" and the webhook is enabled for the dataset you are editing.'),
    h3('The webhook returns 401'),
    p('The secret configured in Sanity does not match the deployed SANITY_REVALIDATE_SECRET, or the request body was consumed before parseBody verified it. Environment variables are isolated between Vercel production and preview deployments, so verify the correct environment and redeploy after changing the secret.'),
    h3('The handler returns 200, but nothing changes'),
    p('The tag strings likely do not match the tags attached to the fetch, or the page uses a different untagged query. Log both sides exactly. Also confirm the route is deployed in the same Vercel project and environment as the cached application you are testing.'),
    h3('The article updates, but lists remain stale'),
    p('Only the document-specific tag or article path was invalidated. Add the shared collection tag and revalidate the homepage, archive, feed, or category paths that include the document.'),
    h3('The first refresh is stale, and the second is fresh'),
    p('That is the expected max profile. updateTag is limited to Server Actions. For a webhook Route Handler, design the verification around stale-while-revalidate or choose an appropriate custom cache-life profile.'),
    h3('It works on a Vercel preview URL but not the custom domain'),
    p('Production and preview are separate deployments with separate environment variables and caches. Point the Sanity webhook at the canonical production domain, scope the secret to Production, and confirm that the domain resolves to the intended Vercel project.'),
    h2('The reliable publishing contract'),
    p('A production CMS integration should not depend on redeployment to expose a published edit. Tag every cached read intentionally, authenticate a narrow webhook, invalidate both document and collection surfaces, preserve old route information, and verify the production response under the cache semantics you selected.'),
    callout('tip','Make revalidation observable','Keep Sanity attempts, structured server logs, stable tag names, and a repeatable publish test. When each boundary can be observed independently, stale content becomes a specific failed contract instead of a mysterious cache problem.'),
  ],
}

const result = await client.createOrReplace(article)
console.log(JSON.stringify({published:{_id:result._id,_type:result._type},coverAsset:coverAsset._id}, null, 2))
