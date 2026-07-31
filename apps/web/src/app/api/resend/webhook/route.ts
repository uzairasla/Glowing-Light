import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createOutreachAdminClient } from "@/lib/outreach/admin";

function validSignature(payload: string, id: string, timestamp: string, signature: string) {
  const secret = process.env.RESEND_WEBHOOK_SECRET?.replace(/^whsec_/, "");
  if (!secret) return false;
  const expected = createHmac("sha256", Buffer.from(secret, "base64")).update(`${id}.${timestamp}.${payload}`).digest("base64");
  return signature.split(" ").some((part) => {
    const candidate = part.replace(/^v1,/, "");
    return candidate.length === expected.length && timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
  });
}

export async function POST(request: Request) {
  const payload = await request.text();
  const id = request.headers.get("svix-id") ?? "";
  const timestamp = request.headers.get("svix-timestamp") ?? "";
  const signature = request.headers.get("svix-signature") ?? "";
  if (!validSignature(payload, id, timestamp, signature)) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  const event = JSON.parse(payload);
  const emailId = event.data?.email_id;
  const mapping = { "email.delivered": "delivered", "email.opened": "opened", "email.clicked": "clicked", "email.bounced": "bounced", "email.complained": "complained" } as const;
  const status = mapping[event.type as keyof typeof mapping];
  const supabase = createOutreachAdminClient();
  if (!supabase || !emailId || !status) return NextResponse.json({ received: true });
  const timestamps: Record<string, string> = {};
  if (["delivered","opened","clicked"].includes(status)) timestamps[`${status}_at`] = new Date().toISOString();
  const { data: delivery } = await supabase.from("outreach_deliveries").update({ status, ...timestamps }).eq("resend_email_id", emailId).select("contact_id").maybeSingle();
  if (delivery && ["bounced","complained"].includes(status)) await supabase.from("outreach_contacts").update({ status }).eq("id", delivery.contact_id);
  return NextResponse.json({ received: true });
}
