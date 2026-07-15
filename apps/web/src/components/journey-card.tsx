import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { JourneyDefinition } from "@guiding-light/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type JourneyCardProps = {
  journey: JourneyDefinition;
  index: number;
};

const accents = ["bg-teal", "bg-[#4185b2]", "bg-gold"];

export function JourneyCard({ journey, index }: JourneyCardProps) {
  const totalMinutes = journey.lessons.reduce(
    (total, lesson) => total + lesson.estimatedMinutes,
    0,
  );

  return (
    <Card className="group relative overflow-hidden">
      <div className={`h-1.5 ${accents[index] ?? "bg-teal"}`} />
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="teal">{journey.eyebrow}</Badge>
            <CardTitle className="mt-4 font-serif text-3xl">{journey.title}</CardTitle>
          </div>
          <span className="font-serif text-6xl font-bold leading-none text-navy/10">
            {index + 1}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="leading-7 text-muted-foreground">{journey.description}</p>
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Clock className="size-4" aria-hidden="true" />
          {journey.lessons.length} lessons, about {totalMinutes} minutes
        </div>
        <ol className="space-y-2 text-sm text-foreground">
          {journey.lessons.slice(0, 4).map((lesson) => (
            <li key={lesson.id} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
              {lesson.title}
            </li>
          ))}
        </ol>
        <Button asChild variant="secondary" className="w-full justify-between">
          <Link href={`/journeys/${journey.slug}`}>
            View journey
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
