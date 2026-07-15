import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "gold" | "teal" | "outline";

const variants: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  gold: "border border-amber-200 bg-amber-50 text-amber-800",
  teal: "border border-teal-100 bg-teal-50 text-teal-800",
  outline: "border bg-white text-foreground",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
