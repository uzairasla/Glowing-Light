import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { JourneyCard } from "@/components/journey-card";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { getJourneys } from "@/lib/content";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Explore One Abrahamic Faith Through Three Traditions",
  description:
    "Explore one Abrahamic faith through Judaism, Christianity, and Islam, following shared themes without choosing sides.",
  alternates: { canonical: "/" },
};

const principles = [
  {
    icon: BookOpen,
    title: "Follow one theme",
    description:
      "Trace each topic through Judaism, Christianity, and Islam as expressions of one Abrahamic inheritance.",
  },
  {
    icon: ShieldCheck,
    title: "Observe without taking sides",
    description:
      "Let each tradition speak through its own scriptures, history, and teachings with equal care and attention.",
  },
  {
    icon: Heart,
    title: "Discover the unity",
    description:
      "Look beyond labels to understand the shared Abrahamic faith that runs through all three traditions.",
  },
];

export default async function HomePage() {
  const journeys = await getJourneys();
  const questioningJourney = journeys.find(
    (journey) => journey.slug === "questioning-religion",
  );
  const featuredJourneys = [questioningJourney].filter(
    (journey): journey is NonNullable<typeof journey> => Boolean(journey),
  );
  const featuredSlugs = new Set(
    featuredJourneys.map((journey) => journey.slug),
  );
  const homepageJourneys = [
    ...featuredJourneys,
    ...journeys.filter((journey) => !featuredSlugs.has(journey.slug)),
  ].slice(0, 3);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Glowing Light",
          url: env.NEXT_PUBLIC_SITE_URL,
        }}
      />

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-navy text-white">
        <div
          className="absolute inset-0 islamic-grid opacity-30"
          aria-hidden="true"
        />
        <div
          className="absolute -right-24 -top-40 size-[34rem] rounded-full bg-teal/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative grid min-h-[720px] items-center gap-14 py-20 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-amber-100 backdrop-blur">
              <Sparkles className="size-4 text-gold" />A place for shared
              understanding
            </div>
            <h1 className="font-serif text-5xl font-bold leading-[1.02] text-balance sm:text-6xl lg:text-[5.4rem]">
              Three traditions.
              <span className="mt-2 block text-[#e6bd69]">
                One Abrahamic faith.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              Deep-dive into the same questions through Judaism, Christianity,
              and Islam. Follow the evidence across all three without choosing a
              side.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-navy hover:bg-[#e0b24f]"
              >
                <Link href="/journeys">
                  Explore the journeys <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/journeys">Explore learning paths</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-8 rounded-full bg-teal/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[.09] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-[#e6bd69]">
                    Your journey
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-bold">
                    A steady path forward
                  </h2>
                </div>
                <span className="grid size-12 place-items-center rounded-2xl bg-white/10">
                  <Compass className="size-6 text-[#e6bd69]" />
                </span>
              </div>
              <div className="mt-8 rounded-2xl bg-white p-5 text-navy shadow-xl">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold">Shared Abrahamic roots</span>
                  <span className="font-bold text-teal">42%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[42%] rounded-full bg-teal" />
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    [true, "Abraham and monotheism"],
                    [true, "Revelation and scripture"],
                    [false, "Prophets across traditions"],
                  ].map(([done, label]) => (
                    <div
                      key={String(label)}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm font-semibold"
                    >
                      <span
                        className={`grid size-6 place-items-center rounded-full ${done ? "bg-teal text-white" : "border-2 border-slate-200"}`}
                      >
                        {done && <Check className="size-3.5" />}
                      </span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-5 text-center text-sm text-slate-300">
                Continue at your own pace and return whenever you are ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-teal">
            One faith, observed through three traditions
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-balance md:text-5xl">
            Explore the whole Abrahamic tradition.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Study each topic across Judaism, Christianity, and Islam to see the
            shared faith, revelation, and purpose connecting all three.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-[1.75rem] border bg-white p-7 shadow-soft"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-6 font-serif text-2xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-[#f1f7f5] py-20 md:py-24">
        <div className="container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-teal">
                Paths to understanding
              </p>
              <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
                Follow each question across all three traditions.
              </h2>
            </div>
            <Link
              href="/journeys"
              className="flex items-center gap-2 font-bold text-teal"
            >
              View all journeys <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {homepageJourneys.map((journey, index) => (
              <JourneyCard key={journey.id} journey={journey} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-teal">
            No sides. One shared search. One Truth.
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
            Look beyond the labels.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Judaism, Christianity, and Islam are often studied separately. Here,
            we place them in one continuous Abrahamic conversation and explore
            how each tradition approaches the same enduring questions.
          </p>
          <Button asChild className="mt-7">
            <Link href="/about">
              How Glowing Light approaches learning{" "}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="container pb-24">
        <div className="islamic-grid overflow-hidden rounded-[2rem] bg-navy px-6 py-14 text-center text-white shadow-2xl md:px-12 md:py-16">
          <Sparkles className="mx-auto size-7 text-gold" />
          <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl font-bold md:text-5xl">
            One question. Three traditions. One journey.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-300">
            Deep-dive into a topic through Jewish, Christian, and Islamic
            sources, observing the whole Abrahamic faith without picking sides.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-gold text-navy hover:bg-[#e0b24f]"
          >
            <Link href="/journeys">
              Explore all journeys <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
