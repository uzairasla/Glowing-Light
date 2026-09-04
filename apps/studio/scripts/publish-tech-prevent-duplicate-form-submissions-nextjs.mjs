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
  apiVersion: '2026-08-17',
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

const articleId = 'tech-article-prevent-duplicate-form-submissions-nextjs'
const existingCoverRef = await client.fetch(
  `*[_id == $articleId][0].coverImage.asset._ref`,
  {articleId},
)
const coverPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../tech-blog/public/articles/prevent-duplicate-form-submissions-nextjs/cover.png',
)
const coverAsset = existingCoverRef
  ? {_id: existingCoverRef}
  : await client.assets.upload('image', createReadStream(coverPath), {
      filename: 'prevent-duplicate-form-submissions-nextjs.png',
      contentType: 'image/png',
    })

const article = {
  _id: articleId,
  _type: 'techArticle',
  title: 'How to Prevent Duplicate Form Submissions in Next.js with Idempotency Keys',
  slug: {_type: 'slug', current: 'prevent-duplicate-form-submissions-nextjs'},
  description:
    'A production-ready approach to preventing duplicate leads and side effects with stable idempotency keys, PostgreSQL constraints, transactional outbox events, safe retries, and reconciliation.',
  kicker: 'Reliable forms 003',
  readTime: '17 min',
  difficulty: 'Intermediate',
  publishedAt: '2026-08-17T20:00:00.000Z',
  updatedAt: '2026-08-17T20:00:00.000Z',
  coverImage: {
    _type: 'image',
    asset: {_type: 'reference', _ref: coverAsset._id},
    alt: 'Several duplicate form submissions converging through an idempotency gateway into one database record and one set of downstream integrations',
  },
  taxonomies: [
    {_key: 'nextjs', _type: 'reference', _ref: 'tech-taxonomy-nextjs'},
    {_key: 'postgresql', _type: 'reference', _ref: 'tech-taxonomy-postgresql'},
    {_key: 'guides', _type: 'reference', _ref: 'tech-taxonomy-guides'},
  ],
  seoTitle: 'Prevent Duplicate Form Submissions in Next.js',
  seoDescription:
    'Prevent duplicate Next.js form submissions with idempotency keys, PostgreSQL uniqueness, request fingerprints, transactional events, and retry-safe integrations.',
  sourceUrls: [
    {
      _key: 'src1',
      title: 'Next.js Forms Guide',
      url: 'https://nextjs.org/docs/pages/guides/forms',
    },
    {
      _key: 'src2',
      title: 'PostgreSQL INSERT and ON CONFLICT',
      url: 'https://www.postgresql.org/docs/current/sql-insert.html',
    },
    {
      _key: 'src3',
      title: 'MDN Crypto.randomUUID()',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID',
    },
    {
      _key: 'src4',
      title: 'Stripe Idempotent Requests',
      url: 'https://docs.stripe.com/api/idempotent_requests',
    },
    {
      _key: 'src5',
      title: 'Sentry Event Enrichment for Next.js',
      url: 'https://docs.sentry.io/platforms/javascript/guides/nextjs/enriching-events/',
    },
  ],
  body: [
    p(
      'A visitor fills out a form, presses Submit, and sees nothing happen. They press it again. The first request actually succeeded, but its response was delayed. The result can be two leads, two confirmation emails, two CRM updates, and two analytics events from one human action.',
    ),
    p(
      'This is easy to dismiss as a frontend problem, but duplicate submission is a distributed-systems problem in miniature. Browsers retry, mobile connections fail after the server has committed, serverless functions time out, queues redeliver work, and reconciliation jobs intentionally retry failures. The server cannot infer whether two matching requests represent one action or two deliberate actions unless the client gives both attempts the same identity.',
    ),
    callout(
      'tip',
      'The goal is one logical effect, not one HTTP request',
      'You cannot guarantee that a request arrives only once. You can make repeated delivery of the same logical request harmless. That property is idempotency.',
    ),
    h2('Why disabling the submit button is not enough'),
    p(
      'Disabling the button is still worthwhile. It improves the interface, stops impatient double-clicks, and tells the visitor that work is in progress. It does not protect the system from a refreshed page, a second browser tab, an automatic client retry, a proxy retry, a function timeout after commit, or a worker processing the same event twice.',
    ),
    p(
      'The browser guard and the server guarantee solve different problems. Use both, but treat the database guarantee as the source of truth. Anything that depends only on React state disappears when the page reloads and can be bypassed by any direct API client.',
    ),
    h2('The idempotency contract'),
    p(
      'For every logical submission, the client generates one unpredictable key. Every retry of that submission reuses the key. A genuinely new submission gets a new key. The server scopes the key to the form, stores it with the accepted request, and places a unique constraint on that pair.',
    ),
    p(
      'The server also stores a fingerprint of the normalized request. If the same key arrives with the same fingerprint, it returns the existing receipt. If the same key arrives with different data, it returns a conflict instead of silently treating changed input as the original submission.',
    ),
    code(
      'The contract',
      'text',
      'neutral',
      `New logical submission
  -> new idempotency key

Retry after timeout or network failure
  -> same idempotency key + same payload
  -> return the existing submission receipt

Same key + different payload
  -> 409 Idempotency Conflict

Confirmed success followed by another submission
  -> new idempotency key`,
    ),
    h2('Generate the key once in the browser'),
    p(
      'Generate the key when the submission attempt begins, not on every fetch call. Keep it while the result is uncertain. Clear it only after the server confirms acceptance, or when the user deliberately starts a new logical submission.',
    ),
    code(
      'components/LeadForm.tsx',
      'tsx',
      'good',
      `'use client'

import {useRef, useState} from 'react'

export function LeadForm({formId}: {formId: string}) {
  const activeKey = useRef<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit(payload: Record<string, unknown>) {
    const idempotencyKey = activeKey.current ?? crypto.randomUUID()
    activeKey.current = idempotencyKey
    setSubmitting(true)

    try {
      const response = await fetch(\`/api/forms/\${formId}/submit\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      })

      if (response.status === 409) {
        activeKey.current = null
        throw new Error('This submission changed while it was being retried.')
      }

      if (!response.ok) throw new Error('Submission failed')

      const receipt = await response.json()
      activeKey.current = null
      return receipt
    } finally {
      setSubmitting(false)
    }
  }

  // Render fields and pass submitting to the button.
}`,
    ),
    callout(
      'warning',
      'Do not replace the key after a network error',
      'A network error means the client does not know whether the server committed. Retrying with a new key is exactly how one accepted request becomes two submissions.',
    ),
    p(
      'For an ordinary form, keeping the key in component state is enough for automatic retries during that page session. If the product must recover an unfinished submission after a reload, persist the key with the draft in sessionStorage or local storage and expire it deliberately. Never reuse one permanent key for every submission from a visitor.',
    ),
    h2('Make PostgreSQL enforce the guarantee'),
    p(
      'Application-level checks are vulnerable to races. Two requests can both query for a key, both see no row, and both insert. A unique database constraint turns the rule into an atomic guarantee even when the requests run concurrently on different serverless instances.',
    ),
    code(
      'db/form-submissions.sql',
      'sql',
      'good',
      `CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL,
  schema_version integer NOT NULL,
  idempotency_key text NOT NULL,
  request_hash text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'accepted',
  response_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (form_id, idempotency_key)
);

CREATE TABLE integration_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES form_submissions(id),
  integration_id uuid NOT NULL,
  delivery_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  attempt_count integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  lease_expires_at timestamptz,
  last_error_code text,
  UNIQUE (submission_id, integration_id)
);`,
    ),
    p(
      'Scope the unique key according to the business operation. For a form platform, form_id plus idempotency_key is normally appropriate. If one endpoint performs several named operations, include an operation type as well. Do not rely on a global key unless every client and tenant truly shares the same namespace.',
    ),
    h2('Fingerprint the request before storing it'),
    p(
      'The fingerprint protects the meaning of the key. Hash the validated and normalized payload along with server-known context such as the form ID and schema version. Canonical JSON matters because object key order should not change the fingerprint.',
    ),
    code(
      'lib/forms/request-fingerprint.ts',
      'typescript',
      'good',
      `import {createHash} from 'node:crypto'

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return \`[\${value.map(canonicalJson).join(',')}]\`
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => \`\${JSON.stringify(key)}:\${canonicalJson(item)}\`)
    return \`{\${entries.join(',')}}\`
  }

  return JSON.stringify(value)
}

export function fingerprintSubmission(input: {
  formId: string
  schemaVersion: number
  payload: Record<string, unknown>
}) {
  return createHash('sha256')
    .update(canonicalJson(input))
    .digest('hex')
}`,
    ),
    p(
      'Build this value after validation and normalization. For example, trim an email address or normalize a phone number first if that is part of the form contract. Exclude volatile metadata such as the request timestamp, trace ID, and retry count, because those values naturally change between attempts.',
    ),
    h2('Accept the submission and its events in one transaction'),
    p(
      'Persisting only the submission is not enough if another crash can prevent its integrations from ever being scheduled. Store the submission and its durable integration events in one PostgreSQL transaction. This is the transactional outbox pattern applied to a form system.',
    ),
    code(
      'lib/forms/accept-submission.ts',
      'typescript',
      'good',
      `import type {Pool} from 'pg'

export async function acceptSubmission(db: Pool, input: AcceptedInput) {
  const connection = await db.connect()

  try {
    await connection.query('BEGIN')

    const inserted = await connection.query(
      \`INSERT INTO form_submissions
         (form_id, schema_version, idempotency_key, request_hash, payload)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       ON CONFLICT (form_id, idempotency_key) DO NOTHING
       RETURNING id, request_hash, response_json\`,
      [input.formId, input.schemaVersion, input.key,
       input.requestHash, JSON.stringify(input.payload)],
    )

    if (inserted.rowCount === 0) {
      const existing = await connection.query(
        \`SELECT id, request_hash, response_json
           FROM form_submissions
          WHERE form_id = $1 AND idempotency_key = $2\`,
        [input.formId, input.key],
      )

      if (existing.rows[0].request_hash !== input.requestHash) {
        throw new IdempotencyConflictError()
      }

      await connection.query('COMMIT')
      return {...existing.rows[0].response_json, replayed: true}
    }

    const submissionId = inserted.rows[0].id

    await connection.query(
      \`INSERT INTO integration_events
         (submission_id, integration_id, delivery_key)
       SELECT $1, integration_id, $1 || ':' || integration_id
         FROM form_integrations
        WHERE form_id = $2 AND enabled = true
       ON CONFLICT (submission_id, integration_id) DO NOTHING\`,
      [submissionId, input.formId],
    )

    const receipt = {submissionId, accepted: true}
    await connection.query(
      'UPDATE form_submissions SET response_json = $2 WHERE id = $1',
      [submissionId, receipt],
    )

    await connection.query('COMMIT')
    return {...receipt, replayed: false}
  } catch (error) {
    await connection.query('ROLLBACK')
    throw error
  } finally {
    connection.release()
  }
}`,
    ),
    p(
      'INSERT ... ON CONFLICT is important here. A preliminary SELECT followed by INSERT is still a race unless you add locking or let the unique constraint decide the winner. PostgreSQL can make one concurrent request insert while the other receives no returned row and reads the committed result.',
    ),
    p(
      'Saving response_json lets a replay return the original business result, including the same submission ID. Avoid placing raw personal data in this receipt. A stable opaque identifier and acceptance status are normally enough.',
    ),
    h2('Use the contract in a Next.js route handler'),
    code(
      'app/api/forms/[formId]/submit/route.ts',
      'typescript',
      'good',
      `import {z} from 'zod'
import {fingerprintSubmission} from '@/lib/forms/request-fingerprint'

const keySchema = z.string().uuid()

export async function POST(
  request: Request,
  {params}: {params: Promise<{formId: string}>},
) {
  const {formId} = await params
  const parsedKey = keySchema.safeParse(
    request.headers.get('Idempotency-Key'),
  )

  if (!parsedKey.success) {
    return Response.json(
      {error: 'A valid Idempotency-Key header is required'},
      {status: 400},
    )
  }

  const form = await getPublishedForm(formId)
  if (!form) return new Response('Not found', {status: 404})

  const rawPayload = await request.json()
  const validated = validateSubmission(form, rawPayload)
  if (!validated.ok) {
    return Response.json({issues: validated.issues}, {status: 422})
  }

  const requestHash = fingerprintSubmission({
    formId,
    schemaVersion: form.version,
    payload: validated.data,
  })

  try {
    const receipt = await acceptSubmission(db, {
      formId,
      schemaVersion: form.version,
      key: parsedKey.data,
      requestHash,
      payload: validated.data,
    })

    return Response.json(receipt, {status: receipt.replayed ? 200 : 202})
  } catch (error) {
    if (error instanceof IdempotencyConflictError) {
      return Response.json(
        {error: 'The idempotency key was already used with different data'},
        {status: 409},
      )
    }
    throw error
  }
}`,
    ),
    p(
      'Perform authentication, form lookup, payload validation, consent validation, and authorization before inserting the idempotency record. Invalid requests should not reserve keys. Rate limiting and bot protection still belong in this route; idempotency prevents accidental duplicate effects, not malicious submissions.',
    ),
    h2('Carry idempotency into every integration'),
    p(
      'Deduplicating the submission row solves only half the problem. The CRM, email, SMS, analytics, and webhook consumers can also be invoked more than once. Give every submission-integration pair a stable delivery_key and make the worker treat completed work as success.',
    ),
    p(
      'When the provider supports idempotency keys, pass delivery_key through. When it does not, use a stable external identifier or a provider-side upsert where possible. A local completed flag alone cannot create an exactly-once guarantee: the process can crash after the provider succeeds but before the local row is marked completed.',
    ),
    code(
      'lib/integrations/deliver-event.ts',
      'typescript',
      'good',
      `export async function deliverEvent(eventId: string) {
  const event = await claimEventWithLease(eventId)
  if (!event || event.status === 'completed') return

  const adapter = integrationRegistry[event.integrationType]

  try {
    const result = await adapter.execute({
      payload: event.payload,
      idempotencyKey: event.deliveryKey,
      externalReference: event.deliveryKey,
    })

    await markCompleted(event.id, result.providerRequestId)
  } catch (error) {
    await scheduleRetry(event.id, {
      errorCode: normalizeProviderError(error),
      nextAttemptAt: calculateBackoff(event.attemptCount + 1),
    })
    throw error
  }
}`,
    ),
    callout(
      'warning',
      'Be honest about providers without deduplication',
      'If an external API offers neither idempotency nor an upsertable external reference, exactly-once delivery across a network boundary is impossible. Record that limitation, minimize the uncertainty window, and give operators tools to inspect ambiguous attempts before replaying them.',
    ),
    linkedP(
      'This event model fits naturally with the ',
      'integration, reporting, Sentry, and reconciliation architecture',
      'https://devfieldnotes.dev/guides/form-integration-reporting-layer-nextjs',
      ' described in the earlier form-platform guide. Idempotency is the invariant that makes its automatic retries safe.',
    ),
    h2('Use leases and a reconciler for abandoned work'),
    p(
      'A worker should claim an event atomically and give that claim an expiry time. If the worker disappears, a reconciler can reclaim the event after the lease expires. A lease prevents overlapping workers from doing the same work at the same moment; the delivery key protects against a replay after uncertainty. You need both.',
    ),
    code(
      'Claim the next event',
      'sql',
      'good',
      `WITH candidate AS (
  SELECT id
    FROM integration_events
   WHERE (
     status IN ('pending', 'retryable')
     AND next_attempt_at <= now()
   ) OR (
     status = 'processing'
     AND lease_expires_at < now()
   )
   ORDER BY next_attempt_at
   FOR UPDATE SKIP LOCKED
   LIMIT 1
)
UPDATE integration_events AS event
   SET status = 'processing',
       attempt_count = attempt_count + 1,
       lease_expires_at = now() + interval '2 minutes'
  FROM candidate
 WHERE event.id = candidate.id
RETURNING event.*;`,
    ),
    p(
      'Run the reconciler on a schedule and cap each batch. Retry transient timeouts and rate limits with exponential backoff and jitter. Send invalid credentials, broken mappings, and exhausted attempts to a dead state that requires investigation rather than retrying forever.',
    ),
    h2('Add observability without leaking form data'),
    p(
      'You need to distinguish a replay from a second legitimate submission when debugging. Log the idempotency key only if your security policy allows it; a one-way hash or shortened correlation value is often enough. Always include the form ID, submission ID, event ID, delivery attempt, request fingerprint, and provider request ID.',
    ),
    code(
      'lib/forms/capture-submission-error.ts',
      'typescript',
      'good',
      `Sentry.withScope((scope) => {
  scope.setTag('forms.operation', 'accept_submission')
  scope.setTag('forms.replayed', String(context.replayed))
  scope.setContext('submission', {
    formId: context.formId,
    schemaVersion: context.schemaVersion,
    submissionId: context.submissionId,
    keyFingerprint: context.keyFingerprint,
    requestHash: context.requestHash,
    integrationEventId: context.integrationEventId,
    attemptCount: context.attemptCount,
  })
  Sentry.captureException(error)
})`,
    ),
    p(
      'Do not attach the entire payload to an error event. Form data often contains email addresses, phone numbers, free text, and consent information. Stable identifiers give you enough context to retrieve the authorized record from your own system without copying personal data into every monitoring event.',
    ),
    h2('Decide how long keys remain valid'),
    p(
      'Idempotency needs an explicit retention policy. Payment APIs often define a limited replay window, but lead forms may benefit from retaining keys as long as their submissions exist. Deleting a key allows a late retry to create a duplicate. Keeping every key forever increases storage and can prevent intentional reuse by a buggy client.',
    ),
    p(
      'Document the window, store created_at, and archive or partition old records if volume requires it. If keys expire, a request arriving after expiry is a new operation by definition. That is a business decision rather than a technical detail.',
    ),
    h2('Test the failure cases, not only the happy path'),
    p(
      'A sequential unit test does not prove idempotency. The most valuable test fires several identical requests concurrently and asserts that the database contains one submission and one event per configured integration. Then test the uncertain states that caused the feature to exist.',
    ),
    code(
      'tests/form-idempotency.test.ts',
      'typescript',
      'good',
      `it('accepts concurrent retries only once', async () => {
  const key = crypto.randomUUID()
  const attempts = await Promise.all(
    Array.from({length: 10}, () =>
      submitForm({key, payload: validLead}),
    ),
  )

  expect(new Set(attempts.map((item) => item.submissionId)).size).toBe(1)
  expect(await countSubmissions({formId, key})).toBe(1)
  expect(await countEventsForSubmission(attempts[0].submissionId))
    .toBe(enabledIntegrations.length)
})

it('rejects the same key with different data', async () => {
  const key = crypto.randomUUID()
  await submitForm({key, payload: validLead})

  await expect(
    submitForm({key, payload: {...validLead, email: 'other@example.com'}}),
  ).rejects.toMatchObject({status: 409})
})`,
    ),
    p(
      'Also test a lost response after commit, a worker crash after provider success, two reconcilers running together, an expired lease, a retryable provider error, a permanent provider error, and a schema version change between the initial attempt and its retry.',
    ),
    h2('Common implementation mistakes'),
    h3('Generating a new key inside the retry function'),
    p(
      'This makes every retry look like a new operation. Create the key at the logical-action boundary and pass it through every lower layer unchanged.',
    ),
    h3('Checking for an existing row without a unique constraint'),
    p(
      'This works in local testing and fails under concurrency. Let PostgreSQL enforce uniqueness and treat the conflict as a normal branch of the request lifecycle.',
    ),
    h3('Reusing a key without comparing the payload'),
    p(
      'Returning the old response for changed data hides a client bug and can mislead the visitor. Store a request fingerprint and return 409 when the meaning of an existing key changes.',
    ),
    h3('Deduplicating the lead but not its side effects'),
    p(
      'One submission can still produce duplicate emails and CRM records if the event workers lack their own stable delivery identities. Idempotency must continue to the last external boundary.',
    ),
    h3('Treating idempotency as spam protection'),
    p(
      'A bot can generate a fresh UUID for every request. Keep rate limits, honeypots, CAPTCHA or risk scoring, validation, and abuse monitoring separate from duplicate-request handling.',
    ),
    linkedP(
      'Stable field identifiers also matter before any of this code runs. If payload keys drift between brands, request validation and integration mappings become unreliable. The companion guide on ',
      'managing dynamic form schema field keys',
      'https://devfieldnotes.dev/guides/dynamic-form-schema-field-keys',
      ' explains how to keep that contract controlled at scale.',
    ),
    h2('The production checklist'),
    code(
      'Idempotent form checklist',
      'text',
      'neutral',
      `[ ] Disable the submit button for clear user feedback
[ ] Generate one random key per logical submission
[ ] Reuse that key after timeouts and network errors
[ ] Validate the key and payload on the server
[ ] Fingerprint normalized input
[ ] Enforce UNIQUE(form_id, idempotency_key) in PostgreSQL
[ ] Return the original receipt for a matching replay
[ ] Return 409 when the same key carries different data
[ ] Store submission and integration events in one transaction
[ ] Give every downstream event a stable delivery key
[ ] Use provider idempotency or external references when available
[ ] Claim work with expiring leases
[ ] Reconcile abandoned and retryable events
[ ] Test concurrent requests and crash windows
[ ] Log identifiers and sanitized context, not raw personal data
[ ] Define and document the key-retention window`,
    ),
    h2('The result'),
    p(
      'The reliable version of a form is not one that never receives a duplicate request. It is one that can receive the same request repeatedly and still produce one submission, one durable set of integration events, and one explainable outcome.',
    ),
    p(
      'A disabled button makes the interface feel responsive. A stable idempotency key gives retries an identity. A PostgreSQL constraint resolves concurrency. A request fingerprint protects that identity from accidental reuse. Transactional events, provider-level delivery keys, leases, and reconciliation carry the guarantee through the rest of the system.',
    ),
    callout(
      'tip',
      'Design for uncertain success',
      'The hardest failure is not a clear error. It is a success whose response was lost. If retrying that operation is safe, the form platform is ready for production traffic.',
    ),
  ],
}

const result = await client.createOrReplace(article)
console.log(
  JSON.stringify(
    {
      published: {_id: result._id, _type: result._type, slug: article.slug.current},
      coverAsset: coverAsset._id,
      blocks: article.body.length,
    },
    null,
    2,
  ),
)
