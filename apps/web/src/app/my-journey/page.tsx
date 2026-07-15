import type { Metadata } from "next";
import { AuthPrompt } from "@/components/auth/auth-prompt";
import { JourneyCard } from "@/components/journey-card";
import { getCurrentUser } from "@/lib/auth/session";
import { journeys } from "@/lib/content";

export const metadata: Metadata = {
  title: "My Journey",
  alternates: { canonical: "/my-journey" },
};

export default async function MyJourneyPage() {
  const user = await getCurrentUser();
  const journey = journeys[1];

  return (
    <main className="container py-16">
      <h1 className="font-serif text-5xl font-bold md:text-7xl">My Journey</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
        Placeholder authenticated journey state. This will read durable progress from Supabase.
      </p>
      {!user ? (
        <div className="mt-10">
          <AuthPrompt
            title="Sign in to sync your journey"
            description="Anonymous progress can stay local for now. Sign in when you want durable progress tracking."
            next="/my-journey"
          />
        </div>
      ) : null}
      {user ? (
      <div className="mt-10 max-w-xl">
        {journey ? <JourneyCard journey={journey} index={1} /> : null}
      </div>
      ) : null}
    </main>
  );
}
