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
  _id: 'tech-article-privacy-safe-hubspot-email-identity-links',
  _type: 'techArticle',
  title: 'Privacy-Safe Identity Links for HubSpot Marketing Emails',
  slug: {_type: 'slug', current: 'privacy-safe-hubspot-email-identity-links'},
  description:
    'Replace Base64 email parameters with stable internal IDs, short-lived signed click tokens, clean redirects, limited cookies, and explicit trust boundaries.',
  kicker: 'Production HubSpot 004',
  readTime: '12 min',
  difficulty: 'Advanced',
  series: {_type: 'reference', _ref: series._id},
  seriesOrder: 4,
  taxonomies: [
    ref('tech-taxonomy-hubspot'),
    ref('tech-taxonomy-security'),
    ref('tech-taxonomy-nextjs'),
    ref('tech-taxonomy-guides'),
  ],
  seoTitle: 'Privacy-Safe Identity Links for HubSpot Email',
  seoDescription:
    'Design HubSpot marketing links with opaque contact IDs, short-lived HMAC tokens, clean redirects, first-party cookies, safe logging, and scanner-aware actions.',
  sourceUrls: [
    source('src1', 'OWASP Session Management Cheat Sheet', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
    source('src2', 'OWASP Email Validation and Verification Cheat Sheet', 'https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html'),
    source('src3', 'OWASP ASVS data-protection requirements', 'https://cornucopia.owasp.org/taxonomy/asvs-5.0/14-data-protection/02-general-data-protection'),
    source('src4', 'Node.js crypto documentation', 'https://nodejs.org/api/crypto.html'),
    source('src5', 'MDN Referrer-Policy', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy'),
    source('src6', 'MDN History API', 'https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API'),
    source('src7', 'HubSpot Properties API', 'https://developers.hubspot.com/docs/api-reference/latest/crm/properties/guide'),
  ],
  body: [
    p(
      'A stable identifier in every marketing link can connect a HubSpot email click with activity on dozens of websites. The tempting implementation is Base64(email): store it on the contact, append it to every URL, decode it on arrival, and look up the person. It works functionally. It also copies a reversible email address into every system that observes the URL.',
    ),
    p(
      'This guide keeps the useful part—a stable cross-system correlation key—while changing the trust model. The email address remains contact data. A random internal contact key becomes the durable identity. A short-lived, purpose-bound token crosses the email boundary. A resolver validates the token, establishes only the permitted first-party state, and redirects to a clean URL.',
    ),
    linkedP(
      'This is the identity boundary of ',
      'the production HubSpot architecture',
      URLS.architecture,
      '. It assumes the contact and subscription workflow already use a stable internal contact key and the durable outbox described earlier in the series.',
    ),
    callout(
      'warning',
      'Base64 is an encoding, not protection',
      'Anyone who receives or logs a Base64 value can decode it. Encoding an email may make it less readable at a glance, but it does not make the identifier opaque, secret, revocable, or safe to place in a URL.',
    ),
    h2('Begin with the exact capability you need'),
    p(
      '“Identify the user” is too broad. A click token might be used for analytics attribution, content personalization, restoring a cart, changing communication preferences, or authenticating an account. Those actions have very different consequences and should not share one permanent bearer token.',
    ),
    bullet('Attribution answers which known marketing contact clicked a campaign link.'),
    bullet('Personalization selects low-risk content for that contact or segment.'),
    bullet('Authentication establishes an application session and account privileges.'),
    bullet('Authorization permits a specific state-changing action such as unsubscribe or preference update.'),
    p(
      'Treat an email click as weak evidence that someone accessed the mailbox or forwarded message. It is not automatically proof that the original contact controls an application account. Never let an analytics identifier become a universal password across 40 websites.',
    ),
    h2('Use three different identifiers'),
    p(
      'A clean design separates the identifier used in the application database, the value stored in HubSpot, and the token sent through a URL. They can be related without being interchangeable.',
    ),
    code(
      'Identity layers',
      'text',
      'neutral',
      `1. Internal contact ID
   usr_7T4M9Q6K...
   Random, durable, never derived from email
   Primary cross-system identity

2. HubSpot custom unique property
   external_contact_id = usr_7T4M9Q6K...
   Used for contact upsert and reconciliation
   Restricted to authorized integrations

3. Email click token
   version.payload.signature
   Short-lived and purpose-bound
   May reference the internal ID without containing the email
   Validated once, then removed from the visible URL`,
    ),
    p(
      'The internal contact ID should survive an email-address change. Generate it with a cryptographically strong random source. Store it as a custom unique contact property in HubSpot so the same person can be upserted without using email as the permanent identity.',
    ),
    h3('Random IDs are usually better than deterministic email hashes'),
    p(
      'A plain hash of an email is vulnerable to guessing because email addresses have structure and attackers can test candidates. A keyed HMAC prevents offline guessing without the key, but it still changes when the email changes, is difficult to revoke selectively, and creates the same cross-context correlator everywhere it is reused. A random database identifier is simpler and more durable.',
    ),
    h2('Put a signed, expiring claim in the email'),
    p(
      'The link token should say who the click refers to, which destination and purpose it is valid for, and when it expires. Sign the exact serialized payload with a server-side key. Do not put the email address, HubSpot access token, CRM record contents, or account privileges in the token.',
    ),
    code(
      'Click-token claims',
      'json',
      'good',
      `{
  "v": 1,
  "sub": "usr_7T4M9Q6K",
  "aud": "brand-a.example",
  "purpose": "marketing-attribution",
  "campaign": "fall-newsletter-2026",
  "iat": 1787083200,
  "exp": 1787688000,
  "jti": "clk_01J..."
}`,
    ),
    p(
      'The audience prevents a token minted for one property from being replayed at another unless that sharing is deliberate. The purpose prevents an attribution token from being accepted by a preference-management endpoint. The expiration reduces the useful lifetime of a leaked URL. The jti supplies an event identity for optional revocation or one-time use.',
    ),
    code(
      'lib/email-links/click-token.ts',
      'typescript',
      'good',
      `import {createHmac, timingSafeEqual} from 'node:crypto'

const VERSION = 'v1'

function sign(encodedPayload: string, secret: string) {
  return createHmac('sha256', secret)
    .update(VERSION + '.' + encodedPayload)
    .digest('base64url')
}

export function createClickToken(claims: ClickClaims, secret: string) {
  const encoded = Buffer.from(JSON.stringify(claims)).toString('base64url')
  return VERSION + '.' + encoded + '.' + sign(encoded, secret)
}

export function verifyClickToken(token: string, secret: string): ClickClaims {
  const [version, encoded, supplied] = token.split('.')
  if (version !== VERSION || !encoded || !supplied) throw new Error('Malformed token')

  const expected = Buffer.from(sign(encoded, secret), 'base64url')
  const actual = Buffer.from(supplied, 'base64url')
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new Error('Invalid signature')
  }

  const claims = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  assertAllowedAudience(claims.aud)
  assertPurpose(claims.purpose, 'marketing-attribution')
  assertNotExpired(claims.exp)
  return claims
}`,
    ),
    p(
      'Node’s timingSafeEqual can compare the signature bytes without an ordinary early-exit comparison, but the surrounding validation still needs careful bounds, parsing, error handling, and constant-behavior considerations. In a larger security surface, use a reviewed token library and restrict the accepted algorithm and key version explicitly.',
    ),
    h2('Resolve the token and redirect to a clean URL'),
    p(
      'Do not render the destination page with the token still present while third-party scripts, pixels, error reporters, or user interactions initialize. Send the email link to a first-party resolver. The resolver validates the token, stores the minimum permitted state, records a sanitized click event, and responds with a redirect whose Location contains no identifier.',
    ),
    code(
      'Email link shape',
      'text',
      'neutral',
      `Email URL
https://brand-a.example/r/email?t=<short-lived-token>&to=%2Farticles%2Fguide

Resolver validates:
- signature and key version
- expiration
- audience = brand-a.example
- purpose = marketing-attribution
- destination is a local allowlisted path
- optional jti revocation or replay policy

Resolver response
Set-Cookie: gl_attribution=<opaque-session-id>; HttpOnly; Secure; SameSite=Lax
Referrer-Policy: no-referrer
Cache-Control: no-store
Location: /articles/guide
Status: 303`,
    ),
    code(
      'app/r/email/route.ts',
      'typescript',
      'good',
      `import {cookies, headers} from 'next/headers'
import {NextResponse} from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('t')
  const destination = allowlistedLocalPath(url.searchParams.get('to'))
  if (!token || !destination) return new Response('Invalid link', {status: 400})

  const host = (await headers()).get('host')
  const claims = verifyClickToken(token, keyForVersion(token))
  if (claims.aud !== host) return new Response('Invalid audience', {status: 403})

  const attributionId = await createLimitedAttributionSession({
    contactKey: claims.sub,
    campaign: claims.campaign,
    tokenId: claims.jti,
    expiresAt: claims.exp,
  })

  const cookieStore = await cookies()
  cookieStore.set('gl_attribution', attributionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.min(claims.exp - currentUnixTime(), 60 * 60 * 24 * 7),
  })

  const response = NextResponse.redirect(new URL(destination, url.origin), 303)
  response.headers.set('Referrer-Policy', 'no-referrer')
  response.headers.set('Cache-Control', 'no-store')
  return response
}`,
    ),
    p(
      'Validate the destination against local paths or a strict allowlist. Accepting an arbitrary to parameter creates an open redirect that can lend your trusted domain to phishing links. Never reflect the token into the clean destination.',
    ),
    h2('Understand what the redirect cannot prevent'),
    p(
      'The token still appears in the initial request URL, so the edge, load balancer, hosting platform, and resolver can observe it. A redirect minimizes downstream exposure; it does not make URL tokens invisible. Configure request-log redaction, short retention, no-store responses, and restricted access. Never send complete resolver URLs to Sentry.',
    ),
    p(
      'A strict Referrer-Policy reduces referrer leakage from the resolver response. The clean destination should also use an appropriate site-wide policy. OWASP cautions that identifiers in URLs can appear in logs, history, bookmarks, referrer headers, and search systems. That is why the token must be limited even if the signature is strong.',
    ),
    h3('Use history replacement only as a fallback'),
    p(
      'If an existing application must land directly on a page with a query token, validate and exchange it before loading third-party scripts, then call history.replaceState with a clean URL. A server redirect is preferable because it removes the parameter before the destination document is rendered.',
    ),
    h2('Cookies do not cross unrelated domains'),
    p(
      'A cookie set by brand-a.example cannot become a first-party cookie on brand-b.example. For unrelated properties, route each link through the destination property’s resolver or through a central service that validates the token and immediately redirects to a site-specific one-time exchange. Do not try to create one permanent super-cookie for all brands.',
    ),
    bullet('Scope every cookie to the narrowest host and path that needs it.'),
    bullet('Make attribution sessions expire independently of the durable contact ID.'),
    bullet('Store an opaque session ID in the cookie, with contact mapping held server-side.'),
    bullet('Respect consent and regional policy before using the identifier for analytics or personalization.'),
    bullet('Provide a way to delete or reset first-party attribution state.'),
    h2('Design for forwarding and email scanners'),
    p(
      'Marketing messages are forwarded. Security products and email clients also prefetch or scan links. A GET request to the resolver may occur without the intended person actively clicking. Attribution should therefore tolerate scanner noise, and a resolver GET must not perform a sensitive irreversible action.',
    ),
    p(
      'For unsubscribe, account recovery, purchases, preference changes, or any privileged operation, display a confirmation page and require a deliberate POST or stronger authentication as appropriate. A one-time token can be consumed by a scanner before the user reaches it, so scanner behavior belongs in the product design rather than being treated as an edge case.',
    ),
    h2('Separate attribution from authentication'),
    p(
      'The attribution cookie can tell the application that this browser arrived from a campaign associated with contact usr_7T4M9Q6K. It should not automatically log the browser into that contact’s account. If the user later authenticates normally, the application may connect the anonymous attribution session to the authenticated account under its documented policy.',
    ),
    code(
      'Trust boundary',
      'text',
      'neutral',
      `Marketing attribution token may allow:
- campaign and source attribution
- low-risk content personalization
- prefilled non-sensitive preferences after confirmation

Marketing attribution token must not allow by itself:
- account login or session elevation
- access to private customer records
- changing email, password, billing, or security settings
- purchase approval
- exporting personal data
- acting as a permanent cross-site bearer credential`,
    ),
    h2('Rotate keys and bound replay'),
    p(
      'Include a key version in the token format. During rotation, mint with the current key and temporarily accept the current and previous verification keys. Remove the previous key after the longest token lifetime plus delivery delay. A leaked signing key requires immediate revocation and invalidation of tokens minted under that version.',
    ),
    p(
      'Decide whether a token may be used several times during its lifetime. Attribution links often need bounded replay because people reopen and forward email. Sensitive action links should generally be single-use. Store a hash of jti or a server-side redemption record when replay policy must be enforced.',
    ),
    h2('Log enough to investigate, not enough to recreate the leak'),
    p(
      'A click event can include the internal event ID, campaign, brand, token version, purpose, validation outcome, coarse client class, and a salted or keyed correlation value. Avoid the raw token, full email, complete URL, cookie, and HubSpot contact payload. Restrict access because even pseudonymous contact IDs can be personal data when the system can map them back to a person.',
    ),
    code(
      'Sanitized click event',
      'json',
      'good',
      `{
  "event": "marketing_link_resolved",
  "eventId": "click_evt_01J...",
  "brand": "brand_a",
  "campaign": "fall-newsletter-2026",
  "purpose": "marketing-attribution",
  "tokenVersion": "v1",
  "validation": "accepted",
  "contactCorrelation": "hmac:9d3f...",
  "destination": "/articles/guide"
}`,
    ),
    linkedP(
      'If this click leads to a HubSpot property update, emit a durable event rather than calling HubSpot from the resolver. Reuse ',
      'the transactional outbox and QStash pipeline',
      URLS.reliability,
      ' so click ingestion stays fast and repeated deliveries remain safe.',
    ),
    h2('Threat-model checklist'),
    bullet('What exact capability does possession of the token grant?'),
    bullet('Can a forwarded email incorrectly attribute or authorize another person?'),
    bullet('Can a scanner consume or trigger the link before a human clicks it?'),
    bullet('Can the token be replayed at another brand or for another purpose?'),
    bullet('Does the token survive longer than the business need?'),
    bullet('Which proxies, platforms, analytics tools, and error systems record the initial URL?'),
    bullet('Can an arbitrary destination turn the resolver into an open redirect?'),
    bullet('Can a user revoke or clear the established first-party state?'),
    bullet('Does any downstream code mistake attribution for authentication?'),
    bullet('Can keys rotate without breaking every email already delivered?'),
    h2('Implementation checklist'),
    bullet('Generate a random stable internal contact ID that is independent of email.'),
    bullet('Store that ID in a controlled HubSpot custom unique property.'),
    bullet('Mint short-lived, signed tokens with audience, purpose, expiry, and jti claims.'),
    bullet('Validate tokens in a first-party resolver and redirect to a clean allowlisted path.'),
    bullet('Set no-store and a strict referrer policy on resolver responses.'),
    bullet('Keep tokens, emails, and full URLs out of logs and Sentry.'),
    bullet('Use narrow HttpOnly, Secure, SameSite cookies with explicit expiration.'),
    bullet('Require confirmation or authentication for state-changing and privileged actions.'),
    bullet('Account for email forwarding, previews, and security scanners.'),
    bullet('Document consent, retention, deletion, key rotation, and incident procedures.'),
    h2('The safe version of the original idea'),
    p(
      'A stable HubSpot contact property is still useful, and email links can still reconnect a click with a known contact. The change is that the stable value is random rather than derived from email, the URL carries a limited signed claim rather than a permanent identity credential, and the destination receives a clean first-party session rather than keeping the token in every subsequent request.',
    ),
    linkedP(
      'Together with ',
      'the brand-routing model',
      URLS.routing,
      ', this design lets each property recognize the intended CRM contact without teaching every website how HubSpot IDs, email addresses, or subscription mappings work.',
    ),
    callout(
      'tip',
      'Pseudonymous is not anonymous',
      'An opaque identifier reduces direct disclosure, but if your systems can resolve it to a person, treat it as personal data. Limit purpose, access, retention, and propagation accordingly.',
    ),
  ],
}

await publishTechArticle(article)
