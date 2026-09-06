import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "Understand the Abrahamic faith as one continuous message from Adam through Muhammad, calling humanity to worship and submit to Almighty God.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="container py-16">
      <SectionHeading
        kicker="About"
        title="One God. One message. One line of prophets."
        description="Understand the Abrahamic faith in its true essence: one continuous message beginning with Adam and carried through Abraham, Moses, Jesus, and finally Muhammad—peace be upon them all. Every prophet called humanity to worship the one Almighty God and submit fully to His guidance. To follow that message completely is to be a muslim in the original Arabic sense: one who willingly submits and surrenders to God."
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
