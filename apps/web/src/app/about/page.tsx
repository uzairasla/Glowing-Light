import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "Guiding Light is a journey-first faith guidance platform built around clarity, compassion, privacy, and reviewed sources.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="container py-16">
      <SectionHeading
        kicker="About"
        title="A calmer way to explore serious questions."
        description="Guiding Light is not a generic utility app. It is organized around the journey a person is actually on."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {["Clarity", "Compassion", "Trust"].map((item) => (
          <Card key={item} className="p-6">
            <h2 className="text-xl font-bold">{item}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Placeholder copy for the product principle. Replace with reviewed brand and editorial language.
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
