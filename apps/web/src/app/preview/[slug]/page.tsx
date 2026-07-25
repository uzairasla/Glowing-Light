import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@/components/rich-text";
import { Card } from "@/components/ui/card";
import {
  getPreviewLessonBySlug,
  normalizePreviewLessonSlug,
} from "@/lib/content";
import { isSanityPreviewConfigured } from "@/lib/sanity/client";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getPreviewLessonBySlug(slug);

  return {
    title: lesson ? `Preview: ${lesson.title}` : "Article preview",
    description: lesson?.summary,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function LessonPreviewPage({ params }: Props) {
  const { slug } = await params;
  const lesson = await getPreviewLessonBySlug(slug);

  if (!lesson && !isSanityPreviewConfigured) {
    const normalizedSlug = normalizePreviewLessonSlug(slug);

    return (
      <main className="container py-16">
        <article className="mx-auto max-w-4xl">
          <Card className="border-destructive/30 p-7">
            <p className="text-sm font-bold text-destructive">
              Draft preview is not configured
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold">
              The server cannot read this draft yet.
            </h1>
            <p className="mt-4 leading-7 text-muted-foreground">
              Add a read-only Sanity token as <code>SANITY_API_READ_TOKEN</code>{" "}
              in the web app and Vercel environment settings, then restart or
              redeploy the app.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Preview slug: <code>{normalizedSlug}</code>
            </p>
          </Card>
        </article>
      </main>
    );
  }

  if (!lesson?.body?.length) {
    notFound();
  }

  return (
    <main className="container py-16">
      <article className="mx-auto max-w-4xl">
        <aside className="mb-8 rounded-2xl border border-primary/25 bg-primary/5 px-5 py-4 text-sm leading-6">
          <p className="font-bold text-foreground">Sanity preview</p>
          <p className="text-muted-foreground">
            Showing the latest draft when one exists, otherwise the published
            article.
          </p>
        </aside>

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
