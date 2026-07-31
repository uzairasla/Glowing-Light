import { NextResponse } from "next/server";
import { createOutreachAdminClient } from "@/lib/outreach/admin";
import { verifyUnsubscribeToken } from "@/lib/outreach/resend";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") ?? "";
  const token = url.searchParams.get("token") ?? "";
  if (!email || !verifyUnsubscribeToken(email, token)) return new NextResponse("Invalid unsubscribe link.", { status: 400 });
  const supabase = createOutreachAdminClient();
  await supabase?.from("outreach_contacts").update({ status: "unsubscribed" }).eq("email", email.toLowerCase());
  return new NextResponse("This address has been removed from Glowing Light outreach. You will not be contacted again.", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
