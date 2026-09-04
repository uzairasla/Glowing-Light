import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({ apiVersion: "2026-07-23" });

const documents = await client.fetch(`*[_type == "article"] | order(title asc) {
  _id,
  title,
  body
}`);

const expectedBibleBlocks = {
  haf: "“See, I have set before thee this day life and good, and death and evil; … therefore choose life.”",
  hal: "“God shall bring every work into judgment, with every secret thing, whether it be good, or whether it be evil.”",
  har: "“And many of them that sleep in the dust of the earth shall awake, some to everlasting life, and some to shame and everlasting contempt.”",
  hax: "“Their worm shall not die, neither shall their fire be quenched; and they shall be an abhorring unto all flesh.”",
  ha18: "“Not everyone who says to me, ‘Lord, Lord,’ will enter into the Kingdom of Heaven, but he who does the will of my Father who is in heaven.”",
  ha1e: "“For I was hungry and you gave me food to eat… I was sick and you visited me.”",
  ha1k: "“[God] ‘will pay back to everyone according to their works:’ to those who by perseverance in well-doing seek for glory, honor, and incorruptibility, eternal life; but to those who are self-seeking and don’t obey the truth, but obey unrighteousness, will be wrath, indignation.”",
  ha1q: "“Even so faith, if it has no works, is dead in itself.”",
  ha1w: "“And the dead were judged out of those things which were written in the books, according to their works.”",
};

const fullArabicTenFour =
  "إِلَيْهِ مَرْجِعُكُمْ جَمِيعًا ۖ وَعْدَ اللَّهِ حَقًّا ۚ إِنَّهُ يَبْدَأُ الْخَلْقَ ثُمَّ يُعِيدُهُ لِيَجْزِيَ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ بِالْقِسْطِ ۚ وَالَّذِينَ كَفَرُوا لَهُمْ شَرَابٌ مِّنْ حَمِيمٍ وَعَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْفُرُونَ";

function portableText(block) {
  return (block.children ?? [])
    .filter((child) => child?._type === "span")
    .map((child) => child.text ?? "")
    .join("");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const quranBlocks = documents.flatMap((document) =>
  (document.body ?? [])
    .filter((item) => item?._type === "quranVerse")
    .map((item) => ({ documentId: document._id, ...item })),
);
const bibleBlocks = documents.flatMap((document) =>
  (document.body ?? [])
    .filter((item) => item?._type === "block" && item.style === "blockquote")
    .map((item) => ({
      documentId: document._id,
      key: item._key,
      text: portableText(item),
    })),
);

assert(
  documents.length === 9,
  `Expected 9 articles, found ${documents.length}`,
);
assert(
  quranBlocks.length === 59,
  `Expected 59 Quran quotation blocks, found ${quranBlocks.length}`,
);
assert(
  bibleBlocks.length === 9,
  `Expected 9 Bible/Tanakh blockquotes, found ${bibleBlocks.length}`,
);

for (const verse of quranBlocks) {
  assert(
    verse.reference?.includes("Tafhim al-Quran") &&
      verse.reference?.includes("Maududi"),
    `Unexpected Quran edition attribution in ${verse.documentId}, block ${verse._key}: ${verse.reference}`,
  );
}

for (const [key, expected] of Object.entries(expectedBibleBlocks)) {
  const quote = bibleBlocks.find((item) => item.key === key);
  assert(quote, `Expected Bible block ${key} was not found`);
  assert(
    quote.text === expected,
    `Bible block ${key} differs from its verified text`,
  );
}

for (const id of [
  "article-why-does-anything-exist",
  "article.why-does-anything-exist",
]) {
  const document = documents.find((item) => item._id === id);
  const tenFour = document?.body?.find(
    (item) => item?._type === "quranVerse" && item._key === "k5o",
  );
  assert(tenFour, `Quran 10:4 block not found in ${id}`);
  assert(
    tenFour.arabic === fullArabicTenFour,
    `Quran 10:4 Arabic is incomplete in ${id}`,
  );
}

const hellArticle = documents.find(
  (item) => item._id === "article-hell-actions-consequences-abrahamic-faiths",
);
assert(hellArticle, "Comparative Hell article not found");

const comparisonTable = hellArticle.body?.find((item) => item?._key === "ha2s");
const comparisonRow = comparisonTable?.rows?.find((row) => row._key === "ha2u");
assert(
  comparisonRow?.cells?.[0]?.startsWith(
    "“For I was hungry and you gave me food to eat…",
  ),
  "Matthew 25 table quotation is not aligned with the verified WEB wording",
);
assert(
  comparisonRow?.cells?.[1]?.includes(
    "“O son of Adam, I asked food from you but you did not feed Me.”",
  ),
  "Sahih Muslim 2569 table quotation was not found",
);

const sourceList = hellArticle.body?.find((item) => item?._key === "ha3i");
for (const key of ["ha3j", "ha3l", "ha3m", "ha3n", "ha3o", "ha3p"]) {
  const item = sourceList?.items?.find((source) => source._key === key);
  assert(item, `Source item ${key} not found`);
  assert(
    /version=(?:KJV|WEB)/.test(item.url ?? ""),
    `Source item ${key} does not identify its quoted Bible edition`,
  );
}

console.log(
  JSON.stringify(
    {
      status: "passed",
      articlesChecked: documents.length,
      quranQuotationBlocks: quranBlocks.length,
      bibleTanakhBlockquotes: bibleBlocks.length,
      hadithTableQuotation: "Sahih Muslim 2569 verified",
      quranEdition: "en-al-maududi",
      completeArabicTenFourDocuments: 2,
    },
    null,
    2,
  ),
);
