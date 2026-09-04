import {readFile} from 'node:fs/promises'
import {homedir} from 'node:os'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const taxonomyId = 'taxonomy-mathematical-miracles-of-the-quran'
const articleId = 'article-does-word-month-appear-12-times-in-quran'
const slug = 'does-word-month-appear-12-times-in-quran'

async function readEnvValue(path, name) {
  try {
    const contents = await readFile(path, 'utf8')
    const line = contents
      .split(/\r?\n/)
      .find((candidate) => candidate.trim().startsWith(`${name}=`))
    if (!line) return undefined
    return line.slice(line.indexOf('=') + 1).trim().replace(/^(["'])(.*)\1$/, '$2')
  } catch {
    return undefined
  }
}

async function resolveToken() {
  if (process.env.SANITY_WRITE_TOKEN) return process.env.SANITY_WRITE_TOKEN
  const envToken = await readEnvValue(join(scriptDir, '../../.env.local'), 'SANITY_WRITE_TOKEN')
  if (envToken) return envToken
  try {
    const session = JSON.parse(
      await readFile(join(homedir(), '.config', 'sanity', 'config.json'), 'utf8'),
    )
    return session.authToken
  } catch {
    return undefined
  }
}

let keyValue = 0
const key = (prefix = 'k') => `${prefix}${(++keyValue).toString(36)}`
const span = (text, marks = []) => ({_key: key('s'), _type: 'span', marks, text})
const block = (text, style = 'normal') => ({
  _key: key('b'),
  _type: 'block',
  style,
  markDefs: [],
  children: [span(text)],
})
const p = (text) => block(text)
const h2 = (text) => block(text, 'h2')
const h3 = (text) => block(text, 'h3')
const lead = (text) => ({_key: key('lead'), _type: 'lead', text})
const callout = (tone, title, body) => ({
  _key: key('callout'),
  _type: 'callout',
  tone,
  title,
  body,
})
const quranVerse = (translation, reference) => ({
  _key: key('quran'),
  _type: 'quranVerse',
  translation,
  reference,
})
const table = (caption, rows) => ({
  _key: key('table'),
  _type: 'table',
  caption,
  rows: rows.map((cells) => ({_key: key('row'), _type: 'row', cells})),
})
const stepList = (items) => ({_key: key('steps'), _type: 'stepList', items})
const sideNote = (body) => ({_key: key('note'), _type: 'sideNote', body})
const conclusion = (title, body, finalLine) => ({
  _key: key('conclusion'),
  _type: 'conclusionPanel',
  eyebrow: 'Conclusion',
  title,
  body,
  finalLine,
})
const source = (text, url) => ({_key: key('source'), text, url})
const sourceList = (title, items) => ({
  _key: key('sources'),
  _type: 'sourceList',
  title,
  items,
})

const taxonomy = {
  _id: taxonomyId,
  _type: 'taxonomy',
  title: 'Mathematical Miracles of the Quran',
  slug: {_type: 'slug', current: 'mathematical-miracles-of-the-quran'},
  description:
    'A transparent investigation of numerical patterns in the Quran—checking Arabic morphology, counting rules, textual context, and whether popular claims survive reproducible analysis.',
  kind: 'topic',
}

const article = {
  _id: articleId,
  _type: 'article',
  title: 'Does the Word “Month” Really Appear 12 Times in the Quran?',
  slug: {_type: 'slug', current: slug},
  description:
    'Does the Arabic word for month occur exactly 12 times in the Quran? A transparent, reproducible count of shahr, its plural forms, and its dual form.',
  taxonomies: [{_key: key('taxonomy'), _type: 'reference', _ref: taxonomyId}],
  body: [
    lead(
      'One of the best-known claims about mathematical patterns in the Quran is that the singular Arabic word for “month” appears exactly twelve times—the same number of months in a year. Unlike many viral word-count claims, this one survives a straightforward grammatical check. The complete result, however, is more precise than the slogan: the singular occurs twelve times, while all singular, dual, and plural forms together occur twenty-one times.',
    ),
    callout(
      'quran',
      'The verified result',
      'The Quranic Arabic lemma شَهْر (shahr) has 21 occurrences: 12 singular, 2 dual, and 7 plural. Therefore, “the singular word month occurs twelve times” is accurate. “The word month occurs only twelve times in every form” is not.',
    ),

    h2('What exactly are we counting?'),
    p(
      'Word-count claims can change depending on whether the researcher counts an exact spelling, a dictionary lemma, every word sharing a root, or only one grammatical form. Arabic also attaches articles and conjunctions to words. For example, al-shahr means “the month,” bil-shahr means “with or for the month,” and wal-shahr means “and the month.” These are still singular forms of the noun shahr.',
    ),
    p(
      'For a reproducible test, the relevant category is grammatical number. We begin with every occurrence assigned to the lemma شَهْر by the Quranic morphology data, and then separate those occurrences into singular, dual, and plural. The rule is stated before the result is interpreted; nothing is removed merely because it makes the total inconvenient.',
    ),
    table('Every grammatical form of شَهْر in the Quran', [
      ['Category', 'Arabic forms', 'Occurrences'],
      ['Singular', 'شَهْر and forms with attached prefixes or articles', '12'],
      ['Dual', 'شَهْرَيْن — two months', '2'],
      ['Plural', 'أَشْهُر and شُهُور — months', '7'],
      ['Complete lemma total', 'All of the above', '21'],
    ]),
    sideNote(
      'Method note: quran.ai’s concordance reports 21 occurrences of the lemma across 17 verses. Its word-level morphology identifies the root and lemma as شَهْر. The 12 figure is obtained by applying the ordinary singular-number category, not by deleting possessive forms or specially chosen verses.',
    ),

    h2('The twelve singular occurrences'),
    p(
      'The claim can be checked without trusting a graphic or a copied list. Below are all twelve singular tokens. Two verses contain the singular word twice, so twelve occurrences are distributed across ten verse locations.',
    ),
    table('Complete singular count', [
      ['#', 'Reference', 'Transliterated form', 'Immediate context'],
      ['1', 'Quran 2:185', 'shahru', 'The month of Ramadan'],
      ['2', 'Quran 2:185', 'al-shahra', 'Whoever witnesses the month'],
      ['3', 'Quran 2:194', 'al-shahru', 'The sacred month'],
      ['4', 'Quran 2:194', 'bil-shahri', 'The sacred month for the sacred month'],
      ['5', 'Quran 2:217', 'al-shahri', 'Fighting in the holy month'],
      ['6', 'Quran 5:2', 'al-shahra', 'The holy month'],
      ['7', 'Quran 5:97', 'wal-shahra', 'The holy month of Pilgrimage'],
      ['8', 'Quran 9:36', 'shahran', 'The reckoning of twelve months'],
      ['9', 'Quran 34:12', 'shahrun', 'A morning course of one month'],
      ['10', 'Quran 34:12', 'shahrun', 'An evening course of one month'],
      ['11', 'Quran 46:15', 'shahran', 'A period of thirty months'],
      ['12', 'Quran 97:3', 'shahrin', 'A thousand months'],
    ]),
    p(
      'This list includes definite and indefinite forms, different Arabic case endings, and attached prepositions or conjunctions. Those variations do not change the noun from singular to plural. The category is linguistically coherent from beginning to end.',
    ),

    h2('What about the other nine occurrences?'),
    h3('Two dual forms'),
    p(
      'The form شَهْرَيْن (shahrayn), meaning “two months,” occurs in Quran 4:92 and 58:4. Arabic has a dedicated dual number, so these are neither singular nor plural. Excluding them from a claim explicitly about the singular is ordinary grammar, not a hidden adjustment.',
    ),
    h3('Seven plural forms'),
    p(
      'Plural forms occur in Quran 2:197, 2:226, 2:234, 9:2, 9:5, 9:36, and 65:4. Six use a form of أَشْهُر (ashhur), while Quran 9:36 uses الشُّهُور (al-shuhur). Both mean “months,” and both belong in the plural category.',
    ),
    table('What the popular slogan leaves unstated', [
      ['Statement', 'Verdict', 'Reason'],
      ['“The singular noun shahr occurs 12 times.”', 'Accurate', 'The morphology produces 12 singular tokens.'],
      ['“All forms of the word month total 12.”', 'Inaccurate', 'The lemma total is 21 after dual and plural forms are included.'],
      ['“Twelve is reached by an arbitrary deletion.”', 'Not in this case', 'Grammatical singular is a standard, reproducible category.'],
      ['“The count by itself proves divine authorship.”', 'Not established by counting alone', 'A verified pattern and an argument about its cause are different claims.'],
    ]),

    h2('The Quran itself names twelve months'),
    quranVerse(
      "[9:36] Surely the reckoning of months, in the sight of Allah, is twelve months, laid down in Allah's decree on the day when He created the heavens and the earth; and out of these months four are sacred. That is the true ordainment. Do not, therefore, wrong yourselves, with respect to these months. And fight all together against those who associate others with Allah in His Divinity in the manner that they fight against you all together, and know well that Allah is with the God-fearing.",
      'Quran 9:36 · Translation: Tafhim al-Quran, Maulana Sayyid Abul A’la Maududi',
    ),
    p(
      'Quran 9:36 is especially relevant because it does not merely contain the singular noun in the phrase “twelve months.” It directly teaches that the divinely established reckoning contains twelve months. The numerical observation therefore places the singular word count beside an idea stated explicitly in the text.',
    ),
    callout(
      'reflection',
      'Pattern and meaning meet here',
      'The correspondence is not between two unrelated numbers pulled from distant subjects. The noun being counted is “month,” and the Quran explicitly states that the number of months is twelve. That thematic fit makes the observation more interesting than a bare numerical match.',
    ),

    h2('Is this a mathematical miracle?'),
    p(
      'The count is real. The further conclusion requires care. A verified pattern tells us what is present in the text; it does not, by itself, tell us how the pattern arose or whether it was deliberately encoded. Someone may regard the correspondence as a sign of deliberate composition. Someone else may regard twelve as an unsurprising coincidence, especially because the text openly discusses a twelve-month year.',
    ),
    p(
      'The strongest presentation does not exaggerate what the evidence can carry. It should say that the twelve-count is reproducible, grammatically consistent, and thematically connected to Quran 9:36. It should not claim that the number mathematically forces every reader to accept one explanation.',
    ),
    callout(
      'philosophy',
      'A pattern can be meaningful without becoming a standalone proof',
      'For a believer, textual structure may deepen wonder and attention. For an inquirer, it may provide a reason to investigate further. In either case, the Quran’s theological, moral, linguistic, and historical claims cannot be reduced to a single frequency count.',
    ),

    h2('A standard for testing future claims'),
    p(
      'This article begins a series examining popular mathematical claims about the Quran. Each claim should face the same test. A result is more trustworthy when another reader can reproduce it without being told which inconvenient forms to ignore.',
    ),
    stepList([
      'Define the counting unit before counting: spelling, stem, lemma, root, phrase, or grammatical form.',
      'Use a complete Arabic corpus rather than an English translation or search-engine result.',
      'Separate singular, dual, and plural forms explicitly.',
      'State how attached articles, conjunctions, prepositions, and pronouns are treated.',
      'Publish every included occurrence and disclose every excluded occurrence.',
      'Keep the verified count separate from the argument that the pattern was intentionally designed.',
    ]),
    p(
      'Under that standard, the month claim performs well. Its central wording only needs one important qualifier: the number twelve belongs to the singular noun, not to every form derived from the lemma.',
    ),

    conclusion(
      'Yes—the singular word “month” appears twelve times',
      'The quran.ai morphology data gives a transparent result: twelve singular occurrences of shahr, two dual occurrences, and seven plural occurrences. The singular count is stable under a normal grammatical rule and can be checked verse by verse. It is therefore fair to present it as a genuine numerical pattern, provided the article also discloses the complete lemma total of twenty-one.',
      'The observation is strongest when accuracy comes before amazement: twelve singular months, twenty-one forms in total, and no hidden subtraction needed.',
    ),
    sourceList('Sources and verification', [
      source(
        'quran.ai word concordance and morphology for the lemma شَهْر. Used for the 21-token total, grammatical breakdown, forms, and verse locations.',
        'https://quran.ai',
      ),
      source(
        'Quran 9:36 in Maududi’s Tafhim al-Quran translation, retrieved through quran.ai.',
        'https://quran.ai/9/36/translations/en-al-maududi',
      ),
      source(
        'Quranic Arabic Corpus dictionary entry for the root shīn-hā-rā. Used as an independently inspectable word-by-word concordance.',
        'https://corpus.quran.com/qurandictionary.jsp?q=%24hr',
      ),
    ]),
    sideNote(
      'Quran grounding note: the Maududi translation of Quran 9:36 and Maududi translations used to check the immediate contexts of the twelve singular occurrences were retrieved through quran.ai with fetch_translation(en-al-maududi). Counts and Arabic morphology were retrieved through quran.ai with fetch_word_concordance and fetch_word_morphology. The evaluation of whether this verified pattern demonstrates intentional design is applied reasoning beyond the fetched canonical text and does not constitute a scholarly ruling or an opinion from quran.ai, quran.com, or quran.foundation.',
    ),
  ],
}

const quranBlocks = article.body.filter((item) => item._type === 'quranVerse')
const allQuranText = quranBlocks.map((item) => item.translation).join('\n')
if (article.body.length < 25) {
  throw new Error(`Expected a substantive article; found ${article.body.length} blocks`)
}
if (quranBlocks.length !== 1) {
  throw new Error(`Expected one Quran block; found ${quranBlocks.length}`)
}
if (/<\/?(?:sup|span|p)\b/i.test(allQuranText)) {
  throw new Error('Quran translations contain unsanitized HTML')
}
if (
  quranBlocks.some(
    (item) =>
      !item.reference.includes('Maududi') ||
      !item.reference.includes('Tafhim al-Quran'),
  )
) {
  throw new Error('Every Quran block must identify Maududi and Tafhim al-Quran')
}

const summary = {
  documentId: article._id,
  slug: article.slug.current,
  title: article.title,
  bodyBlocks: article.body.length,
  quranBlocks: quranBlocks.length,
  taxonomyId,
  taxonomyTitle: taxonomy.title,
}

const publish = process.argv.includes('--publish')
if (!publish) {
  console.log(JSON.stringify({status: 'dry-run', ...summary}, null, 2))
  process.exit(0)
}

const token = await resolveToken()
if (!token) {
  throw new Error(
    'Missing SANITY_WRITE_TOKEN in apps/.env.local and no Sanity CLI session was found.',
  )
}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'dis8yhkz',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  apiVersion: '2026-09-04',
  useCdn: false,
  token,
})

const [duplicateArticleCount, duplicateTaxonomyCount] = await Promise.all([
  client.fetch(
    'count(*[_type == "article" && slug.current == $slug && _id != $articleId && !(_id in path("drafts.**"))])',
    {slug, articleId},
  ),
  client.fetch(
    'count(*[_type == "taxonomy" && slug.current == $taxonomySlug && _id != $taxonomyId && !(_id in path("drafts.**"))])',
    {taxonomySlug: taxonomy.slug.current, taxonomyId},
  ),
])

if (duplicateArticleCount > 0) {
  throw new Error(`Refusing to publish over ${duplicateArticleCount} article(s) using this slug`)
}
if (duplicateTaxonomyCount > 0) {
  throw new Error(
    `Refusing to publish over ${duplicateTaxonomyCount} taxonomy document(s) using this slug`,
  )
}

const result = await client
  .transaction()
  .createOrReplace(taxonomy)
  .delete(`drafts.${taxonomyId}`)
  .createOrReplace(article)
  .delete(`drafts.${articleId}`)
  .commit()

const published = await client.fetch(
  `{
    "taxonomy": *[_id == $taxonomyId][0]{_id,title,"slug":slug.current,description,kind},
    "article": *[_id == $articleId][0]{_id,title,"slug":slug.current,description,"taxonomyIds":taxonomies[]._ref,"bodyBlocks":count(body)}
  }`,
  {taxonomyId, articleId},
)

console.log(
  JSON.stringify(
    {status: 'published', ...summary, transactionId: result.transactionId, published},
    null,
    2,
  ),
)
