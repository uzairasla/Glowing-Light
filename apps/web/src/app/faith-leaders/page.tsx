import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  HeartHandshake,
  Mail,
  MessageCircleMore,
  Newspaper,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { CopyTemplateButton } from "@/components/copy-template-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "For Faith Leaders and Community Educators",
  description:
    "Review Glowing Light and find respectful templates for sharing it with mosque, church, synagogue, and interfaith communities.",
  alternates: { canonical: "/faith-leaders" },
};

const sharingOptions = [
  {
    icon: Newspaper,
    title: "Newsletter or bulletin",
    description:
      "Share a short introduction and link for members interested in comparative scripture and interfaith learning.",
  },
  {
    icon: BookOpenCheck,
    title: "Resource directory",
    description:
      "List Glowing Light among optional educational resources after your own review.",
  },
  {
    icon: QrCode,
    title: "Community noticeboard",
    description:
      "Display a QR card where visitors can choose to explore the material privately.",
  },
  {
    icon: MessageCircleMore,
    title: "Study or dialogue group",
    description:
      "Use an article to begin a respectful conversation about shared and differing beliefs.",
  },
];

const templates = [
  {
    id: "mosque",
    audience: "Mosque outreach",
    title: "For an imam, mosque board, or education team",
    subject: "A source-backed resource for seekers and Abrahamic study",
    body: `Assalamu alaikum,

My name is [YOUR NAME], and I am helping build Glowing Light, an educational website that explores important questions through Jewish, Christian, and Islamic scriptures and teachings.

The project is Abrahamic-led, grounded in belief in the one Creator, and aims to help sincere seekers examine sources, reflect carefully, and understand the shared history and important differences among the Abrahamic traditions. We try to cite passages clearly, represent each tradition respectfully, and welcome corrections where our work can be improved.

Would your mosque be willing to review the website? If you find it beneficial, would you consider sharing it through your resource page, newsletter, community noticeboard, or study circles?

Website: [WEBSITE URL]

There is no expectation of endorsement. We would be grateful simply for your review and, if appropriate, your help connecting thoughtful seekers with beneficial material.

Jazakum Allahu khayran,
[YOUR NAME]
[ROLE OR ORGANIZATION]
[CONTACT INFORMATION]`,
  },
  {
    id: "church",
    audience: "Church outreach",
    title: "For a pastor, priest, ministry, or education team",
    subject: "An invitation to review an Abrahamic faith learning resource",
    body: `Dear [PASTOR / FATHER / REVEREND / COMMUNITY TEAM],

My name is [YOUR NAME], and I am helping build Glowing Light, a source-based educational website exploring important questions through Jewish, Christian, and Islamic scriptures and teachings.

Glowing Light is transparent about being an Abrahamic-led project, grounded in belief in the one Creator. It is designed for people who want to understand a different perspective, compare primary sources, and think carefully about the beliefs shared and debated across the Abrahamic traditions. We aim to represent each tradition respectfully and welcome thoughtful corrections.

Would you be open to reviewing the website? If you believe it would be useful to members interested in comparative religion or interfaith dialogue, would you consider including it on a resource page, in a newsletter, or as an optional discussion resource?

Website: [WEBSITE URL]

We are not asking your church to endorse every conclusion. We are asking for an opportunity to be reviewed and, where appropriate, shared as a clearly identified perspective.

With respect,
[YOUR NAME]
[ROLE OR ORGANIZATION]
[CONTACT INFORMATION]`,
  },
  {
    id: "synagogue",
    audience: "Synagogue outreach",
    title: "For a rabbi, synagogue board, or education team",
    subject: "An invitation to review an interfaith learning resource",
    body: `Dear Rabbi [NAME] / Community Education Team,

My name is [YOUR NAME], and I am helping build Glowing Light, a source-based educational website examining important questions through Jewish, Christian, and Islamic scriptures and teachings.

Glowing Light is an Abrahamic-led project, grounded in belief in the one Creator, for readers who want to encounter a different perspective while engaging primary sources and the shared history of the Abrahamic traditions. We aim to distinguish shared beliefs from genuine differences, treat Jewish sources respectfully, and welcome corrections from knowledgeable readers.

Would you be willing to review the website? If you find it suitable for people interested in comparative religion or interfaith dialogue, would you consider sharing it as an optional resource through a community page, newsletter, noticeboard, or discussion group?

Website: [WEBSITE URL]

We are not requesting institutional endorsement. Our hope is simply that readers can examine the material openly, think carefully, and better understand one another.

With respect,
[YOUR NAME]
[ROLE OR ORGANIZATION]
[CONTACT INFORMATION]`,
  },
];

export default function FaithLeadersPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div
          className="absolute inset-0 islamic-grid opacity-25"
          aria-hidden="true"
        />
        <div
          className="absolute -right-32 -top-52 size-[38rem] rounded-full bg-teal/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-amber-100">
              <HeartHandshake className="size-4 text-gold" />
              For faith leaders and educators
            </div>
            <h1 className="mt-7 max-w-3xl font-serif text-5xl font-bold leading-tight text-balance md:text-7xl">
              Help thoughtful seekers encounter another perspective.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              Review Glowing Light and, if you find it constructive, share it as
              an optional resource for comparative scripture, Abrahamic faith,
              and respectful interfaith learning.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-navy hover:bg-[#e0b24f]"
              >
                <Link href="/journeys">
                  Review the learning journeys <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#templates">Use an outreach template</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-start">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-teal">
              What you are being invited to review
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
              Transparent about its perspective. Serious about respectful study.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Glowing Light is an Abrahamic-led educational project, grounded in
              the shared belief in one Creator. It compares how Judaism,
              Christianity, and Islam approach enduring questions about God,
              revelation, prophets, worship, morality, and accountability.
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Sharing the website does not require agreement with every
              conclusion. We ask institutions to review it independently and
              describe it honestly as one perspective in a wider Abrahamic
              conversation.
            </p>
          </div>
          <Card className="rounded-[1.75rem] border-teal/20 bg-[#f1f7f5] p-7">
            <ShieldCheck className="size-8 text-teal" />
            <h3 className="mt-5 font-serif text-2xl font-bold">
              Our commitments
            </h3>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
              <li>
                Clearly identify the project&apos;s Abrahamic perspective.
              </li>
              <li>Quote and link sources wherever practical.</li>
              <li>Distinguish common ground from real disagreement.</li>
              <li>Welcome factual and citation corrections.</li>
              <li>Never imply endorsement without explicit permission.</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="border-y bg-[#f7faf9] py-16 md:py-20">
        <div className="container">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-teal">
            Simple ways to help
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold">
            Share only in the way that fits your community.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {sharingOptions.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="rounded-[1.5rem] p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-teal-50 text-teal">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 font-serif text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="container scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Mail className="mx-auto size-7 text-teal" />
          <p className="mt-4 text-xs font-extrabold uppercase tracking-[.2em] text-teal">
            Ready-to-personalize outreach
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
            Begin with respect, clarity, and a small request.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Replace every bracketed field, mention something specific about the
            community, and send these messages individually rather than as a
            mass email.
          </p>
        </div>
        <div className="mx-auto mt-12 space-y-8">
          {templates.map((template) => {
            const copyText = `Subject: ${template.subject}\n\n${template.body}`;
            return (
              <article
                key={template.id}
                id={template.id}
                className="scroll-mt-24 overflow-hidden rounded-[1.75rem] border bg-white shadow-soft"
              >
                <header className="flex flex-col gap-4 border-b bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[.16em] text-teal">
                      {template.audience}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl font-bold">
                      {template.title}
                    </h3>
                  </div>
                  <CopyTemplateButton text={copyText} />
                </header>
                <div className="p-6 md:p-8">
                  <p className="text-sm font-bold">Subject</p>
                  <p className="mt-2 rounded-xl bg-[#f1f7f5] px-4 py-3 text-sm">
                    {template.subject}
                  </p>
                  <p className="mt-7 whitespace-pre-wrap text-[15px] leading-7 text-muted-foreground">
                    {template.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container pb-24">
        <div className="overflow-hidden rounded-[2rem] bg-navy px-6 py-12 text-center text-white shadow-2xl md:px-12">
          <HeartHandshake className="mx-auto size-7 text-gold" />
          <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl font-bold">
            A thoughtful introduction can open a meaningful conversation.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
            Review the project first, personalize your message, and give every
            community complete freedom to decide whether it fits their audience.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-7 bg-gold text-navy hover:bg-[#e0b24f]"
          >
            <Link href="/about">
              Read about our approach <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
