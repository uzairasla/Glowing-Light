import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { createClient } from "@sanity/client";

const session = JSON.parse(
  await readFile(join(homedir(), ".config", "sanity", "config.json"), "utf8"),
);
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "dis8yhkz",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  apiVersion: "2026-07-23",
  useCdn: false,
  token: session.authToken,
});
const key = (() => {
  let n = 0;
  return () => `ja${(++n).toString(36)}`;
})();

const block = (text, style = "normal") => ({
  _key: key(),
  _type: "block",
  style,
  markDefs: [],
  children: [{ _key: key(), _type: "span", marks: [], text }],
});

const scripture = (text) => block(text, "blockquote");

const quranVerse = (translation, reference) => ({
  _key: key(),
  _type: "quranVerse",
  translation,
  reference,
});

const callout = (tone, title, body) => ({
  _key: key(),
  _type: "callout",
  tone,
  title,
  body,
});

const table = (caption, rows) => ({
  _key: key(),
  _type: "table",
  caption,
  rows: rows.map((cells) => ({ _key: key(), _type: "row", cells })),
});

const source = (text, url) => ({ _key: key(), text, url });

const article = {
  _id: "drafts.article-judgment-accountability-abrahamic-faiths",
  _type: "article",
  title: "Nothing Is Hidden: Judgment and Accountability Across the Abrahamic Faiths",
  slug: { _type: "slug", current: "judgment-accountability-abrahamic-faiths" },
  description:
    "The Jewish Scriptures, New Testament, and Quran all teach that God sees what is hidden, preserves a true account, judges without favoritism, and calls every person to answer for how they lived.",
  taxonomies: [
    { _key: key(), _type: "reference", _ref: "84c893d4-2898-4444-b36d-3f8607d78b9a" },
  ],
  body: [
    {
      _key: key(),
      _type: "lead",
      text: "A private act can be hidden from family, neighbors, clergy, and courts. It cannot be hidden from God. Across the Jewish Scriptures, the New Testament, and the Quran, judgment is presented as the moment when excuses fall away, the concealed is disclosed, and every human being encounters the moral truth of the life they actually lived.",
    },
    callout(
      "reflection",
      "The central claim",
      "The three faiths do not have identical doctrines of salvation, atonement, intercession, or the final state. They do share a demanding moral framework: God knows the whole truth, judges justly, shows no corrupt favoritism, and does not permit a religious label to turn unrepented wrongdoing into righteousness.",
    ),

    block("One Judge, a complete account, and no missing evidence", "h2"),
    block(
      "Human judgment is limited. Witnesses forget, records disappear, powerful people shape the story, and motives remain hidden. Scriptural judgment is different because the Judge does not need to discover the facts. The recurring images of hidden things exposed, books opened, and deeds weighed express the completeness and justice of God's knowledge.",
    ),
    table("The shared structure of accountability", [
      ["Question", "Jewish Scriptures", "New Testament", "Quran"],
      [
        "What is known?",
        "Every deed, including what is hidden (Ecclesiastes 12:14).",
        "No creature is hidden; even careless words face account (Hebrews 4:13; Matthew 12:36).",
        "The record leaves out nothing small or great (18:49).",
      ],
      [
        "Who answers?",
        "The person who sins bears that guilt (Ezekiel 18:20).",
        "Each of us gives an account (Romans 14:12).",
        "No bearer bears another's burden (53:38).",
      ],
      [
        "Is judgment biased?",
        "God shows no favor and takes no bribe (Deuteronomy 10:17).",
        "There is no partiality with God (Romans 2:11).",
        "No soul is wronged in the least (21:47).",
      ],
      [
        "Is return possible?",
        "Turn from wrongdoing and live (Ezekiel 18:21-23, 30-32).",
        "Repentance and grace remain central before judgment (Romans 2:4; Hebrews 4:16).",
        "Do not despair of Allah's mercy; return before punishment comes (39:53-54).",
      ],
    ]),

    block("The Jewish Scriptures: every deed and every hidden thing", "h2"),
    block("Ecclesiastes ends by joining reverence, obedience, and judgment:", "h3"),
    scripture(
      "“Fear God, and keep his commandments... For God shall bring every work into judgment, with every secret thing, whether it be good, or whether it be evil.”",
    ),
    block(
      "Ecclesiastes 12:13-14 refuses to divide public religion from private conduct. What is secret to other people remains within the scope of divine judgment. Fear of God is therefore not merely an inward feeling; the passage connects it to keeping God's commandments.",
    ),
    block("Ezekiel rejects transferred guilt and calls the wrongdoer to turn:", "h3"),
    scripture(
      "“The soul that sinneth, it shall die. The son shall not bear the iniquity of the father.”",
    ),
    block(
      "Ezekiel 18 addresses a proverb that blamed the present generation's condition on its ancestors. Its answer is personal moral responsibility: a child is not declared guilty merely for a parent's sin, and a parent is not declared guilty merely for a child's. The chapter also rejects fatalism. If the wicked person turns from sin and practices justice, that person may live; God takes no pleasure in the death of the wicked, but desires that the person turn and live.",
    ),
    callout(
      "insight",
      "Accountability is not inherited despair",
      "Ezekiel's teaching is both severe and hopeful. A person cannot transfer guilt to an ancestor, child, group, or label—but neither is a sinner imprisoned forever in yesterday's identity. Repentance changes the direction of the life being judged.",
    ),

    block("The New Testament: every person gives an account", "h2"),
    block(
      "Christian traditions differ sharply over how grace, faith, works, justification, sanctification, and final judgment relate. Those debates should be represented honestly. Yet they cannot erase the New Testament's repeated language of accountability.",
    ),
    block("Jesus includes speech within the evidence of judgment:", "h3"),
    scripture(
      "“For every careless word that people speak, they will give an account of it on the day of judgment.”",
    ),
    block(
      "Matthew 12:36-37 makes accountability more searching than a list of visible crimes. Words disclose the heart, harm or heal other people, and become morally significant before God.",
    ),
    block("Paul describes an impartial judgment according to deeds:", "h3"),
    scripture(
      "“[God] will repay each person according to his deeds... For there is no partiality with God.”",
    ),
    block(
      "Romans 2:5-11 addresses people tempted to judge others while excusing themselves. It places Jew and Greek under the same righteous Judge and connects eternal life, wrath, perseverance in good, disobedience, and impartiality in one continuous argument.",
    ),
    block("The same personal summons appears elsewhere:", "h3"),
    scripture("“Each one of us will give an account of himself to God.”"),
    block(
      "Romans 14:10-12 uses coming judgment to restrain contempt and condemnation among believers. Second Corinthians 5:10 says all must appear before the judgment seat of Christ to receive according to what was done in the body, whether good or bad. Hebrews 4:13 adds that no creature is hidden from God's sight.",
    ),
    callout(
      "reflection",
      "Grace is not permission to become unaccountable",
      "A responsible comparison should not claim that Paul taught salvation could be purchased by moral arithmetic. It should also not use grace to silence Paul's own judgment passages. The New Testament presents mercy, faith, transformation, perseverance, and judgment together; Christian communities explain their relationship differently.",
    ),

    block("The Quran: the record is opened and the scales are just", "h2"),
    block(
      "The Quran repeatedly speaks of return to Allah, a written record, precise scales, personal burdens, and the absence of injustice. The images are not offered to satisfy curiosity about an unseen bureaucracy. They teach that nothing morally real disappears.",
    ),
    quranVerse(
      "We have fastened every man's omen to his neck. On the Day of Resurrection We shall produce for him his scroll in the shape of a wide open book, (saying): “Read your scroll; this Day you suffice to take account of yourself.”",
      "Quran 17:13-14 — Tafhim al-Quran (Maududi)",
    ),
    block(
      "The person is confronted with a record that is recognizably his own. Judgment is not an arbitrary accusation imposed from outside; the life itself becomes testimony.",
    ),
    quranVerse(
      "And then the Record of their deeds shall be placed before them and you will see the guilty full of fear for what it contains, and will say: “Woe to us! What a Record this is! It leaves nothing, big or small, but encompasses it.” They will find their deeds confronting them. Your Lord wrongs no one.",
      "Quran 18:49 — Tafhim al-Quran (Maududi)",
    ),
    block(
      "The record is comprehensive, but precision is joined to justice. The purpose is not to portray God searching for a technicality; the verse ends by denying that the Lord wrongs anyone.",
    ),
    quranVerse(
      "We shall set up just scales on the Day of Resurrection so that none will be wronged in the least. (We shall bring forth the acts of everyone), even if it be the weight of a grain of mustard seed. We shall suffice as Reckoners.",
      "Quran 21:47 — Tafhim al-Quran (Maududi)",
    ),
    block(
      "The mustard seed makes the moral point vivid: neither a small good nor a small wrong becomes invisible merely because human beings overlooked it.",
    ),
    quranVerse(
      "That no bearer of a burden shall bear the burden of another, and that man shall have nothing but what he has striven for, and that (the result of) his striving shall soon be seen, and that he shall then be fully recompensed.",
      "Quran 53:38-41 — Tafhim al-Quran (Maududi)",
    ),
    block(
      "The passage joins personal burden, striving, disclosure, and recompense. It rules out moral complacency based on ancestry or community while preserving the Quran's wider teaching that all good ultimately depends on Allah's guidance and mercy.",
    ),

    block("Judaism and Islam: an especially close moral parallel", "h2"),
    block(
      "Ezekiel 18 and Quran 53:38 state the principle in remarkably close form: one person does not bear another person's guilt. Ecclesiastes 12 and Quran 18:49 likewise bring hidden or forgotten deeds into judgment. In both scriptural traditions, accountability is personal, conduct matters, repentance is real, and divine judgment is not corrupted by status.",
    ),
    block(
      "The comparison should still be made carefully. The texts arise in different languages, covenants, prophetic settings, and later interpretive traditions. Similarity does not make the traditions interchangeable; it identifies a shared moral grammar.",
    ),

    block("Christianity: judgment remains even amid debates about salvation", "h2"),
    block(
      "Christian readers commonly interpret judgment through the person and work of Jesus. Traditions disagree about whether final judgment according to deeds is evidential, distributive, transformative, or connected to justification in another way. This article does not settle that intra-Christian dispute.",
    ),
    block(
      "It does establish what the passages themselves will not let a reader dismiss: Jesus warns about words on the day of judgment; Paul says God repays according to deeds without partiality; believers must each give an account; and all appear before the judgment seat. Whatever saving faith means, the New Testament does not describe it as a license for unrepented cruelty, hypocrisy, or indifference.",
    ),

    block("Mercy does not cancel accountability; it makes repentance possible", "h2"),
    block(
      "Fear alone can produce despair, while reassurance without accountability can produce complacency. The scriptures repeatedly resist both errors. Ezekiel calls the wicked to turn and live. Romans says God's kindness leads toward repentance. Hebrews invites the believer to approach the throne of grace for mercy. The Quran commands those who have wronged themselves not to despair of Allah's mercy and immediately calls them to turn back before punishment arrives.",
    ),
    quranVerse(
      "Tell them, (O Prophet): “My servants who have committed excesses against themselves, do not despair of Allah's Mercy. Surely Allah forgives all sins. He is Most Forgiving, Most Merciful.”",
      "Quran 39:53 — Tafhim al-Quran (Maududi)",
    ),
    block(
      "Mercy is therefore not a reason to postpone change. It is the reason change is still possible. Accountability asks us to stop defending the false self, return to God, repair what can be repaired, and live differently while time remains.",
    ),

    block("Questions to ask before judging someone else", "h2"),
    table("A personal accountability audit", [
      ["Area", "Question"],
      ["The hidden life", "What would I change if every private act were brought into the light?"],
      ["Speech", "Which words have harmed, deceived, humiliated, or divided others?"],
      ["Religious identity", "Am I trusting a label while resisting what God commands?"],
      ["Other people", "Am I using their failures to avoid examining my own?"],
      ["Repentance", "What wrong must I stop, confess, repair, or seek forgiveness for now?"],
      ["Good left undone", "Which act of justice, mercy, or courage am I continually postponing?"],
    ]),

    {
      _key: key(),
      _type: "conclusionPanel",
      eyebrow: "Conclusion",
      title: "We will not answer for the identity we advertised, but for the truth God knows.",
      body: "Across the Abrahamic scriptures, judgment means that moral reality is preserved. Hidden deeds are not lost. Words matter. Status does not bribe the Judge. Another person's guilt cannot become our excuse, and another person's righteousness cannot substitute for our own response to God.",
      finalLine:
        "The right response is neither despair nor self-righteousness. It is honest repentance, trust in God's mercy, repaired conduct, and a life prepared to give account.",
    },
    callout(
      "reflection",
      "Continue the study",
      "This article asks how accountability works. Its companion, “Hell Is a Warning,” examines the scriptural consequences attached to persistent wickedness and the danger of treating belief as a substitute for preparation.",
    ),

    {
      _key: key(),
      _type: "sourceList",
      title: "Scripture and primary-source references",
      items: [
        source(
          "Ecclesiastes 12:13-14: fear God, keep the commandments, and remember that every hidden deed comes into judgment.",
          "https://www.sefaria.org/Ecclesiastes.12.13-14",
        ),
        source(
          "Ezekiel 18:20-32: personal responsibility, repentance, and God's call to turn and live.",
          "https://www.sefaria.org/Ezekiel.18.20-32",
        ),
        source(
          "Matthew 12:36-37: accountability for careless words on the day of judgment.",
          "https://www.biblegateway.com/passage/?search=Matthew%2012%3A36-37&version=NASB",
        ),
        source(
          "Romans 2:5-11: righteous judgment according to deeds and no partiality with God.",
          "https://www.biblegateway.com/passage/?search=Romans%202%3A5-11&version=NASB",
        ),
        source(
          "Romans 14:10-12: each person will give an account to God.",
          "https://www.biblegateway.com/passage/?search=Romans%2014%3A10-12&version=NASB",
        ),
        source(
          "2 Corinthians 5:10 and Hebrews 4:13: judgment for deeds and nothing hidden from God's sight.",
          "https://www.biblegateway.com/passage/?search=2%20Corinthians%205%3A10%3B%20Hebrews%204%3A13&version=NASB",
        ),
        source(
          "Quran 17:13-14 in Sayyid Abul A'la Maududi's Tafhim al-Quran translation.",
          "https://quran.com/17/13-14?translations=95",
        ),
        source(
          "Quran 18:49 and 21:47 on the complete record and just scales.",
          "https://quran.com/18/49?translations=95",
        ),
        source(
          "Quran 53:38-41 on personal burden, striving, disclosure, and recompense.",
          "https://quran.com/53/38-41?translations=95",
        ),
        source(
          "Quran 39:53-54 on mercy and the urgent call to turn back to Allah.",
          "https://quran.com/39/53-54?translations=95",
        ),
        source(
          "Companion article: Hell Is a Warning—What the Abrahamic Scriptures Say About Our Actions.",
          "https://theglowinglight.com/lessons/hell-warning-abrahamic-faiths-actions-consequences",
        ),
      ],
    },
    {
      _key: key(),
      _type: "sideNote",
      body: "Quran grounding note: all Quran quotations were retrieved from quran.ai in Sayyid Abul A'la Maududi's Tafhim al-Quran translation (en-al-maududi): 17:13-14, 18:49, 21:47, 39:53-54, and 53:38-41. Inline translation footnote markers were removed for display. Comparative conclusions are the author's synthesis and are not a ruling or an opinion from quran.ai, quran.com, or quran.foundation. Biblical quotations are kept brief, and the primary-source links allow readers to inspect each passage in context.",
    },
  ],
};

const shouldPublish = process.argv.includes("--publish");

if (shouldPublish) {
  const publishedId = article._id.replace(/^drafts\./, "");
  const publishedArticle = { ...article, _id: publishedId };
  const result = await client
    .transaction()
    .createOrReplace(publishedArticle)
    .delete(article._id)
    .commit();

  console.log(
    JSON.stringify(
      {
        documentId: publishedId,
        slug: article.slug.current,
        status: "published",
        transactionId: result.transactionId,
      },
      null,
      2,
    ),
  );
} else {
  const result = await client.createOrReplace(article);
  console.log(
    JSON.stringify(
      { documentId: result._id, slug: result.slug.current, status: "draft" },
      null,
      2,
    ),
  );
}
