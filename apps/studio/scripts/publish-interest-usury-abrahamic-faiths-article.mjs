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
const key = () => "interest" + (++sequence).toString(36);
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
  _id: "drafts.article-interest-usury-abrahamic-faiths",
  _type: "article",
  title: "When Debt Becomes Exploitation: Interest and Usury Across the Abrahamic Faiths",
  slug: {_type: "slug", current: "interest-usury-abrahamic-faiths"},
  description:
    "The Torah, New Testament, Quran, and centuries of Jewish, Christian, and Muslim reflection warn against turning another person's need into guaranteed profit.",
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
      text: "A person needs food, rent, medicine, seed, or time. Another person has money. What happens next is not merely financial: it reveals whether need will be met with mercy or converted into leverage. Judaism, Christianity, and Islam do not formulate every lending rule identically, but all three preserve a powerful warning against wealth that grows by burdening someone already vulnerable.",
    },
    callout(
      "reflection",
      "The shared moral center",
      "Money should serve human life. When a creditor's return is protected while the borrower carries the hardship, delay, and risk, a loan can cease to be help and become extraction. The three traditions repeatedly answer that danger with restraint, generosity, relief for debtors, and accountability before God.",
    ),
    block("First, define the words", "h2"),
    block(
      "Modern English often uses interest for the price of borrowing money and usury for an excessive or illegal rate. That is not how the words always functioned historically. For many Jewish, Christian, and Muslim authorities, the forbidden increase was not limited to a spectacular rate. The moral and legal question was whether a lender could demand an increase because time had passed on a debt.",
    ),
    block(
      "The Hebrew Bible uses terms commonly rendered as advance interest and accrued interest. Jewish law calls prohibited interest ribbit. Christian writers used the Latin usura for gain claimed on a loan, although Christian thought gradually distinguished a bare loan from investment, risk, loss, and legitimate expenses. The Quran prohibits riba, an unlawful increase whose clearest historical form included enlarging a debt when a struggling borrower needed more time.",
    ),
    callout(
      "insight",
      "Similarity does not require pretending the rules are identical",
      "The Torah's explicit legal prohibition is covenantal and distinguishes fellow Israelites from foreigners. Christian traditions developed several definitions of usury. Islamic law has its own categories and commercial rules. An honest comparison preserves those differences while recognizing the ethical pattern they share.",
    ),
    block("Judaism: do not turn poverty into a source of gain", "h2"),
    block(
      "The Torah introduces lending in the setting of poverty, not in a theory of abstract finance. The first concern is how a person with power treats a neighbor in need:",
    ),
    quote("Do not act toward them as a creditor; exact no interest from them."),
    block(
      "Exodus 22:24 addresses a loan to the poor among God's people. The lender is forbidden to behave as though financial power erases fraternity. The wording places the borrower's humanity before the creditor's opportunity.",
    ),
    block("Leviticus makes the purpose still clearer:", "h3"),
    quote("Do not lend your money at advance interest, nor give your food at accrued interest."),
    block(
      "This command appears in Leviticus 25:35-37 after a fellow member of the community has fallen into difficulty. The creditor must help that person remain alive alongside the community. Food and money cannot become instruments for deepening distress.",
    ),
    block("The covenantal boundary must also be stated honestly", "h3"),
    block(
      "Deuteronomy 23:20-21 forbids deducting interest from loans to fellow Israelites but permits it in loans to foreigners. The text therefore does not present the legal rule as a universal ban in precisely the later Islamic form. Yet within the covenant community it establishes a radical economic principle: a brother or sister's need must not become a guaranteed stream of profit.",
    ),
    block(
      "The prophets and wisdom writings then make interest part of a larger portrait of justice. Ezekiel 18 joins refusing interest to feeding the hungry, clothing the naked, returning a pledge, and avoiding oppression. Psalm 15 includes the person who does not lend at interest among those fit to dwell in God's presence. Interest is not treated as an isolated banking technicality; it sits beside the moral treatment of the weak.",
    ),
    block("Jewish law and the heter iska", "h3"),
    block(
      "Rabbinic law developed detailed safeguards around ribbit in transactions between Jews. Jewish communities also built gemachim, free-loan funds that help people meet emergencies, marry, study, or establish a livelihood without converting assistance into profit.",
    ),
    block(
      "Modern commerce created another question: how can capital fund a productive enterprise without disguising an interest-bearing loan? The heter iska restructures the relationship as an investment partnership. The provider of capital shares in profit under specified conditions instead of standing only as a creditor entitled to an increase. Its forms and validity are technical matters for qualified rabbinic guidance, but its moral architecture matters: return should be connected to enterprise and risk, not merely to the debtor's passing time.",
    ),
    block("Christianity: inherited prohibition, radical generosity", "h2"),
    block(
      "Christian scripture includes the Torah, prophets, and Psalms, so the earlier warnings were part of the church's Bible from the beginning. The New Testament does not provide a new commercial code or use one single verse to define every loan. It intensifies the disciple's duty toward the person who asks for help.",
    ),
    quote("Give to him who asks of you, and do not turn away from him who wants to borrow from you."),
    block(
      "In Matthew 5:42, Jesus moves the lender away from calculation and toward openhandedness. Luke 6:34-35 presses further: lending only when repayment is expected does not distinguish a disciple's mercy; Jesus commands his hearers to do good and lend without making return the condition of love.",
    ),
    block(
      "This teaching does not make planning, repayment, or every commercial investment immoral. It does expose the spiritual danger of helping only when help is profitable. A borrower is first a neighbor, not a revenue opportunity.",
    ),
    block("What about Jesus' parables mentioning bankers and interest?", "h3"),
    block(
      "Matthew 25:27 and Luke 19:23 use depositing money with bankers as part of parables about servants, masters, responsibility, and judgment. A parable can use a familiar practice without endorsing every feature of that practice. The master in the story is not a complete lending ethic. Clear commands about mercy and the Bible's direct warnings about interest must interpret the moral question; an incidental detail in a parable should not erase them.",
    ),
    block("The church once prohibited usury. What changed?", "h2"),
    block(
      "The short answer is that commercial life changed, legal categories multiplied, and Christian authorities gradually separated exploitative gain on a bare loan from compensation attached to cost, loss, risk, or productive partnership. Practice often moved faster than doctrine. The result was not one official day when the church declared usury good.",
    ),
    table("A compressed history of Christian teaching on lending", [
      ["Date", "Development", "Why it matters"],
      [
        "325",
        "Nicaea I, canon 17, ordered clergy who took usury for gain to be deposed.",
        "The earliest ecumenical legislation was explicit, although this canon directly governed clergy rather than every lay contract.",
      ],
      [
        "1179",
        "Lateran III, canon 25, denied notorious usurers altar communion and Christian burial if they remained in the practice.",
        "By the high Middle Ages the condemnation was public, severe, and applied beyond clergy.",
      ],
      [
        "1311-1312",
        "The Council of Vienne ordered persistent defense of usury as morally innocent to be treated as heresy.",
        "The prohibition was not a minor medieval preference; it carried doctrinal and legal force.",
      ],
      [
        "13th century",
        "Thomas Aquinas argued that charging simply for the use of money in a loan makes the borrower pay for what is effectively the same thing twice.",
        "His argument was about commutative justice, not merely compassion or a legal rate ceiling.",
      ],
      [
        "1515",
        "Lateran V approved montes pietatis that charged moderately and only to cover real operating expenses, without profit to the institution.",
        "Cost recovery could be distinguished from profit claimed merely because a loan existed.",
      ],
      [
        "1545 onward",
        "John Calvin and other Reformers allowed limited interest in some commercial settings while retaining protections for the poor and demands of equity.",
        "A universal-looking rule increasingly became a moral distinction between legitimate return and oppressive usury.",
      ],
      [
        "Modern teaching",
        "Catholic social doctrine accepts equitable profit but still condemns usury and abusive financial systems.",
        "The language changed; the duty not to profit by destroying human life did not disappear.",
      ],
    ]),
    block("Why the prohibition slowly lost control of ordinary finance", "h3"),
    block(
      "Medieval trade required capital across distance and time. Merchants faced real risks: ships sank, currencies moved, partners defaulted, and a lender could suffer an actual loss. Lawyers and theologians developed legitimate titles that could justify compensation for certain losses, costs, delay caused by default, or exposure to risk. Partnership and rent-like contracts also produced returns without being classified as a simple loan.",
    ),
    block(
      "Charitable lending institutions demonstrated that administering credit itself costs money. Lateran V's approval of moderate expense recovery by the montes pietatis was a narrow distinction, but an important one. The moral question was no longer expressed only as 'Was more repaid than was lent?' It also became 'What is the additional payment for?'",
    ),
    block(
      "The Reformation accelerated the shift. Calvin rejected an indiscriminate permission to charge whatever the market would bear. He continued to forbid exploiting poor borrowers and required equity and obedience to civil limits. Yet his willingness to permit some commercial interest helped normalize the interest-usury distinction in Protestant settings.",
    ),
    block(
      "Civil law then treated capped interest as enforceable. England's 1545 statute, for example, permitted lending up to a legal ceiling of ten percent; later repeal and reinstatement show that this was contested, not an instant consensus. Expanding state debt, long-distance trade, joint enterprise, banking, and eventually industrial production made credit foundational to European economies. Once courts, governments, merchants, and households were organized around interest-bearing obligations, the older blanket prohibition became increasingly difficult to enforce.",
    ),
    block(
      "By 1745, Pope Benedict XIV's Vix Pervenit still insisted that a lender may not demand an increase merely because a loan was made. At the same time, it acknowledged that other legitimate titles or contracts might justify payment. That combination explains modern Catholic teaching more accurately than saying the church reversed itself: usury remains condemned, while not every financial return is classified as usury.",
    ),
    callout(
      "warning",
      "Do not turn this history into an antisemitic story",
      "Christian Europe often restricted Jewish residence and occupations, pushed many Jews toward commerce or moneylending, relied on their services, and then used the same role to stigmatize them. Most Jews were not wealthy financiers. The history of interest must never be used to revive myths about Jewish greed or control of banking.",
    ),
    block("Islam: trade is lawful, riba is not", "h2"),
    block(
      "The Quran gives its most concentrated treatment of riba in a connected passage in Surah al-Baqarah. It first rejects the claim that trade and riba are morally interchangeable:",
    ),
    quran(
      "As for those who devour interest, they behave as the one whom Satan has confounded with his touch. Seized in this state they say: “Buying and selling is but a kind of interest,” even though Allah has made buying and selling lawful, and interest unlawful.",
      "Quran 2:275 — Tafhim al-Quran (Maududi)",
    ),
    block(
      "The distinction is structural. Trade links return to goods, services, ownership, and commercial risk. Riba in a debt claims an increase from the debtor because money was owed over time. Classical Quranic commentary describes the pre-Islamic pattern in stark terms: when payment came due, a creditor would demand payment or an increase in exchange for more time.",
    ),
    quran(
      "Believers! Have fear of Allah and give up all outstanding interest if you do truly believe.",
      "Quran 2:278 — Tafhim al-Quran (Maududi)",
    ),
    quran(
      "But if you fail to do so, then be warned of war from Allah and His Messenger. If you repent even now, you have the right of the return of your capital; neither will you do wrong nor will you be wronged.",
      "Quran 2:279 — Tafhim al-Quran (Maududi)",
    ),
    block(
      "Verse 2:279 states the governing balance with unusual precision. The lender retains the principal, so repentance does not confiscate what was actually provided. The borrower is freed from the increase, so the lender does not profit merely from the debt. Justice protects both sides: neither inflicting wrong nor suffering wrong.",
    ),
    quran(
      "But if the debtor is in straitened circumstance, let him have respite until the time of ease; and whatever you remit by way of charity is better for you, if only you know.",
      "Quran 2:280 — Tafhim al-Quran (Maududi)",
    ),
    block(
      "The next verse prevents the prohibition from becoming only a contract rule. When a debtor is in hardship, the creditor must grant time; voluntary forgiveness is better still. The Quran replaces the old demand to pay or increase with patience and charity.",
    ),
    block("Not only spectacular or multiplied rates", "h3"),
    quran(
      "Believers! Do not swallow interest, doubled and redoubled, and be mindful of Allah so that you may attain true success.",
      "Quran 3:130 — Tafhim al-Quran (Maududi)",
    ),
    block(
      "Major exegetical treatments explain 'doubled and redoubled' as a description of a common debt spiral, not permission for a smaller guaranteed increase. Repeated extensions could multiply the obligation until the borrower had repaid the original amount in fees yet remained trapped by principal and further charges.",
    ),
    block(
      "Quran 4:161 also condemns earlier communities for taking interest after it had been prohibited and immediately joins that conduct to consuming people's wealth wrongfully. The Quran therefore presents the warning as part of a moral continuity, not an isolated rule without precedent.",
    ),
    block("The Prophetic warning", "h3"),
    block(
      "Sahih Muslim 1598 reports that the Prophet Muhammad condemned the recipient of riba, the payer, the recorder, and its two witnesses, saying that they were alike. The warning reaches beyond one greedy lender to the network that records, verifies, and normalizes the transaction. It makes unjust finance a systemic moral responsibility.",
    ),
    callout(
      "insight",
      "An interpretive note",
      "Quran 30:39 contrasts an increase sought through riba with giving for God's pleasure, but early commentators differed over whether that verse refers to legally prohibited riba or to gifts given in hope of a larger return. The direct legal case should rest primarily on Quran 2:275-280, 3:130, and 4:161.",
    ),
    block("Where the three traditions converge", "h2"),
    table("Shared principles and real differences", [
      ["Question", "Judaism", "Christianity", "Islam"],
      [
        "Core scriptural concern",
        "A needy member of the covenant community must be sustained, not burdened for gain.",
        "The inherited biblical prohibition is joined to Jesus' demand for openhanded lending and love beyond reciprocity.",
        "Trade is lawful, riba is unlawful, principal is protected, and a distressed debtor receives time.",
      ],
      [
        "Traditional prohibited category",
        "Ribbit, especially interest within loans between Jews, governed by detailed rabbinic law.",
        "Usury, historically often gain claimed simply from a loan; later traditions distinguish legitimate titles and excessive or exploitative interest.",
        "Riba, including a stipulated increase on debt in mainstream Islamic jurisprudence, with additional rules for certain exchanges.",
      ],
      [
        "Constructive alternative",
        "Free loans, charity, and properly structured investment partnership such as heter iska.",
        "Generous lending, debt relief, charitable credit, cost recovery, and returns tied to legitimate risk or enterprise.",
        "Charity, zakah, benevolent loans, respite, forgiveness, trade, leasing, and risk-sharing investment.",
      ],
      [
        "Important difference",
        "The Torah explicitly distinguishes fellow Israelites from foreigners.",
        "Churches do not share one contemporary definition of every permissible interest charge.",
        "The prohibition is stated categorically in the Quran and developed extensively in Islamic law.",
      ],
    ]),
    block("Why interest can become ethically destructive", "h2"),
    block("1. Need weakens bargaining power", "h3"),
    block(
      "Someone borrowing for an emergency does not negotiate like an investor choosing among opportunities. Hunger, eviction, illness, or a utility shutoff can make formal consent real in law but deeply constrained in life. A lender who prices desperation as though both sides were equally free mistakes a signature for moral equality.",
    ),
    block("2. Time becomes a penalty", "h3"),
    block(
      "A struggling debtor needs time precisely because money is scarce. If every extension enlarges the obligation, the thing needed for recovery becomes the mechanism of punishment. Quran 2:280 reverses that logic: hardship calls for time, not a larger claim.",
    ),
    block("3. Return can be separated from responsibility", "h3"),
    block(
      "In a one-sided debt, the borrower may bear business failure, unemployment, illness, depreciation, and changing prices while the creditor's contractual return continues to accrue. Judaism's heter iska and Islamic risk-sharing models try, in different ways, to connect return to participation in enterprise rather than to guaranteed growth detached from outcome.",
    ),
    block("4. Compounding transfers wealth upward", "h3"),
    block(
      "When fees or interest are financed by new borrowing, money moves repeatedly from people with the least liquidity to institutions or people with the most. The arithmetic can remain legal and transparent while the result becomes morally grotesque: a borrower pays again and again yet does not escape the original need.",
    ),
    block(
      "A United States Consumer Financial Protection Bureau study found that more than four out of five payday loans were rolled over or followed by another loan within fourteen days. That statistic does not prove that every interest-bearing loan is equally harmful. It does show how a product built around short-term need can become a revolving door of fees rather than a bridge out of crisis.",
    ),
    block("5. Debt can govern the person, not merely the payment", "h3"),
    block(
      "Unpayable debt affects housing, marriage, health, education, work choices, and the ability to leave abuse. It can produce shame and social isolation. This is why the scriptures place lending beside food, clothing, pledges, charity, and justice: the creditor's claim can reach into the debtor's whole life.",
    ),
    block("6. A legal rate can still violate the moral purpose", "h3"),
    block(
      "Law asks what may be enforced. Faith also asks what kind of person and society a transaction creates. A charge can fall below a statutory ceiling and still exploit ignorance, conceal the true cost, target desperation, or make repayment practically impossible. The deepest Abrahamic test is not only 'Is this permitted?' but 'Am I helping a person stand, or profiting because the person cannot?'",
    ),
    block("Does this mean every modern charge is exactly the same?", "h2"),
    block(
      "No. A mortgage, a business investment, an inflation adjustment, a credit-card balance, a payday rollover, and an emergency loan between neighbors do not have the same purpose, risk, collateral, power relationship, or consequence. Jewish, Christian, and Muslim authorities classify them differently, and Muslims themselves should seek qualified guidance for a specific product rather than relying on a broad article.",
    ),
    block(
      "But complexity must not become moral anesthesia. Modern vocabulary can hide the oldest pattern: a powerful party advances money, shields itself from meaningful risk, and grows its claim because a weaker party cannot pay on time. Calling the increase a fee, service, penalty, or product does not settle whether it is just.",
    ),
    callout(
      "reflection",
      "A practical test",
      "Ask what the lender earns, what risk the lender actually bears, what happens when the borrower suffers, whether the total cost is understandable, whether repayment is realistically possible, and whether the arrangement restores independence or feeds repeat dependence.",
    ),
    block("What a more faithful credit culture would build", "h2"),
    block(
      "The shared tradition is not only a prohibition. It points toward institutions that make mercy durable:",
    ),
    block(
      "Interest-free emergency and community loan funds can prevent a temporary crisis from becoming years of repayment. Transparent cost recovery can keep a charitable institution operating without making distress its source of profit. Grace periods and realistic restructuring can give a debtor room to recover. Debt forgiveness can recognize when insisting on the full legal claim would destroy the person. Profit-and-loss partnership can connect return to genuine enterprise and shared risk. Strong disclosure, rate caps, affordability checks, and insolvency protections can restrain predatory products even within a conventional financial system.",
    ),
    block(
      "These models are not interchangeable, and none removes every possibility of abuse. They do share one direction: capital must be accountable to justice. Financial ingenuity should be measured by how well it funds useful activity and protects human dignity, not only by how reliably it extracts a return.",
    ),
    {
      _key: key(),
      _type: "conclusionPanel",
      eyebrow: "Conclusion",
      title: "The question is not only whether money grew, but how it grew.",
      body: "The Torah commands that a struggling neighbor be sustained without interest. Jesus teaches generosity that does not make repayment the measure of love. The early and medieval church treated usury as a grave sin before later distinguishing a bare loan from legitimate cost, risk, and enterprise. The Quran separates lawful trade from riba, protects principal, commands respite for hardship, and praises forgiveness.",
      finalLine: "Across their differences, the Abrahamic faiths ask the creditor to see a soul before a balance. Wealth is a trust, need is not permission to exploit, and every contract remains answerable to the one Creator.",
    },
    {
      _key: key(),
      _type: "sourceList",
      title: "Scripture, legal tradition, history, and evidence",
      items: [
        source("Exodus 22:24 — no interest from the poor among God's people.", "https://www.sefaria.org/Exodus.22.24"),
        source("Leviticus 25:35-37 — sustain the person in difficulty; do not exact interest.", "https://www.sefaria.org/Leviticus.25.35-37"),
        source("Deuteronomy 23:20-21 — the covenantal interest rule and its foreigner distinction.", "https://www.sefaria.org/Deuteronomy.23.20-21"),
        source("Ezekiel 18:7-9 — refusing interest within a portrait of justice.", "https://www.sefaria.org/Ezekiel.18.7-9"),
        source("Psalm 15:5 — lending without interest among the traits of the upright.", "https://www.sefaria.org/Psalms.15.5"),
        source("Chabad — moneylending, ribbit, free loans, and heter iska in Jewish law.", "https://www.chabad.org/library/article_cdo/aid/4108763/jewish/Moneylending-and-Jewish-Law.htm"),
        source("Jewish Law — the partnership structure of heter iska.", "https://www.jlaw.com/Articles/heter1.html"),
        source("Matthew 5:42 — Jesus' instruction concerning one who asks to borrow.", "https://www.biblegateway.com/passage/?search=Matthew%205%3A42&version=NASB"),
        source("Luke 6:34-35 — lend and do good beyond ordinary reciprocity.", "https://www.biblegateway.com/passage/?search=Luke%206%3A34-35&version=NASB"),
        source("Nicaea I, canon 17 — clergy and usury.", "https://en.wikisource.org/wiki/Nicene_and_Post-Nicene_Fathers%3A_Series_II/Volume_XIV/The_First_Ecumenical_Council/Canons/Canon_XVII"),
        source("Lateran III, canon 25 — penalties for notorious usurers.", "https://www.intratext.com/IXT/ENG0064/_P2.HTM"),
        source("Thomas Aquinas, Summa Theologiae II-II, question 78 — the justice argument against usury.", "https://www.newadvent.org/summa/3078.htm"),
        source("Lateran V, session 10 — montes pietatis and recovery of actual expenses.", "https://lendhopingnothing.wordpress.com/fifth-lateran-council-session-10-excerpt-1515/"),
        source("Pope Benedict XIV, Vix Pervenit — usury, loans, and other legitimate titles.", "https://www.newadvent.org/library/docs_be14vp.htm"),
        source("Vatican Compendium of the Social Doctrine of the Church, section 341 — equitable profit and usury.", "https://www.vatican.va/roman_curia/pontifical_councils/justpeace/documents/rc_pc_justpeace_doc_20060526_compendio-dott-soc_en.html"),
        source("Calvin Theological Journal — Calvin's 1545 ethics of usury.", "https://www.calvin.edu/library/database/crcpi/fulltext/ctj/88050.pdf"),
        source("United States Holocaust Memorial Museum — economic antisemitism and occupational restrictions.", "https://encyclopedia.ushmm.org/content/en/article/antisemitism"),
        source("Quran 2:275-280 — trade, riba, principal, debtor respite, and forgiveness.", "https://quran.com/2/275-280?translations=95"),
        source("Quran 3:130 — the prohibition of multiplied riba.", "https://quran.com/3/130?translations=95"),
        source("Quran 4:161 — interest joined to consuming wealth wrongfully.", "https://quran.com/4/161?translations=95"),
        source("Sahih Muslim 1598 — the recipient, payer, recorder, and witnesses of riba.", "https://sunnah.com/muslim:1598"),
        source("Consumer Financial Protection Bureau — repeat borrowing in payday-loan sequences.", "https://www.consumerfinance.gov/archive/newsroom/cfpb-finds-four-out-of-five-payday-loans-are-rolled-over-or-renewed/"),
      ],
    },
    {
      _key: key(),
      _type: "sideNote",
      body: "Grounding note: Quran quotations were retrieved from quran.ai in Sayyid Abul A'la Maududi's Tafhim al-Quran translation (en-al-maududi): Quran 2:275-280, 3:130, 4:161, and 30:39. Interpretive synthesis was checked against Tafsir al-Qurtubi, Tafsir al-Sa'di, and al-Tafsir al-Wasit through quran.ai. Hebrew Bible quotations were checked in the JPS Tanakh served by Sefaria, and New Testament quotations were checked in the NASB. Historical claims were checked against council texts, Aquinas, Vix Pervenit, current Vatican social teaching, and academic historical work. Comparative and ethical conclusions are the author's synthesis, not a fatwa, halakhic ruling, individualized financial advice, or the official position of every Jewish, Christian, or Muslim community.",
    },
  ],
};

const publish = process.argv.includes("--publish");

if (publish) {
  const publishedId = article._id.replace(/^drafts\./, "");
  const result = await client
    .transaction()
    .createOrReplace({...article, _id: publishedId})
    .delete(article._id)
    .commit();
  console.log(JSON.stringify({
    documentId: publishedId,
    slug: article.slug.current,
    status: "published",
    transactionId: result.transactionId,
  }, null, 2));
} else {
  const result = await client.createOrReplace(article);
  console.log(JSON.stringify({
    documentId: result._id,
    slug: result.slug.current,
    status: "draft",
  }, null, 2));
}
