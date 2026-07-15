import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Bookmark, CheckCircle2 } from "lucide-react";
import { RichText } from "@/components/rich-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLessonBySlug, getLessons } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const lessons = await getLessons();
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);

  if (!lesson) {
    return {};
  }

  return {
    title: lesson.title,
    description: lesson.summary,
    alternates: { canonical: `/lessons/${lesson.slug}` },
  };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  return (
    <main className="container py-16">
      <article className="mx-auto max-w-4xl">
        <Link
          href={`/journeys/${lesson.journey.slug}`}
          className="text-sm font-bold text-primary"
        >
          {lesson.journey.title}
        </Link>
        <h1 className="mt-3 font-serif text-5xl font-bold leading-tight md:text-7xl">
          {lesson.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          {lesson.summary}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button>
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Mark started
          </Button>
          <Button variant="secondary">
            <Bookmark className="size-4" aria-hidden="true" />
            Save
          </Button>
        </div>

        <Card className="mt-10 p-7">
          {lesson.body && lesson.body.length > 0 ? (
            <RichText value={lesson.body} />
          ) : (
            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground">
              <h2>Overview</h2>
              <p>
                This is placeholder lesson content for product development. In
                production, this lesson should be authored in Sanity, reviewed,
                sourced, and connected to the approved journey structure.
              </p>
              <h2>What you will learn</h2>
              <ul>
                <li>The core question this lesson is trying to answer.</li>
                <li>Important terms and ideas explained in plain language.</li>
                <li>Where to go next in the guided path.</li>
              </ul>
              <h2>Reflection</h2>
              <p>
                What part of this topic feels clearest, and what part would you
                want to ask about privately?
              </p>
            </div>
          )}
        </Card>
      </article>
    </main>
  );
}
