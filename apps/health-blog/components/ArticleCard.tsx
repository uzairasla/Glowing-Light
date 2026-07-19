import type { Article } from "@/content/articles";
export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  return (
    <article className={`article-card ${featured ? "featured-card" : ""}`}>
      <a
        className="card-art"
        href={`/articles/${article.slug}`}
        aria-label={`Read ${article.title}`}
      >
        <img src={article.image} alt={article.imageAlt} />
      </a>
      <div className="card-content">
        <span className="tag">{article.category}</span>
        <h3>
          <a href={`/articles/${article.slug}`}>{article.title}</a>
        </h3>
        <p>{article.description}</p>
        <div className="card-meta">
          <span>{article.readTime}</span>
          <span>{"\u2022"}</span>
          <time>{article.date}</time>
        </div>
      </div>
    </article>
  );
}
