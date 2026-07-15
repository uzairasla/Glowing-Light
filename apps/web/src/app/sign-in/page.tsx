import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { Card } from "@/components/ui/card";

type Props = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Guiding Light with a secure email magic link.",
  alternates: { canonical: "/sign-in" },
};

const errorMessages: Record<string, string> = {
  "missing-code": "That sign-in link is missing its verification code. Please request a fresh link.",
  "auth-callback": "We could not complete sign-in from that link. Please request a fresh link.",
  "supabase-not-configured": "Supabase is not configured yet for this environment.",
};

export default async function SignInPage({ searchParams }: Props) {
  const { next, error } = await searchParams;
  const redirectTo = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  return (
    <main className="container py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <section>
          <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-gold">
            Save your progress
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-tight md:text-7xl">
            Sign in with email
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            You can explore Guiding Light without an account. Sign in when you want to save progress, bookmarks, question status, and email preferences.
          </p>
          <div className="mt-8 rounded-2xl border border-teal-100 bg-teal-50/80 p-5 text-sm leading-6 text-teal-950">
            <div className="mb-2 flex items-center gap-2 font-bold">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Private by default
            </div>
            Authentication uses Supabase email magic links. Do not send private questions, religious background, or reflections to analytics.
          </div>
        </section>
        <Card className="p-6 md:p-8">
          {error ? (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
              {errorMessages[error] ?? "Something went wrong. Please try again."}
            </div>
          ) : null}
          <MagicLinkForm redirectTo={redirectTo} />
        </Card>
      </div>
    </main>
  );
}
