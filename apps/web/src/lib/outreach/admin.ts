import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth/session";

export function getOutreachAdminEmails() {
  return new Set(
    (process.env.OUTREACH_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function requireOutreachAdmin() {
  if (process.env.NODE_ENV !== "production") {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      email: "local-outreach-admin@localhost",
    };
  }

  const user = await getCurrentUser();
  if (!user?.email || !getOutreachAdminEmails().has(user.email.toLowerCase())) {
    return null;
  }
  return user;
}

export function createOutreachAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
