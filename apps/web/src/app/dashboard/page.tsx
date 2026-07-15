import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, Mail, MessageCircleQuestion } from "lucide-react";
import { AnonymousProgressSync } from "@/components/auth/anonymous-progress-sync";
import { AuthPrompt } from "@/components/auth/auth-prompt";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard",
  alternates: { canonical: "/dashboard" },
};

const panels = [
  { icon: Bookmark, title: "Recently saved", text: "No saved content yet." },
  {
    icon: MessageCircleQuestion,
    title: "Question status",
    text: "Anonymous questions will appear after account sync.",
  },
  { icon: Mail, title: "Email preferences", text: "Weekly summary enabled by default." },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;

  return (
    <main className="container py-16">
      <h1 className="font-serif text-5xl font-bold md:text-7xl">Dashboard</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
        A calm overview for progress, saved content, question status, and preferences.
      </p>
      {!user ? (
        <div className="mt-10">
          <AuthPrompt
            title="Sign in to save your journey"
            description="You can keep exploring without an account. Sign in when you want progress, bookmarks, question status, and preferences to sync."
            next="/dashboard"
          />
        </div>
      ) : null}
      {user ? (
        <AnonymousProgressSync />
      ) : null}
      {user ? (
      <section className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="p-6">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-gold">
            Current journey
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {profile?.journey_stage ? profile.journey_stage.replaceAll("-", " ") : "Exploring Islam"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            Next recommended lesson: The meaning of Tawhid
          </p>
          <div className="mt-6">
            <Progress value={28} />
          </div>
          <Button asChild className="mt-6">
            <Link href="/my-journey">Continue learning</Link>
          </Button>
        </Card>
        <div className="grid gap-5">
          {panels.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-5">
              <Icon className="mb-3 size-5 text-teal" aria-hidden="true" />
              <h2 className="font-bold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
      </section>
      ) : null}
    </main>
  );
}
