import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { ReviewNotice } from "@/components/review-notice";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPublicQuestions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Questions",
  description: "Browse reviewed answer pages about God, religion, Islam, prayer, and new Muslim life.",
  alternates: { canonical: "/questions" },
};

export default async function QuestionsPage() {
  const publicQuestions = await getPublicQuestions();

  return (
    <main className="container py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-gold">
          Public answers
        </p>
        <h1 className="mt-3 font-serif text-5xl font-bold md:text-7xl">Questions</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          SEO-friendly answer pages will be sourced and reviewed before publication.
          The current content is intentionally labeled as placeholder.
        </p>
      </div>
      <label className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border bg-white p-3 shadow-soft">
        <Search className="ml-2 size-5 text-muted-foreground" aria-hidden="true" />
        <Input className="border-0 shadow-none focus-visible:ring-0" placeholder="Search questions" />
      </label>
      <div className="mt-8">
        <ReviewNotice />
      </div>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {publicQuestions.map((question) => (
          <Link key={question.slug} href={`/questions/${question.slug}`}>
            <Card className="h-full p-6 transition hover:-translate-y-0.5">
              <h2 className="text-xl font-bold">{question.title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{question.summary}</p>
              <p className="mt-5 text-sm font-bold text-primary">{question.reviewStatus}</p>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
