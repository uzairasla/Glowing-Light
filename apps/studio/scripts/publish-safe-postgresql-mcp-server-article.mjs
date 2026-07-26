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
  apiVersion: '2026-07-25',
  useCdn: false,
  token: session.authToken,
})

let key = 0
const block = (style, text) => ({_key: `b${++key}`, _type: 'block', style, markDefs: [], children: [{_key: `s${key}`, _type: 'span', marks: [], text}]})
const p = text => block('normal', text)
const linkedP = (prefix, linkText, href, suffix = '') => {
  const markKey = `m${++key}`
  return {
    _key: `b${key}`,
    _type: 'block',
    style: 'normal',
    markDefs: [{_key: markKey, _type: 'link', href}],
    children: [
      {_key: `s${key}a`, _type: 'span', marks: [], text: prefix},
      {_key: `s${key}b`, _type: 'span', marks: [markKey], text: linkText},
      {_key: `s${key}c`, _type: 'span', marks: [], text: suffix},
    ],
  }
}
const h2 = text => block('h2', text)
const h3 = text => block('h3', text)
const code = (filename, language, tone, value) => ({_key: `c${++key}`, _type: 'codeBlock', filename, language, tone, code: value})
const callout = (tone, title, body) => ({_key: `a${++key}`, _type: 'techCallout', tone, title, body})

const taxonomies = [
  {_id: 'tech-taxonomy-mcp', title: 'MCP', slug: 'mcp', description: 'Model Context Protocol servers, tools, clients, and production patterns.'},
  {_id: 'tech-taxonomy-postgresql', title: 'PostgreSQL', slug: 'postgresql', description: 'PostgreSQL application architecture, access control, and integrations.'},
]
for (const taxonomy of taxonomies) {
  await client.createIfNotExists({
    _id: taxonomy._id,
    _type: 'techTaxonomy',
    title: taxonomy.title,
    slug: {_type: 'slug', current: taxonomy.slug},
    description: taxonomy.description,
  })
}

const articleId = 'tech-article-safe-postgresql-mcp-server'
const existingCoverRef = await client.fetch(`*[_id == $articleId][0].coverImage.asset._ref`, {articleId})
const coverPath = join(dirname(fileURLToPath(import.meta.url)), '../../tech-blog/public/articles/safe-postgresql-mcp-server/cover.png')
const coverAsset = existingCoverRef
  ? {_id: existingCoverRef}
  : await client.assets.upload('image', createReadStream(coverPath), {
      filename: 'safe-postgresql-mcp-server.png',
      contentType: 'image/png',
    })

const article = {
  _id: articleId,
  _type: 'techArticle',
  title: 'How to Build a Safe PostgreSQL MCP Server—Without Exposing Arbitrary SQL',
  slug: {_type: 'slug', current: 'build-safe-postgresql-mcp-server'},
  description: 'A practical architecture for turning a reviewed PostgreSQL schema into typed MCP tools with least-privilege roles, strict inputs, bounded queries, and human approval.',
  kicker: 'MCP field guide 001',
  readTime: '18 min',
  difficulty: 'Intermediate',
  publishedAt: '2026-07-25T20:00:00.000Z',
  updatedAt: '2026-07-25T20:00:00.000Z',
  coverImage: {
    _type: 'image',
    asset: {_type: 'reference', _ref: coverAsset._id},
    alt: 'A database passes through a human approval gate and becomes three restricted MCP tools',
  },
  taxonomies: [
    {_key: 'mcp', _type: 'reference', _ref: 'tech-taxonomy-mcp'},
    {_key: 'postgresql', _type: 'reference', _ref: 'tech-taxonomy-postgresql'},
    {_key: 'debugging', _type: 'reference', _ref: 'tech-taxonomy-debugging'},
    {_key: 'guides', _type: 'reference', _ref: 'tech-taxonomy-guides'},
  ],
  seoTitle: 'Build a Safe PostgreSQL MCP Server Without Arbitrary SQL',
  seoDescription: 'Build a secure PostgreSQL MCP server with reviewed tool generation, separate credentials, least-privilege roles, Zod validation, bounded queries, and tests.',
  repositoryUrl: 'https://github.com/uzairasla/devfieldnotes-mcp-starter',
  testedVersions: [
    {_key: 'mcp-sdk', package: '@modelcontextprotocol/sdk', version: '1.29.0'},
    {_key: 'node', package: 'Node.js', version: '22+'},
    {_key: 'zod', package: 'Zod', version: '4.4.3'},
    {_key: 'postgres', package: 'PostgreSQL', version: '14+'},
  ],
  sourceUrls: [
    {_key: 'src1', title: 'MCP specification: Tools', url: 'https://modelcontextprotocol.io/specification/2025-11-25/server/tools'},
    {_key: 'src2', title: 'Official MCP TypeScript SDK', url: 'https://github.com/modelcontextprotocol/typescript-sdk'},
    {_key: 'src3', title: 'MCP authorization guidance', url: 'https://modelcontextprotocol.io/docs/tutorials/security/authorization'},
    {_key: 'src4', title: 'PostgreSQL privileges', url: 'https://www.postgresql.org/docs/current/ddl-priv.html'},
    {_key: 'src5', title: 'PostgreSQL row security policies', url: 'https://www.postgresql.org/docs/current/ddl-rowsecurity.html'},
  ],
  body: [
    p('A database-backed MCP server can be useful in a few dozen lines of TypeScript. It can also become an unusually efficient way to hand a language model more authority than you intended. The dangerous shortcut is a generic run_sql tool: accept a string, send it to PostgreSQL, and return whatever comes back. That design makes the model responsible for query safety, data scope, result size, and write behavior at the exact moment it is also trying to satisfy a user request.'),
    p('A safer server does not expose SQL. It exposes a small vocabulary of application actions such as customers_search, customers_get, and customers_create. Each tool has a fixed purpose, a strict input schema, approved identifiers, parameterized values, and a database role that can do only what that tool requires. The model chooses among those tools; it does not invent the database interface.'),
    callout('note', 'The boundary matters more than the protocol', 'MCP standardizes how clients discover and call tools. It does not decide which tables, columns, rows, or operations your server should expose. That authorization boundary remains your application’s responsibility.'),

    h2('Start with a threat model, not a tool handler'),
    p('Before writing code, list what an untrusted or mistaken caller must not be able to do. For a customer table, that might include reading password hashes, returning the entire table, searching arbitrary columns, changing more than one record, or using a runtime credential to inspect every schema. Translate each constraint into more than one enforcement layer.'),
    p('For example, hiding a sensitive column from the tool schema is useful, but the runtime database role should also lack permission to read it. Requiring an explicit customer ID in the MCP input is useful, but the repository query should also contain a primary-key predicate and reject a result count above one. Good boundaries overlap.'),
    h3('The architecture'),
    code('Security boundary', 'text', 'good', `DATABASE_DISCOVERY_URL
        |
        v
development-time schema discovery
        |
        v
human-reviewed allowlist
        |
        v
deterministic tool generation
        |
        v
typed MCP tools
        |
        v
DATABASE_RUNTIME_URL
        |
        v
parameterized PostgreSQL queries`),
    p('This separates a privileged development task—understanding the schema—from the long-lived process that serves tool calls. Discovery output is evidence for a developer to review, not permission for the runtime to expose everything it found.'),

    h2('Separate discovery credentials from runtime credentials'),
    p('Schema discovery needs metadata access. The running MCP server usually does not. Give each phase its own PostgreSQL role and connection string, and never allow the runtime URL to fall back to the discovery URL. A missing restricted credential should stop startup instead of silently widening access.'),
    code('.env', 'bash', 'good', `# Used only by the interactive discovery command
DATABASE_DISCOVERY_URL=postgresql://mcp_discovery:...@host/database

# Used by the long-lived MCP process
DATABASE_RUNTIME_URL=postgresql://mcp_runtime:...@host/database

DATABASE_SCHEMA=public
REQUEST_TIMEOUT_MS=10000`),
    p('In PostgreSQL, privileges can be granted at the database, schema, table, and column levels. Use that precision. Avoid making the runtime role an owner, superuser, or Supabase service-role equivalent. The generated allowlist narrows the application surface, but it does not replace PostgreSQL permissions or Row Level Security.'),
    code('least-privilege.sql', 'text', 'good', `create role mcp_runtime login password 'replace-me';
grant connect on database app_database to mcp_runtime;
grant usage on schema public to mcp_runtime;

grant select (id, name, email, created_at)
  on table public.customers to mcp_runtime;
grant insert (name, email)
  on table public.customers to mcp_runtime;`),
    callout('warning', 'Test as the runtime role', 'A query working in the Supabase SQL editor proves very little if the editor uses a privileged role. Run verification through the same restricted credential the MCP process will use.'),

    h2('Discover broadly, approve narrowly'),
    p('Automated discovery is valuable because hand-maintained schemas drift. But discovery should produce a review artifact, not mutate the live tool registry. A useful approval step shows every candidate entity and operation, readable and writable columns, likely sensitive fields, maximum row counts, and whether unfiltered search is allowed.'),
    p('New write operations should default to disabled. Views should remain read-only. Entities without a reliable single-column primary key should not receive get, update, or delete tools until their identity model is explicit. If a newly added table becomes callable merely because it appeared in public, discovery has become an escalation path.'),
    code('mcp.database.config.ts', 'typescript', 'good', `export default defineDatabaseConfig({
  schema: 'public',
  entities: {
    customers: {
      primaryKey: 'id',
      operations: {
        search: true,
        get: true,
        create: true,
        update: false,
        delete: false,
      },
      readableColumns: ['id', 'name', 'email', 'created_at'],
      searchableColumns: ['name', 'email'],
      creatableColumns: ['name', 'email'],
      maximumRows: 20,
      allowUnfilteredSearch: false,
    },
  },
})`),

    h2('Generate application tools, not a SQL console'),
    p('The approved configuration can now produce stable, table-specific tools. A search tool accepts only generated filters and search fields. A get tool accepts the known primary-key type. A create tool accepts only approved columns. Update and delete tools operate on one explicit record. Identifiers come from generated code, never from model input.'),
    p('This is a deliberate loss of flexibility. The model cannot improvise a join, query a new table, or select a hidden column. That is the point. Add a new capability by reviewing and shipping a new tool, not by hoping a prompt will constrain a universal query endpoint.'),
    code('generated tool input', 'typescript', 'good', `const CustomersSearchInput = z.object({
  query: z.string().trim().min(1).max(200).optional(),
  created_at: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(20).default(20),
  cursor: z.string().optional(),
}).refine(
  input => input.query || input.created_at,
  'At least one approved search condition is required',
)`),
    p('The official TypeScript SDK supports input schemas and structured tool results. Use the schema as an enforcement point, not merely as documentation. Reject unknown keys, cap string and array sizes, validate identifiers by type, and return predictable errors that help the model correct its call without revealing connection details.'),

    h2('Keep every query bounded and parameterized'),
    p('Parameterized values prevent user input from changing SQL structure. They do not make model-provided table or column names safe, because most PostgreSQL clients cannot parameterize identifiers. Keep identifiers inside reviewed generated code and parameterize only values.'),
    code('customer repository', 'typescript', 'good', `const result = await pool.query(
  \`select "id", "name", "email", "created_at"
   from "public"."customers"
   where "name" ilike $1 or "email" ilike $1
   order by "id"
   limit $2\`,
  [\`%\${query}%\`, Math.min(limit, 20)],
)`),
    p('Every list operation needs a hard server-side maximum, deterministic ordering, and pagination. Do not trust the model to request a modest limit. Add a request timeout and cancellation path so an expensive query cannot occupy a pooled connection indefinitely. Return a cursor rather than encouraging offset scans over an unbounded table.'),
    h3('Treat writes as a separate class'),
    p('MCP tool annotations can tell a client whether a tool is read-only, destructive, or idempotent, which helps clients present approval controls. They are hints, not enforcement. A write tool still needs a restricted role, explicit input fields, a one-record predicate where appropriate, and a host approval policy that asks before consequential actions.'),
    callout('tip', 'Prefer small tools with visible consequences', 'customers_create is easier to review than mutate_database. Specific names, narrow descriptions, and accurate read/write annotations give both the model and the human a clearer decision.'),

    h2('Design errors for correction without leakage'),
    p('A tool error should explain what the caller can change: an email is invalid, a customer was not found, a filter is required, or the request exceeded a limit. It should not echo a connection string, raw driver object, SQL statement with private values, or full stack trace. Log structured diagnostics to stderr for a local STDIO server so protocol messages on stdout remain clean.'),
    p('Redact credentials before logging configuration failures. Assign stable error codes to expected failures. Keep the detailed cause in operator logs and return a smaller corrective message to the model. Timeouts, aborted requests, permission errors, and validation errors should be distinguishable without exposing secrets.'),

    h2('Test the boundary, not just the happy path'),
    p('A server that returns one customer in a demo has not proven its safety model. Unit tests should attempt unknown fields, oversized limits, unfiltered searches, multi-row writes, invalid cursors, sensitive columns, timeouts, and database errors containing credential-like strings. Generation tests should prove that failed validation preserves the previous generated output.'),
    p('Keep PostgreSQL integration tests opt-in and run them against a disposable schema. Verify the runtime role itself: allowed reads succeed, hidden columns fail, disabled writes fail, and Row Level Security behaves as expected. Run the normal suite without production secrets so CI can validate the deterministic surface on every platform.'),
    code('verification loop', 'bash', 'neutral', `npm run doctor
npm run format:check
npm run typecheck
npm test
npm run build

# Against a disposable PostgreSQL database only
npm run test:integration`),

    h2('A practical first release'),
    p('Start with one entity and two or three tools. For the customer example, search, get, and create are enough to validate the full architecture: schema discovery, approval, type mapping, repository queries, tool registration, diagnostics, and permissions. Leave update and delete disabled until the product actually needs them and you have tested their approval experience.'),
    p('The Dev Fieldnotes PostgreSQL MCP Starter Kit packages this exact workflow: interactive schema discovery, a reviewed allowlist, deterministic TypeScript generation, separate runtime credentials, a doctor command, tests, Docker, and a small customer demo. It exists to save the setup work, not to remove the review step. You still decide which data and operations belong in your server.'),
    linkedP('If you want to start from this architecture instead of assembling it from scratch, explore the ', 'Dev Fieldnotes PostgreSQL MCP Starter Kit', 'https://devfieldnotes.dev/mcp-starter-kit', '. The product page documents the current private-beta scope, included safeguards, and launch list.'),

    h2('The rule to carry forward'),
    p('A safe database MCP server makes authority explicit. Discover the schema during development, require a human to approve the model-facing surface, generate narrow tools, run them with a restricted database role, parameterize every value, bound every result, and test the forbidden paths.'),
    p('The best MCP tool is not the one that can answer every possible database question. It is the smallest reliable capability that lets the model complete a real task without gaining accidental access to everything behind it.'),
  ],
}

const result = await client.createOrReplace(article)
const storedBody = await client.fetch(`*[_id == $articleId][0].body[]{markDefs}`, {articleId})
const storedKitLink = storedBody
  .flatMap(item => item.markDefs ?? [])
  .find(mark => mark.href === 'https://devfieldnotes.dev/mcp-starter-kit')?.href
if (storedKitLink !== 'https://devfieldnotes.dev/mcp-starter-kit') {
  throw new Error('Published article is missing the MCP Starter Kit link annotation')
}
console.log(JSON.stringify({published: {_id: result._id, slug: article.slug.current}, coverAsset: coverAsset._id, verifiedKitLink: storedKitLink}, null, 2))
