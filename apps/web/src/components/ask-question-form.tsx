"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  questionSubmissionSchema,
  type QuestionSubmissionInput,
} from "@guiding-light/validation";
import { trackEvent } from "@/lib/analytics/events";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AskQuestionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<QuestionSubmissionInput>({
    resolver: zodResolver(questionSubmissionSchema),
    defaultValues: {
      question: "",
      category: "",
      isAnonymous: true,
      submittedFrom: "ask-page",
    },
  });

  async function onSubmit(values: QuestionSubmissionInput) {
    setFormError(null);
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      if (!values.isAnonymous) {
        setFormError("Sign in is not configured yet, so account-linked submissions are unavailable.");
        return;
      }

      window.sessionStorage.setItem(
        "guiding-light.pending-question",
        JSON.stringify({ ...values, savedAt: new Date().toISOString() }),
      );
      trackEvent("question_submitted", { source: "local_fallback" });
      setSubmitted(true);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!values.isAnonymous && !user) {
      setFormError("Please sign in before submitting a question linked to your account.");
      return;
    }

    const { error } = await supabase.from("question_submissions").insert({
      question: values.question,
      category: values.category || null,
      is_anonymous: values.isAnonymous,
      submitted_from: values.submittedFrom,
      profile_id: values.isAnonymous ? null : user?.id,
    });

    if (error) {
      setFormError("We could not submit the question yet. Please try again shortly.");
      return;
    }

    trackEvent("question_submitted", { source: "ask_page" });
    setSubmitted(true);
    form.reset();
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-6 text-teal-950">
        <h2 className="text-xl font-bold">Your question was received.</h2>
        <p className="mt-2 leading-7">
          Thank you for trusting us with it. A reviewed answer may be published later
          without identifying you.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="question">Your question</Label>
        <Textarea
          id="question"
          placeholder="Ask honestly. You do not need to phrase it perfectly."
          {...form.register("question")}
        />
        {form.formState.errors.question ? (
          <p className="text-sm text-destructive">{form.formState.errors.question.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category, optional</Label>
        <Input id="category" placeholder="Belief, prayer, family, Quran..." {...form.register("category")} />
      </div>
      <label className="flex items-start gap-3 rounded-2xl border bg-white p-4 text-sm leading-6">
        <input
          type="checkbox"
          className="mt-1"
          {...form.register("isAnonymous")}
          defaultChecked
        />
        Submit anonymously. If you later create an account, you can choose what to save.
      </label>
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Submitting..." : "Submit question"}
      </Button>
    </form>
  );
}
