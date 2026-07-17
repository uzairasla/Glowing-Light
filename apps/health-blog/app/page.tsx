import { ArticleCard } from "@/components/ArticleCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { articles } from "@/content/articles";

export default function Home() {
  const featured = articles[0]!;
  const moreArticles = articles.slice(1);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow">A gentler approach to feeling well</p>
            <h1>Small shifts.<br /><em>Real wellbeing.</em></h1>
            <p className="hero-intro">
              Thoughtful, practical guidance for moving, eating, resting, and living with more intention.
            </p>
            <a className="button" href={`/articles/${featured.slug}`}>Read the latest</a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun" />
            <div className="leaf leaf-one" />
            <div className="leaf leaf-two" />
            <div className="quote">Wellness isn’t a finish line.<br />It’s how you meet the day.</div>
          </div>
        </section>

        <section className="featured shell" aria-labelledby="featured-title">
          <div className="section-heading">
            <p className="eyebrow">Featured read</p>
            <h2 id="featured-title">Start where you are</h2>
          </div>
          <ArticleCard article={featured} featured />
        </section>

        <section className="articles shell" aria-labelledby="latest-title">
          <div className="section-heading row-heading">
            <div>
              <p className="eyebrow">Fresh perspectives</p>
              <h2 id="latest-title">Latest articles</h2>
            </div>
            <span className="count">{String(articles.length).padStart(2, "0")} stories</span>
          </div>
          <div className="article-grid">
            {moreArticles.length ? moreArticles.map((article) => <ArticleCard key={article.slug} article={article} />) : (
              <p className="empty-note">Your next stories will appear here as you add HTML files to the article collection.</p>
            )}
          </div>
        </section>

        <section className="newsletter" id="newsletter">
          <div className="shell newsletter-inner">
            <div>
              <p className="eyebrow">A note for your inbox</p>
              <h2>Wellness, without the noise.</h2>
            </div>
            <p>Occasional ideas for a calmer, healthier everyday life.</p>
            <form className="signup-form">
              <label className="sr-only" htmlFor="email">Email address</label>
              <input id="email" type="email" placeholder="Your email address" />
              <button type="submit">Join the list</button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
