create table if not exists public.outreach_contacts (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  email text not null,
  city text,
  state text,
  website text,
  source_url text,
  source_type text,
  status text not null default 'active',
  last_contacted_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint outreach_contacts_email_unique unique (email),
  constraint outreach_contacts_status_check
    check (status in ('active', 'unsubscribed', 'bounced', 'complained', 'paused'))
);

create table if not exists public.outreach_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  preview_text text,
  body_text text not null,
  call_to_action_url text,
  call_to_action_label text,
  status text not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint outreach_campaigns_status_check
    check (status in ('draft', 'ready', 'sending', 'paused', 'completed'))
);

create table if not exists public.outreach_deliveries (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.outreach_campaigns(id) on delete cascade,
  contact_id uuid not null references public.outreach_contacts(id) on delete cascade,
  resend_email_id text,
  status text not null default 'queued',
  error_message text,
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint outreach_deliveries_status_check
    check (status in ('queued', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'complained', 'failed', 'suppressed')),
  constraint outreach_deliveries_campaign_contact_unique unique (campaign_id, contact_id)
);

create index if not exists outreach_contacts_status_idx on public.outreach_contacts(status);
create index if not exists outreach_deliveries_campaign_status_idx
  on public.outreach_deliveries(campaign_id, status);
create unique index if not exists outreach_deliveries_resend_email_id_idx
  on public.outreach_deliveries(resend_email_id)
  where resend_email_id is not null;

create trigger outreach_contacts_set_updated_at
before update on public.outreach_contacts
for each row execute function public.set_updated_at();

create trigger outreach_campaigns_set_updated_at
before update on public.outreach_campaigns
for each row execute function public.set_updated_at();

create trigger outreach_deliveries_set_updated_at
before update on public.outreach_deliveries
for each row execute function public.set_updated_at();

alter table public.outreach_contacts enable row level security;
alter table public.outreach_campaigns enable row level security;
alter table public.outreach_deliveries enable row level security;

-- No browser policies are intentional. Access is restricted to server routes using
-- the service-role client after an administrator allowlist check.
