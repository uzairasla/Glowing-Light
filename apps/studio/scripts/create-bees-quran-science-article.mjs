import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.resolve(__dirname, "..");
const outputPath = path.join(
  studioRoot,
  "seed",
  "what-bees-reveal-about-the-creator.ndjson",
);

let keyIndex = 0;

const parentTaxonomyId = "taxonomy-questioning-religion";
const childTaxonomy = {
  _id: "taxonomy-bees-and-signs",
  _type: "taxonomy",
  title: "Bees and Signs",
  slug: { _type: "slug", current: "bees-and-signs" },
  description:
    "Articles that reflect on bees, honey, pollination, ecological order, and Quranic signs.",
  parent: {
    _type: "reference",
    _ref: parentTaxonomyId,
  },
};

const article = {
  _id: "article-what-bees-reveal-about-the-creator",
  _type: "article",
  title: "What Bees Reveal About the Creator",
  slug: {
    _type: "slug",
    current: "what-bees-reveal-about-the-creator",
  },
  description:
    "A reflection on bees in the Quran, the science of hives, pollination, navigation, honey, and how small creatures can become signs for people who think.",
  taxonomies: [
    {
      _key: key(),
      _type: "reference",
      _ref: childTaxonomy._id,
    },
  ],
  body: [
    lead(
      "The Quran does not ask us to look only at mountains, stars, and galaxies. Sometimes it directs attention to something small enough to land on a flower: the bee. In a tiny creature, the Quran points to shelter, instinct, movement, food, healing, color, and reflection.",
    ),
    callout(
      "reflection",
      "What this article argues",
      "The bee is not presented here as a shortcut around science. Biology helps us see the sign more clearly: bees build homes, navigate landscapes, communicate food locations, pollinate plants, organize colonies, and produce honey with properties still studied by researchers. The Quranic claim is deeper than the science: this ordered life is not meaningless. It is a sign for people who reflect.",
    ),
    toc([
      ["The Quran names the bee", "the-quran-names-the-bee"],
      ["A small creature with guided behavior", "a-small-creature-with-guided-behavior"],
      ["Homes, paths, and navigation", "homes-paths-and-navigation"],
      ["Pollination and provision", "pollination-and-provision"],
      ["Honey, color, and healing", "honey-color-and-healing"],
      ["What the sign asks from us", "what-the-sign-asks-from-us"],
      ["Sources", "sources"],
    ]),
    h2("The Quran names the bee"),
    p(
      "Surah al-Nahl, the chapter named after the bee, places the bee inside a wider passage about created blessings: livestock, water, crops, fruits, paths, shelters, and signs in the natural world. The bee is not isolated from the rest of creation. It belongs to a living web of provision.",
    ),
    quranVerse(
      "Your Lord inspired the bee, saying: \"Set up hives in the mountains and in the trees and in the trellises that people put up, then suck the juice of every kind of fruit and keep treading the ways of your Lord which have been made easy.\" There comes forth from their bellies a drink varied in colours, wherein there is healing for men. Verily there is a sign in this for those who reflect.",
      "Quran 16:68-69 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    sideNote(
      "Translation note: Maududi's quran.ai text includes inline footnote markers on quran.com; those markers were removed here for display while preserving the translation wording.",
    ),
    p(
      "The verse moves through a chain: inspiration, dwelling, foraging, paths, honey, healing, and reflection. That sequence is remarkable because modern biology also sees the bee as a creature of ordered behavior, not random motion.",
    ),
    h2("A small creature with guided behavior"),
    p(
      "A honey bee colony behaves like a coordinated society. Different bees perform different tasks over the life of the colony: nursing brood, cleaning cells, building wax comb, guarding the entrance, processing nectar, regulating temperature, and foraging outside. The single bee is tiny, but the colony functions through distributed cooperation.",
    ),
    cardGrid([
      [
        "Division of labor",
        "A colony depends on many tasks happening together: brood care, comb building, cleaning, guarding, foraging, and food processing.",
      ],
      [
        "Collective regulation",
        "Bees help regulate conditions inside the hive, including temperature and ventilation, through coordinated behavior.",
      ],
      [
        "Living architecture",
        "The hive is not just shelter. It is nursery, storage system, communication space, and production site.",
      ],
      [
        "Small causes, wide effects",
        "A bee moving between flowers participates in fruiting plants, agriculture, wild ecosystems, and human provision.",
      ],
    ]),
    callout(
      "quran",
      "Tafsir grounding",
      "Al-Muyassar explains that Allah inspired the bee to make homes in mountains, trees, and human-made structures, then to travel easy paths in search of provision and return without losing its way. Al-Sa'di highlights the bee's astonishing guidance, its prepared grazing grounds, its return to homes, and the honey that differs in color according to land and forage.",
    ),
    h2("Homes, paths, and navigation"),
    p(
      "The Quranic wording mentions homes and paths. Science gives us a window into how extraordinary those paths are. Honey bees navigate using multiple cues, including the sun, visual landmarks, and information shared by other bees. The famous waggle dance communicates useful information about the direction and distance of resources. In the darkness of a hive, a forager can return from the outside world and help direct others toward food.",
    ),
    p(
      "This does not mean the Quran is a biology textbook. It means that the more closely we study the bee, the richer the verse becomes as a prompt for reflection. A path made easy is not necessarily simple; it can be easy for the bee precisely because the creature has been equipped for it.",
    ),
    callout(
      "science",
      "A careful science note",
      "Bee navigation and communication are active research areas. Researchers have modeled and decoded waggle dances, and experiments with biomimetic robot dances have shown that dance-following bees can use communicated information to adjust flight paths. The scientific language is mechanism; the Quranic language is guidance and sign.",
    ),
    h2("Pollination and provision"),
    p(
      "Bees are best known for honey, but their ecological work is broader. As bees visit flowers for nectar and pollen, they can transfer pollen between flowers. Pollination helps many flowering plants reproduce and supports fruits, seeds, and crops that human beings and animals depend on.",
    ),
    p(
      "The USDA Forest Service describes pollination as important to the world's seed plants, terrestrial ecosystems, and human beings. It also notes that pollinators play a crucial role in flowering plant reproduction and in producing many fruits and vegetables. Here the bee becomes a sign not only as an individual creature, but as part of a network of provision.",
    ),
    stepList([
      "A flower offers nectar and pollen.",
      "A bee gathers food for the colony.",
      "Pollen may be transferred as the bee moves between flowers.",
      "Plants produce fruit and seed through successful reproduction.",
      "Humans receive food, sweetness, medicine, beauty, and ecological stability through a chain they did not design.",
    ]),
    h2("Honey, color, and healing"),
    p(
      "The Quran mentions a drink from the bees' bellies, varied in color, with healing for people. Science gives a cautious way to speak about that. Honey differs by floral source, geography, processing, moisture, minerals, phenolic compounds, and other factors. Its color and flavor can change with the nectar source.",
    ),
    p(
      "Modern research also studies honey's antimicrobial and wound-related properties, especially in medical-grade preparations. A Cochrane review found that evidence varies by wound type and comparison, so sweeping medical claims should be avoided. But the existence of serious research into honey's healing properties makes the Quranic invitation to reflection feel freshly relevant.",
    ),
    callout(
      "science",
      "Do not overclaim the healing point",
      "This article is not medical advice. The Quranic phrase 'wherein there is healing for men' should be treated with reverence, while scientific discussion should remain precise: honey has studied antimicrobial and wound-care properties, but ordinary table honey should not be treated as a replacement for medical care, and infants under one year should not be given honey.",
    ),
    h2("What the sign asks from us"),
    p(
      "The end of the verse matters: 'Verily there is a sign in this for those who reflect.' The bee does not force faith upon the observer. It invites a kind of seeing. One person sees only insect behavior. Another sees insect behavior and then asks why the world is intelligible, ordered, fruitful, and full of layered benefit.",
    ),
    p(
      "That is the difference between looking at nature and reading nature as a sign. Science can describe the bee's mechanisms: comb, flight, pheromones, dance, nectar processing, antimicrobial chemistry. Revelation asks what those mechanisms are doing in a world where small creatures sustain vast systems of provision.",
    ),
    conclusionPanel(
      "Conclusion",
      "The bee is small, but the sign is not.",
      "A bee can be studied through microscopes, field experiments, robotics, ecology, agriculture, chemistry, and medicine. Each layer adds detail. The Quran gathers those details into a moral and spiritual question: will we reflect?",
      "The bee moves through paths made easy, and the thoughtful person follows that sign back to the One who made the path.",
    ),
    sourceList("Scientific sources", [
      [
        "USDA Forest Service, 'Pollinators.' Used for pollination's role in seed plants, terrestrial ecosystems, flowering plant reproduction, and fruits/vegetables.",
        "https://www.fs.usda.gov/managing-land/wildflowers/pollinators",
      ],
      [
        "Landgraf et al., 'Dancing Honey bee Robot Elicits Dance-Following and Recruits Foragers.' Used for the waggle-dance communication and robot-dance experiment summary.",
        "https://arxiv.org/abs/1803.07126",
      ],
      [
        "Wario et al., 'Automatic detection and decoding of honey bee waggle dances.' Used for the framing that waggle dances encode resource direction/distance and can be quantitatively decoded.",
        "https://arxiv.org/abs/1708.06590",
      ],
      [
        "Jull et al., 'Honey as a topical treatment for wounds,' Cochrane Database of Systematic Reviews, 2015. Used for cautious medical framing about honey and wounds.",
        "https://doi.org/10.1002/14651858.CD005083.pub4",
      ],
      [
        "Nolan, Harrison, and Cox, 'Dissecting the Antimicrobial Composition of Honey,' Antibiotics, 2019. Used for antimicrobial-composition framing.",
        "https://doi.org/10.3390/antibiotics8040251",
      ],
    ]),
    sourceList("Quran and tafsir grounding", [
      [
        "Quran translation retrieved with quran.ai search_quran and fetch_translation using Tafhim al-Quran by Sayyid Abul A'la al-Maududi for 16:68-69. Inline footnote markers were removed for display.",
        "https://quran.com/en/16/68",
      ],
      [
        "Tafsir retrieved with quran.ai fetch_tafsir from Al-Tafsir al-Muyassar and Tafsir al-Sa'di for 16:68-69.",
        "https://quran.com/16:68/tafsirs",
      ],
    ]),
    sideNote(
      "Grounding note: Quran translation and tafsir references in this article were grounded with quran.ai: search_quran(bees/honey), fetch_translation(16:68-69, en-al-maududi), and fetch_tafsir(16:68-69, ar-muyassar, ar-saadi). The science-to-Quran synthesis is reflective reasoning beyond the fetched tafsir and is not a scholarly ruling or an opinion from quran.ai, quran.com, or quran.foundation.",
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
  return `bee${keyIndex.toString(36)}`;
}
