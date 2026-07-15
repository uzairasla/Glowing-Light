import { z } from "zod";

export const journeyStageSchema = z.enum([
  "questioning-religion",
  "exploring-islam",
  "new-muslim",
]);

export const onboardingSchema = z.object({
  journeyStage: journeyStageSchema,
  religiousBackground: z.string().max(120).optional(),
  preferredLessonLength: z.coerce.number().int().min(5).max(60).optional(),
  preferredContentType: z
    .enum(["reading", "audio", "video", "mixed"])
    .optional(),
  timezone: z.string().max(80).optional(),
});

export const questionSubmissionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(10, "Please share a little more so reviewers can understand the question.")
    .max(2000, "Questions must be 2,000 characters or fewer."),
  category: z.string().trim().max(80).optional(),
  isAnonymous: z.boolean().default(true),
  submittedFrom: z.string().trim().max(120).optional(),
});

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer."),
});

export const contentFeedbackSchema = z.object({
  contentType: z.enum(["lesson", "question", "article", "scripture_passage", "video"]),
  contentId: z.string().min(1),
  feedbackType: z.enum([
    "unclear",
    "source_question",
    "possible_error",
    "technical_issue",
    "suggestion",
  ]),
  message: z.string().max(1200).optional(),
});

export const notificationPreferencesSchema = z.object({
  dailyLessonEnabled: z.boolean(),
  weeklySummaryEnabled: z.boolean(),
  questionAnsweredEnabled: z.boolean(),
  emailFrequency: z.enum(["daily", "weekly", "important_only", "off"]),
  preferredSendTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
});

export type QuestionSubmissionInput = z.infer<typeof questionSubmissionSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
