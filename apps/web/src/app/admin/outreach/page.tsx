import type { Metadata } from "next";
import { OutreachAdmin } from "@/components/outreach/outreach-admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireOutreachAdmin } from "@/lib/outreach/admin";

export const metadata: Metadata = { title: "Outreach administration", robots: { index: false, follow: false } };

export default async function OutreachAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const requiredConfiguration = [
    ["NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL],
    ["SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY],
    ["OUTREACH_ADMIN_PASSWORD", process.env.OUTREACH_ADMIN_PASSWORD],
    ["OUTREACH_ADMIN_SESSION_SECRET", process.env.OUTREACH_ADMIN_SESSION_SECRET],
  ] as const;
  const missing = requiredConfiguration.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length) {
    return <main className="container py-14"><p className="text-sm font-bold uppercase tracking-wider text-gold">Private administration</p><h1 className="mt-2 font-serif text-5xl font-bold">Outreach setup required</h1><Card className="mt-8 max-w-3xl p-6"><p className="leading-7 text-muted-foreground">Add these server variables, then redeploy or restart the development server:</p><ul className="mt-5 list-disc space-y-2 pl-6 font-mono text-sm">{missing.map((name) => <li key={name}>{name}</li>)}</ul></Card></main>;
  }

  if (!(await requireOutreachAdmin())) {
    const { error } = await searchParams;
    return <main className="container py-14"><p className="text-sm font-bold uppercase tracking-wider text-gold">Private administration</p><h1 className="mt-2 font-serif text-5xl font-bold">Community outreach</h1><Card className="mt-8 max-w-md p-6"><form action="/api/admin/outreach/login" method="post" className="grid gap-4"><div className="grid gap-2"><Label htmlFor="password">Admin password</Label><Input id="password" name="password" type="password" autoComplete="current-password" required autoFocus /></div>{error === "invalid-password" ? <p className="text-sm text-red-700">The password was not accepted.</p> : null}<Button type="submit">Open dashboard</Button></form></Card></main>;
  }

  return <main className="container py-14"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-wider text-gold">Private administration</p><h1 className="mt-2 font-serif text-5xl font-bold">Community outreach</h1><p className="mt-4 max-w-3xl text-muted-foreground">Prepare personal, accountable outreach to faith communities. Sending is intentionally gated and auditable.</p></div><form action="/api/admin/outreach/logout" method="post"><Button type="submit" variant="secondary">Sign out</Button></form></div><OutreachAdmin /></main>;
}
