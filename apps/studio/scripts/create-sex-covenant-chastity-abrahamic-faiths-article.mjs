import {readFile} from "node:fs/promises";
import {homedir} from "node:os";
import {join} from "node:path";
import {createClient} from "@sanity/client";

const session = JSON.parse(
  await readFile(join(homedir(), ".config", "sanity", "config.json"), "utf8"),
);

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "dis8yhkz",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  apiVersion: "2026-08-01",
  useCdn: false,
  token: session.authToken,
});

let sequence = 0;
const key = () => `chastity${(++sequence).toString(36)}`;
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
  _id: "drafts.article-sex-covenant-chastity-abrahamic-faiths",
  _type: "article",
  title: "Sex, Covenant, and Chastity: Why the Abrahamic Faiths Reserve Intimacy for Marriage",
  slug: {_type: "slug", current: "sex-covenant-chastity-abrahamic-faiths"},
  description:
    "Judaism, Christianity, and Islam treat sexual desire as real and meaningful, but refuse to let desire create its own permission: intimacy belongs within a recognized covenant of marriage, responsibility, and accountability before God.",
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
      text: "Two people may love each other deeply, feel certain about their future, and regard their relationship as private. The Abrahamic traditions still ask a harder question: has desire been joined to covenant, responsibility, fidelity, and accountability before God? Judaism, Christianity, and Islam do not formulate every sexual rule identically, but their historic mainstream teachings refuse to treat consent, attraction, or an intention to marry later as a substitute for marriage itself.",
    },
    callout(
      "reflection",
      "The shared moral center",
      "Sex is not presented as dirty or meaningless. It is presented as powerful. It joins bodies, creates vulnerability, may create children, reshapes families, and can leave one person carrying consequences after the other departs. The covenant is therefore meant to come before the intimacy, not after it.",
    ),

    block("First, define the claim carefully", "h2"),
    block(
      "A modern sentence such as 'all premarital sex is adultery' is too imprecise for a serious comparative article. In the Torah and traditional Jewish law, adultery has a narrower technical meaning connected especially to the marital status of the woman. Christianity often uses the broader category translated as sexual immorality. Islam uses zina for unlawful intercourse and develops its own distinctions in scripture and law. The terms overlap morally, but they are not interchangeable legal definitions.",
    ),
    block(
      "The more defensible shared conclusion is this: the historic mainstream of all three traditions reserves consensual sexual intercourse for a relationship recognized as lawful marriage within that tradition. Private promises, cohabitation, engagement, or the hope of marrying later do not independently create that status.",
    ),
    table("A shared boundary expressed through different categories", [
      ["Question", "Judaism", "Christianity", "Islam"],
      [
        "Governing category",
        "Kiddushin and marriage, prohibited relationships, family holiness, and covenantal duties.",
        "Marriage, one-flesh union, chastity, sanctification, and the body belonging to God.",
        "Nikah, chastity, guarding sexuality, and avoiding zina and the paths leading to it.",
      ],
      [
        "Traditional boundary",
        "Intercourse without marriage is prohibited, though not every case is technically adultery.",
        "Sexual intercourse is reserved for marriage; the unmarried are called to chastity.",
        "Those able to marry should marry; those unable to marry must remain chaste.",
      ],
      [
        "Positive purpose",
        "A sanctified household, fidelity, mutual duties, family continuity, and responsible intimacy.",
        "Faithful self-giving, one-flesh union, mutual marital duty, holiness, and family life.",
        "Lawful intimacy, tranquility, fidelity, lineage, family responsibility, and protection from zina.",
      ],
    ]),

    block("Judaism: intimacy belongs to covenant and responsibility", "h2"),
    block(
      "The Hebrew Bible does not begin with a theory of sex as something shameful. It begins with creation, companionship, and the formation of a new household. Genesis places one-flesh union inside a relationship described as husband and wife:",
    ),
    quote(
      "Hence a man leaves his father and mother and clings to his wife, so that they become one flesh.",
    ),
    block(
      "Genesis 2:24 does not reduce marriage to intercourse. Leaving, cleaving, and becoming one flesh describe a larger union of life. The sexual bond belongs to the establishment of a family relationship, rather than floating free as a private physical event.",
    ),

    block("The Torah does not treat seduction as consequence-free", "h3"),
    quote(
      "If a man seduces a virgin who is not betrothed, and lies with her; he must give the dowry to acquire her as his wife.",
    ),
    block(
      "Exodus 22:15-16 in Jewish verse numbering addresses consensual seduction of an unbetrothed woman. The man may not take intimacy and then disappear as though nothing happened. Financial and marital responsibility follow. The next verse permits refusal of the marriage, and later halakhic interpretation also recognizes the woman's ability to reject the man. Intercourse therefore does not automatically manufacture a marriage; it creates an injury and obligation that the law refuses to ignore.",
    ),
    block(
      "Deuteronomy 22 distinguishes marital infidelity, misconduct involving a betrothed woman, and coercive assault. In the case involving force, the woman is declared innocent. That distinction matters for any modern presentation: a victim of coercion must not be described as sharing the voluntary guilt of an offender.",
    ),

    block("From biblical categories to traditional halakhah", "h3"),
    block(
      "Traditional Jewish law gives marriage a defined status through kiddushin rather than leaving it to private feeling. Maimonides argues that intercourse motivated by desire without kiddushin is prohibited by the Torah. The Ra'avad and other authorities dispute his precise classification and the severity attached to it, but the commentary preserved with the text notes that both positions prohibit sexual relations outside marriage.",
    ),
    block(
      "This distinction prevents two opposite mistakes. Traditional Judaism does not say that every act between two unmarried people is technically adultery. It also does not conclude that whatever falls outside that narrow definition is therefore permitted. Marriage, prohibited relationships, family-purity law, consent, and mutual obligation together discipline sexual life.",
    ),
    callout(
      "insight",
      "Marriage does not erase every boundary",
      "In traditional Judaism, becoming married does not turn every sexual act, time, or manner into an automatic entitlement. Marital intimacy remains governed by family-purity law, mutual duties, restrictions on force, and the broader command to live with holiness.",
    ),

    block("Christianity: one flesh, bodily holiness, and marriage", "h2"),
    block(
      "Christianity inherits Genesis, the Torah's sexual prohibitions, and the prophetic concern for fidelity. Jesus returns to the creation account when teaching about marriage:",
    ),
    quote(
      "For this reason a man shall leave his father and his mother and be joined to his wife, and the two shall become one flesh.",
    ),
    block(
      "Matthew 19:4-6 places one-flesh union within the joining of husband and wife. The saying appears in a discussion of marital permanence, so the bond is more than momentary attraction or private desire.",
    ),

    block("Paul's argument: the body is not morally disposable", "h3"),
    block(
      "In 1 Corinthians 6:12-20, Paul confronts the idea that bodily appetite is morally insignificant. He applies Genesis 2:24 even to intercourse with a prostitute: the act still creates a one-body union, but now the bodily union has been torn away from covenant, holiness, and faithful responsibility.",
    ),
    quote(
      "Flee sexual immorality... you are not your own... therefore glorify God in your body.",
    ),
    block(
      "The Christian argument is not merely that unauthorized sex breaks a rule. The body belongs within the person's relationship to God. Sexual union says something with the body, and Christianity refuses to treat that bodily statement as meaningless simply because both people consented.",
    ),

    block("Marriage is the positive setting, not a reluctant exception", "h3"),
    block(
      "First Corinthians 7:2-9 directs sexual intimacy toward marriage: each man is to have his wife and each woman her husband. It also describes marital duty reciprocally. The husband and wife are each accountable to the other, and temporary abstinence is to be by agreement. Marriage is therefore not merely permission for one spouse; it creates mutual responsibility.",
    ),
    quote(
      "Marriage is to be held in honor among all, and the marriage bed is to be undefiled.",
    ),
    block(
      "Hebrews 13:4 distinguishes the honored marriage bed from sexual immorality and adultery. First Thessalonians 4:3-8 likewise calls believers to abstain from sexual immorality, practice self-control in holiness and honor, and avoid violating or exploiting another person in the matter.",
    ),
    block(
      "Catholic, Orthodox, and classical Protestant teaching retain this boundary. The Catholic Catechism calls engaged couples to continence and reserves specifically marital expressions of affection for marriage. The Orthodox Church in America teaches that unmarried people abstain from sexual relations. The Westminster Larger Catechism lists fornication among violations of the seventh commandment. A Lutheran Church-Missouri Synod explanation states explicitly that love, engagement, and an intention to marry later do not transform intercourse into marital intimacy.",
    ),

    block("Islam: do not approach zina", "h2"),
    block(
      "The Quran's most concise general command does not merely forbid the completed act. It commands distance from the path leading to it:",
    ),
    quran(
      "(viii) Do not even approach fornication for it is an outrageous act, and an evil way.",
      "Quran 17:32 - Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    block(
      "Muhammad Sayyid Tantawi's al-Tafsir al-Wasit defines zina here as intercourse without a lawful contract and explains that forbidding approach is an intensified warning because conduct near the boundary can lead to the act. Al-Qurtubi similarly says the wording is stronger than merely saying, 'Do not commit zina.' Both commentaries treat the verse as creating protective distance, not only a rule for the final moment.",
    ),

    block("Guarding sexuality begins before the act", "h3"),
    quran(
      "(O Prophet), enjoin believing men to cast down their looks and guard their private parts. That is purer for them. Surely Allah is well aware of all what they do.",
      "Quran 24:30 - Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    block(
      "The following verse gives believing women the corresponding commands to lower their gaze and guard their private parts, then concludes by calling all believers to repentance. The sequence places responsibility on men and women rather than making female reputation the entire burden of communal morality.",
    ),
    block(
      "The same passage then moves from restraint to a constructive response. Communities and guardians are told to help unmarried people marry, and those who lack the means are told to remain chaste:",
    ),
    quran(
      "Let those who cannot afford to marry keep themselves chaste until Allah enriches them out of His Bounty.",
      "Quran 24:33, opening sentence - Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    block(
      "Al-Tafsir al-Wasit describes the order of these commands as a moral program: lower the gaze, facilitate lawful marriage, and practice disciplined chastity when marriage is not presently possible. Poverty, delay, or difficulty may explain the struggle, but they do not privately create a new form of marriage.",
    ),

    block("The Prophetic response to desire", "h3"),
    block(
      "Sahih al-Bukhari 5066 reports that the Prophet Muhammad told young people who were able to marry to marry, because marriage helps lower the gaze and guard chastity. Those unable to marry were instructed to fast. The advice acknowledges desire without making desire sovereign: build the lawful covenant when able, and practice restraint when unable.",
    ),

    block("Historical honesty about the Quranic legal world", "h3"),
    quran(
      "who strictly guard their private parts save from their wives, or those whom their right hands possess; for with regard to them they are free from blame. As for those who seek beyond that, they are transgressors.",
      "Quran 23:5-7 - Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    block(
      "The verse names wives and, within the Quran's historical slaveholding society, women held in bondage. Both al-Wasit and al-Qurtubi preserve that classical reading. It would therefore be inaccurate to claim that the Quran's original legal world was expressed only through the modern sentence 'monogamous marriage or nothing.' It would be equally inaccurate to turn an extinct slaveholding category into permission for an informal modern relationship. The history should be acknowledged rather than hidden or repurposed.",
    ),

    block("Consequences do not authorize accusation or vigilantism", "h3"),
    block(
      "Quran 24:2 treats zina as a serious public offense within the Quranic legal order. Yet the passage immediately protects people from unproved accusations:",
    ),
    quran(
      "Those who accuse honourable women (of unchastity) but do not produce four witnesses, flog them with eighty lashes, and do not admit their testimony ever after. They are indeed transgressors,",
      "Quran 24:4 - Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    block(
      "The evidentiary warning belongs beside the sexual prohibition. Religious seriousness cannot become permission for rumors, surveillance, public humiliation, selective accusations against women, or private punishment. Ancient legal penalties are matters of legal systems and qualified jurisprudence, not instructions for individuals to harm others.",
    ),

    block("Consent and coercion must remain distinct", "h2"),
    block(
      "A discussion of sex before marriage can become morally distorted if it treats every sexual event as equally voluntary. The Torah explicitly distinguishes force from consensual misconduct and declares the assaulted woman innocent. The Catholic Catechism calls rape an intrinsically evil violation of justice, freedom, and integrity. Quran 24:33 condemns forcing enslaved women into prostitution, and al-Wasit says the forgiveness in the verse is for the coerced women while their exploiters face accountability.",
    ),
    callout(
      "warning",
      "Do not use chastity to blame victims",
      "A person subjected to force, abuse, trafficking, blackmail, or exploitation is not morally interchangeable with the person who chose and imposed the act. Protecting chastity requires confronting coercion, not protecting the reputation of the coercer.",
    ),
    block(
      "Marriage itself should not be described as unlimited ownership of another body. The traditions' historical legal discussions are complex and should not be flattened into a modern slogan. What can be said here is that the marriage boundary does not eliminate the separate moral questions of consent, harm, mutual duty, and protection from abuse.",
    ),

    block("Why covenant must precede intimacy", "h2"),
    block("1. Desire cannot create its own permission", "h3"),
    block(
      "All three traditions recognize sexual desire as powerful. Precisely because it is powerful, the person experiencing it cannot be the only judge of what it permits. Covenant subjects desire to duties that remain when emotion changes.",
    ),
    block("2. Private promises are easy to abandon", "h3"),
    block(
      "A couple may sincerely intend to marry, but intention does not yet establish the public rights, duties, witnesses, family recognition, and legal-spiritual accountability created by marriage. The boundary asks commitment to become real before the most vulnerable form of intimacy.",
    ),
    block("3. Sex can create unequal consequences", "h3"),
    block(
      "Pregnancy, social stigma, economic dependence, emotional injury, disease, and abandonment do not always fall equally on both people. Torah legislation concerning seduction refuses to let the man enjoy the act while leaving the woman and her family with every consequence. The broader ethical principle is responsibility before gratification.",
    ),
    block("4. Children and lineage are not afterthoughts", "h3"),
    block(
      "The traditions arose in societies where kinship, inheritance, paternal obligation, and communal belonging had immediate consequences. Modern technology changes some circumstances but does not remove the child's need for responsibility, truth, provision, and stable care.",
    ),
    block("5. Fidelity must be more than a feeling", "h3"),
    block(
      "Marriage turns an emotional promise into a recognized covenant. The one-flesh language of Genesis and Christianity, the Jewish structure of kiddushin, and the Islamic structure of nikah all refuse to let the deepest bodily union rest only on an unrecorded private assurance.",
    ),
    block("6. Restraint is part of spiritual freedom", "h3"),
    block(
      "Modern culture often defines freedom as satisfying a consenting desire. The Abrahamic disciplines define freedom partly as the ability not to be ruled by appetite: lowering the gaze, avoiding occasions of wrongdoing, fasting, practicing chastity, and waiting until commitment is established.",
    ),

    block("Repentance: a boundary is not a sentence of permanent shame", "h2"),
    block(
      "Religious communities can speak so harshly about sexual sin that a person begins to believe return is impossible. That conclusion contradicts the traditions' own teachings about repentance.",
    ),
    block(
      "Maimonides describes teshuvah as abandoning the sin, regretting the past, resolving not to return to it, and confessing before God. Christianity combines the command to flee sexual immorality with restoration: in 1 Corinthians 6:11, Paul reminds believers that some had lived in the sins he named but were washed and sanctified; 1 John 1:9 promises cleansing to those who confess.",
    ),
    quran(
      "unless he repents and believes and does righteous works. For such, Allah will change their evil deeds into good deeds. Allah is Ever Forgiving, Most Compassionate. Whosoever repents and does good, he returns to Allah in the manner that he should.",
      "Quran 25:70-71 - Tafhim al-Quran, Sayyid Abul A'la al-Maududi",
    ),
    block(
      "Al-Wasit describes this as sincere repentance joined to changed conduct. Ibn Kathir presents two early explanations of the transformed deeds: the repentant person replaces wrongdoing with obedience, and the former sins may themselves be transformed through sincere repentance. The moral demand remains serious, but shame is not allowed to close the door that God has left open.",
    ),
    callout(
      "reflection",
      "Communities must embody the repentance they preach",
      "If God permits return, a community should not make permanent social exile its unofficial doctrine. Repentance does not erase every earthly consequence, but neither should a past sin become a license for endless humiliation, gossip, or exclusion.",
    ),

    block("Where the traditions converge - and where they do not", "h2"),
    table("Shared principles and real differences", [
      ["Question", "Shared direction", "Necessary qualification"],
      [
        "Is mutual desire enough?",
        "No. Desire and consent do not independently create a lawful sexual relationship.",
        "Consent remains necessary for ethical intimacy, but it is not the only religious requirement.",
      ],
      [
        "Is engagement already marriage?",
        "No. An intention or promise to marry does not replace the recognized covenant.",
        "The formal requirements of marriage differ among Jewish, Christian, and Muslim communities.",
      ],
      [
        "Is every case called adultery?",
        "All three reject sexual wrongdoing outside the lawful boundary.",
        "Adultery, fornication, prohibited intercourse, and zina are not identical technical categories.",
      ],
      [
        "Does marriage make sex morally automatic?",
        "No. Marriage carries duties of fidelity, dignity, and responsibility.",
        "The traditions have different historical teachings about marital rights, consent, family purity, and permissible acts.",
      ],
      [
        "What about coercion?",
        "A victim must not be equated with a voluntary offender.",
        "The legal treatment of assault developed differently, and difficult ancient texts require careful contextual study.",
      ],
      [
        "Can a person return after sexual sin?",
        "Yes. Judaism, Christianity, and Islam all preserve paths of repentance and changed life.",
        "Their doctrines of forgiveness, atonement, grace, and legal consequence are not identical.",
      ],
    ]),

    block("What this teaching should produce", "h2"),
    block(
      "If this subject produces only fear, suspicion, and control of women, it has been presented badly. A faithful sexual ethic should make communities more responsible: families who help young adults marry rather than placing needless obstacles before them; men and women who practice the same honesty; protection for people facing coercion; truthful teaching about bodies and desire; confidential pastoral care; and real routes back for those who repent.",
    ),
    block(
      "It should also resist two opposite reductions. Sex is not a meaningless recreational act whose morality is exhausted by consent. Nor is sex a contaminating substance that permanently destroys the worth of a person. The first view makes covenant unnecessary; the second makes repentance meaningless. The Abrahamic framework treats intimacy as morally weighty while still treating the human being as capable of return.",
    ),
    {
      _key: key(),
      _type: "conclusionPanel",
      eyebrow: "Conclusion",
      title: "Covenant before intimacy; responsibility before desire.",
      body: "Judaism places one-flesh union within marriage and makes seduction answerable to responsibility. Christianity joins bodily holiness, one-flesh union, and the honored marriage bed. Islam forbids approaching zina, commands men and women to guard chastity, encourages marriage, and tells those unable to marry to remain chaste. The words and legal systems differ, but the shared challenge is unmistakable: desire cannot be allowed to promise less than the body gives.",
      finalLine: "Before the intimacy, establish the covenant. After failure, seek repentance rather than despair. In every case, remember that the person before you remains accountable to - and worthy of justice before - the one Creator.",
    },
    {
      _key: key(),
      _type: "sourceList",
      title: "Scripture, commentary, and representative religious teaching",
      items: [
        source("Genesis 2:24 - husband, wife, cleaving, and one flesh.", "https://www.sefaria.org/Genesis.2.24?lang=bi"),
        source("Exodus 22:15-16 - seduction, bride-price, marriage responsibility, and refusal.", "https://lite.sefaria.org/book/exodus/chapter/22"),
        source("Exodus 22:15 with halakhic sources - the woman's and father's ability to refuse marriage.", "https://www.sefaria.org/Exodus.22.15?with=Halakhah"),
        source("Deuteronomy 22:25-27 - coercion distinguished from voluntary wrongdoing.", "https://www.sefaria.org/Deuteronomy.22.25-27?lang=bi"),
        source("Mishneh Torah, Marriage 1:1-4 - kiddushin and Maimonides' ruling on intercourse without marriage.", "https://www.sefaria.org/Mishneh_Torah%2C_Marriage.1.1?lang=en"),
        source("Mishneh Torah, Repentance 2:2-3 - abandonment, regret, resolve, and confession.", "https://www.sefaria.org/Mishneh_Torah%2C_Repentance.2"),
        source("Chabad - a traditional Jewish overview of sexuality, marriage, and family purity.", "https://www.chabad.org/library/article_cdo/aid/465153/jewish/Jewish-Sexuality-The-Intimate-Component-in-Love-and-Marriage.htm"),
        source("Matthew 19:4-6 - Jesus cites Genesis on marriage and one flesh (NASB).", "https://www.biblegateway.com/passage/?search=Matthew+19%3A4-6&version=NASB"),
        source("1 Corinthians 6:11-20 - restoration, bodily holiness, one flesh, and sexual immorality (NASB).", "https://www.biblegateway.com/passage/?search=1+Corinthians+6%3A11-20&version=NASB"),
        source("1 Corinthians 7:2-9 - marriage, mutual marital duty, agreement, and self-control (NASB).", "https://www.biblegateway.com/passage/?search=1+Corinthians+7%3A2-9&version=NASB"),
        source("1 Thessalonians 4:3-8 - sanctification, sexual restraint, honor, and avoiding exploitation (NASB).", "https://www.biblegateway.com/passage/?search=1+Thessalonians+4%3A3-8&version=NASB"),
        source("Hebrews 13:4 - honor marriage and keep the marriage bed undefiled (NASB).", "https://www.biblegateway.com/passage/?search=Hebrews+13%3A4&version=NASB"),
        source("1 John 1:9 - confession, forgiveness, and cleansing (NASB).", "https://www.biblegateway.com/passage/?search=1+John+1%3A9&version=NASB"),
        source("Catholic Catechism 2350-2356 - engagement, fornication, chastity, and rape.", "https://www.vatican.va/content/catechism/en/part_three/section_two/chapter_two/article_6/ii_the_vocation_to_chastity.html"),
        source("Orthodox Church in America - sexuality, marriage, and chastity in the single life.", "https://www.oca.org/orthodoxy/the-orthodox-faith/spirituality/sexuality-marriage-and-family/sexuality"),
        source("Westminster Larger Catechism 138-139 - chastity and the seventh commandment.", "https://opc.org/lc.html"),
        source("Lutheran Church-Missouri Synod - engagement and sex before marriage.", "https://www.lcms.org/about/beliefs/faqs/lcms-views?DeliveryChannelID=3F6B7EA0-73E8-462B-A075-DE89431816A4"),
        source("Quran 17:32 - do not approach zina; Tafhim al-Quran translation.", "https://quran.com/17/32?translations=95"),
        source("Quran 23:5-7 - guarding sexuality and the historical lawful categories; Tafhim al-Quran translation.", "https://quran.com/23/5-7?translations=95"),
        source("Quran 24:2-4 - zina and protection against unsupported accusations; Tafhim al-Quran translation.", "https://quran.com/24/2-4?translations=95"),
        source("Quran 24:30-33 - the gaze, chastity, marriage, restraint, and coercion; Tafhim al-Quran translation.", "https://quran.com/24/30-33?translations=95"),
        source("Quran 25:68-71 - sexual sin, repentance, and transformed deeds; Tafhim al-Quran translation.", "https://quran.com/25/68-71?translations=95"),
        source("Al-Tafsir al-Wasit on Quran 17:32 - zina and the intensified command not to approach it.", "https://quran.com/ar/17/32/tafsirs?tafsirId=93"),
        source("Al-Qurtubi on Quran 17:32 - the wording is stronger than a prohibition of the final act alone.", "https://quran.com/ar/17/32/tafsirs?tafsirId=90"),
        source("Al-Tafsir al-Wasit on Quran 24:33 - chastity when marriage is unavailable and protection of coerced women.", "https://quran.com/ar/24/33/tafsirs?tafsirId=93"),
        source("Al-Tafsir al-Wasit on Quran 23:5-7 - classical lawful categories and the boundary beyond them.", "https://quran.com/ar/23/5/tafsirs?tafsirId=93"),
        source("Al-Tafsir al-Wasit on Quran 25:70 - sincere repentance and changed conduct.", "https://quran.com/ar/25/70/tafsirs?tafsirId=93"),
        source("Ibn Kathir on Quran 25:70-71 - repentance and explanations of transformed deeds.", "https://quran.com/ar/25/70/tafsirs?tafsirId=14"),
        source("Sahih al-Bukhari 5066 - marry if able; fast if unable.", "https://sunnah.com/bukhari/67/4"),
      ],
    },
    {
      _key: key(),
      _type: "sideNote",
      body: "Grounding note: Quran passages were discovered with quran.ai search_quran and retrieved with fetch_translation in Sayyid Abul A'la al-Maududi's Tafhim al-Quran edition (en-al-maududi): 17:32, 23:5-7, 24:2-4, 24:30-33, and 25:68-71. Interpretation was checked through quran.ai fetch_tafsir using al-Tafsir al-Wasit, al-Qurtubi, and Ibn Kathir. Inline translation footnote markers were removed for display, and the opening sentence of 24:33 is clearly identified as an excerpt. Jewish and Christian texts were checked against Sefaria/JPS, the NASB, and the representative institutional sources listed above. The cross-faith comparison and contemporary ethical synthesis are the author's analysis, not a rabbinic ruling, church judgment, fatwa, or opinion from quran.ai, quran.com, or quran.foundation.",
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
