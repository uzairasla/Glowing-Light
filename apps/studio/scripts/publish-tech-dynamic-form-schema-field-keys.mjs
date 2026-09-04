import {createReadStream} from 'node:fs'
import {readFile} from 'node:fs/promises'
import {homedir} from 'node:os'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'

const session = JSON.parse(
  await readFile(join(homedir(), '.config', 'sanity', 'config.json'), 'utf8'),
)
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'dis8yhkz',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  apiVersion: '2026-08-01',
  useCdn: false,
  token: session.authToken,
})

let key = 0
const block = (style, text) => ({
  _key: `b${++key}`,
  _type: 'block',
  style,
  markDefs: [],
  children: [{_key: `s${key}`, _type: 'span', marks: [], text}],
})
const p = (text) => block('normal', text)
const h2 = (text) => block('h2', text)
const h3 = (text) => block('h3', text)
const code = (filename, language, tone, value) => ({
  _key: `c${++key}`,
  _type: 'codeBlock',
  filename,
  language,
  tone,
  code: value,
})
const callout = (tone, title, body) => ({
  _key: `a${++key}`,
  _type: 'techCallout',
  tone,
  title,
  body,
})

const articleId = 'tech-article-dynamic-form-schema-field-keys'
const existingCoverRef = await client.fetch(
  `*[_id == $articleId][0].coverImage.asset._ref`,
  {articleId},
)
const coverPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../tech-blog/public/articles/dynamic-form-schema-field-keys/cover.png',
)
const coverAsset = existingCoverRef
  ? {_id: existingCoverRef}
  : await client.assets.upload('image', createReadStream(coverPath), {
      filename: 'dynamic-form-schema-field-keys.png',
      contentType: 'image/png',
    })

const article = {
  _id: articleId,
  _type: 'techArticle',
  title: 'Dynamic Form Schema Design: How to Keep Field Keys Consistent at Scale',
  slug: {_type: 'slug', current: 'dynamic-form-schema-field-keys'},
  description:
    'A practical guide to designing scalable dynamic forms with controlled field keys, Sanity references, publish-time validation, migrations, and durable data contracts.',
  kicker: 'Architecture field guide 002',
  readTime: '16 min',
  difficulty: 'Intermediate',
  publishedAt: '2026-08-01T12:00:00.000Z',
  updatedAt: '2026-08-01T12:00:00.000Z',
  coverImage: {
    _type: 'image',
    asset: {_type: 'reference', _ref: coverAsset._id},
    alt: 'Multiple branded forms passing inconsistent field keys through a controlled registry before producing normalized records for a data warehouse',
  },
  taxonomies: [
    {_key: 'sanity', _type: 'reference', _ref: 'tech-taxonomy-sanity'},
    {_key: 'guides', _type: 'reference', _ref: 'tech-taxonomy-guides'},
    {_key: 'debugging', _type: 'reference', _ref: 'tech-taxonomy-debugging'},
  ],
  seoTitle: 'Dynamic Form Schema Design: Keep Field Keys Consistent',
  seoDescription:
    'Design scalable dynamic forms with stable submission keys, a controlled field registry, Sanity validation, safe renames, aliases, and migration audits.',
  sourceUrls: [
    {
      _key: 'src1',
      title: 'Sanity Studio validation',
      url: 'https://www.sanity.io/docs/studio/validation',
    },
    {
      _key: 'src2',
      title: 'Sanity cross-dataset references',
      url: 'https://www.sanity.io/docs/studio/cross-dataset-references',
    },
    {
      _key: 'src3',
      title: 'Sanity schema and content migrations',
      url: 'https://www.sanity.io/docs/content-lake/schema-and-content-migrations',
    },
    {
      _key: 'src4',
      title: 'GROQ query to find duplicate data',
      url: 'https://www.sanity.io/recipes/groq-query-to-find-duplicate-data-Q1kbbo7fUQAjtPldAqGhY',
    },
  ],
  body: [
    p(
      'Dynamic forms are easy to start and surprisingly difficult to govern. A field begins as a label, an input type, and a key. Then the platform grows across brands, campaigns, integrations, and reporting pipelines. If those keys are still controlled by written instructions and human memory, the form builder eventually becomes a source of inconsistent data.',
    ),
    p(
      'Validation rules need to be enforced without removing the flexibility that made the form system useful. Every client and brand will have special requirements, but shared business data such as email, first name, phone number, and consent must still arrive in a predictable shape. The solution is not to make every form identical. It is to separate governed fields from genuinely custom fields and give each group an explicit contract.',
    ),
    callout(
      'tip',
      'A submission key is an API contract',
      'Editors may think of first_name as a CMS setting, but warehouses, integrations, exports, and dashboards treat it as a stable interface. Once downstream systems consume a key, changing it is a versioned data migration—not a copy edit.',
    ),
    h2('The problem I found in a multi-brand form system'),
    p(
      'I encountered this while working on a large form platform used by more than 50 brands and containing a few hundred forms. Its content hierarchy was straightforward: field documents were selected by form documents, and the frontend rendered each form from that configuration.',
    ),
    code(
      'Original content hierarchy',
      'text',
      'neutral',
      `Field schema
  -> Form schema
      -> Rendered form
          -> Submission payload`,
    ),
    p(
      'The field schema contained a text property named keyName. Editors were instructed to reuse the same value for the same concept across brands—for example, every first-name field should submit first_name. That convention worked while the people editing forms understood the downstream expectations.',
    ),
    p(
      'The platform was then maintained for some time by business users who had no reason to understand database schemas or data pipelines. They created fields that looked correct in the Studio and rendered correctly in the browser, but the free-text keys drifted. The same concept acquired aliases such as first_name, firstname, firstName, and customer_first_name. In other cases, the same key was reused for fields with different meanings.',
    ),
    p(
      'A GROQ audit made the accumulated inconsistency visible. The important problem was not merely that a key appeared in multiple brands—shared keys are desirable when they share semantics. The dangerous cases were semantic duplicates with different keys and semantic collisions where one key represented different data.',
    ),
    h2('Why inconsistent keys become a data problem'),
    p(
      'The rendered form can continue to work even when its field keys are inconsistent. A visitor sees “First name,” enters a value, and receives a success message. The failure appears later, after the payload has left the form application.',
    ),
    p(
      'Warehouses and transformation jobs expect important fields in a known shape. CRM mappings expect an email address at a specific path. Consent systems need to distinguish an explicit opt-in from an unrelated checkbox. Reporting code needs one definition of a lead rather than a growing collection of brand-specific exceptions.',
    ),
    code(
      'Payload drift across brands',
      'json',
      'bad',
      `// Brand A
{"first_name":"Amina","email":"amina@example.com"}

// Brand B
{"firstName":"Yusuf","email_address":"yusuf@example.com"}

// Brand C
{"customer_name":"Sara","email":"sara@example.com"}`,
    ),
    p(
      'That drift forces every consumer to normalize data independently. A warehouse model adds COALESCE expressions, the CRM adapter maintains another alias map, exports acquire conditional columns, and analysts stop trusting whether a blank value means “not provided” or “stored under another key.” The cost compounds each time a new form or integration is added.',
    ),
    h2('First define the invariants'),
    p(
      'Before changing the schema, define what the platform promises. In my case, a governed field key needed to have one stable meaning across all brands, a known value type, an ownership policy, and a controlled retirement process. It also needed to be unique within an individual form so one submission could never overwrite another value.',
    ),
    p(
      'It helps to separate three identifiers that are often confused. The field document ID identifies a CMS record. The display label is editable presentation text. The submission key identifies the value in an external data contract. Those values can be related, but they should not be interchangeable.',
    ),
    code(
      'Three separate identities',
      'typescript',
      'good',
      `type FormField = {
  fieldDefinitionId: string // CMS identity
  label: string             // presentation; safe to edit
  submissionKey: string     // data contract; stable after use
  valueType: 'string' | 'email' | 'boolean' | 'number'
}`,
    ),
    h2('Use a controlled field registry'),
    p(
      'The first half of the solution is a central registry for business-critical fields. Instead of typing the key into every brand field, an editor selects a governed definition such as Email address, First name, Phone number, or Marketing consent. The registry owns the canonical submission key and its semantics.',
    ),
    code(
      'schemas/controlledField.ts',
      'typescript',
      'good',
      `import {defineField, defineType} from 'sanity'

export const controlledField = defineType({
  name: 'controlledField',
  title: 'Controlled field',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: r => r.required()}),
    defineField({
      name: 'submissionKey',
      type: 'string',
      validation: r => r.required().regex(/^[a-z][a-z0-9_]*$/),
    }),
    defineField({
      name: 'valueType',
      type: 'string',
      options: {list: ['string', 'email', 'boolean', 'number']},
      validation: r => r.required(),
    }),
    defineField({name: 'description', type: 'text'}),
    defineField({name: 'deprecated', type: 'boolean', initialValue: false}),
    defineField({name: 'aliases', type: 'array', of: [{type: 'string'}]}),
  ],
})`,
    ),
    p(
      'A useful registry stores more than the name. Record the value type, definition, owner, lifecycle state, previous aliases, sensitivity classification, and any downstream mappings that are truly universal. This turns the registry into documentation that both editors and data teams can inspect.',
    ),
    callout(
      'warning',
      'Do not make a new dataset the default answer',
      'Keep the registry in the same dataset when that satisfies access and reuse requirements. Sanity cross-dataset references are an Enterprise feature and introduce limits around drafts, reverse lookups, permissions, and deletion. Use a global dataset only when organizational isolation genuinely requires it.',
    ),
    h2('Keep brand-specific fields flexible'),
    p(
      'Not every question belongs in a global catalogue. Campaign codes, event-specific preferences, local compliance questions, and product-specific qualifiers may legitimately belong to one brand. Forcing all of them into the controlled registry would turn central governance into a bottleneck.',
    ),
    p(
      'The form schema can therefore accept two field sources: references to controlled fields and references to brand-owned custom fields. Custom keys should live in a namespace that cannot collide with reserved business keys. A pattern such as custom.<brand>.<key> makes ownership explicit and prevents an editor from casually recreating email or first_name.',
    ),
    code(
      'schemas/formField.ts',
      'typescript',
      'good',
      `export const formField = defineType({
  name: 'formField',
  type: 'object',
  fields: [
    defineField({
      name: 'source',
      type: 'string',
      options: {list: ['controlled', 'custom']},
      validation: r => r.required(),
    }),
    defineField({
      name: 'controlledField',
      type: 'reference',
      to: [{type: 'controlledField'}],
      hidden: ({parent}) => parent?.source !== 'controlled',
    }),
    defineField({
      name: 'customField',
      type: 'reference',
      to: [{type: 'brandField'}],
      hidden: ({parent}) => parent?.source !== 'custom',
    }),
    defineField({name: 'labelOverride', type: 'string'}),
    defineField({name: 'required', type: 'boolean'}),
  ],
})`,
    ),
    p(
      'Notice that the form stores references rather than copying submission keys. A label override can vary by brand without changing the underlying contract. At runtime, the query resolves the appropriate definition and creates the payload from its canonical key.',
    ),
    h2('Enforce the contract when a form is published'),
    p(
      'The second half of the solution is enforcement. Instructions in a description field are useful documentation, but they are not a control. A form should be blocked from publication when a controlled reference is missing, a custom key uses a reserved name, two resolved fields produce the same key, or a deprecated definition is added to a new form.',
    ),
    code(
      'Document-level validation',
      'typescript',
      'good',
      `validation: Rule => Rule.custom(async (document, context) => {
  const fields = document?.fields ?? []
  const client = context.getClient({apiVersion: '2026-08-01'})
  const ids = fields
    .map(field => field.controlledField?._ref ?? field.customField?._ref)
    .filter(Boolean)

  const definitions = await client.fetch(
    '*[_id in $ids]{_id, submissionKey, deprecated}',
    {ids},
  )

  if (definitions.some(field => field.deprecated)) {
    return 'Replace deprecated field definitions before publishing.'
  }

  const keys = definitions.map(field => field.submissionKey)
  const duplicate = keys.find((key, index) => keys.indexOf(key) !== index)

  return duplicate
    ? \`Submission key “\${duplicate}” appears more than once in this form.\`
    : true
})`,
    ),
    p(
      'Field-level rules provide precise feedback for simple constraints, while document-level validation can compare the resolved fields as a group. Async validation should query only the IDs it needs and return a clear action the editor can take.',
    ),
    callout(
      'warning',
      'Studio validation is not an API firewall',
      'Sanity schema validation runs in the Studio. Client-library and HTTP mutations can bypass it. Revalidate the resolved form contract in publishing workflows, import scripts, webhooks, and submission services rather than trusting the editing interface alone.',
    ),
    h3('Validate the submission on the server too'),
    p(
      'A published form definition tells the server which keys and types are allowed. The submission endpoint should derive a runtime schema from that definition, reject unexpected keys, and validate values before storage. Client-side validation improves the visitor experience; server-side validation protects the contract.',
    ),
    code(
      'lib/forms/build-submission-schema.ts',
      'typescript',
      'good',
      `import {z} from 'zod'

const validators = {
  string: z.string(),
  email: z.string().email(),
  boolean: z.boolean(),
  number: z.number(),
} as const

export function buildSubmissionSchema(fields) {
  const shape = Object.fromEntries(
    fields.map(field => {
      const validator = validators[field.valueType]
      return [field.submissionKey, field.required ? validator : validator.optional()]
    }),
  )

  return z.object(shape).strict()
}`,
    ),
    h2('Audit the existing damage before migrating'),
    p(
      'Introducing the registry stops new drift, but it does not repair years of existing content. Start with an inventory rather than an automatic rename. Export each field’s document ID, brand, form usage, label, key, type, and downstream consumers. Then group the results into safe canonical mappings, ambiguous mappings, and genuine collisions that require a business decision.',
    ),
    code(
      'GROQ inventory query',
      'groq',
      'neutral',
      `*[_type == "field"]{
  _id,
  label,
  keyName,
  valueType,
  "brand": brand->slug.current,
  "usedByForms": *[_type == "form" && references(^._id)]{
    _id,
    title
  }
} | order(keyName asc)`,
    ),
    p(
      'Be careful with the word duplicate. Ten fields using email can be correct if they all mean the same thing. One email key used for both a visitor’s email and a referral contact’s email is a collision. Conversely, email, email_address, and contactEmail may be semantic duplicates that should converge on one definition.',
    ),
    h2('Treat renaming as a versioned migration'),
    p(
      'Once a key has appeared in production data, avoid changing it in place. Create or select the canonical definition, retain the old key as an alias, update form references, and normalize at the ingestion boundary during a compatibility window. Historical rows can then be backfilled deliberately.',
    ),
    code(
      'Normalize legacy aliases',
      'typescript',
      'good',
      `const aliases = {
  firstname: 'first_name',
  firstName: 'first_name',
  email_address: 'email',
} as const

export function normalizeSubmission(input: Record<string, unknown>) {
  return Object.entries(input).reduce<Record<string, unknown>>(
    (result, [key, value]) => {
      const canonicalKey = aliases[key] ?? key

      if (canonicalKey in result && result[canonicalKey] !== value) {
        throw new Error(\`Conflicting values supplied for \${canonicalKey}\`)
      }

      result[canonicalKey] = value
      return result
    },
    {},
  )
}`,
    ),
    p(
      'Instrument alias usage before removing compatibility code. When no active forms emit a legacy key and warehouse traffic shows no remaining producers, the alias can be retired. This is safer than guessing that a migration reached every form, cached client, webhook, and external integration.',
    ),
    h2('Operational rules that keep the registry healthy'),
    p(
      'A registry can become another uncontrolled list unless ownership is explicit. Limit who can create or rename controlled definitions. Let brand editors select them and customize presentation, but require a review for changes to keys, types, consent semantics, or lifecycle status.',
    ),
    p(
      'Add automated checks to the publishing or deployment workflow: controlled keys must be globally unique by meaning, custom keys must use their namespace, every form must resolve to unique keys, referenced definitions must exist, and deprecated fields must not appear in newly published forms. Periodic audits can detect API imports or older tooling that bypassed the Studio.',
    ),
    h2('The resulting architecture'),
    code(
      'Governed form lifecycle',
      'text',
      'neutral',
      `Controlled field registry
  -> canonical key + type + semantics + lifecycle

Brand field catalogue
  -> namespaced custom keys

Form schema
  -> references controlled and custom definitions
  -> allows presentation overrides
  -> validates resolved keys before publication

Submission service
  -> resolves the published contract
  -> validates and normalizes the payload
  -> stores a predictable data shape

Warehouse and integrations
  -> consume canonical keys
  -> monitor temporary legacy aliases`,
    ),
    h2('What changed after moving control into the schema'),
    p(
      'The important change was not replacing one text field with a reference. It was deciding where flexibility belongs. Brands remained free to compose forms, change labels, add local questions, and choose presentation. The platform took ownership of the identifiers and semantics that downstream systems depend on.',
    ),
    p(
      'That boundary allows a form system to scale without asking every editor to become a data engineer. Shared concepts come from a governed registry. Custom concepts live in an explicit namespace. Publishing catches invalid combinations. The server validates the actual payload. Renames follow a migration plan rather than silently breaking consumers.',
    ),
    callout(
      'tip',
      'Govern contracts, not creativity',
      'A scalable form platform does not remove brand flexibility. It protects the small set of identifiers that cross system boundaries, then gives editors freedom everywhere else.',
    ),
  ],
}

const result = await client.createOrReplace(article)
console.log(
  JSON.stringify(
    {
      published: {_id: result._id, _type: result._type, slug: article.slug.current},
      coverAsset: coverAsset._id,
    },
    null,
    2,
  ),
)
