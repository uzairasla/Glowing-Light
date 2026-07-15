create unique index if not exists user_journeys_profile_journey_unique_idx
on public.user_journeys(profile_id, journey_id);
