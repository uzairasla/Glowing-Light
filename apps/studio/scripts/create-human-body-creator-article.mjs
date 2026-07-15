import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.resolve(__dirname, "..");
const outputPath = path.join(
  studioRoot,
  "seed",
  "does-the-human-body-point-to-an-intelligent-creator.ndjson",
);

let keyIndex = 0;

const parentTaxonomyId = "taxonomy-questioning-religion";
const childTaxonomy = {
  _id: "taxonomy-human-body-and-design",
  _type: "taxonomy",
  title: "Human Body and Design",
  slug: { _type: "slug", current: "human-body-and-design" },
  description:
    "Articles that reflect on human biology, embodiment, design, gratitude, and the Creator.",
  parent: {
    _type: "reference",
    _ref: parentTaxonomyId,
  },
};

const article = {
  _id: "article-does-the-human-body-point-to-an-intelligent-creator",
  _type: "article",
  title: "Does the Human Body Point to an Intelligent Creator?",
  slug: {
    _type: "slug",
    current: "does-the-human-body-point-to-an-intelligent-creator",
  },
  description:
    "A careful journey from the body's biological order, information, development, and consciousness toward the Quranic call to notice the signs within ourselves.",
  taxonomies: [
    {
      _key: key(),
      _type: "reference",
      _ref: childTaxonomy._id,
    },
  ],
  body: [
    lead(
      "Your body is not a single machine but a living society: cells coordinating, genes being read, organs responding, senses reporting, and a conscious self somehow experiencing the whole. Science can describe much of this order with breathtaking detail. The deeper question is what kind of reality makes such ordered life possible at all.",
    ),
    callout(
      "reflection",
      "What this article argues",
      "This article does not treat the human body as a shortcut around science. It begins with what biology actually shows: information, coordination, repair, development, perception, and consciousness. Then it asks a philosophical question: does this layered order make better sense as an accident of blind matter alone, or as a sign pointing beyond itself? The Quranic section grounds that reflection in verses about creation, proportion, hearing, sight, hearts, and signs within ourselves.",
    ),
    toc([
      [
        "The body is not simple matter with extra decoration",
        "the-body-is-not-simple-matter-with-extra-decoration",
      ],
      [
        "Life depends on information, not only material",
        "life-depends-on-information-not-only-material",
      ],
      [
        "From a single cell to a whole human being",
        "from-a-single-cell-to-a-whole-human-being",
      ],
      [
        "Your senses are not cameras; they are interpreted openings to reality",
        "your-senses-are-not-cameras-they-are-interpreted-openings-to-reality",
      ],
      [
        "The body is proportioned for life, not merely assembled",
        "the-body-is-proportioned-for-life-not-merely-assembled",
      ],
      [
        "What science can explain, and what it leaves open",
        "what-science-can-explain-and-what-it-leaves-open",
      ],
      [
        "The point is not pride in the body, but gratitude through it",
        "the-point-is-not-pride-in-the-body-but-gratitude-through-it",
      ],
    ]),
    h2("The body is not simple matter with extra decoration"),
    p(
      "A human body is organized across many levels at once. Molecules form cells. Cells form tissues. Tissues form organs. Organs operate inside systems. Those systems keep temperature, oxygen, blood chemistry, sleep cycles, immune response, digestion, and movement within narrow usable ranges. This is not just complexity; it is functional coordination.",
    ),
    cardGrid([
      [
        "Coordination",
        "The body coordinates millions of local events without needing conscious instruction from you.",
      ],
      [
        "Feedback",
        "Hormones, nerves, immune signals, and cellular sensors constantly adjust output based on changing conditions.",
      ],
      [
        "Repair",
        "Skin, bone, blood, DNA, and immune defenses show layered repair systems rather than passive material.",
      ],
      [
        "Purposeful fit",
        "Parts are shaped for roles: lungs for gas exchange, kidneys for filtration, eyes for light, ears for vibration, and nerves for signal transmission.",
      ],
    ]),
    callout(
      "science",
      "Scientific modesty",
      "Biology explains mechanisms. That is its power. But a mechanism is not the same thing as an ultimate explanation. Describing how the eye focuses light, how DNA stores information, or how neurons signal does not by itself answer why reality contains life-permitting laws, information-bearing chemistry, and conscious observers.",
    ),
    h2("Life depends on information, not only material"),
    p(
      "One of the most striking features of the body is that it is built and maintained through coded biological information. The National Human Genome Research Institute describes DNA as containing instructions needed to develop and direct the activities of nearly all living organisms. The human genome contains roughly three billion DNA base pairs, and its genes help direct the production of proteins that build structures, catalyze reactions, and send signals.",
    ),
    p(
      "That does not mean DNA is magic. It is chemistry. But it is chemistry arranged in a way that carries usable, interpretable, error-sensitive instructions. In ordinary experience, functional information points us toward mind. Biology does not force that conclusion by itself, but it makes the question hard to dismiss.",
    ),
    stepList([
      "A cell must preserve genetic information while still using it.",
      "It must copy, regulate, edit, and express that information in context.",
      "Proteins must fold, move, bind, catalyze, signal, and build.",
      "Cells must cooperate with other cells instead of behaving as isolated units.",
      "The organism must maintain identity across constant molecular turnover.",
    ]),
    callout(
      "philosophy",
      "The design question",
      "The argument is not that every biological process is unexplained. The argument is that explained processes still participate in a larger order: intelligible laws, information-bearing chemistry, fine-tuned cellular machinery, and coordinated life. The philosophical question is whether that total pattern is more naturally read as purposeless accident or as a sign of intelligence.",
    ),
    h2("From a single cell to a whole human being"),
    p(
      "Human development begins from a small beginning and unfolds through tightly regulated stages. Cells divide, specialize, migrate, fold, signal, and assemble tissues in the right places. The embryo is not merely growing larger; it is progressively organizing. A heart begins to beat, a nervous system forms, limbs emerge, organs take shape, and the body becomes capable of breathing, feeding, sensing, bonding, and learning.",
    ),
    p(
      "This is one reason development is so philosophically powerful. The adult body is astonishing, but the path from microscopic beginning to embodied person adds another layer of wonder. The information is not only present; it is enacted across time.",
    ),
    quranVerse(
      "We created man out of the extract of clay, then We made him into a drop of life-germ, then We placed it in a safe depository, then We made this drop into a clot, then We made the clot into a lump, then We made the lump into bones, then We clothed the bones with flesh, and then We caused it to grow into another creation. Thus Most Blessed is Allah, the Best of all those that create.",
      "Quran 23:12-14 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    sideNote(
      "Tafsir grounding: Al-Muyassar and Al-Sa'di both explain this passage as describing stages of human creation. Al-Sa'di emphasizes the human being's transitions from origin to later form, and describes the womb as a protected place where the drop is preserved and developed. This article's scientific reflection extends beyond the tafsir; it is not a scholarly ruling.",
    ),
    h2("Your senses are not cameras; they are interpreted openings to reality"),
    p(
      "Sight is not just light entering the eye. It is optics, photoreceptors, neural processing, attention, memory, and recognition. Hearing is not just vibration. It is mechanical sensitivity, fluid motion, hair cells, nerve impulses, localization, and meaning. The body does not merely receive the world; it translates the world into usable experience.",
    ),
    p(
      "The nervous system raises the question still higher. Physical processes correlate with conscious experience, but the existence of subjective awareness remains one of the deepest puzzles in philosophy of mind. We can study neural activity, but the fact that there is an inner point of view at all is not easily reduced to measurement.",
    ),
    quranVerse(
      "Allah has brought you forth from your mothers' wombs when you knew nothing, and then gave you hearing, and sight and thinking hearts so that you may give thanks.",
      "Quran 16:78 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    callout(
      "science",
      "A careful note on the heart and thinking",
      "Maududi's rendering, 'thinking hearts,' should not be turned into a loose claim that the physical heart replaces the brain. But modern neuroscience has made the picture more embodied than a simple brain-only model. The field of interoception studies how signals from the body, especially the cardiovascular system, are sensed and integrated by the nervous system. Reviews of brain-heart interaction research describe cardiac signals as part of the body's ongoing influence on brain organization, emotion, attention, self-regulation, and cognitive performance. The point is modest but striking: the heart is not merely a pump isolated from thought; it participates in a living network through which the person feels, responds, attends, and reasons.",
    ),
    quranVerse(
      "then He duly proportioned him, and breathed into him of His spirit, and bestowed upon you ears and eyes and hearts. And yet, little thanks do you give.",
      "Quran 32:9 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    sideNote(
      "Tafsir grounding: Al-Sa'di highlights hearing, sight, and hearts/minds as noble faculties and as openings through which knowledge reaches the human being. Al-Muyassar similarly connects these faculties to discernment and gratitude.",
    ),
    h2("The body is proportioned for life, not merely assembled"),
    p(
      "A pile of parts is not a body. A body requires proportion, placement, timing, and relation. Teeth must meet food before digestion can use it. Blood vessels must reach tissues. Joints must allow movement without collapsing. The immune system must defend without destroying the host. The nervous system must respond quickly without firing randomly. This kind of order is not captured by counting parts alone.",
    ),
    quranVerse(
      "O man! What has deceived you about your generous Lord Who created you, shaped you, and made you well-proportioned, and set you in whatever form He pleased?",
      "Quran 82:6-8 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    quranVerse(
      "Allah it is Who made the earth a dwelling place for you and made the sky a canopy, Who shaped you - and shaped you exceedingly well - and gave you good things as sustenance. That is Allah, your Lord; blessed be Allah, the Lord of the Universe.",
      "Quran 40:64 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    sideNote(
      "Tafsir grounding: On 82:7, Al-Sa'di explains that the human being is created, proportioned, and arranged in an upright, balanced form. On 40:64, Al-Sa'di invites the reader to look at the human body organ by organ and consider the wisdom of each part being placed where it belongs.",
    ),
    h2("What science can explain, and what it leaves open"),
    p(
      "A serious article should not say, 'Science has not explained this, therefore God.' That is a fragile argument. Scientific gaps can close. The stronger argument is not built on gaps but on the total character of reality: that there are stable laws, life-permitting chemistry, coded biological information, self-repairing systems, embodied consciousness, moral awareness, and a world intelligible to minds.",
    ),
    p(
      "Science answers many 'how' questions brilliantly. But when all the mechanisms have been described, a deeper 'why' remains. Why does matter obey laws that allow life? Why can chemistry carry information? Why does the universe produce minds capable of truth, gratitude, love, and worship? The body does not end the inquiry. It begins it from the closest possible place: ourselves.",
    ),
    quranVerse(
      "and in your own creation; and in the animals which He spreads out over the earth too there are Signs for those endowed with sure faith;",
      "Quran 45:4 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    quranVerse(
      "and also in your own selves. Do you not see?",
      "Quran 51:21 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    callout(
      "quran",
      "The Quranic movement",
      "The Quran does not ask the reader to ignore nature. It repeatedly turns attention toward creation, the self, perception, proportion, origin, and return. The body becomes a sign not because biology is mysterious, but because even understood biology can awaken wonder, humility, and gratitude.",
    ),
    h2("The point is not pride in the body, but gratitude through it"),
    p(
      "If the body points to a Creator, the conclusion is not vanity. It is responsibility. Hearing, sight, intellect, strength, beauty, skill, and health are not possessions we created from nothing. They are trusts. The Quranic response to embodiment is gratitude, humility, and worship.",
    ),
    quranVerse(
      "Say: \"He it is Who has brought you into being, and has given you hearing and sight, and has given you hearts to think and understand. How seldom do you give thanks!\"",
      "Quran 67:23 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    conclusionPanel(
      "Conclusion",
      "The nearest sign may be the one we live inside.",
      "The human body is not proof in the simplistic sense of a laboratory equation. It is more intimate than that: a living sign made of information, coordination, perception, proportion, vulnerability, and consciousness. Science lets us see the mechanisms more clearly. Reason asks what best explains their ordered existence. The Quran then asks us to look again, not only outward at the universe, but inward at ourselves.",
      "The body is not merely something we have. It is something through which we are invited to recognize, thank, and return to the One who made us.",
    ),
    sourceList("Scientific sources", [
      [
        "National Human Genome Research Institute, 'A Brief Guide to Genomics.' Used for DNA, genome, genes, and protein-production background.",
        "https://www.genome.gov/about-genomics/fact-sheets/A-Brief-Guide-to-Genomics",
      ],
      [
        "National Institute of General Medical Sciences, 'Circadian Rhythms.' Used for biological clocks, organ-level rhythms, and feedback-loop examples.",
        "https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms",
      ],
      [
        "Hatton et al., 'The human cell count and size distribution,' Proceedings of the National Academy of Sciences, 2023. Used for current cell-count framing.",
        "https://www.pnas.org/doi/10.1073/pnas.2303077120",
      ],
      [
        "Herculano-Houzel, 'The human brain in numbers: a linearly scaled-up primate brain,' Frontiers in Human Neuroscience, 2009. Used for brain/neuron background.",
        "https://www.frontiersin.org/articles/10.3389/neuro.09.031.2009/full",
      ],
      [
        "Forte, Favieri, and Casagrande, 'Heart Rate Variability and Cognitive Function: A Systematic Review,' Frontiers in Neuroscience, 2019. Used for cautious framing of autonomic/cardiac regulation and cognitive performance.",
        "https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2019.00710/full",
      ],
      [
        "Candia-Rivera et al., 'Measures and Models of Brain-Heart Interactions,' 2024 preprint / IEEE Reviews in Biomedical Engineering related DOI. Used for contemporary brain-heart interaction framing.",
        "https://arxiv.org/abs/2409.15835",
      ],
    ]),
    sourceList("Quran and tafsir grounding", [
      [
        "Quran translation passages retrieved with quran.ai fetch_translation using Tafhim al-Quran by Sayyid Abul A'la al-Maududi: 16:78, 23:12-14, 32:9, 40:64, 45:4, 51:21, 67:23, 82:6-8. Inline footnote markers were removed for display.",
        "https://quran.com",
      ],
      [
        "Tafsir retrieved with quran.ai fetch_tafsir from Al-Tafsir al-Muyassar and Tafsir al-Sa'di for 16:78, 23:12-14, 32:9, 40:64, 45:4, 51:20-21, 67:23, and 82:6-8.",
        "https://quran.com/tafsirs",
      ],
    ]),
    sideNote(
      "Grounding note: Quran translations and tafsir references in this article were grounded with quran.ai: fetch_translation(en-al-maududi) and fetch_tafsir(ar-muyassar, ar-saadi). The scientific-to-theological synthesis is reflective reasoning beyond the fetched tafsir and is not a scholarly ruling or an opinion from quran.ai, quran.com, or quran.foundation.",
    ),
  ],
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(childTaxonomy)}\n${JSON.stringify(article)}\n`);

console.log(`Wrote ${outputPath}`);
console.log("Import with:");
console.log(
  `pnpm --filter @guiding-light/studio exec sanity dataset import "${outputPath}" production --replace`,
);

function lead(text) {
  return { _key: key(), _type: "lead", text };
}

function h2(text) {
  return portableBlock("h2", text);
}

function p(text) {
  return portableBlock("normal", text);
}

function callout(tone, title, body) {
  return { _key: key(), _type: "callout", tone, title, body };
}

function toc(items) {
  return {
    _key: key(),
    _type: "tableOfContents",
    items: items.map(([label, anchor]) => ({ _key: key(), label, anchor })),
  };
}

function cardGrid(cards) {
  return {
    _key: key(),
    _type: "cardGrid",
    cards: cards.map(([title, body]) => ({ _key: key(), title, body })),
  };
}

function stepList(items) {
  return { _key: key(), _type: "stepList", items };
}

function quranVerse(translation, reference) {
  return { _key: key(), _type: "quranVerse", translation, reference };
}

function sideNote(body) {
  return { _key: key(), _type: "sideNote", body };
}

function conclusionPanel(eyebrow, title, body, finalLine) {
  return { _key: key(), _type: "conclusionPanel", eyebrow, title, body, finalLine };
}

function sourceList(title, items) {
  return {
    _key: key(),
    _type: "sourceList",
    title,
    items: items.map(([text, url]) => ({ _key: key(), text, url })),
  };
}

function portableBlock(style, text) {
  return {
    _key: key(),
    _type: "block",
    style,
    markDefs: [],
    children: [{ _key: key(), _type: "span", marks: [], text }],
  };
}

function key() {
  keyIndex += 1;
  return `hb${keyIndex.toString(36)}`;
}
