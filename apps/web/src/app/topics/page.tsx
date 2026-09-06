import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Library } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { getTopics } from "@/lib/content";

export const metadata: Metadata = {
  title: "Topics",
  description:
    "Browse focused collections about Abrahamic faiths, scripture, belief, history, judgment, and Quranic studies from Glowing Light.",
  alternates: { canonical: "/topics" },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <main className="container py-16 md:py-24">
      <SectionHeading
        kicker="Explore by subject"
        title="Topics"
        description="Browse focused article collections across Abrahamic belief, scripture, history, ethics, and religious life. Each topic grows as new research and analysis are published."
      />

      {topics.length > 0 ? (
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {topics.map((topic, index) => (
            <Card
              key={topic.id}
              className="group relative flex min-h-80 flex-col overflow-hidden p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 ${index % 2 === 0 ? "bg-teal" : "bg-gold"}`}
                aria-hidden="true"
              />
              <span className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal">
                <Library className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-serif text-3xl font-bold leading-tight text-balance">
                <Link
                  href={`/topics/${topic.slug}`}
                  className="transition group-hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                >
                  {topic.title}
                </Link>
              </h2>
              <p className="mt-4 flex-1 leading-7 text-muted-foreground">
                {topic.description}
              </p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t pt-5">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <BookOpen className="size-4" aria-hidden="true" />
                  {topic.articles.length}{" "}
                  {topic.articles.length === 1 ? "article" : "articles"}
                </span>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="inline-flex items-center gap-2 font-bold text-teal"
                >
                  Explore
                  <ArrowRight
                    className="size-4 transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-10 p-8 text-muted-foreground">
          Topic collections are being prepared.
        </Card>
      )}
    </main>
  );
}
