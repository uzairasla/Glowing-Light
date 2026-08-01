import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const OUTREACH_SESSION_COOKIE = "gl_outreach_admin";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function sessionSignature(expiresAt: string) {
  const secret = process.env.OUTREACH_ADMIN_SESSION_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update(expiresAt).digest("hex");
}

export function verifyOutreachPassword(candidate: string) {
  const password = process.env.OUTREACH_ADMIN_PASSWORD;
  return Boolean(password && safeEqual(candidate, password));
}

export function createOutreachSession() {
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS);
  const signature = sessionSignature(expiresAt);
  if (!signature) throw new Error("OUTREACH_ADMIN_SESSION_SECRET is not configured.");
  return {
    name: OUTREACH_SESSION_COOKIE,
    value: `${expiresAt}.${signature}`,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: SESSION_DURATION_SECONDS,
      path: "/",
    },
  };
}

export async function requireOutreachAdmin() {
  const value = (await cookies()).get(OUTREACH_SESSION_COOKIE)?.value;
  if (!value) return false;
  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature || Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;
  const expected = sessionSignature(expiresAt);
  return Boolean(expected && safeEqual(signature, expected));
}

export function createOutreachAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
