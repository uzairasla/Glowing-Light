# Guiding Light

Guiding Light is a modern faith-guidance platform for people questioning religion, exploring Islam, and new Muslims who need a compassionate step-by-step path.

## Repository Structure

```text
apps/
  web/        Next.js App Router application
  studio/     Sanity Studio

packages/
  database/          Supabase SQL migrations and notes
  learning-engine/   Editorial journey definitions and lookup helpers
  schemas/           Sanity schema definitions
  types/             Shared TypeScript domain types
  validation/        Shared Zod schemas for forms and settings
```

Sanity stores what everyone reads. Supabase stores what each user does. Sanity document IDs are stored as text in Supabase; there are no cross-system foreign keys.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The web app runs from `apps/web`. The Sanity Studio runs from `apps/studio`.

## Required Environment Variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Web | Canonical URLs and metadata |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Web, Studio | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Web, Studio | Sanity dataset |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Web, Studio | GROQ API version |
| `SANITY_API_READ_TOKEN` | Web | Optional private content reads |
| `NEXT_PUBLIC_SUPABASE_URL` | Web | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Web | Supabase browser/server anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server jobs only | Administrative Supabase tasks |
| `NEXT_PUBLIC_POSTHOG_KEY` | Web | Privacy-safe product analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | Web | PostHog ingestion host |
| `RESEND_API_KEY` | Server | Transactional email |
| `RESEND_FROM_EMAIL` | Server | Sender address |

## Database

Initial Supabase migrations live in `packages/database/supabase/migrations`.

Apply them with the Supabase CLI from `packages/database`:

```bash
supabase db push
```

The migration enables Row Level Security and creates policies so authenticated users can only read and modify their own private records. Anonymous inserts are allowed only for question submissions, email subscriptions, and content feedback where appropriate.

## Authentication

The web app uses Supabase Auth email magic links. Configure these values for `apps/web`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

In Supabase Auth settings, add these redirect URLs for local development:

```text
http://localhost:3000/auth/callback
http://127.0.0.1:3000/auth/callback
```

The sign-in page is `/sign-in`. The callback route exchanges Supabase auth codes at `/auth/callback`, and sign-out posts to `/auth/sign-out`.

## Content

The first implementation uses realistic placeholder content in the web app and editorial schemas in Sanity. Religious content should not be treated as approved until its Sanity `reviewStatus`, `reviewers`, `sources`, and `lastReviewedAt` fields are complete.

## Analytics

PostHog is initialized only when `NEXT_PUBLIC_POSTHOG_KEY` is set. The helper in `apps/web/src/lib/analytics/events.ts` only permits the approved event names and does not accept free-form question text, email addresses, private reflections, or sensitive onboarding details.

Session recording is disabled initially.
