import morningRhythm from "./articles/a-gentler-morning.html";

export type Article = { slug:string; title:string; description:string; category:string; date:string; readTime:string; author:string; html:string };

export const articles: Article[] = [{
  slug:"a-gentler-morning",
  title:"A gentler morning: five rituals worth waking up for",
  description:"A realistic way to create a morning that steadies you—without a 5 a.m. alarm or an impossible checklist.",
  category:"Mindful living",
  date:"July 16, 2026",
  readTime:"6 min read",
  author:"The Wellbeing Edit",
  html:morningRhythm,
}];

export function getArticle(slug:string) { return articles.find((article) => article.slug === slug); }
