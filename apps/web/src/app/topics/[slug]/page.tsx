import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getTopicBySlug, getTopics } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const topics = await getTopics();
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic) {
    return {};
  }

  return {
    title: topic.title,
    description: topic.description,
    alternates: { canonical: `/topics/${topic.slug}` },
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-navy py-20 text-white md:py-28">
        <div className="absolute inset-0 islamic-grid opacity-25" aria-hidden="true" />
        <div
          className="absolute -right-24 -top-48 size-[32rem] rounded-full bg-teal/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative">
          <div className="max-w-4xl">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.2em] text-amber-200">
              <Sparkles className="size-4" aria-hidden="true" />
              Quranic numerical patterns
            </p>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-balance md:text-7xl">
              {topic.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
              {topic.description}
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
              <BookOpen className="size-4 text-gold" aria-hidden="true" />
              {topic.articles.length} {topic.articles.length === 1 ? "article" : "articles"}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-teal">
            Examine every claim
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold md:text-5xl">
            Articles in this series
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Each article states its counting rule, checks the complete Arabic data,
            and separates a verified pattern from conclusions drawn about it.
          </p>
        </div>

        {topic.articles.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {topic.articles.map((article, index) => (
              <Card
                key={article.id}
                className="group relative flex min-h-72 flex-col overflow-hidden p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-teal" aria-hidden="true" />
                <p className="text-xs font-extrabold uppercase tracking-[.15em] text-teal">
                  Pattern {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-balance">
                  <Link
                    href={`/lessons/${article.slug}`}
                    className="transition group-hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-4 flex-1 leading-7 text-muted-foreground">
                  {article.summary}
                </p>
                <Link
                  href={`/lessons/${article.slug}`}
                  className="mt-7 inline-flex items-center gap-2 font-bold text-navy transition group-hover:text-teal"
                >
                  Read the analysis
                  <ArrowRight
                    className="size-4 transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-muted-foreground">
            The first article in this collection is being prepared.
          </Card>
        )}
      </section>
    </main>
  );
}
