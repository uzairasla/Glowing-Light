export type PortableTextSpan = {
  _key: string;
  _type: "span";
  marks?: string[];
  text: string;
};
export type PortableTextBlock = {
  _key: string;
  _type: "block";
  style?: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
  markDefs?: Array<{ _key: string; _type: "link"; href: string }>;
  children: PortableTextSpan[];
};
export type CodeBlock = {
  _key: string;
  _type: "codeBlock";
  filename?: string;
  language: string;
  tone?: "bad" | "good" | "neutral";
  code: string;
  caption?: string;
};
export type TechCallout = {
  _key: string;
  _type: "techCallout";
  tone?: "note" | "warning" | "tip";
  title: string;
  body: string;
};
export type TechBodyItem = PortableTextBlock | CodeBlock | TechCallout;
export type TechArticle = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  publishedAt?: string;
  updatedAt?: string;
  readTime?: string;
  kicker?: string;
  body: TechBodyItem[];
  taxonomies?: string[];
  sourceUrls?: Array<{ title: string; url: string }>;
  coverImageUrl?: string;
  coverImageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
};
