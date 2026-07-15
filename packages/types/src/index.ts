export type JourneyAudience =
  | "questioning-religion"
  | "exploring-islam"
  | "new-muslim";

export type ReviewStatus =
  | "draft"
  | "editorial-review"
  | "scholar-review"
  | "approved"
  | "needs-revision";

export type LessonDifficulty = "introductory" | "foundational" | "intermediate";

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export type QuestionSubmissionStatus =
  | "submitted"
  | "under_review"
  | "answered"
  | "published"
  | "closed";

export type BookmarkContentType =
  | "lesson"
  | "question"
  | "article"
  | "scripture_passage"
  | "video";

export type FeedbackType =
  | "unclear"
  | "source_question"
  | "possible_error"
  | "technical_issue"
  | "suggestion";

export type LessonSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: LessonDifficulty;
};

export type JourneyDefinition = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  promise: string;
  lessons: LessonSummary[];
};
