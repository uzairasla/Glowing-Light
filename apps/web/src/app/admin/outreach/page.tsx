import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OutreachAdmin } from "@/components/outreach/outreach-admin";
import { Card } from "@/components/ui/card";
import { requireOutreachAdmin } from "@/lib/outreach/admin";

export const metadata: Metadata = { title: "Outreach administration", robots: { index: false, follow: false } };

export default async function OutreachAdminPage() {
  const requiredConfiguration = [
    ["NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
    ["SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY],
    ["OUTREACH_ADMIN_EMAILS", process.env.OUTREACH_ADMIN_EMAILS],
  ] as const;
  const missing = requiredConfiguration.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length) {
    return <main className="container py-14"><p className="text-sm font-bold uppercase tracking-wider text-gold">Private administration</p><h1 className="mt-2 font-serif text-5xl font-bold">Outreach setup required</h1><Card className="mt-8 max-w-3xl p-6"><p className="leading-7 text-muted-foreground">Add these variables to <code>apps/web/.env.local</code>, then restart the development server:</p><ul className="mt-5 list-disc space-y-2 pl-6 font-mono text-sm">{missing.map((name) => <li key={name}>{name}</li>)}</ul><p className="mt-6 text-sm text-muted-foreground">Resend variables are required before sending email, but not merely to open the dashboard.</p></Card></main>;
  }
  if (!(await requireOutreachAdmin())) redirect("/sign-in?next=/admin/outreach");
  return <main className="container py-14"><p className="text-sm font-bold uppercase tracking-wider text-gold">Private administration</p><h1 className="mt-2 font-serif text-5xl font-bold">Community outreach</h1><p className="mt-4 max-w-3xl text-muted-foreground">Prepare personal, accountable outreach to faith communities. Sending is intentionally gated and auditable.</p><OutreachAdmin /></main>;
}
