import sanityCli from "sanity/cli";

const client = sanityCli.getCliClient({apiVersion: "2026-08-16"});
const key = (() => {
  let sequence = 0;
  return () => `ev${(++sequence).toString(36)}`;
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
  _id: "drafts.article-does-existence-of-evil-disprove-god",
  _type: "article",
  title: "Does the Existence of Evil Disprove God?",
  slug: {_type: "slug", current: "does-existence-of-evil-disprove-god"},
  description:
    "A serious examination of the logical and evidential problem of evil through philosophy, the Tanakh, the New Testament, and the Quran—without blaming victims or reducing suffering to a slogan.",
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
      text: "If God is all-powerful, He can prevent suffering. If He is all-knowing, He knows it is coming. If He is perfectly good, He appears to have reason to prevent it. Yet children suffer, the innocent are harmed, animals die in pain, and disasters do not distinguish between the righteous and the wicked. Is this merely difficult for belief—or does it make God impossible?",
    },
    callout(
      "reflection",
      "The verdict in one sentence",
      "The existence of evil does not create a strict logical disproof of God, but the scale, intensity, and apparent pointlessness of suffering form one of the strongest evidential arguments against classical theism. The Abrahamic scriptures answer cumulatively—not with one slogan—and they forbid the believer from treating every tragedy as a punishment for its victim.",
    ),

    block("First, state the objection in its strongest form", "h2"),
    block(
      "The problem is aimed most directly at classical theism: belief in one God who is unlimited in power, complete in knowledge, and perfect in goodness. A limited god might want to stop evil but be unable. An indifferent god might be able but unwilling. The tension arises because Abrahamic belief normally denies both limitations.",
    ),
    block(
      "J. L. Mackie's famous logical formulation placed three claims side by side: God is omnipotent, God is wholly good, and evil exists. William Rowe later pressed an evidential version: even if some suffering is compatible with God, there appear to be instances of intense suffering that an all-powerful and all-knowing being could prevent without losing a greater good or allowing something equally bad.",
    ),
    table("Three different problems are often confused", [
      ["Problem", "What it asks", "What would answer it"],
      [
        "Logical",
        "Are God and any evil whatsoever mutually contradictory?",
        "One logically possible morally sufficient reason for God to permit evil.",
      ],
      [
        "Evidential",
        "Do the amount, kinds, and distribution of suffering make God unlikely?",
        "A credible cumulative explanation strong enough to address the actual world, not merely a possible world.",
      ],
      [
        "Existential",
        "How can a wounded person continue to trust, pray, or live?",
        "Presence, truth, lament, care, justice, and hope—not a debate delivered at the bedside.",
      ],
    ]),
    callout(
      "warning",
      "Do not answer grief as though it were a puzzle",
      "A philosophical defense may show that belief is coherent. It does not tell us why this child died, why this family was harmed, or why this prayer seemed unanswered. Scripture itself gives sufferers language to protest. A person in pain may need protection, medicine, companionship, and justice before argument.",
    ),

    block("A defense is not the same as a theodicy", "h2"),
    block(
      "A defense tries to show that God and evil could coexist without contradiction. A theodicy goes further and proposes the actual or probable reasons God permits suffering. This distinction matters because a successful answer to the logical problem can remain an incomplete answer to the evidential problem.",
    ),
    block(
      "Suppose meaningful freedom makes some wrongdoing possible. That is enough to block the bare claim that a good God and moral evil are logically incompatible. It does not yet explain why the world contains this much cruelty, why God rarely interrupts the worst choices, or why disease and animal pain existed apart from any victim's decision.",
    ),

    block("The Tanakh does not hide the scandal", "h2"),
    block("Creation is called good, not evil", "h3"),
    block(
      "Genesis 1:31 says that God saw all that had been made and found it very good. The opening claim is not that pain, oppression, and death are secretly good. They are judged against an intended order whose goodness makes corruption recognizable as corruption.",
    ),
    block(
      "Deuteronomy 30 places life and death, blessing and curse, before human beings and commands them to choose life. This gives creaturely choice real moral weight. Much suffering is not an abstract substance God created for its own sake; it is what human beings do when freedom, appetite, fear, and power are turned against the good.",
    ),

    block("Job destroys the formula ‘suffering proves guilt’", "h3"),
    block(
      "The book of Job deliberately introduces its sufferer as blameless and upright. Job's friends insist on a tidy moral equation: serious suffering must reveal serious sin. Yet the story refuses their diagnosis. At the end, God tells the friends that they have not spoken truthfully about Him as Job has.",
    ),
    block(
      "Job does not receive a neat explanation for each loss. The divine speeches widen his field of vision to a creation whose complexity exceeds human knowledge. That supports humility, but it should not be twisted into ‘might makes right.’ Job is allowed to lament, question, and demand an audience; the confident explanations of the spectators receive the sharper rebuke.",
    ),
    callout(
      "insight",
      "A scriptural rule for speaking about victims",
      "If Job's friends could defend God with true statements arranged into a false diagnosis, modern believers can do the same. Never infer a person's guilt from the severity of the person's suffering.",
    ),

    block("The prophets and wisdom books preserve protest", "h3"),
    quote("“How long ... shall I shout to You, ‘Violence!’ and You not save?”"),
    block(
      "Habakkuk 1:2-4 complains that violence continues, law is weakened, and justice emerges distorted. Psalm 10 asks why God seems distant while the wicked prey upon the helpless. Psalm 73 is disturbed by the ease of the wicked. Ecclesiastes 8:14 observes that the upright sometimes receive what the wicked deserve while the wicked receive what the upright deserve.",
    ),
    block(
      "These are not atheist quotations smuggled into scripture. They are scripture. Abrahamic faith does not require pretending that the world's moral distribution looks fair from the ground. Lament becomes an act of faith precisely because the speaker addresses the God whose justice appears delayed.",
    ),

    block("Divine sovereignty includes calamity—but not moral corruption", "h3"),
    block(
      "Isaiah 45:7 is sometimes quoted from older English translations as God saying that He creates ‘evil.’ The Hebrew term can cover moral evil or calamity depending on context. Here it stands opposite peace or well-being; the Revised JPS renders it as God creating ‘woe,’ while the NET Bible uses ‘calamity.’ The point is uncompromising monotheism: history's reversals are not controlled by a rival deity.",
    ),
    block(
      "That passage prevents an easy escape in which God has no relation at all to natural events. But it does not say that God lies, oppresses, or loves wickedness. The Tanakh repeatedly commands justice and condemns those who manufacture moral evil. A complete account must therefore distinguish God's sovereign permission or judgment from the blameworthy intention of a creature.",
    ),

    block("The Tanakh looks beyond the present ledger", "h3"),
    block(
      "Isaiah 25:8 envisions death destroyed and tears wiped away. Daniel 12:2 speaks of resurrection to eternal life or lasting disgrace. These passages do not make present anguish unreal. They say that death does not close God's court and that earthly history is not the complete measure of divine justice.",
    ),

    block("The New Testament rejects victim-blaming", "h2"),
    block(
      "In John 9, Jesus' disciples ask whether a man was born blind because of his own sin or his parents' sin. Jesus answers, ‘Neither he nor his parents sinned.’ In Luke 13, he discusses people killed by political violence and people killed when a tower fell. He explicitly denies that the victims were greater sinners than others.",
    ),
    block(
      "These passages are decisive against the reflex to call every disease, accident, or disaster a targeted punishment. Jesus turns the audience from speculation about victims to self-examination and action. In John 9, the question is followed by a work of healing.",
    ),

    block("Trial and temptation are not identical", "h3"),
    block(
      "James 1 says trials can produce perseverance, yet it also says that God tempts no one toward evil. The same life event may become a setting in which character is revealed without making God the author of the sinful desire or action. This parallels an important Quranic distinction: God may test through conditions while the creature remains accountable for the evil it chooses within them.",
    ),

    block("Creation groans; Christianity expects restoration", "h3"),
    block(
      "Romans 8 does not describe the present creation as painless. It says creation is subjected to futility, enslaved to decay, and groaning, while believers also groan as they await bodily redemption. Revelation 21 concludes with the hope that death, mourning, crying, and pain will end.",
    ),
    block(
      "Christianity adds a distinctive answer in the cross: God is not portrayed as watching human suffering from an untouched distance but as entering it in Jesus. For Christians, resurrection is God's verdict that suffering and death will not have the final word. Judaism and Islam do not share the doctrines of incarnation and atoning crucifixion, so this must be presented as a specifically Christian claim rather than an Abrahamic consensus.",
    ),
    callout(
      "reflection",
      "What the cross does—and does not—answer",
      "Divine participation can answer the charge that God is indifferent. By itself, it does not explain why each horror was permitted. Solidarity, explanation, and final rectification are related but different claims.",
    ),

    block("The Quran: life is a test, and God wrongs no one", "h2"),
    quran(
      "Every living being shall taste death and We shall subject you to ill and good by way of trial, and to Us shall all of you be eventually sent back.",
      "Quran 21:35 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "This verse gives the Quranic frame in one movement: mortality, testing through both hardship and ease, and return to God. The retrieved al-Tafsir al-Muyassar explains worldly existence as testing through commands, prohibitions, and changing conditions of good and ill, followed by judgment. Al-Sa'di likewise reads poverty and wealth, honor and humiliation, life and death as conditions that reveal conduct.",
    ),
    block(
      "The Quran therefore does not promise believers exemption from loss. Quran 29:2-3 asks whether people think saying ‘We believe’ will leave them untested. Quran 67:2 says death and life were created to test who is best in deed. The test is not divine ignorance seeking information; in the classical commentaries retrieved here, it manifests truthfulness and conduct in lived history.",
    ),

    block("Some suffering comes through human corruption", "h3"),
    quran(
      "Evil has become rife on the land and at sea because of men's deeds; this in order that He may cause them to have a taste of some of their deeds; perhaps they will turn back (from evil).",
      "Quran 30:41 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "The verse refuses to treat every social and environmental disaster as detached from human agency. Violence, exploitation, corruption, unsafe construction, war, neglect, and damage to the earth turn choices into shared suffering. Al-Muyassar and al-Sa'di interpret the corruption as damage appearing in livelihoods and bodies because of corrupt human acts, with consequences serving as a call to return.",
    ),
    block(
      "Quran 42:30 similarly connects misfortune with human deeds while adding that God forgives much. But neither verse licenses pointing at an individual victim and declaring a private divine verdict. Quran 2:155-157 explicitly promises that believers will be tested through fear, hunger, and losses. A communal causal principle is not a biography of every sufferer.",
    ),

    block("Providence and responsibility are held together", "h3"),
    block(
      "Quran 4:78-79 places two statements together. All events are under Allah's decree; yet the good that reaches a person is divine favor, while misfortune is connected to human action. Al-Sa'di explains the first level as divine decree and creation and the second as moral causation and responsibility. This is not a second power competing with God. It distinguishes ultimate sovereignty from the accountable creaturely cause.",
    ),
    quran(
      "Indeed Allah wrongs none, not even as much as an atom's weight. Whenever a man does good, He multiplies it two-fold, and bestows out of His grace a mighty reward.",
      "Quran 4:40 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "Al-Muyassar and al-Sa'di interpret this as perfect justice: no good is diminished and no evil is added to a person's account, while good may be multiplied by grace. The Quranic response cannot therefore be ‘whatever happens is just by definition.’ The claim is stronger and riskier: when the whole account is disclosed, no person will have been wronged by Allah.",
    ),

    block("The present life is not the full trial record", "h3"),
    quran(
      "Everyone is bound to taste death and you shall receive your full reward on the Day of Resurrection. Then, whoever is spared the Fire and is admitted to Paradise has indeed been successful. The life of this world is merely an illusory enjoyment.",
      "Quran 3:185 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi",
    ),
    block(
      "The word ‘full’ is central to the argument. Al-Muyassar explains that creatures return for an undiminished reckoning; al-Sa'di says complete recompense occurs on the Day of Resurrection. If there is no resurrection, the unanswered suffering of the dead remains unanswered. If resurrection and judgment are real, death is a boundary within the story rather than the destruction of the person whose story God must set right.",
    ),

    block("The Quran permits humility, not invented explanations", "h3"),
    block(
      "In Quran 18:79-82, Moses sees actions whose wisdom he cannot initially recognize: a damaged boat is protected from seizure and a wall preserves the property of orphans. The narrative illustrates a limited observer judging from an incomplete field of knowledge. It gives a reason to resist the inference ‘I see no possible good reason, therefore no reason exists.’",
    ),
    block(
      "It does not authorize believers to invent hidden benefits for a particular bereavement or atrocity. In the story, the explanation comes through revelation. Without revelation about a specific tragedy, humility should take the form ‘I do not know’—not a confident claim that the victim needed the pain.",
    ),

    block("Where the three scriptural traditions converge", "h2"),
    table("An Abrahamic consistency map", [
      ["Claim", "Tanakh", "New Testament", "Quran"],
      [
        "Creation and goodness",
        "Creation is declared very good; evil violates the intended order.",
        "Good gifts come from God; creation awaits liberation from decay.",
        "Good is divine favor; Allah is never unjust.",
      ],
      [
        "Human agency",
        "People are commanded to choose life and held responsible for violence.",
        "Sin arises through human desire and action; repentance is required.",
        "Corruption appears through human deeds; people wrong themselves.",
      ],
      [
        "Victim-blaming",
        "Job is upright, and the friends' simple retribution theory is rebuked.",
        "Jesus denies that tragic victims were worse sinners.",
        "Believers themselves are promised tests through fear and loss.",
      ],
      [
        "Lament",
        "Job, Psalms, Ecclesiastes, and Habakkuk speak protest before God.",
        "Jesus laments; creation and believers groan.",
        "Sufferers name affliction, seek help, practice patience, and return to Allah.",
      ],
      [
        "Final horizon",
        "Prophetic hope includes justice, resurrection, and the defeat of death.",
        "Resurrection and new creation end death and mourning.",
        "Full recompense comes at resurrection; no deed is lost.",
      ],
    ]),
    block(
      "The traditions do not agree on every mechanism of providence, salvation, or restoration. Christianity's incarnation and cross are distinctive. Jewish readings of Job and the world to come are diverse. Islamic theology contains different schools on decree and human acquisition. Yet the broad scriptural pattern is remarkably consistent: the present world is morally serious but not morally complete; humans produce real evil; suffering is not a reliable measurement of a victim's guilt; God permits complaint; and final judgment belongs to Him.",
    ),

    block("What free will explains—and what it does not", "h2"),
    block(
      "The free-will defense begins with a genuine good: love, trust, courage, and moral responsibility have a different value when a person can refuse them. A world of programmed movements would avoid betrayal, but it would not contain freely chosen fidelity. Preventing every harmful choice at the moment it was made could empty agency of serious consequence.",
    ),
    block(
      "This gives a plausible account of much moral evil. It also exposes a duty often omitted from apologetics: if human freedom is significant enough to explain evil, then our freedom to resist evil is significant too. Scripture repeatedly commands intervention for the oppressed. ‘Free will’ cannot excuse passivity toward abuse, war, hunger, or preventable disease.",
    ),
    block(
      "Free will alone does not explain earthquakes, congenital disease, predation, or suffering among nonhuman animals. Some ‘natural’ evils are intensified by negligence and injustice, but not all. Any honest theodicy must say more.",
    ),

    block("Natural law, formation, and their limits", "h2"),
    block(
      "A stable physical world allows prediction, responsibility, science, and meaningful action. The same regularities that make fire warm a home allow it to burn; the same tectonic processes that shape a habitable planet can produce earthquakes. If God suspended consequences whenever they threatened harm, the world might cease to be a coherent arena of agency.",
    ),
    block(
      "Difficulty can also make possible courage, patience, generosity, repentance, and solidarity. The Tanakh, New Testament, and Quran all speak of testing or refinement. A painless environment would exclude some virtues that respond to danger and loss.",
    ),
    callout(
      "warning",
      "Two explanations that must not be overclaimed",
      "Regular laws may explain why some risk accompanies an ordered world; they do not show that every disease or disaster was necessary. Character formation may explain how good can emerge from suffering; it does not make the suffering good, prove that extreme horrors were required, or justify telling a victim that the harm was sent to improve them.",
    ),

    block("The hardest objections remain", "h2"),
    table("Objections a serious believer should not evade", [
      ["Objection", "Why it remains difficult", "A measured theistic reply"],
      [
        "Why so much suffering?",
        "Freedom and regular laws may require risk, but perhaps not this scale or severity.",
        "No single defense establishes the necessity of the actual quantity. The answer must be cumulative and remain epistemically modest.",
      ],
      [
        "What about children and animals?",
        "They may suffer without morally choosing the conditions that harmed them.",
        "Their cases expose the limits of free will and increase the importance of divine preservation, resurrection, compensation, and final justice.",
      ],
      [
        "Why does God not intervene selectively?",
        "Stopping only the worst horrors seems compatible with ordinary agency.",
        "The believer may appeal to unseen consequences and a coherent providential order, but cannot demonstrate why a particular intervention did not occur.",
      ],
      [
        "Can heaven contain freedom without evil?",
        "If perfected people can be free and sinless later, why not create them that way now?",
        "Theists often distinguish formed character and freely embraced union with God from an unchosen initial condition, but the debate is not closed by that distinction.",
      ],
      [
        "Does mystery explain anything?",
        "‘God has reasons’ can become immune to all evidence.",
        "Limited knowledge blocks a claim of logical impossibility; it should not be used as a complete theodicy or to silence moral protest.",
      ],
    ]),

    block("Does calling something evil secretly assume God?", "h2"),
    block(
      "A common response says that an atheist cannot call anything objectively evil without borrowing morality from God. That is too quick. Atheists can recognize suffering, condemn cruelty, act sacrificially, and defend versions of moral realism. The problem of evil is also an internal critique: if the theist calls God good, does the observed world fit that claim?",
    ),
    block(
      "There is still a deeper worldview question about what grounds objective moral obligations and the equal worth of persons. But even if theism offers a stronger moral foundation, that does not erase the evidential force of suffering. The moral argument and the problem of evil must each be assessed rather than used to cancel one another rhetorically.",
    ),

    block("So, does evil disprove God?", "h2"),
    block(
      "No—not as a strict contradiction. The claim ‘a perfectly good God may permit some evil for morally sufficient reasons’ is logically coherent. Human freedom alone is enough to show a possible route for moral evil, and the scriptural worldviews add ordered nature, testing, character, limited human perspective, resurrection, judgment, and restoration.",
    ),
    block(
      "But the evidential problem cannot be dismissed so easily. The intensity, apparently random distribution, and seeming excess of suffering can rationally count against theism. Whether it defeats belief depends on the total case: the independent reasons for or against God, whether consciousness and morality fit one worldview better than another, whether revelation is credible, and whether resurrection and final justice are real.",
    ),
    block(
      "The scriptural answer is not that evil is unreal, that pain is always deserved, or that every tragedy can be decoded. It is that God can permit what He does not morally approve; creatures can be true causes without escaping divine sovereignty; temporary permission is not final indifference; and no victim disappears beyond God's knowledge or judgment.",
    ),
    callout(
      "conclusion",
      "The Abrahamic consistency test",
      "The Tanakh, New Testament, and Quran agree on the central structure: God is just; humans are morally responsible; righteous people can suffer; lament is permitted; this life is not the full account; and evil will be judged rather than renamed good. The existence of evil therefore challenges shallow belief, but it does not logically disprove the one God of Abraham.",
    ),

    {
      _key: key(),
      _type: "sourceList",
      title: "Sources and further reading",
      items: [
        source(
          "Stanford Encyclopedia of Philosophy — The Problem of Evil: logical and evidential formulations, defenses, and theodicies.",
          "https://plato.stanford.edu/archives/spr2014/entries/evil/",
        ),
        source(
          "Internet Encyclopedia of Philosophy — The Evidential Problem of Evil: moral/natural evil, Rowe's argument, skeptical theism, and theodicy.",
          "https://iep.utm.edu/evil-evi/",
        ),
        source(
          "J. L. Mackie, ‘Evil and Omnipotence’ (1955) — classic logical formulation.",
          "https://joelvelasco.net/teaching/hum9/mackie55-evilomnipotence.pdf",
        ),
        source(
          "William Rowe, ‘The Problem of Evil and Some Varieties of Atheism’ (1979) — classic evidential argument.",
          "https://rintintin.colorado.edu/~vancecd/phil201/Rowe.pdf",
        ),
        source(
          "Genesis 1 — creation declared very good; Revised JPS text at Sefaria.",
          "https://www.sefaria.org/Genesis.1.31?lang=en",
        ),
        source(
          "Deuteronomy 30:15-20 — life, death, and the command to choose life; Revised JPS text at Sefaria.",
          "https://www.sefaria.org/Deuteronomy.30.15-20?lang=en",
        ),
        source(
          "Job 1 and 42 — the upright sufferer and God's rebuke of the friends' diagnosis; Revised JPS text at Sefaria.",
          "https://www.sefaria.org/Job.42.7?lang=en",
        ),
        source(
          "Psalm 10 — lament over divine hiddenness and oppression; Revised JPS text at Sefaria.",
          "https://www.sefaria.org/Psalms.10?lang=en",
        ),
        source(
          "Psalm 73 — distress at the prosperity of the wicked; JPS text at Sefaria.",
          "https://www.sefaria.org/Psalms.73?lang=en",
        ),
        source(
          "Ecclesiastes 8:14 — the upright and wicked do not receive visibly proportional outcomes; JPS text at Sefaria.",
          "https://www.sefaria.org/Ecclesiastes.8.14?lang=en",
        ),
        source(
          "Habakkuk 1:2-4 — scriptural protest against violence and distorted justice; Revised JPS text at Sefaria.",
          "https://www.sefaria.org/Habakkuk.1.2-4?lang=en",
        ),
        source(
          "Isaiah 45:7 — light/darkness and well-being/woe; Revised JPS text at Sefaria.",
          "https://www.sefaria.org/Isaiah.45.7?lang=en",
        ),
        source(
          "NET Bible on Isaiah 45:7 — translation as peace and calamity, with contextual notes.",
          "https://classic.net.bible.org/verse.php?book=isa&chapter=45&verse=7",
        ),
        source(
          "Isaiah 25:8 — death destroyed and tears wiped away; Revised JPS text at Sefaria.",
          "https://www.sefaria.org/Isaiah.25.8?lang=en",
        ),
        source(
          "Daniel 12:2-3 — resurrection, life, judgment, and vindication; Revised JPS text at Sefaria.",
          "https://www.sefaria.org/Daniel.12.2-3?lang=en",
        ),
        source(
          "John 9 — Jesus rejects the assumption that blindness proves personal or parental sin; USCCB Bible.",
          "https://bible.usccb.org/bible/john/9",
        ),
        source(
          "Luke 13 — victims of violence and accidental disaster are not declared worse sinners; USCCB Bible.",
          "https://bible.usccb.org/bible/luke/13",
        ),
        source(
          "James 1 — trials, perseverance, and the denial that God tempts anyone to evil; USCCB Bible.",
          "https://bible.usccb.org/bible/james/1",
        ),
        source(
          "Romans 8 — creation groans in decay while awaiting liberation and bodily redemption; NRSVUE at Bible Gateway.",
          "https://www.biblegateway.com/passage/?search=Romans%208%3A18-25&version=NRSVUE",
        ),
        source(
          "Revelation 21:1-4 — new creation and the end of death, mourning, and pain; NRSVUE at Bible Gateway.",
          "https://www.biblegateway.com/passage/?search=Revelation%2021%3A1-4&version=NRSVUE",
        ),
        source(
          "Quran 2:155-157 — believers tested through fear, hunger, and loss; Tafhim al-Quran translation.",
          "https://quran.com/2/155-157?translations=95",
        ),
        source(
          "Quran 3:185 — death and full recompense on the Day of Resurrection; Tafhim al-Quran translation.",
          "https://quran.com/3/185?translations=95",
        ),
        source(
          "Quran 4:40 — Allah wrongs no one by even an atom's weight; Tafhim al-Quran translation.",
          "https://quran.com/4/40?translations=95",
        ),
        source(
          "Quran 4:78-79 — divine decree, divine favor, and human moral causation; Tafhim al-Quran translation.",
          "https://quran.com/4/78-79?translations=95",
        ),
        source(
          "Quran 18:79-82 — Moses and wisdom initially hidden from the observer; Tafhim al-Quran translation.",
          "https://quran.com/18/79-82?translations=95",
        ),
        source(
          "Quran 21:35 — mortality and testing through good and ill; Tafhim al-Quran translation.",
          "https://quran.com/21/35?translations=95",
        ),
        source(
          "Quran 29:2-3 — belief does not exempt people from testing; Tafhim al-Quran translation.",
          "https://quran.com/29/2-3?translations=95",
        ),
        source(
          "Quran 30:41 — corruption on land and sea through human deeds; Tafhim al-Quran translation.",
          "https://quran.com/30/41?translations=95",
        ),
        source(
          "Quran 42:30 — misfortune, human deeds, and God's abundant forgiveness; Tafhim al-Quran translation.",
          "https://quran.com/42/30?translations=95",
        ),
        source(
          "Quran 67:2 — death and life as a test of deeds; Tafhim al-Quran translation.",
          "https://quran.com/67/2?translations=95",
        ),
        source(
          "Al-Tafsir al-Muyassar on Quran 21:35 — testing through commands, changing conditions, return, and recompense.",
          "https://quran.com/ar/21/35/tafsirs?tafsirId=16",
        ),
        source(
          "Al-Sa'di on Quran 2:155 — trials, truthfulness, patience, and moral formation.",
          "https://quran.com/ar/2/155/tafsirs?tafsirId=91",
        ),
        source(
          "Al-Tafsir al-Muyassar on Quran 30:41 — human corruption, consequences, and return.",
          "https://quran.com/ar/30/41/tafsirs?tafsirId=16",
        ),
        source(
          "Al-Sa'di on Quran 4:78-79 — divine decree together with human responsibility.",
          "https://quran.com/ar/4/78/tafsirs?tafsirId=91",
        ),
      ],
    },
    {
      _key: key(),
      _type: "sideNote",
      body: "Grounding note: Quran passages were discovered through quran.ai search_quran and then retrieved canonically through quran.ai fetch_translation in Sayyid Abul A'la Maududi's Tafhim al-Quran edition (en-al-maududi): 2:155-157, 3:185, 4:40, 4:78-79, 10:44, 18:79-82, 21:35, 29:2-3, 30:41, 42:30, and 67:2. Interpretive claims were checked through quran.ai fetch_tafsir using al-Tafsir al-Muyassar and Tafsir al-Sa'di. Tanakh passages were checked against JPS translations at Sefaria, and New Testament passages against the USCCB Bible and NRSVUE at Bible Gateway. Philosophical distinctions were checked against the Stanford Encyclopedia of Philosophy, Internet Encyclopedia of Philosophy, and the linked primary papers by Mackie and Rowe. The cumulative argument and comparative verdict are the author's synthesis, not a rabbinic ruling, church judgment, fatwa, or opinion from quran.ai, quran.com, or quran.foundation.",
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
