import {createReadStream} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname, resolve} from "node:path";
import sanityCli from "sanity/cli";

const here = dirname(fileURLToPath(import.meta.url));
const client = sanityCli.getCliClient({apiVersion: "2026-07-04"});
const key = (() => { let n = 0; return () => `ev${(++n).toString(36)}`; })();
const block = (text, style = "normal") => ({
  _key: key(), _type: "block", style, markDefs: [],
  children: [{_key: key(), _type: "span", marks: [], text}],
});
const verse = (translation, reference) => ({_key: key(), _type: "quranVerse", translation, reference});
const callout = (tone, title, body) => ({_key: key(), _type: "callout", tone, title, body});
const source = (text, url) => ({_key: key(), text, url});
const upload = async (filename, title) => client.assets.upload(
  "image",
  createReadStream(resolve(here, "../seed", filename)),
  {filename, title},
);

const [evidenceImage, explanationImage] = await Promise.all([
  upload("evolution-evidence.png", "The branching history and evidence of biological evolution"),
  upload("evolution-mechanism-creator.png", "Biological mechanisms within a law-governed universe"),
]);

const article = {
  _id: "drafts.article-if-evolution-is-true-why-need-creator",
  _type: "article",
  title: "If Evolution Is True, Why Do We Still Need a Creator?",
  slug: {_type: "slug", current: "if-evolution-is-true-why-do-we-need-a-creator"},
  description: "Evolution can explain how populations change across generations. But does a biological mechanism explain why life, laws, consciousness, and purpose exist—or remove the need for a Creator?",
  taxonomies: [{_key: key(), _type: "reference", _ref: "taxonomy-questioning-religion"}],
  body: [
    {_key: key(), _type: "lead", text: "Many people are offered a false choice: either accept evolution or believe in a Creator. That conflict sounds decisive only when a scientific account of biological change is quietly turned into a complete philosophy of existence. This article separates the evidence from the worldview built around it—and then asks the deeper question the Quran places before us."},
    callout("reflection", "The central distinction", "A mechanism can explain how a process unfolds without explaining why the mechanism, its materials, its laws, or the reality it inhabits exist. Describing rainfall does not abolish the atmosphere; describing heredity and natural selection does not abolish the question of creation."),

    block("First: what does evolution actually claim?", "h2"),
    block("In biology, evolution means that inherited characteristics in populations change across generations. Mutation and genetic recombination produce variation. Natural selection can make some inherited traits more common when they help organisms survive and reproduce in a particular environment. Genetic drift, migration, and other processes also change populations."),
    block("Common ancestry is the broader historical claim that living organisms are related through branching lines of descent. Scientists investigate that history through fossils, comparative anatomy, biogeography, observed changes in populations, and similarities and differences in DNA. Human evolution is one part of that larger account, studied through fossils, archaeology, genetics, and dating methods."),
    block("These are not all the same claim. Adaptation can be observed directly. Reconstructing deep ancestry uses converging historical evidence. Questions about the first life, the nature of consciousness, moral obligation, and whether existence has purpose belong to additional fields of inquiry."),
    {_key: key(), _type: "imageBlock", asset: {_type: "reference", _ref: evidenceImage._id}, alt: "A branching panorama of ancient marine life, plants, animals, fossils, cells, and DNA beneath a starry cosmos", caption: "Evolutionary biology describes a branching history of life, supported through several independent lines of evidence—not a simplistic ladder marching toward humanity."},
    callout("science", "Scientific honesty matters", "Evolution is strongly supported within modern biology. A serious case for a Creator should not depend on denying every observed adaptation, genetic relationship, or fossil transition. It should ask whether those discoveries are sufficient as an ultimate explanation."),

    block("Evolution is not the same thing as atheism", "h2"),
    block("Evolution is a scientific framework. Atheism is a philosophical position about God. The two can be joined, but one does not logically entail the other. The National Academies notes both the strength of evolutionary science and the fact that science, by its methods, does not prove or disprove religious claims."),
    block("When someone says, “Evolution did it, therefore God did not,” an extra premise has been added: if a natural process exists, no Creator can be behind it. But that premise is philosophy, not a finding under a microscope. Muslims already understand rain, embryonic development, gravity, and planetary motion as created processes. Learning a process does not make its Creator redundant."),
    callout("philosophy", "Agency and mechanism are not rivals", "A novelist and grammar are not competing explanations for a book. An engineer and combustion are not competing explanations for an engine. One concerns agency and intention; the other concerns the means through which an outcome occurs."),

    block("What evolution does not explain", "h2"),
    block("Even a complete evolutionary history would begin with a universe already containing matter, energy, stable regularities, and chemistry. Evolutionary theory does not explain why anything exists rather than nothing, why nature is governed by intelligible laws, or why those laws permit atoms, stars, planets, carbon chemistry, and living systems."),
    block("It also does not, by itself, explain the origin of the first self-reproducing life. Research on abiogenesis asks how nonliving chemistry could have produced the earliest life-like systems. That is an active scientific field, but it is a different question from how already-living populations diversify through evolution."),
    block("Nor does natural selection settle why conscious experience exists, why human reason should be capable of grasping abstract truth, why moral duties feel binding rather than merely useful, or why a human life has objective purpose. Evolutionary accounts may illuminate how certain capacities developed; the philosophical questions about truth, obligation, and meaning remain."),
    {_key: key(), _type: "cardGrid", cards: [
      {_key: key(), title: "Biology can investigate", body: "Variation, inheritance, adaptation, speciation, ancestry, fossils, genomes, and population change."},
      {_key: key(), title: "Origin-of-life research asks", body: "How prebiotic chemistry may have produced the earliest self-maintaining and replicating systems."},
      {_key: key(), title: "Philosophy and revelation ask", body: "Why reality and its laws exist, what consciousness and moral responsibility mean, and what human beings are for."},
    ]},

    block("Does natural selection make design unnecessary?", "h2"),
    block("Natural selection is often described as “blind” because it does not plan future adaptations. Variations arise without foresight, and environments filter their effects. But “unguided” in this scientific sense means the model does not invoke a detectable intention inside each mutation. It does not establish the metaphysical claim that no intention stands behind the existence of the entire system."),
    block("Selection can preserve useful variations only because there are living organisms capable of reproduction, heredity that is stable enough to preserve information yet flexible enough to vary, environments that exert pressures, and physical laws that make all of this possible. The mechanism works within a remarkably structured reality; it does not create that reality from nothing."),
    {_key: key(), _type: "imageBlock", asset: {_type: "reference", _ref: explanationImage._id}, alt: "DNA, cells, and branching animal populations in the foreground, nested within an ordered biosphere and mathematically structured cosmos", caption: "A biological mechanism operates inside a wider order. Explaining population change is not the same as explaining the existence of life, law, reason, or the universe."},

    block("The strongest argument is not a “God of the gaps”", "h2"),
    block("A weak argument says, “Science has not explained this yet, so God must have done it.” That argument shrinks whenever scientific knowledge grows. The Quranic case is deeper. Allah is not inserted into a temporary gap in biology. He is the reason there is a reality, a law-governed order, a field of possibilities, and creatures with the power to discover it at all."),
    block("On this view, a future scientific explanation of every biochemical step would not remove the Creator. It would describe more fully the dependable order through which creation operates. The question is not whether we can find a mechanism. The question is why there is a mechanism—and why it is intelligible."),

    block("The Quran begins with observation, not fear of it", "h2"),
    verse("Say: “Go about the earth and see how He created for the first time, and then Allah will recreate life.” Surely, Allah has power over everything.", "Quran 29:20 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    block("The verse directs the listener to travel, observe, and reflect on creation. Al-Saʿdi’s commentary connects this observation with the recurring emergence of humans, animals, plants, clouds, winds, sleep, and waking—all signs of Allah’s power to originate and restore. Al-Muyassar likewise reads the verse in the context of the first creation as evidence for resurrection."),
    callout("quran", "Study is not surrender to materialism", "Looking closely at the natural world is entirely compatible with recognizing it as creation. The scientific description and the Quranic interpretation answer related but different questions: one studies patterns and processes; the other identifies dependence, power, purpose, and accountability."),

    block("The Quran’s unavoidable question", "h2"),
    verse("Did they come into being without any creator? Or were they their own creators?", "Quran 52:35 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    verse("Or is it they who created the heavens and the earth? No; the truth is that they lack sure faith.", "Quran 52:36 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    block("These verses do not ask which biological process shaped a population. They ask a more basic question: can dependent beings account for their own existence? Al-Saʿdi lays out the logic plainly: humans did not arise without a cause, and they did not create themselves; therefore their existence points beyond them to the Creator. Al-Muyassar gives the same core reading and connects creation with worship of Allah alone."),
    block("Evolution, even if granted in its broad scientific account, does not answer this argument. A chain of living ancestors remains a chain of dependent beings. Extending the chain backward does not explain why the chain, the universe, or the laws supporting it exist."),

    block("What does the Quran say about human creation?", "h2"),
    verse("We created man out of the extract of clay,", "Quran 23:12 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    verse("then We made him into a drop of life-germ, then We placed it in a safe depository,", "Quran 23:13 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    verse("then We made this drop into a clot, then We made the clot into a lump, then We made the lump into bones, then We clothed the bones with flesh, and then We caused it to grow into another creation. Thus Most Blessed is Allah, the Best of all those that create.", "Quran 23:14 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    block("The retrieved tafsir distinguishes the creation of Adam from clay from the generation of his descendants through reproductive stages. Al-Saʿdi and Al-Muyassar both understand the opening reference as Adam and the following verses as his progeny developing in the womb. The passage’s emphasis is not that human beings are accidental matter, but that they are deliberately originated, formed in stages, and brought into a distinct human life by Allah."),
    verse("He Who excelled in the creation of all that He created. He originated the creation of man from clay,", "Quran 32:7 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    verse("then made his progeny from the extract of a mean fluid,", "Quran 32:8 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    verse("then He duly proportioned him, and breathed into him of His spirit, and bestowed upon you ears and eyes and hearts. And yet, little thanks do you give.", "Quran 32:9 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    callout("quran", "Where Muslims should be careful", "The Quran is not a modern biology textbook, and classical tafsir predates today’s evolutionary models. Muslims differ over how much evolutionary history can be reconciled with the special creation of Adam. This article does not manufacture a scientific claim from a verse or pretend that every theological question is settled. It affirms what the retrieved text clearly emphasizes: Allah creates, Adam is associated with clay, human generations develop through stages, and human beings possess a God-given distinction and responsibility."),

    block("So, if evolution is true, why do we need a Creator?", "h2"),
    {_key: key(), _type: "stepList", items: [
      "Because evolution begins with an existing universe and does not explain why there is something rather than nothing.",
      "Because a mechanism depends on laws, matter, energy, chemistry, information-bearing heredity, and life capable of reproduction.",
      "Because the origin of the first life is not the same scientific question as the evolution of living populations.",
      "Because descriptions of survival and reproduction do not establish objective truth, moral duty, or human purpose.",
      "Because dependent beings cannot be the complete explanation of their own existence.",
      "Because discovering how creation operates is not equivalent to discovering that there is no Creator.",
    ]},
    block("The real debate is therefore not “science versus God.” It is between worldviews. One worldview says that the deepest reality is impersonal and that order, consciousness, reason, and moral experience ultimately arise without intention. The Quran says that the deepest reality is the living, knowing, powerful Creator, and that the intelligibility of nature and the distinctiveness of human beings are signs."),

    {_key: key(), _type: "conclusionPanel", eyebrow: "Conclusion", title: "A mechanism is not a Maker.", body: "Evolutionary science can offer a powerful account of biological change and ancestry. It should be understood accurately, neither exaggerated into a total worldview nor dismissed merely because some people use it atheistically. Even the fullest account of life’s branching history would leave the foundational questions untouched: why a life-permitting universe exists, why its laws are intelligible, why consciousness and moral responsibility arise, and what human life is for.", finalLine: "The Quran does not tell us to stop looking at creation. It tells us to look deeply—and then refuse to confuse the pattern we discover with the One who gave the pattern existence."},
    {_key: key(), _type: "sourceList", title: "Scientific and Quranic sources", items: [
      source("Smithsonian Human Origins Program, “Human Evolution Evidence.” Overview of fossil, archaeological, genetic, and dating evidence.", "https://humanorigins.si.edu/evidence"),
      source("Smithsonian Human Origins Program, “DNA and Evolution.” Genetics and the reconstruction of evolutionary relationships.", "https://humanorigins.si.edu/dna-and-evolution"),
      source("National Academies, “Evolution Resources.” Scientific evidence, the nature of science, and the relationship between evolutionary science and religious belief.", "https://www.nationalacademies.org/evolution-resources"),
      source("National Academies, “Evolution and the Nature of Science.” Descent with modification, common ancestry, observed change, and the methodological limits of science.", "https://www.nationalacademies.org/read/5787/chapter/6"),
      source("Quran 29:20 in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation, with Al-Saʿdi and Al-Muyassar tafsir, retrieved through quran.ai.", "https://quran.com/29/20"),
      source("Quran 52:35–36 in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation, with Al-Saʿdi and Al-Muyassar tafsir, retrieved through quran.ai.", "https://quran.com/52/35-36"),
      source("Quran 23:12–14 and 32:7–9 in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation, with Al-Saʿdi and Al-Muyassar tafsir, retrieved through quran.ai.", "https://quran.com/23/12-14"),
    ]},
    {_key: key(), _type: "sideNote", body: "Grounded with quran.ai: fetch_translation(29:20, 52:35–36, 23:12–14, 32:7–9, en-al-maududi); fetch_tafsir for the same passages from Al-Saʿdi and Al-Muyassar. The comparisons with evolutionary biology, philosophy of explanation, consciousness, morality, and origin-of-life research are applied reasoning beyond the fetched canonical text. They are not a scholarly ruling or an opinion issued by quran.ai, quran.com, or quran.foundation."},
  ],
};

const result = await client.createOrReplace(article);
console.log(JSON.stringify({
  documentId: result._id,
  slug: result.slug.current,
  imageAssetIds: [evidenceImage._id, explanationImage._id],
}, null, 2));
