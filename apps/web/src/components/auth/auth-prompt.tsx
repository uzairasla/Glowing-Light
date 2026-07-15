import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AuthPromptProps = {
  title: string;
  description: string;
  next?: string;
};

export function AuthPrompt({ title, description, next = "/dashboard" }: AuthPromptProps) {
  return (
    <Card className="p-8 text-center">
      <LockKeyhole className="mx-auto mb-4 size-8 text-teal" aria-hidden="true" />
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl leading-7 text-muted-foreground">{description}</p>
      <Button asChild className="mt-6">
        <Link href={`/sign-in?next=${encodeURIComponent(next)}`}>Sign in with email</Link>
      </Button>
    </Card>
  );
}
