import { AUTHOR, SITE_NAME, SITE_URL } from "../../../lib/site";
import { getPostgresqlFeedArticles } from "../../../lib/sanity";
import type {
  PortableTextBlock,
  PortableTextSpan,
  TechArticle,
  TechBodyItem,
} from "../../../src/tech-article";

export const revalidate = 300;

const FEED_URL = `${SITE_URL}/feeds/postgresql.xml`;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function asCdata(value: string): string {
  return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function renderSpan(span: PortableTextSpan, block: PortableTextBlock): string {
  let value = escapeHtml(span.text);

  for (const mark of span.marks ?? []) {
    if (mark === "strong") {
      value = `<strong>${value}</strong>`;
      continue;
    }
    if (mark === "em") {
      value = `<em>${value}</em>`;
      continue;
    }
    if (mark === "code") {
      value = `<code>${value}</code>`;
      continue;
    }

    const definition = block.markDefs?.find((item) => item._key === mark);
    if (definition?._type === "link") {
      value = `<a href="${escapeHtml(definition.href)}">${value}</a>`;
    }
  }

  return value;
}

function renderBlock(block: PortableTextBlock): string {
  const content = block.children
    .map((span) => renderSpan(span, block))
    .join("");

  if (block.listItem) {
    return `<li>${content}</li>`;
  }

  switch (block.style) {
    case "h2":
      return `<h2>${content}</h2>`;
    case "h3":
      return `<h3>${content}</h3>`;
    case "blockquote":
      return `<blockquote>${content}</blockquote>`;
    default:
      return `<p>${content}</p>`;
  }
}

function renderBodyItem(item: TechBodyItem): string {
  if (item._type === "block") {
    return renderBlock(item);
  }
  if (item._type === "codeBlock") {
    const label = item.filename
      ? `<div><strong>${escapeHtml(item.filename)}</strong></div>`
      : "";
    return `${label}<pre><code>${escapeHtml(item.code)}</code></pre>`;
  }
  if (item._type === "techCallout") {
    return `<aside><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.body)}</p></aside>`;
  }
  return "";
}

function renderArticleHtml(article: TechArticle): string {
  const articleUrl = `${SITE_URL}/guides/${article.slug}`;
  const cover = article.coverImageUrl
    ? `<p><img src="${escapeHtml(article.coverImageUrl)}" alt="${escapeHtml(article.coverImageAlt ?? "")}" /></p>`
    : "";
  const body = article.body.map(renderBodyItem).join("\n");

  return [
    cover,
    `<p>${escapeHtml(article.description)}</p>`,
    body,
    `<p><a href="${articleUrl}">Read the canonical article on ${SITE_NAME}</a></p>`,
  ].join("\n");
}

function toRfc822(value?: string): string {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime())
    ? new Date().toUTCString()
    : date.toUTCString();
}

function renderItem(article: TechArticle): string {
  const articleUrl = `${SITE_URL}/guides/${article.slug}`;
  const categories = article.taxonomies ?? ["PostgreSQL"];

  return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <description>${escapeXml(article.description)}</description>
      <content:encoded>${asCdata(renderArticleHtml(article))}</content:encoded>
      <dc:creator>${escapeXml(AUTHOR.name)}</dc:creator>
      <pubDate>${toRfc822(article.publishedAt)}</pubDate>
${categories.map((category) => `      <category>${escapeXml(category)}</category>`).join("\n")}
    </item>`;
}

export async function GET() {
  const articles = await getPostgresqlFeedArticles();
  const lastBuildDate = toRfc822(
    articles[0]?.updatedAt ?? articles[0]?.publishedAt,
  );
  const items = articles.map(renderItem).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Dev Fieldnotes - PostgreSQL</title>
    <link>${SITE_URL}</link>
    <description>Practical PostgreSQL field guides by ${escapeXml(AUTHOR.name)}, covering permissions, application architecture, AI agents, MCP servers, and production safety.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Dev Fieldnotes</generator>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}