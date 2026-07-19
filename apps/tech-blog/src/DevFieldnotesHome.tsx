"use client";

import { ArrowRight, Check, ChevronRight, Clock3, Menu, X } from "lucide-react";
import { useState } from "react";

const guide = {
  category: "Sanity",
  title: "Sanity content isn\u2019t updating in Next.js",
  description:
    "Trace stale content across drafts, perspectives, the Sanity CDN, Next.js caches, and revalidation without guessing.",
  time: "18 min",
  href: "/guides/sanity-content-not-updating-nextjs",
};

export function DevFieldnotesHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Dev Fieldnotes home">
          <span className="brand-mark" aria-hidden="true">D<span>/</span>F</span>
          <span>DEV FIELDNOTES</span>
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          <a href="/guides" onClick={() => setMenuOpen(false)}>Guides</a>
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
            <a className="primary-button" href={guide.href}>Read the first guide <ArrowRight size={18} /></a>
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
            <div><span className="section-index">01 / LATEST GUIDE</span><h2>Start with the actual failure.</h2></div>
          </div>
          <div className="article-grid">
            <article className="article-card lime">
              <div className="article-visual">
                <span className="article-number">01</span>
                <div className="diagram"><span /><span /><span /></div>
                <span className="article-category">{guide.category}</span>
              </div>
              <div className="article-body">
                <div className="reading-time"><Clock3 size={14} /> {guide.time} read</div>
                <h3>{guide.title}</h3><p>{guide.description}</p>
                <a href={guide.href}>Read the field guide <ChevronRight size={16} /></a>
              </div>
            </article>
          </div>
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
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">D<span>/</span>F</span>
          <div><strong>DEV FIELDNOTES</strong><small>Tested solutions for modern web development.</small></div>
        </div>
        <div className="footer-links"><a href="/guides">Guides</a><a href="/author">Author</a></div>
        <span className="copyright">{"\u00A9"} 2026 Dev Fieldnotes</span>
      </footer>
    </div>
  );
}