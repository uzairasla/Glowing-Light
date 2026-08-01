import { NextResponse } from "next/server";
import { createOutreachAdminClient, requireOutreachAdmin } from "@/lib/outreach/admin";
import { createUnsubscribeToken, sendWithResend } from "@/lib/outreach/resend";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!(await requireOutreachAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const campaignId = String(body.campaignId ?? "");
  const testEmail = body.testEmail ? String(body.testEmail) : "";
  const contactIds = Array.isArray(body.contactIds)
    ? Array.from(new Set<string>(body.contactIds.map(String).filter((id: string) => UUID_PATTERN.test(id)))).slice(0, 20)
    : [];

  if (!testEmail && process.env.OUTREACH_SENDING_ENABLED !== "true") return NextResponse.json({ error: "Sending is locked. Set OUTREACH_SENDING_ENABLED=true after reviewing a test." }, { status: 423 });
  if (!testEmail && !contactIds.length) return NextResponse.json({ error: "Select at least one active contact." }, { status: 400 });

  const supabase = createOutreachAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data: campaign } = await supabase.from("outreach_campaigns").select("*").eq("id", campaignId).single();
  if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  if (testEmail) {
    const token = createUnsubscribeToken(testEmail);
    const result = await sendWithResend({ to: testEmail, organization: "Test Organization", email: testEmail, city: "Chicago", state: "IL", website: "https://theglowinglight.com", source_url: "", source_type: "Test contact", subject: `[TEST] ${campaign.subject}`, previewText: campaign.preview_text, bodyText: campaign.body_text, ctaUrl: campaign.call_to_action_url, ctaLabel: campaign.call_to_action_label, unsubscribeUrl: `${siteUrl}/outreach/unsubscribe?email=${encodeURIComponent(testEmail)}&token=${token}` });
    return NextResponse.json({ test: true, id: result.id });
  }

  const { data: contacts } = await supabase.from("outreach_contacts").select("*").eq("status", "active").in("id", contactIds);
  const contactsById = new Map((contacts ?? []).map((contact) => [contact.id, contact]));
  const orderedContacts = contactIds.map((id) => contactsById.get(id)).filter((contact): contact is NonNullable<typeof contact> => Boolean(contact));
  const sent = [];
  const failed = [];

  for (const contact of orderedContacts) {
    const { data: existing } = await supabase.from("outreach_deliveries").select("id").eq("campaign_id", campaignId).eq("contact_id", contact.id).maybeSingle();
    if (existing) continue;
    const { data: delivery } = await supabase.from("outreach_deliveries").insert({ campaign_id: campaignId, contact_id: contact.id }).select().single();
    if (!delivery) {
      failed.push({ email: contact.email, error: "Could not create delivery record." });
      continue;
    }
    try {
      const token = createUnsubscribeToken(contact.email);
      const result = await sendWithResend({ to: contact.email, organization: contact.organization, email: contact.email, city: contact.city, state: contact.state, website: contact.website, source_url: contact.source_url, source_type: contact.source_type, subject: campaign.subject, previewText: campaign.preview_text, bodyText: campaign.body_text, ctaUrl: campaign.call_to_action_url, ctaLabel: campaign.call_to_action_label, unsubscribeUrl: `${siteUrl}/outreach/unsubscribe?email=${encodeURIComponent(contact.email)}&token=${token}` });
      await supabase.from("outreach_deliveries").update({ status: "sent", resend_email_id: result.id, sent_at: new Date().toISOString() }).eq("id", delivery.id);
      await supabase.from("outreach_contacts").update({ last_contacted_at: new Date().toISOString() }).eq("id", contact.id);
      sent.push({ email: contact.email, id: result.id });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      await supabase.from("outreach_deliveries").update({ status: "failed", error_message: message }).eq("id", delivery.id);
      failed.push({ email: contact.email, error: message });
    }
  }

  return NextResponse.json({ selected: contactIds.length, sent: sent.length, failed: failed.length, skipped: contactIds.length - sent.length - failed.length });
}
