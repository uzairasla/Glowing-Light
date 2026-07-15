import type { Metadata } from "next";
import { Bookmark } from "lucide-react";
import { AuthPrompt } from "@/components/auth/auth-prompt";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Saved",
  alternates: { canonical: "/saved" },
};

export default async function SavedPage() {
  const user = await getCurrentUser();

  return (
    <main className="container py-16">
      <h1 className="font-serif text-5xl font-bold md:text-7xl">Saved</h1>
      {!user ? (
        <div className="mt-10">
          <AuthPrompt
            title="Sign in to save content"
            description="Bookmarks belong to your private account so they can sync across browsers later."
            next="/saved"
          />
        </div>
      ) : null}
      {user ? (
      <Card className="mt-10 p-8 text-center">
        <Bookmark className="mx-auto mb-4 size-8 text-teal" aria-hidden="true" />
        <h2 className="text-xl font-bold">No saved content yet</h2>
        <p className="mt-2 text-muted-foreground">
          Lessons, questions, articles, scripture passages, and videos can be saved here.
        </p>
      </Card>
      ) : null}
    </main>
  );
}
