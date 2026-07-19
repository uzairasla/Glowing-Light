import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  Clock3,
  ExternalLink,
  Menu,
  ShieldAlert,
  X,
  Zap,
} from "lucide-react";
import { Fragment, useState } from "react";
import type {
  PortableTextBlock,
  PortableTextSpan,
  TechArticle,
  TechBodyItem,
} from "./tech-article";
import "./article.css";

const articlePath = "/guides/sanity-content-not-updating-nextjs";

function CodeBlock({
  label,
  tone = "neutral",
  children,
}: {
  label: string;
  tone?: "bad" | "good" | "neutral";
  children: string;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return (
    <figure className={`code-block ${tone}`}>
      <figcaption>
        <span>{label}</span>
        <button onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </figcaption>
      <pre>
        <code>{children}</code>
      </pre>
    </figure>
  );
}

function ArticleHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="topbar article-topbar">
      <a className="brand" href="/" aria-label="Fieldnotes home">
        <span className="brand-mark" aria-hidden="true">
          F<span>/</span>N
        </span>
        <span>FIELDNOTES</span>
      </a>
      <nav className={open ? "nav open" : "nav"} aria-label="Main navigation">
        <a href="/#guides">Guides</a>
        <a href="/#templates">Templates</a>
        <a href="/#about">About</a>
      </nav>
      <button
        className="menu-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}

function spanContent(span: PortableTextSpan, block: PortableTextBlock) {
  let content: React.ReactNode = span.text;
  for (const mark of span.marks ?? []) {
    if (mark === "strong") content = <strong>{content}</strong>;
    else if (mark === "em") content = <em>{content}</em>;
    else if (mark === "code") content = <code>{content}</code>;
    else {
      const definition = block.markDefs?.find((item) => item._key === mark);
      if (definition?._type === "link")
        content = (
          <a href={definition.href} target="_blank" rel="noreferrer">
            {content}
          </a>
        );
    }
  }
  return <Fragment key={span._key}>{content}</Fragment>;
}

function blockText(block: PortableTextBlock) {
  return block.children.map((span) => span.text).join("");
}

function sectionId(block: PortableTextBlock) {
  return blockText(block)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function BodyItem({ item }: { item: TechBodyItem }) {
  if (item._type === "codeBlock")
    return (
      <CodeBlock label={item.filename || item.language} tone={item.tone}>
        {item.code}
      </CodeBlock>
    );
  if (item._type === "techCallout") {
    const Icon =
      item.tone === "warning"
        ? ShieldAlert
        : item.tone === "tip"
          ? Zap
          : ClipboardCheck;
    return (
      <div className={`callout ${item.tone ?? "note"}`}>
        <Icon />
        <div>
          <strong>{item.title}</strong>
          <p>{item.body}</p>
        </div>
      </div>
    );
  }
  const children = item.children.map((span) => spanContent(span, item));
  if (item.style === "h2") return <h2 id={sectionId(item)}>{children}</h2>;
  if (item.style === "h3") return <h3>{children}</h3>;
  if (item.style === "blockquote") return <blockquote>{children}</blockquote>;
  if (item.listItem) return <li>{children}</li>;
  return <p>{children}</p>;
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function SanityUpdatingArticle({ article }: { article: TechArticle }) {
  const headings = article.body.filter(
    (item): item is PortableTextBlock =>
      item._type === "block" && item.style === "h2",
  );
  return (
    <div className="site-shell article-site">
      <ArticleHeader />
      <main>
        <header className="article-hero">
          <div className="article-kicker">
            <span>{article.kicker || "Field guide"}</span>
            <span>
              {article.updatedAt
                ? `Updated ${formatDate(article.updatedAt)}`
                : ""}
            </span>
          </div>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.description}</p>
          <div className="article-meta">
            <span>
              <Clock3 size={15} /> {article.readTime || "18 min"} read
            </span>
            <span>{article.taxonomies?.join(" � ")}</span>
          </div>
        </header>
        {article.coverImageUrl && (
          <figure className="cover-figure">
            <img
              src={article.coverImageUrl}
              alt={article.coverImageAlt || ""}
            />
          </figure>
        )}
        <div className="article-layout">
          <aside className="article-toc">
            <span>In this guide</span>
            {headings.map((heading) => (
              <a key={heading._key} href={`#${sectionId(heading)}`}>
                {blockText(heading)}
              </a>
            ))}
          </aside>
          <article className="article-content">
            {article.body.map((item) => (
              <BodyItem key={item._key} item={item} />
            ))}
            {!!article.sourceUrls?.length && (
              <section className="sources">
                <div className="section-label">Sources & further reading</div>
                {article.sourceUrls.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {source.title}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </section>
            )}
            <nav className="article-end-nav" aria-label="Article navigation">
              <a href="/">
                <ArrowLeft size={17} /> Back to all guides
              </a>
              <a href="/#templates">
                Explore field-tested templates <ArrowRight size={17} />
              </a>
            </nav>
          </article>
        </div>
      </main>
      <footer className="article-footer">
        <span>FIELDNOTES</span>
        <small>Practical guides for technical work.</small>
        <a href={articlePath}>Copy article link</a>
      </footer>
    </div>
  );
}
