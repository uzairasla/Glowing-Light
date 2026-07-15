import type { Metadata } from "next";
import { ReviewNotice } from "@/components/review-notice";
import { Card } from "@/components/ui/card";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Prophet ${slug.replaceAll("-", " ")}`,
    alternates: { canonical: `/prophets/${slug}` },
  };
}

export default async function ProphetPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="container py-16">
      <article className="mx-auto max-w-4xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-gold">
          Prophets
        </p>
        <h1 className="mt-3 font-serif text-5xl font-bold capitalize md:text-7xl">
          {slug.replaceAll("-", " ")}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Placeholder prophet profile route, ready for reviewed Sanity content and scripture references.
        </p>
        <div className="mt-8">
          <ReviewNotice />
        </div>
        <Card className="mt-10 p-7">
          <p className="leading-7 text-muted-foreground">
            Future profiles can connect Quran references, biblical or comparative references, lessons, and related questions.
          </p>
        </Card>
      </article>
    </main>
  );
}
