import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getJourneyBySlug,
  getJourneys,
  getPublishedLessonSitemapEntries,
} from "@/lib/content";

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
    alternates: { canonical: "/journeys/" + journey.slug },
  };
}

export default async function JourneyDetailPage({ params }: Props) {
  const { slug } = await params;
  const [journey, publishedLessons] = await Promise.all([
    getJourneyBySlug(slug),
    getPublishedLessonSitemapEntries(),
  ]);

  if (!journey) {
    notFound();
  }

  const publishedSlugs = new Set(publishedLessons.map((lesson) => lesson.slug));
  const firstPublishedLesson = journey.lessons.find((lesson) =>
    publishedSlugs.has(lesson.slug),
  );
  const journeySections =
    journey.sections && journey.sections.length > 0
      ? journey.sections
      : [
          {
            id: "journey-topics",
            title: "Journey Topics",
            lessons: journey.lessons,
          },
        ];
  const lessonOrder = new Map(
    journey.lessons.map((lesson, index) => [lesson.id, index + 1]),
  );

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
          {firstPublishedLesson ? (
            <div className="mt-8">
              <Button asChild>
                <Link href={"/lessons/" + firstPublishedLesson.slug}>
                  Start first lesson
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ) : null}
        </section>
        <aside className="rounded-2xl border bg-white p-5 shadow-soft">
          <p className="text-sm font-bold text-muted-foreground">Path length</p>
          <p className="mt-2 font-serif text-4xl font-bold">
            {journey.lessons.length}
          </p>
          <p className="text-sm text-muted-foreground">structured topics</p>
        </aside>
      </div>

      <div className="mt-14 space-y-14">
        {journeySections.map((section, sectionIndex) => (
          <section key={section.id} aria-labelledby={"section-" + section.id}>
            <div className="mb-6 max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-gold">
                Module {sectionIndex + 1}
              </p>
              <h2
                id={"section-" + section.id}
                className="mt-2 font-serif text-3xl font-bold md:text-4xl"
              >
                {section.title}
              </h2>
              {section.description ? (
                <p className="mt-3 text-lg leading-8 text-muted-foreground">
                  {section.description}
                </p>
              ) : null}
            </div>
            <div className="grid gap-4">
              {section.lessons.map((lesson) => {
                const isPublished = publishedSlugs.has(lesson.slug);

                return (
                  <Card
                    key={lesson.id}
                    className="grid gap-4 p-5 md:grid-cols-[auto_1fr_auto] md:items-center"
                  >
                    <span className="grid size-11 place-items-center rounded-2xl bg-teal-50 font-bold text-teal-900">
                      {lessonOrder.get(lesson.id)}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold">
                        {isPublished ? (
                          <Link
                            href={"/lessons/" + lesson.slug}
                            className="text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                          >
                            {lesson.title}
                          </Link>
                        ) : (
                          lesson.title
                        )}
                      </h3>
                      <p className="mt-1 leading-7 text-muted-foreground">
                        {lesson.summary}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                        <Clock className="size-4" aria-hidden="true" />
                        {lesson.estimatedMinutes} min
                      </span>
                      {isPublished ? (
                        <Button asChild variant="outline" size="sm">
                          <Link href={"/lessons/" + lesson.slug}>Open</Link>
                        </Button>
                      ) : null}
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
