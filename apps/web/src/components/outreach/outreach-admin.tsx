"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Campaign = { id: string; name: string };
type Contact = { id: string; organization: string; email: string; city?: string; state?: string; status: string; last_contacted_at?: string };

function parseContacts(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(1).map((line) => {
    const [organization, email, city, state, website, source_url, source_type] = line.split("\t").map((cell) => cell.trim());
    return { organization, email, city, state, website, source_url, source_type };
  });
}

export function OutreachAdmin() {
  const [data, setData] = useState<{ contacts: Contact[]; campaigns: Campaign[] }>({ contacts: [], campaigns: [] });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [importText, setImportText] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [testEmail, setTestEmail] = useState("");

  async function load() {
    const response = await fetch("/api/admin/outreach", { cache: "no-store" });
    const payload = await response.json();
    if (response.ok) setData(payload); else setMessage(payload.error);
  }
  useEffect(() => { void load(); }, []);

  async function submit(path: string, payload: object) {
    setBusy(true); setMessage("");
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    setMessage(response.ok ? JSON.stringify(result) : result.error);
    setBusy(false);
    if (response.ok) await load();
  }

  return <div className="mt-10 grid gap-6">
    <section className="grid gap-4 md:grid-cols-3">
      <Card className="p-5"><p className="text-sm text-muted-foreground">Contacts</p><p className="mt-1 text-3xl font-bold">{data.contacts.length}</p></Card>
      <Card className="p-5"><p className="text-sm text-muted-foreground">Active</p><p className="mt-1 text-3xl font-bold">{data.contacts.filter((c) => c.status === "active").length}</p></Card>
      <Card className="p-5"><p className="text-sm text-muted-foreground">Suppressed</p><p className="mt-1 text-3xl font-bold">{data.contacts.filter((c) => c.status !== "active").length}</p></Card>
    </section>
    {message ? <div className="rounded-xl border bg-white p-4 text-sm">{message}</div> : null}
    <Card className="p-6">
      <h2 className="text-2xl font-bold">1. Import contacts</h2>
      <p className="mt-2 text-sm text-muted-foreground">Paste tab-separated workbook rows with: Organization, Email, City, State, Website, Source URL, Source type.</p>
      <Textarea className="mt-4 min-h-36 font-mono text-xs" value={importText} onChange={(event) => setImportText(event.target.value)} placeholder={"Organization\tEmail\tCity\tState\tWebsite\tSource URL\tSource type"} />
      <Button className="mt-4" disabled={busy || !importText.trim()} onClick={() => submit("/api/admin/outreach", { type: "contacts", contacts: parseContacts(importText) })}>Import contacts</Button>
    </Card>
    <Card className="p-6">
      <h2 className="text-2xl font-bold">2. Create campaign</h2>
      <form className="mt-5 grid gap-4" onSubmit={(event) => { event.preventDefault(); void submit("/api/admin/outreach", Object.fromEntries(new FormData(event.currentTarget))); }}>
        <div className="grid gap-2"><Label htmlFor="name">Internal name</Label><Input id="name" name="name" required /></div>
        <div className="grid gap-2"><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" placeholder="{{organization}} - a resource for thoughtful faith exploration" required /></div>
        <div className="grid gap-2"><Label htmlFor="preview_text">Preview text</Label><Input id="preview_text" name="preview_text" /></div>
        <div className="grid gap-2"><Label htmlFor="body_text">Message body</Label><Textarea id="body_text" name="body_text" className="min-h-48" required /></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="grid gap-2"><Label htmlFor="call_to_action_url">Button URL</Label><Input id="call_to_action_url" name="call_to_action_url" type="url" defaultValue="https://theglowinglight.com/faith-leaders" /></div><div className="grid gap-2"><Label htmlFor="call_to_action_label">Button label</Label><Input id="call_to_action_label" name="call_to_action_label" defaultValue="Explore Glowing Light" /></div></div>
        <Button className="w-fit" disabled={busy}>Save draft</Button>
      </form>
    </Card>
    <Card className="p-6">
      <h2 className="text-2xl font-bold">3. Test, then send a batch</h2>
      <p className="mt-2 text-sm text-muted-foreground">Production batches are capped at 20. Sending stays locked until explicitly enabled.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2"><div className="grid gap-2"><Label htmlFor="campaign">Campaign</Label><select id="campaign" className="min-h-11 rounded-xl border bg-white px-3" value={campaignId} onChange={(event) => setCampaignId(event.target.value)}><option value="">Select a campaign</option>{data.campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select></div><div className="grid gap-2"><Label htmlFor="test-email">Test recipient</Label><Input id="test-email" type="email" value={testEmail} onChange={(event) => setTestEmail(event.target.value)} /></div></div>
      <div className="mt-4 flex flex-wrap gap-3"><Button variant="secondary" disabled={busy || !campaignId || !testEmail} onClick={() => submit("/api/admin/outreach/send", { campaignId, testEmail })}>Send test</Button><Button disabled={busy || !campaignId} onClick={() => submit("/api/admin/outreach/send", { campaignId, limit: 10 })}>Send next 10</Button></div>
    </Card>
    <Card className="overflow-hidden"><div className="p-6"><h2 className="text-2xl font-bold">Contacts</h2></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-secondary"><tr><th className="p-3">Organization</th><th className="p-3">Email</th><th className="p-3">Location</th><th className="p-3">Status</th><th className="p-3">Last contacted</th></tr></thead><tbody>{data.contacts.slice(0, 150).map((contact) => <tr key={contact.id} className="border-t"><td className="p-3 font-medium">{contact.organization}</td><td className="p-3">{contact.email}</td><td className="p-3">{[contact.city, contact.state].filter(Boolean).join(", ")}</td><td className="p-3">{contact.status}</td><td className="p-3">{contact.last_contacted_at ? new Date(contact.last_contacted_at).toLocaleDateString() : "—"}</td></tr>)}</tbody></table></div></Card>
  </div>;
}
