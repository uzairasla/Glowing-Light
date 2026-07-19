import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { articles, getArticle } from "@/content/articles";

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug:string }> }): Promise<Metadata> {
  const article = getArticle((await params).slug);
  return article ? { title:article.title, description:article.description } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug:string }> }) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  return <><SiteHeader /><main><header className="article-hero shell"><a className="back-link" href="/">← All stories</a><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p className="article-dek">{article.description}</p><div className="article-meta"><span>By {article.author}</span><time>{article.date}</time><span>{article.readTime}</span></div></header><figure className="article-image shell"><img src={article.image} alt={article.imageAlt} /></figure><div className="article-body-wrap"><article className="article-body shell" dangerouslySetInnerHTML={{ __html:article.html }} /></div></main><SiteFooter /></>;
}
