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
  _id: 'tech-article-scaling-hubspot-subscriptions-across-multiple-websites',
  _type: 'techArticle',
  title: 'Scaling HubSpot Subscriptions Across 40+ Websites',
  slug: {_type: 'slug', current: 'scaling-hubspot-subscriptions-across-multiple-websites'},
  description:
    'The production architecture for accepting subscriptions immediately, routing contacts across brands, and staying inside a shared HubSpot API budget.',
  kicker: 'Production HubSpot 001',
  readTime: '10 min',
  difficulty: 'Advanced',
  series: {_type: 'reference', _ref: series._id},
  seriesOrder: 1,
  taxonomies: [
    ref('tech-taxonomy-hubspot'),
    ref('tech-taxonomy-distributed-systems'),
    ref('tech-taxonomy-guides'),
  ],
  seoTitle: 'Scale HubSpot Subscriptions Across 40+ Websites',
  seoDescription:
    'Design a multi-brand HubSpot subscription platform with a local source of truth, rate-aware queues, idempotency, durable retries, and clear consent boundaries.',
  sourceUrls: [
    source('src1', 'HubSpot API usage guidelines and limits', 'https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines'),
    source('src2', 'HubSpot Contacts API', 'https://developers.hubspot.com/docs/api-reference/latest/crm/objects/contacts/guide'),
    source('src3', 'HubSpot communication preferences API', 'https://developers.hubspot.com/docs/api-reference/latest/communication-preferences/guide'),
    source('src4', 'HubSpot Lists (Segments) API', 'https://developers.hubspot.com/docs/api-reference/latest/crm/lists/guide'),
    source('src5', 'QStash flow control', 'https://upstash.com/docs/qstash/features/flowcontrol'),
    source('src6', 'AWS asynchronous communication guidance', 'https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-integrating-microservices/asynchronous.html'),
  ],
  body: [
    p(
      'HubSpot works well as a central CRM, but the integration changes character when more than 40 websites share the same account and API budget. A subscription is no longer one form submission followed by one API call. It can mean contact creation, consent updates, brand assignment, membership in several segments, analytics attribution, and a durable record of what happened.',
    ),
    p(
      'The system described here was designed around a simple product promise: the visitor should receive a useful response immediately, while every HubSpot side effect happens reliably in the background. That promise forces the application to own its state instead of treating HubSpot as a synchronous extension of the request handler.',
    ),
    callout(
      'tip',
      'A successful submission is not the same as a completed CRM sync',
      'The application can truthfully acknowledge that it accepted a subscription after committing it locally. It should not claim that HubSpot is synchronized until the background workflow has completed.',
    ),
    h2('Start with the real API budget'),
    p(
      'For privately distributed HubSpot apps, Professional and Enterprise accounts currently receive a burst allowance of 190 requests per app per 10 seconds. The Enterprise daily allowance is one million requests per account, and that daily allowance is shared by the apps in the account. Publicly distributed OAuth apps use a different limit. Several APIs, including CRM Search, also have endpoint-specific behavior.',
    ),
    p(
      'That distinction matters. Forty websites do not each receive 190 calls. If they use the same private app, they contribute to the same per-app window. Creating more private apps can change the burst topology, but it does not create an independent daily allowance, and it makes credentials, observability, and fairness more complicated.',
    ),
    code(
      'Capacity envelope',
      'text',
      'neutral',
      `Documented private-app burst limit: 190 requests / 10 seconds
Equivalent average ceiling:           19 requests / second

Do not configure the dispatcher at the documented edge.
Example starting envelope:             150 requests / 10 seconds
Reserved headroom:                     40 requests / 10 seconds

The reserve absorbs:
- retries and traffic bursts
- administrative and unrelated integration calls
- variable call counts per subscription
- clock and window-boundary differences`,
    ),
    p(
      'The 150-call figure is an operational starting point, not a HubSpot rule. Measure the response headers and the other clients using the account. The important design choice is to maintain headroom and one shared view of the budget rather than letting every serverless instance believe it can spend the full allowance.',
    ),
    h3('Count calls per workflow, not forms per second'),
    p(
      'Suppose one new subscriber requires a contact upsert, two communication-preference updates, one brand assignment, and six manual segment memberships. That is ten requests before retries. A queue limited to fifteen jobs per second could still produce 150 HubSpot calls per second if every job performs ten calls. Queue delivery rate and downstream API-call rate are not interchangeable.',
    ),
    p(
      'Either make each job consume a known call budget, route each HubSpot operation through a shared call-level limiter, or design the data model so fewer calls are required. Dynamic segments, batch endpoints, cached configuration, and property-based routing can remove a surprising amount of traffic.',
    ),
    h2('Make the application the source of truth'),
    p(
      'The web request should validate the visitor, consent, brand, and idempotency key; then commit the desired subscription state and an outbox event in one local transaction. Once that transaction succeeds, the system can return an accepted receipt. HubSpot becomes a projection of the application state rather than the only place where the subscription exists.',
    ),
    code(
      'Request path and background path',
      'text',
      'neutral',
      `Browser
  -> POST /api/subscriptions
  -> validate hostname, payload, consent, and idempotency key
  -> database transaction
       1. upsert desired subscription state
       2. insert immutable outbox event
  <- 202 Accepted { requestId, status: "accepted" }

Outbox dispatcher
  -> publish event reference to QStash

Signed worker
  -> load event and mapping snapshot
  -> reserve HubSpot call budget
  -> upsert contact
  -> update communication preferences
  -> assign brand and segment state
  -> mark event synchronized

Reconciler
  -> find abandoned, retryable, or inconsistent events
  -> safely schedule them again`,
    ),
    p(
      'Returning 202 is useful because it describes the contract accurately: the application has accepted responsibility for completing the work. If the product prefers a friendlier message, the interface can say “You are subscribed” as long as the local subscription is authoritative and failures are repaired automatically. Avoid returning “HubSpot updated” before that is true.',
    ),
    code(
      'app/api/subscriptions/route.ts',
      'typescript',
      'good',
      `export async function POST(request: Request) {
  const input = subscriptionSchema.parse(await request.json())
  const host = new URL(request.url).hostname
  const brand = await findBrandByHostname(host)
  if (!brand) return Response.json({error: 'Unknown brand'}, {status: 404})

  const idempotencyKey = request.headers.get('Idempotency-Key')
  if (!idempotencyKey) {
    return Response.json({error: 'Idempotency-Key is required'}, {status: 400})
  }

  const receipt = await acceptSubscription({
    brandId: brand.id,
    email: input.email,
    choices: input.choices,
    consentEvidence: input.consentEvidence,
    idempotencyKey,
  })

  return Response.json(receipt, {status: receipt.replayed ? 200 : 202})
}`,
    ),
    linkedP(
      'The mapping snapshot loaded by this transaction is the subject of ',
      'the multi-brand routing guide',
      URLS.routing,
      '. It separates brand configuration, HubSpot Brands IDs, communication subscription types, and segments so that adding the forty-first website is a data change rather than a code deployment.',
    ),
    h2('Separate consent, segmentation, and analytics'),
    p(
      'A common mistake is to treat “the contact is on a newsletter list” as the entire subscription model. HubSpot communication preferences represent whether a contact may receive a category of email and the legal basis for that change. Segments group CRM records for campaigns, reporting, or workflows. Analytics properties describe where the contact came from. They are related, but they are not interchangeable.',
    ),
    bullet('Consent state answers whether and why a person may receive a particular communication type.'),
    bullet('Brand state answers which HubSpot Brand, formerly called a business unit, owns the relationship.'),
    bullet('Segment membership answers which operational or analytical groups should include the contact.'),
    bullet('Attribution properties answer which site, form, campaign, and event produced the relationship.'),
    p(
      'Store these as distinct desired states. An unsubscribe must not be undone because a later analytics event re-adds someone to a segment. Likewise, removing a person from one newsletter segment should not erase unrelated reporting history or consent for another brand.',
    ),
    h2('Use one event contract across every website'),
    p(
      'The edge applications should not know six HubSpot segment IDs. They should send one stable contract containing the internal brand, the requested subscription choices, consent evidence, and an idempotency key. The integration service resolves that intent through versioned mappings.',
    ),
    code(
      'SubscriptionAccepted.v1',
      'json',
      'good',
      `{
  "eventId": "01J...",
  "eventType": "subscription.accepted.v1",
  "occurredAt": "2026-08-18T19:15:00.000Z",
  "idempotencyKey": "brand-a:newsletter:request-uuid",
  "brandId": "brand_a",
  "mappingVersion": 12,
  "subscriber": {
    "contactKey": "usr_7T4...",
    "email": "person@example.com"
  },
  "desiredState": {
    "newsletter": "subscribed",
    "analyticsAttribution": true
  },
  "consentEvidenceId": "consent_01J..."
}`,
    ),
    p(
      'Keep the event small. Store full consent evidence and sensitive data in the authorized database, then send durable identifiers through the queue. This reduces accidental exposure in queue logs and makes retention policy easier to enforce.',
    ),
    h2('Design every boundary for repeated delivery'),
    p(
      'The browser can retry after losing a response. The dispatcher can publish twice if it crashes after QStash accepts a message but before the outbox row is updated. QStash can redeliver a failed request. The hourly reconciler intentionally submits work again. Repetition is a normal operating condition, not an exceptional one.',
    ),
    p(
      'Give the original request, outbox event, queue publication, and every HubSpot mutation stable identities. A duplicate event should converge on the same desired contact state and then return success. Never make “attempt number three” create a third logical subscription.',
    ),
    linkedP(
      'The complete implementation—including the transaction, QStash signature verification, rate-aware worker, retry classification, dead state, and hourly safety net—is in ',
      'the transactional outbox and QStash guide',
      URLS.reliability,
      '.',
    ),
    h2('Prefer convergence over a chain of commands'),
    p(
      'An event that says “add contact to segment 42” describes one command at one moment. An event that says “apply subscription state version 12 for brand A” gives the worker enough context to calculate the complete desired state. The second form is easier to replay after configuration changes and easier to reconcile against HubSpot.',
    ),
    p(
      'The worker should upsert the contact using a stable custom unique identifier where possible, retrieve the resulting record ID, and apply only the required differences. HubSpot supports batch upsert by email or a custom unique identifier; custom identifiers are especially useful because email addresses can change and email-based partial upserts have limitations.',
    ),
    h2('Build observability around business identifiers'),
    p(
      'For every attempt, record the event ID, internal contact key, brand, mapping version, operation, attempt number, HubSpot correlation ID, response class, and next retry time. Keep raw emails, access tokens, consent text, and complete payloads out of ordinary logs and Sentry events.',
    ),
    code(
      'Event lifecycle',
      'text',
      'neutral',
      `accepted   local state and outbox event committed
queued     QStash acknowledged the event reference
processing worker owns an expiring lease
retryable  transient failure with next_attempt_at
synced     desired HubSpot state confirmed
dead       permanent failure or retry budget exhausted

Track separately:
- publish attempts
- processing attempts
- HubSpot operation attempts
- reconciliation count`,
    ),
    p(
      'Those states answer different questions. An event can be accepted but not yet published, queued but not processed, or processed with one HubSpot operation still retryable. Collapsing all of that into “success” and “failed” makes incidents unnecessarily mysterious.',
    ),
    h2('Treat identity links as a separate trust boundary'),
    p(
      'A stable identifier placed in every marketing URL can make cross-property attribution convenient, but Base64-encoding an email address is not a privacy or security control. It is reversible, changes when the email changes, and copies personal information into URLs, browser history, logs, analytics systems, and forwarded messages.',
    ),
    linkedP(
      'Use an opaque internal contact identifier and purpose-bound click tokens instead. The design, including short-lived signatures, clean redirects, first-party cookies, referrer policy, email scanners, and the difference between attribution and authentication, is covered in ',
      'the privacy-safe identity-links guide',
      URLS.identity,
      '.',
    ),
    h2('Production checklist'),
    bullet('Commit desired subscription state and its outbox event in one local transaction.'),
    bullet('Return an accepted receipt without waiting for HubSpot.'),
    bullet('Use one shared HubSpot call budget per app and account, with operational headroom.'),
    bullet('Measure HubSpot calls per workflow instead of limiting queue jobs blindly.'),
    bullet('Cache account configuration and use batch or dynamic-segment APIs where they reduce calls.'),
    bullet('Keep consent, brand assignment, segment membership, and analytics attribution separate.'),
    bullet('Snapshot or version mappings so retries are deterministic.'),
    bullet('Make the request, event, worker, and every downstream mutation idempotent.'),
    bullet('Reconcile accepted, abandoned, and divergent records on a schedule.'),
    bullet('Log stable identifiers and provider correlation IDs without copying personal data.'),
    h2('The architecture in one sentence'),
    p(
      'Accept the visitor’s intent into a durable local model, translate that intent through versioned brand configuration, and project it asynchronously into HubSpot through an idempotent worker that shares one measured API budget.',
    ),
    callout(
      'tip',
      'Scale comes from controlling uncertainty',
      'The number of websites is not the hardest part. The hard part is making a lost response, duplicate delivery, stale mapping, rate-limit response, or temporary HubSpot failure produce one explainable final state.',
    ),
  ],
}

await publishTechArticle(article)
