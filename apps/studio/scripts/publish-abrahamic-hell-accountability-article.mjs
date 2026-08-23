import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({ apiVersion: "2026-07-23" });
const key = (() => {
  let n = 0;
  return () => `ha${(++n).toString(36)}`;
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
  rows: rows.map((cells) => ({
    _key: key(),
    _type: "row",
    cells,
  })),
});

const source = (text, url) => ({
  _key: key(),
  text,
  url,
});

const article = {
  _id: "drafts.article-hell-actions-consequences-abrahamic-faiths",
  _type: "article",
  title:
    "Hell Is a Warning: What the Abrahamic Scriptures Say About Our Actions",
  slug: {
    _type: "slug",
    current: "hell-warning-abrahamic-faiths-actions-consequences",
  },
  description:
    "The Torah and wider Tanakh, the New Testament, the Quran, and a striking hadith all warn that human choices have consequences. A side-by-side study of judgment, Hell, and the danger of treating religious identity as a substitute for a righteous life.",
  taxonomies: [
    {
      _key: key(),
      _type: "reference",
      _ref: "taxonomy-questioning-religion",
    },
  ],
  body: [
    {
      _key: key(),
      _type: "lead",
      text: "What if the most dangerous religious mistake is not disbelief in judgment, but believing that a religious label will protect us while our actions tell another story? Across the Jewish Scriptures, the New Testament, and the Quran, the warning is repeated: God sees what people do, judgment is real, and wickedness has consequences beyond this life.",
    },
    callout(
      "reflection",
      "The central claim",
      "Judaism, Christianity, and Islam do not define every detail of Hell in exactly the same way. Yet their scriptures agree on the truth this article examines: human conduct is morally serious, God judges justly, and final punishment is not an empty threat. Mere affiliation, slogans, or wishful confidence must not replace repentance and righteous action.",
    ),

    block("A necessary word about “Torah” and “the three scriptures”", "h2"),
    block(
      "In everyday speech, “Torah” is sometimes used broadly for Jewish teaching or even for the whole Hebrew Bible. Strictly speaking, however, the written Torah is the Five Books of Moses. It emphasizes life, death, blessing, curse, and historical consequences, but it does not give the developed picture of postmortem Hell found in later Jewish writings.",
    ),
    block(
      "For the Jewish side of this comparison, we will therefore begin with the Torah’s teaching that choices lead to life or death, then turn to Isaiah, Daniel, and Ecclesiastes in the wider Tanakh for resurrection, final judgment, everlasting disgrace, and unquenched fire. Calling all of those passages “the Torah” would be inaccurate.",
    ),
    {
      _key: key(),
      _type: "sideNote",
      body: "This is a focused comparison of warning passages, not a claim that the three faiths have identical doctrines of salvation. It asks a narrower question: do their scriptures permit us to treat belief or religious identity as a substitute for moral accountability? The passages below deserve to answer in their own words.",
    },

    block("The Jewish Scriptures: life, judgment, and lasting disgrace", "h2"),
    block("The Torah places a consequential choice before the people:", "h3"),
    scripture(
      "“I have set before thee this day life and good, and death and evil… therefore choose life.”",
    ),
    block(
      "Deuteronomy 30:15–20 is primarily about covenantal life in the land, not a detailed doctrine of Hell. Still, its foundation is unmistakable: obedience and rebellion are not morally interchangeable, and choices carry consequences.",
    ),

    block("Ecclesiastes says every deed will be brought into judgment:", "h3"),
    scripture(
      "“God shall bring every work into judgment, with every secret thing, whether it be good, or whether it be evil.”",
    ),
    block(
      "The warning includes hidden conduct. A public identity cannot conceal the life known to God.",
    ),

    block(
      "Daniel describes two everlasting outcomes after resurrection:",
      "h3",
    ),
    scripture(
      "“Many of them that sleep in the dust of the earth shall awake, some to everlasting life, and some to… everlasting contempt.”",
    ),
    block(
      "Daniel 12:2 presents resurrection followed by a division: everlasting life for some and everlasting disgrace for others.",
    ),

    block("Isaiah ends with the image later associated with Gehenna:", "h3"),
    scripture(
      "“Their worm shall not die, neither shall their fire be quenched; and they shall be an abhorring unto all flesh.”",
    ),
    block(
      "Isaiah 66:24 speaks of the corpses of those who rebelled against God. The verse does not supply every later doctrine of Hell, but its imagery is severe and enduring: rebellion ends in disgrace, an undying worm, and fire that is not extinguished.",
    ),
    callout(
      "reflection",
      "What the Jewish passages establish",
      "From Torah to the later Tanakh, a continuous moral line appears: choose life rather than evil, remember that secret deeds face judgment, and do not imagine that rebellion ends without a final consequence.",
    ),

    block(
      "The New Testament: saying “Lord” is not the end of accountability",
      "h2",
    ),
    block(
      "Christian theology contains major discussions about grace, faith, atonement, and the meaning of works. This article does not try to resolve all of them. It simply places several New Testament judgment passages together and asks readers not to silence one passage with a slogan taken from another.",
    ),

    block("Jesus warns that verbal profession is not enough:", "h3"),
    scripture(
      "“Not everyone who says to me, ‘Lord, Lord,’ will enter into the Kingdom of Heaven; but he who does the will of my Father.”",
    ),
    block(
      "In Matthew 7:21–23, the rejected people do not lack Christian language. They call Jesus “Lord” and appeal to extraordinary works performed in his name. Yet they are dismissed as workers of lawlessness. Whatever one’s broader theology of salvation, this passage does not permit a merely verbal confession to function as a magic password.",
    ),

    block(
      "Jesus depicts judgment through treatment of vulnerable people:",
      "h3",
    ),
    scripture(
      "“I was hungry, and you gave me food… I was sick, and you visited me.”",
    ),
    block(
      "In Matthew 25:31–46, the nations are separated like sheep and goats. The scene centers on feeding the hungry, giving drink to the thirsty, welcoming the stranger, clothing the naked, and visiting the sick and imprisoned. The passage ends by contrasting “eternal punishment” with “eternal life.”",
    ),

    block("Paul says God repays each person according to works:", "h3"),
    scripture(
      "“[God] will pay back to everyone according to their works… eternal life… but… wrath and indignation.”",
    ),
    block(
      "Romans 2:6–8 places persevering good, disobedience, eternal life, and divine wrath in one judgment scene.",
    ),

    block("James rejects a faith that never becomes action:", "h3"),
    scripture("“Faith, if it has no works, is dead in itself.”"),
    block(
      "James 2:14–26 uses a practical example: words of peace do not feed or clothe a needy person. James is not describing good deeds as an optional decoration added to a living faith; he calls faith without works dead.",
    ),

    block(
      "Revelation pictures opened books and judgment according to deeds:",
      "h3",
    ),
    scripture(
      "“The dead were judged out of the things which were written in the books, according to their works.”",
    ),
    block(
      "Revelation 20:12–15 repeats that the dead are judged according to their works, then speaks of the lake of fire and the book of life. The text itself keeps judgment, deeds, and the final outcome together.",
    ),
    callout(
      "reflection",
      "The point is not “earn salvation by a checklist”",
      "The point is more basic and harder to evade: the New Testament’s own warnings do not present a claim of belief as permission to practice lawlessness, neglect the vulnerable, or live without repentance. Christian readers may explain the relationship between grace, faith, and deeds differently, but these judgment passages still demand an answer.",
    ),

    block(
      "The Quran: neither wishful thinking nor identity replaces deeds",
      "h2",
    ),
    block(
      "The Quran confronts the idea that punishment is guaranteed to be brief merely because a community feels religiously secure:",
    ),
    quranVerse(
      "They say: “The Fire will certainly not touch us except for a limited number of days.” Say (to them): “Have you received a promise from Allah – for Allah never breaks His promise – or do you attribute to Allah something about which you have no knowledge?”",
      "Quran 2:80 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    quranVerse(
      "Those who earn evil and are encompassed by their sinfulness are the people of the Fire, and there will they abide; those who believe and do righteous deeds are the people of the Garden, and there will they abide.",
      "Quran 2:81–82 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),

    block("The Quran then rejects salvation by communal wishes:", "h3"),
    quranVerse(
      "It is neither your fancies nor the fancies of the People of the Book which matter. Whoever does evil shall reap its consequence and will find none to be his protector and helper against Allah.",
      "Quran 4:123 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    quranVerse(
      "Whoever does good and believes -whether he is male or female - such shall enter the Garden, and they shall not be wronged in the slightest.",
      "Quran 4:124 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),

    block(
      "The Quran connects the Fire with rejected truth and wrongdoing:",
      "h3",
    ),
    quranVerse(
      "As for the evil-doers, their refuge shall be the Fire. Every time they want to escape from it they shall be driven back and shall be told: “Taste the chastisement of the Fire which you used to reject as a lie.”",
      "Quran 32:20 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    quranVerse(
      "Allah created the heavens and the earth in Truth that each person may be requited for his deeds. They shall not be wronged.",
      "Quran 45:22 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),

    block(
      "When the guilty are asked what drove them to Hell, they answer:",
      "h3",
    ),
    quranVerse(
      "“We were not among those who observed Prayer, and we did not feed the poor, and we indulged in vain talk with those who indulged in vain talk, and we gave the lie to the Day of Judgement until the inevitable event overtook us.”",
      "Quran 74:43–47 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "This passage does not reduce judgment to one neglected charitable act. It names a pattern: abandoned worship, failure toward the poor, immersion in corrupt discourse, and denial of the coming judgment.",
    ),

    block("Nothing is too small to appear again:", "h3"),
    quranVerse(
      "On that Day people will go forth in varying states so that they be shown their deeds. So, whoever does an atom's weight of good shall see it; and whoever does an atom's weight of evil shall see it.",
      "Quran 99:6–8 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    callout(
      "quran",
      "The Quranic warning",
      "Faith and righteous deeds are repeatedly joined. Wishes are rejected, evil has consequences, every person is recompensed without injustice, and even the smallest deed is brought to view. The appropriate response is neither despair nor complacency, but faith, repentance, worship, and moral action.",
    ),

    block(
      "A striking parallel: Matthew 25 and a hadith of Prophet Muhammad",
      "h2",
    ),
    block(
      "The closest parallel discussed in this study begins in Matthew 25:35, not verse 34 alone. The Gospel scene and Sahih Muslim 2569 both place care for the hungry, thirsty, and sick in the setting of final judgment and both use the startling language of something done—or withheld—in relation to God.",
    ),
    table("Matthew 25 and Sahih Muslim 2569 placed side by side", [
      ["Matthew 25:35–40", "Sahih Muslim 2569"],
      [
        "“I was hungry, and you gave me food… I was sick, and you visited me.” The King explains that service to “one of the least” was service to him.",
        "Allah says: “O son of Adam, I asked food from you but you did not feed Me.” He explains that His servant needed food and that feeding the servant would have been found with Allah.",
      ],
      [
        "The passage also mentions thirst, the stranger, nakedness, and imprisonment.",
        "The hadith also mentions thirst and visiting a sick servant, explaining each act through the person who needed care.",
      ],
      [
        "Neglect of the vulnerable is included in the judgment leading to eternal punishment.",
        "The exchange occurs on the Day of Resurrection and makes service to a suffering servant an encounter charged with divine accountability.",
      ],
    ]),
    block(
      "The two texts are not word-for-word identical, and their theology of divine identification is not identical. Yet the moral parallel is too specific to miss: feeding, giving drink, and visiting the sick are not peripheral acts. They are deeds that will confront the human being at judgment.",
    ),

    block("The passages placed next to one another", "h2"),
    table("A shared scriptural pattern of accountability", [
      ["Jewish Scriptures", "New Testament", "Quran"],
      [
        "God brings every work, including secret things, into judgment (Ecclesiastes 12:14).",
        "God repays each person according to works (Romans 2:6–8).",
        "Each person is requited for their deeds without injustice (Quran 45:22).",
      ],
      [
        "Some rise to everlasting life and others to everlasting contempt (Daniel 12:2).",
        "Some go to eternal life and others to eternal punishment (Matthew 25:46).",
        "People of the Garden and people of the Fire are each described as abiding (Quran 2:81–82).",
      ],
      [
        "Rebels face an undying worm and unquenched fire (Isaiah 66:24).",
        "The wicked face eternal fire and the lake of fire (Matthew 25:41; Revelation 20:14–15).",
        "Evil-doers are driven back whenever they seek to escape the Fire (Quran 32:20).",
      ],
      [
        "The Torah commands a choice between life and good, death and evil (Deuteronomy 30:15–20).",
        "Calling Jesus “Lord” does not replace doing God’s will (Matthew 7:21–23).",
        "Religious wishes do not replace belief, good action, and accountability (Quran 4:123–124).",
      ],
    ]),

    block("What this comparison does—and does not—prove", "h2"),
    block(
      "It does not prove that Judaism, Christianity, and Islam teach exactly the same account of Hell. They differ over the nature and duration of punishment, the conditions of salvation, the role of Jesus, intercession, covenant, atonement, and many other questions.",
    ),
    block(
      "It does establish a shared warning. The Torah begins with consequential moral choice. The wider Tanakh speaks of judgment, resurrection, everlasting contempt, and unquenched fire. The New Testament repeatedly places deeds in scenes of judgment and speaks explicitly of eternal punishment. The Quran warns against religious wishful thinking, describes people abiding in the Fire, and insists that every deed will be shown.",
    ),
    block(
      "This matters because religious communities can turn a truth into a shortcut. A person may say, “I belong to the covenant,” “I believe in Jesus,” or “I am a Muslim,” and then treat the name as insulation from the judgment their own scripture warns about. None of the passages studied here allows that complacency.",
    ),
    block(
      "This does not mean that human beings purchase Paradise through a pile of good deeds, that divine mercy is unnecessary, or that sincere belief does not matter. It means that authentic faith cannot be reduced to a label while a person knowingly embraces oppression, dishonesty, arrogance, cruelty, and neglect without repentance.",
    ),

    {
      _key: key(),
      _type: "conclusionPanel",
      eyebrow: "Conclusion",
      title: "Do not turn belief into an excuse to stop preparing.",
      body: "The Abrahamic scriptures speak with different vocabularies and within different theologies, but their warnings converge on a sobering truth: life is morally serious. God sees both public and secret actions. The hungry person we ignored, the truth we rejected, the injustice we excused, and the good we postponed are not lost to time. Judgment means that they return to us.",
      finalLine:
        "A religious name is not a substitute for repentance, faithfulness, and righteous action. Hell is a warning to prepare—not a doctrine to assign comfortably to everyone else.",
    },

    {
      _key: key(),
      _type: "sourceList",
      title: "Scripture and primary-source references",
      items: [
        source(
          "Deuteronomy 30:15–20; Ecclesiastes 12:13–14; Daniel 12:2; and Isaiah 66:24 in the Jewish Tanakh.",
          "https://www.sefaria.org/Daniel.12.2",
        ),
        source(
          "Isaiah 66:24 with the Hebrew text, Jewish translations, and rabbinic source links.",
          "https://www.sefaria.org/Isaiah.66.24",
        ),
        source(
          "Matthew 25:31–46, including the judgment of the sheep and goats and the NASB20 passage originally identified for comparison.",
          "https://bibleai.com/bible/NASB20/Matthew/25",
        ),
        source(
          "Matthew 7:21–23: not everyone who says “Lord, Lord” enters the Kingdom.",
          "https://www.biblegateway.com/passage/?search=Matthew%207%3A21-23",
        ),
        source(
          "Romans 2:6–8: judgment according to works, eternal life, and wrath.",
          "https://www.biblegateway.com/passage/?search=Romans%202%3A6-8",
        ),
        source(
          "James 2:14–26: the relationship between professed faith, care for people in need, and works.",
          "https://www.biblegateway.com/passage/?search=James%202%3A14-26",
        ),
        source(
          "Revelation 20:12–15: the opened books, judgment according to works, and the lake of fire.",
          "https://www.biblegateway.com/passage/?search=Revelation%2020%3A12-15",
        ),
        source(
          "Sahih Muslim 2569: the hadith of feeding the hungry, giving drink, and visiting the sick on the Day of Resurrection.",
          "https://sunnah.com/muslim:2569",
        ),
        source(
          "Quran 2:80–82 in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation.",
          "https://quran.com/2/80-82?translations=95",
        ),
        source(
          "Quran 4:123–124 in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation.",
          "https://quran.com/4/123-124?translations=95",
        ),
        source(
          "Quran 32:20 and 45:22 on the Fire and recompense for deeds.",
          "https://quran.com/32/20?translations=95",
        ),
        source(
          "Quran 74:38–48 and 99:6–8 on deeds, neglect of the poor, denial of judgment, and the smallest good or evil.",
          "https://quran.com/74/38-48?translations=95",
        ),
      ],
    },
    {
      _key: key(),
      _type: "sideNote",
      body: "Quran grounding note: all Quran quotations were retrieved from quran.ai in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation (en-al-maududi): 2:80–82, 4:123–124, 32:20, 45:22, 66:6, 74:38–48, and 99:6–8. Inline translation footnote markers were removed for display. The cross-scriptural comparison and concluding application are a synthesis beyond the fetched canonical Quran text and do not constitute a scholarly ruling or an opinion from quran.ai, quran.com, or quran.foundation. Biblical block quotations use public-domain wording where practical; links permit readers to compare translations and context.",
    },
  ],
};

const result = await client.createOrReplace(article);

console.log(
  JSON.stringify(
    {
      documentId: result._id,
      slug: result.slug.current,
      status: "draft",
    },
    null,
    2,
  ),
);
