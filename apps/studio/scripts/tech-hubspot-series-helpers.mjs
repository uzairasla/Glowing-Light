import {createReadStream} from 'node:fs'
import {readFile} from 'node:fs/promises'
import {homedir} from 'node:os'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

export const SITE = 'https://devfieldnotes.dev/guides'
export const URLS = {
  architecture: `${SITE}/scaling-hubspot-subscriptions-across-multiple-websites`,
  routing: `${SITE}/hubspot-multi-brand-subscription-routing`,
  reliability: `${SITE}/reliable-hubspot-sync-transactional-outbox-qstash`,
  identity: `${SITE}/privacy-safe-hubspot-email-identity-links`,
}

export const series = {
  _id: 'tech-series-production-hubspot-integrations',
  _type: 'techSeries',
  title: 'Production HubSpot Integrations',
  slug: {_type: 'slug', current: 'production-hubspot-integrations'},
  description:
    'A four-part field guide to multi-brand routing, rate-aware delivery, durable synchronization, and privacy-safe identity across a large HubSpot integration.',
}


const coverAlts = {
  'scaling-hubspot-subscriptions-across-multiple-websites':
    'More than forty website interfaces converge through an intake gateway, database, event queue, and rate-control valve into one CRM destination',
  'hubspot-multi-brand-subscription-routing':
    'Multiple brand sources enter a central routing matrix and fan out into communication, segment, property, and analytics destinations',
  'reliable-hubspot-sync-transactional-outbox-qstash':
    'A database vault sends durable events through a queue, idempotent worker, rate-control gate, retry loop, and observability dashboard',
  'privacy-safe-hubspot-email-identity-links':
    'An opaque email token passes through a shielded verification gateway to a clean browser destination while personal identity remains protected in a vault',
}

export const taxonomies = [
  {
    _id: 'tech-taxonomy-hubspot',
    _type: 'techTaxonomy',
    title: 'HubSpot',
    slug: {_type: 'slug', current: 'hubspot'},
    description: 'HubSpot CRM integrations, subscription systems, APIs, and production architecture.',
  },
  {
    _id: 'tech-taxonomy-distributed-systems',
    _type: 'techTaxonomy',
    title: 'Distributed systems',
    slug: {_type: 'slug', current: 'distributed-systems'},
    description: 'Queues, idempotency, consistency, retries, and reliable distributed workflows.',
  },
  {
    _id: 'tech-taxonomy-security',
    _type: 'techTaxonomy',
    title: 'Security',
    slug: {_type: 'slug', current: 'security'},
    description: 'Application security, privacy boundaries, authentication, and safe data handling.',
  },
  {
    _id: 'tech-taxonomy-guides',
    _type: 'techTaxonomy',
    title: 'Guides',
    slug: {_type: 'slug', current: 'guides'},
    description: 'Tested implementation guides for production software systems.',
  },
  {
    _id: 'tech-taxonomy-nextjs',
    _type: 'techTaxonomy',
    title: 'Next.js',
    slug: {_type: 'slug', current: 'nextjs'},
    description: 'Next.js application architecture, production patterns, and debugging.',
  },
  {
    _id: 'tech-taxonomy-postgresql',
    _type: 'techTaxonomy',
    title: 'PostgreSQL',
    slug: {_type: 'slug', current: 'postgresql'},
    description: 'PostgreSQL application architecture, access control, and integrations.',
  },
]

let key = 0
const block = (style, text, extra = {}) => ({
  _key: `b${++key}`,
  _type: 'block',
  style,
  markDefs: [],
  children: [{_key: `s${key}`, _type: 'span', marks: [], text}],
  ...extra,
})

export const p = (text) => block('normal', text)
export const h2 = (text) => block('h2', text)
export const h3 = (text) => block('h3', text)
export const bullet = (text) => block('normal', text, {listItem: 'bullet'})
export const numbered = (text) => block('normal', text, {listItem: 'number'})

export const linkedP = (before, label, href, after = '') => {
  const blockKey = `b${++key}`
  const markKey = `link${key}`
  return {
    _key: blockKey,
    _type: 'block',
    style: 'normal',
    markDefs: [{_key: markKey, _type: 'link', href}],
    children: [
      {_key: `s${key}a`, _type: 'span', marks: [], text: before},
      {_key: `s${key}b`, _type: 'span', marks: [markKey], text: label},
      {_key: `s${key}c`, _type: 'span', marks: [], text: after},
    ],
  }
}

export const code = (filename, language, tone, value, caption) => ({
  _key: `c${++key}`,
  _type: 'codeBlock',
  filename,
  language,
  tone,
  code: value,
  ...(caption ? {caption} : {}),
})

export const callout = (tone, title, body) => ({
  _key: `a${++key}`,
  _type: 'techCallout',
  tone,
  title,
  body,
})

export const ref = (id, keyName = id.replace('tech-taxonomy-', '')) => ({
  _key: keyName,
  _type: 'reference',
  _ref: id,
})

export const source = (keyName, title, url) => ({_key: keyName, title, url})

function validateArticle(article) {
  const required = ['_id', '_type', 'title', 'slug', 'description', 'body', 'seriesOrder']
  const missing = required.filter((field) => !article[field])
  if (missing.length) throw new Error(`Missing article fields: ${missing.join(', ')}`)
  if (article._type !== 'techArticle') throw new Error('Expected a techArticle document')
  if (!article.body.some((item) => item._type === 'block' && item.style === 'h2')) {
    throw new Error('Article must contain at least one h2 block')
  }
  if (article.seoTitle?.length > 65) throw new Error(`SEO title is too long: ${article.seoTitle}`)
  if (article.description.length > 180) throw new Error(`Description is too long: ${article.title}`)
  if (article.seoDescription?.length > 180) {
    throw new Error(`SEO description is too long: ${article.title}`)
  }
}

function proseWordCount(body) {
  const prose = body.flatMap((item) => {
    if (item._type === 'block') {
      return item.children.map((child) => child.text)
    }
    if (item._type === 'techCallout') return [item.title, item.body]
    return []
  }).join(' ')

  return prose.trim().split(/\s+/u).filter(Boolean).length
}

export async function publishTechArticle(article) {
  validateArticle(article)
  const publish = process.argv.includes('--publish')
  if (!publish) {
    console.log(JSON.stringify({
      mode: 'local-draft',
      title: article.title,
      slug: article.slug.current,
      blocks: article.body.length,
      proseWords: proseWordCount(article.body),
      sources: article.sourceUrls.length,
      note: 'Run with --publish to write this article and its series metadata to Sanity.',
    }, null, 2))
    return
  }

  const [{createClient}] = await Promise.all([import('@sanity/client')])
  const session = JSON.parse(
    await readFile(join(homedir(), '.config', 'sanity', 'config.json'), 'utf8'),
  )
  const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'dis8yhkz',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
    apiVersion: '2026-08-18',
    useCdn: false,
    token: session.authToken,
  })

  const slug = article.slug.current
  const coverAlt = coverAlts[slug]
  if (!coverAlt) throw new Error(`Missing cover alt text for ${slug}`)

  const existingCoverRef = await client.fetch(
    `*[_id == $articleId][0].coverImage.asset._ref`,
    {articleId: article._id},
  )
  const coverPath = join(
    dirname(fileURLToPath(import.meta.url)),
    `../../tech-blog/public/articles/${slug}/cover.png`,
  )
  const coverAsset = existingCoverRef
    ? {_id: existingCoverRef}
    : await client.assets.upload('image', createReadStream(coverPath), {
        filename: `${slug}.png`,
        contentType: 'image/png',
      })

  const transaction = client.transaction()
  for (const taxonomy of taxonomies) transaction.createIfNotExists(taxonomy)
  transaction.createOrReplace(series)
  transaction.createOrReplace({
    ...article,
    coverImage: {
      _type: 'image',
      asset: {_type: 'reference', _ref: coverAsset._id},
      alt: coverAlt,
    },
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  const result = await transaction.commit()
  console.log(JSON.stringify({published: article.slug.current, transactionId: result.transactionId}, null, 2))
}
