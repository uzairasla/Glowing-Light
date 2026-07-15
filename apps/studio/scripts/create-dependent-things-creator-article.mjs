import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.resolve(__dirname, "..");
const outputPath = path.join(
  studioRoot,
  "seed",
  "why-dependent-things-cannot-explain-themselves.ndjson",
);

let keyIndex = 0;

const parentTaxonomyId = "taxonomy-questioning-religion";
const childTaxonomy = {
  _id: "taxonomy-contingency-and-creator",
  _type: "taxonomy",
  title: "Contingency and Creator",
  slug: { _type: "slug", current: "contingency-and-creator" },
  description:
    "Articles about dependent existence, necessary being, divine self-sufficiency, and the Creator.",
  parent: {
    _type: "reference",
    _ref: parentTaxonomyId,
  },
};

const article = {
  _id: "article-why-dependent-things-cannot-explain-themselves",
  _type: "article",
  title: "Why Dependent Things Cannot Explain Themselves",
  slug: {
    _type: "slug",
    current: "why-dependent-things-cannot-explain-themselves",
  },
  description:
    "A clear argument for why circular dependence and an infinite chain of dependent realities cannot be ultimate, and why the only complete explanation is an independent Creator.",
  taxonomies: [
    {
      _key: key(),
      _type: "reference",
      _ref: childTaxonomy._id,
    },
  ],
  body: [
    lead(
      "Everything we experience seems to borrow its existence. A child depends on parents. A tree depends on soil, water, sunlight, and seed. A planet depends on matter, gravity, and laws it did not invent. The question is simple, but deep: can borrowed existence explain itself?",
    ),
    callout(
      "philosophy",
      "The core claim",
      "If every reality in a chain is dependent, then the chain itself still has not explained why anything exists. A circle of dependent things cannot explain itself, and an endless regress of dependent things still never gives us an independent source. The only complete explanation is a reality that does not borrow existence from anything else.",
    ),
    toc([
      ["What dependent means", "what-dependent-means"],
      ["Why circular dependence fails", "why-circular-dependence-fails"],
      ["Why an infinite regress does not solve it", "why-an-infinite-regress-does-not-solve-it"],
      ["What the explanation must be like", "what-the-explanation-must-be-like"],
      ["The Quranic language of independence", "the-quranic-language-of-independence"],
      ["What this does and does not prove", "what-this-does-and-does-not-prove"],
      ["Sources", "sources"],
    ]),
    h2("What dependent means"),
    p(
      "A dependent thing is something whose existence is not explained by itself. It may be real, powerful, beautiful, ancient, and scientifically describable, but it still depends on conditions outside itself. Its existence is received, not self-owned.",
    ),
    p(
      "This is true of ordinary things. A house depends on materials, builders, land, physical laws, and prior causes. A living body depends on cells, chemistry, information, food, time, and a world able to sustain life. Even the universe, if treated as a physical reality with parts, laws, quantities, energy, and structure, raises the same question: why does this dependent order exist at all?",
    ),
    cardGrid([
      [
        "Dependent",
        "A thing that receives existence or explanation from outside itself.",
      ],
      [
        "Necessary",
        "A reality that does not borrow existence and cannot fail to be.",
      ],
      [
        "Circular explanation",
        "A depends on B, while B depends on A. Neither side has independent grounding.",
      ],
      [
        "Infinite regress",
        "Every link depends on a prior link forever, but no link explains the whole chain.",
      ],
    ]),
    h2("Why circular dependence fails"),
    p(
      "Imagine two lamps in a dark room. Lamp A says, 'I am lit because Lamp B gives me light.' Lamp B says, 'I am lit because Lamp A gives me light.' If neither lamp has light independently, then their circular explanation explains nothing. The circle only moves the problem around.",
    ),
    p(
      "The same is true for existence. If A exists because of B, and B exists because of A, then neither has the power to explain existence. A circle of borrowed existence is still borrowed. It has no source.",
    ),
    callout(
      "reflection",
      "The borrowing problem",
      "Borrowed money cannot become original wealth just because it moves in a circle. Borrowed existence cannot become self-existence just because dependence is arranged in a loop.",
    ),
    h2("Why an infinite regress does not solve it"),
    p(
      "Someone might avoid the circle and propose an infinite chain instead. A depends on B, B depends on C, C depends on D, and so on forever. But this still leaves the core question untouched: why does the whole dependent chain exist?",
    ),
    p(
      "Adding more dependent links does not change the kind of explanation we have. If every link borrows existence, then no link owns existence. An infinite number of mirrors can reflect light forever, but if there is no source of light, there is nothing to reflect.",
    ),
    stepList([
      "Every link in the chain is dependent.",
      "No dependent link explains its own existence.",
      "Adding more dependent links only gives more things needing explanation.",
      "An infinite chain of dependent things is still dependent in the relevant sense.",
      "Therefore the final explanation cannot be another dependent link inside the chain.",
    ]),
    h2("What the explanation must be like"),
    p(
      "If dependent reality is real, then the explanation cannot be merely another dependent thing. It must be independent. It must not receive existence from elsewhere. It must not be one more object inside the chain. It must be the reason dependent things can exist at all.",
    ),
    p(
      "This is why the argument points beyond the universe, not merely to a very old object within it. A first physical event, if it is still physical, measurable, law-governed, and dependent, would itself need explanation. The ultimate explanation must exist outside the cycle of dependence.",
    ),
    cardGrid([
      [
        "Independent",
        "It does not borrow existence from anything prior.",
      ],
      [
        "Necessary",
        "It is not contingent, temporary, or optional.",
      ],
      [
        "Sustaining",
        "It explains why dependent reality continues to exist.",
      ],
      [
        "Beyond the chain",
        "It is not merely another dependent item inside the universe.",
      ],
    ]),
    h2("The Quranic language of independence"),
    p(
      "The philosophical argument reaches the idea of an independent, necessary source. The Quran gives that source a name and attributes: Allah, the One, the Self-Sufficient, the One upon whom all depend.",
    ),
    quranVerse(
      "Say: \"He is Allah, the One and Unique; Allah, Who is in need of none and of Whom all are in need; He neither begot any nor was He begotten, and none is comparable to Him.\"",
      "Quran 112:1-4 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    sideNote(
      "Tafsir grounding: Al-Muyassar explains al-Samad as the One perfected in majesty and greatness, to whom creation turns for needs. Al-Sa'di explains that the inhabitants of the heavens and earth are in utter need of Him, while He is perfect in His attributes.",
    ),
    quranVerse(
      "O people, it is you who stand in need of Allah; as for Allah, He is Self-Sufficient, Immensely Praiseworthy.",
      "Quran 35:15 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    sideNote(
      "Tafsir grounding: Al-Muyassar says people need Allah in everything and cannot be independent from Him even for the blink of an eye. Al-Sa'di expands this need to existence, powers, provision, protection, guidance, worship, learning, and spiritual life.",
    ),
    quranVerse(
      "Allah, the Ever-Living, the Self-Subsisting by Whom all subsist, there is no god but He. Neither slumber seizes Him, nor sleep; to Him belongs all that is in the heavens and all that is in the earth. Who is there who might intercede with Him save with His leave? He knows what lies before them and what is hidden from them, whereas they cannot attain to anything of His knowledge save what He wills them to attain. His Dominion overspreads the heavens and the earth, and their upholding wearies Him not. He is All-High, All-Glorious.",
      "Quran 2:255 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    sideNote(
      "Tafsir grounding: Al-Sa'di explains al-Qayyum as the One who stands by Himself and by whom others stand. He is the Creator, Sustainer, Manager, Giver of life and death, and nothing in the heavens or earth owns independent power before Him.",
    ),
    quranVerse(
      "He is the First and the Last, and the Manifest and the Hidden, and He has knowledge of everything.",
      "Quran 57:3 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    sideNote(
      "Tafsir grounding: Al-Muyassar and Al-Sa'di both explain 'the First' as the One before whom there is nothing. This directly answers the idea of a prior-dependent chain as ultimate.",
    ),
    h2("What this does and does not prove"),
    p(
      "This argument does not claim that every mystery in science is proof of God. It is not a gap argument. It does not say, 'We do not know the mechanism, therefore God.' Instead, it asks a deeper question about explanation itself: can dependent reality be ultimate?",
    ),
    p(
      "The answer is no. A dependent thing cannot explain itself. A circle of dependent things cannot explain itself. An infinite chain of dependent things cannot explain itself. The chain needs what is not merely another link in the chain.",
    ),
    callout(
      "quran",
      "The Quranic conclusion",
      "The Quran does not present Allah as one dependent being among others. It presents Him as the One, the Self-Sufficient, the First, the Creator of all things, the Sustainer by whom all subsist. The philosophical argument points toward independent necessary being; revelation identifies that reality as Allah.",
    ),
    quranVerse(
      "He is the Originator of the heavens and the earth. How can He have a son when He has had no mate? And He has created everything and He has full knowledge of all things. Such is Allah, your Lord. There is no god but He - the Creator of all things. Serve Him alone - for it is He Who is the guardian of everything.",
      "Quran 6:101-102 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    quranVerse(
      "Surely Allah holds the heavens and the earth, lest they should be displaced there, for if they were displaced none would be able to hold them after Him. Surely He is Most Forbearing, Most Forgiving.",
      "Quran 35:41 - Translation: Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    conclusionPanel(
      "Conclusion",
      "Borrowed existence needs an unborrowed source.",
      "The argument is simple but powerful: dependence cannot be ultimate. Whether dependence is arranged as a circle, stretched into an infinite regress, or hidden behind the language of physical law, it still requires explanation. The complete explanation must be independent, necessary, and outside the cycle.",
      "The Quran calls us to recognize that every created thing is poor before Allah, while Allah is Self-Sufficient and Praiseworthy.",
    ),
    sourceList("Quran and tafsir grounding", [
      [
        "Quran translation retrieved with quran.ai search_quran and fetch_translation using Tafhim al-Quran by Sayyid Abul A'la al-Maududi: 112:1-4, 35:15, 2:255, 57:3, 6:101-102, and 35:41. Inline footnote markers were removed for display.",
        "https://quran.com",
      ],
      [
        "Tafsir retrieved with quran.ai fetch_tafsir from Al-Tafsir al-Muyassar and Tafsir al-Sa'di for the same verses.",
        "https://quran.com/tafsirs",
      ],
    ]),
    sideNote(
      "Grounding note: Quran translations and tafsir references in this article were grounded with quran.ai: search_quran(self-sufficient/dependence), fetch_translation(112:1-4, 35:15, 2:255, 57:3, 6:101-102, 35:41, en-al-maududi), and fetch_tafsir(same verses, ar-muyassar, ar-saadi). The philosophical synthesis is reflective reasoning beyond the fetched tafsir and is not a scholarly ruling or an opinion from quran.ai, quran.com, or quran.foundation.",
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
  return `dep${keyIndex.toString(36)}`;
}
