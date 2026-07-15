import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ReviewNotice } from "@/components/review-notice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublicQuestionBySlug, getPublicQuestions } from "@/lib/content";
import { env } from "@/lib/env";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const publicQuestions = await getPublicQuestions();
  return publicQuestions.map((question) => ({ slug: question.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const question = await getPublicQuestionBySlug(slug);

  if (!question) {
    return {};
  }

  return {
    title: question.title,
    description: question.summary,
    alternates: { canonical: `/questions/${question.slug}` },
    openGraph: {
      title: question.title,
      description: question.summary,
      url: `/questions/${question.slug}`,
    },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { slug } = await params;
  const question = await getPublicQuestionBySlug(slug);

  if (!question) {
    notFound();
  }

  return (
    <main className="container py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity: {
            "@type": "Question",
            name: question.title,
            acceptedAnswer: {
              "@type": "Answer",
              text: question.summary,
              url: `${env.NEXT_PUBLIC_SITE_URL}/questions/${question.slug}`,
            },
          },
        }}
      />
      <article className="mx-auto max-w-4xl">
        <Link href="/questions" className="text-sm font-bold text-primary">
          Questions
        </Link>
        <h1 className="mt-3 font-serif text-5xl font-bold leading-tight md:text-7xl">
          {question.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{question.summary}</p>
        <div className="mt-8">
          <ReviewNotice />
        </div>
        <Card className="prose prose-slate mt-10 max-w-none p-7 prose-headings:font-serif prose-p:text-muted-foreground">
          <h2>Short answer</h2>
          <p>
            This is placeholder content. A published answer should be written or edited
            by the content team, reviewed according to the selected review state, and
            connected to sources in Sanity.
          </p>
          <h2>Sources to add</h2>
          <p>
            Quran, hadith, comparative scripture, academic, or scholarly references
            should appear here only after editorial review.
          </p>
        </Card>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/ask">Ask a follow-up</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/journeys">Explore a guided path</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
