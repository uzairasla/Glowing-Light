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
  apiVersion: '2026-08-08',
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
const linkedP = (before, label, href, after = '') => {
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

const articleId = 'tech-article-sanity-custom-validation-unique-fields'
const existingCoverRef = await client.fetch(
  `*[_id == $articleId][0].coverImage.asset._ref`,
  {articleId},
)
const coverPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../tech-blog/public/articles/sanity-custom-validation-unique-fields/cover.png',
)
const coverAsset = existingCoverRef
  ? {_id: existingCoverRef}
  : await client.assets.upload('image', createReadStream(coverPath), {
      filename: 'sanity-custom-validation-unique-fields.png',
      contentType: 'image/png',
    })

const article = {
  _id: articleId,
  _type: 'techArticle',
  title: 'Sanity Custom Validation: How to Enforce Unique Fields With GROQ',
  slug: {_type: 'slug', current: 'sanity-custom-validation-unique-fields-groq'},
  description:
    'Build reliable Sanity validation for fields, nested arrays, references, and unique values across documents with Rule.custom and asynchronous GROQ.',
  kicker: 'Sanity field guide 005',
  readTime: '17 min',
  difficulty: 'Intermediate',
  publishedAt: '2026-08-08T12:00:00.000Z',
  updatedAt: '2026-08-08T12:00:00.000Z',
  coverImage: {
    _type: 'image',
    asset: {_type: 'reference', _ref: coverAsset._id},
    alt: 'A structured content document moving through field, document, and dataset-wide validation gates while invalid duplicates are rejected',
  },
  taxonomies: [
    {_key: 'sanity', _type: 'reference', _ref: 'tech-taxonomy-sanity'},
    {_key: 'guides', _type: 'reference', _ref: 'tech-taxonomy-guides'},
    {_key: 'debugging', _type: 'reference', _ref: 'tech-taxonomy-debugging'},
  ],
  seoTitle: 'Sanity Custom Validation With GROQ',
  seoDescription:
    'Use Sanity Rule.custom for field, array, reference, and cross-document uniqueness checks, then enforce the same rules outside Studio.',
  sourceUrls: [
    {
      _key: 'src1',
      title: 'Sanity Studio validation',
      url: 'https://www.sanity.io/docs/studio/validation',
    },
    {
      _key: 'src2',
      title: 'Sanity schema validation and the Content Lake',
      url: 'https://www.sanity.io/docs/content-lake/schema-validation-and-the-content-lake',
    },
    {
      _key: 'src3',
      title: 'Sanity array schema type',
      url: 'https://www.sanity.io/docs/studio/array-type',
    },
    {
      _key: 'src4',
      title: 'Sanity TypeGen',
      url: 'https://www.sanity.io/docs/apis-and-sdks/sanity-typegen',
    },
  ],
  body: [
    p(
      'Sanity validation looks simple until the rule depends on more than one value. Requiring a title or limiting a string is straightforward. The difficult cases begin when a field depends on a sibling, an array must be unique by one nested property, a reference needs to be resolved, or a key must be unique across the entire dataset.',
    ),
    p(
      'I ran into that boundary while hardening a form platform whose field definitions were shared across more than 50 brands. The Studio needed to prevent duplicate submission keys, reject deprecated field definitions, and preserve a stable payload shape. A description telling editors what to do was not enough. The rule had to block an invalid document and explain exactly how to fix it.',
    ),
    callout(
      'tip',
      'Start by naming the scope',
      'Before writing a validator, ask where uniqueness must hold: inside one primitive array, across one property in an object array, within one document, or across every document in the dataset. Each scope requires a different implementation.',
    ),
    h2('The five validation scopes'),
    p(
      'Most Sanity validation requirements fall into five scopes. Field validation checks one value. Sibling-aware validation compares a value with its parent object or document. Array validation checks a collection of items. Document validation evaluates several fields together. Dataset validation queries other documents asynchronously.',
    ),
    code(
      'Choose the smallest sufficient scope',
      'text',
      'neutral',
      `One scalar value                 -> field rule
One value plus sibling fields     -> Rule.custom + context.parent
Items inside one array            -> array rule
Several fields in one document    -> document-level rule
Values in other documents         -> async Rule.custom + GROQ
Writes outside Sanity Studio      -> server/import validation`,
    ),
    p(
      'Use the narrowest scope that can enforce the invariant. A field-level message can point directly to the broken input. A document-level rule has more context but usually produces less precise feedback. A dataset query is powerful, but it adds network work to the editing experience.',
    ),
    h2('Begin with built-in field rules'),
    p(
      'Built-in rules should handle required values, lengths, numeric ranges, formats, and predefined choices. They are easier to read than a custom function and Sanity can present their errors directly beside the relevant input.',
    ),
    code(
      'schemas/controlledField.ts',
      'typescript',
      'good',
      `import {defineField} from 'sanity'

defineField({
  name: 'submissionKey',
  title: 'Submission key',
  type: 'string',
  validation: (Rule) =>
    Rule.required()
      .min(2)
      .max(80)
      .regex(/^[a-z][a-z0-9_]*$/, {
        name: 'snake_case key',
      }),
})`,
    ),
    p(
      'A specific message is more useful than “invalid value.” Editors should know whether the key is missing, too long, or contains unsupported characters. Put the business explanation in the field description and keep the validation message focused on the action required.',
    ),
    h2('Validate a field using sibling values'),
    p(
      'A field often changes meaning based on another property in the same object. In a form builder, a controlled field may use a reserved key while a brand-specific field must use an explicit namespace. The validator can inspect the nearest parent through its context.',
    ),
    code(
      'schemas/brandField.ts',
      'typescript',
      'good',
      `type FieldParent = {
  source?: 'controlled' | 'custom'
  brandSlug?: string
}

defineField({
  name: 'submissionKey',
  type: 'string',
  validation: (Rule) =>
    Rule.custom((value, context) => {
      if (!value) return true

      const parent = context.parent as FieldParent | undefined
      if (parent?.source !== 'custom') return true

      const expectedPrefix = \`custom.\${parent.brandSlug}.\`
      return value.startsWith(expectedPrefix)
        ? true
        : \`Custom keys must begin with “\${expectedPrefix}”.\`
    }),
})`,
    ),
    p(
      'Custom validators should tolerate undefined values unless they are also responsible for requiredness. Keeping Rule.required() separate avoids returning two competing errors for an empty input and makes the custom function easier to reason about.',
    ),
    h2('What Rule.unique() does—and what it does not do'),
    p(
      'For an array of strings or references, Rule.unique() is often enough. For object arrays, Sanity performs a deep comparison while ignoring each item’s internal _key. Two objects with all the same authored values are duplicates.',
    ),
    code(
      'Unique primitive values',
      'typescript',
      'good',
      `defineField({
  name: 'aliases',
  type: 'array',
  of: [{type: 'string'}],
  validation: (Rule) => Rule.unique(),
})`,
    ),
    p(
      'That does not mean one property inside every object must be unique. Two field objects can share the same submissionKey but differ in label or required state; the full objects are different, so Rule.unique() may accept them. When one nested property defines identity, extract and compare that property yourself.',
    ),
    h2('Prevent duplicate nested values in an array'),
    p(
      'The most useful array validator does more than return a message at the top. It identifies every conflicting item so the Studio can mark the fields that need attention. Stable _key values make those paths resilient when an editor reorders the array.',
    ),
    code(
      'schemas/form.ts',
      'typescript',
      'good',
      `type FormField = {
  _key: string
  submissionKey?: string
}

validation: (Rule) =>
  Rule.custom((fields: FormField[] = []) => {
    const counts = new Map<string, number>()

    for (const field of fields) {
      if (!field.submissionKey) continue
      counts.set(
        field.submissionKey,
        (counts.get(field.submissionKey) ?? 0) + 1,
      )
    }

    const duplicatePaths = fields
      .filter(
        (field) =>
          field.submissionKey &&
          (counts.get(field.submissionKey) ?? 0) > 1,
      )
      .map((field) => [{_key: field._key}, 'submissionKey'])

    return duplicatePaths.length === 0
      ? true
      : {
          message: 'Every field must resolve to a unique submission key.',
          paths: duplicatePaths,
        }
  })`,
    ),
    callout(
      'warning',
      'Normalize before comparing when the contract is case-insensitive',
      'If Email, email, and email with trailing whitespace should be considered the same key, normalize with trim() and toLowerCase() during validation. Apply the same normalization when data is written; a validator and storage layer that disagree will create confusing failures.',
    ),
    h2('Use document-level validation for relationships'),
    p(
      'Document-level validation is useful when the rule spans multiple top-level fields. A scheduled report might require recipients only when reporting is enabled. A form may require at least one controlled identity field when a CRM integration is active. These are document invariants rather than input-format checks.',
    ),
    code(
      'schemas/form.ts',
      'typescript',
      'good',
      `export const form = defineType({
  name: 'form',
  type: 'document',
  validation: (Rule) =>
    Rule.custom((document) => {
      if (!document?.reporting?.enabled) return true

      return document.reporting.recipients?.length
        ? true
        : 'Add at least one recipient before enabling reporting.'
    }),
  fields: [/* ... */],
})`,
    ),
    p(
      'Prefer a field-level validator when it can express the same rule clearly. The closer the error appears to the field that needs changing, the faster an editor can recover.',
    ),
    h2('Enforce uniqueness across documents with async GROQ'),
    p(
      'Array validation cannot tell whether another controlledField document already owns the same submission key. For dataset-wide uniqueness, Rule.custom can obtain a Sanity client from the validation context and query for a conflicting document.',
    ),
    p(
      'The validator must exclude both identities of the document currently being edited: its published ID and its drafts-prefixed ID. Otherwise an existing document will report itself as a duplicate. It must also read uncached content so a recent edit is not hidden by CDN data.',
    ),
    code(
      'schemas/controlledField.ts',
      'typescript',
      'good',
      `defineField({
  name: 'submissionKey',
  type: 'string',
  validation: (Rule) =>
    Rule.required().custom(async (value, context) => {
      if (!value) return true

      const currentId = context.document?._id
      if (!currentId) return true

      const publishedId = currentId.replace(/^drafts\./, '')
      const draftId = \`drafts.\${publishedId}\`
      const client = context
        .getClient({apiVersion: '2026-08-08'})
        .withConfig({useCdn: false, perspective: 'drafts'})

      const conflict = await client.fetch<string | null>(
        \`*[
          _type == "controlledField" &&
          submissionKey == $value &&
          !(_id in [$publishedId, $draftId])
        ][0]._id\`,
        {value, publishedId, draftId},
      )

      return conflict
        ? \`The submission key “\${value}” is already in use.\`
        : true
    }),
})`,
    ),
    p(
      'Parameterize values instead of interpolating them into GROQ. Fetch only the first matching ID because the validator only needs to know whether a conflict exists. Narrow the query by document type, ownership scope, lifecycle state, or brand when uniqueness is not truly global.',
    ),
    h3('Choose the uniqueness boundary deliberately'),
    p(
      'A key can be globally unique, unique per brand, or unique only inside a form. Those policies are not interchangeable. If custom keys are namespaced by brand, the dataset query should compare both brand and key. If controlled fields intentionally reuse one canonical definition through references, uniqueness belongs in the registry—not in every form document.',
    ),
    code(
      'Scoped uniqueness query',
      'groq',
      'neutral',
      `*[
  _type == "brandField" &&
  brand._ref == $brandId &&
  submissionKey == $value &&
  !(_id in [$publishedId, $draftId])
][0]._id`,
    ),
    h2('Resolve references before comparing their business values'),
    p(
      'A form array may contain references to field definitions rather than copied keys. Comparing reference IDs only prevents the exact same document from appearing twice. Two different field documents can still resolve to the same submissionKey. The validator must fetch the referenced definitions and compare their canonical values.',
    ),
    code(
      'Resolve referenced field contracts',
      'typescript',
      'good',
      `Rule.custom(async (fields = [], context) => {
  const ids = fields
    .map((field) => field.definition?._ref)
    .filter((id): id is string => Boolean(id))

  if (ids.length === 0) return true

  const client = context
    .getClient({apiVersion: '2026-08-08'})
    .withConfig({useCdn: false, perspective: 'drafts'})

  const definitions = await client.fetch(
    '*[_id in $ids]{_id, submissionKey, deprecated}',
    {ids},
  )

  if (definitions.some((field) => field.deprecated)) {
    return 'Replace deprecated field definitions before publishing.'
  }

  const keys = definitions.map((field) => field.submissionKey)
  const duplicate = keys.find(
    (value, index) => keys.indexOf(value) !== index,
  )

  return duplicate
    ? \`More than one field resolves to “\${duplicate}”.\`
    : true
})`,
    ),
    p(
      'This is a semantic check. It catches collisions that an array of unique references cannot see. For a large form, fetch every required definition in one query rather than issuing one request per field.',
    ),
    h2('Keep async validation responsive'),
    p(
      'Async validators participate in the editing experience, so query design matters. Avoid broad projections, request only the fields required for the decision, skip the query when the value is empty, and scope it as tightly as the business rule allows. Do not use the CDN for a uniqueness decision.',
    ),
    p(
      'A validation result is a snapshot, not a transactional uniqueness constraint. Two editors can theoretically validate the same new key before either publishes. If a collision would be operationally severe, derive deterministic document IDs from normalized keys or place the authoritative uniqueness constraint in a transactional system.',
    ),
    callout(
      'warning',
      'Validation is not a lock',
      'An async GROQ rule greatly improves editorial safety, but it cannot make a read-then-write sequence atomic. Design the underlying identity so concurrent creation cannot silently produce two authoritative records.',
    ),
    h2('Studio validation does not protect API mutations'),
    p(
      'This is the limitation most likely to cause a false sense of safety: schema validation runs in Sanity Studio. A script, migration, backend service, or direct client mutation can still write a document that violates those rules. TypeScript also cannot validate runtime data by itself.',
    ),
    p(
      'If content enters through more than the Studio, move the invariant into a reusable function and run it at every write boundary. A runtime schema can check local structure, while a server-side GROQ query can check dataset relationships before the mutation.',
    ),
    code(
      'scripts/write-controlled-field.ts',
      'typescript',
      'good',
      `import {z} from 'zod'

const controlledFieldSchema = z.object({
  _id: z.string(),
  _type: z.literal('controlledField'),
  name: z.string().min(1),
  submissionKey: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z][a-z0-9_]*$/),
  deprecated: z.boolean().optional(),
})

const document = controlledFieldSchema.parse(input)
await assertSubmissionKeyIsAvailable(client, document)
await client.createOrReplace(document)`,
    ),
    p(
      'Do not maintain two unrelated implementations if the rule is important. Extract normalization, duplicate detection, and domain checks into pure functions that both the Studio validator and server-side writer can call. Keep Sanity-specific querying in a thin adapter around those functions.',
    ),
    h2('Test the rule outside the Studio UI'),
    p(
      'Validation deserves the same edge-case testing as submission code. Test empty values, formatting boundaries, draft and published IDs, a document updating its own unchanged key, a genuine collision, case normalization, multiple duplicate array entries, broken references, and a failed dataset request.',
    ),
    code(
      'lib/find-duplicate-values.test.ts',
      'typescript',
      'good',
      `import {describe, expect, it} from 'vitest'
import {findDuplicateValues} from './find-duplicate-values'

describe('findDuplicateValues', () => {
  it('normalizes keys before comparing them', () => {
    expect(
      findDuplicateValues([' email ', 'first_name', 'EMAIL']),
    ).toEqual(['email'])
  })

  it('returns no duplicates for distinct keys', () => {
    expect(findDuplicateValues(['email', 'first_name'])).toEqual([])
  })
})`,
    ),
    p(
      'Run Sanity’s document validation tooling against existing content as part of an audit or deployment workflow. New rules frequently reveal historical documents that were valid under the old schema. Decide whether those findings should block deployment, trigger a migration, or remain warnings during a controlled transition.',
    ),
    h2('Errors, warnings, and migration windows'),
    p(
      'Use an error when publishing would break a contract or create ambiguous data. Use a warning when the content is still valid but should be improved. During a migration, a warning can expose legacy keys without freezing every editor; once the migration is complete, promote the same condition to an error.',
    ),
    code(
      'Validation severity',
      'typescript',
      'neutral',
      `validation: (Rule) => [
  Rule.required().error('A submission key is required.'),
  Rule.custom(checkLegacyKey)
    .warning('This legacy key should be replaced before the cutoff date.'),
]`,
    ),
    h2('Common mistakes to avoid'),
    p(
      'The most common mistakes are assuming Rule.unique() checks one nested property, querying only published content, forgetting to exclude the current draft and published IDs, using cached data for uniqueness, resolving references one request at a time, and returning vague errors that leave editors guessing.',
    ),
    p(
      'The deeper mistakes are architectural: treating Studio validation as a database constraint, allowing API writers to bypass the contract, and using an asynchronous read as if it were an atomic lock. Validation should make the correct action easy, but durable identity and server-side enforcement still matter.',
    ),
    h2('Production checklist'),
    code(
      'Before shipping a custom validator',
      'text',
      'neutral',
      `[ ] Use built-in rules for simple constraints
[ ] Define the exact uniqueness boundary
[ ] Normalize values consistently
[ ] Use paths for nested array errors
[ ] Include drafts in dataset checks
[ ] Exclude current draft and published IDs
[ ] Disable CDN reads for validation decisions
[ ] Batch reference resolution into one query
[ ] Return an actionable editor message
[ ] Revalidate API and migration writes
[ ] Test concurrent-authoring assumptions
[ ] Audit existing documents after adding the rule`,
    ),
    linkedP(
      'For a complete example of why these rules matter in a multi-brand form platform, see ',
      'Dynamic Form Schema Design: How to Keep Field Keys Consistent at Scale',
      'https://devfieldnotes.dev/guides/dynamic-form-schema-field-keys',
      '.',
    ),
    h2('The principle to keep'),
    p(
      'Sanity gives you several validation tools because not every invariant lives at the same level. Use built-in rules for local shape, custom functions for relationships inside a document, GROQ for dataset-aware feedback, and server-side checks for every write path outside the Studio.',
    ),
    callout(
      'tip',
      'Validation should explain the contract',
      'The best validator does more than reject content. It tells the editor what the system expects, points to the exact value that violates that expectation, and enforces the same rule everywhere the data can enter.',
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
