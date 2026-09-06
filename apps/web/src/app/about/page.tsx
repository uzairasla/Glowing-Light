import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Glowing Light traces the shared prophetic call and examines the Quran's claim to restore clarity to the original Abrahamic faith.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="container py-16">
      <SectionHeading
        kicker="About"
        title="Tracing one prophetic call through Abrahamic history."
        description="Glowing Light traces the shared call of the Abrahamic prophets: worship the one God and submit to His guidance. It explores how their teachings were preserved, interpreted, institutionalized, and sometimes changed—and examines the Quran's claim to restore clarity to that original faith."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          [
            "Clarity",
            "Complex ideas are presented in plain language and arranged in a sequence that is easy to follow.",
          ],
          [
            "Compassion",
            "People can learn at their own pace, ask honest questions, and begin from wherever they are.",
          ],
          [
            "Trust",
            "Religious claims should be supported by clearly identified sources and reviewed before publication.",
          ],
        ].map(([item, description]) => (
          <Card key={item} className="p-6">
            <h2 className="text-xl font-bold">{item}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {description}
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
