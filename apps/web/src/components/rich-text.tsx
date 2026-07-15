import type { ReactNode } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { RichTextBlock } from "@/lib/content";
import { cn } from "@/lib/utils";

type RichTextProps = {
  value: RichTextBlock[];
  className?: string;
};

type LinkValue = {
  href?: string;
};

type ImageBlockValue = {
  assetUrl?: string;
  alt?: string;
  caption?: string;
};

type IframeValue = {
  url?: string;
  title?: string;
  height?: number;
};

type TableValue = {
  caption?: string;
  rows?: Array<{
    cells?: string[];
  }>;
};

type LeadValue = {
  text?: string;
};

type TableOfContentsValue = {
  items?: Array<{
    label?: string;
    anchor?: string;
  }>;
};

type CalloutValue = {
  tone?: "science" | "philosophy" | "quran" | "reflection";
  title?: string;
  body?: string;
};

type CardGridValue = {
  cards?: Array<{
    title?: string;
    body?: string;
  }>;
};

type StepListValue = {
  items?: string[];
};

type QuranVerseValue = {
  arabic?: string;
  translation?: string;
  reference?: string;
};

type SideNoteValue = {
  body?: string;
};

type SvgFigureValue = {
  alt?: string;
  svg?: string;
  caption?: string;
};

type ConclusionPanelValue = {
  eyebrow?: string;
  title?: string;
  body?: string;
  finalLine?: string;
};

type SourceListValue = {
  title?: string;
  items?: Array<{
    text?: string;
    url?: string;
  }>;
};

export function RichText({ value, className }: RichTextProps) {
  if (value.length === 0) {
    return null;
  }

  const portableTextComponents = createPortableTextComponents(
    getTableOfContentsAnchors(value),
  );

  return (
    <div
      className={cn(
        "prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-foreground",
        className,
      )}
    >
      <PortableText value={value} components={portableTextComponents} />
    </div>
  );
}

function createPortableTextComponents(
  tableOfContentsAnchors: string[],
): PortableTextComponents {
  let sectionAnchorIndex = 0;

  function getSectionId(fallback: string) {
    const anchor = tableOfContentsAnchors[sectionAnchorIndex];
    sectionAnchorIndex += 1;
    return anchor ? slugify(anchor) : fallback;
  }

  return {
    block: {
      h2: ({ children }) => (
        <h2 id={getSectionId(slugify(toText(children)))}>{children}</h2>
      ),
      h3: ({ children }) => <h3 id={slugify(toText(children))}>{children}</h3>,
      h4: ({ children }) => <h4>{children}</h4>,
      blockquote: ({ children }) => (
        <blockquote className="rounded-r-xl bg-secondary/60 px-5 py-3">
          {children}
        </blockquote>
      ),
      normal: ({ children }) => <p>{children}</p>,
    },
    list: {
      bullet: ({ children }) => <ul>{children}</ul>,
      number: ({ children }) => <ol>{children}</ol>,
    },
    marks: {
      link: ({ children, value }) => {
        const href = (value as LinkValue | undefined)?.href;

        if (!href) {
          return <>{children}</>;
        }

        const isExternal = href.startsWith("http");

        return (
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      imageBlock: ({ value }) => {
        const image = value as ImageBlockValue;

        if (!image.assetUrl) {
          return null;
        }

        return (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.assetUrl}
              alt={image.alt ?? ""}
              className="w-full rounded-xl border border-border"
              loading="lazy"
            />
            {image.caption ? (
              <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      },
      iframe: ({ value }) => {
        const iframe = value as IframeValue;

        if (!isSafeEmbedUrl(iframe.url) || !iframe.title) {
          return null;
        }

        return (
          <iframe
            src={iframe.url}
            title={iframe.title}
            className="w-full rounded-xl border border-border bg-white"
            style={{ height: iframe.height ?? 420 }}
            allow="clipboard-write; fullscreen"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        );
      },
      table: ({ value }) => {
        const table = value as TableValue;
        const rows = table.rows?.filter(
          (row) => row.cells && row.cells.length > 0,
        );

        if (!rows || rows.length === 0) {
          return null;
        }

        const [headRow, ...bodyRows] = rows;

        return (
          <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-white">
            {table.caption ? (
              <figcaption className="border-b bg-secondary/60 px-4 py-3 text-sm font-bold text-foreground">
                {table.caption}
              </figcaption>
            ) : null}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead className="bg-muted text-foreground">
                  <tr>{headRow ? renderCells(headRow.cells, "th") : null}</tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, index) => (
                    <tr key={index} className="border-t border-border">
                      {renderCells(row.cells, "td")}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>
        );
      },
      horizontalRule: () => <hr className="my-10 border-border" />,
      lead: ({ value }) => {
        const lead = value as LeadValue;

        if (!lead.text) {
          return null;
        }

        return (
          <p className="not-prose my-8 font-serif text-2xl leading-10 text-foreground md:text-3xl md:leading-[1.6]">
            {lead.text}
          </p>
        );
      },
      tableOfContents: ({ value }) => {
        const toc = value as TableOfContentsValue;
        const items = toc.items?.filter((item) => item.label);

        if (!items || items.length === 0) {
          return null;
        }

        return (
          <nav
            aria-label="Table of contents"
            className="not-prose my-10 rounded-2xl border border-border bg-white p-6 shadow-sm"
          >
            <p className="font-serif text-2xl font-bold text-foreground">
              Contents
            </p>
            <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
              {items.map((item, index) =>
                item.anchor ? (
                  <a
                    key={`${item.anchor}-${index}`}
                    href={`#${slugify(item.anchor)}`}
                    className="rounded-lg px-2 py-1 font-medium text-primary hover:bg-secondary"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    key={`${item.label}-${index}`}
                    className="px-2 py-1 text-muted-foreground"
                  >
                    {item.label}
                  </span>
                ),
              )}
            </div>
          </nav>
        );
      },
      callout: ({ value }) => {
        const callout = value as CalloutValue;

        if (!callout.title || !callout.body) {
          return null;
        }

        return (
          <aside
            className={cn(
              "not-prose my-8 rounded-2xl border p-6 leading-7",
              calloutToneClass(callout.tone),
            )}
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.18em]">
              {callout.title}
            </p>
            <p className="mt-3 text-base leading-7">{callout.body}</p>
          </aside>
        );
      },
      cardGrid: ({ value }) => {
        const grid = value as CardGridValue;
        const cards = grid.cards?.filter((card) => card.title && card.body);

        if (!cards || cards.length === 0) {
          return null;
        }

        return (
          <div className="not-prose my-8 grid gap-4 md:grid-cols-2">
            {cards.map((card, index) => (
              <article
                key={`${card.title}-${index}`}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <h3 className="font-sans text-lg font-bold text-primary">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        );
      },
      stepList: ({ value }) => {
        const stepList = value as StepListValue;
        const items = stepList.items?.filter(Boolean);

        if (!items || items.length === 0) {
          return null;
        }

        return (
          <ol className="not-prose my-8 grid gap-4">
            {items.map((item, index) => (
              <li
                key={`${index}-${item}`}
                className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="leading-7 text-muted-foreground">{item}</span>
              </li>
            ))}
          </ol>
        );
      },
      quranVerse: ({ value }) => {
        const verse = value as QuranVerseValue;

        if (!verse.translation || !verse.reference) {
          return null;
        }

        return (
          <figure className="not-prose my-8 rounded-2xl border border-teal-100 bg-white p-7 shadow-sm">
            {verse.arabic ? (
              <p
                lang="ar"
                dir="rtl"
                className="text-right font-serif text-3xl leading-[1.9] text-primary"
              >
                {verse.arabic}
              </p>
            ) : null}
            <blockquote className="mt-5 border-l-4 border-accent pl-5 font-serif text-xl leading-9 text-foreground">
              {verse.translation}
            </blockquote>
            <figcaption className="mt-4 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
              {verse.reference}
            </figcaption>
          </figure>
        );
      },
      sideNote: ({ value }) => {
        const note = value as SideNoteValue;

        if (!note.body) {
          return null;
        }

        return (
          <aside className="not-prose my-8 border-l-4 border-muted-foreground/30 pl-5 text-sm leading-7 text-muted-foreground">
            {note.body}
          </aside>
        );
      },
      svgFigure: ({ value }) => {
        const figure = value as SvgFigureValue;
        const svg = sanitizeSvg(figure.svg);

        if (!svg) {
          return null;
        }

        return (
          <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div
              aria-label={figure.alt}
              className="[&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
              role="img"
            />
            {figure.caption ? (
              <figcaption className="border-t border-border px-5 py-4 text-sm leading-6 text-muted-foreground">
                {figure.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      },
      conclusionPanel: ({ value }) => {
        const panel = value as ConclusionPanelValue;

        if (!panel.title || !panel.body) {
          return null;
        }

        return (
          <section className="not-prose my-12 rounded-3xl bg-navy p-8 text-white md:p-10">
            {panel.eyebrow ? (
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
                {panel.eyebrow}
              </p>
            ) : null}
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-white">
              {panel.title}
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/80">{panel.body}</p>
            {panel.finalLine ? (
              <p className="mt-8 font-serif text-3xl leading-snug text-white">
                {panel.finalLine}
              </p>
            ) : null}
          </section>
        );
      },
      sourceList: ({ value }) => {
        const sourceList = value as SourceListValue;
        const items = sourceList.items?.filter((item) => item.text);

        if (!sourceList.title || !items || items.length === 0) {
          return null;
        }

        return (
          <section className="not-prose my-10 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2
              id={getSectionId(slugify(sourceList.title))}
              className="font-serif text-3xl font-bold text-foreground"
            >
              {sourceList.title}
            </h2>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-muted-foreground">
              {items.map((item, index) => (
                <li key={`${item.url ?? item.text}-${index}`}>
                  {item.text}
                  {item.url ? (
                    <>
                      {" "}
                      <a href={item.url} target="_blank" rel="noreferrer">
                        Source
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        );
      },
    },
  };
}

function renderCells(cells: string[] | undefined, element: "td" | "th") {
  const Cell = element;

  return (cells ?? []).map((cell, index) => (
    <Cell key={`${element}-${index}`} className="px-4 py-3 align-top">
      {cell}
    </Cell>
  ));
}

function isSafeEmbedUrl(url: string | undefined): url is string {
  if (!url) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function calloutToneClass(tone: CalloutValue["tone"]) {
  switch (tone) {
    case "science":
      return "border-sky-200 bg-sky-50 text-sky-950 [&>p:first-child]:text-sky-700";
    case "philosophy":
      return "border-amber-200 bg-amber-50 text-amber-950 [&>p:first-child]:text-amber-700";
    case "quran":
      return "border-emerald-200 bg-emerald-50 text-emerald-950 [&>p:first-child]:text-emerald-700";
    default:
      return "border-teal-100 bg-secondary text-foreground [&>p:first-child]:text-primary";
  }
}

function sanitizeSvg(svg: string | undefined) {
  if (!svg) {
    return null;
  }

  const trimmed = svg.trim();

  if (
    !trimmed.startsWith("<svg") ||
    /<script[\s>]/i.test(trimmed) ||
    /\son[a-z]+\s*=/i.test(trimmed) ||
    /javascript:/i.test(trimmed)
  ) {
    return null;
  }

  return trimmed;
}

function toText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(toText).join("");
  }

  return "";
}

function getTableOfContentsAnchors(value: RichTextBlock[]) {
  return value.flatMap((block) => {
    if (block._type !== "tableOfContents") {
      return [];
    }

    const toc = block as TableOfContentsValue;
    return toc.items?.map((item) => item.anchor).filter(isPresent) ?? [];
  });
}

function isPresent<T>(value: T | null | undefined): value is T {
  return value != null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
