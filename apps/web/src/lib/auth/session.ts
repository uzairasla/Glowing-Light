import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthUser = {
  id: string;
  email: string | null;
};

export type UserProfile = {
  id: string;
  display_name: string | null;
  journey_stage: string | null;
  religious_background: string | null;
  preferred_lesson_length: number | null;
  preferred_content_type: string | null;
  timezone: string | null;
  created_at: string;
  updated_at: string;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select(
      "id, display_name, journey_stage, religious_background, preferred_lesson_length, preferred_content_type, timezone, created_at, updated_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile) {
    return existingProfile as UserProfile;
  }

  const { data: createdProfile } = await supabase
    .from("profiles")
    .insert({ id: user.id })
    .select(
      "id, display_name, journey_stage, religious_background, preferred_lesson_length, preferred_content_type, timezone, created_at, updated_at",
    )
    .single();

  return (createdProfile as UserProfile | null) ?? null;
}
