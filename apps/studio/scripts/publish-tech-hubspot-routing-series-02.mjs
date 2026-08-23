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
  _id: 'tech-article-hubspot-multi-brand-subscription-routing',
  _type: 'techArticle',
  title: 'Modeling Multi-Brand Subscription Routing in HubSpot',
  slug: {_type: 'slug', current: 'hubspot-multi-brand-subscription-routing'},
  description:
    'A data-driven model for mapping websites and brands to HubSpot subscription types, Brands IDs, segments, contact properties, and analytics destinations.',
  kicker: 'Production HubSpot 002',
  readTime: '9 min',
  difficulty: 'Advanced',
  series: {_type: 'reference', _ref: series._id},
  seriesOrder: 2,
  taxonomies: [
    ref('tech-taxonomy-hubspot'),
    ref('tech-taxonomy-postgresql'),
    ref('tech-taxonomy-guides'),
  ],
  seoTitle: 'Model Multi-Brand Subscription Routing in HubSpot',
  seoDescription:
    'Map websites to HubSpot Brands, communication subscriptions, segments, and contact properties with a versioned relational configuration model.',
  sourceUrls: [
    source('src1', 'HubSpot Lists (Segments) API', 'https://developers.hubspot.com/docs/api-reference/latest/crm/lists/guide'),
    source('src2', 'HubSpot communication preferences API', 'https://developers.hubspot.com/docs/api-reference/latest/communication-preferences/guide'),
    source('src3', 'HubSpot Contacts API', 'https://developers.hubspot.com/docs/api-reference/latest/crm/objects/contacts/guide'),
    source('src4', 'HubSpot Properties API', 'https://developers.hubspot.com/docs/api-reference/latest/crm/properties/guide'),
    source('src5', 'HubSpot Brands API', 'https://developers.hubspot.com/docs/api-reference/legacy/account/brands/guide'),
    source('src6', 'HubSpot update list membership endpoint', 'https://developers.hubspot.com/docs/api-reference/latest/crm/lists/memberships/update-list-memberships'),
  ],
  body: [
    p(
      'When brand A means six HubSpot segments, one communication subscription type, one HubSpot Brand ID, and several attribution properties, the mapping is part of the product. Hiding those IDs in conditionals turns every new website, campaign, and reorganization into a deployment—and makes it difficult to explain why a contact landed where they did.',
    ),
    linkedP(
      'This article expands the configuration layer introduced in ',
      'the 40-site HubSpot architecture',
      URLS.architecture,
      '. The goal is to let every website express business intent while one versioned model resolves that intent into HubSpot targets.',
    ),
    callout(
      'tip',
      'Map intent, not form implementations',
      'The website should say “subscribe this person to the Brand A product newsletter.” It should not know that today this requires segment 6142, subscription type 381, businessUnitId 41857, and three contact properties.',
    ),
    h2('Use one internal brand identity'),
    p(
      'Start with a stable internal brand key such as brand_a. Map every accepted hostname and form to that key. Do not use the hostname itself as the business identity: domains change, several domains can represent one brand, preview hosts must be rejected, and a single site can expose more than one subscription product.',
    ),
    code(
      'Core routing tables',
      'sql',
      'good',
      `CREATE TABLE brands (
  id text PRIMARY KEY,
  name text NOT NULL,
  hubspot_business_unit_id bigint,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE brand_hosts (
  hostname text PRIMARY KEY,
  brand_id text NOT NULL REFERENCES brands(id),
  environment text NOT NULL CHECK (environment IN ('production', 'preview')),
  accepts_subscriptions boolean NOT NULL DEFAULT false
);

CREATE TABLE subscription_products (
  id text PRIMARY KEY,
  name text NOT NULL,
  channel text NOT NULL DEFAULT 'EMAIL',
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE brand_subscription_routes (
  brand_id text NOT NULL REFERENCES brands(id),
  product_id text NOT NULL REFERENCES subscription_products(id),
  mapping_version integer NOT NULL,
  hubspot_subscription_type_id bigint NOT NULL,
  legal_basis text,
  active_from timestamptz NOT NULL,
  active_until timestamptz,
  PRIMARY KEY (brand_id, product_id, mapping_version)
);`,
    ),
    p(
      'HubSpot renamed business units to Brands, but current APIs continue to use fields such as businessUnitId. Keeping the internal column explicit prevents a terminology migration from changing the rest of the application. Treat the numeric HubSpot value as integration configuration, not your primary brand identity.',
    ),
    h2('Model each HubSpot destination by purpose'),
    p(
      'A brand-to-list join table is a good start, but it becomes more useful when every target has a declared role. Newsletter delivery, analytics cohorts, onboarding workflows, suppression groups, and historical snapshots do not have the same semantics. A retry should know whether it is applying consent, a mutable desired membership, or an append-only observation.',
    ),
    code(
      'HubSpot targets and mappings',
      'sql',
      'good',
      `CREATE TYPE hubspot_target_kind AS ENUM (
  'MANUAL_SEGMENT',
  'DYNAMIC_SEGMENT_INPUT',
  'CONTACT_PROPERTY',
  'BRAND_ASSIGNMENT'
);

CREATE TABLE hubspot_targets (
  id uuid PRIMARY KEY,
  kind hubspot_target_kind NOT NULL,
  hubspot_id text,
  property_name text,
  purpose text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  CHECK (
    (hubspot_id IS NOT NULL AND property_name IS NULL)
    OR (hubspot_id IS NULL AND property_name IS NOT NULL)
  )
);

CREATE TABLE brand_target_mappings (
  brand_id text NOT NULL REFERENCES brands(id),
  product_id text NOT NULL REFERENCES subscription_products(id),
  target_id uuid NOT NULL REFERENCES hubspot_targets(id),
  desired_value jsonb,
  mapping_version integer NOT NULL,
  required boolean NOT NULL DEFAULT true,
  active_from timestamptz NOT NULL,
  active_until timestamptz,
  PRIMARY KEY (brand_id, product_id, target_id, mapping_version)
);`,
    ),
    p(
      'With this structure, Brand A can resolve to six targets without six branches in application code. The same target can serve several brands, and a migration can introduce version 13 while version 12 remains available for events already accepted under the previous configuration.',
    ),
    h2('Keep consent out of segment membership'),
    p(
      'HubSpot communication subscription types represent the permission to communicate with a contact. The current communication-preferences API supports subscribed, unsubscribed, and not-specified states, along with legal-basis information where required. Segment membership is useful for campaigns and reporting, but it must not silently override an unsubscribe.',
    ),
    code(
      'Desired state, kept separate',
      'json',
      'neutral',
      `{
  "contact": {
    "external_contact_id": "usr_7T4...",
    "email": "person@example.com",
    "origin_brand": "brand_a"
  },
  "communicationPreferences": [
    {
      "businessUnitId": 41857,
      "subscriptionId": 39644612,
      "state": "SUBSCRIBED",
      "consentEvidenceId": "consent_01J..."
    }
  ],
  "manualSegmentIds": [611, 614, 702],
  "properties": {
    "newsletter_brand_a": true,
    "first_subscription_source": "site-a-footer"
  }
}`,
    ),
    h3('Make unsubscribe precedence explicit'),
    p(
      'Define precedence in the application model. A verified unsubscribe should win over a stale subscribe event. A brand-specific unsubscribe should not necessarily erase another brand’s lawful subscription. A global unsubscribe must be checked before any brand-level desired state is applied. Store when, where, and under which policy the decision was made.',
    ),
    h2('Choose dynamic segments when state is derivable'),
    p(
      'HubSpot now calls lists segments. In the current API, MANUAL and SNAPSHOT segments support membership updates; DYNAMIC segments calculate membership from filters. If a segment means “all contacts where newsletter_brand_a is true,” setting one contact property and letting HubSpot evaluate the dynamic segment can replace several explicit membership calls.',
    ),
    bullet('Use DYNAMIC segments when membership follows entirely from contact properties.'),
    bullet('Use MANUAL segments when an external event cannot be represented as durable CRM properties.'),
    bullet('Use SNAPSHOT segments for a point-in-time cohort that should stop changing after its initial calculation.'),
    bullet('Do not use a segment as the only record of consent or consent evidence.'),
    p(
      'The tradeoff is visibility. Property-driven segments make the API workload smaller and HubSpot configuration more important. Manual segments make the integration do more work and can be easier to reason about from the application. Record which side owns every rule so operators do not debug the wrong system.',
    ),
    h2('Use stable contact identity for upserts'),
    p(
      'HubSpot contacts have a record ID and can be retrieved or upserted by email or a custom unique identifier. For a multi-property system, create a custom unique property containing the stable internal contact key. This gives the integration an identity that survives an email-address change and is shared by every website.',
    ),
    p(
      'The current batch upsert API supports email or a custom unique identifier. Email-based partial upserts are not supported, which is another reason to use a controlled unique property. Preserve the original email value and define normalization rules carefully; two addresses that appear similar are not always safe to merge automatically.',
    ),
    code(
      'Contact upsert input',
      'json',
      'good',
      `{
  "inputs": [
    {
      "idProperty": "external_contact_id",
      "id": "usr_7T4M9Q6K",
      "objectWriteTraceId": "evt_01J...:contact",
      "properties": {
        "email": "person@example.com",
        "origin_brand": "brand_a",
        "subscription_mapping_version": "12"
      }
    }
  ]
}`,
    ),
    linkedP(
      'The stable internal key is also the safe starting point for ',
      'privacy-aware email-link attribution',
      URLS.identity,
      '. Do not derive the public identifier by Base64-encoding the email address.',
    ),
    h2('Snapshot the resolved mapping'),
    p(
      'A queued event may be processed minutes later or replayed days later. If the worker always loads the newest mappings, the same event can produce different HubSpot effects each time. That may be desirable during a deliberate reconciliation, but it is dangerous during an ordinary retry.',
    ),
    p(
      'Store both the mapping version and the resolved target snapshot with the accepted event. Normal retries use the snapshot. A migration or reconciliation creates a new event under the new mapping version. This makes the audit trail deterministic and lets you explain exactly which rules produced the result.',
    ),
    code(
      'Resolved event snapshot',
      'json',
      'neutral',
      `{
  "mappingVersion": 12,
  "resolvedTargets": [
    {"kind": "CONTACT_PROPERTY", "name": "newsletter_brand_a", "value": true},
    {"kind": "MANUAL_SEGMENT", "id": "611", "desired": "member"},
    {"kind": "MANUAL_SEGMENT", "id": "614", "desired": "member"},
    {"kind": "BRAND_ASSIGNMENT", "id": "41857"}
  ],
  "communicationPreference": {
    "businessUnitId": 41857,
    "subscriptionId": 39644612,
    "state": "SUBSCRIBED"
  }
}`,
    ),
    h2('Validate configuration before accepting traffic'),
    p(
      'A typo in a segment ID should fail during configuration review, not after thousands of events reach the worker. Build a validation job that retrieves subscription definitions, available Brands, relevant property definitions, and segment metadata from HubSpot. Compare them with the active mapping version and block activation when a required target is missing or incompatible.',
    ),
    bullet('Verify every production hostname maps to exactly one active internal brand.'),
    bullet('Verify every offered product has an active communication-subscription route.'),
    bullet('Verify manual membership targets are MANUAL or SNAPSHOT segments, not DYNAMIC.'),
    bullet('Verify every custom contact property exists with the expected type and unique setting.'),
    bullet('Verify the configured businessUnitId belongs to an accessible HubSpot Brand.'),
    bullet('Verify every route has an effective date and a monotonically increasing version.'),
    h2('Calculate desired state before making calls'),
    p(
      'The worker should load the event, reduce all mappings into one desired state, and validate the plan before sending the first request. If two rules assign different values to the same property, or one rule subscribes while another unsubscribes the same subscription type, fail the plan as a configuration error. Do not let call order decide business policy.',
    ),
    code(
      'Pure routing boundary',
      'typescript',
      'good',
      `type HubSpotPlan = {
  contactProperties: Record<string, string | boolean | number>
  communicationPreferences: Array<{
    businessUnitId: number
    subscriptionId: number
    state: 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'NOT_SPECIFIED'
  }>
  segmentIdsToAdd: string[]
  segmentIdsToRemove: string[]
}

export function buildHubSpotPlan(
  event: SubscriptionEvent,
  snapshot: MappingSnapshot,
): HubSpotPlan {
  const plan = reduceTargets(event.desiredState, snapshot.resolvedTargets)
  assertNoConflicts(plan)
  assertConsentPrecedence(plan, event.consentEvidenceId)
  return plan
}`,
    ),
    p(
      'Keeping this function pure makes the most important routing behavior easy to test. Table-driven tests can cover every brand, product, subscribe/unsubscribe transition, mapping version, and conflict without making network calls.',
    ),
    h2('Test the forty-first website before it exists'),
    p(
      'The best evidence that the model scales is the process for adding a brand. An operator should be able to add the brand, approved hostnames, HubSpot Brand ID, subscription types, segment targets, and properties; validate the configuration; activate a new mapping version; and submit a synthetic contact through the complete worker.',
    ),
    p(
      'If that process still requires editing a switch statement, the configuration boundary is incomplete. If it requires no review, it is unsafe. The goal is controlled configuration with validation, versioning, preview, approval, and an auditable activation event.',
    ),
    linkedP(
      'Once the plan is deterministic, it needs a delivery mechanism that survives crashes and repeated messages. Continue with ',
      'the transactional outbox and QStash implementation',
      URLS.reliability,
      ' for idempotent workers, rate control, retries, dead-letter handling, and reconciliation.',
    ),
    h2('Routing checklist'),
    bullet('Represent brands with stable internal IDs and map hostnames separately.'),
    bullet('Treat HubSpot businessUnitId values as external configuration.'),
    bullet('Model communication preferences independently from segment membership.'),
    bullet('Declare the purpose and semantics of every HubSpot target.'),
    bullet('Prefer dynamic segments when durable properties fully determine membership.'),
    bullet('Upsert contacts by a stable custom unique identifier where possible.'),
    bullet('Version mappings and snapshot resolved targets on accepted events.'),
    bullet('Validate remote HubSpot objects before activating a mapping.'),
    bullet('Detect contradictory rules before issuing any HubSpot request.'),
    bullet('Test new brands with synthetic end-to-end events.'),
    callout(
      'tip',
      'Configuration is executable business logic',
      'Give routing data the same protections as code: types, constraints, tests, version history, review, and a controlled path to production.',
    ),
  ],
}

await publishTechArticle(article)
