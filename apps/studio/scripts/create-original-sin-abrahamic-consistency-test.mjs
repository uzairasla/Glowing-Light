import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({apiVersion: "2026-08-18"});
const key = (() => {
  let sequence = 0;
  return () => `os${(++sequence).toString(36)}`;
})();

const block = (text, style = "normal") => ({
  _key: key(),
  _type: "block",
  style,
  markDefs: [],
  children: [{_key: key(), _type: "span", marks: [], text}],
});

const quote = (text) => block(text, "blockquote");

const quran = (translation, reference) => ({
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
  rows: rows.map((cells) => ({_key: key(), _type: "row", cells})),
});

const source = (text, url) => ({_key: key(), text, url});

const article = {
  _id: "drafts.article-original-sin-abrahamic-consistency-test",
  _type: "article",
  title: "The Abrahamic Consistency Test: Are We Born Guilty for Adam's Sin?",
  slug: {
    _type: "slug",
    current: "are-we-born-guilty-for-adams-sin",
  },
  description:
    "The Tanakh, New Testament, Quran, and major Christian traditions are compared to ask whether Adam's guilt is inherited—or whether every soul answers for its own sin.",
  taxonomies: [
    {
      _key: key(),
      _type: "reference",
      _ref: "84c893d4-2898-4444-b36d-3f8607d78b9a",
    },
  ],
  body: [
    {
      _key: key(),
      _type: "lead",
      text: "A newborn has made no moral choice. Is that child nevertheless guilty before God because Adam ate from the forbidden tree? The Tanakh says children do not bear their parents' guilt. The Quran says Adam repented and no soul bears another's burden. Romans 5, however, connects one man's trespass with condemnation for all. The dispute turns on what exactly is inherited: consequences, corruption, or guilt.",
    },
    callout(
      "reflection",
      "The question being tested",
      "This article does not ask whether Adam's sin harmed later humanity. Genesis, the New Testament, the Quran, and ordinary human experience all allow one generation's choices to affect another. The narrower question is whether God counts every descendant personally or legally guilty for Adam's act before that person chooses any sin.",
    ),

    block("Begin with the distinction most arguments miss", "h2"),
    block(
      "The phrase original sin is used for several different ideas. If they are treated as one claim, the comparison becomes misleading. A person may inherit a mortal body, a damaged social world, or a strong inclination toward evil without inheriting the legal blame for an ancestor's decision.",
    ),
    table("Four claims hidden inside one phrase", [
      ["Claim", "Meaning", "Question for the consistency test"],
      [
        "Inherited consequences",
        "Later people suffer death, hardship, exile, or a damaged world because of an earlier sin.",
        "All three scriptural traditions can accommodate this.",
      ],
      [
        "Inherited corruption",
        "Human nature is weakened or inclined toward sin from birth.",
        "This is stronger than consequences, but it is still not identical to personal guilt.",
      ],
      [
        "Inherited guilt",
        "Adam's offense is legally counted against his descendants, exposing them to condemnation before their own acts.",
        "This is the sharpest point of tension with the Tanakh and Quran.",
      ],
      [
        "Personal sin",
        "A person becomes blameworthy for what that person knowingly chooses and does.",
        "The Tanakh, New Testament, and Quran all continue to speak this way.",
      ],
    ]),
    callout(
      "insight",
      "A fair test avoids a caricature",
      "Roman Catholic teaching explicitly says original sin is a contracted state, not Adam's act personally committed again by each descendant. Eastern Orthodox teaching commonly distinguishes inherited consequences from inherited guilt. Some Protestant confessions go further and explicitly speak of Adam's guilt being imputed. These positions should not be collapsed into one sentence.",
    ),

    block("Genesis: a catastrophic sin, but no explicit doctrine of inherited guilt", "h2"),
    block(
      "Genesis 2-3 presents a command, a temptation, a human act of disobedience, divine questioning, judgment, and expulsion from Eden. The serpent, the woman, and the man each receive consequences. The ground is cursed, childbirth becomes painful, work becomes toilsome, access to the tree of life is barred, and human beings return to dust.",
    ),
    block(
      "Those consequences plainly reach beyond the first couple. Every later human is born outside Eden and eventually dies. Yet the Genesis narrative never says that God imputes Adam's personal guilt to every infant. It describes a changed human condition; the later doctrine of inherited culpability must be argued from other passages, especially Romans 5.",
    ),
    callout(
      "warning",
      "Condition is not automatically culpability",
      "Being born into consequences caused by another person does not prove that God judges the child morally guilty of the other person's act. Scripture itself repeatedly distinguishes these categories.",
    ),

    block("The Tanakh's controlling rule: each person answers for his own sin", "h2"),
    block(
      "Deuteronomy 24:16 gives Israel a direct judicial rule: parents are not to be put to death for children, nor children for parents; each is put to death for his own sin. The setting is human law, but its moral logic becomes even more explicit in the prophets.",
    ),
    quote(
      "The soul that sinneth, it shall die; the son shall not bear the iniquity of the father with him, neither shall the father bear the iniquity of the son with him; the righteousness of the righteous shall be upon him, and the wickedness of the wicked shall be upon him. — Ezekiel 18:20",
    ),
    block(
      "Ezekiel 18 is not an isolated slogan. The chapter rejects the proverb that fathers eat sour grapes while children's teeth are set on edge. It works through three generations and insists that a righteous son does not die for his father's wickedness. It then says that a wicked person who turns from sin will live and that former transgressions will not be remembered against him. Accountability and repentance are personal.",
    ),
    block(
      "Jeremiah 31:29-30 uses the same sour-grapes image and says that everyone will die for his own iniquity. Significantly, the promised new covenant and God's declaration that He will forgive iniquity immediately follow. The movement is not from inherited guilt to transferred guilt; it is from personal sin to divine forgiveness and a transformed heart.",
    ),

    block("But do children suffer because of their parents?", "h3"),
    block(
      "Yes. Exodus 20:5 speaks of the fathers' iniquity being visited upon later generations of those who hate God. Numbers 14 says the children of the rebellious wilderness generation will wander for forty years while their parents die outside the promised land. Families, nations, and societies transmit damage. A parent's violence, idolatry, addiction, or war can shape a child's world before the child chooses anything.",
    ),
    block(
      "These passages establish intergenerational consequences and corporate solidarity. They do not cancel Deuteronomy 24 or Ezekiel 18. In Numbers 14, the guilty generation bears its iniquity and dies, while the children live to enter the land. In Exodus 20, the wording concerns succeeding generations 'of them that hate Me,' not morally neutral descendants automatically declared guilty regardless of their own allegiance.",
    ),
    table("The Tanakh holds both truths together", [
      ["Truth", "Representative texts", "Result"],
      [
        "Sin damages later generations.",
        "Genesis 3; Exodus 20:5-6; Numbers 14:18, 33-35",
        "Consequences can be inherited and communal.",
      ],
      [
        "Moral guilt remains personal.",
        "Deuteronomy 24:16; Ezekiel 18; Jeremiah 31:29-30",
        "A child is not condemned for a parent's iniquity.",
      ],
      [
        "Repentance can change the verdict.",
        "Ezekiel 18:21-23; Jeremiah 31:31-34",
        "God forgives the one who turns; ancestry is not destiny.",
      ],
    ]),

    block("The strongest Tanakh text for an inborn sinful condition", "h3"),
    quote(
      "Behold, I was brought forth in iniquity, and in sin did my mother conceive me. — Psalm 51:7 in the Hebrew numbering; 51:5 in many Christian Bibles",
    ),
    block(
      "Psalm 51 is the clearest Tanakh passage used to support sinfulness from birth. It should not be brushed aside. David describes sin as reaching to the beginning of his life, not merely to one recent act. The psalm therefore fits an argument for the depth and universality of human sinfulness.",
    ),
    block(
      "But the verse does not name Adam, say that Adam's guilt was transferred, or pronounce newborns legally culpable for an ancestor's act. Its genre is penitential poetry, and its repeated grammar remains personal: 'my transgressions,' 'my iniquity,' 'my sin,' and 'I have sinned.' It supports an inborn sinful condition more directly than inherited legal guilt.",
    ),

    block("The Quran: Adam sins, repents, and is forgiven", "h2"),
    block(
      "The Quran's Adam narrative does not erase the seriousness of the fall. Adam and his wife approach the forbidden tree, their nakedness becomes apparent, and earthly life includes struggle and death. Yet Adam's own case is resolved by repentance and mercy—not by transmitting unforgiven guilt to his descendants.",
    ),
    quran(
      "Thereupon Adam learned from his Lord some words and repented and his Lord accepted his repentance for He is Much-Relenting, Most Compassionate.",
      "Quran 2:37 — Tafhim al-Quran",
    ),
    quran(
      "Both cried out: 'Our Lord! We have wronged ourselves. If You do not forgive us and do not have mercy on us, we shall surely be among the losers.'",
      "Quran 7:23 — Tafhim al-Quran",
    ),
    quran(
      "Thereafter his Lord exalted him, accepted his repentance, and bestowed guidance upon him,",
      "Quran 20:122 — Tafhim al-Quran",
    ),
    block(
      "According to al-Tafsir al-Muyassar on Quran 2:37 and 7:23, the prayer in 7:23 supplies the words of repentance Adam received, and God accepted his repentance and forgave him. Its explanation of 20:122 again says God accepted Adam's repentance and guided him. Ma'arif al-Quran likewise treats Adam's lapse as followed by accepted repentance.",
    ),
    callout(
      "insight",
      "The chronological problem for inherited guilt",
      "If Adam's own repentance was accepted, a theory that his unforgiven moral guilt remains charged to every descendant requires an additional premise not stated in the Quranic account.",
    ),

    block("No soul carries another's burden", "h3"),
    block(
      "The Quran does not leave personal responsibility implicit. It repeats the principle across different contexts and surahs.",
    ),
    quran(
      "Say: 'Shall I seek someone other than Allah as Lord when He is the Lord of everything?' Everyone will bear the consequence of what he does, and no one shall bear the burden of another. Thereafter, your return will be to your Lord, whereupon He will let you know what you disagreed about.",
      "Quran 6:164 — Tafhim al-Quran",
    ),
    quran(
      "He who follows the Right Way shall do so to his own advantage; and he who strays shall incur his own loss. No one shall bear another's burden. And never do We punish any people until We send a Messenger (to make the Truth distinct from falsehood).",
      "Quran 17:15 — Tafhim al-Quran",
    ),
    quran(
      "No one can bear another's burden. If a heavily laden one should call another to carry his load, none of it shall be carried by the other, even though he be a near of kin.",
      "Quran 35:18 — Tafhim al-Quran",
    ),
    quran(
      "That no bearer of a burden shall bear the burden of another, and that man shall have nothing but what he has striven for, and that (the result of) his striving shall soon be seen, and that he shall then be fully recompensed,",
      "Quran 53:38-41 — Tafhim al-Quran",
    ),
    block(
      "Ma'arif al-Quran titles its discussion of 6:164 'One's Burden of Sin Cannot Be Borne By Another' and applies the principle even to a child born from a parent's sexual sin: the child does not carry the parents' guilt. On 35:18 it adds an important nuance: a person who misleads others acquires additional guilt for misleading them, but the followers' own guilt is not reduced. Influence creates new personal responsibility; it does not transfer culpability away from the actor.",
    ),
    block(
      "On Quran 53:38, Ma'arif al-Quran says these principles also belonged to the teachings associated with the scriptures of Moses and Abraham. That observation makes the Quranic rule especially relevant to an Abrahamic consistency test: no bearer pays another's moral debt, and each person's striving is judged.",
    ),

    block("The New Testament pivot: Adam and Christ as corporate heads", "h2"),
    block(
      "The strongest Christian case does not come from Genesis alone. It comes from Paul's Adam-Christ comparison in Romans 5. Any serious test must let that passage speak at full strength.",
    ),
    quote(
      "Therefore, just as through one person sin entered the world, and through sin, death, and thus death came to all, inasmuch as all sinned— — Romans 5:12, USCCB",
    ),
    block(
      "Romans 5:15-19 repeatedly contrasts the one trespass with Christ's gracious act. Through one person's offense many died; judgment after one sin brought condemnation; through one transgression condemnation came upon all; through one man's disobedience many were made sinners. This is the clearest New Testament foundation for a doctrine in which Adam represents humanity corporately and Christ inaugurates a new humanity.",
    ),
    block(
      "Paul develops the same solidarity in 1 Corinthians 15:21-22: death came through a human being, resurrection comes through a human being, and 'in Adam all die' while those in Christ are made alive. In that chapter the immediate emphasis is mortality and resurrection. Romans 5 extends the parallel to sin, condemnation, grace, and justification.",
    ),
    block(
      "Ephesians 2:1-3 adds that people are dead in transgressions and 'by nature children of wrath.' Its context also describes actual conduct—following disobedience and the desires of flesh and mind—so the phrase can support an inherited-condition reading without eliminating personal acts.",
    ),
    callout(
      "reflection",
      "The interpretive hinge in Romans 5:12",
      "Paul says death spread to all 'inasmuch as all sinned.' Christian interpreters debate how individual sin and Adamic solidarity relate. The passage undeniably makes Adam's act universally consequential; the disputed step is whether every descendant receives Adam's legal guilt, a corrupted condition that leads all to sin, or both.",
    ),

    block("The New Testament still judges people for their own deeds", "h3"),
    block(
      "The Adam-Christ passages do not replace personal accountability throughout the New Testament. Romans 2:6 says God repays each person according to works. Second Corinthians 5:10 says each receives recompense for what he or she did in the body, whether good or evil. Revelation likewise repeatedly describes judgment according to deeds.",
    ),
    block(
      "Christian theology can reconcile these texts through corporate representation, grace, and personal sin. But that reconciliation is a theological construction. The simpler rule stated in Ezekiel and the Quran remains that God charges moral wrongdoing to the soul that commits it.",
    ),

    block("One phrase, several Christian doctrines", "h2"),
    block(
      "The comparison becomes most revealing when official Christian formulations are placed side by side. They agree that humanity's present condition is inseparable from Adam's fall, but they do not describe inherited guilt in the same way.",
    ),
    table("Representative Christian formulations", [
      ["Tradition/source", "What is inherited", "How directly it asserts Adamic guilt"],
      [
        "Roman Catholic Catechism 403-405",
        "A fallen nature deprived of original holiness, wounded, mortal, and inclined to sin; infant baptism remits original sin.",
        "It says original sin is 'contracted' rather than 'committed' and is not a personal fault in Adam's descendants.",
      ],
      [
        "Orthodox Church in America",
        "The consequences of the first sin, foremost among them death.",
        "It says only Adam and Eve are guilty of that first sin.",
      ],
      [
        "Augsburg Confession, Article II",
        "People are born without fear and trust in God and with sinful inclination; this original vice is truly sin.",
        "It says this condition condemns those not born anew through baptism and the Holy Spirit.",
      ],
      [
        "Westminster Confession 6.3-6",
        "Corrupted nature, death in sin, and actual transgressions arising from that corruption.",
        "It explicitly says the guilt of Adam's sin was imputed to his descendants.",
      ],
    ]),
    block(
      "This spectrum matters. It would be inaccurate to tell an Orthodox Christian that Orthodoxy simply teaches inherited culpability. It would also be inaccurate to claim that inherited guilt is merely a critic's invention: the Westminster Confession states it directly, and Lutheran confessional language treats the inborn condition as truly damning sin.",
    ),
    block(
      "The Catholic formulation occupies a carefully qualified position. It calls the inherited deprivation 'sin' by analogy and connects it with Adam, baptism, and the death of the soul, yet denies that it is Adam's personal fault recommitted by each descendant. That is closer to inherited condition than to the everyday meaning of being guilty of someone else's choice, though it still assigns grave spiritual consequences before personal action.",
    ),

    block("The Abrahamic Consistency Test", "h2"),
    table("Which claims pass the test?", [
      ["Claim", "Tanakh", "New Testament", "Quran", "Verdict"],
      [
        "Adam's sin harmed later humanity.",
        "Yes: exile, mortality, and intergenerational consequences.",
        "Yes: death and sin enter through Adam.",
        "Yes: earthly struggle follows the fall.",
        "Strong continuity.",
      ],
      [
        "Human beings have a deep tendency toward sin.",
        "Psalm 51 and the wider biblical story support pervasive sinfulness.",
        "Strongly affirmed in Romans and Ephesians.",
        "Humans are morally vulnerable, but each remains responsible for his own response.",
        "Broad continuity, with different accounts of the condition.",
      ],
      [
        "Children bear an ancestor's moral guilt.",
        "Explicitly resisted by Deuteronomy 24, Ezekiel 18, and Jeremiah 31.",
        "Romans 5 supplies the basis for corporate and imputed-guilt readings.",
        "Explicitly denied by the repeated no-burden-transfer rule.",
        "The sharpest discontinuity.",
      ],
      [
        "Adam's repentance does not settle his own sin.",
        "Genesis does not narrate Adam's repentance or declare inherited guilt.",
        "Paul emphasizes Adam's universal consequences and Christ's remedy.",
        "Adam repents; God accepts, forgives, and guides him.",
        "The Quranic account strongly resists an outstanding inherited debt.",
      ],
      [
        "Each person is judged for personal deeds.",
        "Explicit and repeated.",
        "Explicit and repeated alongside Adamic solidarity.",
        "Explicit and repeated.",
        "Strong continuity.",
      ],
    ]),
    callout(
      "insight",
      "The measured verdict",
      "If original sin means that humanity inherits mortality, weakness, and a world damaged by earlier rebellion, it substantially passes the Abrahamic Consistency Test. If it means that every newborn is personally or legally condemned for Adam's act, it conflicts with the plain personal-accountability rule of the Tanakh and Quran. Romans 5 is the distinct New Testament text from which that stronger doctrine is constructed.",
    ),

    block("A moral test: can blame exist before choice?", "h2"),
    block(
      "Consequences without personal fault are tragically common. A child can inherit poverty, trauma, displacement, disease, or a polluted environment. Recognizing that fact does not mean the child deserves those conditions. The same distinction is morally decisive in theology: inheriting death or weakness is not identical to deserving condemnation for a prehistoric act one did not perform.",
    ),
    block(
      "The Tanakh's answer is that the soul who sins is accountable and the repentant soul may live. The Quran's answer is that Adam was forgiven, no bearer carries another's burden, and every person receives the result of his own striving. The New Testament continues personal judgment but adds Paul's corporate Adam-Christ framework. Later Christian traditions then define that framework in materially different ways.",
    ),
    block(
      "The fairest conclusion is therefore narrower than the slogan 'Christianity teaches inherited guilt.' Some Christian traditions explicitly do; others reject that wording or carefully qualify it. What deviates most clearly from the shared Abrahamic pattern is not the belief that Adam's sin wounded human history. It is the claim that God imputes Adam's culpability to descendants before their own moral choice.",
    ),
    {
      _key: key(),
      _type: "pullQuote",
      text: "We may inherit the consequences of another person's sin without inheriting that person's guilt. The Tanakh and Quran state that distinction plainly; Romans 5 is where the stronger Christian claim begins.",
    },

    block("Sources and further reading", "h2"),
    {
      _key: key(),
      _type: "sourceList",
      title: "Scripture and representative doctrinal sources",
      items: [
        source(
          "Genesis 2-3 — the command, fall, judgment, expulsion, and mortality.",
          "https://mechon-mamre.org/p/pt/pt0103.htm",
        ),
        source(
          "Exodus 20:4-6 — iniquity visited across generations and mercy to those who love God.",
          "https://mechon-mamre.org/p/pt/pt0220.htm",
        ),
        source(
          "Numbers 14:18, 33-35 — the rebellious generation, its children, and wilderness consequences.",
          "https://mechon-mamre.org/p/pt/pt0414.htm",
        ),
        source(
          "Deuteronomy 24:16 — each person put to death for his own sin.",
          "https://www.mechon-mamre.org/p/pt/pt0524.htm",
        ),
        source(
          "Psalm 51 — David's personal confession and language of sin from conception.",
          "https://mechon-mamre.org/p/pt/pt2651.htm",
        ),
        source(
          "Jeremiah 31:29-34 — personal iniquity, the new covenant, and divine forgiveness.",
          "https://mechon-mamre.org/p/pt/pt1131.htm",
        ),
        source(
          "Ezekiel 18 — rejection of inherited guilt, personal repentance, and life.",
          "https://mechon-mamre.org/p/pt/pt1218.htm",
        ),
        source(
          "Romans 2 — God repays each person according to works.",
          "https://bible.usccb.org/bible/romans/2",
        ),
        source(
          "Romans 5 — Adam, universal death, condemnation, grace, and Christ.",
          "https://bible.usccb.org/bible/romans/5",
        ),
        source(
          "1 Corinthians 15:20-49 — death in Adam, resurrection in Christ, and the two Adams.",
          "https://bible.usccb.org/bible/1corinthians/15",
        ),
        source(
          "2 Corinthians 5:10 — each person recompensed for deeds done in the body.",
          "https://bible.usccb.org/bible/2corinthians/5",
        ),
        source(
          "Ephesians 2:1-10 — transgressions, children of wrath, mercy, grace, and good works.",
          "https://bible.usccb.org/bible/ephesians/2",
        ),
        source(
          "Catholic Catechism 403-406 — original sin as contracted state, not personal fault, and historical articulation.",
          "https://www.vatican.va/content/catechism/en/part_one/section_two/chapter_one/article_1/paragraph_7_the_fall.html",
        ),
        source(
          "Orthodox Church in America — inherited consequences but guilt belonging only to Adam and Eve.",
          "https://www.oca.org/questions/teaching/original-sin",
        ),
        source(
          "Augsburg Confession, Article II — original sin, concupiscence, condemnation, and new birth.",
          "https://bookofconcord.cph.org/en/augsburg-confession/chief_articles/article_ii/",
        ),
        source(
          "Westminster Confession, chapter 6 — explicit imputation of Adam's guilt and inherited corruption.",
          "https://www.opc.org/wcf.html#Chapter_06",
        ),
        source(
          "Quran 2:35-39 — Adam's fall, repentance, accepted return, and guidance; Tafhim al-Quran translation.",
          "https://quran.com/2/35-39?translations=95",
        ),
        source(
          "Quran 7:22-25 — Adam and his wife confess that they wronged themselves; Tafhim al-Quran translation.",
          "https://quran.com/7/22-25?translations=95",
        ),
        source(
          "Quran 20:115-123 — Adam's lapse, accepted repentance, and guidance; Tafhim al-Quran translation.",
          "https://quran.com/20/115-123?translations=95",
        ),
        source(
          "Quran 6:164 — each bears the consequence of his acts and no one bears another's burden; Tafhim al-Quran translation.",
          "https://quran.com/6/164?translations=95",
        ),
        source(
          "Quran 17:15 — personal guidance, personal loss, no burden transfer, and warning before punishment; Tafhim al-Quran translation.",
          "https://quran.com/17/15?translations=95",
        ),
        source(
          "Quran 35:18 — even a close relative cannot carry another's burden; Tafhim al-Quran translation.",
          "https://quran.com/35/18?translations=95",
        ),
        source(
          "Quran 53:38-41 — no burden transfer, personal striving, and recompense; Tafhim al-Quran translation.",
          "https://quran.com/53/38-41?translations=95",
        ),
        source(
          "Ma'arif al-Quran on 6:164, 20:122, 35:18, and 53:38-41 — Adam's repentance and the personal burden principle.",
          "https://quran.com/en/6/164/tafsirs?tafsirId=168",
        ),
        source(
          "Al-Tafsir al-Muyassar on Quran 2:37, 7:23, 20:122, 6:164, and 35:18 — accepted repentance and personal accountability.",
          "https://quran.com/ar/2/37/tafsirs?tafsirId=16",
        ),
      ],
    },
    {
      _key: key(),
      _type: "sideNote",
      body: "Grounding note: Quran translations were retrieved from quran.ai in Sayyid Abul A'la Maududi's Tafhim al-Quran edition (en-al-maududi): 2:35-39, 7:22-25, 20:115-123, 6:164, 17:15, 35:18, 39:7, and 53:38-41. Interpretive claims were checked through quran.ai fetch_tafsir using al-Tafsir al-Muyassar and Ma'arif al-Quran on 2:37, 7:23, 20:122, 6:164, 35:18, and 53:38-41. Jewish Scripture was checked against the Hebrew Bible in English at Mechon-Mamre; New Testament passages were checked against the USCCB Bible; Catholic, Orthodox, Lutheran, and Reformed formulations were checked against their linked institutional or confessional sources. The comparative verdict is the author's synthesis, not a rabbinic ruling, church judgment, fatwa, or opinion from quran.ai, quran.com, or quran.foundation. Grounded with quran.ai: fetch_translation(...), fetch_tafsir(...)",
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
      title: result.title,
      bodyComponents: result.body.length,
      updatedAt: result._updatedAt,
    },
    null,
    2,
  ),
);
