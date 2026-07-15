import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getJourneyBySlug, getJourneys } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const journeys = await getJourneys();
  return journeys.map((journey) => ({ slug: journey.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const journey = await getJourneyBySlug(slug);

  if (!journey) {
    return {};
  }

  return {
    title: journey.title,
    description: journey.description,
    alternates: { canonical: `/journeys/${journey.slug}` },
  };
}

export default async function JourneyDetailPage({ params }: Props) {
  const { slug } = await params;
  const journey = await getJourneyBySlug(slug);

  if (!journey) {
    notFound();
  }

  return (
    <main className="container py-16">
      <div className="grid gap-10 lg:grid-cols-[.82fr_.18fr]">
        <section>
          <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-gold">
            {journey.eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-tight md:text-7xl">
            {journey.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            {journey.promise}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/lessons/${journey.lessons[0]?.slug ?? ""}`}>
                Start first lesson
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/onboarding">Save this journey</Link>
            </Button>
          </div>
        </section>
        <aside className="rounded-2xl border bg-white p-5 shadow-soft">
          <p className="text-sm font-bold text-muted-foreground">Path length</p>
          <p className="mt-2 font-serif text-4xl font-bold">{journey.lessons.length}</p>
          <p className="text-sm text-muted-foreground">structured lessons</p>
        </aside>
      </div>

      <section className="mt-12 grid gap-4">
        {journey.lessons.map((lesson, index) => (
          <Card key={lesson.id} className="grid gap-4 p-5 md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="grid size-11 place-items-center rounded-2xl bg-teal-50 font-bold text-teal-900">
              {index + 1}
            </span>
            <div>
              <h2 className="text-xl font-bold">
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                >
                  {lesson.title}
                </Link>
              </h2>
              <p className="mt-1 leading-7 text-muted-foreground">{lesson.summary}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                <Clock className="size-4" aria-hidden="true" />
                {lesson.estimatedMinutes} min
              </span>
              <Button asChild variant="outline" size="sm">
                <Link href={`/lessons/${lesson.slug}`}>Open</Link>
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
