import { ShieldCheck } from "lucide-react";
import { sourceNotice } from "@/lib/content";

export function ReviewNotice() {
  return (
    <aside className="rounded-2xl border border-teal-100 bg-teal-50/80 p-5 text-sm text-teal-950">
      <div className="mb-2 flex items-center gap-2 font-bold">
        <ShieldCheck className="size-4" aria-hidden="true" />
        Source and review status
      </div>
      <dl className="grid gap-2 text-teal-900 sm:grid-cols-3">
        <div>
          <dt className="font-semibold">Status</dt>
          <dd>{sourceNotice.status}</dd>
        </div>
        <div>
          <dt className="font-semibold">Reviewer</dt>
          <dd>{sourceNotice.reviewer}</dd>
        </div>
        <div>
          <dt className="font-semibold">Last reviewed</dt>
          <dd>{sourceNotice.lastReviewedAt}</dd>
        </div>
      </dl>
    </aside>
  );
}
