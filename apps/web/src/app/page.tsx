import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { JourneyCard } from "@/components/journey-card";
import { JsonLd } from "@/components/json-ld";
import { ProductPreview } from "@/components/product-preview";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getJourneys, getPublicQuestions } from "@/lib/content";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Guided Learning for Sincere Seekers",
  description:
    "Guiding Light offers structured journeys, reviewed answers, and private question submission for people questioning religion, exploring Islam, and new Muslims.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Guiding Light",
    description:
      "Structured faith guidance with privacy, compassion, and source-backed content.",
    url: "/",
  },
};

export default async function HomePage() {
  const journeys = await getJourneys();
  const publicQuestions = await getPublicQuestions();

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Guiding Light",
          url: env.NEXT_PUBLIC_SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${env.NEXT_PUBLIC_SITE_URL}/questions?query={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <section className="container pb-14 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-teal-900">
            <span className="size-2 rotate-45 rounded-[2px] bg-gold" />
            Guided faith learning
          </div>
          <h1 className="font-serif text-5xl font-bold leading-[0.98] tracking-normal text-balance md:text-7xl lg:text-8xl">
            Guidance for <span className="text-teal">every step.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
            A welcoming web platform for people questioning religion, exploring Islam, or beginning life as a new Muslim, built around trusted learning, private questions, and structured journeys.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start your journey
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/questions">Browse questions</Link>
            </Button>
          </div>
        </div>
        <div className="mt-12">
          <ProductPreview />
        </div>
      </section>

      <section className="container py-20">
        <SectionHeading
          kicker="Learning journeys"
          title="Three paths, each editorially approved."
          description="The journey structure is predefined and reviewable in Sanity, giving users personalized guidance without turning religious answers over to unrestricted generation."
          align="center"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {journeys.map((journey, index) => (
            <JourneyCard key={journey.id} journey={journey} index={index} />
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#075961] to-navy py-20 text-white">
        <div className="container">
          <p className="mx-auto max-w-5xl text-center font-serif text-3xl leading-relaxed md:text-5xl">
            The product should feel like a compassionate guide: clear enough for doubt, grounded enough for trust, and private enough for vulnerable questions.
          </p>
        </div>
      </section>

      <section className="container pb-20 pt-16 md:pt-20">
        <div className="grid gap-8 rounded-[2rem] border border-amber-200 bg-white p-7 shadow-soft md:grid-cols-[1.15fr_.85fr] md:p-10">
          <div>
            <SectionHeading
              kicker="Reviewed questions"
              title="Public answers with visible trust signals."
              description="Every religious answer should make its review state, sources, reviewer, and last-reviewed date obvious. Placeholder content is clearly labeled until approved."
            />
          </div>
          <div className="space-y-3">
            {publicQuestions.map((question) => (
              <Link
                key={question.slug}
                href={`/questions/${question.slug}`}
                className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-soft transition hover:-translate-y-0.5"
              >
                <span>
                  <span className="block font-bold">{question.title}</span>
                  <span className="text-sm text-muted-foreground">{question.reviewStatus}</span>
                </span>
                <ArrowRight className="size-4 text-teal" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-24">
        <div className="rounded-[2rem] border bg-white p-8 text-center shadow-soft md:p-10">
          <Sparkles className="mx-auto mb-5 size-8 text-gold" aria-hidden="true" />
          <h2 className="font-serif text-4xl font-bold">Begin without pressure.</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-muted-foreground">
            Explore first, save later. The app should offer value before asking anyone to create an account.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/onboarding">Choose a starting point</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/ask">Ask without judgment</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
