import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.resolve(__dirname, "..");
const defaultInput = "C:\\Users\\amyas\\Downloads\\why-does-anything-exist.html";
const inputPath = process.argv[2] ?? defaultInput;
const outputPath =
  process.argv[3] ??
  path.join(studioRoot, "seed", "does-the-universe-point-to-god.ndjson");
let keyIndex = 0;

const html = await readFile(inputPath, "utf8");
const title = "Does the Universe Point to God?";
const slug = "does-the-universe-point-to-god";
const description =
  attrFrom(matchFirst(html, /<meta\s+name="description"\s+content="([^"]+)"/i)) ||
  "A deep-dive into what modern science reveals about cosmic existence, the philosophical case for a Creator, and the Quranic answer to why we exist.";
const body = buildBody(extractBetween(html, "<main>", "</main>"), extractBetween(html, '<footer id="sources">', "</footer>"));

const taxonomy = {
  _id: "taxonomy-questioning-religion",
  _type: "taxonomy",
  title: "Questioning Religion",
  slug: { _type: "slug", current: "questioning-religion" },
  description: "A path for honest questions about God, meaning, revelation, and Islam.",
};

const article = {
  _id: "article-why-does-anything-exist",
  _type: "article",
  title,
  slug: { _type: "slug", current: slug },
  description,
  taxonomies: [
    {
      _key: key(),
      _type: "reference",
      _ref: taxonomy._id,
    },
  ],
  body,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(taxonomy)}\n${JSON.stringify(article)}\n`);

console.log(`Wrote ${outputPath}`);
console.log("Import with:");
console.log(`pnpm --filter @guiding-light/studio sanity dataset import "${outputPath}" production --replace`);

function buildBody(mainHtml, footerHtml) {
  const blocks = [];
  let cursor = 0;

  while (cursor < mainHtml.length) {
    const next = findNextKnownBlock(mainHtml, cursor);

    if (!next) {
      break;
    }

    const { start, kind, tag } = next;
    cursor = start;

    if (kind === "conclusion") {
      const end = findBalancedEnd(mainHtml, start, "section");
      blocks.push(parseConclusion(mainHtml.slice(start, end)));
      cursor = end;
      continue;
    }

    if (tag === "p" || tag === "h2" || tag === "h3") {
      const end = mainHtml.indexOf(`</${tag}>`, start);

      if (end === -1) {
        cursor += 1;
        continue;
      }

      const raw = mainHtml.slice(start, end + tag.length + 3);
      const block = parseTextBlock(raw, tag);

      if (block) {
        blocks.push(block);
      }

      cursor = end + tag.length + 3;
      continue;
    }

    const end = findBalancedEnd(mainHtml, start, tag);
    const raw = mainHtml.slice(start, end);
    const block = parseCustomBlock(raw, kind);

    if (block) {
      blocks.push(block);
    }

    cursor = end;
  }

  blocks.push(...parseFooter(footerHtml));

  return blocks.filter(Boolean);
}

function findNextKnownBlock(source, offset) {
  const candidates = [
    { kind: "toc", tag: "nav", token: '<nav class="toc"' },
    { kind: "figure", tag: "figure", token: '<figure class="figure"' },
    { kind: "callout", tag: "div", token: '<div class="callout' },
    { kind: "cardGrid", tag: "div", token: '<div class="split"' },
    { kind: "stepList", tag: "div", token: '<div class="argument"' },
    { kind: "quranVerse", tag: "div", token: '<div class="verse"' },
    { kind: "conclusion", tag: "section", token: '<section class="conclusion"' },
    { kind: "paragraph", tag: "p", token: "<p" },
    { kind: "h2", tag: "h2", token: "<h2" },
    { kind: "h3", tag: "h3", token: "<h3" },
  ]
    .map((candidate) => ({ ...candidate, start: source.indexOf(candidate.token, offset) }))
    .filter((candidate) => candidate.start >= 0)
    .sort((a, b) => a.start - b.start);

  return candidates[0] ?? null;
}

function parseTextBlock(raw, tag) {
  const className = attrFrom(matchFirst(raw, /class="([^"]+)"/i));
  const text = textFrom(raw);

  if (!text) {
    return null;
  }

  if (className.includes("lede")) {
    return {
      _key: key(),
      _type: "lead",
      text,
    };
  }

  if (className.includes("caveat")) {
    return {
      _key: key(),
      _type: "sideNote",
      body: text,
    };
  }

  return portableBlock(tag === "p" ? "normal" : tag, text);
}

function parseCustomBlock(raw, kind) {
  switch (kind) {
    case "toc":
      return parseTableOfContents(raw);
    case "figure":
      return parseFigure(raw);
    case "callout":
      return parseCallout(raw);
    case "cardGrid":
      return parseCardGrid(raw);
    case "stepList":
      return parseStepList(raw);
    case "quranVerse":
      return parseQuranVerse(raw);
    default:
      return null;
  }
}

function parseTableOfContents(raw) {
  const items = [...raw.matchAll(/<a\s+href="#([^"]+)">([\s\S]*?)<\/a>/gi)].map(
    ([, anchor, label]) => ({
      _key: key(),
      label: textFrom(label),
      anchor,
    }),
  );

  return items.length > 0
    ? {
        _key: key(),
        _type: "tableOfContents",
        items,
      }
    : null;
}

function parseFigure(raw) {
  const svg = matchFirst(raw, /(<svg[\s\S]*?<\/svg>)/i);
  const caption = textFrom(matchFirst(raw, /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i));
  const alt = attrFrom(matchFirst(svg ?? "", /aria-label="([^"]+)"/i)) || caption || "Article illustration";

  return svg
    ? {
        _key: key(),
        _type: "svgFigure",
        alt,
        svg: svg.trim(),
        caption,
      }
    : null;
}

function parseCallout(raw) {
  const className = attrFrom(matchFirst(raw, /class="([^"]+)"/i));
  const title = textFrom(matchFirst(raw, /<strong[^>]*>([\s\S]*?)<\/strong>/i));
  const body = textFrom(raw.replace(/<strong[^>]*>[\s\S]*?<\/strong>/i, ""));

  return {
    _key: key(),
    _type: "callout",
    tone: className.includes("science")
      ? "science"
      : className.includes("philosophy")
        ? "philosophy"
        : className.includes("quran")
          ? "quran"
          : "reflection",
    title,
    body,
  };
}

function parseCardGrid(raw) {
  const cards = [...raw.matchAll(/<div class="mini-card">([\s\S]*?)<\/div>/gi)].map(
    ([, card]) => ({
      _key: key(),
      title: textFrom(matchFirst(card, /<h3[^>]*>([\s\S]*?)<\/h3>/i)),
      body: textFrom(matchFirst(card, /<p[^>]*>([\s\S]*?)<\/p>/i)),
    }),
  );

  return cards.length > 0
    ? {
        _key: key(),
        _type: "cardGrid",
        cards,
      }
    : null;
}

function parseStepList(raw) {
  const inner = raw.replace(/^<div class="argument">/i, "").replace(/<\/div>\s*$/i, "");
  const items = [...inner.matchAll(/<div[^>]*>([\s\S]*?)<\/div>/gi)]
    .map(([, item]) => textFrom(item))
    .filter(Boolean);

  return items.length > 0
    ? {
        _key: key(),
        _type: "stepList",
        items,
      }
    : null;
}

function parseQuranVerse(raw) {
  return {
    _key: key(),
    _type: "quranVerse",
    arabic: textFrom(matchFirst(raw, /<div class="arabic"[^>]*>([\s\S]*?)<\/div>/i)),
    translation: textFrom(matchFirst(raw, /<div class="translation"[^>]*>([\s\S]*?)<\/div>/i)),
    reference: textFrom(matchFirst(raw, /<div class="ref"[^>]*>([\s\S]*?)<\/div>/i)),
  };
}

function parseConclusion(raw) {
  return {
    _key: key(),
    _type: "conclusionPanel",
    eyebrow: textFrom(matchFirst(raw, /<div class="section-kicker"[^>]*>([\s\S]*?)<\/div>/i)),
    title: textFrom(matchFirst(raw, /<h2[^>]*>([\s\S]*?)<\/h2>/i)),
    body: textFrom(matchFirst(raw, /<p class="lede"[^>]*>([\s\S]*?)<\/p>/i)),
    finalLine: textFrom(matchFirst(raw, /<p class="final-line"[^>]*>([\s\S]*?)<\/p>/i)),
  };
}

function parseFooter(raw) {
  const blocks = [];
  const scientificSources = [...raw.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(([, item]) => {
    const url = attrFrom(matchFirst(item, /<a\s+href="([^"]+)"/i));
    return {
      _key: key(),
      text: textFrom(item),
      url,
    };
  });

  if (scientificSources.length > 0) {
    blocks.push({
      _key: key(),
      _type: "sourceList",
      title: "Scientific sources and further reading",
      items: scientificSources,
    });
  }

  const quranGrounding = textFrom(matchFirst(raw, /<p class="grounding"[^>]*>([\s\S]*?)<\/p>/i));

  if (quranGrounding) {
    blocks.push({
      _key: key(),
      _type: "sideNote",
      body: quranGrounding,
    });
  }

  return blocks;
}

function portableBlock(style, text) {
  return {
    _key: key(),
    _type: "block",
    style,
    markDefs: [],
    children: [
      {
        _key: key(),
        _type: "span",
        marks: [],
        text,
      },
    ],
  };
}

function findBalancedEnd(source, start, tagName) {
  const tag = tagName.toLowerCase();
  const tokenPattern = new RegExp(`<\\/?${tag}(?=\\s|>|/)`, "gi");
  tokenPattern.lastIndex = start;

  let depth = 0;
  let match;

  while ((match = tokenPattern.exec(source))) {
    const isClosing = source[match.index + 1] === "/";

    if (isClosing) {
      depth -= 1;
      if (depth === 0) {
        const close = source.indexOf(">", match.index);
        return close === -1 ? source.length : close + 1;
      }
    } else {
      depth += 1;
    }
  }

  return source.length;
}

function extractBetween(source, startToken, endToken) {
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken, start + startToken.length);

  if (start === -1 || end === -1) {
    return "";
  }

  return source.slice(start + startToken.length, end);
}

function matchFirst(source, pattern) {
  return source.match(pattern)?.[1] ?? "";
}

function attrFrom(value) {
  return decodeEntities(value ?? "").trim();
}

function textFrom(htmlFragment) {
  return decodeEntities(
    (htmlFragment ?? "")
      .replace(/<sup>[\s\S]*?<\/sup>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " "),
  ).trim();
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number.parseInt(number, 10)));
}

function key() {
  keyIndex += 1;
  return `k${keyIndex.toString(36)}`;
}
