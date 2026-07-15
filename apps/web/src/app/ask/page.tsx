import type { Metadata } from "next";
import { AlertTriangle, HeartHandshake, ShieldCheck } from "lucide-react";
import { AskQuestionForm } from "@/components/ask-question-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Ask Without Judgment",
  description:
    "Submit a question anonymously. Answers are reviewed, sourced, and never presented as unrestricted AI religious rulings.",
  alternates: { canonical: "/ask" },
};

const promises = [
  { icon: HeartHandshake, text: "A compassionate review process" },
  { icon: ShieldCheck, text: "Reviewed answers with sources" },
  { icon: AlertTriangle, text: "Sensitive issues are escalated, not automated" },
];

export default function AskPage() {
  return (
    <main className="container py-16">
      <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <section>
          <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-gold">
            Private questions
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-tight md:text-7xl">
            Ask Without Judgment
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            You may submit a question anonymously. You are not judged for asking.
            Answers are reviewed, sources are included, and some questions may require
            a qualified scholar or professional.
          </p>
          <div className="mt-8 grid gap-4">
            {promises.map(({ icon: Icon, text }) => (
              <Card key={text} className="flex items-center gap-3 p-4">
                <Icon className="size-5 text-teal" aria-hidden="true" />
                <span className="font-semibold">{text}</span>
              </Card>
            ))}
          </div>
        </section>
        <Card className="p-6 md:p-8">
          <AskQuestionForm />
        </Card>
      </div>
    </main>
  );
}
