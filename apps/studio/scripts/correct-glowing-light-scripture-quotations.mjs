import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({ apiVersion: "2026-07-23" });

const fullArabicTenFour =
  "إِلَيْهِ مَرْجِعُكُمْ جَمِيعًا ۖ وَعْدَ اللَّهِ حَقًّا ۚ إِنَّهُ يَبْدَأُ الْخَلْقَ ثُمَّ يُعِيدُهُ لِيَجْزِيَ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ بِالْقِسْطِ ۚ وَالَّذِينَ كَفَرُوا لَهُمْ شَرَابٌ مِّنْ حَمِيمٍ وَعَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْفُرُونَ";

const maududiCorrections = {
  k4m: {
    translation:
      "Did they come into being without any creator? Or were they their own creators? Or is it they who created the heavens and the earth? No; the truth is that they lack sure faith.",
    reference:
      "Quran 52:35–36 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
  },
  k4t: {
    translation:
      "Surely in the creation of the heavens and the earth, and in the alternation of night and day, there are signs for men of understanding.",
    reference:
      "Quran 3:190 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
  },
  k50: {
    translation:
      "those who remember Allah while standing, sitting or (reclining) on their backs, and reflect in the creation of the heavens and the earth, (saying): 'Our Lord! You have not created this in vain. Glory to You! Save us, then, from the chastisement of the Fire.",
    reference:
      "Quran 3:191 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
  },
  k55: {
    translation:
      'Did you imagine that We created you without any purpose, and that you will not be brought back to Us?"',
    reference:
      "Quran 23:115 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
  },
  k5a: {
    translation:
      "I created the jinn and humans for nothing else but that they may serve Me;",
    reference:
      "Quran 51:56 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
  },
  k5h: {
    translation:
      "Who created death and life that He might try you as to which of you is better in deed. He is the Most Mighty, the Most Forgiving;",
    reference:
      "Quran 67:2 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
  },
  k5o: {
    arabic: fullArabicTenFour,
    translation:
      "To Him is your return. This is Allah's promise that will certainly come true. Surely it is He Who brings about the creation of all and He will repeat it so that He may justly reward those who believe and do righteous deeds; and that those who disbelieve may have a draught of boiling water and suffer a painful chastisement for their denying the truth.",
    reference:
      "Quran 10:4 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
  },
};

const bibleCorrections = {
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

function setPortableText(block, text) {
  if (!block?.children?.[0]) {
    throw new Error(
      `Portable Text block ${block?._key ?? "unknown"} has no span`,
    );
  }
  block.children[0].text = text;
}

function updateSourceItem(sourceList, key, changes) {
  const item = sourceList.items?.find((candidate) => candidate._key === key);
  if (!item) {
    throw new Error(`Source item ${key} not found`);
  }
  Object.assign(item, changes);
}

function updateUniverseArticle(document, legacy) {
  const body = structuredClone(document.body ?? []);
  const tenFour = body.find((item) => item?._key === "k5o");
  if (!tenFour || tenFour._type !== "quranVerse") {
    throw new Error(`Quran 10:4 block not found in ${document._id}`);
  }
  tenFour.arabic = fullArabicTenFour;

  if (legacy) {
    for (const [blockKey, changes] of Object.entries(maududiCorrections)) {
      const verse = body.find((item) => item?._key === blockKey);
      if (!verse || verse._type !== "quranVerse") {
        throw new Error(`Quran block ${blockKey} not found in ${document._id}`);
      }
      Object.assign(verse, changes);
    }

    const groundingNote = body.find((item) => item?._key === "k64");
    if (!groundingNote || groundingNote._type !== "sideNote") {
      throw new Error(`Grounding note not found in ${document._id}`);
    }
    groundingNote.body =
      "Grounded with quran.ai: fetch_quran(3:190–191, 10:4, 23:115, 51:56, 52:35–36, 67:2, ar-simple-clean); fetch_translation(same verses, en-al-maududi); fetch_tafsir(same verses, ar-muyassar and ar-saadi). Inline translation footnote markers were removed for display. The cross-disciplinary synthesis includes philosophical reasoning beyond the fetched canonical text and is not a scholarly ruling or opinion from quran.ai, quran.com, or quran.foundation.";
  }

  return body;
}

function updateHellArticle(document) {
  const body = structuredClone(document.body ?? []);

  for (const [blockKey, text] of Object.entries(bibleCorrections)) {
    const block = body.find((item) => item?._key === blockKey);
    if (!block || block._type !== "block" || block.style !== "blockquote") {
      throw new Error(`Bible block ${blockKey} not found in ${document._id}`);
    }
    setPortableText(block, text);
  }

  const comparisonTable = body.find((item) => item?._key === "ha2s");
  const comparisonRow = comparisonTable?.rows?.find(
    (row) => row._key === "ha2u",
  );
  if (!comparisonRow?.cells?.[0]) {
    throw new Error(
      `Matthew/hadith comparison row not found in ${document._id}`,
    );
  }
  comparisonRow.cells[0] =
    "“For I was hungry and you gave me food to eat… I was sick and you visited me.” The King explains that service to “one of the least” was service to him.";

  const sourceList = body.find((item) => item?._key === "ha3i");
  if (!sourceList || sourceList._type !== "sourceList") {
    throw new Error(`Source list not found in ${document._id}`);
  }

  updateSourceItem(sourceList, "ha3j", {
    text: "Deuteronomy 30:15–20; Ecclesiastes 12:14; Daniel 12:2; and Isaiah 66:24. Block quotations use the public-domain King James Version (KJV).",
    url: "https://www.biblegateway.com/passage/?search=Deuteronomy%2030%3A15-20%3B%20Ecclesiastes%2012%3A14%3B%20Daniel%2012%3A2%3B%20Isaiah%2066%3A24&version=KJV",
  });
  updateSourceItem(sourceList, "ha3l", {
    text: "Matthew 25:31–46 in the public-domain World English Bible (WEB), used for the article’s block quotation.",
    url: "https://www.biblegateway.com/passage/?search=Matthew%2025%3A31-46&version=WEB",
  });
  sourceList.items.splice(
    sourceList.items.findIndex((item) => item._key === "ha3l") + 1,
    0,
    {
      _key: "audit-matthew25-nasb20",
      text: "Matthew 25 in NASB20 on Bible AI, the passage originally identified for comparison with Sahih Muslim 2569.",
      url: "https://bibleai.com/bible/NASB20/Matthew/25",
    },
  );
  updateSourceItem(sourceList, "ha3m", {
    text: "Matthew 7:21–23 in the public-domain World English Bible (WEB).",
    url: "https://www.biblegateway.com/passage/?search=Matthew%207%3A21-23&version=WEB",
  });
  updateSourceItem(sourceList, "ha3n", {
    text: "Romans 2:6–8 in the public-domain World English Bible (WEB).",
    url: "https://www.biblegateway.com/passage/?search=Romans%202%3A6-8&version=WEB",
  });
  updateSourceItem(sourceList, "ha3o", {
    text: "James 2:14–26 in the public-domain World English Bible (WEB).",
    url: "https://www.biblegateway.com/passage/?search=James%202%3A14-26&version=WEB",
  });
  updateSourceItem(sourceList, "ha3p", {
    text: "Revelation 20:12–15 in the public-domain King James Version (KJV).",
    url: "https://www.biblegateway.com/passage/?search=Revelation%2020%3A12-15&version=KJV",
  });

  const groundingNote = body.find((item) => item?._key === "ha3v");
  if (!groundingNote || groundingNote._type !== "sideNote") {
    throw new Error(`Grounding note not found in ${document._id}`);
  }
  groundingNote.body =
    "Quran grounding note: all Quran quotations were retrieved from quran.ai in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation (en-al-maududi): 2:80–82, 4:123–124, 32:20, 45:22, 74:43–47, and 99:6–8. Inline translation footnote markers were removed for display. The cross-scriptural comparison and concluding application are a synthesis beyond the fetched canonical Quran text and do not constitute a scholarly ruling or an opinion from quran.ai, quran.com, or quran.foundation. Biblical block quotations use the explicitly identified public-domain KJV or WEB wording; the hadith quotation follows the English text displayed for Sahih Muslim 2569 on Sunnah.com.";

  return body;
}

const targetDefinitions = [
  {
    id: "article-why-does-anything-exist",
    update: (document) => updateUniverseArticle(document, false),
    summary:
      "Restored the omitted second half of the Arabic text of Quran 10:4.",
  },
  {
    id: "article.why-does-anything-exist",
    update: (document) => updateUniverseArticle(document, true),
    summary:
      "Standardized seven Quran quotations to fetched Maududi text and restored the complete Arabic of Quran 10:4.",
  },
  {
    id: "article-hell-actions-consequences-abrahamic-faiths",
    update: updateHellArticle,
    summary:
      "Restored omitted Bible wording, identified exact KJV/WEB sources, aligned the Matthew table quote, and corrected the grounding inventory.",
  },
];

const updates = [];
const transaction = client.transaction();

for (const definition of targetDefinitions) {
  for (const id of [definition.id, `drafts.${definition.id}`]) {
    const document = await client.getDocument(id);
    if (!document) {
      continue;
    }

    const body = definition.update(document);
    transaction.patch(id, (patch) =>
      patch.ifRevisionId(document._rev).set({ body }),
    );
    updates.push({
      id,
      previousRevision: document._rev,
      summary: definition.summary,
    });
  }
}

if (updates.length === 0) {
  throw new Error("No target Sanity documents were found");
}

const result = await transaction.commit({ visibility: "sync" });

console.log(
  JSON.stringify(
    {
      transactionId: result.transactionId,
      updatedDocuments: updates,
    },
    null,
    2,
  ),
);
