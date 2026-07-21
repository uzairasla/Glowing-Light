import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RichText } from "@/components/rich-text";
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

  if (!lesson?.body?.length) {
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
        <Card className="mt-10 p-7">
          <RichText value={lesson.body} />
        </Card>
      </article>
    </main>
  );
}
