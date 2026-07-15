import type { Metadata } from "next";
import { AuthPrompt } from "@/components/auth/auth-prompt";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Settings",
  alternates: { canonical: "/settings" },
};

const preferences = [
  "Daily lesson reminders",
  "Weekly summary",
  "Question answered updates",
  "Email frequency",
];

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <main className="container py-16">
      <h1 className="font-serif text-5xl font-bold md:text-7xl">Settings</h1>
      {!user ? (
        <div className="mt-10">
          <AuthPrompt
            title="Sign in to manage settings"
            description="Email preferences and account settings are saved to your private Supabase profile."
            next="/settings"
          />
        </div>
      ) : null}
      {user ? (
      <Card className="mt-10 p-6">
        <h2 className="text-xl font-bold">Account</h2>
        <p className="mt-2 text-muted-foreground">{user.email ?? "Signed in"}</p>
        <form action="/auth/sign-out" method="post" className="mt-5">
          <Button type="submit" variant="secondary">
            Sign out
          </Button>
        </form>
      </Card>
      ) : null}
      {user ? (
      <section className="mt-10 grid gap-5 md:grid-cols-2">
        {preferences.map((item) => (
          <Card key={item} className="p-6">
            <h2 className="text-xl font-bold">{item}</h2>
            <p className="mt-2 text-muted-foreground">
              Placeholder preference control. Values will be stored in Supabase notification preferences.
            </p>
          </Card>
        ))}
      </section>
      ) : null}
    </main>
  );
}
