import {
  URLS,
  bullet,
  callout,
  code,
  h2,
  h3,
  linkedP,
  p,
  publishTechArticle,
  ref,
  series,
  source,
} from './tech-hubspot-series-helpers.mjs'

const article = {
  _id: 'tech-article-reliable-hubspot-sync-transactional-outbox-qstash',
  _type: 'techArticle',
  title: 'Reliable HubSpot Sync with a Transactional Outbox and QStash',
  slug: {_type: 'slug', current: 'reliable-hubspot-sync-transactional-outbox-qstash'},
  description:
    'Build a retry-safe HubSpot synchronization pipeline with atomic outbox events, signed QStash workers, call-level rate control, reconciliation, and Sentry.',
  kicker: 'Production HubSpot 003',
  readTime: '12 min',
  difficulty: 'Advanced',
  series: {_type: 'reference', _ref: series._id},
  seriesOrder: 3,
  taxonomies: [
    ref('tech-taxonomy-hubspot'),
    ref('tech-taxonomy-distributed-systems'),
    ref('tech-taxonomy-postgresql'),
    ref('tech-taxonomy-nextjs'),
  ],
  seoTitle: 'Reliable HubSpot Sync with Outbox and QStash',
  seoDescription:
    'Implement durable HubSpot synchronization with a PostgreSQL outbox, QStash, idempotent workers, API rate control, retries, cron reconciliation, and Sentry.',
  sourceUrls: [
    source('src1', 'AWS transactional outbox pattern', 'https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html'),
    source('src2', 'HubSpot API error handling', 'https://developers.hubspot.com/docs/api-reference/error-handling'),
    source('src3', 'HubSpot API usage guidelines and limits', 'https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines'),
    source('src4', 'QStash flow control', 'https://upstash.com/docs/qstash/features/flowcontrol'),
    source('src5', 'QStash deduplication', 'https://upstash.com/docs/qstash/features/deduplication'),
    source('src6', 'QStash retries', 'https://upstash.com/docs/qstash/features/retry'),
    source('src7', 'QStash Next.js signature verification', 'https://upstash.com/docs/qstash/quickstarts/vercel-nextjs'),
    source('src8', 'PostgreSQL SELECT locking', 'https://www.postgresql.org/docs/current/sql-select.html'),
    source('src9', 'Vercel cron security', 'https://vercel.com/docs/cron-jobs/manage-cron-jobs'),
    source('src10', 'Sentry event enrichment', 'https://docs.sentry.io/platforms/javascript/guides/nextjs/enriching-events/'),
  ],
  body: [
    p(
      'A reliable HubSpot integration has to survive the worst possible success: HubSpot commits the change, but the worker loses the response before recording it. Retrying may repeat the call; refusing to retry may leave the local event unresolved. That ambiguity is why queues alone are not enough. The database, publisher, worker, and remote mutation all need explicit identities and recoverable state.',
    ),
    linkedP(
      'This is the delivery layer for ',
      'the 40-site architecture',
      URLS.architecture,
      ' and its versioned brand-routing plan. The application first accepts a desired state locally; this pipeline makes HubSpot converge on it without blocking the visitor.',
    ),
    callout(
      'tip',
      'At-least-once delivery is a feature when processing is idempotent',
      'The pipeline should assume that any event can be published or delivered more than once. Reliability comes from making repetition safe, observable, and convergent.',
    ),
    h2('Eliminate the database-and-queue dual write'),
    p(
      'Writing the subscription to PostgreSQL and then publishing to QStash creates two independent writes. If the process crashes between them, the subscription exists but no worker is scheduled. Publishing first has the opposite failure: the worker can observe an event whose business transaction later rolls back.',
    ),
    p(
      'The transactional outbox pattern puts the desired subscription change and an immutable event in the same database transaction. A separate dispatcher publishes committed outbox rows. The dispatcher is allowed to publish more than once because the worker is idempotent.',
    ),
    code(
      'Subscription and outbox schema',
      'sql',
      'good',
      `CREATE TABLE subscription_requests (
  id uuid PRIMARY KEY,
  brand_id text NOT NULL REFERENCES brands(id),
  contact_key text NOT NULL,
  product_id text NOT NULL,
  desired_state text NOT NULL CHECK (desired_state IN ('subscribed', 'unsubscribed')),
  mapping_version integer NOT NULL,
  idempotency_key text NOT NULL,
  request_hash text NOT NULL,
  sync_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (brand_id, product_id, idempotency_key)
);

CREATE TABLE hubspot_outbox_events (
  id uuid PRIMARY KEY,
  request_id uuid NOT NULL REFERENCES subscription_requests(id),
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  publish_attempts integer NOT NULL DEFAULT 0,
  process_attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  lease_expires_at timestamptz,
  qstash_message_id text,
  last_error_code text,
  last_error_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (request_id, event_type)
);`,
    ),
    h2('Commit the receipt and event together'),
    p(
      'The acceptance transaction validates a stable idempotency key and a hash of the normalized request. A replay with the same key and payload returns the original receipt. The same key with different data is a conflict. This prevents a lost HTTP response from creating a second logical subscription.',
    ),
    code(
      'lib/subscriptions/accept.ts',
      'typescript',
      'good',
      `export async function acceptSubscription(input: AcceptedSubscription) {
  return db.transaction(async (tx) => {
    const inserted = await tx.oneOrNone(
      \`INSERT INTO subscription_requests
         (id, brand_id, contact_key, product_id, desired_state,
          mapping_version, idempotency_key, request_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (brand_id, product_id, idempotency_key) DO NOTHING
       RETURNING id\`,
      [input.requestId, input.brandId, input.contactKey, input.productId,
       input.desiredState, input.mapping.version, input.idempotencyKey,
       input.requestHash],
    )

    if (!inserted) return loadAndValidateReplay(tx, input)

    await tx.none(
      \`INSERT INTO hubspot_outbox_events
         (id, request_id, event_type, payload)
       VALUES ($1, $2, 'subscription.desired-state.v1', $3::jsonb)\`,
      [input.eventId, input.requestId, JSON.stringify({
        requestId: input.requestId,
        mappingVersion: input.mapping.version,
        resolvedTargets: input.mapping.resolvedTargets,
      })],
    )

    return {requestId: input.requestId, status: 'accepted', replayed: false}
  })
}`,
    ),
    p(
      'The payload is a mapping snapshot, not an instruction to re-read whatever configuration happens to be current. Ordinary retries should be deterministic. A deliberate migration can create a new event under a new mapping version.',
    ),
    linkedP(
      'The schema and conflict rules for that snapshot are explained in ',
      'the multi-brand routing article',
      URLS.routing,
      '.',
    ),
    h2('Claim outbox rows with expiring leases'),
    p(
      'Several dispatcher instances may run concurrently. Use row locking with SKIP LOCKED to let each instance claim a different batch, and give the claim an expiry time. If an instance disappears, another dispatcher can reclaim the event after the lease expires.',
    ),
    code(
      'Claim publishable events',
      'sql',
      'good',
      `WITH candidates AS (
  SELECT id
    FROM hubspot_outbox_events
   WHERE (
     status IN ('pending', 'publish_retry')
     AND next_attempt_at <= now()
   ) OR (
     status = 'publishing'
     AND lease_expires_at < now()
   )
   ORDER BY next_attempt_at, created_at
   FOR UPDATE SKIP LOCKED
   LIMIT 100
)
UPDATE hubspot_outbox_events AS event
   SET status = 'publishing',
       publish_attempts = publish_attempts + 1,
       lease_expires_at = now() + interval '2 minutes'
  FROM candidates
 WHERE event.id = candidates.id
RETURNING event.*;`,
    ),
    p(
      'SKIP LOCKED is appropriate for queue-like tables because temporarily skipping a row is preferable to blocking every dispatcher behind it. It is not a substitute for the reconciler: expired leases and overlooked rows still need a later scan.',
    ),
    h2('Publish an event reference, not the full customer record'),
    p(
      'Send QStash the outbox event ID and perhaps the mapping version. The signed worker can load the authorized record from PostgreSQL. Keeping email addresses and consent evidence out of the message body reduces their duplication across provider logs and dead-letter tooling.',
    ),
    code(
      'lib/hubspot/publish-event.ts',
      'typescript',
      'good',
      `const result = await qstash.publishJSON({
  url: process.env.HUBSPOT_WORKER_URL!,
  body: {eventId: event.id},
  retries: 5,
  deduplicationId: event.id,
  flowControl: {
    key: 'hubspot-private-app-primary',
    rate: 150,
    period: '10s',
    parallelism: 12,
  },
})

await markQueued(event.id, result.messageId)`,
    ),
    p(
      'QStash deduplication helps when publishing is retried after an uncertain acknowledgement, but its documented window is ten minutes. It cannot replace durable idempotency in PostgreSQL or HubSpot. An old reconciler event can be delivered long after the QStash deduplication window has passed.',
    ),
    h3('Flow control does not count HubSpot requests'),
    p(
      'The example delays worker invocations under one shared key. It does not know whether a worker makes one HubSpot call or ten. If call counts vary, route every HubSpot request through a shared token bucket or reserve an explicit number of call tokens before executing a plan. Otherwise a message rate of 150 per ten seconds can still exceed the 190-request API window many times over.',
    ),
    code(
      'Reserve downstream call capacity',
      'typescript',
      'good',
      `const plan = await buildHubSpotPlan(event)
const estimatedCalls = estimateHubSpotCalls(plan)

const reservation = await hubspotBudget.reserve({
  key: 'portal:12345:private-app:primary',
  tokens: estimatedCalls,
  limit: 150,
  windowMs: 10_000,
})

if (!reservation.granted) {
  return new Response('HubSpot budget unavailable', {
    status: 503,
    headers: {'Retry-After': String(reservation.retryAfterSeconds)},
  })
}`,
    ),
    p(
      'A distributed Redis token bucket is one implementation. Another is to break the plan into one operation per message and use QStash flow control as the call limiter. The correct choice depends on whether operations must be atomic from the business perspective and how much latency is acceptable.',
    ),
    h2('Verify every worker request'),
    p(
      'A public Next.js route is not trusted merely because only QStash is expected to call it. Verify the QStash signature with both current and next signing keys before reading or processing the event. Keep the QStash publishing token server-side and rotate credentials through the deployment environment.',
    ),
    code(
      'app/api/workers/hubspot/route.ts',
      'typescript',
      'good',
      `import {verifySignatureAppRouter} from '@upstash/qstash/nextjs'

async function handler(request: Request) {
  const {eventId} = await request.json() as {eventId: string}
  const event = await claimEvent(eventId)
  if (!event || event.status === 'synced') return new Response('OK')

  try {
    const plan = await buildPlanFromSnapshot(event)
    await applyHubSpotPlan(event, plan)
    await markEventSynced(event.id)
    return new Response('OK')
  } catch (error) {
    return handleWorkerError(event, error)
  }
}

export const POST = verifySignatureAppRouter(handler)`,
    ),
    h2('Make HubSpot mutations converge'),
    p(
      'Upsert the contact using a stable custom unique property and attach a stable objectWriteTraceId where the batch API supports it. Set properties to their desired values. Communication preferences should be updated to the desired subscribed or unsubscribed state. Segment operations should calculate add and remove differences when practical.',
    ),
    p(
      'The worker should treat “already in the desired state” as success. Local operation receipts can prevent unnecessary calls, but they cannot close the crash window after remote success and before the receipt is stored. Only a remote idempotency mechanism, stable upsert identity, or read-after-uncertain-write reconciliation can resolve that ambiguity.',
    ),
    code(
      'Operation receipt model',
      'sql',
      'good',
      `CREATE TABLE hubspot_operation_receipts (
  event_id uuid NOT NULL REFERENCES hubspot_outbox_events(id),
  operation_key text NOT NULL,
  operation_type text NOT NULL,
  desired_hash text NOT NULL,
  status text NOT NULL,
  hubspot_object_id text,
  hubspot_correlation_id text,
  attempt_count integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  PRIMARY KEY (event_id, operation_key)
);`,
    ),
    h2('Classify failures before retrying'),
    p(
      'A maximum-attempt counter is useful, but it should not be the first decision. A temporary rate limit and an invalid segment ID require different responses. HubSpot documents 429 rate limits, short 423 locks during high-volume writes, several temporary 5xx conditions, and human-readable validation errors. Preserve HubSpot correlation IDs for support and incident analysis.',
    ),
    code(
      'Retry policy',
      'text',
      'neutral',
      `Retry with backoff and jitter
  423 locked (wait at least the documented lock interval)
  429 rate limited (respect Retry-After when present)
  502, 503, 504, 521, 524
  network timeout or connection reset

Pause or refresh credentials
  401 expired or invalid token

Dead / configuration review
  400 malformed property or illegal state
  403 missing scope or product entitlement
  invalid subscription type, Brand ID, or segment mapping
  same idempotency key with a different request hash

Inspect partial results
  207 Multi-Status from supported batch operations`,
    ),
    p(
      'QStash retries every non-2xx response by default. For a known non-retryable error, its retry feature supports a 489 response with the Upstash-NonRetryable-Error header, which moves the message directly to the dead-letter queue. Before doing that, persist the normalized failure and mark the local event dead so the database remains the operational source of truth.',
    ),
    code(
      'Worker error response',
      'typescript',
      'good',
      `async function handleWorkerError(event: Event, error: unknown) {
  const failure = classifyHubSpotError(error)
  await recordFailure(event.id, failure)

  if (!failure.retryable) {
    return new Response('Non-retryable HubSpot error', {
      status: 489,
      headers: {'Upstash-NonRetryable-Error': 'true'},
    })
  }

  return new Response('Retry later', {
    status: 503,
    headers: failure.retryAfterSeconds
      ? {'Retry-After': String(failure.retryAfterSeconds)}
      : undefined,
  })
}`,
    ),
    h2('Use FIFO only where order is a business invariant'),
    p(
      'QStash queues provide ordered delivery and default to one-at-a-time processing. Putting all 40 websites in one FIFO queue means one failing contact can block every unrelated subscription behind it. Global FIFO is usually a throughput incident waiting to happen.',
    ),
    p(
      'Ordering commonly matters only for events concerning the same contact and subscription product: an unsubscribe at sequence 18 must not be overwritten by a delayed subscribe at sequence 17. Enforce that invariant with a per-stream sequence number, optimistic version check, or a bounded set of hash-partitioned ordered queues. Keep unrelated streams concurrent.',
    ),
    code(
      'Sequence guard',
      'sql',
      'good',
      `UPDATE contact_subscription_state
   SET applied_sequence = $new_sequence,
       desired_state = $desired_state,
       updated_at = now()
 WHERE contact_key = $contact_key
   AND brand_id = $brand_id
   AND product_id = $product_id
   AND applied_sequence < $new_sequence
RETURNING applied_sequence;`,
    ),
    p(
      'If this update returns no row because a higher sequence was already applied, the old event is obsolete and can complete without changing HubSpot. This protects unsubscribe precedence even when delivery order is imperfect.',
    ),
    h2('Make cron a reconciler, not the primary queue'),
    p(
      'QStash supplies normal retries. The hourly Vercel cron job is the independent safety net that looks for state the queue cannot know about: pending outbox rows never published, expired leases, retryable events whose schedule was lost, dead events whose mapping was repaired, and local records that disagree with HubSpot.',
    ),
    code(
      'app/api/cron/reconcile-hubspot/route.ts',
      'typescript',
      'good',
      `export async function GET(request: Request) {
  if (request.headers.get('authorization') !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return new Response('Unauthorized', {status: 401})
  }

  const batch = await findReconciliationCandidates({
    limit: 250,
    pendingOlderThanMinutes: 10,
    expiredLeases: true,
    retryableBefore: new Date(),
  })

  const result = await scheduleCandidatesIdempotently(batch)
  return Response.json({checked: batch.length, scheduled: result.length})
}`,
    ),
    p(
      'Vercel sends CRON_SECRET as a bearer Authorization header when configured. Bound every reconciliation run by row count and execution time. Use leases so overlapping invocations do not duplicate active work, while retaining idempotency in case they do.',
    ),
    h3('Reconciliation can compare state, not only retry events'),
    p(
      'A mature reconciler samples or scans authoritative subscription rows, reads the corresponding HubSpot state in batches, and emits correction events for differences. Keep that mode separate from retrying the original snapshot: reconciliation normally applies the latest valid desired state and mapping.',
    ),
    h2('Instrument the lifecycle without leaking contacts'),
    p(
      'Sentry tags should answer which integration, operation, brand, state, and failure class are involved. Context can carry event IDs, mapping versions, attempt counts, and HubSpot correlation IDs. Do not attach the raw event, full email address, authorization header, click token, or consent evidence.',
    ),
    code(
      'Sentry failure context',
      'typescript',
      'good',
      `Sentry.withScope((scope) => {
  scope.setTag('integration', 'hubspot')
  scope.setTag('hubspot.operation', failure.operation)
  scope.setTag('hubspot.failure_class', failure.classification)
  scope.setTag('brand', event.brandId)
  scope.setContext('hubspot_sync', {
    eventId: event.id,
    requestId: event.requestId,
    mappingVersion: event.mappingVersion,
    processAttempt: event.processAttempts,
    operationKey: failure.operationKey,
    hubspotCorrelationId: failure.correlationId,
  })
  Sentry.captureException(error)
})`,
    ),
    p(
      'Add metrics for accepted-to-synced latency, pending age, retry rate, dead-event count, QStash wait-list size, HubSpot response codes, remaining rate-limit headers, and reconciliation repairs. Alert on backlog age and permanent failures rather than on every transient retry.',
    ),
    h2('Test the crash windows'),
    bullet('Crash after the local transaction commits but before the dispatcher runs.'),
    bullet('Publish successfully, then crash before storing the QStash message ID.'),
    bullet('Deliver the same event concurrently to two workers.'),
    bullet('Let HubSpot succeed, then simulate a lost response.'),
    bullet('Return 429, 423, 207, validation 400, expired-token 401, and temporary 5xx responses.'),
    bullet('Expire a dispatcher or worker lease and verify safe reclamation.'),
    bullet('Deliver an older subscribe event after a newer unsubscribe event.'),
    bullet('Run two reconcilers at the same time.'),
    bullet('Repair a broken mapping and deliberately replay a dead event under a new mapping version.'),
    h2('Reliability checklist'),
    bullet('Commit the desired state and outbox event atomically.'),
    bullet('Claim work with SKIP LOCKED and expiring leases.'),
    bullet('Publish a durable event ID rather than unnecessary personal data.'),
    bullet('Verify QStash signatures with current and next signing keys.'),
    bullet('Use QStash deduplication as a short-window optimization, not the source of idempotency.'),
    bullet('Control HubSpot calls, not only worker invocations.'),
    bullet('Classify transient, credential, configuration, and partial-batch failures separately.'),
    bullet('Protect per-contact ordering without serializing all brands globally.'),
    bullet('Use a secured Vercel cron route as an independent reconciler.'),
    bullet('Send identifiers and sanitized failure context to Sentry.'),
    linkedP(
      'One data path still needs its own threat model: the identifier carried from a marketing email back to one of the websites. Finish the series with ',
      'the privacy-safe HubSpot email identity guide',
      URLS.identity,
      '.',
    ),
    callout(
      'tip',
      'The database explains what should happen',
      'QStash provides delivery, HubSpot provides the CRM projection, and Sentry provides visibility. The local desired state and event ledger are what let you reconstruct and repair the truth after any one of those systems is unavailable.',
    ),
  ],
}

await publishTechArticle(article)
