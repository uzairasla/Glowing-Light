import type { Metadata } from "next";
import { ReviewNotice } from "@/components/review-notice";
import { Card } from "@/components/ui/card";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replaceAll("-", " "),
    alternates: { canonical: `/compare/${slug}` },
  };
}

export default async function CompareDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="container py-16">
      <article className="mx-auto max-w-4xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-gold">
          Comparative guide
        </p>
        <h1 className="mt-3 font-serif text-5xl font-bold capitalize md:text-7xl">
          {slug.replaceAll("-", " ")}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Placeholder comparative content. This route is ready for reviewed Sanity content.
        </p>
        <div className="mt-8">
          <ReviewNotice />
        </div>
        <Card className="mt-10 p-7">
          <p className="leading-7 text-muted-foreground">
            Comparative religious content should represent traditions carefully, avoid polemical shortcuts, and expose sources clearly.
          </p>
        </Card>
      </article>
    </main>
  );
}
