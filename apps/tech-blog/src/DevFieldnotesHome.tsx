"use client";

import { ArrowRight, Check, ChevronRight, Clock3, Menu, X } from "lucide-react";
import { useState } from "react";
import type { TechArticleSummary } from "./tech-article";

export function DevFieldnotesHome({
  guides,
  hasMoreGuides,
}: {
  guides: TechArticleSummary[];
  hasMoreGuides: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const latestGuide = guides[0];
  const latestGuideHref = latestGuide ? `/guides/${latestGuide.slug}` : "/guides";

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Dev Fieldnotes home">
          <span className="brand-mark" aria-hidden="true">D<span>/</span>F</span>
          <span>DEV FIELDNOTES</span>
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          <a href="/guides" onClick={() => setMenuOpen(false)}>Guides</a>
          <a href="/kits" onClick={() => setMenuOpen(false)}>Kits</a>
          <a href="/author" onClick={() => setMenuOpen(false)}>Author</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="eyebrow"><span>Issue 001</span> Tested solutions for modern web development</div>
          <h1>Technical problems,<br /><em>made practical.</em></h1>
          <div className="hero-lower">
            <p>Detailed field guides for debugging Next.js, Sanity, deployment, caching, and the systems around them.</p>
            <a className="primary-button" href={latestGuideHref}>Read the latest guide <ArrowRight size={18} /></a>
          </div>
          <div className="hero-aside" aria-hidden="true">
            <span>REPRODUCE</span><span>TRACE</span><span>FIX</span><span>VERIFY</span>
          </div>
        </section>

        <section className="ticker" aria-label="Publication focus">
          <span>Next.js</span><span>///</span><span>Sanity</span><span>///</span><span>Production debugging</span>
        </section>

        <section className="content-section" id="guides">
          <div className="section-heading">
            <div><span className="section-index">01 / LATEST GUIDES</span><h2>Start with the actual failure.</h2></div>
          </div>
          <div className="article-grid">
            {guides.map((guide, index) => {
              const guideHref = `/guides/${guide.slug}`;

              return (
                <article className={`article-card ${index % 2 === 0 ? "lime" : "blue"}`} key={guide.slug}>
                  <a className="article-visual" href={guideHref} aria-label={`Read ${guide.title}`}>
                    {guide.coverImageUrl && <img src={guide.coverImageUrl} alt={guide.coverImageAlt || ""} />}
                    <span className="article-number">{index === 0 ? "NEW" : String(index + 1).padStart(2, "0")}</span>
                    <span className="article-category">{guide.taxonomies?.filter((taxonomy) => taxonomy !== "Guides").slice(0, 2).join(" · ")}</span>
                  </a>
                  <div className="article-body">
                    <div className="reading-time"><Clock3 size={14} /> {guide.readTime || "Guide"} read</div>
                    <h3><a href={guideHref}>{guide.title}</a></h3><p>{guide.description}</p>
                    <a href={guideHref}>Read the field guide <ChevronRight size={16} /></a>
                  </div>
                </article>
              );
            })}
          </div>
          {hasMoreGuides && (
            <div className="guides-archive-cta">
              <a className="dark-button" href="/guides?page=2">
                Read all guides <ArrowRight size={18} />
              </a>
            </div>
          )}
        </section>

        <section className="manifesto">
          <span className="section-index">02 / WHY DEV FIELDNOTES</span>
          <div className="manifesto-copy">
            <h2>Reproduce the problem.<br />Document the fix.</h2>
            <p>Dev Fieldnotes publishes focused guides built around real failure modes, tested configurations, and verification steps you can use in production.</p>
          </div>
          <div className="principles">
            <span><Check size={17} /> Tested in real workflows</span>
            <span><Check size={17} /> Written for practitioners</span>
            <span><Check size={17} /> Updated as tools change</span>
          </div>
        </section>
        <section className="template-section">
          <div className="template-intro">
            <span className="section-index">03 / DEVELOPER KITS</span>
            <h2>Field-tested foundations,<br />ready to build on.</h2>
            <p>Focused starter kits built from real implementation work—tested, documented, and designed to skip the fragile first draft.</p>
            <a className="dark-button" href="/kits">Explore the kits <ArrowRight size={18} /></a>
          </div>
          <div className="template-list">
            {[["DISCOVER", "Inspect your schema", "Development-only metadata discovery"], ["APPROVE", "Choose the exact surface", "Entities, operations, fields, and limits"], ["GENERATE", "Ship typed MCP tools", "Validated output with runtime guardrails"]].map(([label, title, copy], index) => (
              <div className="template-card" key={label}>
                <span className="template-icon">{String(index + 1).padStart(2, "0")}</span>
                <div className="template-copy"><span>{label}</span><h3>{title}</h3><p>{copy}</p></div>
                <ChevronRight size={19} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">D<span>/</span>F</span>
          <div><strong>DEV FIELDNOTES</strong><small>Tested solutions for modern web development.</small></div>
        </div>
        <div className="footer-links"><a href="/guides">Guides</a><a href="/kits">Kits</a><a href="/author">Author</a></div>
        <span className="copyright">{"\u00A9"} 2026 Dev Fieldnotes</span>
      </footer>
    </div>
  );
}
