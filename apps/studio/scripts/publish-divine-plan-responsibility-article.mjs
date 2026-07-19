import {createReadStream} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname, resolve} from "node:path";
import sanityCli from "sanity/cli";

const here = dirname(fileURLToPath(import.meta.url));
const client = sanityCli.getCliClient({apiVersion: "2026-07-04"});
const key = (() => { let n = 0; return () => `dp${(++n).toString(36)}`; })();
const block = (text, style = "normal") => ({
  _key: key(), _type: "block", style, markDefs: [],
  children: [{_key: key(), _type: "span", marks: [], text}],
});
const verse = (translation, reference) => ({_key: key(), _type: "quranVerse", translation, reference});
const callout = (tone, title, body) => ({_key: key(), _type: "callout", tone, title, body});
const source = (text, url) => ({_key: key(), text, url});
const upload = async (filename, title) => client.assets.upload(
  "image",
  createReadStream(resolve(here, "../seed", filename)),
  {filename, title},
);

const [choiceImage, justiceImage] = await Promise.all([
  upload("divine-plan-human-choice.png", "Human choice within Allah's sovereign plan"),
  upload("responsibility-and-consequences.png", "Responsibility, justice, and consequences"),
]);

const article = {
  _id: "drafts.article-divine-plan-human-responsibility",
  _type: "article",
  title: "If Everything Is Part of Allah’s Plan, Are Humans Really Responsible?",
  slug: {_type: "slug", current: "if-everything-is-part-of-allahs-plan-are-humans-responsible"},
  description: "If Allah already knows and decrees what will happen, are our choices genuine? The Quran answers by affirming divine sovereignty, real human agency, and perfectly proportioned accountability together.",
  taxonomies: [{_key: key(), _type: "reference", _ref: "taxonomy-questioning-religion"}],
  body: [
    {_key: key(), _type: "lead", text: "If nothing escapes Allah’s knowledge and decree, it can seem that every human decision was fixed before we made it. If so, why praise the righteous, blame the wrongdoer, command repentance, or hold anyone accountable? The question is serious—but it rests on treating divine sovereignty and human choice as if only one can be real. The Quran affirms both."},
    callout("reflection", "The answer in one sentence", "Allah’s plan means that nothing occurs outside His knowledge, power, and permission; it does not mean that every voluntary human act is forced or morally approved by Him. We possess a genuine but dependent will, and Allah judges how we use the capacity He gives us."),

    block("Two truths the Quran refuses to separate", "h2"),
    block("The Quran does not solve the question by diminishing Allah’s sovereignty. Nor does it portray human beings as helpless puppets. Instead, it places two truths beside one another: people really will and choose, while their power to will exists only within the will of Allah."),
    verse("Verily this is an Exhortation; so let him who so will take a way to his Lord.", "Quran 76:29 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    verse("But your willing shall be of no avail until Allah Himself so wills. Surely Allah is All-Knowing, Most Wise.", "Quran 76:30 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    block("The first verse addresses the human will: whoever wishes may take the path to Allah. The next places that will inside Allah’s encompassing will. Al-Saʿdi explains that Allah makes truth and guidance clear and people respond to it, while their willing remains subordinate to His sovereign will. Human agency is real, but it is not independent or unlimited."),
    {_key: key(), _type: "imageBlock", asset: {_type: "reference", _ref: choiceImage._id}, alt: "A traveler standing before several roads beneath an ordered night sky and a distant sunrise", caption: "We do not choose the whole landscape of life, but we genuinely choose among paths placed within it."},

    block("Knowing a choice is not the same as forcing it", "h2"),
    block("Allah’s knowledge is complete: past, present, future, public, and hidden. But knowledge is not coercion. To know an action perfectly is not to compel the person who performs it. The choice does not become involuntary merely because Allah never lacked knowledge of it."),
    block("From our position inside time, we deliberate, intend, and act. Allah does not discover our decision after we make it; He eternally knows us and every circumstance without error. His knowledge corresponds perfectly to the choice we really make. We do not choose because Allah learned it; Allah knows the choice as it truly is."),
    callout("philosophy", "Avoid a misleading picture", "Divine foreknowledge is not Allah making an exceptionally accurate prediction and then trapping us inside it. Allah is not a limited observer waiting in time. His knowledge encompasses the whole reality He created, while our choices remain voluntary at the human level."),

    block("Permission is not approval", "h2"),
    block("Another confusion comes from assuming that if Allah permits an event to occur, He must morally approve it. The Quran distinguishes the two. Allah can allow disbelief within the test of earthly life while telling us that He does not approve disbelief."),
    verse("If you disbelieve, know well that Allah has no need of you. Yet He does not like unbelief in His servants. But if you are thankful, your thankfulness will please Him. No one shall bear another's burden. You are destined to return to your Lord and He will tell you what you used to do. He is well aware even of what lies hidden in your breasts.", "Quran 39:7 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    block("A lie may occur within the world Allah permits to continue, yet Allah commands truthfulness. Oppression may occur, yet Allah forbids injustice. Permission makes a meaningful moral test possible; it does not transform evil into good or transfer the wrongdoer’s intention to Allah."),
    {_key: key(), _type: "cardGrid", cards: [
      {_key: key(), title: "Allah knows", body: "No choice surprises Him, and no consequence lies outside His knowledge."},
      {_key: key(), title: "Allah permits", body: "Actions can occur within the life, powers, and circumstances He created."},
      {_key: key(), title: "Allah commands", body: "Revelation distinguishes what He loves from what He forbids."},
      {_key: key(), title: "Humans intend and act", body: "Moral responsibility attaches to the choice a person knowingly and willingly makes."},
    ]},

    block("Our freedom is real—but it is not absolute", "h2"),
    block("We do not choose our parents, birthplace, body, natural talents, every opportunity, other people’s actions, the laws of nature, or the moment of death. Even choices available to one person may be unavailable to another. Absolute independence belongs to no creature."),
    block("Yet limited freedom is still freedom. We recognize an immediate difference between raising an arm deliberately and having it lifted by someone else; between handing over money as a gift and surrendering it under threat; between a slip of the tongue and a calculated lie. Law, relationships, repentance, promises, and moral life all depend on this recognizable distinction between voluntary and compelled action."),
    callout("reflection", "Dependence does not erase agency", "A pen depends on the writer and has no will. A human being depends on Allah but has been given awareness, intention, and a bounded power to act. Creaturely agency is not divine independence; it is a real capacity created and sustained by Allah."),

    block("Why accountability is fair", "h2"),
    verse("Allah does not lay a responsibility on anyone beyond his capacity. In his favour shall be whatever good each one does, and against him whatever evil he does.", "Quran 2:286 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    block("Accountability is proportioned to capacity. Allah knows the information a person received, the pressures they endured, the intention behind an act, the alternatives genuinely available, and the limitations no other person can fully see. His judgment is not a crude tally detached from circumstance."),
    block("This is why Islamic moral judgment distinguishes intention from accident, knowledge from ignorance, and free action from compulsion. The existence of divine decree does not flatten these distinctions; Allah’s perfect knowledge makes perfectly just judgment possible."),
    {_key: key(), _type: "imageBlock", asset: {_type: "reference", _ref: justiceImage._id}, alt: "A balanced scale holding a growing seed and a broken dark object, surrounded by distinct human paths and consequences", caption: "Responsibility follows capacity, intention, and choice. No one is judged by a scale that ignores what Allah gave them or what they could bear."},

    block("Can destiny be used as an excuse for sin?", "h2"),
    block("The Quran records people attempting exactly that argument: if Allah had willed otherwise, they claimed, they would not have worshipped false gods. The response does not accept destiny as their defense."),
    verse("Those who associate others with Allah in His Divinity say: “Were Allah to will so, neither we nor our forefathers would have worshipped any other than Him, nor would we have prohibited anything without His command.” Their predecessors proffered similar excuses. Do the Messengers have any other duty but to plainly convey the Message?", "Quran 16:35 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    block("Al-Saʿdi and Al-Muyassar explain that Allah sent commands and prohibitions, gave people power and will, and made the truth clear through His messengers. Invoking decree after willingly rejecting that guidance is therefore not a valid excuse."),
    block("Al-Saʿdi adds a practical test: the person who excuses his own wrongdoing through destiny will not accept that excuse from someone who steals his property or harms him. We instinctively distinguish an act someone chose from an event forced upon them. Destiny is invoked selectively only when it seems useful for avoiding blame."),
    callout("warning", "Decree explains; it does not excuse", "We may speak about Allah’s decree when hardship strikes, because it reminds us that the event did not escape Him. We may not use the unseen decree to authorize a sin before committing it or erase responsibility afterward. Before acting, our duty is to obey; after sinning, our duty is to repent."),

    block("If Allah guides whom He wills, how can judgment be just?", "h2"),
    verse("Had Allah so willed, He would have made you all one single community. However, He lets go astray whomsoever He wills and shows the Right Way to whomsoever He wills. Surely you shall be called to account regarding what you did.", "Quran 16:93 · Translation: Tafhim al-Quran, Sayyid Abul A'la Maududi"),
    block("The same verse affirms Allah’s sovereignty and human accountability. Guidance is a gift from Allah, not an achievement that makes us independent of Him. Yet the Quran repeatedly connects guidance and misguidance with how people respond to truth: humility or arrogance, sincerity or evasion, gratitude or rejection."),
    block("We should therefore ask Allah for guidance, pursue the means He has given, and never assume our present state guarantees our end. Dependence on divine guidance is a reason for prayer and humility, not passivity."),

    block("Three common objections", "h2"),
    {_key: key(), _type: "stepList", items: [
      "“If Allah could stop evil, isn’t He responsible for it?” Allowing a moral arena is not the same as performing or approving every choice made within it. Temporary permission also does not mean injustice escapes final judgment.",
      "“Could I have chosen differently?” At the moment of decision, you act according to your own intention without access to the unseen decree. The relevant moral fact is that you were not compelled and recognized alternatives within your capacity.",
      "“Then why pray if everything is decreed?” Prayer, effort, advice, repentance, and changed decisions are themselves among the decreed means through which outcomes occur. Trust in Allah never eliminates action.",
    ]},

    block("How belief in decree should change us", "h2"),
    block("Correct belief in divine decree produces a balance. It prevents arrogance when we succeed, because our abilities and opportunities came from Allah. It prevents despair when hardship reaches us, because nothing escaped His knowledge. It prevents fatalism, because He commanded effort. And it prevents excuses for sin, because He gave us will, guidance, and a door of repentance."),
    {_key: key(), _type: "cardGrid", cards: [
      {_key: key(), title: "Before a decision", body: "Seek guidance, examine your intention, choose what Allah commands, and take the available means."},
      {_key: key(), title: "After doing good", body: "Thank Allah for enabling it rather than treating righteousness as self-created greatness."},
      {_key: key(), title: "After committing wrong", body: "Do not hide behind destiny. Admit the choice, repair the harm, seek forgiveness, and change course."},
      {_key: key(), title: "After hardship", body: "Act where action remains possible, then find patience in knowing the event never escaped Allah."},
    ]},

    {_key: key(), _type: "conclusionPanel", eyebrow: "Conclusion", title: "Allah’s sovereignty does not make human choices unreal.", body: "The Quran gives neither the creature absolute independence nor the sinner the excuse of helplessness. Allah knows, creates, sustains, permits, commands, guides, and judges. Within the life and capacity He grants, human beings intend, choose, and act. Our will is real precisely as a created and dependent will—not as a rival to Allah.", finalLine: "Divine decree should make us humble about what has happened, dependent on Allah for what lies ahead, and responsible for the choice directly before us."},
    {_key: key(), _type: "sourceList", title: "Quranic and tafsir sources", items: [
      source("Quran 76:29–30 in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation, with Al-Saʿdi and Al-Muyassar commentary, retrieved through quran.ai.", "https://quran.com/76/29-30"),
      source("Quran 2:286 in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation, with Al-Muyassar commentary, retrieved through quran.ai.", "https://quran.com/2/286"),
      source("Quran 16:35 in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation, with Al-Saʿdi and Al-Muyassar commentary, retrieved through quran.ai.", "https://quran.com/16/35"),
      source("Quran 16:93 and 39:7 in Sayyid Abul A'la Maududi’s Tafhim al-Quran translation, retrieved through quran.ai.", "https://quran.com/16/93"),
      source("Al-Saʿdi’s commentary on Quran 6:149 and 74:56 concerning created capacity, genuine human willing, and Allah’s encompassing will, retrieved through quran.ai.", "https://quran.com/6/149"),
    ]},
    {_key: key(), _type: "sideNote", body: "Grounded with quran.ai: Maududi translations for 2:286, 16:35, 16:93, 18:29, 39:7, 74:56, and 76:29–30; Al-Saʿdi and Al-Muyassar commentary on the principal passages. The philosophical explanations, examples, and synthesis in this article are applied reasoning beyond the fetched canonical texts. They are not a formal scholarly ruling or an opinion issued by quran.ai, quran.com, or quran.foundation."},
  ],
};

const result = await client.createOrReplace(article);
console.log(JSON.stringify({
  documentId: result._id,
  slug: result.slug.current,
  imageAssetIds: [choiceImage._id, justiceImage._id],
}, null, 2));
