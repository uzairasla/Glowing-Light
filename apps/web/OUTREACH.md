# Resend outreach setup

1. Apply `packages/database/supabase/migrations/0002_outreach_campaigns.sql` to Supabase.
2. Verify the sending domain in Resend and configure its SPF and DKIM records.
3. Add the outreach variables from the repository `.env.example` to Vercel.
4. Generate `OUTREACH_UNSUBSCRIBE_SECRET` as a long random value.
5. Add `https://theglowinglight.com/api/resend/webhook` in Resend for delivered, opened, clicked, bounced, and complained events.
6. Sign in with an address in `OUTREACH_ADMIN_EMAILS`, then open `/admin/outreach`.
7. Paste the seven relevant columns from the researched workbook into the importer.
8. Create a campaign and send a test to yourself.
9. Only after reviewing the test, set `OUTREACH_SENDING_ENABLED=true`.

Batches are capped at 20. Duplicate campaign/contact deliveries are blocked. Unsubscribes,
bounces, and complaints automatically suppress future outreach.
