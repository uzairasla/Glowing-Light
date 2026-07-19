import morningRhythm from "./articles/a-gentler-morning.html";
import bedtimeRoutine from "./articles/bedtime-routine-you-can-maintain.html";

export type Article = { slug:string; title:string; description:string; category:string; date:string; readTime:string; author:string; image:string; imageAlt:string; html:string };

export const articles: Article[] = [{
  slug:"a-gentler-morning",
  title:"A gentler morning: five rituals worth waking up for",
  description:"A realistic way to create a morning that steadies you—without a 5 a.m. alarm or an impossible checklist.",
  category:"Mindful living",
  date:"July 16, 2026",
  readTime:"6 min read",
  author:"The Wellbeing Edit",
  image:"/images/gentler-morning.png",
  imageAlt:"Morning sunlight falling across sage and cream linen bedding beside a cup of tea",
  html:morningRhythm,
}, {
  slug:"bedtime-routine-you-can-maintain",
  title:"How to build a bedtime routine you can maintain",
  description:"A realistic evening rhythm built around consistent cues, an earlier caffeine cutoff, and a calmer relationship with technology.",
  category:"Rest",
  date:"July 17, 2026",
  readTime:"8 min read",
  author:"The Wellbeing Edit",
  image:"/images/bedtime-routine.png",
  imageAlt:"A warmly lit bedroom at dusk with a book, tea, and a phone placed face-down",
  html:bedtimeRoutine,
}];

export function getArticle(slug:string) { return articles.find((article) => article.slug === slug); }
