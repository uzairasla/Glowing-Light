import type { Metadata } from "next";
import { OnboardingSelector } from "@/components/onboarding-selector";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Choose your starting point and begin a guided learning journey.",
  alternates: { canonical: "/onboarding" },
};

export default function OnboardingPage() {
  return (
    <main className="container py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[.85fr_1.15fr]">
        <section>
          <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-gold">
            Start here
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-tight md:text-7xl">
            Where are you beginning?
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            You can explore without creating an account. Anonymous progress is stored
            locally until you choose to save or sync.
          </p>
        </section>
        <OnboardingSelector />
      </div>
    </main>
  );
}
