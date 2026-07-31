import { NextResponse } from "next/server";
import { createOutreachAdminClient, requireOutreachAdmin } from "@/lib/outreach/admin";

export async function GET() {
  if (!(await requireOutreachAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const supabase = createOutreachAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const [{ data: contacts, error: contactError }, { data: campaigns, error: campaignError }] = await Promise.all([
    supabase.from("outreach_contacts").select("*").order("organization").limit(500),
    supabase.from("outreach_campaigns").select("*, outreach_deliveries(status)").order("created_at", { ascending: false }).limit(25),
  ]);
  if (contactError || campaignError) return NextResponse.json({ error: contactError?.message || campaignError?.message }, { status: 500 });
  return NextResponse.json({ contacts, campaigns });
}

export async function POST(request: Request) {
  const admin = await requireOutreachAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const supabase = createOutreachAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const body = await request.json();
  if (body.type === "contacts") {
    const contacts = Array.isArray(body.contacts) ? body.contacts : [];
    if (!contacts.length || contacts.length > 500) return NextResponse.json({ error: "Provide 1-500 contacts." }, { status: 400 });
    const normalized = contacts.map((item: Record<string, unknown>) => ({
      organization: String(item.organization ?? "").trim(),
      email: String(item.email ?? "").trim().toLowerCase(),
      city: item.city || null, state: item.state || null, website: item.website || null,
      source_url: item.source_url || null, source_type: item.source_type || null,
    })).filter((item: { organization: string; email: string }) => item.organization && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email));
    const { error } = await supabase.from("outreach_contacts").upsert(normalized, { onConflict: "email" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ imported: normalized.length });
  }
  const campaign = {
    name: String(body.name ?? "").trim(),
    subject: String(body.subject ?? "").trim(),
    preview_text: String(body.preview_text ?? "").trim() || null,
    body_text: String(body.body_text ?? "").trim(),
    call_to_action_url: String(body.call_to_action_url ?? "").trim() || null,
    call_to_action_label: String(body.call_to_action_label ?? "").trim() || null,
    created_by: admin.id,
  };
  if (!campaign.name || !campaign.subject || !campaign.body_text) return NextResponse.json({ error: "Name, subject, and body are required." }, { status: 400 });
  const { data, error } = await supabase.from("outreach_campaigns").insert(campaign).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaign: data });
}
