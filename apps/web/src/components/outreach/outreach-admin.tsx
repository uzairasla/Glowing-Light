"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Campaign = { id: string; name: string };
type Contact = { id: string; organization: string; email: string; city?: string; state?: string; status: string; last_contacted_at?: string };
type ImportContact = { key: string; organization: string; email: string; city: string; state: string; website: string; source_url: string; source_type: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizeHeader = (value: unknown) => String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

async function parseContactFile(file: File): Promise<ImportContact[]> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  let best: ImportContact[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: false });
    const headerIndex = rows.slice(0, 25).findIndex((row) => {
      const headers = row.map(normalizeHeader);
      return headers.includes("organization") && headers.includes("email");
    });
    if (headerIndex < 0) continue;

    const headerRow = rows[headerIndex];
    if (!headerRow) continue;
    const headers = headerRow.map(normalizeHeader);
    const column = (name: string) => headers.indexOf(name);
    const value = (row: unknown[], name: string) => {
      const index = column(name);
      return index >= 0 ? String(row[index] ?? "").trim() : "";
    };
    const parsed = rows.slice(headerIndex + 1).map((row, index) => ({
      key: `${sheetName}-${headerIndex + index + 2}`,
      organization: value(row, "organization"),
      email: value(row, "email").toLowerCase(),
      city: value(row, "city"),
      state: value(row, "state"),
      website: value(row, "website"),
      source_url: value(row, "sourceurl"),
      source_type: value(row, "sourcetype"),
    })).filter((row) => row.organization && EMAIL_PATTERN.test(row.email));
    if (parsed.length > best.length) best = parsed;
  }

  return Array.from(new Map(best.map((contact) => [contact.email, contact])).values()).slice(0, 500);
}

export function OutreachAdmin() {
  const [data, setData] = useState<{ contacts: Contact[]; campaigns: Campaign[] }>({ contacts: [], campaigns: [] });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [importContacts, setImportContacts] = useState<ImportContact[]>([]);
  const [selectedImportKeys, setSelectedImportKeys] = useState<Set<string>>(new Set());
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());
  const [campaignId, setCampaignId] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function load() {
    const response = await fetch("/api/admin/outreach", { cache: "no-store" });
    const payload = await response.json();
    if (response.ok) setData(payload); else setMessage(payload.error);
  }
  useEffect(() => { void load(); }, []);

  async function submit(path: string, payload: object) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      setMessage(response.ok ? JSON.stringify(result) : result.error);
      if (response.ok) await load();
      return response.ok ? result : null;
    } finally {
      setBusy(false);
    }
  }

  async function receiveFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setMessage("");
    try {
      const parsed = await parseContactFile(file);
      setFileName(file.name);
      setImportContacts(parsed);
      setSelectedImportKeys(new Set(parsed.map((contact) => contact.key)));
      setMessage(parsed.length ? `Loaded ${parsed.length} valid unique contacts from ${file.name}.` : "No rows with Organization and a valid Email were found.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The contact file could not be read.");
    } finally {
      setBusy(false);
    }
  }

  async function importSelected() {
    const selected = importContacts.filter((contact) => selectedImportKeys.has(contact.key)).map(({ key: _key, ...contact }) => contact);
    const result = await submit("/api/admin/outreach", { type: "contacts", contacts: selected });
    if (result?.contacts) setSelectedContactIds(new Set((result.contacts as Contact[]).filter((contact) => contact.status === "active" && !contact.last_contacted_at).slice(0, 20).map((contact) => contact.id)));
  }

  function toggleRecipient(id: string) {
    setSelectedContactIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else if (next.size < 20) next.add(id);
      return next;
    });
  }

  const activeContacts = data.contacts.filter((contact) => contact.status === "active");
  const uncontactedContacts = activeContacts.filter((contact) => !contact.last_contacted_at);
  const selectedImportCount = selectedImportKeys.size;

  return <div className="mt-10 grid gap-6">
    <section className="grid gap-4 md:grid-cols-3">
      <Card className="p-5"><p className="text-sm text-muted-foreground">Contacts</p><p className="mt-1 text-3xl font-bold">{data.contacts.length}</p></Card>
      <Card className="p-5"><p className="text-sm text-muted-foreground">Active</p><p className="mt-1 text-3xl font-bold">{activeContacts.length}</p></Card>
      <Card className="p-5"><p className="text-sm text-muted-foreground">Selected to send</p><p className="mt-1 text-3xl font-bold">{selectedContactIds.size}<span className="text-base font-normal text-muted-foreground"> / 20</span></p></Card>
    </section>
    {message ? <div className="rounded-xl border bg-white p-4 text-sm">{message}</div> : null}

    <Card className="p-6">
      <h2 className="text-2xl font-bold">1. Import contacts</h2>
      <p className="mt-2 text-sm text-muted-foreground">Drop an Excel, CSV, or TSV file. The dashboard finds the Organization and Email columns even when the workbook has title rows.</p>
      <input ref={fileInput} type="file" className="hidden" accept=".xlsx,.xls,.csv,.tsv" onChange={(event) => void receiveFile(event.target.files?.[0])} />
      <button type="button" className={`mt-5 flex min-h-40 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${dragging ? "border-primary bg-primary/5" : "border-border bg-secondary/30"}`} onClick={() => fileInput.current?.click()} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); void receiveFile(event.dataTransfer.files?.[0]); }}>
        <span className="text-lg font-bold">Drop your contact file here</span><span className="mt-2 text-sm text-muted-foreground">or click to choose .xlsx, .xls, .csv, or .tsv</span>{fileName ? <span className="mt-3 text-sm font-medium">{fileName}</span> : null}
      </button>
      {importContacts.length ? <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-semibold">Select rows to import ({selectedImportCount} of {importContacts.length})</p><div className="flex gap-2"><Button type="button" variant="secondary" onClick={() => setSelectedImportKeys(new Set(importContacts.map((contact) => contact.key)))}>Select all</Button><Button type="button" variant="secondary" onClick={() => setSelectedImportKeys(new Set())}>Clear</Button></div></div>
        <div className="mt-3 max-h-96 overflow-auto rounded-xl border"><table className="w-full text-left text-sm"><thead className="sticky top-0 bg-secondary"><tr><th className="p-3">Select</th><th className="p-3">Organization</th><th className="p-3">Email</th><th className="p-3">Location</th></tr></thead><tbody>{importContacts.map((contact) => <tr key={contact.key} className="border-t"><td className="p-3"><input type="checkbox" checked={selectedImportKeys.has(contact.key)} onChange={() => setSelectedImportKeys((current) => { const next = new Set(current); if (next.has(contact.key)) next.delete(contact.key); else next.add(contact.key); return next; })} aria-label={`Select ${contact.organization}`} /></td><td className="p-3 font-medium">{contact.organization}</td><td className="p-3">{contact.email}</td><td className="p-3">{[contact.city, contact.state].filter(Boolean).join(", ")}</td></tr>)}</tbody></table></div>
        <Button className="mt-4" disabled={busy || !selectedImportCount} onClick={() => void importSelected()}>Import {selectedImportCount} selected</Button>
      </div> : null}
    </Card>

    <Card className="p-6">
      <h2 className="text-2xl font-bold">2. Create campaign</h2>
      <form className="mt-5 grid gap-4" onSubmit={(event) => { event.preventDefault(); void submit("/api/admin/outreach", Object.fromEntries(new FormData(event.currentTarget))); }}>
        <div className="grid gap-2"><Label htmlFor="name">Internal name</Label><Input id="name" name="name" required /></div>
        <div className="grid gap-2"><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" placeholder="{{organization}} - a resource for thoughtful faith exploration" required /></div>
        <div className="rounded-xl border bg-secondary/40 p-4 text-sm"><p className="font-semibold">Available workbook merge fields</p><p className="mt-2 break-words font-mono text-xs text-muted-foreground">{"{{organization}} · {{email}} · {{city}} · {{state}} · {{website}} · {{source_url}} · {{source_type}}"}</p><p className="mt-2 text-xs text-muted-foreground">Use these in the subject or message body. Each recipient receives values from their own contact row.</p></div>
        <div className="grid gap-2"><Label htmlFor="preview_text">Preview text</Label><Input id="preview_text" name="preview_text" /></div>
        <div className="grid gap-2"><Label htmlFor="body_text">Message body</Label><Textarea id="body_text" name="body_text" className="min-h-48" required /></div>
        <div className="grid gap-4 md:grid-cols-2"><div className="grid gap-2"><Label htmlFor="call_to_action_url">Button URL</Label><Input id="call_to_action_url" name="call_to_action_url" type="url" defaultValue="https://theglowinglight.com/faith-leaders" /></div><div className="grid gap-2"><Label htmlFor="call_to_action_label">Button label</Label><Input id="call_to_action_label" name="call_to_action_label" defaultValue="Explore Glowing Light" /></div></div>
        <Button className="w-fit" disabled={busy}>Save draft</Button>
      </form>
    </Card>

    <Card className="p-6">
      <h2 className="text-2xl font-bold">3. Test, then send to selected contacts</h2>
      <p className="mt-2 text-sm text-muted-foreground">Choose up to 20 active contacts who have not been contacted before. Production sending remains locked until explicitly enabled.</p>
      <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-2"><div className="grid min-w-0 gap-2"><Label htmlFor="campaign">Campaign</Label><select id="campaign" className="min-h-11 w-full min-w-0 truncate rounded-xl border bg-white px-3" value={campaignId} onChange={(event) => setCampaignId(event.target.value)}><option value="">Select a campaign</option>{data.campaigns.map((campaign) => <option key={campaign.id} value={campaign.id} title={campaign.name}>{campaign.name}</option>)}</select></div><div className="grid min-w-0 gap-2"><Label htmlFor="test-email">Test recipient</Label><Input id="test-email" type="email" value={testEmail} onChange={(event) => setTestEmail(event.target.value)} /></div></div>
      <div className="mt-4 flex flex-wrap gap-3"><Button variant="secondary" disabled={busy || !campaignId || !testEmail} onClick={() => void submit("/api/admin/outreach/send", { campaignId, testEmail })}>Send test</Button><Button disabled={busy || !campaignId || !selectedContactIds.size} onClick={() => void submit("/api/admin/outreach/send", { campaignId, contactIds: Array.from(selectedContactIds) })}>Send to {selectedContactIds.size} selected</Button></div>
    </Card>

    <Card className="overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 p-6"><div><h2 className="text-2xl font-bold">Contacts</h2><p className="mt-1 text-sm text-muted-foreground">Select the exact recipients for the next campaign batch.</p></div><div className="flex gap-2"><Button variant="secondary" onClick={() => setSelectedContactIds(new Set(uncontactedContacts.slice(0, 20).map((contact) => contact.id)))}>Select next 20 uncontacted</Button><Button variant="secondary" onClick={() => setSelectedContactIds(new Set())}>Clear</Button></div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-secondary"><tr><th className="p-3">Send</th><th className="p-3">Organization</th><th className="p-3">Email</th><th className="p-3">Location</th><th className="p-3">Status</th><th className="p-3">Last contacted</th></tr></thead><tbody>{data.contacts.slice(0, 500).map((contact) => { const selected = selectedContactIds.has(contact.id); const selectable = contact.status === "active" && !contact.last_contacted_at && (selected || selectedContactIds.size < 20); return <tr key={contact.id} className={`border-t ${selected ? "bg-primary/5" : ""}`}><td className="p-3"><input type="checkbox" checked={selected} disabled={!selectable} onChange={() => toggleRecipient(contact.id)} aria-label={`Send to ${contact.organization}`} /></td><td className="p-3 font-medium">{contact.organization}</td><td className="p-3">{contact.email}</td><td className="p-3">{[contact.city, contact.state].filter(Boolean).join(", ")}</td><td className="p-3">{contact.status}</td><td className="p-3">{contact.last_contacted_at ? new Date(contact.last_contacted_at).toLocaleDateString() : "—"}</td></tr>; })}</tbody></table></div></Card>
  </div>;
}
