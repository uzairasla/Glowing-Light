import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <Badge variant="gold" className="mb-4">
        {kicker}
      </Badge>
      <h2 className="font-serif text-4xl font-bold leading-tight tracking-normal text-balance text-foreground md:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
