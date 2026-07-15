"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MailCheck } from "lucide-react";
import { signInSchema, type SignInInput } from "@guiding-light/validation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MagicLinkFormProps = {
  redirectTo?: string;
};

export function MagicLinkForm({ redirectTo = "/dashboard" }: MagicLinkFormProps) {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: SignInInput) {
    setFormError(null);

    if (!supabase) {
      setFormError("Supabase is not configured yet. Add the Supabase URL and anon key to apps/web/.env.local.");
      return;
    }

    const origin = window.location.origin;
    const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    setSentTo(values.email);
  }

  if (sentTo) {
    return (
      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-6 text-teal-950">
        <MailCheck className="mb-4 size-7" aria-hidden="true" />
        <h2 className="text-xl font-bold">Check your email</h2>
        <p className="mt-2 leading-7">
          We sent a secure sign-in link to <strong>{sentTo}</strong>. Open it on this device to continue.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
        {form.formState.isSubmitting ? "Sending link..." : "Send magic link"}
      </Button>
      <p className="text-xs leading-5 text-muted-foreground">
        No password is needed. If your email is new, Supabase will create an account and the database trigger will create your profile row.
      </p>
    </form>
  );
}
