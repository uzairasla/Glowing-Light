import { Bookmark, CheckCircle2, MessageCircleQuestion, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ProductPreview() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border bg-white shadow-deep">
      <div className="pattern-soft absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative grid gap-4 p-4 md:grid-cols-[.85fr_1.15fr] md:p-7">
        <div className="rounded-2xl border bg-white/90 p-5 shadow-soft">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-gold">
                Active journey
              </p>
              <h3 className="mt-1 font-serif text-3xl font-bold">Exploring Islam</h3>
            </div>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
              28%
            </span>
          </div>
          <Progress value={28} />
          <div className="mt-6 space-y-3">
            {["Who is Allah?", "The meaning of Tawhid", "What Muslims believe"].map(
              (item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border bg-white p-3">
                  <CheckCircle2
                    className={index === 0 ? "size-5 text-teal" : "size-5 text-muted-foreground"}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-2xl border bg-white/90 p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold">Reviewed answer pages</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Public Q&A exposes sources, reviewers, and last-reviewed dates.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-white/90 p-5 shadow-soft">
              <Bookmark className="mb-4 size-5 text-teal" aria-hidden="true" />
              <p className="font-bold">Saved lessons</p>
              <p className="mt-1 text-sm text-muted-foreground">Private user state in Supabase.</p>
            </div>
            <div className="rounded-2xl border bg-white/90 p-5 shadow-soft">
              <MessageCircleQuestion className="mb-4 size-5 text-gold" aria-hidden="true" />
              <p className="font-bold">Ask without judgment</p>
              <p className="mt-1 text-sm text-muted-foreground">Anonymous submissions, reviewed replies.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col gap-2 border-t bg-white/92 px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          <strong className="text-foreground">Privacy first:</strong> no sensitive question text in analytics.
        </span>
        <span>Sanity content, Supabase progress</span>
      </div>
    </div>
  );
}
