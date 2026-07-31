import { NextResponse } from "next/server";
import { createOutreachAdminClient, requireOutreachAdmin } from "@/lib/outreach/admin";
import { createUnsubscribeToken, sendWithResend } from "@/lib/outreach/resend";

export async function POST(request: Request) {
  if (!(await requireOutreachAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { campaignId, limit = 10, testEmail } = await request.json();
  if (!testEmail && process.env.OUTREACH_SENDING_ENABLED !== "true") return NextResponse.json({ error: "Sending is locked. Set OUTREACH_SENDING_ENABLED=true after reviewing a test." }, { status: 423 });
  const batchLimit = Math.min(Math.max(Number(limit) || 1, 1), 20);
  const supabase = createOutreachAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data: campaign } = await supabase.from("outreach_campaigns").select("*").eq("id", campaignId).single();
  if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  if (testEmail) {
    const token = createUnsubscribeToken(testEmail);
    const result = await sendWithResend({ to: testEmail, organization: "Test Organization", subject: `[TEST] ${campaign.subject}`, previewText: campaign.preview_text, bodyText: campaign.body_text, ctaUrl: campaign.call_to_action_url, ctaLabel: campaign.call_to_action_label, unsubscribeUrl: `${siteUrl}/outreach/unsubscribe?email=${encodeURIComponent(testEmail)}&token=${token}` });
    return NextResponse.json({ test: true, id: result.id });
  }
  const { data: contacts } = await supabase.from("outreach_contacts").select("*").eq("status", "active").order("last_contacted_at", { ascending: true, nullsFirst: true }).limit(batchLimit * 3);
  const sent = [];
  for (const contact of contacts ?? []) {
    const { data: existing } = await supabase.from("outreach_deliveries").select("id").eq("campaign_id", campaignId).eq("contact_id", contact.id).maybeSingle();
    if (existing || sent.length >= batchLimit) continue;
    const { data: delivery } = await supabase.from("outreach_deliveries").insert({ campaign_id: campaignId, contact_id: contact.id }).select().single();
    try {
      const token = createUnsubscribeToken(contact.email);
      const result = await sendWithResend({ to: contact.email, organization: contact.organization, subject: campaign.subject, previewText: campaign.preview_text, bodyText: campaign.body_text, ctaUrl: campaign.call_to_action_url, ctaLabel: campaign.call_to_action_label, unsubscribeUrl: `${siteUrl}/outreach/unsubscribe?email=${encodeURIComponent(contact.email)}&token=${token}` });
      await supabase.from("outreach_deliveries").update({ status: "sent", resend_email_id: result.id, sent_at: new Date().toISOString() }).eq("id", delivery.id);
      await supabase.from("outreach_contacts").update({ last_contacted_at: new Date().toISOString() }).eq("id", contact.id);
      sent.push({ email: contact.email, id: result.id });
    } catch (error) {
      await supabase.from("outreach_deliveries").update({ status: "failed", error_message: error instanceof Error ? error.message : "Unknown error" }).eq("id", delivery.id);
    }
  }
  return NextResponse.json({ sent: sent.length, batchLimit });
}
