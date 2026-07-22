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
      lesson(
        "meaning",
        "Why do human beings search for meaning?",
        "Why longing, morality, beauty, and mortality keep pressing us toward bigger questions.",
        9,
      ),
      lesson(
        "does-god-exist",
        "Does God exist?",
        "An introductory look at contingency, design, moral experience, and the limits of material explanations.",
        12,
      ),
      lesson(
        "first-cause",
        "What caused the beginning?",
        "A careful first pass at why the universe raises questions of origin and dependence.",
        10,
      ),
      lesson(
        "revelation",
        "Why would God reveal guidance?",
        "Why divine guidance would matter if God is real and human beings are morally responsible.",
        11,
      ),
      lesson(
        "prophets",
        "What is a prophet?",
        "What prophets claim, how they teach, and why their lives matter.",
        9,
      ),
      lesson(
        "abraham",
        "Why Abraham matters",
        "A bridge figure for Jews, Christians, and Muslims, and a model of sincere surrender.",
        10,
      ),
      lesson(
        "why-islam",
        "Why Islam?",
        "How Islam understands God, revelation, continuity, and the final message.",
        13,
      ),
    ],
  },
  {
    id: "exploring-the-abrahamic-faiths",
    slug: "exploring-the-abrahamic-faiths",
    title: "Exploring the Abrahamic Faiths",
    eyebrow: "For thoughtful comparison",
    description:
      "A balanced path through Judaism, Christianity, and Islam: their shared roots, central beliefs, scriptures, prophets, and distinct truth claims.",
    promise:
      "Compare the three Abrahamic traditions carefully, understand where they agree and differ, and evaluate their claims with clarity and respect.",
    lessons: [
      lesson(
        "what-do-abrahamic-faiths-share",
        "What do the Abrahamic faiths share?",
        "Begin with Abraham, monotheism, revelation, moral accountability, worship, and the shared prophetic tradition.",
        10,
      ),
      lesson(
        "god-in-judaism-christianity-islam",
        "How does each faith understand God?",
        "Compare Jewish monotheism, the Christian doctrine of the Trinity, and Islamic Tawhid.",
        14,
      ),
      lesson(
        "torah-bible-quran",
        "Torah, Bible, and Quran",
        "Explore how each tradition understands revelation, scripture, preservation, interpretation, and authority.",
        15,
      ),
      lesson(
        "prophets-and-religious-authority",
        "Prophets and religious authority",
        "Consider the role of prophets, communities, scholars, churches, and transmitted tradition.",
        12,
      ),
      lesson(
        "jesus-in-the-abrahamic-faiths",
        "Who is Jesus in each Abrahamic faith?",
        "Compare Jewish, Christian, and Islamic understandings of Jesus, his mission, and his significance.",
        15,
      ),
      lesson(
        "covenant-salvation-and-law",
        "Covenant, salvation, and divine law",
        "Examine how the three faiths understand sin, repentance, grace, obedience, judgment, and the path to salvation.",
        14,
      ),
      lesson(
        "evaluating-abrahamic-truth-claims",
        "How should we evaluate their truth claims?",
        "Use coherent criteria to weigh scripture, history, theology, continuity, and lived religious practice.",
        13,
      ),
    ],
    sections: [
      {
        id: "shared-roots",
        title: "Shared Roots",
        description:
          "Begin with Abraham, monotheism, revelation, worship, and the common prophetic inheritance.",
        lessons: [
          lesson(
            "what-do-abrahamic-faiths-share",
            "What do the Abrahamic faiths share?",
            "Begin with Abraham, monotheism, revelation, moral accountability, worship, and the shared prophetic tradition.",
            10,
          ),
        ],
      },
      {
        id: "god-and-revelation",
        title: "God and Revelation",
        description:
          "Compare the nature of God and the scriptures each tradition receives as authoritative.",
        lessons: [
          lesson(
            "god-in-judaism-christianity-islam",
            "How does each faith understand God?",
            "Compare Jewish monotheism, the Christian doctrine of the Trinity, and Islamic Tawhid.",
            14,
          ),
          lesson(
            "torah-bible-quran",
            "Torah, Bible, and Quran",
            "Explore how each tradition understands revelation, scripture, preservation, interpretation, and authority.",
            15,
          ),
        ],
      },
      {
        id: "prophets-and-jesus",
        title: "Prophets and Jesus",
        description:
          "Examine prophetic authority and the sharply different understandings of Jesus.",
        lessons: [
          lesson(
            "prophets-and-religious-authority",
            "Prophets and religious authority",
            "Consider the role of prophets, communities, scholars, churches, and transmitted tradition.",
            12,
          ),
          lesson(
            "jesus-in-the-abrahamic-faiths",
            "Who is Jesus in each Abrahamic faith?",
            "Compare Jewish, Christian, and Islamic understandings of Jesus, his mission, and his significance.",
            15,
          ),
        ],
      },
      {
        id: "covenant-salvation-and-law",
        title: "Covenant, Salvation, and Law",
        description:
          "Understand how each faith connects repentance, grace, obedience, divine law, and final judgment.",
        lessons: [
          lesson(
            "covenant-salvation-and-law",
            "Covenant, salvation, and divine law",
            "Examine how the three faiths understand sin, repentance, grace, obedience, judgment, and the path to salvation.",
            14,
          ),
        ],
      },
      {
        id: "evaluating-the-claims",
        title: "Evaluating the Claims",
        description:
          "Bring the comparison together using consistent historical, theological, and textual criteria.",
        lessons: [
          lesson(
            "evaluating-abrahamic-truth-claims",
            "How should we evaluate their truth claims?",
            "Use coherent criteria to weigh scripture, history, theology, continuity, and lived religious practice.",
            13,
          ),
        ],
      },
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
      lesson(
        "who-is-allah",
        "Who is Allah?",
        "The Islamic understanding of the one God: merciful, near, unlike creation, and worthy of worship.",
        8,
      ),
      lesson(
        "tawhid",
        "The meaning of Tawhid",
        "Why Islamic monotheism shapes worship, identity, ethics, and hope.",
        10,
      ),
      lesson(
        "muslim-beliefs",
        "What Muslims believe",
        "A simple map of belief in God, angels, books, messengers, the Last Day, and divine decree.",
        11,
      ),
      lesson(
        "the-quran",
        "The Quran",
        "How Muslims understand the Quran as recitation, guidance, and preserved revelation.",
        12,
      ),
      lesson(
        "prophet-muhammad",
        "Prophet Muhammad",
        "A concise introduction to his character, mission, and place in the prophetic tradition.",
        12,
      ),
      lesson(
        "prayer",
        "Prayer",
        "What salah means and why daily prayer is central to Muslim life.",
        9,
      ),
      lesson(
        "accepting-islam",
        "What accepting Islam means",
        "A gentle explanation of the Shahadah, sincerity, and beginning with what is manageable.",
        10,
      ),
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
      lesson(
        "shahadah",
        "What the Shahadah means",
        "The words, meaning, and spiritual weight of entering Islam.",
        8,
      ),
      lesson(
        "first-steps",
        "Your first steps",
        "What to prioritize in the first days and weeks, and what can wait.",
        9,
      ),
      lesson(
        "wudu",
        "How to make wudu",
        "A practical introduction to purification before prayer.",
        8,
      ),
      lesson(
        "how-to-pray",
        "How to pray",
        "A beginner-friendly overview of salah movements, words, and rhythm.",
        14,
      ),
      lesson(
        "fatihah",
        "Understanding Al-Fatihah",
        "The opening chapter as prayer, praise, and request for guidance.",
        10,
      ),
      lesson(
        "learning-quran",
        "Learning the Quran",
        "How to approach recitation, translation, memorization, and reflection.",
        11,
      ),
      lesson(
        "mosque-etiquette",
        "Mosque etiquette",
        "What to expect at the mosque and how to feel more comfortable entering.",
        8,
      ),
      lesson(
        "family-concerns",
        "Family and social concerns",
        "Responding to loved ones with patience, honesty, and wise boundaries.",
        12,
      ),
      lesson(
        "sustainable-habits",
        "Building sustainable habits",
        "A long-term approach to growth without burnout.",
        9,
      ),
    ],
  },
];

export function getJourneyBySlug(slug: string): JourneyDefinition | undefined {
  return journeys.find((journey) => journey.slug === slug);
}

export function getJourneyByAudience(
  audience: JourneyAudience,
): JourneyDefinition {
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
