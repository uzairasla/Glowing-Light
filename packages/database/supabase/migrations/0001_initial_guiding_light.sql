create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  journey_stage text,
  religious_background text,
  preferred_lesson_length integer,
  preferred_content_type text,
  timezone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_preferred_lesson_length_check
    check (preferred_lesson_length is null or preferred_lesson_length between 5 and 60)
);

create table if not exists public.user_journeys (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  journey_id text not null,
  status text not null default 'in_progress',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  last_lesson_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_journeys_status_check
    check (status in ('not_started', 'in_progress', 'completed'))
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  journey_id text not null,
  lesson_id text not null,
  status text not null default 'not_started',
  progress_percent integer not null default 0,
  last_position integer,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint lesson_progress_status_check
    check (status in ('not_started', 'in_progress', 'completed')),
  constraint lesson_progress_percent_check
    check (progress_percent between 0 and 100),
  constraint lesson_progress_unique_lesson
    unique (profile_id, journey_id, lesson_id)
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  content_type text not null,
  content_id text not null,
  created_at timestamptz not null default now(),
  constraint bookmarks_content_type_check
    check (content_type in ('lesson', 'question', 'article', 'scripture_passage', 'video')),
  constraint bookmarks_unique_content
    unique (profile_id, content_type, content_id)
);

create table if not exists public.question_submissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  anonymous_id text,
  question text not null,
  category text,
  status text not null default 'submitted',
  is_anonymous boolean not null default true,
  submitted_from text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint question_submissions_status_check
    check (status in ('submitted', 'under_review', 'answered', 'published', 'closed')),
  constraint question_submissions_identity_check
    check (
      (profile_id is not null and is_anonymous = false)
      or (is_anonymous = true)
    )
);

create table if not exists public.notification_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  daily_lesson_enabled boolean not null default false,
  weekly_summary_enabled boolean not null default true,
  question_answered_enabled boolean not null default true,
  email_frequency text not null default 'weekly',
  preferred_send_time time,
  updated_at timestamptz not null default now(),
  constraint notification_preferences_frequency_check
    check (email_frequency in ('daily', 'weekly', 'important_only', 'off'))
);

create table if not exists public.email_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscription_type text not null,
  status text not null default 'pending',
  source text,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint email_subscriptions_status_check
    check (status in ('pending', 'confirmed', 'unsubscribed', 'bounced'))
);

create table if not exists public.content_feedback (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  content_type text not null,
  content_id text not null,
  feedback_type text not null,
  message text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  constraint content_feedback_content_type_check
    check (content_type in ('lesson', 'question', 'article', 'scripture_passage', 'video')),
  constraint content_feedback_type_check
    check (feedback_type in ('unclear', 'source_question', 'possible_error', 'technical_issue', 'suggestion')),
  constraint content_feedback_status_check
    check (status in ('submitted', 'under_review', 'resolved', 'closed'))
);

create index if not exists user_journeys_profile_id_idx on public.user_journeys(profile_id);
create unique index if not exists user_journeys_profile_journey_unique_idx
on public.user_journeys(profile_id, journey_id);
create index if not exists lesson_progress_profile_id_idx on public.lesson_progress(profile_id);
create index if not exists bookmarks_profile_id_idx on public.bookmarks(profile_id);
create index if not exists question_submissions_profile_id_idx on public.question_submissions(profile_id);
create index if not exists content_feedback_profile_id_idx on public.content_feedback(profile_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger user_journeys_set_updated_at
before update on public.user_journeys
for each row execute function public.set_updated_at();

create trigger question_submissions_set_updated_at
before update on public.question_submissions
for each row execute function public.set_updated_at();

create trigger notification_preferences_set_updated_at
before update on public.notification_preferences
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', null))
  on conflict (id) do nothing;

  insert into public.notification_preferences (profile_id)
  values (new.id)
  on conflict (profile_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_journeys enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.question_submissions enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.email_subscriptions enable row level security;
alter table public.content_feedback enable row level security;

create policy "Profiles are readable by owner"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Profiles are insertable by owner"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "Profiles are updatable by owner"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "User journeys are readable by owner"
on public.user_journeys for select
to authenticated
using (profile_id = auth.uid());

create policy "User journeys are insertable by owner"
on public.user_journeys for insert
to authenticated
with check (profile_id = auth.uid());

create policy "User journeys are updatable by owner"
on public.user_journeys for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

create policy "User journeys are deletable by owner"
on public.user_journeys for delete
to authenticated
using (profile_id = auth.uid());

create policy "Lesson progress is readable by owner"
on public.lesson_progress for select
to authenticated
using (profile_id = auth.uid());

create policy "Lesson progress is insertable by owner"
on public.lesson_progress for insert
to authenticated
with check (profile_id = auth.uid());

create policy "Lesson progress is updatable by owner"
on public.lesson_progress for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

create policy "Lesson progress is deletable by owner"
on public.lesson_progress for delete
to authenticated
using (profile_id = auth.uid());

create policy "Bookmarks are readable by owner"
on public.bookmarks for select
to authenticated
using (profile_id = auth.uid());

create policy "Bookmarks are insertable by owner"
on public.bookmarks for insert
to authenticated
with check (profile_id = auth.uid());

create policy "Bookmarks are deletable by owner"
on public.bookmarks for delete
to authenticated
using (profile_id = auth.uid());

create policy "Authenticated question submissions are readable by owner"
on public.question_submissions for select
to authenticated
using (profile_id = auth.uid());

create policy "Authenticated users can submit own questions"
on public.question_submissions for insert
to authenticated
with check (
  (profile_id = auth.uid() and is_anonymous = false)
  or (is_anonymous = true)
);

create policy "Anonymous users can submit anonymous questions"
on public.question_submissions for insert
to anon
with check (profile_id is null and is_anonymous = true);

create policy "Question submissions are updatable by owner while submitted"
on public.question_submissions for update
to authenticated
using (profile_id = auth.uid() and status = 'submitted')
with check (profile_id = auth.uid());

create policy "Notification preferences are readable by owner"
on public.notification_preferences for select
to authenticated
using (profile_id = auth.uid());

create policy "Notification preferences are insertable by owner"
on public.notification_preferences for insert
to authenticated
with check (profile_id = auth.uid());

create policy "Notification preferences are updatable by owner"
on public.notification_preferences for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

create policy "Anyone can create email subscriptions"
on public.email_subscriptions for insert
to anon, authenticated
with check (status = 'pending');

create policy "Authenticated feedback is readable by owner"
on public.content_feedback for select
to authenticated
using (profile_id = auth.uid());

create policy "Authenticated users can submit own feedback"
on public.content_feedback for insert
to authenticated
with check (profile_id = auth.uid() or profile_id is null);

create policy "Anonymous users can submit feedback without profile"
on public.content_feedback for insert
to anon
with check (profile_id is null);
