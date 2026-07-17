import {createReadStream} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname, resolve} from "node:path";
import sanityCli from "sanity/cli";

const here = dirname(fileURLToPath(import.meta.url));
const client = sanityCli.getCliClient({apiVersion: "2026-07-04"});
const key = (() => { let n = 0; return () => `ft${(++n).toString(36)}`; })();
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

const [goldilocks, filters] = await Promise.all([
  upload("earth-goldilocks-zone.png", "Earth in the Sun's habitable zone"),
  upload("habitability-filters.png", "The converging requirements for a habitable world"),
]);

const article = {
  _id: "drafts.article-a-world-prepared-for-life",
  _type: "article",
  title: "A World Prepared for Life: Coincidence or a Sign of a Creator?",
  slug: {_type: "slug", current: "a-world-prepared-for-life"},
  description: "Earth is not habitable because of one lucky feature. It sits within a wider convergence of water, orbit, atmosphere, chemistry, protection, and cosmic order that invites a deeper question about purpose and creation.",
  taxonomies: [{_key: key(), _type: "reference", _ref: "taxonomy-questioning-religion"}],
  body: [
    {_key: key(), _type: "lead", text: "Earth appears small against the scale of the universe, yet it contains oceans, a life-supporting atmosphere, usable energy, complex chemistry, and living beings able to reflect on their own existence. Life depends not on one favorable condition, but on many conditions arriving together. What should we make of that convergence?"},
    callout("reflection", "The argument in one sentence", "Science does not give us a single accepted number for the probability of a life-permitting planet or universe. But it does reveal a remarkable convergence of necessary conditions. This article asks whether purposeful creation is a better explanation of that total pattern than unexplained coincidence."),

    block("The right place around the right kind of star", "h2"),
    block("Earth orbits within the Sun's habitable zone, often called the Goldilocks zone: the range of distances where surface temperatures may allow liquid water, provided the planet also has a suitable atmosphere. Too close and surface water may be lost to extreme heat; too far and widespread surface water may freeze."),
    block("But location is only a first filter. NASA emphasizes that a planet's size, atmosphere, temperature, and the behavior of its star also matter. Mars lies near the outer part of our Sun's present-day habitable zone, yet its thin atmosphere and cold surface do not support oceans today. A place in the zone makes habitability possible; it does not make life inevitable."),
    {_key: key(), _type: "imageBlock", asset: {_type: "reference", _ref: goldilocks._id}, alt: "Illustration of Venus, Earth, and Mars orbiting the Sun, with Earth highlighted inside a green habitable-zone band", caption: "The habitable zone describes where liquid surface water may be possible. It is an important first condition, not a guarantee of life."},

    block("A planet rich in liquid water", "h2"),
    block("Every known form of life depends on liquid water. Water carries dissolved materials, participates in cellular chemistry, distributes heat, and supplies an environment in which biological reactions can occur. Earth does not merely contain traces of water: oceans cover most of its surface, while water circulates through the atmosphere, soil, ice, rivers, organisms, and underground reservoirs."),
    callout("quran", "A striking numerical claim—with an important caution", "A widely shared observation counts “land” (al-barr) 13 times and “sea” (al-bahr) 32 times, producing 45 mentions in total. On that count, land is 13 ÷ 45 = 28.9% and sea is 32 ÷ 45 = 71.1%—figures that resemble the familiar estimate that Earth’s surface is about 29% land and 71% water. The arithmetic is striking, but the count is not linguistically straightforward and should not be presented as an established numerical miracle."),
    {_key: key(), _type: "cardGrid", cards: [
      {_key: key(), title: "The popular calculation", body: "13 land mentions ÷ 45 total = 28.9%. 32 sea mentions ÷ 45 total = 71.1%."},
      {_key: key(), title: "What the corpus check found", body: "The Quran corpus used here identifies 12 occurrences of the exact land-sense stem al-barr. The sea lemma appears 41 times when singular, dual, plural, and repeated forms are included."},
      {_key: key(), title: "Why totals can change", body: "Counts differ when researchers include or exclude grammatical cases, duals, plurals, metaphorical uses, repeated words in one verse, or words sharing a root but carrying another meaning."},
    ]},
    block("The resemblance is therefore best offered as a point of reflection about the Quran’s repeated attention to land and sea—not as a mathematical proof. A sound argument for creation should not depend on a word count that changes with the counting method."),
    verse("Did the unbelievers (who do not accept the teaching of the Prophet) not realize that the heavens and the earth were one solid mass, then We tore them apart, and We made every living being out of water? Will they, then, not believe (that We created all this)?", "Quran 21:30 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    {_key: key(), _type: "sideNote", body: "Quran grounding: the translation above and the Arabic word-frequency data were retrieved through quran.ai. Its morphology data reports 12 occurrences for the exact land-sense stem بَرّ and 41 occurrences for the sea lemma بَحْر across its forms. Connecting Quranic language to modern surface-area measurements is contemplative reflection, not a claim that the verse supplies a scientific ratio."},

    block("An atmosphere, climate, and shield", "h2"),
    block("Earth's atmosphere performs several tasks together. It supplies pressure that permits surface water to remain liquid, moderates temperature, carries gases used by life, and filters some harmful radiation. Its climate is neither permanently frozen nor trapped in a Venus-like runaway greenhouse state."),
    block("Earth's magnetic field adds another layer of protection. It deflects much of the charged solar wind and can help protect an atmosphere from erosion. Beneath our feet, a dynamic planetary interior contributes to this magnetic field and to long-term geological cycles. Habitability is not a single feature sitting on Earth's surface; it is an interacting planetary system."),

    block("The universe had to permit life before Earth could host it", "h2"),
    block("Long before oceans or cells could exist, the universe needed stable matter, long-lived stars, usable chemistry, and physical laws that allowed galaxies and planets to form. Stars had to manufacture and distribute elements such as carbon and oxygen. Fundamental parameters had to permit complex structures rather than a universe that expanded too quickly for galaxies to form or collapsed before life had time to develop."),
    block("Scientific discussions call this fine-tuning: the observation that some laws, constants, and initial conditions occupy ranges compatible with complex, embodied life. Scientists and philosophers disagree about its ultimate explanation. Proposed accounts include deeper physical necessity, observational selection within a multiverse, brute fact, and intentional design."),
    verse("We have created everything in a determined measure.", "Quran 54:49 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),

    block("What can probability honestly tell us?", "h2"),
    callout("science", "Eight planets—not a one-in-eight probability", "Our Solar System has eight recognized planets. Earth is the only one currently known to host life. That gives an observed count of one inhabited planet among eight, but it does not establish that any randomly chosen planet has a 1/8 chance of life. One solar system is too small and too selection-biased a sample, and the planets are not equivalent trials. Pluto has been classified as a dwarf planet since 2006."),
    block("We cannot responsibly multiply real-looking percentages for each condition unless we know their probability distributions and dependencies. We do not yet know how often life begins when conditions are suitable, how many different environments can support unfamiliar forms of life, or how frequently the relevant planetary conditions occur together."),
    block("We can, however, use a hypothetical model to understand the logic of compounding requirements. Suppose—purely for illustration—that five independent requirements each occurred on one planet in ten:"),
    {_key: key(), _type: "stepList", items: [
      "A long-lived and sufficiently stable star: assumed 1 in 10.",
      "A rocky planet in a suitable orbit: assumed 1 in 10.",
      "A life-compatible atmosphere and climate: assumed 1 in 10.",
      "Persistent liquid water and usable chemistry: assumed 1 in 10.",
      "Long-term stability sufficient for complex life: assumed 1 in 10.",
    ]},
    block("Under those invented assumptions, and only if the conditions were independent, the combined fraction would be 1/10 × 1/10 × 1/10 × 1/10 × 1/10 = 1 in 100,000. Change the assumptions and the answer changes. The value is not an estimate of life in the universe; it is a teaching example showing why several filters can narrow possibilities quickly."),
    {_key: key(), _type: "imageBlock", asset: {_type: "reference", _ref: filters._id}, alt: "A sequence of narrowing circular filters representing a stable star, suitable orbit, rocky planet, atmosphere, water, and environmental stability before reaching Earth", caption: "An illustration of converging requirements—not a measured probability. The filters interact, and their true frequencies remain uncertain."},
    callout("philosophy", "The more defensible inference", "The fine-tuning argument does not need a sensational number. Its force comes from the explanatory pattern: a law-governed universe, capable of stable complexity, contains a planet where many life-permitting systems converge. The philosophical question is which worldview makes that pattern least surprising."),

    block("Chance, necessity, selection, or purpose?", "h2"),
    block("Calling something 'chance' may describe our lack of a further explanation, but it does not itself explain why the possible outcomes, laws, or probability structure exist. Physical necessity would be powerful if a deeper theory showed that the life-permitting conditions could not have been otherwise, but no established theory currently settles every fine-tuning question. A multiverse may broaden the number of trials, yet it also raises questions about the mechanism generating universes and the laws governing that mechanism."),
    block("Intentional creation offers a different kind of explanation. A rational Creator would not be surprised to produce an ordered and intelligible reality capable of life, consciousness, moral responsibility, and knowledge. This is a philosophical inference, not a result measured by a telescope. It should be evaluated alongside the alternatives rather than disguised as a laboratory proof."),

    block("The Quran asks us to look—and look again", "h2"),
    verse("Surely in the creation of the heavens and the earth, and in the alternation of night and day, there are signs for men of understanding.", "Quran 3:190 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    verse("those who remember Allah while standing, sitting or (reclining) on their backs, and reflect in the creation of the heavens and the earth, (saying): 'Our Lord! You have not created this in vain. Glory to You! Save us, then, from the chastisement of the Fire.", "Quran 3:191 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    block("In the retrieved translation, reflection on creation is joined to the conclusion that it is not without purpose. This article's comparison between that Quranic invitation and modern habitability research is a contemplative synthesis; it is not a claim that the verses teach a specific astrophysical model."),
    verse("(To guide) those who use their reason (to this Truth) there are many Signs in the structure of the heavens and the earth, in the constant alternation of night and day, in the vessels which speed across the sea carrying goods that are of profit to people, in the water which Allah sends down from the sky and thereby quickens the earth after it was dead, and disperse over it all manner of animals, and in the changing courses of the winds and the clouds pressed into service between heaven and earth.", "Quran 2:164 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    verse("Who created the seven heavens one upon another. You will see no incongruity in the Merciful One's creation. Turn your vision again, can you see any flaw?", "Quran 67:3 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    verse("Then turn your vision again, and then again; in the end your vision will come back to you, worn out and frustrated.", "Quran 67:4 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    callout("quran", "An invitation to reason", "The Quranic movement is not away from observation. It repeatedly directs attention toward the heavens, the earth, water, living creatures, measure, and order. For the believer, understanding a mechanism does not remove the Creator; it reveals more of the coherence of what has been created."),

    {_key: key(), _type: "conclusionPanel", eyebrow: "Conclusion", title: "A habitable world is more than a lucky address.", body: "Earth's orbit matters, but so do its water, atmosphere, chemistry, protective systems, geological history, stable energy source, and the deeper laws that permit planets and life to exist. We cannot convert all of this into one honest, universally accepted probability. We can recognize that the convergence calls for explanation.", finalLine: "Science describes the conditions with growing precision. Reason asks why such an ordered, life-permitting reality exists. The Quran invites us to see that order as a sign rather than pass it by without reflection."},
    {_key: key(), _type: "sourceList", title: "Scientific and Quranic sources", items: [
      source("NASA Science, ‘What is the Habitable Zone or Goldilocks Zone?’ Used for the definition and limits of the habitable-zone concept.", "https://science.nasa.gov/exoplanets/what-is-the-habitable-zone-or-goldilocks-zone/"),
      source("NASA Science, ‘Can We Find Life?’ Used for additional planetary and stellar requirements beyond orbital distance.", "https://science.nasa.gov/exoplanets/can-we-find-life/"),
      source("NASA Science, ‘Beginnings: Life on Our World and Others.’ Used for liquid water and life-as-we-know-it framing.", "https://science.nasa.gov/universe/search-for-life/beginnings-life-on-our-world-and-others/"),
      source("NASA Science, ‘Earth-like Exoplanets May Have Magnetic Fields Capable of Protecting Life.’ Used for magnetic-field and atmospheric-protection context.", "https://science.nasa.gov/universe/exoplanets/earth-like-exoplanets-may-have-magnetic-fields-capable-of-protecting-life/"),
      source("Luke A. Barnes, ‘The Fine-Tuning of the Universe for Intelligent Life.’ Review of scientific fine-tuning literature.", "https://arxiv.org/abs/1112.4647"),
      source("Fred C. Adams, ‘The Degree of Fine-Tuning in our Universe—and Others.’ Review of constraints on life-permitting constants and parameters.", "https://arxiv.org/abs/1902.03928"),
      source("Quran 2:164 in Sayyid Abul A'la Maududi's Tafhim al-Quran translation, retrieved through quran.ai.", "https://quran.com/en/2/164"),
      source("Quran 3:190–191 in Sayyid Abul A'la Maududi's Tafhim al-Quran translation, retrieved through quran.ai.", "https://quran.com/en/3/190-191"),
      source("Quran 21:30 in Sayyid Abul A'la Maududi's Tafhim al-Quran translation, retrieved through quran.ai.", "https://quran.com/en/21/30"),
      source("Quran 54:49 and 67:3–4 in Sayyid Abul A'la Maududi's Tafhim al-Quran translation, retrieved through quran.ai.", "https://quran.com/en/67/3-4"),
    ]},
    {_key: key(), _type: "sideNote", body: "Grounded with quran.ai: fetch_translation(2:164, 3:190–191, 21:30, 54:49, 67:3–4, en-al-maududi); fetch_word_morphology(5:96, al-barr and al-bahr); fetch_word_concordance(lemma barr and bahr). Note: the scientific-philosophical synthesis, numerical-pattern discussion, and illustrative probability model incorporate reasoning beyond the fetched canonical text and do not constitute a scholarly ruling or opinion from quran.ai, quran.com, or quran.foundation."},
  ],
};

const result = await client.createOrReplace(article);
console.log(JSON.stringify({documentId: result._id, slug: result.slug.current, imageAssetIds: [goldilocks._id, filters._id]}, null, 2));
