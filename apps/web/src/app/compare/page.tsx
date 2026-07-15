import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Compare",
  description: "Placeholder comparative religion pages for Islam, Christianity, Judaism, revelation, prophets, and scripture.",
  alternates: { canonical: "/compare" },
};

const comparisons = [
  { slug: "islam-christianity-judaism", title: "Islam, Christianity, and Judaism" },
  { slug: "revelation-and-scripture", title: "Revelation and scripture" },
  { slug: "prophets-in-abrahamic-faiths", title: "Prophets in Abrahamic faiths" },
];

export default function ComparePage() {
  return (
    <main className="container py-16">
      <h1 className="font-serif text-5xl font-bold md:text-7xl">Compare</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
        Comparative pages should be especially careful, sourced, and reviewed. These are placeholders for the route structure.
      </p>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {comparisons.map((item) => (
          <Link key={item.slug} href={`/compare/${item.slug}`}>
            <Card className="p-6 transition hover:-translate-y-0.5">
              <h2 className="text-xl font-bold">{item.title}</h2>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
