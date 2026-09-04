import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({apiVersion: "2026-08-12"});
const key = (() => {
  let sequence = 0;
  return () => `hs${(++sequence).toString(36)}`;
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
  _id: "drafts.article-human-sacrifice-forgiveness-abrahamic-consistency-test",
  _type: "article",
  title:
    "The Abrahamic Consistency Test: Does God Require a Human Sacrifice to Forgive?",
  slug: {
    _type: "slug",
    current: "does-god-require-human-sacrifice-to-forgive",
  },
  description:
    "The Tanakh, New Testament, and Quran are placed side by side to ask whether God requires an innocent human death before forgiving sinners—or whether repentance and divine mercy are sufficient.",
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
      text: "Abraham is stopped before his son dies. The prophets repeatedly call sinners to return directly to God. Jesus teaches people to ask the Father for forgiveness and announces forgiveness before the crucifixion. Yet the New Testament also describes Jesus' blood as the decisive sacrifice for sin. Does this represent the fulfillment of the Abrahamic pattern—or a major departure from it?",
    },
    callout(
      "reflection",
      "The question being tested",
      "This article does not ask whether the Torah contains animal sacrifices; it plainly does. It asks a narrower and more consequential question: does God require the death of an innocent human being before He can forgive a repentant sinner?",
    ),

    block("How the Abrahamic Consistency Test works", "h2"),
    block(
      "A fair comparison cannot begin with the conclusion. It must first establish the earlier scriptural pattern, identify the strongest passage that appears to challenge that pattern, examine what changes in the New Testament, and then allow Christian theology to give its strongest explanation.",
    ),
    block(
      "Three distinctions keep the test honest. Sacrifice is not identical to forgiveness. A ritual that accompanies atonement does not prove that God is metaphysically unable to pardon without blood. And saying that Jesus died for sins is not yet the same as proving that God had to punish an innocent person before mercy became possible.",
    ),
    table("The claims must not be confused", [
      ["Claim", "What the sources show"],
      [
        "The Torah contains sacrificial atonement.",
        "Yes. Animal blood is assigned a real altar-based role in Leviticus, and the Day of Atonement includes animal offerings.",
      ],
      [
        "The Tanakh never connects suffering with another person's sins.",
        "Too broad. Isaiah 53 is the major counterexample and must be treated seriously.",
      ],
      [
        "God never forgives without blood.",
        "The Tanakh itself presents forgiveness through repentance, prayer, moral return, and even a flour sin offering.",
      ],
      [
        "The New Testament says Jesus died for sins.",
        "Yes. Several New Testament writings make this claim explicitly.",
      ],
      [
        "Therefore God cannot forgive unless an innocent human dies.",
        "That stronger conclusion is the disputed theological step tested in this article.",
      ],
    ]),

    block("The Tanakh: sacrifice is real, but mercy is not imprisoned by blood", "h2"),
    block("The Torah gives blood an appointed ritual function", "h3"),
    block(
      "Leviticus 17:11 says that the life of flesh is in the blood and that God has given it upon the altar to make atonement. Leviticus 16 describes the Day of Atonement, and Numbers 15 prescribes animal offerings for communal and individual sins committed unintentionally. Any argument claiming that biblical sacrifice is meaningless begins by denying what the Torah actually says.",
    ),
    callout(
      "insight",
      "The necessary concession",
      "Animal sacrifice belongs to the Torah's covenantal worship. The issue is not whether sacrifice can serve atonement. The issue is whether blood is the only way God forgives—and whether the Torah points to the necessary death of an innocent human being.",
    ),

    block("The Torah itself records a bloodless sin offering", "h3"),
    block(
      "Leviticus 5 creates a means-based sequence. A person who cannot afford a lamb may bring birds. A person who cannot afford the birds may bring fine flour as a sin offering. The priest makes atonement, and the person is forgiven. The offering still belongs to the sacrificial system, but the worshipper's offering contains no blood. This alone prevents Hebrews 9:22 from being turned into the unrestricted slogan that God has never forgiven without blood.",
    ),

    block("The prophets call sinners to return directly to God", "h3"),
    block(
      "Isaiah 55:6-7 tells the wicked to forsake his way and return to the LORD, who will have compassion and abundantly pardon. Ezekiel 18 says that the wicked person who turns from wrongdoing will live and that former transgressions will not be remembered against him. Hosea 14 tells Israel to return with words, ask for forgiveness, and trust that God will heal their disloyalty and love them freely.",
    ),
    block(
      "The book of Jonah supplies a narrative demonstration. Nineveh believes God, fasts, calls upon Him, and turns away from violence. God sees their changed conduct and withholds the threatened destruction. The story reports no temple, priest, animal offering, or transferred punishment.",
    ),
    block(
      "Psalm 51 asks God to blot out wrongdoing through mercy and describes a broken and contrite heart as the sacrifice God will not despise. The psalm later anticipates righteous offerings, so it does not abolish sacrifice. It does establish that ritual cannot replace inward repentance. Isaiah 1 makes the same point more sharply: God rejects abundant animal offerings from hands that remain violent, commands the people to cease evil and pursue justice, and then promises cleansing from scarlet sin.",
    ),

    block("Personal guilt cannot simply be transferred", "h3"),
    block(
      "Ezekiel 18:20 says that the son does not bear the father's guilt and the father does not bear the son's guilt. After the golden calf, Moses offers to be blotted out if the people cannot be forgiven. God's answer in Exodus 32:33 is that the one who sinned is the one held accountable. These passages resist the idea that moral guilt moves from the guilty to the innocent merely because a substitute is willing.",
    ),

    block("Human sacrifice is condemned, not normalized", "h3"),
    block(
      "Deuteronomy 12:31 describes nations burning sons and daughters to their gods and calls the practice an abomination hated by the LORD. Micah 6 then imagines increasingly extravagant offerings: calves, thousands of rams, rivers of oil, and finally a firstborn child for one's transgression. The prophetic answer is not a human victim. It is to do justice, love mercy, and walk humbly with God.",
    ),

    block("Abraham's son: the clearer commanded sacrifice is stopped", "h2"),
    block(
      "Genesis 22 explicitly introduces Abraham's ordeal as a test. Abraham is commanded to offer Isaac, but at the decisive moment he is told not to harm the boy. A ram is offered instead. The human son lives.",
    ),
    block(
      "The Quran does not name the son in this passage, but it records Abraham telling him that he has seen himself slaughtering him in a dream:",
    ),
    quran(
      "and when he was old enough to go about and work with him, (one day) Abraham said to him: “My son, I see in my dream that I am slaughtering you. So consider (and tell me) what you think.” He said: “Do as you are bidden. You will find me, if Allah so wills, among the steadfast.”",
      "Quran 37:102 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "Father and son submit, but the Quran says Abraham has fulfilled the vision, calls the ordeal a plain trial, and says that the son was ransomed with a mighty sacrifice. The retrieved al-Tafsir al-Muyassar and Ma'arif al-Quran identify the replacement as a ram. As in Genesis, the human death is not completed.",
    ),
    callout(
      "reflection",
      "A question the later doctrine must answer",
      "If God intended to establish the death of an innocent son as the necessary mechanism of forgiveness, why does the foundational Abrahamic narrative containing an explicit command or sacrificial vision end with God preventing the human death?",
    ),
    block(
      "This does not make Abraham's son a ‘better sacrifice.’ Neither Genesis nor the Quran presents his death as atonement for humanity's sins. The stronger argument is that he is the clearer scriptural candidate for a commanded human offering—and yet God does not permit that offering to be completed.",
    ),
    block(
      "Nothing directly comparable is narrated for Jesus. The New Testament never records Jesus receiving a dream in which God commands him to become a sacrifice for human sin. Jesus predicts his suffering, interprets his coming death, and submits in Gethsemane to what he understands as the Father's will. Christians answer that Jesus did not need a dream because the divine Son already knew and freely accepted his mission. That response depends on distinctively Christian claims about incarnation and pre-existence; it is not the same narrative pattern as Abraham's explicit sacrificial test.",
    ),
    table("The two son narratives are not identical", [
      ["Abraham's son", "Jesus"],
      [
        "An explicit command or sacrificial dream is narrated.",
        "No comparable dream commanding Jesus to become a sin offering is narrated.",
      ],
      [
        "The ordeal is expressly identified as a test.",
        "The death is interpreted as redemption and universal atonement.",
      ],
      [
        "God prevents the human death.",
        "The New Testament makes the death central to salvation.",
      ],
      [
        "A ram replaces the son.",
        "Jesus himself becomes the final sacrifice in Christian interpretation.",
      ],
    ]),

    block("The strongest Tanakh counterargument: Isaiah 53", "h2"),
    block(
      "No responsible article can ignore Isaiah 52:13-53:12. The servant suffers in connection with the transgressions of others, bears their iniquities, is compared to a lamb, is cut off from the land of the living, and is described with language related to a guilt offering. The New Testament repeatedly applies this suffering-servant imagery to Jesus.",
    ),
    block(
      "The chapter is therefore the strongest Tanakh bridge to Christian atonement. It also contains unresolved questions. The speaker and identity of the servant are debated. Jewish interpretation has often read the servant corporately as Israel, while Christian interpretation identifies him with Jesus. The text portrays extraordinary vicarious suffering, but it does not explicitly state the universal rule that God is incapable of forgiving anyone unless this servant dies.",
    ),
    block(
      "Isaiah 53 must also be read beside Ezekiel 18. Isaiah connects one servant's suffering with the wrongs of others; Ezekiel insists that moral guilt remains personal. The tension should be acknowledged rather than erased. Isaiah 53 gives Christianity genuine scriptural material to develop, but the identification of Jesus as the servant and the conclusion that his death is the necessary basis of every divine pardon come through the New Testament's interpretation.",
    ),

    block("The Quran: repentance, responsibility, and mercy", "h2"),
    block("Adam is forgiven through repentance", "h3"),
    quran(
      "Thereupon Adam learned from his Lord some words and repented and his Lord accepted his repentance for He is Much-Relenting, Most Compassionate.",
      "Quran 2:37 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "The Quran's first human sin is not resolved by inherited guilt or a future human victim. Adam receives words, repents, and is accepted by his Lord.",
    ),

    block("The sinner is told to ask God directly", "h3"),
    quran(
      "He who does either evil or wrongs himself, and then asks for the forgiveness of Allah, will find Allah All-Forgiving, All-Compassionate.",
      "Quran 4:110 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "Quran 3:135-136 describes people who commit wrong, remember Allah, ask Him to forgive, refuse to persist knowingly, and receive forgiveness. Quran 39:53-54 tells people who have committed excesses against themselves not to despair of divine mercy but to turn and surrender to their Lord. Ma'arif al-Quran interprets these passages as hope for sinners who sincerely desist, repent, and return before death.",
    ),

    block("No bearer carries another person's burden", "h3"),
    quran(
      "Everyone will bear the consequence of what he does, and no one shall bear the burden of another.",
      "Quran 6:164, excerpt · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "Ma'arif al-Quran explains the verse as rejecting the proposal that one person may assume another person's sin or punishment simply by offering to carry it. Each person's wrongdoing remains in that person's own record before God.",
    ),

    block("Sacrificial blood does not reach God", "h3"),
    quran(
      "Neither their flesh reaches Allah nor their blood; it is your piety that reaches Him.",
      "Quran 22:37, opening sentence · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "The preceding verse commands animal sacrifice and distribution of its meat. The Quran does not reject sacrifice; it rejects the notion that God receives flesh or blood. Ma'arif al-Quran describes the real aim as sincere obedience and devotion. The rite matters because God prescribed it, but its spiritual reality is piety rather than divine need for blood.",
    ),

    block("The Quran denies the crucifixion", "h3"),
    block(
      "Quran 4:157-158 denies that Jesus was slain or crucified and says that Allah raised him. Whatever historical arguments readers bring to that claim, its theological consequence within the Quran is unmistakable: forgiveness cannot depend upon an event the Quran says did not happen as claimed.",
    ),
    callout(
      "quran",
      "The Quranic pattern",
      "Adam repents and is accepted. Sinners ask Allah directly for forgiveness. No soul carries another's burden. Sacrifice expresses obedient piety, not blood reaching God. Abraham's son is spared, and Jesus is not presented as a crucified sin offering.",
    ),

    block("The Bible contains its own challenge to absolute sacrificial necessity", "h2"),
    block(
      "The New Testament plainly contains sacrificial interpretations of Jesus' death. It also contains teachings in which forgiveness is announced through repentance, faith, prayer, mercy, and moral return without an explicit statement that an innocent death must first make it possible. These passages do not erase the atonement texts; they complicate the claim that the Bible speaks with one uncomplicated voice about how forgiveness operates.",
    ),

    block("Jesus teaches direct prayer for forgiveness", "h3"),
    quote("“Forgive us our debts, as we forgive our debtors.”"),
    block(
      "In Matthew 6:9-15, Jesus tells his followers to ask the heavenly Father for forgiveness and then says that their forgiveness of others is connected to the Father's forgiveness of them. No sacrificial payment is mentioned in the instruction.",
    ),

    block("Jesus announces forgiveness before the crucifixion", "h3"),
    block(
      "In Mark 2:1-12, Jesus tells the paralytic that his sins are forgiven and claims authority on earth to forgive. In Luke 7:36-50, he tells a repentant woman that her sins are forgiven and that her faith has saved her. Both scenes occur before the crucifixion, and neither scene says that forgiveness must wait for blood to be offered.",
    ),
    block(
      "Christians commonly answer that the future cross applies backward as well as forward. That is a possible theological harmonization, but it is not stated in either narrative. Within the scenes themselves, forgiveness is exercised by divine authority and received through faith.",
    ),

    block("The humbled sinner goes home justified", "h3"),
    quote("“O God, be merciful to me a sinner.”"),
    block(
      "In Luke 18:9-14, a tax collector asks God for mercy and goes home justified. The parable mentions no priest, sacrifice, transferred punishment, or belief in a coming crucifixion. Its stated contrast is between self-righteousness and humble dependence upon God's mercy.",
    ),

    block("The returning son is restored without a punished substitute", "h3"),
    block(
      "In Luke 15, the lost son recognizes his sin and returns. His father sees him from a distance, runs to him, embraces him, and restores him to the family. The father does not punish the innocent older brother or demand payment before showing mercy. The fattened calf is killed after reconciliation as part of the celebration, not as a victim punished for the son's wrongdoing.",
    ),

    block("Jesus says God desires mercy, not sacrifice", "h3"),
    block(
      "In Matthew 9:9-13, Jesus answers criticism for welcoming sinners by quoting Hosea: ‘I desire mercy, not sacrifice.’ He repeats the same principle in Matthew 12:7 when defending innocent people from condemnation. The statement does not abolish every sacrifice, but it places mercy and moral understanding above ritual performance.",
    ),

    block("Repentance and changed conduct remain conditions", "h3"),
    block(
      "Mark 1:4 describes John's baptism as a baptism of repentance for the forgiveness of sins. After the crucifixion, Peter still tells his audience in Acts 3:19 to repent and turn back so their sins may be wiped away. In Luke 19, Zacchaeus promises generosity and restitution, and Jesus announces that salvation has come to his house. Another person's death does not make repentance, restoration, and moral change unnecessary.",
    ),

    block("Jesus' final-judgment scene emphasizes deeds of mercy", "h3"),
    block(
      "Matthew 25:31-46 separates the nations according to whether they fed the hungry, welcomed the stranger, clothed the naked, cared for the sick, and visited prisoners. Christians may interpret these deeds as the fruit of saving faith. The announced criterion in the scene itself, however, is merciful conduct rather than profession of reliance upon a sacrificial death.",
    ),

    block("Hebrews 9:22 has a context and a qualification", "h3"),
    quote(
      "“According to the law almost everything is purified by blood, and without the shedding of blood there is no forgiveness.”",
    ),
    block(
      "The word ‘almost’ matters, as does Leviticus 5's flour offering. The USCCB study note explicitly acknowledges that ancient Israel knew other means of obtaining forgiveness, including contrition, and explains that the author is limiting his horizon to the sacrificial cult. Hebrews is constructing a comparison between sanctuary sacrifices and Jesus; it should not be isolated as proof that God has never forgiven any sin without receiving blood.",
    ),
    table("Two New Testament streams placed side by side", [
      ["Direct-mercy and accountability passages", "Sacrificial-atonement passages"],
      [
        "The Father forgives those who forgive others (Matthew 6:12-15).",
        "Jesus' blood is poured out for forgiveness (Matthew 26:28).",
      ],
      [
        "Jesus announces forgiveness before the cross (Mark 2:5-12; Luke 7:48-50).",
        "Christ is presented as expiation through his blood (Romans 3:23-26).",
      ],
      [
        "A humbled sinner asks God for mercy and is justified (Luke 18:13-14).",
        "Christ obtains eternal redemption with his blood (Hebrews 9:11-28).",
      ],
      [
        "A returning son is embraced without substitute punishment (Luke 15:11-32).",
        "Jesus' body is offered once for all (Hebrews 10:1-18).",
      ],
      [
        "Repent so sins may be wiped away (Acts 3:19).",
        "Christ died for sins (1 Corinthians 15:3).",
      ],
      [
        "Final judgment is depicted through deeds of mercy (Matthew 25:31-46).",
        "Christ bears sins in his body on the tree (1 Peter 2:24).",
      ],
    ]),

    block("What changes in the New Testament", "h2"),
    block(
      "The decisive development is not the invention of sacrificial vocabulary. The Torah already has altar, blood, priesthood, Passover, covenant, and atonement. Isaiah 53 already connects a servant's suffering with the wrongs of others. The New Testament gathers that vocabulary around one person and makes his death the unique, final, and universal saving sacrifice.",
    ),
    block(
      "Matthew 26:28 connects Jesus' covenant blood to forgiveness. Romans 3:23-26 describes Christ through the language of expiation and blood. Hebrews 9 says he entered the heavenly sanctuary with his own blood and obtained eternal redemption. Hebrews 10 says animal blood cannot take away sins but Jesus' body was offered once for all. First Corinthians 15 summarizes the proclamation by saying that Christ died for sins.",
    ),
    callout(
      "reflection",
      "The point of divergence",
      "Earlier scripture contains sacrifice, but it also repeatedly presents direct repentance and pardon without a human victim. The New Testament makes the death of Jesus the event through which all forgiveness is ultimately explained. That is a major theological development even if Christians understand it as fulfillment.",
    ),

    block("The strongest Christian response", "h2"),
    block(
      "Calling the crucifixion merely ‘human sacrifice’ can caricature Christianity. Mainstream Christians do not understand Jesus as an unrelated victim seized against his will. They argue that Jesus freely offered himself, that he is the divine Son incarnate, and that God therefore entered human suffering rather than demanding payment from an uninvolved third party.",
    ),
    block(
      "The Catholic Catechism describes Christ's death as the unique and definitive sacrifice, a gift initiated by the Father and freely offered by the Son in love. It says his obedience repairs human disobedience and restores communion with God. This is not presented as a pagan god being appeased by a stranger's blood, but as God's own saving action.",
    ),
    block(
      "Christian explanations are not identical. Some emphasize satisfaction or penal substitution: justice is satisfied because Christ bears what sinners deserve. Eastern Christian accounts more often emphasize healing, reconciliation, liberation, and Christ's victory over death. The Orthodox Church in America acknowledges the historical debate and quotes Gregory the Theologian rejecting both a ransom paid to the devil and the idea that the Father demanded or delighted in the blood of His Son. Gregory points to Isaac, whom God did not receive as a human victim, and says that the Father accepted Christ without asking for or demanding blood.",
    ),
    block(
      "That Orthodox qualification is important. It demonstrates that rejecting the picture of an angry Father who must punish an innocent Son is not merely an outside Muslim criticism. Christians themselves have disputed how sacrificial language should be understood. Yet Catholic, Orthodox, and Protestant traditions still make Jesus' death and resurrection indispensable to salvation, even when they explain the mechanism differently.",
    ),

    block("The verdict of the Abrahamic Consistency Test", "h2"),
    table("The scriptural pattern compared", [
      ["Question", "Tanakh", "Quran", "New Testament atonement"],
      [
        "Can a sinner turn directly to God?",
        "Yes: Isaiah 55, Ezekiel 18, Hosea 14, Psalm 51, and Jonah 3.",
        "Yes: 3:135-136, 4:110, and 39:53-54.",
        "Yes, but Christian theology normally makes Christ the basis of the pardon.",
      ],
      [
        "Does animal sacrifice have an appointed role?",
        "Yes, within Torah worship and atonement.",
        "Yes, as obedient worship whose piety—not blood—reaches God.",
        "Yes, but it is treated as incomplete or anticipatory.",
      ],
      [
        "Is human sacrifice an ordinary divine requirement?",
        "No; it is condemned, and Abraham's son is spared.",
        "No; Abraham's son is ransomed rather than killed.",
        "Jesus' unique death becomes the definitive sacrifice.",
      ],
      [
        "Does one person bear another's moral burden?",
        "Generally resisted; Isaiah 53 introduces a serious complication.",
        "No bearer carries another's burden.",
        "Applied centrally to Jesus in several apostolic writings.",
      ],
      [
        "Is blood the universal prerequisite for pardon?",
        "No explicit universal rule; several counterexamples exist.",
        "No; forgiveness is promised to the repentant by divine mercy.",
        "Definitive redemption is connected to Jesus' blood.",
      ],
    ]),
    block(
      "The result is substantial doctrinal divergence with an important qualification. Christianity did not create its sacrificial language from nothing. Leviticus, Passover, covenant blood, and Isaiah 53 supply genuine Jewish scriptural material that New Testament authors interpret through Jesus.",
    ),
    block(
      "Nevertheless, the Tanakh repeatedly depicts God forgiving repentance without a human death, rejects the burning of sons and daughters, preserves personal responsibility, and stops Abraham before his son is killed. The Quran intensifies that pattern through direct repentance, individual accountability, the priority of piety over sacrificial blood, the sparing of Abraham's son, and denial of Jesus' crucifixion.",
    ),
    block(
      "The New Testament's once-for-all human-divine sacrifice is therefore not simply the only forgiveness mechanism stated consistently from Abraham onward. It is a distinct Christian interpretation that rereads earlier sacrifice and suffering around Jesus.",
    ),
    callout(
      "reflection",
      "The final consistency question",
      "When the earlier scriptures show God pardoning those who return, insist that each person bears his own guilt, condemn human sacrifice, and spare Abraham's son, should the later requirement of a saving human death be called fulfillment—or should it be recognized as a theological departure from the earlier Abrahamic pattern?",
    ),
    {
      _key: key(),
      _type: "conclusionPanel",
      eyebrow: "Conclusion",
      title: "God's mercy precedes the theory built around it.",
      body: "The Tanakh and Quran do not portray God as unable to forgive until an innocent human being dies. They portray Him calling sinners to return, accepting repentance, demanding justice, and holding each soul responsible. Animal sacrifice has a real place, and Isaiah 53 provides Christianity with its strongest bridge, but neither establishes an unambiguous universal rule requiring a human victim.",
      finalLine:
        "The cross stands at the center of Christian faith. Under the Abrahamic Consistency Test, however, its necessity must be argued from the New Testament's later interpretation—not assumed as the only pattern Abraham, Moses, and the prophets ever taught.",
    },
    {
      _key: key(),
      _type: "sourceList",
      title: "Scripture and representative interpretive sources",
      items: [
        source(
          "Leviticus 5:5-13 — confession, means-based offerings, a flour sin offering, atonement, and forgiveness.",
          "https://www.mechon-mamre.org/e/et/et0305.htm",
        ),
        source(
          "Leviticus 16 — the Day of Atonement and its animal offerings.",
          "https://mechon-mamre.org/e/et/et0316.htm",
        ),
        source(
          "Leviticus 17:10-14 — blood, life, the altar, and atonement.",
          "https://mechon-mamre.org/e/et/et0317.htm",
        ),
        source(
          "Genesis 22 — Abraham is tested, Isaac is spared, and a ram is offered instead.",
          "https://mechon-mamre.org/e/et/et0122.htm",
        ),
        source(
          "Exodus 32:30-34 — Moses offers himself, and God assigns accountability to the sinner.",
          "https://mechon-mamre.org/e/et/et0232.htm",
        ),
        source(
          "Deuteronomy 12:29-31 — burning sons and daughters is described as an abomination God hates.",
          "https://new.mechon-mamre.org/e/et/et0512.htm",
        ),
        source(
          "Psalm 51 — direct appeal to mercy and the broken, contrite heart.",
          "https://mechon-mamre.org/e/et/et2651.htm",
        ),
        source(
          "Isaiah 1:11-20 — rejected sacrifices, moral reform, and cleansing from sin.",
          "https://mechon-mamre.org/e/et/et1001.htm",
        ),
        source(
          "Isaiah 53 — the suffering servant, vicarious suffering, guilt-offering language, and intercession.",
          "https://mechon-mamre.org/e/et/et1053.htm",
        ),
        source(
          "Isaiah 55:6-7 — return to God, compassion, and abundant pardon.",
          "https://mechon-mamre.org/e/et/et1055.htm",
        ),
        source(
          "Ezekiel 18 — personal responsibility, repentance, life, and sins no longer remembered.",
          "https://www.mechon-mamre.org/e/et/et1218.htm",
        ),
        source(
          "Hosea 14 — return with words, forgiveness, healing, and freely given love.",
          "https://mechon-mamre.org/e/et/et1314.htm",
        ),
        source(
          "Jonah 3 — Nineveh turns from violence and God withholds the announced destruction.",
          "https://mechon-mamre.org/e/et/et1703.htm",
        ),
        source(
          "Micah 6:6-8 — the firstborn proposal contrasted with justice, mercy, and humble walking with God.",
          "https://mechon-mamre.org/e/et/et1806.htm",
        ),
        source(
          "Maimonides, Laws of Repentance 1 — sacrifice does not atone without repentance and confession; without the Temple, repentance remains.",
          "https://www.mechon-mamre.org/i/en/1501.htm",
        ),
        source(
          "Matthew 6 — direct prayer to the Father for forgiveness and the duty to forgive others.",
          "https://bible.usccb.org/bible/matthew/6",
        ),
        source(
          "Matthew 9 — Jesus forgives and quotes, ‘I desire mercy, not sacrifice.’",
          "https://bible.usccb.org/bible/matthew/9",
        ),
        source(
          "Matthew 25:31-46 — final judgment depicted through deeds of mercy.",
          "https://bible.usccb.org/bible/matthew/25",
        ),
        source(
          "Matthew 26 — Gethsemane and covenant blood poured out for forgiveness.",
          "https://bible.usccb.org/bible/matthew/26",
        ),
        source(
          "Mark 1 — baptism of repentance for forgiveness before the crucifixion.",
          "https://bible.usccb.org/bible/mark/1",
        ),
        source(
          "Mark 2 — Jesus announces forgiveness and claims authority to forgive on earth.",
          "https://bible.usccb.org/bible/mark/2",
        ),
        source(
          "Luke 7 — the forgiven woman and the declaration that her faith saved her.",
          "https://bible.usccb.org/bible/luke/7",
        ),
        source(
          "Luke 15 — the returning son is compassionately restored by his father.",
          "https://bible.usccb.org/bible/luke/15",
        ),
        source(
          "Luke 18 — the humbled tax collector asks God for mercy and goes home justified.",
          "https://bible.usccb.org/bible/luke/18",
        ),
        source(
          "Luke 19 — Zacchaeus, restitution, and salvation.",
          "https://bible.usccb.org/bible/luke/19",
        ),
        source(
          "Acts 3 — the suffering Messiah and the call to repent so sins may be wiped away.",
          "https://bible.usccb.org/bible/acts/3",
        ),
        source(
          "Romans 3 — justification, expiation, faith, and the blood of Jesus.",
          "https://bible.usccb.org/bible/romans/3",
        ),
        source(
          "Hebrews 9 — Jesus' blood, eternal redemption, and the contextual note on 9:22.",
          "https://bible.usccb.org/bible/hebrews/9",
        ),
        source(
          "Hebrews 10 — animal blood, Jesus' once-for-all offering, and forgiveness.",
          "https://bible.usccb.org/bible/hebrews/10",
        ),
        source(
          "Catholic Catechism 613-623 — Christ's unique, freely offered, definitive sacrifice.",
          "https://www.vatican.va/content/catechism/en/part_one/section_two/chapter_two/article_4/paragraph_2_jesus_died_crucified.html",
        ),
        source(
          "Orthodox Church in America — redemption, competing payment theories, Gregory the Theologian, and victory over death.",
          "https://www.oca.org/orthodoxy/the-orthodox-faith/doctrine-scripture/the-symbol-of-faith/redemption",
        ),
        source(
          "Quran 2:37 — Adam's repentance is accepted; Tafhim al-Quran translation.",
          "https://quran.com/2/37?translations=95",
        ),
        source(
          "Quran 3:135-136 — sinners ask Allah for forgiveness and do not knowingly persist; Tafhim al-Quran translation.",
          "https://quran.com/3/135-136?translations=95",
        ),
        source(
          "Quran 4:110 — the sinner who asks Allah's forgiveness finds Him forgiving and compassionate; Tafhim al-Quran translation.",
          "https://quran.com/4/110?translations=95",
        ),
        source(
          "Quran 4:157-158 — denial that Jesus was slain or crucified and affirmation that Allah raised him; Tafhim al-Quran translation.",
          "https://quran.com/4/157-158?translations=95",
        ),
        source(
          "Quran 6:164 — no bearer carries another's burden; Tafhim al-Quran translation.",
          "https://quran.com/6/164?translations=95",
        ),
        source(
          "Quran 22:36-37 — animal sacrifice, distribution, and piety rather than flesh or blood reaching Allah; Tafhim al-Quran translation.",
          "https://quran.com/22/36-37?translations=95",
        ),
        source(
          "Quran 37:102-107 — Abraham's dream, the test, and the son ransomed with a sacrifice; Tafhim al-Quran translation.",
          "https://quran.com/37/102-107?translations=95",
        ),
        source(
          "Quran 39:53-54 — do not despair of Allah's mercy; turn and surrender to Him; Tafhim al-Quran translation.",
          "https://quran.com/39/53-54?translations=95",
        ),
        source(
          "Ma'arif al-Quran on 4:110, 6:164, 22:37, 37:107, and 39:53-54 — repentance, personal responsibility, sacrifice, Abraham's son, and mercy.",
          "https://quran.com/en/39/53/tafsirs?tafsirId=168",
        ),
        source(
          "Al-Tafsir al-Muyassar on Quran 22:37 — sincerity and exclusive devotion rather than flesh or blood reaching Allah.",
          "https://quran.com/ar/22/37/tafsirs?tafsirId=16",
        ),
      ],
    },
    {
      _key: key(),
      _type: "sideNote",
      body: "Grounding note: Quran translations were retrieved from quran.ai in Sayyid Abul A'la Maududi's Tafhim al-Quran edition (en-al-maududi): 2:37, 3:135-136, 4:110, 4:157-158, 6:164, 22:36-37, 37:102-107, and 39:53-54. Interpretive claims were checked through quran.ai fetch_tafsir using al-Tafsir al-Muyassar and Ma'arif al-Quran. Jewish Scripture was checked against the Hebrew Bible in English at Mechon-Mamre; New Testament passages were checked against the USCCB Bible; Catholic and Orthodox explanations were checked against their linked institutional sources. The comparative verdict is the author's synthesis, not a rabbinic ruling, church judgment, fatwa, or opinion from quran.ai, quran.com, or quran.foundation.",
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
