import type { JourneyAudience, JourneyDefinition } from "@guiding-light/types";

export const journeys: JourneyDefinition[] = [
  {
    id: "questioning-religion",
    slug: "questioning-religion",
    title: "Questioning Religion",
    eyebrow: "For honest seekers",
    description:
      "A patient path through meaning, God, revelation, prophets, Abraham, Islam, and the Quran.",
    promise:
      "Start with the questions beneath belief before moving toward any religious claim.",
    lessons: [
      lesson("meaning", "Why do human beings search for meaning?", "Why longing, morality, beauty, and mortality keep pressing us toward bigger questions.", 9),
      lesson("does-god-exist", "Does God exist?", "An introductory look at contingency, design, moral experience, and the limits of material explanations.", 12),
      lesson("first-cause", "What caused the beginning?", "A careful first pass at why the universe raises questions of origin and dependence.", 10),
      lesson("revelation", "Why would God reveal guidance?", "Why divine guidance would matter if God is real and human beings are morally responsible.", 11),
      lesson("prophets", "What is a prophet?", "What prophets claim, how they teach, and why their lives matter.", 9),
      lesson("abraham", "Why Abraham matters", "A bridge figure for Jews, Christians, and Muslims, and a model of sincere surrender.", 10),
      lesson("why-islam", "Why Islam?", "How Islam understands God, revelation, continuity, and the final message.", 13),
    ],
  },
  {
    id: "exploring-islam",
    slug: "exploring-islam",
    title: "Exploring Islam",
    eyebrow: "For curious learners",
    description:
      "A structured introduction to Allah, Tawhid, core beliefs, the Quran, Prophet Muhammad, prayer, and accepting Islam.",
    promise:
      "Learn Islam through its foundations before deciding what the next step should be.",
    lessons: [
      lesson("who-is-allah", "Who is Allah?", "The Islamic understanding of the one God: merciful, near, unlike creation, and worthy of worship.", 8),
      lesson("tawhid", "The meaning of Tawhid", "Why Islamic monotheism shapes worship, identity, ethics, and hope.", 10),
      lesson("muslim-beliefs", "What Muslims believe", "A simple map of belief in God, angels, books, messengers, the Last Day, and divine decree.", 11),
      lesson("the-quran", "The Quran", "How Muslims understand the Quran as recitation, guidance, and preserved revelation.", 12),
      lesson("prophet-muhammad", "Prophet Muhammad", "A concise introduction to his character, mission, and place in the prophetic tradition.", 12),
      lesson("prayer", "Prayer", "What salah means and why daily prayer is central to Muslim life.", 9),
      lesson("accepting-islam", "What accepting Islam means", "A gentle explanation of the Shahadah, sincerity, and beginning with what is manageable.", 10),
    ],
  },
  {
    id: "new-muslim",
    slug: "new-muslim",
    title: "New Muslim",
    eyebrow: "For first steps",
    description:
      "A gentle practical path through Shahadah, purification, prayer, Quran basics, mosque etiquette, family concerns, and sustainable habits.",
    promise:
      "Focus on what matters first, without pressure to learn everything at once.",
    lessons: [
      lesson("shahadah", "What the Shahadah means", "The words, meaning, and spiritual weight of entering Islam.", 8),
      lesson("first-steps", "Your first steps", "What to prioritize in the first days and weeks, and what can wait.", 9),
      lesson("wudu", "How to make wudu", "A practical introduction to purification before prayer.", 8),
      lesson("how-to-pray", "How to pray", "A beginner-friendly overview of salah movements, words, and rhythm.", 14),
      lesson("fatihah", "Understanding Al-Fatihah", "The opening chapter as prayer, praise, and request for guidance.", 10),
      lesson("learning-quran", "Learning the Quran", "How to approach recitation, translation, memorization, and reflection.", 11),
      lesson("mosque-etiquette", "Mosque etiquette", "What to expect at the mosque and how to feel more comfortable entering.", 8),
      lesson("family-concerns", "Family and social concerns", "Responding to loved ones with patience, honesty, and wise boundaries.", 12),
      lesson("sustainable-habits", "Building sustainable habits", "A long-term approach to growth without burnout.", 9),
    ],
  },
];

export function getJourneyBySlug(slug: string): JourneyDefinition | undefined {
  return journeys.find((journey) => journey.slug === slug);
}

export function getJourneyByAudience(audience: JourneyAudience): JourneyDefinition {
  const journey = journeys.find((item) => item.id === audience);
  if (!journey) {
    throw new Error(`Unknown journey audience: ${audience}`);
  }

  return journey;
}

function lesson(
  slug: string,
  title: string,
  summary: string,
  estimatedMinutes: number,
) {
  return {
    id: slug,
    slug,
    title,
    summary,
    estimatedMinutes,
    difficulty: "introductory" as const,
  };
}
