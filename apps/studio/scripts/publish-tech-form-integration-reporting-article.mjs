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
  apiVersion: '2026-07-30',
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

const articleId = 'tech-article-form-integration-reporting-layer'
const existingCoverRef = await client.fetch(
  `*[_id == $articleId][0].coverImage.asset._ref`,
  {articleId},
)
const coverPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../tech-blog/public/articles/form-integration-reporting-layer/cover.png',
)
const coverAsset = existingCoverRef
  ? {_id: existingCoverRef}
  : await client.assets.upload('image', createReadStream(coverPath), {
      filename: 'form-integration-reporting-layer.png',
      contentType: 'image/png',
    })

const article = {
  _id: articleId,
  _type: 'techArticle',
  title: 'How I modernized a legacy form system with integrations and reporting.',
  slug: {_type: 'slug', current: 'form-integration-reporting-layer-nextjs'},
  description:
    'A practical architecture for turning forms into a reliable platform with allowlisted integrations, scheduled reports, schema validation, Sentry context, replayable failures, and reconciliation jobs.',
  kicker: 'Architecture field guide 001',
  readTime: '18 min',
  difficulty: 'Intermediate',
  publishedAt: '2026-07-30T12:00:00.000Z',
  updatedAt: '2026-07-30T12:00:00.000Z',
  coverImage: {
    _type: 'image',
    asset: {_type: 'reference', _ref: coverAsset._id},
    alt: 'A form submission flowing through a validation shield into modular integrations, scheduled reports, error monitoring, and a reconciliation loop',
  },
  taxonomies: [
    {_key: 'nextjs', _type: 'reference', _ref: 'tech-taxonomy-nextjs'},
    {_key: 'debugging', _type: 'reference', _ref: 'tech-taxonomy-debugging'},
    {_key: 'guides', _type: 'reference', _ref: 'tech-taxonomy-guides'},
  ],
  seoTitle: 'Build a Reliable Form Integration and Reporting Layer',
  seoDescription:
    'Modernize a legacy Next.js form platform with typed integrations, validation, scheduled reports, Sentry diagnostics, replayable events, and reconciliation jobs.',
  sourceUrls: [
    {
      _key: 'src1',
      title: 'Vercel Cron Jobs',
      url: 'https://vercel.com/docs/cron-jobs',
    },
    {
      _key: 'src2',
      title: 'Managing Vercel Cron Jobs',
      url: 'https://vercel.com/docs/cron-jobs/manage-cron-jobs',
    },
    {
      _key: 'src3',
      title: 'Zod basic usage',
      url: 'https://zod.dev/basics',
    },
    {
      _key: 'src4',
      title: 'Sentry event enrichment',
      url: 'https://docs.sentry.io/platforms/javascript/enriching-events/',
    },
  ],
  body: [
    p(
      'A form system that only accepts fields and stores rows is becoming less useful by the day. Modern teams expect a submission to update analytics, create a contact, record consent, notify somebody, and produce reports without requiring a new deployment for every form.',
    ),
    p(
      'I ran into that problem while taking over an older form platform. Adding another one-off callback to every form would have made the system harder to trust and almost impossible to scale. I needed the new offering to be more robust than the system it replaced, so I started by separating form collection from everything that happens after submission.',
    ),
    callout(
      'tip',
      'The form is the producer, not the workflow',
      'A form should validate and persist a submission. Integrations, reports, alerts, and retries are downstream consumers. Keeping that boundary clear made every later capability easier to add.',
    ),
    h2('The integration layer'),
    p(
      'In plain terms, the integration layer is configuration that can be built once and attached to any form. The form schema contains a list of supported integration instances. Each instance declares a known type, its required configuration, field mappings, and optional conditions.',
    ),
    p(
      'I deliberately avoided a generic “send this payload to any URL” feature. Arbitrary endpoints turn the platform into an uncontrolled proxy: they can leak submission data, reach internal services, produce unpredictable responses, and make authentication, retries, and support impossible to standardize. An allowlisted adapter registry provides extension without giving up control.',
    ),
    code(
      'lib/integrations/registry.ts',
      'typescript',
      'good',
      `export const integrationRegistry = {
  analyticsEvent: sendAnalyticsEvent,
  hubspotContact: syncHubspotContact,
  smsSubscription: subscribeSmsContact,
  internalNotification: sendInternalNotification,
} as const

export type IntegrationType = keyof typeof integrationRegistry`,
    ),
    h3('Give every integration a contract'),
    p(
      'Each adapter needs different information. An analytics event needs an event name. A CRM contact needs field mappings. An SMS subscription needs a phone field and explicit consent evidence. A discriminated schema keeps those requirements close to the integration type instead of spreading conditional checks across the executor.',
    ),
    code(
      'lib/integrations/schema.ts',
      'typescript',
      'good',
      `import {z} from 'zod'

const fieldMap = z.record(z.string(), z.string().min(1))

export const integrationSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().uuid(),
    type: z.literal('analyticsEvent'),
    eventName: z.string().min(1).max(80),
    fieldMappings: fieldMap.default({}),
    enabled: z.boolean().default(true),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('hubspotContact'),
    connectionId: z.string().uuid(),
    fieldMappings: fieldMap,
    enabled: z.boolean().default(true),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('smsSubscription'),
    connectionId: z.string().uuid(),
    phoneField: z.string().min(1),
    consentField: z.string().min(1),
    listId: z.string().min(1),
    enabled: z.boolean().default(true),
  }),
])`,
    ),
    p(
      'The configuration stores a connection reference, never the provider secret itself. Credentials remain server-side in a secrets store. Field mappings allow one adapter to work with forms that call the same value email, contact_email, or workEmail without hard-coding those names into provider code.',
    ),
    h3('Harden the boundary with validation'),
    p(
      'Static TypeScript types disappear at runtime, while form configuration, stored submissions, cron invocations, and provider responses all arrive as untrusted data. I validate at every boundary: when an administrator saves a form, when a visitor submits it, immediately before an event is executed, and when an external API responds.',
    ),
    code(
      'lib/integrations/validate.ts',
      'typescript',
      'good',
      `const parsed = integrationSchema.safeParse(rawIntegration)

if (!parsed.success) {
  return {
    ok: false,
    code: 'INVALID_INTEGRATION_CONFIG',
    issues: parsed.error.issues.map(({path, message}) => ({path, message})),
  }
}

const integration = parsed.data`,
    ),
    p(
      'The save-time validator should also verify that every mapped field exists on the selected form, required consent fields are boolean or equivalent, conditions reference valid fields, and the connection belongs to the same account. Rejecting an impossible configuration before publication is cheaper than discovering it during a live submission.',
    ),
    h3('Persist the submission before calling providers'),
    p(
      'The visitor should not wait while several external APIs respond. The request validates the submission, saves it, creates durable integration events, and returns success. Workers process those events independently. A temporary HubSpot or messaging outage must not make the visitor believe the form was lost.',
    ),
    code(
      'app/api/forms/[formId]/submit/route.ts',
      'typescript',
      'good',
      `const submission = await db.transaction(async (tx) => {
  const saved = await tx.submission.create({
    data: {formId, payload: validatedSubmission},
  })

  await tx.integrationEvent.createMany({
    data: activeIntegrations.map((integration) => ({
      submissionId: saved.id,
      integrationId: integration.id,
      integrationType: integration.type,
      status: 'pending',
      attemptCount: 0,
      nextAttemptAt: new Date(),
      idempotencyKey: \`\${saved.id}:\${integration.id}\`,
      configVersion: form.version,
    })),
  })

  return saved
})

return Response.json({submissionId: submission.id}, {status: 202})`,
    ),
    callout(
      'warning',
      'Make every side effect idempotent',
      'A queue, cron invocation, function timeout, or manual replay can deliver the same work twice. Use a stable idempotency key and treat an already completed event as success. Never assume exactly-once execution.',
    ),
    h3('Conditional behavior belongs in configuration'),
    p(
      'Once integrations are data rather than embedded callbacks, conditions become possible. An SMS adapter can run only when the visitor explicitly selects SMS and checks the consent field. A sales notification can run only for qualified leads. Keep the operator set small and typed rather than evaluating arbitrary JavaScript.',
    ),
    code(
      'Conditional integration',
      'json',
      'neutral',
      `{
  "when": {
    "field": "contactPreference",
    "operator": "equals",
    "value": "sms"
  },
  "integrationId": "sms-opt-in"
}`,
    ),
    h2('The reporting layer'),
    p(
      'The second capability I added was scheduled reporting. A form can declare report recipients, an email subject, and a frequency. A Vercel Cron Job invokes one secured route, and that route finds reports that are due, gathers submissions since each report’s last successful cutoff, and emails a bounded summary or attachment.',
    ),
    code(
      'lib/reports/schema.ts',
      'typescript',
      'good',
      `export const reportSchema = z.object({
  enabled: z.boolean(),
  recipients: z.array(z.string().email()).min(1).max(20),
  subject: z.string().min(1).max(140),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  timezone: z.string().min(1),
  lastCompletedAt: z.coerce.date().nullable(),
})`,
    ),
    p(
      'The cutoff is as important as the schedule. A report should cover a stored interval such as [lastCompletedAt, reportUntil), then advance lastCompletedAt only after the email provider confirms success. That makes a failed run replayable without silently skipping leads.',
    ),
    code(
      'vercel.json',
      'json',
      'neutral',
      `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron/form-reports",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/reconcile-integrations",
      "schedule": "*/10 * * * *"
    }
  ]
}`,
    ),
    p(
      'Vercel schedules use UTC, so the route calculates which reports are due in their configured time zones. I also validate the Authorization header against CRON_SECRET. A cron route is still a production endpoint and should not be triggerable by any visitor who discovers its URL.',
    ),
    code(
      'app/api/cron/form-reports/route.ts',
      'typescript',
      'good',
      `export async function GET(request: Request) {
  if (request.headers.get('authorization') !==
      \`Bearer \${process.env.CRON_SECRET}\`) {
    return new Response('Unauthorized', {status: 401})
  }

  const dueReports = await findDueReports(new Date())
  const results = await processInBoundedBatches(dueReports, 10, sendReport)

  return Response.json({processed: results.length})
}`,
    ),
    p(
      'Avoid loading every lead for every form into one function invocation. Page through due reports, bound concurrency, stream or generate manageable attachments, and respect the function duration. The reporting job should record its own run, interval, recipient set, provider message ID, result, and failure reason.',
    ),
    h2('Make failures explainable with Sentry'),
    p(
      'Retries are useful only when you can tell why an event failed. I added Sentry around the boundaries where errors have meaning: configuration validation, condition evaluation, field mapping, provider authentication, provider requests, report generation, email delivery, and reconciliation.',
    ),
    p(
      'A stack trace alone is not enough. The event needs identifiers that let an operator find the durable record and replay it: form ID, submission ID, integration event ID, integration type, configuration version, attempt number, provider request ID, and deployment environment.',
    ),
    code(
      'lib/integrations/execute.ts',
      'typescript',
      'good',
      `import * as Sentry from '@sentry/nextjs'

try {
  await adapter.execute({submission, integration, idempotencyKey})
  await markCompleted(event.id)
} catch (error) {
  Sentry.withScope((scope) => {
    scope.setTag('integration.type', event.integrationType)
    scope.setTag('integration.status', 'failed')
    scope.setContext('integration_event', {
      eventId: event.id,
      formId: submission.formId,
      submissionId: submission.id,
      integrationId: event.integrationId,
      configVersion: event.configVersion,
      attemptCount: event.attemptCount + 1,
      providerRequestId: getProviderRequestId(error),
    })
    Sentry.captureException(error)
  })

  await markFailedWithBackoff(event.id, error)
}`,
    ),
    callout(
      'warning',
      'Context does not mean copying the submission',
      'Do not send raw form payloads, access tokens, phone numbers, or email addresses to Sentry by default. Attach stable IDs and sanitized provider metadata, then retrieve authorized data from your own system during investigation.',
    ),
    h2('Build replay into the event model'),
    p(
      'A failed event should contain enough durable information to run again after the underlying problem is fixed. I store a reference to the immutable submission, the integration ID and type, the configuration version used, an idempotency key, attempt timestamps, a normalized error code, and the next eligible attempt time.',
    ),
    p(
      'Versioning matters because an administrator may edit a form after the failure. Replaying against today’s mapping can send different data to a different destination. Either retain an immutable configuration snapshot with secrets excluded, or store a configuration version that the executor can resolve.',
    ),
    code(
      'Integration event state',
      'typescript',
      'neutral',
      `type IntegrationEventStatus =
  | 'pending'
  | 'processing'
  | 'retryable'
  | 'completed'
  | 'dead'

type IntegrationEvent = {
  id: string
  submissionId: string
  integrationId: string
  configVersion: number
  idempotencyKey: string
  status: IntegrationEventStatus
  attemptCount: number
  nextAttemptAt: Date
  lastErrorCode?: string
  lastProviderRequestId?: string
}`,
    ),
    h2('Use a reconciler for work that fell through the cracks'),
    p(
      'The normal executor handles the happy path and immediate failures. A separate reconciliation cron is the safety net. It looks for pending events that were never picked up, retryable events whose backoff has elapsed, and processing events whose lease expired after a timeout or deployment interruption.',
    ),
    code(
      'app/api/cron/reconcile-integrations/route.ts',
      'typescript',
      'good',
      `const candidates = await db.integrationEvent.findMany({
  where: {
    OR: [
      {status: 'pending', nextAttemptAt: {lte: now}},
      {status: 'retryable', nextAttemptAt: {lte: now}},
      {status: 'processing', leaseExpiresAt: {lt: now}},
    ],
    attemptCount: {lt: MAX_ATTEMPTS},
  },
  orderBy: {nextAttemptAt: 'asc'},
  take: 100,
})

for (const event of candidates) {
  if (await acquireLease(event.id)) {
    await executeIntegrationEvent(event.id)
  }
}`,
    ),
    p(
      'Acquiring a lease must be atomic so overlapping cron invocations do not process the same row concurrently. Exponential backoff prevents an unhealthy provider from being hammered. After the maximum attempt count, move the event to dead, alert with context, and require a deliberate replay after the cause is understood.',
    ),
    p(
      'This reconciler is necessary on Vercel because a failed cron invocation is not automatically retried, cron events can occasionally be delivered more than once, and a new run can overlap a slow previous run. Locks and idempotency address different failure modes; a reliable system needs both.',
    ),
    h2('The architecture after the refactor'),
    code(
      'Submission lifecycle',
      'text',
      'neutral',
      `Browser
  -> validate submission
  -> store submission + integration events atomically
  -> return success

Executor
  -> claim event
  -> validate versioned configuration
  -> evaluate conditions and map fields
  -> call allowlisted adapter with idempotency key
  -> complete or schedule retry

Scheduled jobs
  -> send due form reports
  -> reconcile abandoned and retryable events

Observability
  -> Sentry IDs and sanitized context
  -> provider request IDs
  -> durable event and report-run history`,
    ),
    h2('What made the system trustworthy'),
    p(
      'The useful part was not adding one analytics call or one CRM connector. It was creating a controlled extension point. New integrations now enter through a registry, declare a schema, reuse the same event lifecycle, emit the same operational context, and inherit retry and reconciliation behavior.',
    ),
    p(
      'The reporting layer follows the same principle. Schedules are configuration, but execution is centralized, secured, observable, bounded, and replayable. Schema validation stops impossible setups early. Sentry tells us which durable record failed without copying sensitive payloads. Reconciliation turns transient provider and serverless failures into recoverable states instead of missing leads.',
    ),
    callout(
      'tip',
      'The real superpower is recoverability',
      'A feature is not production-ready because it succeeds once. It is production-ready when invalid configuration is rejected, duplicate work is harmless, failures are diagnosable, and an operator can replay the exact event safely.',
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
