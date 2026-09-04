import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({apiVersion: "2026-07-24"});

const taxonomyId = "84c893d4-2898-4444-b36d-3f8607d78b9a";
const siteUrl = "https://theglowinglight.com";
const onenessSlug = "one-god-oneness-abrahamic-faiths";
const jesusSlug = "is-jesus-god-scripture-trinity-textual-evidence";
const onenessUrl = `${siteUrl}/lessons/${onenessSlug}`;
const jesusUrl = `${siteUrl}/lessons/${jesusSlug}`;

const key = (() => {
  let value = 0;
  return () => `og${(++value).toString(36)}`;
})();

const span = (text, marks = []) => ({
  _key: key(),
  _type: "span",
  marks,
  text,
});

const block = (text, style = "normal") => ({
  _key: key(),
  _type: "block",
  style,
  markDefs: [],
  children: [span(text)],
});

const linkedBlock = (before, linkText, href, after = "", style = "normal") => {
  const markKey = key();

  return {
    _key: key(),
    _type: "block",
    style,
    markDefs: [{_key: markKey, _type: "link", href}],
    children: [
      ...(before ? [span(before)] : []),
      span(linkText, [markKey]),
      ...(after ? [span(after)] : []),
    ],
  };
};

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

const sideNote = (body) => ({
  _key: key(),
  _type: "sideNote",
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
  _type: "source",
  text,
  url,
});

const sourceList = (title, items) => ({
  _key: key(),
  _type: "sourceList",
  title,
  items,
});

const conclusion = (title, body, finalLine) => ({
  _key: key(),
  _type: "conclusionPanel",
  eyebrow: "Conclusion",
  title,
  body,
  finalLine,
});

const taxonomyReference = () => ({
  _key: key(),
  _type: "reference",
  _ref: taxonomyId,
});

const onenessArticle = {
  _id: "drafts.article-one-god-oneness-abrahamic-faiths",
  _type: "article",
  title: "The One God: Divine Oneness Across the Abrahamic Faiths",
  slug: {_type: "slug", current: onenessSlug},
  description:
    "Judaism, Christianity, and Islam all confess one sovereign Creator. Their scriptures share a powerful monotheistic foundation, but they divide over whether Jesus and the Holy Spirit belong within the identity of the one God.",
  taxonomies: [taxonomyReference()],
  body: [
    {
      _key: key(),
      _type: "lead",
      text: "The foundational confession of the Abrahamic faiths is not that God is one option among many. God is the sole Creator, without rival, and therefore alone deserves worship. The central disagreement begins only when Christianity includes Jesus and the Holy Spirit within that one divine identity.",
    },
    callout(
      "reflection",
      "The central finding",
      "Judaism, Christianity, and Islam genuinely meet at belief in one God. They do not, however, define that oneness identically. Judaism and Islam understand divine unity as excluding incarnation and multiple divine persons. Mainstream Christianity teaches one divine essence in three distinct persons.",
    ),

    block("The confession at the center: God is one", "h2"),
    block(
      "The most important comparison begins with the Shema, continues in the teaching of Jesus, and appears again in the Quran.",
    ),
    scripture("“Hear, O Israel: the LORD our God, the LORD is one.”"),
    block(
      "Deuteronomy 6:4 can also be rendered “the LORD alone.” In its immediate context, divine oneness is not an abstract number. Israel must love God with the whole heart, soul, and strength and must not follow other gods.",
    ),
    scripture(
      "“The first is this: ‘Hear, O Israel! The Lord our God is Lord alone!’”",
    ),
    block(
      "In Mark 12:29–34, Jesus identifies the Shema as the first commandment. The scribe answers that God is one and that there is no other, and Jesus approves his understanding.",
    ),
    quranVerse(
      "Your God is One God, there is no god but He; the Most Merciful, the Most Compassionate.",
      "Quran 2:163 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "Al-Baghawi explains “one” here as having no peer and no partner. Al-Wasit connects God’s oneness to His exclusive right to worship. The verse joins majesty to mercy: the one God is the Most Merciful and Most Compassionate.",
    ),
    table("The shared confession", [
      ["Torah", "Gospel", "Quran"],
      [
        "The LORD our God, the LORD is one or alone (Deuteronomy 6:4).",
        "Jesus repeats the Shema as the first commandment (Mark 12:29).",
        "Your God is One God; there is no god but He (Quran 2:163).",
      ],
      [
        "Love God with all the heart, soul, and might.",
        "Love God wholly and love one’s neighbor.",
        "Serve the sole Creator, who alone possesses divinity.",
      ],
    ]),

    block("Judaism: unity without division or incarnation", "h2"),
    scripture(
      "“Before Me no god was formed, and after Me none shall exist.”",
    ),
    block(
      "Isaiah 43:10–11 excludes a divine predecessor, successor, or competing savior. Isaiah 44:6 similarly declares that God is the first and the last and that no god exists beside Him. Isaiah 45:5–6 repeats the same claim to the nations.",
    ),
    block(
      "Maimonides later formulates this unity philosophically. God is not one member of a class and not a body divisible into parts. His unity is unlike created unity. Classical Judaism therefore does not treat God’s word, wisdom, spirit, or presence as additional persons within God, and it does not include Jesus within the divine identity.",
    ),
    sideNote(
      "Plural wording such as “Let us make humankind” in Genesis 1:26 is not traditionally read as a Trinity. Rashi interprets it as God consulting the heavenly court, while Genesis 1:27 returns immediately to the singular action: God created.",
    ),

    block("Christianity: one God understood as triune", "h2"),
    block(
      "The New Testament preserves the Jewish confession of one God. Jesus repeats the Shema; John 17:3 calls the Father “the only true God”; 1 Timothy 2:5 declares one God and one mediator; and James 2:19 says that believing God is one is correct.",
    ),
    block(
      "Other New Testament passages give Jesus extraordinary divine language or place Father, Son, and Spirit together. John 1 calls the Word God and says that the Word became flesh. Thomas addresses the risen Jesus as “My Lord and my God.” Matthew 28:19 names Father, Son, and Holy Spirit in baptism. First Corinthians 8:6 names one God, the Father, and one Lord, Jesus Christ.",
    ),
    block(
      "Mainstream Christianity eventually interpreted these passages through the doctrine of the Trinity: one undivided divine essence existing as three genuinely distinct persons. Christianity therefore rejects the accusation that it worships three gods. In its own theological grammar, the Father, Son, and Holy Spirit do not divide the divine being among themselves.",
    ),
    callout(
      "philosophy",
      "Scripture and later terminology",
      "The New Testament contains monotheistic, Christological, and triadic passages, but it never gives the complete formula “one essence in three coequal persons.” Terms such as ousia, hypostasis, and consubstantial were refined through later controversies and councils.",
    ),

    block("Islam: one, unique, self-sufficient, and incomparable", "h2"),
    quranVerse(
      "Say: “He is Allah, the One and Unique; Allah, Who is in need of none and of Whom all are in need; He neither begot any nor was He begotten, and none is comparable to Him.”",
      "Quran 112:1–4 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "Al-Wasit interprets this surah as affirming God’s oneness in His essence, attributes, and actions while denying composition, dependence, parentage, and any comparable being. Al-Baghawi records explanations of al-Samad that emphasize complete perfection, enduring independence, and the dependence of creation upon God.",
    ),
    quranVerse(
      "Such is Allah, your Lord. There is no god but He - the Creator of all things. Serve Him alone - for it is He Who is the guardian of everything.",
      "Quran 6:102 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "The Quran makes creation the basis of worship: because God alone creates and sustains all things, worship belongs to Him alone. Quran 21:22 and 23:91 also argue that multiple gods would produce rival sovereignty and disorder.",
    ),
    block(
      "Quran 4:171 calls Jesus the Messiah, God’s messenger, His word conveyed to Mary, and a spirit from Him. It then rejects saying “Three,” declares that God is one, and denies divine sonship. Al-Baghawi and Al-Wasit interpret “His word” as Jesus being created by God’s command and “a spirit from Him” as a spirit originating by God’s command—not a portion of the divine being.",
    ),

    block("Where the three faiths agree", "h2"),
    table("Agreement and disagreement", [
      ["Question", "Shared answer", "Principal disagreement"],
      [
        "How many ultimate Creators exist?",
        "One sovereign source and Creator of all things.",
        "Whether Jesus participates eternally in the Creator’s identity.",
      ],
      [
        "Who deserves ultimate worship?",
        "God alone; idolatry and divine rivals are rejected.",
        "Whether worship directed to Jesus is worship of the one God.",
      ],
      [
        "Is God comparable to creation?",
        "God transcends created limitations and dependencies.",
        "Whether the transcendent God may assume a human nature.",
      ],
      [
        "Is oneness only an idea?",
        "No. It requires loyalty, love, worship, and obedience.",
        "How faithfulness to the one God is expressed through each covenant.",
      ],
    ]),
    block(
      "The three traditions therefore share a real monotheistic foundation. But “one God” does not erase their disagreement. The decisive issue is whether Jesus belongs inside the identity of that one God or stands as the Messiah and messenger sent by Him.",
    ),
    linkedBlock(
      "That question requires a separate textual and historical investigation. Continue with ",
      "Is Jesus God? What the Scriptures Actually Say",
      jesusUrl,
      ".",
    ),
    conclusion(
      "Oneness is a claim upon the whole person.",
      "The Shema commands wholehearted love. Jesus repeats it as the first commandment. The Quran joins God’s oneness to His exclusive right to worship. Across the traditions, monotheism is not merely counting correctly; it is refusing every rival that competes with God for worship, trust, fear, obedience, and love.",
      "The shared confession is one God. The unresolved question is whom that confession includes.",
    ),
    sourceList("Scripture and research references", [
      source(
        "Deuteronomy 6:4–5, including the traditional “one” rendering and the “alone” translation.",
        "https://www.sefaria.org/Deuteronomy.6.4-5",
      ),
      source(
        "Isaiah 43:10–11; 44:6; and 45:5–6 on the absence of any other God.",
        "https://www.sefaria.org/Isaiah.43.10-11",
      ),
      source(
        "Maimonides, Mishneh Torah, Foundations of the Torah 1:7, on divine unity and indivisibility.",
        "https://www.sefaria.org/Mishneh_Torah%2C_Foundations_of_the_Torah.1.7?lang=he&with=Translations",
      ),
      source(
        "Rashi on Genesis 1:26 and the traditional Jewish reading of “Let us make.”",
        "https://www.sefaria.org/Rashi_on_Genesis.1.26.4",
      ),
      source(
        "Mark 12:28–34, where Jesus repeats the Shema.",
        "https://bible.usccb.org/bible/mark/12",
      ),
      source(
        "John 17:1–5 and 1 Corinthians 8:4–6 on the one God, the Father, and Jesus Christ.",
        "https://bible.usccb.org/bible/john/17",
      ),
      source(
        "The Catholic Catechism’s formal explanation of one God in three persons.",
        "https://www.vatican.va/content/catechism/en/part_one/section_two/chapter_one/article_1/paragraph_2_the_father.html",
      ),
      source(
        "Quran 2:163 in Maududi’s Tafhim al-Quran translation.",
        "https://quran.com/2/163?translations=95",
      ),
      source(
        "Quran 4:171 on Jesus, divine oneness, and the rejection of saying “Three.”",
        "https://quran.com/4/171?translations=95",
      ),
      source(
        "Surah al-Ikhlas, Quran 112:1–4, in Maududi’s Tafhim al-Quran translation.",
        "https://quran.com/112?translations=95",
      ),
    ]),
    sideNote(
      "Quran grounding note: Quran quotations and interpretations in this article were grounded with quran.ai using fetch_translation for 2:163, 3:18, 4:171, 5:72–75, 6:101–103, 21:22, 23:91, and 112:1–4 in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation (en-al-maududi), and fetch_tafsir for 2:163, 4:171, and 112:1–4 from al-Baghawi and Al-Wasit. The comparative synthesis goes beyond the fetched canonical text and is not a scholarly ruling or an opinion from quran.ai, quran.com, or quran.foundation.",
    ),
  ],
};

const jesusArticle = {
  _id: "drafts.article-is-jesus-god-scripture-trinity-textual-evidence",
  _type: "article",
  title: "Is Jesus God? What the Scriptures Actually Say",
  slug: {_type: "slug", current: jesusSlug},
  description:
    "A critical examination of the biblical passages distinguishing Jesus from God, the texts used to support his divinity, proven manuscript additions, disputed variants, and the later development and logical difficulties of Nicene Trinitarian doctrine.",
  taxonomies: [taxonomyReference()],
  body: [
    {
      _key: key(),
      _type: "lead",
      text: "The strongest case against identifying Jesus as the one God does not require pretending that every high-Christology passage was inserted by copyists. It begins with the Bible’s own repeated distinction between God and Jesus, then asks whether later creedal language explains the text or replaces its simpler categories.",
    },
    linkedBlock(
      "This article continues the comparative foundation established in ",
      "The One God: Divine Oneness Across the Abrahamic Faiths",
      onenessUrl,
      ".",
    ),
    callout(
      "reflection",
      "The thesis being tested",
      "Jesus consistently worships, obeys, and is sent by God. The Nicene claim that he is nevertheless eternally coequal and consubstantial with that God is a later theological construction. One unusually explicit Trinitarian proof text was demonstrably added, while several other deity texts contain variants or require disputed interpretations.",
    ),
    sideNote(
      "This article critiques a doctrine, not Christian people. It distinguishes documented manuscript evidence from interpretation and presents the mainstream Christian responses before evaluating them.",
    ),

    block("Begin with the undisputed monotheistic baseline", "h2"),
    scripture("“Hear, O Israel: the LORD our God, the LORD is one.”"),
    block(
      "Jesus does not replace the Shema when asked for the first commandment. He repeats it. The question is therefore not whether Jesus respected Jewish monotheism, but whether he redefined the one God as three persons. No saying of Jesus gives that definition.",
    ),
    scripture(
      "“Now this is eternal life, that they should know you, the only true God, and the one whom you sent, Jesus Christ.”",
    ),
    block(
      "In John 17:3, Jesus addresses the Father as the only true God and distinguishes himself as the one sent by that God. A Trinitarian reading adds a qualification: the Father is the only true God, but not to the exclusion of the Son. The qualification is not stated in the verse.",
    ),

    block("The recurring distinction between God and Jesus", "h2"),
    table("What the undisputed passages say", [
      ["Passage", "Statement", "Question raised for Nicene equality"],
      [
        "John 20:17",
        "Jesus ascends to “my God and your God.”",
        "In what identical sense is Jesus the God whom he calls “my God”?",
      ],
      [
        "Mark 13:32",
        "The Son does not know the final hour; only the Father knows.",
        "How are Father and Son equally omniscient if one possesses knowledge the other lacks?",
      ],
      [
        "John 14:28",
        "Jesus says, “The Father is greater than I.”",
        "The later distinction between equality of essence and subordination of role is not stated here.",
      ],
      [
        "Acts 2:22–24",
        "Jesus is a man through whom God performs signs, and God raises him.",
        "The natural categories are divine source and human Messiah, not two coequal divine persons.",
      ],
      [
        "1 Timothy 2:5",
        "There is one God and one mediator, “Christ Jesus, himself human.”",
        "A mediator is distinguished from the God before whom he mediates.",
      ],
      [
        "1 Corinthians 15:24–28",
        "Christ hands the kingdom to his God and Father, and the Son is subjected to God.",
        "Why is an eternally coequal divine person finally subject to another?",
      ],
    ]),
    block(
      "These passages do not merely show Jesus acting humbly. They repeatedly place God as the one who sends, commands, reveals, empowers, raises, exalts, and receives obedience, while Jesus is the one sent, commanded, empowered, raised, exalted, and finally subjected.",
    ),

    block("The strongest Christian response: two natures and one essence", "h2"),
    block(
      "Mainstream Christianity answers that Jesus is one person with two natures. According to his human nature, he can learn, obey, pray, suffer, and call the Father his God. According to his divine nature, he is omniscient, eternal, and equal to the Father. Trinitarian theology further distinguishes one divine being or essence from three divine persons.",
    ),
    block(
      "This solution should be stated fairly: Christianity is not claiming that one person is three persons or that one God is three gods. It claims one “what” and three “whos,” with the incarnate Son possessing both a divine and human nature.",
    ),
    callout(
      "philosophy",
      "The critical difficulty",
      "The Gospel passages speak about the person Jesus: he does not know, he obeys, he prays, and he has a God. A nature does not independently speak or worship. Assigning every limitation to “the human nature” and every divine predicate to “the divine nature” is a later metaphysical harmonization, not an explanation supplied by Jesus.",
    ),

    block("Authentic passages used to support Jesus’ divinity", "h2"),
    block(
      "A credible critical case must acknowledge that several important passages are textually authentic. They should not be mislabeled as later insertions.",
    ),
    table("Authentic texts and what they establish", [
      ["Passage", "Why Trinitarians cite it", "What remains unstated"],
      [
        "John 1:1–14",
        "The Word was with God, was God, and became flesh.",
        "The passage does not define three coequal persons in one essence, and it still distinguishes the Word from God with whom the Word was.",
      ],
      [
        "John 20:28",
        "Thomas addresses Jesus as “My Lord and my God.”",
        "The same chapter records Jesus saying “my God and your God”; both statements require interpretation together.",
      ],
      [
        "1 Corinthians 8:4–6",
        "Paul names one God, the Father, and one Lord, Jesus Christ, through whom all things exist.",
        "The text explicitly calls the Father “one God” and distinguishes Jesus as the one Lord; whether Paul is including Jesus in the Shema is debated.",
      ],
      [
        "Matthew 28:19",
        "Father, Son, and Holy Spirit are named together in baptism.",
        "Naming three together does not itself say that all three are God, coequal, coeternal, or one substance.",
      ],
      [
        "2 Corinthians 13:13",
        "Jesus, God, and the Holy Spirit appear in one blessing.",
        "A triadic blessing is not a definition of the Trinity’s ontology.",
      ],
    ]),
    block(
      "Matthew 28:19 is especially important. Some anti-Trinitarian arguments call its baptismal formula an interpolation, but no surviving Greek manuscript supports removing it. The sound argument is not that the verse is fake; it is that a triadic formula does not equal the later Nicene doctrine.",
    ),

    block("A proven addition and important textual variants", "h2"),
    table("Textual evidence that must be handled precisely", [
      ["Text", "Manuscript finding", "Significance"],
      [
        "1 John 5:7–8, the Comma Johanneum",
        "“The Father, the Word, and the Holy Ghost: and these three are one” is absent from the earliest Greek manuscripts and appears in a handful of late witnesses, often as a marginal note.",
        "This is a demonstrably added Trinitarian proof text and is omitted from modern critical translations.",
      ],
      [
        "1 Timothy 3:16",
        "Later Byzantine witnesses read “God was manifested in the flesh”; earlier evidence supports “who” or “he who was manifested in the flesh.”",
        "The later wording turns a Christological hymn into a more direct declaration that God appeared in flesh.",
      ],
      [
        "John 1:18",
        "Ancient witnesses differ between forms commonly rendered “the only God” and “the only Son.”",
        "This is an early and difficult variant, not a proven late Trinitarian insertion.",
      ],
      [
        "Romans 9:5",
        "The Greek text permits more than one punctuation and translation.",
        "The question is interpretation and punctuation, not manuscript addition.",
      ],
    ]),
    block(
      "The Comma Johanneum matters because it expresses exactly what the undisputed New Testament never says so directly: Father, Word, and Spirit are three and these three are one. Its late appearance demonstrates how a theological explanation could migrate into the biblical text itself. But the larger doctrine cannot be dismissed solely through this interpolation because other authentic passages motivated its development.",
    ),

    block("The doctrine developed after the New Testament", "h2"),
    block(
      "The New Testament does not use the word Trinity and does not state the mature formula “one essence in three persons.” Christian theologians spent centuries debating whether the Son was created, eternal, subordinate, equal, of similar substance, or of the same substance as the Father.",
    ),
    block(
      "Nicaea in 325 declared the Son homoousios—of the same substance as the Father. Constantinople in 381 expanded the settlement concerning the Holy Spirit. The Cappadocian formula of one ousia and three hypostases attempted to preserve both unity and genuine personal distinction.",
    ),
    block(
      "Calling this merely a clarification understates the development. The councils supplied technical categories that no biblical author uses with these meanings. The doctrine arose as an explanatory solution to a problem: how could Christians preserve one God while also treating Jesus and the Spirit as fully divine?",
    ),

    block("Why the formula remains logically difficult", "h2"),
    table("The identity problem", [
      ["Claim", "If “is God” means identity", "If “is God” means possessing divinity"],
      [
        "The Father is God; the Son is God; the Father is not the Son.",
        "If Father and Son are each numerically identical to the same God, ordinary identity would make Father and Son identical to each other.",
        "If Father and Son are distinct possessors of the divine nature, the account appears to contain more than one divine individual.",
      ],
      [
        "The Spirit is also fully God and distinct from both.",
        "Strict identity again collapses the personal distinctions.",
        "Predication preserves distinction but increases pressure toward three Gods.",
      ],
      [
        "There is exactly one God.",
        "Strong unity risks making the persons modes or roles of one subject.",
        "Strong personal distinction risks turning the Trinity into a divine society.",
      ],
    ]),
    block(
      "Christian philosophers have proposed relative identity, constitution models, social Trinitarianism, Latin Trinitarianism, and other solutions. Their continued disagreement shows that “one being, three persons” is not a self-explanatory formula. It names the problem as much as it solves it.",
    ),

    block("The Jewish and Quranic critique", "h2"),
    block(
      "From the Jewish scriptural baseline, God is one without rival, incomparable, and not divisible into persons. The Messiah may be chosen, empowered, and exalted by God without becoming God. “Son of God” can function in biblical language for Israel, the Davidic king, or a person in a special relationship with God; it does not automatically mean “God the Son,” the later Trinitarian title.",
    ),
    quranVerse(
      "Allah is indeed just one God. Far be it from His glory that He should have a son.",
      "Quran 4:171, excerpt · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    quranVerse(
      "Children of Israel! Serve Allah, Who is your Lord and my Lord.",
      "Quran 5:72, excerpt · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "The Quranic critique does not deny Jesus’ greatness. It calls him the Messiah, a messenger, God’s word conveyed to Mary, and a spirit from Him. It denies the move from miraculous origin and exalted mission to participation in God’s divinity.",
    ),
    block(
      "Quran 5:73 rejects saying that God is one of three, while 5:75 points to Jesus and Mary eating food as evidence of creaturely dependence. Surah 112 supplies the governing principle: God is one and unique, self-sufficient, neither begetting nor begotten, with nothing comparable to Him.",
    ),

    block("The critical conclusion", "h2"),
    block(
      "The case against Jesus being the one God is cumulative. The clearest monotheistic passages identify God as the Father. Jesus calls the Father his God, receives knowledge and authority from Him, obeys Him, is raised and exalted by Him, and is finally subjected to Him. None of Jesus’ recorded teachings defines God as three persons.",
    ),
    block(
      "The high-Christology passages are real and must be interpreted, but they do not themselves state the Nicene formula. One exceptionally convenient Trinitarian proof text was added later; other direct deity readings contain variants; and the final doctrine depends upon post-biblical distinctions between person, being, essence, nature, and relation.",
    ),
    block(
      "A Christian may accept that later synthesis as the church’s faithful explanation of revelation. The critical Jewish, Islamic, and biblical-unitarian response is that the synthesis changes the ordinary force of the simpler testimony: one God, the Father, and Jesus the Messiah whom He sent.",
    ),
    linkedBlock(
      "Return to the broader comparative study: ",
      "The One God: Divine Oneness Across the Abrahamic Faiths",
      onenessUrl,
      ".",
    ),
    conclusion(
      "The question is not answered by one isolated proof text.",
      "Every passage must be read beside the others. Jesus’ exalted titles cannot erase his worship of God, and his dependence upon God cannot simply be ignored because later theology assigns it to a human nature. The historical record shows a doctrine developing to reconcile these tensions, not a three-person definition announced plainly by Jesus.",
      "The simplest scriptural distinction remains: God is the One who sent; Jesus is the Messiah who was sent.",
    ),
    sourceList("Primary texts and textual-critical references", [
      source(
        "Deuteronomy 6:4–5 and the foundational Jewish confession of one God.",
        "https://www.sefaria.org/Deuteronomy.6.4-5",
      ),
      source(
        "Mark 12:28–34, where Jesus repeats and approves the Shema.",
        "https://bible.usccb.org/bible/mark/12",
      ),
      source(
        "John 17:3; John 20:17; John 14:28; and Mark 13:32 on the distinction between Jesus and the Father.",
        "https://bible.usccb.org/bible/john/17",
      ),
      source(
        "Acts 2:22–24, where God works through Jesus and raises him.",
        "https://bible.usccb.org/bible/acts/2",
      ),
      source(
        "1 Timothy 2:5 and 1 Corinthians 15:24–28 on the one God, the human mediator, and the Son’s final subjection.",
        "https://bible.usccb.org/bible/1timothy/2",
      ),
      source(
        "John 1:1–18 and John 20:28, principal Johannine passages used for Jesus’ divinity.",
        "https://bible.usccb.org/bible/john/1",
      ),
      source(
        "Matthew 28:19 and the absence of manuscript support for removing the baptismal formula.",
        "https://classic.net.bible.org/passage.php?mode=print&passage=Mat+28%3A19",
      ),
      source(
        "The NET Bible textual note documenting the late Comma Johanneum in 1 John 5:7–8.",
        "https://classic.net.bible.org/verse.php?book=1Jo&chapter=5&tab=commentaries&theme=wiki&verse=7",
      ),
      source(
        "The NET Bible textual note on “God” versus “who” in 1 Timothy 3:16.",
        "https://classic.net.bible.org/verse.php?book=1ti&chapter=3&verse=16",
      ),
      source(
        "The NET Bible textual note on the “only God” and “only Son” variants in John 1:18.",
        "https://classic.net.bible.org/passage.php?passage=Joh+1%3A18%2C34",
      ),
      source(
        "Internet Encyclopedia of Philosophy: the history and logical problems of Trinitarian doctrine.",
        "https://iep.utm.edu/trinity/",
      ),
      source(
        "The Catholic Catechism’s formal doctrine of one essence and three persons.",
        "https://www.vatican.va/content/catechism/en/part_one/section_two/chapter_one/article_1/paragraph_2_the_father.html",
      ),
      source(
        "Quran 4:171 and 5:72–75 in Maududi’s Tafhim al-Quran translation.",
        "https://quran.com/4/171?translations=95",
      ),
      source(
        "Surah al-Ikhlas, Quran 112:1–4, on God’s unique and incomparable oneness.",
        "https://quran.com/112?translations=95",
      ),
    ]),
    sideNote(
      "Quran grounding note: Quran quotations and interpretations in this article were grounded with quran.ai using fetch_translation for 2:163, 3:18, 4:171, 5:72–75, 6:101–103, 21:22, 23:91, and 112:1–4 in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation (en-al-maududi), and fetch_tafsir for 2:163, 4:171, and 112:1–4 from al-Baghawi and Al-Wasit. The textual-critical, philosophical, and cross-scriptural conclusions are analytical synthesis beyond the fetched Quran text and are not a scholarly ruling or an opinion from quran.ai, quran.com, or quran.foundation.",
    ),
  ],
};

const transaction = client
  .transaction()
  .createOrReplace(onenessArticle)
  .createOrReplace(jesusArticle);

const result = await transaction.commit();

console.log(
  JSON.stringify(
    {
      status: "drafts-created",
      transactionId: result.transactionId,
      documents: [
        {
          id: onenessArticle._id,
          title: onenessArticle.title,
          slug: onenessSlug,
          linkedTo: jesusUrl,
          blocks: onenessArticle.body.length,
        },
        {
          id: jesusArticle._id,
          title: jesusArticle.title,
          slug: jesusSlug,
          linkedTo: onenessUrl,
          blocks: jesusArticle.body.length,
        },
      ],
    },
    null,
    2,
  ),
);
